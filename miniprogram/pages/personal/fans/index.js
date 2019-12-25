Page({
  /**
   * 页面的初始数据
   */
  data: {
    fans: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: 'getPersonalFans',
      data: {
        uid: wx.getStorageSync('uid')
      }
    }).then(res => {
      this.setData({
        fans: res.result
      })
      wx.hideNavigationBarLoading()
    })
  },
  /**
   * 点击关注
   * 取消关注
   */
  async handleFollow(e) {
    const fans = this.data.fans;
    const id = e.currentTarget.dataset.id;
    const uid = wx.getStorageSync('uid') || 0;

    wx.cloud.callFunction({
      name: 'follow',
      data: {
        uid,
        subid: id
      }
    }).then(res => {
      for (const item of fans) {
        if (item._id == id) {
          item.isFollow = res.isFollow;
          break;
        }
      }

      this.setData({
        fans
      })

      wx.showToast({
        title: res.result ? '已关注' : '取消关注',
        icon: 'none'
      })
    })
  }
})