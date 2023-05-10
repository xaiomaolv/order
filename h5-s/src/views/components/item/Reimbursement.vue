<template>
  <van-cell
    :title="data.category"
    :value="data.amount"
    :label="data.submitDate"
    @click="$emit('detail',data)"
  >
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
