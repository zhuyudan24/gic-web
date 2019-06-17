<template>
  <transition name="slide-fade">
 	<div class="integral">
    <div class="integral-header">
      <div class="logo">
        <a class="logoimg"><img width="158" height="49" src="../../../static/img/navlogo.png" alt=""></a>
        <a class="logoimg logotext"><img src="../../../static/img/credit-title-icon.png" alt=""></a>
      </div>
      <div class="handler">
        <!-- <router-link :to="{path: '/member'}" class="logobtn btn1">返回</router-link>
        <a class="logobtn btn1" @click="submitForm('1')">保存</a>
        <a class="logobtn btn2" @click="submitForm('2')">保存并发布</a> -->
        <el-row>
            <el-button type="primary" plain @click="backBtn">返 回</el-button>
            <el-button type="primary" plain @click="submitForm('1')">保 存</el-button>
            <el-button type="primary" @click="submitForm('2')">保存并发布</el-button>
          </el-row>
      </div>
    </div>
    <div class="integral-content" :style="{height: (bodyHeight - 65) + 'px'}">
      <div class="integral-content-left">
        <div class="page-style-show">
          <h3>进入积分页面风格</h3>
          <div class="page-show">
            <img src="../../../static/img/credit-mould_pic01.png">
          </div>
        </div>
        <div class="page-style-show">
          <h3>进入积分明细页风格</h3>
          <div class="page-show">
            <img src="../../../static/img/credit-mould_pic02.png">
          </div>
        </div>
      </div>
      <div class="integral-content-center" :style="{width:(bodyWidth-320-400)+'px'}">
        <div class="integral-center-container">
          <div class="integral-list-page" :class="list==true?'seledt-active':''" :style="{'paddingBottom': !ruleForm.sign.status ? '0' : ''}" @click="setList">
            <div class="integral-title">
              <span>{{ ruleForm.title }}</span>
            </div>
            <div class="integral-list-top" :style="{'height': !ruleForm.sign.status ? '130px' : ''}">
              <img class="integral-list-img" v-if="ruleForm.bgImg.url" :src="ruleForm.bgImg.url">
              <img class="integral-list-img" v-else src="../../../static/img/credit-banner_bg.png" alt="">
              <div class="integral-list-item" v-if="ruleForm.integral.show">
                <p class="integral-num"  :style="{color: ruleForm.integral.numColor}">10000</p>
                <p class="integral-item-title" :style="{color:ruleForm.integral.fontColor}" v-if="ruleForm.integral.title !== ''">{{ ruleForm.integral.title }}</p>
                <p class="integral-item-title" :style="{color:ruleForm.integral.fontColor}" v-else>可用积分</p>
              </div>
              <div class="integral-list-item" v-if="ruleForm.unIntegral.show">
                <p class="integral-num"  :style="{color: ruleForm.unIntegral.numColor}">300</p>
                <p class="integral-item-title" :style="{color:ruleForm.unIntegral.fontColor}" v-if="ruleForm.unIntegral.title !== ''">{{ ruleForm.unIntegral.title }}</p>
                <p class="integral-item-title" :style="{color:ruleForm.unIntegral.fontColor}" v-else>冻结积分</p>
              </div>
            </div>
            <div class="integral-list-bottom" style="overflow: hidden;" v-if="ruleForm.sign.status">
              <img width="353" height="85"  v-if="ruleForm.sign.before.url" :src="ruleForm.sign.before.url" alt="">
              <img width="353" height="85" v-else src="../../../static/img/credit-sign_bg.png">
            </div>
          </div>
          <div class="integral-detail-page" :class="list==true?'':'seledt-active'"  @click="setDetail">
            <div class="integral-title">
              <span>积分明细</span>
            </div>
            <div class="integral-detail-top">
              <img class="integral-detail-bgimg" v-if="ruleForm.detailBgImg.url == ''" src="../../../static/img/credit-detail_bg.png" alt="">
              <img class="integral-detail-bgimg" v-else :src="ruleForm.detailBgImg.url" alt="">
              <div class="integral-detail-item">
                <p class="integral-detail-num" :style="{color:ruleForm.detailIntegral.numColor}">10000</p>
                <p class="integral-detail-title" :style="{color:ruleForm.detailIntegral.fontColor}" v-if="ruleForm.detailIntegral.title !== ''">{{ruleForm.detailIntegral.title}}</p>
                <p class="integral-detail-title" :style="{color:ruleForm.detailIntegral.fontColor}" v-else>可用积分</p>
              </div>
              <div class="integral-detail-item">
                <p class="integral-detail-num" :style="{color:ruleForm.detailUnIntegral.numColor}">10000</p>
                <p class="integral-detail-title" :style="{color:ruleForm.detailUnIntegral.fontColor}" v-if="ruleForm.detailUnIntegral.title !== ''">{{ruleForm.detailUnIntegral.title}}</p>
                <p class="integral-detail-title" :style="{color:ruleForm.detailUnIntegral.fontColor}" v-else>冻结积分</p>
              </div>
            </div>
            <div class="integral-detail-center">
              <div class="integral-explain-title" :style="{color: theme == 2 ? '#f64e4e' : '#dabb7d',borderColor: theme == 2 ? '#f64e4e' : '#dabb7d'}">
                <span v-if="ruleForm.detailIntegralmx.title !== ''">{{ ruleForm.detailIntegralmx.title }}</span>
                <span v-else>积分明细</span>
              </div>
              <div class="integral-explain-title">
                <span v-if="ruleForm.detailIntegralsm.title !== ''">{{ ruleForm.detailIntegralsm.title }}</span>
                <span v-else>积分说明</span>
              </div>
            </div>
            <div class="integral-detail-bottom">
              <img src="../../../static/img/credit-detail_bg2.png">
            </div>
          </div>
        </div>
      </div>
      <div class="integral-content-right ">
        <el-form :model="ruleForm" ref="ruleForm"  class="demo-ruleForm" label-width="70px">
          <div class="page-title form-item-box">
            <el-form-item label="页面名称">
              <div class="forminputWidth">
                <gic-input v-model="ruleForm.title" :max="10"></gic-input>
              </div>
            </el-form-item>
          </div>
        <!-- 积分页面配置 -->
        <div class="integral-list-set" v-if="list">
          <h3>进入积分页面配置</h3>
          <div class="upload-img">
            <label>背景图</label>
            <div class="upload-img-container">
              <div class="img-container">
                <img v-if="ruleForm.bgImg.url" :src="ruleForm.bgImg.url">
                <img v-else src="../../../static/img/credit-banner_bg.png" alt="">
                <a @click="changeImg('1')">修改</a>
              </div>
              <p class="upload-warm">建议上传750*375像素的jpg/png图片</p>
            </div>
          </div>
          <div class="integral-set-group">
            <div class="set-group-title">
              <span>可用积分</span>
              <el-switch v-model="ruleForm.integral.show" @change="changeIntegral(1)"></el-switch>
            </div>
            <div class="set-item-group">
              <el-form-item label="标签名称">
                <div class="forminputWidth gic-form-item">
                  <gic-input v-model="ruleForm.integral.title" :max="4"></gic-input>
                </div>
              </el-form-item>
            </div>
            <div class="set-item-group">
              <label>数值颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.integral.numColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.integral.numColor = '#dfb772'">重置</span>
            </div>
            <div class="set-item-group">
              <label>文本颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.integral.fontColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.integral.fontColor = '#fff'">重置</span>
            </div>
          </div>
          <div class="integral-set-group">
            <div class="set-group-title">
              <span>冻结积分</span>
              <el-switch v-model="ruleForm.unIntegral.show" @change="changeIntegral(2)"></el-switch>
            </div>
            <div class="set-item-group">
              <el-form-item label="标签名称">
                <div class="forminputWidth">
                  <gic-input v-model="ruleForm.unIntegral.title" :max="4"></gic-input>
                </div>
              </el-form-item>
            </div>
            <div class="set-item-group">
              <label>数值颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.unIntegral.numColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.unIntegral.numColor = '#dfb772'">重置</span>
            </div>
            <div class="set-item-group">
              <label>文本颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.unIntegral.fontColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.unIntegral.fontColor = '#fff'">重置</span>
            </div>
          </div>
          <div class="integral-set-group">
             <div class="set-group-title">
              <span>签到功能</span>
              <el-switch v-model="ruleForm.sign.status"> </el-switch>
            </div>
            <div class="upload-img">
              <label>签到图片</label>
              <div class="upload-img-container">
                <div class="img-container">
                  <img v-if="ruleForm.sign.before.url" :src="ruleForm.sign.before.url" alt="">
                  <img v-else src="../../../static/img/credit-sign_bg.png">
                  <a @click="changeImg('2')">修改</a>
                </div>
                <p class="upload-warm">建议上传706*170像素的png图片</p>
              </div>
            </div>
             <div class="upload-img">
              <label>已签到</label>
              <div class="upload-img-container">
                <div class="img-container">
                  <img v-if="ruleForm.sign.after.url" :src="ruleForm.sign.after.url" alt="">
                  <img v-else src="../../../static/img/credit-sign_bg2.png">
                  <a @click="changeImg('3')">修改</a>
                </div>
                <p class="upload-warm">建议上传706*170像素的png图片</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 积分详情页面配置 -->
        <div class="integral-list-set" v-else>
          <h3>进入积分明细页面配置</h3>
          <div class="upload-img">
            <label>背景图</label>
            <div class="upload-img-container">
              <div class="img-container">
                <img v-if="ruleForm.detailBgImg.url" :src="ruleForm.detailBgImg.url">
                <img v-else src="../../../static/img/credit-detail_bg.png" alt="">
                <a @click="changeImg('4')">修改</a>
              </div>
              <p class="upload-warm">建议上传750*240像素的jpg/png图片</p>
            </div>
          </div>
          <div class="integral-set-group">
            <div class="set-group-title">
              <span>可用积分</span>
              <el-switch  v-model="ruleForm.detailIntegral.show"></el-switch>
            </div>
            <div class="set-item-group">
              <el-form-item label="标签名称">
                <div class="forminputWidth">
                  <gic-input v-model="ruleForm.detailIntegral.title" :max="4"></gic-input>
                </div>
              </el-form-item>
            </div>
            <div class="set-item-group">
              <label>数值颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.detailIntegral.numColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.detailIntegral.numColor = '#fff'">重置</span>
            </div>
            <div class="set-item-group">
              <label>文本颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.detailIntegral.fontColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.detailIntegral.fontColor = '#fff'">重置</span>
            </div>
          </div>
          <div class="integral-set-group">
            <div class="set-group-title">
              <span>冻结积分</span>
              <el-switch v-model="ruleForm.detailUnIntegral.show"></el-switch>
            </div>
            <div class="set-item-group">
              <el-form-item label="标签名称">
                <div class="forminputWidth">
                  <gic-input v-model="ruleForm.detailUnIntegral.title" :max="4"></gic-input>
                </div>
              </el-form-item>
            </div>
            <div class="set-item-group">
              <label>数值颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.detailUnIntegral.numColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.detailUnIntegral.numColor = '#fff'">重置</span>
            </div>
            <div class="set-item-group">
              <label>文本颜色</label>
              <div class="set-item-value">
                <el-color-picker v-model="ruleForm.detailUnIntegral.fontColor"></el-color-picker>
              </div>
              <span class="set-item-reset" @click="ruleForm.detailUnIntegral.fontColor = '#fff'">重置</span>
            </div>
          </div>
          <div class="integral-set-group">
            <div class="set-group-title">
              <span>积分明细</span>
            </div>
            <div class="set-item-group">
              <el-form-item label="标签名称">
                <div class="forminputWidth">
                  <gic-input v-model="ruleForm.detailIntegralmx.title" :max="4"></gic-input>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="integral-set-group">
            <div class="set-group-title">
              <span>积分说明</span>
            </div>
            <div class="set-item-group">
              <el-form-item label="标签名称">
                <div class="forminputWidth">
                  <gic-input v-model="ruleForm.detailIntegralsm.title" :max="4"></gic-input>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
          <!--图片上传-->
          <el-upload id="jifenupload" style="display: none"
                     class="avatar-uploader"
                     action="/api-plug/upload-img?requestProject=gic-web"
                     :show-file-list="false"
                     :on-success="handleImgSuccess"
                     :before-upload="beforeImgUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!--图片上传-->
        </el-form>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
    module.exports = require('./integral')
</script>

<style lang="less">
  @import "../../../static/css/variable.less";
  .integral {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;

    &-header {
      height: 65px;
      position: fixed;
      padding: 0 20px;
      left: 0;
      top: 0;
      right: 0;
      background: @customnavcolor;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo {
        flex: 0 0 700px;
      }
      .logoimg {
        display: inline-block;
        line-height: 65px;
        img {
          vertical-align: middle;
        }
      }
      .logotext {
        margin-left: 20px;
      }
      .logobtn {
        padding: 10px 20px;
        float: left;
        border: 1px solid @main-color;
        border-radius: 2px;
        margin-left: 10px;
        font-size: 14px;
        cursor: pointer;
        &:first-child {
          margin-left: 0;
        }
      }
      .btn1 {
        box-sizing: border-box;
        color: @main-color;
        &:hover {
          background-color: @main-color;
          color: #fff;
        }
      }
      .btn2 {
        color: #fff;
        background-color: @main-color;
        &:hover {
          color: @main-color;
          background-color: transparent;
        }
      }
    }
  }
  .integral-content{
    margin-top: 65px;
    box-sizing: border-box;
    font-size:0;
    display:flex;
    overflow-y:hidden;
  }
  /*左侧*/
  .integral-content-left{
    flex: 0 0 320px;
    width: 320px;
    height: 100%;
    background: #fff;
    overflow-y: auto;
    box-shadow: 0 0 10px #dcdfe6;
    font-size:14px;
  }
  .page-style-show h3{
    height:48px;
    line-height: 48px;
    font-size:16px;
    color:#303133;
    border-bottom:1px solid #dcdfe6;
    padding-left:15px;
  }
  .page-show{
    padding:15px;
  }
  .integral-list-top{
    height:185px;
    display:flex;
    position: relative;
    overflow: hidden;
    justify-content:space-around;
  }
  .integral-list-img{
    position: absolute;left: 0;top: 0;bottom: 0;right: 0;z-index: -1;width: 100%;
  }
  /*中间*/
  .integral-content-center{
    height: 100%;
    overflow-y: auto;
    display:inline-block;
    font-size:14px;
    flex:1;
  }
  .seledt-active{
    border:1px solid #1890ff;
  }
  .integral-center-container{
    width:375px;
    margin:40px auto;
    box-shadow: 0 0 10px #dcdfe6;
  }
  .integral-list-page{
    padding-bottom:35px;
    position:relative;
    cursor: pointer;
  }
  .integral-title{
    width:100%;
    height:64px;
    background:url(../../../static/img/navbar-set_mould-head.png);
    background-size: 100% 100%;
    position:relative;
  }
  .integral-title span{
    color:#000;
    font-size: 18px;
    font-weight:600;
    position:absolute;
    left:50%;
    top:32px;
    transform: translateX(-50%);
  }
  .integral-num{
    font-size:36px;
    margin-top:35px;
    text-align: center;
  }
  .integral-list-item{
      flex:1;
      text-align: center;
  }
  .integral-list-item:first-child{
    padding-left:30px;
  }
  .integral-list-item:last-child{
    padding-right:30px;
  }
  .integral-item-title{
      font-size:15px;
      margin-top:22px;
      text-align: center;
  }
 .integral-list-bottom{
    position:absolute;
    bottom:0px;
    left:50%;
    transform: translateX(-50%);
  }
  .integral-detail-page{
      margin-top:40px;
      cursor: pointer;
  }
  .integral-detail-item:first-child{
      padding-left:30px;
  }
   .integral-detail-item:last-child{
      padding-right:30px;
  }
  .integral-detail-top{
    height:120px;
    display:flex;
    position: relative;
    overflow: hidden;
    justify-content:space-around;
  }
  .integral-detail-bgimg{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
  .integral-detail-num{
      font-size:25px;
      margin-top:30px;
      text-align: center;
  }
  .integral-detail-title{
      font-size:16px;
      margin-top:20px;
      text-align: center;
  }
  .integral-detail-center{
      display:flex;
      justify-content: space-around;
      height:46px;
      line-height:46px;
      background:#fff;
  }
  .integral-explain-title{
      width:85px;
      font-size:14px;
      text-align: center;
      border-bottom:2px solid #fff;
  }
  .integral-detail-bottom{
      margin-top:10px;
  }
  .integral-detail-bottom img{
    width:100%;
  }
  /*右侧*/
  .integral-content-right{
    flex: 0 0 400px;
    width: 400px;
    height: 100%;
    background: #fff;
    overflow-y: auto;
    box-shadow: 0 0 10px #dcdfe6;
    font-size:14px;
    color:#606266;
  }
  .page-title{
    position:relative;
    margin:25px 0 22px 0;
    padding:0 15px;
  }
  .page-title label{
    width:70px;
    display:inline-block;
  }
  .w-280{
    width:280px;
  }
  .len-num{
    position:absolute;
    right:35px;
    top:15px;
    font-size:12px;
    color:#c0c4cc;
  }
  .len-num i{
    font-style:normal
  }
  .integral-list-set{
      padding-bottom:65px;
  }
  .integral-list-set h3{
    font-size:16px;
    color:#303133;
    border-bottom:1px solid #dcdfe6;
    padding:0 15px 0 15px;
    font-weight: 700;
    line-height: 45px;
  }
  .upload-img{
    padding:20px 15px 10px
  }
  .upload-img>label{
    width:57px;
    display:inline-block;
    text-align: right;
    padding-right: 10px;
  }
  .upload-img-container{
    display:inline-block;
    vertical-align: top;
  }
  .img-container img{
      width:200px;
      height:100px;
  }
  .img-container a{
    margin-left:15px;
    color:#1890ff;
    cursor: pointer;
  }
  .img-container a:hover{
    color:#66b1ff;
  }
  .upload-warm{
    font-size:12px;
    color: #909399;
    margin-top:12px;
  }
  .integral-set-group{
    border:1px solid #dcdfe6;
    border-radius:2px;
    margin:20px 15px 0 15px;
    padding:18px;
  }
  .set-group-title{
      color:#303133;
      display:flex;
      justify-content: space-between;
      font-size:14px;
  }
  .set-group-title > span{
    font-weight: 700;
  }
  .set-item-group{
    position:relative;
    margin-top:25px;
    font-size: 14px;
  }
  .w-230{
    width:230px;
  }
  .set-item-group label{
    display:inline-block;
    width: 66px;
    font-size: 14px;
    padding-left: 2px;
    box-sizing: border-box;
  }
 .set-item-value{
  display:inline-block;
  vertical-align: middle;
 }
 .integral-set-group .upload-img{
    padding:0;
    margin-top:25px;
 }
 .integral-set-group .upload-img img{
  border:1px solid #dcdfe6;
 }
 .integral-set-group .img-container img{
  height:50px;
 }
  .set-item-reset{
    margin-left: 10px;
    cursor: pointer;
    color: #1890ff;
  }
  .demo-ruleForm .form-item-box .gic-form-item{
    width: 280px !important;
  }
  .forminputWidth .gic-form-item .gic-form-input{
    height: auto !important;
    line-height: 1 !important;
  }
.el-row .el-button--primary.is-plain{
  background: #04143a;
  border-color: #1890ff;
}
.el-row .el-button--primary.is-plain:hover{
    background: #1890ff;
    border-color: #1890ff;
    color: #fff;
}
</style>
