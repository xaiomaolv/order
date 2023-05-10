<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="pd-tp-15 bg-w">
			<!-- <div class="userinfo">
	      <img
	        bindtap="bindViewTap"
	        class="userinfo-avatar"
	        src="{{userInfo.avatarUrl}}"
	        mode="cover"
	        v-if="{{userInfo.avatarUrl}}"
	      ></img>
	      <img class="userinfo-avatar" src="@/assets/mine/head.png" />
	      <div>
	        <span class="userinfo-nickname" v-if="{{userInfo.nickName}}">{{
	          userInfo.nickName
	        }}</span>
	        <span class="userinfo-nickname">微信用户</span>
	      </div>
	    </div> -->
			<div v-for="(item, index) in userListInfo" :key="index">
				<van-cell is-link size="large" @click="handelTo(item)">
					<template #icon>
						<img class="cell_icon" :src="item.icon" />
					</template>
					<template #title>
						<span>{{item.span}}</span>
					</template>
				</van-cell>
			</div>
		</div>


		<van-tabbar v-model="active" active-color="#f43c48" inactive-color="#666" @change="onChange">
			<van-tabbar-item class="nav-list-item tx-ct" icon="home-o">
				<div class="ft-se-14">首页</div>
			</van-tabbar-item>
			<van-tabbar-item class="nav-list-item tx-ct" icon="contact">
				<div class="ft-se-14">个人中心</div>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: false,
				userListInfo: [{
						icon: require("@/assets/mine/order.png"),
						span: "我的订单",
						path: "/order",
					},
					{
						icon: require("@/assets/mine/order3.png"),
						span: "预约记录",
						path: "/appointList",
					},
					{
						icon: require("@/assets/mine/coupon.png"),
				  span: "优惠券",
						path: "/coupon",
					},
					{
						icon: require("@/assets/mine/collection.png"),
						span: "店铺收藏",
						path: "/coltRestaurant",
					},
					{
						icon: require("@/assets/mine/address.png"),
						span: "地址管理",
						path: "/addressList",
					},
				],
				active: 1
			}
		},
		created() {

		},
		mounted() {

		},
		methods: {
			goBack() {
				this.$router.go(-1)
			},
			onChange(val) {
				if (val == 0) {
					this.$router.go(-1)
				}
			},
			handelTo(item) {
				this.$router.push({
					path: item.path
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo {
		display: flex;
		flex-direction: column;
		padding: 30px 0;
		align-items: center;
		background: #c83c3c;
	}

	.userinfo-avatar {
		width: 74px;
		height: 74px;
		margin: 10px;
		border-radius: 50%;
	}

	.userinfo-nickname {
		color: #333;
	}

	.cell_icon {
		display: inline-block;
		width: 25px;
		margin-right: 5px;
		margin-top: -1px;
	}

	.cell_icon image {
		width: 25px;
		vertical-align: -2px;
	}
</style>
