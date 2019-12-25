const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/**
 * 获取首页帖子
 */
exports.main = async(event, context) => {
  const postType = event.postType;
  const uid = event.uid;
  const limit = event.limit;
  const where = postType == 1 ? {} : {
    type: postType
  }
  let details = []

  /** 获取帖子 全部 */
  await db.collection('POST')
    .aggregate()
    .match(where)
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
      from: 'COMMENT',
      localField: '_id',
      foreignField: 'post_id',
      as: 'comments',
    })
    .end()
    .then(res => {
      details = res.list
    })

  for (const item of details) {
    item.isPraise = false;
    item.user = item.user[0]
    item.praise = item.praises.length;
    item.comment = item.comments.length;
    /** 判断是否点赞 */
    for (const p of item.praises) {
      if (uid == p.uid) {
        item.isPraise = true;
        break;
      }
    }

    delete item.praises
    delete item.comments
  }

  details = details.sort((obj1, obj2) => {
    const item1 = obj1.create_time;
    const item2 = obj2.create_time;
    if (item1 < item2) {
      return 1;
    } else if (item1 > item2) {
      return -1;
    } else {
      return 0;
    }
  })

  return details
}