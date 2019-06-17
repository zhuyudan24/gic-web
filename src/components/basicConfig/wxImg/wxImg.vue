<template>
  <div class="wrap">
    <div class="attention-img-wrap">
    	<div class="attention-img-left">
    		<div class="add-group-btn">
    			<el-button @click="dialogFormVisible = true" type="text" icon="el-icon-plus">新建分组</el-button>
    		</div>
      	<ul class="clearfix">
      		<li @click="getAllGroupList('所有图片')" :class="{'active':currentIndex==-1}">
      			<span class="group-name">所有图片</span><span>({{totalImg}})</span></li>
      		<li @click="getGroupList(group.wechatImageGroupId,index,group.groupName)" :class="{'active':currentIndex==index}" v-for="(group,index) in imgGroup" :key="index">
      			<span class="group-name">{{group.groupName}}</span><span>({{group.imageCount==null?0:group.imageCount}})</span>
      		</li>
      		<!-- <li @click="dialogFormVisible = true"><i class="el-icon-plus"></i>新建分组</li> -->
      	</ul>
      </div>
      <div class="attention-img-right">
      	<div class="img-show-title clearfix">
      	<!-- {{imgGroup[currentIndex].groupName?imgGroup[currentIndex].groupName:"所有图片"}} -->
					<div class="fl" style="line-height:52px"><span ref="selectShowGroupName">{{showGroupName}}</span></div>
					<div class="fr">
						<div class="clearfix">
							<div class="fl gray-color" style="line-height:52px">
								<span>大小不超过5M</span>
							</div>
							<el-upload
							  class="fl"
							  action="123"
							  :show-file-list="false"
							  :before-upload="beforeImgUpload"
							  :on-success="handleImgSuccess"
							  :on-error="handleImgError">
							  <el-button type="primary" size="small" style="margin-top:10px">本地上传</el-button>
							</el-upload>

						</div>
					</div>
				</div>
				<div class="img-list-box" v-show="totalGroupImg!=0">
					<el-checkbox-group v-model="checkList">
						<ul class="img-list" v-loading="loading">
							<li @click.stop.prevent="selectImg(index,item.imageMediaId)" v-for="(item,index) in imgData" class="img-item" :title="item.imageTitle">
								<div class="img">
									<img :src="item.qcloudImageUrl">
								</div>
								<div class="check-icon">
									<el-checkbox :label="item.imageMediaId">{{item.imageTitle}}</el-checkbox>
								</div>
							</li>
						</ul>
					</el-checkbox-group>
					<div v-show="groupId==''&&totalImg>0" class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10]"
              :page-size="10"
              layout="total,sizes,prev, pager, next"
              :total="totalImg">
            </el-pagination>
        	</div>
        	<div v-show="groupId!=''&&totalGroupImg>0" class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10]"
              :page-size="10"
              layout="total,sizes,prev, pager, next"
              :total="totalGroupImg">
            </el-pagination>
        	</div>
				</div>
				<div v-show="groupId==''&&totalImg==0"  class="no-data-wrap">
          <div class="no-data-icon" >
            <img src="../../../../static/img/no-data_icon.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
        <div  v-show="groupId!=''&&totalGroupImg==0" class="no-data-wrap">
          <div class="no-data-icon" >
            <img src="../../../../static/img/no-data_icon.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    <!-- 新建分组的dialog -->
    <div class="add-new-group">
    	<el-dialog title="新建分组" :visible.sync="dialogFormVisible" width="500px">
			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
			    <el-form-item prop="groupName" label="分组名称">
			      <el-input v-model="ruleForm.groupName"></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="cancelAddGroup('ruleForm')">取 消</el-button>
			    <el-button type="primary" @click="sureAddGroup('ruleForm')">确 定</el-button>
			  </div>
			</el-dialog>
    </div>
  </div>
</template>

<script>
	let qs = require('qs')
  export default {
    name: "public_attention_img",
    data(){
    	return {
    		imgData:[],
    		imgGroup:[],
    		checkList: [],
    		currentIndex:-1,
    		currentPage:1,
    		pageSize:10,
    		groupId:'',
    		totalImg:null,
    		totalGroupImg:null,
    		loading:false,
    		showGroupName:'所有分组',
    		groupCount:null,
    		allCount:true,
    		dialogFormVisible:false,
    		ruleForm:{
    			groupName:'',
    		},
    		rules: {
    			groupName:[
            { required: true, message: '请输入分组名称', trigger: 'blur' }
          ]
    		}
    	}
    },
    created(){
    	// console.log(this.$parent.imgRadio);
    	if(this.$parent.imgRadio=='' || this.$parent.imgRadio == undefined){
    		
    	}else{
    		var imgRadioArr = this.$parent.imgRadio.split(',');
    		this.checkList = imgRadioArr;
    	}
    },
    mounted(){
    	this.getAllGroup();
    	this.getAllGroupList()
    },
    methods:{
    	getAllGroup(){		// 获得所有图片的分组
    		var self = this;
	      self.axios.post('/api-admin/wechat-image-group',qs.stringify({
	      	requestProject:'gic-web'
	      })).then(res=>{
	        var data = res.data;
	        if(data.errorCode==0){
	        	self.imgGroup = data.result.imgGroups;
	        }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
    	getAllGroupList(name){			// 点击之后获得所有图片分组下的图片列表
    		var self = this;
    		self.currentIndex = -1;
    		self.groupId = '';
    		self.loading=true;
    		if(name){
	      	self.showGroupName=name;
    		}
    		self.axios.post('/api-admin/ecm-images',qs.stringify({
    			requestProject:'gic-web',
	      	currentPage:self.currentPage,
	      	pageSize:self.pageSize,
	      	wechatImageGroupId:self.groupId
	      })).then(res=>{
	      	var data = res.data;
	      	if(data.errorCode==0){
	      		self.allCount = true;
	      		self.loading=false;
	      		self.totalImg=data.result.totalCount;
	      		self.imgData = data.result.result;
	      	}else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
    	getAllGroupCount(){			//  更新所有分组的数量
    		this.axios.post('/api-admin/ecm-images',qs.stringify({
    			requestProject:'gic-web',
	      	currentPage:self.currentPage,
	      	pageSize:self.pageSize,
	      	wechatImageGroupId:''
	      })).then(res=>{
	      	var data = res.data;
	      	if(data.errorCode==0){
	      		this.allCount = true;
	      		this.totalImg=data.result.totalCount;
	      		// this.totalGroupImg=data.result.totalCount;
	      	}else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
       	})
    	},
    	getGroupList(id,index,name){		// 点击之后获得各自分组下的图片列表
    		var self = this;
    		if(index>-1){
    			self.currentIndex=index;
    		}
    		if(name){
	      	self.showGroupName=name;
    		}
    		self.groupId = id;
    		// console.log(self.groupId);
    		self.loading=true;
	      self.axios.post('/api-admin/ecm-images',qs.stringify({
	      	requestProject:'gic-web',
	      	currentPage:self.currentPage,
	      	pageSize:self.pageSize,
	      	wechatImageGroupId:self.groupId
	      })).then(res=>{
	      	var data = res.data;
	      	if(data.errorCode==0){
	      		self.allCount = false;
	      		self.loading=false;
	      		self.totalGroupImg=data.result.totalCount;
	      		self.imgData = data.result.result;
	      		console.log(self.imgData)
	      	}else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
    	handleSizeChange(val){		// 选择分页符
    		console.log(`每页 ${val} 条`);
    	},
    	handleCurrentChange(val) {
        var self = this;
        self.axios.post('/api-admin/ecm-images',qs.stringify({
        	requestProject:'gic-web',
	      	currentPage:val,
	      	pageSize:self.pageSize,
	      	wechatImageGroupId:self.groupId
	      })).then(res=>{
	      	var data = res.data;
	      	if(data.errorCode==0){
	      		self.imgData = data.result.result;
	      	}else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
	    selectImg(index,id){					// 选择图片
	    	var checkLength = this.checkList.length;
	    	if(checkLength==1){
	    		if(id!=this.checkList[0]){
	    			this.checkList.splice(0,checkLength);
	    			this.checkList.push(id)
	    		}else{
	    			this.checkList.splice(0,checkLength);
	    		}
	    	}else{
	    		this.checkList.push(id)
	    	}
	    	var obj = this.checkList.join();
	    	// console.log(obj);
	    	this.$emit('listenWxImg',obj)
	    },	
	    beforeImgUpload(file){
	      const isLt5M = file.size / 1024 / 1024 < 5;
	      if (!isLt5M) {
	        this.$message.error('上传头像图片大小不能超过 5MB!');
	      }
        console.log(file);
        let fd = new FormData();
        fd.append('wechatImageGroupId', this.groupId); //随文件上传的其他参数
        fd.append('file', file);
        fd.append('requestProject', 'gic-web');
        this.axios.post('/api-admin/marketing-wechat-image-save', fd).then((res)=> {//成功后回调
        	var data = res.data;
        	console.log(data);
        	if(data.errorCode==0){
		      	// this.imgData.unshift(data.result);
		      	
		      	this.getAllGroup();				// 更新子分组的数量
		      	this.getAllGroupCount();		// 更新所有分组的数量
		      	this.getGroupList(this.groupId);	// 更新子分组的图片列表
		      	this.$message({
		      		type:'success',
		      		message:data.message
		      	})
		      } else {
		      	this.$message({
		      		type:'error',
		      		message:data.message
		      	})
		      }
        });
        return isLt5M || true
	    },
	    handleImgSuccess(res,file) {		// 文件上传成功
	      // console.log(file);
	    },
	    handleImgError(res){					// 文件上传失败
	    	// console.log(res);
			},
			cancelAddGroup(formName){
				this.dialogFormVisible = false;
				this.$refs[formName].clearValidate();
			},
	    sureAddGroup(formName){			// 新建图片分组
	    	this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/api-admin/marketing-wechat-image-group-add',qs.stringify({
		    			requestProject:'gic-web',
			    		groupName:this.ruleForm.groupName
			    	})).then((res)=>{
			    		var data = res.data;
			    		if(data.errorCode==0){
			    			this.dialogFormVisible = false;
			    			this.imgGroup.push(data.result);
			    			// console.log(this.imgGroup)
			    		} else {
			    			this.$message({
				      		type:'error',
				      		message:data.message
				      	})
			    		}
			    	})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
	    }
    }     
  }
</script>

<style lang="less" scoped>
	.attention-img-wrap{
		display: flex;
		max-height: 590px;
		border: 1px solid #e7e7eb;
		.attention-img-left{
	    	flex: 0 0 170px;
	    	width: 170px;
	    	max-height: 590px;
	    	overflow-y:auto;
	    	border-right: 1px solid #e7e7eb;
	    	ul{
	    		li{
	    			height: 42px;
				    line-height: 42px;
				    padding: 0 10px;
				    float: left;
				    font-size: 14px;
				    width: 100%;
				    cursor: pointer;
				    &.active{
				    	background: #f5f5f8;
				    }
				    span{
				    	display: inline-block;
				    }
				    .group-name{
				    	max-width: 105px;
				    	text-overflow: ellipsis;
   						overflow: hidden;
   						white-space: nowrap;
   						vertical-align: middle;
   						padding-right: 5px;
				    }
	    		}
	    	}
	    }
	    .attention-img-right{
	    	width: 100%;
	    	font-size: 14px;
	    	.img-show-title {
			    width: 100%;
			    height: 52px;
			    // line-height: 52px;
			    border-bottom: 1px solid #e7e7eb;
			    padding: 0 15px;
			    .gray-color{
			    	color: #909399;
			    	margin-right: 10px;
			    	font-size: 12px;
			    }
			}
			.img-list-box {
			    padding: 20px 15px 0 15px;
			    .img-list{
			    	> li{
			    		cursor: pointer;
			    	}
			    }
			    .img-item {
				    width: 164px;
				    height: 203px;
				    border: 1px solid #e7e7eb;
				    display: inline-block;
				    margin-right: 15px;
				    margin-bottom: 10px;
				    .img{
				    	width: 100%;
    					height: 163px;
    					img{
    						width: 100%;
    						height: 100%;
    					}
				    }
				    .gic-check {
					    margin-left: 10px;
					}
					.check-icon{
						padding: 0 10px;
						height: 35px;
    				line-height: 35px;
    				box-sizing: border-box;
    				text-overflow: ellipsis;
					  overflow: hidden;
					  white-space: nowrap;
					}
				}
			}
	    }
	}
	.no-data{
		text-align: center;
		padding-top: 30px;
	}
  .pagination{
    text-align: right;
    margin: 28px 0 12px 0;
  }
  .img-list /deep/ .el-checkbox__label{
		width: 117px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		vertical-align: middle;
  }
  .add-group-btn{
  	height: 52px;
  	line-height: 52px;
  	padding-left: 10px;
  	border-bottom: 1px solid #e7e7eb;
  }
  .add-group-btn /deep/ i,.add-group-btn /deep/ span{
  		font-weight: 500;
  }
  *{
	  box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  -webkit-box-sizing: border-box;
	  -o-box-sizing: border-box;
	}
</style>
