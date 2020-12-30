<template>
<div class="pageWrap">
  <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
  <ldl-table-pagination :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
<!--  <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight"></ldlControlWindow>-->
  <el-dialog
      v-el-drag-dialog
      width="40%"
      custom-class="minWidth300"
      :visible.sync="adduserState"
      :destroy-on-close="false"
      :close-on-click-modal="false"
      title="erp员工"
      size="mini"
      center
  >
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="管理组名称:">
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
      <el-form-item label="员工名称:">
        <el-select
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
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import {a_list,add_user_group_list,s_list} from "@/api/root/userInfo";

import ldlTablePagination from '@/components/ldlTablePagination'
// import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
export default {
  name: "UserInfo",
  data(){
    return{
      groupArray:[],
      userArray:[],

      loading:false,
      form:{},
      /**必要参数*/
      pagingData:undefined,
      bottomHeight: '0%',
      buttonBoxState:true,
      tableDataInfo:{
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
        ],
        dataList:[]
      },
      adduserState:false
      /**必要参数*/
    }
  },
  methods:{
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