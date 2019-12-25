let _compData = {
  isHide: false,
  content: ''
}
let toastPannel = {
  showLoading(data, type) {
    this.setData({
      isHide: true,
      content: data
    });
  },
  hideLoading() {
    this.setData({
      isHide: false
    })
  }
}

function Toast() {
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  this.__page = curPage;
  Object.assign(curPage, toastPannel);
  curPage.toastPannel = this;
  curPage.setData(_compData);
  return this;
}
module.exports = Toast