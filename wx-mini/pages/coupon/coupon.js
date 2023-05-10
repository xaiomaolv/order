// pages/coupon/coupon.js
import {
  getActivityList,
  redempDraw, // 抽奖
  getReceiveList, // 用户抽奖记录查询
  getReceiveDetail, // 用户抽奖记录查询
  addReceive, //新增兑换码领取记录
} from '../../api/activity'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['有效', '已失效'],
    currentTab: 0,
    hadcouponList: [],
    couponList: [
      // {
      //   id: 1,
      //   title: "5元",
      //   detail: "满30-5元",
      //   indate: "2022-04-08"
      // },
      // {
      //   id: 2,
      //   title: "3元",
      //   detail: "满25-3元",
      //   indate: "2022-04-05"
      // },
      // {
      //   id: 3,
      //   title: "2元",
      //   detail: "满20-2元",
      //   indate: "2022-04-05"
      // },
      // {
      //   id: 4,
      //   title: "5元",
      //   detail: "满30-5元",
      //   indate: "2022-04-08"
      // },
      // {
      //   id: 5,
      //   title: "6元",
      //   detail: "满45-6元",
      //   indate: "2022-04-08"
      // }
    ],
  },

  toCart: function () {
    wx.showToast({
      title: '此功能暂不开放!',
      icon: 'error',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // tab切换
  currentTab: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.getTab(this.data.currentTab)
  },
  getTab(tab) {
    if (tab == 0) {
      let params = {
        status: '0',
        userId: app.globalData.userInfo.userId,
        // userId: 211,
      }
      getReceiveList(params).then(res => {
        if (res.code == 200) {
          this.setData({
            couponList: res.rows
          })
        }
      })
    } else {
      let params = {
        status: '1',
        userId: app.globalData.userInfo.userId,
        // userId: 211,
      }
      getReceiveList(params).then(res => {
        if (res.code == 200) {
          this.setData({
            hadcouponList: res.rows
          })
        }
      })
    }
  },
  onShow: function () {
    this.getTab(this.data.currentTab)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})