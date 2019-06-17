<template>
    <div class="attention-text-wrap">
	    <div class="attention-text-content">
	    	<div class="text-title">
	        <a @click="addLinkDialogShow" class="iconfont icon-lianjie" title="添加链接"></a>
					<a @click="removeLink" class="iconfont icon-duankailianjie" :class="{'no-link':!cancelLink}" title="取消链接"></a>
	       </div>
        <div class="text-content">  <!-- @keyup="textInput(textarea,$event)"  -->
          <div @click="selectLeft" @keyup="textInput(textarea,$event)" v-html="textarea" class="my-textarea" @blur="getAllMytext" ref="myTextarea" contentEditable=true></div>
          <!-- <p class="text-tip">{{textNum}}/{{textLength}}</p> -->
        </div>
      </div>
        <!-- 添加回复链接的dialog -->
	    <div class="add-replay-link" v-if="addReplayDialog">
        <el-dialog
          title="添加回复链接"
          width="585px"
          class="replay-link-dialog"
          :visible.sync="addReplayDialog">
          <div class="add-replay-content">
            <el-form  label-position="right" ref="form" :model="form" label-width="100px">
              <el-form-item class="text-content" label="文本内容">
				    		<el-input v-model="form.text" @keyup.native="toInput(form.text,$event)"></el-input>
					    	<span class="text-num">{{inputNum}}/{{inputLength}}</span>
							</el-form-item>
							<el-form-item label="文本链接">
								<el-radio-group v-model="form.linkStyle">
								  <el-radio label="0">网址</el-radio>
								  <el-radio label="1">小程序</el-radio>
								</el-radio-group>
							</el-form-item>
							<div class="content-wrap">
							 	<div v-show="form.linkStyle==0" class="url-content-wrap">
								 	<el-form-item label="链接地址">
								    <el-input v-model="form.url" ></el-input>
								    <p class="link-url-warning">
								      若您输入的超链接中不包含http等协议，默认将为您添加http://前缀
								    </p>
									</el-form-item>
								</div>
								<div v-show="form.linkStyle==1" class="xcx-content-wrap">
                  <el-form-item label="上传图片">
                    <div class="upload-content">
                      <el-upload
                        class="avatar-uploader"
                        action="123"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <p>请上传长宽比为5:4的图片</p>
                    </div>
                  </el-form-item>

                  <el-form-item label="链接类型" class="url-link-wrap" style="margin-bottom: 0">
                    <el-select @change="changePreValue" v-model="preValue" placeholder="请选择" style="margin-right: 6px;">
                      <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-if="preValue" @change="changeNextValue" v-model="nextValue" placeholder="请选择">
                      <el-option
                        v-for="item in options2"
                        :key="item.linkId"
                        :label="item.name"
                        :value="item.linkId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <linktoolspage class="link-tool" :projectName="projectName" ref="childlinktoolspage" :linkToolsVisible="linkToolsVisible" :showType="showType" @linkSelect="linkSelect"/> -->
								</div>
							</div>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addReplayDialog = false">取 消</el-button>
            <el-button type="primary" @click="addReplyBtn">确 定</el-button>
          </div>
        </el-dialog>
	    </div>
    </div>
</template>

<script>
  import linktoolspage from 'components/linktools/linktoolspage'
  import strLength from '../../../common/js/strlen';
  let qs = require('qs');
  export default {
    name: "public_attention_text",
    props:{
  		msgText:{
  			type:String,
  			default:''
      },
      xcxwechatContent:{
  			type:String,
  			default:''
      },
  	},
    data(){
    	return {
    		form: {
          text:'',
          linkStyle:'0',
          url:''
        },
    		cancelLink:false,
    		addReplayDialog:false,
    		imageUrl: '',
    		textarea:'',
    		textareaContent:'',

        inputNum: 0,      // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 20,   // 限制最大字数

        projectName:'gic-web',  // 小程序链接
        linkToolsVisible:true,
        showType:2,
        xcxToolObj:{},
        wechatContent:{},
        //xcxwechatContent:"", // 小程序传递过来的数据

        imageMediaId: '',  // 图片上传之后的 uid
        xcxUrlObj:{},

        mouseSelectMsg:'',  // 鼠标选中的文案

        options1: [{
          value: 3,
          label: '导航tabbar页'
        }, {
          value: 4,
          label: '二级功能页'
        }],
        options2:[],
        preValue: '',
        nextValue:'',

        textNum:0,
        textLength:10,

    	}
    },
    watch:{
  		msgText:function(val){
        // var idx = val.lastIndexOf('###');
        // if(idx>0){
        //   this.textarea=val.substring(0,idx);
        // }else{
        //   this.textarea=val
        // }
        this.textarea=val;
        var reg = /<a[^>]+href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/g;
        if(reg.test(this.textarea)){
          this.cancelLink=true;
        }
      },
      xcxwechatContent:function(val){
        if(val){
          this.wechatContent=JSON.parse(val);
        }
      },
    },
    created(){
      var val = this.$parent.oldTextarea;
      this.textarea=val;
      // var idx = val.lastIndexOf('###');
      // if(idx>0){
      //   this.textarea=val.substring(0,idx);
      // }else{
      //   this.textarea=val
      // }
      // console.log(this.textarea);
    },
    mounted(){
    	this.oldCancelLink()
    },
    methods: {
    	oldCancelLink(){
        var reg = /<a[^>]+href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/g;  // 判断是否有 <a href=""></a>
    		if(reg.test(this.textarea)){
    			this.cancelLink=true;
    		}
      },
      textInput(v,e){ // 控制微信文本的文字
        var textContent = this.$refs.myTextarea.innerText;
        textContent = strLength.getByteVal2(e.target.innerText);
        this.textNum = strLength.getZhLen(textContent);
        if(this.textNum>300){
          this.$message.error('最多300个字符哦');
        }
      },
      toInput(value,e) {          // 控制字符数量
        var that = this;
        that.form.text = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.form.text);
      },
    	beforeAvatarUpload(file) {
        // console.log(file)
        let fd = new FormData();
        fd.append('file', file);
        fd.append('requestProject', 'gic-web');
        this.axios.post('/api-admin/marketing-wechat-image-save', fd).then((res)=> {//成功后回调
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.imageUrl = data.result.qcloudImageUrl;
            this.imageMediaId = data.result.imageMediaId;

            this.$message({
              type:'success',
              message:'上传成功'
            })
            
          } else {
            this.$message({
              type:'error',
              message:data.message
            })
          }
        })
        return true
    	},
      handleAvatarSuccess(res, file) {
        // console.log(file);
        // this.$message({
        //   type:'success',
        //   message:'上传成功'
        // })
        // this.imageUrl = URL.createObjectURL(file.raw);
        // this.imageMediaId = file.uid;
        // console.log(this.imageUrl);
      },
      selectLeft(){   // 获得鼠标左键选中的值的函数
        var text = '';
        if(window.getSelection){ // 一般浏览器
          text = window.getSelection()
        }else if (document.selection){ // IE浏览器、Opera 
          text = document.selection.createRange();
        }
        this.form.text = text.toString();  // 获得鼠标左键选中的值
      },
    	addLinkDialogShow(){	// 是否显示添加回复链接的dialog
    		// console.log(this.cancelLink);
    		if(this.cancelLink){
    			this.$message.error('只能添加一个链接');
    		}else{
    			this.addReplayDialog=true
    		}
    	},
    	removeLink(){
    		this.cancelLink=false;
    		this.textarea = this.$refs.myTextarea.innerText;
        this.xcxUrlObj.textarea = this.textarea;

        var textContent = strLength.getByteVal2(this.textarea);
        this.textNum = strLength.getZhLen(textContent);
        this.xcxUrlObj.textNum = this.textNum;

        if(this.form.linkStyle==0){   // 文本链接
          this.xcxUrlObj.imageMediaId = ''
        } else if(this.form.linkStyle==1){   // 小程序链接
          this.xcxUrlObj.imageMediaId = this.imageMediaId
        }
        // this.xcxUrlObj.linkStyle = this.form.linkStyle
        this.xcxUrlObj.wechatContent = {};
    		this.$emit('listenWxText',this.xcxUrlObj)
    	},
    	getAllMytext(){  // 文本框输入失去焦点时获得输入框的内容
        this.textarea = this.$refs.myTextarea.innerHTML;
        this.xcxUrlObj.textarea = this.textarea;
      
        var textContent = strLength.getByteVal2(this.$refs.myTextarea.innerText);
        this.textNum = strLength.getZhLen(textContent);
        this.xcxUrlObj.textNum = this.textNum;
        if(this.textNum>300){
          this.$message.error('最多300个字符哦');
        }
        
        var reg = /<a[^>]+href=['"]([^"]*)['"].*?[^>]*>(.*?)<\/a>/g;
    		if(reg.test(this.textarea)){ 
    			this.cancelLink=true;
    		}else{
          this.cancelLink=false;
        }

        if(this.form.linkStyle==0){   // 文本链接
          this.xcxUrlObj.imageMediaId = ''
        } else if(this.form.linkStyle==1){   // 小程序链接
          this.xcxUrlObj.imageMediaId = this.imageMediaId
        }
        // this.xcxUrlObj.linkStyle = this.form.linkStyle
        this.xcxUrlObj.wechatContent = this.wechatContent;
        // console.log(this.xcxUrlObj);
    		this.$emit('listenWxText',this.xcxUrlObj)
    	},
      linkSelect(val){
        // console.log(val);     // 获得小程序链接的结果对象
        if(val!=''){
          this.cancelLink = true;
          this.form.url = val.url;
          this.textarea = this.textarea + '<a href="'+this.form.url+'">'+this.form.text+'</a>';
          this.xcxUrlObj.textarea = this.textarea;

          var textContent = strLength.getByteVal2(this.$refs.myTextarea.innerText);
          this.textNum = strLength.getZhLen(textContent);
          this.xcxUrlObj.textNum = this.textNum;

          var xcxObj = {};
          xcxObj.type=val.id;
          xcxObj.title=val.name;
          xcxObj.isNew = 1;
          if(val.params!=''){
            for(var k in val.params){
              xcxObj.objId=val.params[k];
            }
          }else{
            xcxObj.objId=""
          }
          xcxObj = JSON.stringify(xcxObj)
          this.xcxUrlObj.wechatContent = xcxObj;
          //this.wechatContent = xcxObj;
          if(this.form.linkStyle==0){   // 文本链接
            this.xcxUrlObj.imageMediaId = ''
          } else if(this.form.linkStyle==1){   // 小程序链接
            this.xcxUrlObj.imageMediaId = this.imageMediaId
          }
          // this.xcxUrlObj.linkStyle = this.form.linkStyle
          this.$emit('listenWxText',this.xcxUrlObj)
          this.addReplayDialog=false;
        }
      },
      // 链接类型
      changePreValue(val){
        // val==3  导航tabber页 val==4 二级功能页
        if(val){
          this.nextValue = '';
          this.getNextList(val)
        }
      },
      changeNextValue(val){
        if(val){
          let obj = {};
          obj = this.options2.find((style) => {
            return style.linkId === val;
          })
          //console.log(obj);
          this.wechatContent.type = obj.linkId;
          this.wechatContent.objId = '';
          this.wechatContent.title = obj.name;
          this.wechatContent.pageType = this.preValue;
        }
      },
      // 获得链接类型的二级
      getNextList(type){
        this.axios.post('/api-plug/list-link-data', qs.stringify({
          requestProject: 'gic-web',
          linkScene:parseInt(type)
        })).then((res)=> {//成功后回调
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.options2 = data.result;
          } else {
            this.$message({
              type:'error',
              message:data.message
            })
          }
        })
      },
    	addReplyBtn(){	// 弹框按钮
    		var self = this;
        if(self.form.text==""){
          self.$message({
            message: '请输入文本内容',
            type: 'error'
          });
          return;
        }
    		if(self.form.linkStyle==0){   // 文本链接
    			if(self.form.url==""){
    				self.$message({
		          message: '请输入链接地址',
		          type: 'error'
		        });
		        return;
    			}else{
            self.addReplayDialog = false;
    				self.cancelLink = true;
    				if(self.form.url.indexOf('http://')!=-1 || self.form.url.indexOf('https://')!=-1){
              
      			}else{
              self.form.url='http://' + self.form.url;
            }
      			self.textarea = self.textarea + '<a href="'+self.form.url+'">'+self.form.text+'</a>';
            self.xcxUrlObj.textarea = self.textarea;
            self.xcxUrlObj.imageMediaId = '';

            var textContent = strLength.getByteVal2(self.$refs.myTextarea.innerText);
            self.textNum = strLength.getZhLen(textContent);
            self.xcxUrlObj.textNum = self.textNum;

            self.xcxUrlObj.wechatContent = {};
            // self.xcxUrlObj.linkStyle = this.form.linkStyle
      			self.$emit('listenWxText',self.xcxUrlObj)
    			}
    		} else if (self.form.linkStyle==1){   // 小程序链接
          if(self.imageMediaId  == ''){
            self.$message({
              message: '请上传图片',
              type: 'error'
            });
            return;
          }
          if(!this.nextValue){
            self.$message({
              message: '请选择链接类型',
              type: 'error'
            });
            return;
          }
          self.addReplayDialog = false;
          self.textarea = self.textarea + '<a href="" >'+ self.form.text +'</a>';
          self.xcxToolObj.textarea = self.textarea;
          self.xcxToolObj.imageMediaId = self.imageMediaId;
          self.xcxToolObj.wechatContent = self.wechatContent;

          var textContent = strLength.getByteVal2(self.$refs.myTextarea.innerText);
          self.textNum = strLength.getZhLen(textContent);
          self.xcxUrlObj.textNum = self.textNum;
          // self.xcxUrlObj.linkStyle = this.form.linkStyle
          self.$emit('listenWxText',self.xcxToolObj)
          // self.$refs.childlinktoolspage.confirmLinkSelect();
    		}
    	}
    },
    components:{
      linktoolspage
    }
  }
</script>

<style lang="less" scoped>
  .attention-text-wrap{
  	.attention-text-content{
  		width: 100%;
  		/* border: 1px solid #e7e7eb; */
    	.text-title{
    		width: 100%;
		    height: 40px;
		    line-height: 44px;
		    position: relative;
		    z-index: 1;
		    border: 1px solid #e7e7eb;
		    padding-left: 10px;
		    box-sizing: border-box;
		    a{
		    	margin-left: 10px;
		    	width: 16px;
			    height: 16px;
			    display: inline-block;
			    cursor: pointer;
		    }
		    .icon-lianjie{
		    	color: #808995
		    }
		    .icon-duankailianjie{
		    	color: #808995;
		    	&.no-link{
		    		color: #c0c4cc
		    	}
		    }
    	}
    	.text-content{
        .text-tip{
          color: #c0c4cc;
          font-size: 12px;
          height: 30px;
          line-height: 32px;
          text-align:right;
        }
    		.my-textarea{
          border: 1px solid #e7e7eb;
          border-top: none;
    			width: 100%;
    			min-height: 110px;
    			outline: none;
    			resize: none;
    			padding: 15px;
    			font-size: 14px;
    			box-sizing: border-box;
          line-height: 1.3;
    			a{
    				color: #1890ff
    			}
    			.selectLinkText{
    				color: #1890ff
    			}
    		}
    	}
  	}
  }
  .add-replay-link{
  	.url-content-wrap{
  		width: 100%;
  	}
    .add-replay-content{
    	position: relative;
      max-height: 450px;
      overflow-y: auto;
      .text-content{
      	position: relative;
        width: 100%;
        .text-num{
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
      }
      .link-url-warning{
        color: #909399;
		    font-size: 12px;
		    line-height: 1;
		    padding-top: 4px;
		    margin-top: 3px;
		    position: absolute;
		    top: 100%;
		    left: 0;
      }
    }
  }
  .xcx-content-wrap{
    width: 100%;
    .upload-content{
      > p{
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        color: #b8b8b8
      }
    }
  }
  .avatar-uploader{
    width: 152px;
    height: 152px;
  }
  .avatar-uploader .el-upload {
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
	.upload-content /deep/ .avatar-uploader .el-upload{
		border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
	}
  .upload-content /deep/ .avatar-uploader .el-upload:hover{
    border-color: #1890ff;
  }
  /*.add-replay-link /deep/ .replay-link-dialog > .el-dialog{
    max-height: 600px;
    overflow: auto;
  }*/
  .link-tool{
    margin-left: 20px;
  }
  /*.add-replay-content::-webkit-scrollbar-track-piece{  
   background-color:transparent;
  }*/
  .url-link-wrap /deep/ .el-select{
    width: 217px;
  }
</style>
