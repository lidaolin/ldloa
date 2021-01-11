<template>
  <div id="login" :style="{height:pageHeight+'px'}">
    <el-image class="loginBgImg" fit="cover" :src="require('@/assets/image/login_bg.png')"/>
    <div class="loginCenter">
      <el-image class="loginLeftImg" fit="cover" :src="require('@/assets/image/login_coverImage.png')"></el-image>
      <div class="loginRightBox">
        <div class="loginRightTop">
          <div class="loginRightTopTitle">倾行ERP系统</div>
          <div class="loginRightTopSubtitle">家庭轻运动倡导品牌，轻运动，毅起行</div>
        </div>
        <div class="loginRightBottom">
          <el-form
              :model="form"
              status-icon
              ref="form"
              label-width="50px"
          >
            <el-form-item class="loginInputRow">
              <span slot="label" class="loginIconBox">
                <img :src="require('@/assets/image/login-1.png')" class="loginIcon">
              </span>
              <el-input
                  v-model="form.account"
                  placeholder="请输入用户名/手机号"
                  @keyup.enter.native="submitForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="loginInputRow">
              <span slot="label" class="loginIconBox">
                <img :src="require('@/assets/image/login-2.png')" class="loginIcon">
              </span>
              <el-input
                  v-model="form.password"
                  placeholder="请输入密码"
                  type="password"
                  @keyup.enter.native="submitForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="loginInputRow">
              <span slot="label" class="loginIconBox">
                <img :src="require('@/assets/image/login-3.png')" class="loginIcon">
              </span>
              <el-input
                  v-model="form.captcha"
                  maxlength="4"
                  @keyup.enter.native="submitForm"
                  placeholder="请输入验证码">
                <img slot="append" class="captchaImg" :src="checkPassSrc" @click="getcheckPassSrc" />
              </el-input>
            </el-form-item>
            <div class="login_btn">
                <el-button type="primary" @click="submitForm">立即登录</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
export default {
  name: "login",
  data() {
    return {
      form: {},
      otherQuery:{},
      redirect:false,
      checkPassSrc: "https://xoa.smxos.com/admin/login/checkVerify",
    };
  },
  computed:{
    ...mapGetters([
      'pageHeight',
    ]),
  },
  mounted() {
    let that=this
    window.onresize = () => {
      return (() => {
        that.$store.commit('getPageInfo');
      })();
    }
    if (that.$store.state.user.userInfo.token){
      that.$router.push({path: that.redirect || '/index', query: that.otherQuery })
    }
  },
  methods: {
    submitForm() {
      if (!this.form.account||!this.form.password||!this.form.captcha){
        this.$message.error(this.form.account?(this.form.password?'验证码不能为空':'密码不能为空'):'账号或手机号不能为空')
      }else{
        let that=this
        this.$store.dispatch('getLogin', this.form).then(()=>{

          that.$router.push({path: that.redirect || '/a', query: that.otherQuery })
        }).catch((err) => {console.log(err)})
      }
    },
    getcheckPassSrc() {
      const id = Math.random() * 10;
      this.checkPassSrc =
        "https://erp.sportqx.com/api/login/checkVerify?" + id;
    },
  },
};
</script>
<style lang="scss" scoped>
#login {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.loginBgImg{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.loginCenter{
  width: 70%;
  height: 80%;
  background: #ffffff;
  box-shadow: 0px 3px 40px 0px rgba(171, 167, 167, 0.35);
  position: absolute;
  top:10%;
  left: 15%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.loginLeftImg{
  width: 40%;
  height: 100%;
  display: block;
}
.loginRightBox{
  width: 44%;
  padding:0 8%;
  height: 100%;
  max-width: 700px;
  margin: 0 auto;
}
.loginRightTop{
  padding: 15% 0;
}
.loginRightTopTitle{
  font-size: 48px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #D9A460;
  text-align: left;
}
.loginRightTopSubtitle{
  font-size: 24px;
  text-align: left;
  font-weight: 400;
  color: #A9A9A9;
}

.loginIconBox{
  display: inline-block;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  padding-left: 10px;
}
.loginIcon{
  width: 25px;
  height: auto;
  margin-top: 5px;
  display: inline-block;
}
.loginInputRow{
  margin-top: 15px;
  border-bottom: 2px solid #EEEEEE;
  .el-input{
    border-color: transparent;
  }
  .el-input__inner{
    border-color: transparent !important;
  }
}
.captchaImg{
  width: 120px;
}
.login_btn{
  margin-top: 10%;
}
@mixin fontChange($loginLeftImg,$loginRightBoxWidth) {
  .loginLeftImg{
    display: $loginLeftImg;
  }
  .loginRightBox{
    width:$loginRightBoxWidth
  }
}
@media screen and (max-width: 1024px) {
  @include fontChange(
      $loginLeftImg:none,
      $loginRightBoxWidth:100%
  );
}

</style>
<style lang="scss">
.loginInputRow{
  border-bottom: 2px solid #EEEEEE;
  .el-input{
    border-color: transparent;
  }
  .el-input__inner{
    border-color: transparent !important;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition-delay: 111111s;
    -webkit-transition: color 11111s ease-out, background-color 111111s ease-out;
  }
  .el-input-group__append, .el-input-group__prepend{
    border:0;
    background-color:transparent;
    padding: 0;
  }
}
.login_btn .el-button {
  height: 45px;
  width: 95%;
  font-size: 18px;
  border-radius: 0 !important;
  background-color: #d9a460 !important;
  border: 1px solid #d9a460 !important;
  margin: 0 auto;
}
</style>