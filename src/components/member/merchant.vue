<template>
  <transition name="slide-fade">
  <div class="membercard">
    <div class="membercard-header">
      <div class="logo">
        <a class="logoimg"><img width="158" height="49" src="../../../static/img/navlogo.png" alt=""></a>
        <a class="logoimg logotext"><img src="../../../static/img/jtshtext.png" alt=""></a>
      </div>
      <div class="handler">
        <!-- <router-link :to="{path: '/member'}" class="logobtn btn1">返回</router-link>
        <a class="logobtn btn1"  @click="submitForm('1')">保存</a>
        <a class="logobtn btn2"  @click="submitForm('2')">保存并发布</a> -->
        <el-row>
            <el-button type="primary" plain @click="backBtn">返 回</el-button>
            <el-button type="primary" plain @click="submitForm('1')">保 存</el-button>
            <el-button type="primary" @click="submitForm('2')">保存并发布</el-button>
          </el-row>
      </div>
    </div>
    <div class="container" :style="{height: (bodyHeight - 65) + 'px'}">
      <div class="container-item1 left">
        <div>
          <h1 class="container-title">进入集团商户列表页面风格</h1>
          <div class="line"></div>
          <div class="privilege">
            <div class="privilege-box">
              <a class="privilege-boxitem2">
                <img width="50" height="50" src="../../../static/img/default.jpg" alt="">
              </a>
              <a class="privilege-boxitem2">
                <img width="50" height="50" src="../../../static/img/default.jpg" alt="">
              </a>
              <a class="privilege-boxitem2">
                <img width="50" height="50" src="../../../static/img/default.jpg" alt="">
              </a>
              <a class="privilege-boxitem2">
                <img width="50" height="50" src="../../../static/img/default.jpg" alt="">
              </a>
              <div class="privilege-boxmore">查看全部适用商户</div>
            </div>
          </div>
        </div>
        <div>
          <h1 class="container-title">集团商户列表风格</h1>
          <div class="line"></div>
          <div class="merchant">
             <div class="merchant-box">
               <div class="merchant-tip">关注集团旗下其他品牌公众号，享受更多权益</div>
               <div class="merchant-list">
                 <div class="merchant-item">
                   <span class="merchant-item1">
                     <img width="36" height="36" src="../../../static/img/default.jpg" alt="">
                   </span>
                   <span class="merchant-item2">ceshi</span>
                   <span class="merchant-item3">进入小程序</span>
                 </div>
                 <div class="merchant-item">
                   <span class="merchant-item1">
                     <img width="36" height="36" src="../../../static/img/default.jpg" alt="">
                   </span>
                   <span class="merchant-item2">ceshi</span>
                   <span class="merchant-item3">进入小程序</span>
                 </div>
               </div>
               <div class="merchant-bottom"></div>
             </div>
          </div>
        </div>

      </div>

      <div class="container-item2 middle">
        <div class="privilege-displaycard">
          <div class="displayheader"> {{ ruleForm.title }} </div>
          <div class="privilege-box" style="justify-content: flex-start" v-if="merchantList.length > 0">
            <a class="privilege-boxitem2" v-for="item in merchantList">
              <img width="60" height="60" :src="item.url" alt="">
            </a>
            <div class="privilege-boxmore2">查看全部适用商户</div>
          </div>
        </div>
        <div class="privilege-displaycard backheight">
          <div class="displayheader"> 集团小程序 </div>
            <div class="merchant-box2">
              <div class="merchant-tip">关注集团旗下其他品牌公众号，享受更多权益</div>
              <div class="merchant-list">
                <div class="merchant-item" v-for="item in merchantList">
                   <span class="merchant-item1">
                     <img  width="36" height="36" :src="item.url" alt="">
                   </span>
                  <span class="merchant-item2">{{ item.title }}</span>
                  <span class="merchant-item3">进入小程序</span>
                </div>
              </div>
              <div class="merchant-bottom"></div>
            </div>
        </div>
      </div>
      <div class="container-item3 right form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm" label-width="70px">
          <el-form-item label="页面名称">
            <div class="forminputWidth form-item-box">
              <gic-input v-model="ruleForm.title" :max="10"></gic-input>
            </div>
          </el-form-item>
          <h1 class="titleline">集团列表配置</h1>
          <div>
            <div class="box" v-for="(item,index) in merchantList">
              <div class="box-wrap">
                <span class="box-item1">{{ item.title }}</span>
                <span class="box-item2"><el-switch @change="changeStatus(item.status,item)" v-model="item.status"></el-switch></span>
              </div>
              <div class="box-label">
                <el-form-item label="商户名称">
                  <div class="forminputWidth">
                    <gic-input v-model="item.title" :max="10"></gic-input>
                  </div>
                </el-form-item>
              </div>
              <div class="box-label">
                <el-form-item label="商户logo">
                  <div class="merchant-logo" @click="uploadImg(index)">
                    <img class="merchant-logoimg" v-if="item.url"  :src="item.url" alt="">
                    <img class="merchant-logoimg" v-else src="/static/img/default.jpg" alt="">
                    <!--<div class="merchant-changelogo">更改图片</div>-->
                  </div>
                  <p class="merchant-beizhu">建议上传 2:1 尺寸的jpg/png图片</p>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>

        <!--图片上传-->
        <el-upload id="merchantupload" style="display: none"
                   class="avatar-uploader"
                   action="/api-plug/upload-img?requestProject=gic-web"
                   :show-file-list="false"
                   :on-success="handleImgSuccess"
                   :before-upload="beforeImgUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!--图片上传-->

      </div>
    </div>
  </div>
  </transition>
</template>

<script>
  module.exports = require('./merchant')
</script>

<style lang="less" scoped>
  @import "./membercard";
</style>
