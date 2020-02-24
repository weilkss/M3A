import utils from '../../utils/utils.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailId: '',
    detail: null,
    comments: [],
    recommends: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.showNavigationBarLoading()
    await this.getDetailById(options.detailId)
    await this.getRecommend()
    await this.getComments(options.detailId)
    wx.hideNavigationBarLoading()
  },
  /**
   * 获取详情
   */
  async getDetailById(detailId) {
    let detail = this.data.detail;
    const uid = wx.getStorageSync('uid') || 0

    await wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        uid,
        detailId
      }
    }).then(res => {
      detail = res.result
      detail.createTime = utils.dateFormater('YYYY-MM-DD hh:mm:ss', detail.create_time)
    })

    this.setData({
      detail,
      detailId
    })
  },
  /**
   * 获取留言
   */
  async getComments(detail_id) {
    await wx.cloud.callFunction({
      name: 'getComment',
      data: {
        detail_id
      }
    }).then(res => {
      for (const item of res.result) {
        item.createTime = utils.dateFormater('YYYY-MM-DD hh:mm:ss', item.create_time)
      }
      this.setData({
        comments: res.result
      })
    })
  },
  /**
   * 获取推荐
   */
  async getRecommend() {
    wx.cloud.callFunction({
      name: 'getRecommend'
    }).then(res => {
      this.setData({
        recommends: res.result
      })
    })
  },
  /**
   * 点击预览图片
   */
  handleImage(e) {
    const imgs = this.data.detail.imgs;
    const urls = [];
    for (const item of imgs) {
      urls.push(item.url)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls
    })
  },
  /**
   * 查看位置
   */
  handleSeeAddress() {
    wx.openLocation({
      latitude: this.data.detail.address.lat,
      longitude: this.data.detail.address.lot,
      scale: 18
    })
  },

  /**
   * 点击回复评论
   */
  handleReply(e) {
    if (!wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
      return;
    }

    this.selectComponent('#commentBottom').handleOpenInput(e, e.currentTarget.dataset.reply)
  },
  /**
   * 发表成功回调
   */
  handleSend() {
    this.getComments(this.data.detailId)
  },
  /**
   * 点击关注
   * 取消关注
   */
  handleFollow() {
    const detail = this.data.detail
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
        subid: detail.uid
      }
    }).then(res => {
      detail.isFollow = res.result
      this.setData({
        detail
      })
      wx.showToast({
        title: detail.isFollow ? '已关注' : '取消关注',
        icon: "none"
      })
    })
  },
  /**
   * 点击推荐跳转
   */
  async handleToDetail(e) {
    const index = e.currentTarget.dataset.index;
    const recommends = this.data.recommends
    let path = '';
    switch (recommends[index].type) {
      case 2:
        path = '/pages/detail/post';
        break;
      case 3:
        path = '/pages/detail/video';
        break;
      case 4:
        path = '/pages/detail/activity';
        break;
      case 5:
        path = '/pages/detail/answers';
        break;
      default:
        path = '';
    }

    if (path) {
      wx.redirectTo({
        url: path + '?detailId=' + recommends[index]._id
      })
    } else {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
      await this.getDetailById(recommends[index]._id)
      await this.getRecommend()
      await this.getComments(recommends[index]._id)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.detail.title,
      path: '/pages/detail/photo?detailId=' + this.data.detail._id,
      imageUrl: this.data.detail.cover
    }
  }
})