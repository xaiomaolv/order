<template>
  <van-cell
    :title="i18n.t(entity.fields.orderNo.name) + ':' + data.orderNo"
    :value="data.goods"
    @click="$emit('detail',data)"
  >
  <template slot="label">
    <van-row>{{ $t(entity.fields.startDate.name) + ': ' + data.startDate }}</van-row>
    <!-- <van-row>{{ $t(entity.fields.startDate.name) +' ~' + $t(entity.fields.endDate.name) + ': ' +  data.startDate + '~' + data.endDate }} </van-row> -->
    <!-- <van-row>{{ $t(entity.fields.startAddress.name) +' ~' + $t(entity.fields.endAddress.name) + ': ' + data.startAddress + '~' + data.endAddress }} </van-row> -->
  </template>
  </van-cell>
</template>

<script>
import i18n from '@/i18n/i18n'
export default {
  props: {
    entity: {},
    data: {}
  },
  data () {
    return {
      i18n: i18n, // 国际化
    }
  }
}
</script>
