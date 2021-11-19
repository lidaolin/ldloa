<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        top="5%"
        width="30%"
        custom-class="minWidth400"
        :visible.sync="dialogVisibleState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini" >
        <el-form-item label="销售单号:" prop="order_code" :rules="{ required: true, message: '请填写销售单号', trigger: 'blur' }">
          <el-input v-model="form.order_code" placeholder="请输入销售单号" @input="getGoodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品名称:">
          <el-select v-model="form.product_id_arr" value-key="ids" placeholder="请选择" clearable>
            <el-option
                v-for="item in product_id_arr"
                :key="item.ids"
                :label="item.product_name+'——'+item.sku_name"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片:" prop="remarks_img">
        <el-upload
            class="avatar-uploader"
            action="/admin/upload_image/upload"
            name="file"
            :show-file-list="false"
            :on-success="(e)=>{handleSuccess(e,'remarks_img')}">
          <img v-if="form.remarks_img" alt="" :src="form.remarks_img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
        <el-form-item label="生产日期:" prop="produce_date" :rules="{ required: true, message: '请选择生产日期', trigger: 'blur' }">
          <el-date-picker v-model="form.produce_date" type="date" format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注说明:" prop="remarks" >
          <el-input type="textarea" v-model="form.remarks" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleState=false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {ke_list, add, edit, del, ke_get_product} from "@/api/DeliveryManage/AftercareServices/CustomerService";

export default {
  name: "CustomerService",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'order_code',label:'订单编号',},
          {prop:'product_name',label:'商品名称'},
          {prop:'sku_name',label:'商品规格'},
          {prop:'remarks',label:'备注信息'},
          {prop:'produce_date',label:'生产时间', type: "date",sortable:"custom"},
          {prop:'the_date',label:'订单创建时间', type: "date",sortable:"custom"},
          {prop:'ship_date',label:'发货时间', type: "date",sortable:"custom"},
          {prop: 'user_id', label: '创建人',},
          {prop:'create_time',label:'创建时间', type: "date",sortable:"custom",},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
      //新增编辑弹框
      product_id_arr:[],
      dialogVisibleState:false,
      form:{},
      //新增编辑弹框
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  methods:{

    // 绑定input事件
    getGoodsName(e) {
      var val = e
      const _field = this.$refs['form'].fields
      _field.map(i => {
        if (i.prop === 'product_id') {
          i.resetField()
          return false
        }
      })
      ke_get_product({order_code:val}).then(res => {
        if(res.data.code){
          this.$message.warning(res.data.msg)
          this.product_id_arr = []
        }else{
          this.product_id_arr = res.data
        }
      })
    },

    //编辑还是新增
    changeCompensate(e){
      if(e==='add'){
        this.form={}
        this.dialogVisibleState=true
      }else{
        if(this.selectRow){
          this.form={
          ...this.selectRow,
          product_id_arr:{
            "ids": this.selectRow.ids,
            "product_name": this.selectRow.product_name,
            "sku_name": this.selectRow.sku_name,
            "product_id": this.selectRow.product_id,
            "attr_val_ids": this.selectRow.attr_val_ids,
            }
          }
          ke_get_product({order_code:this.selectRow.order_code}).then(res => {
            if(res.data.code){
              this.$message.warning(res.data.msg)
              this.product_id_arr = []
            }else{
              this.product_id_arr = res.data
            }
          })
          this.dialogVisibleState=true
        }else{
          this.$message.error('请选中一行')
        }
      }
    },

    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if(this.form.id){
            let form ={
            id:this.form.id,
            order_code:this.form.order_code,
            product_id:this.form.product_id_arr.product_id,
            attr_val_ids:this.form.product_id_arr.attr_val_ids,
            produce_date:this.form.produce_date,
            remarks_img:this.form.remarks_img,
            remarks:this.form.remarks,
          }
            edit(form).then(()=>{
              this.dialogVisibleState=false
              this.$message.success('修改成功')
              this.getList()
            })
          }else{
            let form ={
            order_code:this.form.order_code,
            product_id:this.form.product_id_arr.product_id,
            attr_val_ids:this.form.product_id_arr.attr_val_ids,
            produce_date:this.form.produce_date,
            remarks_img:this.form.remarks_img,
            remarks:this.form.remarks,
          }
            add(form).then(()=>{
              this.dialogVisibleState=false
              this.$message.success('添加成功')
              this.getList()
            })
          }
        }
      })
    },

    dele(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
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

    //图片上传成功
    handleSuccess(e,name){
      let form= {... this.form}
      form[name]=e.data.url
      this.form={... form}
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
      ke_list(this.pagingData).then(res=>{
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