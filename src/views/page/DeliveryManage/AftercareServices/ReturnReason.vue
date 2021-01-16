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
        <el-form-item label="退货原因:" prop="name" :rules="{ required: true, message: '退货原因不能为空', trigger: 'blur' }">
          <el-input v-model="form.name" type="textarea" placeholder="请输入原因"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="2"
              :inactive-value="1"
              active-text="启用"
              inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input-number
              v-model="form.sort"
              controls-position="right"
              placeholder="请输入排序"
              :min="0"
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
import {add, edit, index, status, del} from "@/api/DeliveryManage/AftercareServices/ReturnReason";
export default {
  name: "ReturnReason",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      addAttributeState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'name',label:'退货原因',},
          {prop:'status',type:'tag',label:'状态',data:[{type:'danger',key:1,name:'禁用'},{type:'success',key:2,name:'启用'}],},
          {prop:'sort',label:'排序',sortable:"custom"},
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

    // 删除
    delAttribute(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--该条退货原因--, 是否继续?', '提示', {
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

    //新增还是修改
    changeAttribute(e){
      if(e==='edit'){
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            name:this.selectRow.name,
            status:Number(this.selectRow.status),
            sort:this.selectRow.sort,
          }
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{
        this.form={
          status:1
        }
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