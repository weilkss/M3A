Component({
  externalClasses: ['v-panel'],
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    buttonBorder: {
      type: String,
      value: "1px solid #ccc"
    },
    backgroundColor: {
      type: String,
      value: "#fff"
    }
  },
  data: {
    carcode: "",
    keyBoardType: 1,
    keyVehicle1: '陕京津沪冀豫云辽',
    keyVehicle2: '黑湘皖鲁新苏浙赣',
    keyVehicle3: '鄂桂甘晋蒙吉闽贵',
    keyVehicle4: '粤川青藏琼宁渝',
    keyNumber: '1234567890',
    keyEnInput1: 'QWERTYUIOP',
    keyEnInput2: 'ASDFGHJKL',
    keyEnInput3: 'ZXCVBNM',
  },
  methods: {
    vehicleTap: function(event) {
      const val = event.target.dataset.value;
      switch (val) {
        case 'delete':
          this.inputdelete();
          break;
        case 'ok':
          this.triggerEvent('carcode', {
            carcode: this.data.carcode,
            isShow: false
          });
          this.setData({
            isShow: false
          })
          break;
        default:
          this.inputchange(val);
      }
    },
    inputdelete() {
      let carcode = this.data.carcode;
      let keyBoardType = this.data.keyBoardType;
      if (keyBoardType == 1) {
        carcode = '';
      } else {
        if (carcode.length == 1) {
          keyBoardType = 1;
          carcode = '';
        } else {
          carcode = carcode.substring(0, carcode.length - 1)
        }
      }

      this.setData({
        carcode,
        keyBoardType
      })
      this.triggerEvent('carcode', {
        carcode,
        isShow: this.data.isShow
      });
    },
    inputchange(val) {
      let carcode = this.data.carcode;
      let keyBoardType = this.data.keyBoardType;

      if (carcode.length == 7) {
        this.triggerEvent('carcode', {
          carcode,
          isShow: this.data.isShow
        });
        return false;
      }

      carcode = carcode + val;

      if (keyBoardType === 1) {
        keyBoardType = 2;
      }

      this.setData({
        carcode,
        keyBoardType
      })

      this.triggerEvent('carcode', {
        carcode,
        isShow: this.data.isShow
      });
    }
  }
});