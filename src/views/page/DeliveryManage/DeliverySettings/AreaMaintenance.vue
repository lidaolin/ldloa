<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
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
      <el-form ref="form" :model="form" label-width="100px" size="mini" >
        <el-form-item label="配送公司:" prop="companyId" :rules="{ required: true, message: '请填写配送公司名称', trigger: 'blur' }">
          <el-select
              v-model="form.companyId"
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
        <el-form-item label="快递公司:" prop="ps_id" :rules="{ required: true, message: '请填写快递公司名称', trigger: 'blur' }">
          <el-select
              v-model="form.ps_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod_kd"
              :loading="loading">
            <el-option
                v-for="item in ps_id_arr"
                :key="item.id"
                :label="item.kdname"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省市区" prop="province" :rules="[{ required: true, message: '省市区不能为空'}]">
<!--          <el-input v-model="form.province" v-show="1==2"></el-input>-->
          <el-input v-model="form.province"></el-input>
<!--          <el-cascader-->
<!--              size="mini"-->
<!--              v-model="selectedOptions"-->
<!--              :options="cityList"-->
<!--              @change="addressChange"-->
<!--              clearable-->
<!--          ></el-cascader>-->
        </el-form-item>
        <el-form-item label="是否送达">
          <el-switch
              v-model="form.issend"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="2"
              active-text="已送达"
              inactive-text="未送达">
          </el-switch>
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
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {add, del, edit, areaServiceList,distributCompany} from "@/api/DeliveryManage/DeliverySettings/AreaMaintenance";
import {searchKdManageList} from "@/api/DeliveryManage/DeliverySettings/ExpressManage";
export default {
name: "AreaMaintenance",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      addAttributeState:false,
      form:{},
      loading:false,//控制搜索加载的
      companyId_arr:[],//配送数组
      ps_id_arr:[],//快递公司数组
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'companyName',label:'配送名称',},
          {prop:'kdname',label:'快递公司名称',},
          {prop:'province',label:'省份',},
          {prop:'city',label:'城市',},
          {prop:'district',label:'区县',},
          {prop:'issend',type:'tag',label:'是否送达',data:[{type:'success',key:1,name:'已送达'}],},
          {prop:'remark',label:'备注',},
          {prop:'createTime',label:'创建时间',type:"date",sortable:"custom"},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
      // add/edit
      selectedOptions: [],
      cityList:[],
      // add/edit
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  methods:{

    //选择地区
    // addressChange(arr) {
    //   this.selectedOptions = arr;
    //   this.form = {
    //     ...this.form,
    //     province: CodeToText[this.selectedOptions[0]],
    //     city: CodeToText[this.selectedOptions[1]],
    //     area: CodeToText[this.selectedOptions[2]],
    //   };
    // },

    // 配送搜索
    brandMethod(e){
      this.loading=true
      distributCompany({name:e}).then(res=>{
        this.companyId_arr=res.data
        this.loading=false
      })
    },

    // 快递公司搜索
    brandMethod_kd(e){
      this.loading=true
      searchKdManageList({kdname:e}).then(res=>{
        this.ps_id_arr=res.data
        this.loading=false
      })
    },

    // 删除
    delAttribute(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除--该条配送记录--, 是否继续?', '提示', {
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

    //新增还是修改
    changeAttribute(e){
      if(e==='edit'){
        if(this.selectRow){
          // this.selectedOptions = this.Common.ToCode(
          //     this.selectRow.province,
          //     this.selectRow.city,
          //     this.selectRow.area
          // );
          this.form={
            id:this.selectRow.id,
            companyId:this.selectRow.companyId,
            ps_id:this.selectRow.ps_id,
            province:this.selectRow.province,
            city:this.selectRow.city,
            district:this.selectRow.district,
            issend:this.selectRow.issend,
            remark:this.selectRow.remark,
          }
          console.log(this.form)
          this.addAttributeState=true
        }else{
          this.$message.error('请选中一行')
        }
      }else{
        this.form={
          issend: 2
        }
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
      areaServiceList(this.pagingData).then(res=>{
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