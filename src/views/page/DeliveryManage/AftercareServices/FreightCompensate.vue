<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination  @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow  class="ldlTab" :bottomHeight.sync="bottomHeight" ref="bottomHeight"></ldlControlWindow>
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index} from "@/api/DeliveryManage/AftercareServices/FreightCompensate";
export default {
name: "FreightCompensate",
  data(){
    return{
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'deliverNum',label:'销售单号',width: 200},
          {prop:'ship_date',label:'发货日期',type:"date",sortable:"custom",width:'140'},
          {prop:'expressNum',label:'快递单号',width: 160},
          {prop:'deal_progress',label:'处理进度',},
          {prop:"compensate_cash",label:"赔偿金额"},
          {prop:'compensate_type',type:'tag',label:'赔偿类型',data:[{type:'success',key:1,name:'产品丢失'},{type:'danger',key:2,name:'破损'},{type:'warning',key:3,name:'超区'},{type:'info',key:4,name:'其他'}],},
          {prop:'createTime',label:'创建时间',type:"date",sortable:"custom",width:'140'},
          {prop:'remark',label:'备注说明',width: 200,showOverflowTooltip:true,},
          {prop:'userId_name',label:'创建人名称',},
          {prop:'companyName',label:'配送中心公司名称',},
          {prop:'express_name',label:'快递名称',},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    listClick(e){
      console.log(e)
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
          ...
              this.pagingData,
          page:res.data.current_page,
          limit:res.data.per_page,
          total:res.data.total,
        }
        let tableDataInfo={... this.tableDataInfo,dataList:res.data.data}
        this.tableDataInfo=tableDataInfo
      })
    },
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  components:{
    ldlControlWindow,
    ldlTablePagination,
    buttonBox,
  },
}
</script>

<style scoped>

</style>