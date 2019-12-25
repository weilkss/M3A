const db = wx.cloud.database()
import Toast from '../../components/toast/toast.js'
import utils from '../../utils/utils.js'
Page({
  data: {
    backurl: ''
  },
  onLoad(option) {
    const backurl = option.backurl
    let params = option;
    let arr = []
    delete params.backurl
    this.setData({
      backurl,
      params: utils.pars(params)
    })
    new Toast();
  },

  async getuserinfo(e) {
    let uid = '';
    if (e.detail.errMsg != 'getUserInfo:ok') {
      return false;
    }
    this.showLoading('登录中...')

    await wx.cloud.callFunction({
      name: 'login',
      data: {
        create_time: new Date().getTime(),
        userInfo: e.detail.userInfo,
      }
    }).then(res => {
      uid = res.result
    })

    wx.setStorageSync('uid', uid)
    this.hideLoading()
    if (this.data.backurl) {
      wx.redirectTo({
        url: this.data.backurl + '?' + this.data.params,
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
})