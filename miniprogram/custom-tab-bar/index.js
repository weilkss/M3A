Component({
  data: {
    selected: 0,
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/homes.png",
      text: "M3A"
    }, {
      iconPath: "/images/adds.png"
    }, {
      pagePath: "/pages/personal/index",
      iconPath: "/images/personal.png",
      selectedIconPath: "/images/personals.png",
      text: "我的"
    }]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      const pages = getCurrentPages();
      const _this = pages[pages.length - 1];
      if (data.index == 1) {
        _this.setData({
          announce: !_this.data.announce
        })
        return false;
      } else {
        _this.setData({
          announce: false
        })
      }
      wx.switchTab({
        url
      })

      this.setData({
        selected: data.index
      })
    }
  }
})