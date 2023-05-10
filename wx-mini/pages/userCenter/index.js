import {
  authUser,
  checkUser
} from '../../api/userInfo'
// 获取应用实例
const app = getApp()
Page({
  data: {
    userStatus: null,
    userId: '',
    motto: '登录',
    userInfo: {},
    usersInfo: {},
    userListInfo: [
      {
        icon: '/src/userCenter/order.png',
        text: '我的订单',
        url: '/pages/order/orderIndex/index'
      },
      {
        icon: '/src/index/order3.png',
        text: '预约记录',
        url: '/pages/appointList/index'
      },
      {
        icon: '/src/userCenter/coupon.png',
        text: '优惠券',
        url: '/pages/coupon/coupon'
      },
      {
        icon: '/src/userCenter/collection.png',
        text: '店铺收藏',
        url: '../chooseRestaurant/index?active=1'
      },
      // {
      //   icon: '/src/userCenter/address.png',
      //   text: '地址管理',
      //   url: '/pages/restaurant/addressListUser/addressListUser'
      // },
      //  {
      //   icon: '/src/userCenter/contact.png',
      //   text: '联系客服',
      //   url: ''
      // }, {
      //   icon: '/src/userCenter/question.png',
      //   text: '常见问题',
      //   url: ''
      // }
    ],
    // 协议
    agreement: false,
    showAgree: false
  },
  onShow() {
    let that = this
    that.authorization = that.selectComponent(".authorization");
    checkUser().then(res => {
      if (res.code == 200) {
        app.globalData.userStatus = res.data.userStatus
        app.globalData.userInfo = res.data
        if (res.data.userStatus == "1") {
          that.authorization.hideDialog()
        }
        that.setData({
          userStatus: res.data.userStatus,
          userInfo: res.data,
        })
      }
    })
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
      userStatus: app.globalData.userStatus
    })
  },

  openURL(e) {
    let that = this
    let item = e.currentTarget.dataset.value
    let url = item.url
    if (that.data.userStatus == "1") {
      wx.navigateTo({
        url: item.url,
      })
    } else {
      that.authorization.showDialog()
    }

  },
  showModal(msg) {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {

        }
      }
    })
  },
})