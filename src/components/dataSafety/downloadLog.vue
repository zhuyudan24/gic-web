<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="search-wrap">
          <el-date-picker @change="selectDate" class="date-picker" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-select @change="selectType" class="data-type" v-model="dataType" placeholder="请选择">
            <el-option
              v-for="item in dataTypeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
          <el-input
            @keyup.native.enter="selectType"
            class="search-input"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchInput">
            <el-select slot="prepend" class="search-select" v-model="searchType" placeholder="请选择">
              <el-option
                v-for="item in searchOptions"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </el-input>
        </div>
        <el-table
          :data="tableData"
          class="table-no-line-wrap"
          style="width: 100%">
          <el-table-column
            prop="reportId"
            label="报告ID">
          </el-table-column>
          <el-table-column
            prop="date"
            label="下载时间">
            <template slot-scope="scope">
              <p>{{scope.row.downloadTime | dateFormat('YYYY-MM-DD')}}</p>
              <p>{{scope.row.downloadTime | dateFormat('hh:mm:ss')}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="downloadPersonName"
            label="下载人员">
          </el-table-column>
          <el-table-column
            prop="reportName"
            label="文件名称">
            <template slot-scope="scope">
              <p class="report-name-wrap">{{ scope.row.reportName?scope.row.reportName:'--' }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="rangeDate"
            label="时间范围">
            <template slot-scope="scope">
              <div v-if="scope.row.reportStartTime && scope.row.reportEndTime">
                <p>{{scope.row.reportStartTime | dateFormat('YYYY-MM-DD')}}至</p>
              <p>{{scope.row.reportEndTime | dateFormat('YYYY-MM-DD')}}</p>
              </div>
              <div v-else>历史累计数据</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="报告类型">
            <template slot-scope="scope">
              <p>{{ scope.row.reportDataType==1?'脱敏数据':'完整数据'}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportCount"
            label="数据总量">
          </el-table-column>
          <el-table-column
            prop="reportContent"
            label="数据内容">
          </el-table-column>
          <template slot="empty">
            <div class="no-data-wrap">
              <div class="no-data-icon" >
                <img src="../../../static/img/no-data_icon.png" alt="">
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
import { dateFormat } from '../../common/js/filter'
let qs = require('qs')
export default {
  name: "downloadLog", 
  data() {
    return {
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      navpath: [
        {
          name: '企业管理',
          path: ''
        },
        {
          name: '日志管理',
          path: ''
        },
        {
          name: '下载日志',
          path: ''
        }
      ],
      dateValue:[],
      startTimeStr:'',
      endTimeStr:'',
      timeDefaultShow:'',    // 默认日期
      dataTypeOptions:[ // 数据类型
        {
          type: '',
          name:'所有类型'
        },{
          type: '1',
          name:'脱敏数据'
        },{
          type: '2',
          name:'完整数据'
        }
      ],
      dataType:'',
      searchOptions:[
        {
          type: 'report_id',
          name:'报告ID'
        },{
          type: 'download_person_name',
          name:'下载人员'
        },{
          type: 'report_name',
          name:'文件名称'
        },{
          type: 'report_content',
          name:'数据内容'
        }
      ],
      searchType:'report_id',
      searchInput:'',
      tableData: [],
      currentPage:1,	// 分页符的当前页
      pageSize:20,
      totalCount:0,
      loading:false,
    }
  },
  created(){
    this.timeDefaultShow = new Date();
    this.timeDefaultShow.setMonth(new Date().getMonth() - 1);  // 设置日期
    this.getUrlData()
  },
  methods: {
    getUrlData(){
      var reportId = this.$route.query.reportId;
      if(reportId){
        this.searchInput = reportId;
        this.searchType = 'report_id';
      }
      this.getLogList();	// 获取日志列表
    },
    getLogList(){
      this.loading = true;
      this.axios.post('/api-admin/page-download-log',qs.stringify({
        requestProject:'gic-web',
        downloadStartTime:this.startTimeStr,
        downloadEndTime:this.endTimeStr,
        searchColumn:this.searchType,
        searchValue:this.searchInput,
        reportDataType:this.dataType,
        currentPage:this.currentPage,
        pageSize:this.pageSize
      })).then((res)=>{
        var data = res.data;
        this.loading = false;
        if(data.errorCode==0){
          if(this.dateValue.length<1){
            this.startTimeStr = data.result.params.downloadStartTime;
            this.endTimeStr = data.result.params.downloadEndTime;
            this.dateValue.push(this.startTimeStr,this.endTimeStr);
          }
          this.tableData = data.result.result;
          this.totalCount = data.result.totalCount;
        }else{
          this.$message.error(data.message);
        }
      })
    },
    selectDate(val){		// 选择日期
      this.startTimeStr = val[0];
      this.endTimeStr = val[1];
      this.currentPage = 1;
      this.getLogList();
    },
    selectType(val){  // 选择数据类型
      this.currentPage = 1;
      this.getLogList();
    },
    handleSizeChange(val){		// 选择分页符
      this.currentPage = 1;
      this.pageSize = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLogList();
    },
  },
  components: {
    topNav,
  }     
}
</script>

<style lang="less" scoped>
  .search-wrap{
    font-size: 0;
    margin-bottom: 22px;
    .data-type{
      width: 130px;
      margin: 0 8px;
    }
    .search-select{
      width: 100px;
    }
    .search-input{
      width: 300px;
    }
  }
  .pagination{
		text-align: right;
		margin-top: 24px;
  }
  .report-name-wrap{
    display: -webkit-box !important;
    overflow: hidden;
    text-overflow:ellipsis;
    word-break:break-all;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
  .table-no-line-wrap.el-table:before{
    height: 0;
  }
  .search-select /deep/ .el-input__inner{
    background-color: #F1F3F7;
    border-right: 0;
    padding-left: 12px;
  }
</style>
