import {
  getActivityList,
  redempDraw, // 抽奖
  getReceiveList, // 用户抽奖记录查询
  getReceiveDetail, // 用户抽奖记录查询
  addReceive, //新增兑换码领取记录
} from '../../api/activity'
// 获取应用实例
const app = getApp()
//计数器
var interval = null;
//值越大旋转时间越长  即旋转速度
var intime = 70;
Page({
  data: {
    resultList: [],
    luckPosition: '',
    drawLuck: true,
    list: [{
        phone: "188****3434",
        name: "抽中10元现金"
      },
      {
        phone: "188****3434",
        name: "抽中30元代金券"
      },
      {
        phone: "188****3434",
        name: "抽中5元现金"
      },
      {
        phone: "188****3434",
        name: "抽中9.5折"
      },
      {
        phone: "188****3434",
        name: "抽中30元代金券"
      },
      {
        phone: "188****3434",
        name: "抽中8.8折"
      },
      {
        phone: "188****3434",
        name: "抽中20元代金券"
      },
      {
        phone: "188****3434",
        name: "抽中2元红包"
      },
      {
        phone: "188****3434",
        name: "抽中20元代金券"
      },
      {
        phone: "188****3434",
        name: "抽中20元代金券"
      },
      {
        phone: "188****3434",
        name: "抽中9.5折"
      },
      {
        phone: "188****3434",
        name: "抽中5元现金"
      },
      {
        phone: "188****3434",
        name: "抽中9.5折"
      },
    ],
    luckImg: '/src/luckDraw/bag.png',
    turnplateList: [],
    draw_count: '1',
    showRule: false,
    activityId: null,
    activityName: null,
    orderId: '',
    activityType:'2', //活动类型 2转盘活动
    activitySeat:'',//活动位置 2：扫码点餐完成后，3：预约点餐完成后
    remark: null,//活动规则,
  },
  // 事件处理函数

  onLoad(options) {
    console.log(options,'options');
    this.setData({
      orderId: options.orderId,
      activitySeat: options.activitySeat
    })

    let params = {
      activityType: '2',
      activitySeat: this.data.activitySeat
      // activitySeat: '3'
    }
    getActivityList(params).then(res => {
      if (res.code == 200) {
        this.setData({
          activityId: res.data.id,
          activityName: res.data.activityName,
          remark:res.data.remark
        })
        res.data.children.forEach(item => {
          item.rouletteType = item.rouletteType
          item.rouletteNo = item.rouletteNo
          item.name = item.rouletteName
          item.status = false
          item.img = app.globalData.imgUrl + item.logo
        })
        this.setData({
          turnplateList: res.data.children
        })
      }
    })


    
  },
  drawLuck() {
    if (this.data.draw_count == 0) {
      wx.showToast({
        title: '您的抽奖次数已经用光了',
        icon: 'none'
      })
      return false
    }
    this.setData({
      drawLuck: false
    })
    let that = this;
    //定时器
    clearInterval(interval)
    var index = 0;
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        that.data.turnplateList[7].status = false
      } else if (index != 0) {
        that.data.turnplateList[index - 1].status = false
      }
      that.data.turnplateList[index].status = true
      that.setData({
        turnplateList: that.data.turnplateList,
      })
      index++;
    }, intime)
    let params = {
      activityId: this.data.activityId,
      userId: app.globalData.userInfo.userId,
      orderId: this.data.orderId
      // userId: 211,
    }
    redempDraw(params).then(res => {
      if (res.code == 200) {
        this.setData({
          luckPosition: res.data.rouletteNo - 1
        })
      }
    })
    //模拟网络请求时间  设为两秒
    var stoptime = 2000;
    setTimeout(function () {
      that.stop(that.data.luckPosition);
    }, stoptime)
  },
  stop: function (which) {
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var turnplateList = e.data.turnplateList;
    for (var i = 0; i < turnplateList.length; i++) {
      if (turnplateList[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;
    e.stopLuck(which, index, intime, 10);
  },
  stopLuck: function (which, index, time, splittime) {
    var that = this;
    //值越大出现中奖结果后减速时间越长
    var turnplateList = that.data.turnplateList;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        turnplateList[7].status = false
      } else if (index != 0) {
        turnplateList[index - 1].status = false
      }
      //当前位置为选中状态
      turnplateList[index].status = true
      that.setData({
        turnplateList: turnplateList,
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        that.stopLuck(which, index, time, splittime);
      } else {
        //1秒后显示弹窗
        setTimeout(function () {
          let turnplateList_info = that.data.turnplateList[which];
          let title = '';
          if (turnplateList_info.rouletteType == 1) {
            title = '恭喜你抽中了' + turnplateList_info.name;
            let resultList = []
            resultList.push(turnplateList_info)
            that.setData({
              resultList: that.data.resultList.concat(resultList)
            })
          } else {
            title = '很遗憾未中奖';
          }
          wx.showModal({
            title: '提示',
            content: title,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                let draw_count = that.data.draw_count;
                draw_count--;
                console.log(draw_count, 'draw_count')
                that.setData({
                  drawLuck: true,
                  luckPosition: 0,
                  draw_count: draw_count
                })
              }
            }
          })
        }, 1000);
      }
    }, time);
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  showRules() {
    wx.showModal({
      title: '抽奖规则',
      content: this.data.rulesDetail,
      showCancel: false,
      success: function (res) {
        this.setData({
          showRule: false
        })
      }
    })
  },
  goBackIndex(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  }
})