Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object
    }
  },

  data: {
    praises: [],
    replyId: '',
    commentText: "",
    textarea: false,
    commentVisible: false,
    commentVisibles: false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleOpenInput(e, replyId = '') {
      if (!wx.getStorageSync('uid')) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
        return;
      }
      this.setData({
        replyId,
        commentVisible: true,
        commentVisibles: true,
      })
      setTimeout(() => {
        this.setData({
          textarea: true
        })
      }, 400)
    },
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
    /**
     * 发表评论
     */
    async handleSend() {
      wx.showLoading({
        title: '发布中...',
      })
      const replyId = this.data.replyId
      const detail = this.data.detail;
      const commentText = this.data.commentText
      let userInfo = null;

      await wx.cloud.callFunction({
        name: 'createComment',
        data: {
          uid: wx.getStorageSync('uid') || 0,
          params: {
            post_id: detail._id,
            content: commentText,
            replyid: replyId,
            subid: detail.uid,
            create_time: new Date().getTime(),
          }
        }
      }).then(res => {
        this.handleCloseInput()
        this.setData({
          commentText: ''
        })

        this.triggerEvent('send', {}, {})
        wx.hideLoading()

        wx.showToast({
          title: '评论成功',
          icon: 'none'
        })
      })
    },
    /**
     * 点赞和取消点赞
     */
    async handlePraise() {
      const detail = this.data.detail
      const subid = detail._id;
      const uid = wx.getStorageSync('uid') || 0;

      wx.cloud.callFunction({
        name: 'praise',
        data: {
          uid,
          subid
        }
      }).then(res => {
        detail.isPraise = res.result.isPraise
        detail.praise = res.result.praise
        this.setData({
          detail
        })
      })
    },
    catchtap() {},
    catchtouchmove() {}
  }
})