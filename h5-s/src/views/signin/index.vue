<template>
	<div class="container" v-show='viewShowModel'>
		<van-image class="header" width="100vw" :src="require('@/assets/mine/header.jpg')" />
		<van-form class="form" @submit="onSubmit">
			<!-- validate-first @failed="onFailed" @submit="onSubmit" -->
			<van-cell-group>
				<van-field v-model="formModel.name" name="name" label="姓名" placeholder="请填写" :rules="[{ required: true, message: '请填写姓名' }]" />
			</van-cell-group>

			<van-cell-group>
				<van-field v-model="formModel.idCard" name="idCard" label="身份证号" placeholder="请填写" :rules="[{ validator, message: '身份证号有误！' }]" />
			</van-cell-group>

			<van-cell-group>
				<van-field v-model="formModel.phone" name="phone" label="手机号" placeholder="请填写" :rules="[{ pattern, message: '手机号码格式有误！' }]" />
			</van-cell-group>

			<van-cell-group>
				<van-field v-model="formModel.password" name="password" label="密码" placeholder="请填写" :rules="[{ validator:asyncValidator, message: '密码格式有误！' }] " />
			</van-cell-group>

			<van-cell-group>
				<van-field v-model="formModel.code" name="code" label="验证码" center clearable placeholder="请填写" :rules="[{ required: true, message: '请填写验证码' }]">
					<template #button>
						<van-button size="small" type="warning" v-if="show" @click="sendSms" native-type="button">发送验证码</van-button>
						<van-button size="small" type="warning" v-if='!show'>{{count}} S</van-button>
					</template>
				</van-field>
			</van-cell-group>


			<van-cell-group>
				<van-field v-model="formModel.address" name="address" label="地址" placeholder="非必填" />

			</van-cell-group>

			<van-cell-group v-show='viewShow'>
			 	<van-field name="radio" label="绑定微信号">
					<template #input>
						<van-radio-group v-model="radio" direction="horizontal" @change="handleChange">
							<van-radio checked-color="#C83C3C" name="1">绑定</van-radio>
							<van-radio checked-color="#C83C3C" name="2">不绑定</van-radio>
						</van-radio-group>
					</template>
				</van-field> 
				<van-row style="font-size: 0.75rem; margin-top: 0.625rem;color: #889AA4;">提示：密码格式为8-16位字母和数字组合，不包含特殊字符</van-row>
			</van-cell-group> 

			<van-row class="row-btn">
				<van-button class="left" @click="$router.go(-1)">取消</van-button>
				<van-button class="right" native-type="submit" @click='onSubmit'>提交</van-button>
			</van-row>
		</van-form>
	</div>
</template>

<script>
import { getOpenid } from '@/utils/auth'
import {getTokenWx} from "@/api/signin.js"
	import {
		sendSms,
		add
	} from "@/api/signin.js"
	import md5 from 'js-md5';
	import {
		Notify,
		Field
	} from 'vant'

	export default {
		data() {
			return {
				path:'',
				appid:'',
				viewShowModel:false,
				viewShow:false,
				count: "",
				show: true,
				formModel: {
					name: '',
					phone: '',
					idCard: '',
					code: '',
					password: '',
					address: '',
					wxOpenId: ''
				},
				code:'',
				wxOpenId:'',
				parentId:'',
				radio: '1',
				errors: false,
				// pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
				pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
				idcardReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
			}
		},
		created() {
			let path = window.document.location.href;
			this.path = path;
			//判断是什么环境使用不同的appid
			if ( path.indexOf("http://icbc") != -1 ||  path.indexOf("http://www") != -1 ) {
				//需要修改todo::
			    //只能在线上测试 公司公众号appid wx8ac3091cf3b0282c
			    this.appid ='wx659352ca38c6b917';
			}else {
			    this.appid ='wx8ac3091cf3b0282c';
			}
			if( path.indexOf("parentId") >= 0  &&  path.indexOf("code") == -1 &&  path.indexOf("state") == -1 ){
				//微信注册销售操作
				this.getHrefWx();
			}else{
				this.viewShowModel = true;
				this.code = path.substring(
				path.indexOf("code") + 5,
				path.indexOf("&")
				);
				this.parentId = path.substring(
				path.indexOf("state") + 6,
				path.indexOf("#")
				);
				let userInfo = {};
				userInfo.code = this.code;
				userInfo.roleCode = 'saler';
				userInfo.openId = '';
				getTokenWx(userInfo).then(response => {
					if( response.data.wxCode != '1100004' ){
						this.viewShow = true;	
						this.wxOpenId =  response.data.wxOpenId;		
					}else{
	                   this.getHrefWx();
					}
				})
		    }  
		},
		watch: {
			"formModel.phone": function(val, oldv) {
				if (val !== oldv) {
					if (!this.show) {
						this.show = true;
					}
				}
			}
		},
		computed: {

		},
		methods: {
			getHrefWx(  ){
				let urlNow=encodeURIComponent(this.path);  
				let url= 'https://open.weixin.qq.com'+'/connect/oauth2/authorize?appid='+this.appid+'&redirect_uri='+urlNow+'&response_type=code&scope=snsapi_base&state='+this.$route.query.parentId+'#wechat_redirect';
				window.location.href = url;
			},
			handleChange(val) {
				//console.log(val, 909999)
				this.radio = val
			},
			validator(val) {
				return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
			},
			asyncValidator(val) {
				return new Promise((resolve) => {
					resolve(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(val));					
				});
			},
			onFailed(errorInfo) {
				//console.log('failed', errorInfo);				
			},
			sendSms() {
				let that = this;
				let params = {
					phone: this.formModel.phone,
					type: 1
				}
				if (this.pattern.test(params.phone)) {
					sendSms(params).then(res => {
						if (res.code == 200) {
							that.$notify({
								type: 'success',
								message: '验证码发送成功！'
							});
							that.cutDown();
						}

					})
				}

			},
			onSubmit(values) {
				if(!values.name) return;
				let that = this;
				var formParams = { ...this.formModel,
					...this.$route.query
				}
				let pw = formParams.password;
				
				//debugger
                 if( this.radio == 1 ){
                   formParams.wxOpenId = this.wxOpenId;
				 }
				formParams.password = md5(formParams.password);
				add(formParams).then(res => {
					that.$notify({
						type: 'success',
						message: res.msg
					})
					let success_router = this.$route.meta.success_router
					if (success_router) {
						this.$router.push({
							path: success_router
						})
						return
					}
					this.$router.go(-1)
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
	.container {
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

	.van-hairline--top-bottom::after,
	.van-hairline-unset--top-bottom::after {
		border-width: 0px 0;
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
