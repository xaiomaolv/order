<template>
	<div class="container">
		<van-nav-bar title="个人资料修改" left-text="" left-arrow class="van-nav-bar-top" @click-left="onClickLeft"> </van-nav-bar>

		<van-form class="form" @submit="onSubmit">

			<van-field v-model="formModel.username" name="username" label="姓名" placeholder="请填写" :rules="[{ required: true, message: '请填写姓名' }]" />

			<van-field v-model="formModel.idcard" name="idcard" label="身份证号" placeholder="请填写" :rules="[{ validator, message: '身份证号有误！' }]" />

			<van-field v-model="formModel.phone" name="phone" label="手机号" placeholder="请填写" :rules="[{ pattern, message: '手机号码格式有误！' }]" />


			<van-field v-model="formModel.code" name="code" label="验证码" center clearable placeholder="请填写" :rules="[{ required: true, message: '请填写验证码' }]">
				<template #button>
					<van-button size="small" type="info" v-if="show" native-type="button" @click="sendSms">发送验证码</van-button>
					<van-button size="small" type="info" v-if='!show'>{{count}} S</van-button>
				</template>
			</van-field>

			<van-field v-model="formModel.address" name="address" label="地址" placeholder="非必填" />

			<van-row class="mg-top-45 width-100">
				<van-button color="linear-gradient(to right, #4bb0ff, #6149f6)" native-type="submit" class="loginOut" @click='onSubmit'>修改</van-button>
			</van-row>

		</van-form>

	</div>

</template>

<script>
	import {
		getLoginUser,
		updateLoginUser,
		sendSms
	} from "@/api/sys.js"
	import qs from 'qs'
	export default {
		data() {
			return {
				count: "",
				show: true,
				formModel: {
					username: '',
					phone: '',
					idcard: '',
					code: '',
					address: ''
				},
				from: {},
				pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
				idcardReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
			}
		},
		created() {
			getLoginUser().then(res => {
				this.formModel = res.data;
				// this.formModel.username = this.noPassByName( res.data.username);
				// this.formModel.phone = this.noMobileNo(res.data.phone);
				// this.formModel.idcard = this.idCard(res.data.idcard);
				// this.formModel.address = this.address(res.data.address);
				this.from = res.data
			})
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
			validator(val) {
				return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
			},
			asyncValidator(val) {
				return new Promise((resolve) => {
					resolve(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(val));
				});
			},
			onFailed(errorInfo) {
				console.log('failed', errorInfo);
			},
			sendSms() {
				let that = this;
				let params = {
					phone: this.formModel.phone,
					type: 2
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
			onSubmit(value) {
				if (!value.username) return;
				let that = this;
				let params = qs.stringify({
					phone: this.formModel.phone,
					code: this.formModel.code
				})
				updateLoginUser(this.formModel, params).then(res => {
					that.$notify({
						type: 'success',
						message: res.msg
					})
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
			onClickLeft() {
				this.$router.go(-1)
			},
			noPassByName(str) {
				if (null != str && str != undefined) {
					if (str.length <= 3) {
						return "*" + str.substring(1, str.length);
					} else if (str.length > 3 && str.length <= 6) {
						return "**" + str.substring(2, str.length);
					} else if (str.length > 6) {
						return str.substring(0, 2) + "****" + str.substring(6, str.length)
					}
				} else {
					return "";
				}
			},
			address(str) {
				if (str) {
					let ms = str.match(/\d+/g)
					if (ms) {
						let index = str.lastIndexOf(ms[ms.length - 1])
						return str.substring(0, index > 6 ? index - 6 : 0) + '******' + str.substring(index)
					}
				}
			},
			noMobileNo(str) {
				if (str) {
					return str.replace(/\s/g, '').replace(/(\d{3})\d+(\d{2})$/, "$1**** ****$2")
				}

			},
			idCard(str) {
				return str.replace(/\s/g, '').replace(/(\d{6})\d+(\d{4})$/, "$1 **** **** $2")
			},
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		/* height: 100%;s */
		/* padding-top: 2.8125rem; */
		font-size: 0.875rem;
	}

	.van-nav-bar-top {
		width: 100%;
		// position: fixed;
		// top: 0;
		// left: 0;
		// z-index: 1001;
	}

	.van-cell {
		padding: 1rem;
	}

	.container>>>.van-icon {
		font-size: 1rem !important;
	}

	.van-icon-closed-eye::before {
		content: "\F035";
		// font-size: 1.25rem!important;
		// margin-top: 0.3125rem;
	}

	.mg-top-45 {
		margin-top: 2.8125rem;
	}

	.width-100 {
		width: 100%;
		text-align: center;
	}

	.loginOut {
		margin: 0 auto;
		width: 80%;
		border-radius: 2.5rem;
	}
</style>
