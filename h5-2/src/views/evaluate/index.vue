<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="bd-rd-8 mg-tp-10 mg-lr-10 bg-w pd-lr-15">
		  <div class="flex-row pd-tb-15">
		    <div class="tx-lt font-se-14">
		      您对商家/菜品满意吗？
		    </div>
		  </div>
		  <div class="shopName flex-row ">
		    <Img :src="`${orderInfo.businessLogo}`" class="shopImg mg-rt-15" />
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
			
		<!-- 	<div class="mg-tp-15 pd-tp-15 pd-bt-20">
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
			</div> -->
		</div>
		
		<img src="" alt="" ref="op">
		<div class="pd-lr-15 mg-tp-20">
			<van-button color="#c83c3c" round  class="w-100" @click="submitEvaluate">提交评价</van-button>
		</div>
	</div>
</template>


<script>
	import { addEvaluate, uploadImg } from '@/api/order'
	import { getLocal } from '@/utils/auth'
	import { Toast, Notify, Dialog  } from 'vant'
	import { compressImage, convertBase64UrlToBlob, blobToFile, img_compress } from "@/utils/imgbase";
	import pictureCompress from 'picture-compressor-plus';
	import { img_prveview } from "@/utils/imgbase"
	export default {
		data(){
			return {
				
				orderInfo:{},
				evaluateStars:0,
				content:'',
				
				fileList: [],
				
				imgs:[]
			}
		},
		created(){
			this.orderInfo = this.$route.query
		},
		mounted() {
			
		
		},
		methods:{
	
			goBack(){
				this.$router.go(-1)
			},
			// 评分
			onChange(value){
				this.evaluateStars = value
			},
			//提交
			submitEvaluate(){
				this.fileList.map((v) => {
					this.imgs.push(v.fileName)
				});
				let params = {
					...this.orderInfo,
					businessId: this.orderInfo.businessesId,
					goodCount: this.orderInfo.productNum,
					userId: getLocal('userId'),
					star: this.evaluateStars,
					content: this.content,
					commentImageList: this.imgs				
				} 
				addEvaluate(params).then(res => {
					if (res.code == 200) {
						Toast.success(res.msg)
				
						setTimeout(() =>{ 
							this.$router.go(-1)
						}, 1500)
					
					} else {
						Toast.fail(res.msg)
					}
				})
			},
			
			// 返回布尔值
			beforeRead (file){
				if (file instanceof Array) {
					//判断是否是数组
					file.forEach((v) => {
						this.checkFile(v);
					});
				} else {
					this.checkFile(file);
				}
				return true;
			},
			
			//图片类型检查
			checkFile(file){
				const format = ["jpg", "png", "jpeg"];
				const index = file.name.lastIndexOf(".");
				const finalName = file.name.substr(index + 1);
				if (!format.includes(finalName.toLowerCase())) {
					Toast("请上传" + format.join(",") + "格式图片");
					return false;
				}
			},
			afterRead(file){
			// 此时可以自行将文件上传至服务器
				if (file instanceof Array) {
					file.map((v) => {
						v.status = "uploading";
						v.message = "上传中...";
						this.uploadImg(v);	
					});
				} else {
					file.status = "uploading";
					file.message = "上传中...";
					this.uploadImg(file);
				}
			},
			//上传
			uploadImg (file){
				// 压缩图片
				img_compress(file).then((formData) => {
				  uploadImg(formData)
				  	.then((res) => {
				  		if (res.data) {
								file.status = "success";
								file.message = "上传成功";
								file.fileName = res.data.fileName;
								// img_prveview(res.data.fileName).then((base64) =>{
								// 	file.content = base64
								// })
								
				  		}
				  	})
				  	.catch((err) => {
							Dialog.confirm({
								title: '提示',
								message: JSON.stringify(err),
							})
							.then(() => {
								// on confirm
								
							})
							
				  		Notify({
				  			type: "warning",
				  			message: "上传失败",
				  		});
				  	});
				});
				
			},
			//删除
			delUploadImg (item){
				this.fileList = this.fileList.filter((v) => v.fileName != item.fileName);
			}
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.shopImg{
		width: 50px;
		height: 50px;
	}
</style>