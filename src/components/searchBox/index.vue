<template>
  <div class="searchBox">
    <el-button native-type="button" size="mini" plain @click="openSearch">高级搜索<i class="el-icon-search el-icon--right"></i></el-button>
    <el-dialog
        v-el-drag-dialog
        width="80%"
        minWidth="600px"
        custom-class="minWidth600"
        :visible.sync="openSearchState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        title="高级搜索"
        size="mini"
        center
    >
      <el-form :inline="true" ref="form" size="mini" class="demo-form-inline modalContainer inputWidth" label-width="120px">
        <el-form-item :label="item.search_name+':'" v-for="(item, index) in list" :key="index">
          <!--普通输入框-->
          <el-input
              v-model="form[index].date"
              :placeholder="'请输入'+item.search_name"
              clearable
              v-if="item.frame_type=='input'"
          ></el-input>
          <!--不可搜索的下拉框-->
          <el-select
              class="select"
              clearable
              v-model="form[index].date"
              placeholder="请选择"
              v-if="item.frame_type=='select'&&item.is_search==2"
          >
            <el-option
                v-for="oitem in item.json_date"
                :key="oitem.id"
                :label="oitem.name"
                :value="oitem.id"
            ></el-option>
          </el-select>
          <!--可搜索的下拉框-->
          <el-select
              class="select"
              v-model="form[index].date"
              filterable
              remote
              clearable
              :remote-method="remoteMethod"
              :loading="loading"
              reserve-keyword
              placeholder="请选择"
              v-if="item.frame_type=='select'&&item.is_search==1"
              @focus="onSelect(index)"
          >
            <el-option
                v-for="item in item.json_date"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
          <!--选择时间范围-->
          <el-date-picker
              v-if="item.frame_type=='dates'"
              v-model="form[index].date"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
          ></el-date-picker>
          <!--选择精确时间-->
          <el-date-picker
              v-model="form[index].date"
              v-if="item.frame_type=='date'"
              type="datetime"
              placeholder="选择日期时间"
          ></el-date-picker>
          <!--范围区间-->
          <div class="inputSection" v-if="item.frame_type=='Section'" >
            <el-input v-model="form[index].a"></el-input>
            <div class="inputSectionDiv">至</div>
            <el-input v-model='form[index].b'></el-input>
          </div>
          <!--单选按钮-->
          <div v-if="item.frame_type=='radio'">
            <el-radio
                v-for="(ite,ind) in item.json_date"
                :key="ind"
                v-model="form[index].date"
                :label="ite.id"
            >{{ite.name}}</el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div size="mini" class="btn-group">
        <el-button type="primary" @click="onSubmit" size="mini">立即搜索</el-button>
        <el-button type="warning" @click="onReset" size="mini">清空</el-button>
        <el-button @click="openSearchState = false" size="mini">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {searchDetails,searchframe} from "@/api/root/root"
export default {
name: "searchBox",
  props:{
    pagingData:{
      type:Object,
    },
  },
  data(){
    return{
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      openSearchState:false,
      list:[],
      form:[],
      loading: false,
      index: "",
    }
  },

  mounted() {
    this.onloading()
  },
  methods:{
    //开始加载
    onloading() {
      // 捕获页面后缀
      var url=this.$route.path
      var datas= url.split("/").reverse()
      searchDetails({menu_name:datas[0]}).then(res=>{
        var form = [],dataInfo = res.data;
        for (var i = 0; i < dataInfo.length; i++) {
          var Arr = {
            date: "",
            db_name: dataInfo[i].db_name,
            db_table: dataInfo[i].db_table,
            search_way: dataInfo[i].search_way,
            frame_type:dataInfo[i].frame_type,
            a:"",
            b:""
          };
          form[i] = Arr;
        }
        this.form = form;
        this.list = res.data
      })
    },

    //可搜索下拉框中的搜索方法
    onSelect(index) {
      this.index = index;
      var datas = this.list;
      let data = {
        search_type_id:datas[index].search_type_id,
        data:"",
      }
      searchframe(data).then(res => {
        this.loading = false;
        datas[index].json_date = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    remoteMethod(query) {
      this.loading = true;
      var datas = this.list;
      var i = this.index;
      let data = {
        search_type_id:datas[i].search_type_id,
        data:query,
      }
      searchframe(data).then(res => {
        this.loading = false;
        datas[i].json_date = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },

    //提交
    onSubmit() {
      var form= Object.keys(this.form)
      for(var i=0;i<form.length;i++){
        if (this.form[i].frame_type=="Section") {
          if (this.form[i].a||this.form[i].b) {
            this.form[i].date=[this.form[i].a,this.form[i].b]
          } else{
            this.form[i].date=''
          }
        }
      }
      let pagingData=this.pagingData
      pagingData.key = this.form
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
      this.openSearchState = false
    },

    //清空
    onReset(){
      this.onloading()
    },

    //打开高级搜索弹框
    openSearch(){
     this.onloading()
     this.openSearchState=true
    }
  }
}
</script>

<style scoped>
.searchBox{
  height: 25px;
}
.btn-group {
  text-align: right;
}
.inputSection{
  display: flex;
  width: 180px;
}
.inputSectionDiv{
  margin:0 15px;
}
.modalContainer{
  overflow-y: scroll;
}

 .modalContainer {
   max-height: 480px;
   overflow-y: scroll;
   padding-right: 10px;
 }

.modalContainer::-webkit-scrollbar {
  width: 1px;
  height: 5px;
  background: rgba(85, 85, 85, .2);
}

.modalContainer::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  border-radius: 5px;
  background-color: #f5f5f5;
  display: none;
}

.modalContainer::-webkit-scrollbar-thumb {
  height: 10px;
  border-radius: 5px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background: rgba(85, 85, 85, .2);
}

</style>
<style>
.inputWidth .el-input__inner{
  width: 200px !important;
}
.inputWidth  .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 200px !important;
}
</style>