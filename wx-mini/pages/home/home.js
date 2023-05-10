// pages/home/home.js
import {
  authUser,
  checkUser
} from '../../api/userInfo'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTime: '',
    userStatus: null,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取当前时间
    let timeNow = new Date();
    // 获取当前小时
    let hours = timeNow.getHours();
    // 设置默认文字
    let text = ``;
    // 判断当前时间段
    if (hours >= 0 && hours <= 10) {
      text = `早上好`;
    } else if (hours > 10 && hours <= 14) {
      text = `中午好`;
    } else if (hours > 14 && hours <= 18) {
      text = `下午好`;
    } else if (hours > 18 && hours <= 24) {
      text = `晚上好`;
    }
    this.setData({
      nowTime: text
    })
    // 返回当前时间段对应的状态  
    return this.data.nowTime;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    that.authorization = that.selectComponent(".authorization");
    checkUser().then(res => {
      if (res.code == 200) {
        app.globalData.userInfo = res.data
        app.globalData.userStatus = res.data.userStatus
        if (res.data.userStatus == "1") {
          that.authorization.hideDialog()
        }
        that.setData({
          userStatus: res.data.userStatus,
          userInfo: res.data
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 扫码点餐
  toScan() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.scanCode({
        success(res) {
          let resUrl = res.result
          var index = resUrl.lastIndexOf("\="); //获取-后边的字符串
          var tableId = resUrl.substring(index + 1, resUrl.length);
          console.log("-----------" + tableId)
          wx.navigateTo({
            url: '/pages/numberDinnerTwo/index?tableId=' + tableId,
          })
        }
      })
    } else {
      that.authorization.showDialog()
    }
  },
  // 优惠券
  toCoupon() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: "/pages/coupon/coupon",
      })
    } else {
      that.authorization.showDialog()
    }
  },
  // 商家浏览
  toShop() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else {
      that.authorization.showDialog()
    }
  },
  // 我的订单
  toOrder() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: '/pages/order/orderIndex/index',
      })
    } else {
      that.authorization.showDialog()
    }
  },
  // 预约记录
  toRecord() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: '/pages/appointList/index',
      })
    } else {
      that.authorization.showDialog()
    }
  },
  // 店铺收藏
  toCollect() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: '/pages/chooseRestaurant/index',
      })
    } else {
      that.authorization.showDialog()
    }
  },
  // 预约
  toAppoint() {
    let that = this
    let userInfo = app.globalData.userInfo
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: '/pages/appointment/index',
      })
    } else {
      that.authorization.showDialog()
    }
  },
})