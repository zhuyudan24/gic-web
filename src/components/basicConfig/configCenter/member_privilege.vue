<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="right-box">
        <div class="add-new-btn">
          <el-button @click="addPrivilege" type="primary">新增特权</el-button>
        </div>
        <el-table
          :data="tableData"
          v-loading="loading"
          max-height="1023"
          class="table-no-line-wrap"
          style="width: 100%">
          <el-table-column
            prop="sort"
            label="排序"
            width="180">
            <template slot-scope="scope">
              <i @click="sortPrivilege(1,'up',scope.$index)" v-show="scope.$index!=0" title="上移" class="sort-icon-all iconfont icon-yd-icon-upload2"></i>
              <i @click="sortPrivilege(2,'down',scope.$index)" v-show="scope.$index!=tableData.length-1" title="下移" class="sort-icon-all sort-icon-down iconfont icon-yd-icon-upload2"></i>

              <i @click="sortPrivilege(3,'up',scope.$index)" v-show="scope.$index!=0" title="置顶" class="sort-icon-all el-icon-upload2 sort-icon"></i>
              <i @click="sortPrivilege(4,'down',scope.$index)" v-show="scope.$index!=tableData.length-1" title="置底" class="sort-icon-all el-icon-download sort-icon"></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="privilegeName"
            label="特权名称">
            <template slot-scope="scope">{{scope.row.privilegeName}}</template>
          </el-table-column>
          <el-table-column
            prop="onQcloudImageUrl"
            label="图标"
            width="180">
            <template slot-scope="scope">
              <div class="img">
                <img :src="scope.row.onQcloudImageUrl" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="gradeNames"
            label="激活等级">
          </el-table-column>
          <el-table-column
            prop="ope"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="editPrivilege(scope.row.privilegeId)" type="text">编辑</el-button>
              <delete-tip @confirm="handleDelete(scope.$index,scope.row.privilegeId)" tips="确定删除该会员特权吗?">
                <el-button type="text">删除</el-button>
              </delete-tip>
              <!-- <el-button @click="handleDelete(scope.$index,scope.row.privilegeId)" type="text">删除</el-button> -->
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="no-data-wrap">
              <div class="no-data-icon" >
                <img src="../../../../static/img/no-data_icon.png" alt="">
              </div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
        <!-- <div class="pagination" v-show="totalCount>0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div> -->
      </div>
  	</div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "member_privilege",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '会员管理',
            path: ''
          },
          {
            name: '会员体系',
            path: ''
          },
          {
            name: '会员特权',
            path: ''
          }
        ],
        tableData: [],
        currentPage:1,
        pageSize:20,
        totalCount:0,
        loading:false,
        fieldIdPrev:'',
        sortNumPrev:'',
        fieldIdNext:'',
        sortNumNext:''
    	}
    },
    mounted(){
      this.getPrivilegeData(this.currentPage,this.pageSize);
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods:{
      getPrivilegeData(page,size){   // 获取特权的列表
        this.loading = true;
        this.axios.post('/api-admin/privilege-service-list',qs.stringify({
          requestProject:'gic-web',
          currentPage:page,
          pageSize:size
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode == 0){
            this.loading = false;
            this.tableData = data.result.result;
            this.totalCount = data.result.totalCount;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      sortPrivilege(type,flag,index){  // 排序
        this.loading = true;
        if(type==1){ 
          this.fieldIdPrev=this.tableData[index-1].privilegeId,
          this.sortNumPrev=this.tableData[index-1].sortNum,
          this.fieldIdNext=this.tableData[index].privilegeId,
          this.sortNumNext=this.tableData[index].sortNum
        }else if(type==2){ 
          this.fieldIdPrev=this.tableData[index].privilegeId,
          this.sortNumPrev=this.tableData[index].sortNum,
          this.fieldIdNext=this.tableData[index+1].privilegeId,
          this.sortNumNext=this.tableData[index+1].sortNum
        }else if(type==3){ 
          this.fieldIdPrev=this.tableData[0].privilegeId,
          this.sortNumPrev=this.tableData[0].sortNum-1,
          this.fieldIdNext=this.tableData[index].privilegeId,
          this.sortNumNext=this.tableData[0].sortNum
        }else if(type==4){ 
          this.fieldIdPrev=this.tableData[index].privilegeId,
          this.sortNumPrev=this.tableData[this.tableData.length-1].sortNum,
          this.fieldIdNext=this.tableData[this.tableData.length-1].privilegeId,
          this.sortNumNext=this.tableData[this.tableData.length-1].sortNum+1;
        }
        this.axios.post('/api-admin/privilege-service-sort',qs.stringify({
          requestProject:'gic-web',
          flag:flag,
          fieldIdPrev:this.fieldIdPrev,
          sortNumPrev:this.sortNumPrev,
          fieldIdNext:this.fieldIdNext,
          sortNumNext:this.sortNumNext
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.loading = false;
            this.getPrivilegeData(this.currentPage,this.pageSize);
            this.$message.success('排序成功')
          }else{
            this.$message.error(data.message)
          }
        })
      },
      handleSizeChange(val){     // 选择分页符
        this.pageSize = val;
        this.getPrivilegeData(this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getPrivilegeData(this.currentPage,this.pageSize)
      },
      handleDelete(index, id) {     // 删除特权
        // console.log(id);
        this.loading = true;
        this.axios.post('/api-admin/privilege-del',qs.stringify({
          requestProject:'gic-web',
          privilegeId:id
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode == 0){
            this.loading = false;
            this.tableData.splice(index,1);
            this.$message.success('删除成功')
          }else{
            this.$message.error(data.message)
          }
        })
      },
      addPrivilege(){   // 新增
        this.$router.push('member_privilege_edit')
      },
      editPrivilege(id){    // 编辑
        this.$router.push({
          path:'/member_privilege_edit',
          query:{
            privilegeId:id
          }
        })
      }
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
    background: #fff;
    padding: 24px;
    .add-new-btn{
      text-align: right;
      margin-bottom: 22px;
    }
    .sort-icon-all{
      font-size: 16px;
      color: #606266;
      display: inline-block;
      cursor: pointer;
    }
    .sort-icon-down{
      transform: rotate(180deg);
    }
  }
  .img{
    width: 40px;
    height: 40px;
    border:1px solid #ebeef5;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .pagination{
    text-align: right;
    margin-top: 20px;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
