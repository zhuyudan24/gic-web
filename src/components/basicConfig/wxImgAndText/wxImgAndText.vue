<template>
	<div id="wrap">
		<div class="attention-textAndImg-wrap">
	    <div class="text-img-search clearfix">
				<span>选择图文（共{{totalCount}}条）</span>
				<div class="fl">
					<el-input
				    placeholder="请输入标题/作者"
				    prefix-icon="el-icon-search"
				    clearable
				    size="small"
				    class="search-input"
				    @keydown.enter.native="getSearchList"
				    v-model="searchText">
					</el-input>
					<!-- <el-button class="search-btn" type="primary">查询</el-button> -->
				</div>
			</div>
			<div class="pic-list-box" v-loading="loading">
				<el-table
			    ref="multipleTable"
			    :data="tableData3"
			    tooltip-effect="dark"
			    style="width: 100%"
			    class="card-table table-no-line-wrap"
			    @current-change="handleCurrentChangeTable">
				  <el-table-column label="" width="55">
			      <template slot-scope="scope">
              <el-radio class="radio-style" v-model="radio" :label="scope.row.imageTextId">
              	&nbsp;
              </el-radio>
            </template>
				  </el-table-column>
			    <el-table-column
			      label="创建时间"
			      width="300">
			      <template slot-scope="scope">
			      	<p>{{ scope.row.itemList[0].createTime | dateFormat('YYYY-MM-DD') }}</p>
			      	<p>{{ scope.row.itemList[0].createTime | dateFormat('hh:mm:ss') }}</p>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="图文"
			      width="300">
			      <template slot-scope="scope">
			      	<div class="list-img">
			      		<img :src="scope.row.itemList[0].qcloudImageUrl" alt="">
			      	</div>
			      </template>
			    </el-table-column>
			    <el-table-column
			      prop="address"
			      label="图文详情"
			      show-overflow-tooltip>
			      <template slot-scope="scope">
			      	<p v-for="item in scope.row.itemList">{{item.titleName}}</p>
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
	import { dateFormat } from '../../../common/js/filter'
	let qs = require('qs')
  export default {
	  name: "public_attention_textAndImg",
	  data(){
	  	return {
	  		searchText: '',
	  		tableData3: [],
	      totalCount:null,
	      currentPage:1,
	      pageSize:20,
	      radio:'',
	      loading:false,
	      getSearch:false
	  	}
	  },
    created(){
    	// console.log(this.$parent);
    	if(this.$parent.imgAndTextRadio=='' || this.$parent.imgAndTextRadio == undefined){
    		
    	}else{
    		this.radio = this.$parent.imgAndTextRadio;
    	}
    },
	  mounted(){
	  	this.getImgTextData(this.currentPage,this.pageSize)
	  },
	  methods:{
	  	getImgTextData(page,size){		//  获取图文列表
	  		var self = this;
	  		self.loading=true;
	  		self.getSearch=false;
	      self.axios.post('/api-admin/load-image-text-data',qs.stringify({
	      	requestProject:'gic-web',
	      	currentPage:page,
	      	pageSize:size
	      })).then(res=>{
	        var data = res.data;
	        if(data.errorCode==0){
	        	self.loading=false;
	        	self.totalCount=data.result.totalCount;
	        	self.tableData3=data.result.result;
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
	  		this.radio = val.itemList[0].imageTextId;
	  		console.log(this.radio);
	  		this.$emit('listenWxImgAndText',this.radio)
	    },
	    handleSizeChange(val){		// 每页多少条
	    	this.pageSize = val;
	    	if(this.getSearch){
	    		this.getSearchList(this.currentPage,this.pageSize)
	    	}else{
	    		this.getImgTextData(this.currentPage,this.pageSize);
	    	}
	  	},
	  	handleCurrentChange(val) {	// 当前页
	  		this.currentPage = val;
	    	if(this.getSearch){
	    		this.getSearchList(this.currentPage,this.pageSize)
	    	}else{
	    		this.getImgTextData(this.currentPage,this.pageSize);
	    	}
	  	},
	  	getSearchList(page,size){		// 获取搜索的图文列表
	  		var self = this;
	  		self.loading=true;
	  		self.getSearch=true;
	  		self.currentPage=1;
	  		self.pageSize=20;
	      self.axios.post('/api-admin/load-image-text-data',qs.stringify({
	      	requestProject:'gic-web',
	      	searchName:self.searchText,
	      	currentPage:self.currentPage,
	      	pageSize:self.pageSize
	      })).then(res=>{
	        var data = res.data;
	        if(data.errorCode==0){
	        	self.loading=false;
	        	if(data.result.result==null){
	        		self.tableData3=[];
	        		self.totalCount=0
	        	}else{
	        		self.tableData3=data.result.result;
	        		self.totalCount=data.result.totalCount;
	        		console.log(data.result.result)
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
  	// max-height: 605px;
		border: 1px solid #e7e7eb;
	.text-img-search {
    margin: 12px 15px;
    font-size: 14px;
    color: #292929;
    line-height: 32px;
    > span{
    	float: left;
    	margin-right: 10px;
    }
    .search-input{
    	width: 180px;
    }
    .search-btn{
    	margin-left: 4px;
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
				top: 42px;
			}
		}
	}
}
  .pagination{
		text-align: right;
		margin: 30px 0 36px 0;
	}
	.pic-list-box /deep/ .el-table__row{
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
</style>
