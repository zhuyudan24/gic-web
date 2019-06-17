<template>
	<div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="search">
          <el-input clearable @keydown.enter.native="searchStore" class="input-search" placeholder="请输入门店名称/code" prefix-icon="el-icon-search" v-model="search"></el-input>
        </div>
        <el-table
          class="table-no-line-wrap"
          :data="tableData"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="storeName"
            label="门店名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="memberCount"
            label="待处理微信会员">
            <template slot-scope="scope">
              <p @click="dealWxMember(scope.row)" v-if="scope.row.memberCount>0" class="link-flag">{{scope.row.memberCount}}</p>
              <p v-else>0</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="posCount"
            label="待处理POS会员">
            <template slot-scope="scope">
              <p @click="dealPosMember(scope.row)" v-if="scope.row.posCount>0" class="link-flag">{{scope.row.posCount}}</p>
              <p v-else>0</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="clerkCount"
            label="待处理店员">
            <template slot-scope="scope">
              <p @click="dealClerk(scope.row)" v-if="scope.row.clerkCount>0" class="link-flag">{{scope.row.clerkCount}}</p>
              <p v-else>0</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="actCount"
            label="待处理事务">
            <template slot-scope="scope">
              <p @click="dealEvent(scope.row)" v-if="scope.row.actCount>0" class="link-flag">{{scope.row.actCount}}</p>
              <p v-else>0</p>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="state"
            label="状态">
            <template slot-scope="scope">
              <p v-if="scope.row.memberCount==0&&scope.row.clerkCount==0&&scope.row.actCount==0">可删除</p>
              <p v-else>不可删</p>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="opr"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="rebackStatus(scope.row)">恢复</el-button>
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
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import excelConfig from '../../../common/js/excel_config.js'
	let qs = require('qs')
  export default {
    name: "shop_list_add",
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
            path: ''
          }
        ],
        tableData: [],
        linkFlagBool:false, // 是否显示跳转的标识
        loading:false,
        totalCount:0,
        currentPage:1,    //  分页
        pageSize:20,
        storeName:'门店名称',
        storeId:'',
        search:'',
    	}
    },
    created(){
      this.getUrlData();
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods: {
      getUrlData(){
        this.search = this.$route.query.storeCode;
        this.getRecycleList();
      },
      getRecycleList(){   // 获得回收站的列表
        this.loading = true;
        this.axios.post('/api-admin/recycle-stores',qs.stringify({
          requestProject:'gic-web',
          search:this.search,
          currentPage:this.currentPage,
          pageSize:this.pageSize
        })).then((res)=>{
          var data = res.data;
          this.loading = false;
          // console.log(data);
          if(data.errorCode==0){
            this.tableData = data.result.result;
            this.totalCount = data.result.totalCount;
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      handleSizeChange(val){    // 选择分页符
        this.currentPage=1;
        this.pageSize = val;
        this.getRecycleList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getRecycleList();
      },
      deleteStore(row,index){   // 删除门店
        this.axios.post('/api-admin/store-delnow',qs.stringify({
          requestProject:'gic-web',
          storeId:row.storeId
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.tableData.splice(index,1);
            this.totalCount--;
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      },
      rebackStatus(row){  // 恢复状态
        // console.log(row);
        if(row.actCount == 0 && row.clerkCount == 0 && row.memberCount == 0 && row.posCount == 0){
          this.storeName = row.storeName;
          this.storeId = row.storeId;
          var html = '是否将【' + this.storeName + '】门店，从回收站恢复至【待上线】门店？'
          this.$confirm(html, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString:true,
            type: 'warning'
          }).then(() => {
            this.sureRecycle();
          }).catch(() => {

          });
        }else{
          this.$confirm('该门店有待处理任务，请先处理待处理任务。', '提示', {
            confirmButtonText: '知道了',
            // cancelButtonText: '取消',
            showCancelButton:false,
            type: 'warning'
          }).then(() => {
            
          }).catch(() => {

          });
        }
      },
      sureRecycle(id){ // 确定恢复
        this.axios.post('/api-admin/update-store-status',qs.stringify({
          requestProject:'gic-web',
          storeIds:this.storeId,
          status:7
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            this.getRecycleList()
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      searchStore(){
        this.currentPage = 1;
        this.pageSize = 20;
        this.getRecycleList();
      },
      dealWxMember(row){ // 处理会员
        window.open( excelConfig.config + '/member/#/memberReturn?peoplevisible=gicWeb&storeId='+row.storeId,"_blank")
      },
      dealPosMember(row){ // 处理pos会员
        window.open( excelConfig.config + '/member/#/posRecycle?peoplevisible=gicWeb&storeId='+row.storeId,"_blank")
      },
      dealClerk(row){  // 处理店员
        this.$router.push({
          path:'/shop_recycle_clerk',
          query:{
            storeId:row.storeId
          }
        })
      },
      dealEvent(row){  // 处理事务
        this.$router.push({
          path:'/shop_recycle_event',
          query:{
            storeId:row.storeId
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
    .search{
      width: 240px;
      margin-bottom: 22px;
    }
    .link-flag{
      color: #1890ff;
      cursor: pointer;
    }
  }
  .pagination{
    text-align: right;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }

  
</style>
