<template>
	<div class="container">
		<div class="activitymain">
		  <!-- 中奖用户提示 -->
		  <div class="container_act" v-if="awards.length > 0">
		    <div class="news tx-ct">{{activityName || ''}}</div>
		    <!-- 转盘 -->
		    <div class="draw">
		      <div class="draw_view flex-row flex-between">
		        <div class="item " v-for="(item, index) in awards" :key="index" :class="['award' + index, {'active':index == current}]">
		          <img :src="`${imgUrl}${item.logo}`" class="item-img" />
		          <div>{{item.rouletteName}}</div>
							<div class="mask" v-if="index == current"></div>
		        </div>
		        
		        <div class="item no-bg start-btn">
		          <img v-if="isShow" src="@/assets/luckDraw/chose.png" class="draw-img bd-rd" @click="drawLuck" />
		          <img v-else src="@/assets/luckDraw/nochose.jpg" class="draw-img bd-rd" />
		        </div>	        
		      </div>
		    </div>
		
		    <div class="choice">
		      您还有{{draw_count}}次抽奖机会
		    </div>
		  </div>
		  <div v-if="awards.length < 1" class="mg-tp-10">
		    <van-empty description="暂无活动" />
		  </div>
		  <div v-if="remark">
		    <div class="tx-ct">
		      <div class="result_title" @click="showRules">--- 活动细则 ---</div>
		    </div>
		    <div class="resultrule">
		      <div class="result_info">
		        <div style="max-height: 150px;">
		          <div class="goods_name">{{remark}}</div>
		        </div>
		      </div>
		    </div>
		  </div>
			
			<div class="pd-lr-15 mg-tp-20">
				<van-button color="#c83c3c" round  class="w-100" @click="goBackIndex">返回首页</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { reactive, onMounted,toRefs,nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { Toast } from 'vant';
	import { getActivityList, redempDraw,  getReceiveList, getReceiveDetail,  addReceive} from '@/api/activity'
	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				isLogin: false,
				activityName:'抽奖',
				awards:[
					{
						id:'1',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=da34efe8aadd4fbbaa5c3b9bcc5408f020220803161726.jpg",
						status: 'success',
						name: '上传成功',
						
					},
					{
						id:'2',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=834d23ac931148abb5713741ca50c3c120220613104050.png",
						status: 'success',
						name: '上传成功',
					},
					{
						id:'3',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=ce2eb6649a694d8fb51254f711bf442320220721103251.jpg",
						status: 'uploading',
						name: '上传中..',
					},
					{
						id:'4',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=84e8258932e345e1932b2c349357ab0120220606173115.png",
						status: 'failed',
						name: '上传失败',
					},
					{
						id:'5',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
						status: 'success',
						name: '上传成功',
					},
					{
						id:'6',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
						status: 'success',
						name: '上传成功',
					},
					{
						id:'7',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
						status: 'success',
						name: '上传成功',
					},
					{
						id:'8',
						img: "https://order.ynejkj.com/api/order/image/preview?fileName=abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
						status: 'success',
						name: '上传成功',
					},
				],
				imgUrl:'https://order.ynejkj.com/api/order/image/preview?fileName=',
				draw_count:5,
				remark:'',
				isShow: true,
				activityId:'' ,
				orderId:'',
				activitySeat:'',				
				current: -1, // 当前索引值
				speed: 200, // 时间->速度
				diff: 15, // 基数
				award: {}, // 抽中的奖品
				time: 0, // 当前时间戳
				timer: null, // 定时器
			})
			onMounted(async () => {
				 state.orderId = route.query.orderId 
				 state.activitySeat = route.query.activitySeat
				
				 
				 let param = {
				 	activityType: '2',
				 	activitySeat: state.activitySeat
				 }
				await getActivityList(param).then(res => {
				 	if (res.code == 200) {
				 		
				 		state.activityId = res.data.id
				 		state.activityName = res.data.activityName
				 		state.remark = res.data.remark
				 		
				 		// res.data.children.forEach(item => {
				 		// 	item.rouletteType = item.rouletteType
				 		// 	item.rouletteNo = item.rouletteNo
				 		// 	item.name = item.rouletteName
				 		// 	item.status = false
				 		// 	item.img = state.imgUrl + item.logo
				 		// })
				 		
				 		state.awards = res.data.children	
						
						
				 	}
				 })
				 
				 let params = {
				 	activityId: state.activityId,
				 	userId:'',
				 	orderId: state.orderId
				 }
				// 抽奖
				await redempDraw(params).then(res => {
				 	if (res.code == 200) {
				 		// state.luckPosition = res.data.rouletteNo - 1
						state.award = res.data;
				 	}
				})
			})
			nextTick(() => {
				
			})
			
			const drawLuck = () => {
				if (state.draw_count == 0) {
					Toast.fail('您的抽奖次数已经用光了')
					return false
				}	
				state.isShow = !state.isShow
				state.draw_count--;
				// 开始抽奖
				init();
				state.time = Date.now();
				state.speed = 200;
				state.diff = 12;
			}
			
			const init = () => {
				rouletteName: "谢谢惠顾"
				rouletteNo: "8"
				rouletteType: "0"
				
				state.award.rouletteName = "15";
				state.award.rouletteNo = 8;
				move();
			}
			// 开始转动
			const move = () => {		    
				state.timer = setTimeout(() => {
					state.current++;
					if (state.current > 7) {
						state.current = 0;
					}
					// 若抽中的奖品id存在，则开始减速转动
					if (state.award.rouletteNo && (Date.now() - state.time) / 1000 > 2) {
						state.speed += state.diff; // 转动减速
						// 若转动时间超过4秒，并且奖品id等于小格子的奖品id，则停下来
						if (
							(Date.now() - state.time) / 1000 > 4 &&
							state.award.rouletteNo == state.awards[state.current].rouletteNo
						) {
							clearTimeout(state.timer);
							setTimeout(() => {
									state.isShow = !state.isShow
									if(state.award.rouletteType == 0){  
										console.log(`很遗憾未中奖`);
									}else{
										console.log(`恭喜中奖${state.award.rouletteName}`);
									}
								
							}, 0);
							return;
						}
					} else {
						// 若抽中的奖品不存在，则加速转动
						state.speed -= state.diff;
					}
				
					move();
				}, state.speed);
			}
			
			
			const showRules = () => {
				
			}
			const goBackIndex = () => {
				
			}
			return {
				...toRefs(state),
				showRules,
				goBackIndex,
				drawLuck
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container_act {
	  border-radius: 10px;
	  color: #fff;
	}
	
	.news {
	  margin: 10px auto;
	  width: 100%;
	  height: 30px;
	  line-height: 30px;
	  border-radius: 15px;
	  color: #a26710;
	}
	
	.notice-img {
	  padding: 0 15px;
	}
	
	.swiper {
	  width: 90%;
	  height: 100%;
	  font-size: 14px;
	}
	
	.content-item {
	  max-width: 300px;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	
	.high-light {
			color: #eccb39;
	}
.draw {
  margin-top: 25px;
  width: 100%;
  border-radius:10px;
}

.draw_view {
  // flex-wrap: wrap;
	width: 370px;
	height: 370px;
  margin: 10px auto;
	position: relative;
}

.item {
  width: 110px;
  height: 110px;
  background-color: #FFF5EB;
  color: #a26710;
  border-radius: 10px;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 0 4px 0 #e6cfb6, 0 0 9px 0 #e9d9d9;
	position: absolute;
	overflow: hidden;
}

.item-img {
  margin-top: 15px;
	margin-bottom: 5px;
  width: 60px;
  height: 60px;
  border-radius: 5px;
}

.award0 {
	top: 0px;
	left: 0px;
}

.award1 {
	top: 0px;
	left: 50%;
	transform: translateX(-50%);
}

.award2 {
	top: 0px;
	right: 0px;
}

.award3 {
	top: 50%;
	right: 0px;
	transform: translateY(-50%);
}

.award4 {
	bottom: 0px;
	right: 0px;
}

.award5 {
	bottom: 0px;
	left: 50%;
	transform: translateX(-50%);
}

.award6 {
	bottom: 0px;
	left: 0;
}

.award7 {
	top: 50%;
	left: 0px;
	transform: translateY(-50%);
}

.start-btn {
		position: absolute;
		width: 110px;
		height: 110px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 10px;
		text-align: center;
		// background: url("https://order.ynejkj.com/api/order/image/preview?fileName=834d23ac931148abb5713741ca50c3c120220613104050.png") no-repeat center/100%;
	}

.choice {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #ac1010;
}

.draw-img {
  height: 100%;
  width: 100%;
}

.no-bg {
  background: none;
}

.active {
  box-shadow: 0px 0px 14px 5px #F00;
  border-radius: 10px;
	// .mask{
	// 	width: 110px;
	// 	height: 110px;
	// 	position: absolute;
	// 	left: 0;
	// 	top: 0;
	// 	border-radius: 10px;
	// 	background-color: #fff0bd;
	// 	opacity: 0.6;
	// 	z-index: 1;
	// }
}

.result {
  margin: 30px 10px;
  border-radius: 10px;
  height: 200px;
  box-shadow: 0 0 49px 0 #FFFFFF inset;
  text-align: center;
}

.resultrule {
  margin: 0px 0px 10px 0px;
  padding-bottom: 10px;
  border-radius: 10px;
  padding-top:10px;
  box-shadow: 0 0 3px 0 #FFF5EB inset;
  text-align: center;
  background: #FFF5EB;
}

.result_title {
  color: rgb(231, 57, 57);
  font-weight: 600;
  padding-top: 15px;
}

.result_info {
  margin: 10px;
  text-align: left;
}


</style>
