<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box" >
        <div class="two-btn">
          <el-row>
            <el-button @click="moveClerk('more')" type="primary">批量转移</el-button>
            <el-button @click="moveClerk('all')" type="primary">全部转移</el-button>
          </el-row>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop=""
            label="姓名">
            <template slot-scope="scope">
              <div class="member-info-wrap clearfix">
                <div class="fl img">
                  <img :src="scope.row.imageUrl?scope.row.imageUrl:defaultImg" alt="">
                </div>
                <div class="fl">
                  <p>{{scope.row.clerkName}}</p>
                  <p>{{scope.row.positionName}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="手机号码">
            <template slot-scope="scope">
              {{scope.row.phoneNumber?scope.row.phoneNumber:'--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="opr"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="moveClerk('only',scope.row)" type="text">转移</el-button>
              <delete-tip @confirm="deleteClerk(scope.row,scope.$index)" tips="确认删除该成员吗?">
                <el-button type="text">删除</el-button>
              </delete-tip>
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
        <div class="pagination" v-show="totalCount>0">
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
        </div>
      </div>   
    </div>
    <!-- 批量转移成员 -->
    <vue-gic-store :showStoreDialog="showStoreDialog" @selectStore="selectStore"></vue-gic-store>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "shop_recycle_clerk",
    data(){
      return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '企业资料',
            path: ''
          },
          {
            name: '门店管理',
            path: ''
          },
          {
            name: '门店列表',
            path: '/shop_list'
          },
          {
            name: '门店回收站',
            path: '/shop_list_recycle'
          },
          {
            name: '待处理店员',
            path: ''
          }
        ],
        tableData: [],
        multipleSelection: [],
        currentPage:1,    //  分页
        pageSize:20,
        totalCount:0,
        storeId:'',
        defaultImg:require('../../../../static/img/head_default.jpg'),
        loading:false,

        showStoreDialog:false,  // 批量转移会员
        clerkIds:'',  // 批量
        clerkId:'', //  单个
        moveStoreId:'', // 转移到的门店id
        moveType:'',  // 转移的类型 批量、全部、单个
      }
    },
    created(){
      this.getClerkList();
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods: {
      getClerkList(){   // 获得待处理店员的列表
        this.storeId = this.$route.query.storeId;
        this.loading = true;
        this.axios.post('/api-admin/list-clerk-store',qs.stringify({
          requestProject:'gic-web',
          storeId:this.storeId,
          currentPage:this.currentPage,
          pageSize:this.pageSize
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.loading = false;
            this.tableData = data.result.result;
            this.totalCount = data.result.totalCount;
          }
        })
      },
      handleSelectionChange(val) {    // 多选选中的值
        this.multipleSelection = val;
      },
      handleSizeChange(val){    // 选择分页符
        this.pageSize = val;
        this.getClerkList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getClerkList()
      },
      moveClerk(type,row){  // 批量、全部 转移会员
        // console.log(this.multipleSelection);
        if(type=='more'){  // 批量
          if(this.multipleSelection.length<1){
            this.$message.error('请先选择要转移的店员');
            return;
          }else{
            this.showStoreDialog = true;
            var clerkId = '';
            this.multipleSelection.forEach((item)=>{
              clerkId += item.clerkId + ',';  // 获得选中门店的id
            })
            this.clerkIds = clerkId.substring(0,clerkId.length-1);
          }
        }else if(type=='all'){  //  全部
          this.clerkIds = 'all';
          this.showStoreDialog = true;
        }else if(type=='only'){  //  单个转移
          this.clerkId = row.clerkId;
          this.showStoreDialog = true;
        }
        this.moveType = type;
      },
      selectStore(val) {    // 批量转移会员  选择门店  子组件触发方法
        // console.log(val);
        this.showStoreDialog = false;
        if(this.moveType == 'only'){  
          if(val.storeId){
            this.axios.post('/api-admin/transfer-clerk-store',qs.stringify({
              requestProject:'gic-web',
              clerkId:this.clerkId,
              storeId:val.storeId
            })).then(res=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode == 0){
                this.getClerkList();
                this.$message({
                  type:'success',
                  message:'转移成功'
                })
              }else if(data.errorCode == '110021'){
                this.$message(data.message);
              }else{
                this.$message({
                  type: 'error',
                  message: data.message
                });
              }
            })
          }
        }else{
          this.moveStoreId = val.storeId;
          if(val.storeId){
            this.axios.post('/api-admin/transfer-clerks',qs.stringify({
              requestProject:'gic-web',
              clerkIds:this.clerkIds,
              storeId:this.storeId,
              toStoreId:val.storeId
            })).then(res=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode == 0){
                this.getClerkList();
                this.$message({
                  type:'success',
                  message:'转移成功'
                })
              }else if(data.errorCode == '110021'){
                this.$message(data.message);
              }else{
                this.$message({
                  type: 'error',
                  message: data.message
                });
              }
            })
          }
        }
      },
      deleteClerk(row,index){ // 删除成员
        this.axios.post('/api-admin/delete-clerk',qs.stringify({
          requestProject:'gic-web',
          clerkId:row.clerkId,
          editFrom:'recycle'
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.totalCount--;
            this.tableData.splice(index, 1);
            this.$message.success('删除成功');
          }else{
            this.$message.error(data.message)
          }
        })
      }
    },
    components: {
      topNav
    }       
  }
</script>

<style lang="less" scoped>
  .right-box{
    .two-btn{
      margin-bottom: 22px;
      text-align: right;
    }
  }
  .member-info-wrap{
    .img{
      width: 60px;
      height: 60px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    p{
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      width: 100px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .pagination{
    text-align: right;
  }
</style>
