<template>
  <div>
    <el-card>
      <div class="title-text">会员生日 {{month}}月</div>
      <div class="month-index">
        <el-pagination layout="prev, pager, next" background
                       :current-page="month" :total="120" :hide-on-single-page="month === 1" :pager-count="12"
                       @current-change="currentPageIndexChange"
                       @prev-click="prevPage"
                       @next-click="nextPage"></el-pagination>
      </div>
      <div :class="{'box-visible': (memberNameList.length === 0)}">
        <div v-for="items in memberNameList" class="birthday">
          <div class="date-index">{{items.day}}日</div>
          <div class="member-name-box">
            <div v-for="item in items.memberNames">
              {{item}}
            </div>
          </div>
        </div>
      </div>
      <div :class="{'box-visible': (memberNameList.length !== 0)}">
        <div class="none-birthday-box">
          <div class="none-birthday-text">该月暂无会员生日喔，快去招揽更多的会员加入这里吧</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Birthday",
  mounted() {
    let myDate = new Date();
    this.month = myDate.getMonth() + 1;
    this.getMemberName();
  },
  data(){
    return{
      token: window.sessionStorage.getItem('token'),
      month: null,
      memberNameList: [
        {
          day: 0,
          memberNames: []
        },
      ],
    }
  },
  methods: {
    async getMemberName(){
      let url = "members/" + this.month;
      try{
        const {data: res} = await this.$http.get(url, {headers: {"authorization": this.token}})
        console.log(res)
        if (res.errno === 0) {
          this.memberNameList = res.data.memberNames
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
    currentPageIndexChange(index){
      this.month = index
      this.getMemberName();
    },
    prevPage(){
      this.month--
      this.getMemberName()
    },
    nextPage(){
      this.month++
      this.getMemberName()
    },
  }
}
</script>

<style scoped>
  .title-text{
    font-size: 2.5rem;
    height: 60px;
  }
  .birthday{
    height: 50px;
    margin-top: 5px;
  }
  .date-index{
    font-size: 1.6rem;
    font-weight: bolder;
    margin-top: 7px;
    margin-left: 5px;
    position: absolute;
  }
  .member-name-box{
    margin-top: 8px;
    margin-left: 100px;
    position: absolute;
  }
  .member-name-box div{
    float: left;
    font-size: 1.5rem;
    width: 150px;
  }
  .month-index{
    margin-top: 10px;
  }
  .none-birthday-box{
    height: 60px;
  }
  .none-birthday-text{
    margin-top: 20px;
    font-size: 1.5rem;
  }
  .box-visible{
    display: none;
  }
</style>