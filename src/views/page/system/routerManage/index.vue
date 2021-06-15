<template>
  <div class="pageRoot">
    <div class="MenuManage">
      <el-button type="primary" class='addButton' size='mini' icon="el-icon-plus" @click="addPath(0)">新建</el-button>
    </div>
    <el-table
        class="tableBox"
        :data="menuList"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="title" label="页面名称" align='center' width="180"> </el-table-column>
      <el-table-column prop="affix" label="图钉" align='center'>
        <template slot-scope="{row}" >
          <el-tag v-if="row.affixt" size="mini" type="success">开启</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isHidden" label="menu隐藏" align='center'>
        <template slot-scope="{row}" >
          <el-tag v-if="row.isHidden" size="mini" type="success">是</el-tag>
          <el-tag v-else size="mini" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="keepAlive" label="页面缓存" align='center'>
        <template slot-scope="{row}" >
          <el-tag v-if="row.keepAlive" size="mini" type="success">缓存</el-tag>
          <el-tag v-else size="mini" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="页面禁用" align='center'>
        <template slot-scope="{row}" >
          <el-tag v-if="row.status==1" size="mini" type="danger">否</el-tag>
          <el-tag v-if="row.status==2" size="mini" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lev" label="路由层级" width="80" align='center'>
        <template slot-scope="{row}" >
          <el-tag v-if="row.lev==1" size="mini" type="success">一级</el-tag>
          <el-tag v-if="row.lev==2" size="mini" type="info">二级</el-tag>
          <el-tag v-if="row.lev==3" size="mini" type="warning">三级</el-tag>
          <el-tag v-if="row.lev==4" size="mini" type="danger">四级</el-tag>
          <el-tag v-if="row.lev==5" size="mini" type="primary">五级</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ico" label="图标" width="80" align='center'>
        <template slot-scope="{row}" >
          <span :class='fontClassFun(row.icon)'/>
        </template>
      </el-table-column>
      <el-table-column prop="create_Time" label="创建时间" width="150" align='center'>
        <template slot-scope="{row}" >
          {{ row.create_Time | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column prop="pid" label="操作" width="340" align='center'>
        <template slot-scope="{row}">
          <el-button type="primary" size='mini' plain @click="openBtnMange(row)" v-if="JSON.stringify(row.children) === '[]'">按钮管理</el-button>
          <el-button type="primary" size='mini' plain @click="openAdvancedSearch(row)" v-if="JSON.stringify(row.children) === '[]'">高级搜索管理</el-button>
          <el-button type="primary" size='mini' plain @click="addPath(row)">添加</el-button>
          <el-button type="success" size='mini' plain @click="editPath(row)">编辑</el-button>
          <el-button type="warning" size='mini' plain @click="changeStatus(row)">{{row.status == 1? '开启':'禁用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--菜单管理弹框-->
    <el-dialog
        :title="this.state == 'add'?'新建菜单':'编辑菜单'"
        :visible.sync="pathSwitch"
        :close-on-click-modal='false'
        width="560px"
        center>
      <el-form ref="form" :model="form" label-width="220px" label-position='right' size="small">
        <el-form-item prop="title" label="菜单名称" :rules="[{ required: true, message: '菜单名称不能为空'},]">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="前端页面字段" :rules="[{ required: true, message: '字段名称不能为空'},]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标" :rules="[{ required: true, message: '图标不能为空'},]">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="[{ required: true, message: '排序不能为空'},]">
          <el-input-number
              v-model="form.sort"
              controls-position="right"
              placeholder="请输入序号"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="affix" label="是否开启图钉" :rules="[{ required: true, message: '图钉选择不能为空'},]">
          <el-radio-group v-model="form.affix">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="keepAlive" label="是否开启缓存" :rules="[{ required: true, message: '缓存选择不能为空'},]">
          <el-radio-group v-model="form.keepAlive">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="isHidden" label="前端控制显示(menuy是否隐藏)" :rules="[{ required: true, message: '控制显示不能为空'},]">
          <el-radio-group v-model="form.isHidden">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="addPathSubmit(form)">提交</el-button>
        <el-button type="info" @click="pathSwitch = false">取消</el-button>
      </span>
    </el-dialog>

    <!--按钮管理弹框-->
    <el-dialog center title="按钮管理" :visible.sync="dialogTableVisible">
      <div>
        <el-button type="primary" size="small" plan @click="addBtn">新增</el-button>
      </div>
      <el-table :data="btnData">
        <el-table-column property="title" label="名称" align='center'></el-table-column>
        <el-table-column property="name" width="120" label="唯一性标识" align='center'></el-table-column>
        <el-table-column property="event" label="事件名称" align='center'></el-table-column>
        <el-table-column property="status" label="状态" align='center'>
          <template slot-scope="{row}">
            <el-tag v-if="row.status==2" size="mini" type="danger">禁止</el-tag>
            <el-tag v-if="row.status==1" size="mini" type="success">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="color" label="颜色" align='center'></el-table-column>
        <el-table-column property="sort" label="排序" align='center'></el-table-column>
        <el-table-column
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editBtn(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="changeBtn(scope.row)">{{scope.row.status == 1?'禁止':'开启'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--按钮新增/编辑-->
    <el-dialog title="新增按钮" :visible.sync="dialogFormVisible" width="480px">
      <el-form ref="btnFrom" :model="btnFrom" label-width="100px" label-position='left' size="small">
        <el-form-item label="按钮名称" prop="title" :rules="[{ required: true, message: '菜单名称不能为空'},]">
          <el-input v-model="btnFrom.title" ></el-input>
        </el-form-item>
        <el-form-item label="唯一性标识" prop="name" :rules="[{ required: true, message: '唯一性标识不能为空'},]">
          <el-input v-model="btnFrom.name" ></el-input>
        </el-form-item>
        <el-form-item label="事件名称" prop="event" :rules="[{ required: true, message: '事件名称不能为空'},]">
          <el-input v-model="btnFrom.event" ></el-input>
          <div class="tipsText">事件名称如果携带参数使用“/”分开。eg:add/id</div>
        </el-form-item>
        <el-form-item prop="icon" label="图标">
          <el-input v-model="btnFrom.icon"></el-input>
        </el-form-item>
        <el-form-item label="按钮颜色" prop="color" :rules="[{ required: true, message: '按钮颜色不能为空'},]">
          <el-select v-model="btnFrom.color" placeholder="请选择颜色">
            <el-option
                v-for="(item,index) in colorData"
                :key="index"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="[{ required: true, message: '排序不能为空'},]">
          <el-input-number
              v-model="btnFrom.sort"
              controls-position="right"
              placeholder="请输入序号"
              :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addBtnSubmit(btnFrom)">确 定</el-button>
      </div>
    </el-dialog>

    <!--高级搜索管理弹框-->
    <el-dialog center title="高级搜索" :visible.sync="dialogTableSearch" width="60%">
      <div>
        <el-button type="primary" size="small" plan @click="addSearch">新增</el-button>
      </div>
      <el-table :data="searchData">
        <el-table-column property="search_name" label="搜索名称" align='center'></el-table-column>
        <el-table-column property="menu_name" width="120" label="唯一性标识" align='center'></el-table-column>
        <el-table-column property="db_table" label="数据库名" align='center'></el-table-column>
        <el-table-column property="db_name" label="数据表字段名" align='center' width="110"></el-table-column>
        <el-table-column property="status" label="状态" align='center'>
          <template slot-scope="{row}">
            <el-tag v-if="row.status==2" size="mini" type="danger">禁止</el-tag>
            <el-tag v-if="row.status==1" size="mini" type="success">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="is_search" label="是否可搜索" align='center' width="100">
          <template slot-scope="{row}">
            <el-tag v-if="row.status==2" size="mini" type="danger">否</el-tag>
            <el-tag v-if="row.status==1" size="mini" type="success">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="search_way" label="搜索方式" align='center'>
          <template slot-scope="{row}">
            <span v-if="row.search_way == 1">精确搜索</span>
            <span v-if="row.search_way == 2">范围搜索</span>
            <span v-if="row.search_way == 3">时间范围搜索</span>
            <span v-if="row.search_way == 4">模糊搜索</span>
            <span v-if="row.search_way == 5">order分组</span>
          </template>
        </el-table-column>
        <el-table-column property="frame_type" label="搜索框类型" align='center' width="110"></el-table-column>
        <el-table-column property="search_type_name" label="数据来源名称" align='center' width="120"></el-table-column>
<!--        <el-table-column property="json_date" label="json数据" align='center'>-->
<!--          <template slot-scope="{row}">-->
<!--            <pre>{{row.json_date}}</pre>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column property="sort" label="排序" align='center'></el-table-column>
        <el-table-column
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editSearch(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="changeSearch(scope.row)">{{scope.row.status == 1?'禁止':'开启'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--按钮新增/编辑-->
    <el-dialog title="高级搜索新增" :visible.sync="dialogFormSearch" width="580px">
      <el-form ref="searchFrom" :model="searchFrom" label-width="120px" label-position='left' size="small">
        <el-form-item label="搜索名称" prop="search_name" :rules="[{ required: true, message: '搜索名称不能为空'},]">
          <el-input v-model="searchFrom.search_name" ></el-input>
        </el-form-item>
        <el-form-item label="唯一性标识" prop="menu_name" :rules="[{ required: true, message: '唯一性标识不能为空'},]">
          <el-input v-model="searchFrom.menu_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="数据库名" prop="db_table" :rules="[{ required: true, message: '数据库名不能为空'},]">
          <el-input v-model="searchFrom.db_table" ></el-input>
        </el-form-item>
        <el-form-item label="数据表字段名" prop="db_name" :rules="[{ required: true, message: '数据表字段名不能为空'},]">
          <el-input v-model="searchFrom.db_name" ></el-input>
        </el-form-item>
        <el-form-item label="是否可搜索">
          <el-radio-group v-model="searchFrom.is_search">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="搜索方式" prop="search_way" :rules="[{ required: true, message: '搜索方式不能为空'},]">
          <el-select v-model="searchFrom.search_way" placeholder="请选择">
            <el-option
                v-for="(item,index) in optionSearch_way"
                :key="index"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索框类型" prop="frame_type" :rules="[{ required: true, message: '搜索框类型不能为空'},]">
          <el-select v-model="searchFrom.frame_type" placeholder="请选择">
            <el-option
                v-for="(item,index) in optionType"
                :key="index"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型来源" v-if="this.searchFrom.is_search == 1">
          <el-select v-model="searchFrom.search_type_id" placeholder="请选择">
            <el-option
                v-for="(item,index) in search_type_id_arr"
                :key="index"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="json数据" v-if="this.searchFrom.is_search == 2">
          <jsonEditor v-model="searchFrom.json_date" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
              v-model="searchFrom.sort"
              controls-position="right"
              placeholder="请输入序号"
              :min="0"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormSearch = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="keepSearch(searchFrom)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {menuRouteAll, add, edit, setStatus, btnAll, add_btn, edit_btn, setBtnStatus, searchList, searchAllData, add_search, edit_search, setSearchStatus, searchTypeList,} from "@/api/root/root"
import jsonEditor from '@/components/JsonEditor'
export default {
  name: "RouterManage",
  components: {
    jsonEditor
  },
  data(){
    return {
      menuList:[],
      name:"",//唯一标识
      //菜单新增
      pathSwitch:false,
      state: "add",
      form:{},
      //菜单新增

      //按钮管理
      dialogTableVisible:false,
      btnData:[],
      //按钮管理

      //高级搜索管理
      searchDialogstate:"add",
      dialogTableSearch:false,
      dialogFormSearch:false,
      optionSearch_way: [
        {
          value: 1,
          label: "精确搜索"
        },
        {
          value: 2,
          label: "范围搜索"
        },
        {
          value: 3,
          label: "时间范围搜索"
        },{
          value: 4,
          label: "模糊搜索"
        },
        {
          value: 5,
          label: "order分组"
        }
      ],
      optionType: [
        {
          value: "input",
          label: "输入框"
        },
        {
          value: "date",
          label: "时间选择器"
        },
        {
          value: "select",
          label: "选择器"
        },
        {
          value: "dates",
          label: "时间范围选择"
        },
        // {
        //   value: "radio",
        //   label: "单选"
        // },
        // {
        //   value: "Section",
        //   label: "区间"
        // }
      ],
      search_type_id_arr:[],//数据来源数组
      searchData:[],
      searchFrom:{},
      //按钮管理

      //按钮新增/编辑
      dialogFormVisible:false,
      btnDialogstate:"add",
      btnFrom:{},
      colorData:[{
        value: 'primary',
        label: '主要颜色(蓝)'
      }, {
        value: 'success',
        label: '成功颜色(绿)'
      }, {
        value: 'info',
        label: '信息颜色(暗灰)'
      }, {
        value: 'warning',
        label: '警告颜色(土黄)'
      }, {
        value: 'danger',
        label: '危险颜色(红)'
      },{
        value: 'primary/plain',
        label: '主要颜色(蓝)/镂空'
      }, {
        value: 'success/plain',
        label: '成功颜色(绿)/镂空'
      }, {
        value: 'info/plain',
        label: '信息颜色(暗灰)/镂空'
      }, {
        value: 'warning/plain',
        label: '警告颜色(土黄)/镂空'
      }, {
        value: 'danger/plain',
        label: '危险颜色(红)/镂空'
      }],
      id:"",
      //按钮新增/编辑
    }
  },
  mounted() {
    this.getMenuRouteAll()
  },
  methods:{

    //获取数据来源
    getSearchTypeList(){
      let data = {}
      searchTypeList(data).then(res=>{
        this.search_type_id_arr = res.data
      })
    },

    //图标来源判断
    fontClassFun(e){
      if (e.indexOf("el-") != -1) {
        return e
      }else{
        return 'iconfont '+e
      }
    },

    getMenuRouteAll(){
      menuRouteAll().then(res=>{
        var that=this
        that.addLevel(res.data,1).then(res=>{
          that.menuList = res
        })
      })
    },

    //给每一级路由添加层级
    addLevel(res,lev){
      let that=this
      return new Promise((resolve) => {
        var resData=[...res]
        for (let i = 0; i < res.length; i++) {
          resData[i].lev = lev
          if (res[i].children){
            that.addLevel(resData[i].children,lev+1).then(result=>{
              resData[i].children = result
            })
          }
        }
        resolve(resData)
      })
    },

    //查看按钮管理
    openBtnMange(e){
      this.name = e.name
      this.getBtnAll()
      this.dialogTableVisible = true
    },

    //获取按钮列表
    getBtnAll(){
      let data = {
        name:this.name
      }
      btnAll(data).then(res=>{
        this.btnData = res.data
      })
    },

    //获取高级搜索列表
    getSearchList(){
      let data = {
        menu_name:this.name
      }
      searchList(data).then(res=>{
        this.searchData = res.data
      })
    },

    //获取可搜索时数据合集
    getSearchAllData(){
      let data = {
        search_type_id:"",
        data:""
      }
      searchAllData(data).then(res=>{
        console.log(res)
      })
    },

    //改变高级搜索状态
    changeSearch(e){
      this.$confirm('确认修改此高级搜索的状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setSearchStatus({id:e.id}).then(res=>{
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getSearchList()
        })
      }).catch(() => {});
    },

    //改变按钮状态
    changeBtn(e){
      this.$confirm('确认修改此按钮的状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setBtnStatus(e.id).then(res=>{
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getBtnAll()
        })
      }).catch(() => {});
    },

    //高级搜索管理弹框
    openAdvancedSearch(e){
      this.name = e.name
      this.getSearchList()
      this.dialogTableSearch = true
    },

    //高级搜索添加-->弹窗打开
    addSearch(){
      this.searchDialogstate = "add"
      this.searchFrom = {
        menu_name:this.name,
        sort:0,
        is_search:2,
        json_date:[],
      };
      this.$nextTick(function () {
        this.$refs.searchFrom.clearValidate();
      });
      this.getSearchTypeList()
      this.dialogFormSearch = true
    },

    //高级搜索编辑-->弹窗打开
    editSearch(e){
      this.searchDialogstate = "edit"
      this.searchFrom = {...e}
      this.id = e.id
      this.getSearchTypeList()
      this.dialogFormSearch = true
    },

    //高级搜索添加/编辑-->保存
    keepSearch(data){
      this.$refs.searchFrom.validate((valid) => {
        if (valid) {
          if(this.searchDialogstate == "add"){
            let odata = {
              ...data,
              json_date:JSON.parse(data.json_date)
            }
            add_search(odata).then(res=>{
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.dialogFormSearch = false
              this.getSearchList()
            }).catch((err) => {
              this.$message({
                message: err,
                type: "error",
              });
            });
          }else if(this.searchDialogstate == "edit"){
            let odata = { ...data,id:this.id}
            edit_search(odata).then(res=>{
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.dialogFormSearch = false
              this.getSearchList()
            }).catch((err) => {
              this.$message({
                message: err,
                type: "error",
              });
            });
          }
        }
      })
    },

    //按钮添加-->弹窗打开
    addBtn(){
      this.btnDialogstate = "add"
      this.btnFrom = {
        name:this.name,
        sort:0,
      };
      this.$nextTick(function () {
        this.$refs.btnFrom.clearValidate();
      });
      this.dialogFormVisible = true
    },

    //按钮编辑-->弹窗打开
    editBtn(e){
      this.btnDialogstate = "edit"
      this.id = e.id
      this.btnFrom = {...e}
      this.dialogFormVisible = true
    },

    //按钮添加/编辑-->确认提交
    addBtnSubmit(data){
      this.$refs.btnFrom.validate((valid) => {
        if (valid) {
          if(this.btnDialogstate == "add"){
            add_btn(data).then(res=>{
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.dialogFormVisible = false
              this.getBtnAll()
            }).catch((err) => {
              this.$message({
                message: err,
                type: "error",
              });
            });
          }else if(this.btnDialogstate == "edit"){
            let odata = { ...data,id:this.id }
            edit_btn(odata).then(res=>{
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.dialogFormVisible = false
              this.getBtnAll()
            }).catch((err) => {
              this.$message({
                message: err,
                type: "error",
              });
            });
          }
        }
      })
    },

    //菜单修改状态
    changeStatus(e){
      this.$confirm('确认修改此路由的状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setStatus(e.id).then(res=>{
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getMenuRouteAll()
        })
      }).catch(() => {});
    },

    //菜单新增
    addPath(data){
      this.state = "add";
      this.form = {
        pid:data.id ? data.id : 0,
        affix:0,
        keepAlive:0,
        isHidden:0,
        title:"",
        name:"",
        icon:"",
        sort:"",
      }
      this.$nextTick(function () {
        this.$refs.form.clearValidate();
      });
      this.pathSwitch=true
    },

    //菜单编辑
    editPath(data){
      this.state = "edit";
      this.pathSwitch=true
      this.form = {
        pid:data.pid,
        id:data.id,
        affix:data.affix == false ? 0 : 1,
        keepAlive:data.keepAlive == false ? 0 : 1,
        isHidden:data.isHidden == false ? 0 : 1,
        title:data.title,
        name:data.name,
        icon:data.icon,
        sort:data.sort,
      }
    },

    //菜单新增/编辑-->保存
    addPathSubmit(data){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.state == "add"){
            add(data).then(res=>{
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.pathSwitch=false
              this.getMenuRouteAll()
            })
          }else if(this.state == "edit"){
            edit(data).then(res=>{
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.pathSwitch=false
              this.getMenuRouteAll()
            })
          }

        }
      })
    },
  }
}
</script>
<style lang="scss">
.pageRoot{
  padding: 0 10px;
}
.MenuManage{
  display: flex;
  padding: 10px 0;
}
.tableBox .el-button--mini{
  padding: 4px!important;
}
.tipsText{
  font-size: 12px;
  line-height: 14px !important;
}
</style>