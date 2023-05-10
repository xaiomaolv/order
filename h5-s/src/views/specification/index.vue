<template>
  <div class="container">
    <van-nav-bar
      title="管理规格"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="pd-10 main">
      <van-cell class="ft-se-16" center :title="item.formatName" v-for="(item,index) in dataList" :key="index">
        <template #right-icon>
          <!-- <van-button @click="blockOrStart(item)" size="mini" type="danger">
            <span v-if="item.status==0">停用</span>
            <span v-if="item.status==1">启用</span>
          </van-button>-->
          <van-button round size="mini" type="danger" class="mg-rt-5" @click="toDdelete(item)">删除</van-button>
          <van-button round size="mini" type="warning" @click="toEdit(item)">编辑</van-button>
        </template>
      </van-cell>

      <van-row v-if="dataList.length==0">
        <van-empty description="规格种类设置，如份量、辣度、加料等"/>
      </van-row>
    </van-row>

    <van-row class="bottom-btn">
      <van-button round style="width:90%;" color="#C83C3C" class="loginOut" @click="toAdd">+ 添加</van-button>
    </van-row>
  </div>
</template>

<script>
import {
  getSpecificList,
  addSpecific,
  updateSpecific,
  deleteSpecific
} from "@/api/specificaction.js";

export default {
  data() {
    return {
      // businessId: this.$store.state.sys.businessId,
      param: {},
      dataList: []
    };
  },

  created() {
    this.getDataList();
  },

  methods: {
    getDataList() {
      let param = {
        // businessId: this.businessId
      };
      getSpecificList(param).then(res => {
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
        path: "/specificAdd",
        query: { param: JSON.stringify(param) }
      });
    },
    //修改分类
    toEdit(item) {
      let param = item;
      param.type = "edit";
      this.$router.push({
        path: "/specificAdd",
        query: {
          param: JSON.stringify(item)
        }
      });
    },

    //删除规格
    toDdelete(item) {
      deleteSpecific(item.formatId).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "分类修改成功！",
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
  top: 50px;
  height: 85%;
  position: relative;
  overflow: auto;
}
.bottom-btn {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
}
</style>
