<template>
  <div class="right-wrap ad-manage-wrap">
	  <topNav :navpath="navpath"></topNav>
	  <div class="right-content bottom-wrap">
	  	<div class="right-box bottom-content-wrap">
		  	<!-- 特例广告位 -->
	  		<div class="special-ad">
	  			<div class="operate-btn">
		  			<el-row>
		  				<el-button @click="deleteMany(multipleSelection)" type="danger" plain>批量删除</el-button>
		  				<el-button @click="editSpecial('')" type="primary">新增特例</el-button>
		  			</el-row>
	  			</div>
	  			 <el-table
	  			 	class="table-no-line-wrap"
				    ref="multipleTable4"
				    :data="tableData4"
				    tooltip-effect="dark"
				    style="width: 100%"
				    v-loading="loading"
				    @selection-change="handleSelectionChange">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
				      prop="zIndex"
				      label="权重"
				      width="300">
				      <template slot-scope="scope">{{scope.row.serviceWeight}}</template>
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="组别名称">
				      <template slot-scope="scope">{{scope.row.serviceName}}</template>
				    </el-table-column>
				    <el-table-column
				      prop="operate"
				      label="操作"
				      width="300">
				      <template slot-scope="scope">
								<el-button @click="editSpecial(scope.row.intervalServiceId)" type="text">编辑</el-button>
								<delete-tip @confirm="deleteSigle(scope.$index, scope.row.intervalServiceId)" tips="确定删除选中的数据?">
									<el-button type="text">删除</el-button>
								</delete-tip>
				      	<!-- <el-button @click="deleteSigle(scope.$index, scope.row.intervalServiceId)" type="text">删除</el-button> -->
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
	  <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import fiveBannerNew from 'components/basicConfig/fiveBanner/fiveBannerNew'
	let qs = require('qs')
  export default {
    name: "ad_manage_special",
    data(){
    	return{
    		bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '配置中心',
            path: ''
          },
	        {
	          name: '广告位管理',
	          path: ''
	        },
	        {
	          name: '特例广告位',
	          path: ''
	        }
	      ],
	      activeitem: 2,
	      tableData3: [{},{},{},{},{}], 	// 通用广告位的5个轮播图
	      tableData4: [],		// 特例广告位
	      dialogVisible: false,		// 位置弹框
	      showImgUrl: '',					// 图片链接

        multipleSelection: [],		// 多选  选中的内容

	      totalCount:0,
	      currentPage:1,		// 分页符的当前页
	      pageSize:20,
	      loading:false,
	      totalSpecialId:[],
    	}
    },
    computed:{
    	lunboLength(){
    		var l = this.tableData3.length-1;
    		return l
    	}
    },
    mounted(){
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
    	this.getSpecialData(this.currentPage,this.pageSize);
    },
    methods:{
    	getSpecialData(page,size){		// 获取特例广告位的数据
    		this.loading = true;
    		this.axios.post('/api-admin/ajax-interval-service',qs.stringify({
    			requestProject:'gic-web',
    			currentPage:page,
    			pageSize:size
    		})).then((res)=>{
		  		var data = res.data;
		  		// console.log(data);
		  		if(data.errorCode==0){
		  			this.loading = false;
		  			this.tableData4 = data.result.result;
		  			this.totalCount = data.result.totalCount;
		  			this.tableData4.forEach((data)=>{		// 获取所有的 intervalServiceId
		  				this.totalSpecialId.push(data. intervalServiceId)
		  			})
		  			
		  		}else{
		  			this.$message({
              type: 'error',
              message: data.message
            });
		  		}
		  	})
    	},
    	handleSelectionChange(rows) {	// 特例广告位的多选
        this.multipleSelection = rows;
      },
      handleSizeChange(val){		// 选择分页符
      	this.pageSize=val;
    		this.getSpecialData(this.currentPage,this.pageSize);
    	},
    	handleCurrentChange(val) {
        this.currentPage=val;
    		this.getSpecialData(this.currentPage,this.pageSize);
    	},
    	deleteSigle(index,id){	// 删除单条数据
    		this.axios.post('/api-admin/ajax-del-interval-service',qs.stringify({
					requestProject:'gic-web',
					intervalServiceId:id
				})).then((res)=>{
					var data = res.data;
					// console.log(data);
					if(data.errorCode==0){
						this.tableData4.splice(index, 1);
						this.totalCount--;
						if(this.tableData4.length==0){
							if(this.currentPage>1){
								this.getSpecialData(this.currentPage-1,this.pageSize);
							}
						}
						this.$message({
							type: 'success',
							message: data.message
						});
					}else{
						this.$message({
							type: 'error',
							message: data.message
						});
					}
				})
    	},
    	deleteMany(rows){		// 批量删除
    		var ids = [];			// 获得选中要删除的id
    		rows.forEach( (row) => {
    			ids.push(row.intervalServiceId)
    		})
    		var intervalServiceIds = ids.join(","); // 转字符串

    		if(this.multipleSelection==''){
    			this.$message.warning('请选择要删除的数据');
    		}else{
    			this.$confirm('确定删除选中的数据?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	this.axios.post('/api-admin/ajax-del-intervals-service',qs.stringify({
	        		requestProject:'gic-web',
	        		intervalServiceIds:intervalServiceIds
	        	})).then((res)=>{
				  		var data = res.data;
				  		// console.log(data);
				  		if(data.errorCode==0){
				  			this.getSpecialData(1,this.pageSize);
				  			this.$message({
		              type: 'success',
		              message: data.message
		            });
				  		}else{
				  			this.$message({
		              type: 'error',
		              message: data.message
		            });
				  		}
				  	})
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消删除'
	          });          
	        });
    		}
    	},
    	editSpecial(id){		// 编辑特例
    		this.$router.push({
    			path:'/ad_add_special',
    			query:{
    				intervalServiceId:id
    			}
    		})
    	}
    },
    components: {
     	topNav,
     	fiveBannerNew
	  }
  }
</script>

<style lang="less" scoped>
	.bottom-content-wrap{
		background: #fff;
    padding: 24px;
    .special-ad{
			.operate-btn{
				margin-bottom: 22px;
				text-align: right;
			}
			.pagination{
				text-align: right;
			}
    }
	}
	.five-banner-wrap{		// 通用广告位的5个轮播
  	.all-use-table{
    	.list-img{
    		width: 200px;
    		height: 59px;
    		img{
    			width: 100%;
    			height: 100%;
    		}
    	}
    }
  }
	.show-location-wrap{
		position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 22;
    background: rgba(0,0,0,.5);
    .show-location{
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	transform: translate(-50%,-50%);
	    width: 375px;
	    height: 731px;
	    border-radius: 2px;
	    background: url('../fiveBanner/credit_banner_popup.png') no-repeat;
	    background-size: 100% 100%;
	    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
	    .show-img{
				width: 375px;
				height: 110px;
				margin-top: 267px;
				img{
					width: 100%;
					height: 100%;
				}
	    }
    }
	}
	.table-no-line-wrap::before{	
	  height: 0
	}
</style>
