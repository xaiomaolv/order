<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="top  pd-tp-15 bg-w" ref="top">
			<div class="flex-row flex-right flex-wrap pd-lr-15">
				<div class="top-map ft-se-14 tx-rt" @click="clickMap">
					{{location.address}}
					<van-icon name="location-o" class="ft-se-18 li-hg-22" />
				</div>
			</div>
			<!-- 搜索 -->
			<div class="seach flex-col bg-w">
				<van-search class='w-100' v-model="searchVal" placeholder="请输入搜索关键词" shape="round" show-action
					@search="onSearch" @cancel="onCancel">
					<template #action>
						<div class='ft-se-16' @click="handleSeach" style="color:#C83C3C">搜索</div>
					</template>
				</van-search>
			</div>
			<div class="">
				<van-dropdown-menu>
					<van-dropdown-item v-model="defaultSort" :options="options" @change='changeRange' />
					<van-dropdown-item :title="categoryName" ref="item">
						<van-tree-select :items="items" :active-id.sync="activeId" :main-active-index.sync="activeIndex"
							@click-nav="onClickNav" @click-item="onClickItem" />
						<div class="flex-row mg-tp-10 pd-bt-10 ">
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button type="default" size="normal" color="var(--primary-color)" block round
										@click="onReset">全部美食</van-button>
								</div>
							</div>
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button type="danger" color="var(--primary-color)" size="normal" block round
										@click="onConfirm"> 确认 </van-button>
								</div>
							</div>
						</div>
					</van-dropdown-item>

					<van-dropdown-item :title="sxName" ref="sxitem" @open="handleOpen" @close="handleClose">
						<div class="flex-row flex-wrap  tx-ct pd-lr-15 mg-tp-15">
							<div class="flex-col-8 pd-tb-8" v-for="(item, index) in screenList" :key="item.id"
								@click="sxBind(item,index)">
								<div class="guige-border guige" :class="{'choose': active == index }">{{item.name}}
								</div>
							</div>
						</div>
						<div class="flex-row mg-tp-10 pd-bt-10 ">
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button color="var(--primary-color)" type="default" size="normal" block round
										@click="onResetSx">全部</van-button>
								</div>
							</div>
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button color="var(--primary-color)" type="danger" size="normal" block round
										@click="onConfirmSx"> 确认 </van-button>
								</div>
							</div>

						</div>
					</van-dropdown-item>
				</van-dropdown-menu>
			</div>
		</div>
		<div class="content" :style="{height:`calc(100vh - ${topHeight}px)`}">
			<div class="scroll pd-bt-20">
				<div class="pd-lr-10 bg-w pd-bt-10" style="height: 170px;">
					<van-swipe :autoplay="3000" class="bd-rd-8 bg-w"
						style="border-radius: 8px; overflow: hidden; height: 170px;">
						<van-swipe-item v-for="item in swiperList" :key="item.id" class='bg-w' style=" height: 170px;">
							<div class="hg-100" @click="handleLink(item)" >
							<Img :src="`${item.activityImage}`" alt="" class="w-100 hg-100" />
							</div>

						</van-swipe-item>
					</van-swipe>
				</div>

				<div class="">
					<div class="shop-card mg-tp-10" v-for="item in storeList" :key="item.id" @click="bindViewTap(item)">
						<div class="bg-w flex-row pd-tb-10 pd-lr-10  flex-col-item">
							<div class="mg-rt-10" style="width:4.375rem; height:4.375rem;">
								<Img :src="`${item.businessLogo}`" alt="" class="imgStore" />
							</div>
							<div class="flex-1 ">
								<div class="flex-row flex-col-item ft-se-16 ">
									<div class="t-lt  flex-1 ft-bd flex-row tx-lt" style="font-size:16px">
										<div class="row tx-of" style="width:200px;">{{item.businessName}}</div>
									</div>
									<div class="tx-rt" style="width: 55px;">
										<van-tag type="primary" class="font-se-14">点</van-tag>
										<van-tag v-if="item.reserveFlag == 1" mark type="warning">预</van-tag>
									</div>
								</div>

								<div class="flex-row flex-col-item mg-tp-5 ">
									<div class="flex-1 tx-lt">
										<div class="row tx-of ft-se-13" style="width: 200px;">{{item.categoryName}}
										</div>
									</div>
									<div class="tx-rt ft-se-12" style="width: 55px;"> {{item.distance}}km</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
		

	</div>
</template>

<script>
	import { getToken } from '@/utils/auth';
	import {
		jsonp
	} from 'vue-jsonp'
	import {
		getTypeList,
		getNearStore
	} from "@/api/store"
	import {
		getActivityList
	} from '@/api/activity'
	import {
		CMap
	} from '@/utils/CMap'

	export default {
		name: "",
		data() {
			return {
				topHeight:'',
				address: '昆明市',
				location: {
					address: '',
					lat: '',
					lng: ''
				},

				searchVal: '',
				categoryName: '全部美食',
				sxName: '筛选',
				defaultSort: 0,
				option: [],
				// 默认排序
				options: [{
						text: '默认排序',
						value: 0
					},
					{
						text: '离我最近',
						value: 1
					},
				],

				screenList: [{
						id: 1,
						name: '堂食点餐'
					},
					{
						id: 2,
						name: '预约点餐'
					}
				],
				active: -1, //筛选按钮高亮显示
				reserveFlag: '', //筛选内容,
				activeId: '',
				activeIndex: '',
				items: [],
				swiperList: [
					// {
					// 	id: 0,
					// 	activityImage: "24dbf1c8ca1646d78c19c19f5362c5c620221206104306.png",
					// 	eventLink: "https://www.baidu.com",
					// },
				],

				storeList: [
					// {
					// 		businessId: "88",
					// 		businessLogo: "da34efe8aadd4fbbaa5c3b9bcc5408f020220803161726.jpg",
					// 		businessName: "8599小店铺",
					// 		businessStatus: "1",
					// 		categoryName: "三明治、牛排、鸡肉卷",
					// 		distance: "0.07",
					// 		reserveFlag: "0"
					// 	},{
					// 		businessId: "64",
					// 		businessLogo: "834d23ac931148abb5713741ca50c3c120220613104050.png",
					// 		businessName: "五谷渔粉",
					// 		businessStatus: "1",
					// 		categoryName: "火锅",
					// 		distance: "0.07",
					// 		reserveFlag: "0"
					// 	},{
					// 		businessId: "58",
					// 		businessLogo: "84e8258932e345e1932b2c349357ab0120220606173115.png",
					// 		businessName: "测试门店",
					// 		businessStatus: "1",
					// 		categoryName: "",
					// 		distance: "0.07",
					// 		reserveFlag: "1",
					// 	},{
					// 		businessId: "106",
					// 		businessLogo: "abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
					// 		businessName: "测试门店1",
					// 		businessStatus: "1",
					// 		categoryName: "鸡肉卷、",
					// 		distance: "0.07",
					// 		reserveFlag: "1",
					// 	},{
					// 		businessId: "76",
					// 		businessLogo: "ce2eb6649a694d8fb51254f711bf442320220721103251.jpg",
					// 		businessName: "陌上清风雨曲折",
					// 		businessStatus: "1",
					// 		categoryName: "三明治、鸡肉卷",
					// 		distance: "0.07",
					// 		reserveFlag: "1"
					// 	},{
					// 		businessId: "57",
					// 		businessLogo: "136a226259194d64bc59d25f81b123a320220606171756.png",
					// 		businessName: "测试门店",
					// 		businessStatus: "1",
					// 		categoryName: "",
					// 		distance: "0.07",
					// 		reserveFlag: "1"
					// 	},
				]
			}
		},
		created() {
			
			if (Object.keys(this.$route.query).length !== 0) {

				this.location = this.$route.query

				this.getStoreList()

			} else {
				this.getLatLng()
			}

			this.init()
		},
		mounted() {
			this.topHeight = this.$refs.top.clientHeight
		},
		methods: {
			handleLink(item){
				if(item.eventLink){
					window.location.href = item.eventLink
				}
			},
			goBack(){
				this.$router.go(-1)
			},
			async init() {
				let res = await getTypeList()
				if (res.code == 200) {
					this.items = res.data[0].children
				}

				let resD = await getActivityList({
					activityType: '1',
					activitySeat: '4',
				})

				this.swiperList.push(resD.data)
			},

			clickMap() {
				this.$router.push({
					path: '/map',
					query: {
						...this.location
					}
				})
			},
			onSearch(val) {
				this.searchVal = val
				this.getStoreList()
			},

			onCancel(val) {
				// Toast('取消')
				// this.searchVal = val
			},

			handleSeach() {
				this.getStoreList()
			},

			onClickNav() {

			},

			handleOpen() {

			},
			handleClose() {

			},
			onClickItem(val) {
				this.categoryId = val.id
			},

			changeRange(val) {
				this.defaultSort = val
				this.getStoreList()
			},

			// 全部美食确认
			onConfirm() {
				this.$refs.item.toggle();
				// item.value.toggle();
				this.getStoreList();
			},

			onReset() {

				this.$refs.item.toggle()

				this.categoryId = ''
				this.activeId = ''
				this.categoryName = '全部美食'

				this.getStoreList()
			},

			// 筛选选中
			sxBind(item, index) {
				this.active = index
				this.reserveFlag = item.id
				this.sxName = item.name

			},

			onResetSx() {

				this.$refs.sxitem.toggle()
				this.reserveFlag = ''
				this.active = ''
				this.sxName = '筛选'

				this.getStoreList()
			},

			onConfirmSx() {
				this.$refs.sxitem.toggle()
				this.getStoreList()
			},

			// 获取门店列表
			getStoreList() {
				let params = {
					lat: this.location.lat, //位置经纬度
					lng: this.location.lng, //位置经纬度
					searchValue: this.searchVal,
					reserveFlag: this.reserveFlag,
					categoryId: this.categoryId, //分类id
					defaultSort: this.defaultSort,
					pageNum: 1,
					pageSize: 9999
				}

				getNearStore(this.$qs.stringify(params)).then(res => {
					if (res.code == 200) {
						this.storeList = res.rows
					}
				})

			},

			bindViewTap(item) {
				this.$router.push({
					path: '/restaurant',
					query: {
						businessId: item.businessId
					}
				})
			},

			// 获取当前经纬度
			getLatLng() {
				let data = {
					output: 'jsonp',
					key: this.mapKey //这个key就是你申请的密钥
				}
				let url = "https://apis.map.qq.com/ws/location/v1/ip"; //这个就是地理位置信息的接口
				jsonp(url, data)
					.then(res => {

						this.location = Object.assign(this.location, res.result.location)
						this.getAreaCode(res.result.location)
						this.getStoreList()
					})
					.catch(error => {
						console.log(error, 456);
					});
			},

			//地址逆解析获取详细地址
			getAreaCode(data) {
				//这里可以直接this.$jsonp地址传入你的经纬度;
				jsonp("https://apis.map.qq.com/ws/geocoder/v1/?", {
					location: `${data.lat},${data.lng}`, // 经纬度
					key: this.mapKey, //这里就是要开启那个service不然会报错让你开启
					output: "jsonp", // output必须jsonp   不然会超时
				}).then((res) => {
					//获取到的res 就是继续的地址的所有信息;
					// this.address = res.result.address;
					this.location.address = res.result.address;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.guige-border {
		border: 1px solid #f7f2f2;
		background: #f7f2f2;
		border-radius: 10px;
	}

	.guige {
		margin: 5px;
		line-height: 24px;
		padding: 3px 0;
		/* color: black; */
		border-radius: 20px;
	}

	.choose {
		background-color: #e64340;
		color: #FFFFFF;
	}

	.my-swipe .van-swipe-item {
		color: #fff;
		font-size: 20px;
		line-height: 150px;
		text-align: center;
		background-color: #39a9ed;
	}

	:deep .van-dropdown-menu__bar {
		box-shadow: 0 0px 0px rgba(100, 101, 102, .12) !important;
	}

	.content {
		// height: calc(100vh - 186px);
		overflow: hidden;
	}

	.imgStore {
		height: 4.375rem;
		width: 4.375rem;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		/* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
	}
</style>
