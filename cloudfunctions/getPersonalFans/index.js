const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/**
 * 获取我的粉丝
 */
exports.main = async(event, context) => {
  let fans = null
  const uid = event.uid;

  await db.collection('FOLLOW')
    .aggregate()
    .match({
      subid: uid
    })
    .lookup({
      from: 'USER',
      localField: 'uid',
      foreignField: '_id',
      as: 'user',
    })
    .lookup({
      from: 'POST',
      localField: 'uid',
      foreignField: 'uid',
      as: 'posts',
    })
    .lookup({
      from: 'FOLLOW',
      localField: 'uid',
      foreignField: 'subid',
      as: 'fanss',
    })
    .end()
    .then(res => {
      fans = res.list;
    })

  for (const item of fans) {
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

  return fans
}