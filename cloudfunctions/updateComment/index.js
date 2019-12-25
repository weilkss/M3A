const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 标记回复全部已读
 */
exports.main = async(event, context) => {
  const uid = event.uid
  try {
    return await db.collection('COMMENT').where({
      subid: uid
    }).update({
      data: {
        seemsg: 1
      },
    })
  } catch (e) {
    console.error(e)
  }
}