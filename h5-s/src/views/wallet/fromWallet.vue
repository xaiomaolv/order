<template>
    <div id="sendFrom" v-html="content">{{this.content}}}</div>
</template>

<script>
 	import { getWalletFrom } from "@/api/sys.js"
	import { getOpenid } from '@/utils/auth'
	export default {
		data() {
			return {
			  appid:'',
			  roleCode:'',
			  openid:'',
              content:'',
			};
		},
    beforeUpdate: function () {
      this.$nextTick(() => {
        if( document.forms.length != 0 ) {
          document.forms[0].submit();
        }
      })
    },
	created() {
    let path = window.document.location.href;
    this.roleCode = path.substring(
      path.indexOf("state") + 6,
      path.indexOf("#")
	  );
		if( path.indexOf("type") != -1 ){
				//判断是什么环境使用不同的appid
				if ( path.indexOf("http://icbc") != -1 ||  path.indexOf("http://www") != -1 ) {
					//需要修改todo::
					//只能在线上测试 公司公众号appid wx8ac3091cf3b0282c
					this.appid ='wx659352ca38c6b917';
				}else {
					this.appid ='wx8ac3091cf3b0282c';
				}	
				let urlNow = encodeURIComponent( path.substring(0,path.indexOf("."))+'.ynejkj.com/wx/#/wxgologin');
				//重新获取openid
				let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+this.appid+'&redirect_uri='+urlNow+'&response_type=code&scope=snsapi_base&state='+this.roleCode+'#wechat_redirect';
				window.location.href = url;
			
		}else{
              window.location.replace(path+"?type=1");
			
			
			/* this.$router.push({
				query:(this.$route.query,{'type':'2'})
			}) */
			//this.$router.push({ query: { type: '1' } });
			this.openid = getOpenid();
			if(this.openid != null && this.openid != '' && this.openid != undefined){
				let params = {
					openId: this.openid
					}
					getWalletFrom(params).then(res => {

						this.content = res.data;

					}).catch(err => {
					this.$notify({
						title: '提示',
						message: '系统异常，请您稍后在尝试！',
						type: 'warning'
					});
					this.$router.go(-1);
				});
				
			}else{
			this.$notify({
						title: '提示',
						message: '未绑定微信号，暂不支持使用。',
						type: 'warning'
					});

					this.$router.go(-1);
					
			}
		}
	},
	computed: {

	},
	methods: {


	}
	};
</script>


<style scoped>
	.el-header {
		text-align: center;
		color: white!important;
		position: relative;
	}

	.el-header .cardNo {
		margin-top: 3rem;
		font-size:1.375rem;
		/* font-family: PingFangSC-Regular; */
		font-family: "微软雅黑";
		font-weight: 100;
		letter-spacing: 1.85px;
	}
	.el-header .balance{
		margin-top: 1.25rem;
		font-size: 1rem;
		font-family: PingFangSC-Regular;
	}
	.el-header .remain {
		font-size: 1.75rem;
		letter-spacing: .23rem;
		text-shadow: 0 .1rem .2rem #2862ff;
		font-family: PingFangSC-Medium;
	}

  .header{

    background-size: 100% 100%;
  }
	.el-header span {
		display: block;
	}

	.detail {
		margin-top: 0.9375rem;
		font-size: .9rem;
		position: absolute;
		right: 1.5625rem;
		/* left:50%; */
		/* transform: translateX(-50%); */
		bottom: 1.25rem;
	}

	.copyCardNo {
		margin-top: 0.9375rem;
		font-size: .9rem;
		position: absolute;
		right: 1.5625rem;
		top: 0rem;
	}

	.exit {
		margin-top: 0.9375rem;
		font-size: .9rem;
		position: absolute;
		left: 1.5625rem;
		top: 0rem;
	}

	.el-main .el-button {
		margin-top: 2rem;
		width: 47%;
	}
	.message{
		font-size:0.75rem;
	}
  .weclome{
    font-size: 16px;
  }
  .row-u{
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
  }
  .img-icon{
    width: 40px;
    height: 40px;
  }
  .img-icon img{
    width: 100%;
    height:100%;
  }
  .content-u{
    width: 70%;
    height: 40px;
    margin-left: 20px;
    line-height: 40px;
    border-bottom: #c0c4cc solid 1px;
    text-align: left;
  }
</style>
