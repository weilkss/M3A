const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 获取车友
 */
exports.main = async(event, context) => {
  let friends = [];
  const uid = event.uid
  /**
   * 获取所有
   */
  await db.collection('USER')
    .aggregate()
    .lookup({
      from: 'POST',
      localField: '_id',
      foreignField: 'uid',
      as: 'posts',
    })
    .lookup({
      from: 'FOLLOW',
      localField: '_id',
      foreignField: 'subid',
      as: 'fanss',
    })
    .end()
    .then(res => {
      friends = res.list;
    })

  for (const item of friends) {
    item.post = item.posts.length
    item.fans = item.fanss.length
    item.isFollow = false
    for (const f of item.fanss) {
      if (f.uid == uid) {
        item.isFollow = true;
        break;
      }
    }
    delete item.posts
    delete item.fanss
  }

  return {
    friends,
    presidents: friends.filter(item => item.type == 1),
    vicePresident: friends.filter(item => item.type == 2),
  }
}