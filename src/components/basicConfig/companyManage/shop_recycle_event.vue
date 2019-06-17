<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box" >
        <div class="two-btn">
          <el-button @click="deleteActive('more')" type="primary">批量删除</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          class="table-no-line-wrap"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="activityStartTime"
            label="活动时间">
            <template slot-scope="scope">
              <span>{{scope.row.activityStartTime | dateFormat('YYYY-MM-DD')}}</span>
              至
              <span>{{scope.row.activityEndTime | dateFormat('YYYY-MM-DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="activityName"
            label="活动名称">
          </el-table-column>
          <el-table-column
            prop=""
            label="活动进度">
            <template slot-scope="scope">
              <span v-if="nowTime<scope.row.activityStartTime">未开始</span>
              <span v-if="nowTime>scope.row.activityStartTime && nowTime<scope.row.activityEndTime">已开始</span>
              <span v-if="nowTime>scope.row.activityEndTime">已结束</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="opr"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button @click="editEvent(scope.row)" type="text">编辑</el-button>
              <delete-tip @confirm="deleteActive('only',scope.row,scope.$index)" tips="您确定要删除该门店活动吗?">
                <el-button type="text">删除</el-button>
              </delete-tip>

              <!-- <el-button @click="deleteActive('only',scope.row,scope.$index)" type="text">删除</el-button> -->
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
  import { dateFormat } from '../../../common/js/filter'
  let qs = require('qs')
  export default {
    name: "shop_recycle_event",
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
            name: '待处理事务',
            path: ''
          }
        ],
        tableData: [],
        multipleSelection: [],
        currentPage:1,    //  分页
        pageSize:20,
        totalCount:0,
        loading:false,
        storeId:'',

        flag:''
      }
    },
    computed:{
      nowTime () { // 当前时间的时间戳
        return new Date().getTime()
      }
    },
    created(){
      this.getRecycleList();
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods: {
      getRecycleList(){   // 获得回收站的列表
        this.storeId = this.$route.query.storeId;
        this.axios.post('/api-admin/store-activities',qs.stringify({
          requestProject:'gic-web',
          storeId:this.storeId,
          currentPage:this.currentPage,
          pageSize:this.pageSize
        })).then((res)=>{
          var data = res.data;
          console.log(data);
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
        this.pageSize = val;
        this.getRecycleList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getRecycleList();
      },
      handleSelectionChange(val) {    // 多选选中的值
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      deleteActive(type,row,index){ // 删除活动
        var activityIds = '';
        var deleteBool = false;
        if(type=='only'){ // 单个删除
          activityIds = row.activityId;
          deleteBool = true;
        }else if(type=='more'){ // 批量删除
          if(this.multipleSelection.length<1){
            this.$message({
              type: 'error',
              message: '请选择要删除的活动'
            });
            return;
          }else{
            var id = '';
            this.multipleSelection.forEach((row)=>{
              id += row.activityId + ',';
            })
            activityIds = id.substring(0,id.length-1);
            // console.log(activityIds);
            deleteBool = true;
          }
        }
        if(deleteBool){
          this.axios.post('/api-admin/store-delActivities',qs.stringify({
            requestProject:'gic-web',
            storeId:this.storeId,
            activityIds:activityIds
          })).then((res)=>{
            var data = res.data;
            // console.log(data);
            if(data.errorCode==0){
              if(type=='only'){
                this.tableData.splice(index,1);
                this.totalCount--;
              }else if(type=='more'){
                this.getRecycleList();
              }
            }else{
              this.$message({
                type: 'error',
                message: data.message
              });
            }
          })
        }
      },
      editEvent(row){
        var nowTime = new Date().getTime(); 
        if(nowTime > row.activityEndTime){
          this.flag = 'edit'
        }else{
          this.flag = ''
        }
        this.$router.push({
          path:'/shop_active_edit2',
          query:{
            storeId:this.storeId,
            activityId:row.activityId,
            type:'recycle',
            flag:this.flag
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
  .pagination{
    text-align: right;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
