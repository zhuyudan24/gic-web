<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="item-label">
            <span>是否开启</span>
            <el-switch @change="changeState" v-model="delivery"></el-switch>
          </div>
          <div class="item-label">
            <span>回复内容</span>
            <el-radio-group v-model="replayStyle">
              <el-radio :label="0">微信文本</el-radio>
              <el-radio :label="4">微信图片</el-radio>
              <el-radio :label="3">微信图文</el-radio>
              <el-radio :label="5">卡券</el-radio>
            </el-radio-group>
          </div>
          <div class="attention-content-wrap">
            <wxText v-if="replayStyle==0" :msgText="oldTextarea" :xcxwechatContent="wechatContent" @listenWxText="getWxText"></wxText>
            <wxImg v-if="replayStyle==4" @listenWxImg="getWxImg"></wxImg>
            <wxImgAndText v-if="replayStyle==3" @listenWxImgAndText="getWxImgAndText"></wxImgAndText>
            <card v-if="replayStyle==5" @listenWxCard="getWxCard"></card>
          </div>
          <div class="save-btn">
            <el-button type="primary" @click="saveBtn">保 存</el-button>
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
  name: "public_num_attention", 
  data() {
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
          // path: '/public_num'
        },
        {
          name: '被关注回复',
          path: ''
        }
      ],
      delivery: false,
      replayStyle: 0,
      messageId:'',
      texletId:'',
      wxTextContent:'',
      imageMediaId:'',
      wxImgId:'',
      wxImgAndTextId:'',
      wxCardId:'',
      messageContent:'',
      oldTextarea:'',

      imgAndTextRadio:'',         // 图文
      imgRadio:'',                  // 图片
      cardRadio:'',                  // 卡券
      imageMediaId:'',        // 小程序图片上传之后的唯一标识
      oldTexletId:'',
      oldKeyword:'',

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
    this.getAttentionData()
  },
  methods: {
    getAttentionData(){   // 获得初始数据
      var self = this;
      self.axios.get('/api-admin/wechat-attention-message',{
        params: {
          requestProject:'gic-web'
        }
      }).then(res=>{
        var data = res.data;
        // console.log(data);
        if(data.errorCode==0){
          self.delivery = data.result.isOpen;
          if(data.result.messageDTO){
            var objData = data.result.messageDTO;
            self.messageId = objData.messageId;
            self.replayStyle = objData.backType; // 回复的类型  
            if(self.replayStyle==0){          // 文本
              self.oldTextarea = objData.messageContent;
              self.wxTextContent = self.oldTextarea;
              self.wechatContent = data.result.jsonString;
            }else if(self.replayStyle==3){    // 图文
              self.imgAndTextRadio = objData.texletId;
              self.oldTexletId = objData.texletId;
            }else if(self.replayStyle==4){    // 图片
              self.imgRadio = objData.texletId;
              self.oldTexletId = objData.texletId;
            }else if(self.replayStyle==5){    // 卡券
              self.cardRadio = objData.texletId;
              self.oldTexletId = objData.texletId;
            }
          }
        }else{
          self.$message({
            type: 'error',
            message: data.message
          });
        }
      })
    },
    changeRoute(route) {
      this.$router.push(route);
    },
    changeState(val){    // 更改状态 
      var self = this;
      self.$confirm('确定更换状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.post('/api-admin/turn-auto-message-status',qs.stringify({
          requestProject:'gic-web',
          flag:val
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            self.$message({
              type: 'success',
              message: '切换成功'
            });
          }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    getWxText(data){      // 微信文本 
      //console.log(data);
      this.textNum = data.textNum;
      // 单独转义一下被html转义的  & > < 空格 单引号
      // this.wxTextContent=data.textarea.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/<\/?[^>]*>/g,'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      this.wxTextContent=data.textarea;
      this.imageMediaId = data.imageMediaId;
      // var linkStyle = data.linkStyle;
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
    saveBtn(){
      var self = this;
      if(self.replayStyle==0){          // 文本
        self.texletId=self.imageMediaId;
        if(this.textNum>300){
          this.$message.error('最多300个字符哦');
          return;
        }else{
          var reg = /<(?!(a|\/a|div|\/div|br)).*?>/img ; // 只保留a 和 div 标签
          var str = self.wxTextContent.replace(reg,"");
          var str1 = str.replace(/<\/div>|&nbsp;/g,"");
          var str2 = str1.replace(/<((div)).|<((br)).*?>/g,"<br>");
          var str3 = str2.split('<br>').filter(v=>v).join('<br>');
          var hrefReg = /href=['"]([^"]*)['"].*?/g
          // var hrefReg = /(?<=href=\").*?(?=\")/img;  // 获取a标签的href值
          if(hrefReg.test(str3)){
            var hrefArr = str3.match(hrefReg);
            if(hrefArr.length>1){
              this.$message.error('只能添加一个链接');
              return
            }
            var href = str3.match(hrefReg)[0];
            //console.log(href);
            str3 = str3.replace(/<((a)).*?>/g,'<a '+href+'>');   // 获取 <a> 并替代
          }
          //console.log(str3);
          // var str3 = str2.replace(/<br>(<br>)+/img,'<br>');
          if(str3 == '' ){
            self.$message.error('请输入回复内容');
            return;
          }else{
            self.messageContent = str3
          }
        }
      } else if(self.replayStyle==3){   // 图文
        self.messageContent = '';
        self.texletId = self.wxImgAndTextId;
        if(self.texletId==''){
          self.$message.error('请选择图文');
          return;
        }
      } else if(self.replayStyle==4){   // 图片
        self.texletId = self.wxImgId;
        self.messageContent = '';
        if(self.texletId==''){
          self.$message.error('请选择图片');
          return;
        }
      } else if(self.replayStyle==5){   // 卡券
        self.texletId = self.wxCardId;
        self.messageContent = '';
        if(self.texletId==''){
          self.$message.error('请选择卡券');
          return;
        }
      }
      self.axios.post('/api-admin/save-wechat-auto-message',qs.stringify({
        requestProject:'gic-web',
        messageId:self.messageId,
        messageType:0,
        backType:self.replayStyle,
        texletId:self.texletId,
        messageContent:self.messageContent,
        wechatContent:this.wechatContent
      })).then(res=>{
        var data = res.data;
        if(data.errorCode==0){
          if(self.replayStyle==0){
            this.getAttentionData()
          }
          self.$message({
            message: data.message,
            type: 'success'
          });
        }else{
          self.$message({
            type: 'error',
            message: data.message
          });
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
  .attention-wrap{
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
  .save-btn{
    text-align: center;
    margin-top: 24px;
  }
</style>
