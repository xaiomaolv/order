<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<div class="pd-tp-30 bg-w">
			<van-field v-model="form.userName" type="text" label="收货人"  placeholder="请输入收货人" />
			<van-field v-model="form.phone" type="tel" label="电话号码"  placeholder="请输入电话号码" />
			<van-field v-model="form.list" type="text" label="所在地区"  readonly is-link placeholder="请选择所在地区" @click="show = true"/>
			<van-field v-model="form.address" type="textarea" rows="2" autosize label="详细地址" placeholder="详细地址" />
			<van-field readonly label="设为默认地址" placeholder="" >
				<template #button>
				    <van-switch v-model="form.defFlag" active-color="#ee0a24" inactive-color="#dcdee0" />
				  </template>
				</van-field>	
		</div>
				
		<div class="tx-ct mg-tp-30">
			<van-button type="danger" @click="save" class="w-90" round>保存</van-button>
		</div>
		
		<van-popup v-model="show" round position="bottom">
			<van-area
			  title="地区选择"
			  :area-list="areaList"
			  :columns-placeholder="['请选择', '请选择', '请选择']"
				@confirm="confirm"
				@change="change"
				@cancel='cancel'
			/>
		</van-popup>
	</div>
</template>

<script>
	import { areaList } from '@vant/area-data';
	import { getLocal} from "@/utils/auth"
	import { Toast} from "vant"
	import {
	  getAddressList,
	  addAddress,
	  putAddress,
	  delAddress
	} from "@/api/address"
	export default {
		data() {
			return {
				areaList:{},
				show:false,
				form:{
					address: "",
					defFlag: false,
					list: "",
					phone: "",
					userId: '',
					userName: ""
				}
			}
		},
		created() {
			if(Object.keys(this.$route.query).length !== 0){
				let obj = JSON.parse(JSON.stringify(this.$route.query)) 
				obj.defFlag = obj.defFlag == '1' ? true : false
				this.form = obj
			}
		},
		mounted() {
			this.areaList = areaList
		},
		methods: {
			goBack(){
				this.$router.go(-1)
			},
			async	save(){
				if (!this.form.userName) {
					Toast.fail('请输入收货人')
					return;
				}
				if (!this.form.phone) {
					Toast.fail('请输入电话号码')
					return;
				}
				if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
					Toast.fail('请填写正确的电话号码')
					return;
				}
				if (!this.form.list) {
					Toast.fail('请选择所在地区')
					return;
				}
				if (!this.form.address) {
					Toast.fail('请输入详细地址')
					return;
				}
				let params = JSON.parse(JSON.stringify(this.form))
				params.list = params.list.split('/')
				params.defFlag = params.defFlag ? "1": "0"
				params.userId = getLocal('userId')
				
				let _this = this

				let bool = Object.keys(this.$route.query).length
				let res = bool !== 0   ? await putAddress(params) : await addAddress(params) 
				if(res.code == 200 ){
					Toast.success( bool !== 0  ? '修改成功':'添加成功');
					this.form = {
						address: "",
						defFlag: "0",
						list: "",
						phone: "",
						userId: '',
						userName: ""
					}
					setTimeout(()=>{
						_this.$router.go(-1)
					},1500)
					
				}
			
				
				
				
			},
			confirm(val){
				if(!val[0].name || !val[1].name || !val[2].name) return
				this.form.list = `${val[0].name}/${val[1].name}/${val[2].name}`,
				this.show = false
			},
			cancel(){
				this.show = false
			},
			change(){
				
			}
		}
	}
</script>

<style>
</style>
