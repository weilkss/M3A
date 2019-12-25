const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/**
 * 获取留言
 */
exports.main = async(event, context) => {
  let comments = []
  const detail_id = event.detail_id;
  await db.collection('COMMENT')
    .aggregate()
    .match({
      post_id: detail_id
    })
    .lookup({
      from: 'COMMENT',
      localField: 'replyid',
      foreignField: '_id',
      as: 'replys',
    })
    .end()
    .then(res => {
      comments = res.list
    })

  for (const item of comments) {
    if (item.replyid){
      item.reply_name = item.replys[0].user_name
      item.reply_content = item.replys[0].content
      delete item.replys
    }
  }

  return comments
}