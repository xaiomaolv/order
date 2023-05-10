<template>
  <div class='HZL_top'>
    <div class="shopName">
      <div class="row flex-row flex-wrap tx-ct">
        <div class="flex-row flex-col-24 bg-w pd-tb-10 bd-bt">
          <div class="flex-row flex-col-item flex-col-24">
            <div class="flex-col-6 tx-lt pd-lt-10">
              <img class="shopImg"   />								
            </div>

            <div class="flex-col-18 tx-rt flex-col">
              <div class="flex-row flex-col-24">
                <div class="flex-col-14 tx-lt dianpu">{{resCode.businessName}}</div>
                <div class="flex-col-10 tx-rt pd-rt-10 li-hg-18">桌号：{{resCode.tableName}}</div>
              </div>
              <div class="flex-row flex-col-24 mg-tp-5">
                <div class="flex-col-14 tx-lt shuiang li-hg-20">{{resCode.address}}</div>
                <div class="flex-col-10 tx-rt pd-rt-10 ft-se-12">{{resCode.mealNum}}人就餐</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { toRefs } from "vue";
export default {
  name: "topHeader",
  props: {
    resCode: Object
  },
  setup(props, { emit }) {
    console.log(props);
    // const p = toRefs(props);
    // const msg = p.msg;
    // const boy = p.boy;
 
    // const btn = () => {
    //   const news = "我是子组件传进的值";
    //   emit("change", news);
    // };
 
    return {

     };
  }
}
</script>


<style lang="scss" scoped>
	.shopName {
		display: inline;
		// padding-left: 36px;
	}
	.shopImg {
	  width: 72px;
	  height: 70px;
	  margin-right: 13px;
	  border-radius: 5px;
	  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}
	.dianpu {
	  font-size: 17px;
	  font-family: PingFang SC;
	  font-weight: bold;
	  color: rgba(58, 58, 58, 1);
	}
	.shuiang {
	  font-size: 14px;
	  font-family: PingFang SC;
	  color: rgba(149, 149, 149, 1);
	}
</style>