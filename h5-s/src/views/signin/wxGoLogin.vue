<template></template>

<script>
import { setToken, removeToken ,getOpenid } from "@/utils/auth";
import { getToken } from "@/api/signin.js";
import { walletIsOpen } from "@/api/sys.js";
import { getLoginUser } from "@/api/sys.js"
export default {
  data() {
    return {
      appid:'',
      urlYm:'',
      formModel: {
        code: "",
        type: 0,
        roleCode: ""
      }
    };
  },
  created() {
    //debugger;
    let path = window.document.location.href;
    this.formModel.code = path.substring(
      path.indexOf("code") + 5,
      path.indexOf("&")
    );
    this.formModel.roleCode = path.substring(
      path.indexOf("state") + 6,
      path.indexOf("#")
	  );
    if( this.formModel.roleCode  != 'saler'){
          this.formModel.roleCode = 'customer';
    }
    //判断是什么环境使用不同的appid
    this.urlYm = path.substring(0,path.indexOf("."));
    if ( path.indexOf("http://icbc") != -1 ||  path.indexOf("http://www") != -1 ) {
      //需要修改todo::
      //只能在线上测试 公司公众号appid wx8ac3091cf3b0282c
      this.appid ='wx659352ca38c6b917';
    }else {
      this.appid ='wx8ac3091cf3b0282c';
    }
 
    this.loading = true;
    this.$store
      .dispatch("sys/wxOpenid", this.formModel,this.appid,this.urlYm)
      .then(r => {
        if( getOpenid() == '' || getOpenid() == null || getOpenid() == undefined ){
           this.getHrefWx();
        }else{
          if (this.formModel.roleCode == "saler") {
              this.$router.push({ path: "/sale/index" });
            }else {
              this.$router.push({ path: "/customer/index" });
          }
        }
        this.loading = false;
      })
      .catch((res) => { 
        if( getOpenid() == '' || getOpenid() == null || getOpenid() == undefined ){
            this.getHrefWx();
        }else{
          if (this.formModel.roleCode == "saler") {
            this.$router.push({ path: "/sale" });
          } else {
            this.$router.push({ path: "/customer" });
          } 
          this.loading = false;
        }  
      });
  },
  watch: {},
  computed: {},
  methods: {
 			getHrefWx( ){
			      let urlNow = encodeURIComponent(this.urlYm+'.ynejkj.com/wx/#/wxgologin');
            //重新获取openid
            let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+this.appid+'&redirect_uri='+urlNow+'&response_type=code&scope=snsapi_base&state='+this.formModel.roleCode+'#wechat_redirect';
            window.location.href = url;
			},

  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
}
.header {
  margin-bottom: 2vh;
}

.form {
  overflow-y: scroll;
  height: 65vh;
}

.van-cell-group {
  margin: 2vh 10vw 0 10vw;

  .file >>> .van-field__body {
    margin-top: 1.5vh;
  }
}

.van-cell.van-field {
  background: rgba(237, 237, 237, 1);
  border-radius: 6px;

  >>> .van-field__label {
    color: gray;
  }
}

.row-btn {
  margin: 5vh 0;
  padding: 0 10vw;

  .left {
    width: 40vw;
    border-radius: 55px 0 0 55px;
    margin-right: -3px;
    color: #f9565f;
  }

  .right {
    width: 40vw;
    border-radius: 0 55px 55px 0;
    margin-left: -3px;
    background: #f9565f;
    color: white;
  }

  .center {
    width: 80vw;
    border-radius: 55px 55px;
    margin-left: -3px;
    background: #f9565f;
    color: white;
  }
}
</style>
