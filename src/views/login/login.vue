<template>
  <div id="login">
    <div class="login_bg">
      <div class="login_box clearfix">
        <div class="login_left">
          <img src="../../assets/image/login_coverImage.png" alt />
        </div>
        <div class="login_right">
          <div class="login_right_box">
            <h1 class="title">倾行ERP管理系统系统</h1>
            <p class="slogan">家庭轻运动倡导品牌，轻运动，毅起行</p>
            <div class="login_form">
              <el-form
                :model="ruleForm"
                status-icon
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <div class="login_input">
                  <el-form-item>
                    <el-input type="text" v-model="ruleForm.account" placeholder="请输入账号"></el-input>
                  </el-form-item>
                  <i class="login_icon el-icon-edit"></i>
                </div>
                <div class="login_input">
                  <el-form-item>
                    <el-input
                      type="password"
                      v-model.number="ruleForm.password"
                      placeholder="请输入密码"
                      @keyup.enter.native="submitForm('ruleForm')"
                    ></el-input>
                  </el-form-item>
                  <i class="login_icon el-icon-edit"></i>
                </div>
                <div class="login_input login_captcha">
                  <el-form-item>
                    <el-input
                      type="text"
                      maxlength="4"
                      v-model.number="ruleForm.captcha"
                      placeholder="请输入验证码"
                      @keyup.enter.native="submitForm('ruleForm')"
                    ></el-input>
                  </el-form-item>
                  <div class="checkbutton">
                    <img :src="checkPassSrc" @click="getcheckPassSrc" />
                  </div>
                  <i class="login_icon el-icon-edit"></i>
                </div>
                <div class="login_btn">
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      ruleForm: {},
      checkPassSrc: "https://xoa.smxos.com/admin/login/checkVerify",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getcheckPassSrc() {
      const id = Math.random() * 10;
      this.checkPassSrc =
        "http://contract.smxos.com/api/login/checkVerify?" + id;
    },
  },
};
</script>
<style lang="scss" scoped>
.clearfix:after {
  content: ".";
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}

.clearfix {
  *zoom: 1;
}
#login {
  width: 100%;
  min-width: 1560px;
  height: 100%;
}
.login_bg {
  width: 100%;
  height: 100%;
  background: url("../../assets/image/login_bg.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 80%;
    margin: 0 auto;
    background: #fdfdfd;
    box-shadow: 0px 3px 40px 0px rgba(171, 167, 167, 0.35);
    .login_left {
      float: left;
      img {
        vertical-align: bottom;
      }
    }
    .login_right {
      float: left;
      width: calc(100% - 596px);
      height: 788px;
      position: relative;
      .login_right_box {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -231px;
        margin-left: -241px;
        .title {
          color: #d9a460;
          font-size: 48px;
          margin: 0;
          margin-bottom: 26px;
        }
        .slogan {
          color: #a9a9a9;
          font-size: 24px;
          margin: 0;
          text-align: left !important;
          margin-bottom: 90px !important;
        }
        .login_form {
          width: 390px;
          .login_input {
            position: relative;
            .login_icon {
              font-size: 20px;
              position: absolute;
              top: 25%;
              left: 3%;
            }
          }
          .login_captcha {
            .checkbutton {
              position: absolute;
              top: 0%;
              right: 0%;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.login_form .el-input__inner {
  font-size: 16px !important;
  height: 45px !important;
  border: none !important;
  border-radius: 0 !important;
  background: #fdfdfd !important;
  border-bottom: 2px solid #eee !important;
  padding: 0 15px 0px 45px;
}
.login_form .el-form-item__content {
  margin-left: 0 !important;
}
.login_btn .el-button {
  height: 45px;
  width: 95%;
  font-size: 18px;
  border-radius: 0 !important;
  background-color: #d9a460 !important;
  border: 1px solid #d9a460 !important;
}
</style>
