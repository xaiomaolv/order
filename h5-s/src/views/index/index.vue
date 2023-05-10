<template>
  <van-row class="container bg-w">
    <van-row class="header">
      <van-row class="company-name ft-se-20">彩云点餐商家版</van-row>
      <van-row class="line"></van-row>
    </van-row>

    <van-row justify="center" class="van-content">
      <van-grid column-num="3" square gutter="2">
        <!-- <van-grid-item
          class="bx-sd"
          v-for="(item, index) in cardList"
          :key="index"
          link-type="navigateTo"
          @click="toPath(item.path)"
        >
        <template #text>
            <span class="ft-se-16">{{item.title}}</span>
        </template>

          <template #icon>
            <van-icon :name="item.iconName" color="rgb(200, 60, 60)" size="50px"/>
          </template>
        </van-grid-item> -->
        <van-grid-item class="bx-sd" to="storeSetting">
          <template #text>
            <span class="ft-se-16">门店信息</span>
          </template>

          <template #icon>
            <van-icon name="setting" color="rgb(200, 60, 60)" size="50px" />
          </template>
        </van-grid-item>
        <van-grid-item class="bx-sd" to="foodTypeList">
          <template #text>
            <span class="ft-se-16">菜品分类</span>
          </template>

          <template #icon>
            <van-icon name="cluster" color="rgb(200, 60, 60)" size="50px" />
          </template>
        </van-grid-item>
        <van-grid-item class="bx-sd" to="dishesList">
          <template #text>
            <span class="ft-se-16">菜单管理</span>
          </template>

          <template #icon>
            <van-icon
              name="shop-collect"
              color="rgb(200, 60, 60)"
              size="50px"
            />
          </template>
        </van-grid-item>
        <van-grid-item class="bx-sd" to="orderList" :badge="toOrderCount">
          <template #text>
            <span class="ft-se-16">订单中心</span>
          </template>

          <template #icon>
            <van-icon name="bars" color="rgb(200, 60, 60)" size="50px" />
          </template>
        </van-grid-item>
        <van-grid-item class="bx-sd" to="tableCode">
          <template #text>
            <span class="ft-se-16">桌码设置</span>
          </template>

          <template #icon>
            <van-icon name="qr" color="rgb(200, 60, 60)" size="50px" />
          </template>
        </van-grid-item>
        <van-grid-item class="bx-sd" to="evaluateList">
          <template #text>
            <span class="ft-se-16">评价管理</span>
          </template>

          <template #icon>
            <van-icon name="chat-o" color="rgb(200, 60, 60)" size="50px" />
          </template>
        </van-grid-item>
        <van-grid-item class="bx-sd" to="agreement">
          <template #text>
            <span class="ft-se-16">隐私政策</span>
          </template>

          <template #icon>
            <van-icon name="newspaper-o" color="rgb(200, 60, 60)" size="50px" />
          </template>
        </van-grid-item>
      </van-grid>
    </van-row>
    <van-row class="bottom-btn">
      <van-button
        round
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="loginOut"
        >退出登录</van-button
      >
    </van-row>
  </van-row>
</template>

<script>
import store from "@/store";
import { getOrderList } from "@/api/order.js";
import { logoutBuis } from "@/api/sys.js";
import { Dialog, Notify } from "vant";

export default {
  data() {
    return {
      cardList: [
        {
          title: "门店信息",
          iconName: "setting",
          path: "/storeSetting",
        },
        {
          title: "菜品分类",
          iconName: "cluster",
          path: "/foodTypeList",
        },
        // {
        //     title:"规格管理",
        //     iconName:'apps-o',
        //     path:'/specification'
        // },
        {
          title: "菜单管理",
          iconName: "shop-collect",
          path: "/dishesList",
        },
        {
          title: "订单中心",
          iconName: "bars",
          path: "/orderList",
        },
        {
          title: "桌码设置",
          iconName: "qr",
          path: "/tableCode",
        },
        // {
        //   title: "优惠活动",
        //   iconName: "balance-list",
        //   path: ""
        // },
        {
          title: "评价管理",
          iconName: "chat-o",
          path: "evaluateList",
        },
        {
          title: "隐私政策",
          iconName: "newspaper-o",
          path: "agreement",
        },
      ],
      orderList: [],
      toOrderCount: 0,
      wxCode: "",
    };
  },
  created() {
    this.getLoginInfo();
  },
  methods: {
    getLoginInfo() {
      this.$store
        .dispatch("sys/GetInfo")
        .then((res) => {
          if (res.code == 200) {
            this.toOrderCount =
              res.data.orderCount +
              res.data.resverseCount +
              res.data.deliveryCount;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    checkOrder(item) {
      let param = {
        orderId: item.orderId,
      };
      this.$router.push({ path: "/orderDetailTwo?orderId=" + item.orderId });
    },
    toPath(path) {
      this.$router.push({ path: path });
    },
    // 退出登录
    loginOut() {
      Dialog.confirm({
        confirmButtonText: "确定",
        confirmButtonColor: "#C83C3C",
        message: "确定要退出登录吗？",
      })
        .then(() => {
          this.loadHref();
          let params = {
            wxCode: this.wxCode,
          };
          logoutBuis(params).then((res) => {
            this.$store.dispatch("sys/resetToken");
            let url = this.ridUrlParam(window.location.href, ["state"]);
            window.location.href = url;
            let urls = this.ridUrlParam(window.location.href, ["code"]);
            window.location.href = urls;
            this.$router.push("/login");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadHref() {
      //   if (isWechat) {
      // let appid = "wx28013f88973fe172"; //微信APPid  appid  wxe847b8b7dae49a3b   wx28013f88973fe172
      let appid = process.env.VUE_APP_APP_ID;
      let code = this.getUrlCode().code; //是否存在code
      let local = window.location.href;
      if (code == null || code === "") {
        //不存在就打开上面的地址进行授权
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          appid +
          "&redirect_uri=" +
          encodeURIComponent(local) +
          "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
      } else {
        this.wxCode = code;
      }
      //   }
    },
    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      console.log(theRequest);
      return theRequest;
    },
    ridUrlParam(url, params) {
      /**
       * 删除URL中指定search参数,会将参数值一起删除
       * @param {string} url 地址字符串
       * @param {array} aParam 要删除的参数key数组，如['name','age']
       * @return {string} 返回新URL字符串
       */
      for (var index = 0; index < params.length; index++) {
        var item = params[index];
        var fromIndex = url.indexOf(item + "="); //必须加=号，避免参数值中包含item字符串
        if (fromIndex !== -1) {
          // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
          var startIndex = url.indexOf("=", fromIndex);
          var endIndex = url.indexOf("&", fromIndex);
          var hashIndex = url.indexOf("#", fromIndex);

          var reg = "";
          if (endIndex !== -1) {
            // 后面还有search参数的情况
            var num = endIndex - startIndex;
            reg = new RegExp(item + "=.{" + num + "}");
            url = url.replace(reg, "");
          } else if (hashIndex !== -1) {
            // 有hash参数的情况
            var num = hashIndex - startIndex - 1;
            reg = new RegExp("&?" + item + "=.{" + num + "}");
            url = url.replace(reg, "");
          } else {
            // search参数在最后或只有一个参数的情况
            reg = new RegExp("&?" + item + "=.+");
            url = url.replace(reg, "");
          }
        }
      }
      var noSearchParam = url.indexOf("=");
      if (noSearchParam === -1) {
        url = url.replace(/\?/, ""); // 如果已经没有参数，删除？号
      }
      return url;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  font-size: 0.975rem;
  overflow: scroll;
  position: relative;
}

.header {
  text-align: center;
  background-color: rgb(200, 60, 60);
  color: #fff;
  padding: 4.5rem 0.625rem;
}

.company-name {
  padding-bottom: 0.9375rem;
}

.line::after {
  margin: 0 auto;
  content: "";
  height: 2px;
  width: 60%;
  background-color: #eeeeee;
  border-radius: 50%;
  box-shadow: 3px 5px 8px rgba(0, 0, 0, 0.3);
}

.header-nav-card {
  padding: 1.875rem 0px 0px 0px;
}

.nav-card-img {
  width: 1.875rem;
  height: 1.875rem;
}
.van-content {
  width: 96%;
  padding: 0 2%;
  margin-bottom: 60px;
}
.bottom-btn {
  position: fixed;
  bottom: 5px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
</style>
