import utils from '../../../utils/utils.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabindex: 0,
    width: 0,
    lists: [],
    postLoading: true,
    offsetLeft: 0,
    listTotal: 0,
    tabs: ['帖子', '图片', '视频']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      tabindex: Number(options.index)
    })
    this.getLists();
  },
  onReady() {
    wx.createSelectorQuery().select('.tab-item').boundingClientRect(rect => {
      this.setData({
        width: rect.width,
        offsetLeft: rect.width * this.data.tabindex
      })
    }).exec();
  },
  getLists() {
    const tabindex = this.data.tabindex
    wx.cloud.callFunction({
      name: 'getPersonalPost',
      data: {
        type: tabindex == 0 ? 2 : tabindex == 1 ? 6 : tabindex == 2 ? 3 : 4,
        uid: wx.getStorageSync('uid')
      }
    }).then(res => {
      for (const item of res.result) {
        item.createTime = utils.dateFormater('YYYY-MM-DD hh:mm:ss', item.create_time)
      }

      this.setData({
        postLoading: false,
        lists: res.result
      })
    })
  },
  handleTab(e) {
    this.setData({
      lists: [],
      postLoading: true,
      tabindex: e.currentTarget.dataset.index,
      offsetLeft: e.currentTarget.offsetLeft
    }, () => {
      this.getLists()
    })
  },
  toDetail(e) {
    const lists = this.data.lists
    const index = e.currentTarget.dataset.index
    let path = '';
    switch (lists[index].type) {
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
        path = '/pages/detail/photo';
    }

    wx.navigateTo({
      url: path + '?detailId=' + lists[index]._id
    })
  }
})