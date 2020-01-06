import datas from '../../utils/datas.js'
import utils from '../../utils/utils.js'
import Toast from '../../components/toast/toast.js'
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dev: false,
    userTotal: 0,
    album: [{}, {}, {}],
    albumTotal: 0,
    newUsers: [],
    tabs: datas.tabsProd,
    tabFixed: false,
    tabIndex: 0,
    detailend: false,
    details: [],
    postLoading: false,
    screenPanel: false,
    scrollTop: 0,
    tabHeight: 0,
    screenIndex: 0,
    screenLists: datas.screenLists,
    moveParams: {
      scrollLeft: 0
    }
  },
  onLoad() {
    new Toast()
    this.setData({
      detailend: true
    })
  },
  async onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

    let dev = false;
    wx.showNavigationBarLoading()

    await wx.cloud.callFunction({
      name: 'getParams'
    }).then(res => {
      dev = res.result
      this.setData({
        dev
      })
    })

    setTimeout(() => {
      /** 获取顶部封面的额高度 */
      wx.createSelectorQuery().select('.panel').boundingClientRect(rect => {
        this.setData({
          scrollTop: rect.height
        })
      }).exec();
    }, 100)

    this.setData({
      tabs: dev ? datas.tabs : datas.tabsProd
    })

    if (dev) {
      /** 获取车友 */
      await this.getCarFriend()
      /** 获取相册 */
      await wx.cloud.callFunction({
        name: 'getIndexPhoto',
        data: {
          uid: wx.getStorageSync('uid') || 0
        }
      }).then(res => this.setData({
        album: res.result.album,
        albumTotal: res.result.albumTotal
      }))
    }

    await this.getPost()

    wx.hideNavigationBarLoading()
  },
  /** 
   * 获取车友信息
   */
  async getCarFriend() {
    /** 获取人数 */
    await db.collection('USER').count().then(res => {
      this.setData({
        userTotal: res.total
      })
    })
    /** 获取最新三个人 */
    await db.collection('USER').limit(3).orderBy("create_time", 'desc').field({
      avatarUrl: true
    }).get().then(res => {
      this.setData({
        newUsers: res.data
      })
    })
  },
  /**
   * 获取帖子
   */
  async getPost() {
    const postType = this.data.tabs[this.data.tabIndex].id
    let width = wx.getSystemInfoSync().windowWidth - 30;
    await wx.cloud.callFunction({
      name: 'getIndexPost',
      data: {
        postType,
        uid: wx.getStorageSync('uid') || 0,
      }
    }).then(res => {
      let details = res.result

      for (const item of details) {
        item.createTime = utils.dateFormater('YYYY-MM-DD HH:mm:ss', item.create_time)

        if (item.type == 3) {
          const w = item.video.width;
          const h = item.video.height;
          let height = 0;
          if (w >= h) {
            height = h * width / w;
            if (height > 200) {
              height = 200;
              width = w * 200 / h
            }
          } else {
            height = 200;
          }
          item.video.vw = width;
          item.video.vh = height;
        }
      }

      this.setData({
        details,
        detailend: false,
        postLoading: false,
      })

      wx.stopPullDownRefresh()
    })
  },

  onReady() {
    /** 获取tab高度 */
    wx.createSelectorQuery().select('.tab-box').boundingClientRect(rect => {
      this.setData({
        tabHeight: rect.height
      })
    }).exec();
  },
  /**
   * 关闭发布种类
   */
  handleCloseAnnounce() {
    this.setData({
      announce: false
    })
  },
  /**
   * 监听页面滚动
   */
  onPageScroll(e) {
    if (e.scrollTop >= this.data.scrollTop) {
      this.setData({
        tabFixed: true
      })
    } else {
      this.setData({
        tabFixed: false
      })
    }
  },
  /**
   * handleTabItem
   * 选中tab
   */
  handleTabItem(e) {
    const tabs = this.data.tabs;
    this.setData({
      details: [],
      postLoading: true,
      tabIndex: e.currentTarget.dataset.index
    }, () => this.getPost())
  },
  /**
   * 展开筛选条件
   */
  handleOpenDrop() {
    wx.pageScrollTo({
      scrollTop: this.data.scrollTop + 1
    })
    this.setData({
      screenPanel: !this.data.screenPanel
    })
  },
  /**
   * handleScreen
   * 筛选 排序
   */
  handleScreen(e) {
    const screenIndex = e.currentTarget.dataset.index;
    let details = this.data.details;

    if (screenIndex == 0) {
      details = details.sort((obj1, obj2) => {
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
    } else if (screenIndex == 1) {
      details = details.sort((obj1, obj2) => {
        const item1 = obj1.praise;
        const item2 = obj2.praise;
        if (item1 < item2) {
          return 1;
        } else if (item1 > item2) {
          return -1;
        } else {
          return 0;
        }
      })
    }
    this.setData({
      details,
      screenIndex,
      screenPanel: !this.data.screenPanel
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    this.getPost()
  },
  /**
   * 跳转到图片详情
   */
  handleToImage(e) {
    wx.navigateTo({
      url: '/pages/detail/photo?detailId=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 跳转详情
   */
  handleToDetail(e) {
    const details = this.data.details
    const index = e.currentTarget.dataset.index
    let path = '';
    switch (details[index].type) {
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
      url: path + '?detailId=' + details[index]._id
    })
  },
  catchtouchmove() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'Mazda 3 Axela* 车友会   ᐓ 小伙伴邀请你来了解小昂',
      path: '/pages/index/index',
      imageUrl: datas.shareCover
    }
  }
})