<template>
	<div class="right-wrap">
    <topNav v-show="navFlag" :navpath="navpathAdd"></topNav>
    <topNav v-show="!navFlag" :navpath="navpathEdit"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="keyword-wrap">
		    	<div class="add-reply-wrap">
		    		<el-form ref="form" label-position="right" :model="formReply" label-width="80px" class="form-wrap">
							<el-form-item label="规则名称" class="text-content" :class="{'is-error':errorBool}">
								<div class="keyword-input">
							    <el-input v-model="formReply.rule" @keyup.native="toInput(formReply.rule,$event)"></el-input>
							    <span class="text-num">{{inputNum}}/{{inputLength}}</span>
						    </div>
                <p v-show="errorBool" class="el-form-item__error">{{ errorMsg }}</p>
							</el-form-item>
							<div @mouseenter="addKeywordState(index)" @mouseleave="remomveKeywordState(index)" v-for="(domain, index) in formReply.addKeyword" class="keyword-input-item-hook clearfix" :key="index">
								<el-form-item
							    :label="'关键词' + (index+1)"
							    :key="index"
							    class="text-content fl">
							    <div class="keyword-input">
							    	<el-input v-model="domain.value" @keyup.native="toKeyword(index,$event)"></el-input>
							    	<span class="text-num">{{domain.keyNum}}/{{inputLength}}</span>
							    </div>
								</el-form-item>
								<div class="operate-btn fl">
                  <b v-show="(index+1)==formReply.addKeyword.length && (index+1)!=10 " class="add-keyword-btn" @click="addKeywordBtn">添加</b>
                  <b v-show="false" class="remove-keyword-btn" @click="removeKeywordBtn(domain)">删除</b>
						    </div>
							</div>
							<el-form-item label="回复内容">
								<el-radio-group v-model="formReply.replayStyle" >
	                <el-radio :label="0">微信文本</el-radio>
		              <el-radio :label="4">微信图片</el-radio>
		              <el-radio :label="3">微信图文</el-radio>
		              <el-radio :label="5">卡券</el-radio>
		            </el-radio-group>
							</el-form-item>
			    	</el-form>
			    </div>
		    	<div class="attention-content-wrap">
		        <wxText v-if="formReply.replayStyle==0" :msgText="oldTextarea" :xcxwechatContent="wechatContent" @listenWxText="getWxText"></wxText>
            <wxImg v-if="formReply.replayStyle==4" @listenWxImg="getWxImg"></wxImg>
            <wxImgAndText v-if="formReply.replayStyle==3" @listenWxImgAndText="getWxImgAndText"></wxImgAndText>
            <card v-if="formReply.replayStyle==5" @listenWxCard="getWxCard"></card>
		      </div>
	        <div class="saveBtn">
		    		<el-button type="primary" @click="saveKeywordBtn">保 存</el-button>
			    </div>
		    </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import wxText from 'components/basicConfig/wxText/wxText'
  import wxImg from 'components/basicConfig/wxImg/wxImg'
  import wxImgAndText from 'components/basicConfig/wxImgAndText/wxImgAndText'
  import card from 'components/basicConfig/card/card'
  import strLength from '../../../common/js/strlen';
  let qs = require('qs')
  export default {
    name: "public_num_keyword", 
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpathAdd: [
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
            path: 'public_num_keyword'
          },
          {
            name: '添加回复',
            path: ''
          }
        ],
        navpathEdit: [
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
            path: 'public_num_keyword'
          },
          {
            name: '编辑回复',
            path: ''
          }
        ],
        formReply: {
        	rule:'',
        	replayStyle:0,
        	addKeyword:[{
            value:'',
            keyNum: 0
          }]
        },
        rules:{

        },
        navFlag:false,
        // addKeywordLength:1,
        keywordBtnState:true,
        inputNum: 0,        // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 20,   // 限制最大字数
        keyNum0:0,           // 关键词个数

        // 编辑或添加时的传递数据
        wxTextContent:'',
        wxImgId:'',
        wxImgAndTextId:'',
        wxCardId:'',
        texletId:'',
        // 编辑时的初始数据
        oldTextarea:'',             // 文本
        imgAndTextRadio:'',         // 图文
        imgRadio:'',                  // 图片
        cardRadio:'',                  // 卡券
        imageMediaId:'',        // 小程序图片上传之后的唯一标识
        oldTexletId:'',
        oldKeyword:'',
        saveBtnOk:true,

        errorMsg:'请输入规则名称',
        errorBool:false,

        wechatContent:'',
        textNum:0,  // 微信文本  文本域的个数
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
    	this.getReplyData()
    },
    methods: {
    	getReplyData(){			// 回复的数据
    		var self = this;
    		var id = self.$route.query.msgId;
    		if(id=='' || id==undefined){
    			self.navFlag = true
    		}
    		self.axios.post('/api-admin/save-keyword-message',qs.stringify({
          requestProject:'gic-web',
	      	msgId:id
	      })).then(res=>{
	        var data = res.data;
	        // console.log(data);
	        if(data.errorCode==0){
            if(id=='' || id==undefined){  // 添加
              var objData = data.result.messageDTO;
              self.oldTextarea = '';  // 微信文本的内容
              self.imgAndTextRadio = '';
              self.imgRadio = '';
              self.cardRadio = '';
            }else{                        // 编辑
              var objData = data.result.messageDTO;
              // 规则名称和关键词数据
              // var keyword = objData.keyword;
              self.oldKeyword = objData.keyword;
              var keyObjArray = [];
              var keyArray = self.oldKeyword.split(",");
              keyArray.forEach((key,index)=>{
                var keyObj = {};
                keyObj.value=key;
                var l = strLength.getZhLen(key);  // 关键词的字符长度
                keyObj.keyNum = l;
                keyObjArray.push(keyObj);
              });
              self.formReply.addKeyword=keyObjArray;
              self.formReply.rule=objData.messageName;
              self.formReply.replayStyle=objData.backType;
              var len = strLength.getZhLen(self.formReply.rule);  // 规则名称的字符长度
              self.inputNum = len;
              var backType = objData.backType;    // 回复的类型
              if(backType==0){          // 文本
                self.oldTextarea = objData.messageContent;
                self.wxTextContent = self.oldTextarea;
                self.wechatContent = data.result.jsonString;
              }else if(backType==3){    // 图文
                self.imgAndTextRadio = objData.texletId;
                self.oldTexletId = objData.texletId;
              }else if(backType==4){    // 图片
                self.imgRadio = objData.texletId;
                self.oldTexletId = objData.texletId;
              }else if(backType==5){    // 卡券
                self.cardRadio = objData.texletId;
                self.oldTexletId = objData.texletId;
              }
            }
	        } else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
	      })
    	},
      toInput(value,e) {          // 控制字符数量
        var that = this;
        if(that.formReply.rule){
          that.errorBool = false;
        }else{
          that.errorBool = true;
        }
        that.formReply.rule = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.formReply.rule);
      },
      toKeyword(idx,e) {          // 控制关键词字符数量
        var that = this;
        that.formReply.addKeyword[idx].value = strLength.getByteVal(e.target.value,that.inputLength);
        that.formReply.addKeyword[idx].keyNum = strLength.getZhLen(that.formReply.addKeyword[idx].value);
        // console.log(that.formReply.addKeyword);
      },
	    addKeywordBtn(){		// 增加关键词
	    	// this.addKeywordLength++;
        if(this.formReply.addKeyword.length<10){
          this.formReply.addKeyword.push({
            value: '',
            keyNum: 0
            // key: this.addKeywordLength
          });
        } 
    	},
	    removeKeywordBtn(item) {	// 删除关键词
	    	this.$confirm('确定移除该关键词吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	var index = this.formReply.addKeyword.indexOf(item);
	        if (index !== -1) {
	          this.formReply.addKeyword.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
	        }
        	
        }).catch(() => {
	         this.$message({
            type: 'info',
            message: '已取消删除'
	         });          
        });  
	    },
	    addKeywordState(idx){
	      var total = this.formReply.addKeyword.length;
	    	if(total==1){
	    		var keywordInput = document.getElementsByClassName('keyword-input-item-hook')[0];
	        var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn')[0];
	        var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn')[0];
	        removeKeyword.style.display="none";
	        addKeyword.style.display="inline-block";
	    	}else{		    		
	    		var keywordInput = document.getElementsByClassName('keyword-input-item-hook')[idx];
	        var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn')[0];
	        var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn')[0];
	    		if((idx+1)==total && total<10){
	    			// var index = this.formReply.addKeyword.length-1;
		        addKeyword.style.display="inline-block";
		        removeKeyword.style.display="inline-block";
		    	}else{
		    		addKeyword.style.display="none";
			      removeKeyword.style.display="inline-block";
		    	}
	    	}
	    },
    	remomveKeywordState(idx){
        var keywordInput = document.getElementsByClassName('keyword-input-item-hook')[idx];
        var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn')[0];
        var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn')[0];
        removeKeyword.style.display="none";
        addKeyword.style.display="none";
    	},
      getWxText(data){      // 微信文本 
        //console.log(data);
        this.textNum = data.textNum;
        this.wxTextContent=data.textarea;
        this.imageMediaId = data.imageMediaId;
        //var linkStyle = data.linkStyle;
        if(data.wechatContent){
          if(!data.wechatContent.title){
            this.wechatContent = null
          }else{
            this.wechatContent = JSON.stringify(data.wechatContent);
          }
        }
      },
      getWxImg(data){           // 微信图片id
        this.wxImgId = data;
        // console.log(this.wxImgId);
      },
      getWxImgAndText(data){   // 微信图文id
        this.wxImgAndTextId = data;
        // console.log(this.wxImgAndTextId);
      },
      getWxCard(data){        // 卡券id
        this.wxCardId = data;
        // console.log(this.wxCardId);
      },
      saveKeywordBtn(){   // 保存  判断是新增还是编辑
        var self = this;
        var id = self.$route.query.msgId;
        var msgId = (id=='' || id==undefined?'':id);
        var type = self.formReply.replayStyle;
        var messageContent = (type==0?self.wxTextContent:'');
        /*添加回复的判断*/
        if(self.formReply.rule==""){
          self.errorBool = true;
          return;
        }else{
          self.errorBool = false;
        }
        // if(self.formReply.rule==''){
        //   self.$message({
        //     type:'error',
        //     message:'请输入规则名称'
        //   })
        //   return;
        // }
        // 处理关键词
        var keyword =  '';
        var keyCount = 0;
        self.formReply.addKeyword.forEach((item)=>{
          if(item.value!=''){
            keyCount++;
          }
        })
        if(keyCount != self.formReply.addKeyword.length){
          self.$message({
            type:'error',
            message:'请输入关键词'
          })
          return;
        }else{
          self.formReply.addKeyword.forEach((item)=>{
            keyword += item.value + ',';
          })
        }
        if (keyword) {
          keyword = keyword.substring(0, keyword.length - 1);
        }
        if(type==0){          // 文本
          if(this.textNum>300){
            this.$message.error('最多300个字符哦');
            return
          }
          self.texletId=self.imageMediaId;
          var reg = /<(?!(a|\/a|div|\/div|br)).*?>/img ; // 只保留a 和 div br 标签
          var str = self.wxTextContent.replace(reg,"");
          var str1 = str.replace(/<\/div>|&nbsp;/g,"");
          var str2 = str1.replace(/<((div)).|<((br)).*?>/g,"<br>");
          var str3 = str2.split('<br>').filter(v=>v).join('<br>');
          // var str3 = str2.replace(/<br>(<br>)+/img,'<br>');

          var hrefReg = /href=['"]([^"]*)['"].*?/g
          // var hrefReg = /(?<=href=\").*?(?=\")/img;  // 获取a标签的href值 打包时正则保错
          if(hrefReg.test(str3)){
            var hrefArr = str3.match(hrefReg);
            if(hrefArr.length>1){
              this.$message.error('只能添加一个链接');
              return
            }
            var href = str3.match(hrefReg)[0];
            str3 = str3.replace(/<((a)).*?>/g,'<a '+href+'">');   // 获取 <a> 并替代
          }
          if(str3 == '' ){
            self.$message.error('请输入回复内容');
            return;
          }else{
            self.messageContent = str3
          }
        } else if(type==3){   // 图文
          self.messageContent = '';
          if(self.wxImgAndTextId == ''){
            if(self.imgAndTextRadio==''){
              self.$message({
                type:'error',
                message:'请选择图文'
              })
              return;
            }else{
              self.texletId = self.oldTexletId;
            }
          } else {
            self.texletId = self.wxImgAndTextId;
          }
        } else if(type==4){   // 图片
          self.messageContent = ''
          if(self.wxImgId==''){
            if(self.imgRadio==''){
              self.$message({
                type:'error',
                message:'请选择图片'
              })
              return;
            } else {
              self.texletId = self.oldTexletId
            }
          } else {
            self.texletId = self.wxImgId;
          }
        } else if(type==5){   // 卡券
          self.messageContent = '';
          if(self.wxCardId==''){
            if(self.cardRadio==''){
              self.$message({
                type:'error',
                message:'请选择卡券'
              })
              return;
            } else {
              self.texletId = self.oldTexletId
            }
          } else {
            self.texletId = self.wxCardId;
          }
        }
        self.axios.post('/api-admin/save-wechat-auto-message',qs.stringify({
          requestProject:'gic-web',
          messageId:msgId,
          messageType:2,
          backType:type,
          messageContent:self.messageContent,
          wechatContent:self.wechatContent,
          texletId:self.texletId,
          status:1,
          messageName:self.formReply.rule,
          keyword:keyword
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.$router.go(-1);
            self.$message({
              type:'success',
              message:data.message
            })
          }else{
            self.$message({
              type:'error',
              message:data.message
            })
          }
        })
      }
    },
    components: {
      topNav,
      wxText,
      wxImg,
      wxImgAndText,
      card
  	}   
  }
</script>

<style lang="less" scoped>
  .right-box{
    padding: 24px 32px;
  }
  .keyword-wrap{
		.add-reply-wrap{
			.text-content{
				width: 500px;
			}
			.keyword-input{
      	position: relative;
      	width: 420px;
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
        .item-label{
          font-size: 14px;
          color: #606266;
          margin-bottom: 30px;
          span{
              display: inline-block;
              width: 80px;
          }
      }
		}
		.saveBtn{
    		text-align:center;
    		margin: 24px 0;
    	}
    }
</style>
