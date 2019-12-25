import Toast from '../../../components/toast/toast.js'
import utils from '../../../utils/utils.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 3,
    resultReplys: [],
    replys: [],
    index: 0,
    textarea: false,
    commentText: '',
    commentVisible: false,
    commentVisibles: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    new Toast()
    this.getComment()
  },
  onReady() {
    this.setMsgOk()
  },
  /**
   * 获取回复
   */
  getComment() {
    wx.cloud.callFunction({
      name: 'getMyReply',
      data: {
        uid: wx.getStorageSync('uid')
      }
    }).then(res => {
      for (const item of res.result) {
        item.createTime = utils.dateFormater('YYYY-MM-DD hh:mm:ss', item.create_time)
      }
      this.setData({
        resultReplys: res.result,
        replys: res.result.slice(0, this.data.limit),
      })
    })
  },
  /**
   * 标记已读
   */
  setMsgOk() {
    wx.cloud.callFunction({
      name: 'updateComment',
      data: {
        uid: wx.getStorageSync('uid')
      }
    })
  },
  /**
   * 点击回复
   */
  handleReply(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      index,
      commentVisible: true,
      commentVisibles: true,
    })
    setTimeout(() => {
      this.setData({
        textarea: true
      })
    }, 400)
  },
  /**
   * 关闭回复
   */
  handleCloseInput() {
    this.setData({
      textarea: false,
      commentVisibles: false
    })
    setTimeout(() => {
      this.setData({
        commentVisible: false
      })
    }, 400)
  },
  taInput(e) {
    this.setData({
      commentText: e.detail.value.trim()
    })
  },
  catchtap() {},
  /**
   * 呼呼
   */
  handleSend() {
    const index = this.data.index;
    const replys = this.data.replys;
    const commentText = this.data.commentText;
    const obj = replys[index];

    if (!commentText) {
      return wx.showToast({
        title: '请输入回复内容',
        icon: "none"
      })
    }

    this.showLoading('回复中..')

    wx.cloud.callFunction({
      name: 'createComment',
      data: {
        uid: wx.getStorageSync('uid'),
        params: {
          post_id: obj.post_id,
          content: commentText,
          replyid: obj._id,
          subid: obj.uid,
          create_time: new Date().getTime()
        }
      }
    }).then(res => {
      this.handleCloseInput()
      this.hideLoading()
      this.getComment()
      wx.showToast({
        title: '回复成功',
        icon: 'none'
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const limit = this.data.limit + 1;
    if (this.data.replys.length < this.data.resultReplys.length) {
      this.setData({
        limit,
        replys: this.data.resultReplys.slice(0, limit)
      })
    }
  },
  toDetail(e) {
    const replys = this.data.replys
    const index = e.currentTarget.dataset.index
    let path = '';
    switch (replys[index].type) {
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
      url: path + '?detailId=' + replys[index].post_id
    })
  },
})