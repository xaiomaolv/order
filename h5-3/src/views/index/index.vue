<template>
	<div class="container">
		<div class="top  pd-tp-15 bg-w">
			<div class="flex-row pd-lr-15">
				<div class="top-map" @click="clickMap">
					<van-icon name="location-o" class="ft-se-18 li-hg-22"/>{{location.address}}
				</div>
			</div>
			 <!-- 搜索 -->
			<div class="seach flex-col bg-w">
				<van-search class='w-100' v-model="searchVal" placeholder="请输入搜索关键词"  shape="round"  show-action  @search="onSearch" @cancel="onCancel">
					<template #action>
						<div class='ft-se-16' @click="handleSeach" style="color:#C83C3C">搜索</div>
					</template>
				</van-search>
			</div>
			<div class="">
				<van-dropdown-menu>
				  <van-dropdown-item v-model="defaultSort" :options="options" @change='changeRange'/>
				  <van-dropdown-item :title="categoryName" ref="item">
						<van-tree-select
						  v-model:active-id="activeId"
						  v-model:main-active-index="activeIndex"
						  :items="items"
							@click-nav="onClickNav" @click-item="onClickItem"
						/>
						<div  class="flex-row mg-tp-10 pd-bt-10 ">
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button   type="default"  size="normal" color="var(--primary-color)"  block round @click="onReset">全部美食</van-button>
								</div> 
							</div>
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button  type="danger" color="var(--primary-color)"  size="normal"  block round @click="onConfirm"> 确认 </van-button>
								</div>
							</div>
						</div>
				  </van-dropdown-item>
					
					<van-dropdown-item :title="sxName" ref="sxitem" @open="handleOpen" @close="handleClose">
						<div class="flex-row flex-wrap  tx-ct pd-lr-15 mg-tp-15">  
							<div class="flex-col-8 pd-tb-8"
								v-for="(item, index) in screenList" :key="item.id" @click="sxBind(item,index)">
								<div class="guige-border guige" :class="{'choose': active == index }">{{item.name}}</div>
							</div>
						</div>
						<div  class="flex-row mg-tp-10 pd-bt-10 ">
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button color="var(--primary-color)"   type="default"  size="normal"  block round @click="onResetSx">全部</van-button>
								</div> 
							</div>
							<div class="flex-col-12 ">
								<div class="w-80">
									<van-button color="var(--primary-color)" type="danger"  size="normal"  block round @click="onConfirmSx"> 确认 </van-button>
								</div>
							</div>
	
						</div>
					</van-dropdown-item>
				</van-dropdown-menu>
			</div>
		</div>
		<div class="content">
			<div class="scroll pd-bt-20" >
				<div class="pd-lr-10 bg-w pd-bt-10" style="height: 170px;">
					<van-swipe :autoplay="3000" class="bd-rd-8 bg-w" style="border-radius: 8px; overflow: hidden; height: 170px;">
					  <van-swipe-item v-for="image in images" :key="image"  class='bg-w'  style=" height: 170px;">
					    <img :src="image" style="width: 100%; height: 100%;"/>
					  </van-swipe-item>
					</van-swipe>
				</div>
							
				<div class="">
					<div class="shop-card mg-tp-10" v-for="item in storeList" :key="item.id" @click="bindViewTap(item)" >
						<div class="bg-w flex-row pd-tb-10 pd-lr-10  flex-col-item">
							<div class="mg-rt-10"  style="width:4.375rem; height:4.375rem;">
								<img :src="`${imgUrl}${item.businessLogo}`"  class="imgStore" />
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
											
								<div  class="flex-row flex-col-item mg-tp-5 ">
									<div class="flex-1 tx-lt"> 
										<div class="row tx-of ft-se-13" style="width: 200px;">{{item.categoryName}}</div>
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
	import { Toast } from 'vant';
	import { jsonp } from 'vue-jsonp'
	import { reactive, onMounted,toRefs,nextTick, ref } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { login } from '@/api/login'
	import { getTypeList,getNearStore } from "@/api/store"
	import {CMap} from '@/utils/CMap'
	const mapKey = '7QZBZ-CL5LK-GINJ3-AP26H-CT7S6-6ABRH'
	export default {
		name:"",
		components: {

		},
		setup() {
			const item = ref(null);
			const sxitem = ref(null);
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				address: '昆明市',
				location:{
					address:'',
					lat:'',
					lng:''
				},
				
				searchVal:'',
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
				activeId:'',
				activeIndex:'',
				items:[],
				images:[
					'https://order.ynejkj.com/api/order/image/preview?fileName=81a5044b01b441f8ad855e630c02340520220907121217.png',
					'https://order.ynejkj.com/api/order/image/preview?fileName=03edeaa26f16449c9850860558735e1d20221011164636.jpg',
				],
				imgUrl:'https://order.ynejkj.com/api/order/image/preview?fileName=',
				storeList:[{
						businessId: "88",
						businessLogo: "da34efe8aadd4fbbaa5c3b9bcc5408f020220803161726.jpg",
						businessName: "8599小店铺",
						businessStatus: "1",
						categoryName: "三明治、牛排、鸡肉卷",
						distance: "0.07",
						reserveFlag: "0"
					},{
						businessId: "64",
						businessLogo: "834d23ac931148abb5713741ca50c3c120220613104050.png",
						businessName: "五谷渔粉",
						businessStatus: "1",
						categoryName: "火锅",
						distance: "0.07",
						reserveFlag: "0"
					},{
						businessId: "58",
						businessLogo: "84e8258932e345e1932b2c349357ab0120220606173115.png",
						businessName: "测试门店",
						businessStatus: "1",
						categoryName: "",
						distance: "0.07",
						reserveFlag: "1",
					},{
						businessId: "106",
						businessLogo: "abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
						businessName: "测试门店1",
						businessStatus: "1",
						categoryName: "鸡肉卷、",
						distance: "0.07",
						reserveFlag: "1",
					},{
						businessId: "76",
						businessLogo: "ce2eb6649a694d8fb51254f711bf442320220721103251.jpg",
						businessName: "陌上清风雨曲折",
						businessStatus: "1",
						categoryName: "三明治、鸡肉卷",
						distance: "0.07",
						reserveFlag: "1"
					},{
						businessId: "57",
						businessLogo: "136a226259194d64bc59d25f81b123a320220606171756.png",
						businessName: "测试门店",
						businessStatus: "1",
						categoryName: "",
						distance: "0.07",
						reserveFlag: "1"
					},
				]
			})
			onMounted( () => {
				console.log(route,222)				
				if(Object.keys(route.query).length !== 0){
					
					state.location = route.query
					
					getStoreList()
					
				}else{
					getLatLng()
				}
				
				init()
			})
			nextTick(() => {
				
			})
			const init = async () =>{
				let res = await getTypeList()
				if (res.code == 200) {
				    // state.option = res.data[0].children
						state.items = res.data[0].children
				}	 
			}

			const clickMap = () => {
				router.push({
					path:'/map',
					query:{
						...state.location 
					}
				})
			}
			const onSearch = (val) => {
				state.searchVal = val
				getStoreList()
			}
			const onCancel = (val) => {
				// Toast('取消')
				console.log(val,2222)
				// state.searchVal = val
			}
			const handleSeach = () => {
				getStoreList()
			}
			const onClickNav = () => {
				
			}  
			const onClickItem = (val) => {
				state.categoryId = val.id
			}
			
			const changeRange = (val) => {
				state.defaultSort = val
				getStoreList()
			}

			// 全部美食确认
			const  onConfirm = () => {
				
				item.value.toggle();
				getStoreList();
			}
			
			const  onReset = () => {

				item.value.toggle();
				
				state.categoryId = ''
				state.activeId = ''
				state.categoryName = '全部美食'
				
				getStoreList()
			}
			
			// 筛选选中
			const  sxBind = (item, index) => {
				state.active =  index
				state.reserveFlag = item.id
				state.sxName = item.name
				
			}
			
			const  onResetSx = () => {
				sxitem.value.toggle()
						
				state.reserveFlag = ''
				state.active = ''
				state.sxName = '筛选'
				
				getStoreList()
			}
			const onConfirmSx = () => {

				sxitem.value.toggle()
				getStoreList()
			}
			
			// 获取门店列表
			const getStoreList = () => {
				let params = {
				 	lat: state.location.lat, //位置经纬度
				 	lng: state.location.lng, //位置经纬度
				 	searchValue: state.searchVal,
				 	reserveFlag: state.reserveFlag,
				 	categoryId: state.categoryId, //分类id
					defaultSort: state.defaultSort,
				 	pageNum: 1,
				 	pageSize: 9999
				}
				getNearStore(params).then(res => {
				 	if (res.code == 200) {
				 		this.setData({
				 			storeList: res.rows
				 		})
				 	}
				})
				
			}
			const bindViewTap = (item) =>{
				router.push({
					path:'/restaurant',
					query:{
						businessId: item.businessId
					}
				})
			}
			// 获取当前经纬度
			const  getLatLng = () =>{
				let data = {
					output: 'jsonp',
					key: mapKey //这个key就是你申请的密钥
				} 
				let url = "https://apis.map.qq.com/ws/location/v1/ip"; //这个就是地理位置信息的接口
				jsonp(url, data)
					.then(res => {
						console.log(res,123);
						state.location = Object.assign(state.location, res.result.location)  
						getAreaCode(res.result)
						getStoreList()
					})
					.catch(error => {
						console.log(error,456);
					});
			}
			
			//地址逆解析获取详细地址
			const  getAreaCode = (data) =>{
				//这里可以直接this.$jsonp地址传入你的经纬度;
					jsonp("https://apis.map.qq.com/ws/geocoder/v1/?", {
						location: `${data.location.lat},${data.location.lng}`, // 经纬度
						key: mapKey, //这里就是要开启那个service不然会报错让你开启
						output: "jsonp", // output必须jsonp   不然会超时
					}).then((res) => {
					//获取到的res 就是继续的地址的所有信息;
						// state.address = res.result.address;
						state.location.address  = res.result.address;
					});
				}
		
			return {
				...toRefs(state),
				item,
				sxitem,
				clickMap,
				onSearch,
				onCancel,
				handleSeach,
				onClickNav,
				onClickItem,
				onConfirm,
				onReset,
				getStoreList,
				changeRange,
				sxBind,
				getLatLng,
				getAreaCode,
				bindViewTap,
				onConfirmSx,
				onResetSx
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
.choose{
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
	:deep .van-dropdown-menu__bar{
		box-shadow:0 0px 0px rgba(100, 101, 102, .12)!important;
	}
	.content{
		height: calc(100vh - 140px);
		overflow: hidden;
	}
	.imgStore{
		height: 4.375rem;
		width: 4.375rem;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		/* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
	}
</style>
