<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :selectionList.sync="selectionList" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="40%"
        custom-class="minWidth600"
        :visible.sync="ManualSplitState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        title="手动拆分"
        size="mini"
        center
    >
      <span style="font-size: 12px;color: red">*商品为0不拆分此商品</span>
      <br>
      <br>
      <el-table
          :data="selectGoodsList"
          size="mini"
          border
          style="width: 100%">
        <el-table-column
            prop="product_name"
            label="商品">
        </el-table-column>
        <el-table-column
            prop="sku_name"
            label="属性">
        </el-table-column>
        <el-table-column
            prop="weight"
            width="80"
            label="价格">
        </el-table-column>
        <el-table-column
            prop="number"
            label="数目">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.number" :min="0" :max="scope.row.max_number" size="mini" :step="1"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <br>
      包装箱型：
      <el-select
          size="mini"
          v-model="bz_xin"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="boxMethod"
          :loading="loading">
        <el-option
            v-for="item in box_arr"
            :key="item.packname"
            :label="item.packname"
            :value="item.packname">
        </el-option>
      </el-select>
      <br>
      <br>
      备注信息：
      <br>
      <br>
      <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
          v-model="remarks">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ManualSplitState = false">取 消</el-button>
        <el-button type="primary" @click="onManualSplitSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        v-el-drag-dialog
        width="40%"
        custom-class="minWidth400"
        :visible.sync="AuditState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        title="审核"
        size="mini"
        center
    >
      <el-form ref="AuditForm" :model="AuditForm" label-width="100px" size="mini" >
        <el-form-item label="快递公司:" prop="express_id" :rules="{ required: true, message: '快递公司不能为空', trigger: 'blur' }">
          <el-select
              v-model="AuditForm.express_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod_kd"
              :loading="loading">
            <el-option
                v-for="item in kd_id_arr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包货箱型:" prop="bz_xin" :rules="{ required: true, message: '快递公司不能为空', trigger: 'blur' }">
          <el-select
              v-model="AuditForm.bz_xin"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="boxMethod"
              :loading="loading">
            <el-option
                v-for="item in box_arr"
                :key="item.packname"
                :label="item.packname"
                :value="item.packname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="elFormItemFlex" label="备注信息:" prop="remarks" >
          <el-input type="textarea" v-model="AuditForm.remarks" placeholder="请填写备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AuditState = false">取 消</el-button>
        <el-button type="primary" @click="onAuditSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {p_list,boxSimpleList,batch_review,p_merge,p_split,cancel_intercept,intercept,orderShipping,manual_product_list,manual_split} from "@/api/DeliveryManage/DeliverGoodsManage/OrderManage";
import {searchKdList} from "@/api/DeliveryManage/DeliverySettings/ExpressCompany";
export default {
name: "OrderManage",
  data(){
    return{
      bz_xin:'',
      remarks:'',
      selectGoodsList:[],
      ManualSplitState:false,
      loading:false,
      kd_id_arr:[],
      box_arr:[],
      AuditForm:{},
      AuditState:false,
      form:{address:[]},
      /**必要参数*/
      selectionList:undefined,//多选
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {type:'selection',width: 35},
          {prop:'plfahuo_code',label:'发货单号',width: 150},
          {prop:'intercept_status',label:'是否拦截',type:'tag',data:[{type:'',key:1,name:'未拦截'},{type:'danger',key:2,name:'已拦截'}],},
          {prop:'plfahuo_status',label:'状态',},
          {prop:'is_after_sale',label:'是否售后申请',type:'tag',data:[{type:'danger',key:1,name:'否'},{type:'success',key:2,name:'是'}]},
          {prop:'create_time',label:'创建时间',type:"date",width:140,sortable:"custom",},
          {prop:'guzong',label:'估重',sortable:"custom"},
          {prop:'shizong',label:'实重',sortable:"custom"},
          {prop:'bz_xin',label:'包货箱型',},
          {prop:'product_number',label:'商品数量',sortable:"custom"},
          {prop:'ps_fee',label:'配送费用',sortable:"custom"},
          {prop:'companyName',label:'配送单位',},
          {prop:'sj_name',label:'收件人姓名',},
          {prop:'sj_phone',label:'收件人手机',},
          {prop:'province',label:'省',},
          {prop:'city',label:'市',},
          {prop:'area',label:'区',},
          {prop:'address',label:'详细地址', width: 120},
          {prop:'plfahuo_characteristic',type:'tag',label:'发货单标识',data:[{type:'danger',key:2,name:'拆分单'},{type:'success',key:3,name:'合并单'}],},
          {prop:'express_status',type:'tag',label:'快递单打印状态',width:100,data:[{type:'info',key:1,name:'未打印'},{type:'',key:2,name:'打印成功'},{type:'danger',key:2,name:'打印失败'}],},
          {prop:'qingdan_status',type:'tag',label:'清单打印状态',width:100,data:[{type:'info',key:1,name:'未打印'},{type:'',key:2,name:'打印成功'}],},
          {prop:'k_dy_time',label:'快递单打印时间',type:"date",sortable:"custom",width:140},
          {prop:'qd_dy_time',label:'清单打印时间',type:"date",sortable:"custom",width:140},
          {prop:'examine_time',label:'审单时间',type:"date",sortable:"custom",width:140},
          {prop:'ship_time',label:'发货时间',type:"date",sortable:"custom",width:140},
          {prop:'sign_time',label:'签收时间',type:"date",sortable:"custom",width:140},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    onManualSplitSubmit(){
      let delList=[]
      let selectGoodsList=[...this.selectGoodsList]
      console.log(selectGoodsList)
      for (let i = 0; i < this.selectGoodsList.length; i++) {
        if (this.selectGoodsList[i].number===0){
          delList.push(i)
        }
      }
      if (delList.length>0){
        for (let i = delList.length-1; i >= 0 ; i--) {
          selectGoodsList.splice(delList[i],1)
        }
      }
      manual_split({id:this.selectRow.id,product:selectGoodsList,remarks:this.remarks,bz_xin:this.bz_xin}).then(res=>{
        this.ManualSplitState=false
        this.getList()
        this.$message.success(res.msg)
      })
    },
    //运费计算
    countFreight(){
      if(this.selectRow){
        orderShipping({plfahuo_id:this.selectRow.id}).then(res=>{
          this.$alert(res.data, '快递费用', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          });
        })
      }else{
        this.$message.error('请点击选中一行')
      }
    },
    //取消拦截
    removeIntercept(){
      if(this.selectRow){
        this.$confirm('是否取消拦截?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancel_intercept({id:this.selectRow.id}).then(res=>{
              this.getList()
              this.$message.success(res.msg)
          })
        }).catch(() => {});
      }else{
        this.$message.error('请点击选中一行')
      }
    },
    //订单拦截
    orderIntercept(){
      if(this.selectRow){
        this.$confirm('是否拦截此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          intercept({id:this.selectRow.id}).then(res=>{
            this.getList()
            this.$message.success(res.msg)
          })

        }).catch(() => {});
      }else{
        this.$message.error('请点击选中一行')
      }
    },
    //手动拆分
    ManualSplit(){
      if(this.selectRow){
        this.remarks=''
        this.bz_xin=''
        this.boxMethod()
        manual_product_list({id:this.selectRow.id}).then(res=>{
          this.selectGoodsList=res.data
          this.ManualSplitState=true
        })
      }else{
        this.$message.error('请点击选中一行')
      }
    },
    //自动拆分
    autoSplit(){
      if(this.selectRow){
        this.$prompt('请输入备注信息', '订单合并', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          p_split({id:this.selectRow.id,remarks: value}).then(res=>{
            this.$message.success(res.msg)
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }else{
        this.$message.error('请点击选中一行')
      }
    },
    //多个提示
    MultipleTips(res){
      let that=this
      for (let i = 0; i < res.data.length; i++) {
        if(res.data[i].code){
          setTimeout(function () {
            that.$message({
              showClose: true,
              message: res.data[i].msg,
              duration:0,
              type: 'success'
            });
          }, 500);
        }else{
          setTimeout(function () {
            // 这里就是处理的事件
            that.$message({
              showClose: true,
              message: res.data[i].msg,
              duration:0,
              type: 'error'
            });
          }, 500);
        }
      }
    },
    //提交审核弹窗
    onAuditSubmit(){
      batch_review(this.AuditForm).then(res=>{
        this.MultipleTips(res)
        this.AuditState=false
        this.getList()
      })
    },
    //订单合并
    orderMerge (){
      if(this.selectionList){
        let data=[]
        for (let i = 0; i < this.selectionList.length; i++) {
          data.push(this.selectionList[i].id)
        }
          this.$prompt('请输入备注信息', '订单合并', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            p_merge({ids:data,remarks: value}).then(res=>{
              // this.MultipleTips(res)
              this.$message.success(res.msg)
              this.getList()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
      }else{
        this.$message.error('请在左侧多选选择')
      }
    },
    //打开审核弹窗
    Audit(){
      if(this.selectionList){
        this.AuditState=true
        let data=[]
        for (let i = 0; i < this.selectionList.length; i++) {
          data.push(this.selectionList[i].id)
        }
        this.boxMethod()
        this.brandMethod_kd()
        this.AuditForm={ids:data}
      }else{
        this.$message.error('请在左侧多选选择')
      }
    },
    // 快递公司搜索
    brandMethod_kd(e){
      this.loading=true
      searchKdList({name:e}).then(res=>{
        this.kd_id_arr=res.data
        this.loading=false
      })
    },
    //箱型搜索
    boxMethod(e){
      this.loading=true
      boxSimpleList({packname:e}).then(res=>{
        this.box_arr=res.data
        this.loading=false
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
      p_list(this.pagingData).then(res=>{
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