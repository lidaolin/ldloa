<template>
<div class="pageWrap">
  <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
  <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
<!--  <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight"></ldlControlWindow>-->
  <el-dialog
      v-el-drag-dialog
      width="30%"
      custom-class="minWidth300"
      :visible.sync="adduserState"
      :destroy-on-close="false"
      :close-on-click-modal="false"
      title="erp员工"
      size="mini"
      center
  >
    <el-form ref="form" :model="form" label-width="100px" size="mini" >
      <el-form-item label="管理组名称:" :rules="{ required: true, message: '请选择管理组名称', trigger: 'blur' }">
        <el-select
            v-model="form.groupId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="groupMethod"
            :loading="loading">
          <el-option
              v-for="item in groupArray"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工名称:" :rules="{ required: true, message: '请选择员工名称', trigger: 'blur' }">
        <el-select
            :disabled="changeGroupState"
            v-model="form.userId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="userMethod"
            :loading="loading">
          <el-option
              v-for="item in userArray"
              :key="item.id"
              :label="item.account"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="adduserState=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import {a_list,add_user_group_list,s_list,a_add,enable_user,prohibit_user,up_user,up_pass} from "@/api/root/userInfo";

import ldlTablePagination from '@/components/ldlTablePagination'
// import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
export default {
  name: "UserInfo",
  data(){
    return{
      groupArray:[],
      userArray:[],
      changeGroupState:false,
      loading:false,
      form:{},
      adduserState:false,
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'account',label:'账号',},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'启用'},{type:'danger',key:2,name:'禁用'}],},
          {prop:'wechatName',label:'微信名称'},
          {prop:'wechat',label:'微信号'},
          {prop:"qq",label:"QQ"},
          {prop:'groupName',label:'管理组名称'},
          {prop:'phone',label:'手机'},
          {prop:'avatar',label:'头像',type:'avatar',size:30},
          {prop:'companyName',label:'单位名称'},
          {prop: 'avatar',label: '图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop: 'id',label:'拖动',type:'derk',width:'40'},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    changePassword(){
      if(this.selectRow){
        this.$prompt('请输入新密码必须是密码和数字组合', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          up_pass({id:this.selectRow.id,password:value}).then(()=>{
            this.$message({
              type: 'success',
              message: '修改成功你的密码是: ' + value
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
        });
      }else{
        this.$message.error('请选中一行')
      }
    },
    changeGroup(){
      if(this.selectRow){
        this.userArray=[{
          account:this.selectRow.account,
          id:this.selectRow.id
        }]
        this.changeGroupState=true
        this.groupMethod(this.selectRow.groupName)
        this.form={
          userId:this.selectRow.id,
          groupId:this.selectRow.groupId
        }
        this.adduserState=true
        this.groupMethod()
      }else{
        this.$message.error('请选中一行')
      }
    },
    //禁用员工和启用员工
    changeState(e){
      if(this.selectRow){
        this.$confirm(e==='over'?'是否禁止此员工':'是否启用此员工', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: e==='over'?'error':'warning'
        }).then(() => {
          console.log(this.selectRow)
          if(e==='over'){
            prohibit_user({id:this.selectRow.id}).then(()=>{
              this.getList()
              this.$message({
                type: 'success',
                message: '禁用成功!'
              });
            })
          }else{
            enable_user({id:this.selectRow.id}).then(()=>{
              this.getList()
              this.$message({
                type: 'success',
                message: '开启成功!'
              });
            })
          }

        }).catch(() => {});
      }else{
        this.$message.error('请选中一行')
      }

    },
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if (this.changeGroupState){
            up_user(this.form).then(res=>{
              this.form={}
              this.adduserState=false
              this.$message.success(res.msg)
              this.getList()
            })
          }else{
            a_add(this.form).then(res=>{
              this.form={}
              this.adduserState=false
              this.$message.success(res.msg)
              this.getList()
            })
          }
        }
      })
    },
    // 搜索组id
    groupMethod(e){
      this.loading=true
      add_user_group_list({key:e}).then(res=>{
        this.groupArray=res.data
        this.loading=false
      })
    },
    // 搜索员工id
    userMethod(e){
      this.loading=true
      s_list({key:e}).then(res=>{
        this.userArray=res.data
        this.loading=false
      })
    },
    //打开新增的弹窗
    addUser(){
      this.form={
        userId:'',
        groupId:''
      }
      this.changeGroupState=false
      this.adduserState=true
      this.groupMethod()
      this.userMethod()
    },
    /**这是按钮方法调用*/
    functionCall(name) {
      if (name.length == 1) {
        this[name[0]]();
      } else {
        this[name[0]](name[1]);
      }
    },
    /**这是按钮方法调用*/
    getList(){
      a_list(this.pagingData).then(res=>{
        this.pagingData={
          ...
          this.pagingData,
          page:res.data.current_page,
          limit:res.data.per_page,
          total:res.data.total,
        }
        let tableDataInfo={... this.tableDataInfo,dataList:res.data.data}
        this.tableDataInfo=tableDataInfo
      })
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  components:{
    // ldlControlWindow,
    ldlTablePagination,
    buttonBox,
  },
}
</script>

<style scoped>

</style>