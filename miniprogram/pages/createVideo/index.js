import Toast from '../../components/toast/toast.js'
import datas from '../../utils/datas.js'
import utils from '../../utils/utils.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    video: null,
    width: 0,
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    new Toast();
  },
  /**
   * 标题
   */
  handleInputBlur(e) {
    this.setData({
      title: e.detail.value
    })
  },
  chooseVideo() {
    return new Promise(resolve => {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success(res) {
          resolve(res)
        }
      })
    })
  },
  uploadFile(cloudPath, filePath) {
    return new Promise(resolve => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          resolve(res.fileID)
        }
      })
    })
  },
  /**
   * 上传视频
   */
  async uploadVideo() {
    const videos = await this.chooseVideo()
    if (videos.size > 50 * 1024 * 1024) {
      return wx.showToast({
        title: '视频不能大于50M',
        icon: 'none'
      })
    }

    this.showLoading('上传中...')

    const video = {}
    const tempFilePath = videos.tempFilePath
    const timestamp = Date.parse(new Date());
    const urlPath = timestamp + tempFilePath.match(/\.[^.]+?$/)[0]
    video.url = await this.uploadFile(urlPath, tempFilePath)
    video.cover = ''
    if (videos.thumbTempFilePath) {
      const thumbTempFilePath = videos.thumbTempFilePath
      const coverPath = timestamp + thumbTempFilePath.match(/\.[^.]+?$/)[0]
      video.cover = await this.uploadFile(coverPath, thumbTempFilePath)
    }

    video.duration = videos.duration
    video.width = videos.width
    video.height = videos.height
    video.size = videos.size
    const u = utils.whTrans(video.width, video.height)

    this.setData({
      video,
      width: u.width,
      height: u.height
    })
    this.hideLoading()
  },
  showToast(title) {
    this.hideLoading()
    wx.showToast({
      title,
      icon: 'none'
    })
  },
  /**
   * 发布视频
   */
  handleRelease() {
    this.showLoading('发布中...')
    const video = this.data.video;
    const title = this.data.title.trim();
    const uid = wx.getStorageSync('uid');

    if (title == '') {
      return this.showToast('请填写标题')
    } else {
      if (title.length > 200) {
        return this.showToast('标题最多200字符')
      }
    }

    if (!video) {
      return this.showToast('请上传视频')
    }

    wx.cloud.callFunction({
      name: 'createFunction',
      data: {
        title,
        des: '',
        uid,
        cover: video.cover || '',
        type: 3,
        typeName: '视频',
        imgType: '',
        address: {},
        imgs: [],
        video,
        create_time: new Date().getTime()
      }
    }).then(res => {

      this.showToast('发布成功')

      wx.navigateBack({
        delta: 1
      })
    })
  },
})