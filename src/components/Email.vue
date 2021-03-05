<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/information' }">个人主页</el-breadcrumb-item>
      <el-breadcrumb-item>修改邮箱</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col>
        <el-card style="margin-top: 20px">
          <el-steps :active="steps" align-center finish-status="success">
            <el-step title="验证旧邮箱"></el-step>
            <el-step title="输入新邮箱"></el-step>
            <el-step title="验证新邮箱"></el-step>
          </el-steps>
          <div :class="{'step-visible': !(steps === 0)}">
            <el-form inline >
              <el-form-item label="验证码" class="label">
                <el-input v-model="oldEmail.verifyCode" placeholder="输入旧邮箱收到的邮件中包含的验证码"></el-input>
                <el-button @click="applyVerifyEmailCode">发送验证码</el-button>
              </el-form-item>
              <el-form-item class="label1">
                <el-button type="success" @click="verifyOldEmail">验 证</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div :class="{'step-visible': !(steps === 1)}">
            <el-form inline >
              <el-form-item label="新邮箱" class="label2">
                <el-input v-model="email.email" placeholder="输入需要绑定的新邮箱"></el-input>
              </el-form-item>
              <el-form-item class="label1">
                <el-button type="success" @click="modifyEmail">提 交</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div :class="{'step-visible': !(steps === 2)}">
            <el-form inline >
              <el-form-item label="验证码" class="label">
                <el-input v-model="newEmail.verifyCode" placeholder="输入新邮箱收到的邮件中包含的验证码"></el-input>
                <el-button @click="applyVerifyEmailCode">发送验证码</el-button>
              </el-form-item>
              <el-form-item class="label1">
                <el-button type="success" @click="verifyNewEmail">验 证</el-button>
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
        userName: window.sessionStorage.getItem('userName'),
      },
      oldEmail: {
        verifyCode: null,
        userName: window.sessionStorage.getItem('userName')
      },
      newEmail: {
        verifyCode: null,
        userName: window.sessionStorage.getItem('userName')
      },
      email: {
        key: null,
        email: null,
      }
    }
  },
  methods: {
    async applyVerifyEmailCode(){
      try {
        const {data: res} = await this.$http.put("admin/email/apply", this.account)
        console.log(res.status)
        if (res.errno === 0) {
          this.$message({
            type: 'success',
            message: '邮件已发送，请注意查收并在有效时间内完成验证'
          });
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
    async verifyOldEmail(){
      try {
        const {data: res} = await this.$http.put("admin/email/verify", this.oldEmail)
        console.log(res.status)
        if (res.errno === 0) {
          this.email.key = res.data
          this.steps = 1
          this.$message({
            type: 'success',
            message: '邮箱已验证，请在5分钟内完成修改'
          });
        }
        else if(res.errno === 750){
          this.$message.error('验证码已过期，请重新申请验证码进行验证');
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
    async verifyNewEmail(){
      try {
        const {data: res} = await this.$http.put("admin/email/verify", this.newEmail, {headers: {"authorization": this.token}})
        console.log(res.status)
        if (res.errno === 0) {
          this.$message({
            type: 'success',
            message: '邮箱验证成功，邮箱修改完成'
          });
          await this.$router.push({path: "/information"});
        }
        else if(res.errno === 750){
          this.newEmail.verifyCode = null;
          this.$message.error('验证码已过期，请重新申请验证码进行验证');
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
    async modifyEmail(){
      try {
        const {data: res} = await this.$http.put("admin/email", this.email, {headers: {"authorization": this.token}})
        console.log(res)
        if (res.errno === 0) {
          this.steps = 2
          this.$message({
            type: 'success',
            message: '邮箱修改成功，请最后验证新邮箱'
          });
        }
        else if(res.errno === 732){
          this.$message.error('邮箱已被占用，请绑定别的邮箱');
        }
        else if(res.errno === 750){
          this.$message.error('操作已超时，请重新验证邮箱');
          this.oldEmail.verifyCode = null;
          this.steps = 0;
        }
      }
      catch (e){
        this.$message({
          type: 'warning',
          message: '登录已过期!请重新登录!'
        });
        await this.$router.push({path: "/login"});
      }
    }
  }
}
</script>

<style scoped>
  .label{
    margin-top: 50px;
    margin-left: 200px;
  }
  .label .el-input{
    width: 300px;
    margin-left: 50px;
  }
  .label .el-button{
    margin-left: 50px;
  }
  .label1{
    margin-top: 30px;
    margin-left: 200px;
  }
  .label1 .el-button{
    margin-left: 200px;
  }
  .label2{
    margin-top: 50px;
    margin-left: 200px;
  }
  .label2 .el-input{
    width: 400px;
    margin-left: 50px;
  }
  .step-visible{
    display: none;
  }
</style>