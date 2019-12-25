const utils = {
  /**
   * 格式化时间
   * @param {formater} 	指定格式 YYYY-MM-DD HH:mm
   * @param {t} 				时间戳
   */
  dateFormater(formater, t) {
    let date = t ? new Date(t) : new Date(),
      Y = date.getFullYear() + '',
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    return formater
      .replace(/YYYY|yyyy/g, Y)
      .replace(/YY|yy/g, Y.substr(2, 2))
      .replace(/MM/g, (M < 10 ? '0' : '') + M)
      .replace(/DD/g, (D < 10 ? '0' : '') + D)
      .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
      .replace(/mm/g, (m < 10 ? '0' : '') + m)
      .replace(/ss/g, (s < 10 ? '0' : '') + s);
  },
  /**
   * 生成从minNum到maxNum的随机数
   */
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  },
  /**
   * 宽高装换
   */
  whTrans(w, h, ws = 30) {
    let width = wx.getSystemInfoSync().windowWidth - ws;
    let height = 0;
    if (w >= h) {
      height = h * width / w
    } else {
      height = 200
    }
    return {
      width,
      height
    }
  },
  /**
   * 将对象用&拼接
   * @param {obj} 要拼接的对象
   */
  pars(obj) {
    let arr = [];
    Object.keys(obj).forEach(key => {
      arr.push(key + '=' + obj[key])
    })
    return arr.join("&");
  }
}

export default utils