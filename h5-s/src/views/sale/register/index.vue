<template>
	<div class="container">
		<van-nav-bar title="注册商户信息" left-text="" left-arrow class="van-nav-bar-top" @click-left="onClickLeft"> </van-nav-bar>
		<van-form @submit="onSubmit" style="background-color: #C83C3C;" scroll-to-error = "true">
			<van-cell value="企业信息" class="van-cell-bg" />
			<van-row style=" margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;">
				<van-col span="24" class="line-hg-28">营业执照（上传彩色照片）</van-col>
				<van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
					<van-uploader v-model="yyzzFileList" :after-read="afterReadY" multiple :max-count="1" :before-delete="beforeDeleteY" />
				</van-col>
			</van-row>
			<van-field v-model="vanForm.customerName" type="text" name="customerName" label="企业名称" placeholder="请按营业执照填写"
			 :rules="[{ required: true, message: '必填' }]" />
			<van-field v-model="vanForm.unifiedCode" type="text" onKeyUp="value=value.replace(/[\W]/g,'')" name="unifiedCode" label="统一代码" placeholder="请按营业执照填写"
			 :rules="[{ required: true, message: '必填' }]" />			 
			<van-field v-model="vanForm.address" type="text" name="address" label="详细地址" placeholder="企业详细地址" :rules="[{ required: true, message: '必填' }]" />
			<van-field v-model="vanForm.legalRepresentative" type="text" name="legalRepresentative" label="法人代表" placeholder="企业法人代表"
			 :rules="[{ required: true, message: '必填' }]" />	
			 <van-field v-model="vanForm.legalPhone" type="number" name="legalPhone" label="法人电话" placeholder="请填写"
			  :rules="[{ required: true, message: '必填' },{ pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}]" />	
				 

			<van-cell value="身份信息" class="van-cell-bg" />
			<van-row style=" margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 ssolid 1px; background-color: #FFF;">
				<van-col span="24" class="line-hg-28">上传身份证照片（人像面）</van-col>
				<van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
					<van-uploader v-model="sfzzFileList" :after-read="afterReadZ" multiple :max-count="1"  :before-delete="beforeDeleteZ"/>
				</van-col>
			</van-row>
			<van-field v-model="sfzz.value1" type="text" name="" label="姓名" placeholder="请填写" :rules="[{ required: true, message: '必填' }]" />
			<!-- <van-field v-model="sfzz.value2" type="number" name="" label="出生日期" placeholder="请填写" :rules="[{ required: true, message: '必填' }]" /> -->

			<van-field readonly clickable :value="sfzz.value2" type="text" name="ksrq" label="出生日期" placeholder="请填写" @click="QDRQ = true"
			 :rules="[{ required: true, message: '必填' }]">
				<template #button>
					<van-icon name="arrow" /></template>
			</van-field>

			<van-field v-model="sfzz.value3" type="number" name="" label="身份证号" placeholder="请填写" :rules="[{  required: true, message: '必填' },{validator,message:'请输入正确的身份证号!'}]" />
			<!-- <van-field v-model="sfzz.value4" type="text" name="" label="性别" placeholder="请填写" :rules="[{ required: true, message: '必填' }]" /> -->
			<van-field readonly clickable name="picker" :value="sfzz.value4" label="性别" placeholder="点击选择性别" :rules="[{ required: true, message: '必填' }]"
                @click="showPicker = true"/>
            <!-- 性别 -->
            <van-popup v-model="showPicker" position="bottom">
                <van-picker show-toolbar :columns="columns" @confirm="onConfirmSex" @cancel="showPicker = false"/>
            </van-popup>
            <!--  -->
            <van-field v-model="sfzz.value5" type="text" name="" label="地址" placeholder="请填写" :rules="[{ required: true, message: '必填' }]" />

			<van-row style="margin: 0 auto; padding-bottom: 2.5rem; border-bottom:#F8F8F8 solid 1px;background-color: #FFF;">
				<van-col span="24" class="line-hg-28">上传身份证照片（国徽面）</van-col>
				<van-col span="24" style="text-align: center; margin-top: 0.9375rem; ">
					<van-uploader v-model="sfzFileList" :after-read="afterReadF" multiple :max-count="1"  :before-delete="beforeDeleteF"/>
				</van-col>
			</van-row>

			<van-field readonly clickable :value="sfzf.value1" type="text" name="" label="证件有效日期" placeholder="请填写" @click="KSRQ = true"
			 :rules="[{ required: true, message: '必填' }]">
				<template #button>
					<van-icon name="arrow" /></template>
			</van-field>

			<van-field readonly clickable :value="sfzf.value2" type="text" name="jsrq" label="证件失效日期" placeholder="请填写" @click="JSRQ = true"
			 :rules="[{ required: true, message: '必填' }]">
				<template #button>
					<van-icon name="arrow" /></template>
			</van-field>

			<van-field v-model="sfzf.value3" type="text" name="dz" label="签发机关" placeholder="请填写" :rules="[{ required: true, message: '必填' }]" />

			 <!-- @click="handleComputed" -->
			<van-row class="mg-top-45">
				<van-button round block :loading="loading" type="info" style='width: 80%; margin: 0 auto; ' native-type="submit" :disabled="handleClick">
					下一步
				</van-button>
			</van-row>
		</van-form>

		<!-- 签订日期 -->
		<van-popup v-model="QDRQ" position="bottom">
			<van-datetime-picker type="date" title="选择日期" :min-date="QDRQminDate" :max-date="maxDate" @confirm="onConfirmDataQDRQ"
			 @cancel="QDRQ = false" />
		</van-popup>
		<!-- 签订日期 -->
		<van-popup v-model="KSRQ" position="bottom">
			<van-datetime-picker type="date" title="选择日期" :min-date="minDate" :max-date="startmaxDate" @confirm="onConfirmDataKSRQ"
			 @cancel="KSRQ = false" />
		</van-popup>
		<!-- 签订日期 -->
		<van-popup v-model="JSRQ" position="bottom">
			<van-datetime-picker type="date" title="选择日期" :min-date="endminDate" :max-date="maxDate" @confirm="onConfirmDataJSRQ"
			 @cancel="JSRQ = false" />
		</van-popup>

	</div>

</template>

<script>
	// import compute from "../../utils/compute.js"
	import {
		uploadImg,
		saveCustomer,
		searchContract
	} from "@/api/contract.js"
    import qs from 'qs'
	// import { compressImage } from "../../utils/imgbase.js"
    
	export default {
		data() {
			return {
				handleClick: false,
				loading: false,
				vanForm: {
					id:'',
					contractId:'',
					customerName: '',
					unifiedCode: '',
					address: '',
					legalRepresentative: '',
					legalPhone:'',
					resources: [],
				},
				resources:[],
				yyzz: {
					"id":"",
					"category": "营业执照",
					"name": "营业执照",
					"resource": "",
					"value1": "",
					"value2": "",
					"value3": "",
					"value4": "",
					"value5": ""
				},
				sfzz: {
					"id":"",
					"category": "身份证正面",
					"name": "身份证人像面",
					"resource": "",
					"value1": "",
					"value2": "",
					"value3": "",
					"value4": "",
					"value5": ""
				},
				sfzf: {
					"id":"",
					"category": "身份证反面",
					"name": "身份证国徽面",
					"resource": "",
					"value1": "",
					"value2": "",
					"value3": "",
					"value4": "",
					"value5": ""
				},				
				yyzzFileList: [],
				sfzzFileList: [],
                sfzFileList: [],
                QDRQminDate:new Date(1930, 1, 1),
				minDate: new Date(1990, 1, 1),
                maxDate: new Date(2039, 11, 31),
                startmaxDate: new Date(2049, 11, 31), //开始时间的最大时间
                endminDate:new Date(1990, 1, 1), //结束时间的最小时间
				QDRQ: false,
				KSRQ: false,
                JSRQ: false,
                columns: ['男', '女', '其他'],
                showPicker: false,
                isAddandEdit:''
            };
		},
		created() {
            if(this.$route.params.add) {
                this.$cookies.set("isAddandEdit",true)
                this.$cookies.remove('contractId')
            }
			if(this.$route.query.id || this.$cookies.get("contractId")){
                this.$cookies.set("isAddandEdit",false)
				searchContract(this.$route.query.id || this.$cookies.get("contractId")).then(res=>{
                    this.resources = res.data.resources;
                    this.vanForm = res.data;
					this.vanForm.resources = [];
					this.resources.forEach((el,index )=> {
						if(el.category == "营业执照"){
							this.yyzz = el;
							let arr = el.resource.split(',')
							let arry = [];
							arr.forEach((e,index)=>{
							 	let obj = {
							 		url: this.IMG_BASR_URL+ e							 		
							 	}
							 	this.yyzzFileList.push(obj)
                             })
						}
						if(el.category == "身份证正面"){
							this.sfzz = el;
							let arr = el.resource.split(',')
							let arry = [];
							arr.forEach((e,index)=>{
							 	let obj = {
							 		url: this.IMG_BASR_URL+ e
							 		
							 	}
								this.sfzzFileList.push(obj)								
							 })							
						}
						if(el.category == "身份证反面"){
							this.sfzf = el;
							let arr = el.resource.split(',')
							let arry = [];
							arr.forEach((e,index)=>{
							 	let obj = {
							 		url: this.IMG_BASR_URL+ e							 		
							 	}
							 	this.sfzFileList.push(obj)		
							 })							 
						}
					})
				})
            }
            
		},
		watch: {

		},
		methods: {
            // onConfirmSex(value) {
            //     this.sfzz.value4 = value;
            //     this.showPicker = false;
            // },
            // // 验证身份证号
            // validator(val){
            //     var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
            //     if(!reg.test(val)){
            //         return false;
            //     } else {
            //         return true;
            //     }
            // },

			// afterReadY(file) {
            //     compressImage(file.content).then(result => {
            //         file.status = 'uploading';
			// 		file.message = '上传中...';	
            //         const formData = new FormData();
            //         if (result.size > file.file.size){
            //             //压缩后比原来更大，则将原图上传
            //             formData.append('file', file.file,file.file.name)
            //             // 
            //         } else {
            //             //压缩后比原来小，上传压缩后的
            //             formData.append('file', result,file.file.name)
            //         }
            //         uploadImg(formData).then(res => {
            //             if (res.code == 200) {
            //                 let obj = {
            //                     url: this.IMG_BASR_URL+ res.data
            //                 }
            //                 this.yyzzFileList = [];
            //                 this.yyzzFileList.push(obj);
            //                 file.status = 'success';
            //                 file.message = '上传成功';
            //             }
            //         }).catch(err => {
            //             file.status = 'failed';
            //             file.message = '上传失败';
            //         })
            //     })
            // },
			// afterReadZ(file) {
            //     compressImage(file.content).then(result => {
            //         file.status = 'uploading';
            //         file.message = '上传中...';	
            //         const formData = new FormData();
            //         if (result.size > file.file.size){
            //             //压缩后比原来更大，则将原图上传
            //             formData.append('file', file.file,file.file.name)
            //             // 
            //         } else {
            //             //压缩后比原来小，上传压缩后的
            //             formData.append('file', result,file.file.name)
            //         }
            //         uploadImg(formData).then(res => {
            //             if (res.code == 200) {
            //                 let obj = {
            //                     url: this.IMG_BASR_URL+ res.data
            //                 }
            //                 this.sfzzFileList = [];
            //                 this.sfzzFileList.push(obj);					
            //                 file.status = 'success';
            //                 file.message = '上传成功';
            //             }
            //         }).catch(err => {
            //             file.status = 'failed';
            //             file.message = '上传失败';
            //         })
            //     })
			// },
			// afterReadF(file) {
            //     compressImage(file.content).then(result => {
            //         file.status = 'uploading';
            //         file.message = '上传中...';	
            //         const formData = new FormData();
            //         if (result.size > file.file.size){
            //             //压缩后比原来更大，则将原图上传
            //             formData.append('file', file.file,file.file.name)
            //             // 
            //         } else {
            //             //压缩后比原来小，上传压缩后的
            //             formData.append('file', result,file.file.name)
            //         }
            //         uploadImg(formData).then(res => {
            //             if (res.code == 200) {
            //                 let obj = {
            //                     url: this.IMG_BASR_URL+ res.data
            //                 }
            //                 this.sfzFileList =[];
            //                 this.sfzFileList.push(obj);							
            //                 file.status = 'success';
            //                 file.message = '上传成功';
            //             }
            //         }).catch(err => {
            //             file.status = 'failed';
            //             file.message = '上传失败';
            //         })
            //     })
				
			// },
			// beforeDeleteY(file, index) {
			// 	this.yyzzFileList.splice(index.index,1);
			// },
			// beforeDeleteZ(file, index) {
			// 	this.sfzzFileList.splice(index.index,1);						
			// },
			// beforeDeleteF(file, index) {
			// 	this.sfzFileList.splice(index.index,1);				
			// },
			// onConfirmDataQDRQ(val) {
			// 	this.sfzz.value2 = this.dateFormat(val);
			// 	this.QDRQ = false;
			// },
			// onConfirmDataKSRQ(val) {
            //     this.sfzf.value1 = this.dateFormat(val);
            //     // 结束时间的最小时间等于开始时间的前一天
            //     let dateTime = val;
            //     dateTime=dateTime.setDate(dateTime.getDate()+1);
            //     dateTime=new Date(dateTime);
            //     this.endminDate = new Date(this.dateFormat(dateTime))
            //     this.KSRQ = false
			// },
			// onConfirmDataJSRQ(val) {
            //     this.sfzf.value2 = this.dateFormat(val);
            //     // 开始时间的最大时间等于结束时间的后一天
            //     let dateTime = val;
            //     dateTime=dateTime.setDate(dateTime.getDate()-1);
            //     dateTime=new Date(dateTime);
            //     this.startmaxDate = new Date(this.dateFormat(dateTime))
            //     this.JSRQ = false;
			// },
			// onSubmit(values) {
			// 	if(this.yyzzFileList.length == 0 || this.sfzzFileList.length == 0 || this.sfzFileList.length == 0 ){
			// 		this.$dialog.alert({
			// 		  title: '',
			// 		  message: '请上传相关证件！！',
			// 		}).then(() => {
			// 		  // on close
			// 		});
			// 		return;
			// 	}				
													
			// 	let y = [];
			// 	this.yyzzFileList.forEach((el,index) =>{
			// 		el.url= el.url.replace(this.IMG_BASR_URL,"");
			// 		y.push(el.url)
			// 	})
			// 	this.yyzz.resource = y.join(',')						
			
			// 	let z = [];
			// 	this.sfzzFileList.forEach((el,index) =>{
			// 		el.url= el.url.replace(this.IMG_BASR_URL,"");
			// 		z.push(el.url)
			// 	})
			// 	this.sfzz.resource = z.join(',')						
			
			// 	let f = [];
			// 	this.sfzFileList.forEach((el,index) =>{
			// 		el.url= el.url.replace(this.IMG_BASR_URL,"");
			// 		f.push(el.url)
			// 	})						
			// 	this.sfzf.resource = f.join(',')						
			// 	this.vanForm.contractId = this.$route.query.id;
			// 	this.vanForm.resources.push(this.yyzz, this.sfzz, this.sfzf);
				
			// 	let yy = [];
			// 	let sz = [];
			// 	let sf = [];
			// 	this.yyzzFileList.forEach((e,index)=>{
			// 		let obj = {
			// 			url: this.IMG_BASR_URL+ e.url
			// 		}
			// 		yy.push(obj)
			// 	})
			// 	this.yyzzFileList = yy;
				
			// 	this.sfzzFileList.forEach((e,index)=>{
			// 		let obj = {
			// 			url: this.IMG_BASR_URL+ e.url
			// 		}
			// 		sz.push(obj)
			// 	})
			// 	this.sfzzFileList = sz;
				
			// 	this.sfzFileList.forEach((e,index)=>{
			// 		let obj = {
			// 			url: this.IMG_BASR_URL+ e.url
			// 		}
			// 		sf.push(obj)
			// 	})
			// 	this.sfzFileList = sf;
			// 	if(this.$route.query.id){
			// 		this.vanForm.contractId = this.$route.query.id
			// 	}else{
			// 		this.vanForm.contractId = '';
            //     }
			// 	saveCustomer(this.vanForm).then(res => {
			// 		if(res.code == 200){					
			// 			this.$cookies.set("contractId", res.data.id);
			// 			this.$cookies.set("customerId", res.data.customerId);
			// 			this.$router.push({
			// 				path: "/sale/elebill"
			// 			})
			// 		}
			// 	})
			// },			
			// dateFormat(date, fmt) {
			// 	fmt = "YYYY-mm-dd";
			// 	let ret;
			// 	const opt = {
			// 		"Y+": date.getFullYear().toString(), // 年
			// 		"m+": (date.getMonth() + 1).toString(), // 月
			// 		"d+": date.getDate().toString(), // 日
			// 		"H+": date.getHours().toString(), // 时
			// 		"M+": date.getMinutes().toString(), // 分
			// 		"S+": date.getSeconds().toString() // 秒
			// 		// 有其他格式化字符需求可以继续添加，必须转化成字符串
			// 	};
			// 	for (let k in opt) {
			// 		ret = new RegExp("(" + k + ")").exec(fmt);
			// 		if (ret) {
			// 			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			// 		};
			// 	};
			// 	return fmt;
			// },
			// onClickLeft() {
			// 	this.$router.go(-1)
            // }
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;
		font-size: 0.875rem;
		background-color: #F8F8F8;
	}

	.van-nav-bar-top {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1001;
	}

	.van-form {
		margin-top: 45px;
		padding-bottom: 6.25rem;
        
	}

	.van-form .van-cell-bg {
		background-color: #F8F8F8;
	}

	.van-form>>>.van-field__label {
		width: 7.5rem !important;
	}

	.bottom-btn-grop {
		width: 100%;
		display: flex;
		flex-direction: row;
		position: fixed;
		bottom: 0px;
		left: 0;
		padding: 0.8rem 0;
		background-color: #FFF;
		border-top: #ebedf0 1px solid;
		z-index: 1001;
	}

	.bottom-btn-grop-item {
		width: 50%;
		text-align: center;
	}

	.bottom-btn-grop-item .van-button {
		width: 90%;
		margin: 0 auto;
		height: 2.1875rem;
	}

	.mg-top-45 {
		margin-top: 2.8125rem;
	}

	.line-hg-28 {
		line-height: 1.75rem;
		padding-left: 0.9375rem;
		font-size: 0.875rem;
	}

	.van-icon-underway-o::before {
		content: "\F0D0";
		font-size: 1.25rem;
	}
</style>
