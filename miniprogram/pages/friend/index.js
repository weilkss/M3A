Page({
  /**
   * 页面的初始数据
   */
  data: {
    /**
     * type 1-会长 2-副会长 3-普通成员
     */
    friends: [],
    presidents: [],
    vicePresident: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    wx.showNavigationBarLoading()
    await this.getFriend()
    wx.hideNavigationBarLoading();
  },
  /**
   * getFriend
   */
  getFriend() {
    let friends = [];

    wx.cloud.callFunction({
      name: 'getFriend',
      data: {
        uid: wx.getStorageSync('uid') || 0
      }
    }).then(res => {
      this.setData({
        friends: res.result.friends,
        presidents: res.result.presidents,
        vicePresident: res.result.vicePresident,
      })
    })
  },

  /**
   * 点击关注
   * 取消关注
   */
  handleFollow(e) {
    const friends = this.data.friends;
    const id = e.currentTarget.dataset.id;
    const uid = wx.getStorageSync('uid') || 0;

    if (!uid) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
      return;
    }

    wx.cloud.callFunction({
      name: 'follow',
      data: {
        uid,
        subid: id
      }
    }).then(res => {
      this.getFriend()

      wx.showToast({
        title: res.result ? '已关注' : '取消关注',
        icon: 'none'
      })
    })
  }
})