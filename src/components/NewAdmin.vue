<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/information' }">个人主页</el-breadcrumb-item>
      <el-breadcrumb-item>新增管理员</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col>
        <el-card style="margin-top: 20px">
          <div>
            <el-form inline :rules="adminAccountFormRules" ref="account" :model="account">
              <el-form-item label="用户名" prop="userName" class="label" label-width="80px" required>
                <el-input v-model="account.userName" placeholder="输入管理员账户用户名"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" class="label" label-width="80px">
                <el-input v-model="account.realName" placeholder="输入管理员真实姓名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" class="label" label-width="80px" required>
                <el-input v-model="account.password" type="password" placeholder="输入管理员账户密码"></el-input>
              </el-form-item>
              <el-form-item label="重复密码" prop="repeatPassword" class="label" label-width="80px" required>
                <el-input v-model="account.repeatPassword" type="password" placeholder="重复输入密码"></el-input>
              </el-form-item>
              <el-form-item label="电话号码" prop="mobile" class="label" label-width="80px" required>
                <el-input v-model="account.mobile" placeholder="输入管理员账户绑定的手机号码"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="label" label-width="80px" required>
                <el-input v-model="account.email" placeholder="输入管理员账户绑定的邮箱"></el-input>
              </el-form-item>
              <el-form-item label="性别" class="label" label-width="80px">
                <el-radio-group v-model="account.gender">
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="label1">
                <el-button type="success" @click="createAdmin">创建新管理员</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Email",
  data() {
    return {
      token: window.sessionStorage.getItem('token'),
      steps: 0,
      account: {
        userName: null,
        password: null,
        repeatPassword: null,
        realName: null,
        gender: null,
        email: null,
        mobile: null
      },
      adminAccountFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur'},
          { type: "string", message: '电话号码只能包含数字', pattern : /^[0-9]+$/, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur'},
          { type: 'string', message: "邮箱格式不正确", pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    async createAdmin(){
      if(this.account.password !== this.account.repeatPassword){
        this.$message.warning('两次输入密码不一致，请重新输入')
        return;
      }
      try {
        const {data: res} = await this.$http.post("admin", this.account, {headers: {"authorization": this.token}})
        console.log(res)
        if (res.errno === 0) {
          this.$message({
            type: 'success',
            message: '管理员已创建，请登录账户并验证邮箱'
          });
          await this.$router.push({path: "/information"});
        }
        else if(res.errno === 602){
          this.$message.error('用户名已存在，请使用其他用户名重试')
        }
        else if(res.errno === 732){
          this.$message.error('邮箱已被注册，请使用其他邮箱重试')
        }
        else if(res.errno === 733){
          this.$message.error('电话号码已被注册，请使用其他电话号码重试')
        }
        else{
          this.$message.error('服务器错误，请稍后重试')
        }
      }
      catch (e){
        this.$message({
          type: 'warning',
          message: '登录已过期!请重新登录!'
        });
        await this.$router.push({path: "/login"});
      }
    },
  }
}
</script>

<style scoped>
  .label{
    margin-top: 20px;
    margin-left: 20px;
  }
  .label .el-input{
    width: 300px;
    margin-left: 50px;
  }
  .label .el-button{
    margin-left: 50px;
  }
  .label .el-radio-group{
    margin-left: 50px;
    width: 500px;
  }
  .label1{
    margin-top: 20px;
    margin-left: 200px;
  }
  .label1 .el-button{
    margin-left: 220px;
  }
</style>