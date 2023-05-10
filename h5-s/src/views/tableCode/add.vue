<template>
  <div class="container">
    <van-nav-bar
      :title="title"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="mg-tp-10 main">
      <van-form @submit="onSubmit">
        <van-cell-group>
          <van-field
          size="large"
            required
            :rules="[{ required: true, message: '请填写餐桌名称',trigger: 'blur' }]"
            v-model="tableInfo.name"
            label="餐桌名称:"
            clearable
            placeholder="请输入餐桌名称"
          />
          <!-- <van-field
            required
            :rules="[{ required: true, message: '请选择餐桌排序',trigger: 'blur' }]"
            v-model="tableInfo.categorySort"
            label="餐桌排序:"
            clearable
          >-->

          <div class="pd-10 mg-10">
            <van-button round block color="#C83C3C" native-type="submit">保存</van-button>
          </div>
        </van-cell-group>
      </van-form>
    </van-row>
  </div>
</template>

<script>
import { Upload } from "@/api/sys.js";
import { getTableById, updateTble, addTableInfo } from "@/api/menu.js";
export default {
  data() {
    return {
      title: null,
      actionType: null,
      info: {},
      tableInfo: {
        id: null,
        number: null,
        name: null,
        tableStatus: null,
        maxPeopleCount: null,
        minPeopleCount: null,
        uuid: null,
        reservedField: null,
        status: null,
        delFlag: null
      }
    };
  },

  created() {
    this.info = JSON.parse(this.$route.query.param);
    this.actionType = this.info.type;
    if (this.actionType == "add") {
      this.title = "添加餐桌";
    }
    if (this.actionType == "edit") {
      this.title = "编辑餐桌";
      this.getTableInfo(this.info.id)
    }
  },

  methods: {
    onClickLeft() {
    //   this.$router.go(-1);
    history.back()
    },

    getTableInfo(id){
        getTableById(id).then(res=>{
            if(res.code==200){
                this.tableInfo = res.data
            }
        })
    },

    onSubmit() {
      if (this.actionType == "add") {
        addTableInfo(this.tableInfo).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "餐桌添加成功！",
              type: "success"
            });
            this.$router.push("/tableCode");
          }
        });
      } else {
        updateTble(this.tableInfo).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "信息修改成功！",
              type: "success"
            });
            this.$router.push("/tableCode");
          }
        });
      }
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
</style>
