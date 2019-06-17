<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="search-wrap clearfix">
          <el-date-picker @change="selectDate" :picker-options="pickerOptions" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-popover
            class="item"
            placement="top"
            width="200"
            trigger="hover"
            title=""
            content="根据结算时间进行筛选">
            <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
          </el-popover>
          <el-select @change="selectType" class="select-input" v-model="channelType">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select @change="selectType" class="select-input" v-model="belongType">
            <el-option
              v-for="item in belongOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
          <el-button @click="downloadExcel" type="primary" class="fr">导出数据</el-button>
    		</div>
        <el-table
          :data="tableData"
          v-loading="loading"
          :span-method="objectSpanMethod"
          ref="myTable"
          class="table-no-line-wrap"
          :cell-class-name="tableRowClassName"
          @cell-mouse-leave="cellMouseLeave"  
          @cell-mouse-enter="cellMouseEnter"
          style="width: 100%">
          <el-table-column
            prop="settleTime"
            label="结算时间"
            :render-header="renderHeader">
            <template slot-scope="scope">
              <p>{{scope.row.settleTime | dateFormat('YYYY-MM-DD')}}</p>
              <p class="table-second-item">{{scope.row.settleTime | dateFormat('hh:mm:ss')}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="单据创建时间">
            <template slot-scope="scope">
              <p>{{scope.row.createTime | dateFormat('YYYY-MM-DD')}}</p>
              <p class="table-second-item">{{scope.row.createTime | dateFormat('hh:mm:ss')}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="channelType"
            label="渠道">
          </el-table-column>
          <el-table-column
            prop="orderNumber"
            label="订单编号">
          </el-table-column>
          <el-table-column
            prop="belongType"
            label="归属类型"
            width="130"
            :render-header="renderHeader">
          </el-table-column>
          <el-table-column
            prop="goodsCode"
            label="归属门店"
            :render-header="renderHeader">
            <template slot-scope="scope">
              <p class="table-first-item">{{scope.row.storeName }}</p>
              <p class="table-second-item">{{scope.row.storeCode }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="itemPayAmountTotal"
            label="归属导购"
            :render-header="renderHeader">
            <template slot-scope="scope">
              <p class="table-first-item">{{scope.row.clerkName }}</p>
              <p class="table-second-item">{{scope.row.clerkCode }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsCode"
            label="商品货号">
          </el-table-column>
          <el-table-column
            prop="itemPayAmount"
            label="商品成交额">
          </el-table-column>
          <el-table-column
            prop="commissionValue"
            label="归属佣金"
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
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="2" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
import { dateFormat } from '../../common/js/filter'
let qs = require('qs')
export default {
  name: "belong_brokerage_dtl", 
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
          name: '归属佣金明细',
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
            return time.getTime() > maxTime || time.getTime() < minTime
          }
        },
      },
      dateValue:[],
      startTime:'',
      endTime:'',
      channelOptions:[
        {
          value:'',
          label:'所有渠道'
        },{
          value:'0',
          label:'GIC微商城'
        },{
          value:'1',
          label:'微盟微商城'
        }
      ],
      channelType:'',
      belongOptions:[
        {
          value:'',
          label:'所有归属类型'
        },{
          value:'0',
          label:'服务门店'
        },{
          value:'1',
          label:'开卡门店'
        }
      ],
      belongType:'',
      searchOptions:[
        {
          type: '13',
          name:'订单编号'
        },{
          type: '6',
          name:'门店名称'
        },{
          type: '5',
          name:'门店code'
        },{
          type: '9',
          name:'导购姓名'
        },{
          type: '8',
          name:'导购code'
        },{
          type: '7',
          name:'商品货号'
        }
      ],
      searchType:'13',
      searchInput:'',
      tableData: [],
      currentPage:1,
      pageSize:20,
      totalCount:0,
      loading:false,
      // 导出数据
      dialogVisible:false,
      excelUrl:'/api-admin/report-commission-settle-detail',
      params:{},

      rowIndex: '-1', // 合并行
      OrderIndexArr: [],
      hoverOrderArr: [],
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
      this.axios.post('/api-admin/list-commission-settle-detail',qs.stringify({
        requestProject:this.projectName,
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        startTime:this.startTime,
        endTime:this.endTime,
        channelType:this.channelType,
        belongType:this.belongType,
        searchValue:this.searchInput,
        searchType:this.searchType,
      })).then((res)=>{
        var data = res.data;
        this.loading = false;
        if(data.errorCode==0){
          this.tableData = [];
          this.totalCount = data.result.totalCount;
          var arr = data.result.result?data.result.result:[];
          if(arr.length>0){
            arr.forEach((item)=>{
              item.commissionValueVOList = item.commissionValueVOList.map(el=>({
                ...el,
                commissionSettleId:item.commissionSettleId,
                belongType:item.belongType,
                channelType:item.channelType,
                clerkCode:item.clerkCode,
                clerkName:item.clerkName,
                createTime:item.createTime,
                orderNumber:item.orderNumber,
                settleTime:item.settleTime,
                storeCode:item.storeCode,
                storeName:item.storeName
              }))
              item.commissionValueVOList.forEach((el)=>{
                this.tableData.push(el)
              })
            })
            // 需要合并的项
            let OrderObj = {}
            this.tableData.forEach((element, index) => {
              element.rowIndex = index
              if (OrderObj[element.commissionSettleId]) {
                OrderObj[element.commissionSettleId].push(index)
              } else {
                OrderObj[element.commissionSettleId] = []
                OrderObj[element.commissionSettleId].push(index)
              }
            })
            // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
            this.OrderIndexArr = [];
            for (let k in OrderObj) {
              if (OrderObj[k].length > 1) {
                this.OrderIndexArr.push(OrderObj[k])
              }
            }
          }
        }else{
          this.$message.error(data.message)
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) { // 合并行
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 ) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i]
          for (let j = 0; j < element.length; j++) {
            let item = element[j]
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                }
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                }
              }
            }
          }
        }
      }
    },
    // 解决鼠标滑入滑出样式不好看的问题
    tableRowClassName({row,rowIndex}) {
      let arr = this.hoverOrderArr
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex == arr[i]) {
          return 'hovered-row'
        }
      }
    },
    cellMouseEnter(row, column, cell, event) {
      this.rowIndex = row.rowIndex;
      this.hoverOrderArr = [];
      this.OrderIndexArr.forEach(element => {
          if (element.indexOf(this.rowIndex) >= 0) {
            this.hoverOrderArr = element
          }
      })
    },
    cellMouseLeave(row, column, cell, event) {
      this.rowIndex = '-1'
      this.hoverOrderArr = [];
    },
    // end
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
      if(label=="结算时间"){
        arr = [
          h('span',{},[
            <span slot="content">GIC针对该单据，实际进行佣金结算的时间点。</span>
          ])
        ]
      }else if(label=="归属类型"){
        arr = [
          h('span',{},[
            <span slot="content">该订单与该门店产生佣金归属的类型</span>
          ])
        ]
      }else if(label=="归属门店"){
        arr = [
          h('span',{},[
            <span slot="content">该订单所归属的门店信息</span>
          ])
        ]
      }else if(label=="归属导购"){
        arr = [
          h('span',{},[
            <span slot="content">该订单所归属的导购信息</span>
          ])
        ]
      }else if(label=="归属佣金"){
        arr = [
          h('span',{},[
            <span slot="content">根据佣金结算规则，该订单与该门店/导购存在归属关系，该字段统计了每一个订单项（SKU）所产生的归属佣金。</span>
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
        channelType:this.channelType,
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
      margin-left: 5px;
    }
    .search-select{
      width: 130px;
    }
    .search-input{
      width: 300px;
      margin-left: 5px;
    }
  }
  .table-wrap{
    padding: 0 32px 24px;
  }
  .table-no-line-wrap /deep/ td:nth-child(7){
    border-right: 1px solid #E4E7ED
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
