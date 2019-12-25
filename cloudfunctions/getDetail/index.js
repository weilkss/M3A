const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 获取详情
 */
exports.main = async(event, context) => {
  let detail = null;
  const detailId = event.detailId
  const uid = event.uid

  await db.collection('POST')
    .aggregate()
    .match({
      _id: detailId
    })
    .lookup({
      from: 'USER',
      localField: 'uid',
      foreignField: '_id',
      as: 'user',
    })
    .lookup({
      from: 'PRAISE',
      localField: '_id',
      foreignField: 'subid',
      as: 'praises',
    })
    .lookup({
      from: 'FOLLOW',
      localField: 'uid',
      foreignField: 'subid',
      as: 'follows',
    })
    .end()
    .then(res => {
      detail = res.list[0]
    })

  detail.user = detail.user[0]
  detail.praise = detail.praises.length;
  detail.isPraise = false;
  detail.isFollow = false;

  /** 判断是否点赞 */
  for (const item of detail.praises) {
    if (uid == item.uid) {
      detail.isPraise = true;
      break;
    }
  }

  /** 判断是否关注 */
  for (const item of detail.follows) {
    if (uid == item.uid) {
      detail.isFollow = true;
      break;
    }
  }

  delete detail.praises
  delete detail.follows

  return detail
}