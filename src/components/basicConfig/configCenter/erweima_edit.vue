<template>
  <div class="right-wrap erweima-content-box">
  	<topNav v-if="editOrAdd" :navpath="navpath"></topNav>
  	<topNav v-else :navpath="navpathedit"></topNav>
  	<div class="right-content">
  		<div class="right-box">
  			<div class="erweima-content">
	    		<div class="erweima-item-wrap">
		    		<div class="erweima-item">
		    			<div class="title">二维码组信息</div>
			    			<div class="erweima-info">
			    				<el-form ref="formBasic" :rules="rules" label-position="right" :model="editForm" label-width="110px" class="form-wrap">
			    					<el-form-item prop="name" label="二维码组名称" class="text-content">
											<div class="edit-input">
										    <el-input class="input-input" v-model="editForm.name" @keyup.native="toInput(editForm.name,$event)"></el-input>
										    <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
									    </div>
										</el-form-item>
										<el-form-item prop="validTime" label="有效时间" class="text-content" :class="{'is-error':errorBool1}">
											<el-input @change="formatInputChange($event,'time')" maxlength="10" class="input-input" v-model="editForm.validTime"></el-input>
											<!-- <el-input @keyup.native="onlyNumTime" maxlength="7" class="input-input" v-model="editForm.validTime"></el-input> -->
									     <p class="edit-tip">以秒为单位，最大不超过2592000（即30天），一天时间是86400秒</p>
									     <p v-show="errorBool1" class="el-form-item__error"> {{ errorMsg1 }} </p>
										</el-form-item>
										<el-form-item label="参数生成方式">
									    <el-radio-group @change="changeStyle" v-model="editForm.paraStyle">
									      <el-radio label="0">GIC生成</el-radio>
									      <el-radio label="1">商户告知</el-radio>
									    </el-radio-group>
										</el-form-item>
										<el-form-item prop="num" v-show="editForm.paraStyle==0" label="条数" class="is-required" :class="{'is-error':errorBool2}">
											<div class="edit-input">
												<el-input @change="formatInputChange($event,'count')" maxlength="3" class="input-input" v-model="editForm.num"></el-input>
										    <!-- <el-input @keyup.native="onlyNumCount" maxlength="3" class="input-input" v-model="editForm.num"></el-input> -->
									    </div>
									    <p v-show="errorBool2" class="el-form-item__error"> {{ errorMsg2 }} </p>
										</el-form-item>
										<el-form-item prop="upload" v-show="editForm.paraStyle==1" label="导入二维码" class="is-required" :class="{'is-error':errorBool3}">
											<el-upload
												class="upload-text"
											  action="/api-admin/import-two-dimension-code-list"
											  name="uploadFile"
											  :show-file-list="false"
											  :on-success="handleTextSuccess"
	  										:before-upload="beforeTextUpload">
											  <el-button size="small" type="primary">上传</el-button>
											</el-upload>
									    <el-button @click="downloadTpl" type="text">下载模板</el-button>
									    <span class="upload-name">{{ uploadName }}</span>
									    <p v-show="errorBool3" class="el-form-item__error"> {{ errorMsg3 }} </p>
										</el-form-item>
										<el-form-item label="请求地址" :class="{'add-erweima':!addErweima}">
									    <p class="request-url">{{editForm.url}}</p>
									    <el-button type="text" class="copy-btn"
								      	v-clipboard:copy="editForm.url"
								      	v-clipboard:success="onCopy"
								      	v-clipboard:error="onError">复制
									    </el-button>
										</el-form-item>
				    			</el-form>
			    			</div>
		    			</div>
	    			</div>
	    			<div class="height-24"></div>
		    		<div class="erweima-item-wrap">
			    		<div class="erweima-item">
			    			<div class="title">扫码事件信息</div>
				    			<div class="erweima-info">
				    				<el-form ref="form" label-position="right" :model="editForm" label-width="110px" class="form-wrap">
				    					<el-form-item label="参数生成方式" style="width:930px">
										    <el-checkbox-group v-model="editForm.eventParam">
										      <el-checkbox disabled label="A" name="type">OpenID</el-checkbox>
										      <el-checkbox disabled label="B" name="type">扫码时间</el-checkbox>
										      <el-checkbox disabled label="C" name="type">场景值</el-checkbox>
										      <el-checkbox label="E" name="type">姓名</el-checkbox>
										      <el-checkbox label="F" name="type">性别</el-checkbox>
										      <el-checkbox label="G" name="type">生日</el-checkbox>
										      <el-checkbox label="H" name="type">手机号码</el-checkbox>
										      <el-checkbox label="I" name="type" style="margin:0">会员卡号</el-checkbox>
										      <el-checkbox label="J" name="type">当前等级</el-checkbox>
										      <el-checkbox label="K" name="type">等级编码</el-checkbox>
										      <el-checkbox label="M" name="type">冻结积分</el-checkbox>
										      <el-checkbox label="N" name="type">储值余额</el-checkbox>
										      <el-checkbox label="L" name="type">可用积分</el-checkbox>
										    </el-checkbox-group>
											</el-form-item>
											<el-form-item label="推送地址" class="text-content">
												<el-input class="input-input" v-model="editForm.urlLink" ></el-input>
											  <p class="edit-tip">扫码事件推送的地址（不填则事件推送至GIC平台消息中心）</p>
											</el-form-item>
				    				</el-form>
			    				</div>
			    			</div>
		    			</div>
		    		<div class="btn-fixed-wrap">
			    		<el-row>
			    			<el-button @click="saveInfo('formBasic')" type="primary" size="small">保 存</el-button>
			  				<el-button @click="changeRoute('erweima')" size="small">返 回</el-button>
			    		</el-row>
		    		</div>
	    	</div>
  		</div>
  	</div>
  	<vue-gic-footer></vue-gic-footer>
  	<!-- <div class="footer">
	  	<vue-gic-footer></vue-gic-footer>
	  </div> -->
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import strLength from '../../../common/js/strlen'
	import excelConfig from '../../../common/js/excel_config.js'
	// import VueClipboard from 'vue-clipboard2'
	let qs = require('qs')
  export default {
    name: "erweima_edit",
    data(){
    	return {
    		bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '接口二维码',
            path: '/erweima'
          },
          {
            name: '新建二维码组',
            path: ''
          }
        ],
        navpathedit: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '接口二维码',
            path: '/erweima'
          },
          {
            name: '编辑二维码组',
            path: ''
          }
        ],
    		editForm:{
    			name:'',			// 二维码组名称
    			validTime:'',
    			paraStyle:'0',
    			eventParam:['A','B','C'],		// 扫码事件信息,
    			url:'',  // 请求地址
    			urlLink:'',		// 推送地址
    			num:'',		// 条数
    		},
    		rules: {
          name: [
            { required: true, message: '请输入二维码组名称', trigger: 'blur' }
          ],
          validTime: [
            { required: true, message: '请输入有效时间', trigger: 'blur' }
          ]
        },
    		editOrAdd:false,
    		addErweima:true,		// 编辑为true
				/*限制字符个数*/
        inputNum: 0, // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 20, // 限制最大字数
        erweimaId:'',
        qrCodeArray:'',		// 上传 返回的数据
        qrCodeArr:[],			// 上传之后code的数组

        uploadName:'',		// 上传的文件名

        saveBtnBool:true, // 保存按钮是否可用

        errorMsg1:'输入的数值不能低于最小限制',
        errorBool1:false,
        errorMsg2:'请输入条数',
        errorBool2:false,
        errorMsg3:'请上传二维码',
        errorBool3:false,
        countTrue:0,
    	}
    },
    mounted(){
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
    	this.getErweima()
    },
    methods:{
    	getErweima(){
    		var id = this.$route.query.id;
    		if(id){		// 编辑
      		this.editOrAdd=false;
      		this.addErweima = true;
      		this.erweimaId = id;
      		this.getEditUrl(id);
      		this.getEditErweima(id);
      	}else{		// 新增
      		this.erweimaId = '';
      		this.editOrAdd=true;
      		this.addErweima = false;
      		// this.getAddErweima();
      	}
    	},
    	getEditUrl(id){
    		this.axios.post('/api-admin/edit-two-dimension-code-page',qs.stringify({
    			requestProject:'gic-web',
    			id:id
    		})).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	this.editForm.url = data.result.getInterfaceQRcodeUrl;
	        }else{
	          this.$message({
	            type: 'error',
	            message: data.message
	          });
	        }
	      })
    	},
    	getEditErweima(id){	// 编辑
    		this.axios.post('/api-admin/load-two-dimension-code',qs.stringify({
    			requestProject:'gic-web',
    			id:id
    		})).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	var editData = data.result.data;
	        	this.editForm.name = editData.groupName;
	        	this.editForm.validTime = editData.effectiveDuration.toString();
						this.editForm.paraStyle = editData.paramWay.toString();
						this.editForm.urlLink = editData.scaningEventUrl;
						this.editForm.eventParam = editData.pushParams.split("");	
						if(this.editForm.paraStyle=="0"){		// gic生成
							this.editForm.num = editData.rqCount.toString();
						}else if(this.editForm.paraStyle=="1"){		// 商户告知
							var qrArr = editData.twoDimensionCodeInfoList;
							qrArr.forEach((item)=>{
								this.qrCodeArr.push(item.qrCode)
							})
							this.qrCodeArray = JSON.stringify(this.qrCodeArr)
						}
						var len = strLength.getZhLen(this.editForm.name);  // 规则名称的字符长度
            this.inputNum = len;
	        }else{
	          this.$message({
	            type: 'error',
	            message: data.message
	          });
	        }
	      })
    	},
    	getAddErweima(){	// 新增
    		this.axios.post('/api-admin/add-two-dimension-code-page',qs.stringify({
    			requestProject:'gic-web'
    		})).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	
	        }else{
	          this.$message({
	            type: 'error',
	            message: data.message
	          });
	        }
	      })
    	},
    	toInput(value,e) {  // 名称输入时控制字符数量
        var that = this;
        that.editForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.editForm.name);
      },
      onCopy(e) {		// 复制链接
      	//console.log(e.text);
      	this.$message({
	        message: '已复制到粘贴板',
	        type: 'success'
	      });
	    },
	    onError(e) {
	    	//console.log(e.text);
      	this.$message({
          message: '复制失败',
          type: 'error'
        });
	    },
	    changeRoute(route) {	// 切换路由
        this.$router.push(route);
      },
      beforeTextUpload(uploadFile) {
				//console.log(uploadFile.name.substr(uploadFile.name.length-3));
        const isCSV = uploadFile.name.substr(uploadFile.name.length-3) === 'csv';
        if (!isCSV) {
					this.$message.error('只能上传csv格式!');
					return;
        }
        let fd = new FormData();
        fd.append('uploadFile', uploadFile);
        fd.append('requestProject', 'gic-web');
        this.axios.post('/api-admin/import-two-dimension-code-list', fd).then((res)=> {//成功后回调
        	var data = res.data;
        	//console.log(data);
        	if(data.errorCode==0){
        		this.uploadName = uploadFile.name;
        		this.qrCodeArray = JSON.stringify(data.result);
        		this.errorBool3 = false;
		      	this.$message({
		      		type:'success',
		      		message:'上传成功'
		      	})
		      }else{
		      	this.$message({
		      		type:'error',
		      		message:data.message
		      	})
		      }
        });
        return isCSV || true
      },
      handleTextSuccess(res,uploadFile) {		// 文件上传成功
	      // console.log(file);
	    },
      downloadTpl(){		//  下载模板
      	this.axios.post('/api-admin/download-two-dimension-code-template',qs.stringify({
      		requestProject:'gic-web'
      	})).then(res=>{
	        // console.log(res);
	        if(res.errorCode){		// 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
	        	this.$message({
	            type: 'error',
	            message: data.message
	          });
	        }else{
	        	window.location.href = excelConfig.config + '/api-admin/download-two-dimension-code-template?requestProject=gic-web'
	        }
	      })
      },
      changeStyle(){
      	if(this.editForm.paraStyle == '0'){
      		if(parseInt(this.editForm.num)>0){
      			this.saveBtnBool = true;
      		}else{
	      		this.saveBtnBool = false;
	      	}
      	}
      	if(this.editForm.paraStyle == '1' && this.qrCodeArray){
      		if(this.qrCodeArray==''){
      			this.saveBtnBool = false;
      		}else{
      			this.saveBtnBool = true;
      		}
      	}
      },
      onlyNumTime(){		// 只能输入数字
      	this.editForm.validTime=this.editForm.validTime.replace(/\D/g,'');
      	if(this.editForm.validTime){	// 有效时间
        	if(parseInt(this.editForm.validTime)<1){
	      		this.errorMsg1 = '输入的数值不能低于最小限制';
	      		this.errorBool1 = true;
	      		this.saveBtnBool = false;
	      	} else if(parseInt(this.editForm.validTime)>2592000){
	      		this.errorMsg1 = '输入的数值不能超出最大限制';
	      		this.errorBool1 = true;
	      		this.saveBtnBool = false;
	      	} else{
	      		this.errorBool1 = false;
	      		this.saveBtnBool = true;
	      	}
        }
      },
      onlyNumCount(){		// 只能输入数字  条数
      	this.editForm.num = this.editForm.num.replace(/\D/g,'');
  	   	if(this.editForm.paraStyle == '0'){
      		if(this.editForm.num=='' || this.editForm.num==null){
      			this.errorMsg2 = '请输入条数';
      			this.errorBool2 = true;
	      		this.saveBtnBool = false;
      		}else if(parseInt(this.editForm.num)<1){
	      		this.errorMsg2 = '至少生成一条二维码';
	      		this.errorBool2 = true;
	      		this.saveBtnBool = false;
	      	}else{
	      		this.errorBool2 = false;
	      		this.saveBtnBool = true;
	      	}
      	}
      },
      formatInputChange(e,type){
        if(type=="time"){
          if(this.editForm.validTime){
            this.editForm.validTime = Number(String(e).replace(/[^\d]/g,'')) == 'NaN'? '1': Number(String(e).replace(/[^\d]/g,''));

            if(parseInt(this.editForm.validTime)<1){
		      		this.errorMsg1 = '输入的数值不能低于最小限制';
		      		this.errorBool1 = true;
		      		this.saveBtnBool = false;
		      	} else if(parseInt(this.editForm.validTime)>2592000){
		      		this.errorMsg1 = '输入的数值不能超出最大限制';
		      		this.errorBool1 = true;
		      		this.saveBtnBool = false;
		      	} else{
		      		this.errorBool1 = false;
		      		this.saveBtnBool = true;
		      	}
          }
        }else if(type=="count"){
        	if(this.editForm.num){
        		this.editForm.num = Number(String(e).replace(/[^\d]/g,'')).toFixed(2) == 'NaN'? '1': Number(String(e).replace(/[^\d]/g,''));
        		if(String(this.editForm.num)=='' || this.editForm.num==null){
	      			this.errorMsg2 = '请输入条数';
	      			this.errorBool2 = true;
		      		this.saveBtnBool = false;
	      		}else if(parseInt(this.editForm.num)<1){
		      		this.errorMsg2 = '至少生成一条二维码';
		      		this.errorBool2 = true;
		      		this.saveBtnBool = false;
		      	}else{
		      		this.errorBool2 = false;
		      		this.saveBtnBool = true;
		      	}
          }
        }
      },
      saveInfo(formName) {
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	if(parseInt(this.editForm.validTime)<1){
          		this.errorMsg1 = '输入的数值不能低于最小限制';
		      		this.errorBool1 = true;
          	}else if(parseInt(this.editForm.validTime)>2592000){
		      		this.errorMsg1 = '输入的数值不能超出最大限制';
		      		this.errorBool1 = true;
		      	}
          	if(this.editForm.paraStyle == '0'){
          		if(this.editForm.num){
          			if(!this.errorBool1 && !this.errorBool2 && parseInt(this.editForm.num)>0){
          				this.saveData();
          			}
          			if(parseInt(this.editForm.num)==0){
          				this.errorMsg2 = '至少生成一条二维码';
		      				this.errorBool2 = true;
          			}
          		}
          		if(String(this.editForm.num)==""){
          			this.errorMsg2 = '请输入条数';
	      				this.errorBool2 = true;
          		}
          	}
          	if(this.editForm.paraStyle == '1'){
          		if(this.qrCodeArray == ''){
			      		this.errorMsg3 = '请上传二维码';
			      		this.errorBool3 = true;
				      	this.saveBtnBool = false;
			      	}else{
			      		this.errorBool3 = false;
			      		this.saveBtnBool = true;
			      		if(!this.errorBool1 && !this.errorBool3){
			      			this.saveData();
			      		}
			      	}
          	}
          } else {
          	this.checkInputError();
            console.log('error submit!!');
            return false;
          }
        });
	    },
	    checkInputError(){
	    	if(this.editForm.paraStyle == '0'){
    			if(this.editForm.num=='' || this.editForm.num==null){
      			this.errorMsg2 = '请输入条数';
      			this.errorBool2 = true;
	      		this.saveBtnBool = false;
        	}else if(parseInt(this.editForm.num)<1){
        		this.errorMsg2 = '至少生成一条二维码';
        		this.errorBool2 = true;
	      		this.saveBtnBool = false;
        	}else{
        		this.errorBool2 = false;
        		this.editForm.num = parseInt(this.editForm.num);
        	}
        }else {
      		if(this.qrCodeArray == ''){
	      		this.errorMsg3 = '请上传二维码';
	      		this.errorBool3 = true;
		      	this.saveBtnBool = false;
	      	}else{
	      		this.errorBool3 = false;
	      		this.saveBtnBool = true;
	      	}
	      	this.editForm.num = null
	      }
	    },
	    saveData(){
	    	this.axios.post('/api-admin/update-two-dimension-code',qs.stringify({
        	requestProject:'gic-web',
    			id:this.erweimaId,
    			groupName:this.editForm.name,
    			effectiveDuration:parseInt(this.editForm.validTime),
    			paramWay:parseInt(this.editForm.paraStyle),
    			rqCount:this.editForm.num,
    			pushParams:this.editForm.eventParam.join(''),
    			qrCodeArray:this.qrCodeArray,
    			scaningEventUrl:this.editForm.urlLink
    		})).then(res=>{
	        var data = res.data;
	        console.log(data);
	        if(data.errorCode==0){
	        	this.$message.success('保存成功');
	        	this.$router.push('/erweima')
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
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
		padding: 0;
	}
	.erweima-content-box{
		.bottom-box{
			background: #fff;
			padding: 24px;
		}
		.erweima-content{
		    .erweima-item{
		    	font-size: 14px;
			    color: #606266;
			    font-weight: 500;
		    	.title{
		    		font-weight: 700;
		        color: #303133;
		        font-size: 16px;
		        padding-left: 32px;
		        border-bottom: 1px solid #e8e8e8;
		        border-radius: 2px 2px 0 0;
		        zoom: 1;
		        height: 56px;
		        line-height: 56px;
		    	}
		    	.erweima-info{
						padding: 24px 24px 1px 24px;
            .edit-input{
            	width: 450px;
            	position: relative;
            }
            .input-input{
	            width: 450px;
	          }
	          .tag-name-num{
	            position: absolute;
					    right: 10px;
					    bottom: 1px;
					    color: #c0c4cc;
					    font-size: 12px;
					    background: #fff;
					    height: 30px;
					    line-height: 32px;
					    padding-left: 10px;
	          }
            .request-url{
            	display: inline-block;
            }
		    	}
		    	.event-info{
		    		padding: 24px 24px 1px 24px;
		    	}
		    }
		    .edit-input{
		    	position: relative;
		    }
		    .edit-tip{
					font-size: 12px;
					color: #909399;
					padding-left: 5px;
					display: inline-block;
					// position: absolute;
    			// bottom: -30px;
		    }
		    
		}
	}
	.upload-name{
		padding-left: 10px;
		font-size: 12px;
    color: #909399;
	}
	.add-erweima{
		display: none;
	}
	.btn{
		margin-left: 108px;
	}
	.upload-text{
		display: inline-block;
		margin-right: 10px;
	}
	.form-wrap /deep/ .el-checkbox{
		width: 95px;
	}
	.footer{
    padding-bottom: 60px !important;
  }
	.height-24{
    width: 100%;
    height: 24px;
    background: #f0f2f5;
  }
  .form-wrap /deep/ .text-content.is-error .el-input__inner{
  	border-color: #f56c6c !important;
  }
</style>
