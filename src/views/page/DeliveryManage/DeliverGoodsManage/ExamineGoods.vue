<template>
  <div class="ExamineGoodsWrap">
    <div class="ExamineGoodsSearch">
      <el-input placeholder="请扫描或者输入快递单号" ref="search" autofocus size="small" @keyup.enter.native="onSearch" v-model="searchCode" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="onSearch" clearable></el-button>
      </el-input>
    </div>
    <div class="ExamineGoodsContrast">
      <div class="ExamineGoodsContrastLeft ExamineGoodsContrastBox">
        <div class="ExamineGoodsContrastTitle">未验货</div>
        <el-table
            :show-header="false"
            height="508px"
            :data="oldList"
            style="width: 100%">
          <el-table-column
              prop="product_name"
              label="商品">
            <template slot-scope="scope">
              {{scope.row.product_name}}
              {{scope.row.sku_attr_name}}
            </template>
          </el-table-column>
          <el-table-column
              prop="number"
              label="数目"
              width="120">
            <template slot-scope="scope">
              <el-input-number style="width: 100px" v-model="scope.row.number" :min="1" :max="scope.row.maxNumber" label="数目" size="mini" />
            </template>
          </el-table-column>
          <el-table-column
              prop="number"
              label="操作"
              width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="delOldList(scope.$index)">去除核验</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
<!--      <div class="ExamineGoodsContrastCenter"></div>-->
      <div class="ExamineGoodsContrastRight ExamineGoodsContrastBox">
        <div class="ExamineGoodsContrastTitle">已验货</div>
        <el-table
            :show-header="false"
            height="300px"
            :data="newList"
            style="width: 100%">
          <el-table-column
              prop="product_name"
              label="商品">
            <template slot-scope="scope">
              {{scope.row.product_name}}
              {{scope.row.sku_attr_name}}
            </template>
          </el-table-column>
          <el-table-column
              prop="number"
              label="数目"
              width="120">
          </el-table-column>
        </el-table>
        <div class="ExamineGoodsContrastTitle">已手动验货</div>
        <el-table
            :show-header="false"
            height="176px"
            :data="delList"
            style="width: 100%">
          <el-table-column
              prop="product_name"
              label="商品">
            <template slot-scope="scope">
              {{scope.row.product_name}}
              {{scope.row.sku_attr_name}}
            </template>
          </el-table-column>
          <el-table-column
              prop="number"
              label="数目"
              width="120">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="ExamineGoodsContrast ExamineGoodsContrastTwo">
      <div class="ExamineGoodsContrastLeft ExamineGoodsContrastBox">
        <div class="ExamineGoodsContrastTitle">未验电子卡</div>
        <el-table
            :show-header="false"
            height="152px"
            :data="oldCardList"
            style="width: 100%">
          <el-table-column
              prop="product_name"
              label="卡名">
            <template slot-scope="scope">
              {{scope.row.product_name}}
            </template>
          </el-table-column>
          <el-table-column
              prop="number"
              label="数目"
              width="100">
          </el-table-column>
        </el-table>
      </div>
      <!--      <div class="ExamineGoodsContrastCenter"></div>-->
      <div class="ExamineGoodsContrastRight ExamineGoodsContrastBox">
        <div class="ExamineGoodsContrastTitle">已验电子卡</div>
        <el-table
            :show-header="false"
            height="152px"
            :data="newCardList"
            style="width: 100%">
          <el-table-column
              prop="product_name"
              label="卡名">
            <template slot-scope="scope">
              {{scope.row.product_name}}
            </template>
          </el-table-column>
          <el-table-column
              prop="number"
              label="数目"
              width="100">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottomButtonRow">
      <el-button type="danger" size="medium" @click="overSubmit">重置</el-button>
      <el-button size="medium" @click="backTo">取消</el-button>
      <el-button type="primary" size="medium" @click="toSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import {security_express_code,is_repeat_scanning,examine_product,is_cart_scaning} from "@/api/DeliveryManage/DeliverGoodsManage/SynchroDeliver";

export default {
  name: "ExamineGoods",
  data(){
    return{
      searchCode:'',
      requireList:{},
      oldList:[],
      newList:[],
      oldCardList:[],
      newCardList:[],
      delList:[],
    }
  },
  watch:{
    oldList:{
      handler(newName, oldName) {
        if (newName!==oldName){
          if(newName.length==0&&this.oldCardList.length==0){
            if(this.requireList.id){
              this.submit()
            }
          }
        }
      },
      deep: true
    },
    oldCardList:{
      handler(newName, oldName) {
        if (newName!==oldName){
          if(newName.length==0&&this.oldList.length==0){
            if(this.requireList.id){
              this.submit()
            }
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getcode()
  },
  methods:{

    palyAudio(e){
      let mp = 'https://erp.sportqx.com/goodsErp/mp3/'+e+'.mp3'
      let mp3 = new Audio(mp)
      mp3.play() //
    },
    /**扫码收尾*/
    submit(){
      let that=this
      examine_product({product:this.newList,product_card:this.newCardList,plfahuo_id:this.requireList.id}).then(res=>{
        that.palyAudio(3)
        that.$message.success(res.msg)
        that.overSubmit()
      }).catch(err => {
        that.palyAudio(4)
        that.$message({
          message: err,
          type: 'error'
        })
      })
    },
    overSubmit(){
      this.requireList={}
      this.searchCode=''
      this.oldList=[]
      this.newList=[]
      this.oldCardList=[]
      this.newCardList=[]
      this.delList=[]
      this.$refs.search.focus()
    },
    toSubmit(){
      if(this.oldList.length>0&&this.oldCardList.length>0){
        this.palyAudio(5)
        this.$message.error('需要验完所有商品')
      }else{
        this.submit()
      }
    },
    backTo(){
      this.$router.push({path: '/DeliveryManage/DeliverGoodsManage/SynchroDeliver'})
    },
    /**扫码收尾*/
    /**扫码完成的处理*/
    //判断扫描的类型
    getCodeOver(code){
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/
      if(reg.test(code)){
        //验证是否是电子卡
        if (code.indexOf('nest.smxos.com') != -1){
          this.cardJudge(code)
          console.log('含有')
        }else{
          //商品处理
          this.goodsJudge(code)
          console.log('不含有')
        }
      }
      // else{
      //   this.searchCode=code
      //   this.onSearch()
      // }
    },
    //判断扫描的类型
    //扫描完的左侧商品处理
    goodsJudge(code){
      let that=this
      let getCode=that.getUrlParam('code',code)
      let haveGoods=-1
      //请求接口拿到商品id且判断有没有用过
      is_repeat_scanning({a_fake_17:getCode}).then(res=>{
        for (let i = 0; i < that.oldList.length; i++) {
          let item=that.oldList[i]
          if(item.product_sku_id===res.data.product_sku_id){
            haveGoods=i
          }
        }
        if (haveGoods>=0){
          that.overGoodsJudge(getCode,haveGoods)
        }else{
          that.palyAudio(12)
          that.$message.error('这个订单无需验此商品')
        }
      })
    },
    //扫描完的左侧商品处理
    //扫描完的右侧商品处理
    overGoodsJudge(code,index){
      let that=this
      let oldList=[... that.oldList]
      let newList=[... that.newList]
      let haveList=-1
      let haveListJudge=-1
      let oldToNew= {... that.oldList[index]}
      for (let i = 0; i < that.newList.length; i++) {
        let newListData=that.newList[i]
        if (oldList[index].product_sku_id==newList[i].product_sku_id){
          haveList=i
          console.log(JSON.stringify(newListData.a_fake_17),JSON.stringify(newListData.a_fake_17).indexOf(code))
          if (JSON.stringify(newListData.a_fake_17).indexOf(code)!=-1){
            haveListJudge=i
          }
        }
      }
      if (haveListJudge>=0){
        that.palyAudio(10)
        that.$message.error('此防伪码已经在此订单')
      }else{
        if(that.oldList[index].number>1){
          oldList[index].number-=1
          oldList[index].maxNumber-=1
        }else{
          oldList.splice(index,1)
        }
        if(haveList>=0){
          newList[haveList].number+=1
          newList[haveList].a_fake_17.push(code)
        }else{
          oldToNew.number=1
          oldToNew.a_fake_17=[code]
          newList.push(oldToNew)
        }
        that.newList=[... newList]
        that.oldList=[... oldList]
      }
    },
    //扫描完的右侧商品处理

    //扫描左侧的电子卡
    cardJudge(code){
      let that=this
      let getCode=that.getUrlParam('exchangeCode', code)
      console.log(getCode,88989898)
      let haveGoods=-1
      // //请求接口拿到商品id且判断有没有用过
      is_cart_scaning({card_id:getCode}).then(res=>{
        for (let i = 0; i < that.oldCardList.length; i++) {
          let item=that.oldCardList[i]
          if(item.product_sku_id===res.data){
            haveGoods=i
          }
        }
        if (haveGoods>=0){
          that.overCardJudge(getCode,haveGoods)
        }else{
          that.palyAudio(12)
          that.$message.error('这个订单无需验此商品')
        }
      })
    },
    //扫描左侧的电子卡
    //扫描右侧的电子卡
    overCardJudge(code,index){
      let that=this
      let oldCardList=[... that.oldCardList]
      let newCardList=[... that.newCardList]
      let haveList=-1
      let haveListJudge=-1
      let oldToNew= {... that.oldCardList[index]}
      for (let i = 0; i < that.newCardList.length; i++) {
        let newListData=that.newCardList[i]
        if (oldCardList[index].product_sku_id==newCardList[i].product_sku_id){
          haveList=i
          if (JSON.stringify(newListData.card_id).indexOf(code)!=-1){
            haveListJudge=i
          }
        }
      }
      if (haveListJudge>=0){
        that.palyAudio(7)
        that.$message({
          message: '你扫描的电子卡已添加过了',
          type: 'error'
        })
      }else{
        if(that.oldCardList[index].number>1){
          oldCardList[index].number-=1
        }else{
          oldCardList.splice(index,1)
        }
        if(haveList>=0){
          newCardList[haveList].number+=1
          newCardList[haveList].card_id.push(code)
        }else{
          oldToNew.number=1
          oldToNew.card_id=[code]
          newCardList.push(oldToNew)
        }
        that.newCardList=[... newCardList]
        that.oldCardList=[... oldCardList]
      }
    },
    //扫描右侧的电子卡
    //获取url
    getUrlParam(name, e) {
      // a标签跳转获取参数
      if (name=='goods_code') {
        return this.getDataGoods_code
      }else{
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var url = e
        var r = url
            .slice(url.indexOf('?'))
            .substr(1)
            .match(reg)
        if (r != null) return r[2]
        return null

      }
    },
    /**扫码完成*/
    /**扫码枪计数根据时间来的如果输入的很快的然后进行结束代表着扫码枪事件*/
    getcode() {
      this.start = new Date().getTime()
      let code = ''
      let lastTime, nextTime
      let lastCode, nextCode
      const that = this
      window.document.onkeypress = function(e) {
        if (window.event) {
          // IE
          nextCode = e.keyCode
        } else if (e.which) {
          // Netscape/Firefox/Opera
          nextCode = e.which
        }
        if (e.which === 13) {
          if (code.length < 3) return // 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有
          that.getCodeOver(code) // 获取到扫码枪输入的内容，做别的操作
          code = ''
          lastCode = ''
          lastTime = ''
          return
        }
        nextTime = new Date().getTime()
        if (!lastTime && !lastCode) {
          code += e.key
        }
        if (lastCode && lastTime && nextTime - lastTime > 500) {
          // 当扫码前有keypress事件时,防止首字缺失
          code = e.key
        } else if (lastCode && lastTime) {
          code += e.key
        }
        lastCode = nextCode
        lastTime = nextTime
      }
    },
    /**扫码枪计数根据时间来的如果输入的很快的然后进行结束代表着扫码枪事件*/
    delOldList(e){
      let that=this
      let oldList=[... that.oldList]
      oldList.splice(e,1)
      let delList=[... that.delList]
      delList.push(that.oldList[e])
      that.delList=delList
      that.oldList=oldList
      console.log(e)
    },
    onSearch(){
      security_express_code({express_code:this.searchCode}).then(res=>{
        console.log(res)
        this.$refs.search.blur()
        this.requireList=res.data
        let oldList=[],oldCardList=[];
        res.data.product.forEach(function (value) {
          value.maxNumber=value.number
          oldList.push(value)
        });
        res.data.card.forEach(function (value) {
          value.maxNumber=value.number
          oldCardList.push(value)
        });
        this.oldCardList=oldCardList
        this.oldList=oldList
      }).catch((err)=>{
        console.log(err)
        this.searchCode=""
      })
    }
  }
}
</script>
<style>
.ExamineGoodsContrast .el-table td,.ExamineGoodsContrast .el-table th{
  padding: 0 !important;
}
</style>
<style scoped lang="scss">
.ExamineGoodsWrap{
  min-width: 900px;
  padding:5px 10px;
}
.ExamineGoodsSearch{
  width: 60%;
  min-width: 600px;
  margin: 15px auto;
}
.bottomButtonRow{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}
.ExamineGoodsContrast{
  width: 98%;
  min-width: 800px;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  margin:  0 auto;
}
.ExamineGoodsContrastTwo .ExamineGoodsContrastBox{
  height: 180px;
  margin-top: 10px;
}
.ExamineGoodsContrastBox{
  height: 540px;
  border: 1px solid #cccccc;
  width: 49%;
  max-width: 700px;
}
.ExamineGoodsContrastTwo .ExamineGoodsContrastBox .ExamineGoodsContrastTitle{
  font-size: 12px;
  font-weight: 600;
}
.ExamineGoodsContrastTitle{
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  background: #fafafa;
  padding: 6px;
}
</style>