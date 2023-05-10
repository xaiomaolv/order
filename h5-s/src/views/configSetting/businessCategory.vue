<template>
	<div class="container bg-w" style="padding-bottom: 85px;">
		<van-nav-bar title="经营品类" left-text left-arrow class="van-nav-bar-top" @click-left="onClickLeft"></van-nav-bar>
		<van-tree-select class="mg-tp-50" :items="items" :main-active-index="mainActiveIndex" :active-id="activeIds"
			@navclick="onNavClick" @itemclick="onItemClick" />

		<div class="fixed-bottom  row">
			<div class="pd-tb-15 pd-lr-15 ">
				<van-button style="width:100%;" color="#C83C3C" class="loginOut mg-tp-10" @click="onSubmit" round>确认
				</van-button>
			</div>
			
		</div>

	</div>
</template>

<script>
	import {
		getTypeTree
	} from "@/api/sys.js";
	import {
		TreeSelect
	} from 'vant';

	export default {
		data() {
			return {
				
				items: [],
				// 左侧高亮元素的index
				mainActiveIndex: null,
				// 被选中元素的id
				activeIds: [],
				businessCategoryList: []
			};
		},
		created() {
			// 组件树数据
			this.items = this.$store.state.sys.categoryTreeData
			
			let that = this

			let {category} = that.$route.query
			
			// 右侧选中数据处理
			if (category) {
				let arr = []		
				category.split(',').forEach(el => {
					arr.push(Number(el))
				})
				
				that.activeIds = arr			
			}
			
			// 左侧选中索引处理
			let arr = that.items
			
			arr.forEach((el, index) =>{
				if(el.children){							
					el.children.forEach(item => {
						if(that.activeIds.length == 0) return 
						if(el.children.some(item=> item.id == that.activeIds[0] )){
							that.mainActiveIndex = Number(index)
						}
					})
				}	
			})
		},

		methods: {
			// 左侧点击
			onNavClick(index) {
				this.mainActiveIndex = index;
				this.activeIds = []
			},
			// 右侧点击
			onItemClick(data) {

				// 深拷贝
				let activeArr = JSON.parse(JSON.stringify(this.activeIds))
				// 判断是否已经选中，如选中就取消选中
				if (activeArr.some(e => e == data.id)) {
					activeArr.forEach((el, index) => {
						if (el == data.id) {
							// 删除数组元素
							activeArr.splice(index, 1);
						}
					})
				} else {
					activeArr.push(data.id);
				}

				this.activeIds = activeArr

			},
			// 确认
			onSubmit() {			
				this.$store.commit('sys/SET_CATEGORYINDEX', this.mainActiveIndex)
				this.$store.commit('sys/SET_CATEGORY', this.activeIds.join(','))
				this.$router.go(-1);
			},
			onClickLeft() {
				this.$router.go(-1);
			},
		}
	};
</script>
<style scoped>
	.container {
		height: 100%;
		overflow: scroll;
		position: relative;
		font-size: 0.875rem;
	}

	.mg-tp-50 {
		margin-top: 50px;
	}
</style>
