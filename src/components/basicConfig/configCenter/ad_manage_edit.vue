<template>
  <div class="right-wrap ad-manage-wrap">
	  <topNav v-if="!specialBool" :navpath="navpath"></topNav>
	  <topNav v-else :navpath="navpathspecial"></topNav>
	  <div class="right-content bottom-wrap">
	  	<div class="right-box bottom-content-wrap">
	  		<el-form ref="form" :model="form" label-position="right" label-width="100px">
	  			<el-form-item label="上传图片">
						<div class="upload-content">
				 			<div v-if="dialogImageUrl" class="default-img-wrap" >
				 				<img :src="dialogImageUrl" class="default-img">
				 				<div class="operate-btn-wrap">
				 					<i @click="showBigImg" class="el-icon-zoom-in"></i>
				 					<i @click="deleteDefaultImg" class="el-icon-delete" style="margin-left:10px;"></i>
				 				</div>
				 			</div>
				 			<el-upload
				 				v-else
							  class="avatar-uploader"
							  :class="{'hide':hideUpload}"
							  action="123"
							  ref="uploadImg"
							  name="picFile"
								:show-file-list="false"
							  :before-upload="beforeImgUpload"
							  :on-preview="handlePictureCardPreview"
							  :on-success="handleAvatarSuccess"
  							:on-remove="handleRemove">
  							<!-- <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar"> -->
							  <i class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<p>请上传规格为750*220的图片</p>
							<el-dialog :visible.sync="dialogVisible">
							  <img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
				 		</div>
				  </el-form-item>
				  <el-form-item label="链接地址" prop="style" >
            <el-radio-group v-model="form.style">
              <el-radio label="2">网址</el-radio>
              <el-radio label="1">内部链接</el-radio>
            </el-radio-group>
        	</el-form-item>
        	<el-form-item v-show="form.style=='2'" label="网页地址" prop="webUrl">
            <div class="menu-item">
              <el-input v-model="form.webUrl" class="menu-input"></el-input>
              <p class="tip-text-wrap">订阅者点击该子菜单会跳到以下链接</p>
            </div>
          </el-form-item>
          <el-form-item v-show="form.style=='1'" label="内部地址" prop="webUrl">
            <innerUrl @sendRightUrl="getRightUrl" @sendLeftUrl="getLeftUrl" @sendShopData="getShopData" :menuCode="menuCode"></innerUrl>
          </el-form-item>
          <el-form-item label="" >
            <el-button @click="saveManage" type="primary">保 存</el-button>
          </el-form-item>
	  		</el-form>
	  	</div>
	  </div>
   <vue-gic-footer></vue-gic-footer>
	</div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import innerUrl from 'components/innerUrl/innerUrl'
	let qs = require('qs')
  export default {
    name: "ad_manage_edit",
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
	          name: '通用广告位',
	          path: '/ad_manage_common'
	        },
	        {
	          name: '编辑轮播图',
	          path: ''
	        }
	     	],
	     	navpathspecial: [
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
	          path: '/ad_manage_special'
	        },
	        {
	          name: '编辑特例',
	          path: '/ad_add_special'
	        },
	        {
	          name: '编辑轮播图',
	          path: ''
	        }
	     	],
	     	form: {
          style:'2',
          webUrl: '',
          innerUrl: ''
        },
        dialogImageUrl: '',
        dialogVisible: false,
        hideUpload:false,
        imageFiledCode:'',  // 图片上传成功之后的编码
        qcloudImageUrl:'',

        menuCode:'',
        precode:'',		// 选择内链的参数
		  	nextcode:'',
		  	intvSort:null,	// 当前广告的序列号
		  	urlPara:'',
		  	intervalServiceId:'',
		  	serviceCaseId:'',		// 编辑的时候有
		  	carTab:2,	// 特例 还是 通用
		  	specialBool:false
    	}
    },
    mounted(){
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
    	this.getEditBanner();		// 编辑轮播图时的数据
    },
    methods:{
    	getEditBanner(){
    		this.serviceCaseId = this.$route.query.serviceCaseId;	// 编辑的时候有
    		this.carTab = this.$route.query.carTab;	// 2 通用 3 特例
    		this.intervalServiceId = this.$route.query.intervalServiceId;
    		if(this.carTab==3){
    			this.specialBool = true;
    			if(this.intervalServiceId){  // 编辑特例
	    			this.navpathspecial[3].path="/ad_add_special?intervalServiceId="+this.intervalServiceId;
	    		}
    		}else if(this.carTab==2){
    			this.specialBool = false;
    			if(!this.serviceCaseId){
    				this.navpath[3].name = '添加轮播图'
    			}
    		}
    		var serviceType = this.$route.query.serviceType;
    		this.intvSort = this.$route.query.intvSort;
    		if(this.serviceCaseId==undefined){		
    			this.serviceCaseId = ''
    		}
    		this.axios.post('/api-admin/update-interval-service',qs.stringify({
    			requestProject:'gic-web',
		  		intervalServiceId:this.intervalServiceId,
		  		intvSort:this.intvSort,
		  		serviceCaseId:this.serviceCaseId,
		  		serviceType:serviceType
		  	})).then((res)=>{
		  		var data = res.data;
		  		console.log(data);
		  		if(data.errorCode==0){
		  			if(this.serviceCaseId==""){		// 添加 轮播图
    					
		    		} else {			// 编辑
		    			var editData = data.result.entity;
		    			this.dialogImageUrl=editData.qcloudImageUrl;
		    			this.qcloudImageUrl = editData.qcloudImageUrl;
		    			this.form.style=editData.intvType.toString();
		    			this.imageFiledCode=editData.imageFieldCode;

		    			if(this.form.style=='1'){		// 内链
			    			this.menuCode = editData.contentCode;		
		    				this.urlPara = editData.urlParam;		// 门店详情的门店id
		    			}
		    			if(this.form.style=='2'){		// 网址
		    				this.form.webUrl = editData.contentUrl
		    			}
		    		}
		  		}else{
		  			this.$message({
              type: 'error',
              message: data.message
            });
		  		}
		  	})
    	},
     	beforeImgUpload(picFile){		// 上传之前
        // console.log(picFile);
        let fd = new FormData();
        fd.append('picFile', picFile);
        fd.append('requestProject', 'gic-web');
        this.axios.post('/api-admin/pic-save', fd).then((res)=> {//成功后回调
          var data = res.data;
          console.log(data);
          // this.hideUpload = true;
          if(data.errorCode==0){
            this.qcloudImageUrl = data.result.qcloudImageUrl;
            this.imageFiledCode = data.result.imageFiledCode;
            this.dialogImageUrl = data.result.qcloudImageUrl;
            this.$message({
              type:'success',
              message:'上传成功'
            })
          } else {
          	this.qcloudImageUrl = '';
            this.imageFiledCode = '';
            this.dialogImageUrl = '';
            this.$message({
              type:'error',
              message:data.message
            })
          }
        });
        return true
	    },
	    handleAvatarSuccess(res,picFile){	// 上传成功
	    	
	    // 	console.log(res);
	    // 	if(res.errorCode==0){
	    // 		this.imageFiledCode=res.result.imageFiledCode;
	    // 		this.qcloudImageUrl = res.result.qcloudImageUrl;
	    // 	}
	    },
      handleRemove(picFile, fileList) {	// 移除图片
        console.log(picFile, fileList);	
        this.hideUpload = false;
        this.dialogImageUrl = '';
      	this.imageFiledCode = '';
      	this.qcloudImageUrl = '';
      },
      handlePictureCardPreview(picFile) {	// 放大图片
        this.dialogImageUrl = picFile.url;
        this.dialogVisible = true;
      },
      deleteDefaultImg(){		// 删除掉初始化的图片
      	this.dialogImageUrl = '';
      	this.qcloudImageUrl = ''
      	this.imageFiledCode = '';
      },
      showBigImg(){		// 放大图片
      	this.dialogVisible = true;
      },
      getLeftUrl(data){
        console.log(data);
        this.precode = data
      },
      getRightUrl(data){
        // console.log(data);
        this.nextcode = data;
      },
      getShopData(data){    // 获取选择的门店id
        this.urlPara=data;
        console.log(this.urlPara);
      },
      saveManage(){		// 保存
      	console.log(this.imageFiledCode);
      	if(this.imageFiledCode=="" || this.imageFiledCode==undefined){
      		this.$message.error('请上传图片');
      		return;
      	}
      	if(this.form.style=='2'){
      		if(this.form.webUrl==""){
      			this.$message.error('请输入网页地址');
      			return;
      		}else{
      			if(this.form.webUrl.indexOf('http://')==-1 && this.form.webUrl.indexOf('https://')==-1){
      				this.$message.error('请输入正确的网页地址');
      				return;
      			}
      		}
      	}
      	if(this.form.style == '1'){ // 内链
          if(this.precode=='12'){       // 门店  
            this.nextcode = 'store_detail';
            if (this.urlPara=="" || this.urlPara==undefined) {
              this.$message.error('请选择门店');
              return;
            }
          }else{
            if(this.nextcode=='' || this.nextcode==undefined){
              this.$message({
                type:'error',
                message:'请选择内部链接'
              })
              return;
            }
            this.urlPara = '';     // 选择的门店id
          }
        }
        if(this.form.style != '1'){ 
          this.precode = '';
          this.nextcode = ''
        }
        var serviceType  = 0;
        if(this.carTab==2){
        	serviceType = 0;
        }else if(this.carTab==3){
        	serviceType = 1;
        }
      	this.axios.post('/api-admin/single-interval-service-save',qs.stringify({
      		requestProject:'gic-web',
		  		imageFieldCode:this.imageFiledCode,
		  		qcloudImageUrl:this.qcloudImageUrl,
		  		serviceType:serviceType,
		  		intvSort:this.intvSort,
		  		serviceCaseId:this.serviceCaseId,
		  		intvPositionType:0,
		  		intervalServiceId:this.intervalServiceId,
		  		intvType:parseInt(this.form.style),
		  		precode:this.precode,
		  		nextcode:this.nextcode,
		  		urlParam:this.urlPara,
		  		contentUrl:this.form.webUrl
		  	})).then((res)=>{
		  		var data = res.data;
		  		// console.log(data);
		  		if(data.errorCode==0){
		  			this.$message.success('保存成功');
		  			if(this.carTab == 2){
		  				this.$router.push('/ad_manage_common')
		  			}else if(this.carTab == 3){
		  				this.$router.push({
			  				path:'/ad_add_special',
			  				query:{
			  					intervalServiceId:this.intervalServiceId
			  				}
			  			})
		  			}
		  		}else{
		  			this.$message({
              type: 'error',
              message: data.message
            });
		  		}
		  	})
      }
    },
    components: {
     	topNav,
     	innerUrl
	  }
  }
</script>

<style lang="less" scoped>
	.bottom-content-wrap{
		padding: 24px;
		background: #fff;
		.img-tip{
			font-size: 12px;
			color: #909399;
			padding-left: 10px;
		}
		.menu-item{
			.menu-input{
				width: 450px;
			}
		}
	}
	.upload-content{
		> p{
			height: 36px;
			line-height: 36px;
			font-size: 12px;
			color: #b8b8b8
		}
		.default-img-wrap{
			width: 150px;
			height: 150px;
			border-radius: 6px;
			position: relative;
			.default-img{
				width: 100%;
				height: 100%;
				border-radius: 6px;
			}
			.operate-btn-wrap{
				position: absolute;
				width: 100%;
		    height: 100%;
		    border-radius: 6px;
		    left: 0;
		    top: 0;
		    cursor: default;
		    text-align: center;
		    color: #fff;
		    opacity: 0;
		    font-size: 20px;
		    line-height: 150px;
		    background-color: rgba(0,0,0,.5);
		    -webkit-transition: opacity .3s;
		    transition: opacity .3s;
		    > i {
		    	cursor: pointer;
		    }
		    &:hover{
		    	opacity: 1
		    }
			}
		}
	}
	.avatar-uploader{
		height: 152px;
	}
	.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
	    border-color: #1890ff;
		}
 	}
	.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
	}
	.avatar {
    width: 150px;
    height: 150px;
    display: block;
	}
	.upload-content .hide /deep/ .el-upload{
		display: none;
	}
	.upload-demo /deep/ .el-upload-list{
		width: 360px;
	}
	.tip-text-wrap{
		display: inline-block;
		font-size: 12px;
    color: #909399;
    padding-left: 5px;
	}
</style>
