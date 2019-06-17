<template>
  <div class="right-wrap">
    <navbar :activeitem="activeitem" :navpath="navpath" :navtab="navtab" @getCurTab="getCurTab"></navbar>
    <div class="right-content">
      <div class="right-box">
        <div class="box-top-wrap clearfix">
          <div class="box-left fl">
            <el-select @change="getSelectMonth" v-model="dateValue" placeholder="请选择">
              <el-option
                v-for="(item,index) in dateArr"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="box-right fr">
            <el-input @keyup.native.enter="handleClick" class="search-input" prefix-icon="el-icon-search" v-model="searchValue" placeholder="输入门店主体"></el-input>
            <el-button @click="downloadExcel" type='primary'>导出数据</el-button>
          </div>
        </div>
        <!-- 卡券兑换补贴 -->
        <div v-show="activeitem==2" class="table-wrap">
          <el-table
            :data="tableDataFirst"
            v-loading="loading"
            class="table-no-line-wrap"
            style="width: 100%">
            <el-table-column
              prop="all"
              label="核销/兑换时间"
              width="160">
              <template slot-scope="scope">
                <div v-if="scope.row.hxsj">
                  <p>{{scope.row.hxsj | dateFormat('YYYY-MM-DD')}}</p>
                  <p>{{scope.row.hxsj | dateFormat('hh:mm:ss')}}</p>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="produce"
              label="领取时间"
              width="160">
              <template slot-scope="scope">
                <div v-if="scope.row.lqsj">
                  <p>{{ scope.row.lqsj | dateFormat('YYYY-MM-DD') }}</p>
                  <p>{{ scope.row.lqsj | dateFormat('hh:mm:ss') }}</p>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="close"
              label="会员信息">
              <template slot-scope="scope">
                <div class="info-wrap">
                  <div class="img">
                    <img :src="scope.row.thirdImgUrl?scope.row.thirdImgUrl:defaultImg" alt="">
                  </div>
                  <div class="info">
                    <p class="member-name">{{scope.row.memberName?scope.row.memberName:'--'}}</p>
                    <p>{{scope.row.hykh?scope.row.hykh:'--'}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="mc"
              label="卡券礼品名称">
              <template slot-scope="scope">
                <p class="card-name">{{scope.row.mc}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="xjfy"
              label="现金费用"
              width="100">
            </el-table-column>
            <el-table-column
              prop="jffy"
              label="积分费用"
              width="100">
            </el-table-column>
            <el-table-column
              prop="cbfy"
              label="成本费用"
              width="100">
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              width="100">
              <template slot-scope="scope">
                <p v-show="scope.row.zt=='1'">取消兑换（实物）</p>
                <p v-show="scope.row.zt=='2'">已发货（实物）</p>
                <p v-show="scope.row.zt=='3'">待发货（实物）</p>
                <p v-show="scope.row.zt=='4'">待核销</p>
                <p v-show="scope.row.zt=='5'">已核销</p>
                <p v-show="scope.row.zt=='6'">已过期</p>
                <p v-show="scope.row.zt=='7'">已销毁</p>
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
        <!-- 微商城积分抵现 -->
        <div v-show="activeitem==3" class="table-wrap">
          <el-table
            class="table-no-line-wrap"
            :data="tableDataSecond"
            v-loading="loading"
            style="width: 100%">
            <el-table-column
              prop="ddshsj"
              label="订单收货时间">
              <template slot-scope="scope">
                <p>{{ scope.row.ddshsj | dateFormat('YYYY-MM-DD') }}</p>
                <p>{{ scope.row.ddshsj | dateFormat('hh:mm:ss') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="produce"
              label="付款时间">
              <template slot-scope="scope">{{ scope.row.fksj | dateFormat('YYYY-MM-DD') }}</template>
            </el-table-column>
            <el-table-column
              prop="close"
              label="会员信息">
              <template slot-scope="scope">
                <div class="info-wrap">
                  <div class="img">
                    <img :src="scope.row.thirdImgUrl" alt="">
                  </div>
                  <div class="info">
                    <p class="member-name">{{scope.row.memberName}}</p>
                    <p>{{scope.row.hykh}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="积分抵现名称">
              <template slot-scope="scope">{{ scope.row.mc }}积分抵现{{ scope.row.dxje }}元</template>
            </el-table-column>
            <el-table-column
              prop="mc"
              label="抵现积分"
              width="100">
            </el-table-column>
            <el-table-column
              prop="dxje"
              label="抵现金额"
              width="100">
            </el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              width="150">
              <template slot-scope="scope">
                <p v-show="scope.row.ddzt=='0'">交易关闭</p>
                <p v-show="scope.row.ddzt=='1'">未付款</p>
                <p v-show="scope.row.ddzt=='2'">已付款未发货</p>
                <p v-show="scope.row.ddzt=='3'">已发货未签收</p>
                <p v-show="scope.row.ddzt=='4'">已确认交易结束</p>
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
          <div class="pagination" v-show="totalCount1>0">
            <el-pagination
              background
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next"
              :total="totalCount1">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 导出数据 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="2" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
     <!-- 是否关联集团 -->
    <div class="el-message-box__wrapper" v-show="contactDialog">
      <div class="el-message-box el-message-box--center">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><div class="el-message-box__status el-icon-warning"></div><span>提示</span></div>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__message"><p>已关联集团，请至集团后台-积分结算模块编辑查看</p></div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import navbar from 'components/navbar/navbartwo'
  import excelConfig from '../../../common/js/excel_config.js'
  import { dateFormat } from '../../../common/js/filter'
  import excelDownload from 'components/com/excelDownload'
  let qs = require('qs')
  export default {
    name: "integral_help_dtl",
    data(){
    	return {
        projectName:'gic-web',
        navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '积分结算',
            path: ''
          },
          {
            name: '积分明细表',
            path: ''
          },
          {
            name: '积分补贴明细',
            path: ''
          }
        ],
        navtab: [
          {
            name: '卡券兑换补贴',
            tab: 2
          },
          {
            name: '微商城积分抵现',
            tab: 3
          }
        ],
        activeitem: 2,
        dateValue: '',
        searchValue: '',
        tableData:[],
        tableDataFirst: [],
        tableDataSecond: [],
        currentPage:1,
        pageSize:20,
        totalCount:0,
        totalCount1:0,
        dateValue: '',
        searchValue: '',
        dateArr:[],
        dateArrNum:[],
        month:'',
        loading:false,
        defaultImg:require('../../../../static/img/head_default.jpg'),
        // 导出数据
        dialogVisible:false,
        excelUrl:'/api-report/integral-subsidy-detail-data-excel',
        params:{},
        contactDialog:false,
      }
    },
    mounted(){
      this.getContact();
      // this.getMonthData();  // 获得月
    },
    methods:{
      // 是否关联集团
      getContact(){   
        this.axios.post('/api-auth/is-relevance-clique',qs.stringify({
          requestProject:this.projectName
        })).then((res) => {
          let resData = res.data
          if (resData.errorCode == 0) {
            this.contactDialog = resData.result;
            if(!this.contactDialog){
              this.getMonthData();  // 获得月份
            }
          }else{
            this.$message.error(resData.message)
          }
        })
      },
      getCurTab(val){ // 分组与分区的切换
        this.activeitem = val;
      },
      getMonthData(){   // 获得月份
        this.axios.get('/api-report/month-list',{
          params: {
            requestProject:'gic-web'
          }
        }).then(res=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.dateArr = data.result;
            this.dateValue = this.dateArr[0];
            data.result.forEach((item)=>{
              var arr = item.match(/\d+/g);
              var date = arr[0] + '-' + arr[1];
              this.dateArrNum.push(date)
            })
            this.month = this.dateArrNum[0];
            this.getData(this.currentPage,this.pageSize,1)
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      getSelectMonth(val){    // 选择月份
        // console.log(val);
        var selectDate = val.match(/\d+/g);
        this.month = selectDate[0] +'-'+ selectDate[1];
        this.handleClick()
      },
      handleClick(){    // 切换标签
        if(this.activeitem == "2"){
          this.currentPage = 1;
          this.getData(this.currentPage,this.pageSize,1)
        } else if(this.activeitem == "3") {
          this.currentPage = 1;
          this.getData(this.currentPage,this.pageSize,2)
        }
      },
      getData(page,size,type){
        this.loading = true;
        this.axios.post('/api-report/integral-subsidy-detail-data',qs.stringify({
          requestProject:'gic-web',
          month:this.month,
          searchParams:this.searchValue,
          currentPage:page,
          pageSize:size,
          integralSubsidyType:type
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            this.loading=false;
            if(type==1){
              this.tableDataFirst = data.result.result?data.result.result:[];
              this.totalCount = data.result.totalCount;
              this.tableData = this.tableDataFirst
            } else if(type==2){
              this.tableDataSecond = data.result.result?data.result.result:[];
              this.totalCount1 = data.result.totalCount;
              this.tableData = this.tableDataFirst
            }
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
        this.getData(this.currentPage,this.pageSize,1)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData(this.currentPage,this.pageSize,1)
      },
      handleSizeChange1(val){    // 选择分页符
        this.pageSize = val;
        this.getData(this.currentPage,this.pageSize,2)
      },
      handleCurrentChange1(val) {
        this.currentPage = val;
        this.getData(this.currentPage,this.pageSize,2)
      },
      downloadExcel(){
        if(this.activeitem == "2"){
          var type = 1;
        } else if(this.activeitem == "3") {
          var type = 2;
        }
        this.dialogVisible = true;
        this.params = {
          requestProject:this.projectName,
          month:this.month,
          searchParams:this.searchValue,
          integralSubsidyType:type
        };

        // this.axios.post('/api-report/integral-subsidy-detail-data-excel',qs.stringify({
          // requestProject:'gic-web',
          // month:this.month,
          // searchParams:this.searchValue,
          // integralSubsidyType:type
        // })).then(res=>{
        //   window.location.href = excelConfig.config + '/api-report/integral-subsidy-detail-data-excel?requestProject=gic-web&month='+this.month+'&searchParams='+this.searchValue+'&integralSubsidyType='+type
        // })
      }
    },
    components: {
      navbar,
      excelDownload
    }
  }
</script>

<style lang="less" scoped>
  .box-right{
    font-size: 0;
    .search-input{
      width: 220px;
      margin-right: 8px;
      vertical-align: sub;
    }
  }
  .table-wrap{
    margin-top: 22px;
    .info-wrap{
      position: relative;
      .img{
        position: absolute;
        width: 60px;
        height: 60px;
        img{
          width: 100%;
          height: 100%;
          border-radius:4px;
        }
      }
      .info{
        padding-left: 70px;
        .member-name{
          max-width: 100%;
          height: 40px;
          line-height: 20px;
          display: -webkit-box !important;
          overflow: hidden;
          text-overflow:ellipsis;
          word-break:break-all;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
        }
        p{
          line-height: 20px;
        }
      }
    }
    .card-name{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .pagination{
    text-align: right;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
  /* 降层级 */
  .box-wrap /deep/ .el-tabs__nav{
    z-index: 1
  }

  .right-wrap .right-content{
    min-height: calc(100% - 240px);
  }
  .el-message-box__wrapper{
    left: 200px;
    top: 64px;
    background: rgba(0, 0, 0, .5);
    z-index: 11;
  }
</style>