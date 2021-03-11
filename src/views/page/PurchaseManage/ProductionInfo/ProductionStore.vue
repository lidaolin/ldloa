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
    <el-dialog
        v-el-drag-dialog
        top="5%"
        width="50%"
        custom-class="minWidth800"
        :visible.sync="changeStoreState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" size="mini" :inline="true">
        <el-form-item label="供应商:" prop="supplier_id" :rules="{ required: true, message: '请选择供应商', trigger: 'blur' }">
          <el-select
              size="mini"
              v-model="form.supplier_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="supplierMethod"
              :loading="loading">
            <el-option
                v-for="item in supplierArray"
                :key="item.id"
                :label="item.supplier_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送单位:" prop="ps_company_id" :rules="{ required: true, message: '请选择配送单位', trigger: 'blur' }">
          <el-select
              size="mini"
              v-model="form.ps_company_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="(e)=>CompanyMethod(e,1)"
              :loading="loading">
            <el-option
                v-for="item in CompanyArray"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型:" prop="w_type" :rules="{ required: true, message: '请选择配送单位', trigger: 'blur' }">
          <el-switch
              v-model="form.w_type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="入库"
              inactive-text="出库">
          </el-switch>
        </el-form-item>
        <br>
        <el-form-item label="生产入库商品:" prop="ruku_product">
          <el-button size="mini" @click="changeGoods" type="primary">添加商品</el-button>
          <el-dialog
              top="5%"
              width="60%"
              title="商品"
              v-el-drag-dialog
              :destroy-on-close="false"
              :close-on-click-modal="false"
              append-to-body
              :visible.sync="changeGoodsState">
            <el-select
                size="mini"
                v-model="goods"
                @change="changeSelectGoods"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="productMethod"
                :loading="loading">

<!--              :disabled="overSelect(item.id)"-->
              <el-option
                  v-for="item in productArray"
                  :key="item.id"
                  :label="item.product_name"
                  :value="item.id">
              </el-option>
            </el-select>
            <br><br>
            <el-table
                :data="goodsList"
                border
                size="mini"
                height="500px">
              <el-table-column
                  prop="product_attr_val_pash"
                  label="商品规格">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.product_attr_val_pash" :key="index">{{item.attr_name}}:{{item.val_name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                  width="250"
                  prop="number"
                  align="center">
                <template slot="header" slot-scope="scope">
                    统一修改数目
                    <el-input-number v-if="scope" v-model="changeAllNumber" :precision="0" size="mini" :min="0" :step="1"></el-input-number>
                </template>
                <template slot-scope="{row}">
                  <el-input-number v-model="row.number" size="mini" :min="0" :step="1"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="changeGoodsState = false">取 消</el-button>
              <el-button type="primary" @click="addGoodsSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
        <el-table
            :data="form.ruku_product"
            border
            size="mini"
            height="500px">
          <el-table-column
              prop="product_attr_val_pash"
              label="商品规格">
            <template slot-scope="scope">
              {{scope.row.product_name}}----
              <span v-for="(item,index) in scope.row.product_attr_val_pash" :key="index">{{item.attr_name}}:{{item.val_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="price"
              align="center"
              label="数目"
              width="160">
            <template slot-scope="{row}">
              <el-input-number v-model="row.number" size="mini" :min="1" :step="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
              prop="price"
              align="center"
              label="操作"
              width="160">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delProductRow(scope.$index)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeStoreState = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index,supplierSimpleList,getPsCompany,add,status,del} from "@/api/PurchaseManage/ProductionInfo/ProductionStore";
import {simpleList,getSku} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";

export default {
  name: "ProductionStore",
  data(){
    return{
      changeAllNumber:1,
      goodsList:[],
      goods:'',
      changeGoodsState:false,
      CompanyArray:[],
      productArray:[],
      supplierArray:[],
      loading:false,
      form:{},
      changeStoreState:false,
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
  watch:{
    changeAllNumber(){
      for (let i = 0; i < this.goodsList.length; i++) {
        let goodsList=[... this.goodsList]
        goodsList[i].number=this.changeAllNumber
        this.goodsList=[... goodsList]
      }
    },
  },
  // computed:{
  //   overSelect(){
  //     return function (e){
  //       let index=0
  //       for (let i = 0; i < this.form.ruku_product.length; i++) {
  //         if(this.form.ruku_product[i].product_id==e){
  //           index+=1
  //         }
  //       }
  //       if(index>0){
  //         return true
  //       }else{
  //         return false
  //       }
  //     }
  //   },
  //
  // },
  methods:{
    delProductRow(){

      let ruku_product=[... this.form.ruku_product]
      ruku_product.splice(index,1)
      let form ={... this.form}
      form.ruku_product=ruku_product
      this.form = {... form}
    },
    changeSelectGoods(){
      getSku({product_id:this.goods}).then(res=>{
        for (let i = 0; i < res.data.length; i++) {

          res.data[i].number=0
        }
        this.goodsList=res.data
      })
    },
    // 添加商品修改商品打开弹窗
    changeGoods(){
      // if(e>0){
      //   console.log('这放编辑')
      //
      // }else{
        this.goods=''
        this.productMethod()
        this.goodsList=[]
        this.changeGoodsState=true
      // }
    },
    //添加商品的按钮函数
    addGoodsSubmit(){
      let form={... this.form}
      let allId=[]
      let delId=[]
      for (let i = 0; i < form.ruku_product.length; i++) {
        for (let j = 0; j < this.goodsList.length; j++) {
          if (form.ruku_product[i].id===this.goodsList[j].id){
            allId.push({index:i,indexTwo:j})
          }
        }
      }
      let goodsListTwo=[... this.goodsList]
      for (let i = allId.length-1; i >=0; i--) {
        form.ruku_product[allId[i].index].number+=this.goodsList[allId[i].indexTwo].number
        goodsListTwo.splice(allId[i].indexTwo,1)
      }
      for (let i = 0; i < goodsListTwo.length; i++) {
        if(goodsListTwo[i].number===0){
          delId.push(i)
        }
      }
      let goodsListTree=goodsListTwo
      for (let i = delId.length-1; i >=0; i--) {
        goodsListTree.splice(delId[i],1)
      }
      form.ruku_product=form.ruku_product.concat(goodsListTree)
      this.form= {... form}
      this.changeGoodsState=false
    },
    //上传
    upSubmit(){

      if (this.selectRow){
        this.$confirm('是否提交此条申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          status({id:this.selectRow.id}).then(res=>{
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.getList()
          })
        }).catch(() => {});
      }else{
        this.$message.error('请选择一条')
      }
    },
    // 删除
    delStore(){
      if (this.selectRow){
        this.$confirm('此操作将永久删除该条申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          del({id:this.selectRow.id}).then(res=>{
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message.error('请选择一条')
      }
    },
    changeStore(e){
      if(e==='add'){
        this.form={w_type:1,ruku_product:[]}
        this.changeStoreState=true
        this.CompanyMethod('',1)
        this.supplierMethod()
      }else{
        if (this.selectRow){
          this.form = {... this.selectRow}
          this.changeStoreState=true
          this.CompanyMethod('',1)
          this.supplierMethod()
        }else{
          this.$message.error('请选择一条')
        }
      }
    },
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          add(this.form).then(res=>{
            console.log(res)
            this.$message.success(res.msg)
            this.getList()
            this.changeStoreState=false
            this.form={w_type:1,ruku_product:[]}
          })
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
    /** 模糊搜索*/
    //配送单位+配送公司
    CompanyMethod(e,s){
      this.loading=true
      getPsCompany({name:e,type:s}).then(res=>{
        this.CompanyArray=res.data
        this.loading=false
      })
    },
    //搜索供应商brand
    supplierMethod(e){
      this.loading=true
      supplierSimpleList({supplier_name:e}).then(res=>{
        this.supplierArray=res.data
        this.loading=false
      })
    },
    //商品搜索接口
    productMethod(e){
      this.loading=true
      simpleList({product_name:e}).then(res=>{
        this.productArray=res.data
        this.loading=false
      })
    },
    /** 模糊搜索*/
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