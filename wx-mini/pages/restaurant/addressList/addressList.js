// pages/restaurant/addressList/addressList.js
import {
  getAddressList,
  addAddress,
  putAddress,
  delAddress
} from "../../../api/address.js"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {},
    userId: '',
    addressList: [], //用户设置送餐上门地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, 'options');
    // if (Object.keys(options).length != 0) {
      // this.setData({
      //   storeInfo: JSON.parse(options.item)
      // })
      this.setData({
        storeInfo:app.globalData.storeInfo
      })
      this.data.storeInfo.userId = app.globalData.userId
      
      console.log(this.data.storeInfo,'678[]');
    // }

  },
  // 地址列表
  getAddressList() {
    this.setData({
      userId: app.globalData.userInfo.userId,
    })
    // 用户自设地址列表
    getAddressList(this.data.userId).then(res => {
      this.setData({
        addressList: res.rows
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAddressList()
  },
  // 编辑
  // addFlag 1： 新增 2：编辑 
  // addressListFlag 地址管理新增返回 1： 返回送餐列表 2：返回个人中心地址列表
  editAddress(e) {
    let item1 = e.currentTarget.dataset.value
    item1.addFlag = 2,
    item1.addressListFlag = 1,
    console.log(item1,'12345678');
    let obj = Object.assign(item1,this.data.storeInfo)
    let item = JSON.stringify(obj)
    wx.redirectTo({
      url: '/pages/restaurant/addAddress/addAddress?item=' + item,
    })
  },
  // 删除
  deleteAddress(e) {
    let item = e.currentTarget.dataset.value
    delAddress(item.userAddressId).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
          duration: 1000
        })
        this.getAddressList()
      }
    })
  },
  // 送到地址选择
  chooseAddress(e) {
    let item1 = e.currentTarget.dataset.value
    console.log(item1,'123456789');
    // let obj = Object.assign(item1, this.data.storeInfo);
    let obj = this.data.storeInfo
    let province = item1.list[0]
    let city = item1.list[1]
    let area = item1.list[2]
    let address = item1.address
    // 送餐地址
    obj.deliveryAddress = province + city + area + address
    // 联系电话
    obj.customerPhone = item1.phone
    obj.customerName = item1.userName
    obj.mealNum = 1
    obj.userId = app.globalData.userInfo.userId
    obj.orderType = '2' // orderType:2 送餐订单
    console.log(obj,'123456');
    // let storeInfo = app.globalData.storeInfo
    // console.log(storeInfo,'storeInfo');
    // let tt = Object.assign(obj,storeInfo)
    let item = JSON.stringify(obj)
    console.log(obj, '送到地址');
    wx.navigateTo({
      url: '/pages/cart/cart?storeInfo=' + item,
    })
    
  },
  // 默认地址设置
  setAddress(e) {
    let item = e.currentTarget.dataset.value
    let params = {
      userId: app.globalData.userInfo.userId,
      defFlag: "1",
      userAddressId: item.userAddressId
    }
    putAddress(params).then(res => {
      console.log(res, '1234567890');
      if (res.code == 200) {
        wx.showToast({
          title: '设置成功！',
          icon: 'success',
          duration: 1000
        })
        this.getAddressList()
      }
    })
  },
  // 新增地址
  // addFlag 1： 新增 2：编辑
  // addressListFlag 地址管理新增返回 1： 返回送餐列表 2：返回个人中心地址列表
  addAddress() {
    let item1 = {
      addFlag: 1,
      addressListFlag:1
    }
    let obj = Object.assign(item1,this.data.storeInfo)
    let item = JSON.stringify(obj)
    wx.redirectTo({
      url: '/pages/restaurant/addAddress/addAddress?item=' + item,
    })
  },
})