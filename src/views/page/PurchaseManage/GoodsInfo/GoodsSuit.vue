<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination @listClick="listClick" :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" v-model="tabPaneValue" class="ldlTab" @tab-click="changeTab" style="height: calc(100% - 4px)">
        <el-tab-pane label="组合商品" name="product_combination" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_name"
                align="center"
                label="商品名称">
            </el-table-column>
            <el-table-column
                prop="cover_link_img"
                label="商品的封面图">
              <template slot-scope="scope">
                <el-image
                    style="width: 40px; height: 40px"
                    :src="scope.row.cover_link_img"
                    :preview-src-list="[scope.row.cover_link_img]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
                prop="number"
                align="center"
                width="80"
                label="商品数量">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ldlControlWindow>
<!--新增弹窗-->
    <el-dialog
        v-el-drag-dialog
        top="2.5%"
        width="50%"
        custom-class="minWidth700"
        :visible.sync="addGoodsSuitState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改商品':'新增商品'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" size="mini" :inline="true">
        <el-form-item label="组合品牌名称:" prop="brand_id" :rules="{ required: true, message: '请选择品牌名称', trigger: 'blur' }">
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
        <el-form-item label="商品组合名称:" prop="product_name" :rules="{ required: true, message: '请填写商品组合名称', trigger: 'blur' }">
          <el-input v-model="form.product_name" placeholder="请输入商品组合名称"></el-input>
        </el-form-item>
        <el-form-item label="商品组合分类:" prop="product_classify_id" :rules="{ required: true, message: '请选择商品组合分类', trigger: 'blur' }">
        <el-select v-model="form.product_classify_id" multiple v-show="1==2"></el-select>
        <el-select
            v-model="labelValue"
            filterable
            :filter-method="classifyMethod"
            @change="changeLable"
            placeholder="请选择商品分类"
          >
            <el-option
              v-for="(item,index) in simpleIndexArray"
              :key="index"
              :label="item.classify_name"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
          <div>
            <el-tag
              style="marginRight:5px"
              v-for="(item,index) in selectlabel"
              :key="index.name"
              size="mini"
              @close="handleCloseSelectTag(index)"
              :type="tagArr[item.id%4].type"
              closable
            >{{item.classify_name}}</el-tag>
          </div>
          <!--<el-select
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
          </el-select>-->
        <el-form-item label="商品状态:" prop="status">
          <el-switch
              v-model="form.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="在售"
              inactive-text="下架">
          </el-switch>
        </el-form-item>
        <br>
        <el-form-item label="商品封面图:" prop="cover_link_img" :rules="{ required: true, message: '请上传商品组合封面图', trigger: 'blur' }">
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
        <el-form-item label="商品视频:" prop="video_link">
          <el-upload
              class="avatar-uploader"
              accept="video/*"
              action="/admin/upload_image/uploadvedio"
              name="file"
              :show-file-list="false"
              :on-success="(e)=>{handleSuccess(e,'video_link')}"
              :before-upload="beforeUpload"
              :on-progress="handlePictureProgress">
            <video v-if="form.video_link" :src="form.video_link" class="avatar" controls/>
            <el-progress v-else-if="percentNum!=0" :width="160" style="margin: 9px" type="circle" :percentage="percentNum" ></el-progress>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="width: 178px;display: flex;align-items: center;justify-content: center" v-if="form.video_link">
            <el-link type="danger" @click="DeleteProgress"  icon="el-icon-delete" >删除</el-link>
          </div>
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
<!--        2021年1月13日10:13:23吴老板说以后商品肯定不会选单个-->
        <el-form-item label="组合的商品:" prop="product_combination">
          <el-select
              v-model="selectGoods"
              filterable
              remote
              reserve-keyword
              placeholder="请先选择要添加的商品"
              :remote-method="goodsMethod"
              :loading="loading">
            <el-option
                v-for="item in goodsArray"
                :disabled="haveGoods(item.id)"
                :key="item.id"
                :label="item.product_name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 15px" size="small" @click="addSelectGoods">添加商品</el-button>
        </el-form-item>
        <el-table
            :data="form.product_combination"
            border
            style="width: 100%;margin-bottom: 15px">
          <el-table-column
              prop="product_name"
              label="商品名字">
          </el-table-column>
          <el-table-column
              prop="number"
              label="数量"
              align="center"
              width="160">
            <template slot-scope="{row}">
              <el-input-number size="mini"  v-model="row.number" :precision="0" :step="1" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
              prop="id"
              label="操作"
              align="center"
              width="120">
            <template slot-scope="scope">
              <el-button type="danger"  icon="el-icon-delete" size="mini" @click="delGoodsRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="组合的商品:" prop="product_combination_sku">
          <el-button type="primary" size="small" @click="openInitializeGoods">{{form.product_combination_sku?'重置商品规格':'生成商品规格'}}</el-button>
          <span style="font-size: 12px;color: red;margin-left: 20px">*如果要修改数目或者增加商品请重置商品规格</span>
        </el-form-item>
        <el-table
            :data="form.product_combination_sku"
            border
            style="width: 100%">
          <el-table-column
              prop="sku_name"
              label="商品名字">
          </el-table-column>
          <el-table-column
              prop="cost"
              label="成本价"
              align="center"
              width="160">
            <template slot-scope="{row}">
              <el-input-number size="mini"  v-model="row.cost" :precision="2" :step="1" :min="0"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
              prop="price"
              label="价格"
              align="center"
              width="160">
            <template slot-scope="{row}">
              <el-input-number size="mini"  v-model="row.price" :precision="2" :step="1" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
              prop="id"
              label="操作"
              align="center"
              width="120">
            <template slot-scope="scope">
              <el-button type="danger"  icon="el-icon-delete" size="mini" @click="delGoodsSuitRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsSuitState = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {index,del,status,edit,add,getSku,getSkuByCombination} from "@/api/PurchaseManage/GoodsInfo/GoodsSuit";
import ldlControlWindow from "@/components/ldlControlWindow";
import {brandList, simpleIndex,simpleList} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";

export default {
  name: "GoodsSuit",
  data(){
    return{
      tagArr: [
        { name: "标签一", type: "" },
        { name: "标签二", type: "success" },
        { name: "标签三", type: "warning" },
        { name: "标签四", type: "danger" },
      ],
      selectlabel: [],
      labelValue: "",
      newArr:[],
      result:[],
      product_combination_sku_list:[],
      //上传视频加载进度条
      percentNum:0,
      selectGoods:'',
      view_text:[],
      view_textTwo:[],
      dialogImageUrl: '',
      dialogImageUrlTwo:'',
      dialogVisible: false,
      dialogVisibleTwo:false,
      simpleIndexArray:[],
      goodsArray:[],
      loading:false,
      brandArray:[],
      addGoodsSuitState:false,
      bottomList: {},
      tabPaneValue:'product_combination',
      form:{product_combination:[]},
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'product_name',label:'商品名称',width:'180'},
          {prop:'brand_name',label:'品牌名称',},
          {prop:'classify_data',label:'商品分类名称',type:'tags',data:{key:'id',nameKey:'classify_name'}},
          {prop:'status',type:'tag',label:'状态',data:[{type:'success',key:1,name:'在售'},{type:'danger',key:2,name:'下架'}],},
          // {prop: 'video_link',label: '视频',type:'video',imgStyle:{width:'50px',height:'50px'}},
          {prop: 'cover_link_img',label: '封面图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          // {prop: 'view_text',label: '详情图片',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          // {prop: 'product_carousel_img',label: '轮播图',type:'image',fit:'',imgStyle:{width:'100px',height:'50px'}},
          {prop:'explain',label:'商品说明',width:250,showOverflowTooltip:true,},
          // {prop:'weight',label:'商品重量',sortable:"custom"},
          // {prop:'long_size',label:'商品长度',unit:'cm',sortable:"custom"},
          // {prop:'wide_size',label:'商品宽度',unit:'cm',sortable:"custom"},
          // {prop:'high_size',label:'商品高度',unit:'cm',sortable:"custom"},
          // {prop:'volume_size',label:'商品体积',unit:'cm³',sortable:"custom"},
          // {prop:'product_lock_fee',label:'商品成本价',unit:'￥',width:100,sortable:"custom"},
          {prop:'is_delete',type:'tag',label:'是否删除',data:[{type:'danger',key:2,name:'已删除'}],width:'80'},
          {prop:'create_time',label:'创建时间',type:"date",sortable:"custom",width:'140'},
          {prop:'update_time',label:'更新时间',type:"date",sortable:"custom",width:'140'},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  computed:{
    haveGoods(){
      return function (e){
        let index=0
          for (let j = 0; j < this.form.product_combination.length; j++) {
            if(e==this.form.product_combination[j].relate_product_id){
              index+=1
            }
          }
        if (index>0){
          return true
        }else{
          return false
        }
      }
    }
  },
  methods:{
        //去除重复选择的标签
    delRepeat(e) {
      console.log(e,'99999999999999')
      var that = this;
      return new Promise((resolve, reject) => {
        var j = false;
        for (let i = 0; i < that.selectlabel.length; i++) {
          if (that.selectlabel[i].id == that.simpleIndexArray[e].id) {
            j = true;
          }
        }
        if (j) {
          this.$message({
            message: "您已经选过此标签",
            type: "warning",
          });
          reject();
        } else {
          resolve();
        }
      });
    },

    //选择后添加到数组
    changeLable(e) {
      this.delRepeat(e)
        .then(() => {
          this.selectlabel.push(this.simpleIndexArray[e]);
          var form = {
            ...this.form,
          };
          form.product_classify_id.push(this.simpleIndexArray[e].id);
          this.labelValue = "";
          this.form = form;
        })
        .catch(() => {
          this.labelValue = "";
        });
    },

    //去除标签
    handleCloseSelectTag(e) {
      this.selectlabel.splice(e, 1);
      this.form.product_classify_id.splice(e, 1);
    },
    getProduct_combination_sku_list(){
      let that=this
      let form={... that.form}
      let product_combination_sku=[]
      for (let i = 0; i < that.result.length; i++) {
        let item=that.result[i]
        let Product_combination_sku_item={}
        for (let j = 0; j < item.length; j++) {
          let item_item=item[j]
          if (j==0){
            Product_combination_sku_item={
              price:Number(item_item.price*item_item.number).toFixed(2),
              sku_name:item_item.number+'x'+item_item.sku_name,
              product_attr_val_pash:item_item.sku,
            }
          }else{
            Product_combination_sku_item.price=(Number(Product_combination_sku_item.price)+Number(item_item.price*item_item.number)).toFixed(2)
            Product_combination_sku_item.sku_name+=item_item.number+'x'+item_item.sku_name
            Product_combination_sku_item.product_attr_val_pash+='#'+item_item.sku
          }
          console.log(Product_combination_sku_item)
        }
        product_combination_sku.push(Product_combination_sku_item)
      }
      form.product_combination_sku=product_combination_sku
      this.form ={... form}
      console.log(that.result,'88888')
    },
    resultToArr(arr, index){
      let that=this
      console.log(arr,index,'这是函授')
      // return new Promise((resolve) => {
        for (var i = 0; i<arr[index].length; i++) {
          that.newArr[index] = arr[index][i];
          if (index != arr.length - 1) {
            that.resultToArr(arr, index + 1)
                // .then(()=>{
              // let newArr=[... that.newArr]
              // return resolve(newArr)
            // })
          } else {
            // resolve(that.newArr)
            let newArr=[... that.newArr]
            that.result.push(newArr)
            that.getProduct_combination_sku_list()
            // resolve(that.result)
          }
        }
      // })
    },
    openInitializeGoods(e){
      if (this.form.product_combination_sku){
        let form={... this.form }
        form.product_combination_sku=[]
        this.form = {...form}
      }
      this.newArr=[]
      this.result=[]
      this.product_combination_sku_list=[]
      this.initializeGoods(e)
    },
    initializeGoods(e){
      let form={... this.form}
      let product_combination=[... form.product_combination]
      let j=e>0?e:0
      getSku({product_id:product_combination[j].relate_product_id,number:product_combination[j].number }).then(res=>{
        this.product_combination_sku_list[j]=res.data
        if(product_combination.length-1==j){
          console.log(this.product_combination_sku_list,'-----------------')
          this.resultToArr(this.product_combination_sku_list,0)
        }else{
          this.initializeGoods(j+1)
        }
      })
    },
    // 视频加载
    handlePictureProgress(event, file, fileList) {
      console.log(event, file, fileList)
      this.percentNum=Math.round(event.percent)
      console.log(this.percentNum)
    },
    //删除视频按钮
    DeleteProgress(){
      this.percentNum=0
      let form = {...this.form}
      form.video_link=undefined
      this.form={... form}
      console.log(this.form.video_link)
    },
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if(valid){
          if (this.form.product_combination.length<=0){return this.$message.error('你得先填写添加商品')}
          let form ={... this.form}
          let view_text=[... this.view_text]
          form.view_text=[]
          for (let i = 0; i < view_text.length; i++) {
            form.view_text.push(view_text[i].url)
          }
          let view_textTwo=[... this.view_textTwo]
          form.product_carousel_img=[]
          for (let i = 0; i < view_textTwo.length; i++) {
            form.product_carousel_img.push(view_textTwo[i].url)
          }
          form.product_combination_sku.forEach(item=>{
            delete item.sku_name
            if(this.form.id){
              delete item.product_name
            }
          })
          if (this.form.id){
            edit(form).then(res=>{
              console.log(res)
              this.$message.success(res.msg)
              this.view_text=[]
              this.view_textTwo=[]
              this.form={product_combination:[],status:1}
              this.addGoodsSuitState=false
              this.selectRow = undefined
              this.getList()
            })
          }else{
            add(form).then(res=>{
              this.$message.success(res.msg)
              console.log(res)
              this.view_text=[]
              this.view_textTwo=[]
              this.form={product_combination:[],status:1}
              this.addGoodsSuitState=false
              this.getList()
            })

          }
        }
      })
    },
    delGoodsRow(e){
      let form = {... this.form }
      form.product_combination.splice(e,1)
      this.form = form
    },
    delGoodsSuitRow(e){
      let form = {... this.form }
      form.product_combination_sku.splice(e,1)
      this.form = form
    },
    //添加商品进入列表
    addSelectGoods(){
      if (this.selectGoods){
        for (let i = 0; i < this.goodsArray.length; i++) {
          if(this.goodsArray[i].id==this.selectGoods){
            let form = {... this.form }
            let data={relate_product_id:this.goodsArray[i].id,product_name:this.goodsArray[i].product_name,number:1}
            form.product_combination.push(data)
            this.selectGoods=''
            this.form = form
          }
        }
      }else{
        this.$message.error('请先选择商品')
      }
    },
    //新增还是编辑
    changeGoodsSuit(e){
      this.selectlabel = [];
      this.labelValue = "";
      if(e==='add'){
        this.goodsMethod()
        this.brandMethod()
        this.classifyMethod()
        this.view_text=[]
        this.view_textTwo=[]
        this.addGoodsSuitState=true
        this.form={status:1,product_combination:[],product_classify_id:[]}
        console.log('新增')
      }else{
        if (this.selectRow){
          this.goodsMethod()
          this.brandMethod()
          this.classifyMethod()

          this.view_text=[]
          this.view_textTwo=[]
          for (let i = 0; i < this.selectRow.view_text.length; i++) {
            this.view_text.push({name:'图片'+i,url:this.selectRow.view_text[i]})
          }
          for (let i = 0; i < this.selectRow.product_carousel_img.length; i++) {
            this.view_textTwo.push({name:'图片'+i,url:this.selectRow.product_carousel_img[i]})
          }
          // for (let i = 0; i < this.selectRow.product_combination.length; i++) {
          //   this.selectRow.product_combination[i].product_id=this.selectRow.product_combination[i].relate_product_id
          // }
          this.form = {... this.selectRow,product_classify_id:[]}
          if (this.selectRow.classify_data.length > 0) {
            for (let i = 0; i < this.selectRow.classify_data.length; i++) {
              this.form.product_classify_id.push(this.selectRow.classify_data[i].id);
              this.selectlabel.push(this.selectRow.classify_data[i]);
            }
          }
          this.getComposeSku(this.selectRow.id)
        }else{
          this.$message.error('求你选一条操作吧')
        }
      }
    },
    //编辑前获取组合的sku
    getComposeSku(e){
      let form={... this.form}
      getSkuByCombination({product_id:e}).then(res=>{
        console.log(res)
        form.product_combination_sku=res.data
        this.form= {... form}
        this.addGoodsSuitState=true
      })
    },
    //上架下架
    changeGoodsSuitState(){
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
    //删除
    delGoodsSuit(){
      if(this.selectRow){
        this.$confirm('此操作将永久删除该商品组合, 是否继续?', '提示', {
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
    //切换tab现在无用
    changeTab(){

    },
    //列表选择
    listClick(e){
      if(this.tabPaneValue==='product_combination'){
        let bottomList={... this.bottomList}
        bottomList.product_combination=e.product_combination
        this.bottomList=bottomList
      }else{
        this.productLogList({product_id:e.id,limit:10000})
      }
      // Expose pussy   closeup  upskirtjerk
    },
    //多图的删除
    handleRemove(file, fileList) {
      this.view_text=fileList
    },
    //多图的删除
    handleRemoveTwo(file, fileList) {
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
      simpleIndex({classify_name:e?e:''}).then(res=>{
        this.simpleIndexArray=res.data
      })
    },
    // 商品搜索
    goodsMethod(e){
      this.loading=true
      simpleList({product_name:e}).then(res=>{
        this.goodsArray=res.data
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
    ldlControlWindow,
  },
}
</script>

<style scoped>

</style>
