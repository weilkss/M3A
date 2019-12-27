# 马自达 3 昂克赛拉 Mazda 3 Axela\* 车友会 微信小程序 云开发版

这是微信小程序云开发版本，使用了云数据库、云储存、云函数。车友会属于四川`Axela`车友会，平时车友可以在小程序上发布文章，发布图片以及发布短视频，还可以记录加油次数和金额，以便于有个统计，后期会继续开发发布活动，问答等一些类型，这样方便车友会管理员发布活动所有车友都能收到微信服务通知，以便更快的通知到每个车友。

## 小程序二维码

![avatar](/code.jpg)

## 注意：

- 小程序图文可以原创，也鼓励转载，但是转载要标明出处，小程序开发者不参与任何法律规则，如有触及，一切由发布人承担。；

- 小程序在使用过程中如果遇到问题出现或者有 BUG 请联系开发者，邮箱 `cdsm3a@163.com`；

- 小程序不作用于任何商业用途；

- 欢迎任何车主和游客注册使用；

# 云开发

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

# 其他账号参数

注册邮箱：cdsm3a@163.com/m3a123456

小程序账号：cdsm3a@163.com/m3a123456

网易敏感词：cdsm3a@163.com/a123456

腾讯地图 ：https://lbs.qq.com/dev/console/key/manage `key : 'BCKBZ-MT5KJ-Q6BFL-K5VRG-NP6C6-4CFDJ'`

# API 文档

## 评论数据接口 API `COMMENT`

```js
  _id: '72527ac65e031c1806ddc9dd7adf816b',         // ID
  post_id: 'e8f863ba5de8a87e008464507b5b3f0e',     // 帖子详情ID
  content: '喜欢',                                 // 评论内容
  create_time: 1575528516687,                      // 评论时间
  replyid: 'b08c019ab9ec44fabdf062e2cc04d277',     // 评论主体ID
  seemsg: 0,                                       // 是否阅读
  status: 1,                                       // 是否显示
  user_avatar: 'https://dd...ddd.png',             // 用户头像
  uid: 'dbff9fc75de866b400734e7a0e5fb4a7',         // 用户ID
  user_name: '铁甲虾堡'                             // 用户昵称
  subid: 'oIZWX5IPwOnJyk7CFmGEUw7-nMVA'            // 主体关联用户ID
```

## 加油记录接口 API `CONSUME`

```js
  _id: '72527ac65e031c1806ddc9dd7adf816b',         // ID
  address:{
    lat: 30.15145,                                 // 经度
    lot: 104.21565,                                // 维度
    name: '成华区北湖国际城2期·澜悦(湖景四路东)',     // 加油站名称
  },
  create_time: 1575528516687,                       // 创建时间
  date: 1575528516687,                              // 加油时间
  price: 200                                        // 加油价格
  uid: 'dbff9fc75de866b400734e7a0e5fb4a7',          // 用户ID
```

## 关注和粉丝接口 API `FOLLOW`

```js
  _id: '01ace4015dfc9e43053b8ce754ae577e',          // ID
  subid: 'oIZWX5FFVAngMzsfJJVBLEmBvKew',            // 被关注人的ID
  uid: 'oIZWX5FFVAngMzsfJJVBLEmBvKew',              // 关注人的ID
```

## 点赞接口 API `PRAISE`

```js
  _id: '01ace4015dfc9e43053b8ce754ae577e',          // ID
  subid: 'oIZWX5FFVAngMzsfJJVBLEmBvKew',            // 图贴的id
  uid: 'oIZWX5FFVAngMzsfJJVBLEmBvKew',              // 点赞人的ID
```

## 图片帖子视频 API `POST`

```js
  _id: '01ace4015dfc9e43053b8ce754ae577e',          // ID
  address: {
    lat: 30.15145,                                  // 经度
    lot: 104.21565,                                 // 维度
    name: '成华区北湖国际城2期·澜悦(湖景四路东)',      // 加油站名称
  },
  cover: 'cloud://..../1577179022000.jpg'           // 封面
  create_time: 1575528516687,                       // 创建时间
  des: '我好喜欢...你',                              // 内容
  imgType: '篮球'                                   // 图片类型
  imgs: [
    {
      describe: '这个投篮姿势很帅',                  // 图片介绍
      url: 'cloud://..../1577179022000.jpg'         // 图片地址
    }
  ],
  status: 1,                                        // 是否显示
  title: 'M3A*第八场篮球友谊赛 双流运动公园',         // 标题
  type: 6,                                          // 类型
  typeName: '图片',                                 // 类型名称
  uid: 'oIZWX5FFVAngMzsfJJVBLEmBvKew',              // 用户的ID
  video: {
    url: 'cloud://...979000.mp4'                    // 视频地址
    cover: 'cloud://..../1577179022000.jpg',        // 视频封面
    duration: 6565.33,                              // 视频时长
    width: 1920,                                    // 视频宽度
    height: 1080,                                   // 视频高度
  }
```

## 用户接口 API `USER`

```js
  _id: '01ace4015dfc9e43053b8ce754ae577e',          // ID
  avatarUrl: 'https://wx.qlogo.cn/...faA/132',      // 头像
  car_code: '川A4YC21',                             // 车牌号
  car_color: '珍珠白',                              // 车身颜色
  car_mode: '三厢',                                 // 车规格
  car_pail: '2.0 L',                                // 排量
  city: '巴中',                                     // 城市
  country: '中国',                                  // 国家
  create_time: 1576812708089,                       // 注册时间
  gender: 1,                                        // 性别
  name: '铁甲虾堡',                                  // 名字
  province: '四川',                                 // 省份
  type: 3                                           // 类型
```

## 图贴类型

| ID  | 类型 | 是否开发 |
| --- | ---- | -------- |
| 1   | 全部 | 是       |
| 2   | 帖子 | 是       |
| 3   | 视频 | 是       |
| 4   | 活动 | 否       |
| 5   | 问答 | 否       |
| 6   | 图片 | 是       |

## 文件夹介绍

|- cloudfunctions 云函数

|- miniprogram 小程序源码
