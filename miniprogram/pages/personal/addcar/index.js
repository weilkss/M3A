const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdd: false,
    isShow: false,
    carcode: '',
    code: '',
    cinx: null,
    colors: ['铂钢灰', '幻影银', '极夜黑', '琉璃棕', '魂动红', '珍珠白'],
    pinx: null,
    pails: ['1.5 L', '2.0 L', '2.5 L'],
    minx: null,
    modelling: ['两箱', '三厢']
  },
  onLoad() {
    db.collection('USER').where({
      _id: wx.getStorageSync('uid')
    }).get().then(res => {

      const param = res.data[0]
      let isAdd = false;
      let cinx = 0;
      let pinx = 0;
      let minx = 0;
      let colors = this.data.colors;
      let pails = this.data.pails;
      let modelling = this.data.modelling;
      if (param.car_code) {
        isAdd = true;
      }
      for (const index in colors) {
        if (colors[index] == param.car_color) {
          cinx = index;
          break;
        }
      }
      for (const index in pails) {
        if (pails[index] == param.car_pail) {
          pinx = index;
          break;
        }
      }
      for (const index in modelling) {
        if (modelling[index] == param.car_mode) {
          minx = index;
          break;
        }
      }

      this.setData({
        cinx,
        pinx,
        minx,
        isAdd,
        carcode: param.car_code,
        code: param.code
      })
    })
  },
  handleCarcode() {
    this.setData({
      isShow: true
    })
  },
  handCloseCarcode() {
    this.setData({
      isShow: false
    })
  },
  bindcarcode(e) {
    this.setData({
      carcode: e.detail.carcode,
      isShow: e.detail.isShow
    })
  },
  /**
   * 获取副牌
   */
  handleBlur(e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 选择车身颜色
   */
  bindPickerColor(e) {
    this.setData({
      cinx: e.detail.value
    })
  },
  /**
   * 选择排量
   */
  bindPickerPails(e) {
    this.setData({
      pinx: e.detail.value
    })
  },
  /**
   * 选择车型
   */
  bindPickerMode(e) {
    this.setData({
      minx: e.detail.value
    })
  },
  /**
   * 提交
   */
  async handleSubmit() {

    const uid = wx.getStorageSync('uid') || 0
    const {
      code,
      carcode,
      colors,
      cinx,
      minx,
      modelling,
      pinx,
      pails,
    } = this.data;

    if (carcode == '') {
      return wx.showToast({
        title: '请输入车牌号',
        icon: 'none'
      })
    }

    await wx.cloud.callFunction({
      name: 'createCarInfo',
      data: {
        uid,
        code,
        car_code: carcode,
        car_color: cinx ? colors[cinx] : '',
        car_mode: minx ? modelling[minx] : '',
        car_pail: pinx ? pails[pinx] : ''
      }
    })

    wx.showToast({
      title: this.data.isAdd ? '修改成功' : '添加成功',
      icon: 'none'
    })

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})