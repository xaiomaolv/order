<template>
  <div class="container">
    <van-nav-bar
      title="桌码设置"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>
    <van-row v-if="dataList.length == 0">
      <van-empty description="暂无数据" />
    </van-row>

    <van-list
      v-else
      v-model="loading"
      :finished="finished"
      finished-text="- 没有更多了 -"
      @load="onLoad"
      :offset="130"
    >
      <van-row class="mg-10 main">
        <van-cell
          class="bx-sd ft-se-16"
          center
          :title="item.name"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <template #label>
            <van-row class="mg-tp-20">
              <van-row>
                <p style="color: red; font-size: 14px">
                  温馨提示:二维码已生成，请长按以下二维码保存到手机！
                </p>
              </van-row>
              <!-- <van-image width="200" :src="IMG_BASR_URL+item.qrcodeImage"/> -->
              <authImg
                style="width: 200px"
                :authSrc="IMG_BASR_URL + item.qrcodeImage"
              ></authImg>
            </van-row>
            <van-row class="tx-rt">
              <el-button @click="deleteTable(item)" type="text">
                <span style="color: red">删除</span>
              </el-button>

              <el-button type="text" @click="toEdit(item)">编辑</el-button>
            </van-row>
          </template>
        </van-cell>
      </van-row>
    </van-list>

    <van-row class="bottom-btn">
      <van-button
        round
        style="width: 90%"
        color="#C83C3C"
        class="loginOut"
        @click="toAdd"
        >+ 添加</van-button
      >
    </van-row>
  </div>
</template>

<script>
import { Dialog, Notify } from "vant";
import {
  getTableList,
  getTableById,
  deleteTable,
  updateTble,
  addTableInfo,
} from "@/api/menu.js";
import authImg from "../../components/authImg.vue";
export default {
  components: { authImg },
  data() {
    return {
      formData: {},
      loading: false,
      hidden: true,
      codeUrl: "",
      dataList: [],
      loading: false, //加载状态
      finished: false, //是否加载
      total: 0, //加载页数
      page: 1, //加载页数
      PageSize: 10, //每页限制条数
    };
  },

  created() {
    // this.getList();
    this.onLoad();
  },

  methods: {
    onLoad() {
      let params = {
        pageNum: this.page,
        pageSize: this.PageSize,
      };
      // 请求数据
      getTableList(params).then((res) => {
        if (res.code == 200) {
          this.total = res.total;
          if (this.total <= this.PageSize) {
            this.dataList = res.rows;
          } else {
            this.page++;
            let arr = res.rows;
            this.dataList = this.dataList.concat(arr);
            this.finished = false;
          }
          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (this.dataList.length >= this.total) {
            this.finished = true;
          }
        }
      });
    },
    onClickLeft() {
      //   this.$router.go(-1);
      // history.back()
      this.$router.push("/index");
    },

    //列表
    getList() {
      this.dataList = [];
      let param = {
        page: 1,
        pageSize: 999,
      };
      getTableList(param).then((res) => {
        this.dataList = res.rows;
      });
    },

    //修改
    toAdd() {
      let param = {
        type: "add",
      };
      this.$router.push({
        path: "/tableAdd",
        query: { param: JSON.stringify(param) },
      });
    },

    //删除
    deleteTable(item) {
      Dialog.confirm({
        title: "",
        message: "确定删除该桌号信息吗？",
      })
        .then(() => {
          deleteTable(item.id).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                type: "warning",
              });
            }
          });
        })
        .catch(() => {
          // Notify({ type: "warning", message: "操作已取消" });
          console.log("操作已取消");
        });
    },

    //修改
    toEdit(item) {
      let param = item;
      param.type = "edit";
      this.$router.push({
        path: "tableAdd",
        query: {
          param: JSON.stringify(item),
        },
      });
    },
  },
};
</script>
<style scoped>
.container {
  height: 100%;
  font-size: 0.875rem;
  overflow: scroll;
  position: relative;
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
