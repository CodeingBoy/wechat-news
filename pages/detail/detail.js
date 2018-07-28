import util from '../../utils/util.js';
const app = getApp();

Page({
  data: {
    id: 0,
    title: "",
    info: "",
    readCount: 0,
    coverImage: "",
    contents: [],
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
  onRetry: function(){
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
          page.showErrorPage();
          return;
        }
        const result = data.data.result;

        var time = result.date.substring(11, 16);
        var info = result.source + " " + time;
        info.trim();

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
      complete: function(){
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