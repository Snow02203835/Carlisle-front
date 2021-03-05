<template>
    <!--引入container布局-->
    <el-container class="home-container">
        <!--头部-->
        <el-header :height="'104px'">
            <div>
                <span>Carlisle</span>
            </div>
            <el-dropdown @command="handleCommand" style="color: white">
                <span class="el-dropdown-link">
                    <h1 style="color: white">{{userName}}</h1><i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu class="eld-menu" slot="dropdown">
                    <el-dropdown-item command="account">基本资料</el-dropdown-item>
                    <el-dropdown-item command="cancel">注销</el-dropdown-item>
                    <el-dropdown-item command="quit" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse ?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapase">|||</div>
                <!--                以下是背景颜色，字体，选中后颜色-->
                <el-menu background-color="lightgray" text-color="gray" active-text-color="#409eff"
                         :collapse="isCollapse"
                         :collapse-transition="false" :router="true" :default-active="activePath">
                    <!--一级菜单-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">

                            <i :class="iconsObject[item.id]"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <el-menu-item :index="it.path" v-for="it in item.sList" :key="it.id"
                                      @click="saveNavState(it.path)">
                            <template slot="title">
                                <span>{{it.title}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--主体内容-->
            <el-main>
                <!--              路由占位符-->
                <router-view>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        inject: ['reload'],
        data() {
            return {
                userName: window.sessionStorage.getItem('userName'),
                isCollapse: false,//伸缩属性
                menuList: [
                    {
                        id: 100,
                        title: '会员管理',
                        sList: [
                            {
                                id: 101,
                                title: '会员信息',
                                path: '/members',
                            },
                          {
                            id: 102,
                            title: '会员生日',
                            path: '/birthday',
                          },
                        ],
                    },
                    {
                        id: 200,
                        title: '个人主页',
                        sList: [
                            {
                                id: 201,
                                title: '个人资料',
                                path: '/information',
                            },
                            {
                                id: 202,
                                title: '修改邮箱',
                                path: '/email',
                            },
                            {
                                id: 203,
                                title: '修改密码',
                                path: '/password',
                            },
                            {
                              id: 204,
                              title: '新增管理员',
                              path: '/new',
                            },
                        ],
                    }
                ],
                iconsObject: {
                    '100': 'el-icon-s-home',
                    '200': 'el-icon-user-solid',
                },
                activePath: '/information',
            }
        },
        created() {
            this.activePath = window.sessionStorage.getItem('activePath');
        },
        methods: {
            handleCommand: function (command) {
                if ("quit" === command) {
                    this.$message.success("用户已登出");
                    window.sessionStorage.clear();
                    this.$router.push("/login");
                } else if (command === "cancel") {
                    this.$message.success("用户注销成功");
                    window.sessionStorage.clear();
                    this.$router.push({path: "/login"});
                } else if (command === "account") {
                    this.$router.push({path: "/information"});
                }
            },

            toggleCollapase() {
                this.isCollapse = !this.isCollapse;
            },
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath);
                this.activePath = activePath;
            },
        }
    }
</script>

<style lang='less' scoped>
    .el-icon-arrow-down {
        font-size: 12px;
    }

    //头样式
    .el-header {
        background-color: slateblue;
        display: flex;
        justify-content: space-between; // 左右贴边
        padding-left: 0%; // 左边界
        align-items: center; // 水平
        color: #fff;
        font-size: 20px;

        > div {
            //左侧div加布局
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }
    }

    //侧边
    .el-aside {
        background-color: lightgray;

        .el-menu {
            border-right: none; // 对其右边框
        }
    }

    //主体
    .el-main {
        background-color: whitesmoke;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .home-container {
        height: 800px;
    }


    //按钮样式
    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer // 显示鼠标指针为：小手
    }

</style>