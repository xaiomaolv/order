<template>
	<div class="container" style="min-height: 100%;">
		<router-view />
	</div>
</template>

<script>

	export default {
		data() {
			return {
				
			}
		},
		created() {
		
		},
		mounted() {
			
		},
		methods:{
		
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: calc(100vh - 55px);
		overflow: hidden;
		overflow-y: scroll; 
	}
	.van-tabbar--fixed{
		z-index: 999;
	}

	
	:deep .van-tabbar{
		height: 55px!important;
	}
</style>
