const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 个人中心
 */
exports.main = async(event, context) => {
  let info = null;
  const uid = event.uid

  await db.collection('USER')
    .aggregate()
    .match({
      _id: uid
    })
    .lookup({
      from: 'FOLLOW',
      localField: '_id',
      foreignField: 'subid',
      as: 'fanss',
    })
    .lookup({
      from: 'FOLLOW',
      localField: '_id',
      foreignField: 'uid',
      as: 'follows',
    })
    .lookup({
      from: 'COMMENT',
      localField: '_id',
      foreignField: 'subid',
      as: 'comment',
    })
    .lookup({
      from: 'CONSUME',
      localField: '_id',
      foreignField: 'uid',
      as: 'consume',
    })
    .end()
    .then(res => {
      info = res.list[0];
    })


  info.fans = info.fanss.length
  info.follow = info.follows.length
  info.isFollow = false
  for (const item of info.fanss) {
    if (item.uid == uid) {
      info.isFollow = true;
      break;
    }
  }


  const notc = info.comment.filter(item => !item.seemsg)
  info.notMsg = notc.length

  delete info.fanss
  delete info.follows
  delete info.comment


  return info
}