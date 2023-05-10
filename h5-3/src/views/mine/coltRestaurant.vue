<template>
	<div class="page-body">
		<div class="mg-tp-10">
			<div class="main">
				<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
					<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
						
						<div class="shop-card" v-for="(item, index) in list" :key="index" @click="toRestaurant">
							<div class="bg-w flex-row pd-tb-10 pd-lr-10 flex-row-item">
								<div class="mg-rt-10" slot="thumb" style="width: 140rpx; height: 140rpx">
									<img :src="imgUrl + item.businessLogo" class="imgStore" />
								</div>
								<div class="flex-1">
									<div class="flex-row flex-row-item ft-size1">
										<div class="t-lt flex-1 ft-bd flex-row" style="font-size: 16px">
											<text class="row tx-of" style="width: 200px">{{
											item.businessName
										}}</text>
										</div>
										<div class="tx-rt" style="width: 110rpx">
											<van-tag type="primary" class="font-size2">点</van-tag>
											<van-tag v-if="item.reserveFlag == 1" mark type="warning">预</van-tag>
										</div>
									</div>

									<div class="flex-row flex-col-item mg-tp-5">
										<div class="flex-1">
											<text class="row tx-of ft-size13" style="width: 200px">{{
											item.categoryName
										}}</text>
										</div>
										<!-- <div class="tx-rt ft-size" style="width: 110rpx;"> {{item.distance}}km</div> -->
									</div>
								</div>
							</div>
						</div>

					</van-list>
				</van-pull-refresh>

			</div>
			<div class="tx-ct main" v-if="list.length == 0">
				<div class="mg-tp-30">
					<van-empty description="暂无收藏店铺" />
				</div>
			</div>
		</div>
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
		getCollectList
	} from "@/api/store"
	export default {
		name: "",
		components: {},
		setup() {
			const route = useRoute();
			const router = useRouter();
			const state = reactive({
				isLogin: false,
				list: [{
						address: "云南省昆明市官渡区广福路与云秀路交汇处",
						businessId: "50",
						businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
						businessName: "闲时蜗居小店",
						businessTime: "00:00-21:00",
						categoryId: "122",
						categoryName: "鸡肉卷、三明治、牛排",
						children: ["ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png"],
						distance: "0.13620401862590234",
						nickName: "你算哪块小饼干",
						reserveFlag: "1",
					},
					{
						address: "云南省昆明市五华区华山西路5号",
						businessId: "76",
						businessLogo: "ce2eb6649a694d8fb51254f711bf442320220721103251.jpg",
						businessName: "陌上清风雨曲折",
						businessTime: "09:00-23:00",
						categoryId: "122",
						categoryName: "鸡肉卷、三明治",
						children: ["ce2eb6649a694d8fb51254f711bf442320220721103251.jpg"],
						distance: "0.0713590266010888",
						nickName: "你算哪块小饼干",
						reserveFlag: "1",
					}
				],
				imgUrl: 'https://order.ynejkj.com/api/order/image/preview?fileName=',

				loading: false,
				finished: false,
				refreshing: false,
				pageNum: 1
			});
			onMounted(async () => {
				
			});
			nextTick(() => {});

			// const goBack = () => {
			// 	router.go(-1)
			// }
			const toRestaurant = () => {
				router.push({
					path: '/restaurant'
				})
			}
			const init = async () => {

				state.loading = true;

				let params = {
					"userId": this.data.userId,
					"pageNum": state.pageNum,
					"pageSize": 10
				}
				let len = ''
				await getCollectList(params).then(res => {

					len = res.rows.length

					state.list = state.list.concat(...res.rows)

					state.loading = false;

					if (len <= 10) {
						state.finished = true;
					} else {
						state.pageNum++
					}
				})

			}

			const onLoad = () => {

				// if (state.refreshing) {
				// 	state.list = [];
				// 	state.refreshing = false;
				// }

				// init()


			};

			const onRefresh = () => {
				// 清空列表数据
				state.finished = false;
				state.list = []
				state.pageNum = 1
				// 重新加载数据
				// 将 loading 设置为 true，表示处于加载状态
				state.loading = true;
				onLoad();
			};

			return {
				...toRefs(state),
				onLoad,
				onRefresh,
				toRestaurant
			};
		},
	};
</script>

<style lang="scss" scoped>
	.shop-card {
		padding: 3px;
		background: white;
		margin-top: 5px;
	}

	.shop-card .title {
		display: inline;
	}

	.shop-card .t-lt {
		/* float: left; */
		font-size: 1.05rem;
		/* font-size: 29rpx; */
		display: inline;
	}

	.shop-card .t-rt {
		float: right;
		display: inline;
	}

	.shop-card .desc {
		/* margin-top: 10rpx; */
		display: inline;
	}

	.shop-card .desc-img {
		width: 50px;
		margin: 3px;
	}

	.imgStore {
		height: 70px;
		width: 70px;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		/* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
	}

	.seach-input {
		height: 32px;
		line-height: 32px;
		padding: 0 15px;
		flex: 1;
	}

	.seach-btn {
		height: 35px;
		line-height: 35px;
		padding: 0 10px;
		color: var(--primary-color);
		margin-right: 10px;
	}

	/* .van-dropdown-menu__title:after {
  border-color: transparent transparent currentcolor currentcolor;
  border-style: solid;
  border-width: 5px!important;
  content: "";
  margin-top: -5px;
  opacity: .8;
  position: absolute;
  right: -4px;
  top: 50%;
  font-size: 30px;
  transform: translateY(-50%) rotate(-45deg) !important;
} */
	/* 筛选 */
	.guige-border {
		border: 1px solid #f7f2f2;
		background: #f7f2f2;
		border-radius: 10px;
	}

	.guige {
		margin: 5px;
		line-height: 20px;
		padding: 3px 0;
		/* color: black; */
		border-radius: 20px;
	}

	.choose {
		background-color: #e64340;
		color: #ffffff;
	}

	.hide {
		border-radius: 40px;
		margin: 10px 25px;
		font-size: 23px;
		display: none;
	}

	.show {
		display: block;
		border-radius: 40px;
		margin: 10px 25px;
		font-size: 23px;
	}

	.van-button {
		width: 100% !important;
	}

	.van-dropdown-menu__title {
		box-sizing: border-box;
		color: var(--dropdown-menu-title-text-color, #323233);
		font-size: var(--dropdown-menu-title-font-size, 13px);
		line-height: var(--dropdown-menu-title-line-height, 18px);
		max-width: 100%;
		padding: var(--dropdown-menu-title-padding, 0 8px);
		position: relative;
	}

	.productDescribe {
		/* 超出文本隐藏 */
		width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ft-size1 {
		font-size: 16px !important;
	}

	.ft-size2 {
		font-size: 14px !important;
	}

	.ft-size13 {
		font-size: 13px !important;
	}

	.ft-size {
		font-size: 12px !important;
	}

	.van-tag {
		align-items: center;
		border-radius: var(--tag-border-radius, 2px);
		color: var(--tag-text-color, #fff);
		display: inline-flex;
		font-size: 10px !important;
		line-height: var(--tag-line-height, 16px);
		padding: var(--tag-padding, 0 4px);
		position: relative;
	}
</style>
