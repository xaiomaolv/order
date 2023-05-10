<template>
	<div class="map">
		<iframe id="mapPage" width="100%" height="100%" frameborder=0 :src="src">
		</iframe> 
	</div>
</template>

<script>
	import { reactive, onMounted,toRefs,nextTick, computed, defineProps, defineEmits } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	const mapKey = '7QZBZ-CL5LK-GINJ3-AP26H-CT7S6-6ABRH' //OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
	export default {
		name:"",
		components: {

		},

		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				keyName:'',
				src:"",
			})
			
			onMounted(async () => {

				const obj= route.query
				state.src = `https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${mapKey}&coord=${obj.lat},${obj.lng}&referer=myapp`
				window.addEventListener('message', function(event) {
						// 对于无法识别的地址，直接返回无法选择
						var loc = event.data
						if (loc.poiname === '我的位置' || loc.poiaddress === '') {
								Toast.fail('无法识别该地址，请移动地图重新选择')
								return false
						}
						if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'				
							router.push({
								path:'/home',
								query:{
									address: loc.poiaddress,
									lat: loc.latlng.lat,
									lng: loc.latlng.lng,
								}
							})
						}
				}, false)
			})
			nextTick(() => {
				
			})

			const init = () => {
				window.addEventListener('message', function(event) {
						// 对于无法识别的地址，直接返回无法选择
						var loc = event.data
						if (loc.poiname === '我的位置' || loc.poiaddress === '') {
								Toast.fail('无法识别该地址，请移动地图重新选择')
								return false
						}
						if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
								emits('callback', loc)
						}
				}, false)
			}

			return {
				...toRefs(state),
				init
			}
		}
	}
</script>

<style lang="scss" scoped>
.map{
	width: 100%;
	height: 100%;
}
</style>
