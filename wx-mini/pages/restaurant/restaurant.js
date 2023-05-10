import {
  collect,
  deleteCollect,
  getStoreDetail
} from "../../api/store"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessId: null,
    userId: null,
    storeInfo: {},
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
    colleStatus: '',
    dateNow: null,
    enableDelivery: false, //是否送餐上门
  },
  // 判断是否是当天时间
  isToday(date) {
    var d = new Date(date.toString().replace(/-/g, "/"));
    var todaysDate = new Date();
    if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  },
  //获取店铺详情
  getStoreInfo() {
    this.setData({
      storeInfo: {}
    })
    let storeId = this.data.businessId
    let userId = app.globalData.userInfo.userId
    let params = {
      "businessId": storeId,
      "userId": userId
    }
    getStoreDetail(params).then(res => {
      if (res.code == 200) {
        if (res.data.mealTime) {
          this.data.dateNow = this.isToday(res.data.mealTime)
          // this.data.dateNow = new Date(Number(res.data.mealTime)* 1000) < new Date()
        }
        this.setData({
          storeInfo: res.data,
          colleStatus: res.data.colleStatus,
          enableDelivery: res.data.enableDelivery
        })
      }
    })
  },

  //收藏
  collect() {
    let that = this
    let status = that.data.colleStatus
    let storeId = that.data.businessId
    let userId = app.globalData.userInfo.userId
    let params = {
      "businessesId": storeId,
      "userId": userId
    }
    if (status == "0") {
      collect(params).then(res => {
        if (res.code == 200) {
          // that.getStoreInfo();
          this.setData({
            colleStatus: "1"
          })
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    } else {
      deleteCollect(params).then(res => {
        if (res.code == 200) {
          // that.getStoreInfo();
          this.setData({
            colleStatus: "0"
          })
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
  },

  //预约就餐 
  subscribe(e) {
    if (this.data.storeInfo.businessStatus == "1") {
      let item = JSON.stringify(e.currentTarget.dataset.value)
      wx.navigateTo({
        url: '/pages/appointment/index?item=' + item,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '该商家暂不营业',
      })
    }
  },
  // 送餐上门
  // flag 进入地址管理 1:送餐上门  2:个人中心
  homeService(e) {
    if (this.data.storeInfo.businessStatus == "1") {
      // console.log(e.currentTarget.dataset.value, 'e.currentTarget.dataset.value');
      let item = JSON.stringify(e.currentTarget.dataset.value)
      app.globalData.storeInfo = e.currentTarget.dataset.value
      let str = e.currentTarget.dataset.value.enableAddress
      // 店家设置地址
      if (str == true) {
        wx.navigateTo({
          url: '/pages/restaurant/addressDelivery/addressDelivery?item=' + item,
        })
      }
      // 用户自设地址
      else if (str == false || str == null || str == '') {
        wx.navigateTo({
          url: '/pages/restaurant/addressList/addressList?item=' + item,
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '该商家暂不营业',
      })
    }
  },

  //扫码
  scanner() {
    if (this.data.storeInfo.businessStatus == '1') {
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
      wx.showToast({
        icon: 'none',
        title: '该商家暂不营业',
      })
    }
  },
  // 拨打电话
  callPhone(e) {
    let mobile = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  // 看看菜单
  menuView(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './menuView/index?storeInfo=' + JSON.stringify(this.data.storeInfo)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      this.setData({
        businessId: JSON.parse(options.item).businessId,
        userId: app.globalData.userInfo.userId
      })
    }
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
    this.setData({
      storeInfo: {}
    })
    this.getStoreInfo()
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