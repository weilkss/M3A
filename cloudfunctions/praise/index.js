const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 点赞和取消点赞
 */
exports.main = async(event, context) => {
  let praises = []
  let isPraise = false;
  let praise = 0;
  const uid = event.uid || cloud.getWXContext().OPENID
  const subid = event.subid

  /** 查询是否已经点赞 */
  if (uid) {
    await db.collection('PRAISE').where({
      uid,
      subid
    }).get().then(res => {
      praises = res.data
    })
  }

  if (praises.length) {
    await db.collection('PRAISE').doc(praises[0]._id).remove()
  } else {
    isPraise = true;
    await db.collection('PRAISE').add({
      data: {
        uid,
        subid
      }
    })
  }

  await db.collection('PRAISE').where({
    subid
  }).count().then(res => {
    praise = res.total
  })

  return {
    praise,
    isPraise
  }
}