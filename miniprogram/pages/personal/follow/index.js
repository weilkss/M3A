Page({
  /**
   * 页面的初始数据
   */
  data: {
    follows: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: 'getPersonalFollow',
      data: {
        uid: wx.getStorageSync('uid')
      }
    }).then(res => {
      this.setData({
        follows: res.result
      })
      wx.hideNavigationBarLoading()
    })
  },
  /**
   * 点击关注
   * 取消关注
   */
  async handleFollow(e) {
    const follows = this.data.follows;
    const id = e.currentTarget.dataset.id;
    const uid = wx.getStorageSync('uid') || 0;

    wx.cloud.callFunction({
      name: 'follow',
      data: {
        uid,
        subid: id
      }
    }).then(async res => {
      for (const item of follows) {
        if (item._id == id) {
          item.isFollow = res.isFollow;
          break;
        }
      }
      this.setData({
        follows
      })
      wx.showToast({
        title: res.result.isFollow ? '已关注' : '取消关注',
        icon: 'none'
      })
    })
  }
})