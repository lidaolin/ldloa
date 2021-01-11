<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth600"
        :visible.sync="addAttributeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="120px" size="mini" >
        <el-form-item label="配送公司:" prop="company_id" :rules="{ required: true, message: '请填写配送公司名称', trigger: 'blur' }">
          <el-select
              style="width: 100%"
              v-model="form.company_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod"
              :loading="loading">
            <el-option
                v-for="item in companyId_arr"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称:" prop="product_id" :rules="{ required: true, message: '商品名称不能为空', trigger: 'blur' }">
          <el-select
              style="width: 100%"
              size="mini"
              v-model="form.product_id"
              @change="changeSelectGoods"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod_goods"
              :loading="loading">
            <el-option
                v-for="item in product_id_arr"
                :key="item.id"
                :label="item.product_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="商品规格名称:" prop="product_sku_id" :rules="{ required: true, message: '商品规格名称不能为空', trigger: 'blur' }">
            <el-select
                style="width: 100%"
                size="mini"
                v-model="form.product_sku_id"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="brandMethod_goodsSku">
              <el-option
                  v-for="(item,index) in product_sku_id_arr"
                  :key="item.id"
                  :label="getName(index)"
                  :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number
              v-model="form.number"
              controls-position="right"
              placeholder="请输入数量"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="多或少" prop="manyorless" :rules="[{ required: true, message: '多或少不能为空'}]">
          <el-radio-group v-model="form.manyorless">
            <el-radio :label="1">多</el-radio>
            <el-radio :label="2">少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="责任方" prop="responsible" :rules="[{ required: true, message: '责任方不能为空'}]">
          <el-radio-group v-model="form.responsible">
            <el-radio :label="1">本单位</el-radio>
            <el-radio :label="2">总部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原因" prop="reason" :rules="[{ required: true, message: '原因不能为空'}]">
          <el-select v-model="form.reason" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
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
import {stockCheckList, add, edit, getDetails, stockCheckSubmit, stockCheckConfirm} from "@/api/DeliveryManage/InventoryManage/InventoryChecking";
import {distributCompany} from "@/api/DeliveryManage/DeliverySettings/AreaMaintenance";
import {getSku, simpleList} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";

export default {
  name: "InventoryChecking",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      addAttributeState:false,
      form:{},
      editFrom:{},
      loading:false,//控制搜索加载的
      companyId_arr:[],//配送数组
      product_id_arr:[],//商品数组
      product_sku_id_arr:[],//商品规格
      options:[
          {value:1,label:"产品过期"},
          {value:2,label:"产品损坏"},
          {value:3,label:"保管不善"},
          {value:4,label:"运输损坏"},
          {value:5,label:"总部申请"},
          {value:6,label:"活动盘点"},
      ],
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'pandian_code',label:'单号',},
          {prop:'pandian_status',type:'tag',label:'状态',data:[{type:'warning',key:1,name:'录入'},{type:'success',key:2,name:'提交'},{type:'primary',key:3,name:'确认'}],},
          {prop:'product_id',label:'商品名称',},
          {prop:'product_sku_name',label:'商品规格名称',},
          {prop:'company_id',label:'单位名称',},
          {prop:'manyorless',label:'多或少',},
          {prop:'number',label:'数量',sortable:"custom"},
          {prop:'release_money',label:'释放金额',},
          {prop:'zeren_money',label:'责任金额',sortable:"custom"},
          {prop:'reason',label:'盘点原因'},
          // {prop:'remarks',label:'备注信息'},
          {prop:'responsible',label:'责任方',data:[{key:1,name:'本单位'},{key:2,name:'总部'}],},
          {prop:'submit_time',label:'提交时间',type:"date",sortable:"custom"},
          {prop:'affirm_time',label:'确认时间',type:"date",sortable:"custom"},
          {prop:'create_time',label:'录入时间',type:"date",sortable:"custom"},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  // watch:{
  //   form:function (newVal,oldVal){
  //     console.log(newVal.product_id,'*********')
  //     console.log(oldVal.product_id,'----------')
  //     if(newVal.product_id !== oldVal.product_id){
  //       this.form.product_sku_id = null
  //     }
  //   }
  // },
  computed:{
    getName(){
      return function (e){
        let product_sku_id_arr=[... this.product_sku_id_arr]
        let name=''
        for (let i = 0; i < product_sku_id_arr[e].product_attr_val_pash.length; i++) {
          let item= product_sku_id_arr[e].product_attr_val_pash[i]
          name+=item.attr_name+'：'+item.val_name+','
        }
        return name
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  methods:{

    //提交
    submitRemarks(){
      if(this.selectRow){
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(({ value }) => {
          let data = {
            id:this.selectRow.id,
            remarks:value
          }
          stockCheckSubmit(data).then(()=>{
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            this.getList()
          }).catch(() => {});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }else{
        this.$message.error('请选中一行')
      }
    },

    //确认
    confirmRemarks(){
      if(this.selectRow){
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(({ value }) => {
          let data = {
            id:this.selectRow.id,
            remarks:value
          }
          stockCheckConfirm(data).then(()=>{
            this.$message({
              type: 'success',
              message: '确认成功'
            });
            this.getList()
          }).catch(() => {});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }else{
        this.$message.error('请选中一行')
      }
    },

    listClick(val){
      this.getAllinfo(val.id)
    },

    //获取详情
    getAllinfo(id){
      getDetails(id).then((res)=>{
        this.editFrom = res.data
      })
    },

    // 配送公司搜索
    brandMethod(e){
      this.loading=true
      distributCompany({name:e,type:5}).then(res=>{
        this.companyId_arr=res.data
        this.loading=false
      })
    },

    // 商品名称搜索
    brandMethod_goods(e){
      this.loading=true
      simpleList({product_name:e}).then(res=>{
        this.product_id_arr=res.data
        this.loading=false
      })
    },

    //选中商品触发联动，选择商品规格
    changeSelectGoods(){
      if(this.form.product_id){
        getSku({product_id:this.form.product_id}).then(res=>{
          this.product_sku_id_arr=res.data
        })
      }

    },

    // 商品规格名称搜索
    brandMethod_goodsSku(){
      getSku({product_id:this.form.product_id}).then(res=>{
        this.product_sku_id_arr=res.data
      })
    },


    //新增/修改
    changeAttribute(e){
      if(e==='edit'){
        if(this.selectRow){
          this.form = {
            company_id:this.editFrom.company_id,
            product_id:this.editFrom.product_id,
            product_sku_id:this.editFrom.product_sku_id,
            manyorless:this.editFrom.manyorless,
            number:this.editFrom.number,
            responsible:this.editFrom.responsible,
            reason:this.editFrom.reason,
          }
          this.brandMethod_goodsSku(this.form.product_id)
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{

        this.form={
          responsible:1,
        }
        this.$nextTick(function () {
          this.$refs.form.clearValidate();
        });
        this.addAttributeState=true
      }
      this.brandMethod()
      this.brandMethod_goods()
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
      stockCheckList(this.pagingData).then(res=>{
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