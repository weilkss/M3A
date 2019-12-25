const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 登录接口
 */
exports.main = async(event, context) => {
  const userInfo = event.userInfo;
  const openid = cloud.getWXContext().OPENID

  const data = {
    name: userInfo.nickName,
    gender: userInfo.gender,
    avatarUrl: userInfo.avatarUrl,
    country: userInfo.country,
    province: userInfo.province,
    city: userInfo.city
  }

  let uid = '';

  /** 获取是否有注册过 */
  const oldResult = await db.collection('USER').where({
    _id: openid
  }).get()

  if (oldResult.data.length) {
    await db.collection('USER').doc(oldResult.data[0]._id).update({
      data
    }).then(res => uid = oldResult.data[0]._id)
  } else {
    await db.collection('USER').add({
      data: {
        ...data,
        _id: openid,
        type: 3,
        code: '',
        car_code: '',
        car_color: '',
        car_pail: '',
        car_mode: '',
        create_time: event.create_time
      }
    }).then(res => uid = res._id)
  }

  return uid
}