const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 加油记录
 */
exports.main = async(event, context) => {
  try {
    return await db.collection('CONSUME').add({
      data: {
        ...event.params
      }
    })
  } catch (e) {
    console.error(e)
  }
}