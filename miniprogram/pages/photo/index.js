import Toast from '../../components/toast/toast.js'
Page({
  data: {
    index: 0,
    limit: 4,
    first: null,
    album: [{}],
    resultAlbum: []
  },
  onLoad() {
    new Toast()
    this.getPhoto()
  },

  getPhoto() {
    wx.cloud.callFunction({
      name: 'getPhoto',
      data: {
        uid: wx.getStorageSync('uid') || 0
      }
    }).then(res => {
      const first = res.result[0]
      let resultAlbum = JSON.parse(JSON.stringify(res.result))
      resultAlbum.splice(0, 1)
      const album = resultAlbum.slice(0, this.data.limit)
      this.setData({
        first,
        album,
        resultAlbum
      })
    })
  },

  handleSeclet(e) {
    const index = Number(e.currentTarget.dataset.index)
    let album = this.data.album;

    this.setData({
      album: []
    })
    
    album = album.sort((obj1, obj2) => {
      const item1 = obj1[index == 0 ? 'praise' : 'create_time'];
      const item2 = obj2[index == 1 ? 'create_time' : 'praise'];
      if (item1 < item2) {
        return 1;
      } else if (item1 > item2) {
        return -1;
      } else {
        return 0;
      }
    })

    this.setData({
      album,
      index
    })
  },

  toImageDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/photo?detailId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    const limit = this.data.limit + 2;
    if (this.data.album.length < this.data.resultAlbum.length) {
      this.setData({
        limit,
        album: resultAlbum.slice(0, limit)
      })
    }
  },
})