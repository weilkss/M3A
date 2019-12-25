const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

/**
 * 获取， 个人中心 贴图
 */
exports.main = async(event, context) => {
  let lists = []
  const type = event.type;
  const uid = event.uid;

  await db.collection('POST')
    .aggregate()
    .match({
      uid,
      type
    })
    .end()
    .then(res => {
      lists = res.list;
    })

  lists = lists.sort((obj1, obj2) => {
    const item1 = obj1.create_time;
    const item2 = obj2.create_time;
    if (item1 < item2) {
      return 1;
    } else if (item1 > item2) {
      return -1;
    } else {
      return 0;
    }
  })

  return lists
}