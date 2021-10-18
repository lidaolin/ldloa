<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination  @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow  class="ldlTab" :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" style="height: calc(100% - 4px)">
        <el-tab-pane label="查看操作日志" style="height: calc(100% - 4px)">
          <el-table
              :data="checkLogList"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="user_name"
                width="120"
                label="操作人名称">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="原因">
            </el-table-column>
            <el-table-column
                prop="type"
                width="100"
                align="center"
                label="操作类型">
            </el-table-column>
            <el-table-column
                prop="createTime"
                align="center"
                width="140"
                label="时间">
              <template slot-scope="{row}">
                {{row.compensate_createtime | parseTime('')}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ldlControlWindow>
    <el-dialog
        v-el-drag-dialog
        top="5%"
        width="30%"
        custom-class="minWidth300"
        :visible.sync="compensateState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini" >
        <el-form-item label="销售单号:" prop="deliverNum" :rules="{ required: true, message: '请填写销售单号', trigger: 'blur' }">
          <el-input v-model="form.deliverNum" placeholder="请输入销售单号" :disabled="form.id"></el-input>
        </el-form-item>
        <el-form-item label="赔偿类型:" prop="compensate_type" :rules="{ required: true, message: '请填写赔偿类型', trigger: 'blur' }">
          <el-select v-model="form.compensate_type" placeholder="请选择">
            <el-option
                v-for="(item,index) in typeList"
                :key="index+1"
                :label="item"
                :value="index+1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赔偿金额:" prop="compensate_cash" :rules="{ required: true, message: '请填写赔偿金额', trigger: 'change' }">
          <el-input-number v-model="form.compensate_cash" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="处理进度:" prop="deal_progress" >
          <el-input type="textarea" v-model="form.deal_progress" placeholder="请填写处理进度"></el-input>
        </el-form-item>
        <el-form-item label="备注说明:" prop="remark" >
          <el-input type="textarea" v-model="form.remark" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
        <el-button @click="compensateState=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index,log,add, edit} from "@/api/DeliveryManage/AftercareServices/FreightCompensate";
export default {
name: "FreightCompensate",
  data(){
    return{
      typeList:['产品丢失','破损','超区','其他'],
      checkLogList:[],
      compensateState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'deliverNum',label:'销售单号',width: 200},
          {prop:'ship_date',label:'发货日期',type:"date",sortable:"custom",width:'140'},
          {prop:'expressNum',label:'快递单号',width: 160},
          {prop:'deal_progress',label:'处理进度',},
          {prop:"compensate_cash",label:"赔偿金额"},
          {prop:'compensate_type',type:'tag',label:'赔偿类型',data:[{type:'success',key:1,name:'产品丢失'},{type:'danger',key:2,name:'破损'},{type:'warning',key:3,name:'超区'},{type:'info',key:4,name:'其他'}],},
          {prop:'createTime',label:'创建时间',type:"date",sortable:"custom",width:'140'},
          {prop:'remark',label:'备注说明',width: 200,showOverflowTooltip:true,},
          {prop:'userId_name',label:'创建人名称',},
          {prop:'companyName',label:'配送中心公司名称',width: 140},
          {prop:'express_name',label:'快递名称',},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          let form ={...this.form}
          if(this.form.id){
            edit(form).then(()=>{
              this.compensateState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            add(form).then(()=>{
              this.compensateState=false
              this.$message.success('添加成功')
              this.getList()
            })

          }
        }
      })
    },
    //编辑还是新增
    changeCompensate(e){
      if(e==='add'){
        this.form={}
        this.compensateState=true
      }else{
        if(this.selectRow){
          this.form={...this.selectRow}
          this.compensateState=true
        }else{
          this.$message.error('请选中一行')
        }
      }
    },
    //点击查看详情
    listClick(e){
      log({id:e.id}).then(res=>{
        this.checkLogList=res.data
      })
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
      index(this.pagingData).then(res=>{
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
    },
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  components:{
    ldlControlWindow,
    ldlTablePagination,
    buttonBox,
  },
}
</script>

<style scoped>

</style>