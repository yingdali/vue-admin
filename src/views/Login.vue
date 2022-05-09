<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 label-width占位符 -->
      <el-form ref="loginFormRef" :model="loginForm"  :rules="loginRules"  class="login_form"  label-width="0px">
<!--        用户名-->
        <el-form-item  prop="name">
          <el-input v-model="loginForm.username"  prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password"   prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
<!--        按钮区域-->
        <el-row type="flex" justify="end">
        <el-form-item >
          <el-button type="primary" @click="login">登录</el-button>
         <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return{
        //登录表单的数据绑定对象，设置默认参数
        loginForm:{
          username:'admin',
          password:'123456'
        },
        //表单的验证规则对象
        loginRules:{
          //验证用户名是否合法
          username: [
            //required设置必填项 trigger鼠标移开时提示
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          //验证密码是否合法
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //点击按钮重置登录表单
      resetLoginForm(){
		  //$refs相当于为组件赋了一个id引用 resetFields 是elementui自带重置方法
        this.$refs.loginFormRef.resetFields()
      },
      //登录时进行校验
      login(){
        // console.log(this.mixtoken);
		//validate对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：
		//是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        this.$refs.loginFormRef.validate( valid=>{
          // console.log(valid)
		  //如果校验成功
          if (valid) {
			  //login路径 this.loginForm参数
			  //对data进行解构这样就直接显示data的数据解构了，再重命名为res
            this.$http.post('login',this.loginForm).then(({data:res})=> {
                console.log(res);
                if (res.meta.status===200){
					//调用$message element组件的sucess样式
				  // console.log(this)
                  this.$message.success('登录成功');
                  // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage  的生命周期是在浏览器关闭前
                  //loaclStoragelocalStorage的生命周期是永久性的。
                  // 假若使用localStorage存储数据，即使关闭浏览器，也不会让数据消失，除非主动的去删除数据
                  //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                  //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                  // console.log(res.data.data.token)
				  //储存服务器返回的token
                  const token=res.data.token;
                  window.sessionStorage.setItem('token', token)
                  // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                  this.$router.push('/home')
                }
              })
          }else {
            this.$message.error('登录失败');
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

</style>