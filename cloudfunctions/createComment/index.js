const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 评论
 */
exports.main = async(event, context) => {
  let userInfo = null;
  let code = null;
  const uid = event.uid;
  const _ = db.command

  const replyid = event.params.replyid;
  const postid = event.params.post_id

  if (replyid) {
    await db.collection('COMMENT').where({
      _id: replyid
    }).get().then(res => {
      if (res.data.length) {
        event.params.subid = res.data[0].uid
      }
    })
  }

  await db.collection('USER').doc(uid).get().then(res => {
    userInfo = res.data
  })

  await db.collection('COMMENT').add({
    data: {
      ...event.params,
      user_avatar: userInfo.avatarUrl,
      uid: userInfo._id,
      user_name: userInfo.name,
      seemsg: 0,
      status: 1,
    }
  }).then(res => {
    code = res.errMsg;
  })

  /** 评论成功 */
  await db.collection('POST').doc(postid).update({
    data: {
      comment: _.inc(1)
    }
  })

  return code
}