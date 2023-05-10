<template>
  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item
      v-for="(item,index) in cardList"
      :key="index"
      :icon="item.iconName"
    >{{item.title}}</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Notify } from 'vant';

export default {
  data() {
    return {
      active: 0,
      cardList: [
        {
          title: "首页",
          iconName: "wap-home",
          path: "/foodTypeList"
        },        
        {
          title: "订单",
          iconName: "column",
          path: "/orderList"
        },
        {
          title: "个人中心",
          iconName: "manager",
          path: "/storeSetting"
        }
      ]
    };
  },
   methods: {
    onChange(index) {
      Notify({ type: 'primary', message: index });
    },
  },
};
</script>
