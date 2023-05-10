<template>
	<div class="container">
		<van-nav-bar title="密码修改" left-text="" left-arrow class="van-nav-bar-top" @click-left="onClickLeft"> </van-nav-bar>

		<van-form @submit="handleLogin" style="margin-top: 1.875rem;">
			<van-field v-model="password" name="password" :type="passwordTypeo" label="旧密码" placeholder="旧密码" :rules="[{ required: true, message: '请填写旧密码' }]" >
			<template #button>
					<van-row @click="showPwd(1)">
						<van-icon :name="passwordTypeo === 'password' ? 'closed-eye' : 'eye-o'" />
					</van-row>
				</template>
			</van-field>
			
			<van-field :key="passwordType" ref="password"  label="新密码" v-model="newPassword" :type="passwordType" placeholder="新密码"
			 name="password"  :rules="[{ pattern, message: '密码格式不正确' }]">
				<template #button>
					<van-row @click="showPwd(2)">
						<van-icon :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'" />
					</van-row>
				</template>
			</van-field>
			<van-row style="font-size: 0.75rem; margin-top: 0.625rem;color: #889AA4;">&nbsp;&nbsp;提示：密码格式为8-16位字母和数字组合，不包含特殊字符</van-row>
			<div style="margin-top: 1.875rem;">
				<van-button round block type="info" native-type="submit" @click.native.prevent="handleLogin" style="width: 80%; margin: 0 auto;">
					提交
				</van-button>
			</div>
		</van-form>
	</div>

</template>

<script>
	import {password} from "@/api/sys.js"
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				newPassword: '',
				password: '',
				passwordType: 'password',
				passwordTypeo: 'password',
				pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
			};
		},
		watch: {

		},
		methods: {
			onClickLeft() {
				this.$router.go(-1)
			},
			
			showPwd (type) {
				if(type == 1){
					if (this.passwordTypeo === 'password') {
					  this.passwordTypeo = ''
					} else {
					  this.passwordTypeo = 'password'
					}
				}else{
					if (this.passwordType === 'password') {
					  this.passwordType = ''
					} else {
					  this.passwordType = 'password'
					}					
				}
			 
			},
			handleLogin (values) {
				let params ={					
					password: md5(this.password),
					newPassword: md5(this.newPassword)
				}	
				password(params).then(res => {
					if(res.code == 200){
						this.$notify({ type: 'success', message: res.data })
						if(this.$route.path == "/sale/password"){
							this.$router.push({
								path:'/sale/login'
							})
						}else{
							this.$router.push({
								path:'/customer/login'
							})
						}						
					}
				})
			}			
		}
	};
</script>
<style lang="scss" scoped>
	.container {
		/* height: 100%;s */
		/* padding-top: 2.8125rem; */
		font-size: 0.875rem;
	}

	.van-nav-bar-top {
		width: 100%;
		// position: fixed;
		// top: 0;
		// left: 0;
		// z-index: 1001;
	}
	.van-cell{
		padding: 1rem;
	}
	.container>>>.van-icon {
		font-size: 1rem!important;
	}
	.van-icon-closed-eye::before {
	    content: "\F035";
		// font-size: 1.25rem!important;
		// margin-top: 0.3125rem;
	}
	.mg-top-45 {
		margin-top: 2.8125rem;
	}

	.width-100 {
		width: 100%;
		text-align: center;
	}

	.loginOut {
		margin: 0 auto;
		width: 80%;
		border-radius: 2.5rem;
	}
</style>
