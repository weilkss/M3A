const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 添加车辆信息
 */

exports.main = async(event, context) => {
  await db.collection('USER').doc(event.uid).update({
    data: {
      code: event.code,
      car_code: event.car_code,
      car_color: event.car_color,
      car_mode: event.car_mode,
      car_pail: event.car_pail
    }
  })

  return event.car_code
}