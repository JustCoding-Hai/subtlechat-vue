import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/chat/Login'
import ChatRoom from '../views/chat/ChatRoom'
import AdminLogin from '../views/admin/AdminLogin'
import Home from '../views/admin/Home'
import UserInfo from '../views/admin/UserInfo'
import GroupChatRecord from '../views/admin/GroupChatRecord'
import PrivateChatRecord from '../views/admin/PrivateChatRecord'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden:true
  },
   {
     path:'/chatroom',
     name:'ChatRoom',
     component:ChatRoom,
     hidden:true
    },
    {
      path:'/adminlogin',
      name:'AdminLogin',
      component:AdminLogin,
      hidden:true
    },
    {
      path:'/home',
      name:'Home',
      component:Home,
      hidden:true
    },
    {
      path:'/home',
      name:'用户管理',
      component:Home,
      iconCls:"fa fa-user",
      children:[{
        path:'/userinfo',
        name:'用户信息管理',
        component:UserInfo,
      }]
    },
    {
      path:'/home',
      name:'聊天记录管理',
      iconCls:'fa fa-book',
      component:Home,
      children:[
        {
          path:'/groupChatRecord',
          name:'群聊记录管理',
          component:GroupChatRecord
        },
        {
          path:'/privateChatRecord',
          name:'私聊记录管理',
          component:PrivateChatRecord
        }
      ]
    }



  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]
//解决重复访问路由地址报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router = new VueRouter({
  routes
})

export default router
