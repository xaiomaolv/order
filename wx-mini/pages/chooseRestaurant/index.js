import {
  getCollectList
} from "../../api/store"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
    userId: null,
    dataList: [],
  },

  onLoad: function (option) {
    this.setData({
      userId: app.globalData.userInfo.userId
    })
  },

  getCollectData() {
    let param = {
      "userId": this.data.userId,
      "pageNum": 1,
      "pageSize": 9999
    }
    getCollectList(param).then(res => {
      if (res.code == 200) {
        this.setData({
          dataList: res.rows
        })
      }
    })
  },

  //打开详情页
  bindViewTap(e) {
    let item = JSON.stringify(e.currentTarget.dataset.value)
      wx.navigateTo({
        url: '/pages/restaurant/restaurant?item=' + item,
      })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCollectData();
  },
})