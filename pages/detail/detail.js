import util from '../../utils/util.js';
const app = getApp();

Page({
  data: {
    title: "",
    info: "",
    readCount: 0,
    coverImage: "",
    contents: []
  },
  onLoad: function(options) {
    this.getNews(options.id);
  },
  onBack: function(){
    wx.navigateBack();
  },
  getNews: function(id, onComplete) {
    const page = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: id
      },
      success: function(data) {
        console.log(data);
        const result = data.data.result;

        var time = result.date.substring(11, 16);
        var info = result.source + " " + time;
        info.trim();

        page.setData({
          title: result.title,
          readCount: result.readCount,
          info: info,
          contents: result.content
        });
      }
    })
  }
});