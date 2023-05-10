<template>
	<div class="container ps-re">
		<img class="bg-img" src="@/assets/order/bg1.jpg" />
		<div v-if="!showOrder">
			<div class="title-view">
				<div class="size-20">欢迎光临</div>
				<div>{{ storeInfo.businessName }}</div>
			</div>
			<div class="main">
				<div class="card-view bg-w mg-lr-10">
					<van-cell title="你好，请填写预约信息" use-label-slot>
						<!-- <div slot="">桌号:{{storeInfo.tableName}}</div> -->
					</van-cell>
					<div class="pd-tb-10">
						<van-field v-model="mealTime" required name="mealTime" input-align="right" label="用餐时间"
							placeholder="请选择用餐时间" @click="showTime = true" />

						<van-field v-model="userPhone" required name="userPhone" label="联系电话" type="tel"
							input-align="right" placeholder="请输入电话号码" />
							
						<van-field v-model="mealPerson" required name="mealPerson" label="用餐人数" placeholder="">
							<template #input>
								<van-stepper v-model="mealPerson" input-width="40px" button-size="28px" />
							</template>
						</van-field>
						<van-field v-model="userName" required name="userName" placeholder="请输入姓名">
							<template #button>
								<van-radio-group v-model="userSex" direction="horizontal">
									<van-radio name="女士">女士</van-radio>
									<van-radio name="先生">先生</van-radio>
								</van-radio-group>
							</template>
						</van-field>
					</div>
					<div class="mg-10-15">
						<van-button color="#c83c3c" round class="w-95" @click="appointment">确认</van-button>
					</div>
				</div>
			</div>
		</div>

		<van-popup v-model:show="showTime" position="bottom" @close="onClose">
			<van-picker :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
		</van-popup>
		<!-- :formatter="yyyy-MM-dd HH:mm" -->
		<!-- <van-popup v-model:show="showPopup" round position="bottom" :style="{ height: '40%' }" @close="onClose">
		     <div class="isLogin">
		       <div class="loginTitle">微信授权登录</div>
		       <div class="loginshopImg">
		         <div>您还未登录，请授权登录</div>
		         <div>(如未授权，可能无法正常使用该小程序)</div>
		       </div>
		       <div class="isAgary">
		         <div>•</div>
		         <div>获取你的手机号及公开信息(昵称、头像等)</div>
		       </div>
		       <div class="isLoginBtn mg-tp-10">        
		         <van-button :class="{{flag?'show':'hide'}}" @click="getUserProfile">{{AuthorizedLogin}}</van-button>
		         <button class="{{flag?'hide':'show'}}"  @click="getPhoneNumber">{{UserPhone}}</button>
		       </div>
		     </div>
		   </van-popup> -->
	</div>
</template>

<script>
	import {
		reactive,
		onMounted,
		toRefs,
		nextTick
	} from "vue";
	import {
		useRoute,
		useRouter
	} from "vue-router";
	import {
		Toast
	} from "vant";
	import {
		addResverse
	} from "@/api/order"
	export default {
		name: "",
		components: {},
		setup() {
			// 时间设置
			const myDate = new Date();
			const days = [];
			const hours = [];
			const minutes = [];
			const wk = myDate.getDay();
			const yy = String(myDate.getFullYear());
			const mm = myDate.getMonth() + 1;
			const dd = String(
				myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
			);
			const hou = myDate.getHours();
			const min = myDate.getMinutes();
			const weeks = [
				"星期日",
				"星期一",
				"星期二",
				"星期三",
				"星期四",
				"星期五",
				"星期六",
			];
			const mines = [
				"00",
				"05",
				"10",
				"15",
				"20",
				"25",
				"30",
				"35",
				"40",
				"45",
				"50",
				"55",
			];
			const week = weeks[wk];

			//获取今天
			days.push("今天(" + week + ")");

			//获取小时
			if (min + 15 > 45) {
				for (let i = hou + 1; i < 24; i++) {
					if (i < 10) {
						i = "0" + i;
					}
					hours.push("" + i);
				}
			} else {
				for (let i = hou; i < 24; i++) {
					if (i < 10) {
						i = "0" + i;
					}
					hours.push("" + i);
				}
			}

			if (min < 41) {
				mines.forEach((ele) => {
					if (ele > min + 15) {
						minutes.push(ele);
					}
				});
			} else {
				mines.forEach((ele) => {
					minutes.push(ele);
				});
			}
			const columns = [
				// 第一列
				{
					values: days,
				},
				// 第二列
				{
					values: hours,
				},
				{
					values: minutes,
				},
			];
			const route = useRoute();
			const router = useRouter();
			const state = reactive({
				// columns: [days, hours, minutes],
				defaultIndex: [],
				mealTime: "",
				userPhone: "",
				mealPerson: "",
				userName: "",
				userSex: "",
				showOrder: "",
				showTime: false,
				storeInfo: {
					address: "云南省昆明市五华区华山西路1号五华区区级机关办公大楼18_19层4号",
					businessId: "52",
					businessLogo: "73acee1f62c84ff9843b738ac658fd0c20220527203235.png",
					businessName: "注册小店",
					businessStatus: "1",
					businessTime: "",
					chargePhone: "17388977877",
					children: null,
					colleStatus: "0",
					doorPlate: null,
					reserveFlag: "1",
					reserverDeposit: null,
					userId: null,
				},
				currentDate: "",
				minDate: new Date(2022, 10, 18, 18, 1),
				maxDate: new Date(2025, 10, 1),
			});
			onMounted(async () => {});
			nextTick(() => {});

			const onConfirm = (val) => {
				state.mealTime = val[0] + val[1] + ":" + val[2];
				state.showTime = false;
			};

			const appointment = () => {
				if (!state.mealTime) {
					Toast("请选择用餐时间");
					return;
				}
				if (!state.userPhone) {
					Toast("请输入联系电话");
					return;
				}
				if (!/^1[3456789]\d{9}$/.test(state.userPhone)) {
					Toast("请填写正确的电话号码");
					return;
				}
				if (!state.userName) {
					Toast("请输入姓名");
					return;
				}
				if (!state.userSex) {
					Toast("请选择女士、先生");
					return;
				}
				let params = {
					businessId: state.storeInfo.businessId, //商家id
					orderType: "0", //** 是否提前点餐  0 否 1. 是*/
					userId: state.storeInfo.userId, //用户id
					reserveName: state.userName + state.userSex,
					userPhone: state.userPhone, //用户电话
					isDeposit: "0", //** 是否已交订金  0 未交 1. 已交*/
					deposit: 0, //预约定金金额
					mealTime: state.mealTime, //就餐时间
					mealPerson: state.mealPerson, //就餐人数
				};
				console.log(params, "123456");
				// addResverse(param).then(res => {
				// 	if (res.code == 200) {
				// 	 Toast.success('预约成功')

				// 		mealTime: null,
				// 		mealPerson: null,
				// 		orderMethod: null,
				// 		showSubmit: true

				// 		setTimeout(() => { //注意function这里不能缺少
				// 			router.push({
				// 				path:'/home'
				// 			})
				// 		}, 1500)
				// 	}
				// })
				Toast.success("预约成功");
				setTimeout(function() {
					router.push({
						path: "/home",
					});
				}, 1500);
			};

			return {
				...toRefs(state),
				columns,
				days,
				hours,
				minutes,
				appointment,
				onConfirm,
			};
		},
	};
</script>

<style lang="scss" scoped>
	.bg-img {
		position: absolute;
		left: 0;
		bottom: 0;
		display: block;
		height: 100%;
		width: 100%;
		// z-index: -999;
	}

	.page-container {
		min-height: 100%;
		position: relative;
	}

	.main {
		position: absolute;
		bottom: 120px;
		left: 0;
		right: 0;
	}

	.title-view {
		text-align: center;
		font-size: 2rem;
		color: white;
		position: relative;
		padding-top: 70px;
	}

	.card-view {
		padding: 10px 15px;
		border-radius: 10px;
	}

	.cell-btn {
		padding: 10px 20px;
		background: #c83c3c;
		text-align: center;
		color: rgb(255, 255, 255);
		margin: 10px;
		border-radius: 10px;
	}

	.hide {
		border-radius: 40px;
		margin: 10px 25px;
		font-size: 17px;
		display: none;
	}

	.show {
		display: block;
		border-radius: 40px;
		margin: 10px 25px;
		font-size: 17px;
	}

	.title::before {
		content: "*";
		width: 20rpx;
		height: 100%;
		margin-right: 3px;
		font-size: 36rpx;
		color: #f00;
	}

	// :deep .van-cell{
	// 	padding: 10px 0!important;
	// }
	// :deep .van-field__label{
	// 	width: 65px!important;
	// }
</style>
