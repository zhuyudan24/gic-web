<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="search-wrap clearfix">
          <el-date-picker 
            @change="selectDate" 
            :picker-options="pickerOptions"
            format="yyyy-MM-dd" 
            value-format="yyyy-MM-dd" 
            v-model="dateValue" 
            type="daterange" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期">
          </el-date-picker>
          <el-popover
            class="item"
            placement="top"
            width="200"
            trigger="hover"
            title=""
            content="选择需要汇总的结算时间区间">
            <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
          </el-popover>
          <div style="display:inline-block;margin-left:5px">
            <vue-gic-store-new ref="storeNew" :options="optionsStore" :uuid.sync="uuid" :isAdd="true" @store-change="storeChange"></vue-gic-store-new>
          </div>
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
          <el-button @click="downloadExcel" type="primary" class="fr">导出数据</el-button>
    		</div>
        <el-table
          :data="tableData"
          v-loading="loading"
          @sort-change='sortChange'
          ref="myTable"
          class="table-no-line-wrap"
          style="width: 100%">
          <el-table-column
            prop="storeName"
            label="门店名称">
            <template slot-scope="scope">
              <p class="table-first-item">{{scope.row.storeName}}</p>
              <p class="table-second-item">{{scope.row.storeCode}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="storeType"
            label="门店类型">
          </el-table-column>
          <el-table-column
            prop="storeGroupName"
            label="门店分组">
          </el-table-column>
          <el-table-column
            prop="fullName"
            label="地区">
          </el-table-column>
          <el-table-column
            prop="commissionSettleValue"
            label="归属佣金"
            sortable="custom"
            width="130"
            :render-header="renderHeader">
          </el-table-column>
          <el-table-column
            prop="commissionSettleRefundValue"
            label="归属退佣"
            sortable
            width="130"
            :render-header="renderHeader">
          </el-table-column>
          <!-- <el-table-column
            prop="sendCommissionSettleValue"
            label="发货佣金"
            sortable
            width="130"
            :render-header="renderHeader">
          </el-table-column>
          <el-table-column
            prop="sendCommissionSettleRefundValue"
            label="发货退佣"
            sortable
            width="130"
            :render-header="renderHeader">
          </el-table-column> -->
          <el-table-column
            prop="clerkTotalCommission"
            label="总佣金"
            sortable
            width="110"
            :render-header="renderHeader">
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
    <!-- 导出数据 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
import { dateFormat } from '../../common/js/filter'
let qs = require('qs')
export default {
  name: "store_brokerage_all", 
  data() {
    return {
      projectName:'gic-web',
      navpath: [
        {
          name: '佣金结算',
          path: ''
        },
        {
          name: '佣金结算明细',
          path: ''
        },
        {
          name: '门店佣金汇总',
          path: ''
        },
      ],
      pickerMinDate:'',
      pickerOptions: {  
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime()
          if (maxDate) {
            this.pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== '') {
            const day90 = (90 - 1) * 24 * 3600 * 1000
            let maxTime = this.pickerMinDate + day90
            let minTime = this.pickerMinDate - day90
            if (maxTime > new Date()) {
              maxTime = new Date()- 8.64e7;
            }
            return time.getTime() > maxTime || time.getTime() < minTime
          }
          return time.getTime() > Date.now() - 8.64e7;
        },
      },  
      dateValue:[],
      startTime:'',
      endTime:'',
      searchOptions:[
        {
          type: '6',
          name:'门店名称'
        },{
          type: '5',
          name:'门店code'
        },{
          type: '14',
          name:'门店分组'
        },{
          type: '15',
          name:'地区'
        }
      ],
      searchType:'6',
      searchInput:'',
      tableData: [],
      currentPage:1,
      pageSize:20,
      totalCount:0,
      loading:false,
      // 导出数据
      dialogVisible:false,
      excelUrl:'/api-admin/report-store-commission-collect',
      params:{},
      // 选择门店
      uuid:'',  // 新增传空，编辑必传,
      optionsStore:[0,1,3,4,5],
      isAdd:true,
      // 排序
      curSortType:""
    }  
  },
  mounted(){
    this.getNowDate();
  },
  methods: {
    getNowDate(){ // 获取默认时间
      this.loading = true;
      this.axios.post('/api-admin/get-default-date',qs.stringify({
        requestProject:this.projectName,
      })).then((res)=>{
        var data = res.data;
        if(data.errorCode==0){
          if(this.dateValue.length<1){
            this.startTime = data.result.startTime;
            this.endTime = data.result.endTime;
            this.dateValue.push(this.startTime,this.endTime);
          }
          this.getList();          
        }else{
          this.$message.error(data.message)
        }
      })
    },
    getList(){
      this.loading = true;
      this.axios.post('/api-admin/list-store-commission-collect',qs.stringify({
        requestProject:this.projectName,
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        startTime:this.startTime,
        endTime:this.endTime,
        uuid:this.uuid,
        orderBy:this.curSortType,
        searchValue:this.searchInput,
        searchType:this.searchType,
      })).then((res)=>{
        var data = res.data;
        this.loading = false;
        if(data.errorCode==0){
          this.tableData = data.result.result?data.result.result:[];
          this.totalCount = data.result.totalCount
        }else{
          this.$message.error(data.message)
        }
      })
    },
    // 排序
    sortChange(column, prop, order){
      let itemProp= column.prop;
      let itemOrder = column.order;
      if(itemProp == "commissionSettleValue"){ // 归属佣金
        if(itemOrder === 'ascending') { // 上升
          this.curSortType = "1";
        }else if(itemOrder === 'descending') {
          this.curSortType = "2";
        }
      }else if(itemProp == "commissionSettleRefundValue"){ // 归属退佣
        if(itemOrder === 'ascending') {
          this.curSortType = "3";
        }else if(itemOrder === 'descending') {
          this.curSortType = "4";
        }
      }else if(itemProp == "sendCommissionSettleValue"){ // 发货佣金
        if(itemOrder === 'ascending') {
          this.curSortType = "5";
        }else if(itemOrder === 'descending') {
          this.curSortType = "6";
        }
      }else if(itemProp == "sendCommissionSettleRefundValue"){ // 发货退佣
        if(itemOrder === 'ascending') {
          this.curSortType = "7";
        }else if(itemOrder === 'descending') {
          this.curSortType = "8";
        }
      }else if(itemProp == "clerkTotalCommission"){ // 总佣金
        if(itemOrder === 'ascending') {
          this.curSortType = "9";
        }else if(itemOrder === 'descending') {
          this.curSortType = "10";
        }
      }
      this.getList();
    },
    selectDate(val){		// 选择日期
      if(val){
        this.startTime = val[0];
        this.endTime = val[1];
        this.getList()
      }
    },
    handleSizeChange(val){    // 选择分页符
      this.currentPage = 1;
      this.pageSize = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList()
    },
    selectType(val){  // 选择类型
      this.currentPage = 1;
      this.getList();
    },
    // 选择门店
    storeChange(){
      this.getList()
    },
    // 自定义表头
    renderHeader(h, obj) {
      let r = h('span',[obj.column.label],{
        attrs:{
          style:'text-align:left'
        }
      })
      r = h('span',[
        obj.column.label,
        h('el-popover',{
          attrs:{
            trigger:'hover',
            width:'190',
            placement:'top'
          }
        },[
          this.operation(h,obj.column.label),  // 组件  或者 多处用
          h('i',{
            slot:'reference',
            attrs:{
              class:'iconfont tooltip-icon icon-xinxixianshi',
              style:'padding-left:4px;cursor:pointer'
            }
          })
        ])
      ])
      return r;
    },
    operation(h,label){
      var arr = [];
      if(label=="归属佣金"){
        arr = [
          h('span',{},[
            <span slot="content">消费的会员与门店之间，存在服务门店或开卡门店的归属关系，以此获得的佣金称之为归属佣金。</span>
          ])
        ]
      }else if(label=="归属退佣"){
        arr = [
          h('span',{},[
            <span slot="content">归属佣金所关联的订单，生产了退款维权事件，导致的佣金追扣。</span>
          ])
        ]
      }else if(label=="发货佣金"){
        arr = [
          h('span',{},[
            <span slot="content">承担了订单的发货的门店和导购，以此所获得的佣金称之为发货佣金。</span>
          ])
        ]
      }else if(label=="发货退佣"){
        arr = [
          h('span',{},[
            <span slot="content">发货佣金所关联的订单项，发生了退款维权事件，会对原有的佣金进行追扣。</span>
          ])
        ]
      }else if(label=="总佣金"){
        arr = [
          h('span',{},[
            <span slot="content">相应时间段内，所有的新增佣金，减去退款维权事件造成的追扣佣金，最终求得的总佣金（净值）。</span>
          ])
        ]
      }
      return arr;
    },
    // end
    downloadExcel(){  // 导出数据
      this.dialogVisible = true;
      this.params = {
        requestProject:this.projectName,
        startTime:this.startTime,
        endTime:this.endTime,
        uuid:this.uuid,
        orderBy:this.curSortType,
        searchValue:this.searchInput,
        searchType:this.searchType,
      };
    },
  },
  components: {
    topNav,
  } 
}
</script>

<style lang="less" scoped>
  .search-wrap{
    margin-bottom: 22px;
    .select-input{
      width: 130px;
      margin: 0 8px;
    }
    .search-select{
      width: 130px;
    }
    .search-input{
      width: 300px;
    }
  }
  .table-wrap{
    padding: 0 32px 24px;
  }
  .search-select /deep/ .el-input__inner {
    background-color: #F1F3F7;
    border-right: 0;
    padding-left: 12px;
  }
    /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
