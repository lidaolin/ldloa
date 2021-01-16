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
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index, customerInfo, orderInfo, toExamine, log, refund, replace} from "@/api/DeliveryManage/AftercareServices/ReturnRequest";
export default {
  name: "ReturnRequest",
  components:{
    ldlControlWindow,
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
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
          {prop:'refund_code',label:'退换货编号',width: 160,},
          {prop:'order_code',label:'订单编号',},
          {prop:'apply_type',type:'tag',label:'申请类型',data:[{type:'warning',key:1,name:'退款'},{type:'danger',key:2,name:'退款退货'},{type:'info',key:3,name:'换货'}],},
          {prop:'apply_status',type:'tag',label:'申请状态',data:[{type:'warning',key:1,name:'客服审核'},{type:'danger',key:2,name:'客服受理'},{type:'info',key:3,name:'客服驳回'},{type:'',key:4,name:'退款成功'},{type:'success',key:5,name:'换货成功'},],},
          {prop:'receipt_status',label:'客户收货状态',type:'tag',data:[{type:'danger',key:1,name:'未收到货'},{type:'success',key:2,name:'已收到货'},],},
          {prop:'refund_reason_mark',label:'退款说明',},
          {prop:"refund_reason_image",label:"退款凭证图片",type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop:'refund_money',label:'退款总金额',sortable:"custom",width: 140,},
          {prop:'nickName',label:'用户昵称',},
          {prop:'headPortrait',label:'用户头像',type:'image',fit:'',imgStyle:{width:'50px',height:'50px'}},
          {prop:'reason_name',label:'申请原因',},
          {prop:'create_time',label:'申请时间',type:"date",sortable:"custom",width:'140'},
          {prop:'refund_time',label:'退款时间',type:"date",sortable:"custom",width:'140'},
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

    //确认退款(refund)/确认退换(return)
    confirmOperation(e){
      if(this.selectRow){
        this.$confirm('是否确认' + (e == 'refund'?' 退款 ':' 退换 '), '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (e == 'refund'){
            refund({id:this.selectRow.id}).then((res)=>{
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.getList()
            })
          }else {
            replace({id:this.selectRow.id}).then((res)=>{
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.getList()
            })
          }
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
            this.getList()
          })
        }
      })
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