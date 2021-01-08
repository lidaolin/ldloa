<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="60%"
        custom-class="minWidth600"
        :visible.sync="addSupplierState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" :inline="true" label-width="100px" size="mini" >
        <el-form-item label="供应商名称:" prop="supplier_name" :rules="{ required: true, message: '请填写供应商名称', trigger: 'blur' }">
          <el-input v-model="form.supplier_name" placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="供应商编码:" prop="supplier_code" :rules="{ required: true, message: '请填写供应商编码', trigger: 'blur' }">
          <el-input v-model="form.supplier_code" placeholder="请输入供应商编码"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" prop="contact_person" >
          <el-input v-model="form.contact_person" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="供应商分类:" prop="supplier_type_id" :rules="{ required: true, message: '请填写供应商分类', trigger: 'blur' }">
          <el-select
              size="mini"
              v-model="form.supplier_type_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="supplierTypeMethod"
              :loading="loading">
            <el-option
                v-for="item in supplierTypeArray"
                :key="item.id"
                :label="item.supplier_type_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址:" prop="tel">
          <el-cascader
              v-model="form.address"
              :options="regionData"
              :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="detail_address">
          <el-input v-model="form.detail_address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="传真:" prop="fax">
          <el-input v-model="form.fax" placeholder="请输入传真"></el-input>
        </el-form-item>
        <el-form-item label="邮编:" prop="post_code">
          <el-input v-model="form.post_code" placeholder="请输入邮编"></el-input>
        </el-form-item>
        <el-form-item label="QQ:" prop="qq">
          <el-input v-model="form.qq" placeholder="请输入QQ"></el-input>
        </el-form-item>
        <el-form-item label="微信号:" prop="qq">
          <el-input v-model="form.wechat" placeholder="请输入微信号"></el-input>
        </el-form-item>
        <el-form-item label="开票税率:" prop="tax_rate">
          <el-input v-model="form.tax_rate" placeholder="请输入开票税率"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
        <el-button @click="addSupplierState=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {index,add, edit,del,supplierTypeList} from "@/api/PurchaseManage/ProductionInfo/Supplier";
import {regionData} from 'element-china-area-data'
export default {
  name: "Supplier",
  data(){
    return{
      loading:false,
      supplierTypeArray:[],
      regionData:regionData,
      props:{
        value:'label'
      },
      addSupplierState:false,
      form:{address:[]},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'supplier_name',label:'供应商名称',},
          {prop:'supplier_code',label:'供应商编码',},
          {prop:'contact_person',label:'联系人',},
          {prop:'tel',label:'电话',},
          {prop:'phone',label:'手机号',},
          {prop:'province',label:'省',},
          {prop:'city',label:'市',},
          {prop:'district',label:'区',},
          {prop:'detail_address',label:'详细地址',},
          {prop:'fax',label:'传真',},
          {prop:'post_code',label:'邮编',},
          {prop:'qq',label:'QQ',},
          {prop:'tax_rate',label:'开票税率',},
          {prop:'wechat',label:'微信号',},
          {prop:'supplier_type_name',label:'供应商分类名称',},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom"},
          // {prop:'is_delete',type:'tag',label:'状态',data:[{type:'danger',key:2,name:'已删除'}],},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    supplierTypeMethod(e){
        this.loading=true
      supplierTypeList({supplier_type_name:e}).then(res=>{
          this.supplierTypeArray=res.data.data
          this.loading=false
        })
    },
    // 删除
    delSupplier(){
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
          let form ={...this.form}
          console.log(form)
          form.province=form.address[0]
          form.city=form.address[1]
          form.district=form.address[2]
          if(this.form.id){
            edit(form).then(()=>{
              this.addSupplierState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            add(form).then(()=>{
              this.addSupplierState=false
              this.$message.success('添加成功')
              this.getList()
            })

          }
        }
      })
    },
    //打开弹窗
    changeSupplier(e){
      this.supplierTypeMethod()
      if (e==='add'){
        this.form={address:[]}
        this.addSupplierState=true
      }else{
        if(this.selectRow){
          this.form={...this.selectRow,address:[this.selectRow.province,this.selectRow.city,this.selectRow.district]}
          this.addSupplierState=true
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