import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../components/Home";
import Information from "../components/Information";
import Login from "../components/Login";
import Birthday from "../components/Birthday";
import Member from "@/components/Member";
import Email from "../components/Email";
import Password from "@/components/Password";
import ResetPassword from "@/components/ResetPassword";
import NewAdmin from "@/components/NewAdmin";
import VerifyEmail from "@/components/VerifyEmail";


Vue.use(VueRouter)

// 用于解决重复导航问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/reset",
        component: ResetPassword
    },
    {
        path: "/verify",
        component: VerifyEmail
    },
    {
        path: "/home",
        component: Home,
        redirect: "/information",
        children: [
            {
                path: "/members",
                component: Member
            },
            {
                path: "/information",
                component: Information
            },
            {
                path: "/birthday",
                component: Birthday
            },
            {
                path: "/email",
                component: Email
            },
            {
                path: "/password",
                component: Password
            },
            {
                path: "/new",
                component: NewAdmin
            }
        ],
    }
]

const router = new VueRouter({
    routes
})

export default router
