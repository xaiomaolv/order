// pages/restaurant/addAddress/addAddress.js
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
    form: {
      userName: '',
      // phone: '',
      list: '',
      address: '',
      defFlag: "0"
    },
    region: [],
    customItem: '',
    addFlag: '', //1：新增  2：编辑
    addressInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    console.log(options, 'options');
    // if (options) {
    that.setData({
      addressInfo: JSON.parse(options.item)
    })
    // }

    console.log(that.data.addressInfo, '34567890');
    if (that.data.addressInfo.addFlag == 1) {
      console.log('新增');
      // that.data.form = {}
    } else {
      console.log("编辑");
      that.setData({
        ['form.userName']: that.data.addressInfo.userName,
        // ['form.phone']: that.data.addressInfo.phone,
        ['form.list']: that.data.addressInfo.list,
        region: that.data.addressInfo.list,
        ['form.address']: that.data.addressInfo.address,
        ['form.defFlag']: that.data.addressInfo.defFlag,
        ['form.userAddressId']: that.data.addressInfo.userAddressId,
        // isDefault: that.data.addressInfo.defFlag == "1" ? "true" : "false",
      })
      if (that.data.addressInfo.defFlag == "1") {
        this.setData({
          isDefault: true
        })
      } else {
        this.setData({
          isDefault: false
        })
      }
      console.log(that.data.form, "编辑form");
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  inputChange: function (e) {
    var that = this
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    if (dataset.value) {
      that.data[dataset.obj] = dataset.value
    } else {
      that.data[dataset.obj] = value
    }
    that.setData(that.data)
  },
  // 所在地区
  bindRegionChange: function (e) {
    console.log(e, 'eeeeeeeeeeeee');
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      ["form.list"]: e.detail.value
    })
    console.log(this.data.form, '23456i');
  },
  // 默认地址
  bindchange(e) {
    console.log(e, 'bindchangebindchange');
    this.setData({
      ["form.defFlag"]: e.detail.value == true ? "1" : "0"
    })
    console.log(this.data.form, 'form');
  },
  // 保存
  addAddress() {
    var that = this
    if (!that.data.form.userName) {
      this.showModal('请输入收货人')
      return;
    }
    // if (!that.data.form.phone) {
    //   this.showModal('请输入电话号码')
    //   return;
    // }
    // if (!/^1[3456789]\d{9}$/.test(that.data.form.phone)) {
    //   that.showModal('请填写正确的电话号码')
    //   return;
    // }
    if (!that.data.form.list) {
      this.showModal('请选择所在地区')
      return;
    }
    if (!that.data.form.address) {
      this.showModal('请输入详细地址')
      return;
    }
    this.data.form.userId = app.globalData.userInfo.userId
    // 新增
    if (that.data.addressInfo.addFlag == 1) {
      addAddress(that.data.form).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '新增成功！',
            icon: 'success',
            duration: 1000
          })
          setTimeout(
            function () {
              // addressListFlag 地址管理新增返回 1： 返回送餐列表 2：返回个人中心地址列表
              if (that.data.addressInfo.addressListFlag == 1) {
                wx.redirectTo({
                  url: '/pages/restaurant/addressList/addressList',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/restaurant/addressListUser/addressListUser',
                })
              }
            }, 2000)
        } else {
          wx.showToast({
            title: res.msg,
            icon: '',
            duration: 1000
          })
        }
      })
    }
    // 编辑
    else {
      putAddress(that.data.form).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 1000
          })
          setTimeout(
            function () { //注意function这里不能缺少
              if (that.data.addressInfo.addressListFlag == 1) {
                wx.redirectTo({
                  url: '/pages/restaurant/addressList/addressList',
                })
              } else {
                wx.redirectTo({
                  url: '/pages/restaurant/addressListUser/addressListUser',
                })
              }
            }, 2000)
        }
      })
    }
    console.log(that.data.form, 'formmmmmmmmm');
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