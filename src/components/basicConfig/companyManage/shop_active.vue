<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
  		<div class="right-box">
  			<div class="active_info clearfix">
  				<el-form ref="form" :model="form" label-width="0" class="call-list-wrap">
		        <el-form-item>
	            <el-date-picker @change="selectDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="date-picker" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
	            <!-- <el-date-picker @change="selectDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :default-value="timeDefaultShow" class="date-picker" v-model="form.dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
	            <el-select class="select-input" v-model="form.progress" @change="changeProgress" placeholder="活动进度">
	              <el-option
	                v-for="item in actiiveOptions"
	                :key="item.value"
	                :label="item.label"
	                :value="item.value">
	              </el-option>
	            </el-select>
	            <el-select class="select-input" v-model="form.state" @change="changeOnline" placeholder="上线状态">
		            <el-option
	                v-for="item in onlineOptions"
	                :key="item.value"
	                :label="item.label"
	                :value="item.value">
		            </el-option>
	            </el-select>
	            <el-input @keyup.native.enter="searchList" clearable class="input-input" prefix-icon="el-icon-search" v-model="form.name" placeholder="输入活动名称"></el-input>
	            <el-button @click="editActive('')" class="fr" type="primary">新建活动</el-button>
	         	</el-form-item>
	        </el-form>
    		</div>
    		<div class="active-list">
	    		<div class="list">
	    			<el-table :data="tableData" style="width: 100%" class="table-no-line-wrap" v-loading="loading">
			      	<el-table-column prop="activityName" label="活动名称">
			      		<template slot-scope="scope">
			      			<div>{{scope.row.activityName}}</div>
			      			<div>
			      				<span>{{scope.row.activityStartTime | dateFormat('YYYY-MM-DD')}}</span>
			              至
			              <span>{{scope.row.activityEndTime | dateFormat('YYYY-MM-DD')}}</span>
			      			</div>
		            </template>
			      	</el-table-column>
			      	<el-table-column prop="onlineStatus" label="上线状态" width="180">
			      		<template slot-scope="scope">
			      			<div v-if="nowTime<scope.row.activityOnlineTime" class="wait-online">
			      				<p class="dm-status--primary">待上线</p>
			      				<p>{{ scope.row.activityOnlineTime | dateFormat('YYYY-MM-DD')}}</p>
			      			</div>
			      			<p class="dm-status--success" v-if="(scope.row.activityOnlineTime<nowTime) && (nowTime<scope.row.activityEndTime)">已上线</p>
			      			<p class="dm-status--info" v-if="nowTime>scope.row.activityEndTime">已下线</p>
		            </template>
			      	</el-table-column>
			      	<el-table-column prop="activityRemark" label="活动说明"></el-table-column>
			      	<el-table-column prop="storeCount" label="参与门店数" width="180"></el-table-column>
			      	<el-table-column prop="pv" label="UV/PV"  width="180">
			      		<template slot-scope="scope">
			      			{{scope.row.uvCount}}/{{scope.row.pvCount}}
		            </template>
			      	</el-table-column>
			      	<!-- <el-table-column :render-header="renderHeader" prop="pv" label="UV/PV"  width="180"></el-table-column> -->
			      	<el-table-column label="操作" width="160">
			      		<template slot-scope="scope">
					        <el-button
					          type="text"
					          @click="editActive(scope.row.activityId)">编辑</el-button>
					        <el-button
					          type="text"
										@click="openDetail(scope.row.activityId)">详情</el-button>
									<delete-tip @confirm="deleteActive(scope.row.activityId,scope.$index)" tips="确定删除该活动记录?">
										<el-button type="text">删除</el-button>
									</delete-tip>
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
  	</div>
  	<vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	let qs = require('qs')
  export default {
    name: "shop_active",
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
            path: ''
          }
        ],
        form:{
        	progress:'',
        	state:'',
        	name:''
        },
        dateValue:[],
        startTimeStr:'',
        endTimeStr:'',
				actiiveOptions:[
					{
						value:'',
						label:'全部'
					},{
						value:'1',
						label:'未开始'
					},{
						value:'2',
						label:'已开始'
					},{
						value:'3',
						label:'已结束'
					}
				],
				onlineOptions:[
					{
						value:'',
						label:'全部'
					},{
						value:'1',
						label:'待上线'
					},{
						value:'2',
						label:'已上线'
					},{
						value:'3',
						label:'已下线'
					}
				],
				tableData: [],
	    	pickerOptions:{		// 设置结束日期的禁用
		    	disabledDate(time) {
			      return time.getTime() > Date.now()
			    }
		    },
	  		currentPage:1,		// 分页符的当前页
	  		pageSize:20,
	  		totalCount:0,
	  		loading:false,
	  		timeDefaultShow:''    // 默认日期
    	}
    },
    computed:{
    	nowTime(){   // 现在时间
    		var date = new Date();
    		return date.getTime()
    	}
    },
    created(){
	    this.timeDefaultShow = new Date();
	    this.timeDefaultShow.setMonth(new Date().getMonth() - 1);  // 设置日期

	    this.getActiveList();	// 获取门店活动列表
		},
    methods:{
    	getActiveList(){	// 获取门店活动列表
    		this.loading = true;
    		this.axios.post('/api-admin/activity_list',qs.stringify({
          requestProject:'gic-web',
          startTimeStr:this.startTimeStr,
          endTimeStr:this.endTimeStr,
          activityProgress:this.form.progress,
          onlineStatus:this.form.state,
          activityName:this.form.name,
          currentPage:this.currentPage,
          pageSize:this.pageSize
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
          	this.loading = false;
          	if(this.dateValue.length<1){
          		this.startTimeStr = data.result.params.endTime;
	          	this.endTimeStr = data.result.params.startTime;
	          	this.dateValue.push(this.startTimeStr,this.endTimeStr);
          	}
            this.tableData = data.result.result;
            this.totalCount = data.result.totalCount;
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
    	},
    	selectDate(val){		// 选择日期
    		this.startTimeStr = val[0];
    		this.endTimeStr = val[1];
    		this.currentPage = 1;
    		this.getActiveList();
    	},
    	changeOnline(val){
    		this.form.state = val;
    		this.currentPage = 1;
    		this.getActiveList();
    	},
    	changeProgress(val){
    		// console.log(val)
    		this.form.progress = val;
    		this.currentPage = 1;
    		this.getActiveList();	// 获取门店活动列表
    	},
    	searchList(){	// 搜索
    		this.currentPage = 1;
    		this.getActiveList();
    	},
    	handleSizeChange(val){		// 选择分页符
    		this.currentPage = 1;
    		this.pageSize = val;
    		this.getActiveList();
    	},
    	handleCurrentChange(val) {
      	this.currentPage = val;
      	this.getActiveList();
	    },
	    handleEdit(index, row) { 	// 操作按钮
	      console.log(index, row);
	    },
	    handleDelete(index, row) {
	      console.log(index, row);
	    },
	    changeRoute(route) {	// 切换路由
        this.$router.push(route);
      },
      deleteActive(id,index){			// 是否删除活动
      	this.axios.post('/api-admin/activity_del',qs.stringify({
					requestProject:'gic-web',
					activityId:id
				})).then((res)=>{
					var data = res.data;
					if(data.errorCode==0){
						this.tableData.splice(index,1);
						this.totalCount--;
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}
				})
      },
      openDetail(id){	// 查看详情
      	this.$router.push({
      		path:'shop_active_detail',
      		query:{
      			activityId:id
      		}
      	})
      },
      editActive(id){	// 编辑
      	this.$router.push({
      		path:'shop_active_edit',
      		query:{
      			activityId:id
      		}
      	})
      }
    },
    components: {
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
		background: #fff;
	}
	.shop_actiive_breadcrumb{
		padding: 24px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 -1px 10px #dfdfdf;
    .actiive_title{
    	margin: 30px 0 10px 0;
			font-size: 20px;
    }
	}
	.select-input{
  	width: 130px;
  	margin-left: 4px;
  }
  .input-input{
  	width: 180px;
  	margin-left: 4px;
  }
	
	.pagination{
		text-align: right;
		margin-top: 24px;
	}
	.el-range-editor.el-input__inner {
    width: 350px;
	}
	.el-select{
		width: 130px;
	}
	.el-date-editor .el-range-separator {
	  width: auto; 
	}
	/* 去掉表格的最后一条线 */
	.table-no-line-wrap::before{
	  height: 0
	}
	.wait-online{
		color: #e6a23c;
	}

	.call-list-wrap /deep/ .el-date-editor .el-range-separator{
		padding: 0;
	}
</style>
