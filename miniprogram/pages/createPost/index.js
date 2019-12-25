import Toast from '../../components/toast/toast.js'
const db = wx.cloud.database()

Page({
  data: {
    title: '',
    html: '',
    formats: {},
    readOnly: false,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    new Toast();
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = (keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight) - 50
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    wx.createSelectorQuery().select('#editor').context(res => {
      this.editorCtx = res.context
    }).exec()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  /**插入时间 */
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  chooseImage() {
    return new Promise(reolve => {
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          reolve(res.tempFilePaths)
        }
      })
    })
  },

  /**
   * 递归上传
   */
  uploadFile(index, tempFilePaths) {
    const filePath = tempFilePaths[index];
    const timestamp = Date.parse(new Date());
    const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: f => {
        this.editorCtx.insertImage({
          src: f.fileID,
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '100%',
          success: () => {
            if (index == tempFilePaths.length - 1) {
              this.hideLoading()
            }
          }
        })

        if (index < tempFilePaths.length - 1) {
          this.uploadFile(index + 1, tempFilePaths)
        }
      }
    })
  },

  /** 插入图片 */
  async insertImage() {
    let tempFilePaths = await this.chooseImage();
    this.showLoading('上传中...')
    this.uploadFile(0, tempFilePaths)
  },

  /**
   * 
   */
  showToast(title) {
    this.hideLoading()
    wx.showToast({
      title,
      icon: 'none'
    })
  },

  getHTML() {
    return new Promise(reolve => {
      this.editorCtx.getContents({
        success(res) {
          reolve(res)
        }
      })
    })
  },
  async handleRelease() {
    this.showLoading('发布中...')
    const title = this.data.title.trim();
    const uid = wx.getStorageSync('uid');
    const {
      html,
      text
    } = await this.getHTML();
    let cover = [];

    html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
      cover.push(capture)
    });

    if (!cover.length) {
      cover[0] = '';
    }

    if (title == '') {
      return
    } else {
      if (title.length < 6) {
        return this.showToast('标题至少6个字')
      } else if (title.length > 30) {
        return this.showToast('标题最多30字符')
      }
    }

    if (text == '') {
      return this.showToast('请填内容')
    } else {
      if (text.length < 20) {
        return this.showToast('至少输入20个文字')
      }
    }

    wx.cloud.callFunction({
      name: 'createFunction',
      data: {
        title,
        des: html,
        uid,
        cover: cover[0],
        type: 2,
        typeName: '帖子',
        imgs: [],
        imgType: '',
        address: {},
        video: null,
        create_time: new Date().getTime()
      }
    }).then(res => {
      this.editorCtx.clear()
      this.setData({
        title: ''
      })
      this.showToast('发布成功')

      wx.navigateBack({
        delta: 1
      })
    })
  },
  handleInputBlur(e) {
    this.setData({
      title: e.detail.value
    })
  }
})