<template>
  <div class="rootManageMain" style="height: calc(100% - 20px);" >
    <div class="btnModular" >
      <el-button type="primary" size="mini" @click="visibleform('add')">添加管理组</el-button>
<!--      <el-button type="primary" size="mini" @click="visibleform('edit')">编辑管理组</el-button>-->
      <el-button type="primary" size="mini" @click="preservation">保存（所选按钮权限）</el-button>
<!--      <el-button type="danger" size="mini">删除</el-button>-->
    </div>
    <div class="roleModular" style="height: calc(100% - 80px);" >
      <div class="roleModularBox" style="height:100%" >
        <el-tabs tab-position="left" class="ldlTabs" @tab-click="listClick" style="height: 100%;">
          <el-tab-pane v-for="(item,index) in manageGroupArr" style="height: 100%;" :key="index" :label="item.groupName" :groupInfo="item">
            <el-scrollbar style="overflow: hidden;height: 100%;">
            <ldlRoleTree :index="index" :info.sync="children" style="border-right: 1px solid #f5f5f5;border-top: 1px solid #f5f5f5;"></ldlRoleTree>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 添加/修改弹框 -->
    <el-dialog
        :title="state=='add'?'新增管理组':'修改管理组'"
        :visible.sync="addTF"
        width="480px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="form"
          :model="form"
          label-width="120px"
          size="mini"
          v-loading="saveLoad"
          element-loading-text="正在保存"
          label-position="left"
      >
        <el-form-item
            label="管理组名称"
            prop="groupName"
            :rules="[{ required: true, message: '管理组名称不能为空'}]"
        >
          <el-input v-model="form.groupName" placeholder="请输入管理组名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '状态不能为空'}]">
          <el-switch v-model="form.status" active-text="开启" inactive-text="关闭" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTF = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="changeFromSave(form)">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 添加/修改弹框 -->

  </div>
</template>

<script>
import {menuRouteAll,manageGroupList, addManageGroup, editManageGroup, changeManageGroupRole} from "@/api/root/root"
import ldlRoleTree from "@/components/ldlRoleTree"
export default {
 name: "RootManage",
  components:{
    ldlRoleTree
  },
  data(){
    return {
      manageGroupArr:[],
      selectNowData: {},
      children:[],
      role_id_arr:[],
      selectID:[],
      // add/edit
      addTF: false,
      state: "add",
      form: {},
      saveLoad: false,
      // add/edit
    }
  },
  mounted() {
   this.getMenuRouteAll();
   this.getList();
  },
  computed:{
    selMenuAllArr(){
      return this.$store.state.root.selMenuAll
    },
    selBtnAllArr(){
      return this.$store.state.root.selBtnAll
    }
  },
  methods:{
    //点击选中一行
    listClick(e) {
      this.selectNowData = e.$attrs.groupInfo;
      this.$store.commit("changeGroupInfo",this.selectNowData);
      this.$store.commit("changeSelMenuAll", this.selectNowData.erp_function_id.split(','));//存已选中的菜单
      this.$store.commit("changeSelBtnAll", this.selectNowData.erp_anniu_id.split(','));//存已选中的按钮
      this.changeIsSelect(this.children,this.selectNowData.erp_function_id.split(','))

    },
    checkList(e) {
      const data = e;
      return new Promise((resolve, reject) => {
        if (Object.keys(data).length > 0) {
          resolve(data);
        } else {
          this.$message({
            message: "您需要选中一个管理已进行需要的操作!",
            type: "warning",
          });
          reject();
        }
      });
    },

    changeIsSelect(arr,selectArr) {
      // console.log(selectArr)
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (arr[i].children) {
          item.isSelect = false
          for (let j = 0;j<selectArr.length;j++){
            if( item.id == selectArr[j]){
              item.isSelect = true
            }
            this.changeIsSelect(item.children,selectArr);
          }
        }
      }
    },

   getList(){
     let data = {},obj={
       createTime: '',
       cy_type: '',
       erp_anniu_id: "",
       erp_function_id: "",
       groupName: "自定义管理组",
       id: '',
       status: '',
     }
     manageGroupList(data).then(res=>{
       this.manageGroupArr = res.data
       this.manageGroupArr.unshift(obj)
     })
   },

    //给每一级路由添加层级
    addLevel(res,lev,tf){
      let that=this
      return new Promise((resolve) => {
        var resData=[...res]
        for (let i = 0; i < res.length; i++) {
          resData[i].lev = lev
          resData[i].isSelect = tf
          if (res[i].children){
            that.addLevel(resData[i].children,lev+1,tf).then(result=>{
              resData[i].children = result
            })
          }
        }
        resolve(resData)
      })
    },

    //获取所有页面(菜单)
    getMenuRouteAll(){
      menuRouteAll().then(res=>{
        var that=this
        that.addLevel(res.data,1,false).then(res=>{
          that.children = res
        })
      })
    },

    //按钮权限修改后保存
    preservation(){
      let data = {
        id:this.selectNowData.id,
        erp_function_id:this.selMenuAllArr.join(','),
        erp_anniu_id:this.selBtnAllArr.join(','),
      }
      if(data.id){
        changeManageGroupRole(data).then(res=>{
          this.$message({
            message: res.msg,
            type: "success",
          });
        })
      }else {
        this.$message({
          message: "该管理组为定义，请先创建或者选择已有管理组！",
          type: "error",
        });
        // this.$prompt('该管理组未定义，是否创建新管理组！', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputPlaceholder:"请输入管理组名称",
        // }).then(({ value }) => {
        //   console.log(value,'*************')
        //   let data = {
        //     groupName:value,
        //     status:1,
        //   }
        //   addManageGroup(data)
        //       .then((res) => {
        //         this.$message({
        //           message: res.msg,
        //           type: "error",
        //         });
        //       })
        //       .catch((err) => {
        //         this.$message({
        //           message: err,
        //           type: "error",
        //         });
        //       });
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消输入'
        //   });
        // });
      }
    },

    // 新增/编辑
    visibleform(state) {
      if (state == "add") {
        this.state = "add";
        this.addTF = true;
        this.form = {
          status:2
        };
        this.$nextTick(function () {
          //移除绑定的表单项的校验结果，传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
          this.$refs.form.clearValidate();
        });
      } else if (state == "edit") {
        this.checkList(this.selectNowData).then((data)=>{
          this.form = {...data};
          this.state = "edit";
          this.addTF = true;
        }).catch(err=>{
          this.$message({
            message: err,
            type: "error",
          });
        })
      }
    },

    // 新增/编辑---->保存
    changeFromSave(data) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveload = true;
          if (this.state == "add") {
            addManageGroup(data)
                .then((res) => {
                  this.$message({
                    message: res.msg,
                    type: "success",
                  });
                  this.addTF = false;
                  this.saveLoad = false;
                  this.getList();
                })
                .catch((err) => {
                  this.$message({
                    message: err,
                    type: "error",
                  });
                });
          } else if (this.state == "edit") {
            editManageGroup(data)
                .then((res) => {
                  this.$message({
                    message: res.msg,
                    type: "success",
                  });
                  this.addTF = false;
                  this.saveLoad = false;
                  this.getList();
                })
                .catch((err) => {
                  this.$message({
                    message: err,
                    type: "error",
                  });
                });
          }
        }
      });
    },
  }
}
</script>

 <style lang="scss" scoped>
.rootManageMain{
  padding: 10px;
  .btnModular{
    margin-bottom: 20px;
  }
}
.roleModularBox{
  margin-bottom: 30px;
}

</style>
<style>
.rootManageMain .el-scrollbar__wrap{
  overflow-x: hidden !important;
}
</style>