import {
  getActivityList
} from '../../api/activity'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
  },

  toCart() {
    let dataStr = {
      mealTime: '',
      mealMethod: '',
      mealNum: null,
      orderType: 0,
      orderMethod: '',
      tableNum: ''
    }
    app.globalData.orderInfo = dataStr
    wx.navigateTo({
      url: '../cart/cart'
    })
  },

  notice() {
    wx.showToast({
      title: '此功能暂不开放!',
      icon: 'error',
    })
  },

  //活动
  getActivity() {
    let params = {
      pageNum: 1,
      pageSize: 9999,
      activityType: 1
    }

    getActivityList(params).then(res => {
      if (res.code == 200) {
        this.setData({
          dataList: res.rows
        })
      }
    })
  },
  // 活动跳转
  handelActive(e) {
    let item = e.currentTarget.dataset.value
    console.log(item, 'irwrwr');
    wx.navigateTo({
      url: `/pages/webview/webview?url=${item.eventLink}`,
    })
  },
  onShow: function () {
    this.getActivity();
  }

})