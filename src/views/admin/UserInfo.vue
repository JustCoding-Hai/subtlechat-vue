<template>
<div>
  <div>
    用户账号状态选择：
    <el-select v-model="stateValue" placeholder="请选择">
      <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select>
    <el-input placeholder="输入用户昵称进行搜索"
              prefix-icon="el-icon-search"
              style="width: 200px;margin: 0 10px"
               v-model="nameKeyword"></el-input>
    <el-button @click="initUserData" icon="el-icon-search" type="primary">搜索</el-button>
    <el-button @click="refreshTable" icon="el-icon-refresh" type="primary">刷新表格</el-button>
  </div>
  <div style="margin-top: 20px;width: 1000px">
    <el-table
            :data="userData"
            stripe
            border
            v-loading="loading"
            @selection-change="handleSelectionChange"
            style="width: 100%">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column
              prop="id"
              label="编号"
              width="80">
      </el-table-column>
      <el-table-column
              prop="username"
              label="用户名"
              width="180">
      </el-table-column>
      <el-table-column
              prop="nickname"
              label="昵称"
              width="180">
      </el-table-column>
      <el-table-column
              label="用户头像"
               width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.userProfile"
                    :preview-src-list="[scope.row.userProfile]"
                    style="width: 50px;height: 50px">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
              label="是否锁定该账户"
               width="200">
        <template slot-scope="scope">
        <el-switch
                v-model="scope.row.accountNonLocked"
                @change="changeLockedStatus(scope.row)"
                active-text="未锁定"
                inactive-text="锁定"
                active-color="#13ce66"
                inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin-top: 10px">
      <el-button @click="handleMultiDelete" :disabled="multipleSelection.length==0?true:false" type="danger" icon="el-icon-delete">批量删除</el-button>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="display: inline-block">
      </el-pagination>
    </div>

  </div>
</div>
</template>

<script>
  export default {
    name: "UserInfo",
    data(){
      return{
        stateValue:-1,//默认用户状态
        stateOptions:[
          {
            label:'请选择',
            value:-1
          },
          {
            label:'未锁定',
            value:0
          },
          {
            label:'已锁定',
            value:1
          }
        ],
       userData:[],
       total:0,//表格数据总数
        page:1,//当前页的页数
        size:10,//当前页的显示条数
        nameKeyword:'',//搜索关键字
        multipleSelection: [],//多选框选中的数组
        loading:false,//加载动画
      }
    },
    mounted(){
      this.initUserData();
    },
    methods:{
      //获取表格数据
      initUserData(){
        this.loading=true;
        let url="/user/?page="+this.page+"&size="+this.size;
        if (this.nameKeyword!=''){
          url+="&keyword="+this.nameKeyword;
        }
        if (this.stateValue!=-1){
          url+="&isLocked="+this.stateValue;
        }
        this.getRequest(url).then(resp=>{
          if (resp){
            this.userData=resp.data;
            this.total=resp.total;
            setTimeout(()=>{
              this.loading=false;
            },1000)
          }
        })
      },
      //改变当前页大小的回调函数
      handleSizeChange(val){
        this.size=val;
        this.initUserData();
      },
      //改变当前页数的回调函数
      handleCurrentChange(val){
        this.page=val;
        this.initUserData();
      },
      //刷新表格
      refreshTable(){
        this.nameKeyword='';
        this.stateValue=-1;
        this.initUserData();
      },
      //更改用户锁定状态
      changeLockedStatus(data){
        this.putRequest("/user/?id="+data.id+"&isLocked="+!data.accountNonLocked).then(resp=>{
          if(resp){
            this.initUserData();
          }
        })
  },
  //删除单个用户
      handleDelete(data){
        this.$confirm('此操作将永久删除用户【'+data.nickname+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/user/"+data.id).then(resp=>{
            if (resp){
              //刷新表格
              this.initUserData();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //当选择项发生变化时会触发该事件
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      //处理批量删除用户
      handleMultiDelete(){
        this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】个用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url="/user/?";
          this.multipleSelection.forEach(item=>{
            url+="ids="+item.id+"&";
          })
          this.deleteRequest(url).then(resp=>{
            if (resp){
              this.initUserData();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>

<style scoped>

</style>
