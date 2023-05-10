<template>
  <van-cell
    :title="data.name"
    :value="data.amount"
    :label="data.occurDate + ' ' + data.remark"
    @click="$emit('detail',data)"
  />
</template>

<script>
export default {
  props: {
    data: {}
  },
  data () {
    return {
    }
  }
}
</script>
