<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth300"
        :visible.sync="addSupplierTypeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini" >
        <el-form-item label="分类名称:" prop="supplier_type_name" :rules="{ required: true, message: '请输入分类名称', trigger: 'blur' }">
          <el-input v-model="form.supplier_type_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类编码:" prop="supplier_type_code" :rules="{ required: true, message: '请输入分类编码', trigger: 'blur' }">
          <el-input v-model="form.supplier_type_code" placeholder="请输入分类编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
          <el-button @click="addSupplierTypeState=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {index,add, edit,del} from "@/api/PurchaseManage/ProductionInfo/SupplierType";
export default {
  name: "SupplierType",
  data(){
    return{
      addSupplierTypeState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'supplier_type_name',label:'分类名称',},
          {prop:'supplier_type_code',label:'分类编码',},
          {prop:'remark',label:'备注',},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom"},
          // {prop:'is_delete',type:'tag',label:'状态',data:[{type:'danger',key:2,name:'已删除'}],},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    // 删除
    delSupplierType(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--'+this.selectRow.supplier_type_name+'--, 是否继续?', '提示', {
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
    //提交
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if(this.form.id){
            edit(this.form).then(()=>{
              this.addSupplierTypeState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            add(this.form).then(()=>{
              this.addSupplierTypeState=false
              this.$message.success('添加成功')
              this.getList()
            })

          }
        }
      })
    },
    //打开弹窗
    changeSupplierType(e){
      if (e==='add'){
        this.form={}
        this.addSupplierTypeState=true
      }else{
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            supplier_type_code:this.selectRow.supplier_type_code,
            supplier_type_name:this.selectRow.supplier_type_name
          }
          this.addSupplierTypeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }
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
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  components:{
    ldlTablePagination,
    buttonBox,
  },
}
</script>

<style scoped>

</style>