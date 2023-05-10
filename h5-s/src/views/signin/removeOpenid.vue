<template>
	<div class="container">
		<van-image class="header" width="100vw" :src="require('@/assets/mine/header.jpg')" />
		<van-form  class="form" validate-first @failed="onFailed">
			<van-cell-group> <!-- :rules="[{required: true, message: '请填写手机号' }]" -->
				<van-field v-model="formModel.phone" name="phone" label="手机号"  placeholder="请填写" required />					
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
	import { removeOpenid } from "@/api/sys.js"
	import md5 from 'js-md5';
	import {
		Notify,
		Field
	} from 'vant'

	export default {
		data() {
			return {
				count: "",
				show: true,
				formModel: {
					phone: '',
					code: ''
				},
				pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
				phoneReg: /^1[0-9]{10}$/
			}
		},
		created() {
		
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
			 
			},
			sendSms() {
				// this.cutDown();
				let that = this;
				let params = {
					phone: this.formModel.phone,
					type: 2
				}
				if( this.phoneReg.test(params.phone) ){
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
					removeOpenid(formParams).then(res => {
						that.$notify({
							type: 'success',
							message: res.msg
						})
						let path = window.document.location.href;
						let roleCode = path.substring(
						path.indexOf("state") + 6,
						path.indexOf("#")
						);
					    if ( roleCode == "saler") {
							this.$router.push({ path: "/sale" });
						} else {
							this.$router.push({ path: "/customer" });
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
