<template>
  <van-popup v-model="showPickerDates" position="bottom" :close-on-click-overlay="true" @click-overlay="clickOverlay">
    <van-datetime-picker
      type="date"
      title="选择日期"
      v-model="dataPickers"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="onConfirmDate"
      @cancel="showPickerDateCancel"
    />
  </van-popup>
</template>
<script>
export default {
  props: {
    dataPicker: {
      type: "",
      default: "",
    },
    showPickerDate: {
      type: Boolean,
      default: "",
    },
  },
  data() {
    return {
      minDate: new Date(2022, 0, 1),
      maxDate: new Date(),
      dataPickers: this.dataPicker,
      showPickerDates: this.showPickerDate,
    };
  },
  watch:{
    showPickerDate(newVal) {
      this.showPickerDates = newVal
    },
  },
  methods: {
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      }
      return val;
    },
    onConfirmDate(time) {
      this.$emit("onConfirmDate", time);
    },
    showPickerDateCancel() {
      this.$emit("showPickerDateCancel");
    },
    clickOverlay(){
      this.$emit("clickOverlay");
    }
  },
};
</script>