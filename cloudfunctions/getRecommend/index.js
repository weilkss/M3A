const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 获取推荐
 */
exports.main = async(event, context) => {
  let recommends = []

  await db.collection('POST').aggregate().sample({
    size: 4
  }).end().then(res => {
    recommends = res.list
  })

  return recommends
}