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
      <van-form ref="form">
        <van-cell-group>
          <van-field
            size="large"
            required
            :rules="[{ required: true, message: '请填写规格名称',trigger: 'blur' }]"
            v-model="specificInfo.formatName"
            label="规格名称:"
            clearable
            placeholder="请输入规格名称"
          />

          <van-field
            size="large"
            required
            :rules="[{ required: true, message: '请选择是否设置金额',trigger: 'blur' }]"
            clickable
            name="formatMoney"
            v-model="specificInfo.formatMoney"
            label="是否设置金额"
          >
            <template #input>
              <van-radio-group v-model="specificInfo.formatMoney" direction="horizontal">
                <van-radio name="0" checked-color="#C83C3C">否</van-radio>
                <van-radio name="1" checked-color="#C83C3C">是</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            size="large"
            required
            :rules="[{ required: true, message: '请选择规格排序',trigger: 'blur' }]"
            v-model="specificInfo.formatSort"
            label="规格排序:"
            clearable
          >
            <template slot="input">
              <van-stepper v-model="specificInfo.formatSort" min="0" integer/>
            </template>
          </van-field>

          <div class="pd-10 mg-10">
            <van-button round block color="#C83C3C" @click="onSubmit">保存</van-button>
          </div>
        </van-cell-group>
      </van-form>
    </van-row>
  </div>
</template>

<script>
import { addSpecific, updateSpecific } from "@/api/specificaction.js";
export default {
  data() {
    return {
      title: null,
      actionType: null,
      businessId: this.$store.state.sys.businessId,
      info: {},
      specificInfo: {
        businessId: null,
        formatName: null,
        formatMoney: "0",
        formatSort: 0
      }
    };
  },

  created() {
    let info = JSON.parse(this.$route.query.param);
    this.actionType = info.type;
    if (this.actionType == "add") {
      this.title = "添加规格";
    }
    if (this.actionType == "edit") {
      this.title = "编辑规格";
      this.specificInfo = info;
    }
  },

  methods: {
    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push("/specification");
    },
    onSubmit() {
      this.$refs.form.validate().then(() => {
        if (this.actionType == "add") {
          this.specificInfo.businessId = this.businessId;
          addSpecific(this.specificInfo).then(res => {
            if (res.code == 200) {
              this.$message({
                message: "规格添加成功！",
                type: "success"
              });
              this.$router.push("/specification");
            }
          });
        } else {
          this.specificInfo.businessId = this.businessId;
          updateSpecific(this.specificInfo).then(res => {
            if (res.code == 200) {
              this.$message({
                message: "规格修改成功！",
                type: "success"
              });
              this.$router.push("/specification");
            }
          });
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
</style>
