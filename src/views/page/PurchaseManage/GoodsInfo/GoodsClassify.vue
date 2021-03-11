<template>
<div class="pageWrap">
  <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
  <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
  <el-dialog
      v-el-drag-dialog
      width="40%"
      custom-class="minWidth500"
      :visible.sync="addClassifyState"
      :destroy-on-close="false"
      :close-on-click-modal="false"
      :title="form.id? '修改':'新增'"
      size="mini"
      center
  >
    <el-form ref="form" :model="form" label-width="100px" size="mini" >
      <el-form-item label="当前父级分类:" v-if="selectRow">
        {{selectRow.classify_name}}
      </el-form-item>
      <el-form-item :label="form.pid?'子分类名称':'分类名称'" prop="classify_name" :rules="{ required: true, message: '请填写分类名称', trigger: 'blur' }">
        <el-input v-model="form.classify_name" placeholder="请输入分类名字"></el-input>
      </el-form-item>
      <el-form-item label="商品分类封面图:" prop="classify_img" :rules="{ required: true, message: '请上传商品封面图', trigger: 'blur' }">
        <el-upload
            class="avatar-uploader"
            action="/admin/upload_image/upload"
            name="file"
            :show-file-list="false"
            :on-success="(e)=>{handleSuccess(e,'classify_img')}"
            :before-upload="beforeUpload">
          <img v-if="form.classify_img" alt="" :src="form.classify_img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="分类状态" prop="status">
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
      <el-form-item label="分类排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="99" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="onSubmitTwo" v-if="form.pid&&!form.id">创建一级分类</el-button>
        <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
        <el-button @click="addClassifyState=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {index,add, edit,del} from "@/api/PurchaseManage/GoodsInfo/GoodsClassify";
export default {
  name: "GoodsClassify",
  data(){
    return{
      addClassifyState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        rowKey:"id",
        treeProps:{children: 'child', hasChildren: 'hasChildren'},
        dataListInfo:[
          {prop:'classify_name',label:'男装',},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'启用'},{type:'danger',key:2,name:'禁用'}],},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom"},
          {prop: 'classify_img',label: '封面图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    // 删除
    delClassify(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--'+this.selectRow.classify_name+'--, 是否继续?', '提示', {
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
    //提交是否为一级
    onSubmitTwo(){
      let form= {... this.form}
      delete form.pid
      this.form=form
      this.onSubmit()
    },
    //提交
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if(this.form.id){
            edit(this.form).then(()=>{
              this.addClassifyState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            add(this.form).then(()=>{
              this.addClassifyState=false
              this.$message.success('添加成功')
              this.getList()
            })

          }
        }
      })
    },
    // 新增或者修改
    changeClassify(e){
      if(e==='edit'){
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            classify_name:this.selectRow.classify_name,
            status:this.selectRow.status,
            pid:this.selectRow.pid,
            sort:this.selectRow.sort,
            classify_img:this.selectRow.classify_img
          }
          this.addClassifyState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{

        if(this.selectRow){
          this.form={
            status:1,
            pid:this.selectRow.id,
            sort:1
          }
        }else{
          this.form={
            status:1,
            sort:1
          }
        }
        this.addClassifyState=true
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
    //图片上传成功
    handleSuccess(e,name){
      let form= {... this.form}
      form[name]=e.data.url
      this.form={... form}
    },
    //限制图片上传的限制
    beforeUpload(e){
      console.log(e)
    },
    /**这是按钮方法调用*/
    getList(){
      index(this.pagingData).then(res=>{
        this.pagingData={...
              this.pagingData,
          page:res.data.current_page?res.data.current_page:1,
          limit:res.data.per_page?res.data.per_page:100,
          total:res.data.total?res.data.total:res.data.length,
        }
        let tableDataInfo={... this.tableDataInfo,dataList:res.data}
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