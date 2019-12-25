const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/**
 * 获取我的关注
 */
exports.main = async(event, context) => {
  let follows = []
  const uid = event.uid
  await db.collection('FOLLOW')
    .aggregate()
    .match({
      uid: uid
    })
    .lookup({
      from: 'USER',
      localField: 'subid',
      foreignField: '_id',
      as: 'user',
    })
    .lookup({
      from: 'POST',
      localField: 'subid',
      foreignField: 'uid',
      as: 'posts',
    })
    .lookup({
      from: 'FOLLOW',
      localField: 'subid',
      foreignField: 'subid',
      as: 'fanss',
    })
    .end()
    .then(res => {
      follows = res.list;
    })

  for (const item of follows) {
    item.isFollow = false;
    item.user = item.user[0]
    item.post = item.posts.length
    item.fans = item.fanss.length
    if (item.uid == uid) {
      item.isFollow = true;
    }
    delete item.posts
    delete item.fanss
  }

  return follows
}