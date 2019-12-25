Component({
  /**
   * 组件的属性列表
   */
  properties: {
    announce: {
      type: Boolean,
      value: false
    }
  },

  data: {
    systemInfo: null,
    announces: [{
        announce: false,
        url: '/images/icon_01.png',
        text: '图片'
      }, {
        announce: false,
        url: '/images/icon_02.png',
        text: '帖子'
      }, {
        announce: false,
        url: '/images/icon_03.png',
        text: '视频'
      },
      // {
      //   announce: false,
      //   url: '/images/icon_04.png',
      //   text: '活动'
      // }
    ]
  },
  lifetimes: {
    attached() {
      wx.getSystemInfo({
        success: res => {
          this.setData({
            systemInfo: res,
          })
        }
      })
    }
  },
  observers: {
    'announce': function(announce) {
      if (announce) {
        this.transition(0, announce)
      } else {
        this.transition(this.data.announces.length - 1, announce)
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    transition(index, announce) {
      const announces = this.data.announces
      let time = 200 - index * 50;
      let direction = announce ? 1 : -1;
      if (this.timer) clearTimeout(this.timer)
      if ((announce && index >= announces.length) || (!announce && index < 0)) return false;
      if ((index == 0 && announce) || (!announce && index == announces.length - 1)) time = 0;
      this.timer = setTimeout(() => {
        announces[index].announce = announce;
        this.setData({
          announces
        })
        this.transition(index + direction, announce)
      }, time)
    },

    handleToAnnounce(e) {
      let path = '';
      switch (e.currentTarget.dataset.index) {
        case 0:
          path = '/pages/createImage/index';
          break;
        case 1:
          path = '/pages/createPost/index';
          break;
        case 2:
          path = '/pages/createVideo/index';
          break;
        default:
          path = '/pages/createActivity/index';
      }

      if (!wx.getStorageSync('uid')) {
        path = '/pages/login/index?backurl=' + path
      }

      wx.navigateTo({
        url: path,
      })
    }
  }
})