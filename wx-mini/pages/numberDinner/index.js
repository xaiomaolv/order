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
    mealTime: '',
    mealMethod: '',
    mealNum: 1,
    orderType: 0,
    orderMethod: '',
    tableNo: '',
    tableId: null,
    storeInfo: null,
    userStatus: null,
    showOrder: true, //点餐展示
  },

  onLoad: function (query) {
    var tableId = null
    const q = decodeURIComponent(query.q) // 获取到二维码原始链接内容      
    var index = q.lastIndexOf("\=") //获取-后边的字符串
    tableId = q.substring(index + 1, q.length)
    console.log('直接扫码---' + q + '---tableId-:' + tableId)
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
    console.log('直接扫码开始查询店铺信息')
    let tableId = this.data.tableId
    getStoreInfo(tableId).then(res => {
      console.log('直接扫码获取店铺信息：' + JSON.stringify(res))
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
    // 判断是否登录
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