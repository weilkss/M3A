import * as echarts from '../../components/ec-canvas/echarts.js';
import datas from '../../utils/datas.js'
import utils from '../../utils/utils.js'

const option = datas.option

let flag = true;
let Chart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    systemInfo: 0,
    announce: false,
    uid: 0,
    isHead: false,
    personalInfo: null,
    scale: 1,
    isShow: false,
    keyBoardType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const uid = wx.getStorageSync('uid') || 0;
    const systemInfo = this.getSystemInfo()
    this.setData({
      uid,
      systemInfo,
      personalInfo: wx.getStorageSync('PERSONAL') || null
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }

    this.echartsComponnet = this.selectComponent('#mychart-dom-line')
    const uid = wx.getStorageSync('uid') || 0

    if (uid) {
      wx.cloud.callFunction({
        name: 'getPersonal',
        data: {
          uid
        }
      }).then(res => {
        wx.setStorageSync('PERSONAL', res.result)
        this.setData({
          uid,
          personalInfo: res.result
        }, () => {
          if (!Chart) {
            /** 初始化图表 */
            this.initEcharts();
          } else {
            /** 更新数据 */
            this.setOption(Chart);
          }
        })
      })
    }
  },
  initEcharts() {
    this.echartsComponnet.init((canvas, width, height) => {
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      return Chart;
    });
  },
  setOption(Chart) {
    Chart.clear();
    Chart.setOption(this.getOption());
  },
  getOption() {
    const option = datas.option
    let xAxis = []
    let series = []
    for (const item of this.data.personalInfo.consume) {
      xAxis.push(utils.dateFormater('YYYY-MM-DD', item.date))
      series.push(item.price)
    }

    option.xAxis.data = xAxis
    option.series[0].data = series
    return option;
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
   * scroll
   */
  handleScroll(e) {
    const scrollTop = e.detail.scrollTop;
    let isHead = false;
    let scale = 1
    if (scrollTop <= 0) {
      flag = true;
      this.setData({
        scale: 1 - scrollTop * 0.005,
        isHead,
      })
    }

    if (flag && scrollTop > 0) {
      flag = false;
      isHead = true
      this.setData({
        scale,
        isHead,
      })
    }
  },
  /**
   * 
   */
  handleCarCode() {
    this.setData({
      isShow: true
    })
  },
  /**
   * 加油记录
   */
  toConsume() {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/personal/consume/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?backurl=/pages/personal/consume/index',
      })
    }
  },
  /**
   * 关注列表
   */
  toFollow() {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/personal/follow/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?backurl=/pages/personal/follow/index',
      })
    }
  },
  /**
   * 粉丝列表
   */
  toFans() {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/personal/fans/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?backurl=/pages/personal/fans/index',
      })
    }
  },
  /**
   * 我的回复
   */
  toReply() {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/personal/reply/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?backurl=/pages/personal/reply/index',
      })
    }
  },
  /**
   * 添加爱车
   */
  toAddcar() {
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/personal/addcar/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?backurl=/pages/personal/addcar/index',
      })
    }
  },
  /**
   * 去图贴详情
   */
  toPost(e) {
    const index = e.currentTarget.dataset.index
    if (wx.getStorageSync('uid')) {
      wx.navigateTo({
        url: '/pages/personal/post/index?index=' + index,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index?backurl=/pages/personal/post/index&index=' + index,
      })
    }
  },
  /** 
   * 获取系统信息
   */
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonObject = wx.getMenuButtonBoundingClientRect() || {};
    const ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
    if (!menuButtonObject.top) {
      menuButtonObject.top = systemInfo.statusBarHeight + (ios ? 4 : 8);
      menuButtonObject.height = 32;
    }
    systemInfo.navHeight = menuButtonObject.height + (menuButtonObject.top - systemInfo.statusBarHeight) * 2;
    systemInfo.headHeight = systemInfo.navHeight + systemInfo.statusBarHeight

    return systemInfo
  },
})