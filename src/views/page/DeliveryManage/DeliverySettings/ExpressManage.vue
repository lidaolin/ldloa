<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth400"
        :visible.sync="addAttributeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="120px" size="mini" >
        <el-form-item label="配送公司:" prop="company_id" :rules="{ required: true, message: '配送公司不能为空', trigger: 'blur' }">
          <el-select
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
        <el-form-item label="快递公司:" prop="kd_id" :rules="{ required: true, message: '快递公司不能为空', trigger: 'blur' }">
          <el-select
              v-model="form.kd_id"
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
        <el-form-item label="菜鸟物流编号:" prop="kdn_num" :rules="{ required: true, message: '菜鸟物流编号不能为空', trigger: 'blur' }">
          <el-input v-model="form.kdn_num" placeholder="请输入菜鸟物流编号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="使用"
              inactive-text="不使用">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否可指定">
          <el-switch
              v-model="form.isappoint"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="是"
              inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="序号">
          <el-input-number
              v-model="form.sort"
              controls-position="right"
              placeholder="请输入序号"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
          <el-button @click="addAttributeState=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
        v-el-drag-dialog
        width="60%"
        custom-class="minWidth800"
        title="导入快递价格表"
        :close-on-click-modal="false"
        :visible.sync="uploadShow"
        size="mini"
        center
    >
        <div class="modalContainer">
          <p>
            请下载表格格式在Excel中添加数据，
            <el-button type="text">
              <a
                  href="http://smx.tscoltd.com/static/xlsx/express_example.xlsx"
                  download="配送列表模板"
              >[下载Excel模板]</a>
            </el-button>
          </p>
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
          <el-table
              :data="gridData"
              border
              highlight-current-row
              style="width: 100%;margin-top:20px;"
          >
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
          </el-table>
        </div>
        <span slot="footer" class="modalFoot">
          <el-button @click="uploadShow = false">取 消</el-button>
          <el-button type="primary" @click="uploadSure">确 定</el-button>
        </span>
    </el-dialog>
    <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" v-model="tabPaneValue" class="ldlTab" @tab-click="changeTab" style="height: calc(100% - 4px)">
        <el-tab-pane label="快递价格表" name="getKdPrice" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="province"
                width="120"
                align="center"
                label="省份">
            </el-table-column>
<!--            <el-table-column-->
<!--                prop="expressId"-->
<!--                width="120"-->
<!--                align="center"-->
<!--                label="快递公司">-->
<!--            </el-table-column>-->
            <el-table-column
                prop="firstweight"
                width="120"
                align="center"
                label="首重">
            </el-table-column>
            <el-table-column
                prop="firstprice"
                width="120"
                align="center"
                label="首价">
            </el-table-column>
            <el-table-column
              prop="addweight"
              width="120"
              align="center"
              label="续重">
            </el-table-column>
            <el-table-column
              prop="addprice"
              width="120"
              align="center"
              label="续重价格">
            </el-table-column>
            <el-table-column
              prop="minimumamount"
              width="120"
              align="center"
              label="最低费用额度">
            </el-table-column>
            <el-table-column
                prop="orcollection"
                width="120"
                align="center"
                label="是否代收">
              <template slot-scope="{row}">
                <el-tag type="success" size="mini" v-if="row.orcollection===1">否</el-tag>
                <el-tag type="danger" size="mini" v-if="row.orcollection==2">是</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="costrate"
                width="120"
                align="center"
                label="代收费用率">
            </el-table-column>
            <el-table-column
                prop="starttime"
                align="center"
                label="起始日期">
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
import {add, edit, expressList, status, queryKdPriceList, uploadKdPriceList} from "@/api/DeliveryManage/DeliverySettings/ExpressManage";
import {searchKdList} from "@/api/DeliveryManage/DeliverySettings/ExpressCompany";
import {distributCompany} from "@/api/DeliveryManage/DeliverySettings/AreaMaintenance";
import ldlControlWindow from "@/components/ldlControlWindow";
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
export default {
  name: "ExpressManage",
  components:{
    ldlTablePagination,
    buttonBox,
    ldlControlWindow,
    UploadExcelComponent
  },
  data(){
    return{
      uploadShow: false,
      gridData:[],
      tableHeader: [],
      fileData: {},
      getKdPrice:[],
      bottomList:{getKdPrice:[]},
      tabPaneValue:'getKdPrice',
      addAttributeState:false,
      form:{},
      loading:false,//控制搜索加载的
      companyId_arr:[],//配送数组
      kd_id_arr:[],//快递公司数组
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'companyName',label:'配送中心名称',},
          {prop:'kdname',label:'快递名称',},
          {prop:'kdn_num',label:'菜鸟物流编号',},
          {prop:'total',label:'总订单数',sortable:"custom"},
          {prop:'ps_fee',label:'总快递费用',sortable:"custom"},
          {prop:'count',label:'电子面单余量',sortable:"custom"},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'启用'},{type:'danger',key:2,name:'禁用'}],},
          {prop:'isappoint',type:'tag',label:'是否可指定',data:[{type:'success',key:1,name:'指定'},],},
          {prop:'sort',label:'排序',sortable:"custom",},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom"},
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
    //导入快递价格表-->弹出打开
    imporTable(){
      if (this.selectRow) {
        this.gridData = []
        this.tableHeader = []
        this.uploadShow = true
      } else {
        this.$message.warning('请先选择快递单位！')
      }
    },

    // 上传组件
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('kdid', this.selectRow.id) // 随文件上传的参数id
      fd.append('excel', file)
      this.fileData = fd
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '请不要上传文件大小超过1M的表格文件！',
        type: 'warning'
      })

      return false
    },
    handleSuccess(res) {
      // console.log(res)
      this.gridData = res.results
      this.tableHeader = res.header
    },

    // 上传文件到服务器
    uploadSure() {
      uploadKdPriceList(this.fileData)
          .then(res => {
            this.$message.success(res.msg)
            this.getList()
            this.uploadShow = false
          })
          .catch(err => {
            if (err == 'kdid不能为空') {
              this.$message.error('请先上传文件')
            } else {
              this.$message.error(err)
              this.uploadShow = false
            }
          })
    },

    listClick(){
     this.changeTab()
    },

    changeTab(){
      let e = this.selectRow
      if(this.tabPaneValue==='getKdPrice'){
        queryKdPriceList({express_id:e.id}).then(res=>{
          this.bottomList.getKdPrice=res.data
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

    // 快递公司搜索
    brandMethod_kd(e){
      this.loading=true
      searchKdList({name:e}).then(res=>{
        this.kd_id_arr=res.data
        this.loading=false
      })
    },

    /**更改状态*/
    changeState(){
      if(this.selectRow){
        this.$confirm('当前状态为'+(this.selectRow.status==1?' 启用 ':' 禁用 ')+'是否修改为'+(this.selectRow.status==2?' 启用 ':' 禁用 '), '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          status({id:this.selectRow.id,status:this.selectRow.status==1?2:1}).then(()=>{
            this.$message.success('设置成功')
            this.getList()
          })
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

    //新增还是修改
    changeAttribute(e){
      if(e==='edit'){
        if(this.selectRow){
          this.form={
            id:this.selectRow.id,
            company_id:this.selectRow.company_id,
            kd_id:this.selectRow.kd_id,
            status:this.selectRow.status,
            isappoint:this.selectRow.isappoint,
            sort:this.selectRow.sort,
          }
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{
        this.form={
          status:1,
          isappoint:1,
        }
        this.$nextTick(function () {
          this.$refs.form.clearValidate();
        });
        this.addAttributeState=true
      }
      this.brandMethod()
      this.brandMethod_kd()
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
      expressList(this.pagingData).then(res=>{
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