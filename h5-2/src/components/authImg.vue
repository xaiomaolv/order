<template>
	<img ref="img"  @click="handleView($event)"/>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
    name: 'authImg',
    props: {
        src: String
    },
    computed: {
     
    },
   	async mounted() {

			this.getImgSrcByToken()
    },
    methods: {
			handleView(e){
				this.$emit('predivImage', e)
			},
        // 携带token请求img的src
        getImgSrcByToken() {
					Object.defineProperty(Image.prototype, 'imgUrl', {
							writable: true,
							enumerable: true,
							configurable: true
						});

						let imgUrl = `${process.env.VUE_APP_BASE_API}/image/view?fileName=${this.src}`
						const img = this.$refs.img; //this.$refs.img ;
						const request = new XMLHttpRequest() ;
						request.responseType = 'blob';
						request.open('get', imgUrl, true);

						// 这里带上请求头(我的项目token存在locaStorage里,其他根据自身项目情况获取token)
						const token = getToken();
						request.setRequestHeader('Authorization', token);
						request.onreadystatechange = e => {
							if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
								const oFileReader = new FileReader()
								oFileReader.readAsDataURL(request.response);
								oFileReader.onloadend = function(e) {
									const base64 = e.target.result
									img.src = base64
								}
							}
						};
						request.send(null);		
        },
    },
}
</script>    
