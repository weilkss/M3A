Page({

  data: {
    formid: ''
  },

  onLoad(options) {

  },

  getFormid(e) {
    console.log(e)
    this.setData({
      formid: e.detail.formId
    })
  },

  sendMsg() {
    wx.cloud.callFunction({
      name: 'message',
      data: {
        formid: this.data.formid
      },
      success(res) {
        console.log('success:', res)
      },
      fail(res) {
        console.log('fail:', res)
      }
    })
  }
})