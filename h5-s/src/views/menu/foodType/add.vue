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
            :rules="[{ required: true, message: '请填写分类名称',trigger: 'blur' }]"
            v-model="typeInfo.categoryName"
            label="分类名称:"
            maxlength="8"
            clearable
            placeholder="请输入分类名称"
          />
          <van-field
            size="large"
            required
            :rules="[{ required: true, message: '必选',trigger: 'blur' }]"
            clickable
            name="mealStatus"
            v-model="typeInfo.mealStatus"
            label="是否是套餐"
          >
            <template #input>
              <van-radio-group
                v-model="typeInfo.mealStatus"
                direction="horizontal"
              >
                <van-radio name="0" checked-color="#C83C3C">否</van-radio>
                <van-radio name="1" checked-color="#C83C3C">是</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            size="large"
            required
            :rules="[{ required: true, message: '请选择分类排序',trigger: 'blur' }]"
            v-model="typeInfo.categorySort"
            label="分类排序:"
            clearable
          >
            <template slot="input">
              <van-stepper v-model="typeInfo.categorySort" min="0" integer/>
            </template>
          </van-field>
          <!-- <van-field
            :value="typeInfo.remark"
            type="textarea"
            autosize
            label="分类描述:"
            clearable
            placeholder="请输入分类描述"
            maxlength="50"
            show-word-limit
          />-->

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
import { updateType, addType } from "@/api/menu.js";
export default {
  data() {
    return {
      title: null,
      actionType: null,
      info: {},
      typeInfo: {
        categoryId: "",
        categoryName: "",
        categorySort: 0,
        status: "",
        mealStatus:"0"
      }
    };
  },

  created() {
    this.typeInfo = JSON.parse(this.$route.query.param);
    // this.typeInfo.categoryId=this.info.categoryId;
    // this.typeInfo.categoryName = this.info.categoryName;
    // this.typeInfo.categorySort = this.info.categorySort;
    // this.typeInfo.status = this.info.status;
    this.actionType = this.typeInfo.type;
    if (this.actionType == "add") {
      // 在vue中如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
      this.typeInfo = {
        mealStatus : "0"
      }
      this.title = "添加分类";
    }
    if (this.actionType == "edit") {
      this.title = "编辑分类";
    }
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    onSubmit() {
      if (this.actionType == "add") {
        addType(this.typeInfo).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "分类添加成功！",
              type: "success"
            });
            this.$router.push("/foodTypeList");
          }
        });
      } else {
        updateType(this.typeInfo).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "分类修改成功！",
              type: "success"
            });
            this.$router.push("/foodTypeList");
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
  /* top: 50px;
  height: 85%;
  position: relative;
  overflow: auto; */
}
</style>
