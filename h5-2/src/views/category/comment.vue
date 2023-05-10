<template>
	<div class="content scroll-col" >
		<div class='HZL_appraise scroll'>
			<div class="commont pd-lr-15 pd-tb-20 bg-w">
				<div class="comList" v-for="(item,index) in commont" :key="index">
					<div class="">
						<div class="flex-row flex-wrap ft-se-12 mg-bt-8">
							<div class="flex-col-4 listLeft mg-rt-15">
								<img v-if="item.avatar" class="myimage" :src='item.avatar' />
								<img v-else class="myimage" :src='avatar' />
							</div>
							<div class="flex-col-20 tx-lt">
								<div class="flex-col-24 flex-row flex-between">
									<div>{{item.userName}}</div>
									<div class="fl-rt clr-999" style="margin-right: -15px;">{{item.commentCreateTime}}</div>
								</div>
								<div class="flex-col-24">
									<van-rate v-model="item.star" gutter="1" readonly :size="15" />
								</div>
							</div>
						</div>
						<div class="cells tx-lt ft-se-14">
							<div>{{ item.content }}</div>
						</div>
						<div class="flex-row flex-wrap" v-if="item.commentImages.length >0">
							<div class="flex-col-8" v-for="(imgitem, idx) in item.commentImages" :key="idx"  @click="predivImage(item.commentImages,idx)">
								<Img class="com-img" :src='`${imgitem}`' />
							</div>
						</div>
					</div>
					<!-- 商家回应 -->
					<div v-if="item.replyFlag == '0'" class='tx-lt'>
						<div class="mg-tp-15 ft-se-12" v-for="(replay, i) in item.children" :key="i">
							商家回应：{{replay.replyContent}}
						</div>
		
					</div>
				</div>
				<div style="color:#999999;font-size:24rpx;width:100%;text-align:center;">这是我的底线了！</div>
			</div>
		</div>
	</div>
	
	
</template>

<script>
	import { ImagePreview } from 'vant';
	import { getCommentList } from '@/api/cart'
	import { img_prveview } from "@/utils/imgbase"
	export default {
		data(){
			return {
				commont:[],
				avatar:require("@/assets/mine/user.png")
			}
		},
		props:{
			businessId:{
				type: String
			}
		},
		async created() {
			// 评论 businessesId
			let cList = await getCommentList(this.businessId)
			this.commont = Object.freeze(cList.rows)
		},
		methods:{
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
		}
	}	
</script>

<style lang="scss" scoped>
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
	
</style>