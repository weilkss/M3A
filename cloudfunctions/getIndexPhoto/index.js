const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 获取首页的相册相关
 */
exports.main = async(event, context) => {
  let album = []
  let albumTotal = 0;
  const uid = event.uid;

  /** 获取相册人数 */
  await db.collection('POST').where({
    type: 6
  }).count().then(res => {
    albumTotal = res.total
  })

  /** 获取6个相册 */
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
      album = res.list
    })

  for (const item of album) {
    item.user = item.user[0]
    item.praise = item.praises.length;
    item.isPraise = false;
    /** 判断是否点赞 */
    for (const p of item.praises) {
      if (uid == p.uid) {
        item.isPraise = true;
        break;
      }
    }
    delete item.praises
  }

  const sortAlbum = album.sort((obj1, obj2) => {
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

  return {
    album: sortAlbum.slice(0, 6),
    albumTotal
  }
}