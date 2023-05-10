import {
  addEvaluate,
  uploadImg
} from '../../../api/order'
const app = getApp()

Page({
  data: {
    imgs: [],
    count: 3,
    //图片访问地址
    imgUrl: app.globalData.imgUrl,
    userId: null,
    orderInfo: {},
    loading: 1,
    evaluateStars: 0,
    userStars2: 4,
    userStars3: 0,
    files: [],
    countPic: 9, //上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名
    uploadImgUrl: [], //图片的上传路径
    upId: '',
    upIdDisabled: false,
    form: {
      content: '',
      likeCount: 0,
    },
    rules: {
      content: [{
        required: true,
        msg: '请输入评价内容'
      }]
    }
  },

  bindUpload: function (e) {
    switch (this.data.imgs.length) {
      case 0:
        this.data.count = 3
        break
      case 1:
        this.data.count = 2
        break
      case 2:
        this.data.count = 1
        break
    }
    var that = this
    wx.chooseImage({
      count: that.data.count, // 默认3
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.imgUpload,
            // url: 'https://yn.icbc.com.cn/corp/api2/redc/image/upload',
            filePath: tempFilePaths[i],
            name: "file",
            header: {
              "content-type": "multipart/form-data"
            },
            success: function (res) {
              if (res.statusCode == 200) {
                wx.showToast({
                  title: "上传成功",
                  icon: "none",
                  duration: 1500
                })
                that.data.imgs.push(JSON.parse(res.data).data.fileName)
                that.setData({
                  imgs: that.data.imgs
                })
              }
            },
            fail: function (err) {
              wx.showToast({
                title: "上传失败",
                icon: "none",
                duration: 2000
              })
            },
            complete: function (result) {
              console.log(result.errMsg)
            }
          })
        }
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var that = this
    wx.showModal({
      title: "提示",
      content: "是否删除",
      success: function (res) {
        if (res.confirm) {
          for (var i = 0; i < that.data.imgs.length; i++) {
            if (i == e.currentTarget.dataset.index) that.data.imgs.splice(i, 1)
          }
          that.setData({
            imgs: that.data.imgs
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      orderInfo: JSON.parse(options.item),
      userId: app.globalData.userInfo.userId
    })
  },

  bindTextAreaBlur: function (e) {
    this.setData({
      ['form.content']: e.detail.value
    })
  },

  //图片上传
  afterReadS(file) {
    compressImage(file.content).then(result => {
      file.status = "uploading";
      file.message = "上传中...";
      const formData = new FormData();
      if (result.size > file.file.size) {
        //压缩后比原来更大，则将原图上传
        formData.append("file", file.file, file.file.name);
        //
      } else {
        //压缩后比原来小，上传压缩后的
        formData.append("file", result, file.file.name);
      }
      uploadImg(formData)
        .then(res => {
          if (res.code == 200) {
            this.data.res.data.fileName.push(res.data.fileName);
            file.status = "success";
            file.message = "上传成功";
          }
        })
        .catch(err => {
          file.status = "failed";
          file.message = "上传失败";
        });
    });
  },

  // 添加图片
  chooseImage: function (e) {
    var that = this;
    var images = that.data.files;
    wx.chooseImage({
      count: 6 - images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },
  //长按图片删除
  deleteImage: function (e) {
    var that = this;
    var images = that.data.files;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '醒购提醒',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          images.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          files: images
        });
      }
    })
  },
  // 商品星星评价
  onChange1(event) {
    this.setData({
      evaluateStars: event.detail,
    });
  },
  // 卖家服务星星评价
  onChange2(event) {
    this.setData({
      userStars2: event.detail,
    });
  },

  // // 口味评价
  onChange3(event) {
    this.setData({
      userStars3: event.detail,
    });
  },
  //提交评价
  submitEvaluate() {
    let params = {
      "searchValue": null,
      "createBy": null,
      "createTime": null,
      "updateBy": null,
      "updateTime": null,
      "remark": null,
      "params": {},
      "commentId": null,
      "productId": null,
      "userId": this.data.userId,
      "userName": null,
      "avatar": null,
      "orderId": this.data.orderInfo.orderId,
      "star": this.data.evaluateStars,
      "content": this.data.form.content,
      "commentImageList": this.data.imgs,
      "goodCount": this.data.orderInfo.productNum,
      "type": null,
      "status": null,
      "delFlag": null,
      "businessId": this.data.orderInfo.businessesId
    }
    addEvaluate(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: res.msg
        })

        setTimeout(
          function () { //注意function这里不能缺少
            wx.reLaunch({
              url: '/pages/home/home',
            })
          }, 2000)

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error'
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

  //监听事件，返回的结果
  myEventListener: function (e) {
    console.log("上传的图片结果合集：")
    console.log(e.detail.picsList)
  }
});