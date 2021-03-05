<template>
    <div class="login_container" >
        <!--        引入星空背景-->
        <vue-particles>
            .login_container{
            color="#dedede"
            :particleOpacity="0.7"
            :particlesNumber="80"
            shapeType="star"
            :particleSize="4"
            linesColor="#FFFFFF"
            :linesWidth="2"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
            }
        </vue-particles>

        <div class="register_box">
          <el-card>
            <el-steps :active="steps" align-center finish-status="success">
              <el-step title="验证身份"></el-step>
              <el-step title="输入验证码"></el-step>
            </el-steps>
            <div :class="{'step-visible': !(steps === 0)}">
              <el-form inline >
                <el-form-item label="用户名" class="label" label-width="80px">
                  <el-input v-model="account.userName" placeholder="输入账户的用户名"></el-input>
                </el-form-item>
                <el-form-item label="预留邮箱" class="label" label-width="80px">
                  <el-input v-model="account.email" placeholder="输入账户的预留的邮箱"></el-input>
                </el-form-item>
                <el-form-item class="label2">
                  <el-button type="success" @click="verifyIdentity">验 证</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div :class="{'step-visible': !(steps === 1)}">
              <el-form inline >
                <el-form-item label="验证码" class="label1" label-width="80px">
                  <el-input v-model="newAccount.verifyCode" placeholder="输入邮箱中收到的邮件里包含的验证码"></el-input>
                </el-form-item>
                <el-form-item class="label1">
                  <el-button type="success" @click="verifyEmail">验 证</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                steps: 0,
                account: {
                  userName: null,
                  email: null,
                },
                newAccount: {
                  userName: null,
                  verifyCode: null,
                },
            };
        },
        methods: {
          async verifyIdentity(){
            try {
              const {data: res} = await this.$http.put("admin/email/apply", this.account)
              console.log(res)
              if (res.errno === 0) {
                this.steps = 1
                this.newAccount.userName = this.account.userName
                this.$message({
                  type: 'success',
                  message: '验证码已发送至邮箱，请在5分钟内完成修改密码'
                });
              }
              else if(res.errno === 701){
                this.$message.error('用户名不存在');
              }
              else if(res.errno === 742){
                this.$message.error('与系统预留的邮箱不一致');
              }
              else{
                this.$message.error('服务器错误，请重试！');
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
          async verifyEmail(){
            if(this.newAccount.verifyCode === '' || this.newAccount.verifyCode === null){
              this.$message.error('验证码不能为空')
              return;
            }
            console.log(this.newAccount)
            try {
              const {data: res} = await this.$http.put("admin/email/verify", this.newAccount)
              console.log(res)
              if (res.errno === 0) {
                this.$message({
                  type: 'success',
                  message: '邮箱验证成功，请登录'
                });
                await this.$router.push({path: "/login"});
              }
              else if(res.errno === 750){
                this.$message.error('操作已超时，请重新验证身份');
                this.newAccount.verifyCode = null;
                this.steps = 0;
              }
              else{
                this.$message.error('服务器错误，请重试！');
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
    };
</script>

<style lang="less" scoped>
    .login_container {
        background-color: slateblue;
        height: 100%;
        overflow: hidden;
    }
    .el-l{
        display: flex;
        justify-content: flex-start;
        transform: translate(0%,35px);
    }
    .register_box {
        width: 550px;
        height: 315px;
        background-color: #fff;
        border-radius: 5px;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
    }

    .buttons {
        display: flex;
        justify-content: flex-end;

    }

    .register_form {
        position: absolute;
        bottom: 0%;
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
    }
    .label{
      margin-top: 25px;
      margin-left: 40px;
    }
    .label .el-input{
      width: 300px;
      margin-left: 20px;
    }
    .label1{
      margin-top: 50px;
      margin-left: 30px;
    }
    .label1 .el-input{
      width: 300px;
      margin-left: 20px;
    }
    .label1 .el-button{
      margin-left: 190px;
    }
    .label2{
      margin-top: 20px;
      margin-left: 70px;
    }
    .label2 .el-button{
      margin-left: 150px;
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
