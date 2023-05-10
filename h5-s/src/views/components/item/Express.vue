<template>
  <van-cell
    :title="data.plate"
    :value="data.goods + ' ' + data.income"
    @click="$emit('detail',data)"
  >
  <template slot="label">
    <van-row>{{ $t(entity.fields.startDate.name) +' ~' + $t(entity.fields.endDate.name) + ': ' +  data.startDate + '~' + data.endDate }} </van-row>
    <van-row>{{ $t(entity.fields.startAddress.name) +' ~' + $t(entity.fields.endAddress.name) + ': ' + data.startAddress + '~' + data.endAddress }} </van-row>
  </template>
  </van-cell>
</template>

<script>
export default {
  props: {
    entity: {},
    data: {}
  },
  data () {
    return {
    }
  }
}
</script>
