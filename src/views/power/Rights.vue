<template>
<div>
  <!--  面包屑导航区域-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图-->
  <el-card>
    <el-table :data="rightsList" border stripe>
<!-- 		:index="indexx" 设置排序方法-->
      <el-table-column type="index" ></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template v-slot="{row}">
<!--          ！！v-if 使用-->
          <el-tag v-if="row.level==='0'">一级</el-tag>
          <el-tag v-else-if="row.level==='1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
  export default {
    name: "Rights",
    data(){
      return{
        //权限列表
        rightsList:[]
      }
    },
    created() {
      //获取列表权限
      this.getrRightsList()
    },
    methods:{
      getrRightsList(){
        this.$http.get('rights/list')
          .then(res=> {
            // console.log(res.data.data)
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取权限列表失败');
            }
            this.rightsList=res.data.data
          })
      },
	  // //这样就会从0开始排序+2就是从2开始排序
	  // indexx(index){
		 //  return index+0
	  // }
    }
  }
</script>

<style scoped>

</style>