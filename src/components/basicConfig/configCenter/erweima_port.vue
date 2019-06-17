<template>
	<div class="right-wrap erweima-content-box">
		<topNav :navpath="navpath"></topNav>
		<div class="right-content">
			<div class="right-box">
				<div class="erweima-content">
	    		<div class="search">
	    			<el-input clearable @keydown.enter.native="searchErweima" class="input-search" placeholder="请输入二维码组名" prefix-icon="el-icon-search" v-model="inputValue"></el-input>
					<el-button class="fr" type="primary" @click="addErweima">新建二维码组</el-button>
	    		</div>
	    		<div class="search-all">
	    			<el-table
	    				class="table-no-line-wrap"
					    :data="tableData"
					    id="tableId"
					    style="width: 100%"
					    v-loading="loading"
					    @sort-change="sortChange"
					    >
					    <!-- :default-sort = "{prop: 'updateTime', order: 'descending'}" -->
					    <el-table-column
					      prop="name"
					      label="二维码名称"
					      width="300">
					      <template slot-scope="scope">{{scope.row.groupName}}</template>
					    </el-table-column>
					    <el-table-column
					      prop="createTime"
					      label="创建时间"
					      sortable="custom">
					      <template slot-scope="scope">
					      	<p>{{scope.row.createTime | dateFormat('YYYY-MM-DD')}}</p>
					      	<p>{{scope.row.createTime | dateFormat('hh:mm:ss')}}</p>
					      </template>
					    </el-table-column>
					    <el-table-column
					      prop="updateTime"
					      label="最后更新时间"
					      sortable="custom">
					      <template slot-scope="scope">
					      	<p>{{scope.row.updateTime | dateFormat('YYYY-MM-DD')}}</p>
					      	<p>{{scope.row.updateTime | dateFormat('hh:mm:ss')}}</p>
					      </template>
					    </el-table-column>
					    <el-table-column label="操作">
					      <template slot-scope="scope">
					        <el-button
					          type="text"
										@click="editErweima(scope.row.id)">编辑</el-button>
									<delete-tip @confirm="deleteItem(scope.$index, scope.row,scope.row.id)" tips="确定删除该二维码吗?">
										<el-button type="text">删除</el-button>
									</delete-tip>
					        <!-- <el-button
					          type="text"
					          @click="deleteItem(scope.$index, scope.row,scope.row.id)">删除</el-button> -->
					          <el-button
					          type="text"
					          @click="downloadExl(scope.row.id,false)">导出Excel</el-button>
					        <el-button
					          type="text"
					          @click="downloadExl(scope.row.id,true)">导出最新</el-button>
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
	import topNav from 'components/nav/nav.vue'
	import { dateFormat } from '../../../common/js/filter'
	import excelConfig from '../../../common/js/excel_config.js'
	let qs = require('qs')
  export default {
    name: "erweima_port",
    data(){
    	return {
    		navpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '接口二维码',
            path: ''
          }
        ],
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		tableData: [],
    		inputValue:'',
    		totalCount:0,
    		currentPage:1,
    		loading:false,
    		pageSize:20,
    	}
    },
    mounted(){
    	this.getErweimaList(this.currentPage,this.pageSize,'');
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods:{
    	getErweimaList(page,size,sort){	// 获取二维码列表
    		this.loading = true;
    		this.axios.post('/api-admin/two-dimension-code-list',qs.stringify({
    			requestProject:'gic-web',
    			search:this.inputValue,
    			sort:sort,
    			currentPage:page,
    			pageSize:size
    		})).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	this.loading = false;
	          this.tableData = data.result.result;
	          this.totalCount = data.result.totalCount
	        }else{
	          this.$message({
	            type: 'error',
	            message: data.message
	          });
	        }
	      })
    	},
    	searchErweima(){		// 搜索二维码
    		this.currentPage = 1;
    		this.pageSize = 20;
	  		this.getErweimaList(this.currentPage,this.pageSize)
    	},
	    handleSizeChange(val){		// 选择分页符
	  		this.pageSize = val;
	  		this.getErweimaList(this.currentPage,this.pageSize)
	  	},
	  	handleCurrentChange(val) {
	      this.currentPage = val;
	  		this.getErweimaList(this.currentPage,this.pageSize)
	    },
	    sortChange(column){		// 后台排序		获取当前排序的字段名和排序顺序
	    	var sort = "";
	    	if(column.column){
	    		// console.log(column);
		    	var order = column.order;
		    	var prop = column.prop;
		    	if(order=='ascending'){order='asc'};
		    	if(order=='descending'){order='desc'};
		    	sort = prop+" "+order;
	    	}
	    	this.getErweimaList(this.currentPage,this.pageSize,sort)
	    },
	    changeRoute(route) {	// 切换路由
	      this.$router.push(route);
	    },
	    deleteItem(index, row,id) {	//  删除
	      // console.log(index, row);
	      this.axios.post('/api-admin/del-two-dimension-code',qs.stringify({
					requestProject:'gic-web',
					id:id
				})).then(res=>{
					var data = res.data;
					//console.log(data);
					if(data.errorCode==0){
						this.totalCount--;
						this.tableData.splice(index,1);
						if(this.tableData.length==0){
							if(this.currentPage>1){
								this.getErweimaList(this.currentPage-1,this.pageSize)
							}
						}
						//console.log(this.tableData);
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}else{
						this.$message({
							type: 'error',
							message: data.message
						});
					}
				})
	    },
	    downloadExl(id,bool) {		// 导出Excel
	    	this.axios.post('/api-admin/export-two-bar-code-list',qs.stringify({
	    		requestProject:'gic-web',
	    		groupId:id,
	    		isDynamic:bool
	    	})).then(res=>{
	    		var data = res.data;
	    		if(data.errorCode){		// 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
	        	this.$message({
	            type: 'error',
	            message: data.message
	          });
	        }else{
	        	window.location.href = excelConfig.config + '/api-admin/export-two-bar-code-list?requestProject=gic-web&groupId='+id+'&isDynamic='+bool;
	        }
	      })
	    },
			editErweima(id){
				this.$router.push({
					path:'/erweima_edit',
					query:{
						id:id
					}
				})
			},
			addErweima(id){
				this.$router.push('/erweima_edit')
			},
	  },
    components: {
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.erweima-content-box{
		// .bottom-box{
		// 	background: #fff;
		// 	padding: 24px;
		// }
		.erweima-content{
	    .search{
			.input-search{
		    	width: 180px;
		    }
		    button{
		    	margin-left: 4px;
		    }
			}
			.search-all{
				margin-top: 22px;
			}
			.pagination{
				text-align: right;
			}
		}
	}
	/* 去掉表格的最后一条线 */
	.table-no-line-wrap::before{
	  height: 0
	}
</style>
