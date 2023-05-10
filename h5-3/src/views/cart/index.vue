<template>
	<div class="container">
		
	</div>
</template>

<script>
	import { reactive, onMounted,toRefs,nextTick } from 'vue'
	import { useRoute, useRouter } from 'vue-router'

	export default {
		name:"",
		components: {

		},
		setup() {
			const route = useRoute()
			const router = useRouter()
			const state = reactive({
				isLogin: false
			})
			onMounted(async () => {
				
			})
			nextTick(() => {
				
			})

			// const goBack = () => {
			// 	router.go(-1)
			// }

			return {
				...toRefs(state)
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
