import util from '../../utils/util.js';
const app = getApp();

Page({
  data: {
    // news id, for fetching news(especially for retry)
    id: 0,
    // news title
    title: "",
    // news info, combining source and publish time
    info: "",
    // news reader count
    readCount: 0,
    // contents object for rendering
    contents: [],
    // is error occurred? if it is, show error page and let users retry
    errorOccurred: false
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.getNews(options.id);
  },
  onBack: function() {
    wx.navigateBack();
  },
  onRetry: function() {
    this.getNews(this.data.id);
  },
  getNews: function(id, onComplete) {
    const page = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: id
      },
      success: function(data) {
        if (data.data.code != 200) {
          // something wrong happened
          page.showErrorPage();
          return;
        }


        const result = data.data.result;

        // compose info
        var time = result.date.substring(11, 16);
        var info = result.source + " " + time;
        info.trim();

        // start rendering
        page.setData({
          title: result.title,
          readCount: result.readCount,
          info: info,
          contents: result.content,
          errorOccurred: false
        });
      },
      fail: function() {
        page.showErrorPage();
      },
      complete: function() {
        onComplete && onComplete();
      }
    })
  },
  showErrorPage: function() {
    this.setData({
      errorOccurred: true
    });
  }
})