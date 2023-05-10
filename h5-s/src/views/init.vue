<template>
  <div></div>
</template>

<script>
// 判断是否为微信环境
const isWechat = () => {
  return (
    String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) ===
    "micromessenger"
  );
};

export default {
  data() {
    return {
      code: ""
    };
  },

  methods: {
    loadHref() {
      if (isWechat) {
        // let appid = "wx28013f88973fe172"; //微信APPid
        let appid = process.env.VUE_APP_APP_ID
        let code = this.getUrlCode().code; //是否存在code
        let local = window.location.href;
        if (code == null || code === "") {
          //不存在就打开上面的地址进行授权
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            appid +
            "&redirect_uri=" +
            encodeURIComponent("https://www.baidu.com/") +
            "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
        } else {
          this.code = code;
        }
      }
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
    }
  },

  created() {
    this.loadHref();
  }
};
</script>
