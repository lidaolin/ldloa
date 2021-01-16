<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth400"
        :visible.sync="addAttributeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="130px" size="mini" >
        <el-form-item label="原因说明:" prop="cause_name" :rules="{ required: true, message: '原因说明不能为空', trigger: 'blur' }">
          <el-input v-model="form.cause_name" type="textarea" placeholder="请输入原因"></el-input>
        </el-form-item>
        <el-form-item label="发货方责任占比:" prop="f_duty" :rules="{ required: true, message: '发货方责任占比不能为空', trigger: 'blur' }">
          <el-input-number
              v-model="form.f_duty"
              controls-position="right"
              placeholder="请输入比例"
              :min="0"
              :precision="1"
              :step="0.1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="成交方责任占比:" prop="c_duty" :rules="{ required: true, message: '成交方责任占比不能为空', trigger: 'blur' }">
          <el-input-number
              v-model="form.c_duty"
              controls-position="right"
              placeholder="请输入比例"
              :min="0"
              :precision="1"
              :step="0.1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="总部责任占比:" prop="z_duty" :rules="{ required: true, message: '总部责任占比不能为空', trigger: 'blur' }">
          <el-input-number
              v-model="form.z_duty"
              controls-position="right"
              placeholder="请输入比例"
              :min="0"
              :precision="1"
              :step="0.1"
          ></el-input-number>
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
import {add, edit, index,} from "@/api/DeliveryManage/AftercareServices/ReturnLiability";
export default {
  name: "ReturnLiability",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      loading:false,//控制搜索加载的
      cause_name_arr:[],//配送数组
      addAttributeState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'cause_name',label:'退换原因',},
          {prop:'f_duty',label:'发货方责任比',sortable:"custom"},
          {prop:'c_duty',label:'成交方责任比',sortable:"custom"},
          {prop:'z_duty',label:'总部责任比',sortable:"custom"},
          {prop:'sort',label:'排序',sortable:"custom"},
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

    // 删除
    // delAttribute(){
    //   if(this.selectRow){
    //     this.$confirm('此操作将永久删除--该条配送记录--, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       del({id:this.selectRow.id}).then(()=>{
    //         this.getList()
    //         this.$message.success('删除成功')
    //       })
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });
    //     });
    //   }else{
    //     this.$message.error('请选中一行')
    //   }
    // },

    //新增还是修改
    changeAttribute(e){
      if(e==='edit'){
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            cause_name:this.selectRow.cause_name,
            f_duty:this.selectRow.f_duty,
            c_duty:this.selectRow.c_duty,
            z_duty:this.selectRow.z_duty,
          }
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{
        this.form={}
        this.$nextTick(function () {
          this.$refs.form.clearValidate();
        });
        this.addAttributeState=true
      }
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
}
</script>

<style scoped>

</style>