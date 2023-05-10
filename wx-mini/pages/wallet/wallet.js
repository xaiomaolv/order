//index.js
//获取应用实例
// import {
//   getEntity
// } from '../../api/entity'
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wallet: true,
    info: {
      custName: '',
      openStatus: '',
      mediumId: '',
      bindMedium: '',
      accountBalance: '',
      holdBalance: '',
      trxDate: ''
    },
    wallet:{}
  },
  onLoad: function () {
    // getEntity("WalletDetail").method.detail().then(res => {
    //   if (res.code = 200) {
    //     let mediumId = 'info.mediumId';
    //     app.globalData.mediumId = res.data.mediumId
    //     this.setData({
    //       info: res.data,
    //       [mediumId]: res.data.mediumId,
    //       ['wallet.cert_no']:res.data.certNo,
    //       ['wallet.cust_name']:res.data.custName,
    //       ['wallet.mobile_no']:res.data.mobileNo,
    //     })
    //   }
    // })
  },

  onShow: function () {

  },

  detail() {
    // 记录
    wx.navigateTo({
      url: './detail/detail',
    })
  },

  open(e) {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
      }
    })

    if (e.detail.encryptedData) {
      app.globalData.phone = e.detail
      wx.login({
        success(res) {
          if (res) {
            app.globalData.code = res.code
            // 开户
            wx.navigateTo({
              url: './open/open'
            })
          }
        }
      })
    }
  },

  charge() {
    // 充值
    wx.navigateTo({
      url: './charge/charge',
    })
  },

  cash() {
    // 提现
    wx.navigateTo({
      url: './cash/cash',
    })
  },

  record() {
    wx.navigateTo({
      url: './record/record',
    })
  },
  transDetail() {
    wx.navigateTo({
      url: './transDetail/transDetail',
    })
  },
  // 改绑
  bind() {
    wx.navigateTo({
      url: './cardlist/cardlist?wallet=' + JSON.stringify(this.data.wallet),
    })
  },
  cardNo(val) {
    return val.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "$1**** **** **** $2")
  }
})