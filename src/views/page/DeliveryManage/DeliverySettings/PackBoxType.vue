<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth500"
        :visible.sync="addAttributeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="160px" size="mini" >
        <el-form-item label="配送公司:" prop="ps_company_id" :rules="{ required: true, message: '配送公司不能为空', trigger: 'blur' }">
          <el-select
              v-model="form.ps_company_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod"
              :loading="loading">
            <el-option
                v-for="item in ps_company_id_arr"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包装箱名称:" prop="packname" :rules="{ required: true, message: '包装箱名称不能为空', trigger: 'blur' }">
          <el-input v-model="form.packname" placeholder="请输入包装箱名称"></el-input>
        </el-form-item>
        <el-form-item label="长" prop="longsize" :rules="{ required: true, message: '长度不能为空', trigger: 'blur' }">
          <el-input-number
              v-model="form.longsize"
              controls-position="right"
              placeholder="请输入长度"
              :min="0"
              :precision="2"
              :step="0.01"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="宽" prop="widesize" :rules="{ required: true, message: '宽度不能为空', trigger: 'blur' }">
          <el-input-number
              v-model="form.widesize"
              controls-position="right"
              placeholder="请输入宽度"
              :min="0"
              :precision="2"
              :step="0.01"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="高" prop="highsize" :rules="{ required: true, message: '高度不能为空', trigger: 'blur' }">
          <el-input-number
              v-model="form.highsize"
              controls-position="right"
              placeholder="请输入高度"
              :min="0"
              :precision="2"
              :step="0.01"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="最多可以装商品的数量">
          <el-input-number
              v-model="form.packnumber"
              controls-position="right"
              placeholder="请输入高度"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="启用"
              inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
          <el-button @click="addAttributeState=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {add, edit, packList, status, del} from "@/api/DeliveryManage/DeliverySettings/PackBoxType";
import {distributCompany} from "@/api/DeliveryManage/DeliverySettings/AreaMaintenance";

export default {
  name: "PackBoxType",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      addAttributeState:false,
      form:{},
      loading:false,//控制搜索加载的
      ps_company_id_arr:[],//配送数组
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'companyName',label:'配送公司名称',},
          {prop:'packname',label:'包装箱名称',},
          {prop:'longsize',label:'长',},
          {prop:'widesize',label:'宽',},
          {prop:'highsize',label:'高',},
          {prop:'volumesize',label:'体积',},
          {prop:'packnumber',label:'最多可以装商品的数量',},
          {prop:'remarks',label:'备注',},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'启用'},{type:'danger',key:2,name:'禁用'}],},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom"},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  methods:{

    // 配送搜索
    brandMethod(e){
      this.loading=true
      distributCompany({name:e}).then(res=>{
        this.ps_company_id_arr=res.data
        this.loading=false
      })
    },

    // 删除
    delAttribute(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--'+this.selectRow.packname+'--, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({id:this.selectRow.id}).then(()=>{
            this.getList()
            this.$message.success('删除成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message.error('请选中一行')
      }
    },

    /**更改状态*/
    changeState(){
      if(this.selectRow){
        this.$confirm('当前状态为'+(this.selectRow.status==1?' 启用 ':' 禁用 ')+'是否修改为'+(this.selectRow.status==2?' 启用 ':' 禁用 '), '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          status({id:this.selectRow.id,status:this.selectRow.status==1?2:1}).then(()=>{
            this.$message.success('设置成功')
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }else{
        this.$message.error('请选中一行')
      }
    },

    //新增还是修改
    changeAttribute(e){
      if(e==='edit'){
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            packname:this.selectRow.packname,
            ps_company_id:this.selectRow.ps_company_id,
            packnumber:this.selectRow.packnumber,
            remarks:this.selectRow.remarks,
            status:this.selectRow.status,
            longsize:this.selectRow.longsize,
            widesize:this.selectRow.widesize,
            highsize:this.selectRow.highsize,
          }
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{
        this.form={
          status:1
        }
        this.addAttributeState=true
      }
      this.brandMethod()
    },

    //新增修改的保存
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if(this.form.id){
            edit(this.form).then(()=>{
              this.addAttributeState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            add(this.form).then(()=>{
              this.addAttributeState=false
              this.$message.success('添加成功')
              this.getList()
            })

          }
        }
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
      packList(this.pagingData).then(res=>{
        this.pagingData={...
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

}
</script>

<style scoped>

</style>