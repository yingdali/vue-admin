<template>
<div>
<!--  面包屑导航区域-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片视图区-->
  <el-card >
<!--    添加与搜索区域-->
    <el-row :gutter="20">
      <el-col :span="10">
        <!--   搜索与添加区域-->
<!-- 		clearable 搜索框会出现一个清除按钮默认为true  @clear是elementui input事件 点击clearable清空按钮时触发 -->
<!-- 点击@clear取消按钮重新请求数据显示默认页面 -->
        <el-input placeholder="请输入内容"  v-model="quertInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
	<!-- 	  点击调出弹窗 -->
        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
      </el-col>
    </el-row>

<!--    用户列表区域-->
<!-- stripe是否为斑马纹 table label显示的标题 prop	对应列内容的字段名，也可以使用 property 属性 -->
      <el-table :data="userlist" stripe style="width: 100%" border>
        <el-table-column label="序号" type="index" width="60px"></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色" ></el-table-column>
        <el-table-column prop="mg_state" label="状态" >
          <template v-slot="{row}">
<!--  v-slot具名插槽默认参数为default       滑块模块-->
<!-- v-slot="{row}"相当于使用了prop 这个 prop="mg_state"就是当前的prop  这些prop名都是根据userlist属性决定的，一一对应-->
<!-- 绑定v-model到一个Boolean类型的变量来决定开和关的状态 -->
            <el-switch v-model="row.mg_state" active-color="#13ce66"
                    inactive-color="#ff4949" @change="userStateChanged(row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="180px">
<!-- 			v-slot:default="{row}"完整写法这里改为简写 -->
          <template v-slot="{row}">
<!-- 	{{row}}就是解构后当前行的数据 -->
<!--          修改-->
          <el-button @click="showEditDialog(row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
<!--          删除-->
          <el-button @click="removeById(row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
<!--          分配角色 加入了文字提示-->
          <el-tooltip   effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button @click="setRole(row)" type="warning" icon="el-icon-setting" size="mini" ></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

<!--    分页区域-->
<!-- page-size	每页显示条目个数  total	总条目数  layout	组件布局，子组件名用逗号分隔 
 current-page	当前页数 current-change	currentPage 改变时会触发 size-change	pageSize 改变时会触发-->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="quertInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="quertInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </el-card>

<!--  添加用户的对话框-->
  <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
<!--    内容主题区域-->
<!-- prop表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 -->
    <el-form :model="addForm" :rules="addFormRules"
       ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
<!--    底部区域-->
    <span slot="footer" class="dialog-footer">
<!--   按钮关闭属性   @click="addDialogVisible = false"-->
    <el-button @click="resetform">重置</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
  </el-dialog>

<!--  修改用户的对话框-->
<el-dialog title="修改用户" :visible.sync="editDialogVisiblle" width="50%">
    <!--    内容主题区域-->
    <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
<!-- 			 加上prop="username" 就会变为必填项 校验才会校验username-->
<!-- 由于接口没有设置接收用户名的参数，用户名不可修改，所以前端设置disabled禁止修改  disabled要写在input中。。-->
      <el-form-item label="用户名" prop="username" >
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!--    底部区域-->
    <span slot="footer" class="dialog-footer">
<!--   按钮关闭属性   @click="addDialogVisible = false"-->
    <el-button @click="editDialogVisiblle = false">取消</el-button>
    <el-button type="primary" @click="editUserinfo">确 定</el-button>
  </span>
</el-dialog>
<!--  分配角色的对话框-->
<el-dialog title="分配角色" :visible.sync="setRoleDialogVisiblle" @close="setRoleDialogClosed" width="50%">
    <div>
      <p>{{userInfo.username}}</p>
      <p>{{userInfo.role_name}}</p>
      <p>分配新角色:
        <el-select v-model="selectRoleId" placeholder="请选择">
	<!-- 		value	选项的值 -->
          <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
          </el-option>
        </el-select>
      </p>
    </div>
    <!--    底部区域-->
    <span slot="footer" class="dialog-footer">
<!--   按钮关闭属性   @click="addDialogVisible = false"-->
    <el-button @click="setRoleDialogVisiblle = false">取消</el-button>
    <el-button @click="saveRoleInfo" type="primary" >确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
  export default {
    name: "Users",
    data(){
      //验证邮箱校验规则
      let checkEmail=(rule,value,callback)=>{
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          //合法的邮箱
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      }
      //验证手机号校验规则
      let checkMobile=(rule,value,callback)=>{
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        //如果regMobile的test方法中value经过校验合法的手机号
        if (regMobile.test(value)) {
          //执行callback方法
          return callback()
        }

        callback(new Error('请输入合法的手机号'))

      }

      return{
      //获取用户列表的参数对象
        quertInfo:{
		  //查询参数
          query:'',
          //当前的页数
          pagenum:1,
          //当前每页显示多少条数据
          pagesize:5
        },
		//搜索时记录的用户信息
        userlist:[],
		//当前页面总页码数
        total:0,
        //控制添加用户对话框的显示和隐藏
        addDialogVisible:false,
        //控制修改用户对话框的显示和隐藏
        editDialogVisiblle:false,
        //控制分配角色对话框的显示和隐藏
        setRoleDialogVisiblle:false,
        //查询到的用户信息对象
        editForm:{},
        //添加用户的表单数据
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        //添加用户表单的规则对象
        addFormRules:{
          username:[
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度在 6到 15个字符之间', trigger: 'blur'}
          ],
          email:[
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile:[
            {required: true, message: '请输入手机号', trigger: 'blur'},
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        //需要分配角色的用户信息
        userInfo:{},
        //所有角色的数据列表
        rolesList:[],
        //已选中的角色id值
        selectRoleId:''
      }
    },
    created() {
      this.getUserList()
    },
    methods:{
      getUserList(){
        this.$http.get('users',{params:this.quertInfo})
          .then(({data:res})=> {
            if (res.meta.status!==200){
             return this.$message.error(res.data.meta.msg);
            }
            this.userlist=res.data.users
            // console.log(this.userlist);
            this.total=res.data.total

          })
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize){
        // console.log(newSize)
        this.quertInfo.pagesize=newSize
        //重新获取数据
        this.getUserList()
      },
      //监听页码值改变的事件
      handleCurrentChange(newpage){
        console.log(newpage)
        this.quertInfo.pagenum=newpage
        //重新获取数据
        this.getUserList()
      },
      //监听switch开关状态的事件
      userStateChanged(userinfo){
        this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          .then(({data:res})=> {
			  console.log(res)
            if (res.meta.status !== 200) {
				//请求失败时改变时再改变滑块状态 
              userinfo.mg_state=!userinfo.mg_state
              return this.$message.error('更新用户状态失败');
            }
            this.$message.success('更新用户状态成功')
          })
          },
      //点击对话框里的重置按钮重置表单
      resetform(){
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮，添加用户
      addUser(){
        this.$refs.addFormRef.validate((valid)=>{
          if (!valid) return
          //可以发起添加用户的请求
          this.$http.post('users',this.addForm)
            .then(res=> {
              // console.log(res)
              if (res.data.meta.status !== 201) {
                return this.$message.error('添加用户失败');
              }
                this.$message.success('添加用户成功')
                //隐藏添加用户的对话框
                this.addDialogVisible=false
                //重新获取用户列表
                this.getUserList()
            })
        })
      },
      //展示编辑用户的对话框
      showEditDialog(id){
        this.$http.get('users/'+id)
          .then(({data:res})=> {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('查询用户信息失败');
            }
			//保存查询到的用户信息对象 直接打开的话是一个空表 editForm最开始是空的
            this.editForm=res.data
			// console.log(this.editForm);
			//渲染内容后打开修改用户信息弹窗
            this.editDialogVisiblle=true
          })
      },
      //修改用户信息并提交
      editUserinfo(){
        //获取表单预校验结果为true  类似id用法通过ref属性拿值
        this.$refs.editFormRef.validate(vaild=>{
         if (!vaild) return
          //发起修改用户信息的数据请求
          this.$http.put(`users/`+this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          }).then(({data:res})=> {
			  console.log(res);
              if (res.meta.status !== 200) {
                return this.$message.error('更新用户信息失败');
              }
			  //重新获取用户列表
			  this.getUserList()
              //隐藏添加用户的对话框
              this.editDialogVisiblle=false
			  this.$message.success('更新用户信息成功')
            })
        })
      },
      //根据id删除对应的用户信息
      removeById(id){
//弹框询问是否删除 
// element 调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。Message Box 组件也拥有极高的定制性，
// 我们可以传入options作为第三个参数，它是一个字面量对象。type字段表明消息类型，可以为success，error，info
// 和warning，无效的设置将会被忽略。注意，第二个参数title必须定义为String类型，如果是Object，会被理解为options。
// 在这里我们用了 Promise 来处理后续响应。
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete(`users/`+id).then(({data:res})=> {
                if (res.meta.status !== 200) {
                  return this.$message.error('删除用户失败');
                }
                this.$message.success('删除用户成功')
                //删除成功后刷新数据列表
                this.getUserList();
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      //展示分配角色的对话框
      setRole(row){
        this.userInfo=row
        //在展示对话框前获取所有的角色列表
        this.$http.get('roles')
          .then(({data:res})=> {
			  // console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('获取角色列表失败');
            }
            this.rolesList=res.data
          })
        this.setRoleDialogVisiblle=true
      },
      //点击按钮分配角色
      saveRoleInfo(){
		//如果没选择请选择要分配的角色 未选择任何值
        if(!this.selectRoleId){
         return this.$message.error('请选择要分配的角色')
        }
        this.$http.put(`users/${this.userInfo.id}/role`,{
          rid:this.selectRoleId
        })
          .then(({data:res})=> {
			  console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.setRoleDialogVisiblle=false
          })
      },
      //监听分配角色对话框的关闭事件
      setRoleDialogClosed(){
        this.selectRoleId=''
        this.userInfo={}
      }
    }
  }
</script>

<style scoped>

</style>