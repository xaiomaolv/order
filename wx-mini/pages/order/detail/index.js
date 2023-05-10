import {
  getOrderDetail
} from '../../../api/order'
var app = getApp()
Page({
  data: {
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
    orderId: '',
    orderInfo: {},
    showMore: false, //展开收缩
  },
  //展开收缩
  listToggle: function () {
    this.setData({
      showMore: !this.data.showMore
    })
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
  },

  //点单
  toAddCart() {
    let item = JSON.stringify(this.data.orderInfo)
    if (this.data.orderInfo.orderStatus < 50) {
      wx.navigateTo({
        url: '/pages/addCart/addCart?item=' + item
      })
    }
  },

  //获取订单详情
  getOrderInfo() {
    let orderId = this.data.orderId
    getOrderDetail(orderId).then(res => {
      if (res.code == 200) {
        if (res.data.mealFee > 0) {
          res.data.mealFeeTotal = res.data.mealFee * res.data.diningNum
        }
        this.setData({
          orderInfo: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      orderInfo: {}
    })
    this.getOrderInfo()
  },
   // 联系商家付款
   calPay() {
    wx.showToast({
      title: '请联系商家支付订单哦!',
      icon: 'none',
      duration: 2000
    })
  },
  // 外送联系商家付款
  callPay(e) {
    let mobile = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  }
})