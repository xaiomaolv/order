<template>
  <van-popup v-model="showPickerTimes" position="bottom" :close-on-click-overlay="true" @click-overlay="clickTimeOverlay">
      <van-datetime-picker
        v-model="pickerTimes"
        type="time"
        title="选择时间"
        :min-hour="0"
        :max-hour="23"
        :formatter="formatterTime"
        @confirm="onConfirmTime"
        @cancel="showPickerTimeCancel"
      />
    </van-popup>
</template>
<script>
export default {
  props: {
    pickerTime: {
      type: "",
      default: "",
    },
    showPickerTime: {
      type: Boolean,
      default: "",
    },
  },
  data() {
    return {
      pickerTimes: this.pickerTime,
      showPickerTimes: this.showPickerTime,
    };
  },
  watch:{
    showPickerTime(newVal) {
      this.showPickerTimes = newVal
    },
  },
  methods: {
    formatterTime(type, option) {
      if (type === 'hour') {
        option += '时';
      }
      if (type === 'minute') {
        option += '分';
      }
      return option;
    },
    onConfirmTime(time) {
      this.$emit("onConfirmTime", time);
    },
    showPickerTimeCancel() {
      this.$emit("showPickerTimeCancel");
    },
    clickTimeOverlay(){
      this.$emit("clickTimeOverlay");
    }
  },
};
</script>