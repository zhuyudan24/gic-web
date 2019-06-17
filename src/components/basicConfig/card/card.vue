<template>
	<div id="wrap">
		<div class="attention-textAndImg-wrap">
	    <div class="text-img-search clearfix">
				<span>选择卡券（共{{totalCount}}条）</span>
				<div class="fl">
					<el-input
				    placeholder="请输入卡券名称搜索"
				    prefix-icon="el-icon-search"
				    class="search-input"
				    clearable
				    size="small"
				    @keydown.enter.native="getSearchList"
				    v-model="searchText">
					</el-input>
					<!-- <el-button class="search-btn" type="primary">查询</el-button> -->
					<p class="limit-text">领取限制>1的卡券不支持选择，系统已自动过滤</p>
				</div>
			</div>
			<div class="pic-list-box">
				<el-table
			    ref="multipleTable"
			    :data="tableData3"
			    class="card-table table-no-line-wrap"
			    tooltip-effect="dark"
			    style="width: 100%"
			    v-loading="loading"
			    @current-change="handleCurrentChangeTable">
			    <el-table-column label="" width="55">
			      <template slot-scope="scope">
              <el-radio class="radio-style" :label="scope.row.wechatCardId" v-model="radio">
              	&nbsp;
              </el-radio>
            </template>
			    </el-table-column>
					
			    <el-table-column
			      label="卡券名称">
			      <template slot-scope="scope">{{ scope.row.cardName }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="subName"
			      label="备注名">
			      <template slot-scope="scope">{{ scope.row.subName }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="cardLimit"
			      label="领取限制"
			      width="130">
			      <template slot-scope="scope">{{ scope.row.cardLimit }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="storeMode"
			      label="适用门店"
			      width="300">
			      <template slot-scope="scope">
			      	<p v-show="scope.row.storeMode==0">所有门店</p>
			      	<p v-show="scope.row.storeMode==1">部分分组</p>
			      	<p v-show="scope.row.storeMode==2">部分门店</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="couponStock"
			      label="库存"
			      width="130">
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
		      	:page-size="20"
		      	layout="total, sizes, prev, pager, next"
		      	:total="totalCount">
		    	</el-pagination>
	    	</div>
			</div>
	  </div>
	</div>
</template>

<script>
	let qs = require('qs')
  export default {
    name: "public_attention_textAndImg",
    data(){
    	return {
    		searchText: '',
    		tableData3: [],
        currentRow:null,
        radio:null,
        currentPage:1,
        pageSize:20,
        totalCount:null,
        loading:false,
        getSearch:false
    	}
    },
    created(){
    	// console.log(this.$parent);
    	if(this.$parent.cardRadio=='' || this.$parent.cardRadio == undefined){
    		
    	}else{
    		this.radio = this.$parent.cardRadio;
    	}
    },
    mounted(){
	  	this.getCardData(this.currentPage,this.pageSize)
	  },
    methods:{
    	getCardData(page,size){		// 获取卡券的数据
    		var self = this;
	  		self.loading=true;
	  		self.getSearch=false;
	      self.axios.post('/api-admin/load-card-data',qs.stringify({
	      	requestProject:'gic-web',
	      	currentPage:page,
	      	pageSize:size
	      })).then(res=>{
	        var data = res.data;
	        if(data.errorCode==0){
	        	self.loading=false;
	        	self.totalCount=data.result.totalCount;
	        	self.tableData3=data.result.result
	        	// console.log(data.result.result)
	        }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
    	handleCurrentChangeTable(val) {	// 当前格发生变化时触发
    		this.radio = val.wechatCardId;
    		console.log(this.radio);
        this.$emit('listenWxCard',this.radio)
    	},
    	handleSizeChange(val){		// 选择分页符
    		this.pageSize = val;
    		if(this.getSearch){
	    		this.getSearchList(this.currentPage,this.pageSize)
	    	}else{
	    		this.getCardData(this.currentPage,this.pageSize)
	    	}
    	},
    	handleCurrentChange(val) {
       	this.currentPage = val;
    		if(this.getSearch){
	    		this.getSearchList(this.currentPage,this.pageSize)
	    	}else{
	    		this.getCardData(this.currentPage,this.pageSize)
	    	}
    	},
    	getSearchList(page,size){		// 获取搜索的卡券列表
	  		var self = this;
	  		self.loading=true;
	  		self.getSearch=true;
	  		self.currentPage=1;
	  		self.pageSize=20;
	      self.axios.post('/api-admin/load-card-data',qs.stringify({
	      	requestProject:'gic-web',
	      	cardName:self.searchText,
	      	currentPage:self.currentPage,
	      	pageSize:self.pageSize
	      })).then(res=>{
	        var data = res.data;
	        if(data.errorCode==0){
	        	self.loading=false;
	        	if(data.result.result==null){
	        		self.tableData3=[]
	        	}else{
	        		self.tableData3=data.result.result;
	        		self.totalCount=data.result.totalCount;
	        		// console.log(data.result.result)
	        	}
	        }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
	  	}
    }
  }
</script>

<style lang="less" scoped>
	#wrap{
		background: #fff;
	}
  .attention-textAndImg-wrap{
    	// max-height: 540px;
		border: 1px solid #e7e7eb;
		.text-img-search {
	    margin: 12px 15px;
	    font-size: 14px;
	    color: #292929;
	    // height: 36px;
	    line-height: 32px;
	    > span{
	    	float: left;
	    	margin-right: 10px;
	    }
	    .search-input{
	    	width: 200px;
	    }
	    .search-btn{
	    	margin-left: 4px;
	    }
	    .limit-text{
	    	color: #909399;
		    font-size: 12px;
		    line-height: 1;
		    padding-top: 4px;
		    display: inline-block;
		    margin-left: 10px;
	    }
		}
		.pic-list-box{
			.list-img{
				width: 80px;
				height: 80px;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.card-table{
				position: relative;
				.radio-style{
					position: absolute;
					left: 27px;
					top: 15px;
				}
			}
		}
  }
  .pagination{
		text-align: right;
		margin: 30px 0 36px 0;
	}
	.pic-list-box  .el-table__row{
  	cursor: pointer;
  }
  /* 去掉表格的最后一条线 */
	.table-no-line-wrap::before{
	  height: 0
	}

	.search-input /deep/ .el-input__inner::-webkit-input-placeholder {
	  font-size: 12px;
	}
	.search-input /deep/ .el-input__inner::-moz-input-placeholder {
	  font-size: 12px;
	}
	.search-input /deep/ .el-input__inner::-ms-input-placeholder {
	  font-size: 12px;
	}

	.card-table /deep/ .el-table__row{
		cursor: pointer;
	}
</style>
