import util from '../../utils/util.js';
// const util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    currentCategory: "gn",
    newsList: [],
    hotNewsList: []
  },
  onLoad: function(options) {
    this.refreshNews();
  },
  refreshNews(onComplete) {
    const page = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        "type": "gn"
      },
      success: function(data) {
        if (data.data.code != '200') {
          console.log(data);
          wx.showToast({
            title: '获取新闻失败',
            icon: 'none'
          });
        }
        var newsList = data.data.result;
        newsList.forEach((n) => {
          n.info = n.date.substring(0, 10) + " " + n.source;
        });

        // pick hot news
        var hotNewsList =  [];
        for(var i = 0;i < 5;i++){
          const news = newsList[i];
          var hotNewsObj = {
            title: news.title,
            image: news.firstImage,
            info: news.source + " " + news.date.substring(11, 16)
          };

          hotNewsList.push(hotNewsObj);
        }

        page.setData({
          newsList,
          hotNewsList
        });

      },
      fail: function() {

      },
      complete: function() {
        onComplete && onComplete();
      }
    })
  }
})