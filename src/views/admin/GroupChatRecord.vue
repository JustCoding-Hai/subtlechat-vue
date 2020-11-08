<template>
<div>
  <div>
    发送者昵称：<el-input v-model="nameKeyword" placeholder="输入发送者昵称" class="nameInput"></el-input>
    发送时间：
    <el-date-picker
          v-model="dateScope"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :editable="false"
          :unlink-panels="true"
          value-format="yyyy-MM-dd HH:mm:ss"
          class="topControlsBar">
  </el-date-picker>
    消息类型：
    <el-radio-group v-model="msgTypeRadio" class="topControlsBar">
      <el-radio :label="1">文本</el-radio>
      <el-radio :label="2">图片</el-radio>
      <el-radio :label="3">文件</el-radio>
    </el-radio-group>
    <el-button @click="initMessTableData" icon="el-icon-search" type="primary" size="small" class="topControlsBar">搜索</el-button>
    <el-button @click="refreshMessTableData" icon="el-icon-refresh" type="primary" size="small" class="topControlsBar">刷新表格</el-button>
    <el-button @click="exportData" icon="el-icon-document" type="success" size="small" class="topControlsBar">导出Excel</el-button>
  </div>
  <div style="margin-top: 15px">
    <el-table
            :data="messTableData"
            v-loading="loading"
            border
            stripe
            @selection-change="handleSelectionChange"
            style="width: 100%">
      <el-table-column
              type="selection"
              width="55">
      </el-table-column>
      <el-table-column
              prop="id"
              label="消息编号"
              width="80">
      </el-table-column>
      <el-table-column
              prop="fromId"
              label="发送者编号"
              width="100">
      </el-table-column>
      <el-table-column
              prop="fromName"
              label="发送者昵称"
              width="150">
      </el-table-column>
      <el-table-column
              prop="createTime"
              label="发送时间"
              width="180">
      </el-table-column>
      <el-table-column
              label="内容"
              width="750">
        <template slot-scope="scope">
          <div v-if="scope.row.messageTypeId==1" v-html="scope.row.content"></div>
          <div v-else>
            <el-image :src="scope.row.content"
                      :preview-src-list="[scope.row.content]"
                      style="width: 50px;height: 50px">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
</template>

<script>
  export default {
    name: "GroupChatRecord",
    data(){
      return{
        messTableData: [],
        msgTypeRadio:-1,
        multipleSelection:[],//选中的每一项
        page:1,//起始页数
        size:10,//单页显示数据数
        total:-1,//表格数据总数
        nameKeyword:'',//查询昵称关键字
        dateScope:null,//日期时间范围数组
        loading:false,
      }
    },
    mounted(){
      this.initMessTableData();
    },
    methods:{
      //初始化表格数据
      initMessTableData(){
        this.loading=true;
        let url="/groupMsgContent/page?page="+this.page+"&size="+this.size;
        if (this.nameKeyword!=''){
          url+="&nickname="+this.nameKeyword;
        }
        if (this.dateScope){
          url+="&dateScope="+this.dateScope;
        }
        if (this.msgTypeRadio!=-1){
          url+="&type="+this.msgTypeRadio;
        }
        this.getRequest(url).then(resp=>{
          this.messTableData=resp.data;
          this.total=resp.total;
          setTimeout(()=>{
            this.loading=false;
          },1000)
        })
      },
      //刷新表格
      refreshMessTableData(){
        this.nameKeyword='';
        this.dateScope=null;
        this.msgTypeRadio=-1;
        this.initMessTableData();
      },
      //导出数据到Excel文件中
      exportData(){
        window.open("/groupMsgContent/download","_parent");
      },
      handleSizeChange(val){
        this.size=val;
        this.initMessTableData();
      },
      handleCurrentChange(val){
        this.page=val;
        this.initMessTableData();
      },
      //当选择项发生变化时会触发该事件
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      //单条数据删除
      handleDelete(data){
        this.$confirm('此操作将永久删除该条消息记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //点击确定后即执行
          this.deleteRequest("/groupMsgContent/"+data.id).then(resp=>{
            if (resp){
              this.initMessTableData();
            }
          })
        }).catch(() => {
          //点击了取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //批量删除数据
      handleMultiDelete(){
        this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url="/groupMsgContent/?";
          this.multipleSelection.forEach(item=>{
            url+="ids="+item.id+"&";
          });
          this.deleteRequest(url).then(resp=>{
            if (resp){
              this.initMessTableData();
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
  .nameInput{
    width: 150px;
  }
  .topControlsBar{
    margin:0 10px;
  }
</style>
