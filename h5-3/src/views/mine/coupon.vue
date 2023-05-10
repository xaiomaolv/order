<template>
	<div class="">
		<van-tabs v-model:active="active" @click-tab="tabClick">
			<van-tab title="有效">
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
									<div class="btn" bindtap="toCart">去使用</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="active == 0 && couponList.length < 1" class="mg-tp-10">
						<van-empty description="暂无记录" />
					</div>
				</div>
			</van-tab>
			<van-tab title="已失效">
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
			</van-tab>
		</van-tabs>
	</div>
</template>
<script>
	import { reactive, onMounted, toRefs, nextTick } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { getReceiveList } from '@/api/activity'

	export default {
		name: "",
		components: {},
		setup() {
			const route = useRoute();
			const router = useRouter();
			const state = reactive({
				isLogin: false,
				active: 0,
				hadcouponList: [],
				couponList:[{
						id: 1,
						redempLabel: "5元",
						detail: "满30-5元",
						effectiveTime: "2022-04-08",
					},
					{
						id: 2,
						redempLabel: "3元",
						detail: "满25-3元",
						effectiveTime: "2022-04-05",
					},
					{
						id: 3,
						redempLabel: "2元",
						detail: "满20-2元",
						effectiveTime: "2022-04-05",
					}
				]
			});
			onMounted(async () => {
				init()
			});
			nextTick(() => {});

			const init = () =>{
				let params = {
					status: state.active,
					userId: ''			
				}
				getReceiveList(params).then(res => {
					if (res.code == 200) {
						state.active == 0 ? state.couponList = res.rows : state.hadcouponList =  res.rows
					}
				})
			}
			const tabClick = (values) => {
				state.active = values.name
				console.log('tabClick', values);
				console.log('active', state.active);
				init()
			};
			return {
				...toRefs(state),
				tabClick,
				init
			};
		},
	};
</script>

<style lang="scss" scoped>
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
