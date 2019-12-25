const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

exports.main = async(event, context) => {
  let consumes = null;
  let priceTotal = 0;
  let total = 0;

  await db.collection('CONSUME').where({
    uid: event.uid
  }).orderBy('date', 'desc').get().then(res => {
    consumes = res.data
  })

  for (const item of consumes) {
    priceTotal += item.price
  }

  total = consumes.length

  return {
    total,
    consumes,
    priceTotal
  }
}