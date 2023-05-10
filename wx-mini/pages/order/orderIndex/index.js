// pages/order/orderIndex/index.js
import {
  searchOrder
} from '../../../api/order'

import {
  authUser,
  checkUser
} from '../../../api/userInfo'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userStatus: null,
    userId: '',
    active: 0,
    showPageNext: false,
    onMoreFlag: false,
    pageNum: 1,
    allData: [], //全部订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userStatus: app.globalData.userStatus
      // userId:app.globalData.userInfo.userId
    })
    this.getList()
  },

  onClick(e) {
    this.setData({
      active: e.detail.name,
      allData: [],
    })
    this.getList(this.data.active)
  },
  //获取订单列表
  getList() {
    let status = null;
    let active = this.data.active
    if (active == 0) {
      status = ""
    } else {
      status = '50'
    }
    let params = {
      "orderStatus": status,
      "userId": app.globalData.userInfo.userId,
    }
    searchOrder(params).then(res => {
      if (res.code == 200) {
        this.setData({
          allData: res.rows
        })
      }
    })
  },

  //打开详情页
  bindViewTap(e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/index?orderId=' + orderId,
    })
  },

  //打开评价详情页
  bindViewComment(e) {
    let userId = app.globalData.userInfo.userId
    let orderId = e.currentTarget.dataset.value.orderId
    let value = JSON.stringify(e.currentTarget.dataset.value)
    let item = e.currentTarget.dataset.value
    if (item.orderStatus == '50' && item.commentType == '0') {
      // wx.navigateTo({
      //   url: '../evaluate/index?item=' + value,
      // })
      wx.navigateTo({
        url: '../detail/index?orderId=' + orderId,
      })
    }
    if (item.commentType == '1') {
      wx.navigateTo({
        url: '/pages/order/comment/comment?userId=' + userId + "&orderId=" + orderId
      })
    }
  },
  //再来一单
  orderAgain() {
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
      url: '/pages/cart/cart'
    })
  },
  // 去抽奖
  toDraw(e) {
    let orderId = e.currentTarget.dataset.value.orderId
    let orderType = JSON.stringify(e.currentTarget.dataset.value.orderType)
    if (orderType == "1") {
      wx.redirectTo({
        url: '/pages/luckDraw/index?orderId=' + orderId + "&activitySeat=" + "3"
      })
    } else {
      wx.redirectTo({
        url: '/pages/luckDraw/index?orderId=' + orderId + "&activitySeat=" + "2"
      })
    }

  },
  //去评论
  toEvaluate(e) {
    let item = JSON.stringify(e.currentTarget.dataset.value)
    wx.navigateTo({
      url: '../evaluate/index?item=' + item,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})