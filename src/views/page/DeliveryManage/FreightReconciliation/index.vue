<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        title="导入对账明细"
        :close-on-click-modal="false"
        :destroy-on-close="false"
        :visible.sync="uploadShow"
        width="850px"
        size="mini"
        center
    >
      <div v-loading="uploadLoading">
        <div class="modalContainer">
          <p>
            请下载表格格式在Excel中添加数据，
            <el-button type="text">
              <a
                  href="http://m.smxos.com/static/xlsx/psfee_example.xls"
                  download="对账明细模板"
              >[下载Excel模板]</a>
            </el-button>
          </p>
          <el-select v-model="express" placeholder="请选择快递单位" class="expressSelect">
            <el-option
                v-for="item in expressList"
                :key="item.id"
                :label="item.kdname"
                :value="item.id"
            />
          </el-select>
          <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
          <el-table
              :data="tableData"
              border
              highlight-current-row
              style="width: 100%;margin-top:20px;"
          >
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
          </el-table>
        </div>
        <span class="modalFoot FR_modalFoot">
          <el-button size="mini" @click="uploadShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="uploadSure">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {freightAccountList, importdetail, exportresult, feecheck, del} from "@/api/DeliveryManage/FreightReconciliation/index";
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {searchKdManageList} from "@/api/DeliveryManage/DeliverySettings/ExpressManage";
export default {
  name: "FreightReconciliation",
  components:{
    ldlTablePagination,
    buttonBox,
    UploadExcelComponent
  },
  data(){
    return{
      expressList: [],
      express: '',
      tableData: [],
      tableHeader: [],
      uploadLoading: false,
      uploadShow: false,
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'express_name',label:'快递公司名称',},
          {prop:'company_name',label:'配送中心单位名称',},
          {prop:'user_name',label:'操作人名称',},
          {prop:'ischeck',type:'tag',label:'是否对账',data:[{type:'success',key:1,name:'是'}],},
          {prop:'num',label:'导入对账单的条数',sortable:"custom"},
          {prop:'remark',type:'html',label:'备注信息',width:300,align:"left"},
          {prop:'createTime',label:'操作时间',type:"date",sortable:"custom"},
          {prop:'updateTime',label:'完成时间',type:"date",sortable:"custom"},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
      this.getExpress()
    })
  },
  methods:{

    // 获取快递公司列表
    getExpress() {
      searchKdManageList()
          .then(res => {
            this.expressList = res.data
          })
          .catch(err => console.log(err))
    },

    //导入对账明细
    getImport() {
      this.uploadShow = true
      this.tableData = []
      this.express = ''
    },

    // 上传组件
    beforeUpload(file) {
      if (this.express) {
        const fd = new FormData()
        fd.append('express_id', this.express) // 随文件上传的参数id
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
      } else {
        this.$message.error('请先选择快递单位！')
      }
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },

    // 上传文件到服务器
    uploadSure() {
      this.uploadLoading = true
      importdetail(this.fileData)
          .then(() => {
            this.$message.success('导入成功！')
            this.getList()
            this.uploadLoading = false
            this.uploadShow = false
          })
          .catch(err => {
            this.$message.error(err)
            this.uploadLoading = false
            this.uploadShow = false
          })
    },

    // 进行对账
    getFeecheck() {
      if (this.selectRow) {
        this.$confirm('确认对该账单执行对账操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          feecheck({check_id:this.selectRow.id})
              .then(() => {
                this.$message.success('对账成功！')
                this.getList()
              }).catch(err => this.$message.error(err))
        }).catch(() => {
              console.log('已取消对账')
            })
      } else {
        this.$message.warning('请先选择要对账的账单！')
      }
    },

    //导出对账差异
    getExport() {
      if (this.selectRow) {
        exportresult({check_id:this.selectRow.id})
            .then(res => {
              const a = document.createElement('a')
              a.setAttribute('href', `${res.data}`)
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a) // 下载后移除a标签
            })
            .catch(err => this.$message.error(err))
      } else {
        this.$message.warning('请先选定要操作的账单！')
      }
    },

    // 删除
    delAttribute(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--该条对账信息--, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({check_id:this.selectRow.id}).then(()=>{
            this.getList()
            this.$message.success('删除成功')
          }).catch(() => {});
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
      freightAccountList(this.pagingData).then(res=>{
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
.expressSelect {
  margin-bottom: 20px;
}
</style>
<style>
.FR_modalFoot{
  display: block !important;
  width: 100% !important;
  padding-top: 10px !important;
  text-align: center;
}
</style>