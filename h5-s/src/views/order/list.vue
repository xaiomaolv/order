<template>
  <div class="container">
    <van-nav-bar
      title="订单列表"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="bg-w van-content">
      <van-row class="mg-tp-10 ft-16">
        <van-tabs :v-model:active="active" sticky @click="onClickTab">
          <van-tab class="ft-se-16" :badge="toOrderNum">
            <van-dropdown-menu :close-on-click-outside="false">
              <van-dropdown-item ref="dataOrder">
                <template slot="title">
                  <van-icon name="search" />筛选
                </template>
                <van-row>
                  <div class="flex-col">
                    <div class="flex-col-6 mg-lt-10">开始时间：</div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startDate"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择日期"
                        @click="startDateTable"
                      />
                    </div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startPickerTime"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择时间"
                        @click="startTimeTable"
                      />
                    </div>
                  </div>
                  <div class="flex-col">
                    <div class="flex-col-6 mg-lt-10">结束时间：</div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="endDate"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择日期"
                        @click="endDateTable"
                      />
                    </div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startPickerTimes"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择时间"
                        @click="endTimeTable"
                      />
                    </div>
                  </div>
                  <span class="mg-lt-10">订单状态：</span>
                  <div class="flex-col mg-tp-10 mg-bt-10">
                    <div class="" v-for="(item, index) in option1" :key="index">
                      <van-button
                        class="mg-lt-10"
                        style="padding: 10px"
                        round
                        type="default"
                        size="small"
                        :color="activeTable === item.value ? '#C83C3C' : ''"
                        @click="toSelectTable(item)"
                        >{{ item.text }}</van-button
                      >
                    </div>
                  </div>
                  <div style="padding: 5px 16px">
                    <div class="flex-col mg-tp-10 pd-bt-10">
                      <div class="flex-col-12">
                        <div class="pd-lr-10">
                          <van-button
                            color="#C83C3C"
                            size="normal"
                            custom-class="w-95"
                            block
                            round
                            @click="onResetDate"
                            >重置</van-button
                          >
                        </div>
                      </div>
                      <div class="flex-col-12">
                        <div class="pd-lr-10">
                          <van-button
                            color="#C83C3C"
                            size="normal"
                            custom-class="w-95"
                            block
                            round
                            @click="onConfirmDate"
                          >
                            确认
                          </van-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </van-row>
              </van-dropdown-item>
            </van-dropdown-menu>
            <template slot="title">
              桌码订单
              <!-- <div v-if="toOrderNum > 0" class="divright">{{ toOrderNum }}</div> -->
            </template>
            <van-row class="pd-10">
              <van-row v-if="orderList.length == 0">
                <van-empty description="暂无数据" />
              </van-row>
              <template v-else>
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="- 没有更多了 -"
                  @load="onLoad"
                  :offset="130"
                >
                  <van-row
                    class="mg-bt-10 bx-sd bg-w pd-10 bd-rd card"
                    v-for="(order, index) in orderList"
                    :key="index"
                  >
                    <van-cell @click="checkOrder(order)">
                      <!-- 使用 title 插槽来自定义标题 -->
                      <template #title>
                        <span class="custom-title ft-se-16"
                          >桌号：{{ order.tableName }}</span
                        >
                        <van-tag
                          v-if="order.orderStatus == 0"
                          round
                          type="danger"
                          style="float: right; padding: 4px"
                          @click="checkOrder(order)"
                          >待处理</van-tag
                        >
                        <van-tag
                          v-if="order.orderStatus == '1'"
                          round
                          type="primary"
                          style="float: right; padding: 4px"
                          @click="checkOrder(order)"
                          >上菜中</van-tag
                        >
                        <van-tag
                          v-if="order.orderStatus == '2'"
                          round
                          type="warning"
                          style="float: right; padding: 4px"
                          @click="checkOrder(order)"
                          >待付款</van-tag
                        >
                        <van-tag
                          v-if="order.orderStatus == 50"
                          round
                          type="success"
                          style="float: right; padding: 4px"
                          @click="checkOrder(order)"
                          >已完成</van-tag
                        >
                      </template>

                      <template #label>
                        <van-cell-group>
                          <van-field
                            size="large"
                            label="订单号"
                            input-align="right"
                            colon
                            :value="order.orderNo"
                            readonly
                          />
                          <van-field
                            size="large"
                            label="下单时间"
                            input-align="right"
                            colon
                            :value="order.orderTime"
                            readonly
                          />
                          <van-field
                            v-if="order.payTime"
                            size="large"
                            label="支付时间"
                            input-align="right"
                            colon
                            :value="order.payTime"
                            readonly
                          />
                          <van-field
                            size="large"
                            label="商品数量"
                            input-align="right"
                            colon
                            :value="order.productNum"
                            readonly
                          />
                          <van-field
                            size="large"
                            label="合计"
                            input-align="right"
                            colon
                            :value="'￥' + order.orderAmountTotal"
                            readonly
                          />
                        </van-cell-group>
                      </template>
                    </van-cell>
                  </van-row>
                </van-list>
              </template>
            </van-row>
          </van-tab>
          <!-- 预约 -->
          <van-tab
            class="ft-se-16"
            style="font-size: 16px"
            :badge="reservationNum"
          >
            <van-dropdown-menu :close-on-click-outside="false">
              <van-dropdown-item ref="dataOrderR">
                <template slot="title">
                  <van-icon name="search" />筛选
                </template>
                <van-row>
                  <div class="flex-col">
                    <div class="flex-col-6 mg-lt-10">开始时间：</div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startDateR"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择日期"
                        @click="startDateRese"
                      />
                    </div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startPickerTimeR"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择时间"
                        @click="startTimeRese"
                      />
                    </div>
                  </div>
                  <div class="flex-col">
                    <div class="flex-col-6 mg-lt-10">结束时间：</div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="endDateR"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择日期"
                        @click="endDateRese"
                      />
                    </div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startPickerTimesR"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择时间"
                        @click="endTimeRese"
                      />
                    </div>
                  </div>
                  <span class="mg-lt-10">订单状态：</span>
                  <div class="flex-col mg-tp-10 mg-bt-10">
                    <div class="" v-for="(item, index) in option2" :key="index">
                      <van-button
                        class="mg-lt-10"
                        style="padding: 10px"
                        round
                        type="default"
                        size="small"
                        :color="activeRese === item.value ? '#C83C3C' : ''"
                        @click="toSelectRese(item)"
                        >{{ item.text }}</van-button
                      >
                    </div>
                  </div>
                  <div style="padding: 5px 16px">
                    <div class="flex-col mg-tp-10 pd-bt-10">
                      <div class="flex-col-12">
                        <div class="pd-lr-10">
                          <van-button
                            color="#C83C3C"
                            size="normal"
                            custom-class="w-95"
                            block
                            round
                            @click="onResetDateR"
                            >重置</van-button
                          >
                        </div>
                      </div>
                      <div class="flex-col-12">
                        <div class="pd-lr-10">
                          <van-button
                            color="#C83C3C"
                            size="normal"
                            custom-class="w-95"
                            block
                            round
                            @click="onConfirmDateR"
                          >
                            确认
                          </van-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </van-row>
              </van-dropdown-item>
            </van-dropdown-menu>
            <template slot="title">
              预约订单
              <!-- <div v-if="reservationNum > 0" class="divright">
                {{ reservationNum }}
              </div> -->
            </template>
            <van-row class="pd-10">
              <van-row v-if="reservationList.length == 0">
                <van-empty description="暂无数据" />
              </van-row>
              <van-list
                v-else
                v-model="rseLoading"
                :finished="reseFinished"
                finished-text="- 没有更多了 -"
                @load="onLoadRese"
                :offset="130"
              >
                <van-row
                  class="mg-bt-10 bx-sd pd-10 bd-rd bg-w card"
                  v-for="(info, index) in reservationList"
                  :key="index"
                >
                  <van-cell @click="openReservation(info)">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title ft-se-16"
                        >到店时间: {{ info.mealTime }}</span
                      >
                      <van-tag
                        v-if="info.reserveStatus == 0"
                        round
                        type="danger"
                        style="float: right; padding: 4px"
                        @click="openReservation(info)"
                        >待处理</van-tag
                      >
                      <van-tag
                        v-if="info.reserveStatus == 1"
                        round
                        type="success"
                        style="float: right; padding: 4px"
                        @click="openReservation(info)"
                        >已确认</van-tag
                      >
                      <van-tag
                        v-if="info.reserveStatus == 2"
                        round
                        color="#9B9B9B"
                        style="float: right; padding: 4px"
                        @click="openReservation(info)"
                        >已取消</van-tag
                      >
                    </template>

                    <template #label>
                      <van-cell-group>
                        <van-field
                          size="large"
                          label="预约人"
                          input-align="right"
                          colon
                          :value="info.reserveName"
                          readonly
                        />
                        <van-field
                          size="large"
                          label="联系电话"
                          input-align="right"
                          colon
                          :value="info.userPhone"
                          readonly
                        />
                        <van-field
                          size="large"
                          label="用餐人数"
                          input-align="right"
                          colon
                          :value="info.mealPerson + '人'"
                          readonly
                        />
                        <!-- <van-field
                      size="large"
                      label="是否点餐"
                      input-align="right"
                      colon
                      :value="info.orderType == '1' ? '是' : '否'"
                      readonly
                    /> -->
                      </van-cell-group>
                    </template>
                  </van-cell>
                </van-row>
              </van-list>
            </van-row>
          </van-tab>
          <!-- 送餐 -->
          <van-tab
            class="ft-se-16"
            style="font-size: 16px"
            :badge="homeDeliveryNum"
          >
            <van-dropdown-menu :close-on-click-outside="false">
              <van-dropdown-item ref="dataOrderD">
                <template slot="title">
                  <van-icon name="search" />筛选
                </template>
                <van-row>
                  <div class="flex-col">
                    <div class="flex-col-6 mg-lt-10">开始时间：</div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startDateD"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择日期"
                        @click="startDateDely"
                      />
                    </div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startPickerTimeD"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择时间"
                        @click="startTimeDely"
                      />
                    </div>
                  </div>
                  <div class="flex-col">
                    <div class="flex-col-6 mg-lt-10">结束时间：</div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="endDateD"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择日期"
                        @click="endDateDely"
                      />
                    </div>
                    <div class="flex-col-10">
                      <van-field
                        v-model="startPickerTimesD"
                        is-link
                        readonly
                        name="datePicker"
                        label=""
                        placeholder="选择时间"
                        @click="endTimeDely"
                      />
                    </div>
                  </div>
                  <span class="mg-lt-10">订单状态：</span>
                  <div class="flex-col mg-tp-10 mg-bt-10">
                    <div class="" v-for="(item, index) in option3" :key="index">
                      <van-button
                        class="mg-lt-10"
                        style="padding: 10px"
                        round
                        type="default"
                        size="small"
                        :color="activeDely === item.value ? '#C83C3C' : ''"
                        @click="toSelectDely(item)"
                        >{{ item.text }}</van-button
                      >
                    </div>
                  </div>
                  <div style="padding: 5px 16px">
                    <div class="flex-col mg-tp-10 pd-bt-10">
                      <div class="flex-col-12">
                        <div class="pd-lr-10">
                          <van-button
                            color="#C83C3C"
                            size="normal"
                            custom-class="w-95"
                            block
                            round
                            @click="onResetDateD"
                            >重置</van-button
                          >
                        </div>
                      </div>
                      <div class="flex-col-12">
                        <div class="pd-lr-10">
                          <van-button
                            color="#C83C3C"
                            size="normal"
                            custom-class="w-95"
                            block
                            round
                            @click="onConfirmDateD"
                          >
                            确认
                          </van-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </van-row>
              </van-dropdown-item>
            </van-dropdown-menu>
            <template slot="title">
              送餐订单
              <!-- <div v-if="homeDeliveryNum > 0" class="divright">
                {{ homeDeliveryNum }}
              </div> -->
            </template>
            <van-row class="pd-10">
              <van-row v-if="homeDeliveryList.length == 0">
                <van-empty description="暂无数据" />
              </van-row>
              <van-list
                v-else
                v-model="DelyLoading"
                :finished="DelyFinished"
                finished-text="- 没有更多了 -"
                @load="onLoadDely"
                :offset="130"
              >
                <van-row
                  class="mg-bt-10 bx-sd pd-10 bd-rd bg-w card"
                  v-for="(homeDy, index) in homeDeliveryList"
                  :key="index"
                >
                  <van-cell @click="openHomeDelivery(homeDy)">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title ft-se-16">外送订单</span>
                      <van-tag
                        v-if="
                          homeDy.orderStatus == '0' ||
                          homeDy.orderStatus == '1' ||
                          homeDy.orderStatus == '2'
                        "
                        round
                        type="danger"
                        style="float: right; padding: 4px"
                        @click="openHomeDelivery(homeDy)"
                        >待处理</van-tag
                      >
                      <van-tag
                        v-if="homeDy.orderStatus == '50'"
                        round
                        type="success"
                        style="float: right; padding: 4px"
                        @click="openHomeDelivery(homeDy)"
                        >已完成</van-tag
                      >
                    </template>

                    <template #label>
                      <van-cell-group>
                        <van-field
                          size="large"
                          label="订单号"
                          input-align="right"
                          colon
                          :value="homeDy.orderNo"
                          readonly
                        />
                        <van-field
                          size="large"
                          label="下单时间"
                          input-align="right"
                          colon
                          :value="homeDy.orderTime"
                          readonly
                        />
                        <van-field
                          v-if="homeDy.payTime"
                          size="large"
                          label="支付时间"
                          input-align="right"
                          colon
                          :value="homeDy.payTime"
                          readonly
                        />
                        <van-field
                          size="large"
                          label="商品数量"
                          input-align="right"
                          colon
                          :value="homeDy.productNum"
                          readonly
                        />
                        <van-field
                          size="large"
                          label="合计"
                          input-align="right"
                          colon
                          :value="'￥' + homeDy.orderAmountTotal"
                          readonly
                        />
                      </van-cell-group>
                    </template>
                  </van-cell>
                </van-row>
              </van-list>
            </van-row>
          </van-tab>
        </van-tabs>
      </van-row>
    </van-row>
    <!-- 桌码 -->
    <date-pick :dataPicker="startDateC" :showPickerDate="showPickerDate" v-on:onConfirmDate="onConfirmData" v-on:showPickerDateCancel="showPickerDateCancel" v-on:clickOverlay="clickOverlay"></date-pick>
    <date-pick :dataPicker="endDateC" :showPickerDate="showPickerDates" v-on:onConfirmDate="onConfirmDatas" v-on:showPickerDateCancel="showPickerDateCancels" v-on:clickOverlay="clickOverlays"></date-pick>
    <time-pick :pickerTime="startPickerTime" :showPickerTime="showPickerDateTime" v-on:onConfirmTime="onConfirmTime" v-on:showPickerTimeCancel="showPickerTimeCancel" v-on:clickTimeOverlay="clickTimeOverlay"></time-pick>
    <time-pick :pickerTime="startPickerTimes" :showPickerTime="showPickerDateTimes" v-on:onConfirmTime="onConfirmTimes" v-on:showPickerTimeCancel="showPickerTimeCancels" v-on:clickTimeOverlay="clickTimeOverlays"></time-pick>
    <!-- 预约 -->
    <date-pick :dataPicker="startDateR" :showPickerDate="showPickerDateR" v-on:onConfirmDate="onConfirmDataR" v-on:showPickerDateCancel="showPickerDateCancelR" v-on:clickOverlay="clickOverlayR"></date-pick>
    <date-pick :dataPicker="endDateR" :showPickerDate="showPickerDatesR" v-on:onConfirmDate="onConfirmDatasR" v-on:showPickerDateCancel="showPickerDateCancelsR" v-on:clickOverlay="clickOverlaysR"></date-pick>
    <time-pick :pickerTime="startPickerTimeR" :showPickerTime="showPickerDateTimeR" v-on:onConfirmTime="onConfirmTimeR" v-on:showPickerTimeCancel="showPickerTimeCancelR" v-on:clickTimeOverlay="clickTimeOverlayR"></time-pick>
    <time-pick :pickerTime="startPickerTimesR" :showPickerTime="showPickerDateTimesR" v-on:onConfirmTime="onConfirmTimesR" v-on:showPickerTimeCancel="showPickerTimeCancelsR" v-on:clickTimeOverlay="clickTimeOverlaysR"></time-pick>
    <!-- 外送 -->
    <date-pick :dataPicker="startDateD" :showPickerDate="showPickerDateD" v-on:onConfirmDate="onConfirmDataD" v-on:showPickerDateCancel="showPickerDateCancelD" v-on:clickOverlay="clickOverlayD"></date-pick>
    <date-pick :dataPicker="endDateD" :showPickerDate="showPickerDatesD" v-on:onConfirmDate="onConfirmDatasD" v-on:showPickerDateCancel="showPickerDateCancelsD" v-on:clickOverlay="clickOverlaysD"></date-pick>
    <time-pick :pickerTime="startPickerTimeD" :showPickerTime="showPickerDateTimeD" v-on:onConfirmTime="onConfirmTimeD" v-on:showPickerTimeCancel="showPickerTimeCancelD" v-on:clickTimeOverlay="clickTimeOverlayD"></time-pick>
    <time-pick :pickerTime="startPickerTimesD" :showPickerTime="showPickerDateTimesD" v-on:onConfirmTime="onConfirmTimesD" v-on:showPickerTimeCancel="showPickerTimeCancelsD" v-on:clickTimeOverlay="clickTimeOverlaysD"></time-pick>
  </div>
</template>

<script>
import DateClass from "@/utils/date.js";
import { getOrderList, getResverseList } from "@/api/order.js";
import datePick from "./components/datePick.vue";
import TimePick from "./components/timePick.vue";

export default {
  components: { datePick, TimePick },
  data() {
    return {
      active: 0,
      orderList: [],
      reservationList: [],
      finishOrder: [],
      todoOrder: [],
      // 送餐
      homeDeliveryList: [],

      toOrderNum: 0, //待处理
      reservationNum: 0, //待处理
      homeDeliveryNum: 0, //送餐待处理
      // 桌码订单分页
      loading: false, //加载状态
      finished: false, //是否加载
      table_total: 0, //加载页数
      table_page: 1, //加载页数
      table_PageSize: 10, //每页限制条数
      // 预约订单分页
      rseLoading: false, //加载状态
      reseFinished: false, //是否加载
      rese_total: 0, //加载页数
      rese_page: 1, //加载页数
      rese_PageSize: 10, //每页限制条数
      // 外送订单分页
      DelyLoading: false, //加载状态
      DelyFinished: false, //是否加载
      Dely_total: 0, //加载页数
      Dely_page: 1, //加载页数
      Dely_PageSize: 10, //每页限制条数
      statusOrder: "",
      statusOrderRese: "",
      statusOrderDely: "",

      minDate: new Date(2022, 0, 1),
      minDates: new Date(2022, 0, 1),
      maxDate: new Date(),
      maxDates: new Date(),
      showPickerDate: false,
      showPickerDates: false,
      showPickerDateTime: false,
      showPickerDateTimes: false,
      showPickerDateR: false,
      showPickerDatesR: false,
      showPickerDateTimeR: false,
      showPickerDateTimesR: false,
      showPickerDateD: false,
      showPickerDatesD: false,
      showPickerDateTimeD: false,
      showPickerDateTimesD: false,
      startTime: "",
      endTime: "",
      startDate: "",
      endDate: "",
      startDateC: new Date(),
      endDateC: new Date(),
      startPickerTime: "00:00",
      startPickerTimes: "00:00",
      startTimeR: "",
      endTimeR: "",
      startDateR: "",
      endDateR: "",
      startDateR: new Date(),
      endDateR: new Date(),
      startPickerTimeR: "00:00",
      startPickerTimesR: "00:00",
      startTimeD: "",
      endTimeD: "",
      startDateD: new Date(),
      endDateD: new Date(),
      startPickerTimeD: "00:00",
      startPickerTimesD: "00:00",
      option1: [
        { text: "全部 ", value: "" },
        { text: "待处理", value: 0 },
        { text: "上菜中", value: 1 },
        { text: "待付款", value: 2 },
        { text: "已完成", value: 50 },
      ],
      option2: [
        { text: "全部", value: "" },
        { text: "待处理", value: 0 },
        { text: "已确认", value: 1 },
        { text: "已取消", value: 2 },
      ],
      option3: [
        { text: "全部", value: "" },
        { text: "待处理", value: 0 },
        { text: "已完成", value: 50 },
      ],
      activeTable: "",
      activeRese: "",
      activeDely: "",
    };
  },
  computed: {},
  created() {
    this.getLoginInfo();
    // 待处理订单
    // this.getTodoOrder();

    this.onLoad();
    this.onLoadRese();
    this.onLoadDely();
  },

  methods: {
    getLoginInfo() {
      this.$store
        .dispatch("sys/GetInfo")
        .then((res) => {
          if (res.code == 200) {
            this.toOrderNum = res.data.orderCount;
            this.reservationNum = res.data.resverseCount;
            this.homeDeliveryNum = res.data.deliveryCount;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // tab切换
    onClickTab(index) {
      if (index == 0) {
        this.resetT();
        this.onLoad();
      } else if (index == 1) {
        this.resetR();
        this.onLoadRese();
      } else {
        this.resetD();
        this.onLoadDely();
      }
    },
    // 桌码订单列表加载
    onLoad() {
      let params = {
        pageNum: this.table_page,
        pageSize: this.table_PageSize,
        orderStatus: this.statusOrder,
        startTime: this.startTime,
        endTime: this.endTime,
        orderType: 0,
      };
      // 请求数据
      getOrderList(params).then((res) => {
        if (res.code == 200) {
          this.table_total = res.total;
          if (this.table_total <= this.table_PageSize) {
            this.orderList = res.rows;
          } else {
            this.table_page++;
            let arr = res.rows;
            this.orderList = this.orderList.concat(arr);
            this.finished = false;
          }
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (this.orderList.length >= this.table_total) {
            this.finishedText = "没有更多了";
            this.finished = true;
          }
        }
      });
    },
    // 获取预约订单
    onLoadRese() {
      let params = {
        pageNum: this.rese_page,
        pageSize: this.rese_PageSize,
        reserveStatus: this.statusOrderRese,
        startTime: this.startTimeR,
        endTime: this.endTimeR,
      };
      // 请求数据
      getResverseList(params).then((res) => {
        if (res.code == 200) {
          this.rese_total = res.total;
          if (this.rese_total <= this.rese_PageSize) {
            this.reservationList = res.rows;
          } else {
            this.rese_page++;
            let arr = res.rows;
            this.reservationList = this.reservationList.concat(arr);
            this.reseFinished = false;
          }
          // 加载状态结束
          this.rseLoading = false;
          // 数据全部加载完成
          if (this.reservationList.length >= this.rese_total) {
            this.finishedText = "没有更多了";
            this.reseFinished = true;
          }
        }
      });
    },
    // 外送订单
    onLoadDely() {
      let params = {
        // orderStatus: "0,1,2",
        orderType: 2,
        pageNum: this.Dely_page,
        pageSize: this.Dely_PageSize,
        orderStatus: this.statusOrderDely,
        startTime: this.startTimeD,
        endTime: this.endTimeD,
      };
      // 请求数据
      getOrderList(params).then((res) => {
        if (res.code == 200) {
          this.Dely_total = res.total;
          if (this.Dely_total <= this.Dely_PageSize) {
            this.homeDeliveryList = res.rows;
          } else {
            this.Dely_page++;
            let arr = res.rows;
            this.homeDeliveryList = this.homeDeliveryList.concat(arr);
            this.DelyFinished = false;
          }
          // 加载状态结束
          this.DelyLoading = false;
          // 数据全部加载完成
          if (this.homeDeliveryList.length >= this.Dely_total) {
            this.finishedText = "没有更多了";
            this.DelyFinished = true;
          }
        }
      });
    },

    // 待处理订单
    getTodoOrder() {
      let param = {
        orderStatus: "0,1,2",
      };
      getOrderList(param).then((res) => {
        this.todoOrder = res.rows;
      });
    },
    checkOrder(item) {
      if (item.orderType == "2") {
        this.$router.push({ path: "/homeDyTwo?orderId=" + item.orderId });
      } else {
        this.$router.push({ path: "/orderDetailTwo?orderId=" + item.orderId });
      }
    },
    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push({ path: "/index" });
    },

    openReservation(item) {
      if (item.orderType == "1") {
        this.$router.push({ path: "/appointmentTwo?orderId=" + item.orderId });
      } else {
        this.$router.push({
          path: "/appointmentTwo?reserveId=" + item.reserveId,
        });
      }
      // this.$router.push({ path: "/appointmentTwo", query: { appointment: JSON.stringify(item) } });
    },
    // 送餐调整详情
    openHomeDelivery(item) {
      this.$router.push({ path: "/homeDyTwo?orderId=" + item.orderId });
    },

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
    formatterTime(type, option) {
      if (type === "hour") {
        option += "时";
      }
      if (type === "minute") {
        option += "分";
      }
      return option;
    },
    formatters(time) {
      let nowdata = time == null ? new Date() : new Date(time);
      let year = nowdata.getFullYear();
      let month = nowdata.getMonth() + 1;
      let date = nowdata.getDate();
      let nowtime = year + "-";
      if (month < 10) {
        nowtime += "0";
      }
      nowtime += month + "-";
      if (date < 10) {
        nowtime += "0";
      }
      nowtime += date;

      return nowtime;
    },
    // 桌码选择开始日期
    startDateTable() {
      this.showPickerDate = true;
    },
    onConfirmData(time) {
      this.startDate = this.formatters(time);
      this.showPickerDate = false;
    },
    showPickerDateCancel() {
      this.showPickerDate = false;
    },
    clickOverlay() {
      this.showPickerDate = false;
    },
    startTimeTable() {
      this.showPickerDateTime = true;
    },
    onConfirmTime(time) {
      this.startPickerTime = time;
      this.showPickerDateTime = false;
    },
    showPickerTimeCancel() {
      this.showPickerDateTime = false;
    },
    clickTimeOverlay(){
      this.showPickerDateTime = false;
    },
    // 桌码结束
    endDateTable() {
      this.showPickerDates = true;
    },
    onConfirmDatas(time) {
      this.endDate = this.formatters(time);
      this.showPickerDates = false;
    },
    showPickerDateCancels() {
      this.showPickerDates = false;
    },
    clickOverlays() {
      this.showPickerDates = false;
    },
    endTimeTable() {
      this.showPickerDateTimes = true;
    },
    onConfirmTimes(time) {
      this.startPickerTimes = time;
      this.showPickerDateTimes = false;
    },
    showPickerTimeCancels() {
      this.showPickerDateTimes = false;
    },
    clickTimeOverlays(){
      this.showPickerDateTimes = false;
    },
    // 预约
    startDateRese() {
      this.showPickerDateR = true;
    },
    onConfirmDataR(time) {
      this.startDateR = this.formatters(time);
      this.showPickerDateR = false;
    },
    showPickerDateCancelR() {
      this.showPickerDateR = false;
    },
    clickOverlayR() {
      this.showPickerDateR = false;
    },
    endDateRese() {
      this.showPickerDatesR = true;
    },
    showPickerDateCancelsR() {
      this.showPickerDatesR = false;
    },
    clickOverlaysR() {
      this.showPickerDatesR = false;
    },
    startTimeRese() {
      this.showPickerDateTimeR = true;
    },
    showPickerTimeCancelR() {
      this.showPickerDateTimeR = false;
    },
    clickTimeOverlayR(){
      this.showPickerDateTimeR = false;
    },
    endTimeRese() {
      this.showPickerDateTimesR = true;
    },
    showPickerTimeCancelsR() {
      this.showPickerDateTimesR = false;
    },
    clickTimeOverlaysR(){
      this.showPickerDateTimesR = false;
    },
    onConfirmDatasR(time) {
      this.endDateR = this.formatters(time);
      this.showPickerDatesR = false;
    },
    onConfirmTimeR(time) {
      this.startPickerTimeR = time;
      this.showPickerDateTimeR = false;
    },
    onConfirmTimesR(time) {
      this.startPickerTimesR = time;
      this.showPickerDateTimesR = false;
    },
    //外送
    startDateDely() {
      this.showPickerDateD = true;
    },
    endDateDely() {
      this.showPickerDatesD = true;
    },
    onConfirmDataD(time) {
      this.startDateD = this.formatters(time);
      this.showPickerDateD = false;
    },
    onConfirmDatasD(time) {
      this.endDateD = this.formatters(time);
      this.showPickerDatesD = false;
    },
    showPickerDateCancelD() {
      this.showPickerDateD = false;
    },
    clickOverlayD() {
      this.showPickerDateD = false;
    },
    showPickerDateCancelsD() {
      this.showPickerDateD = false;
    },
    clickOverlaysD() {
      this.showPickerDatesD = false;
    },
    startTimeDely() {
      this.showPickerDateTimeD = true;
    },
    endTimeDely() {
      this.showPickerDateTimesD = true;
    },
    onConfirmTimeD(time) {
      this.startPickerTimeD = time;
      this.showPickerDateTimeD = false;
    },
    onConfirmTimesD(time) {
      this.startPickerTimesD = time;
      this.showPickerDateTimesD = false;
    },
    showPickerTimeCancelD() {
      this.showPickerDateTimeD = false;
    },
    clickTimeOverlayD(){
      this.showPickerDateTimeD = false;
    },
    showPickerTimeCancelsD() {
      this.showPickerDateTimesD = false;
    },
    clickTimeOverlaysD(){
      this.showPickerDateTimesD = false;
    },
    // 桌码订单
    // 订单日期确认
    onConfirmDate() {
      this.orderList = [];
      this.table_page = 1;
      if (this.startDate) {
        this.startTime = this.startDate + " " + this.startPickerTime;
      }
      if (this.endDate) {
        this.endTime = this.endDate + " " + this.startPickerTimes;
      }
      this.onLoad();
      this.$refs.dataOrder.toggle();
    },
    // 订单日期重置
    onResetDate() {
      this.resetT();
      this.onLoad();
      this.$refs.dataOrder.toggle();
    },
    toSelectTable(item) {
      this.activeTable = item.value;
      this.statusOrder = item.value;
    },
    // 预约订单
    // 订单日期确认
    onConfirmDateR() {
      this.reservationList = [];
      this.rese_page = 1;
      if (this.startDateR) {
        this.startTimeR = this.startDateR + " " + this.startPickerTimeR;
      }
      if (this.endDateR) {
        this.endTimeR = this.endDateR + " " + this.startPickerTimesR;
      }
      this.onLoadRese();
      this.$refs.dataOrderR.toggle();
    },
    // 订单日期重置
    onResetDateR() {
      this.resetR();
      this.onLoadRese();
      this.$refs.dataOrderR.toggle();
    },
    toSelectRese(item) {
      this.activeRese = item.value;
      this.statusOrderRese = item.value;
    },
    // 外送订单
    // 订单日期确认
    onConfirmDateD() {
      this.homeDeliveryList = [];
      this.Dely_page = 1;
      if (this.startDateD) {
        this.startTimeD = this.startDateD + " " + this.startPickerTimeD;
      }
      if (this.endDateD) {
        this.endTimeD = this.endDateD + " " + this.startPickerTimesD;
      }
      this.onLoadDely();
      this.$refs.dataOrderD.toggle();
    },
    // 订单日期重置
    onResetDateD() {
      this.resetD();
      this.onLoadDely();
      this.$refs.dataOrderD.toggle();
    },
    toSelectDely(item) {
      this.activeDely = item.value;
      if (item.value == 0) {
        this.statusOrderDely = "0,1,2";
      } else {
        this.statusOrderDely = item.value;
      }
    },
    // 桌码/外送订单状态
    changeStatusOrder(val) {
      this.orderList = [];
      this.statusOrder = val;
      this.table_page = 1;
      this.onLoad();
    },
    // 预约订单状态
    changeStatusOrderRese(val) {
      this.reservationList = [];
      this.statusOrderRese = val;
      this.rese_page = 1;
      this.onLoadRese();
    },
    // 外送订单状态
    changeStatusOrderDely(val) {
      this.homeDeliveryList = [];
      this.statusOrderDely = val;
      this.Dely_page = 1;
      this.onLoadDely();
    },
    resetT() {
      this.orderList = [];
      this.startTime = "";
      this.endTime = "";
      this.startDate = "";
      this.endDate = "";
      this.startPickerTime = "00:00";
      this.startPickerTimes = "00:00";
      this.statusOrder = "";
      this.activeTable = "";
      this.table_page = 1;
    },
    resetR() {
      this.reservationList = [];
      this.startTimeR = "";
      this.endTimeR = "";
      this.startDateR = "";
      this.endDateR = "";
      this.startPickerTimeR = "00:00";
      this.startPickerTimesR = "00:00";
      this.statusOrderRese = "";
      this.activeRese = "";
      this.rese_page = 1;
    },
    resetD() {
      this.homeDeliveryList = [];
      this.startTimeD = "";
      this.endTimeD = "";
      this.startDateD = "";
      this.endDateD = "";
      this.startPickerTimeD = "00:00";
      this.startPickerTimesD = "00:00";
      this.statusOrderDely = "";
      this.activeDely = "";
      this.Dely_page = 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  font-size: 0.875rem;
  position: relative;
  overflow: auto;
}
.van-content {
  margin-bottom: 40px;
}
.ft-16 ::v-deep .van-tab {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 4px;
  color: #646566;
  font-size: 1rem;
  line-height: 20px;
  cursor: pointer;
}
.divright {
  position: absolute;
  color: white;
  font-size: 10px;
  background-color: red;
  width: 20px;
  height: 20px;
  line-height: 20px;
  left: 75%;
  top: 0px;
  text-align: center;
  // -webkit-border-radius: 24px;
  border-radius: 50%;
}
.card {
  box-shadow: 0 -5px 5px #f5f2f2, 2px 2px 2px #f5f2f2, 0 5px 5px #f5f2f2,
    2px 2px 2px #f5f2f2;
}
</style>
