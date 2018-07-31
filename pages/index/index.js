import util from '../../utils/util.js';
const app = getApp();

Page({
  data: {
    // category's name, for rendering
    categoryNames: ["国内", "国际", "财经", "娱乐", "军事", "体育", "其他"],
    // category's id, for requesting corrsponding news
    categories: ["gn", "gj", "cj", "yl", "js", "ty", "other"],
    // current selected category, default is "gn"
    currentCategory: "gn",
    // currend selected category number, for highlighting selected category
    currentCategoryId: 0,
    // fetched news list
    newsList: [],
    // hot news list, picked from newsList
    hotNewsList: [],
    // is error occurred? if it is, show error page instead of empty news list page
    errorOccurred: false
  },
  onLoad: function(options) {
    this.refreshNews();
  },
  onPullDownRefresh: function() {
    this.refreshNews(() => {
      wx.stopPullDownRefresh();
    });
  },
  onClickCategory: function(event) {
    var categoryId = Number(event.currentTarget.dataset.categoryId);
    if (categoryId !== this.data.currentCategoryId) {
      this.setData({
        currentCategory: this.data.categories[categoryId],
        currentCategoryId: categoryId
      });
      this.refreshNews();
    }
  },
  onNewsItemTap: function(event) {
    const newsId = event.currentTarget.dataset.newsId;
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + newsId
    });
  },
  onHotNewsItemTap: function(event) {
    this.onNewsItemTap(event);
  },
  onRetry: function() {
    wx.startPullDownRefresh({});
  },
  refreshNews: function(onComplete) {
    const page = this;
    wx.showLoading({
      title: "加载中"
    });
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        "type": this.data.currentCategory
      },
      success: function(data) {
        if (data.data.code != '200') {
          // something wrong happened
          page.showErrorToastOrPage();
          return;
        }

        // compose info text and set default image
        var newsList = data.data.result;
        newsList.forEach((n) => {
          n.info = n.date.substring(0, 10) + " " + n.source;
          if (!n.firstImage) {
            n.firstImage = "images/default-news-image.png";
          }
        });

        // pick hot news
        var hotNewsList = [];
        var times = Math.min(newsList.length, 5);
        for (var i = 0; i < times; i++) {
          const news = newsList[i];
          var hotNewsObj = {
            id: news.id,
            title: news.title,
            image: news.firstImage,
            info: news.source + " " + news.date.substring(11, 16)
          };

          hotNewsList.push(hotNewsObj);
        }

        // start rendering
        page.setData({
          newsList,
          hotNewsList,
          errorOccurred: false // don't forget this
        });

      },
      fail: function() {
        page.showErrorToastOrPage();
      },
      complete: function() {
        wx.hideLoading();
        typeof onComplete === 'function' && onComplete();
      }
    });
  },
  showErrorToastOrPage: function() {
    const newsList = this.data.newsList;
    if (!newsList || newsList.length == 0) {
      // news list is empty or null, show error page
      this.setData({
        errorOccurred: true
      });

    } else {
      // show toast instead of error page for better user experience
      wx.showToast({
        title: '获取新闻失败',
        icon: 'none'
      });
    }
  }
})