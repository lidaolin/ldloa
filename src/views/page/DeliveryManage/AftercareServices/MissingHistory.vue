<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination  @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow  class="ldlTab" :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" style="height: calc(100% - 4px)">
        <el-tab-pane label="查看操作日志" style="height: calc(100% - 4px)">
          <el-table
              :data="checkLogList"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="uId_name"
                label="操作人名称">
            </el-table-column>
            <el-table-column
                prop="reason"
                label="原因">
            </el-table-column>
            <el-table-column
                prop="type"
                width="100"
                align="center"
                label="操作类型">
              <template slot-scope="{row}">
                <el-tag size="mini" v-if="row.type===1">新增</el-tag>
                <el-tag type="success" size="mini" v-if="row.type===2">编辑</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                align="center"
                width="140"
                label="时间">
              <template slot-scope="{row}">
                {{row.createTime | parseTime('')}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ldlControlWindow>
    <el-dialog
        v-el-drag-dialog
        top="5%"
        width="30%"
        custom-class="minWidth300"
        :visible.sync="missingHistoryState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >

      <el-form ref="form" :model="form" label-width="100px" size="mini" >

        <el-form-item label="成功员工:" prop="userId" :rules="{ required: true, message: '请填写成功员工', trigger: 'blur' }">
          <el-select
              size="mini"
              v-model="form.userId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="userMethod"
              :loading="loading">
            <el-option
                v-for="item in userArray"
                :key="item.id"
                :label="'《'+item.companyName+'》'+item.account"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人:" prop="addressee" :rules="{ required: true, message: '请填写收件人名称', trigger: 'blur' }">
          <el-input v-model="form.addressee" placeholder="请输入收件人名称"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="phone" :rules="{ required: true, message: '请填写收件人手机号', trigger: 'blur' }">
          <el-input v-model="form.phone" placeholder="请输入收件人名称"></el-input>
        </el-form-item>
        <el-form-item label="固话:" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入固话"></el-input>
        </el-form-item>
        <el-form-item label="地址:" prop="tel">
          <el-cascader
              v-model="form.addressAll"
              :options="regionData"
              :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:" prop="address" :rules="{ required: true, message: '请填写详细地址', trigger: 'blur' }">
          <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="原因:" prop="reason" >
          <el-input type="textarea" v-model="form.reason" placeholder="请填写原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{ form.id? '立即保存':'立即创建' }}</el-button>
        <el-button @click="missingHistoryState=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
import {index,del,add, edit,getStaff,checkLog} from '@/api/DeliveryManage/AftercareServices/MissingHistory'
import {regionData} from 'element-china-area-data'
export default {
  name: "MissingHistory",
  data(){
    return{
      checkLogList:[],
      loading:false,
      userArray:[],
      regionData:regionData,
      props:{
        value:'label'
      },
      missingHistoryState:false,
      form:{},
      /**必要参数*/
      selectRow:undefined, //选中行
          pagingData:undefined,//getList的传参
          bottomHeight: '30%',//底部高度
          buttonBoxState:true,//开启按钮行的状态
          tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'addressee',label:'收件人',},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom",width:'140'},
          {prop:'phone',label:'电话',},
          {prop:'tel',label:'固话',},
          {prop:"province",label:"省份"},
          {prop:'city',label:'市'},
          {prop:'area',label:'区'},
          {prop:'address',label:'详细地址'},
          {prop:'reason',label:'原因',width: 200},
          {prop:'userId_name',label:'员工名称',},
          {prop:'uid_name',label:'创建人名称',},
        ],//表格列信息
            dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{

    listClick(e){
      checkLog({id:e.id}).then(res=>{
        this.checkLogList=res.data
      })
    },
    //提交
    onSubmit(){
      this.$refs.form.validate((valid) => {
          if(valid){
            let form ={...this.form}
            console.log(form)
            form.province=form.addressAll[0]
            form.city=form.addressAll[1]
            form.area=form.addressAll[2]
            if(this.form.id){
              edit(form).then(()=>{
                this.missingHistoryState=false
                this.$message.success('修改成功')
                this.getList()
              })
            }else{
              add(form).then(()=>{
                this.missingHistoryState=false
                this.$message.success('添加成功')
                this.getList()
              })
            }
          }
      })
    },
    delMissing(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--'+this.selectRow.addressee+'--的漏发历史, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({id:this.selectRow.id}).then(()=>{
            this.getList()
            this.$message.success('删除成功')
          })
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
    //新增编辑
    changeMissing(e){
      if (e==='add'){
        this.userMethod()
        this.form={}
        this.missingHistoryState=true
      }else{
        if(this.selectRow){
          this.userMethod()
          this.form={...this.selectRow,addressAll:[this.selectRow.province,this.selectRow.city,this.selectRow.area]}
          this.missingHistoryState=true
        }else{
          this.$message.error('请选中一行')
        }
      }
    },
    //员工搜索
    userMethod(e){
      this.loading=true
      getStaff({name:e}).then(res=>{
        this.userArray=res.data
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