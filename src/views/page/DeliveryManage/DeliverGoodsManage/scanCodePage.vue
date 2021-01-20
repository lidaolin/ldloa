<template>
  <div class="pageWrap_main">
    <div class="invoiceInfo">
      <h3>发货单信息</h3>
      <ul>
        <li>
          <span>发货单号：</span> {{infoData.plfahuo_code}}
        </li>
        <li>
          <span>订单状态：</span> {{infoData.plfahuo_status}}
        </li>
        <li>
          <span>快递单位：</span> {{infoData.kdname}}
        </li>
        <li>
          <span>包货箱型：</span> {{infoData.bz_xin}}
        </li>
        <li>
          <span>估重：</span> {{infoData.guzong}}
        </li>
        <li v-if="infoData.plfahuo_characteristic == 1">
          <span>订单标识：</span>
        </li>
        <li v-if="infoData.plfahuo_characteristic == 2">
          <span>订单标识：</span> 拆分
        </li>
        <li v-if="infoData.plfahuo_characteristic == 3">
          <span>订单标识：</span> 合并
        </li>
        <li>
          <span>是否已拦截：</span> <span v-if="infoData.intercept_status">{{infoData.intercept_status == 1?'否':'是'}}</span>
        </li>
        <li>
          <span>收件人姓名：</span> {{infoData.sj_name}}
        </li>
        <li>
          <span>收件人手机：</span> {{infoData.sj_phone}}
        </li>
        <li>
          <span>详细地址：</span> {{infoData.detail_address}}
        </li>
        <li>
          <span>审单时间：</span> {{infoData.examine_time}}
        </li>
      </ul>
      <div v-if="infoDataTF" style="color: red;text-align: center;">
        <i class="el-icon-warning-outline"></i> 此单号暂无数据！
      </div>
    </div>
    <div class="sweepCode">
      <div>
        <p style="text-align: center;">
          <span>清单打印状态：</span> <span v-if="infoData.qingdan_status">{{infoData.qingdan_status == 1?'未打印':'打印成功'}}</span>
        </p>
      </div>
      <div >
        <el-form
            ref="syncdevForm"
            label-position="right"
            label-width="80px"
            :model="syncdevForm"
            size="mini"
        >
          <el-form-item label="单号">
            <el-input
                ref="focusInput"
                v-model="code"
                placeholder="请扫描快递单号"
                clearable
                :disabled="disabledTF"
                @keyup.enter.native="coedSearch"
            >
              <template slot="append">
                <el-button icon="el-icon-search" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="实重" prop="shizong" :rules="[{ required: true, message: '实重不能为空'}]">
            <el-input ref="shiZongInput" v-model="syncdevForm.shizong" @keyup.enter.native="syncdevFormSave">
              <template slot="append">克</template>
            </el-input>
          </el-form-item>
          <el-form-item label="发货运费">
            <el-input v-model="syncdevForm.fahuo_fieight" placeholder="系统默认自动计算运费" />
          </el-form-item>
          <el-form-item label="发货备注">
            <el-input v-model="syncdevForm.remarks" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center;margin-top: 60px;">
        <el-button  @click="resetForm">重 置</el-button>
        <el-button type="primary" @click="syncdevFormSave">提 交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {get_express_view, code_deliver} from "@/api/DeliveryManage/DeliverGoodsManage/SynchroDeliver";
export default {
  name: "scanCodePage",
  components:{},
  data(){
    return{
      code:"",
      disabledTF:false,
      infoDataTF:false,
      infoData:{},
      syncdevForm:{},
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.focusInput.focus()
    })
  },
  methods:{
    //根据单号请求数据
    coedSearch() {
      this.getGoodsInfo(this.code)
    },
    getGoodsInfo(num){
      get_express_view({express_code:num}).then((res)=>{
        if(res.data.id){
          this.infoData = res.data
          this.infoDataTF = false
          this.disabledTF =true
          this.$nextTick(() => {
            this.$refs.shiZongInput.focus()
          })
        }else {
          this.infoDataTF = true
        }

      })
    },

    //提交
    syncdevFormSave(){
      this.$refs.syncdevForm.validate((valid) => {
        if(valid){
          code_deliver({...this.syncdevForm,id:this.infoData.id}).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            })
          })
          this.resetForm()
        }
      })
    },

    //重置
    resetForm(){
      this.infoData = {};
      this.syncdevForm = {}
      this.code = ""
      this.disabledTF = false
      this.$nextTick(() => {
        this.$refs.focusInput.focus()
        this.$refs.syncdevForm.resetFields()
      })
    },
  }
}
</script>

<style scoped>
ul,li{
  list-style: none;
}
.pageWrap_main{
  width: 100%;
  height: 100%;
  background-color: #F2F8FF;
  display: flex;
}
.invoiceInfo{
  width: 61%;
  height: 95%;
  background-color: #fff;
  padding: 10px;
  margin-right: 10px;
  margin: 10px 10px 0px 10px;
}
.invoiceInfo h3{
  text-align: center;
  margin-bottom: 50px;
}
.invoiceInfo ul{
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}
.invoiceInfo ul li{
<<<<<<< HEAD
  width: 345px;
=======
  width: 264px;
>>>>>>> 扫码发货
  margin-bottom: 20px;
  margin-right: 10px;
}
.sweepCode{
  width: 35%;
  height: 95%;
  background-color: #fff;
  margin: 10px 10px 0px 0px;
  padding: 10px;
}
</style>