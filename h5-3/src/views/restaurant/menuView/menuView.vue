<template>
	<div class="container">
		<div class="zongFather" id="top">
			<div class="HZL_top">
				<div class="shopName">
					<div class="row flex-row flex-wrap tx-ct">
						<div class="flex-row flex-col-24 bg-w pd-tb-10 bd-bt">
							<div class="flex-row flex-col-24">
								<div class="flex-col-6 tx-lt pd-lr-10">
									<img class="shopImg" :src="imgUrl + resCode.businessLogo" />
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

		<div class="content" v-if="active == 0">
			<div class="commodity">
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
						<div v-for="(item, pindex) in children" :key="item.categoryId" :ref="setRef">
							<div class="HZL_scroll_right_top tx-lt pd-tp-10">
								{{ item.categoryName }}
							</div>
							<div class="HZL_scroll_right_view" :class="{ test1: item.soldOut == '0' }"
								v-for="(child, cinedx) in item.children" :key="child.productId"
								@click="lookDetail(child)">
								<div class="mg-rt-10">
									<img class="goodimg" :src="`${imgUrl}${child.productImage}`" />
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
			<!-- 预约点餐 -->
			<div v-if="resCode.reserveFlag == 1" class="HZL_cat" id="bottom" style="bottom: 0px">
				<!-- <div class="HZL_cat_text btn" @click="gotoAppoint">预约点餐</div> -->
				 <van-button color="#c83c3c" round class="w-95" @click="gotoAppoint">预约点餐</van-button>
			</div>
		</div>

		<!-- 评论 -->
		<div class="content scroll-col" v-else>
			<div class="HZL_appraise scroll">
				<div class="commont pd-lr-15 pd-tb-20 bg-w">
					<div class="comList" v-for="(item, index) in commont" :key="index">
						<div class="">
							<div class="flex-row flex-wrap ft-se-12">
								<div class="flex-col-4 listLeft mg-rt-15">
									<img class="myimage" :src="item.avatar" />
								</div>
								<div class="flex-col-20 tx-lt">
									<div class="flex-col-24 flex-row flex-between">
										<div>{{ item.userName }}</div>
										<div class="fl-rt clr-999" style="margin-right: -15px">
											{{ item.commentCreateTime }}
										</div>
									</div>
									<div class="flex-col-24">
										<van-rate v-model="item.star" gutter="1" readonly :size="15" />
									</div>
								</div>
							</div>
							<div class="cells tx-lt">
								<div>{{ item.content }}</div>
							</div>
							<div class="flex-row flex-wrap">
								<div class="flex-col-8" v-if="item.commentImages.length > 0"
									v-for="(imgitem, idx) in item.commentImages" :key="idx">
									<img class="com-img" :src="`${imgUrl}${imgitem}`"
										@click="predivImage(item.commentImages,idx)" />
								</div>
							</div>
						</div>
						<!-- 商家回应 -->
						<div v-if="item.replyFlag == '0'" class="tx-lt">
							<div class="mg-tp-15 ft-se-12" v-for="(replay, i) in item.children" :key="i">
								商家回应：{{ replay.replyContent }}
							</div>
						</div>
					</div>
					<div style="
              color: #999999;
              font-size: 24rpx;
              width: 100%;
              text-align: center;
            ">
						这是我的底线了！
					</div>
				</div>
			</div>
		</div>

		<!-- 菜品详情 -->
		<van-popup v-model:show="showFoodList" round position="bottom" :style="{ height: '50%' }" closeable
			close-icon="close" @close="onClose">
			<div>
				<img class="detailimg" :src="`${imgUrl}${foodDetail.productImage}`" />
			</div>
			<div class="foods tx-lt pd-lt-10">
				<div class="goods-name">{{ foodDetail.productName }}</div>
				<div class="flex-row mg-bt-10">
					<div class="flex-col-24 ft-se-12 li-hg-18">
						{{ foodDetail.productDescribe || "" }}
					</div>
				</div>
				<div class="pricePopup flex-row">
					<div class="xianjia">
						￥{{ foodDetail.productPercentPrice
            }}<text style="color: #959595">/份</text>
					</div>
					<div class="yuanjia">￥{{ foodDetail.productPrice }}</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		reactive,
		onMounted,
		toRefs,
		nextTick,
		computed,
		ref,
		watch,
	} from "vue";
	import {
		useRoute,
		useRouter
	} from "vue-router";
	import BScroll from "better-scroll";
	import {
		Toast
	} from "vant";
	import {
		ImagePreview
	} from "vant"; // 引入Vant图片预览组件

	export default {
		name: "",
		components: {},
		setup() {
			let rightContant = ref(null)
			let foodsScroll = ref("");
			const shopContant = ref([]);
			const route = useRoute();
			const router = useRouter();
			const state = reactive({
				isLogin: false,
				imgUrl: "https://order.ynejkj.com/api/order/image/preview?fileName=",
				resCode: {
					address: "云南省昆明市官渡区广福路与云秀路交汇处1103号",
					businessId: "50",
					businessLogo: "ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png",
					businessName: "闲时蜗居小店",
					businessStatus: "1",
					children: null,
					mealNum: 1,
					orderSource: "2",
					tableId: "10",
					tableName: "十人大桌",
					reserveFlag: '1'
				},
				active: 0,

				scrollY: 0, // 右侧滑动的时候距离顶部的值
				allHeight: [], // 所有右侧分类li的top组成的数组  (列表第一次显示后就不再变化)

				children: [{
					categoryId: "18",
					categoryName: "冷饮",
					categoryNum: null,
					categorySort: "1",
					ids: "id18",
					children: [{
						addPrice: 0,
						addTime: null,
						attributesName: "冰冰凉凉大西瓜",
						businessId: null,
						categoryId: "18",
						child: null,
						children: null,
						data: null,
						dataId: null,
						formatFlag: "1",
						mealStatus: null,
						packFee: null,
						percentPriceAmount: null,
						priceAmount: null,
						productDescribe: "冰冰凉凉大西瓜",
						productId: "14",
						productImage: "d109a116376f462a99907ec2701173de20220610151625.jpg",
						productName: "冰镇西瓜",
						productNum: 0,
						productPercentPrice: 18.5,
						productPrice: 20,
						recommend: "0",
						soldOut: "0",
						status: null,
						format: {
							productDescribe: "冰冰凉凉大西瓜",
							productName: "冰镇西瓜",
							productPercentPrice: 18.5,
							productPrice: 20,
							children: [{
									businessId: null,
									formatId: "3",
									formatMoney: "1",
									formatName: "温度",
									child: [{
											attributesName: "特辣",
											dataId: "2",
											productId: null,
											productPrice: 0,
										},
										{
											attributesName: "中辣",
											dataId: "3",
											productId: null,
											productPrice: 0,
										},
										{
											attributesName: "微辣",
											dataId: "4",
											productId: null,
											productPrice: 0,
										},
									],
								},
								{
									businessId: null,
									formatId: "6",
									formatMoney: "1",
									formatName: "价格",
									formatSort: null,
									child: [{
											attributesName: "超级杯",
											dataId: "25",
											productId: null,
											productPrice: 18,
										},
										{
											attributesName: "大杯",
											dataId: "26",
											productId: null,
											productPrice: 15,
										},
										{
											attributesName: "中杯",
											dataId: "27",
											productId: null,
											productPrice: 12,
										},
									],
								},
							],
						},
					}, ],
				}, ],
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
				commont: [{
					avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/iaLDd3rcB1CN7TunWOHpo98HGiaDQssdNPHWNibPXjPo5aDzUD7TcZoW2t4WicNFyb01ZleafjtN31icvZKib7ib3YyLA/132",
					businessId: 50,
					commentCreateTime: "2022-06-30",
					commentId: "165655890690408",
					commentImage: "dd00fcdc3db24db1ad87006a00ad55e020220630111403.png,026645753ef8425da9ea8f09bd01685020220630111406.png,564b540d80a741d082d7781b9e9cb3ae20220630111414.png,11089ca8c95147189053dfe57c602f0920220630111418.png,3dd77c31a2b14838a1d39791fb2ea35b20220630111458.png,9456f53353c54a2695398824002f10d420220630111501.png",
					commentImages: [
						"dd00fcdc3db24db1ad87006a00ad55e020220630111403.png",
						"026645753ef8425da9ea8f09bd01685020220630111406.png",
						"564b540d80a741d082d7781b9e9cb3ae20220630111414.png",
						"11089ca8c95147189053dfe57c602f0920220630111418.png",
						"3dd77c31a2b14838a1d39791fb2ea35b20220630111458.png",
						"9456f53353c54a2695398824002f10d420220630111501.png",
					],
					commentType: "1",
					content: "还行吧，菜品不是太新鲜",
					orderId: 1482334670241763600,
					replyFlag: "0",
					star: 3,
					userId: 211,
					userName: "你算哪块小饼干",
					children: [{
							businessUserId: null,
							businessUserName: null,
							commentId: "165655890690408",
							commentReplyId: null,
							replyContent: "欢迎再来光顾",
							replyCreateTime: null,
							replyFlag: "0",
							replyType: null,
							toUserId: null,
							toUserName: null,
							torr: null,
							torrId: null,
						},
						{
							businessUserId: 159,
							businessUserName: "闲时蜗居小店",
							commentId: "166367037372825",
							commentReplyId: 45,
							replyContent: "测试回复↵第二行内容↵第三行",
							replyCreateTime: "2022-09-20",
							replyFlag: "0",
							replyType: 1,
							toUserId: 283,
							toUserName: "龍",
							torr: 1,
							torrId: 0,
						},
					],
				}, ],

				cartshow: false,
				HZL_my_cat: [{
						addPrice: 4,
						addTime: "20221018123505",
						attributesName: "中份",
						businessId: null,
						categoryId: "18",
						child: null,
						children: null,
						data: [{
							attributesName: "中份",
							dataId: "144",
							productPrice: 2,
						}, ],
						dataId: "144",
						format: null,
						formatFlag: "1",
						mealStatus: null,
						packFee: null,
						percentPriceAmount: 41,
						priceAmount: 44,
						productDescribe: "冰冰凉凉大西瓜",
						productId: "14",
						productImage: "d109a116376f462a99907ec2701173de20220610151625.jpg",
						productName: "冰镇西瓜",
						productNum: 2,
						productPercentPrice: 18.5,
						productPrice: 20,
						recommend: null,
						soldOut: null,
						status: null,
					},
					{
						addPrice: 12,
						addTime: "20221018123437",
						attributesName: "常温、中杯",
						businessId: null,
						categoryId: "18",
						child: null,
						children: null,
						data: [{
								attributesName: "常温",
								dataId: "24",
								productPrice: 0,
							},
							{
								attributesName: "中杯",
								dataId: "27",
								productPrice: 12,
							},
						],
						dataId: "24、27",
						format: null,
						formatFlag: "1",
						mealStatus: null,
						packFee: null,
						percentPriceAmount: 0,
						priceAmount: 12,
						productDescribe: "糯米茶+香水柠檬",
						productId: "91",
						productImage: "359df5c3f8ce417ea60c3fe07c2217df20220602235921.png",
						productName: "糯米香柠檬茶",
						productNum: 1,
						productPercentPrice: 0,
						productPrice: 0,
						recommend: null,
						soldOut: null,
						status: null,
					},
				],
			});

			// watch(
			// 	() => state.scrollY,
			// 	(value) => {
			// 		const index = state.allHeight.findIndex((top, index) => {
			// 			// scrollY>=当前top && scrollY<下一个top
			// 			return (
			// 				state.scrollY >= top &&
			// 				state.scrollY < state.allHeight[index + 1]
			// 			);
			// 		});
			// 		// 返回结果
			// 		state.currentIndex = index > 0 ? index : 0;
			// 	}, {
			// 		immediate: true
			// 	}
			// );
			
			const currentIndex = computed(()=>{
				return state.allHeight.findIndex((top, index) => {
						// scrollY>=当前top && scrollY<下一个top
						return state.scrollY >= top && state.scrollY < state.allHeight[index + 1];
					});
			})

			onMounted(() => {
				initializeRoll(); //滑动初始化方法
				initializeOwn(); //初始化rightSide方法
			});
			nextTick(() => {});

			const lookDetail = (child) => {
				state.showFoodList = true;
				state.foodDetail = child;
			};
			const onClose = () => {
				state.showFoodList = false;
			};
			const onshowPoupClose = () => {
				state.showPoup = false;
				state.selectArr = [];
				state.dataIds = [];
				state.dataNorms = [];
				state.subIndex = [];
				state.arr = state.selectArr.join("/");
			};

			const isMay = (result) => {
				for (let i in result) {
					if (result[i] == "") {
						return true; //如果数组里有为空的值，那直接返回true
					}
				}
				return !state.shopItemInfo[result] ?
					false :
					state.shopItemInfo[result].stock == 0 ?
					false :
					true; //匹配选中的数据的库存，若不为空返回true反之返回false
			};

			const setRef = (el) => {
				shopContant.value.push(el);
			};
			const onClickTab = (val) => {
				state.active = val.name;
			};
			// 初始化滚动
			const initializeRoll = () => {
				// new一个类的实例，前提必须确保父元素和子元素的内容已经正确渲染了，不然不会生效
				new BScroll(".leftNav", {
					click: true,
				});
				// 组件实例上挂属性
				foodsScroll = new BScroll(".rightContant", {
					probeType: 3, // 因为惯性滑动不会触发
					click: true,
				});

				// 给右侧列表绑定scroll监听
				foodsScroll.on("scroll", ({
					x,
					y
				}) => {
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
			};

			// 初始化rightSide
			const initializeOwn = () => {
				// 初始化rightSide
				const rightSide = [];
				let top = 0;
				rightSide.push(top);
				// 找到所有分类下的li
				const lis = Array.prototype.slice.call(shopContant.value); //获取dom元素lii（eventList），对其进行操作
				// slice() 方法返回一个新的数组对象
				lis.forEach(li => {
					top += li.clientHeight; //相当于top = top + li.clientHeight
					rightSide.push(top);
				});
							
				// 如果最后一个分类的高度小于右侧内容的高度，补足需要向上滚动的高度，即设置最后一个分类的高度为右侧内容的高度
				if(lis[lis.length -1].clientHeight < rightContant.value?.clientHeight){
					let hg = rightContant.value?.clientHeight - lis[lis.length -1].clientHeight
					rightSide[rightSide.length -1] = rightSide[rightSide.length -1] + hg
				}
				
				document.querySelector('#shopContant').style.height =  rightSide[rightSide.length -1] + 'px'    

				//更新数据
				state.allHeight = rightSide;
				console.log("每一个分类的下标" + rightSide);
			};

			//左侧点击事件
			const onClickNav = (index) => {
				//拿到目标位置的scrollY，点击左侧导航，右侧列表滑动到对应的位置
				const scrolly = state.allHeight[index];
				
				// 平滑滑动右侧列表
				foodsScroll.scrollTo(0, - scrolly, 500);
			};
			// 去预约点餐
			const gotoAppoint = () => {
				if (state.resCode.businessStatus == "1") {
					router.push({
						path: '/appointment',
						query: {
							...state.resCode
						}
					})
				} else {
					Toast('该商家暂不营业');
				}
			}
			// 图片查看
			const predivImage = (imgitem, index) => {
				let imgs = []
				imgitem.forEach(item => {
					imgs.push(state.imgUrl + item)
				})
				ImagePreview({
					images: imgs, //需要预览的图片 URL 数组
					showIndex: true, //是否显示页码
					loop: false, //是否开启循环播放
					startPosition: index //图片预览起始位置索引
				})
			}

			return {
				...toRefs(state),
				onClickTab,
				initializeRoll,
				initializeOwn,
				onClickNav,
				setRef,
				currentIndex,
				lookDetail,
				onClose,
				isMay,
				gotoAppoint,
				predivImage,
				rightContant
			};
		},
	};
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

	.content {
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
		height: calc(100vh - 200px);
	}

	.leftNav {
		/* 左侧大盒子的整体样式 */
		width: 80px;
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
		height: 40px;
		justify-content: center;
		font-size: 12px;
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
		box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2,
			2px 2px 2px #f5f2f2;
		border-radius: 6px;
		margin: 0 1px 15px 0;
	}

	/* 遮罩层半透明 */
	.test1 {
		box-sizing: border-box;
		display: flex;
		position: relative;
		padding: 10px 0 10px 5px;
		box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2,
			2px 2px 2px #f5f2f2;
		background: #dddada;
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
		font-size: 14px;
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
		font-size: 0;
	}

	.caozuo {
		position: absolute;
		bottom: 20px;
	}

	/* 规格 */
	.gg-btn {
		/* width: 80% !important; */
		// width: 60px !important;
		padding: 3px 10px !important;
		border-radius: 22px;
		font-size: 12px !important;
		color: white !important;
		background-color: #c83c3c !important;
	}

	.cartcontrol-wrap {
		right: 0;
	}

	.cart-add {
		width: 26px;
		height: 26px;
		display: inline-block;
		padding: 5px;
		padding: 0;
		line-height: 24px;
		font-size: 18px;
		color: #d5362f;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}

	.inner {
		display: inline-block;
		line-height: 24px;
		font-size: 24px;
		color: #d5362f;
		transition: all 0.4s linear;
		transform: rotate(0);
	}

	.inner {
		transform: rotate(180deg);
	}

	.cart-count {
		display: inline-block;
		vertical-align: top;
		width: 32px;
		/* padding-top:2px; */
		line-height: 24px;
		text-align: center;
		font-size: 10px;
		color: #d5362f;
		line-height: 20px;
		float: left;
		font-size: 15px;
	}

	/*抛物线动画*/
	.good_box {
		width: 18px;
		height: 18px;
		position: fixed;
		border-radius: 50%;
		overflow: hidden;
		left: 50%;
		top: 50%;
		z-index: 2020;
		background: #d5362f;
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
		border-bottom: 2rpx solid #9ea3ba;
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
		color: gray;
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
		position: fixed;
		/* bottom: 101rpx; */
		left: 0;
		width: 100%;
		height: 60px;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 99;
		bottom: 0px;
	}

	.HZL_cat_text {
		width: 100%;
		background: #c83c3c;
		color: #FFFFFF;
		padding: 15px;
		margin: 10px 10px 18px 10px;
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
		background-color: #ffffff;
		color: #d5362f;
		border-radius: 50%;
		border: 2px solid #d5362f;
	}

	.HZL_num {
		font-size: 14px;
		color: #d5362f;
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
		background-color: #ffffff;
		color: #d5362f;
		border-radius: 50%;
		border: 2px solid #d5362f;
	}

	.comList {
		padding-bottom: 10px;
		padding-right: 8px;
		padding-left: 6px;
		margin-bottom: 15px;
		border-bottom: 1rpx solid #ececec;
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
		background-color: #fff;
		padding-top: 10px;
	}

	.num {
		color: #e60a30;
		width: 25px;
		font-size: 15px;
	}

	.HZL_cat_scroll {
		// width: 750rpx;
		// min-height: 80rpx;
		max-height: 65vh;
		// padding-bottom: 20px;
		overflow: scroll;
		// padding-left: 30rpx;
	}

	.catEftImg {
		width: 60px;
		height: 60px;
	}
</style>
