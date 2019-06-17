<template>
	<div class="five-banner-wrap">
		<el-table
	    ref="multipleTable3"
	    :data="tableData3"
	    tooltip-effect="dark"
	    style="width: 100%"
	    class="all-use-table table-no-line-wrap"
	    v-loading="loading"
	    :cell-class-name="firstColStyle"
	    :span-method="objectSpanMethod">
	    <el-table-column
	    	prop="adStyle"
	      label="广告位类型"
	      width="120">
	      <template slot-scope="scope">{{"轮播焦点图"}}</template>
	    </el-table-column>
			<el-table-column
	      prop="num"
	      label="位置编号"
	      width="100">
	      <template slot-scope="scope">
		      <div @click="toggleImgUrl(scope.row.qcloudImageUrl)" style="cursor:pointer">
		      	{{scope.$index + 1}}<i class="el-icon-location-outline"></i>
		      </div>
	      </template>
	    </el-table-column>
			<el-table-column
	    	prop="standard"
	      label="图片规格要求"
	      width="120">
	      <template slot-scope="scope">750*220</template>
	    </el-table-column>
	    <el-table-column
	      prop="img"
	      label="图片"
	      width="260">
	      <template slot-scope="scope">
	      	<div v-if="scope.row.qcloudImageUrl!=null && scope.row.qcloudImageUrl!='' && scope.row.qcloudImageUrl!=undefined" class="list-img">
	      		<img :src="scope.row.qcloudImageUrl" alt="">
	      	</div>
	      	<div v-else>--</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="urlStyle"
	      label="链接地址类型"
	      width="120">
	      <template slot-scope="scope">
	      	<p v-show="scope.row.intvType==1">内链</p>
	      	<p v-show="scope.row.intvType==2">网址</p>
	      	<p v-show="scope.row.intvType==3">图文</p>
	      	<p v-show="scope.row.intvType==null">--</p>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="url"
	      label="链接地址">
	      <template slot-scope="scope">
	      	<div v-if="scope.row.contentUrl!=null">
	      		{{scope.row.contentUrl}}
	      	</div>
	      	<div v-else>--</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="sort"
	      label="排序"
	      width="80">
	      <template slot-scope="scope">
	      	<i v-if="scope.$index!=lunboLength" @click="sortBanner(scope.row.intervalServiceId,1,scope.row.intvSort)" title="下移" class="sort-icon-all iconfont sort-icon-down icon-yd-icon-upload2"></i>
	      	<i v-if="scope.$index!=0" @click="sortBanner(scope.row.intervalServiceId,-1,scope.row.intvSort)" title="上移" class="sort-icon-all iconfont icon-yd-icon-upload2"></i>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="operate"
	      label="操作"
	      width="120">
	      <template slot-scope="scope">
	      	<el-button v-if="scope.row.contentUrl==null" @click="addBanner(scope.row.intervalServiceId,scope.row.intvSort)" type="text">添加</el-button>
					<el-button v-if="scope.row.contentUrl!=null" @click="editBanner(scope.row.intervalServiceId,scope.row.intvSort,scope.row.serviceCaseId)" type="text">编辑</el-button>
					<delete-tip @confirm="deleteBanner(scope.row,scope.$index,scope.row.serviceCaseId)" tips="确定删除选中的数据?">
						<el-button v-if="scope.row.contentUrl!=null" type="text">删除</el-button>
					</delete-tip>
	      	<!-- <el-button v-if="scope.row.contentUrl!=null" @click="deleteBanner(scope.row,scope.$index,scope.row.serviceCaseId)" type="text">删除</el-button> -->
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
	  <div class="show-location-wrap" @click="hideDialog" v-show="dialogVisible">
	  	<div class="show-location">
	  		<div class="show-img">
	  			<img :src="showImgUrl" alt="">
	  		</div>
	  	</div>
	  </div>
	</div>
</template>

<script>
	let qs = require('qs')
  export default {
    name: "five_banner",
    props:{
    	bannerData:{
    		type:Array,
    		default:[]
    	},
    	carTab:{
    		type:Number,
    		default:2
    	},
    	id:{
    		type:String,
    		default:""
    	},
    },
    data(){
    	return{
	      tableData3: [], 	// 通用广告位的5个轮播图
	      dialogVisible: false,		// 位置弹框
	      showImgUrl: '',					// 图片链接
	      loading:false,
    	}
    },
    watch:{
    	bannerData(val){
    		// console.log(val);
    		this.tableData3 = val;
    	}
    },
    created(){
    	this.tableData3 = this.bannerData
    },
    computed:{ 
    	lunboLength(){
    		var l = this.tableData3.length-1;
    		return l
    	}
    },
    methods:{
	    objectSpanMethod({ row, column, rowIndex, columnIndex }) {		// 合并单元格
	    	if (columnIndex === 0) {
          if (rowIndex % 5 === 0) {
            return {
              rowspan: 5,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      firstColStyle({row, column, rowIndex, columnIndex}){		// 为第一列添加样式：右线
      	// console.log(columnIndex);
      	// if(columnIndex == 0){	// 第一列添加 right-line 这个类
       //    return 'right-line'
       //  }
      },
      sortBanner(id,type,intvSort){		// 移动焦点图
      	// console.log(id);
      	this.axios.post('/api-admin/change-intv-sort',qs.stringify({
      		requestProject:'gic-web',
		  		intervalServiceId:id,
		  		addNum:type,
		  		intvSort:intvSort,
		  		menuType:1
		  	})).then((res)=>{
		  		var data = res.data;
		  		// console.log(data);
		  		if(data.errorCode==0){
		  			// this.getAdData('1');
		  			this.tableData3= data.result;
		  			this.$message({
	            type: 'success',
	            message: '移动成功'
	          });
		  		}else{
		  			this.$message({
              type: 'error',
              message: data.message
            });
		  		}
		  	})
      },
      toggleImgUrl(url){		// 切换显示图片
      	//console.log(url);
      	if(url){
      		this.showImgUrl = url;
      		this.dialogVisible = true;
      	}else{
      		this.$message.warning('你还没有添加图片，无法预览哦');
      	}
      },
      hideDialog(){				// 点击body隐藏
      	this.dialogVisible = false
      },
    	deleteBanner(row,index,id){				// 删除通用焦点图
    		this.axios.post('/api-admin/delete-single-case',qs.stringify({
					requestProject:'gic-web',
					serviceCaseId:id
				})).then((res)=>{
					var data = res.data;
					// console.log(data);
					if(data.errorCode==0){
						this.tableData3[index].qcloudImageUrl=null;
						this.tableData3[index].intvType=null;
						this.tableData3[index].contentUrl=null;
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
    	addBanner(id,intvSort){			// 添加
        console.log(id);
    		if(!id && this.carTab==3){  // 新增特例  添加
    			this.$message('请先保存权重哦');
    			return;
    		}
        if(id && this.carTab==3){ // 编辑特例 添加
          this.$router.push({
            path:'/ad_manage_edit2',
            query:{
              intervalServiceId:id,
              intvSort:intvSort,
              serviceType:0,
              carTab:this.carTab,
            }
          })
        }
        if(id && this.carTab==2){ // 通用 添加
          this.$router.push({
            path:'/ad_manage_edit',
            query:{
              intervalServiceId:id,
              intvSort:intvSort,
              serviceType:0,
              carTab:this.carTab,
            }
          })
        }
      	
      },
      editBanner(id,intvSort,serviceCaseId){			// 广告位  编辑 
        if(this.carTab==2){
          this.$router.push({
            path:'/ad_manage_edit',
            query:{
              intervalServiceId:id,
              intvSort:intvSort,
              serviceCaseId:serviceCaseId,
              serviceType:0,
              carTab:this.carTab
            }
          })
        }
      	if(this.carTab==3){
          this.$router.push({
            path:'/ad_manage_edit2',
            query:{
              intervalServiceId:id,
              intvSort:intvSort,
              serviceCaseId:serviceCaseId,
              serviceType:0,
              carTab:this.carTab
            }
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
	.five-banner-wrap{
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
    .sort-icon-all{
      font-size: 16px;
      color: #606266;
      display: inline-block;
      cursor: pointer;
    }
    .sort-icon-down{
      transform: rotate(180deg);
    }
  }
  .right-line{	// 没起作用
 		// border-right: 1px solid #ebeef5;
 	}
	.show-location-wrap{
		position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: rgba(0,0,0,.5);
    .show-location{
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	transform: translate(-50%,-50%);
	    width: 375px;
	    height: 731px;
	    border-radius: 2px;
	    background: url('credit_banner_popup.png') no-repeat;
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
	.five-banner-wrap /deep/ tbody tr:first-child td:first-child{
		border-right: 1px solid #ebeef5;
	}
	/* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
