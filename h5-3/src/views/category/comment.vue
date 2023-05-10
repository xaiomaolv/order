<template>
 <div class="content scroll-col">
			<div class='HZL_appraise scroll'>
				<div class="commont pd-lr-15 pd-tb-20 bg-w">
					<div class="comList" v-for="(item,index) in commont" :key="index">
						<div class="">
							<div class="flex-row flex-wrap ft-se-12">
								<div class="flex-col-4 listLeft mg-rt-15">
									<img class="myimage" :src='item.avatar' />
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
							<div class="cells tx-lt">
								<div>{{ item.content }}</div>
							</div>
							<div class="flex-row flex-wrap">
								<div class="flex-col-8" v-if="item.commentImages.length >0"
									v-for="(imgitem, idx) in item.commentImages" :key="idx">
									<img class="com-img" v-lazy='`${imgUrl}${imgitem}`' @click="predivImage(item.commentImages,idx)" />
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
import { reactive, onMounted,toRefs,nextTick, computed,ref, watch } from 'vue'
  import { ImagePreview } from 'vant';
	import { getCommentList } from '@/api/cart'

	import { img_prveview } from "@/utils/imgBase"
  export default {
  name: "topHeader",
  props: {
    businessId: String
  },
  setup(props, { emit }) {
    console.log(props);
    // const p = toRefs(props);
    // const msg = p.msg;
    // const boy = p.boy;
 
    // const btn = () => {
    //   const news = "我是子组件传进的值";
    //   emit("change", news);
    // };
    const commont = ref([])
    onMounted(async () => {
      console.log(props.businessId,'this.businessId')
			// 评论 businessesId
			// let cList = await getCommentList(props.businessId)
			// commont = Object.freeze(cList.rows)
    })

    const predivImage = (imgitem,index)=>{
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
    
    return {
      commont,
      predivImage
     };
  }
}
</script>