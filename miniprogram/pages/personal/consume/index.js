import utils from '../../../utils/utils.js'
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: 0,
    width: 0,
    offsetLeft: 0,
    translateX: 0,
    tabs: ['添加', '历史记录'],
    date: utils.dateFormater('YYYY-MM-DD', new Date().getTime()),
    price: null,
    address: null,
    total: 0,
    priceTotal: 0,
    consumes: null
  },
  onLoad() {
    this.getConsume()
  },
  onShow() {
    const location = chooseLocation.getLocation();
    if (location) {
      this.setData({
        address: {
          name: location.name,
          lat: location.latitude,
          lot: location.longitude
        }
      })
    }
  },
  onReady() {
    wx.createSelectorQuery().select('.tab-item').boundingClientRect(rect => {
      this.setData({
        width: rect.width,
        offsetLeft: rect.width * this.data.tabindex
      })
    }).exec();
  },
  handleTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      translateX: index ? -50 : 0,
      tabindex: index,
      offsetLeft: e.currentTarget.offsetLeft
    })
  },
  getConsume() {
    wx.cloud.callFunction({
      name: 'getConsume',
      data: {
        uid: wx.getStorageSync('uid')
      }
    }).then(res => {
      for (const item of res.result.consumes) {
        item.date = utils.dateFormater('YYYY-MM-DD', item.date)
      }

      this.setData({
        consumes: res.result.consumes,
        total: res.result.total,
        priceTotal: res.result.priceTotal,
      })
    })
  },
  /**
   * 日期选择
   */
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 金额
   */
  handleInput(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 加油站
   */
  handleOpenLotion() {
    const key = 'BCKBZ-MT5KJ-Q6BFL-K5VRG-NP6C6-4CFDJ';
    const referer = 'MazdaAxela';
    const category = '生活服务,娱乐休闲';
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const location = JSON.stringify({
          latitude: res.latitude,
          longitude: res.longitude
        });
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category' + category
        });
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  /**
   * 添加加油记录
   */
  handleSubmit() {
    const date = this.data.date
    const price = this.data.price
    const address = this.data.address

    if (!date) {
      return wx.showToast({
        title: '请选择加油日期',
        icon: 'none'
      })
    }
    if (!price) {
      return wx.showToast({
        title: '请输入加油金额',
        icon: 'none'
      })
    }
    if (!address) {
      return wx.showToast({
        title: '请选择加油站',
        icon: 'none'
      })
    }

    wx.cloud.callFunction({
      name: 'createConsume',
      data: {
        params: {
          uid: wx.getStorageSync('uid'),
          date: new Date(date).getTime(),
          price: Number(price),
          address,
          create_time: new Date().getTime()
        }
      }
    }).then(res => {
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })
      this.getConsume()
      this.setData({
        date: null,
        price: null,
        address: null
      })
    })
  },
  /**
   * 查看位置
   */
  handleSeeAddress(e) {
    const index = e.currentTarget.dataset.index
    wx.openLocation({
      latitude: this.data.consumes[index].address.lat,
      longitude: this.data.consumes[index].address.lot,
      name: this.data.consumes[index].address.name,
      scale: 18
    })
  },
})