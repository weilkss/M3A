const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/** * 我的回复
 */
exports.main = async(event, context) => {
  let replys = null;
  const uid = event.uid;

  await db.collection('COMMENT')
    .aggregate()
    .match({
      subid: uid
    })
    .lookup({
      from: 'POST',
      localField: 'post_id',
      foreignField: '_id',
      as: 'post',
    })
    .lookup({
      from: 'COMMENT',
      localField: 'replyid',
      foreignField: '_id',
      as: 'commmm',
    })
    .end()
    .then(res => {
      replys = res.list;
    })

  for (const item of replys) {
    item.type = item.post[0].type;
    item.post_title = item.post[0].title;
    if (item.commmm.length) {
      item.reply_content = item.commmm[0].content
    }
    delete item.post
    delete item.commmm
  }

  replys = replys.sort((obj1, obj2) => {
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

  return replys
}