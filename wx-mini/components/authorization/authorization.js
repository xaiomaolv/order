// components/authorization/authorization.js
import {
  authUser,
  checkUser
} from '../../api/userInfo.js'
const app = getApp();

Component({
  properties: {
    fanished: {
      type: Boolean,
      value: false
    },

  },
  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    AuthorizedLogin: '授权登录',
    UserPhone: '手机号授权',
    lee: "",
    flag: true,
    // 协议
    agreementChecked: false,
    showAgree: false,
    usersInfo: null
  },
  created() {
    let that = this
    that.agreement = that.selectComponent(".agreement");
  },
  methods: {
    // 隐藏授权弹窗
    hideDialog() {
      this.setData({
        showPopup: false
      })
    },
    //显示授权弹窗
    showDialog() {
      this.setData({
        showPopup: true
      })
    },
    onClose() {
      this.setData({
        showPopup: false
      })
    },
    //注册会员按钮并获取手机号
    getPhoneNumber: function (e) { //这个事件同样需要拿到e
      var that = this
      var ency = e.detail.encryptedData;
      var iv = e.detail.iv;
      var errMsg = e.detail.errMsg
      if (iv == null || ency == null) {
        wx.showToast({
          title: "授权失败,请重新授权！",
          icon: 'none',
        })
        return false
      }
      //把获取手机号需要的参数取到，然后存到头部data里面
      that.setData({
        ency: ency,
        iv: iv,
        errMsg: errMsg
      })
      that.zhuce(); //调用手机号授权事件
    },
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      if (!this.data.agreementChecked) {
        this.showModal('请先阅读协议，并同意')
        return
      }

      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res, '1234567890');
          var that = this
          var ency = res.encryptedData;
          var iv = res.iv;
          // var errMsg = res.errMsg
          let usersInfo = res.userInfo
          if (iv == null || ency == null) {
            wx.showToast({
              title: "授权失败,请重新授权！",
              icon: 'none',
            })
            return false
          }
          that.setData({
            usersInfo: usersInfo
          })
          if (that.data.lee == '') {
            wx.showToast({
                icon: "none",
                title: '请继续点击获取手机号',
              }),
              that.setData({
                showPopup: true,
                flag: (!that.data.flag),
                lee: true
              })
          } else if (!that.data.lee) {
            this.data.showPopup = false
          }
          // that.zhuce(); //调用手机号授权事件
        },
      })
    },
    //手机号授权事件
    //这里提及几个注意事项：
    //1.获取手机号之前，是需要进行登录的，因为必须保证，用户的登录是最新的登录状态
    //才能拿到他的最新的sessionKey，这样授权的时候才不会有问题。
    zhuce: function (e) {
      var that = this;
      var ency = that.data.ency;
      var iv = that.data.iv;
      var errMsg = that.data.errMsg;
      let params = {
        encryptedData: ency,
        iv: iv,
        errMsg: errMsg,
        avatarUrl: this.data.usersInfo.avatarUrl,
        nickName: this.data.usersInfo.nickName
      }
      //判断登录状态
      wx.checkSession({
        success: function () {
          authUser(params).then(res => {
            if (res.code == 200) {
              wx.showToast({
                title: "登录成功",
                icon: 'success',
              })
              app.globalData.userInfo = res.data
              that.setData({
                showPopup: false,
                userStatus: "1"
              })
              app.globalData.userStatus = "1"
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
              })
            }
          })
        },
        fail: function () { //如果失败，就重新登录，并且重新获取手机号
          //登录
          wx.login({
            fail: function (err) {},
            complete: function (msg) {},
            success: function () {
              authUser(params).then(res => {
                if (res.code == 200) {
                  wx.showToast({
                    title: "登录成功",
                    icon: 'success',
                  })
                  app.globalData.userInfo = res.data
                  app.globalData.userStatus = "1"
                  that.setData({
                    showPopup: false,
                    userStatus: "1"
                  })
                }
              })
            }
          })
        }
      })
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
    // 协议查看
    handleAgreement(e) {
      let that = this
      that.agreement.showlog()
      this.setData({
        showAgree: true
      })
    },
    // 协议
    switchAgreement() {
      this.setData({
        agreementChecked: !this.data.agreementChecked
      })
    },
    handConfirm() {
      this.setData({
        showAgree: false
      })
    },
    handCancel() {
      this.setData({
        showAgree: false
      })
    },
  },
})