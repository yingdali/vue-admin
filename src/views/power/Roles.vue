<template>
<div>
  <!--  面包屑导航区域-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

<!--  卡片视图-->
  <el-card>
<!--    添加角色按钮区域-->
    <el-row>
      <el-col>
        <el-button type="primary"  @click="addDialogVisible=true">添加角色</el-button>
      </el-col>
    </el-row>

<!--    角色列表区域 stripe斑马线-->
    <el-table :data="rolelist" border stripe>
<!--      展开列 expand可展开的-->
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row :class="['bdbottpm',i1===0?'.bdtop':''  ,'vcenter']"  v-for="(item1,i1) in row.children" :key="item1.id">
<!--            渲染一级权限 :span="5占5列  判断索引值第一个是否为0 是则加上顶边框-->
            <el-col  :span="5">
              <el-tag closable @close="removeRightByid(row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
<!--            渲染二级，三级权限-->
            <el-col :span="19">
<!--            通过for循环嵌套渲染二级权限-->
              <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag closable @close="removeRightByid(row,item2.id)" type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
<!--                  @close elementui内部语法-->
                  <el-tag closable @close="removeRightByid(row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
<!--      索引列-->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="{row}">
          <el-button size="mini" @click="showEditDialog(row.id)" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" @click="removeById(row.id)"   type="danger" icon="el-icon-delete">删除</el-button>
          <el-button @click="showSetRightDialog(row)" size="mini"  type="warning" icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>

  <!--  添加角色的对话框-->
<!--  :visible.sync控制添加角色对话框的显示和隐藏-->
<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
    <!--    内容主题区域-->
    <el-form :model="addForm" :rules="addRoleRules"
             ref="addRulesRef" label-width="80px">
      <el-form-item  label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!--    底部区域-->
    <span slot="footer" class="dialog-footer">
<!--   按钮关闭属性   @click="addDialogVisible = false"-->
    <el-button @click="addDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="addRules">确 定</el-button>
  </span>
</el-dialog>

  <!--  修改用户的对话框-->
<el-dialog title="修改角色" :visible.sync="editDialogVisiblle" width="50%">
    <!--    内容主题区域-->
    <el-form :model="editForm" :rules="addRoleRules"
             ref="editFormRef" label-width="80px">
      <el-form-item  label="角色名称" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!--    底部区域-->
    <span slot="footer" class="dialog-footer">
<!--   按钮关闭属性   @click="addDialogVisible = false"-->
    <el-button @click="editDialogVisiblle = false">取消</el-button>
    <el-button type="primary" @click="editUserinfo">确 定</el-button>
  </span>
</el-dialog>

  <!--  分配权限的对话框-->
<el-dialog @close="setRightDialogClosed" title="分配权限" :visible.sync="setRightDialogVisiblle" width="50%">
    <!--    树形控件-->
    <el-tree ref="treeRef" :default-checked-keys="defkeys" default-expand-all node-key="id" show-checkbox :data="rightsList" :props="treeProps" ></el-tree>
    <!--    底部区域-->
    <span slot="footer" class="dialog-footer">
<!--   按钮关闭属性   @click="addDialogVisible = false"-->
    <el-button @click="editDialogVisiblle = false">取消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
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
      return {
        //所有角色列表数据
        rolelist: [],
        //添加角色的表单数据
        addForm: {
          roleId: '',
          roleName: '',
          roleDesc: ''
        },
        //查询到的角色信息对象
        editForm:{},
        //控制添加角色对话框的显示和隐藏
        addDialogVisible: false,
        //控制修改用户对话框的显示和隐藏
        editDialogVisiblle:false,
        //控制分配权限对话框的显示和隐藏
        setRightDialogVisiblle:false,
        //所有权限的数据
        rightsList:[],
        //树形控件的属性绑定对象
        treeProps:{
          //label展示可看到的属性
          label:'authName',
          //父子节点通过children属性实现嵌套
          children:'children'
        },
        //默认选中节点的id值数组
        defkeys:[],
        //当前即将分配权限的角色id
        roleId:'',
        //添加用户表单的规则对象
        addRoleRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur'}
          ],
		  roleDesc: [
		    {required: true, message: '请输入角色描述', trigger: 'blur'},
		    {min: 3, max: 10, message: '角色描述长度在 3 到 10 个字符之间', trigger: 'blur'}
		  ],
        },
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      //获取所有角色的列表
      getRolesList() {
        this.$http.get('roles')
          .then(({data:res}) => {
            // console.log(res.data.data)
            if (res.meta.status !== 200) {
              return this.$message.error('获取角色列表失败');
            }
            this.rolelist = res.data
          })
      },
      //点击按钮，添加角色
      addRules() {
        this.$refs.addRulesRef.validate((valid) => {
          if (!valid) return
          //可以发起添加用户的请求
          this.$http.post('roles', this.addForm).then(({data:res}) => {
              if (res.meta.status !== 201) {
                return this.$message.error('添加用户失败');
              }
              this.$message.success('添加用户成功')
              //隐藏添加用户的对话框
              this.addDialogVisible = false
              //重新获取用户列表
              this.getRolesList()
            })
        })
      },
      //展示编辑角色的对话框
      showEditDialog(id){
        // console.log( id)
        this.$http.get('roles/'+id).then(({data:res})=> {
            // console.log(res.data.data)
            if (res.meta.status !== 200) {
              return this.$message.error('查询用户信息失败');
            }
            this.editForm=res.data
            this.editDialogVisiblle=true
          })
      },
      //修改角色信息并提交
      editUserinfo(){
      //获取表单预校验结果为true提交
        this.$refs.editFormRef.validate(vaild=>{
          if (!vaild) return
          //发起修改用户信息的数据请求
          this.$http.put(`roles/`+this.editForm.roleId,{
            roleName:this.editForm.roleName,
            roleDesc:this.editForm.roleDesc
          }).then(({data:res})=> {
              if (res.meta.status !== 200) {
                return this.$message.error('更新用户信息失败');
              }
              this.$message.success('更新用户信息成功')
              //隐藏添加用户的对话框
              this.editDialogVisiblle=false
              //重新获取用户列表
              this.getRolesList()
            })
        })
      },
      //根据id删除对应的角色信息
      removeById(id){
        //弹框询问是否删除
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/`+id)
            .then(res=> {
              if (res.data.meta.status !== 200) {
                return this.$message.error('删除角色失败');
              }
              this.$message.success('删除角色成功')
              //删除成功后刷新数据列表
              this.getRolesList();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //根据id删除对应的权限
      removeRightByid(role,rightId){
       //弹框提示是否删除
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            .then(({data:res})=> {
              if (res.meta.status !== 200) {
                return this.$message.error('删除角色失败');
              }
              //删除成功后刷新数据列表
              role.children=res.data
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //展示分配权限的对话框
      showSetRightDialog(role){
        //保存选中节点id
        this.roleId=role.id
        //获取所有权限数据
        this.$http.get('rights/tree')
          .then(res=> {
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取权限列表失败');
            }
            //把获取到的权限数据保存到data中
            this.rightsList=res.data.data
            // console.log(this.rightsList)
          })
        //递归获取三级节点
        this.getLeafKeys(role,this.defkeys)
        this.setRightDialogVisiblle=true
      },
      //通过递归的形式获取角色下所有三级权限的id
      //并保存到defkeys数组中
      getLeafKeys(node,arr){
      //如果当前node节点不包含children属性
      //则是三级节点
        if(!node.children){
          return arr.push(node.id)
        }

        node.children.forEach(item=>
          this.getLeafKeys(item,arr))
      },
      //监听分配权限对话框的关闭事件
      setRightDialogClosed(){
        this.defkeys=[]
      },
      //点击确定为角色分配权限 ...展开运算符
      allotRights(){
        const keys=[
			//若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
          ...this.$refs.treeRef.getCheckedKeys(),
		  //若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr=keys.join(',')
        this.$http.post(`roles/${this.roleId}/rights`,{
          rids:idStr
        }).then(({data:res})=> {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('分配权限失败');
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisiblle=false
          })
      }
    }
  }
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottpm{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>