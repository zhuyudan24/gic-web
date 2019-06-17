<template>
	<div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box" >
        <div class="two-btn">
          <el-row>
            <el-button type="primary">批量转移</el-button>
          </el-row>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="会员信息"
            width="200"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="member-info-wrap clearfix">
                <div class="fl img">
                  <img :src="scope.row.imgUrl?scope.row.imgUrl:defaultImg" alt="">
                </div>
                <p class="fl">{{scope.row.memberName?scope.row.memberName:'--'}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="性别">
            <template slot-scope="scope">
              <p v-if="scope.row.sex==1">男</p>
              <p v-else-if="scope.row.sex==2">女</p>
              <p v-else>未知</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="会员状态">
            <template slot-scope="scope">
            <div class="state-img clearfix">
              <img title="未关注微信服务号" src="../../../../static/img/wxfw.png" height="20" width="20" alt="">
              <img title="已关注微信服务号" src="../../../../static/img/wxfw_on.png" height="20" width="20" alt="">
              <img title="未使用公众号" src="../../../../static/img/wxgz.png" height="20" width="20" alt="">
              <img title="已使用公众号" src="../../../../static/img/wxgz_on.png" height="20" width="20" alt="">
            </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="grade"
            label="会员等级">
          </el-table-column>
          <el-table-column
            prop="sales"
            label="消费总额">
          </el-table-column>
          <el-table-column
            prop="costTime"
            label="消费次数">
          </el-table-column>
          <el-table-column
            prop="opr"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="openDetail(scope.row.memberId)" type="text">详情</el-button>
            </template>
          </el-table-column>
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
    <!-- 会员转移 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogMoveMember"
      width="500px">
      <div class="move-member-wrap">
        <el-checkbox-group v-model="checkList">
          <p><el-checkbox label="0">主门店</el-checkbox></p>
          <div class="main-store">
            <el-radio-group v-model="radio1">
              <p><el-radio :label="0">替换为最新协管的门店</el-radio></p>
              <p><el-radio :label="1">替换为最新协管的自营门店</el-radio></p>
              <p><el-radio :label="2">替换为最新协管的自营/联营门店 </el-radio></p>
              <p><el-radio :label="3">自定义门店</el-radio><el-input v-model="myStore" class="small-input"></el-input><span>选择门店</span></p>
            </el-radio-group>
          </div>
          <p><el-checkbox label="1">协管门店</el-checkbox></p>
          <div class="main-store other-store">
            <el-radio-group v-model="radio2">
              <p><el-radio :label="0">增加协管门店</el-radio></p>
              <p><el-radio :label="1">将协管门店</el-radio></p>
              <p><el-radio :label="2">将协管门店</el-radio></p>
            </el-radio-group>
          </div>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveMember = false">取 消</el-button>
        <el-button type="primary" @click="dialogMoveMember = false">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	import topNav from 'components/nav/nav'
  import excelConfig from '../../../common/js/excel_config.js'
	let qs = require('qs')
  export default {
    name: "shop_recycle_member",
    data(){
    	return {
    		navpath: [
          {
            name: '首页',
            path: '/'
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
            name: '待处理会员',
            path: ''
          }
        ],
        tableData: [],
        multipleSelection: [],
        defaultImg:'../../../../static/img/head_default.jpg',
        currentPage:1,    //  分页
        pageSize:20,
        totalCount:0,
        dialogMoveMember:false, // 会员转移的弹框
        memberIds:'', // 多个会员id用逗号隔开
        checkList:[],
        radio1:'0',
        radio2:'0',
        myStore:'', // 自定义门店
        loading:false
    	}
    },
    created(){
      this.getMemberList(this.currentPage,this.pageSize);
    },
    methods: {
      getMemberList(page,size){   // 获得会员列表
        this.loading = true;
        var storeId = this.$route.query.storeId;
        this.axios.get('/api-admin/store-members',{
          params:{
            requestProject:'gic-web',
            storeId:storeId,
            currentPage:page,
            pageSize:size
          }
        }).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.loading =  false;
            this.tableData = data.result.result;
            this.totalCount = data.result.totalCount;
          }
        })
      },
      handleSelectionChange(val) {    // 多选选中的值
        this.multipleSelection = val;
        // console.log(this.multipleSelection);
        var memberId = '';
        this.multipleSelection.forEach((row)=>{
          memberId += row.memberId + ','
        })
        this.memberIds = memberId.substring(0,memberId.length-1);
        // console.log(this.memberIds);
      },
      handleSizeChange(val){    // 选择分页符
        this.pageSize = val;
        this.getMemberList(this.currentPage,this.pageSize);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getMemberList(this.currentPage,this.pageSize);
      },
      openDetail(id){
        window.open(excelConfig.config + '/member/index.html#/wechatmemberDetail?memberId='+id,'_blank');
      }
    },
    components: {
    	topNav
    }       
  }
</script>

<style lang="less" scoped>
  .right-box{
    .member-info-wrap{
      .img{
        width: 60px;
        height: 60px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      p{
        height: 60px;
        line-height: 60px;
        padding-left: 10px;
        width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .state-img{
      img{
        float: left;
        padding-left: 5px;
      }
    }
    .two-btn{
      margin-bottom: 22px;
      text-align: right;
    }
  }
  .main-store{
    padding: 10px 24px;
    p{
      line-height: 20px;
    }
    .small-input{
      width: 100px;
      margin-left: 10px;
    }
    span{
      font-size: 14px;
      margin-left: 10px;
      color: #1890ff;
    }
  }
  .pagination{
    text-align: right;
    padding: 20px 0;
  }
</style>
