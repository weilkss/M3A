const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 获取在线参数
 */
exports.main = async(event, context) => {
  let dev = false;
  await db.collection('PARAMS').get().then(res => {
    dev = res.data[0].dev;
  })

  return dev
}