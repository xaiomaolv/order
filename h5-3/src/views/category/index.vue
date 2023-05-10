<template>
	<div class="container">
		<div class="zongFather" id='top' ref="topHg">
			<top-header :resCode='resCode'></top-header>

			<!-- 分类栏 -->
			<van-tabs v-model:active="active" @click-tab="onClickTab" class="bd-bt">
			  <van-tab title="点单"></van-tab>
			  <van-tab title="评论"></van-tab>
			</van-tabs>
		</div>

		
	
		<div class="content" v-if="active == 0" :style="{height:`calc(100vh - ${topHeight}px)`}">
			<div class="commodity" :style="{height:`calc(100vh - ${topHeight}px - 71px)`}">
				<!--左侧导航内容 -->
				<div class="leftNav">
					<div v-for="(item, index) in children" :key="index" class="ps-re" :class="{ typeStyle: index === currentIndex }"
						@click="onClickNav(index)">
						<span class="leftTit">{{ item.categoryName }}</span>
						<van-badge :content="item.categoryNum" max="99" v-if="item.categoryNum > 0" class="ps-ab" style="right:0; top: 0;"></van-badge>
					</div>
				</div>
				<!--右侧商品内容 -->
				<div class="rightContant" ref="rightContant">
					<div ref="shopContant" class="pd-lr-10" id="shopContant">
						<div v-for="(item, pindex) in children"  :key="item.categoryId" :ref="setRef" >
							<div class="HZL_scroll_right_top tx-lt pd-tp-10">{{item.categoryName}}</div>
							<div class="HZL_scroll_right_view" :class='{ test1: child.soldOut !== "0" }'
									v-for="(child, cinedx) in item.children" :key="child.productId"  @click="lookDetail(child)">
									<div class="mg-rt-10">
											<img class="goodimg" v-lazy="`${imgUrl}${child.productImage}`"  />
									</div>
									<div class="sjopName" style="width:100%">
											<div class="goods-name tx-lt tx-of" style="width: calc(100vw - 195px);">{{child.productName}}</div>
											<div class="flex-row">
													<div class="productDescribe flex-col-24 ft-se-12 li-hg-18 mg-bt-10">
															<div>{{child.productDescribe || ''}}</div>
													</div>
											</div>
										 
											<div class="flex-row ">
													<div class="flex-col-18 flex-row" >
															<div class="xianjia flex-row">
																	<div v-if="child.productPercentPrice == 0">￥{{child.productPrice}}</div>
																	<div v-else>￥{{child.productPercentPrice}}</div>
																	<div style="color:#959595">/份</div>
															</div>
															<div v-if="child.productPercentPrice > 0" class="yuanjia">
																	<div>￥{{child.productPrice || ''}}</div>
															</div>
													</div>
													<div class="flex-col-6 cartcontrol-wrap">
															<div class="anniu" v-if="child.soldOut == 0">																
																	<div v-if='child.productNum > 0 && child.formatFlag == 0' @click.stop="HZL_jian(child)"  class="cart-decrease">
																			<img class="cart-decrease" src="@/assets/cart/delete.png" />
																	</div>
																
																	<div v-if='child.productNum > 0 && child.formatFlag == 0' class="cart-count">{{child.productNum}}</div>
																	<div v-if="child.formatFlag == 0" @click.stop='HZL_jia($event,child)'>								
																			<img src="@/assets/cart/add.png" class="cart-add icon-add_circle" />																	
																	</div>
																	<div class="caozuo" v-if="child.formatFlag == 1">
																			<div v-if="child.formatFlag == 1" @click.stop="ChooseSpecification(pindex,cinedx, child)"
																				class="gg-btn" type="warn" size="">
																				选规格
																			</div>
																			<div class='cornorMark' v-if='child.productNum > 0'>
																					<div>{{child.productNum}}</div>
																			</div>
																	</div>
															</div>
															<div v-else style="color:red" class="tx-ct ft-se-14 ft-bd">已售罄</div>
													</div>
											</div>
									</div>
							</div>
						</div>
					

					</div>
				</div>
			</div>
			
			<div  class='HZL_cat w-100 pd-tb-5 flex-row bd-tp ps-re' id="cart" style="z-index:9999;">
				<div  class="HZL_isCat flex-row flex-col-24  pd-lt-10">
					<div class='flex-col-6' @click='HZL_isCat'>
						<div class="HZL_cat_img_view">
							<img src='@/assets/cart/car.png' class='HZL_cat_img' />
							<div class='HZL_cat_num' v-if='HZL_num > 0'>{{HZL_num}}</div>
						</div>	
					</div>
					
					<div class="zongjia flex-col flex-col-10">
						<div class="zongjiajiage">合计：￥{{total == 0 ? priceAmount : total}}</div>
						<div class="peisong" v-if="discountAmount != 0">优惠：￥{{discountAmount}}</div>
					</div>
					
					<div class='flex-col-8 flex-right flex-row' v-if='HZL_num == 0' @click="gotoMoney">
							<div class="HZL_cat_text btn mg-rt-10 w-80">
								选好了
							</div>
					</div>
				</div>
				
			</div>
		</div>
		
		<!-- 评论  v-else :style="{height:`calc(100vh - ${topHeight}px)`}" -->
		<comment v-show="active == 1" :style="{height:`calc(100vh - ${topHeight}px)`}" :businessId='resCode.businessId' ></comment>
	
		<!-- 菜品详情 -->
		<van-popup v-model:show="showFoodList" round position="bottom" :style="{ height: '70%' }"  closeable
				close-icon="close" @close="onClose">
				<div>
						<img class="detailimg" :src='`${imgUrl}${foodDetail.productImage}`' />
				</div>
				<div class="foods tx-lt pd-lt-10">
						<div class="goods-name">{{foodDetail.productName}}</div>
						<div class="flex-row mg-bt-10">
								<div class="flex-col-24 ft-se-12 li-hg-18">{{foodDetail.productDescribe || ''}}</div>
						</div>
						<div class="pricePopup flex-row">
								<div class="xianjia">
										￥{{foodDetail.productPercentPrice}}<text style="color:#959595">/份</text>
								</div>
								<div class="yuanjia">￥{{foodDetail.productPrice}}</div>
						</div>
				</div>
		</van-popup>
		
		<!-- 规格 -->
		<van-popup v-model:show="showPoup" class="w-90 bd-rd-8" closeable close-icon="close" @close="onshowPoupClose">
			<div class='popup-container w-100 '>
				<div class="wx-popup-title pd-tp-20 pd-bt-15 tx-ct">{{curGoodsMap.productName}}</div>
				<div class="pd-lr-10 bd-tp">		
					<div class="wx-popup-con  ">
						<div v-for="(item, pindex) in curGoodsMap.formatTypeList" :key="pindex" class="content-1 mg-tp-15">
							<div class="clr-999 tx-lt pd-lt-5 mg-bt-10">{{item.formatName}}</div>
							<div class="box-1 flex-row flex-wrap">		
								<div class="flex-col-8" v-for="(child, cindex) in item.child" :key="cindex" @click="choseSpec(item,pindex,child,cindex)">
									<div  class="w-90 noneActive title_1 flex-row flex-center"  :class="{active: subIndex[pindex] == cindex}" >
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
							<div class='HZL_jian flex-col-24 tx-rt' @click="handlAddOrSubtract($event,'2')">-</div>
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
		<van-popup v-model:show="cartshow" round position="bottom" :style="{ height: 'auto', bottom: '70px' }">
			<div class="flex-row flex-between pd-lr-15 bd-bt pd-tb-5">
				<div class="flex-row flex-1" >
					<div class="mg-lt-10 "> 餐位费：{{mealFee}}元 X
					</div>
					<div class=" tx-lt mg-lt-5">
						<van-stepper v-model="mealNum" integer button-size="26px" @change="onChange"/>
					</div>
				</div>
				<div class="ft-se-14 flex-row pd-tb-10 pd-lr-15" @click="HZL_zero">
					<van-icon name="delete-o" class='ft-se-18 mg-rt-5' /> 清空
				</div>
			</div>
			
			<div class="HZL_cat_scroll pd-lr-10 pd-tb-10 scroll-col">
				<div class="scroll">
					<div class="flex-row pd-tb-12 bd-bt" v-for='(item, index) in HZL_my_cat' :key='index' :class="{'bd-no': index == HZL_my_cat.length-1 }">
						<div class="catLeft mg-rt-15">
							<img class="catEftImg"  v-lazy="`${imgUrl}${item.productImage}`" />
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
									<div v-if='item.productNum > 0' class='HZL_jianx' @click='HZL_jian(item)'>-</div>
									<div v-if='item.productNum > 0' class='HZL_num'>{{item.productNum}}</div>
									<div class="HZL_jia" @click='HZL_jia($event,item)'>
										<van-icon name="add-o" size="28px" color="#D5362F"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
			
		</van-popup>
		<!-- 购物车小球动画 -->
		<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
			<div v-show="ball.show" class="ball">
				<div class="inner inner-hook" />
			</div>
		</transition>
	</div>
</template>

<script>
	import { reactive, onMounted,toRefs,nextTick, computed,ref, watch } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import BScroll from "better-scroll";

	import { Toast } from 'vant';
	import { getCommentList, getCartInfo, addCart, delCart, getFormatList, getNormsList, addDiningNum } from '@/api/cart'
	import topHeader from './top.vue'
	import Comment from './comment.vue'
	import {productInfo, cartList} from './data'

	export default {
		name:"",
		components: {
			topHeader,
			Comment
		},
		setup() {
			let topHg = ref(null)
			let rightContant = ref(null)
			let foodsScroll = ref('')
			const shopContant = ref([])
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				isLogin: false,
				topHeight:0,
				imgUrl:'https://order.ynejkj.com/api/order/image/preview?fileName=',
				resCode:{
					address: "云南省昆明市官渡区广福路与云秀路交汇处1103号",
					businessId: "149",
					businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
					businessName: "闲时蜗居小店",
					businessStatus: "1",
					children: null,
					tableId: "10",
					tableName: "十人大桌",
					mealFee: 3,
					mealNum:6
				},
				active:0,
				
				scrollY: 0, // 右侧滑动的时候距离顶部的值
				allHeight:[],// 所有右侧分类li的top组成的数组  (列表第一次显示后就不再变化)
				
				//模拟的商品数据
				shopList: [],

				children: [{
					"categoryId": "18",
					"categorySort": "1",
					"categoryName": "冷饮",
					"ids": "id18",
					"categoryNum": null,
					"children": [{
						"productId": "14",
						"categoryId": "18",
						"businessId": null,
						"productName": "冰镇西瓜",
						"productNum": 0,
						"productImage": "d109a116376f462a99907ec2701173de20220610151625.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 20.00,
						"productPercentPrice": 18.50,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "冰冰凉凉大西瓜",
						"mealStatus": null,
						"formatFlag": "1",
						"status": null,
						"children": null,
						"attributesName": "冰冰凉凉大西瓜",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": {
							"productName": "冰镇西瓜",
							"productDescribe": "冰冰凉凉大西瓜",
							"productPrice": 20.00,
							"productPercentPrice": 18.50,
							"children": [{
								"formatId": "3",
								"businessId": null,
								"formatSort": null,
								"formatName": "温度",
								"formatMoney": "1",
								"child": [{
									"dataId": "146",
									"productId": null,
									"attributesName": "加冰",
									"productPrice": 0.00
								}]
							}, {
								"formatId": "5",
								"businessId": null,
								"formatSort": null,
								"formatName": "大小",
								"formatMoney": "1",
								"child": [{
									"dataId": "144",
									"productId": null,
									"attributesName": "中份",
									"productPrice": 2.00
								}, {
									"dataId": "145",
									"productId": null,
									"attributesName": "大份",
									"productPrice": 5.00
								}]
							}]
						},
						"child": null,
						"addTime": null
					}, {
						"productId": "22",
						"categoryId": "18",
						"businessId": null,
						"productName": "西瓜汁",
						"productNum": 0,
						"productImage": "ebf1c08c173e4acb9e39e06fa472a4b520220609094733.jpg",
						"recommend": "0",
						"soldOut": "1",
						"productPrice": 19.00,
						"productPercentPrice": 123.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "解腻",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "解腻",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "27",
						"categoryId": "18",
						"businessId": null,
						"productName": "百香柠檬",
						"productNum": 0,
						"productImage": "8301bef10fa141c0ae282c3d9641779620220523164836.png",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 20.00,
						"productPercentPrice": 18.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "大份米饭",
						"mealStatus": null,
						"formatFlag": "1",
						"status": null,
						"children": null,
						"attributesName": "大份米饭",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": {
							"productName": "百香柠檬",
							"productDescribe": "大份米饭",
							"productPrice": 20.00,
							"productPercentPrice": 18.00,
							"children": [{
								"formatId": "3",
								"businessId": null,
								"formatSort": null,
								"formatName": "温度",
								"formatMoney": "1",
								"child": [{
									"dataId": "135",
									"productId": null,
									"attributesName": "加冰",
									"productPrice": 1.00
								}, {
									"dataId": "136",
									"productId": null,
									"attributesName": "常温",
									"productPrice": 0.00
								}]
							}]
						},
						"child": null,
						"addTime": null
					}, {
						"productId": "91",
						"categoryId": "18",
						"businessId": null,
						"productName": "糯米香柠檬茶",
						"productNum": 0,
						"productImage": "359df5c3f8ce417ea60c3fe07c2217df20220602235921.png",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 0.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "糯米茶+香水柠檬",
						"mealStatus": null,
						"formatFlag": "1",
						"status": null,
						"children": null,
						"attributesName": "糯米茶+香水柠檬",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": {
							"productName": "糯米香柠檬茶",
							"productDescribe": "糯米茶+香水柠檬",
							"productPrice": 0.00,
							"productPercentPrice": 0.00,
							"children": [{
								"formatId": "3",
								"businessId": null,
								"formatSort": null,
								"formatName": "温度",
								"formatMoney": "1",
								"child": [{
									"dataId": "23",
									"productId": null,
									"attributesName": "加冰",
									"productPrice": 0.00
								}, {
									"dataId": "24",
									"productId": null,
									"attributesName": "常温",
									"productPrice": 0.00
								}]
							}, {
								"formatId": "6",
								"businessId": null,
								"formatSort": null,
								"formatName": "价格",
								"formatMoney": "1",
								"child": [{
									"dataId": "25",
									"productId": null,
									"attributesName": "超级杯",
									"productPrice": 18.00
								}, {
									"dataId": "26",
									"productId": null,
									"attributesName": "大杯",
									"productPrice": 15.00
								}, {
									"dataId": "27",
									"productId": null,
									"attributesName": "中杯",
									"productPrice": 12.00
								}]
							}]
						},
						"child": null,
						"addTime": null
					}, {
						"productId": "93",
						"categoryId": "18",
						"businessId": null,
						"productName": "冷饮双人餐",
						"productNum": 0,
						"productImage": "6522e9d91b3d4f86a65c6f976791725d20220606100916.png",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 28.00,
						"productPercentPrice": 27.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "柠檬水+糯米香柠檬茶",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "柠檬水+糯米香柠檬茶",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "94",
						"categoryId": "18",
						"businessId": null,
						"productName": "冷饮组合",
						"productNum": 0,
						"productImage": "558232800e0f4c52be593412303ae74820220608190200.png",
						"recommend": "0",
						"soldOut": "1",
						"productPrice": 24.00,
						"productPercentPrice": 23.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "103",
						"categoryId": "18",
						"businessId": null,
						"productName": "柠檬汁",
						"productNum": 0,
						"productImage": "2b8dcac63473430b842dca01a8f80bba20220920152521.png",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 10.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "104",
						"categoryId": "18",
						"businessId": null,
						"productName": "杨梅汁",
						"productNum": 0,
						"productImage": "a50f473df4074d22920e3ae4cb20178320220610113543.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 15.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "117",
						"categoryId": "18",
						"businessId": null,
						"productName": "绿豆糕",
						"productNum": 0,
						"productImage": "7bd74e9eee904260a5d06d198f52ab5c20220705161941.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 10.00,
						"productPercentPrice": 5.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "145",
						"categoryId": "18",
						"businessId": null,
						"productName": "凉菜2",
						"productNum": 0,
						"productImage": "79d1c21d999b4035acbbeeb9ed05f4e320220726112327.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 13.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "159",
						"categoryId": "18",
						"businessId": null,
						"productName": "冰水",
						"productNum": 0,
						"productImage": "db9f5370733248bca1e8bf7088dcbb2420220808190643.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 10.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}, {
						"productId": "162",
						"categoryId": "18",
						"businessId": null,
						"productName": "测试",
						"productNum": 0,
						"productImage": "ca12123107434640a6c626c04ab0820a20220824104828.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 30.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": null
					}]
					}, 
					{
						"categoryId": "68",
						"categorySort": "2",
						"categoryName": "特色美食",
						"ids": "id68",
						"categoryNum": null,
						"children": [{
							"productId": "148",
							"categoryId": "68",
							"businessId": null,
							"productName": "炸薯条",
							"productNum": 0,
							"productImage": "8f547f364cb54727ad23c3136deb94fb20220808152955.jpg",
							"recommend": "0",
							"soldOut": "1",
							"productPrice": 13.00,
							"productPercentPrice": 11.60,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "KFC",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "KFC",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}]
					}, 
					{
						"categoryId": "14",
						"categorySort": "3",
						"categoryName": "主食",
						"ids": "id14",
						"categoryNum": null,
						"children": [{
							"productId": "20",
							"categoryId": "14",
							"businessId": null,
							"productName": "米饭（小份）",
							"productNum": 0,
							"productImage": "11bca9bcc204479bb8f6a1e5ee5a015720220518160440.jpg",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 5.00,
							"productPercentPrice": 3.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "米饭小份",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "米饭小份",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "21",
							"categoryId": "14",
							"businessId": null,
							"productName": "清水面",
							"productNum": 0,
							"productImage": "5da5e6aa22264bc0931b6a4f23c4847420220518160357.jpg",
							"recommend": "0",
							"soldOut": "1",
							"productPrice": 13.00,
							"productPercentPrice": 12.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "q",
							"mealStatus": null,
							"formatFlag": "1",
							"status": null,
							"children": null,
							"attributesName": "q",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": {
								"productName": "清水面",
								"productDescribe": "q",
								"productPrice": 13.00,
								"productPercentPrice": 12.00,
								"children": [{
									"formatId": "5",
									"businessId": null,
									"formatSort": null,
									"formatName": "大小",
									"formatMoney": "1",
									"child": [{
										"dataId": "84",
										"productId": null,
										"attributesName": "小份",
										"productPrice": 0.00
									}]
								}]
							},
							"child": null,
							"addTime": null
						}, {
							"productId": "26",
							"categoryId": "14",
							"businessId": null,
							"productName": "小馒头",
							"productNum": 0,
							"productImage": "7211b45e6f654918b4f2ef8c313b2f3520220523164705.jpg",
							"recommend": "0",
							"soldOut": "1",
							"productPrice": 10.00,
							"productPercentPrice": 0.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "大份米饭",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "大份米饭",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "157",
							"categoryId": "14",
							"businessId": null,
							"productName": "宫保鸡丁盖饭+饭+汤+下饭菜",
							"productNum": 0,
							"productImage": "5c642c5201f64b3b854ed0e866aa9fec20220808175123.jpg",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 17.50,
							"productPercentPrice": 14.30,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "很好吃",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "很好吃",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}]
					}, {
						"categoryId": "69",
						"categorySort": "4",
						"categoryName": "测试套餐",
						"ids": "id69",
						"categoryNum": null,
						"children": [{
							"productId": "158",
							"categoryId": "69",
							"businessId": null,
							"productName": "菜品测试1",
							"productNum": 0,
							"productImage": "9bd9816d2fb8496fbb7cc78164c8242c20220808181111.png",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 20.00,
							"productPercentPrice": 18.50,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "160",
							"categoryId": "69",
							"businessId": null,
							"productName": "优惠套餐",
							"productNum": 0,
							"productImage": "20c7ce4a70364dcdbf4174cba21c081f20220809102109.png",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 30.00,
							"productPercentPrice": 0.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}]
					}, {
						"categoryId": "19",
						"categorySort": "5",
						"categoryName": "精选套餐",
						"ids": "id19",
						"categoryNum": null,
						"children": [{
							"productId": "28",
							"categoryId": "19",
							"businessId": null,
							"productName": "优惠套餐",
							"productNum": 0,
							"productImage": "f4cc9a6a001c47cca2ea6900b6af514920220523165027.jpeg",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 30.00,
							"productPercentPrice": 10.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "大份米饭",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "大份米饭",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "50",
							"categoryId": "19",
							"businessId": null,
							"productName": "实惠单人餐",
							"productNum": 0,
							"productImage": "81c443c1f55e40409e9e3777cd51540320220531214126.png",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 28.00,
							"productPercentPrice": 26.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "米饭-炒牛肉-百香柠檬",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "米饭-炒牛肉-百香柠檬",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}]
					}, {
						"categoryId": "20",
						"categorySort": "6",
						"categoryName": "超值午餐",
						"ids": "id20",
						"categoryNum": null,
						"children": [{
							"productId": "29",
							"categoryId": "20",
							"businessId": null,
							"productName": "一荤一素，赠送饮料",
							"productNum": 0,
							"productImage": "47754d3053a4411282dc22d185ccddc620220527155441.jpg",
							"recommend": "0",
							"soldOut": "1",
							"productPrice": 0.00,
							"productPercentPrice": 0.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "大份米饭",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "大份米饭",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "30",
							"categoryId": "20",
							"businessId": null,
							"productName": "纯素减肥餐",
							"productNum": 0,
							"productImage": "d3c7a47a72e24e16b9a03036e6c7e5d220220527174224.jpg",
							"recommend": "1",
							"soldOut": "0",
							"productPrice": 15.00,
							"productPercentPrice": 13.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "杂炒当季时蔬，低脂低盐健康",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "杂炒当季时蔬，低脂低盐健康",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "92",
							"categoryId": "20",
							"businessId": null,
							"productName": "干巴洋芋丝炒饭",
							"productNum": 0,
							"productImage": "2fdaaa103fb1454ea4f5203b5fcade4b20220606100211.ico",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 0.00,
							"productPercentPrice": 0.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "微辣",
							"mealStatus": null,
							"formatFlag": "1",
							"status": null,
							"children": null,
							"attributesName": "微辣",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": {
								"productName": null,
								"productDescribe": null,
								"productPrice": 0,
								"productPercentPrice": 0,
								"children": null
							},
							"child": null,
							"addTime": null
						}, {
							"productId": "95",
							"categoryId": "20",
							"businessId": null,
							"productName": "山药米饭",
							"productNum": 0,
							"productImage": "ea2b4023cae44e2a882246d4808b3eb120220608191041.png",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 19.00,
							"productPercentPrice": 18.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}]
					}, {
						"categoryId": "13",
						"categorySort": "7",
						"categoryName": "炒菜",
						"ids": "id13",
						"categoryNum": null,
						"children": [{
							"productId": "17",
							"categoryId": "13",
							"businessId": null,
							"productName": "青椒洋芋丝",
							"productNum": 0,
							"productImage": "65485e49c612464b8ca0f820490650be20220527174328.jpg",
							"recommend": "0",
							"soldOut": "1",
							"productPrice": 10.00,
							"productPercentPrice": 0.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "微微辣",
							"mealStatus": null,
							"formatFlag": "1",
							"status": null,
							"children": null,
							"attributesName": "微微辣",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": {
								"productName": "青椒洋芋丝",
								"productDescribe": "微微辣",
								"productPrice": 10.00,
								"productPercentPrice": 0.00,
								"children": [{
									"formatId": "15",
									"businessId": null,
									"formatSort": null,
									"formatName": "辣度",
									"formatMoney": "0",
									"child": [{
										"dataId": "105",
										"productId": null,
										"attributesName": "狠辣",
										"productPrice": 0.00
									}]
								}, {
									"formatId": "3",
									"businessId": null,
									"formatSort": null,
									"formatName": "温度",
									"formatMoney": "1",
									"child": [{
										"dataId": "104",
										"productId": null,
										"attributesName": "常温",
										"productPrice": 0.00
									}]
								}, {
									"formatId": "6",
									"businessId": null,
									"formatSort": null,
									"formatName": "价格",
									"formatMoney": "1",
									"child": [{
										"dataId": "103",
										"productId": null,
										"attributesName": "大份",
										"productPrice": 3.00
									}]
								}, {
									"formatId": "5",
									"businessId": null,
									"formatSort": null,
									"formatName": "大小",
									"formatMoney": "1",
									"child": [{
										"dataId": "102",
										"productId": null,
										"attributesName": "大份",
										"productPrice": 0.00
									}]
								}]
							},
							"child": null,
							"addTime": null
						}, {
							"productId": "19",
							"categoryId": "13",
							"businessId": null,
							"productName": "蒜蓉白菜",
							"productNum": 0,
							"productImage": "43ab23b4bc624133ad83206c47b2018220220518151209.jpg",
							"recommend": "1",
							"soldOut": "1",
							"productPrice": 28.00,
							"productPercentPrice": 26.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "不辣",
							"mealStatus": null,
							"formatFlag": "1",
							"status": null,
							"children": null,
							"attributesName": "不辣",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": {
								"productName": "蒜蓉白菜",
								"productDescribe": "不辣",
								"productPrice": 28.00,
								"productPercentPrice": 26.00,
								"children": [{
									"formatId": "5",
									"businessId": null,
									"formatSort": null,
									"formatName": "大小",
									"formatMoney": "1",
									"child": [{
										"dataId": "80",
										"productId": null,
										"attributesName": "大份",
										"productPrice": 0.00
									}]
								}]
							},
							"child": null,
							"addTime": null
						}, {
							"productId": "23",
							"categoryId": "13",
							"businessId": null,
							"productName": "炒牛肉",
							"productNum": 0,
							"productImage": "421f463c538e467eb5e1951e8f68aee820220520204823.jpg",
							"recommend": "1",
							"soldOut": "1",
							"productPrice": 48.00,
							"productPercentPrice": 46.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "q",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "q",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "24",
							"categoryId": "13",
							"businessId": null,
							"productName": "炒时蔬",
							"productNum": 0,
							"productImage": "443e7143909749a19dd0bc8f1e52ddf920220523164517.jpg",
							"recommend": "1",
							"soldOut": "0",
							"productPrice": 22.00,
							"productPercentPrice": 22.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "大份米饭",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "大份米饭",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "25",
							"categoryId": "13",
							"businessId": null,
							"productName": "炒山药",
							"productNum": 0,
							"productImage": "158c1e4b251d43dfab4babc288ff6fdc20220523164602.jpg",
							"recommend": "1",
							"soldOut": "0",
							"productPrice": 18.00,
							"productPercentPrice": 17.50,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "大份米饭",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "大份米饭",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "119",
							"categoryId": "13",
							"businessId": null,
							"productName": "猪肉",
							"productNum": 0,
							"productImage": "c2b1a9c9b4fd4287a4073482fb00873220220705164833.jpg",
							"recommend": "1",
							"soldOut": "0",
							"productPrice": 33.00,
							"productPercentPrice": 32.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}, {
							"productId": "147",
							"categoryId": "13",
							"businessId": null,
							"productName": "榨菜",
							"productNum": 0,
							"productImage": "92d314eec0124cffa58c528d9102386e20220802102650.jpg",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 33.00,
							"productPercentPrice": 11.60,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "很好吃",
							"mealStatus": null,
							"formatFlag": "1",
							"status": null,
							"children": null,
							"attributesName": "很好吃",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": {
								"productName": null,
								"productDescribe": null,
								"productPrice": 0,
								"productPercentPrice": 0,
								"children": null
							},
							"child": null,
							"addTime": null
						}]
					}, {
						"categoryId": "16",
						"categorySort": "9",
						"categoryName": "凉菜",
						"ids": "id16",
						"categoryNum": null,
						"children": [{
							"productId": "144",
							"categoryId": "16",
							"businessId": null,
							"productName": "凉菜",
							"productNum": 0,
							"productImage": "4f930522929142c190835bc02be9d5e020220726112301.jpg",
							"recommend": "0",
							"soldOut": "0",
							"productPrice": 10.00,
							"productPercentPrice": 0.00,
							"priceAmount": null,
							"percentPriceAmount": null,
							"packFee": null,
							"productDescribe": "",
							"mealStatus": null,
							"formatFlag": "0",
							"status": null,
							"children": null,
							"attributesName": "",
							"dataId": null,
							"addPrice": 0,
							"data": null,
							"format": null,
							"child": null,
							"addTime": null
						}]
					}, {
					"categoryId": "17",
					"categorySort": "10",
					"categoryName": "荤菜",
					"ids": "id17",
					"categoryNum": null,
					"children": [{
						"productId": "111",
						"categoryId": "17",
						"businessId": null,
						"productName": "猪肉",
						"productNum": 0,
						"productImage": "f3535b656a004c84a8d3266d4d7a2e2320220704175250.jpg",
						"recommend": "0",
						"soldOut": "0",
						"productPrice": 20.00,
						"productPercentPrice": 0.00,
						"priceAmount": null,
						"percentPriceAmount": null,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "1",
						"status": null,
						"children": null,
						"attributesName": "",
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": {
							"productName": "猪肉",
							"productDescribe": "",
							"productPrice": 20.00,
							"productPercentPrice": 0.00,
							"children": [{
								"formatId": "5",
								"businessId": null,
								"formatSort": null,
								"formatName": "大小",
								"formatMoney": "1",
								"child": [{
									"dataId": "98",
									"productId": null,
									"attributesName": "大份",
									"productPrice": 0.00
								}, {
									"dataId": "99",
									"productId": null,
									"attributesName": "22",
									"productPrice": 0.00
								}, {
									"dataId": "100",
									"productId": null,
									"attributesName": "小份",
									"productPrice": 0.00
								}, {
									"dataId": "101",
									"productId": null,
									"attributesName": "18",
									"productPrice": 0.00
								}]
							}]
						},
						"child": null,
						"addTime": null
					}]
				}]
				,
				curGoodsMap:{},
				showFoodList: false,
				foodDetail:{},
				showPoup: false,
				hasproductPercentPrice:'',
				hasproductPrice:'',
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
			
				cartshow: false,
				HZL_my_cat:[
					{
						"productId": "24",
						"categoryId": "13",
						"businessId": null,
						"productName": "炒时蔬",
						"productNum": 1,
						"productImage": "443e7143909749a19dd0bc8f1e52ddf920220523164517.jpg",
						"recommend": null,
						"soldOut": null,
						"productPrice": 22,
						"productPercentPrice": 22,
						"priceAmount": 22,
						"percentPriceAmount": 22,
						"packFee": null,
						"productDescribe": "大份米饭",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": null,
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": "20221026102047"
					}, {
						"productId": "157",
						"categoryId": "14",
						"businessId": null,
						"productName": "宫保鸡丁盖饭+饭+汤+下饭菜",
						"productNum": 1,
						"productImage": "5c642c5201f64b3b854ed0e866aa9fec20220808175123.jpg",
						"recommend": null,
						"soldOut": null,
						"productPrice": 17.5,
						"productPercentPrice": 14.3,
						"priceAmount": 17.5,
						"percentPriceAmount": 14.3,
						"packFee": null,
						"productDescribe": "很好吃",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": null,
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": "20221026102022"
					}, {
						"productId": "20",
						"categoryId": "14",
						"businessId": null,
						"productName": "米饭（小份）",
						"productNum": 6,
						"productImage": "11bca9bcc204479bb8f6a1e5ee5a015720220518160440.jpg",
						"recommend": null,
						"soldOut": null,
						"productPrice": 5,
						"productPercentPrice": 3,
						"priceAmount": 30,
						"percentPriceAmount": 18,
						"packFee": null,
						"productDescribe": "米饭小份",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": null,
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": "20221026101914"
					}, {
						"productId": "119",
						"categoryId": "13",
						"businessId": null,
						"productName": "猪肉",
						"productNum": 1,
						"productImage": "c2b1a9c9b4fd4287a4073482fb00873220220705164833.jpg",
						"recommend": null,
						"soldOut": null,
						"productPrice": 33,
						"productPercentPrice": 32,
						"priceAmount": 33,
						"percentPriceAmount": 32,
						"packFee": null,
						"productDescribe": "",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": null,
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": "20221026101840"
					}, {
						"productId": "50",
						"categoryId": "19",
						"businessId": null,
						"productName": "实惠单人餐",
						"productNum": 2,
						"productImage": "81c443c1f55e40409e9e3777cd51540320220531214126.png",
						"recommend": null,
						"soldOut": null,
						"productPrice": 28,
						"productPercentPrice": 26,
						"priceAmount": 56,
						"percentPriceAmount": 52,
						"packFee": null,
						"productDescribe": "米饭-炒牛肉-百香柠檬",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": null,
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": "20221026100708"
					}, {
						"productId": "28",
						"categoryId": "19",
						"businessId": null,
						"productName": "优惠套餐",
						"productNum": 2,
						"productImage": "f4cc9a6a001c47cca2ea6900b6af514920220523165027.jpeg",
						"recommend": null,
						"soldOut": null,
						"productPrice": 30,
						"productPercentPrice": 10,
						"priceAmount": 60,
						"percentPriceAmount": 20,
						"packFee": null,
						"productDescribe": "大份米饭",
						"mealStatus": null,
						"formatFlag": "0",
						"status": null,
						"children": null,
						"attributesName": null,
						"dataId": null,
						"addPrice": 0,
						"data": null,
						"format": null,
						"child": null,
						"addTime": "20221026100423"
				}],
				
					
				ball: {
					show: false,
					el: null 
				},
				start:{},
				itemHg:[],
				paddingBottom:0,
				hg:0
			})
			
			// watch(() => state.scrollY, (value) => {
			// 	let index = state.allHeight.findIndex((top, index) => {
			// 			// scrollY>=当前top && scrollY<下一个top
			// 			return state.scrollY >= top && state.scrollY < state.allHeight[index + 1];
			// 		});
			// 		// 返回结果
			// 		state.currentIndex =  index > 0 ? index: 0;
			// }, {immediate: true});
			
			const currentIndex = computed(()=>{
				return state.allHeight.findIndex((top, index) => {
						// scrollY>=当前top && scrollY<下一个top
						return state.scrollY >= top && state.scrollY < state.allHeight[index + 1];
					});
			})
			onMounted(async () => {
				
				console.log(productInfo,888)
				initializeOwn(); //初始化rightSide方法
				initializeRoll(); //滑动初始化方法
							
				// 分类
				init()
				
			
					
				
				console.log(topHg.value.offsetHeight)
				state.topHeight = topHg.value.offsetHeight
			})
			nextTick(() => {

			})
			// 获取菜单列表
			const init = async () => {			
				let {
					tableId, 
					businessId, 
					userId				      
				} = state.resCode
			 
				// let res = await getCartInfo({tableId,businessId,userId})
				let res = cartList
				// state.children = res.data.children
				state.HZL_my_cat = res.data.productInfo
				state.total = res.data.percentAmount
				state.HZL_num = res.data.productNum
				state.discountAmount = res.data.discountAmount
				state.priceAmount = res.data.priceAmount
				
				let list =  state.children
				let cartArr = state.HZL_my_cat
				
				// "productId": "157",
				// "categoryId": "14",
				// productNum
				// cartArr.map((item, index)=>{
				// 	let child = item.children
				// 	cartArr
				// }))
				// list.map((item, index)=>{
				// 	let child = item.children
				// 	cartArr
				// })
				
				list.forEach((item, index) => {
				
					cartArr.forEach((el, i) => {
						if(item.categoryId === el.categoryId){
							item.children.forEach((v)=>{
								if(v.productId == el.productId ){
									v.productNum = el.productNum
										item.categoryNum += el.productNum
								}
							})
							console.log(el.categoryId,' el.categoryId')
						}
					})
				})
				
				state.children = list
				console.log(list,999)
			}
			
			 //加入/删除购物车 operType 操作类型 1-新增 2-减少
			const addOrDelete = async (operType, product) =>{
				let paras = {
					"tableId": state.resCode.tableId,
					"userId": state.resCode.userId,
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
				// console.log(operType,paras,742552)
				await addCart(paras).then(res => {
					if (res.code == 200) {
						init();
						getSpecPrice(1)
					}
				})
			}
			const lookDetail = (child) =>{
				state.showFoodList =  true
				state.foodDetail = child
			}
			const onClose = ()=>{
				state.showFoodList =  false
			}
			// 规格
			const ChooseSpecification  = (pindex,cinedx, child) =>{
				state.showPoup  = true
				var productInfo = child;
				productInfo.formatTypeList = productInfo.format.children			    
				state.curGoodsMap = productInfo 
				state.hasproductPercentPrice = productInfo.productPercentPrice
				state.hasproductPrice = productInfo.productPrice
				// console.log(state.curGoodsMap,pindex,cinedx,'7788')    
			}
			
			// 选规格
			const choseSpec = (pitem,pindex,child,cindex) => {
				// state.subIndex[pindex] = cindex
				let n = pindex
				let index = cindex
				let item = child.attributesName
				let dataId = child.dataId
				
				if (state.selectArr[n] != item) {				
					state.selectArr[n] = item
					state.dataIds[n] = dataId
					state.dataNorms[n] = child
					state.subIndex[n] = index
				} else {
					state.selectArr[n] = ''
					state.subIndex[n] = -1; //去掉选中的颜色
				}
				
				state.arr = state.selectArr.join('/')

				getSpecPrice(2)
			}
			
			// 根据规格查询购物车 type:1 查询  2： 加价
			const getSpecPrice = (type) => {
				let dataIds = []
				state.dataNorms.forEach(el => {
					dataIds.push({
						attributesName: el.attributesName,
						productPrice: type == 1 ? 0 : el.productPrice,
						dataId: el.dataId
					})
				})
				let params = {
					tableId: state.resCode.tableId,
					productId: state.curGoodsMap.productId,
					productPercentPrice: state.curGoodsMap.productPercentPrice,
					productPrice: state.curGoodsMap.productPrice,
					data: dataIds,
					userId: state.resCode.userId,
				}
				let tt = JSON.parse(JSON.stringify(params)) 
				// console.log(tt,888)
				let json = {
					json: JSON.stringify(tt)
				}
				// console.log(json, 'json');
				getNormsList(json).then(res => {
					if (res.code == 200) {
						if (res.data && Object.keys(res.data).length !== 0) {
							state.guigeCarNum = res.data.productNum
							state.hasproductPercentPrice = res.data.productPercentPrice
							state.hasproductPrice = res.data.productPrice
			
						} else {
							state.guigeCarNum = 0
							state.hasproductPercentPrice = state.curGoodsMap.productPercentPrice
							state.hasproductPrice = state.curGoodsMap.productPrice
						}
					}
				})
			}
			const onshowPoupClose = () =>{
				state.showPoup = false
				state.selectArr =  []
				state.dataIds = []
				state.dataNorms = []
				state.subIndex = []
				state.arr = state.selectArr.join('/')
			}
			/**
			 * 规格-购物车-加减
			 * e 点击事件
			 * type 加 或 减  1加 2减
			 * 
			 * */
			const handlAddOrSubtract = (e, type) =>{			
				console.log(e.target,999)
				if (state.dataNorms.length != 0) {
					let norms = []
					state.dataNorms.forEach(el => {
						norms.push({
							attributesName: el.attributesName,
							productPrice: el.productPrice,
							dataId: el.dataId
						})
					})
					state.curGoodsMap.data = norms
					let product = state.curGoodsMap
					
					// 加
					if(type == 1){
						drop(e.target)
						state.guigeCarNum ++
					}else{
						state.guigeCarNum --
					}
					
					addOrDelete(type, product)
					
				}else{
					Toast.fail('请先选择规格')
				}
			}
			
			
			 //购物车 减少
			const  HZL_jian =  (item) =>{
			    let product = item; //当前id				
			    let operType = 2
			    addOrDelete(operType, item)
			    if (state.HZL_num == 0) {
			      state.HZL_isCat = 0;
			    } else {
			      state.HZL_isCat = 1;
			    }
			  }
			// 购物车增加
			const HZL_jia = (e,item) => {
				let product = item; //当前id
				console.log(item,999)
				let operType = 1
				// 抛物线动画
				drop(e.target)
				addOrDelete(operType, item)
				
			}
			const HZL_isCat = () =>{
				state.cartshow = !state.cartshow
			}
			//清空购物车
			const HZL_zero = ()=>{
				let params = {
					tableId: state.resCode.tableId,
					userId: state.resCode.userId
				}
				let tt = JSON.parse(JSON.stringify(params))
				delCart(tt).then(res => {
					if (res.code == 200) {
						getCartList();
					}
				})
			}
			  // 就餐人数
			const  onChange = (val) =>{
				state.mealNum = val
		
				let params = {
					tableId: state.resCode.tableId,
					diningNum: state.mealNum
				}
				addDiningNum(params).then(res => {
					if (res.code == 200) {
						this.getCartList()
					}
				})
			}
			// 去结算
			const gotoMoney = () => {
				router.push({
					path:'/pay',
					query:{
						...state.resCode
					}
				})
			}
			
			
			
			const setRef = (el) => {
				shopContant.value.push(el);
			};
			const onClickTab = (val) => {
				state.active = val.name
			}
			// 初始化滚动
			const initializeRoll = () => {
				// new一个类的实例，前提必须确保父元素和子元素的内容已经正确渲染了，不然不会生效
				new BScroll(".leftNav", {
					click: true
				});
				// 组件实例上挂属性
				foodsScroll = new BScroll(".rightContant", {
					probeType: 3, // 因为惯性滑动不会触发
					click: true
				});

				// 给右侧列表绑定scroll监听
				foodsScroll.on("scroll", ({
					x,
					y
				}) => {
					// 如果子元素或者父元素 DOM 结构发生改变的时候，必须重新调用 scroll.refresh() 方法重新计算来确保滚动效果的正常
					foodsScroll.refresh()
					state.scrollY = Math.abs(y);
				});
				// 给右侧列表绑定scroll结束的监听
				foodsScroll.on("scrollEnd", ({
					x,
					y
				}) => {
					console.log("操作结束的下标值" + x, y);
					state.scrollY = Math.abs(y);
				});
			}
			
			// 初始化rightSide
			const initializeOwn = () =>{
				// 初始化rightSide
				const rightSide = [];
				let top = 0;
				rightSide.push(top);
				let itemHg = []
				// 找到所有分类下的li
				const lis = Array.prototype.slice.call(shopContant.value); //获取dom元素lii（eventList），对其进行操作
				// slice() 方法返回一个新的数组对象
				lis.forEach(li => {
					top += li.clientHeight; //相当于top = top + li.clientHeight
					rightSide.push(top);
					itemHg.push(li.clientHeight)
				});
			
			
				let rHeight =  rightContant.value?.clientHeight
				// 如果最后一个分类的高度小于右侧内容的高度，补足需要向上滚动的高度，即设置最后一个分类的高度为右侧内容的高度
				if(itemHg[itemHg.length - 1] < rHeight){
					let hg = rHeight - lis[lis.length -1].clientHeight
					rightSide[rightSide.length - 1] = rightSide[rightSide.length -1] + hg 
				}else{
					// 解决最后一个元素会被隐藏的情况
					rightSide[rightSide.length - 1] = rightSide[rightSide.length -1] + 120 
				}
				
				document.querySelector('#shopContant').style.height =  rightSide[rightSide.length -1] + 'px' 
				
				//更新数据
				state.allHeight = rightSide;
				console.log("每一个分类的下标" + rightSide);
			}
			
			//左侧点击事件
			const onClickNav = (index) =>{
				//拿到目标位置的scrollY，点击左侧导航，右侧列表滑动到对应的位置
				const scrolly = state.allHeight[index];
				
				// 平滑滑动右侧列表
				foodsScroll.scrollTo(0, - scrolly, 500);
			}
			const predivImage = (imgitem,index)=>{
				let imgs = []
				imgitem.forEach(item=>{
					imgs.push(state.imgUrl+item)
				})
				ImagePreview({
					images: imgs, //需要预览的图片 URL 数组
					showIndex: true, //是否显示页码
					loop: false, //是否开启循环播放
					startPosition: index //图片预览起始位置索引
				})
			}
			
			
			const drop = (el) => { // 抛物
				let objSet = el.getBoundingClientRect()
				// console.log(objSet,'objSet')
				state.start.top = objSet.top
				state.start.left = objSet.left
				if (!state.ball.show) {
					state.ball.show = true
					state.ball.el = el					
				}			
			}
			const beforeDrop = (el) => { /* 购物车小球动画实现 */
				const ball = state.ball
				if (ball.show) {
					// const rect = el.getBoundingClientRect() // 元素相对于视口的位置
					const x = state.start.left - 30 // 获取x
					// const x = (window.innerWidth - state.start.left - 10) // 获取x
					const y = -(window.innerHeight - state.start.top - 30) // 获取y
					el.style.display = ''
					el.style.webkitTransform = 'translateY(' + y + 'px)' // translateY
					el.style.transform = 'translateY(' + y + 'px)'
					const inner = el.getElementsByClassName('inner-hook')[0]
					inner.style.webkitTransform = 'translateX(' + x + 'px)'
					inner.style.transform = 'translateX(' + x + 'px)'
				}
			}
			
			const dropping = (el, done) =>{ /* 样式重置 */
				const rf = el.offsetHeight
				el.style.webkitTransform = 'translate3d(0,0,0)'
				el.style.transform = 'translate3d(0,0,0)'
				const inner = el.getElementsByClassName('inner-hook')[0]
				inner.style.webkitTransform = 'translate3d(0,0,0)'
				inner.style.transform = 'translate3d(0,0,0)'
				el.addEventListener('transitionend', done)
			}
			const afterDrop = (el) =>{ /* 初始化小球 */
				state.ball.show = false
				el.style.display = 'none'
			}

			return {
				...toRefs(state),
				
				currentIndex,
				init,
				onClickTab,
				initializeRoll,
				initializeOwn,
				onClickNav,
				setRef,
				ChooseSpecification,
				lookDetail,
				onClose,
				choseSpec,	
				getNormsList,
				onshowPoupClose,
				
				HZL_jian,
				HZL_jia,
				HZL_isCat,
				HZL_zero,
				gotoMoney,
				// 图片查看
				predivImage,
				drop,
				beforeDrop, 
				dropping, 
				afterDrop,
				addOrDelete,
				handlAddOrSubtract,
				onChange,
				topHg,
				rightContant
			}
		}
	}
</script>

<style lang="scss" scoped>

	
	.content{
		height: calc(100vh - 155px);
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
		height: calc(100vh - 210px);
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

	:last-child {
		/* 点击左侧导航右侧内容与左边对齐 */
		margin-bottom: 0;
	}

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
	  position: absolute;
	  bottom: 20px;
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
		height: 60px;
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
	  width: 23px;
	  height: 23px;
	  text-align: center;
	  line-height: 20px;
	  font-size: 23px;
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
	  width: 22px;
	  height: 22px;
	  text-align: center;
	  line-height: 20px;
	  font-size: 22px;
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
	  transition: all .7s cubic-bezier(.4, -0.89, .55, .54);
	  /*贝塞尔曲线*/
	}
	
	.inner {
	  width: 20px;
	  height: 20px;
	  border-radius: 50%;
	  background-color: #c83c3c ;
	  transition: all .7s linear;
	}

</style>
