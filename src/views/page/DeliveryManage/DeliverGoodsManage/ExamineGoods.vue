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
            :data="oldList.product"
            style="width: 100%">
          <el-table-column
              prop="product_name"
              label="日期">
          </el-table-column>
          <el-table-column
              prop="number"
              label="数目"
              width="120">
            <template slot-scope="scope">
              <el-input-number style="width: 100px" v-model="scope.row.number" :min="1" label="数目" size="mini" />
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
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <div class="ExamineGoodsContrastTitle">已手动验货</div>
      </div>
    </div>
    <div class="ExamineGoodsContrast ExamineGoodsContrastTwo">
      <div class="ExamineGoodsContrastLeft ExamineGoodsContrastBox">
        <div class="ExamineGoodsContrastTitle">未验电子卡</div>
      </div>
      <!--      <div class="ExamineGoodsContrastCenter"></div>-->
      <div class="ExamineGoodsContrastRight ExamineGoodsContrastBox">
        <div class="ExamineGoodsContrastTitle">已验电子卡</div>
      </div>
    </div>
    <div class="bottomButtonRow">
      <el-button type="danger" size="medium">重置</el-button>
      <el-button size="medium">取消</el-button>
      <el-button type="primary" size="medium">提交</el-button>
    </div>
  </div>
</template>

<script>
import {security_express_code} from "@/api/DeliveryManage/DeliverGoodsManage/SynchroDeliver";

export default {
  name: "ExamineGoods",
  data(){
    return{
      searchCode:'',
      oldList:{}
    }
  },
  methods:{
    delOldList(e){
      console.log(e)
    },
    onSearch(){
      security_express_code({express_code:this.searchCode}).then(res=>{
        console.log(res)
        this.$refs.search.blur()
        this.oldList=res.data
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
  margin:  0 auto;
  justify-content: space-between;
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