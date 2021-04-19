<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>

    <el-dialog
        v-el-drag-dialog
        top="2.5%"
        width="50%"
        custom-class="minWidth700"
        :visible.sync="changePriceState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        title="批量修改价格"
        size="mini"
        center
    >
      <el-table
          :data="getSku"
          border
          size="mini"
          max-height="660"
          height="100%">
        <el-table-column
            prop="product_attr_val_pash"
            label="商品规格">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.product_attr_val_pash" :key="index">{{item.attr_name}}:{{item.val_name}}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="p_status"
            width="100"
            align="center"
            label="商品规格状态">
          <template slot-scope="{row}">
            <el-switch
                size="mini"
                v-model="row.p_status"
                :active-value="1"
                :inactive-value="2"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            prop="price"
            align="center"
            width="160">
          <template slot="header" slot-scope="scope">
            统一修改价格
            <el-input-number  v-if="scope" v-model="price" size="mini" :precision="2" :min="0" :step="0.1"></el-input-number>
          </template>
          <template slot-scope="{row}">
            <el-input-number v-model="row.price" size="mini" :precision="2" :min="0" :step="0.1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
            prop="price"
            align="center"
            width="110"
            label="删除">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delSku(scope.$index)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePriceState = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitPrice">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        v-el-drag-dialog
        top="2.5%"
        width="50%"
        custom-class="minWidth700"
        :visible.sync="changeGoodsState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改商品':'新增商品'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" size="mini" :inline="true">
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
        <el-form-item label="商品分类:" prop="product_classify_id" :rules="{ required: true, message: '请选择商品分类', trigger: 'blur' }">
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
<!--        <el-form-item label="商品状态:" prop="status">-->
<!--          <el-switch-->
<!--              v-model="form.status"-->
<!--              active-color="#13ce66"-->
<!--              inactive-color="#ff4949"-->
<!--              :active-value="1"-->
<!--              :inactive-value="2"-->
<!--              active-text="在售"-->
<!--              inactive-text="下架">-->
<!--          </el-switch>-->
<!--        </el-form-item>-->

        <br>
        <el-form-item label="商品封面图:" prop="cover_link_img" :rules="{ required: true, message: '请上传商品封面图', trigger: 'blur' }">
          <el-upload
              class="avatar-uploader"
              action="/admin/upload_image/upload"
              name="file"
              :show-file-list="false"
              :on-success="(e)=>{handleSuccess(e,'cover_link_img')}"
              :before-upload="beforeUpload">
            <img v-if="form.cover_link_img" alt="" :src="form.cover_link_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="商品视频:" prop="video_link" :rules="{ message: '请上传商品视频', trigger: 'blur' }">
          <el-upload
              class="avatar-uploader"
              accept="video/*"
              action="/admin/upload_image/uploadvedio"
              name="file"
              :show-file-list="false"
              :on-success="(e)=>{handleSuccess(e,'video_link')}"
              :before-upload="beforeUpload">
              <video v-if="form.video_link" :src="form.video_link" class="avatar" controls/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          </el-upload>
        </el-form-item>
        <br>
        <el-form-item class="elFormItemFlex" label="产品说明:" prop="explain" :rules="{ required: true, message: '请填写产品说明', trigger: 'blur' }">
          <el-input type="textarea" v-model="form.explain" placeholder="请填写产品说明"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="产品详情图:" class="elFormItemFlex" prop="view_text" >
          <el-upload
              action="/admin/upload_image/upload"
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
        <br>
        <el-form-item label="产品橱窗图:" class="product_carousel_img" prop="product_carousel_img" >
          <el-upload
              action="/admin/upload_image/upload"
              list-type="picture-card"
              multiple
              show-file-list
              accept="image/*"
              :file-list.sync="view_textTwo"
              :on-success="uploadSuccessTwo"
              :on-preview="handlePreviewTwo"
              :on-remove="handleRemoveTwo">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisibleTwo" append-to-body>
            <img width="100%" :src="dialogImageUrlTwo" alt="">
          </el-dialog>
        </el-form-item>
        <br>
        <el-form-item label="商品重量:" prop="weight" :rules="{ required: true, message: '请填写商品重量', trigger: 'blur' }">
          <el-input-number size="mini" v-model="form.weight" placeholder="商品重量g" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品长:" prop="weight" :rules="{ required: true, message: '请填写商品重量', trigger: 'blur' }">
          <el-input-number size="mini" v-model="form.long_size" placeholder="商品长cm" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品宽:" prop="weight" :rules="{ required: true, message: '请填写商品重量', trigger: 'blur' }">
          <el-input-number size="mini"  v-model="form.wide_size" placeholder="商品宽cm" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品高:" prop="weight" :rules="{ required: true, message: '请填写商品重量', trigger: 'blur' }">
          <el-input-number size="mini" v-model="form.high_size" placeholder="商品高cm" :precision="2" :step="0.1">
            <template slot="append">cm</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="商品进货锁定价格:" prop="weight" :rules="{ required: true, message: '请填写商品重量', trigger: 'blur' }">
          <el-input-number size="mini" v-model="form.product_lock_fee" placeholder="锁定价" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品属性:" prop="attr" >
          <el-button size="mini" @click="addAttribute" type="primary">添加属性</el-button>
          <el-dialog
              width="60%"
              title="商品属性"
              v-el-drag-dialog
              :destroy-on-close="false"
              :close-on-click-modal="false"
              append-to-body
              :visible.sync="addAttributeState">
            <el-select
                v-model="selectAttributeData"
                filterable
                remote
                reserve-keyword
                @change="onSelectAttr_id"
                placeholder="请输入关键词"
                :remote-method="attributeMethod"
                :loading="loading">
              <el-option
                  v-for="item in attributeIndexArray"
                  :key="item.id"
                  :label="item.attr_name"
                  :value="item.id">
              </el-option>
            </el-select>
            <br/>
            <br/>
            <el-tag
                :key="tag"
                v-for="tag in addAttributeData.val_name"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
                size="small"
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 属性值</el-button>
            <br>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addAttributeState = false">取 消</el-button>

              <el-button type="primary" @click="addAttributeSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
        <el-table
            size="mini"
            :data="form.attr"
            border
            style="width: 100%">
          <el-table-column
              fixed
              prop="attr_name"
              label="商品属性类型"
              width="150">
          </el-table-column>
          <el-table-column
              prop="val_name"
              label="商品属性值">
            <template slot-scope="scope">
              <div><span v-for="(item,index) in scope.row.val_name" :key="index">{{item}},</span></div>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="onAttre(scope.row,scope.$index)">编辑</el-button>
              <el-button type="text" size="small" @click="delAttre(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeGoodsState = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" v-model="tabPaneValue" class="ldlTab" @tab-click="changeTab" style="height: calc(100% - 4px)">
        <el-tab-pane label="商品规格" name="getSku" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_attr_val_pash"
                label="商品规格">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.product_attr_val_pash" :key="index">{{item.attr_name}}:{{item.val_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="p_status"
                width="120"
                align="center"
                label="商品规格状态">
              <template slot-scope="{row}">
                <el-tag type="success" size="mini" v-if="row.p_status===1">正常</el-tag>
                <el-tag type="danger" size="mini" v-if="row.p_status!==1">禁售</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="price"
                width="120"
                align="center"
                label="价格">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品操作日志" name="productLog" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="type"
                width="100"
                align="center"
                label="操作类型">
              <template slot-scope="{row}">
                <el-tag size="mini" v-if="row.type===1">新增</el-tag>
                <el-tag type="success" size="mini" v-if="row.type===2">编辑</el-tag>
                <el-tag type="danger" size="mini" v-if="row.type===3">删除</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="product_name"
                align="center"
                width="220"
                label="商品名称">
            </el-table-column>
            <el-table-column
                width="450"
                prop="product_attr_val_pash"
                label="修改内容">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.content" :key="index">{{item}}</span>
              </template>
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
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {index,brandList,status,simpleIndex,attributeIndex,add,edit,getSku,productLog,delSku,changeSkuPrice,del} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";
import ldlControlWindow from "@/components/ldlControlWindow";
export default {
  name: "GoodsManage",
  data(){
    return{
      price:0,
      getSku:[],
      delSkuList:[],
      changePriceState:false,
      bottomList:{getSku:[],productLog:[]},
      tabPaneValue:'getSku',
      view_text:[],
      view_textTwo:[],
      attreType:'',
      dialogImageUrl: '',
      dialogImageUrlTwo:'',
      dialogVisible: false,
      dialogVisibleTwo:false,
      selectAttributeData:'',
      inputVisible: false,//属性弹窗里控制input出现
      inputValue: '',//属性弹窗里的输入框值
      addAttributeData:{
        val_name:[]
      },//属性的对象
      attributeIndexArray:[],//属性
      addAttributeState:false,
      data:[{attr_id:11,atterName:'颜色',value:['蓝色','绿色']}],
      imageUrl:'',
      loading:false,//控制搜索加载的
      simpleIndexArray:[],//分类
      brandArray:[],//数组品牌
      form:{attr:[]},
      changeGoodsState:false,
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'product_name',label:'商品名称',width:'180'},
          {prop:'brand_name',label:'品牌名称',},
          {prop:'classify_name',label:'商品分类名称',},
          {prop: 'cover_link_img',label: '封面图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop: 'video_link',label: '视频',type:'video',imgStyle:{width:'50px',height:'50px'}},
          {prop: 'view_text',label: '详情图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop: 'product_carousel_img',label: '轮播图',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop:'explain',label:'商品说明',width:250,showOverflowTooltip:true,},
          {prop:'weight',label:'商品重量',sortable:"custom"},
          {prop:'long_size',label:'商品长度',unit:'cm',sortable:"custom"},
          {prop:'wide_size',label:'商品宽度',unit:'cm',sortable:"custom"},
          {prop:'high_size',label:'商品高度',unit:'cm',sortable:"custom"},
          {prop:'volume_size',label:'商品体积',unit:'cm³',sortable:"custom"},
          {prop:'product_lock_fee',label:'进货锁定价格',unit:'￥',width:100,},
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
  watch:{
    price(){
      for (let i = 0; i < this.getSku.length; i++) {
        let getSku=[... this.getSku]
        getSku[i].price=this.price
        this.getSku=[... getSku]
      }
    }
  },
  methods:{
    delGoods(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          del({id:this.selectRow.id}).then(res=>{
            this.$message.success(res.msg)
            this.getList()
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
    //提交批量的价格
    onSubmitPrice(){
      console.log(this.delSkuList)
      delSku({id:this.delSkuList}).then(()=>{
        changeSkuPrice({id_array:this.getSku}).then(res=>{
          this.$message.success(res.msg)
          this.changePriceState=false
          this.getList()
          this.changeTab()
        })
      })
    },
    // 删除价格
    delSku(e){
      this.delSkuList.push(this.getSku[e].id)
      this.getSku.splice(e,1)
    },
    //打开价格弹窗
    changePrice(){
      this.delSkuList=[]
      if(this.selectRow){
        this.getSku=[... this.bottomList.getSku]
        this.changePriceState=true
      }else{
        this.$message.error('请选中一行')
      }
    },
    listClick(e){
      if(this.tabPaneValue==='getSku'){
        getSku({product_id:e.id}).then(res=>{
          console.log(res)
          this.bottomList.getSku=res.data
        })
      }else{
        this.productLogList({product_id:e.id,limit:10000})
      }
      // Expose pussy   closeup  upskirtjerk
    },
    changeTab(){
      let e = this.selectRow
      if(this.tabPaneValue==='getSku'){
        getSku({product_id:e.id}).then(res=>{
          console.log(res)
          this.bottomList.getSku=res.data
        })
      }else{
        this.productLogList({product_id:e.id,limit:10000})
      }
    },
    productLogList(e){
      productLog(e).then(res=>{
        this.bottomList.productLog=res.data.data
      })
    },
    //删除
    delAttre(e){
      let form={... this.form}
      form.attr.splice(e,1)
      this.form= {... form}
    },
    onAttre(e,s){
      this.attreType=s
      this.selectAttributeData=e.attr_name
      this.addAttributeData=e
      this.attributeMethod()
      this.addAttributeState=true
    },
    //选中的属性分类去重
    onSelectAttr_id(e){
      let a = this.attributeIndexArray.filter(item=>{
        return item.id === e
      })
      for (let i = 0; i < this.form.attr.length; i++) {
        if (this.form.attr[i].attr_id==a[0].id){
          this.selectAttributeData=''
          return this.$message.error('你已经选过此属性分类')
        }
      }
      this.addAttributeData.attr_name=a[0].attr_name
      this.addAttributeData.attr_id=a[0].id
    },
    //新建
    addAttributeSubmit(){
      if (this.addAttributeData.attr_id){
        let form={...this.form}
        if (this.attreType>=0){
          form.attr.splice(this.attreType,1,this.addAttributeData)
        }else{
          form.attr.push(this.addAttributeData)
        }
        this.form= {... form}
        this.addAttributeState=false
      }else{
        this.$message.error('请选择属性类型')
      }
    },
    //显示input吗
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        //自动聚焦
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //input失去焦点
    handleInputConfirm() {
      let inputValue = this.inputValue;
      for (let i = 0; i < this.addAttributeData.val_name.length; i++) {
        if(this.addAttributeData.val_name[i]===this.inputValue){
          return this.$message.error('你已添加过')
        }
      }
      if (inputValue) {
        let val_name=[... this.addAttributeData.val_name]
        val_name.push(inputValue);
        this.addAttributeData.val_name=val_name
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    //属性标签的删除
    handleClose(tag) {
      let addAttributeData= {... this.addAttributeData}
      addAttributeData.val_name.splice(addAttributeData.val_name.indexOf(tag), 1);
      this.addAttributeData=addAttributeData
    },
    //新建属性分类的弹窗打开
    addAttribute(){
      this.attreType=-1
      this.selectAttributeData=''
      this.addAttributeData={val_name:[]}
      this.attributeMethod()
      this.addAttributeState=true
    },
    //多图的删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.view_text=fileList
    },
    //多图的删除
    handleRemoveTwo(file, fileList) {
      console.log(file, fileList);
      this.view_textTwo=fileList
    },
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
      // this.view_text.push({name:'图片'+fileList.length+1,url:response.data.url})
    },
    //多图的上传完成点击图片的钩子
    handlePreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功
    uploadSuccessTwo(response, file, fileList){
      let that = this
      let view_textTwo=[]
      fileList.forEach(function (item) {
        if (item.response){
          view_textTwo.push({name:'图片'+item.name,url:item.response.data.url})
        }else{
          view_textTwo.push(item)
        }
      });
      that.view_textTwo=view_textTwo
      // this.view_textTwo.push({name:'图片'+fileList.length+1,url:response.data.url})
    },
    //多图的上传完成点击图片的钩子
    handlePreviewTwo(file) {
      this.dialogImageUrlTwo = file.url;
      this.dialogVisibleTwo = true;
    },
    //图片上传成功
    handleSuccess(e,name){
      let form= {... this.form}
      form[name]=e.data.url
      this.form={... form}
    },
    //限制图片上传的限制
    beforeUpload(e){
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

        this.view_text=[]
        this.view_textTwo=[]
        this.form={attr:[],status:1}
        this.changeGoodsState=true
      }else{
        if(this.selectRow){
          console.log(this.selectRow)
          this.view_text=[]
          this.view_textTwo=[]
          this.form={... this.selectRow}
          for (let i = 0; i < this.selectRow.view_text.length; i++) {
            this.view_text.push({name:'图片'+i,url:this.selectRow.view_text[i]})
          }
          for (let i = 0; i < this.selectRow.product_carousel_img.length; i++) {
            this.view_textTwo.push({name:'图片'+i,url:this.selectRow.product_carousel_img[i]})
          }
          this.brandMethod()
          this.classifyMethod()
          this.changeGoodsState=true
        }else{
          this.$message.error('请选中一行')
        }
      }
    },
    // 提交
    onSubmit(){
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if(valid){
          if (this.form.attr.length<=0){return this.$message.error('你得先填写属性')}
          let form ={... this.form}
          let view_text=[... this.view_text]
          form.view_text=[]
          for (let i = 0; i < view_text.length; i++) {
            form.view_text.push(view_text[i].url)
          }
          let view_textTwo=[... this.view_textTwo]

          console.log(view_textTwo)
          form.product_carousel_img=[]
          for (let i = 0; i < view_textTwo.length; i++) {
            form.product_carousel_img.push(view_textTwo[i].url)
          }
          if (this.form.id){
            edit(form).then(res=>{
              console.log(res)
              this.$message.success(res.msg)
              this.view_text=[]
              this.view_textTwo=[]
              this.form={attr:[]}
              this.changeGoodsState=false
              this.getList()
            })
          }else{
            add(form).then(res=>{
              console.log(res)
              this.$message.success(res.msg)
              console.log(res)
              this.view_text=[]
              this.view_textTwo=[]
              this.form={attr:[]}
              this.changeGoodsState=false
              this.getList()
            })

          }
        }
      })
    },
    /**编辑和新增商品*/
    /** 模糊搜索*/
    // 品牌搜索
    brandMethod(e){
      this.loading=true
      brandList({brand_name:e}).then(res=>{
        this.brandArray=res.data
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
    //属性搜索
    attributeMethod(e){
      this.loading=true
      attributeIndex({attr_name:e}).then(res=>{
        this.attributeIndexArray=res.data.data
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
    ldlControlWindow,
    buttonBox,
  },
}
</script>

<style scoped>

</style>