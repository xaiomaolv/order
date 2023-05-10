<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="zongFather" id="top" ref="top">
			<div class="HZL_top">
				<div class="shopName">
					<div class="row flex-row flex-wrap tx-ct">
						<div class="flex-row flex-col-24 bg-w pd-tb-10 bd-bt">
							<div class="flex-row flex-col-24">
								<div class="flex-col-6 tx-lt pd-lr-10">
									<Img class="shopImg" :src="`${resCode.businessLogo}`" />
								</div>
								<div class="flex-col-18 tx-rt">
									<div class="flex-row flex-col-24">
										<div class="flex-col-14 tx-lt dianpu">
											{{ resCode.businessName }}
										</div>
										<!-- <div class="flex-col-10 tx-rt pd-rt-10 li-hg-18">桌号：{{resCode.tableName}}</div> -->
									</div>
									<div class="flex-row flex-col-24 mg-tp-5">
										<div class="flex-col-24 tx-lt shuiang li-hg-20 mg-rt-10">
											{{ resCode.address }}
										</div>
										<!-- <div class="flex-col-10 tx-rt pd-rt-10 ft-se-12">{{mealNum}}人就餐</div> -->
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
			<div class="commodity" :style="{height:`calc(100vh - ${topHeight}px - ${resCode.reserveFlag == 1 ? '60px':'0px'} )`}">
				<!--左侧导航内容 -->
				<div class="leftNav">
					<div v-for="(item, index) in children" :key="index" :class="{ typeStyle: index === currentIndex }"
						@click="onClickNav(index)">
						<span class="leftTit">{{ item.categoryName }}</span>
					</div>
				</div>
				<!--// 右侧商品内容 -->
				<div class="rightContant" ref="rightContant">				
					<div ref="shopContant" class="pd-lr-10" id="shopContant">
						<div v-for="(item, pindex) in children" :key="item.categoryId" class="listItem">
							<div class="HZL_scroll_right_top tx-lt pd-tp-10 mg-bt-10">
								{{ item.categoryName }}
							</div>
							<div class="HZL_scroll_right_view" :class="{ test1: item.soldOut == '0' }"
								v-for="(child, cinedx) in item.children" :key="child.productId"
								@click="lookDetail(child)">
								<div class="mg-rt-10">
									<Img class="goodimg" :src="`${child.productImage}`" />
								</div>
								<div class="sjopName" style="width: 100%">
									<div class="goods-name tx-lt">{{ child.productName }}</div>
									<div class="flex-row">
										<div class="
                        productDescribe
                        flex-col-24
                        ft-se-12
                        li-hg-18
                        mg-bt-10
                      ">
											<div>{{ child.productDescribe || "" }}</div>
										</div>
									</div>

									<div class="flex-row">
										<div class="flex-col-18 flex-row">
											<div class="xianjia flex-row">
												<div v-if="child.productPercentPrice == 0">
													￥{{ child.productPrice }}
												</div>
												<div v-else>￥{{ child.productPercentPrice }}</div>
												<div style="color: #959595">/份</div>
											</div>
											<div v-if="child.productPercentPrice > 0" class="yuanjia">
												<div>￥{{ child.productPrice || "" }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!-- 预约点餐  -->
			<div v-if="resCode.reserveFlag == 1" class="HZL_cat fixed-bottom tx-ct flex-row"  style="bottom: 0px">
				 <van-button color="#c83c3c" round class="w-95" @click="gotoAppoint">预约用餐</van-button>
			</div>
		</div>

		<!-- 评论 -->
		<comment v-show="active == 1" :style="{height:`calc(100vh - ${topHeight}px)`}" :businessId='resCode.businessId
		' ></comment>

		<!-- 菜品详情 -->
		<van-popup v-model:show="showFoodList" round position="bottom" :style="{ height: '50%' }" closeable
			close-icon="close" @close="onClose">
			<div>
				<Img class="detailimg" :src="`${foodDetail.productImage}`" />
			</div>
			<div class="foods tx-lt pd-lt-10">
				<div class="goods-name">{{ foodDetail.productName }}</div>
				<div class="flex-row mg-bt-10">
					<div class="flex-col-24 ft-se-12 li-hg-18">
						{{ foodDetail.productDescribe || "" }}
					</div>
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
		</van-popup>
	</div>
</template>


<script>
	import BScroll from "better-scroll";
	import { Toast } from 'vant';
	import { getLocal } from '@/utils/auth';
	import { getCommentList, getCartInfo, addCart, delCart, getFormatList, getNormsList, addDiningNum } from '@/api/cart'

	import Comment from '../../category/comment.vue'
	export default {
		components:{
			Comment
		},
		data(){
			return {
				topHeight: 0,
				resCode: {},
				active: 0,
				
				scrollY: 0, // 右侧滑动的时候距离顶部的值
				allHeight: [], // 所有右侧分类li的top组成的数组  (列表第一次显示后就不再变化)
				
				children: [],
				curGoodsMap: [],
				showFoodList: false,
				foodDetail: {},
				showPoup: false,
				hasproductPercentPrice: "",
				hasproductPrice: "",
				subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
				guigeCarNum: 2, //规格购物车数量,
				selectArr: [],
				dataNorms: [], //规格选择数据
				selectArr: [], //存放被选中的值
				showSelectSpec: "", //展示选中的值
				dataIds: [],
				arr: "",
				HZL_swiper_ID: 0,
				HZL_num: 2,
				HZL_isCat: 0,
				total: 0, //合计
				priceAmount: 0,
				discountAmount: 0, //优惠
				commont: [],
				cartshow: false,
				HZL_my_cat: [],
				foodsScroll:''
			}
		},
		async created(){
				
			this.resCode = this.$route.query
			
			
			
		},
		computed:{
			currentIndex:function(){
				return this.allHeight.findIndex((top, index) => {
						// scrollY>=当前top && scrollY<下一个top
						return this.scrollY >= top && this.scrollY < this.allHeight[index + 1];
					});
			}
		},
		async mounted() {
		
			this.topHeight = this.$refs.top.clientHeight
			
			this.init()
		
		},
		updated() {
			
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			// 获取菜单列表
			async init(){			
				
				let params = {
					tableId: this.resCode.tableId,
					businessId: this.resCode.businessId,
					"userId": this.resCode.userId,
				}
			 
				let res = await getCartInfo(params)
				this.children = Object.freeze(res.data.children) 
				this.HZL_my_cat = res.data.productInfo
				this.total = res.data.percentAmount
				this.HZL_num = res.data.productNum
				this.discountAmount = res.data.discountAmount
				this.priceAmount = res.data.priceAmount
				
				this.$nextTick(() => {
					this.initializeOwn(); //初始化rightSide方法
					setTimeout(()=>{
						this.initializeRoll(); //滑动初始化方法
					},100)
				})
				
			},
			lookDetail(child){
				this.showFoodList = true;
				this.foodDetail = child;
			},
			
			onClose() {
				this.showFoodList = false;
			},
			
			onshowPoupClose (){
				this.showPoup = false;
				this.selectArr = [];
				this.dataIds = [];
				this.dataNorms = [];
				this.subIndex = [];
				this.arr = this.selectArr.join("/");
			},
			
			
			onClickTab(val){
				this.active = val.name;
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
					// console.log("操作结束的下标值" + x, y);
					this.scrollY = Math.abs(y);
				});
			},
			
			// 初始化rightSide
			initializeOwn (){
				// 初始化rightSide
				const rightSide = [];
				let top = 0;
				rightSide.push(top);
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
			onClickNav(index){
				//拿到目标位置的scrollY，点击左侧导航，右侧列表滑动到对应的位置
				const scrolly = this.allHeight[index] ;
				console.log(scrolly,888)
				// 平滑滑动右侧列表
				this.foodsScroll.scrollTo(0, - scrolly, 500);
			},
			
			// 去预约点餐
			gotoAppoint(){
				if (this.resCode.businessStatus == "1") {
					this.$router.push({
						path: '/appointment',
						query: {
							...this.resCode
						}
					})
				} else {
					Toast('该商家暂不营业');
				}
			},
			
			// 图片查看
			predivImage(imgitem, index){
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
			}
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
		height: calc(100vh - 186px);
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
		// height: calc(100vh - 190px);
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
		// transition: all .5s cubic-bezier(.08,-0.35,.99,.33)
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
