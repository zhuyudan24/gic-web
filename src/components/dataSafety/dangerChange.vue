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
            prop="date"
            label="申请时间">
            <template slot-scope="scope">
              {{scope.row.updateTime | dateFormat('YYYY-MM-DD hh:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="applyName"
            label="申请人姓名">
          </el-table-column>
          <el-table-column
            prop="applyPhone"
            label="申请人手机">
          </el-table-column>
          <el-table-column
            prop="auditorName"
            label="审核员姓名">
          </el-table-column>
          <el-table-column
            prop="auditorPhone"
            label="审核员手机">
          </el-table-column>
          <el-table-column
            prop="reportId"
            label="授权时长"
            width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.auditDuration == 1">5分钟</p>
              <p v-else-if="scope.row.auditDuration == 2">15分钟</p>
              <p v-else-if="scope.row.auditDuration == 3">1小时</p>
              <p v-else-if="scope.row.auditDuration == 4">6小时</p>
              <p v-else-if="scope.row.auditDuration == 5">24小时</p>
              <p v-else>所有授权时长</p>
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
          name: '风险模式切换日志',
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
          name:'所有授权时长'
        },{
          type: '1',
          name:'5分钟'
        },{
          type: '2',
          name:'15分钟'
        },{
          type: '3',
          name:'1小时'
        },{
          type: '4',
          name:'6小时'
        },{
          type: '5',
          name:'24小时'
        }
      ],
      dataType:'',
      searchOptions:[
        {
          type: 'apply_name',
          name:'申请人姓名'
        },{
          type: 'apply_phone',
          name:'申请人手机'
        },{
          type: 'auditor_name',
          name:'审核员姓名'
        },{
          type: 'auditor_phone',
          name:'审核员手机'
        }
      ],
      searchType:'apply_name',
      searchInput:'',
      tableData: [],
      currentPage:1,	// 分页符的当前页
      pageSize:20,
      totalCount:100,
      loading:false,
    }
  },
  created(){
    this.timeDefaultShow = new Date();
    this.timeDefaultShow.setMonth(new Date().getMonth() - 1);  // 设置日期
    this.getLogList();	// 获取日志列表
  },
  methods: {
    getLogList(){
      this.loading = true;
      this.axios.post('/api-admin/page-risk-mode-log',qs.stringify({
        requestProject:'gic-web',
        applyStartTime:this.startTimeStr,
        applyEndTime:this.endTimeStr,
        searchColumn:this.searchType,
        searchValue:this.searchInput,
        duration:this.dataType,
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
    selectType(val){  // 选择授权时长
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
      width: 120px;
    }
    .search-input{
      width: 320px;
    }
  }
  .pagination{
		text-align: right;
		margin-top: 24px;
  }
  .table-no-line-wrap.el-table:before{
    height: 0;
  }
  .search-select /deep/ .el-input__inner{
    background-color: #F1F3F7;
    border-right: 0;
    padding-left: 12px;
  }
  .search-input /deep/ .el-input__inner{

  }
</style>
