<template>
	<div class="container">
		<div class="back_bth_lt fixed ft-se-13"  @click="goBack">
			<span class="flex-row"><van-icon name="revoke" class="mg-rt-5 ft-se-16" />返回</span>
		</div>
		<van-tabs v-model="active" @click="tabClick">
			<van-tab title="有效"></van-tab>
			<van-tab title="已失效"></van-tab>
		</van-tabs>
		<div class="content">
			<template v-if="active == 0">
				<div class="indate">
					<div class="bd-rd pd-10 bg-w mg-tp-10" v-if="active == 0" v-for="(item, index) in couponList"
						:key="index">
						<div class="flex-row">
							<div class="flex-col-6 news-left">
								<span class="lt-val">{{ item.redempLabel || "" }}</span>
							</div>
							<div class="news-right flex-col-18">
								<div class="rt-val">
									<div>有效时间:{{ item.effectiveTime }}</div>
								</div>
								<div class="rt-btn">
									<div class="btn" @click="toCart">去使用</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="active == 0 && couponList.length < 1" class="mg-tp-10">
						<van-empty description="暂无记录" />
					</div>
				</div>
			</template>
			
			<template v-else>
				<div class="outdated">
						<div class="bd-rd pd-10 bg-w mg-tp-10" v-for="(item, index) in hadcouponList" :key="index">
							<div class="flex-row">
								<div class="flex-col-6 news-left">
									<span class="lt-val">{{ item.redempLabel || "" }}</span>
								</div>
								<div class="news-right flex-col-18">
									<div class="rt-val">
										<div>有效时间:{{ item.effectiveTime }}</div>
									</div>
									<div class="rt-btn">
										<div class="btn">已失效</div>
									</div>
								</div>
							</div>
						</div>
						<div v-if="active == 1 && hadcouponList.length < 1" class="mg-tp-10">
							<van-empty description="暂无记录" />
						</div>
					</div>
				
			</template>

		</div>
	</div>
</template>

<script>
	import { getReceiveList } from '@/api/activity'
	import { getLocal } from '@/utils/auth'
	import { Dialog } from 'vant'
	export default {
		data(){
			return {
				isLogin: false,
				active: 0,
				hadcouponList: [],
				couponList:[]
			}
		},
		created(){
			this.init()
		},
		mounted() {
			
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			init(){
				let params = {
					status: this.active,
					userId: getLocal('userId')			
				}
				getReceiveList(params).then(res => {
					if (res.code == 200) {
						this.active == 0 ? this.couponList = res.rows : this.hadcouponList =  res.rows
					}
				})
			},
			
			tabClick(values){
				this.active = values
				this.init()
			},
			
			toCart(){
				Dialog({ message: '功能暂未开放' });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: calc(100vh - 0px);
	}
	.news-left,
	.news-right {
		border-radius: 10px;
		height: 90px;
	}

	.news-left {
		padding: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgb(251, 247, 247);
		font-size: 1.5rem;
		background: rgb(221, 93, 70);
		border-right: 2px dotted white;
	}

	.outdated .news-left {
		color: rgb(105, 105, 105);
		background: rgb(187, 186, 186);
	}

	.outdated .news-right {
		border: 2px dotted rgb(105, 105, 105);
	}

	.outdated .rt-val {
		color: rgb(105, 105, 105);
	}

	.outdated .btn {
		color: rgb(105, 105, 105);
		background: rgb(187, 186, 186);
	}

	.news-right {
		padding: 3px 5px;
		display: flex;
		align-items: center;
		position: relative;
		border: 2px dotted rgb(221, 93, 70);
	}

	.rt-val {
		float: left;
		color: rgba(138, 136, 17, 0.876);
		margin-right: 50px;
	}

	.val-tp {
		font-size: 1.2rem;
	}

	.rt-btn {
		float: right;
	}

	.btn {
		padding: 5px 10px;
		border-radius: 20px;
		text-align: center;
		background: red;
		color: white;
		position: absolute;
		right: 10px;
		bottom: 30px;
	}
</style>
