const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/**
 * 关注和取消关注
 */
exports.main = async(event, context) => {
  let follow = []
  let isFollow = false;
  const uid = event.uid
  const subid = event.subid

  /** 查询是否已经关注 */
  await db.collection('FOLLOW').where({
    subid,
    uid
  }).get().then(res => {
    follow = res.data
  })

  if (follow.length) {
    await db.collection('FOLLOW').doc(follow[0]._id).remove()
  } else {
    isFollow = true;
    await db.collection('FOLLOW').add({
      data: {
        subid,
        uid
      }
    })
  }

  return isFollow
}