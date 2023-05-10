<template>
  <div class="container">
    <van-nav-bar
      title="营业信息"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="mg-tp-10 main">
      <van-field label="营业状态" size="large" input-align="right" :readonly="true">
        <template #input>
          <van-col style="color:#C5C5C5" v-if="storeInfo.businessStatus == 1">正常营业</van-col>
          <van-col style="color:#C5C5C5" v-if="storeInfo.businessStatus == 2">暂不营业</van-col>
          <van-col style="color:#C5C5C5" v-if="storeInfo.businessStatus == 0">离线</van-col>
        </template>
      </van-field>
      <van-cell title="营业时间"  size="large" :value="storeInfo.businessTime"/>
      <van-field label="预约订位" size="large" input-align="right" :readonly="true">
        <template #input>
          <van-radio-group v-model="storeInfo.reserveFlag" direction="horizontal" disabled>
            <van-radio name="0" checked-color="#C83C3C">不支持</van-radio>
            <van-radio name="1" checked-color="#C83C3C">支持</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        size="large"
        v-if="storeInfo.reserveFlag==1"
        label="可逾期时长"
        input-align="right"
        :readonly="true"
      >
        <template #input>
           <span style="color:#C5C5C5" v-if="storeInfo.overdueTime !=''">{{storeInfo.overdueTime}}分钟</span>
        </template>
      </van-field>
      <van-field v-if="storeInfo.mealFee"
        size="large"
        label="餐位费"
        type="number"
        input-align="right"
        :readonly="true">
        <template #input>
           <span style="color:#C5C5C5">{{storeInfo.mealFee}} 元/位</span>
        </template>
      </van-field>
      <!-- <van-field
        size="large"
        v-if="storeInfo.reserveFlag==1"
        label="支持提前点餐"
        input-align="right"
        :readonly="true"
      >
        <template #input>
          <van-radio-group v-model="storeInfo.orderAhead" direction="horizontal" disabled>
            <van-radio name="0" checked-color="#C83C3C">否</van-radio>
            <van-radio name="1" checked-color="#C83C3C">是</van-radio>
          </van-radio-group>
        </template>
      </van-field> -->
      <!-- <van-field
        size="large"
        v-if="storeInfo.reserveFlag==1"
        label="是否设置定金"
        input-align="right"
        :readonly="true"
      >
        <template #input>
          <van-radio-group v-model="storeInfo.depositFlag" direction="horizontal" disabled>
            <van-radio name="0" checked-color="#C83C3C">否</van-radio>
            <van-radio name="1" checked-color="#C83C3C">是</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-cell
        v-if="storeInfo.depositFlag=='1' && storeInfo.reserveFlag==1"
        title="定金"
        :value="storeInfo.reserverDeposit+'元'"
      /> -->
    </van-row>
    <van-popup class="pd-tp-10" round v-model="show" position="bottom" :style="{ height: '80%' }">
      <van-cell class="ft-se-16" center title="营业状态" v-if="form.businessStatus =='1'"></van-cell>
      <van-radio-group class="pd-10" v-model="form.businessStatus" direction="horizontal" @change="changeStatus">
        <van-radio
          v-for="item in statusOption"
          :key="item.value"
          :name="item.value"
          checked-color="#C83C3C"
        >{{item.label}}</van-radio>
      </van-radio-group>

      <van-cell class="ft-se-16" center title="24小时营业" v-if="form.businessStatus =='1'">
        <template #right-icon>
          <van-switch v-model="checkedStatus" active-color="#C83C3C" size="24" @change="changeTime"/>
        </template>
      </van-cell>

      <van-cell class="ft-se-16" center title="自定义营业时间" v-if="form.businessStatus =='1' && checkedStatus == false"> </van-cell>
      <van-row v-if="form.businessStatus =='1' && checkedStatus == false">
        <van-col span="12" class="pd-10">
          <van-field
              v-model="startTime"
              is-link
              readonly
              name="datetimePicker"
              label=""
              placeholder="选择时间"
              @click="showStart = true"
          />
        </van-col>
        <van-col span="12" class="pd-10">
          <van-field
              v-model="endTime"
              is-link
              readonly
              name="datetimePicker"
              label=""
              placeholder="选择时间"
              @click="showEnd = true"
          />
        </van-col>
      </van-row>
      <van-field label="预约订位" size="large" input-align="right" v-if="form.businessStatus =='1'">
        <template #input>
          <van-radio-group v-model="form.reserveFlag" direction="horizontal">
            <van-radio name="0" checked-color="#C83C3C">不支持</van-radio>
            <van-radio name="1" checked-color="#C83C3C">支持</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <!-- <van-field label="支持提前点餐" size="large" input-align="right" v-if="form.reserveFlag=='1' && form.businessStatus =='1'">
        <template #input>
          <van-radio-group v-model="form.orderAhead" direction="horizontal">
            <van-radio name="0" checked-color="#C83C3C">否</van-radio>
            <van-radio name="1" checked-color="#C83C3C">是</van-radio>
          </van-radio-group>
        </template>
      </van-field> -->

      <!-- <van-field
        size="large"
        v-if="form.businessStatus =='1' && form.reserveFlag=='1'"
        label="是否设置定金"
        input-align="right"
      >
        <template #input>
          <van-radio-group v-model="form.depositFlag" direction="horizontal">
            <van-radio name="0" checked-color="#C83C3C">否</van-radio>
            <van-radio name="1" checked-color="#C83C3C">是</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field
        type="number"
        v-if="form.businessStatus =='1' && form.reserveFlag=='1' && form.depositFlag=='1'"
        label="定金"
        v-model="form.reserverDeposit"
        placeholder="设置金额"
      >
        <template #button>元</template>
      </van-field> -->

      <van-field
        size="large"
        v-if="form.reserveFlag=='1' && form.businessStatus =='1'"
        label="可逾期时长"
        @click="ifChange"
        v-model="form.overdueTime"
        placeholder="请选择可逾期时长"
        readonly
      >
        <template #button>分钟</template>
      </van-field>

      <van-field
        v-if="form.businessStatus =='1'"
        size="large"
        label="餐位费"
        type="number"
        v-model.number="form.mealFee"
        placeholder="请输入餐位费"
      >
        <template #button>元 / 位</template>
      </van-field>

      <van-row class="mg-tp-30 pd-20 tx-ct">
        <van-button style="width:90%;" round color="#C83C3C" @click="saveChange">保存修改</van-button>
      </van-row>
    </van-popup>

    <van-popup v-model="dialog" position="bottom">
      <van-picker
        title="逾期时长"
        show-toolbar
        :columns="timeData"
        @confirm="onConfirm"
        @cancel="dialog = false"
      />
    </van-popup>

    <van-row class="bottom-btn">
      <van-button
        round
        v-if="disabled == true"
        style="width:90%;"
        color="#C83C3C"
        class="loginOut"
        @click="editPopup"
      >修改</van-button>
    </van-row>
    <van-popup v-model:show="showStart" position="bottom">
      <van-datetime-picker
        v-model="startTime"
        type="time"
        :formatter="formatterTime"
        @confirm="onConfirmStart"
        @cancel="cancelStart"
      />
    </van-popup>
    <van-popup v-model:show="showEnd" position="bottom">
      <van-datetime-picker
        v-model="endTime"
        type="time"
        :formatter="formatterTime"
        @confirm="onConfirmEnd"
        @cancel="cancelEnd"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserInfo, updateBussiness } from "@/api/sys.js";
import { Notify } from 'vant';
export default {
  data() {
    return {
      storeInfo: {},
      form: {
        reserveFlag: "0",
        depositFlag: "0",
        orderAhead:'0',
      },
      formOld: {},
      showStart:false,
      showEnd:false,
      disabled: true,
      show: false,
      dialog: false,
      checkedStatus: false,
      workStatus: "暂不营业", //营业、打烊或暂不营业
      businessHours: "8:30 - 22:00",
      reserveFlag: "",
      timeOut: "",
      timeData: ["30", "45", "60", "75", "90", "105", "120","无限期"],
      startTime: "",
      endTime: "",
      statusOption: [
        {
          value: "1",
          label: "正常营业"
        },
        {
          value: "2",
          label: "暂不营业"
        },
        {
          value: "0",
          label: "离线"
        }
      ],
      showPicker: false,
      hidden: false
    };
  },
  created() {
    this.getBussinessInfo()
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
    onClickLeft() {
      this.$router.go(-1);
    },
    getBussinessInfo() {
      getUserInfo().then(res => {
        this.storeInfo = res.data;
        this.formOld = JSON.stringify(res.data)
      });
    },
    editPopup() {
      this.form = this.storeInfo;
      // this.form.depositFlag = "0"
      if (this.form.timeflag == "1") {
        this.checkedStatus = true
      }else{
        this.checkedStatus = false
        this.startTime = this.storeInfo.startTime
        this.endTime = this.storeInfo.endTime
      }
      this.show = true;
    },
    // 营业状态改变
    changeStatus(val){
      if (val == '1') {
        this.checkedStatus = true
        this.form.timeflag = "1"
      }
    },
    // 是否是24小时营业
    changeTime(checked){
      if (checked == true) {
        this.form.timeflag = "1"
      }else{
        this.form.timeflag = "0"
      }
    },
    // 是否支持提前点餐设置
    changeSupport(val){
      if (val == '1') {

        this.form.orderAhead = "0"
      }
    },
    saveChange() {
      if (this.checkedStatus == true) {
        this.form.businessTime = "24小时营业";
      } else {
        if (this.startTime && this.endTime) {
          this.form.businessTime = this.startTime + "-" + this.endTime;
          this.form.startTime = this.startTime
          this.form.endTime = this.endTime
        }else{
          Notify({ type: 'warning', message: '请选择自定义营业时间' });
          return
        }
      }
      if (this.form.reserveFlag == '1') {
        // if (!this.form.orderAhead) {
        //   Notify({ type: 'warning', message: '请选择是否支持提前点餐' });
        //   return
        // }
        // if (this.form.orderAhead == '1') {
        //   if (!this.form.depositFlag) {
        //     Notify({ type: 'warning', message: '请选择是否设置定金' });
        //     return
        //   }
        // }
        if (!this.form.overdueTime) {
          Notify({ type: 'warning', message: '请选择可逾期时长' });
          return
        }
      }
      // if (this.form.depositFlag == '1') {
      //   if (!this.form.reserverDeposit) {
      //     Notify({ type: 'warning', message: '请设置定金' });
      //     return
      //   }
      //   if (this.form.reserverDeposit <= 0) {
      //     Notify({ type: 'warning', message: '定金金额必须大于0' });
      //     return
      //   }
      // }
      if(JSON.stringify(this.form) !== this.formOld){
          // 是否重新审核标识  auditFlag  0-否，1-是
          this.form.auditFlag = "0"
          updateBussiness(this.form).then(res => {
            if (res.code == 200) {
              this.getBussinessInfo();
              this.$message({
                message: res.msg,
                type: "success"
              });
            }
          });
        }else{
          this.$message.warning("数据没有修改，请先修改数据再提交！")
        }
      this.show = false;
    },

    ifChange() {
      this.dialog = true;
    },

    onConfirm(value) {
      this.form.overdueTime = value;
      this.dialog = false;
    },

    onConfirmStart(val){
      this.startTime = val
      this.showStart = false
    },
    cancelStart(){
      this.showStart = false
    },
    onConfirmEnd(val){
      this.endTime = val
      this.showEnd = false
    },
    cancelEnd(){
      this.showEnd = false
    },
  }
};
</script>

<style scoped>
.cl-grow {
  color: #9ea5a9;
}
.main {
  margin-bottom: 40px;
}

.bottom-btn {
  position: fixed;
  bottom: 5px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
</style>
