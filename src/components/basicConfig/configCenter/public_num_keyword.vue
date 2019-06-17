<template>
	<div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="keyword-wrap">
		    	<div class="old-wrap">
		    		<el-form ref="form" :model="form" label-position="left" label-width="80px">
				      <el-form-item label="是否开启">
							  <el-switch @change="openSwitch" v-model="form.delivery"></el-switch>
							</el-form-item>
							<div class="search">
				    		<el-input clearable @keydown.enter.native="searchKeyword" class="input-search" placeholder="请输入关键字/规则名称" prefix-icon="el-icon-search" v-model="form.inputValue"></el-input>
								<el-button @click="handleAdd" class="search fr" type="primary">添加回复</el-button>
				    	</div>
						</el-form>
						<div class="keyword-list-wrap">
							<el-table
								class="table-no-line-wrap"
					      :data="tableData"
					      v-loading="loading"
					      style="width: 100%">
					      <el-table-column
					        prop="messageName"
					        label="规则名称"
					        width="300">
					        <template slot-scope="scope">{{scope.row.messageName}}</template>
					      </el-table-column>
					      <el-table-column
					        prop="keyword"
					        label="关键词"
					        width="300">
					        <template slot-scope="scope">{{scope.row.keyword}}</template>
					      </el-table-column>
					      <el-table-column
					        prop="messageContent"
					        label="回复内容">
					        <template slot-scope="scope">
					        	<p v-show="scope.row.backType==0">微信文本</p>
					        	<p v-show="scope.row.backType==3">微信图文</p>
					        	<p v-show="scope.row.backType==4">微信图片</p>
					        	<p v-show="scope.row.backType==5">卡券</p>
					        </template>
					      </el-table-column>
					      <el-table-column
					        label="操作"
					        width="200">
					        <template slot-scope="scope">
										<el-button type="text" @click="handleEdit(scope.row.messageId)">编辑</el-button>
										<delete-tip @confirm="handleDelete(scope.$index, scope.row.messageId)" tips="确定删除该规则吗?">
											<el-button type="text">删除</el-button>
										</delete-tip>
						        <!-- <el-button type="text" @click="handleDelete(scope.$index, scope.row.messageId)">删除</el-button> -->
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
				      	:page-size="20"
				      	layout="total, sizes, prev, pager, next"
				      	:total="totalCount">
					    </el-pagination>
						</div>
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
    name: "public_num_keyword", 
    data(){
    	return {
    		bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
	          name: '配置中心',
	          path: ''
	        },
	        {
	          name: '公众号配置',
	          path: ''
	        },
          {
            name: '关键字回复',
            path: ''
          }
      	],
        tableData: [],
        form: {
    			inputValue:'',
          delivery: true
        },
        totalCount:null,
        loading:false,
        currentPage:1,
        pageSize:20,
        addKeywordLength:1
    	}
    },
    mounted(){
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
	    this.getKeywordData();
	    this.getKeywordList(this.currentPage,this.pageSize)
	  },
    methods: {
    	getKeywordData(){		// 获得关键字回复的初始状态
    		var self = this;
	      self.axios.post('/api-admin/keyword-message',qs.stringify({
	      	requestProject:'gic-web'
	      })).then(res=>{
	        var data = res.data;
	        // console.log(data);
	        if(data.errorCode==0){
	          self.form.delivery=data.result.isOpen;
	        }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
    	getKeywordList(page,size){		// 获得关键字回复的列表
    		var self = this;
    		// console.log(self.form.inputValue);
    		self.loading = true;
	      self.axios.post('/api-admin/keyword-message-list',qs.stringify({
	      	requestProject:'gic-web',
	      	currentPage:page,
	      	pageSize:size,
	      	search:self.form.inputValue
	      })).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	self.loading = false;
	        	self.totalCount = data.result.totalCount;
	          self.tableData = data.result.result
	        }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
    	searchKeyword(){	// 搜索关键字
    		this.currentPage = 1;
    		this.pageSize = 20;
    		this.getKeywordList(this.currentPage,this.pageSize);
    	},
    	openSwitch(val){		// 是否开启关键字回复的按钮
    		console.log(val);
    		var self = this;
        self.$confirm('确定更换状态吗?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
        }).then(() => {
	        self.axios.post('/api-admin/turn-keyword-status',qs.stringify({
	        	requestProject:'gic-web',
		      	flag:val
		      })).then(res=>{
		        var data = res.data;
		        if(data.errorCode==0){
		        	self.$message({
		            type: 'success',
		            message: data.message
		        	});
		        }else{
	            self.$message({
	              type: 'error',
	              message: data.message
	            });
	          }
		      })
        }).catch(() => {
	        self.$message({
	            type: 'info',
	            message: '已取消'
	        });          
        });
    	},
	    handleSizeChange(val){		 // 选择分页符
    		this.pageSize = val;
    		this.getKeywordList(this.currentPage,this.pageSize)
    	},
    	handleCurrentChange(val) {
        this.currentPage = val;
    		this.getKeywordList(this.currentPage,this.pageSize)
	    },
	    handleDelete(index, id) {			// 删除规则
				var self = this;
				self.axios.post('/api-admin/delete-message',qs.stringify({
					requestProject:'gic-web',
					msgId:id
				})).then(res=>{
					var data = res.data;
					if(data.errorCode==0){
						self.tableData.splice(index,1);
						self.totalCount--;
						self.$message({
							type: 'success',
							message: data.message
						});
					}else{
						self.$message({
							type: 'error',
							message: data.message
						});
					}
				})
	    },
	    handleAdd() {			// 添加
        this.$router.push({
					path:'/public_keyword_add',
					query:{
						msgId:''
					}
				})
			},
      handleEdit(id) {			// 编辑
        this.$router.push({
					path:'/public_keyword_add',
					query:{
						msgId:id
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
    .keyword-wrap{
    	.search{
			.input-search{
		    	width: 220px;
		    }
		    button{
		    	margin-left: 4px;
		    }
		}
		.keyword-list-wrap{
			padding-top: 22px;
		}
		.add-reply-wrap{
			.text-content{
				width: 500px;
			}
			.keyword-input{
      	position: relative;
      	width: 420px;
        .text-num{
          position: absolute;
          right: 15px;
          bottom: 0;
          color: #ccc
        }
      }
      .operate-btn{
      	height: 36px;
      	line-height: 36px;
      	font-size: 14px;
      	padding-left: 10px;
      	color: #1890ff;
      	b{
      		cursor: pointer;
      		padding-right: 5px;
      	}
      }
		}
  }
  /* 去掉表格的最后一条线 */
	.table-no-line-wrap::before{
	  height: 0
	}
</style>
