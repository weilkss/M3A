const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 *  获取车友相册
 */
exports.main = async(event, context) => {
  let album = null;

  await db.collection('POST')
    .aggregate()
    .match({
      type: 6
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
    .end()
    .then(res => {
      album = res.list;
    })

  for (const item of album) {
    item.user = item.user[0]
    item.praise = item.praises.length
    delete item.praises
  }

  album = album.sort((obj1, obj2) => {
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

  return album
}