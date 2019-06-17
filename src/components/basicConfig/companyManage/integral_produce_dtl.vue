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
            <el-select @change="getSelectEvent" v-model="event" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.integralTypeCode"
                :label="item.integralTypeName"
                :value="item.integralTypeCode">
              </el-option>
            </el-select>
            <el-select @change="getSelectType" v-model="type" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </div>
          <div class="box-right fr">
            <el-input @keyup.native.enter="getData(currentPage,pageSize)" clearable class="search-input" prefix-icon="el-icon-search" v-model="searchValue" placeholder="输入原始成本主体"></el-input>
            <el-button @click="downloadExcel" type='primary'>导出数据</el-button>
          </div>
        </div>
        <div class="table-wrap">
          <el-table
            :data="tableData"
            v-loading="loading"
            class="table-no-line-wrap"
            style="width: 100%">
            <el-table-column
              prop="all"
              label="时间">
              <template slot-scope="scope">
                <p>{{scope.row.createTime | dateFormat('YYYY-MM-DD')}}</p>
                <p>{{scope.row.createTime | dateFormat('hh:mm:ss')}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="produce"
              label="会员信息">
              <template slot-scope="scope">
                <div class="info-wrap">
                  <div class="img">
                    <img :src="scope.row.memberPic" alt="">
                  </div>
                  <div class="info">
                    <p class="member-name">{{scope.row.nickName}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="intervalHistory"
              label="积分产生额"
              width="100">
            </el-table-column>
            <el-table-column
              prop="memberIntegralName"
              label="事由">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="mainPartStoreName"
              label="原始成本主体名称">
            </el-table-column>
            <el-table-column
              prop="money"
              label="主体类型"
              width="120">
              <template slot-scope="scope">
                <p v-show="scope.row.storeType==0">自营</p>
                <p v-show="scope.row.storeType==1">联营</p>
                <p v-show="scope.row.storeType==2">加盟</p>
                <p v-show="scope.row.storeType==3">代销</p>
                <p v-show="scope.row.storeType==4">托管</p>
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
  import topNav from 'components/nav/nav'
  import excelConfig from '../../../common/js/excel_config.js'
  import { dateFormat } from '../../../common/js/filter'
  let qs = require('qs')
  export default {
    name: "integral_produce_dtl",
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
            name: '积分产生明细',
            path: ''
          }
        ],
        tableData: [],
        options: [
          {
            "integralTypeName":"所有事由",
            "integralTypeCode":""
          }
        ],
        options2: [
          {
            'name':'所有类型',
            'type':''
          },{
            'name':'自营',
            'type':'0'
          },{
            'name':'联营',
            'type':'1'
          },{
            'name':'加盟',
            'type':'2'
          },{
            'name':'代销',
            'type':'3'
          },{
            'name':'托管',
            'type':'4'
          }
        ],
        dateValue: '',
        event: '',
        type: '',

        currentPage:1,
        pageSize:20,
        totalCount:0,
        dateValue: '',
        searchValue: '',
        dateArr:[],
        dateArrNum:[],
        month:'',
        eventType:'',
        type:'',
        loading:false,
        // 导出数据
        dialogVisible:false,
        excelUrl:'/api-report/integral-produce-detail-excel',
        params:{},
        contactDialog:false,
      }
    },
    mounted(){
      this.getContact();
      // this.getMonthData();  // 获得月份
      this.getEventData();  // 获得所有事由
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
          // console.log(data);
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
      getSelectMonth(val){    // 选择月份
        // console.log(val);
        var selectDate = val.match(/\d+/g);
        this.month = selectDate[0] +'-'+ selectDate[1];
        this.currentPage = 1;
        this.getData(this.currentPage,this.pageSize);
      },
      getEventData(){   // 获得事由列表
        this.axios.post('/api-report/cause-list',qs.stringify({
          requestProject:'gic-web'
        })).then(res=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            data.result.forEach((item)=>{
              this.options.push(item)
            })
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      getSelectEvent(val){   // 选择事由
        // console.log(val);
        this.eventType = val;
        this.getData(this.currentPage,this.pageSize);
      },
      getSelectType(val){  // 选择类型
        // console.log(val);
        this.type = val;
        this.getData(this.currentPage,this.pageSize);
      },
      getData(page,size){
        this.loading = true;
        this.axios.post('/api-report/integral-produce-detail-data',qs.stringify({
          requestProject:'gic-web',
          month:this.month,
          searchParams:this.searchValue,
          currentPage:page,
          pageSize:size,
          type:this.type,
          eventType:this.eventType
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            this.loading=false;
            this.tableData = data.result.result?data.result.result:[];
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
        this.getData(this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData(this.currentPage,this.pageSize)
      },
      downloadExcel(){
        this.dialogVisible = true;
        this.params = {
          requestProject:this.projectName,
          month:this.month,
          searchParams:this.searchValue,
          type:this.type,
          eventType:this.eventType
        };

        // this.axios.post('/api-report/integral-produce-detail-excel',qs.stringify({
        //   requestProject:'gic-web',
        //   month:this.month,
        //   searchParams:this.searchValue,
        //   type:this.type,
        //   eventType:this.eventType
        // })).then(res=>{
        //   window.location.href = excelConfig.config + '/api-report/integral-produce-detail-excel?requestProject=gic-web&month='+this.month+'&searchParams='+this.searchValue+'&type='+this.type+'&eventType='+this.eventType
        // })
      }
    },
    components: {
      topNav
    }
  }
</script>

<style lang="less" scoped>
  .box-left{
    font-size: 0;
  }
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
        }
      }
      .info{
        padding-left: 70px;
        .member-name{
          max-width: 100%;
          // height: 40px;
          // line-height: 20px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        p{
          line-height: 60px;
        }
      }
    }
  }
  .pagination{
    text-align: right;
  }
  .box-left /deep/ .el-select + .el-select{
    margin-left: 8px
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
