<template>
  <div class="container bg-w">
    <van-nav-bar
      title="门店信息"
      left-text
      left-arrow
      class="van-nav-bar-top"
      @click-left="onClickLeft"
    ></van-nav-bar>

    <van-row class="pd-10 main">
      <van-cell
        v-for="(item, index) in cellList"
        :key="index"
        is-link
        @click="onClick(item.path)"
      >
        <template #title>
          <span class="ft-se-16">{{ item.title }}</span>
        </template>
        <template #icon>
          <van-icon
            :name="item.iconName"
            color="#C83C3C"
            size="24"
            class="mg-rt-10"
          />
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <span class="ft-se-16">订单短信通知</span>
        </template>
        <template #icon>
          <van-icon
            name="smile-comment-o"
            color="#C83C3C"
            size="24"
            class="mg-rt-10"
          />
        </template>
        <template #right-icon>
          <van-switch
            v-model="businessInfo.enableSmsNotice"
            size="24px"
            :active-value="true"
            :inactive-value="false"
            @change="smsNotice"
            active-color="green"
            inactive-color="#dcdee0"
          />
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <span class="ft-se-16">送餐上门</span>
        </template>
        <template #icon>
          <van-icon name="bag-o" color="#C83C3C" size="24" class="mg-rt-10" />
        </template>
        <template #right-icon>
          <van-switch
            v-model="businessInfo.enableDelivery"
            size="24px"
            :active-value="true"
            :inactive-value="false"
            @change="homeNotice"
            active-color="green"
            inactive-color="#dcdee0"
          />
        </template>
      </van-cell>
      <van-cell
        class="ft-se-16"
        center
        title="指定地址"
        v-if="businessInfo.enableDelivery == true"
      >
        <template #icon>
          <van-icon
            name="send-gift-o"
            color="#C83C3C"
            size="24"
            class="mg-rt-10"
          />
        </template>
        <template #right-icon>
          <van-switch
            v-model="businessInfo.enableAddress"
            size="24px"
            :active-value="true"
            :inactive-value="false"
            @change="addressNotice"
            active-color="green"
            inactive-color="#dcdee0"
          />
        </template>
      </van-cell>
      <van-cell
        class="ft-se-16"
        center
        title="设置指定地址"
        v-if="businessInfo.enableAddress == true"
        @click="addressClick"
        is-link
      ></van-cell>
      <!-- <van-cell @click="logOff" is-link>
        <template #title>
          <span class="ft-se-16">店铺注销</span>
        </template>
        <template #icon>
          <van-icon
            name="delete-o"
            color="#C83C3C"
            size="24"
            class="mg-rt-10"
          />
        </template>
      </van-cell> -->
      <van-row class="bottom-btn">
			<van-button round style="width:90%;" color="#C83C3C" class="loginOut" @click="logOff">店铺注销</van-button>
		</van-row>
    </van-row>

    <van-popup
      v-model="showAddress"
      position="right"
      :style="{ height: '100%', width: '100%' }"
    >
      <div class="bg-w">
        <van-nav-bar
          title="指定地址设置"
          left-arrow
          class="van-nav-bar-top"
          @click-left="closeAddress"
        ></van-nav-bar>
        <div class="scroll">
          <van-form ref="form">
            <div
              v-for="(item, index) in addressList"
              :key="index"
              class="box mg-5"
            >
              <van-row class="mg-5 bx-sd">
                <van-col span="20">
                  <van-field
                    size="large"
                    required
                    label=""
                    v-model="item.address"
                    name="address"
                    clearable
                    :rules="[
                      {
                        required: true,
                        message: '请输入送餐地址',
                        trigger: 'blur',
                      },
                    ]"
                    placeholder="请输入送餐地址"
                  />
                </van-col>
                <van-col
                  span="3"
                  class="pd-5 mg-tp-10 tx-rt"
                  v-if="index !== 0"
                >
                  <van-icon
                    name="cross"
                    color="red"
                    size="12"
                    @click="deleteSubAddress(index, item)"
                  />
                  <span class="ft-se-12 red pd-rt-5">删除</span>
                </van-col>
              </van-row>

              <van-row
                class="tx-ct pd-5 cl-add"
                v-if="
                  index + 1 == addressList.length && addressList.length < 10
                "
                @click="addSubAddress(index)"
                ><span class="ft-se-16">+</span
                ><span class="ft-se-14">增加地址</span></van-row
              >
            </div>
          </van-form>
        </div>

        <div class="fixed-bottom row">
          <div class="pd-tb-15 pd-lr-15">
            <van-button
              style="width: 100%"
              color="#C83C3C"
              class="loginOut mg-tp-10"
              round
              @click="onSubmitAddress"
              >确认
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Notify } from "vant";
import {
  getUserInfo,
  getTypeTree,
  logOffBussiness,
  updateBussiness,
  updateBusinessSms,
  updateBusinessDelivery,
} from "@/api/sys.js";

export default {
  data() {
    return {
      businessInfo: {},
      checked: "0",
      cellList: [
        {
          title: "密码重置",
          iconName: "graphic",
          path: "/basicInfo",
        },
        {
          title: "商家资料",
          iconName: "description",
          path: "/storeInfo",
        },
        // {
        //     title: "资质认证",
        //     iconName: "sign",
        //     path: "/certification"
        // },
        {
          title: "开店人信息",
          iconName: "manager",
          path: "/managerInfo",
        },
        {
          title: "营业信息",
          iconName: "shop",
          path: "/businessInfo",
        },
      ],
      // 送餐地址
      addressList: [
        {
          address: null,
        },
      ],
      // 指定地址弹窗
      showAddress: false,
    };
  },
  created() {
    this.getBusinessInfo();
    this.getTypeTree();
  },
  computed: {
    // deliveryAddress() {
    //   return this.businessInfo.deliveryAddresses === null;
    // },
  },
  methods: {
    onClickLeft() {
      //   this.$router.go(-1);
      this.$router.push("/index");
    },

    getBusinessInfo() {
      getUserInfo().then((res) => {
        this.businessInfo = res.data;
      });
    },
    getTypeTree() {
      getTypeTree().then((response) => {
        if (response.code == 200) {
          this.$store.commit(
            "sys/SET_CATEGORYTREEDATA",
            response.data[0].children
          );
        }
      });
    },
    onClick(path) {
      this.$router.push({ path: path });
    },
    // 店铺注销
    logOff() {
      Dialog.confirm({
        confirmButtonText: "确定",
        confirmButtonColor: "#C83C3C",
        messageAlign: "left",
        message: "注销店铺会使数据丢失且不可恢复，请确认！",
      })
        .then(() => {
          logOffBussiness().then((res) => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success",
              });
              this.$store.dispatch("sys/resetToken");
              this.$router.push("/login");
            }
          });
        })
        .catch(() => {});
    },
    // 短信通知
    smsNotice(val) {
      let text = val === true ? "开通" : "关闭";
      Dialog.confirm({
        title: "警告",
        message: '确认要"' + text + '"订单短信通知吗?',
      })
        .then(() => {
          updateBusinessSms({
            enableSmsNotice: this.businessInfo.enableSmsNotice,
          }).then((res) => {
            if (res.code == 200) {
              this.getBusinessInfo();
            }
          });
        })
        .catch(() => {
          this.businessInfo.enableSmsNotice = val === true ? false : true;
          val = val === true ? false : true;
        });
    },
    // 送餐上门开关
    homeNotice(val) {
      let text = val === true ? "开通" : "关闭";
      Dialog.confirm({
        title: "警告",
        message: '确认要"' + text + '"送餐上门服务吗?',
      })
        .then(() => {
          updateBusinessDelivery({
            enableDelivery: this.businessInfo.enableDelivery,
            deliveryAddresses: this.businessInfo.deliveryAddresses,
          }).then((res) => {
            if (res.code == 200) {
              this.getBusinessInfo();
            }
          });
        })
        .catch(() => {
          this.businessInfo.enableDelivery = val === true ? false : true;
          val = val === true ? false : true;
        });
    },
    // 是否指定送餐地址开关
    addressNotice(val) {
      let text = val === true ? "开通" : "关闭";
      Dialog.confirm({
        title: "警告",
        message: '确认要"' + text + '"指定地址吗?',
      })
        .then(() => {
          updateBusinessDelivery({
            enableAddress: this.businessInfo.enableAddress,
          }).then((res) => {
            if (res.code == 200) {
              this.getBusinessInfo();
            }
          });
        })
        .catch(() => {
          this.businessInfo.enableAddress = val === true ? false : true;
          val = val === true ? false : true;
        });
    },
    // 地址增加
    addSubAddress(index) {
      this.addressList.push({
        address: null,
      });
    },
    // 地址删除
    deleteSubAddress(val, item) {
      let index = this.addressList.indexOf(item);
      if (index !== -1) {
        //当没有多余tab时就不再删除
        this.addressList.splice(index, 1);
      }
    },
    // 指定地址
    addressClick() {
      this.showAddress = true;
      if (this.businessInfo.deliveryAddresses.length > 0) {
        this.addressList = [];
        this.businessInfo.deliveryAddresses.forEach((el) => {
          this.addressList.push({
            address: el,
          });
        });
      }
    },
    // 关闭指定地址弹窗
    closeAddress() {
      this.showAddress = false;
      this.getBusinessInfo();
    },
    onSubmitAddress() {
      this.$refs.form.validate().then(() => {
        let arr = [];
        // console.log(this.addressList,'addrelist');
        this.showAddress = false;
        this.addressList.forEach((el) => {
          arr.push(el.address);
        });
        this.businessInfo.deliveryAddresses = arr;
        // todo 提交地址信息
        updateBusinessDelivery({
          deliveryAddresses: this.businessInfo.deliveryAddresses,
        }).then((res) => {
          if (res.code == 200) {
            this.getBusinessInfo();
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.main {
  /* top: 50px;
  height: 85%;
  position: relative;
  overflow: auto; */
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
