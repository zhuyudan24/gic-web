<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
  		<div class="right-box">
  			<h2 class="title-wrap">活动设置</h2>
  			<div class="input-wrap">
					<div class="item">
						<span>活动名称：</span>
						<p>{{activityName}}</p>
					</div>
					<div class="item">
						<span>活动时间：</span>
						<p class="active-time">{{activityStartTime | dateFormat('YYYY-MM-DD')}}<span>至</span>{{activityEndTime | dateFormat('YYYY-MM-DD')}}</p>
					</div>
					<div class="item">
						<span>上线时间
						<el-popover
					    placement="top"
					    title=""
					    width="160"
					    trigger="hover"
					    content="活动在服务号显示的时间">
					    <i slot="reference" class="tooltip-icon el-icon-question"></i>
					  </el-popover>：</span>
						<p>{{activityOnlineTime | dateFormat('YYYY-MM-DD')}}</p>
					</div>
					<div class="item">
						<span>活动类型：</span>
						<p>
							<span v-show="activityType==0">促销</span>
							<span v-show="activityType==1">新品</span>
							<span v-show="activityType==2">免费</span>
							<span v-show="activityType==3">赠送</span>
							<span v-show="activityType==4">试用</span>
							<span v-show="activityType==5">抽奖</span>
							<span v-show="activityType==6">活动</span>
						</p>
					</div>
					<div class="item">
						<span>活动说明：</span>
						<p>{{activityRemark}}</p>
					</div>
					<div class="item">
						<span>适用门店：</span>
						<p>
							<span v-show="storeType==0">全部</span>
							<span v-show="storeType==1">部分分组</span>
							<span v-show="storeType==2">部分门店</span>
						</p>
					</div>
				</div>
				<div class="height-24"></div>
				<h2 class="title-wrap">人群设置</h2>
				<div class="input-wrap" style="padding-bottom:24px">
					<div class="item" style="margin-bottom:0">
						<span>筛选条件：</span>
						<p>{{ filterData }}</p>
						<!-- <p><el-switch disabled v-model="open"></el-switch></p> -->
					</div>
					<!-- <div v-show="open" class="select-people">
						<vue-gic-people :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
						<div v-show="toggleTag" class="people-btn-wrap">
						  <el-row>
							  <el-button @click="getData" type="primary" size="small">确定</el-button>
								<el-button @click="cancelFilter" size="small">取消</el-button>
							</el-row>
						</div>
					</div> -->
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
    name: "shop_active_detail",
    data(){
    	return {
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
            name: '门店活动',
            path: '/shop_active'
          },
          {
            name: '活动详情',
            path: ''
          }
        ],
        activityName:'',
        activityStartTime:'',
        activityEndTime:'',
        activityOnlineTime:'',
        activityType:'',
        activityRemark:'',
        storeType:'',

        /* 门店 */
				sendChildData:{},
				storeType:'0',
				storeGroupId:'',  // 门店分组的id
        departStoreId:'', // 部分门店的id
        storeList:[],

        /*  人群筛选器 */
        projectName:'gic-web',
        sceneValue: 'member',  // 场景值
        useId:'',
        searchParams:'',
        hasSearchData: '' , // 当前页回显的数据(接口返回)
        toggleTag:false,
        open:false,

        filterData:'',	// 筛选结果
    	}
    },
    mounted(){
    	this.getDatail();
    	// this.getPeopleData();
    },
    methods:{
    	getDatail(){
    		var id = this.$route.query.activityId;
    		this.axios.post('/api-admin/activity_detail',qs.stringify({
          requestProject:'gic-web',
          activityId:id
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
          	this.activityName = data.result.activityName;
		        this.activityStartTime = data.result.activityStartTime;
		        this.activityEndTime = data.result.activityEndTime;
		        this.activityOnlineTime = data.result.activityOnlineTime;
		        this.activityType = data.result.activityType;
		        this.activityRemark = data.result.activityRemark;
		        this.storeType = data.result.storeType;
		        this.searchParams = data.result.searchParams;
		        if(this.searchParams=="{}"){
		        	this.filterData = '所有会员'
		        }else{
		        	this.getPeopleData(data.result.searchParams);
		        }
		        // if(this.searchParams==""){
		        // 	this.open = false
		        // }else{
		        // 	this.open = true;
		        // 	this.useId = data.result.selectorParamsId;
		        // 	this.hasSearchData = data.result.searchParams;
		        // }
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
    	},
    	getPeopleData(searchParams){	// 获得人群筛选器的结果
    		this.axios.post('/api-plug/screening-show-back',qs.stringify({
          requestProject:'gic-web',
          params:searchParams
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
          	this.filterData = data.result
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
    	},
    	/* 人群筛选器 start */
		  getData() {	// 父组件调用子组件方法,触发父组件事件
		    this.$refs.peopleFilter.confirmSet()
		  },
		  findFilter(value){	// 子组件触发父组件事件,返回过滤条件数据
		    console.log(value);
		    this.searchParams = value;
		    if(this.searchParams){
		    	// this.saveData();
		    }
		  },
		  cancelFilter(){
		  	this.$refs.peopleFilter.cancelSet();
		  },
		  getBackData(val) {
		  	console.log(val);
		    this.sendObj = val;
		  },
		  // 隐藏保存按钮和确认按钮  (子组件会调用)
		  hideBtn() {
		    var that = this
		    that.toggleTag= false;
		  },
		  // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
		  editShow() {
		    this.toggleTag= true
		  },
		  editHide() {
		    this.toggleTag= false
		  },
		  /* end */
    },
    components: {
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
		background: #fff;
		padding: 0;
		.item{
			font-size: 14px;
			color: #606266;
			height: 36px;
			line-height: 36px;
			margin-bottom: 10px;
			position: relative;
			> span{
				position: absolute;
				width: 100px;
			}
			p{
				padding-left: 100px;
			}
			.active-time{
				span{
					padding: 0 10px;
				}
			}
		}
	}
	.height-24{
		width: 100%;
    height: 24px;
    background: #f0f2f5;
	}
	.input-wrap{
		padding: 24px 32px 1px;
	}
	.title-wrap{
		font-weight: 700;
    color: #303133;
    font-size: 16px;
    padding-left: 32px;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;
    zoom: 1;
    height: 56px;
    line-height: 56px;
	}
	/* 人群筛选器 */
  .select-people{
  	padding: 24px 0;
    background: #fff;
  }
	.select-people /deep/ .filter-content{
		padding: 24px 0;
		margin-top: 0;
	}
	.select-people .people-content{
		padding: 0 16px;
		color: #606266;
	}
	.select-people /deep/ .detail{
		margin-bottom: 14px;
	}
	.select-people /deep/ .filter-content .member-templates-condition-title{
		font-size: 14px;
		color: #606266;
		text-align: left;
		height: 24px;
		line-height: 24px;
		width: 100px;
		z-index: 1;
		padding-top: 34px;
	}
	.select-people /deep/ .screening-condition{
		margin-top: 0;
		padding: 24px 0;
	}
	.select-people /deep/ .marginLeft134{
		margin-left: 100px;
	}
	.people-btn-wrap{
		width: 100%;
		background: #f2f3f4;
		box-sizing: border-box;
		padding: 0 0 24px 100px;
	}
</style>
