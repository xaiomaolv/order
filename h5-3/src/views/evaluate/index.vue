<template>
	<div class="container">
		<div class="bd-rd-8 mg-tp-10 mg-lr-10 bg-w pd-lr-15">
		  <div class="flex-row pd-tb-15">
		    <div class="tx-lt font-se-14">
		      您对商家/菜品满意吗？
		    </div>
		  </div>
		  <div class="shopName flex-row flex-row-item">
		    <img :src="`${imgUrl}${orderInfo.businessLogo}`" class="shopImg mg-rt-15" />
		    <span>{{orderInfo.businessName}}</span>
		  </div>
		  <!-- 店铺评分 -->

		  <div class="flex-row mg-tp-15 pd-bt-15 bd-bt">
		    <div class='mg-rt-10'>评分：</div>
				<van-rate v-model="evaluateStars" :size="25" color="#c83c3c" void-icon="star" void-color="#eee" @change="onChange"  />
		  </div>
		
		  <div class="cell mg-tp-15">
		    <div>输入评价：</div>
				<div class="bd-bt bd-tp mg-tp-10">
					<van-field v-model="content" rows="5" autosize label="" type="textarea" maxlength="200" placeholder="说说您对商品的体验吧！您最多可输入200个字哦~"
						show-word-limit />
					</div>
		  </div>
			
			<div class="mg-tp-15 pd-tp-15 pd-bt-20">
				<van-uploader
					v-model="fileList"
					:multiple="true"
					:before-read="beforeRead"
					:after-read="afterRead"
					:before-delete="delUploadImg"
					:max-count="6"
					upload-icon="plus"
				>
				</van-uploader>
			</div>
		</div>
		
		<div class="pd-lr-15 mg-tp-20">
			<van-button color="#c83c3c" round  class="w-100" @click="submitEvaluate">提交评价</van-button>
		</div>
	</div>
</template>

<script>
	import { Toast } from 'vant'
	import { reactive, onMounted,toRefs,nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { addEvaluate, uploadImg } from '@/api/order'
	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				isLogin: false,
				imgUrl:'https://order.ynejkj.com/api/order/image/preview?fileName=',
				orderInfo:{
					orderId:'1482334670241763584',
					businessId:50,
					businessLogo:'ceb7a93b39dc4130b2ad693b28cdb84b20220803173040.png',
					businessName:'闲时蜗居小店',
					goodCount:'',
				},
				evaluateStars:'',
				content:'',
				
				fileList: [
					{
						url: "https://order.ynejkj.com/api/order/image/preview?fileName=da34efe8aadd4fbbaa5c3b9bcc5408f020220803161726.jpg",
						status: 'success',
						message: '上传成功',
					},
					{
						url: "https://order.ynejkj.com/api/order/image/preview?fileName=834d23ac931148abb5713741ca50c3c120220613104050.png",
						status: 'success',
						message: '上传成功',
					},
					{
						url: "https://order.ynejkj.com/api/order/image/preview?fileName=ce2eb6649a694d8fb51254f711bf442320220721103251.jpg",
						status: 'uploading',
						message: '上传中..',
					},
					{
						url: "https://order.ynejkj.com/api/order/image/preview?fileName=84e8258932e345e1932b2c349357ab0120220606173115.png",
						status: 'failed',
						message: '上传失败',
					},
					{
						url: "https://order.ynejkj.com/api/order/image/preview?fileName=abfb3a1b83b44174a4443fc38d2ba5f320220907153535.jpg",
						status: 'success',
						message: '上传成功',
					},
				],
				uploadUrl: "/api/upload/fileUpload",
				headers: {
					token: '',
				},
				imgs:[]
			})
			onMounted(async () => {
				
			})
			nextTick(() => {
				
			})
			// 评分
			const onChange = (value) => {
				console.log(value,999)
				state.evaluateStars = value
			}
			//提交
			const submitEvaluate = () => {
				let params = {
					...state.orderInfo,
					goodCount: state.orderInfo.productNum,
					userId:'',
					star: state.evaluateStars,
					content: state.evaluateStars,
					commentImageList: state.imgs				
				} 
				console.log(params,999)
				addEvaluate(params).then(res => {
					if (res.code == 200) {
						Toast.success(res.msg)
	
						setTimeout(() =>{ 
							router.go(-1)
						}, 1500)
		
					} else {
						Toast.fail(res.msg)
					}
				})
			}
			
			// 返回布尔值
			const beforeRead = (file) => {
				if (file instanceof Array) {
					//判断是否是数组
					file.forEach((v) => {
						checkFile(v);
					});
				} else {
					checkFile(file);
				}
				return true;
			}
			//图片类型检查
			const checkFile = (file) =>{
				const format = ["jpg", "png", "jpeg"];
				const index = file.name.lastIndexOf(".");
				const finalName = file.name.substr(index + 1);
				if (!format.includes(finalName.toLowerCase())) {
					Toast("请上传" + format.join(",") + "格式图片");
					return false;
				}
			}
			const afterRead =(file) => {
			// 此时可以自行将文件上传至服务器
				if (file instanceof Array) {
					file.map((v) => {
						v.status = "uploading";
						v.message = "上传中...";
						uploadImg(v);
					});
				} else {
					file.status = "uploading";
					file.message = "上传中...";
					uploadImg(file);
				}
			}
			//上传
			const uploadImg = (file) =>{
				const formData = new FormData();
				formData.append("file", file.file);
				// uploadImg(this.uploadUrl, formData, {
				// 		headers: this.headers,
				// 	})
				// 	.then((res) => {
				// 		if (res.data) {
				// 			if (file instanceof Array) {
				// 				//判断是否是数组
				// 				file.map((v, i) => {
				// 					v.status = "success";
				// 					v.message = "";
				// 					v.url = res.data[i];
				// 				});
				// 			} else {
				// 				file.status = "success";
				// 				file.message = "";
				// 				file.url = res.data.uploadUrl;
				// 			}
				// 		}
				// 	})
				// 	.catch((err) => {
				// 		Notify({
				// 			type: "warning",
				// 			message: "上传失败",
				// 		});
				// 	});
			}
			//删除
			const delUploadImg = (item)=>{
				state.fileList = state.fileList.filter((v) => v.url != item.url);
			}


			return {
				...toRefs(state),
				onChange,
				submitEvaluate,
				beforeRead,
				checkFile,
				afterRead,
				uploadImg,
				delUploadImg
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shopImg{
		width: 60px;
		height: 60px;
	}
</style>
