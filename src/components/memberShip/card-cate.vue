<template>
  <div class="form-wrap"><!-- :rules="rules" -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px" class="demo-ruleForm">
      <el-form-item label="开卡方式" prop="cardCreateType">
        <el-radio :disabled="contactBool && (ruleForm.cardCreateType=='0'?false:true)" v-model="ruleForm.cardCreateType" label="0">认证身份后发卡</el-radio>
        <el-radio :disabled="contactBool && (ruleForm.cardCreateType=='1'?false:true)" v-model="ruleForm.cardCreateType" label="1"  @change="changeType"><span>关注后自动发卡</span></el-radio>
      </el-form-item>

      <el-form-item label="会员卡号" prop="cardNoStatus" class="margin-20">
        <el-radio-group @change="selectMemCard" v-model="ruleForm.cardNoStatus">
          <el-radio label="1" v-if="ruleForm.cardCreateType!=1">手机号作为卡号</el-radio>
          <el-radio label="0">自定义号段</el-radio>
          <el-radio label="2">时间信息+自定义号段</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自定义号段设置" v-if="ruleForm.cardNoStatus!=1">  <!--  -->
        <label class="start-num">起始号段</label><el-input :disabled="cardBeginBool" @keyup.native="onlyNum" @blur="checkNum" maxLength="16" v-model="ruleForm.cardBegin" ></el-input><label class="label-title">注意:  除首位外，其余号段逢4必进，即若号段数值到4，则默认+1进到5</label>
        <div v-show="errorBool3" class="el-form-item__error">{{ errorMsg3 }}</div>
      </el-form-item>
      <el-form-item label=" ">
        <div>
          <el-checkbox v-model="ruleForm.usePrefix">前缀</el-checkbox>
          <el-input data-num="1" maxLength="8" :disabled="!ruleForm.usePrefix" @blur="checkData(ruleForm.prefixKey,$event)" v-model="ruleForm.prefixKey"></el-input>
        </div>
        <div v-show="ruleForm.usePrefix && errorBool1" class="el-form-item__error">{{ errorMsg1 }}</div>
      </el-form-item>
      <el-form-item label=" " v-if="ruleForm.cardNoStatus!=2">
        <div>
          <el-checkbox v-model="ruleForm.useSuffix" >后缀</el-checkbox>
          <el-input data-num="2" maxLength="8" :disabled="!ruleForm.useSuffix" @blur="checkData(ruleForm.suffixKey,$event)" v-model="ruleForm.suffixKey"></el-input>
        </div>
        <div v-show="ruleForm.useSuffix && errorBool2" class="el-form-item__error">{{ errorMsg2 }}</div>
      </el-form-item>

      <el-form-item label="时间格式" v-if="ruleForm.cardNoStatus==2">
        <el-select v-model="ruleForm.cardNoTimeType" placeholder="请选择">
          <el-option
            v-for="item in TimeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="会员卡详情" prop="desc" class="margin-20" style="display: none;">
        <div class="tinymce-wrap">
          <tinymce-edit ref="tinymceWrap" :bodyHtml="ruleForm.gradeDescribe" :projectName="projectName"></tinymce-edit>
        </div>
        <!-- <div v-html='tinymceHtml'></div> -->
      </el-form-item>

      <el-form-item style="margin-bottom: 48px">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
import tinymceEdit from 'components/memberShip/tinymce-edit' // 开卡策略

import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import { getRequest, postRequest, postForm } from '@/api/api';
export default {
  name: "pointSystem",
  props: {
    cardCateInfo: Object,
    projectName: String,
    contactBool:Boolean,
    useSuffix:Boolean,
    suffixKey:String
  },
  inject:['reload'],    // 注入依赖
  data() {
    return {
      repProjectName: 'gic-web',
      TimeOptions: [
        {
          value: '0',
          label: '如20170712'
        },
        {
          value: '1',
          label: '如170712'
        },
        {
          value: '2',
          label: '如201707121212'
        },
        {
          value: '3',
          label: '如1707121212'
        }
      ],
      ruleForm: {
        cardCreateType: '0',
        cardNoStatus: '0',
        cardBegin: '',
        usePrefix: false,
        prefixKey: '',
        useSuffix: false,
        suffixKey: '',
        cardNoTimeType: '0',
        gradeDescribe: '',
        sex:0
      },
      cardBeginBool:true,
      rules: {},

      // tinymce
      tinymceHtml: '请输入内容',
      init: {
        language_url: 'static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'static/tinymce/skins/lightgray',
        height: 300,
        // 图片上传
        // without images_upload_url set, Upload tab won't show up
        // images_upload_url: '',
        // images_upload_base_path: '/some/basepath',
        images_upload_credentials: true, //是否应传递cookie等跨域的凭据
        // images_upload_handler提供三个参数：blobInfo, success, failure
        images_upload_handler: (blobInfo, success, failure)=>{
          console.log(blobInfo)
          this.handleImgUpload(blobInfo, success, failure)
        },
        // 添加插件
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        branding: false,
        setup: function(editor) {
            // 点击编辑框回调
            editor.on('click', function(e) {
              console.log('Editor was clicked');
            });
        }

      },

      errorBool1:false,
      errorBool2:false,
      errorBool3:false,
      errorMsg1:'请输入前缀',
      errorMsg2:'请输入后缀',
      errorMsg3:'请输入起始号段',
    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // 点击自动发卡
    changeType() {
      var that = this
      that.ruleForm.cardNoStatus = '0'
    },
    // 上传图片
    handleImgUpload (blobInfo, success, failure) {
      var that = this
      let formdata = new FormData()
      formdata.set('upload_file', blobInfo.blob())
      formdata.set("requestProject",that.repProjectName);
      console.log(formdata)
      postForm('/api-plug/upload-img', formdata).then(res => {
        success(res.data.result[0].qcloudImageUrl)
      }).catch(res => {
        console.log(res)
        failure('error')
      })
    },

    changeRoute(route) {
      this.$router.push(route);
    },
    checkData(value,e){    // 只能输入字母 数字
      // console.log(value);
      var num = e.target.dataset.num;
      var reg = /^[a-zA-Z0-9]+$/;
      if(value){  // 有内容
        if(reg.test(value)){
          if(num==1){
            this.errorBool1 = false;
          }else if(num==2){
            this.errorBool2 = false;
          }
        }else{
          if(num==1){
            this.errorBool1 = true;
            this.errorMsg1 = '前缀格式错误';
          }else if(num==2){
            this.errorBool2 = true;
            this.errorMsg2 = '后缀格式错误';
          }
        }
      }else{  // 未输入内容
        if(num==1){
          this.errorBool1 = true;
          this.errorMsg1 = '请输入前缀';
        }else if(num==2){
          this.errorBool2 = true;
          this.errorMsg2 = '请输入后缀';
        }
      }
    },
    selectMemCard(val){  // 切换会员卡号
      // console.log(val);
    },
    onlyNum(){  // 只能输入数字
      this.ruleForm.cardBegin = this.ruleForm.cardBegin.replace(/\D/g,'');
    },
    checkNum(){ // 只能首字母为4
      if(this.ruleForm.cardBegin){
        if(this.ruleForm.cardBegin.lastIndexOf('4')>0){  // 最后一个4的位置下标
          this.errorMsg3 = '起始号段只能首位为4，其余位置均不能为4';
          this.errorBool3 = true;
        }else{
          this.errorBool3 = false;
        }
      }else{
        this.errorMsg3 = '请输入起始号段';
        this.errorBool3 = true;
      }
    },
    // 保存
    submitForm(formName) {
      var that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(that.$refs.tinymceWrap.tinymceHtml)
          // that.ruleForm.gradeDescribe = that.$refs.tinymceWrap.tinymceHtml;
          var data = JSON.parse(JSON.stringify(that.ruleForm));

          // 自定义  时间信息+自定义  判断起始号段
          if(data.cardNoStatus=='0' || data.cardNoStatus=='2'){ 
            if(data.cardBegin){
              if(data.cardBegin.lastIndexOf('4')>0){  // 最后一个4的位置下标
                this.errorMsg3 = '起始号段只能首位为4，其余位置均不能为4';
                this.errorBool3 = true;
              }else{
                this.errorBool3 = false;
              }
            }else{
              this.errorMsg3 = '请输入起始号段';
              this.errorBool3 = true;
            }
          }else{
            this.errorBool3 = false;
          }
          // 非空验证
          if (data.usePrefix) {
            if(data.prefixKey){
              this.errorBool1 = false;
              var reg = /^[a-zA-Z0-9]+$/;
              if(!reg.test(data.prefixKey)){
                this.errorMsg1 = '前缀格式错误';
                this.errorBool1 = true;
              }else{
                this.errorBool1 = false;
              }
            }else{
              this.errorMsg1 = '请输入前缀';
              this.errorBool1 = true;
            }
          }else{
            this.errorBool1 = false;
          }
          // 手机号作为卡号 自定义  判断  前缀  后缀
          if(data.cardNoStatus=='1' || data.cardNoStatus=='0'){ 
            if (data.useSuffix) {
              if(data.suffixKey){
                this.errorBool2 = false;
                var reg = /^[a-zA-Z0-9]+$/;
                if(!reg.test(data.suffixKey)){
                  this.errorMsg2 = '后缀格式错误';
                  this.errorBool2 = true;
                }else{
                  this.errorBool2 = false;
                }
              }else{
                this.errorMsg2 = '请输入后缀';
                this.errorBool2 = true;
              }
            }else{
              this.errorBool2 = false;
            }
          }else{
            this.errorBool2 = false;
            if(this.useSuffix && this.errorBool2){ // 初始值选中了后缀 且报错
              data.useSuffix = this.useSuffix;
              data.suffixKey = this.suffixKey;
            }
            if(!this.useSuffix && this.errorBool2){ // 初始值未选中后缀 且报错
              data.useSuffix = false;
              data.suffixKey = "";
            }
          }

          if(this.errorBool1 || this.errorBool2 || this.errorBool3){

          }else{
            data.usePrefix = data.usePrefix == true? 1:0;
            data.useSuffix = data.useSuffix == true? 1:0;

            // console.log(data);
            that.saveInfo(data)
          }
          // if (!data.gradeDescribe) {
          //   showMsg.showmsg('请填写会员卡详情','error')
          //   return;
          // }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 保存
    saveInfo(form) {
      var that = this
      var para = form

      postRequest('/api-admin/save-enter-member-system',para)
      .then((res) => {
        console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {
          that.reload();    //  保存成功之后，调用依赖，从而刷新本页面
          showMsg.showmsg('保存成功','success')
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },
  },
  watch: {
    projectName: function(newData,oldData){
      var that = this;
      // console.log("新数据:",newData,oldData)
      that.repProjectName = newData || 'gic-web';
    },
    cardCateInfo: {
      handler(newData,oldData){
        var that = this;
        console.log("旧数据:",oldData);
        console.log("新数据:",newData);
        // this.suffixKey = oldData.suffixKey; // 后缀的值
        // this.useSuffix = oldData.useSuffix;
        that.ruleForm = newData;
        if(that.ruleForm.cardBegin=='null'){
          that.ruleForm.cardBegin = "";
          that.cardBeginBool = false;
        }
        if(that.ruleForm.cardBegin == ""){
          that.cardBeginBool = false;
        }
        // if(that.ruleForm.cardBegin=='null' || that.ruleForm.cardBegin == ""){
        //   console.log('kl');
        //   that.cardBeginBool = false;
        //   that.ruleForm.cardBegin = "";
        // }
        // console.log(that.cardBeginBool);
      },
      deep:true
    }
  },
  components: {
     tinymceEdit
  },
  mounted() {
    var that = this
    console.log("开卡策略:",that.cardCateInfo)
    // if (Object.keys(that.cardCateInfo).length) {
    //   that.ruleForm = that.cardCateInfo;
    // }
    
    if (Object.keys(that.cardCateInfo).length) {
      that.ruleForm = that.cardCateInfo;
      if(that.cardCateInfo.cardBegin=='null'){
        console.log('1');
        that.cardBeginBool = false;
        that.ruleForm.cardBegin = "";
      }else{
        that.cardBeginBool = true;
      }
    }else{
      if(that.ruleForm.cardBegin == ""){
        console.log('2');
        that.cardBeginBool = false;
      }
    }
    console.log(that.cardBeginBool);
    console.log(that.ruleForm);
  }
}
</script>
<style lang="less" scoped>
.form-wrap {
  .el-input {
    width: 178px;
    padding: 0 10px;
  }

  .padding-0 {
    padding: 0;
  }

  .form-child {
    width: 900px;
    padding: 15px 20px 10px 0px;
    background: #f5f6f9;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .margin-20 {
    margin-top: 20px;
  }

  .tinymce-wrap {
    width: 780px;
  }

  .label-title {
    font-size: 13px;
    color: #828282;
  }

  .start-num {
    color: #828282;
  }
}

.demo-ruleForm /deep/ .el-form-item .el-input__inner{
  padding-right: 15px
}
</style>
