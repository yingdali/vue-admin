import Vue from 'vue'
import VueRouter from 'vue-router'
//引入路由组件
import Login from "../views/Login";
import Home from "../views/Home";
import Welcome from "../views/Welcome";
import Users from "../views/Users/Users";
import Rights from "../views/power/Rights";
import Roles from "../views/power/Roles";

import Params from "../views/goods/Params"
import Cate from "../views/goods/Cate"
import GoodsList from "../views/goods/List"
import Report from "../views/report/Report"
import Add from "../views/goods/Add"
import Order from "../views/order/Order"
Vue.use(VueRouter)

const routes = [
	//每个路由需要映射到一个组件
	//访问'/'重定向到'/login'
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
	//redirect重定向 /home为路由根路径
    redirect: '/welcome',
   //嵌套路由中的子路由 当访问/home时，下面4个组件将被渲染到 Home 的 <router-view> 内部
    children:[
      {path:'/welcome', component:Welcome},
      {path:'/users', component:Users},
      {path:'/rights', component:Rights},
      {path:'/roles', component:Roles},
	  //以下由于时间原因***
	  {path: '/categories', component: Cate },
	  {path: '/params', component: Params },
	  {path: '/goods', component: GoodsList },
	  {path: '/goods/add', component: Add},
	  {path: '/orders', component:Order},
	  //reports这个路径是HOme页面服务器返回的，所以命名时要跟实际显示的一致，否则空页面
      {path:'/reports', component:Report},
    ]
  },
]

const router = new VueRouter({
  routes,
  //用于路由实现历史记录
  mode:'history'
})

// 挂载路由导航守卫 使用户直接输网址时设置导航
router.beforeEach((to,from,next)=>{
  //to 表示要访问的路径
  //from 从哪跳转过来的
  //next函数 放行 next()放行 next("login")强制跳转

  //如果访问/login路径，放行允许正常显示页面
  if(to.path==='/login')  next()
  //获取从sessionStorage中获取token 登录时服务器返回的参数
  const tokenstr=window.sessionStorage.getItem('token');
  // console.log(tokenstr)
  
   if (!tokenstr) {
	  //如果没有取到tokenstr，直接输入访问/home类似的页面会返回登录页
     next('/login')
   }
   //有tokenstr就放行允许直接访问
   else next()
})

export default router
