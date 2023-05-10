import {
  searchResverse
} from '../../api/order.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    appoinList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      appoinList: [],
      userId: app.globalData.userInfo.userId
    })
  },

  //获取预约记录
  getAppointList() {
    let userId = this.data.userId;
    searchResverse(userId).then(res => {
      if (res.code == 200) {
        this.setData({
          appoinList: res.rows
        })
      }
    })
  },
  //打开详情页
  bindViewTap(e) {
    let orderId = e.currentTarget.dataset.id
    let item = e.currentTarget.dataset.item
    if (item.orderType == "1") {
      wx.navigateTo({
        url: '/pages/order/detail/index?orderId=' + orderId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAppointList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})