<template>
    <div class="main-container">
      <app-main ref="main" />
    </div>
</template>

<script>
import { AppMain } from './components'

export default {
  name: 'Layout',
  components: {
    AppMain
  },
  data () {
    return {
      title: 'title',
      handlerText: 'handlerText'
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    onClickRight () {
      this.$refs.main.defaultHandler()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  height: 100vh;
  .app-main {
    // height: calc(100vh - 50px);
    height: 100vh;
  }
}
</style>
