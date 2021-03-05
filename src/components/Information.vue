<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/information' }">个人主页</el-breadcrumb-item>
            <el-breadcrumb-item>个人资料</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <el-card class="school-card">
                        <div slot="header" class="clearfix">
                            <i class="el-icon-user" style="margin-right: 10px"></i>
                            <span>基本信息</span>
                            <el-tooltip effect="dark" content="修改信息" placement="top-start" :enterable="false">
                                <el-button style="float: right;transform: translate(0,-10px) " icon="el-icon-edit"
                                           circle @click="editBasicInfoDialogVisible = true"></el-button>
                            </el-tooltip>
                        </div>
                        <div class="text item">
                            <h3>{{'用户名'}}</h3>
                            {{basicInfoForm.userName}}
                        </div>
                        <el-divider></el-divider>
                        <div class="text item">
                            <h3>{{'真实姓名'}}</h3>
                            {{basicInfoForm.realName}}
                        </div>
                        <el-divider></el-divider>
                        <div class="text item">
                            <h3>{{'性别'}}</h3>
                            {{basicInfoForm.gender}}
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-card class="security-card">
                  <div slot="header" class="clearfix">
                    <i class="el-icon-view" style="margin-right: 10px"></i>
                    <span>安全信息</span>
                  </div>
                  <div class="text item">
                    <h3>{{'电话'}}</h3>
                    {{basicInfoForm.mobile}}
                  </div>
                  <el-divider></el-divider>
                  <div class="text item">
                    <h3>{{'邮箱'}}</h3>
                    {{basicInfoForm.email}}
                  </div>
                  <el-divider></el-divider>
                  <div class="my-button">
                    <el-button round type="primary" @click="editMobileDialogVisible = true">修改电话</el-button>
                    <el-button round type="success" @click="goToModifyEmail" style="margin-left: 50px">修改邮箱</el-button>
                    <el-button round type="warning" @click="goToModifyPassword" style="margin-left: 50px">修改密码</el-button>
                  </div>
                </el-card>
              </div>
            </el-col>
        </el-row>

        <!-- 创建基本信息对话框 -->
        <el-dialog title="修改基本信息" :visible.sync="editBasicInfoDialogVisible" width="50%"
                   class="dia_school">
            <!-- 内容主体区域 -->
            <el-form :model="editBasicInfoForm" ref="editSchoolFormRef" label-width="80px">
                <el-form-item label="用户名" prop="userName" style="padding-right: 30px">
                    <el-input v-model="editBasicInfoForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName" style="padding-right: 30px">
                    <el-input v-model="editBasicInfoForm.realName"></el-input>
                </el-form-item>
              <el-form-item label="性别" prop="gender" style="padding-right: 100px">
                <el-radio-group v-model="editBasicInfoForm.gender">
                  <el-radio :label="0">女</el-radio>
                  <el-radio :label="1">男</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="editBasicInfoDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editBasicInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建电话信息对话框 -->
        <el-dialog title="修改电话号码" :visible.sync="editMobileDialogVisible" width="50%"
                   class="dia_school">
          <!-- 内容主体区域 -->
          <el-form :model="editBasicInfoForm" ref="editSchoolFormRef" label-width="80px">
            <el-form-item label="电话号码" prop="mobile" style="padding-right: 30px">
              <el-input v-model="editBasicInfoForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 内容底部区域 -->
          <span slot="footer" class="dialog-footer">
                <el-button @click="editMobileDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editBasicInfo">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ["reload"],
        created() {
            //页面载入时问后端查询相应的el-card中的内容
          this.getBasicInfo();
        },
        data() {
            return {
                token: window.sessionStorage.getItem('token'),
                basicInfoForm: {
                    gender: null,
                    userName: "",
                    realName: "",
                    email: null,
                    mobile: null,
                },
                editBasicInfoForm: {
                    gender: null,
                    userName: "",
                    realName: "",
                    mobile: null,
                },
                editMobileDialogVisible: false,
                editBasicInfoDialogVisible: false,
            }
        },
        methods: {
            //修改框
            async getBasicInfo(){
              try {
                const {data: res} = await this.$http.get("admin", {headers: {"authorization": this.token}})
                console.log(res.status)
                if (res.errno === 0) {
                  this.basicInfoForm = res.data
                  this.editBasicInfoForm.realName = res.data.realName
                  this.editBasicInfoForm.userName = res.data.userName
                  this.editBasicInfoForm.gender = res.data.gender
                  this.editBasicInfoForm.mobile = res.data.mobile
                  if(this.basicInfoForm.gender === 0){
                    this.basicInfoForm.gender =  '女'
                  }
                  else if(this.basicInfoForm.gender === 1){
                    this.basicInfoForm.gender =  '男'
                  }
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
            async editBasicInfo() {
              try{
                console.log(this.editBasicInfoForm)
                if(this.editBasicInfoForm.userName === this.basicInfoForm.userName){
                  this.editBasicInfoForm.userName = null;
                }
                if(this.editBasicInfoForm.mobile === this.basicInfoForm.mobile){
                  this.editBasicInfoForm.mobile = null;
                }
                const {data: res} = await this.$http.put("admin", this.editBasicInfoForm, {headers: {"authorization": this.token}});
                console.log(res)
                if (res.errno === 0) {
                    this.$message.success("修改成功！");
                }
                else if(res.errno === 602) {
                  this.$message.error("用户名重复，请重新输入！");
                }
                else {
                  this.$message.error("修改失败，请重试！");
                }
                //重新载入
                this.$router.go(0)
              }
              catch (e){
                this.$message({
                  type: 'warning',
                  message: '登录已过期!请重新登录!'
                });
                await this.$router.push({path: "/login"});}
            },
            goToModifyEmail(){
              this.$router.push("/email");
            },
            goToModifyPassword(){
              this.$router.push("/password");
            }
        }
    }
</script>

<style lang="less" scoped>
    .school-card {
        width: 90%;
        margin-top: 20px;
        margin-left: 40px;
    }

    .security-card {
        width: 90%;
        margin-top: 20px;
        margin-left: 20px;
    }

    .item {
        margin-bottom: 18px;
    }

    .my-button {
      margin-bottom: 6px;
    }

    .dia_school {
        margin-left: 20%;
        margin-right: 20%;
    }
</style>