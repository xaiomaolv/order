<template>

  <div id='app'>

    <form>
      <van-field v-model="input" placeholder="银行卡号" @blur="massage"></van-field>
      <van-field v-model="msgText" type="text" placeholder="开户行"></van-field>
      <van-field v-model="cardType" type="text" placeholder="卡类型"></van-field>
      <button @click="setInput">46464316</button>
    </form>
  </div>
</template>

<script>
  import { checkCard } from '../utils/checkCard.js'



  export default {
    id:'app',
    name: 'checkCard',
    data(){
      return{
        input:null,
        msgText:null,
        cardType:null
      }
    },
    watch:{
    },
    methods:{
      massage(){
        let $this = this;
        checkCard(this.input).then(response => {
          if (response.validated){
            $this.msgText = response.bankName ;
            $this.cardType = response.cardTypeName;
          }else {
            $this.msgText = null;
            $this.cardType = null;
            alert("请填写正确的卡号");
          }
        })
      },
      setInput(){
        this.input = '6217001210024455220';
      }
    }
  }
</script>

