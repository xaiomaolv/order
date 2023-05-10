<template>
  <van-cell
    :title="data.name"
    :value="data.amount"
    :label="data.occurDate"
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
