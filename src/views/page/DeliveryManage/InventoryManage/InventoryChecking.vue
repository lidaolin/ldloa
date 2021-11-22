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
          <el-form-item label="商品规格名称:" ref="product_sku_id" prop="product_sku_id" :rules="{ required: true, message: '商品规格名称不能为空', trigger: 'blur' }">
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
        <el-form-item label="申购部门" prop="department" :rules="[{ required: true, message: '申购部门不能为空'}]">
          <el-select v-model="form.department">
            <el-option
              v-for="(item,index) in departmentArr"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
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
    <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" v-model="tabPaneValue" class="ldlTab" @tab-click="changeTab" style="height: calc(100% - 4px)">
        <el-tab-pane label="操作日志" name="getStockLog" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="type"
                width="100"
                align="center"
                label="操作类型">
            </el-table-column>
            <el-table-column
                prop="remark"
                align="center"
                label="备注信息">
            </el-table-column>
            <el-table-column
                prop="user_id"
                align="center"
                width="140"
                label="操作人">
            </el-table-column>
            <el-table-column
                prop="create_time"
                align="center"
                width="140"
                label="时间">
              <template slot-scope="{row}">
                {{row.create_time | parseTime('')}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ldlControlWindow>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {stockCheckList, add, edit, getDetails, stockCheckSubmit, stockCheckConfirm, pd_log} from "@/api/DeliveryManage/InventoryManage/InventoryChecking";
import {distributCompany} from "@/api/DeliveryManage/DeliverySettings/AreaMaintenance";
import {getSku, simpleList} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";
import ldlControlWindow from "@/components/ldlControlWindow";

export default {
  name: "InventoryChecking",
  components:{
    ldlTablePagination,
    buttonBox,
    ldlControlWindow,
  },
  data(){
    return{
      getStockLog:[],
      bottomList:{getStockLog:[]},
      tabPaneValue:'getStockLog',
      addAttributeState:false,
      form:{},
      editFrom:{},
      loading:false,//控制搜索加载的
      companyId_arr:[],//配送数组
      product_id_arr:[],//商品数组
      product_sku_id_arr:[],//商品规格
      departmentArr: [
        "品牌运营部",
        "市场运营部",
        "产品部",
        "总部客服部",
        "合肥配送",
        "人事部",
        "财务部",
        "其他",
      ],
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
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'pandian_code',label:'单号',width:160,},
          {prop:'pandian_status',type:'tag',label:'状态',data:[{type:'warning',key:1,name:'录入'},{type:'success',key:2,name:'提交'},{type:'primary',key:3,name:'确认'}],},
          {prop:'product_id',label:'商品名称',width:160,},
          {prop:'product_sku_name',label:'商品规格名称',width:160,},
          {prop:'company_id',label:'单位名称',},
          {prop:'manyorless',label:'多或少',},
          {prop:'number',label:'数量',sortable:"custom"},
          {prop:'release_money',label:'释放金额',},
          {prop:'zeren_money',label:'责任金额',sortable:"custom"},
          {prop:'reason',label:'盘点原因'},
          {prop:'remark',label:'备注信息'},
          {prop:'responsible',label:'责任方',data:[{key:1,name:'本单位'},{key:2,name:'总部'}],},
          {prop:'department',label:'申购部门',},
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
      this.changeTab()
    },

    //获取详情
    getAllinfo(id){
      getDetails(id).then((res)=>{
        this.editFrom = res.data
      })
    },

    //获取操作日志
    getPdLog(id){
      pd_log({id:id}).then((res)=>{
        this.editFrom = res.data
      })
    },

    changeTab(){
      let e = this.selectRow
      if(this.tabPaneValue==='getStockLog'){
        pd_log({id:e.id}).then(res=>{
          this.bottomList.getStockLog=res.data
        })
      }
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
      this.form.product_sku_id = ''
      // this.$refs.form.resetFielld('product_sku_id')
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
            id:this.editFrom.id,
            company_id:this.editFrom.company_id,
            product_id:this.editFrom.product_id,
            product_sku_id:this.editFrom.product_sku_id,
            manyorless:this.editFrom.manyorless,
            number:this.editFrom.number,
            responsible:this.editFrom.responsible,
            reason:this.editFrom.reason,
            department:this.editFrom.department
          }
          this.brandMethod_goodsSku(this.form.product_id)
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{

        this.form={
          responsible:1,
          product_sku_id:''
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