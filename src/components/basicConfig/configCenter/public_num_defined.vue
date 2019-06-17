<template>
	<div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
      	<div class="defined-wrap">
		    	<div class="add-main-btn">
			    	<el-button type="primary" @click="addMenu('0')">新增主菜单</el-button>
			    </div>
		      <div class="defined-table-wrap">
		      	<div class="table-wrap">
		      		<ul class="table-title clearfix">
		      			<li class="clearfix">
		      				<p>主菜单序列</p>
		      				<p>子菜单序列</p>
		      				<p>菜单名称</p>
		      				<p>内容</p>
		      				<!-- <p>特例内容</p> -->
		      				<p>操作</p>
		      			</li>
		      		</ul>
		      		<ul class="table-content" v-loading="loading">
		      			<li class="first-list clearfix" v-for="(item,index) in tableData" :key="index">
		      				<p>
		      					<i @click="sortMenu(item.menu_id,1)" v-show="index!=0" class="el-icon-upload2"></i>
				        		<i @click="sortMenu(item.menu_id,-1)" v-show="index==0 || index!=0&&index!=(tableData.length-1)" class="el-icon-download"></i>
		      				</p>
		      				<p></p>
		      				<p>{{item.menu_name}}</p>
		      				<p>{{item.menuDetail}}</p>
		      				<!-- <p v-if="item.special_count!='/'">{{item.special_count}}</p>
		      				<p v-else>--</p> -->
		      				<p>
										<el-button @click="editMenu(item.menu_id)" type="text">编辑</el-button>
										<delete-tip @confirm="deleteParentMenu(index, item)" tips="确定删除该主菜单吗?">
											<el-button type="text">删除</el-button>
										</delete-tip>
		      					<!-- <el-button type="text" @click="deleteParentMenu(index, item)">删除</el-button> -->
		      					<el-button @click="addMenu(item.menu_id)" type="text">新增子菜单</el-button>
		      				</p>
		      				<ul v-show="item.subWechatMenuListDTO" >
		      					<li v-for="(childItem,idx) in item.subWechatMenuListDTO" class="second-list clearfix">
		      						<p></p>
				        			<p>
					        			<span v-show="item.subWechatMenuListDTO.length!=1">
					        				<i @click="sortMenu(childItem.menu_id,1)" v-show="idx!=0" class="el-icon-upload2"></i>
					        				<i @click="sortMenu(childItem.menu_id,-1)" v-show="idx==0 || idx!=0&&idx!=(item.subWechatMenuListDTO.length-1)" class="el-icon-download"></i>
					        			</span>
				        			</p>
				        			<p>{{childItem.menu_name}}</p>
				        			<p>{{childItem.menuDetail}}</p>
				        			<!-- <p v-if="childItem.special_count!='/'">{{childItem.special_count}}</p>
		      						<p v-else>--</p> -->
				        			<p>
												<el-button @click="editChildMenu(childItem.menu_id)" type="text">编辑</el-button>
												<delete-tip @confirm="deleteChildMenu(idx, childItem, item.subWechatMenuListDTO)" tips="确定删除该子菜单吗?">
													<el-button type="text">删除</el-button>
												</delete-tip>
				        				<!-- <el-button type="text" @click="deleteChildMenu(idx, childItem, item.subWechatMenuListDTO)">删除</el-button> -->
				        			</p>
		      					</li>
			        		</ul>
		      			</li>
		      		</ul>
		      		<div v-show="tableData.length<1" class="no-data-wrap">
	              <div class="no-data-icon" >
	                <img src="../../../../static/img/no-data_icon.png" alt="">
	              </div>
	              <p>暂无数据</p>
	            </div>
		      	</div>
		      </div>
					<div class="online-wx">
						<p v-show="isTrue=='1'">自定义菜单已于 {{ dateTime | dateFormat('YYYY-MM-DD hh:mm:ss') }} 进行编辑，暂未发布上线</p>
						<el-button @click="tongbu" type="primary">同步至微信菜单</el-button>
					</div>
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
    name: "public_num_defined",
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
            name: '自定义菜单',
            path: ''
          }
        ],
        tableData:[],
        loading:false,
        isTrue:'',		// 是否显示按钮处的提醒文字
        dateTime:'',	// 提醒文字的时间
    	}
    },
    mounted(){
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
    	this.getDefinedData()
    },
    methods: {
    	getDefinedData(){		// 获得自定义回复的数据
    		var self = this;
    		self.loading = true;
	      self.axios.post('/api-admin/menu-wechat-config-list',qs.stringify({
	      	requestProject:'gic-web'
	      })).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	self.loading = false;
	        	self.tableData = data.result.wechatMenuDTOList;
	        	self.isTrue = data.result.isTrue;
	        	self.dateTime = data.result.dateTime;
	        }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
	    },
	    sortMenu(id,type){			// 菜单序列的移动
	    	this.loading = true;
	    	this.axios.post('/api-admin/custom-menu-sort',qs.stringify({
	    		requestProject:'gic-web',
	    		mid:id,
	    		sortType:type
	    	})).then(res=>{
	        var data = res.data;
	        // console.log(data);
	        if(data.errorCode==0){
	        	this.loading = false;
	        	this.tableData = data.result;
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
		  changeRoute(route) {	// 路由跳转
	      this.$router.push(route);
	    },
			deleteParentMenu(index,row){				// 是否删除菜单
				this.axios.post('/api-admin/menu-wechat-config-del',qs.stringify({
					requestProject:'gic-web',
					menu_id:row.menu_id
				})).then(res=>{
					var data = res.data;
					// console.log(data);
					if(data.errorCode==0){
						this.tableData.splice(index,1);
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
		  deleteChildMenu(idx,row,table){		// 是否删除子菜单
		  	this.axios.post('/api-admin/menu-wechat-config-del',qs.stringify({
					requestProject:'gic-web',
					menu_id:row.menu_id
				})).then(res=>{
					var data = res.data;
					// console.log(data);
					console.log(this.tableData[index]);
					if(data.errorCode==0){
						table.splice(idx,1);
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
		  tongbu(){		// 同步至微信菜单
		  	this.axios.post('/api-admin/syc-wechat-menu',qs.stringify({
		  		requestProject:'gic-web',
		  		sycMemberFlag:'1'
		  	})).then((res)=>{
		  		var data = res.data;
		  		if(data.errorCode==0){
		  			this.isTrue = '';
		  			this.$message({
              type: 'success',
              message: data.message
            });
		  		}else{
		  			this.isTrue = '1';
		  			this.$message({
              type: 'error',
              message: data.message
            });
		  		}
		  	})
		  },
      editMenu(id){    // 编辑主菜单
        this.$router.push({
					path:'/public_defined_addmenu',
					query:{
						menu_id:id
					}
				})
      },
      editChildMenu(id){    // 编辑子菜单
        this.$router.push({
					path:'/public_defined_addmenu',
					query:{
						menu_id:id,
						p:id
					}
				})
      },
      addMenu(id){		// 新增菜单
      	this.$router.push({
					path:'/public_defined_addmenu',
					query:{
						parent_menu_id:id
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
	.defined-wrap{
		.add-main-btn{
			margin-bottom: 22px;
			text-align: right;
		}
		.defined-table i{
	    	cursor: pointer;
	    }
	    .online-wx{
	    	padding: 30px 0 10px 0;
	    	text-align: center;
	    	p{
	    		font-size: 14px;
	    		color: #e6a23c;
	    		padding-bottom: 15px;
	    	}
	    }
	}
	.defined-table-wrap{
		font-size: 14px;
		.table-wrap{
			width: 100%;
			li{
				p:first-child{
					width: 15%;
				}
				p:nth-child(2){
					width: 15%;
				}
				p:nth-child(3){
					width: 25%;
				}
				p:nth-child(4){
					width: 25%;
					padding-right: 10px;
					text-overflow: ellipsis;
   				overflow: hidden;
   				white-space: nowrap;
				}
				p:nth-child(5){
					width: 20%;
				}
				p:nth-child(6){
					width: 15%;
				}
			}
			.table-title{
				background: #f1f3f7;
				height: 44px;
				line-height: 44px;
				color: #909399;
				width: 100%;
				text-align: left;
				padding: 0 10px ;
				box-sizing: border-box;
			}
			.table-content{
				padding: 0 10px;
				color: #606266;
				width: 100%;
				box-sizing: border-box;
				li > p{
					height: 48px;
					line-height: 48px;
					border-bottom: 1px solid #ebeef5
				}
				i{
					cursor: pointer;
					font-size: 20px;
				}
			}
			li > p{
				float: left;
			}

		}
	}
    
</style>
