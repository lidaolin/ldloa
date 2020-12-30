<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight"></ldlControlWindow>
  </div>
</template>

<script>
import ldlTablePagination from '@/components/ldlTablePagination'
import ldlControlWindow from '@/components/ldlControlWindow'
import buttonBox from '@/components/buttonBox'
export default {
  name: "ab",
  components:{
    ldlControlWindow,
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      buttonBoxState:true,
      bottomHeight: '30%',
      tableDataInfo:{
        dataListInfo:[
          {prop:'name',label:'姓名',},
          {prop:'province',label:'省份',},
          {prop:'zip',label:'邮编', sortable:'custom'},
          {prop:'date',label:'时间',sortable:"custom",type:'date',dateFormat:"{y}-{m}-{d} {h}:{i}"},
          {prop:'tags',label:'标签',type:'tag',
            data:[
                {type:'',key:1,name:'我'},
                {type:'success',key:2,name:'是'},
                {type:'info',key:3,name:'你'},
                {type:'warning',key:4,name:'爸爸'},
                {type:'danger',key:5,name:'呀'}
            ],
          },
          {prop: 'name',label:'拖动',type:'derk',width:'40'}
          // {prop:'avatar',label:'头像',type:'avatar',size:30},
          // {prop: 'img',label: '图片',type:'image',imgProp:'src',fit:'',imgStyle:{width:'100px',height:'50px'}}
        ],
        dataList:[
          {
            avatar:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            img:[{src:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'}],
            tags:[1,2],
            date: 1,
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            tags:2,
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            tags:4,
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            tags:'',
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            tags:5,
            date: '2016-05-08',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            tags:4,
            date: '2016-05-06',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            tags:4,
            date: '2016-05-07',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }
        ],
      },
      pagingData:undefined
    }
  },
  methods:{
    functionCall(name) {
      if (name.length == 1) {
        this[name[0]]();
      } else {
        this[name[0]](name[1]);
      }
    },
    getList(){
      console.log(this.pagingData)
    }
  }
}
</script>

<style scoped>

</style>