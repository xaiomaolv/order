<template>
	<div class="container">
		<!-- <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack" /> -->
		<div class="back_bth_lt fixed ft-se-13" style="left: 0;top: 10px;" @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="zongFather" id='top' ref="topHg">
			<div class='HZL_top'>
				<div class="shopName">
					<div class="row flex-row flex-wrap tx-ct">
						<div class="flex-row flex-col-24 bg-w pd-tb-10 bd-bt">
							<div class="flex-row flex-col-item flex-col-24">
								<div class="flex-col-6 tx-lt pd-lt-10">
									<Img class="shopImg"  :src="`${resCode.businessLogo}`" />								
								</div>
								<div class="flex-col-18 tx-rt flex-col">
									<div class="flex-row flex-col-24">
										<div class="flex-col-14 tx-lt dianpu">{{resCode.businessName}}</div>
										<div class="flex-col-10 tx-rt pd-rt-10 li-hg-18" v-if="resCode.tableName">桌号：{{resCode.tableName}}</div>
									</div>
									<div class="flex-row flex-col-24 mg-tp-5">
										<div class="flex-col-14 tx-lt shuiang li-hg-20">{{resCode.address}}</div>
										<div class="flex-col-10 tx-rt pd-rt-10 ft-se-12" v-if="resCode.orderType !== '2'">{{resCode.mealNum}}人就餐</div>
										<div class="flex-col-10 tx-rt pd-rt-10 ft-se-12" v-else>外送订单</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 分类栏 -->
			<van-tabs v-model:active="active" @click-tab="onClickTab" class="bd-bt">
			  <van-tab title="点单"></van-tab>
			  <van-tab title="评论"></van-tab>
			</van-tabs>
		
		</div>
	
		<div class="content" v-show="active == 0" :style="{height:`calc(100vh - ${topHeight}px)`}">
			<div class="commodity" :style="{height:`calc(100vh - ${topHeight}px - 71px)`}">
				<!--左侧导航内容 -->
				<div class="leftNav">
					<div v-for="(item, index) in children" :key="item.categoryId" class="ps-re" :class="{ typeStyle: index === currentIndex }"
						@click="onClickNav(index)">
						<span class="leftTit">{{ item.categoryName }}</span>
						<van-badge :content="item.categoryNum" max="99" v-if="item.categoryNum > 0" class="ps-ab" style="right:0; top: 0;"></van-badge>
					</div>
				</div>
				<!--// 右侧商品内容 -->
				<div class="rightContant" ref="rightContant">
					<div ref="shopContant" class="pd-lr-10" id="shopContant">
						<div v-for="(item, pindex) in children"  :key="item.categoryId" class="listItem" >
							<div class="HZL_scroll_right_top tx-lt pd-tp-10 mg-bt-10">{{item.categoryName}}</div>
							<div class="HZL_scroll_right_view" :class='{ test1: child.soldOut !== "0" }'
									v-for="(child, cinedx) in item.children" :key="child.productId"  @click="lookDetail(child)">
									<div class="mg-rt-10">
											<Img class="goodimg" :src="`${child.productImage}`"  />
									</div>
									<div class="sjopName" style="width:100%">
											<div class="goods-name tx-lt tx-of" style="width: calc(100vw - 195px);">{{child.productName}}</div>
											<div class="flex-row">
													<div class="productDescribe flex-col-24 ft-se-12 li-hg-18 mg-bt-10">
															<div>{{child.productDescribe || ''}}</div>
													</div>
											</div>
										 
											<div class="">
													<div class="flex-row " >
															<div class="xianjia flex-row">
																	<div v-if="child.productPercentPrice == 0">￥{{child.productPrice}}</div>
																	<div v-else>￥{{child.productPercentPrice}}</div>
																	<div style="color:#959595">/份</div>
															</div>
															<div v-if="child.productPercentPrice > 0" class="yuanjia">
																	<div>￥{{child.productPrice || ''}}</div>
															</div>
													</div>
													<div class="cartcontrol-wrap  mg-tp-5">
															<div class="anniu" v-if="child.soldOut == 0">																
																	<div v-if='child.productNum > 0 && child.formatFlag == 0' @click.stop="reduceCart(child)"  class="cart-decrease">
																			<img class="cart-decrease" src="@/assets/cart/delete.png" />
																	</div>
																
																	<div v-if='child.productNum > 0 && child.formatFlag == 0' class="cart-count">{{child.productNum}}</div>
																	<div v-if="child.formatFlag == 0" @click.stop="handleAddCart($event, child)"	>	
																	 <!-- @click.stop='handleAddCart($event,child)' -->
																							
																			<img src="@/assets/cart/add.png" class="cart-add icon-add_circle" />																	
																	</div>
																	<div class="caozuo" v-if="child.formatFlag == 1"  @click.stop="ChooseSpecification(pindex,cinedx, child)">
																		<van-badge >
																			<template #content v-if="child.productNum > 0"> {{child.productNum}}</template>
																			<div class="gg-btn">选规格</div> 
																		</van-badge>
																	</div>
															</div>
															<div v-else style="color:red" class="tx-ct ft-se-14 ft-bd">已售罄</div>
													</div>
											</div>
									</div>
							</div>
						<!-- </template> -->
						</div>
					

					</div>
				</div>
			</div>
			
			<div  class='HZL_cat w-100 pd-tb-5 flex-row bd-tp fixed-bottom' id="cart" :style="{'z-index':(showPoup ? 3333 : 2) }">
				<div  class="HZL_isCat flex-row flex-col-24  pd-lt-10">
					<div class='flex-col-6' @click='HZLisCat'>
						<div class="HZL_cat_img_view">
							<img src='@/assets/cart/car.png' class='HZL_cat_img' />
							<div class='HZL_cat_num' v-if='HZL_num > 0'>{{HZL_num}}</div>
						</div>	
					</div>
					
					<div class="zongjia flex-col flex-col-10">
						<div class="zongjiajiage">合计：￥{{total == 0 ? priceAmount : total}}</div>
						<div class="peisong" v-if="discountAmount != 0">优惠：￥{{discountAmount}}</div>
					</div>
					
					<div class='flex-col-8 flex-right flex-row' v-if='HZL_num !== 0' @click="gotoMoney">
							<div class="HZL_cat_text btn mg-rt-10 w-80">
								选好了
							</div>
					</div>
				</div>
				
			</div>
		</div>
		
		<!-- 评论 -->
		<comment v-show="active == 1" :style="{height:`calc(100vh - ${topHeight}px)`}" :businessId='resCode.businessId' ></comment>
		
		<!-- 菜品详情 -->
		<!-- <van-popup v-model:show="showFoodList" round position="bottom" :style="{ height: '70%' }"  closeable
				close-icon="close" @close="onClose"> -->
			<div class="overlay" v-if="showFoodList" @click.stop="onClose"></div>
			<div class="popup"  v-if="showFoodList" style="height: 50%;">
				<van-icon name="close" class="popup__close-icon" @click.stop="onClose" />
				<div>
						<Img class="detailimg"  :src='`${foodDetail.productImage}`' />
				</div>
				<div class="foods tx-lt pd-lt-10">
						<div class="goods-name">{{foodDetail.productName}}</div>
						<div class="flex-row mg-bt-10">
								<div class="flex-col-24 ft-se-12 li-hg-18">{{foodDetail.productDescribe || ''}}</div>
						</div>
						<div class="pricePopup flex-row">
								<div class="xianjia" >
									<span v-show="foodDetail.productPercentPrice == 0">￥{{foodDetail.productPrice}}</span>
									<span v-show="foodDetail.productPercentPrice !== 0">￥{{foodDetail.productPercentPrice}}</span>
									<span style="color:#959595">/份</span>
								</div>
								<div class="yuanjia" v-show="foodDetail.productPercentPrice > 0">
									￥{{foodDetail.productPrice || ''}}
								</div>
						</div>
				</div>
			</div>
		
		<!-- </van-popup> -->
		
		<!-- 规格 -->
		<van-popup v-model:show="showPoup" class="w-90 bd-rd-8"  closeable close-icon="close" @close="onshowPoupClose">
			<div class='popup-container w-100 '>
				<div class="wx-popup-title pd-tp-20 pd-bt-15 tx-ct">{{curGoodsMap.productName}}</div>
				<div class="pd-lr-10 bd-tp">		
					<div class="wx-popup-con  ">
						<div v-for="(item, pindex) in curGoodsMap.formatTypeList" :key="item.formatId" class="content-1 mg-tp-15">
							<div class="clr-999 tx-lt pd-lt-5 mg-bt-10">{{item.formatName}}</div>
							<div class="box-1 flex-row flex-wrap">		
								<div class="flex-col-8 mg-bt-10" v-for="(child, cindex) in item.child" :key="child.dataId" @click="choseSpec(item,pindex,child,cindex)">
									<div  class="w-90 noneActive title_1 flex-row flex-center" style="line-height:22px;"  :class="{active: subIndex[pindex] == cindex}" >
										{{child.attributesName}}
										<div class="clr-d51 flex-row" v-if="child.productPrice > 0">
											<div>￥</div>
											<div class="ft-se-18">{{child.productPrice}}</div>
											<div class="hoticon">+</div>
										</div>
									</div>
								</div>
								
							</div>
						</div>
					</div>
					<div class="mg-tb-20 flex-row">
						<div class="clr-999 tx-lt mg-rt-10">已选规格</div>
						<div class="tx-lt">{{arr || ''}}</div>
					</div>
					<div class="flex-row pd-bt-20">
						<div class=" hadTotal flex-col-12 flex-row">
							<div class="ft-bd ft-se-16">总计</div>
							<div v-if="hasproductPercentPrice == 0" class="clr-d51 flex-row">
								￥<div class="ft-se-20">{{hasproductPrice || 0}}</div>
							</div>
							<div v-else class="clr-d51 flex-row">
								￥<div class="ft-se-20">{{hasproductPercentPrice || 0}}</div>
							</div>
							<div v-if="hasproductPercentPrice > 0" class="yuanjia">￥{{hasproductPrice || ''}}</div>
						</div>
						
						<div v-if="guigeCarNum == 0" class="flex-col-12  tx-rt  flex-row flex-right" @click="handlAddOrSubtract($event,'1')">
							<div class="joincar flex-row">
								<div class="ft-se-16">+</div>加入购物车
							</div>
						</div>
						
						<div v-else="guigeCarNum > 0" class="flex-col-12 tx-rt  mg-rt-10 flex-row flex-right">
							<div class='HZL_jian ps-re flex-col-24 tx-rt' @click="handlAddOrSubtract($event,'2')">
								<span class="ps-ab-ct" style="margin-top: -2px;">-</span>
							</div>
							<div class='HZL_num'>{{guigeCarNum}}</div>
							<div class='HZL_jiag flex-col-24 tx-rt' @click="handlAddOrSubtract($event,'1')">
								<div class="">+</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</van-popup>
	
		<!-- 购物车商品列表 -->
		<!-- <van-popup v-model:show="cartshow" round position="bottom" :style="{ height: 'auto', bottom: '70px' }"> -->
		<div class="overlay" v-if="cartshow" @click="handleCartshow"></div>
		<div class="popup" v-if="cartshow" style="min-height: 15%; max-height: 70%; ">
			<div class="flex-row flex-between pd-lr-15 bd-bt pd-tb-5">
				<div class="flex-col-18" >
					<div class="flex-row" v-if="resCode.orderType != '2'">
						<div class="mg-lt-10 " v-show="resCode.mealFee > 0"> 餐位费：{{resCode.mealFee}}元 X</div>
						<div class="mg-lt-10 " v-show="resCode.mealFee <= 0"> 就餐人数：</div>
						<div class=" tx-lt mg-lt-5" catchtap="stepper">
							<van-stepper v-model="mealNum" integer button-size="26px"  @change="onChange" :disabled="disablePlus" disable-input/>
						</div>
					</div>
					
				</div>
				<div class="flex-1 tx-rt">
					<div class="ft-se-14  flex-row pd-tb-10 pd-lr-15 flex-right" @click="HZL_zero">
						<van-icon name="delete-o" class='ft-se-18 mg-rt-5' /> 清空
					</div>
				</div>
			
			</div>
			
			<div class="HZL_cat_scroll pd-lr-10 pd-tb-10 scroll-col">
			<div class="scroll">
				<div class="flex-row pd-tb-12 bd-bt" v-for='(item, index) in HZL_my_cat' :key='item.productId' :class="{'bd-no': index == HZL_my_cat.length-1 }">
					<div class="catLeft mg-rt-15">
						<Img class="catEftImg"  :src="`${item.productImage}`" />
					</div>
					<div class="catRight flex-1 flex-col">
						<div class="">{{item.productName}}</div>
						<div class="clr-999 ft-se-12">{{item.attributesName || ''}}</div>
						<div class="flex-row flex-between flex-col-24">
							<div class="flex-1 flex-row">
								<div class="gouwuchePrice" v-if="item.percentPriceAmount == 0">￥{{item.priceAmount}} </div>
								<div v-else class="gouwuchePrice">￥{{item.percentPriceAmount || ''}}</div>
								<div v-if="item.percentPriceAmount > 0" class="yuanjia">￥{{item.priceAmount || ''}}</div>
							</div>
							<div class="HZL_cat_scrollView_view flex-row ">								
								<div v-if='item.productNum == 0' class='HZL_num'></div>
								<div v-if='item.productNum > 0' class='HZL_jianx ps-re' @click='reduceCart(item)'>
									<span class="ps-ab-ct" style="margin-top: -2px;">-</span>
								</div>
								<div v-if='item.productNum > 0' class='HZL_num'>{{item.productNum}}</div>
								<div class="HZL_jia" @click='handleAddCart($event,item)'>
									<van-icon name="add-o" size="28px" color="#D5362F"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
		</div>
		
		<!-- </van-popup> -->
		<!-- 购物车小球动画 -->
		<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
			<div v-show="ball.show" class="ball">
				<div class="inner inner-hook" />
			</div>
		</transition>
		
		
		<van-dialog v-model="showdialog" v-if="showdialog" title="提示"  show-cancel-button @cancel="handelCancel"  @confirm="handleconfirm">
		  <div class="tx-ct pd-tb-20 pd-lr-15 ft-se-14">
		  	{{msg}}
		  </div>
		</van-dialog>
	</div>
</template>


<script>
	import BScroll from "better-scroll";
	import { ImagePreview } from 'vant';
	import { Toast, Dialog } from 'vant';
	import { getLocal } from '@/utils/auth';
	import { debounce } from '@/utils/debounce';
	import { getCommentList, getCartInfo, addCart, delCart, getFormatList, getNormsList, addDiningNum, cart, wxsend } from '@/api/cart'
	import { img_prveview } from "@/utils/imgbase"
	import Comment from './comment.vue'
	// import {sendWebsocket, closeWebsocket, initWebSocket} from '@/utils/websocket'
	import websocket from '@/utils/websocket'
	export default {
		components:{
			Comment
		},
		data(){
			return {
				topHeight: 0,
				showdialog: false,
				msg:'',
				resCode:{},
				active:0,
				
				scrollY: 0, // 右侧滑动的时候距离顶部的值
				allHeight:[],// 所有右侧分类li的top组成的数组  (列表第一次显示后就不再变化)
				
				//模拟的商品数据
				shopList: [],
				children:[],

				curGoodsMap:{},
				showFoodList: false,
				foodDetail:{},
				showPoup: false,
				hasproductPercentPrice:0,
				hasproductPrice:0,
				subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
				guigeCarNum: 0, //规格购物车数量,
				selectArr:[],
				dataNorms: [], //规格选择数据
				selectArr: [], //存放被选中的值
				showSelectSpec: '', //展示选中的值
				dataIds: [],
				arr:'',
				mealNum:'',
				HZL_swiper_ID: 0,
				HZL_num: 0,
				HZL_isCat: 0,
				total: 0, //合计
				priceAmount: 0,
				discountAmount: 0, //优惠
				commont:[],
				cartshow: false,
				HZL_my_cat:[],
				ball: {
					show: false,
					el: null 
				},
				start:{},
				itemHg:[],
				paddingBottom:0,
				hg:0,
				foodsScroll:'',
				mealFee:'',
				timerTask: null,
				aIndex:'',
				orderId:'',
				isFirst: true,
				disablePlus: false,
				isAddnum: null,
				isFinashed: false,
				websock: null,
				lockReconnet: false, //避免重复连接
				isReconnet: false,
				userId:'',
				categoryData:[]
			}
		},
		async created(){
			
			this.resCode = this.$route.query
			let path = getLocal('prevPath')
			this.isShowPath = path === '/addressDelivery' ? true : false

		},
		
		beforeMount() {
					
		},
		mounted() {

			this.init()
			
			// setTimeout(()=>{
				this.getCartData()
			// },0)
			

			// 购物车轮询
			
			this.timer()

			
				
			this.topHeight = this.$refs.topHg.clientHeight
			
			if(window.history && window.history.pushState){
        // 往历史记录里面添加一条新的当前页面的url
        history.pushState(null,null,document.URL);
        // 给 popstate 绑定一个方法 监听页面刷新
        window.addEventListener('popstate', this.go, false);
      }
		},
		computed:{
			currentIndex:function(){
				return this.allHeight.findIndex((top, index) => {
						// scrollY>=当前top && scrollY<下一个top
						return this.scrollY >= top && this.scrollY < this.allHeight[index + 1];
					});
			}
		},

		methods:{	
			go(){
				console.log('浏览器返回')
				this.goBack()
				// websocket.onClose()
			},
			timer(){
				let _this = this
				this.timerTask = setInterval(function () {
					// _this.isFirst = false
					// setTimeout(()=>{
						_this.getCartData();
					// },0)
				}, 5000)
			},
			clear(){
				clearInterval(this.timerTask)
				this.timerTask = null
			},
			// 获取菜单列表
			async init(){			

				let params = {
					tableId: this.resCode.tableId,
					businessId: this.resCode.businessId,
					userId: this.resCode.userId,
				}

				let res = await getCartInfo(params)
				// let arr = Object.freeze(res.data.children)
				// this.categoryData = this.deepCopy(arr)
				// console.log(this.categoryData,999)
				this.children =   Object.freeze(res.data.children)
				this.$nextTick(() => {
					this.initializeOwn(); //初始化rightSide方法
					setTimeout(()=>{
						this.initializeRoll(); //滑动初始化方法
					},100)
				})

				
			},
			async getCartData(){
				let params = {
					tableId: this.resCode.tableId,
					mealFee: this.resCode.mealFee,
					businessId: this.resCode.businessId
				}
				
				if(this.resCode.orderType && this.resCode.orderType == 2){
					params.userId = ''
				}
				let tt = JSON.parse(JSON.stringify(params))
				let res = await cart(tt)
				
				this.$nextTick(()=>{
					this.HZL_my_cat = res.data.productInfo
					this.total = res.data.priceAmount
					this.HZL_num = res.data.productNum
					this.discountAmount = res.data.discountAmount
					this.priceAmount = res.data.priceAmount
				})
			
				
				// if(this.isFirst){
				// this.resCode.mealNum = this.mealNum = res.data.diningNum > 0 ? res.data.diningNum : this.resCode.mealNum
				this.mealNum = this.resCode.mealNum =  res.data.diningNum 
				// 	this.isFirst = false
				// }

				// 重新渲染树
				this.renderThree()

				// 判断添加人数是否请求成功，成功后开启定时器
				if(this.isAddnum == 1){
					// this.mealNum = this.resCode.mealNum = res.data.diningNum
					this.isAddnum = null
					this.timer()
				}

				
				
				if(res.data.tableFlag == '2'){
					this.showdialog = true
					this.msg = res.msg
					this.orderId = res.data.orderId
				}
				
				if(res.data.tableFlag == '3'){
					Dialog.alert({
						title: '提示',
						message: res.msg,
					})
					.then(() => {
						// on confirm
						this.$router.push({
							path:'/'
						})
					})
					
				}
			},
			renderThree(){
				const list = this.children 
				const cartArr = this.HZL_my_cat

				// 选中商品数量清零
				list.forEach((item, index) => {
					item.categoryNum = 0
					item.children.forEach((v)=>{
							v.productNum = 0
					})
				})

				// 回显选中商品的数量
				list.forEach((item, index) => {
					item.categoryNum = 0
					cartArr.forEach((el, i) => {
						if(item.categoryId === el.categoryId){
							item.children.forEach((v)=>{
								if(v.productId == el.productId ){
									v.productNum = el.productNum
									item.categoryNum += el.productNum
								}
							})
						}
					})
				})

				// if(cartArr.length == 0 || list.length == 0){
				// 	// 清空购物车 选中商品数量清零
				// 	list.forEach((item, index) => {
				// 		item.categoryNum = 0
				// 		item.children.forEach((v)=>{
				// 				v.productNum = 0
				// 		})
				// 	})

				// }else{
				// 	// 回显选中商品的数量
				// 	list.forEach((item, index) => {
				// 		item.categoryNum = 0
				// 		cartArr.forEach((el, i) => {
				// 			if(item.categoryId === el.categoryId){
				// 				item.children.forEach((v)=>{
				// 					if(v.productId == el.productId ){
				// 						v.productNum = el.productNum
				// 						item.categoryNum += el.productNum
				// 					}
				// 				})
				// 			}
				// 		})
				// 	})
				// } 

				this.$nextTick(()=>{
					this.children = list
					this.$forceUpdate()
				})
				
			},
			handleCartshow(){
				this.cartshow = false
			},
			handelCancel(){
				this.showdialog = false
				this.$router.push({
					path:'/',
				})
			},
			handleconfirm(){
				this.showdialog = false
				let obj = JSON.parse(JSON.stringify(this.resCode))
				obj.orderId = this.orderId
				this.$router.push({
					path:'/addCart',
					query:{
						... obj
					}
				})
			},
			goBack(){
				let path = getLocal('prevPath')
				console.log(path,'===========')
				if(path !== '/orderMeal'){
					this.$router.go(-1)
				}else{
					this.$router.push({
						path:'/',
					})
				}		
				// websocket.onClose()	
			},
			
			
			 //加入/删除购物车 operType 操作类型 1-新增 2-减少
			async addOrDelete(operType, product){
				let paras = {
					'businessId': this.resCode.businessId,
					'diningNum': this.resCode.mealNum,		
					"operType": operType,
					// ...product
					"productId": product.productId,
					"productName": product.productName,
					"productImage": product.productImage,
					"productPrice": product.productPrice,
					"productPercentPrice": product.productPercentPrice,
					"productDescribe": product.productDescribe,			
					"categoryId": product.categoryId,
					"formatFlag": product.formatFlag,
					"data": product.data,					
				}

				// 扫码点餐
				if(this.resCode.tableId){
					paras.tableId = this.resCode.tableId
				}
				
				// 外送
				if(this.resCode.orderType && this.resCode.orderType == 2){
					paras.userId = this.userId
				}
				

				await addCart(paras).then(res => {
					if (res.code == 200) {

						this.getCartData();

						// 规格商品，需要查询规格数据
						if(product.formatFlag == 1){
							this.getSpecPrice(1)
						}		
					}
				})
			},
			
			lookDetail:debounce(function(child){
				this.showFoodList =  true
				this.foodDetail = child
			},300),
			
			onClose(){
				this.showFoodList =  false
				this.foodDetail = {}
			},
			
			// 规格
			ChooseSpecification:debounce(function(pindex,cinedx, child){
				this.showPoup  = true
				let productInfo = child;
				productInfo.formatTypeList = productInfo.format.children			    
				this.curGoodsMap = productInfo 
				this.hasproductPercentPrice = 0 // productInfo.productPercentPrice
				this.hasproductPrice = 0 //productInfo.productPrice
				this.guigeCarNum = 0
			},300),
			
			// 选规格
			choseSpec:debounce(function(pitem,pindex,child,cindex){
				// this.subIndex[pindex] = cindex
				let n = pindex
				let index = cindex
				let item = child.attributesName
				let dataId = child.dataId
				
				if (this.selectArr[n] != item) {				
					this.selectArr[n] = item
					this.dataIds[n] = dataId
					this.dataNorms[n] = child
					this.subIndex[n] = index
					
				} else {
					this.selectArr[n] = ''
					this.subIndex[n] = -1; //去掉选中的颜色
				}

				const sub = [... new Set(this.selectArr)].every(e => e ==="")
				
				if(sub){
						this.hasproductPercentPrice = 0
						this.hasproductPrice = 0
						this.guigeCarNum = 0
						this.arr = ''
				}else{
					this.arr = this.selectArr.join('/') 
					this.getSpecPrice(2)
				}

			},300),
			
			// 根据规格查询购物车 type:1 查询  2： 加价
			getSpecPrice(type){
				let dataIds = []
				this.dataNorms.forEach(el => {
					dataIds.push({
						attributesName: el.attributesName,
						productPrice: type == 1 ? 0 : el.productPrice,
						dataId: el.dataId
					})
				})
				let params = {
					businessId: this.resCode.businessId,
					tableId: this.resCode.tableId,
					productId: this.curGoodsMap.productId,
					productPercentPrice: this.curGoodsMap.productPercentPrice,
					productPrice: this.curGoodsMap.productPrice,
					data: dataIds,
					userId: this.resCode.userId,
				}
				let tt = JSON.parse(JSON.stringify(params)) 
				
				let json = {
					json: JSON.stringify(tt)
				}
				
				getNormsList(this.$qs.stringify(json)).then(res => {
					if (res.code == 200) {
						if (res.data && Object.keys(res.data).length !== 0) {
							this.guigeCarNum = res.data.productNum
							this.hasproductPercentPrice = res.data.productPercentPrice
							this.hasproductPrice = res.data.productPrice
			
						} else {
							this.guigeCarNum = 0
							this.hasproductPercentPrice = this.curGoodsMap.productPercentPrice
							this.hasproductPrice = this.curGoodsMap.productPrice
						}
					}
				})
			},
			
			onshowPoupClose(){
				// console.log(this.subIndex,999)
				this.showPoup = false
				this.selectArr =  []
				this.dataIds = []
				this.dataNorms = []
				this.subIndex = []
				this.arr = this.selectArr.join('/')
			},
			/**
			 * 规格-购物车-加减
			 * e 点击事件
			 * type 加 或 减  1加 2减
			 * 
			 * */
			handlAddOrSubtract:debounce(function(e, type){			

				if (this.dataNorms.length != 0) {
					let norms = []
					this.dataNorms.forEach(el => {
						norms.push({
							attributesName: el.attributesName,
							productPrice: el.productPrice,
							dataId: el.dataId
						})
					})
					this.curGoodsMap.data = norms
					let product = this.curGoodsMap
					
					// 加
					if(type == 1){
						this.drop(e.target)
						this.guigeCarNum ++
					}else{
						this.guigeCarNum --
					}
					
					this.addOrDelete(type, product)
					
				}else{
					Toast.fail('请先选择规格')
				}
			},300),
			
			
			 //购物车 减少
			reduceCart:debounce(function(item){
				
			    let product = item; //当前id				
			    let operType = 2
			    this.addOrDelete(operType, item)
			    if (this.HZL_num == 0) {
			      this.HZL_isCat = 0;
			    } else {
			      this.HZL_isCat = 1;
			    }
			  },300),
		
			handleAddCart:debounce(function(e,item){
				let product = item; //当前id
				let operType = 1
				// 抛物线动画
				this.drop(e.target)
				this.addOrDelete(operType, item)	
			},300),
			
			HZLisCat:debounce(function(){
				this.cartshow = !this.cartshow
				if(this.showPoup){
					this.onshowPoupClose()
				}
				if(this.showFoodList){
					this.onClose()
				}
			},300),
			
			//清空购物车
			HZL_zero:debounce(function(){
				if(this.HZL_num == 0) return;
				let params = {
					"businessId": this.resCode.businessId,
				}
				if(this.resCode.tableId){
				 	params.tableId = this.resCode.tableId
				}
				
				if(this.resCode.orderType && this.resCode.orderType == 2){
				 	params.userId = this.userId
				}
	
				// let tt = JSON.parse(JSON.stringify(params))
				delCart(params).then(res => {
					if (res.code == 200) {
						Toast.success('清空成功')
						this.$nextTick(()=>{
							// 外卖送餐
							this.getCartData();
						})
					}
				})
			},300),
			
			// 就餐人数:debounce(function
			onChange:debounce(function(val){
				console.log('val', val)
				this.disablePlus = true
				let params = {
					tableId: this.resCode.tableId,
					diningNum: this.mealNum,
					diningFlag: 1
				}
				// 清除定时器 防止就人数与接口不一致
				this.clear()
				addDiningNum(params).then(res => {
					if (res.code == 200) {
						this.isAddnum = 1
						this.disablePlus = false
						this.mealNum = this.resCode.mealNum = res.data.diningNum
						this.getCartData();
						// this.timer()			
					}
				})
			},800),
			
			// 去结算
			gotoMoney(){
				let obj = {...this.resCode}
				obj.userId = this.userId
				this.$router.push({
					path:'/pay',
					query:{
						...obj
						
					}
				})
			},
			
			
			onClickTab(val){
				this.active = val.name
			},
			
			
			// 初始化滚动
			initializeRoll(){
				// new一个类的实例，前提必须确保父元素和子元素的内容已经正确渲染了，不然不会生效
				new BScroll(".leftNav", {
					click: true
				});
				// 组件实例上挂属性
				this.foodsScroll = new BScroll(".rightContant", {
					probeType: 3, // 因为惯性滑动不会触发
					click: true
				});
			
				// 给右侧列表绑定scroll监听
				this.foodsScroll.on("scroll", ({
					x,
					y
				}) => {
					// 如果子元素或者父元素 DOM 结构发生改变的时候，必须重新调用 scroll.refresh() 方法重新计算来确保滚动效果的正常
					this.foodsScroll.refresh()
					this.scrollY = Math.abs(y);
				});
				// 给右侧列表绑定scroll结束的监听
				this.foodsScroll.on("scrollEnd", ({
					x,
					y
				}) => {
					console.log("操作结束的下标值" + x, y);
					this.scrollY = Math.abs(y);
				});
			},
			
			// 初始化rightSide
			initializeOwn (){
				// 初始化rightSide
				const rightSide = [];
				let top = 0;
				rightSide.push(0);
				let itemHg = []
			
				setTimeout(()=>{
					let lis = this.$refs.shopContant.getElementsByClassName('listItem');
						// slice() 方法返回一个新的数组对象
						Array.prototype.slice.call(lis).forEach(li => {
							top += li.clientHeight; //相当于top = top + li.clientHeight
							rightSide.push(top);
							itemHg.push(li.clientHeight)
						});
					
					let rHeight = this.$refs.rightContant.clientHeight
					// 如果最后一个分类的高度小于右侧内容的高度，补足需要向上滚动的高度，即设置最后一个分类的高度为右侧内容的高度
					if(itemHg[itemHg.length - 1] < rHeight){
						let hg = rHeight - lis[lis.length -1].clientHeight
						rightSide[rightSide.length - 1] = rightSide[rightSide.length -1] + hg 
					}else{
						// 解决最后一个元素会被隐藏的情况
						rightSide[rightSide.length - 1] = rightSide[rightSide.length -1] + 120 
					}
					
					this.$refs.shopContant.style.height =  rightSide[rightSide.length -1]  +'px'
					
					//更新数据
					this.allHeight = rightSide;
					// console.log("每一个分类的下标" + rightSide);
				},0)
				
			
			},
			
			//左侧点击事件
			onClickNav:debounce(function (index){
				//拿到目标位置的scrollY，点击左侧导航，右侧列表滑动到对应的位置
				// 解决当定时器触发时，点击左侧第一个tab不会切换，右侧不会滚动 当index为0时，设置滚动距离为-1
				const scrolly = this.allHeight[index];	
				// 平滑滑动右侧列表
				this.foodsScroll.scrollTo(0, - scrolly, 500);
			},100),
			
		 predivImage(imgitem,index){
				let imgs = []
				imgitem.forEach(item=>{
					img_prveview(item).then(res=>{
						imgs.push(res)
					})
				})
				ImagePreview({
					images: imgs, //需要预览的图片 URL 数组
					showIndex: true, //是否显示页码
					loop: false, //是否开启循环播放
					startPosition: index //图片预览起始位置索引
				})
			},
			
			
			drop(el){ // 抛物
				let objSet = el.getBoundingClientRect()
				this.start.top = objSet.top
				this.start.left = objSet.left
				if (!this.ball.show) {
					this.ball.show = true
					this.ball.el = el					
				}			
			},
			
			beforeDrop(el){ /* 购物车小球动画实现 */
				const ball = this.ball
				if (ball.show) {
					// const rect = el.getBoundingClientRect() // 元素相对于视口的位置
					const x = this.start.left - 30 // 获取x
					// const x = (window.innerWidth - this.start.left - 10) // 获取x
					const y = -(window.innerHeight - this.start.top - 30) // 获取y
					el.style.display = ''
					el.style.webkitTransform = 'translateY(' + y + 'px)' // translateY
					el.style.transform = 'translateY(' + y + 'px)'
					const inner = el.getElementsByClassName('inner-hook')[0]
					inner.style.webkitTransform = 'translateX(' + x + 'px)'
					inner.style.transform = 'translateX(' + x + 'px)'
				}
			},
			
			dropping (el, done){ /* 样式重置 */
				const rf = el.offsetHeight
				el.style.webkitTransform = 'translate3d(0,0,0)'
				el.style.transform = 'translate3d(0,0,0)'
				const inner = el.getElementsByClassName('inner-hook')[0]
				inner.style.webkitTransform = 'translate3d(0,0,0)'
				inner.style.transform = 'translate3d(0,0,0)'
				el.addEventListener('transitionend', done)
			},
			
			afterDrop(el){ /* 初始化小球 */
				this.ball.show = false
				el.style.display = 'none'
			},

			//生成随机数
			getNum(){
				let num=''
				for (let index = 0; index <6; index++) {
					num += Math.floor(Math.random() * 10)	
				}
				return num + new Date().getTime()
			},
			
			// 数组对象深拷贝
			deepCopy(source){
				let arr = []
				// source.map(item=> {
				// 	let obj = {}
				// 	if(item.children.length !== 0){
				// 		item.children.map(v => {
				// 			obj.children.push(v)
				// 		})
				// 	}
				// 	item.
				// })
			}
		},
		beforeDestroy(){
			window.removeEventListener('popstate', this.go, false);
			this.clear()
			this.showdialog = false
		}
	}
</script>


<style lang="scss" scoped>
	.shopName {
		display: inline;
		// padding-left: 36px;
	}
	.shopImg {
	  width: 72px;
	  height: 70px;
	  margin-right: 13px;
	  border-radius: 5px;
	  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	.dianpu {
	  font-size: 17px;
	  font-family: PingFang SC;
	  font-weight: bold;
	  color: rgba(58, 58, 58, 1);
	}
	.shuiang {
	  font-size: 14px;
	  font-family: PingFang SC;
	  color: rgba(149, 149, 149, 1);
	}
	
	.content{
		height: calc(100vh - 201px);
	}
	
	
	.commodity {
		/* 最大的盒子样式 */
		display: flex;
		// position: fixed;
		// top: 0px;
		// bottom: 0px;
		// width: 100%;
		background: #fff;
		overflow: hidden;
		height: calc(100vh - 271px);
	}

	.leftNav {
		/* 左侧大盒子的整体样式 */
		width: 90px;
		background: rgb(248, 248, 248);
		overflow-y: scroll;
	}

	.typeStyle {
		/* 左侧导航选中的样式 */
		background: #fff;
		font-weight: bold;
		display: flex;
		align-items: center;
		color: rgb(255, 94, 121);
		justify-content: center;
		border-left: 2px solid rgb(255, 94, 121);
	}

	.leftTit {
		/* 左侧导航标题默认样式 */
		display: flex;
		height: 50px;
		justify-content: center;
		font-size: 14px;
		align-items: center;
	}

	.rightContant {
		/* 右侧大盒子的整体样式 */
		flex: 1;
	}

	.rightTtitle {
		/* 右侧标题样式 */
		// padding-left: 12px;
		height: 26px;
		line-height: 26px;
		font-size: 14px;
		font-weight: bold;
		color: rgb(147, 153, 159);
		// background: rgb(248, 248, 248);
		margin: 0;
	}

	.gather {
		/* 右侧每一个商品的样式 */
		display: flex;
		margin: 16px;
		display: flex;
		align-items: center;
	}

	.distance {
		/* 右侧图片与描述间距 */
		padding-left: 6px;
	}

	.gather img {
		/* 右侧图片样式 */
		width: 60px;
		height: 60px;
		vertical-align: middle;
	}

	// :last-child {
		/* 点击左侧导航右侧内容与左边对齐 */
		// margin-bottom: 0;
	// }

	.shopName {
		/* 右侧商品标题字体大小 */
		font-size: 14px;
	}

	.saleGood {
		/* 右侧月售好评样式 */
		font-size: 10px;
		color: rgb(147, 153, 159);
		padding: 4px 0px;
	}

	.saleGood span:first-child {
		/* 月售样式 */
		padding-right: 10px;
	}

	.price {
		/* 价格样式 */
		font-weight: bold;
		font-size: 14px;
		color: rgb(255, 94, 121);
	}
	
	.HZL_scroll_right_top {
	  font-weight: 600;
	  // width: 600rpx
	  height: 30px;
	  /* line-height: 80rpx; */
	  padding-left: 10px;
	  margin-left: 5px;
	  background: #ffffff;
	  letter-spacing: 2px;
	  font-size: 15px;
	  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
	  /* 超出文本隐藏 */
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	.HZL_scroll_right_view {
	  box-sizing: border-box;
	  display: flex;
	  position: relative;
	  padding: 10px 0 10px 5px;
	  box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2, 2px 2px 2px #f5f2f2;
	  border-radius: 6px;
	  margin: 0 1px 15px 0;
	}
	/* 遮罩层半透明 */
	.test1{
	  box-sizing: border-box;
	  display: flex;
	  position: relative;
	  padding: 10px 0 10px 5px;
	  box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2, 2px 2px 2px #f5f2f2;
	  background:#dddada;
	  opacity: 0.5;
	  border-radius: 10px;
	  margin: 0 1px 15px 0;
	}
	.goodimg {
	  width: 4.375rem;
	  height: 4.375rem;
	  border-radius: 8px;
	  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	.goods-name {
	  font-size: 15px;
	  font-family: PingFang SC;
	  font-weight: bold;
	  color: rgba(58, 58, 58, 1);
	  margin-bottom: 10px;
	}
	.productDescribe {
	  /* 超出文本隐藏 */
	  width: 100px;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
		text-align: left;
	}
	.xianjia {
	  font-size:14px;
	  font-family: PingFang SC;
	  color: rgba(234, 44, 26, 1);
	  margin-right: 3px;
	}
	
	.yuanjia {
	  font-size: 13px;
	  font-family: PingFang SC;
	  text-decoration: line-through;
	  color: rgba(150, 150, 150, 1);
	}
	.anniu {
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		justify-content: flex-end;
		margin-right: 4px;
		font-size: 0
	}
	.caozuo {
	  // position: absolute;
	  // bottom: 20px;
	}
	/* 规格 */
	.gg-btn{
	  /* width: 80% !important; */
	  // width: 60px !important;
	  padding: 3px 10px !important;
	  border-radius: 22px;
	  font-size: 12px !important;
	  color: white !important;
	  background-color: #c83c3c !important;
	}
	.cartcontrol-wrap{
	  right: 0;
	}
	.cart-decrease{
		width:26px;
		height:26px;
		display: inline-block;
	}
	.cart-add{
	  width:26px;
	  height:26px;
	  display: inline-block;
	  padding: 5px;
	  padding:0;
	  line-height: 24px;
	  font-size: 18px;
	  color: #D5362F;
	  background-repeat:no-repeat;
	  background-size: contain;
	  background-position:center;
	}
	.inner{
	  display: inline-block;
	  line-height: 24px;
	  font-size: 24px;
	  color: #D5362F;
	  transition: all 0.4s linear;
	  transform: rotate(0);
	}
	.inner{
	  transform: rotate(180deg);
	}
	.cart-count{
	  display:inline-block;
	  vertical-align:top;
	  width:32px;
	  /* padding-top:2px; */
	  line-height:24px;
	  text-align:center;
	  font-size:10px;
	  color:#D5362F;
	  line-height:20px;
	  float:left;
	  font-size:15px;
	}
	
	/*抛物线动画*/
	.good_box{
	  width: 18px;
	  height: 18px;
	  position: fixed;
	  border-radius: 50%;
	  overflow: hidden;
	  left: 50%;
	  top: 50%;
	  z-index: 2020;
	  background:#D5362F;
	}
	
	/* 购物车 */
	.num {
	  color: #e60a30;
	  width: 50rpx;
	  font-size: 30rpx;
	}
	
	.detailimg {
	  width: 100%;
	  height: 300px;
	}

	.wx-popup-title {
		// width: 100%;
		// padding: 28rpx;
		// text-align: center;
		font-size: 18px;
		font-weight: bold;
		border-bottom: 2rpx solid #9EA3BA;
		box-sizing: border-box;
	}
	.title_1 {
		/* background-color: #eeeeee; */
		padding: 5px 0px;
		margin-top: 8px;
		margin-right: 8px;
		border-radius: 3px;
		color: black;
		border: 1px solid gainsboro;
		color: gray
	}

	.title_1.active {
		border: 1px solid #e8580c;
		// color: #e8580c
		// color: #fff;
	}
	.hoticon {
		/* position: absolute;
		z-index: 1;
		top: 0px;
		right: 0px; */
		vertical-align: super;
	}
	// .noneActive {
	//   border: 1rpx solid gainsboro;
	//   color: gray
	// }

	.joincar {
		padding: 3px 8px;
		border: 1px solid #e64340;
		background: #e64340;
		color: white;
		border: 1px solid #e64340;
		background: #e64340;
		color: white;
		border-radius: 6px;
	}
	/* 购物车 */
	.HZL_cat {
		width: 100%;
		height: 4.4375rem;
		background-color: #FFFFFF;
	}
	.HZL_cat_text {
		// width: 38%;
		background: #c83c3c;
		color: #FFFFFF;
		padding: 8px 15px;
		border-radius: 20px; 
		text-align: center;
		display: inline;
		border: 1rpx solid rgb(236, 236, 236); 
		color: white;
		font-size: 18px;
	}
	.HZL_cat_img_view {
		// bottom: 2px;
		position: relative;
		width: 50px;
		height: 50px;
		// left: 7px;
		border-radius: 50%;
		background-color: #e64340;
		display: flex;
		justify-content: center;
		align-items: Center;
	}

	.HZL_cat_img {
		width: 35px;
		height: 35px;

	}

	.HZL_cat_num {
		position: absolute;
		width: 25px;
		height: 25px;
		top: -3px;
		right: -7px;
		background-color: #e64340;
		padding: 2.5rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: Center;
		color: white;
		font-size: 14px;
		border: 1rpx solid rgba(50, 50, 50, 0.3);
	}
	.zongjiajiage {
		font-size: 15px;
		font-family: PingFang SC;
		color: rgba(235, 60, 45, 1);
	}
	.peisong {
		font-size: 10px;
		font-family: PingFang SC;
		color: rgba(149, 149, 149, 1);
		margin-top: 6px;
	}
	.HZL_jian {
	  width: 28px;
	  height: 28px;
	  text-align: center;
	  line-height: 20px;
	  font-size: 28px;
	  background-color: #FFFFFF;
	  color: #D5362F;
	  border-radius: 50%;
	  border: 2px solid #D5362F;
	}
	.HZL_num {
	  font-size:14px;
	  color: #D5362F;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  padding: 0 8px;
	}
	
	.HZL_jiag {
	  width: 27px;
	  height: 27px;
	  text-align: center;
	  line-height: 27px;
	  font-size: 25px;
	  background: #c83c3c;
	  color: white;
	  border-radius: 50%;
	  /* position: relative; */
	}
	
	.HZL_jianx {
	  width: 26px;
	  height: 26px;
	  text-align: center;
	  line-height: 20px;
	  font-size: 26px;
	  background-color: #FFFFFF;
	  color: #D5362F;
	  border-radius: 50%;
	  border: 2px solid #D5362F;
	}


	.comList {
	  padding-bottom: 10px;
	  padding-right: 8px;
	  padding-left: 6px;
	  margin-bottom: 15px;
	  border-bottom: 1rpx solid #ECECEC;
	}
	.fl-rt {
	  float: right;
	}
	
	.listLeft {
	  width: 36px;
	  height: 36px;
	}
	
	.myimage {
	  width: 100%;
	  height: 100%;
	  border-radius: 50%;
	}
	/* 评论图片 */
	.com-img {
	  display: block;
	  width: 80px;
	  height: 80px;
	  margin: 10px;
	}
	
	.listDesc {
	  font-size: 14px;
	  font-family: PingFang SC;
	  color: rgba(27, 27, 27, 1);
	
	}
	
	.gouwuchePrice {
	  font-size: 15px;
	  font-family: PingFang SC;
	  color: rgba(234, 44, 26, 1);
	}
	
	.cells {
	  max-width: 100%;
	  background-color: #FFF;
	  padding-top: 10px; 
	}
	
	.num {
	  color: #e60a30;
	  width: 25px;
	  font-size: 15px;
	}
	
	
	.HZL_cat_scroll {
	  max-height: 55vh;
	  overflow: scroll;
	}
	.HZL_cat_scroll::-webkit-scrollbar {
		width: 0px;
		/*height: 4px;*/
	}

	
	// .HZL_cat_scroll::-webkit-scrollbar-thumb {
	// 	border-radius: 0px;
	// 	-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	// 	background: rgba(0, 0, 0, 0.2);
	// }
	
	// .HZL_cat_scroll::-webkit-scrollbar-track {
	// 	-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	// 	border-radius: 0;
	// 	background: rgba(0, 0, 0, 0.1);
	// }
	.catEftImg {
		width: 60px;
		height: 60px;
	}
	
	.ball {
	  position: fixed;
	  left: 20px;
	  bottom: 20px;
	  z-index: 10000;
	  transition: all .5s cubic-bezier(.4, -0.89, .55, .54);
		// transition: all .5s cubic-bezier(.08,-0.35,.99,.33)
	  /*贝塞尔曲线*/
	}
	
	.inner {
	  width: 20px;
	  height: 20px;
	  border-radius: 50%;
	  background-color: #c83c3c ;
	  transition: all .5s linear;
	}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
}
.popup {
		width: 100%;
    position: fixed;
		height: auto;
		bottom: 70px;
		z-index: 2;
    max-height: 100%;
    overflow-y: auto;
    background-color: #fff;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    -webkit-overflow-scrolling: touch;
		border-radius: 16px 16px 0 0;
}
.popup__close-icon {
    position: absolute;
    z-index: 1;
    color: #c8c9cc;
    font-size: 22px;
    cursor: pointer;
		top: 16px;
		right: 16px;
}
:deep .van-stepper__minus--disabled{
    color: #323233;
    background-color: #f2f3f5;
    cursor: not-allowed;
}
:deep .van-stepper__plus--disabled {
    color: #323233;
    background-color: #f2f3f5;
    cursor: not-allowed;
}

:deep .van-stepper__input:disabled{
	color: #323233;
	background-color: #f2f3f5;
	-webkit-text-fill-color: #323233;
	opacity: 1
}
</style>
