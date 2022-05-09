<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside style="height: 580px" :width="isCollapse ? '64px':'200px'" >
        <div class="toggle-button" @click="toggleCollapse">|||</div>
	<!-- 	text-color菜单的文字颜色 active-text-color当前激活菜单的文字颜色 unique-opened使面板只能同时打开一个-->
<!-- 	:collapse="isCollapse"绑定是否折叠属性还是必要的，否则点击button开关时会有保留箭头和一些显示误差 -->
	<!--:router="true"  使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
<!-- 	default-active	当前激活菜单的 index -->
<!-- 	使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
<!-- $route.path是vue this对象挂载的属性 -->
        <el-menu background-color="#333744" 
                 text-color="#fff" active-text-color="#409EFF" unique-opened
                 :collapse="isCollapse" :collapse-transition="false"
                 :router="true" :default-active="$route.path">
          <!-- 一级菜单 :index="item.id + ''"-->
          <el-submenu style="padding-left: 15px"  :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
             <i :class="iconsObj[item.order]"></i>
              <span style="padding-left: 10px">{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
		<!-- 	点击子菜单会把子菜单path作为index返回给vue-router进行跳转 -->
            <el-menu-item  :index=" '/' + subitem.path"  v-for="subitem in item.children" >
              <template  slot="title">
              <i class="el-icon-menu"></i>
              <span  slot="title">{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu >
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        // 是否折叠
        isCollapse: false,
        menulist:[],
		icons:[],
        iconsObj: {
		//对原有图标对应的id值进行了修改，因为怕发生变化 后台返回order是顺序不会变得
          '1': 'iconfont icon-user',
          '2': 'iconfont icon-tijikongjian',
          '3': 'iconfont icon-shangpin',
          '4': 'iconfont icon-danju',
          '5': 'iconfont icon-baobiao'
        },
      }
    },
    //生命周期创建时请求菜单
    created() {
      this.getMenuList()
	  // console.log(this.$route);
    },
    methods:{
      //退出功能
      logout(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      // 点击按钮，切换菜单的折叠与展开
      toggleCollapse(){
        this.isCollapse=!this.isCollapse
      },
      // 获取所有的菜单数据
      getMenuList(){
		  //对data进行解构这样就直接显示data的数据解构了，再重命名为res
		  //可以对返回数据的任意对象进行解构，填入{}中即可
        this.$http.get('menus').then(({data:res})=> {
            if (res.meta.status==200){
              this.$message.success(res.meta.msg);
              this.menulist=res.data
			  // console.log(this.menulist);
            }else {
              this.$message.error(res.meta.msg);
            }
          })
      }
	  // async getMenuList() {
	  //   const { data: res } = await this.$http.get('menus')
	  //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
	  //   this.menulist = res.data
	  //   console.log(res)
	  // },
    }
  }
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  /*水平居中对齐*/
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  position: relative;
  /*上下垂直居中*/
  align-items: center;
}
.el-header  div img{
     display: block;
     width: 60px;
     height: 60px;
     float: left;
  }
.el-header   div span{
     display: block;
     line-height: 60px;
     float: left;
     padding-left: 6px;
  }
.el-button{
  position: absolute;
  right: 10px;
}
.el-aside{
  background-color: #333744;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-menu{
 border-right: 0px;
 overflow: hidden;
}
</style>