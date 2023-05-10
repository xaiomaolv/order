<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #F8F8F8;
}
.van-nav-bar-top.van-nav-bar{
    /* width:100%; 
    height: 50px; */
	background-color: #C83C3C;
    /* color: #FFF;
    margin:auto; 
    position:fixed; 
    top:0px; 
    padding:0px;  */
}
.van-nav-bar .van-icon{
	color: #FFF!important;
}
.van-nav-bar .van-nav-bar__title {
	color: #FFF;
}
.van-icon-arrow-left::before{
	color: #FFF;
	font-size: 1rem;
}
/* input[type="radio" i] {
		 background-color: #418EF6!important;
	} */
/* input[type="radio" i]:disabled {
	    background-color: #418EF6!important;
		border-color: #C2C2C2!important;
	}

input:disabled{
		background-color: #C2C2C2!important;
		border-color: #418EF6!important;
	} */
</style>
