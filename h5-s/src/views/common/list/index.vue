<template>
  <div>
    <van-search
      class='searchInput'
      v-model="params.keywords"
      show-action
      label=""
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <van-button class="search" @click="onSearch">搜索</van-button>
        <van-button class="add" @click="onAdd">添加</van-button>
      </template>
    </van-search>
    <van-list
      ref="list"
      v-model="list.loading"
      :finished="list.finished"
      finished-text="没有更多了"
      :error.sync="list.error"
      @load="onLoad"
    >
      <item
        v-for="(item,index) in list.data"
        :key="index"
        :data="item"
        :entity="entity"
        @detail="detail"
      />
    </van-list>
  </div>
</template>

<script>
import i18n from '@/i18n/i18n'
import { getEntity } from '@/api/entity'
import Vue from 'vue'

export default {
  data () {
    return {
      i18n: i18n, // 国际化
      entity: null,
      entityName: null,
      key: '',
      params: {
        currentPage: 1,
        pageSize: 20,
        keywords: ''
      },
      list: {
        finished: false,
        data: [],
        error: false,
        loading: false,
        // 解决vant list 加载bug
        pulling: false
      }
    }
  },
  created () {
    this.entityName = this.$route.meta.entity || this.$route.query.entity
    Vue.component('item', () => import('@/views/components/item/' + this.entityName))
    this.entity = getEntity(this.entityName)
    this.data = []
  },
  methods: {
    onSearch () {
      this.params.currentPage = 1
      this.list.data = []
      this.list.finished = false
      this.$refs.list.$emit('load')
    },
    onAdd () {
      this.$router.push({
        name: 'View',
        query: {
          entity: this.entityName,
          operation: 'add'
        }
      })
    },
    onLoad () {
      if (this.list.pulling) {
        return
      }
      this.list.pulling = true
      this.entity.method.list(this.params).then(res => {
        this.list.data = this.list.data.concat(res.data.records)
        this.list.loading = false
        this.list.pulling = false
        if (res.data.records.length < this.params.pageSize) {
          this.list.finished = true
          return
        }
        this.params.currentPage += 1
      })
    },
    detail (item) {
      this.$router.push({
        name: 'View',
        query: {
          id: item.id,
          entity: this.entityName,
          operation: 'view'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .van-list {
    height: calc(100vh - 116px);
    overflow-y: auto;
  }
  .van-search .van-cell {
    border: #F9565F 1px solid;
    color: #F9565F;
  }
  .search {
    background: #F9565F;
    color: white;
    height: 34px;
    border-radius: 55px;
  }
  .add {
    border: #F9565F 1px solid;
    color: #F9565F;
    height: 34px;
    border-radius: 55px;
  }
</style>
