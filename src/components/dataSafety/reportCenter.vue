<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="bottom-content-wrap">
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
          <el-select @change="selectState" class="data-type" v-model="dataState" placeholder="请选择" style="margin-left:0">
            <el-option
              v-for="item in dataStateOptions"
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
          ref="myTable"
          class="table-no-line-wrap"
          style="width: 100%">
          <el-table-column
            prop="reportId"
            label="报告ID">
            <template slot-scope="scope">
              {{ scope.row.reportId?scope.row.reportId:'--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="操作时间">
            <template slot-scope="scope">
              <p>{{scope.row.applyTime | dateFormat('YYYY-MM-DD')}}</p>
              <p>{{scope.row.applyTime | dateFormat('hh:mm:ss')}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="applyClerkName"
            label="操作人员">
          </el-table-column>
          <el-table-column
            prop="reportName"
            label="文件名称">
            <template slot-scope="scope">
              <div class="file-name-wrap">
                <span>{{ scope.row.reportName?scope.row.reportName:'--' }}</span> 
                <!-- <el-popover
                  placement="top"
                  width="200"
                  @hide="cancelFileName(scope.row)"
                  v-model="scope.row.fileNameBool">
                  <div class="edit-input">
                    <el-input @keyup.native="toInput(scope.row,$event)" v-model="scope.row.reportNameOld" placeholder="请输入内容"></el-input>
                    <span class="tag-name-num">{{scope.row.inputNum}}/{{inputLength}}</span>
                  </div>
                  <div class="file-name-btn">
                    <el-button type="text" size="mini" @click="cancelFileName(scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="sureFileName(scope.row)">确定</el-button>
                  </div>
                  <i slot="reference" class="el-icon-edit"></i>
                </el-popover> -->
              </div>
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
              <p>{{ scope.row.dataType==1?'脱敏数据':'完整数据'}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataCount"
            label="数据总量">
          </el-table-column>
          <el-table-column
            prop="dataContent"
            label="数据内容">
          </el-table-column>
          <el-table-column
            prop="applyStatus"
            label="审核状态">
            <template slot-scope="scope">
              <p v-if="scope.row.applyStatus==2" class="dm-status--success">
                <span>已生成</span>
                <el-popover
                  placement="top"
                  width="180">
                  <p class="checker-name-wrap">审核人姓名：{{ scope.row.auditorName }}</p>
                  <p>审核人手机：{{ scope.row.auditorPhone }}</p>
                  <i v-if="scope.row.dataType!=1" slot="reference" class="el-icon-view"></i>
                </el-popover>
              </p>
              <p v-if="scope.row.applyStatus==1" class="dm-status--warning">待审核</p>
              <p v-if="scope.row.applyStatus==3" class="dm-status--primary">生成中</p>
              <p v-if="scope.row.applyStatus==4" class="dm-status--danger">审核超时</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="opr"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <!-- 已生成的报告里有 下载：直接下载，记录：转至【下载日志】页-->
              <div v-if="scope.row.applyStatus==2">
                <el-button type="text" @click="downLoadReport(scope.row.downloadReportId)">下载</el-button>
                <el-button type="text" @click="recordReport(scope.row.reportId)">记录</el-button>
              </div>
              <div v-else>--</div>
            </template>
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
  import strLength from '../../common/js/strlen'
  import { dateFormat } from '../../common/js/filter'
  import excelConfig from '../../common/js/excel_config.js'
  let qs = require('qs')
  export default {
    name: "reportCenter",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '报表中心',
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
        dataStateOptions:[ // 状态
          {
            type: '',
            name:'所有状态'
          },{
            type: '2',
            name:'已生成'
          },{
            type: '1',
            name:'待审核'
          },{
            type: '3',
            name:'生成中'
          },{
            type: '4',
            name:'审核超时'
          }
        ],
        dataState:'',
        searchOptions:[
          {
            type: 'report_id',
            name:'报告ID'
          },{
            type: 'apply_clerk_name',
            name:'操作人员'
          },{
            type: 'report_name',
            name:'文件名称'
          },{
            type: 'data_content',
            name:'数据内容'
          }
        ],
        searchType:'report_id',
        searchInput:'',
        inputNum: 0,
        inputLength: 20,
        tableData: [],
        currentPage:1,
        pageSize:20,
        totalCount:0,
        loading:false,
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getReportList()
    },
    methods:{
      getReportList(){  // 用的是 下载日志 的接口  别忘了换
        this.loading = true;
        this.axios.post('/api-admin/page-download-report',qs.stringify({
          requestProject:'gic-web',
          applyStartTime:this.startTimeStr,
          applyEndTime:this.endTimeStr,
          searchColumn:this.searchType,
          searchValue:this.searchInput,
          dataType:this.dataType,
          applyStatus:this.dataState,
          currentPage:this.currentPage,
          pageSize:this.pageSize
        })).then((res)=>{
          var data = res.data;
          this.loading = false;
          if(data.errorCode==0){
            if(this.dateValue.length<1){
              this.startTimeStr = data.result.params.applyStartTime;
              this.endTimeStr = data.result.params.applyEndTime;
              this.dateValue.push(this.startTimeStr,this.endTimeStr);
            }
            this.tableData = data.result.result?data.result.result.map(el => ({
              ...el,
              fileNameBool: false,
              reportNameOld:el.reportName,
              inputNum:strLength.getZhLen(el.reportName),
              inputNumOld:strLength.getZhLen(el.reportName),
            })):[];
            this.totalCount = data.result.totalCount;
          }else{
            this.$message.error(data.message);
          }
        })
      },
      handleSizeChange(val){    // 选择分页符
        this.currentPage = 1;
        this.pageSize = val;
        this.getReportList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getReportList()
      },
      selectDate(val){		// 选择日期
        this.startTimeStr = val[0];
        this.endTimeStr = val[1];
        this.currentPage = 1;
        this.getReportList();
      },
      selectType(val){  // 选择数据类型
        this.currentPage = 1;
        this.getReportList();
      },
      selectState(val){  // 选择状态
        this.currentPage = 1;
        this.getReportList();
      },
      toInput(row,e) {  // 名称输入时控制字符数量
        row.reportNameOld = strLength.getByteVal(e.target.value,this.inputLength);
        row.inputNum = strLength.getZhLen(row.reportNameOld);
      },
      cancelFileName(row,name){  // 修改文件名称的 取消
        row.fileNameBool = false;
        row.reportNameOld = row.reportName;
        row.inputNum = row.inputNumOld;
      },
      sureFileName(row){  // 修改文件名称的 确认
        row.fileNameBool = false;
        this.axios.post('/api-admin/update-download-report',qs.stringify({
          requestProject:'gic-web',
          downloadReportId:row.downloadReportId,
          reportName:row.reportNameOld
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            this.$message.success('修改成功');
            this.getReportList()
          }else{
            this.$message.error(data.message);
          }
        })
      },
      recordReport(reportId){  // 记录
        this.$router.push({
          path:'/downloadLog',
          query:{
            reportId:reportId
          }
        })
      },
      downLoadReport(downloadReportId){ // 下载
        this.axios.post('/api-admin/download-report',qs.stringify({
	    		requestProject:'gic-web',
	    		downloadReportId:downloadReportId
	    	})).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            window.location.href = data.result;
          }
	    		// if(data.errorCode){		// 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
	        // 	this.$message({
	        //     type: 'error',
	        //     message: data.message
	        //   });
	        // }else{
	        // 	window.location.href = excelConfig.config + '/api-admin/download-report?requestProject=gic-web&downloadReportId='+downloadReportId;
	        // }
	      })
      }
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.bottom-content-wrap{
    padding: 24px;
    background: #fff;
  }
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
  .file-name-wrap i {
    color: #909399;
    cursor: pointer;
  }
  .file-name-btn {
    margin-top: 20px;
    text-align: right;
  }
  .checker-name-wrap{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .edit-input{
    width: 100%;
    position: relative;
    display: inline-block;
    .tag-name-num{
      position: absolute;
      right: 10px;
      bottom: 1px;
      color: #c0c4cc;
      font-size: 12px;
      height: 30px;
      line-height: 32px;
      padding-left: 10px;
    }
  }
  .edit-input /deep/ .el-input__inner{
    padding-right: 45px;
  }
  .search-select /deep/ .el-input__inner {
    background-color: #F1F3F7;
    border-right: 0;
    padding-left: 12px;
  }
  .pagination{
    text-align: right;
    margin-top: 24px;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
