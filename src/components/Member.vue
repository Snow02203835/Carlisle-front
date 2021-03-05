<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/members' }">会员管理</el-breadcrumb-item>
            <el-breadcrumb-item>会员信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col span=24>
            <el-card class="newCardHead">
                <el-col span="19">
                    <div class="searchText">会员信息</div>
                </el-col>
              <el-col span="2">
                <el-button type="warning" icon="el-icon-potato-strips" circle @click="birthdayNotice = true"></el-button>
              </el-col>
                <el-col span="2">
                  <el-button type="primary" :icon="filterCardVisible?'el-icon-arrow-down':'el-icon-arrow-up'" circle @click="filterCardVisible = !filterCardVisible"></el-button>
                </el-col>
                <el-col span="1">
                    <el-button type="success" icon="el-icon-plus" circle @click="addMemberDialogVisible = true"></el-button>
                </el-col>
            </el-card>
            <!--el-card class="newCard" v-for="item in memberInfoList" :key="item.id">
                <el-col span="2">{{item.realName}}</el-col>
                <el-col span="1">{{item.creatorId}}</el-col>
                <el-col span="4">{{item.birthYear}}年{{item.birthMonth}}月{{item.birthday}}日</el-col>
                <el-col span="1">{{item.gender}}</el-col>
                <el-col span="6">{{item.decryptEmail}}</el-col>
                <el-col span="4">{{item.decryptMobile}}</el-col>
                <el-col span="5">{{item.comment}}</el-col>
            </el-card-->
            <el-card :class="{'newCard':true, 'cardVisible': filterCardVisible}">
              <el-row>
                <div class="searchText">筛选</div>
              </el-row>
              <el-row>
                <el-form inline label-width="60px">
                  <el-form-item label="卡号">
                    <el-input v-model="memberInfoFilterForm.memberId"></el-input>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <el-input v-model="memberInfoFilterForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-radio-group v-model="memberInfoFilterForm.gender">
                      <el-radio :label="0">女</el-radio>
                      <el-radio :label="1">男</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
                <el-form inline label-width="60px">
                  <el-form-item label="电话">
                    <el-input v-model="memberInfoFilterForm.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="memberInfoFilterForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证">
                    <el-input v-model="memberInfoFilterForm.identityId"></el-input>
                  </el-form-item>
                </el-form>
              </el-row>
              <el-row>
                <el-col offset="17">
                  <el-button @click="resetInfoFilter">重置</el-button>
                  <el-button @click="getMemberData(1)" type="primary">查询</el-button>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="newCard">
                <el-table :data="memberInfoList" stripe border>
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="id">
                            <span>{{ props.row.id }}</span>
                          </el-form-item>
                          <el-form-item label="创建者id">
                            <span>{{ props.row.creatorId }}</span>
                          </el-form-item>
                          <el-form-item label="会员名称">
                            <span>{{ props.row.name }}</span>
                          </el-form-item>
                          <el-form-item label="性别">
                            <span>{{ props.row.gender }}</span>
                          </el-form-item>
                          <el-form-item label="生日">
                            <span>{{ props.row.birthday }}</span>
                          </el-form-item>
                          <el-form-item label="地址">
                            <span>{{ props.row.address }}</span>
                          </el-form-item>
                          <el-form-item label="会员卡号">
                            <span>{{ props.row.memberId }}</span>
                          </el-form-item>
                          <el-form-item label="身份证号">
                            <span>{{ props.row.identityId }}</span>
                          </el-form-item>
                          <el-form-item label="电话">
                            <span>{{ props.row.mobile }}</span>
                          </el-form-item>
                          <el-form-item label="邮箱">
                            <span>{{ props.row.email }}</span>
                          </el-form-item>
                          <el-form-item label="历史">
                            <span>{{ props.row.history }}</span>
                          </el-form-item>
                          <el-form-item label="备注">
                            <span>{{ props.row.comment }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column prop="memberId" label="会员卡号" width="150" sortable></el-table-column>
                    <el-table-column prop="name" label="会员姓名" width="120" sortable></el-table-column>
                    <el-table-column prop="gender" label="性别" width="50"></el-table-column>
                    <el-table-column prop="birthday" label="生日" width="140"></el-table-column>
                    <el-table-column prop="mobile" label="电话号码" width="120"></el-table-column>
                    <el-table-column prop="comment" label="备注"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="145">
                        <template slot-scope="scope">
                            <el-button @click="recordMemberInfo(scope.row)" type="info" size="small">修改</el-button>
                            <el-button @click="removeMemberInfo(scope.row.id)" type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination layout="prev, pager, next" background :total="total" :page-size="pageSize" :hide-on-single-page="pages === 1" @current-change="currentPageIndexChange" @prev-click="prevPage" @next-click="nextPage"></el-pagination>
            </el-card>
        </el-col>
        <el-dialog title="会员生日提醒" :visible.sync="birthdayNotice" width="55%">
          <el-table :data="memberNameList" stripe border>
            <el-table-column prop="name" label="会员姓名" width="100"></el-table-column>
            <el-table-column prop="mobile" label="电话号码" width="120"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="300"></el-table-column>
            <el-table-column fixed="right" label="通知">
              <template slot-scope="scope">
                <el-button @click="informBirthdayMember(scope.row, '/mobile/')" type="success" size="small" disabled>短信</el-button>
                <el-button @click="informBirthdayMember(scope.row, '/email/')" type="primary" size="small">邮件</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
                  <el-button type="danger" @click="closeBirthdayNoticeInThisSession">本次登录不再提醒</el-button>
                  <el-button type="success" @click="informAllBirthdayMemberByNote" disabled>一键短信通知</el-button>
                  <el-button type="primary" @click="informAllBirthdayMemberByEmail">一键邮件通知</el-button>
                  <el-button type="warning" @click="birthdayNotice = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增会员信息" :visible.sync="addMemberDialogVisible" width="40%">
            <el-form ref="newMemberInfoForm" :model="newMemberInfoForm" :rules="memberInfoFormRules" label-width="80px" size="small" label-position="right">
                <el-form-item label="卡号" prop="memberId" required>
                  <el-input v-model="newMemberInfoForm.memberId"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name" required>
                    <el-input v-model="newMemberInfoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" required>
                    <el-radio-group v-model="newMemberInfoForm.gender">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="newMemberInfoForm.date" value-format="yyyy-MM-dd"></el-date-picker>
<!--                  <el-col span="3">-->
<!--                    <el-input v-model="newMemberInfoForm.birthYear"></el-input>-->
<!--                  </el-col>-->
<!--                  <el-col span="2">年</el-col>-->
<!--                  <el-col span="2">-->
<!--                    <el-input v-model="newMemberInfoForm.birthMonth"></el-input>-->
<!--                  </el-col>-->
<!--                  <el-col span="2">月</el-col>-->
<!--                  <el-col span="2">-->
<!--                    <el-input v-model="newMemberInfoForm.birthday"></el-input>-->
<!--                  </el-col>-->
<!--                  <el-col span="2">日</el-col>-->
                </el-form-item>
                <el-form-item label="身份证号" prop="identityId">
                  <el-input v-model="newMemberInfoForm.identityId"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="newMemberInfoForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="newMemberInfoForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="newMemberInfoForm.address"></el-input>
                </el-form-item>
              <el-form-item label="历史">
                <el-input type="textarea" v-model="newMemberInfoForm.history"></el-input>
              </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="newMemberInfoForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMemberDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitMemberInfo">提 交</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改会员信息" :visible.sync="modifyMemberDialogVisible" width="40%">
            <el-form ref="newMemberInfoForm" :rules="memberInfoFormRules" :model="modifyMemberInfoForm" label-width="80px" size="small">
              <el-form-item label="卡号" prop="memberId" required>
                <el-input v-model="modifyMemberInfoForm.memberId"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name" required>
                    <el-input v-model="modifyMemberInfoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="modifyMemberInfoForm.gender">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-col span="6">
                        <el-input v-model="modifyMemberInfoForm.birthYear"></el-input>
                    </el-col>
                    <el-col span="2">年</el-col>
                    <el-col span="5">
                        <el-input v-model="modifyMemberInfoForm.birthMonth"></el-input>
                    </el-col>
                    <el-col span="2">月</el-col>
                    <el-col span="5">
                        <el-input v-model="modifyMemberInfoForm.birthday"></el-input>
                    </el-col>
                    <el-col span="2">日</el-col>
                </el-form-item>
                <el-form-item label="身份证号" prop="identityId">
                  <el-input v-model="modifyMemberInfoForm.identityId"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="modifyMemberInfoForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="modifyMemberInfoForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="modifyMemberInfoForm.address"></el-input>
                </el-form-item>
                <el-form-item label="历史">
                  <el-input type="textarea" v-model="modifyMemberInfoForm.history"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="modifyMemberInfoForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyMemberDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyMemberInfo">修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Member",
    mounted() {
        this.getMemberData(1);
        if(window.sessionStorage.getItem('birthday') === '1'){
          this.getTodayBirthdayMemberName();
        }
    },
    data() {
      return {
          token: window.sessionStorage.getItem('token'),
          birthdayNotice: false,
          page: 0,
          total: 0,
          pages: 0,
          pageSize: 20,
          memberInfoList: [],
          addMemberDialogVisible: false,
          filterCardVisible: true,
          modifyMemberDialogVisible: false,
          memberNameList: [],
          newMemberInfoForm: {

          },
          memberInfoFilterForm: {
            memberId: null,
            name: null,
            gender: null,
            mobile: null,
            email: null,
            identityId: null
          },
          memberInfoFormRules: {
            memberId: [
              { required: true, message: '请输入会员卡号', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请输入会员姓名', trigger: 'blur' },
              { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
            ],
            gender: [
              { required: true, message: '请选择会员性别', trigger: 'blur' }
            ],
            mobile: [
              { type: "string", required: false, message: '电话号码只能包含数字', pattern : /^[0-9]+$/, trigger: 'blur' }
            ],
            email: [
              { type: 'string', required: false, message: "邮箱格式不正确", pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, trigger: 'blur' }
            ],
            identityId: [
              { type: "string", message: '身份证号码格式不正确', required: false, pattern: /^[0-9]{17}[0-9X]$/, trigger: 'blur' }
            ],
          },
          modifyMemberInfoForm: {
              name: '',
              memberId: null,
              gender: null,
              birthYear: null,
              birthMonth: null,
              birthday: null,
              identityId: null,
              email: '',
              mobile: '',
              address: '',
              history: '',
              comment: '',

          },
          currentModifyId: 0,
      }
    },
    methods: {
        async getMemberData(page) {
            let url = "members?page=" + page + "&pageSize=" + this.pageSize;
            if(this.memberInfoFilterForm.memberId != null){
              url += "&memberId=" + this.memberInfoFilterForm.memberId;
            }
            if(this.memberInfoFilterForm.name != null){
              url += "&name=" + this.memberInfoFilterForm.name;
            }
            if(this.memberInfoFilterForm.gender != null){
              url += "&gender=" + this.memberInfoFilterForm.gender;
            }
            if(this.memberInfoFilterForm.mobile != null){
              url += "&mobile=" + this.memberInfoFilterForm.mobile;
            }
            if(this.memberInfoFilterForm.email != null){
              url += "&email=" + this.memberInfoFilterForm.email;
            }
            if(this.memberInfoFilterForm.identityId != null){
              url += "&identityId=" + this.memberInfoFilterForm.identityId;
            }
            // console.log("url: " + url);
            try {
              const {data: res} = await this.$http.get(url, {headers: {"authorization": this.token}})
              if (res.errno === 0) {
                this.page = res.data.page
                this.pages = res.data.pages
                this.total = res.data.total
                this.memberInfoList = res.data.list
                // for(let i = 0; i < this.memberNameList.length; i++){
                //   if(this.memberNameList[i].gender === 1){
                //     this.memberNameList[i].gender = '男'
                //   }
                //   else if(this.memberNameList[i].gender === 0){
                //     this.memberNameList[i].gender = '女'
                //   }
                // }
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
        async submitMemberInfo() {
            console.log(this.newMemberInfoForm)
            try{
              const {data: res} = await this.$http.post('members', this.newMemberInfoForm, {headers: {"authorization": this.token}})
              console.log(res)
              if (res.errno === 0) {
                console.log(res.data)
                this.$router.go(0)
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
        async modifyMemberInfo(){
            this.modifyMemberInfoForm.date = this.modifyMemberInfoForm.birthYear + '-' + this.modifyMemberInfoForm.birthMonth + '-' + this.modifyMemberInfoForm.birthday;
            const url = 'members/' + this.currentModifyId;
            try{
              const {data: res} = await this.$http.put(url, this.modifyMemberInfoForm, {headers: {"authorization": this.token}})
              console.log(res)
              if (res.errno === 0) {
                this.$router.go(0)
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
        async getTodayBirthdayMemberName(){
          let url = "members/contact";
          try{
            const {data: res} = await this.$http.get(url, {headers: {"authorization": this.token}})
            console.log(res)
            if (res.errno === 0) {
              if(res.data){
                this.memberNameList = res.data.memberContacts
                for(let i = 0; i < this.memberNameList.length; i++){
                  this.memberNameList[i].emailInform = false;
                  this.memberNameList[i].mobileInform = false;
                }
                console.log(this.memberNameList)
                this.birthdayNotice = true;
                window.sessionStorage.setItem('birthday', '1');
              }
              else{
                window.sessionStorage.setItem('birthday', '0');
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
        async informBirthdayMember(row, method){
          let url = "members/birthday" + method + row.id;
          try{
            const {data: res} = await this.$http.get(url, {headers: {"authorization": this.token}})
            console.log(res)
            if (res.errno === 0) {
              row.emailInform = true;
              this.$message({
                type: 'success',
                message: '已成功发送生日祝福给会员' + row.name
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
        informAllBirthdayMemberByNote(){
          for(let i = 0; i < this.memberNameList.length; i++){
            this.informBirthdayMember(this.memberNameList[i], "/mobile/")
          }
        },
        informAllBirthdayMemberByEmail(){
          for(let i = 0; i < this.memberNameList.length; i++){
            this.informBirthdayMember(this.memberNameList[i], "/email/")
          }
        },
        recordMemberInfo(row){
            this.currentModifyId = Number(row.id);
            this.modifyMemberInfoForm.name = row.name;
            this.modifyMemberInfoForm.memberId = row.memberId;
            this.modifyMemberInfoForm.gender = (row.gender === '男'?1:0);
            if(row.birthday != null){
              this.modifyMemberInfoForm.birthYear = row.birthday.split('年')[0];
              this.modifyMemberInfoForm.birthMonth = row.birthday.split('年')[1].split('月')[0];
              this.modifyMemberInfoForm.birthday = row.birthday.split('年')[1].split('月')[1].split('日')[0];
            }
            this.modifyMemberInfoForm.identityId = row.identityId;
            this.modifyMemberInfoForm.email = row.email;
            this.modifyMemberInfoForm.mobile = row.mobile;
            this.modifyMemberInfoForm.address = row.address;
            this.modifyMemberInfoForm.history = row.history;
            this.modifyMemberInfoForm.comment = row.comment;
            this.modifyMemberDialogVisible = true;
        },
        removeMemberInfo(memberId) {
            this.$confirm('此操作将永久删除该会员信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                console.log("MemberId: "  + memberId)
                const url = 'members/' + memberId;
                const {data: res} = await this.$http.delete(url, {headers: {"authorization": this.token}})
                console.log(res)
                if (res.errno === 0) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.memberInfoList = []
                    await this.getMemberData(0)
                }
                else {
                    this.$message({
                        type: 'warning',
                        message: '删除失败！请稍后重试！'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        resetInfoFilter(){
          this.memberInfoFilterForm.memberId = null;
          this.memberInfoFilterForm.name = null;
          this.memberInfoFilterForm.gender = null;
          this.memberInfoFilterForm.mobile = null;
          this.memberInfoFilterForm.email = null;
          this.memberInfoFilterForm.identityId = null;
          this.getMemberData(1);
        },
        closeBirthdayNoticeInThisSession(){
          window.sessionStorage.setItem('birthday', '0');
          console.log(window.sessionStorage.getItem('birthday'));
          this.birthdayNotice = false;
        },
        currentPageIndexChange(index){
            this.getMemberData(index)
        },
        prevPage(){
            this.getMemberData(this.page - 1)
        },
        nextPage(){
            this.getMemberData(this.page + 1)
        },
    },
}
</script>

<style scoped>
  @import '../style/allNew.css';
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .new-member-info{
    width: 50%;
  }
  .new-member-info .el-form-item{
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>