<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        width="50%"
        custom-class="minWidth500"
        :visible.sync="changeGoodsState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改商品':'新增商品'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini" >
        <el-form-item label="品牌名称:" prop="brand_id" :rules="{ required: true, message: '请选择品牌名称', trigger: 'blur' }">
          <el-select
              v-model="form.brand_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod"
              :loading="loading">
            <el-option
                v-for="item in brandArray"
                :key="item.id"
                :label="item.brand_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称:" prop="product_name" :rules="{ required: true, message: '请填写商品名称', trigger: 'blur' }">
          <el-input v-model="form.product_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类:" prop="brand_id" :rules="{ required: true, message: '请选择商品分类', trigger: 'blur' }">
          <el-select
              v-model="form.product_classify_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="classifyMethod"
              :loading="loading">
            <el-option
                v-for="item in simpleIndexArray"
                :key="item.id"
                :label="item.classify_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品封面图:" prop="cover_link_img" :rules="{ required: true, message: '请上传视频封面图', trigger: 'blur' }">
          <el-upload
              class="avatar-uploader"
              action="/api/admin/upload_image/upload"
              name="file"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </el-form-item>


      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {index,brandList,status,simpleIndex} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";
export default {
  name: "GoodsManage",
  data(){
    return{
      imageUrl:'',
      loading:false,//控制搜索加载的
      simpleIndexArray:[],//分类
      brandArray:[],//数组品牌
      form:{},
      changeGoodsState:false,
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'product_name',label:'商品名称',width:'180'},
          {prop:'brand_name',label:'品牌名称',},
          {prop:'classify_name',label:'商品分类名称',},
          {prop: 'cover_link_img',label: '封面图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop: 'view_text',label: '详情图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop:'weight',label:'商品重量',sortable:"custom"},
          {prop:'long_size',label:'商品长度',unit:'cm',sortable:"custom"},
          {prop:'wide_size',label:'商品宽度',unit:'cm',sortable:"custom"},
          {prop:'high_size',label:'商品高度',unit:'cm',sortable:"custom"},
          {prop:'volume_size',label:'商品体积',unit:'cm³',sortable:"custom"},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'在售'},{type:'danger',key:2,name:'下架'}],},
          {prop:'is_delete',type:'tag',label:'是否删除',data:[{type:'danger',key:2,name:'已删除'}],width:'80'},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom",width:'140'},
          {prop:'update_time',label:'更新时间',type:"date",sortable:"custom",width:'140'},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  methods:{
    handleAvatarSuccess(e){
      console.log(e)
    },
    beforeAvatarUpload(e){
      console.log(e)
    },
    /**上架下架*/
    onChangeGoodsState(){
      if(this.selectRow){
        this.$confirm('当前状态为'+(this.selectRow.status==1?' 在售 ':' 下架 ')+'是否修改为'+(this.selectRow.status==2?' 在售 ':' 下架 '), '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          status({id:this.selectRow.id,status:this.selectRow.status==1?2:1}).then(()=>{
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
    /**编辑和新增商品*/
      //打开弹窗
    changeGoods(e){
      if(e==='add'){
        this.brandMethod()
        this.classifyMethod()
        this.changeGoodsState=true
      }else{
        if(this.selectRow){
          this.form={... this.selectRow}
          this.changeGoodsState=true
        }else{
          this.$message.error('请选中一行')
        }
      }
    },
    /**编辑和新增商品*/
    /** 模糊搜索*/
    // 品牌搜索
    brandMethod(e){
      this.loading=true
      brandList({brand_name:e}).then(res=>{
        this.brandArray=res.data.data
        this.loading=false
      })
    },
    // 分类搜索
    classifyMethod(e){
      this.loading=true
      simpleIndex({classify_name:e}).then(res=>{
        this.simpleIndexArray=res.data
        this.loading=false
      })
    },
    /** 模糊搜索*/
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