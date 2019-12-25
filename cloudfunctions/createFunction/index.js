const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 发布
 */
exports.main = async(event, context) => {
  let status = null;
  let uid = event.uid;
  let user = null;
  delete event.userInfo;

  await db.collection('POST').add({
    data: {
      ...event,
      comment: 0,
      status: 1
    }
  }).then(res => {
    status = res
  })

  return status
}