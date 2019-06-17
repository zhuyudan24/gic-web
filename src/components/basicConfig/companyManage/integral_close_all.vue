<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
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
            <el-input @keyup.native.enter="getData(currentPage,pageSize)" clearable class="search-input" prefix-icon="el-icon-search" v-model="searchValue" placeholder="输入结算归属"></el-input>
            <el-button @click="downloadExcel" type='primary'>导出数据</el-button>
          </div>
        </div>
        <div class="table-wrap">
          <ul class="table-header-wrap">
            <li>结算归属</li>
            <li>积分结算总额</li>
            <li>积分结算成本金额</li>
          </ul>
          <ul v-show="totalCount>0" class="table-header-total">
            <li>汇总</li>
            <li>{{number1==null?'--':number1}}</li>
            <li>{{number2==null?'--':number2}}</li>
          </ul>
          <el-table
            :data="tableData"
            id="tableId"
            class="table-no-line-wrap"
            :show-header="false"
            v-loading="loading"
            style="width: 100%">
            <el-table-column
              prop="settlementGroupName"
              label="结算归属">
            </el-table-column>
            <el-table-column
              prop="integralSettlementValue"
              label="积分结算总额">
            </el-table-column>
            <el-table-column
              prop="integralCostValue"
              label="积分结算成本金额">
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
        </div>
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
    <!-- 导出数据 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
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
  import topNav from 'components/nav/nav'
  import excelConfig from '../../../common/js/excel_config.js'
  let qs = require('qs')
  export default {
    name: "integral_close_all",
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
            name: '积分结算汇总',
            path: ''
          }
        ],
        dateValue: '',
        searchValue: '',
        dateArr:[],
        dateArrNum:[],
        tableData: [],
        currentPage:1,
        pageSize:20,
        totalCount:0,
        month:'',
        loading:false,
        number1:'',
        number2:'',
        // 导出数据
        dialogVisible:false,
        excelUrl:'/api-report/integral-account-summary-data-excel',
        params:{},
        contactDialog:false,
      }
    },
    mounted(){
      this.getContact();
      // this.getMonthData();  // 获得月份
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
      getMonthData(){   // 获得月份
        this.axios.get('/api-report/month-list',{
          params: {
            requestProject:'gic-web'
          }
        }).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            this.dateArr = data.result;
            this.dateValue = this.dateArr[0];
            data.result.forEach((item)=>{
              var arr = item.match(/\d+/g);
              var date = arr[0] + '-' + arr[1];
              this.dateArrNum.push(date)
            })
            this.month = this.dateArrNum[0];
            this.getData(this.currentPage,this.pageSize)
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      getData(page,size){   // 获得数据
        this.loading = true;
        this.axios.post('/api-report/integral-account-summary-data',qs.stringify({
          requestProject:'gic-web',
          month:this.month,
          searchParams:this.searchValue,
          currentPage:page,
          pageSize:size
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            this.loading=false;
            if(data.result!=null){
              this.tableData = data.result.page.result?data.result.page.result:[];
              this.totalCount = data.result.page.totalCount;
              this.number1 = data.result.totalCountValue.integralSettlementValueSum;
              this.number2 = data.result.totalCountValue.integralCostValueSum;
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
        this.getData(this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData(this.currentPage,this.pageSize)
      },
      getSelectMonth(val){
        // console.log(val);
        var selectDate = val.match(/\d+/g);
        this.month = selectDate[0] +'-'+ selectDate[1];
        this.currentPage = 1;
        this.getData(this.currentPage,this.pageSize)
      },
      downloadExcel(){  // 导出数据
        this.dialogVisible = true;
        this.params = {
          requestProject:this.projectName,
          month:this.month,
          searchParams:this.searchValue
        };

        // this.axios.post('/api-report/integral-account-summary-data-excel',qs.stringify({
        //   requestProject:'gic-web',
        //   month:this.month,
        //   searchParams:this.searchValue
        // })).then(res=>{
        //   var data = res.data;
        //   console.log(res);
        //   window.location.href = excelConfig.config + '/api-report/integral-account-summary-data-excel?requestProject=gic-web&month='+this.month+'&searchParams='+this.searchValue         
        // })
      }
    },
    components: {
      topNav
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
    ul{
      width: 100%;
      display: flex;
      border-bottom: 1px solid #ebeef5;
      height: 44px;
      line-height: 44px;
      box-sizing: border-box;
    }
    li{
      flex: 1;
      padding: 0 10px;
      word-wrap: normal;
      text-overflow: ellipsis;
      vertical-align: middle;
      font-size: 14px;
    }
    .table-header-wrap{
      background: #f1f3f7;
      li{
        color: #909399;
      }
    }
    .table-header-total{
      color: #1890ff;
    }
  }
  .pagination{
    text-align: right;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
  .el-message-box__wrapper{
    left: 200px;
    top: 64px;
    background: rgba(0, 0, 0, .5);
    z-index: 11;
  }
</style>
