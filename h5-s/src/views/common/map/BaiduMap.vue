<!-- components/Qqmap.vue -->
<template>
  <div class="map">
    <van-row class="tx-lt mg-20" style="color:#C83C3C">
      <van-col class="mg-10 ft-se-16" @click="$emit('hideMap')">
        <i class="el-icon-arrow-left"></i>返回
      </van-col>
    </van-row>
    <iframe id="mapPage" width="100%" height="100%" frameborder="0" :src="getSrc"></iframe>
  </div>
</template>

<script>
export default {
  name: "QqMap",
  data() {
    return {
      // mapKey: "HVKBZ-PBFKP-5WVDL-LTBN7-6D6Q6-B5BII",
      // keyName: "ICBC_ORDER",
      // mapKey: "44YBZ-MTPWD-2HW47-PKN4O-FDR4E-QAFXB", //工行地图
      // keyName: "彩云点餐公众号地图"
    };
  },
  computed: {
    getSrc() {
      var baseUrl =
        "https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=" +
        this.mapKey +
        "&referer=" +
        this.keyName;
      if (this.lat && this.lng) {
        baseUrl += `&coord=${this.lat},${this.lng}`;
      }
      return baseUrl;
    }
  },
  props: {
    mapKey: {
      type: String,
      default: ""
    },

    keyName: {
      type: String,
      default: ""
    },
    lat: {
      type: [String, Number]
    },
    lng: {
      type: [String, Number]
    }
  },

  mounted() {
    var self = this;
    window.addEventListener(
      "message",
      function(event) {
        // 对于无法识别的地址，直接返回无法选择
        var loc = event.data;
        if (loc.poiname === "我的位置" || loc.poiaddress === "") {
          self.$toast("无法识别该地址，请移动地图重新选择");
          return false;
        }
        if (loc && loc.module === "locationPicker") {
          // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          self.$emit("callback", loc);
        }
      },
      false
    );
  }
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
}
.mg-20{
  margin: 15px 0 5px 0;
}
</style>
