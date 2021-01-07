<template>
  <div class="ldlRoleTree_main">
    <ul>
      <li v-for="(item,index) in info" :key="index">
        <div style="display: inline-block">
          <el-checkbox v-model="item.isSelect" @change="chooseOne(item)"></el-checkbox>
        </div>
        <el-popover
            placement="right"
            width="120"
            @hide="handleStatusHide"
            @show="handleStatusShow"
            trigger="click">
          <el-checkbox-group v-model="selectBtnList" @change="changSelectBtnList">
            <el-checkbox v-for="(item,index) in isShowBtnList" :key="index" :label="item.id" @change="selectOne">
              {{ item.title }}
            </el-checkbox>
          </el-checkbox-group>
          <p v-if="!isShowBtnList.length>0">此菜单暂无按钮功能！</p>
          <div slot="reference" class="ldlRoleTree_title"
               :class="{current_active:item.name === isActive}" @click="getBtnAll(item)">{{ item.title }}
          </div>
        </el-popover>
        <ldlRoleTree :index="index" :info.sync="item.children" @child-event="parentEvent"></ldlRoleTree>
      </li>
    </ul>
  </div>
</template>

<script>
// import ldlRoleTree from "@/components/ldlRoleTree"
import {btnAll} from "@/api/root/root"

export default {
  name: "ldlRoleTree",
  components: {
    // ldlRoleTree
  },
  props: {
    info: {
      type: Array
    },
    index: {
      type: Number
    },

  },
  data() {
    return {
      isShowBtnList: [],
      selectBtnList: [],
      currentObj: {},
      isRefresh: false,
      selectMenu: [],
      echoSelMenu:[],
    }
  },
  computed: {
    isActive() {
      return this.$store.state.root.root_isActive
    },
    selBtnArr() {
      return this.$store.state.root.selBtnAll
    }
  },
  methods: {

    //必须选中一个管理组
    // checkList(e) {
    //   const data = e;
    //   return new Promise((resolve, reject) => {
    //     if (Object.keys(data).length > 0) {
    //       resolve(data);
    //     } else {
    //       this.$message({
    //         message: "您需要选中一个管理已进行需要的操作!",
    //         type: "warning",
    //       });
    //       reject();
    //     }
    //   });
    // },

    getBtnAll(allData) {
      this.currentObj = allData
      let data = {
        name: allData.name
      }
      btnAll(data).then(res => {
        this.isShowBtnList = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status == 1) {
            this.isShowBtnList.push(res.data[i])
          }
        }
      })
      this.selectBtnList = this.selBtnArr.map(Number)
    },

    handleStatusHide() {
      this.isShowBtnList = []
    },

    handleStatusShow() {
      this.isShowBtnList = []
    },

    changSelectBtnList(val) {
      console.log(val,'00000000000000')
      this.$store.commit("changeSelBtnAll", val);
    },

    //勾选按钮权限
    selectOne(val) {
      if (val) {
        this.currentObj.isSelect = true
        this.$store.commit("changeRootActive", this.currentObj.name);
        var infoData = this.info
        for (var i = 0; i < infoData.length; i++) {
          if (infoData[i].id == this.currentObj.id) {
            infoData.splice(i, 1, this.currentObj)
          }
        }
        this.$emit('update:info', infoData)
        this.$emit('child-event', this.index)
      }
    },

    chooseOne(e) {
      // e.isSelect = !e.isSelect
      this.$store.commit("changeRootActive", e.name);
      // var infoData = this.info
      // for (var i = 0; i < infoData.length; i++) {
      //   if (infoData[i].id == e.id) {
      //     infoData.splice(i, 1, e)
      //   }
      // }
      this.$emit('update:info', this.info)
      this.$emit('child-event', this.index)
    },

    changeTree(arr, index) {
      return new Promise((resolve) => {
        try {
          console.log(index, '父级的下标')
          let newArr = [...arr]
          // console.log(newArr[index],'父级下标对应的哪一个')
          let newArrOnClick = 0 //点击
          let item = arr[index]
          if (item.children.length >= 1) {
            for (let j = 0; j < item.children.length; j++) {
              console.log(item.children[j], '二级中的每一个')
              if (item.children[j].isSelect) {
                console.log(newArr[index], '让父级选中', index)
                newArrOnClick += 1
                newArr[index].isSelect = true
              }
            }
          }
          if (newArrOnClick < 1) {
            newArr[index].isSelect = false
          }
          resolve(newArr)
        } catch (err) {
          console.log(err)
        }
      })
    },

    parentEvent(num) {
      const that = this
      this.changeTree(this.info, num).then((res) => {
        let info = res
        that.$emit('update:info', info)
        that.$emit('child-event', this.index)
        this.flatten(res)
        this.$store.commit("changeSelMenuAll", this.selectMenu);
      })
    },

    //循环递归出已选中的菜单
    flatten(arr) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (arr[i].children && arr[i].isSelect == true) {
          this.selectMenu.push(item.id)
          for (var j = 0; j < this.selectMenu.length; j++) {
            if (this.selectMenu.indexOf(this.selectMenu[j]) != j) {
              this.selectMenu.splice(j, 1);//删除数组元素后数组长度减1后面的元素前移
              j--;//数组下标回退
            }
          }
          this.flatten(item.children);
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.ldlRoleTree_main {
  display: inline-block;
}

ul, li {
  padding: 0;
  margin: 0;
  list-style: none
}

ul {
  display: inline-block;
}

li {
  //margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid #f5f5f5;
  border-top: none;
  //border-right: none;
}

.ldlRoleTree_title {
  width: 120px;
  display: inline-block;
  margin-bottom: 5px;
  padding: 4px;
  margin-right: 15px;
  border: 1px solid transparent;
  outline: none;
}

.active {
  //border: 1px solid #b3d8ff;
  //background-color: #ecf5ff;
  border-radius: 10px;
}

.current_active {
  color: #409eff;
}

.el-checkbox {
  display: block !important;
}
</style>