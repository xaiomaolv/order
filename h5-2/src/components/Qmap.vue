<template>
	<div class="map">
		<iframe id="mapPage" width="100%" height="100%" frameborder=0 :src="src">
		</iframe> 
	</div>
</template>

<script>
	export default {
		name:"",
		components: {
		
		},
		data(){
			return {
				keyName:'',
				src:"",
			}
		},
		mounted() {
			const obj= this.$route.query
			let that = this
			this.src = `https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${this.mapKey}&coord=${obj.lat},${obj.lng}&referer=myapp`
			window.addEventListener('message', function(event) {
					// 对于无法识别的地址，直接返回无法选择
					var loc = event.data
					if (loc.poiname === '我的位置' || loc.poiaddress === '') {
							Toast.fail('无法识别该地址，请移动地图重新选择')
							return false
					}
					if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'				
						that.$router.push({
							path:'/index',
							query:{
								address: loc.poiaddress,
								lat: loc.latlng.lat,
								lng: loc.latlng.lng,
							}
						})
					}
			}, false)
		},
		methods:{
			goBack(){
				this.$router.go(-1)
			},
			
		}
	}
</script>

<style lang="scss" scoped>
.map{
	width: 100%;
	height: 100%;
}
</style>
