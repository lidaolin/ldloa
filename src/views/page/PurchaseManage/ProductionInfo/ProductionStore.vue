<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow  class="ldlTab" :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" style="height: calc(100% - 4px)">
        <el-tab-pane label="入库商品规格明细" style="height: calc(100% - 4px)">
          <el-table
              :data="selectRow?selectRow.ruku_product:[]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_name"
                label="商品名称">
            </el-table-column>
            <el-table-column
                prop="product_attr_val_pash_array"
                width="120"
                align="center"
                label="商品规格状态">
              <template slot-scope="{row}">
                <span v-for="(item,index) in row.product_attr_val_pash_array" :key="index">
                  {{ item.attr_name }}:{{item.val_name}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
                prop="number"
                width="120"
                align="center"
                label="入库数量">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ldlControlWindow>

  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index} from "@/api/PurchaseManage/ProductionInfo/ProductionStore";
export default {
  name: "ProductionStore",
  data(){
    return{
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'companyName',label:'配送单位名称',},
          {prop:'w_type',type:'tag',label:'操作类型',data:[{type:'success',key:1,name:'生产入库'},{type:'danger',key:2,name:'生产出库'}],},
          {prop:'w_status',label:'出入库状态',type:'tag',data:[{type:'success',key:1,name:'录入'},{type:'danger',key:2,name:'提交'}],},
          {prop:"ruku_code",label:"入库单号"},
          {prop:'w_number',label:'出入库总数量'},
          {prop:'is_delete',type:'tag',label:'是否删除',data:[{type:'danger',key:2,name:'已删除'}],width:'80'},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom",width:'140'},
          {prop:'submit_time',label:'提交时间',type:"date",sortable:"custom",width:'140'},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
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
    }
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