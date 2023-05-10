// pages/numberDinner/index.js
import {
  getStoreInfo,
  addDiningNum
} from '../../api/cart'
import {
  authUser,
  checkUser
} from '../../api/userInfo'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userStatus: null,
    mealTime: '',
    mealMethod: '',
    mealNum: 1,
    orderType: 0,
    orderMethod: '',
    tableNo: '',
    tableId: null,
    storeInfo: null,
    showOrder: true, //点餐展示
  },

  onLoad: function (query) {
    console.log('小程序扫码---：' + query.tableId)
    var tableId = query.tableId;
    this.setData({
      tableId: tableId,
      userStatus: app.globalData.userStatus
    })
  },

  onChange(event) {
    this.setData({
      mealNum: event.detail
    })
  },
  getInfo: function () {
    let tableId = this.data.tableId
    getStoreInfo(tableId).then(res => {
      if (res.code == 200) {
        // data是100 商家未营业
        if (res.data == 100) {
          this.setData({
            showOrder: true
          })
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            confirmColor: '#C83C3C',
            confirmText: '返回首页',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/home/home',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          this.setData({
            showOrder: false,
            storeInfo: res.data
          })
        }
      }
    })
  },


  toOrder: function () {
    if (this.data.mealNum < 1) {
      wx.showToast({
        title: '请选择用餐人数',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.data.storeInfo.mealNum = this.data.mealNum
      this.data.storeInfo.orderSource = '2'
      let params = {
        tableId: this.data.storeInfo.tableId,
        diningNum: this.data.mealNum
      }
      // addDiningNum(params).then(res => {})
      wx.navigateTo({
        url: '../cart/cart?storeInfo=' + JSON.stringify(this.data.storeInfo)
      })
    }

  },

  onShow: function () {
    let that = this
    that.authorization = that.selectComponent(".authorization");
    that.setData({
      storeInfo: {}
    })
    checkUser().then(res => {
      if (res.code == 200) {
        app.globalData.userStatus = res.data.userStatus
        app.globalData.userInfo = res.data
        that.setData({
          userStatus: res.data.userStatus
        })
        let userInfo = app.globalData.userInfo
        let userStatus = that.data.userStatus
        if (that.data.userStatus == "1") {
          that.authorization.hideDialog()
          that.getInfo()
        } else {
          that.authorization.showDialog()
        }
      }
    })
  },
})