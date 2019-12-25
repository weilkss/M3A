import datas from '../../utils/datas.js'
import Toast from '../../components/toast/toast.js'

Page({
  data: {
    title: '',
    index: 0,
    images: datas.imgTypes,
    address: {},
    uploadImgs: []
  },
  onLoad() {
    new Toast();
  },
  /**
   * 选择类型
   */
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 选择位置
   */
  handleOpenLotion() {
    const _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        wx.chooseLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success: _res => {
            _this.setData({
              address: {
                name: _res.address,
                lat: _res.latitude,
                lot: _res.longitude
              }
            })
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  chooseImage() {
    return new Promise(reolve => {
      wx.chooseImage({
        count: 20,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          reolve(res.tempFilePaths)
        }
      })
    })
  },
  /**
   * 递归
   */
  uploadFile(index, tempFilePaths) {
    const uploadImgs = this.data.uploadImgs;
    const filePath = tempFilePaths[index];
    const timestamp = Date.parse(new Date());
    const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: f => {
        uploadImgs.push({
          describe: '',
          url: f.fileID
        })

        this.setData({
          uploadImgs
        })

        if (index == tempFilePaths.length - 1) {
          this.hideLoading()
        }

        if (index < tempFilePaths.length - 1) {
          this.uploadFile(index + 1, tempFilePaths)
        }
      }
    })
  },
  /**
   * 点击上传图片
   */
  async uploadImage() {
    let tempFilePaths = await this.chooseImage();
    this.showLoading('上传中...')
    this.uploadFile(0, tempFilePaths)
  },
  /**
   * 添加描述
   */
  handleBlur(e) {
    const uploadImgs = this.data.uploadImgs;
    uploadImgs[e.currentTarget.dataset.index].describe = e.detail.value
    this.setData({
      uploadImgs
    })
  },
  handleInputBlur(e) {
    this.setData({
      title: e.detail.value
    })
  },
  showToast(title) {
    this.hideLoading()
    wx.showToast({
      title,
      icon: 'none'
    })
  },
  handleRelease() {
    this.showLoading('发布中...')
    const title = this.data.title.trim();
    const uid = wx.getStorageSync('uid');
    const uploadImgs = this.data.uploadImgs;
    const images = this.data.images;
    const index = this.data.index;
    const address = this.data.address;
    const imgType = index === 0 ? '' : images[index]

    if (title == '') {
      return this.showToast('请填写标题')
    } else {
      if (title.length > 200) {
        return this.showToast('标题最多200字符')
      }
    }

    if (!uploadImgs.length) {
      return this.showToast('至少上传一张图片')
    }

    wx.cloud.callFunction({
      name: 'createFunction',
      data: {
        title,
        des: '',
        uid,
        cover: uploadImgs[0].url,
        type: 6,
        typeName: '图片',
        imgType,
        address,
        imgs: uploadImgs,
        video: null,
        create_time: new Date().getTime()
      }
    }).then(res => {

      this.setData({
        index: 0,
        title: '',
        address: {},
        uploadImgs: [],
      })

      this.showToast('发布成功')

      wx.navigateBack({
        delta: 1
      })
    })
  }
})