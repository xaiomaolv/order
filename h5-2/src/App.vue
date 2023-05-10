<template>
  <div id="app">
    <transition name="fade-right" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
	import { removeToken, removeLocal } from '@/utils/auth'
	export default {
		data(){
			return {
				
			}
		},
		created() {
			
		},
		mounted() {
	
			if(process.env.NODE_ENV === "production"){
				removeToken()
				removeLocal('userId')
			}
			let script = document.createElement('script')
			script.type = 'text/javascript'
			script.src = `https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=${this.mapKey}`
			document.getElementsByTagName('head')[0].appendChild(script) 
		},
		beforeDestroy(){
			
		}
	  
	}
</script>

<style lang="scss">
	*{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	html,body{
		background-color: #f8f8f8;
		height: 100%;	
	}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
	height: 100%;
}

.router-view{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    -webkit-overflow-scrolling: touch;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active{
    height: 100%;
    will-change: transform;
    transition: all 500ms;
    position: absolute;
    backface-visibility: hidden;
}
.slide-right-enter{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-enter{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
// 进入后和离开前保持原位
.fade-right-enter-to,
.fade-right-leave-from{
  opacity: 1;
  transform: none;
}
 
// 设置进入和离开过程中的动画时长0.5s
.fade-right-enter-active,
.fade-right-leave-active
{
  transition: all 0.5s;
}
 
// 进入前和离开后为透明，并在右侧20px位置
.fade-right-enter-from,
.fade-right-leave-to{
  opacity: 0;
  transform: translateX(20px);
}

.van-nav-bar .van-icon {
    color: #ee0a24!important;
		font-size: 20px;
}
.back_bth_rt{
	padding: 6.5px 0.9375rem;
	background: rgba(0,0,0,0.5);
	border-radius:30px 0 0 30px ;
	color: #FFF;
	top: 10px;
	right: 0;
	z-index: 1;
}
.back_bth_lt{
	padding: 6.5px 0.9375rem;
	background: rgba(0,0,0,0.5);
	border-radius: 0 30px 30px 0 ;
	color: #FFF;
	top: 10px;
	left: 0;
	z-index: 1;
}
.van-tab--active{
	font-weight: 600!important;
}
</style>
