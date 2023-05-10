<template>
    <van-list
      v-model="list.loading"
      :finished="list.finished"
      :error.sync="list.error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell v-for="item in list.data" :key="item.id">
        <van-row>
          <!-- 菜品 -->
          {{ $t(entity.fields.goodId.name) }}：{{ item.goodId }} （{{status}}） <!-- <span class="right">{{ moneyDescribe }}: $50</span> -->
        </van-row>
        <van-row>
          <!-- 下单时间 -->
          {{ $t(entity.fields.startDate.name) }}：：{{ item.startDate }}
        </van-row>
        <van-row>
           <!-- 车牌 -->
          {{ $t(entity.fields.thaPlateNo.name) }}：：{{ item.thaPlateNo }}
        </van-row>
        <van-row>
           <!-- 货柜 -->
          {{ $t(entity.fields.thaContainerSerial.name) }}：：{{ item.thaContainerSerial }}
        </van-row>
        <van-row>
          <!-- 仓库 -->
          {{ $t(entity.fields.warehouseId.name) }}：：{{ item.warehouseId }}
        </van-row>
        <van-row>
          {{ $t(entity.fields.customerId.name) }}：{{ item.customerId }}  <!--  <span class="right">电话：15687079623</span> -->
        </van-row>
        <van-row>
          <van-button v-if="type === 'assign' && state == 2" class="right" type="primary" size="small">接受</van-button>
          <van-button v-if="type === 'assign' && state == 2" type="danger" size="small">拒绝</van-button>
          <van-button v-if="type === 'take' && type != 2" class="right" type="primary" size="small">确认接货</van-button>
          <van-button v-if="type === 'running' && type != 2" class="right" type="info" size="small">上传监控</van-button>
        </van-row>
      </van-cell>
  </van-list>
</template>

<script>
import { getEntity } from '@/api/entity'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    state: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      status: '等待接受',
      moneyDescribe: '预计收入',
      entity: null,
      list: {
        finished: false,
        data: [],
        error: false,
        loading: false
      }
    }
  },
  watch: {
    state () {
      this.fetchData()
    }
  },
  created () {
    this.init()
    this.entity = getEntity('Order')
    this.fetchData()
  },
  methods: {
    init () {
      if (this.type === 'assign') {
        this.status = '等待接受'
        this.moneyDescribe = '预计收入'
      }
      if (this.type === 'take') {
        this.status = '发货中'
        this.moneyDescribe = '预计收入'
      }
      if (this.type === 'running') {
        this.status = '运输中'
        this.moneyDescribe = '预计收入'
      }
      if (this.type === 'finish') {
        this.status = '已完成'
        this.moneyDescribe = '实际收入'
      }
    },
    onLoad () {
      console.log('onload')
      this.list.loading = false
    },
    fetchData () {
      this.entity.method.mine({state: this.state}).then(res => {
        if (res.data) {
          this.list.data = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.van-list {
  height: 100%;
  overflow: auto;
  background-color: rgba(237,237,237,1);
  padding: 2vw;
  .van-cell {
    background-color: white;
    font-size: 0.625rem;
    margin-bottom: 2vw;
    border-radius: 8px;
    >>>.van-cell__value{
      color: #666666;
    }
    button {
      border-radius: 50px;
    }

  }
}

.right {
  float: right;
}
</style>
