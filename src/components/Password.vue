<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/information' }">个人主页</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col>
        <el-card style="margin-top: 20px">
          <el-steps :active="steps" align-center finish-status="success">
            <el-step title="验证旧密码"></el-step>
            <el-step title="输入新密码"></el-step>
          </el-steps>
          <div :class="{'step-visible': !(steps === 0)}">
            <el-form inline >
              <el-form-item label="旧密码" class="label">
                <el-input v-model="oldAccount.password" type="password" placeholder="输入账户的密码"></el-input>
              </el-form-item>
              <el-form-item class="label1">
                <el-button type="success" @click="verifyOldPassword">验 证</el-button>
              </el-form-item>
              <el-form-item class="label3">
                <el-link underline @click="goToResetPassword">忘记旧密码？点击找回密码!</el-link>
              </el-form-item>
            </el-form>
          </div>
          <div :class="{'step-visible': !(steps === 1)}">
            <el-form inline>
              <el-form-item label="新密码" class="label2" label-width="80px">
                <el-input type="password" v-model="newAccount.password" placeholder="输入需要设置的新密码"></el-input>
              </el-form-item>
              <el-form-item label="重复密码" class="label2" label-width="80px">
                <el-input type="password" v-model="newAccount.repeatPassword" placeholder="重复输入新设置的密码"></el-input>
              </el-form-item>
              <el-form-item class="label1">
                <el-button type="success" @click="modifyPassword">修 改</el-button>
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
      oldAccount: {
        userName: window.sessionStorage.getItem('userName'),
        password: null
      },
      newAccount: {
        userName: window.sessionStorage.getItem('userName'),
        verifyCode: null,
        password: null,
        repeatPassword: null
      }
    }
  },
  methods: {
    async verifyOldPassword(){
      try {
        const {data: res} = await this.$http.put("admin/password/verify", this.oldAccount, {headers: {"authorization": this.token}})
        console.log(res)
        if (res.errno === 0) {
          this.newAccount.verifyCode = res.data
          this.steps = 1
          this.$message({
            type: 'success',
            message: '密码验证成功，请在5分钟内完成修改密码'
          });
        }
        else{
          this.$message.error('密码错误，请重新确认正确后输入');
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
    async modifyPassword(){
      if(this.newAccount.password !== this.newAccount.repeatPassword){
        this.$message.error('两次密码不一致，请确认后重新输入')
        return;
      }
      try {
        const {data: res} = await this.$http.put("admin/password", this.newAccount, {headers: {"authorization": this.token}})
        console.log(res)
        if (res.errno === 0) {
          this.$message({
            type: 'success',
            message: '密码修改成功'
          });
          await this.$router.push({path: "/information"});
        }
        else if(res.errno === 741){
          this.$message.error('新设置的密码不能与旧密码相同，请重新设置');
          this.newAccount.password = null;
          this.newAccount.repeatPassword = null;
        }
        else if(res.errno === 750){
          this.$message.error('操作已超时，请重新验证密码');
          this.newAccount.verifyCode = null;
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
    },
    goToResetPassword(){
      this.$router.push({path: "/reset"});
    },
  }
}
</script>

<style scoped>
  .label{
    margin-top: 50px;
    margin-left: 200px;
  }
  .label .el-input{
    width: 400px;
    margin-left: 50px;
  }
  .label1{
    margin-top: 30px;
    margin-left: 200px;
  }
  .label1 .el-button{
    margin-left: 250px;
  }
  .label2{
    margin-top: 50px;
    margin-left: 200px;
  }
  .label2 .el-input{
    width: 400px;
    margin-left: 50px;
  }
  .label3{
    margin-left: 400px;
  }
  .label3 .el-link{
    margin-right: 100px;
  }
  .step-visible{
    display: none;
  }
</style>