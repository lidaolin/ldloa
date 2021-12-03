<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination  @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow  class="ldlTab" :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" style="height: calc(100% - 4px)">
        <el-tab-pane label="退换货明细" :disabled="!selectRow" style="height: calc(100% - 4px)">
          <el-table
              :data="applyGoodsArr"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_name"
                width="300"
                align="center"
                label="产品名称">
            </el-table-column>
            <el-table-column prop="cover_link_img" width="100" align="center" label="产品封面图">
              <template slot-scope="{row}">
                <el-image
                    style="width: 50px; height: 50px" :src="row.cover_link_img" fit="cover"></el-image>
              </template>
            </el-table-column>
            <el-table-column
                prop="val_name"
                align="center"
                label="退换货产品规格">
            </el-table-column>
            <el-table-column
                prop="price"
                width="110"
                align="center"
                label="产品购买时单价">
            </el-table-column>
            <el-table-column
                prop="number"
                width="110"
                align="center"
                label="申请退换货数量">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="退换货客户信息" :disabled="!selectRow" style="height: calc(100% - 4px)">
          <el-form v-model="customerInfoList" label-position="left" inline class="demo-table-expand">
            <el-form-item label="昵称：">
              <span>{{ customerInfoList.nickName }}</span>
            </el-form-item>
            <el-form-item label="头像：">
              <el-image style="width: 50px; height: 50px" :src="customerInfoList.headPortrait" fit="cover">
              </el-image>
            </el-form-item>
            <el-form-item label="性别：">
              <span v-if="customerInfoList.sex == 1">男</span>
              <span v-if="customerInfoList.sex == 2">女</span>
              <span v-if="customerInfoList.sex == 3">未知</span>
            </el-form-item>
            <el-form-item label="手机号：">
              <span>{{ customerInfoList.customerPhone }}</span>
            </el-form-item>
            <el-form-item label="微信号：">
              <span>{{ customerInfoList.customerwechat }}</span>
            </el-form-item>
            <el-form-item label="客户来源：">
              <span>{{ customerInfoList.sourceName }}</span>
            </el-form-item>
            <el-form-item label="客户类型：">
              <span>{{ customerInfoList.typeName }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="原订单信息" :disabled="!selectRow" style="height: calc(100% - 4px)">
          <el-form v-model="orderInfoList" label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单号：">
              <span>{{ orderInfoList.order_code }}</span>
            </el-form-item>
            <el-form-item label="订单状态：">
              <span>{{ orderInfoList.status_ex }}</span>
            </el-form-item>
            <el-form-item label="客户付款总额：">
              <span>{{ orderInfoList.ke_zf_fee }}</span>
            </el-form-item>
            <el-form-item label="付款方式：">
              <span>{{ orderInfoList.pay_type }}</span>
            </el-form-item>
            <el-form-item label="下单时间：">
              <span>{{ orderInfoList.create_time }}</span>
            </el-form-item>
            <el-form-item label="付款时间：">
              <span>{{ orderInfoList.pay_time }}</span>
            </el-form-item>
            <el-form-item label="发货时间：">
              <span>{{ orderInfoList.ship_time }}</span>
            </el-form-item>
            <el-form-item label="签收时间：">
              <span>{{ orderInfoList.sign_time }}</span>
            </el-form-item>
          </el-form>
          <div>
            <p style="margin: 0">订单商品信息：</p>
            <div class="orderInfo" v-for="(item,index) in orderInfoList.order_product" :key="index">
              <p>商品名称：{{item.product_name}}</p>
              <p>商品封面图：<el-image style="width: 50px; height: 50px;float: right;" :src="item.cover_link_img" fit="cover"></el-image></p>
              <p>
                商品规格：
                <span v-for="(oitem,oindex) in item.val_name" :key="oindex">{{oitem}}； </span>
              </p>
              <p>商品单价：{{item.price}}</p>
              <p>数量：{{item.number}}</p>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="操作日志" :disabled="!selectRow" style="height: calc(100% - 4px)">
          <el-table
              :data="logList"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="type"
                align="center"
                label="审核类型">
            </el-table-column>
            <el-table-column
                prop="remark"
                align="center"
                label="备注">
            </el-table-column>
            <el-table-column
                prop="user_name"
                align="center"
                width="80"
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
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth500"
        :visible.sync="addAttributeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        title="审核"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="170px" size="mini" >
        <el-form-item label="审核状态:" prop="apply_status" :rules="{ required: true, message: '审核状态不能为空', trigger: 'blur' }">
          <el-radio-group v-model="form.apply_status">
            <el-radio :label="3">客服驳回</el-radio>
            <el-radio :label="2">客服受理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.apply_status == 3" label="审核备注或拒绝理由:" prop="remark" :rules="{ required: true, message: '退货原因不能为空', trigger: 'blur' }">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入原因"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
          <el-button @click="addAttributeState=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
        v-el-drag-dialog
        top="3%"
        width="60%"
        custom-class="minWidth700"
        :visible.sync="inputDialogVisible"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        title="售后录入"
        size="mini"
        center
    >
      <el-form style="padding-right:5px;" ref="inputForm" label-position="left" :model="inputForm" label-width="100px" size="mini" >
        <el-form-item label="订单编号:" prop="order_code" :rules="{ required: true, message: '退货原因不能为空', trigger: 'blur' }">
          <el-input placeholder="请输入订单号" v-model="inputForm.order_code" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-form-item>
        <div v-if="orderInfo.order_code">
        <el-form-item label="申请类型" prop="apply_type" :rules="{ required: true, message: '申请类型不能为空', trigger: 'blur' }">
          <el-radio-group v-model="inputForm.apply_type">
            <el-radio :label="1">退款（无须退货）</el-radio>
            <el-radio :label="2">退款退货</el-radio>
            <el-radio :label="3">换货</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收货状态" prop="receipt_status" :rules="{ required: true, message: '收货状态不能为空', trigger: 'blur' }">
          <el-radio-group v-model="inputForm.receipt_status">
            <el-radio :label="1">未收到货</el-radio>
            <el-radio :label="2">已收到货（仅针对退款）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请原因" prop="refund_reason_id" :rules="{ required: true, message: '申请原因不能为空', trigger: 'blur' }">
           <el-select v-model="inputForm.refund_reason_id" clearable filterable :filter-method="getRefund" placeholder="请选择">
            <el-option
              v-for="item in refund_reason_id_arr"
              :key="item.reason_id"
              :label="item.name"
              :value="item.reason_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款责任" prop="return_reason_id" :rules="{ required: true, message: '退款责任不能为空', trigger: 'blur' }">
           <el-select v-model="inputForm.return_reason_id" clearable filterable :filter-method="getReturn" placeholder="请选择">
            <el-option
              v-for="item in return_reason_id_arr"
              :key="item.cause_id"
              :label="item.cause_name"
              :value="item.cause_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货责任金" prop="liability_amount" :rules="{ required: true, message: '退货责任金不能为空', trigger: 'blur' }">
           <el-input-number style="width: 193px;" v-model="inputForm.liability_amount" controls-position="right" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="售后商品">
          <div style="margin-bottom: 20px;" v-if="orderInfo.product">
            <el-table
            :data="orderInfo.product"
            border
            height="300px"
            size='mini'
            style="width: 100%">
            <el-table-column
              prop="product_name"
              label="商品名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="val_name"
              label="商品规格"
              align="center">
                <template slot-scope="scope">
                  <div v-for="(item,index) of scope.row.val_name" :key="index">{{item}}</div>
                </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格"
              align="center">
            </el-table-column>
            <el-table-column
              prop="val_name"
              label="商品规格"
              align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.shop_type==1?'普通商品':'加购商品'}}</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="购买数量"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作" 
              align="center">
                <template slot-scope="scope">
                  <el-button @click="handleDle(scope.$index,orderInfo.product)" size="small">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
          </div> 
        </el-form-item>
        <el-form-item label="退款金额" prop="refund_money" :rules="{ required: true, message: '退款金额不能为空', trigger: 'blur' }">
           <el-input-number style="width: 193px;" v-model="inputForm.refund_money" controls-position="right" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="退款凭证图片">
           <el-upload
              action="/api/admin/upload_image/upload"
              list-type="picture-card"
              multiple
              show-file-list
              accept="image/*"
              :file-list.sync="view_text"
              :on-success="uploadSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="备注">
           <el-input v-model="inputForm.refund_reason_mark" type="textarea" />
        </el-form-item>
        <div>
          <div style="border: 1px dashed #EBEEF5; padding:5px; margin-bottom: 20px;">
            <h4>订单信息：</h4>
            <el-row style="margin-bottom: 20px;">
              <el-col :span="8">订单编号：{{orderInfo.order_code}}</el-col>
              <el-col :span="8">优惠金额：{{orderInfo.discount_fee}}</el-col>
              <el-col :span="8">商品金额：{{orderInfo.product_fee}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">运费：{{orderInfo.ke_zf_freight}}</el-col>
              <el-col :span="8">支付金额：{{orderInfo.ke_zf_fee}}</el-col>
            </el-row>
          </div>
          <div style="border: 1px dashed #EBEEF5; padding:5px; margin-bottom: 20px;" v-if="orderInfo.address">
            <h4>收货信息：</h4>
            <el-row style="margin-bottom: 20px;">
              <el-col :span="8">收件人：{{orderInfo.address.sj_name}}</el-col>
              <el-col :span="8">手机号：{{orderInfo.address.sj_phone}}</el-col>
              <el-col :span="8">省市区：{{orderInfo.address.province+'/'+orderInfo.address.city+'/'+orderInfo.address.area}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">详细地址：{{orderInfo.address.address}}</el-col>
            </el-row>
          </div>
        </div>
        <el-form-item>
          <div style="text-align: right;">
            <el-button @click="inputDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="onInput">录 入</el-button>
          </div>
        </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index, customerInfo, orderInfo, toExamine, log, refund, replace, cancelRefund, addRefund, searchOrder, refundReason, returnReason} from "@/api/DeliveryManage/AftercareServices/ReturnRequest";
export default {
  name: "ReturnRequest",
  components:{
    ldlControlWindow,
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      //售后录入
      inputDialogVisible: false,
      inputForm:{},
      orderInfo:{},
      refund_reason_id_arr:[],
      return_reason_id_arr:[],
      view_text:[],
      dialogImageUrl: '',
      dialogVisible: false,
      //售后录入
      addAttributeState:false,
      form:{},
      applyGoodsArr:[],
      logList:[],
      orderInfoList: {},
      customerInfoList: {},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'refund_code',label:'退换货编号',width: 150,},
          {prop:'order_code',label:'订单编号',width: 150,},
          {prop:'apply_type',type:'tag',label:'申请类型',data:[{type:'warning',key:1,name:'退款'},{type:'danger',key:2,name:'退款退货'},{type:'info',key:3,name:'换货'}],},
          {prop:'apply_status',type:'tag',label:'申请状态',data:[{type:'warning',key:1,name:'客服审核'},{type:'danger',key:2,name:'客服受理'},{type:'info',key:3,name:'客服驳回'},{type:'',key:4,name:'退款成功'},{type:'success',key:5,name:'换货成功'},{type:'success',key:6,name:'申请撤销'},{type:'info',key:7,name:'填写物流'},{type:'success',key:8,name:'填写物流超时'},],},
          {prop:'receipt_status',label:'客户收货状态',type:'tag',data:[{type:'danger',key:1,name:'未收到货'},{type:'success',key:2,name:'已收到货'},],},
          {prop:'refund_reason_mark',label:'退款说明',},
          {prop:"refund_reason_image",label:"退款凭证图片",type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop:'refund_money',label:'退款总金额',sortable:"custom",width: 100,},
          {prop:'nickName',label:'用户昵称',},
          {prop:'headPortrait',label:'用户头像',type:'image',fit:'',imgStyle:{width:'50px',height:'50px'}},
          {prop:'reason_name',label:'申请原因',},
          {prop:'refund_express_no',label:'退换货买家回寄快递单号',width: 150,},
          {prop:'express_no',label:'退换货商家回寄物流单号',width: 150,},
          {prop:'create_time',label:'申请时间',type:"date",sortable:"custom",width:130},
          {prop:'refund_time',label:'退款时间',type:"date",sortable:"custom",width:130},
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

    //上传成功
    uploadSuccess(response, file, fileList){
      let that = this
      let view_text=[]
      fileList.forEach(function (item) {
        if (item.response){
          view_text.push({name:'图片'+item.name,url:item.response.data.url})
        }else{
          view_text.push(item)
        }
      });
      that.view_text=view_text
    },

    //多图的上传完成点击图片的钩子
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //多图的删除
    handleRemove(file, fileList) {
      this.view_text=fileList
    },

    //搜索订单
    searchOrder(){
      let data = {
        order_code:this.inputForm.order_code
      }
      if(data.order_code){
        searchOrder(data).then(res=>{
          this.orderInfo = res.data
        })
      }else{
        this.$message({
          type: 'warning',
          message: '请输入订单编号'
        });
      }

    },

    //获取申请原因
    getRefund(){
      refundReason().then(res=>{
        this.refund_reason_id_arr = res.data
      })
    },

    //获取退款责任
    getReturn(){
      returnReason().then(res=>{
        this.return_reason_id_arr = res.data
      })
    },

    //删除商品
    handleDle(index, rows){
      rows.splice(index, 1)
    },

    //售后录入
    afterSalesEntry(){
      this.view_text=[]
      this.inputForm={}
      this.$nextTick(function () {
        this.$refs.inputForm.clearValidate();
      });
      this.getRefund()
      this.getReturn()
      this.inputDialogVisible = true
    },

    onInput(){
      this.$refs.inputForm.validate((valid) => {
        if(valid){
          let inputForm ={... this.inputForm}
          let view_text=[... this.view_text]
          inputForm.view_text=[]
          for (let i = 0; i < view_text.length; i++) {
            inputForm.view_text.push(view_text[i].url)
          }
          let data = {
            order_code: inputForm.order_code,
            apply_type: inputForm.apply_type,
            receipt_status: inputForm.receipt_status,
            refund_reason_id: inputForm.refund_reason_id,
            return_reason_id: inputForm.return_reason_id,
            liability_amount: inputForm.liability_amount,
            refund_product: this.orderInfo.product,
            refund_money: inputForm.refund_money,
            refund_reason_mark: inputForm.refund_reason_mark,
            refund_reason_image: inputForm.view_text,
          }
          addRefund(data).then(()=>{
            this.inputDialogVisible=false
            this.$message.success('录入成功')
            this.view_text=[]
            this.selectRow = undefined
            this.getList()
          }).catch(()=>{})
        }
      })
    },

    //确认退款(refund)/确认退换(return)
    confirmOperation(e){
      if(this.selectRow){
        if (e == 'return'){
          this.$prompt('请输入快递单号', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if(value){
              replace({id:this.selectRow.id,back_order_code:value}).then((res)=>{
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.selectRow = undefined
                this.getList()
              })
            }else {
              this.$message.error('快递单号不能为空')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }else{
          this.$confirm('是否确认退款', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            refund({id:this.selectRow.id}).then((res)=>{
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.selectRow = undefined
              this.getList()
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      }else{
        this.$message.error('请选中一行')
      }
    },

    //审核--->弹窗打开
    openExamine(){
      if(this.selectRow){
        this.form={
          apply_status:3
        }
        this.$nextTick(function () {
          this.$refs.form.clearValidate();
        });
        this.addAttributeState=true
      }else{
        this.$message.error('请选中一行')
      }
    },

    //审核--->保存
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          let data = {...this.form,id:this.selectRow.id}
          toExamine(data).then(()=>{
            this.addAttributeState=false
            this.$message.success('审核成功')
            this.selectRow = undefined
            this.getList()
          })
        }
      })
    },

    //客服撤销
    customerServiceCancellation(){
      if(this.selectRow){
        this.$prompt('备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let data = {
            id: this.selectRow.id,
            remark:value
          }
          cancelRefund(data).then(()=>{
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.selectRow = undefined
            this.getList();
          })
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

    //点击查看详情
    listClick(e){
      this.applyGoodsArr = e.product
      customerInfo({customer_id:e.customer_id}).then(res=>{
        this.customerInfoList=res.data
      })
      orderInfo({id:e.id}).then(res=>{
        this.orderInfoList=res.data
      })
      log({id:e.id}).then(res=>{
        this.logList=res.data
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
        this.pagingData={
          ...this.pagingData,
          page:res.data.current_page,
          limit:res.data.per_page,
          total:res.data.total,
        }
        // let dataList=[... res.data.data]
        // dataList.forEach(item=>{
        //   if(item.)
        // })
        let tableDataInfo={... this.tableDataInfo,dataList:res.data.data}
        this.tableDataInfo=tableDataInfo
      })
    },
  },
}
</script>

<style scoped>
.orderInfo{
  display: inline-block;
}
.orderInfo p{
  display: inline-block;
  height: 50px;
  line-height: 50px;
  margin: 0;
  margin-right: 15px;
  font-size: 14px;
}
</style>