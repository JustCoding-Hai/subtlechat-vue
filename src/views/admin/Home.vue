<template>
  <el-container>
    <el-header class="homeHeader">
      <div class="title">微言聊天室管理端</div>
      <div>
        <el-dropdown class="choices" @command="commandHandler">
        <span class="el-dropdown-link">
          {{user.name}}<i><img :src="user.userProfile"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router unique-opened>
          <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="item.hidden!=true" :key="index">
            <template slot="title">
              <i style="color: #2F86D2;margin-right: 8px" :class="item.iconCls"></i>
              <span>{{item.name}}</span>
            </template>
              <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
          欢迎来到微言聊天室管理端！
        </div>
        <router-view class="homeRouterView"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        user:JSON.parse(window.sessionStorage.getItem("admin"))//user的JSON对象
      }
    },
    computed:{
      routes(){
       return this.$router.options.routes;
      }
    },
    methods:{
      test(){
        this.$router.push("/userinfo")
      },
      commandHandler(cmd){
        //注销登录操作
        if (cmd=='logout'){
          this.$confirm('此操作将注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getRequest("/admin/logout");
            sessionStorage.removeItem("admin");//删除session
            this.$router.replace('/adminlogin');//页面替换为登陆页Login.vue
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }else if (cmd=='userInfo'){
          //this.$router.push('/hrinfo');
        }
      }
    }
  }
</script>

<style>
  .homeHeader{
    background-color: #409eff;
    display: flex;/*flex布局*/
    align-items: center;/*cross交叉轴中*/
    justify-content: space-between;/*左右两侧（main主轴）对齐*/
    padding:0px;
    box-sizing:border-box;
  }
  .homeHeader .title{
    font-size: 30px;
    font-family: 华文行楷;
    color:#ffffff;
  }
  .homeHeader .choices{
    cursor: pointer;
  }
  .choices img{
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 10px;
  }
  .el-dropdown-link{
    display: flex;
    align-items: center;
  }
  .homeWelcome{
    text-align: center;
    font-size: 30px;
    font-family: 华文行楷;
    color: #409eff;
  }
  .homeRouterView{
    margin-top: 15px;
  }
</style>
