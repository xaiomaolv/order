<template>
	<div class="container">
		<van-image class="header" width="100vw" :src="require('@/assets/mine/header.jpg')" />
		<van-form  class="form" validate-first @failed="onFailed">
			<van-cell-group> <!-- :rules="[{required: true, message: '请填写手机号' }]" -->
				<van-field v-model="formModel.phone" name="phone" label="手机号"  placeholder="请填写" required />					
			</van-cell-group>
			<van-cell-group > <!-- :rules="[{ validator, message: '密码格式有误！' }]" -->
				<van-field v-model="formModel.password" name="password" label="密码" placeholder="请填写" required  />
		<!-- 		<van-row style="font-size: 0.75rem; margin-top: 0.625rem;color: #889AA4;">提示：密码格式为8-16位字母、数字组合，不包含特殊字符</van-row>
		 -->	
		 </van-cell-group>

			<van-cell-group> <!-- :rules="[{ required: true, message: '请填写验证码' }]" -->
				<van-field v-model="formModel.code" name="code" label="验证码"  center clearable  placeholder="请填写" required >
					<template #button >
						<van-button size="small" type="warning" v-if="show" @click="sendSms">发送验证码</van-button>
						<van-button size="small" type="warning" v-if='!show'>{{count}} S</van-button>
					</template>
				</van-field>
			</van-cell-group>
			
			<van-row class="row-btn">
				<van-button  class="left" @click="$router.go(-1)">取消</van-button> 
				<van-button  class="right" native-type="submit" @click='onSubmit'>提交</van-button> 
			</van-row>
		</van-form>
	</div>
</template>

<script>
	import {sendSms, add} from "@/api/signin.js"
	import { bindOpenid } from "@/api/sys.js"
	import { getOpenid } from '@/utils/auth'
	import md5 from 'js-md5';
	import { getLoginUser } from "@/api/sys.js"
	import {
		Notify,
		Field
	} from 'vant'

	export default {
		data() {
			return {
				appid:'',
				roleCode:'',
				count: "",
				show: true,
				formModel: {
					openId: '',
					phone: '',
					code: '',
					password: ''
				},
				pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
				phoneReg: /^1[0-9]{10}$/
			}
		},
		created() {
			this.formModel.openId='';
			this.formModel.phone='';
			this.formModel.code='';
			this.formModel.password='';
		    //debugger;
			let path = window.document.location.href;
			this.roleCode = path.substring(
			path.indexOf("state") + 6,
			path.indexOf("#")
			);
			if( getOpenid() == '' || getOpenid() == undefined  || getOpenid() == null ){
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
				let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+this.appid+'&redirect_uri='+urlNow+'&response_type=code&scope=snsapi_base&state='+this.formModel.roleCode+'#wechat_redirect';
				window.location.href = url;
			}else{
				getLoginUser().then(res => {
					let date = res.data
					if(date.wxOpenId){
						if (this.roleCode == "saler") {
							this.$router.push({ path: "/sale/index" });
						}else {
							this.$router.push({ path: "/customer/index" });
						}
					} 
				});
			}
		},
		watch: {
			"formModel.phone":function(val, oldv){
				if(val!== oldv){
					if(!this.show ){
						this.show = true;
					}
				}
			}
		},
		computed: {
			
		},
		methods: {
			validator(val){
				return  this.pattern.test(val)
			},
			onFailed(errorInfo) {
			 // console.log('failed', errorInfo);
			},
			sendSms() {
				// this.cutDown();
				let that = this;
				let params = {
					phone: this.formModel.phone,
					type: 2
				}
				if(this.phoneReg.test(params.phone.trim())){
					sendSms(params).then(res => {
						that.cutDown();
						that.$notify({
							type: 'success',
							message: '验证码发送成功！'
						});
					})
				}else{
					that.$notify({
						type: 'warning',
						message: '手机号码有误！'
					});
					return;
				}
				
			},
			onSubmit() {
				let that = this;
				var formParams = { ...this.formModel,
					...this.$route.query
				}
				let pw = formParams.password;			

					formParams.password = md5(formParams.password);
					formParams.openId = getOpenid();
					if( formParams.openId  == null || formParams.openId  == ''||formParams.openId  == undefined ){
                       that.$notify({
							type: 'success',
							message: '系统异常请您稍后在试！'
						})
						return;
					}
					bindOpenid(formParams).then(res => {
						that.$notify({
							type: 'warning',
							message: res.msg
						})
						if( this.roleCode != '' ){
							if (this.roleCode == "saler") {
								this.$router.push({ path: "/sale/index" });
							}else {
								this.$router.push({ path: "/customer/index" });
							}
						}else{
							/* let success_router = this.$route.meta.success_router
							if (success_router) {
								this.$router.push({
									path: success_router
								})
								return;
							}
							this.$router.go(-1); */
					   }
					})	
			},		
			cutDown() {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(() => {
						if (this.count > 1 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000);
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		background-color: #FFF;
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

		.file>>>.van-field__body {
			margin-top: 1.5vh;
		}
	}

	.van-cell.van-field {
		background: rgba(237, 237, 237, 1);
		border-radius: 6px;

		>>>.van-field__label {
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
			color: #F9565F;
		}

		.right {
			width: 40vw;
			border-radius: 0 55px 55px 0;
			margin-left: -3px;
			background: #F9565F;
			color: white;
		}

		.center {
			width: 80vw;
			border-radius: 55px 55px;
			margin-left: -3px;
			background: #F9565F;
			color: white;
		}
	}
</style>
