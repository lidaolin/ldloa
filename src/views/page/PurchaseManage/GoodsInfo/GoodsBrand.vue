<template>
 <div class="pageWrap">
   <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
   <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
   <el-dialog
       v-el-drag-dialog
       width="30%"
       custom-class="minWidth300"
       :visible.sync="addBrandState"
       :destroy-on-close="false"
       :close-on-click-modal="false"
       :title="form.id? '修改':'新增'"
       size="mini"
       center
   >
     <el-form ref="form" :model="form" label-width="100px" size="mini" >
       <el-form-item label="品牌名称:" prop="brand_name" :rules="{ required: true, message: '请填写品牌名称', trigger: 'blur' }">
         <el-input v-model="form.brand_name" placeholder="请输入品牌名字"></el-input>
       </el-form-item>
       <el-form-item label="品牌状态" prop="status">
         <el-switch
             v-model="form.status"
             active-color="#13ce66"
             inactive-color="#ff4949"
             :active-value="1"
             :inactive-value="2"
             active-text="开启"
             inactive-text="禁用">
         </el-switch>
       </el-form-item>

       <el-form-item>
         <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
         <el-button @click="addBrandState=false">取消</el-button>
       </el-form-item>
     </el-form>
   </el-dialog>
 </div>
</template>

<script>
import {index,add,edit,del} from "@/api/PurchaseManage/GoodsInfo/GoodsBrand";
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";

export default {
name: "GoodsBrand",
  data(){
    return{
      addBrandState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'brand_name',label:'品牌名称',},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'启用'},{type:'danger',key:2,name:'禁用'}],},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom"},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    // 删除
    delBrand(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--'+this.selectRow.brand_name+'--, 是否继续?', '提示', {
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
    //修改状态
    // changeBrandState(){
    //
    // },
    //新增还是修改
    changeBrand(e){
      if(e=='edit'){
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            brand_name:this.selectRow.brand_name,
            status:this.selectRow.status
          }
          this.addBrandState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{
        this.form={
          status:1
        }
        this.addBrandState=true
      }
    },
    //新增修改的保存
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if(this.form.id){
            edit(this.form).then(()=>{
              this.addBrandState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            add(this.form).then(()=>{
              this.addBrandState=false
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