// pages/appointment/index.js
const app = getApp()
const myDate = new Date();
const days = [];
const hours = [];
const minutes = [];
const wk = myDate.getDay();
const yy = String(myDate.getFullYear());
const mm = myDate.getMonth() + 1;
const dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
const hou = myDate.getHours();
const min = myDate.getMinutes();
const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const mines = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const week = weeks[wk];

//获取今天
days.push('今天(' + week + ')')

//获取小时
if (min + 15 > 45) {
  for (let i = hou + 1; i < 24; i++) {
    if (i < 10) {
      i = "0" + i;
    }
    hours.push("" + i);
  }
} else {
  for (let i = hou; i < 24; i++) {
    if (i < 10) {
      i = "0" + i;
    }
    hours.push("" + i);
  }
}

if (min < 41) {
  mines.forEach(ele => {
    if (ele > min + 15) {
      minutes.push(ele)
    }
  });
} else {
  mines.forEach(ele => {
    minutes.push(ele)
  });
}

import {
  addResverse
} from "../../api/order"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeInfo: {},
    userId: '',
    mealTime: '',
    mealMethod: '', //就餐方式（1.堂食，2.外带）
    mealPerson: 1, //就餐人数
    // orderType: 1,
    orderMethod: '',
    userName: '',
    userSex: '',
    userPhone: '',
    orderType: '', //是否提前点餐 0：否 1：是
    rules: {
      mealTime: [{
        required: true,
        msg: '请选择用餐时间'
      }],
      mealMethod: [{
        required: true,
        msg: '请选择用餐方式'
      }],
      mealPerson: [{
        required: true,
        msg: '请选择用餐人数'
      }],
      userName: [{
        required: true,
        msg: '请输入联系人姓名'
      }],
      userSex: [{
        required: true,
        msg: '请选择性别'
      }],
      userPhone: [{
        required: true,
        msg: '请输入联系电话'
      }]
    },

    showTime: false,
    showMethod: false,
    multiArray: [days, hours, minutes],
    multiIndex: [],
    array: [{
      name: '堂食'
    }, {
      name: '外带'
    }],
    choose_year: '',
    showSubmit: true
  },

  getUnixToDate(format, str) {
    var oTime = null;
    var oDate = new Date(parseInt(str)),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSec = oDate.getSeconds();
    // if (format == 'yyyy-mm-dd HH:MM') {
    oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin); //最后拼接时间
    // } else if (format == 'yyyy/mm/dd') {
    //   oTime = oYear + '/' + this.getzf(oMonth) + '/' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSec); //最后拼接时间
    // }
    return oTime;
  },

  //补0操作  
  getzf(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },

  //打开时间控件
  checkDate() {
    var that = this;
    that.setData({
      showTime: true
    })
  },

  //用餐人数
  changeNum(event) {
    this.setData({
      mealPerson: event.detail
    })
  },

  //获取输入内容
  bindKeyInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },

  //获取输入内容
  bindNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //获取性别
  sexChange(event) {
    this.setData({
      userSex: event.detail,
    });
  },

  //点单
  toOrder() {
    wx.navigateTo({
      url: '../cart/cart'
    })
  },

  onChange(event) {
    this.setData({
      orderMethod: event.detail,
    });
  },

  appointment(e) {
    let that = this
    if (!that.data.mealTime) {
      wx.showToast({
        title: '请选择用餐时间',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!that.data.userPhone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!/^1[3456789]\d{9}$/.test(that.data.userPhone)) {
      wx.showToast({
        title: '请填写正确的电话号码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!that.data.userName) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!that.data.userSex) {
      wx.showToast({
        title: '请选择女士、先生',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // orderSource  订单来源   2-扫码点餐  3-预约  
    that.data.storeInfo.mealTime = that.data.mealTime
    that.data.storeInfo.userPhone = that.data.userPhone
    that.data.storeInfo.mealNum = that.data.mealPerson
    that.data.storeInfo.userId = that.data.userId
    that.data.storeInfo.reserveName = that.data.userName + that.data.userSex,
      this.data.storeInfo.orderSource = '3'
    that.setData({
      storeInfo: that.data.storeInfo,
      showSubmit: false
    })
    let param = {
      "searchValue": "",
      "createBy": "",
      "createTime": "",
      "updateBy": "",
      "updateTime": "",
      "remark": "",
      "params": {},
      "reserveId": '',
      "businessId": that.data.storeInfo.businessId, //商家id
      "orderType": '0', //** 是否提前点餐  0 否 1. 是*/
      "userId": that.data.userId, //用户id
      "reserveName": that.data.userName + that.data.userSex,
      "userPhone": that.data.userPhone, //用户电话
      "isDeposit": "0", //** 是否已交订金  0 未交 1. 已交*/
      "deposit": 0, //预约定金金额
      "mealTime": that.data.mealTime, //就餐时间
      "mealPerson": that.data.mealPerson, //就餐人数
      "tableId": '', //桌号
      "reserveTime": "", //桌子预留时间（预约成功后，当顾客超过就餐时间未到，保留15分钟桌子时间) 
      "reserveCode": "",
      "status": ""
    }
    addResverse(param).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          mealTime: null,
          mealPerson: null,
          orderMethod: null,
          showSubmit: true
        });
        setTimeout(
          function () { //注意function这里不能缺少
            wx.reLaunch({
              url: '/pages/home/home',
            })
          }, 2000)
      }
    })
    // orderAhead 是否支持提前点餐 0否 1是
    // if (that.data.storeInfo.orderAhead == '1') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '是否提前点餐？',
    //     confirmText: '是',
    //     cancelText: '否',
    //     success: function (res) {
    //       if (res.confirm) { //这里是点击了确定以后
    //         that.setData({
    //           ['storeInfo.orderType']: '1',
    //           showSubmit: true
    //         })
    //         let value = JSON.stringify(that.data.storeInfo)
    //         wx.navigateTo({
    //           url: '/pages/cart/cart?storeInfo=' + value
    //         })
    //       } else { //这里是点击了取消以后
    //         let param = {
    //           "searchValue": "",
    //           "createBy": "",
    //           "createTime": "",
    //           "updateBy": "",
    //           "updateTime": "",
    //           "remark": "",
    //           "params": {},
    //           "reserveId": '',
    //           "businessId": that.data.storeInfo.businessId, //商家id
    //           "orderType": '0', //** 是否提前点餐  0 否 1. 是*/
    //           "userId": that.data.userId, //用户id
    //           "reserveName": that.data.userName + that.data.userSex,
    //           "userPhone": that.data.userPhone, //用户电话
    //           "isDeposit": "0", //** 是否已交订金  0 未交 1. 已交*/
    //           "deposit": 0, //预约定金金额
    //           "mealTime": that.data.mealTime, //就餐时间
    //           "mealPerson": that.data.mealPerson, //就餐人数
    //           "tableId": '', //桌号
    //           "reserveTime": "", //桌子预留时间（预约成功后，当顾客超过就餐时间未到，保留15分钟桌子时间) 
    //           "reserveCode": "",
    //           "status": ""
    //         }
    //          // depositFlag 是否设置定金 0否 1是
    //         if (that.data.storeInfo.depositFlag == 0) {
    //           addResverse(param).then(res => {
    //             if (res.code == 200) {
    //               wx.showToast({
    //                 title: '预约成功',
    //                 icon: 'success',
    //                 duration: 2000
    //               });
    //               that.setData({
    //                 mealTime: null,
    //                 mealPerson: null,
    //                 orderMethod: null,
    //                 showSubmit: true
    //               });
    //               setTimeout(
    //                 function () { //注意function这里不能缺少
    //                   wx.reLaunch({
    //                     url: '/pages/index/index',
    //                   })
    //                 }, 2000)
    //             }
    //           })
    //         } else {
    //           wx.showModal({
    //             title: '提示',
    //             content: `提前预约需缴纳保证金${that.data.storeInfo.reserverDeposit}元，是否缴纳？`,
    //             confirmText: '是',
    //             cancelText: '否',
    //             success: function (res) {
    //               if (res.confirm) { //这里是点击了确定以后
    //                 addResverse(param).then(res => {
    //                   if (res.code == 200) {
    //                     wx.showToast({
    //                       title: '预约成功',
    //                       icon: 'success',
    //                       duration: 2000
    //                     });
    //                     that.setData({
    //                       mealTime: null,
    //                       mealPerson: null,
    //                       orderMethod: null,
    //                       showSubmit: true
    //                     });
    //                     setTimeout(
    //                       function () { //注意function这里不能缺少
    //                         wx.reLaunch({
    //                           url: '/pages/index/index',
    //                         })
    //                       }, 2000)
    //                   }
    //                 })
    //               } else{
    //                 that.setData({
    //                   showSubmit: true
    //                 })
    //               }
    //             }
    //           })
    //         }
    //       }
    //     }
    //   })
    // } else {
    //   let param = {
    //     "searchValue": "",
    //     "createBy": "",
    //     "createTime": "",
    //     "updateBy": "",
    //     "updateTime": "",
    //     "remark": "",
    //     "params": {},
    //     "reserveId": '',
    //     "businessId": that.data.storeInfo.businessId, //商家id
    //     "orderType": '0', //** 是否提前点餐  0 否 1. 是*/
    //     "userId": that.data.userId, //用户id
    //     "reserveName": that.data.userName + that.data.userSex,
    //     "userPhone": that.data.userPhone, //用户电话
    //     "isDeposit": "0", //** 是否已交订金  0 未交 1. 已交*/
    //     "deposit": 0, //预约定金金额
    //     "mealTime": that.data.mealTime, //就餐时间
    //     "mealPerson": that.data.mealPerson, //就餐人数
    //     "tableId": '', //桌号
    //     "reserveTime": "", //桌子预留时间（预约成功后，当顾客超过就餐时间未到，保留15分钟桌子时间) 
    //     "reserveCode": "",
    //     "status": ""
    //   }
    //   // depositFlag 是否设置定金 0否 1是
    //   if (that.data.storeInfo.depositFlag == 0) {
    //     addResverse(param).then(res => {
    //       if (res.code == 200) {
    //         wx.showToast({
    //           title: '预约成功',
    //           icon: 'success',
    //           duration: 2000
    //         });
    //         that.setData({
    //           mealTime: null,
    //           mealPerson: null,
    //           orderMethod: null,
    //           showSubmit: true
    //         });
    //         setTimeout(
    //           function () { //注意function这里不能缺少
    //             wx.reLaunch({
    //               url: '/pages/index/index',
    //             })
    //           }, 2000)
    //       }
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: `提前预约需缴纳保证金${that.data.storeInfo.reserverDeposit}元，是否缴纳？`,
    //       confirmText: '是',
    //       cancelText: '否',
    //       success: function (res) {
    //         if (res.confirm) { //这里是点击了确定以后
    //           addResverse(param).then(res => {
    //             if (res.code == 200) {
    //               wx.showToast({
    //                 title: '预约成功',
    //                 icon: 'success',
    //                 duration: 2000
    //               });
    //               that.setData({
    //                 mealTime: null,
    //                 mealPerson: null,
    //                 orderMethod: null,
    //                 showSubmit: true
    //               });
    //               setTimeout(
    //                 function () { //注意function这里不能缺少
    //                   wx.reLaunch({
    //                     url: '/pages/index/index',
    //                   })
    //                 }, 2000)
    //             }
    //           })
    //         } else {
    //           that.setData({
    //             showSubmit: true
    //           })
    //         }
    //       }
    //     })
    //   }
    // }
  },

  onConfirmDate(event) {
    var mealTime = this.getUnixToDate('yyyy-mm-dd HH:MM', event.detail)
    this.setData({
      mealTime: mealTime,
    });
    this.onCancelDate();
  },

  onCancelDate(event) {
    var that = this;
    that.setData({
      showTime: false
    })
  },

  //选择就餐方式
  onSelect(event) {
    var mealMethod = event.detail.name
    this.setData({
      mealMethod: mealMethod
    })
  },

  onClose() {
    this.setData({
      showMethod: false
    });
  },


  onLoad: function (options) {
    this.setData({
      storeInfo: JSON.parse(options.item),
      userId: app.globalData.userInfo.userId
    })
    console.log(this.data.userId, 'udrtID');
    console.log(this.data.storeInfo, 'storeInfo');
  },

  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (data.multiIndex[1]) {
      case 0:
        data.multiArray[2] = minutes
        break
      default:
        data.multiArray[2] = mines
        break
    }
    data.multiIndex[0] = 0
    // data.multiIndex[1] = 0
    // data.multiIndex[2] = 0
    console.log(data.multiIndex);
    this.setData(data);
  },

  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e)
    let day = this.data.multiArray[0][e.detail.value[0]];
    let hour = e.detail.value[1] ? this.data.multiArray[1][e.detail.value[1]] : this.data.multiArray[1][0]
    let min = e.detail.value[2] ? this.data.multiArray[2][e.detail.value[2]]:this.data.multiArray[2][0]
    this.setData({
      mealTime: day + hour + ':' + min
    })
    // let res=this.data.multiArray.map((item,index)=>{
    //   return item[e.detail.value[index]];
    // })
    // this.setData({
    //   mealTime:res.join('-')
    // })
  },

})