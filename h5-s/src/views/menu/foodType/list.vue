<template>
  <div class="container">
    <van-nav-bar
      title="菜品分类"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="pd-10 main">
      <van-cell class="ft-se-16" center :title="item.categoryName" v-for="(item,index) in dataList" :key="index">
        <template #right-icon>
          <van-button round @click="blockOrStart(item)" size="mini" type="primary" style="margin-right: 10px">
            <span v-if="item.status==0">停用</span>
            <span v-if="item.status==1">启用</span>
          </van-button>

          <van-button round size="mini" type="danger" style="margin-right: 10px" @click="toDelete(item)">删除</van-button>
          <van-button round size="mini" type="warning" @click="toEdit(item)">编辑</van-button>
        </template>
      </van-cell>

      <van-row v-if="dataList.length==0">
        <van-empty description="设置小程序菜品导航栏。如可添加热菜、凉菜、套餐专区、今日推荐、小吃等。"/>
      </van-row>
    </van-row>

    <van-row class="bottom-btn mg-lt-10">
      <van-button
      round
        style="width:90%;"
        color="#C83C3C"
        class="loginOut"
        @click="toAdd"
      >+ 添加</van-button>
    </van-row>
  </div>
</template>

<script>
import { getTypelist, updateType, deleteType } from "@/api/menu.js";

export default {
  data() {
    return {
      info: {
        categoryId: 1,
        categoryName: "",
        businessesId: "",
        status: "",
        categorySort: 1,
        delFlag: 0
      },
      param: {},
      dataList: []
    };
  },

  created() {
    this.getDataList();
  },

  methods: {
    getDataList() {
      getTypelist().then(res => {
        this.dataList = res.data;
      });
    },

    //停用启用
    blockOrStart(item) {
      let status = item.status;
      this.param.categoryId = item.categoryId;
      if (status == 0) {
        this.param.status = 1;
      } else {
        this.param.status = 0;
      }
      updateType(this.param).then(res => {
        console.log(res);
        this.getDataList();
      });
    },

    onClickLeft() {
    //   this.$router.go(-1);
    this.$router.push("/index");
    },
    //添加分类
    toAdd() {
      let param = {
        type: "add"
      };
      this.$router.push({
        path: "/foodTypeAdd",
        query: { param: JSON.stringify(param) }
      });
    },
    //修改分类
    toEdit(item) {
      let param = item;
      param.type = "edit";
      this.$router.push({
        path: "foodTypeAdd",
        query: {
          param: JSON.stringify(item)
        }
      });
    },
    //删除分类
    toDelete(item) {
      deleteType(item.categoryId).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "分类删除成功！",
            type: "success"
          });
          this.getDataList();
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
  overflow: scroll;
  position: relative;
  /* padding-top: 2.8125rem; */
  font-size: 0.875rem;
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
