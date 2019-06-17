<template>
  <div class="form-wrap">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="积分获取规则" prop="">
        <div>
          <el-radio v-model="ruleForm.integralGetStatus" label="1">每消费</el-radio>
          <!-- <el-input v-model="ruleForm.integralGet.fee"  @blur="formatInputFee($event)"></el-input> -->
          <el-input-number v-model="ruleForm.integralGet.fee" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
          <label>元，获取 </label>
          <el-input-number v-model="ruleForm.integralGet.integral" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
          <!-- <el-input v-model="ruleForm.integralGet.integral"  @keyup.native="formatInput($event)"></el-input> --><label>积分。取整策略为</label>
          <el-select v-model="ruleForm.integralGetStrategy" placeholder="请选择">
            <el-option
              v-for="item in cateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-radio v-model="ruleForm.integralGetStatus" label="0" class="margin-20">不获取积分</el-radio>
        </div>
      </el-form-item>
      <div class="form-child" v-if="ruleForm.integralGetStatus==1">
        <el-form-item label="折扣控制" prop="">
          <div class="radio-cell">
             <el-radio v-model="ruleForm.integralGetDiscountControl" label="1">所有折扣商品都适用</el-radio>
          </div>
          <div class="radio-cell margin-20">
             <el-radio v-model="ruleForm.integralGetDiscountControl" label="2">折扣</el-radio>
             <!-- <el-input v-model="ruleForm.integralGetDiscountControlLower" @change="formatInputChange($event)"></el-input> -->
             <el-input-number v-model="ruleForm.integralGetDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
             <label>至</label>
             <!-- <el-input v-model="ruleForm.integralGetDiscountControlUpper" @change="formatInputChange($event)"></el-input> -->
             <el-input-number v-model="ruleForm.integralGetDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
             <label>折商品都适用</label>
             <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
          </div>
        </el-form-item>
        <el-form-item label="积分冻结期" prop="name" class="padding-0">
          <el-input style="padding-left: 0" v-model="ruleForm.integralGetFreezeDays" @keyup.native="formatInput($event)"></el-input><label>天</label>
        </el-form-item>
        <el-form-item label="积分有效期" prop="name" class="padding-0">
          <el-input style="padding-left: 0" v-model="ruleForm.effectiveTime" @keyup.native="formatInput($event)"></el-input><label>天</label>
        </el-form-item>
      </div>
      <el-form-item label="积分抵现规则" prop="region" class="margin-20">
        <div>
          <el-radio v-model="ruleForm.integralUseStatus" label="1">每使用</el-radio>
          <!-- <el-input v-model="ruleForm.integralUse.integral"  @keyup.native="formatInput($event)"></el-input> -->
          <el-input-number v-model="ruleForm.integralUse.integral" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
          <label>积分，抵 </label>
          <el-input-number v-model="ruleForm.integralUse.fee" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
          <!-- <el-input v-model="ruleForm.integralUse.fee"  @blur="formatInputFee($event)"></el-input> -->
          <label>元</label>
        </div>
        <div class="margin-20">
          <el-radio v-model="ruleForm.integralUseStatus" label="0">不支持抵现</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="积分成本">
        <label>每使用</label>
        <el-input-number v-model="ruleForm.integralCost.integral" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
        <!-- <el-input v-model="ruleForm.integralCost.integral"  @keyup.native="formatInput($event)"></el-input> -->
        <label>积分，承担 </label>
        <!-- <el-input v-model="ruleForm.integralCost.fee"  @blur="formatInputFee($event)"></el-input> -->
        <el-input-number v-model="ruleForm.integralCost.fee" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
        <label>元</label>
      </el-form-item>
      <div class="form-child margin-20" v-if="ruleForm.integralUseStatus==1">
        <el-form-item label="折扣控制" prop="region">
          <div class="radio-cell">
            <el-radio  v-model="ruleForm.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
          </div>
          <div class="radio-cell margin-20" >
            <el-radio v-model="ruleForm.integralUseDiscountControl"  label="2">折扣</el-radio>
            <!-- <el-input v-model="ruleForm.integralUseDiscountControlLower" @change="formatInputChange($event)"></el-input> -->
            <el-input-number v-model="ruleForm.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
            <label>至</label>
            <!-- <el-input v-model="ruleForm.integralUseDiscountControlUpper" @change="formatInputChange($event)"></el-input> -->
            <el-input-number v-model="ruleForm.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
            <label>折商品都适用</label>
            <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
          </div>
        </el-form-item>
        <el-form-item label="比例限制" prop="name">
            <label>最多可抵用商品金额的 </label>
            <el-input v-model="ruleForm.useProportionalRestriction" @keyup.native="formatInput($event)"><template slot="append">%</template></el-input>
        </el-form-item>
      </div>
      <el-form-item label="积分说明" prop="desc" class="margin-20">
        <div class="tinymce-wrap">
          <editor id='tinymce' v-model='ruleForm.integralScript' :init='init'></editor>
        </div>
        <!-- <div v-html='tinymceHtml'></div> -->
      </el-form-item>
      <el-form-item style="margin-bottom: 48px">
        <el-button :disabled="contactBool" type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
import { postRequest,postJsonRequest,postForm } from '@/api/api';

import strLength from '@/common/js/strlen';
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import tinymceEdit from 'components/memberShip/tinymce-edit' // 开卡策略
import editor from '@tinymce/tinymce-vue'
// import editor from 'components/memberShip/editor'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
  export default {
  name: "pointSystem",
  props: {
    pointInfo: Object,
    projectName: String,
    contactBool:Boolean
  },
  data() {
    return {
      repProjectName: 'gic-web',

      // form
      cateOptions: [
        {
          value: '1',
          label: '四舍五入'
        },
        {
          value: '2',
          label: '抹零'
        },
        {
          value: '3',
          label: '进位制'
        }
      ],
      ruleForm: {
        // 积分获取规则
        memberIntegralId: "",   // id
        enterpriseId: "",   //企业id
        integralGet: {fee:"1",integral:"1"},   //  积分获取
        integralUse: {fee:"1",integral:"1"},  //积分使用
        integralGetStrategy:'1',
        integralScript: "",  //说明
        integralGetStatus: "1",  //积分获得开启（0：否，1：是）
        integralUseStatus: "1",  //积分使用开启（0：否，1：是）
        effectiveTime: "100",  //积分有效期
        integralGetDiscountControl: '2',
        integralGetDiscountControlUpper:" 0.0",   // 折扣控制 折扣范围 下限
        integralGetDiscountControlLower: "0.0",   // 折扣控制 折扣范围 上限
        integralGetFreezeDays: "1",    // 获取积分冻结天数
        integralUseDiscountControl: "1",  // 折扣控制 1所有折扣商品适用 2折扣范围
        integralUseDiscountControlUpper: "0.0",
        integralUseDiscountControlLower: "0.0",
        useProportionalRestriction: "90",  //抵现比例限制
        integralCost: {fee:"1",integral:"1"},  //积分成本
      },
      rules: {
      },

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
          // console.log(blobInfo)
          this.handleImgUpload(blobInfo, success, failure)
        },
        // 添加插件
        // plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
        // toolbar:
        //   'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
        plugins: 'image textcolor',
        toolbar:'fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify |  link unlink image code',
        menubar: false,  // 新增
        branding: false,
        setup: function(editor) {
            // 点击编辑框回调
            editor.on('click', function(e) {
              console.log('Editor was clicked');
            });
        },
        fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
      }
    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // 保存
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(that.pointInfo);
          // console.log(that.ruleForm);
          var data = JSON.parse(JSON.stringify(that.ruleForm))

          // 非空验证
          var flag = !data.integralGet.fee || !data.integralGet.integral;
          if (data.integralGetStatus == 1 && flag) {
            that.$message.error("请填写积分获取规则")
            return;
          }
          
          if(data.integralGetStatus == 1){
            if(!Number(data.integralGet.fee)){
              that.$message.error("积分获取规则中的消费金额不能为0")
              return;
            }
            if(!Number(data.integralGet.integral)){
              that.$message.error("积分获取规则中的获取积分不能为0")
              return;
            }
          }
          // console.log(String(data.integralGetFreezeDays));

          if(String(data.integralGetFreezeDays)==''){ // 积分冻结期
            that.$message.error({
              duration: 1000,
              message: "请填写积分冻结期"
            })
            return;
          }

          if(data.effectiveTime==''){ // 积分有效期
            that.$message.error({
              duration: 1000,
              message: "请填写积分有效期"
            })
            return;
          }else{
            if(parseInt(data.effectiveTime)<1){
              that.$message.error({
                duration: 1000,
                message: "积分有效期不能低于最低限制"
              })
              return;
            }
          }

          var tag = !data.integralUse.fee||!data.integralUse.integral||!data.integralCost.integral|| !data.integralCost.fee||!parseInt(data.useProportionalRestriction);
          if (data.integralUseStatus == 1 && tag) {
            that.$message.error({
              duration: 1000,
              message: "请填写积分抵现规则"
            })
            return;
          }
          if(data.integralUseStatus == 1){
            if(!Number(data.integralUse.fee)){
              that.$message.error("积分抵现规则中的抵现金额不能为0")
              return;
            }
            if(!Number(data.integralUse.integral)){
              that.$message.error("积分抵现规则中的使用积分不能为0")
              return;
            }
          }
          // 积分成本
          if(!Number(data.integralCost.fee)){
            that.$message.error("积分成本中的承担金额不能为0")
            return;
          }
          if(!Number(data.integralCost.integral)){
            that.$message.error("积分成本中的使用积分不能为0")
            return;
          }

          // 折扣率判断
          if(data.integralGetStatus == 1 && data.integralGetDiscountControl == 2){
            var flagA = Number(data.integralGetDiscountControlUpper) <= Number(data.integralGetDiscountControlLower);
            if(!data.integralGetDiscountControlLower || !data.integralGetDiscountControlUpper){
              that.$message.error('积分获取规则中的折扣率不能为空')
              return;
            }
            if (flagA) {
              that.$message.error('积分获取规则中的折扣率格式有误')
              return;
            }
          }
          if(data.integralUseStatus == 1 && data.integralUseDiscountControl == 2){
            var flagB = Number(data.integralUseDiscountControlUpper) <= Number(data.integralUseDiscountControlLower)
            if(!data.integralUseDiscountControlLower || !data.integralUseDiscountControlUpper){
              that.$message.error('积分抵现规则中的折扣率不能为空')
              return;
            }
            if (flagB) {
              that.$message.error("积分抵现规则中的折扣率格式有误")
              return;
            }
          }

          if (data.useProportionalRestriction > 100) {
            that.$message.error("比例限制文本格式有误")
            return;
          }

          // 获取规则需要乘以10
          if (!data.integralGetStrategy || data.integralGetStrategy == 0) {
            data.integralGetStrategy = '1';
          }
          data.integralGet.fee = parseInt(data.integralGet.fee*10)
          data.integralGet.integral = parseInt(data.integralGet.integral*10)
          data.integralGet = data.integralGet?JSON.stringify(data.integralGet):that.ruleForm.integralGet
          data.integralUse = data.integralUse?JSON.stringify(data.integralUse):that.ruleForm.integralUse
          data.integralCost = data.integralCost?JSON.stringify(data.integralCost):that.ruleForm.integralCost
          that.saveInfo(data);
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },

    saveInfo(data) {
      var that = this
      var param = data;
      param.requestProject = that.repProjectName
      // console.log(param)
      postRequest('/api-admin/save-member-integral-setting',param)
      .then((res) => {
        // console.log(res,res.data,res.data.errorCode)
        var resData = res.data
        if (resData.errorCode == 0) {
          that.$message({
            message: '保存成功',
            type: 'success'
          });
          // 更新原数据
          // that.updateData();
          return;
        }
        // that.userFormVisible = false;
        that.$message.error({
          duration: 1000,
          message: resData.message
        })

      })
      .catch(function (error) {
        // console.log(error);
        // that.toLogin()
        // that.userFormVisible = false;
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 更新数据
    updateData() {
      var that = this
      that.ruleForm.integralGet = JSON.parse(that.ruleForm.integralGet)
      that.ruleForm.integralUse = JSON.parse(that.ruleForm.integralUse)
      that.ruleForm.integralCost = JSON.parse(that.ruleForm.integralCost)
    },


    // 上传图片
    handleImgUpload (blobInfo, success, failure) {
      var that = this
      let formdata = new FormData()
      formdata.set('upload_file', blobInfo.blob())
      formdata.set("requestProject",that.repProjectName);
      // console.log(formdata)
      postForm('/api-plug/upload-img', formdata).then(res => {
        success(res.data.result[0].qcloudImageUrl)
      }).catch(res => {
        // console.log(res)
        failure('error')
      })
    },

     // 积分获取
    formatInputFee(e) {
      var that = this
      // console.log(e)  integralCost.fee
      that.ruleForm.integralGet.fee = Number(strLength.getCharVal(String(that.ruleForm.integralGet.fee).replace(/[^\.\d]/g,''),6)).toFixed(1)
      that.ruleForm.integralUse.fee = Number(strLength.getCharVal(String(that.ruleForm.integralUse.fee).replace(/[^\.\d]/g,''),6)).toFixed(1)
      that.ruleForm.integralCost.fee = Number(strLength.getCharVal(String(that.ruleForm.integralCost.fee).replace(/[^\.\d]/g,''),6)).toFixed(1)
    },

    // 折扣重新写的判断
    formatInputChange(e) {
      var that = this
      // console.log(e)
      that.ruleForm.integralGetDiscountControlLower = Number(String(that.ruleForm.integralGetDiscountControlLower).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.integralGetDiscountControlLower).replace(/[^\.\d]/g,'')).toFixed(2);
      that.ruleForm.integralGetDiscountControlUpper = Number(String(that.ruleForm.integralGetDiscountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.integralGetDiscountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2);
      // 比较大小
      if (that.ruleForm.integralGetDiscountControlLower > 10) {
        that.ruleForm.integralGetDiscountControlLower = Number(10).toFixed(2)
      }
      if (that.ruleForm.integralGetDiscountControlUpper > 10) {
        that.ruleForm.integralGetDiscountControlUpper = Number(10).toFixed(2)
      }

      that.ruleForm.integralUseDiscountControlLower = Number(String(that.ruleForm.integralUseDiscountControlLower).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.integralUseDiscountControlLower).replace(/[^\.\d]/g,'')).toFixed(2);
      that.ruleForm.integralUseDiscountControlUpper = Number(String(that.ruleForm.integralUseDiscountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.integralUseDiscountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2);
       // 比较大小
      if (that.ruleForm.integralUseDiscountControlLower > 10) {
        that.ruleForm.integralUseDiscountControlLower = Number(10).toFixed(2)
      }
      if (that.ruleForm.integralUseDiscountControlUpper > 10) {
        that.ruleForm.integralUseDiscountControlUpper = Number(10).toFixed(2)
      }
      that.$forceUpdate()
    },

    // 输入框输入校验数字
    formatInput(e){
      var that = this
      // console.log(e,that.ruleForm.integralGet.fee)

      that.ruleForm.integralUse.fee = strLength.getCharVal(String(that.ruleForm.integralUse.fee).replace(/[^\d]/g,''),6) || '0'
      that.ruleForm.integralUse.integral = strLength.getCharVal(String(that.ruleForm.integralUse.integral).replace(/[^\d]/g,''),8) || '0'

      that.ruleForm.integralCost.fee = strLength.getCharVal(String(that.ruleForm.integralCost.fee).replace(/[^\d]/g,''),6) || '0'
      that.ruleForm.integralCost.integral = strLength.getCharVal(String(that.ruleForm.integralCost.integral).replace(/[^\d]/g,''),8) || '0'

      that.ruleForm.integralGetFreezeDays = strLength.getCharVal(String( that.ruleForm.integralGetFreezeDays).replace(/[^\d]/g,''),4)
      that.ruleForm.effectiveTime = strLength.getCharVal(String(that.ruleForm.effectiveTime).replace(/[^\d]/g,''),4)

      that.ruleForm.useProportionalRestriction = strLength.getCharVal(String(that.ruleForm.useProportionalRestriction).replace(/[^\d]/g,''),3) || '0'
      if (parseInt(that.ruleForm.useProportionalRestriction)> 100) {
        that.ruleForm.useProportionalRestriction = 100;
      }

      that.$forceUpdate()

    },

    changeRoute(route) {
      this.$router.push(route);
    }
  },
  watch: {
    projectName: function(newData,oldData){
      var that = this;
      that.repProjectName = newData || 'gic-web';
    },
    pointInfo: function(newData,oldData){
      var that = this;
      if(newData){
        that.ruleForm = newData;
      }
    },
  },
  components: {
    editor,
    tinymceEdit
  },
  mounted() {
    var that = this
    tinymce.init({});
    // 传递的数据非空赋值
    if(that.pointInfo){
      if (Object.keys(that.pointInfo).length) {
        that.ruleForm = that.pointInfo;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.form-wrap {
  .el-input,/deep/ .el-input-number {
    width: 178px;
    padding: 0 10px;
    .el-input__inner{
      text-align:left;
    }
  }
  /deep/ .el-form {
    .el-form-item:last-child {
      /*margin-bottom: 0;*/
    }
  }

  .padding-0 {
    padding: 0;
  }

  .form-child {
    width: 100%;
    padding: 15px 20px 1px 0px;
    background: #f5f6f9;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .margin-20 {
    margin-top: 20px;
  }

  .tinymce-wrap {
    width: 890px;

    /deep/ .mce-tinymce {
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      border: 1px solid #dcdfe6;
    }

    /deep/ .mce-panel {
      border: 0px solid #dcdfe6;
    }
  }
}
</style>
