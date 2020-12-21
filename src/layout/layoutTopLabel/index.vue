<template>
  <div class="layoutTopLabel">

    <el-tag type="success" size="mini" effect="dark" class="ldl_tag_active">控制台</el-tag>
    <el-tag effect="plain" size="mini" type="info" closable @close="delTag">默认标签</el-tag>
  </div>
</template>

<script>
export default {
  name: "layoutTopLabel",
  methods:{
    delTag(){

    }
  }
}
</script>

<style scoped>
</style>