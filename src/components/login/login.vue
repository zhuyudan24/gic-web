<template>
  <div  class="loginwrap-wrap">
    <div class="login_content_wrap">
      <div class="login-top-wrap clearfix">
        <div class="fl img">
          <img src="./login_logo.png" alt="">
        </div>
        <p class="fl">GIC商户后台</p>
        <div class="bro-tip-wrap" v-show="isShow">
          <p v-if="isBroBool">您的浏览器版本过低，可能会影响内容展示，建议使用最新浏览器版本进行操作，<span @click="updateBro">升级到最新版本>> </span><i @click="closeBroTip" class="el-icon-close fr"></i></p>
          <p v-else>如页面出现展示异常建议您更换浏览器，可下载<span>google浏览器</span>或者<span>火狐浏览器</span>进行操作<i @click="closeBroTip" class="el-icon-close fr"></i></p>
        </div>
      </div>
      <div class="login-content clearfix">
        <div class="fl login-left">
          <div class="login-input">
            <h2 class="login-title">登录<span v-if="loginErrorBool">您的账户因{{ stopReason }}暂时停用，请联系项目经理或者客服！</span></h2>
            <el-form ref="form" :rules="rules" label-width="">
              <el-form-item :class="{'error-input':errorInput1}"  prop="loginName"> <!-- @blur="searchUser(loginName)" -->
                <!-- <el-input @blur="changeName"  autoComplete="off" class="forminput" name="loginName" v-model.trim="loginName"  placeholder="登录账号"></el-input> -->
                <!-- <el-input v-model.trim="loginName" placeholder="登录账号" style="display:none"></el-input> -->
                <el-input @blur="changeName" class="forminput" name="loginName" v-model.trim="loginName"  placeholder="登录账号"></el-input>
              </el-form-item>
              <el-form-item :class="{'error-input':errorInput2,'last-input-item':lastItem}" ref="pwdWrap" prop="password">
                <!-- <el-input v-model="password" name="password" type="password" placeholder="登录密码" style="display:none"></el-input> -->
                <!-- <el-input autoComplete="off" v-model="password" type="password" placeholder="登录密码" @keyup.native.enter="submitLogin"></el-input> -->
                <el-input v-model="password" type="password" placeholder="登录密码" @keyup.native.enter="submitLogin"></el-input>
              </el-form-item>
              <el-form-item :class="{'last-input-item':!lastItem}" prop="eid" v-if="options.length > 1">
                <el-select @change="selectOptions" style="width: 100%;" v-model="eid" placeholder="请选择">
                  <el-option v-for="item in options"
                             :key="item.enterpriseId"
                             :label="item.brandName"
                             :value="item.enterpriseId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-bottom: 0; height: 12px;"> 
                <!-- <p v-show="errorBool" class="login-error-tip">{{errorMsg}}</p> -->
                <p class="login-error-tip">{{errorMsg}}</p>
              </el-form-item>
              <el-form-item style="margin-bottom: 0;">
                <button class="submit-btn" @click.prevent="submitLogin">立即登录</button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="fr login-right">
          <img src="./side-img.png" alt="">
        </div>
      </div>
      <div class="login-footer">Copyright {{ nowYear }} Demogic.com All Rights Reserved 浙ICP备15033117号-1</div>
    </div>
  </div>
</template>

<script>
  let qs = require('qs');
  import * as types from '../../store/types'
  import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
  import { setCookie,getCookie } from '../../common/js/cookie'
  export default {
    name: "login",
    data() {
      return {
        redirect: this.$route.query.redirect,
        token: '',
        loginName: '',
        password: '',
        loginbg: require('./login_bg.jpg'),
        rules: {
        },
        options: [],
        eid: '',
        eidOther:'',
        isClique: null,
        errorBool:false,  // 错误提示
        errorMsg:'',
        errorInput1:false,
        errorInput2:false,

        userBool:false, // 账号是否存在
        clickBool:false,
        clickBtnBool:false,

        newUseVal:'',
        oldUseVal:'',

        imgHeight:document.body.clientHeight,
        imgWidth:document.body.clientWidth,

        timer:false,

        lastItem:true,
        nowYear:'2019',
        isBroBool:true, // 浏览器是谷歌 火狐
        isShow:false,
        loginStatus:"", // 登录状态
        stopReason:'合同已到期',
        loginErrorBool:false,
      }
    },
    watch:{
      loginName(newVal,oldVal){
        this.newUseVal = newVal;
        this.oldUseVal = oldVal;
        this.clickBtnBool = false;
        // this.searchUser();
        // this.clickBool = true
      }
    },
    mounted(){
      this.getNowYear();
      var that = this;
      that.$store.commit(types.TITLE,'达摩网络GIC——连锁零售商业互联网+，终极解决方案！');
      document.title = that.$store.state.title;
    },
    methods: {
      getNowYear(){  // 获取当前的年份
        var date=new Date;
        this.nowYear = date.getFullYear(); 
        // 调用浏览器类型及版本
        var browser = this.getBrowserInfo();//取到完整信息
        var b_name = (browser + "").replace(/[0-9./]/ig, "");//根据正则将所有数字、‘.’‘/’全部去掉，剩下浏览器名
        var b_version = parseInt((browser + "").replace(/[^0-9.]/ig, ""));//根据正则将所有非数字全部去掉，剩下版本
        console.log(b_version);
        if(b_name=='chrome'){
          if(b_version < 23){
            this.isShow = true;
            this.isBroBool = true;
          }
        }else if (b_name=='firefox'){
          if(b_version < 21){
            this.isShow = true;
            this.isBroBool = true;
          }
        }else{
          this.isShow = true;
          this.isBroBool = false;
        }
        // 获取链接参数
        this.loginStatus = this.getUrlKey('status');
        if(this.loginStatus){
          this.loginErrorBool = true;
          if(this.loginStatus==3){
            this.stopReason = "合同已到期"
          }else if(this.loginStatus==4){
            this.stopReason = "数据迁移"
          } else if(this.loginStatus==5){
            this.stopReason = "账户冻结"
          }
        }else{
          this.loginErrorBool = false;
        }
      },
      //浏览器类型及版本
      getBrowserInfo(){
        let agent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
        let regStr_ff = /firefox\/[\d.]+/gi;
        let regStr_chrome = /chrome\/[\d.]+/gi;
        if (agent.indexOf("firefox") > 0) {
          return agent.match(regStr_ff);
        }
        if (agent.indexOf("chrome") > 0) {
          return agent.match(regStr_chrome);
        }
      },
      getUrlKey(name){
        return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
      },
      // 升级版本
      updateBro(){
        var browser = this.getBrowserInfo();
        var b_name = (browser + "").replace(/[0-9./]/ig, "");
        if(b_name=='chrome'){
          let url = 'https://www.google.cn/chrome/';
      		window.open(url ,'_blank');
        }else if(b_name=='firefox'){
          let url = 'http://www.firefox.com.cn/';
      		window.open(url ,'_blank');
        }
      },
      // 关闭版本提示
      closeBroTip(){
        this.isShow = false
      },
      selectOptions(val){
        this.eid = val;
        this.eidOther = val;
      },
      searchUser(){
        if(this.loginName) {
          this.errorBool = false;
          this.errorInput1 = false;
          this.errorInput2 = false;
          this.errorMsg = ''
          this.axios.get('/api-auth/list-login-enterprise',{
            params: {
              loginName: this.loginName
            }
          }).then(res => {
            //console.log(res);
            var data = res.data;
            if(data.errorCode==0){
              
              if(res.data.result.length > 0) {
                this.errorBool = false;
                this.errorInput1 = false;
                // 是否换账号，则比较两个数组是否相等
                if(this.options.length != res.data.result.length){   // 个数不相等，则一定换账号
                  this.options = res.data.result;
                  this.eid = res.data.result[0].enterpriseId;
                }else{  // 个数相等，则比较id，id不等，则换账号
                  var count = 0
                  res.data.result.forEach((item)=>{
                    this.options.forEach((child)=>{
                      if(item.enterpriseId==child.enterpriseId){
                        count++
                      }
                    })
                  })
                  if(count==res.data.result.length){  // 两个数组一样 ，未换账号
                    if(this.eidOther && this.eid!=this.eidOther){
                      this.eid=this.eidOther
                    }
                  }else{  // 换账号
                    this.options = res.data.result;
                    this.eid = res.data.result[0].enterpriseId;
                  }
                }

                this.userBool = true; // 账号存在
                this.clickBool = false;
                if(this.clickBtnBool){
                  this.getLoginEnterprise();
                }
                // console.log(this.userBool);
                this.errorBool =false;
                this.errorInput1 =false;
                this.errorInput2 = false;
                this.errorMsg = ''
              }else{
                this.options = [];
                this.lastItem = true;
                this.userBool = false;
                this.errorBool = true;
                this.errorInput1 = true;
                this.errorInput2 = false;
                this.errorMsg = '账号不存在'
              }
              if(res.data.result.length > 1){
                this.lastItem = false;
              }
            }else{
              checkFalse(data.message)
            }
          }).catch(err => {
            checkStatus(err);
          })
        }else {
          this.errorBool = true;
          this.errorInput1 = true;
          this.errorInput2 = false;
          this.errorMsg = '请输入账号';
          this.options = [];
          return false;
        }
      },
      getLoginEnterprise() {
        if(!this.password){
          this.errorInput2 = true;
          this.errorInput1 = false;
          this.errorMsg = '请输入密码'
          return  false;
        }
        if(this.options.length > 0) {
          if(this.eid) {
            window.localStorage.setItem('sign',this.eid);
            this.axios.post('/api-auth/do-login',qs.stringify({
              loginName: this.loginName,
              password: this.password,
              eid: this.eid
            })).then(res => {
              // console.log(res.data);
              var data = res.data;
              this.loginErrorBool = false; 
              if(data.errorCode == 0) {
                this.options.forEach(item => {
                  if(item.enterpriseId == this.eid) {
                    window.localStorage.setItem('brandName',item.brandName);
                  }
                });
                // checkSuccess(res.data.message);
                this.isClique = res.data.result.enterpriseDTO.isClique;
                var isMiddleGround = res.data.result.enterpriseDTO.backgroundMode;
                this.$store.commit(types.MGSHOW,isMiddleGround==1?true:false);
                if(res.data.result.wxUrl){
                  window.location.href = res.data.result.wxUrl
                }else{
                  if(this.isClique == 1) {
                    let url = '//' + window.location.host + '/gic-clique/#/memberCardSet';
                    window.location.href = url;
                  }
                  else if(isMiddleGround == 1){  // 业务中台
                    // let url = '//' + window.location.host + '/gic-web/#/themeSetting';
                    let url = '//' + window.location.host + '/middle-ground/#/index';
                    window.location.href = url;
                  }
                  else {
                    // let url = '//' + window.location.host + '/gic-web/#/themeSetting';
                    let url = '//' + window.location.host + '/report/#/memberSummary';
                    window.location.href = url;
                  }
                }
                this.errorBool = false;
              }else if(data.errorCode == 120000){
                this.errorBool = true;
                this.errorInput2 = true;
                this.errorMsg = '账号或密码错误'
              }else if(res.data.errorCode == 120003){
                this.loginErrorBool = true;
                this.loginStatus = parseInt(res.data.message);
                if(this.loginStatus==3){
                  this.stopReason = "合同已到期"
                }else if(this.loginStatus==4){
                  this.stopReason = "数据迁移"
                } else if(this.loginStatus==5){
                  this.stopReason = "账户冻结"
                }
              }else {
                this.$message.error(data.message);
              }
            }).catch(err => {
              checkStatus(err);
            })
          }else {
            this.errorBool = true;
            this.errorMsg = '请选择商户'
          }
        }else {
          window.localStorage.setItem('sign',this.eid);
          this.axios.post('/api-auth/do-login',qs.stringify({
            loginName: this.loginName,
            password: this.password,
            eid: this.eid
          })).then(res => {
            var data = res.data;
            this.loginErrorBool = false; 
            if(res.data.errorCode == 0) {
              this.options.forEach(item => {
                if(item.enterpriseId == this.eid) {
                  window.localStorage.setItem('brandName',item.brandName);
                }
              });
              checkSuccess(res.data.message);
              this.isClique = res.data.result.enterpriseDTO.isClique;
              var isMiddleGround = res.data.result.enterpriseDTO.backgroundMode;
              this.$store.commit(types.MGSHOW,isMiddleGround==1?true:false);
              if(this.isClique == 1) {
                let url = '//' + window.location.host + '/gic-clique/#/memberCardSet';
                window.location.href = url;
              }
              else if(isMiddleGround == 1){  // 业务中台
                let url = '//' + window.location.host + '/middle-ground/#/index';
                window.location.href = url;
              }
              else{
                let url = '//' + window.location.host + '/report/#/memberSummary';
                window.location.href = url;
              }
            }else if(res.data.errorCode == 120000){
              this.errorBool = true;
              this.errorInput2 = true;
              this.errorMsg = '账号或密码错误'
            }else if(res.data.errorCode == 120003){
              this.loginErrorBool = true;
              this.loginStatus = parseInt(res.data.message);
              if(this.loginStatus==3){
                this.stopReason = "合同已到期"
              }else if(this.loginStatus==4){
                this.stopReason = "数据迁移"
              } else if(this.loginStatus==5){
                this.stopReason = "账户冻结"
              }
            }else {
              this.$message.error(data.message);
            }
          }).catch(err => {
            checkStatus(err);
          })
        }
      },
      changeName(val){ // 账号发生变化时触发
        // console.log(this.newUseVal);
        // console.log(this.oldUseVal);

        this.searchUser();
        // if(this.newUseVal!=this.oldUseVal){
        //   this.searchUser();
        // }
      },
      submitLogin(){
        // console.log(this.userBool);
        if(!this.loginName) {
          this.errorBool = true;
          this.errorInput1 = true;
          this.errorInput2 = false;
          this.errorMsg = '请输入账号'
          // checkFalse('账号不能为空');
          return  false;
        }else{
          this.errorBool = false;
          this.errorInput1 = false;
          this.errorInput2 = false;
          this.errorMsg = ''
        }
        
        if(this.newUseVal != this.oldUseVal){
          if(!this.userBool){
            this.clickBtnBool = true;
            this.searchUser();
            return;
          }
        }else{
          this.clickBtnBool = false;
        }

        if(this.userBool){
          this.getLoginEnterprise();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .loginwrap-wrap{
    position: relative;
    min-width: 1200px;
    width: 100%;
    height: 100%;
    background: #f0f2f5;
  }
  .login_content_wrap {
    margin: 0 auto;
    width: 1160px;
    .login-top-wrap{
      font-size: 0;
      padding: 51px 0 23px 0;
      .img{
        width: 160px;
        height: 51px;
        display: inline-block;
        img{
          width: 100%;
          height: 100%;
        }
      }
      > p{
        display: inline-block;
        font-size: 14px;
        color: #70819B;
        padding:25px 0 0 9px;
      }
    }
  }
  .login-content{
    border-radius:4px;
    box-shadow:0px 0px 30px 0px rgba(195,211,234,1);
    .login-left{
      width: 697px;
      height: 600px;
      background: #fff;
      border-radius: 4px;
      .login-input{
        width: 400px;
        margin:94px 0 0 148px;
        .login-title{
          font-size: 18px;
          color: #172435;
          padding: 0 0 12px 2px;
          font-weight: 600;
          margin-bottom: 20px;
          border-bottom: 1px solid #E4E7ED;
          span{
            margin-left:10px;
            color: #f5222d;
            font-size: 13px;
          }
        }
      }
    }
    .login-right{
      width: 463px;
      height: 600px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .loginwrap-wrap .submit-btn {
    width: 154px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    font-size: 16px;
    margin-top: 28px;
    color: #fff;
    outline: 0;
    border: 0;
    border-radius: 2px;
    background:#3776DE;
    cursor: pointer;
    &:hover{
      background:#558ae3;
    }
  }
  .loginwrap-wrap .login-footer{
    text-align: center;
    font-size: 14px;
    color: #909399;
    padding: 32px 0;
  }
  .login-error-tip{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    text-align: left;
  }

  .login-content /deep/ .el-form-item{
    margin-bottom: 16px;
  }
  .login-content /deep/ .el-form-item .el-input__inner{
    padding-right: 15px;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    border-color: #C3CAD9;
  }
  .login-content /deep/ .el-form-item .el-input__inner:focus{
    border-color: #3776DE;
  }
  .login-content /deep/ .el-form-item.error-input .el-input__inner{
    border-color: #f56c6c;
  }

  // 浏览器是否兼容的提示文案
  .bro-tip-wrap{
    width:600px;
    height:32px;
    line-height: 32px;
    margin-left: 280px;
    margin-top: 15px;
    padding: 0 13px;
    background:rgba(24,144,255,0.08);
    border-radius:2px;
    p{
      font-size: 12px;
      color: #606266;
      span{
        color: #1890FF;
        cursor: pointer;
        padding: 2px;
      }
      i{
        color: #9B9DA3;
        cursor: pointer;
        padding-top: 10px;
        font-size: 14px;
        &:hover{
          color: #1890FF;
        }
      }
    }
  }
</style>
