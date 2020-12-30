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

    </el-dialog>
  </div>
</template>

<script>
export default {
name: "searchBox",
  data(){
    return{
      openSearchState:false
    }
  },
  methods:{
    openSearch(){
     this.openSearchState=true
    }
  }
}
</script>

<style scoped>
.searchBox{
  height: 25px;
}
</style>