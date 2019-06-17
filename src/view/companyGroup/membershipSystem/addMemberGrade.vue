<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="等级名称" prop="gradeName">
               <el-input v-model="ruleForm.gradeName" class="w-340" @focus="focus('gradeName',12)"  @keyup.native="(value) => toInput(value)">
                 <!-- <template slot="append"><label class="input-label">{{inputNumObj.gradeName}}/12</label></template> -->
               </el-input>
               <label class="input-label">{{inputNumObj.gradeName}}/12</label>
            </el-form-item>
            <el-form-item label="等级编码" prop="gradeCode">
               <el-input v-model="ruleForm.gradeCode" class="w-340" @focus="focus('gradeCode',6)"  @keyup.native="(value) => toInput(value)" >
                 <!-- <template slot="append"><label class="input-label">{{inputNumObj.gradeCode}}/6</label></template> -->
               </el-input>
               <label class="input-label">{{inputNumObj.gradeCode}}/6</label>
            </el-form-item>
            <el-form-item label="等级类型" prop="">
              <el-radio  v-model="ruleForm.gradeType" label="1">常规卡</el-radio>
              <el-radio v-model="ruleForm.gradeType"  label="2">特殊卡</el-radio>
            </el-form-item>
            <!-- 自动升级 -->
            <el-form-item label="自动升级" prop="">
              <el-switch
                v-model="ruleForm.autoUpgrade"
                active-text="启用"
                inactive-text="停用">
              </el-switch>
            </el-form-item>
            <el-form-item label="自动升级" prop="" v-if="ruleForm.autoUpgrade">
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelHighcostSelect">当天消费满</el-checkbox>
                <el-input v-model="ruleForm.upLevelHighcost" ></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelDaystoredSelect">当天储值满</el-checkbox>
                <el-input v-model="ruleForm.upLevelDaystored" ></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumcostSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumcostDays"></el-input>
                <label>天内消费满</label>
                <el-input v-model="ruleForm.upLevelSumcost" ></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelCostimesSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelCosttimesDays"></el-input>
                <label>天内消费满</label>
                <el-input v-model="ruleForm.upLevelCosttimes" ></el-input>
                <label> 次 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumstoredSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumstoredDays"></el-input>
                <label>天内储值满</label>
                <el-input v-model="ruleForm.upLevelSumstored" ></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumintegralSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumintegralDays"></el-input>
                <label>天内获得 </label>
                <el-input v-model="ruleForm.upLevelSumintegral" ></el-input>
                <label> 积分 </label>
              </div>

            </el-form-item>
            <!-- 自动降级 -->
            <el-form-item label="自动降级" prop="">
              <el-switch
                v-model="ruleForm.autoDowngrade"
                active-text="启用"
                inactive-text="停用">
              </el-switch>
            </el-form-item>
            <div v-if="ruleForm.autoDowngrade">
              <el-form-item label="会员等级有效期" prop="" >
                <label> 自升级之日起算 </label>
                <el-input v-model="ruleForm.gradeEffectDay"></el-input>
                <label> 天 </label>
              </el-form-item>
              <el-form-item label="保级条件" prop="">
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelHighcostSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelHighcostDays"></el-input>
                  <label>天内单天消费满</label>
                  <el-input v-model="ruleForm.lowLevelHighcost" ></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelDaystoredSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelDaystoredDays"></el-input>
                  <label>天内单天储值满</label>
                  <el-input v-model="ruleForm.lowLevelDaystored" ></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumcostSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumcostDays"></el-input>
                  <label>天内消费满</label>
                  <el-input v-model="ruleForm.lowLevelSumcost" ></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelCosttimesSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelCosttimesDays"></el-input>
                  <label>天内消费满</label>
                  <el-input v-model="ruleForm.lowLevelCosttimes" ></el-input>
                  <label> 次 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumstoredSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumstoredDays"></el-input>
                  <label>天内储值满</label>
                  <el-input v-model="ruleForm.lowLevelSumstored" ></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumintegralSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumintegralDays"></el-input>
                  <label>天内获得</label>
                  <el-input v-model="ruleForm.lowLevelSumintegral" ></el-input>
                  <label> 积分 </label>
                </div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
              <el-button @click="goBack">返 回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topNav from 'components/nav/nav'

import strLength from '@/common/js/strlen';
import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import { getRequest, postRequest, postForm } from '@/api/api';

export default {
  name: "addMemberGrade",
  data() {
    return {
      navpath: [{
          name: '首页',
          path: '/'
        },
        {
          name: '添加商户会员等级',
          path: ''
        }
      ],

      enterpId: '',

      // 输入控制
      inputNumObj: {
        gradeName: 0,
        gradeCode: 0
      },
      // 记录输入的
      inputFlag: '',
      inputFlagNum: '',

      // form
      ruleForm: {
        "gradeId": "",    //等级id
        "gradeIntegralId": "",  //等级积分id
        "gradeName": "",   //等级名称
        "gradeCode": "", //等级代码
        "cardColor": "",  //卡片颜色
        "cardFontColor": "",  //卡字体颜色
        "gradeType": '1',  //常规还是特殊卡 1常规 2特殊
        "discountRate": '2.0',   // 折扣率
        "calculationMethod": '2',    // 计算方式 1就低原则 2折上折
        "discountControl": '2',     // 折扣控制 1所有折扣商品适用 2折扣范围
        "discountControlUpper": '0',
        "discountControlLower": '0',
        "autoUpgrade": true,   //自动升级 1启用 2停用
        "upLevelHighcostSelect":false,  // 当天消费满
        "upLevelHighcost": '',
        "upLevelDaystoredSelect": false, //  当天储值满
        "upLevelDaystored": '',
        "upLevelSumcostSelect": false,  //x天内消费满x元
        "upLevelSumcostDays": '',
        "upLevelSumcost": '',
        "upLevelCostimesSelect": false, // x天内消费满x次
        "upLevelCosttimes": '',
        "upLevelCosttimesDays": '',
        "upLevelSumstoredSelect": false, //x天内储值满x元
        "upLevelSumstored": '',
        "upLevelSumstoredDays": '',
        "upLevelSumintegralSelect": false,  //x天内获得x积分
        "upLevelSumintegral": '',
        "upLevelSumintegralDays": '',
        "autoDowngrade": true,    //自动降级 1启用 2停用
        "gradeEffectDay": '',   //自升级之日起算X天
        "lowLevelHighcostDays": '',  //x天内单天消费满x元
        "lowLevelHighcost": '',
        "lowLevelHighcostSelect": false,
        "lowLevelDaystoredSelect": false,  //x天内单天储值满x元
        "lowLevelDaystoredDays": '',
        "lowLevelDaystored": '',
        "lowLevelSumcostDays": '',  //x天内消费满x元
        "lowLevelSumcostSelect": false,
        "lowLevelSumcost": '',
        "lowLevelCosttimesSelect": false,  //x天内消费满x次
        "lowLevelCosttimesDays": '',
        "lowLevelCosttimes": '',
        "lowLevelSumstoredSelect": false,  //x天内储值满x元
        "lowLevelSumstored": '',
        "lowLevelSumstoredDays": '',
        "lowLevelSumintegralSelect": false, //x天内获得x积分
        "lowLevelSumintegral": '',
        "lowLevelSumintegralDays": '',
        "gradeDescribe": "",  //会员等级说明
        "upCliqueEnterpriseRelation": null
      },
      rules: {
        gradeName: [
          { required: true, message: '请输入等级名称', trigger: 'blur' },
        ],
        gradeCode: [
          { required: true, message: '请输入等级编码', trigger: 'blur' }
        ],
      },

    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {

    changeRoute(route) {
      this.$router.push(route);
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },

    // 检查条件
    checkUp(data) {
      var that = this
      var flag = true;
      if (!!data.autoUpgrade) {
        if (!!data.upLevelHighcostSelect&& !data.upLevelHighcost) {
          flag = false
        }

        if (!!data.upLevelDaystoredSelect&& !data.upLevelDaystored) {
          flag = false
        }

        if (!!data.upLevelSumcostSelect&& (!data.upLevelSumcostDays||!data.upLevelSumcost)) {
          flag = false
        }

        if (!!data.upLevelCostimesSelect&& (!data.upLevelCosttimesDays||!data.upLevelCosttimes)) {
          flag = false
        }

        if (!!data.upLevelSumstoredSelect&& (!data.upLevelSumstoredDays||!data.upLevelSumstored)) {
          flag = false
        }

        if (!!data.upLevelSumintegralSelect&& (!data.upLevelSumintegralDays||!data.upLevelSumintegral)) {
          flag = false
        }
      }
      return flag
    },
    checkDown(data) {
      var that = this
      var flag = true;
      if (!!data.autoDowngrade) {

        if (!data.gradeEffectDay) {
          flag = false
        }
        if (!!data.lowLevelHighcostSelect&& (!data.lowLevelHighcostDays||!data.lowLevelHighcost)) {
          flag = false
        }

        if (!!data.lowLevelDaystoredSelect&& (!data.lowLevelDaystoredDays||!data.lowLevelDaystored)) {
          flag = false
        }

        if (!!data.lowLevelSumcostSelect&& (!data.lowLevelSumcostDays||!data.lowLevelSumcost)) {
          flag = false
        }

        if (!!data.lowLevelCosttimesSelect&& (!data.lowLevelCosttimesDays||!data.lowLevelCosttimes)) {
          flag = false
        }

        if (!!data.lowLevelSumstoredSelect&& (!data.lowLevelSumstoredDays||!data.lowLevelSumstored)) {
          flag = false
        }

        if (!!data.lowLevelSumintegralSelect&& (!data.lowLevelSumintegralDays||!data.lowLevelSumintegral)) {
          flag = false
        }
      }
      return flag
    },

    // 保存
    submitForm(formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          if (!that.ruleForm.gradeName) {
            showMsg.showmsg('请填写等级名称','error')
            return;
          }
          if (!that.ruleForm.gradeCode) {
            showMsg.showmsg('请填写等级编码','error')
            return;
          }

          if (!that.checkUp(that.ruleForm)) {
            showMsg.showmsg('请填写升级条件','error')
            return;
          }
          if (!that.checkDown(that.ruleForm)) {
            showMsg.showmsg('请填写降级条件','error')
            return;
          }

          var data = JSON.parse(JSON.stringify(that.ruleForm))
          data.enterpriseId = that.enterpId;

          data.discountControlUpper = data.discountControlUpper || '0'
          data.discountControlLower = data.discountControlLower || '0'

          data.autoDowngrade = data.autoDowngrade == true? 1:2
          data.autoUpgrade = data.autoUpgrade == true? 1:2
          data.gradeType = String(data.gradeType)

          data.upLevelHighcostSelect = data.upLevelHighcostSelect==true? 1:0
          data.upLevelDaystoredSelect = data.upLevelDaystoredSelect==true? 1:0
          data.upLevelSumcostSelect = data.upLevelSumcostSelect==true? 1:0
          data.upLevelCostimesSelect = data.upLevelCostimesSelect==true? 1:0
          data.upLevelSumstoredSelect = data.upLevelSumstoredSelect==true? 1:0
          data.upLevelSumintegralSelect = data.upLevelSumintegralSelect==true? 1:0
          console.log(data.lowLevelHighcostSelect,data.lowLevelDaystoredSelect,data.lowLevelSumcostSelect,data.lowLevelCosttimesSelect,data.lowLevelSumstoredSelect,data.lowLevelSumintegralSelect)
          data.lowLevelHighcostSelect = data.lowLevelHighcostSelect==true? 1:0
          data.lowLevelDaystoredSelect = data.lowLevelDaystoredSelect==true? 1:0
          data.lowLevelSumcostSelect = data.lowLevelSumcostSelect==true? 1:0
          data.lowLevelCosttimesSelect = data.lowLevelCosttimesSelect==true? 1:0
          data.lowLevelSumstoredSelect = data.lowLevelSumstoredSelect==true? 1:0
          data.lowLevelSumintegralSelect = data.lowLevelSumintegralSelect==true? 1:0

          // 值增加默认 0
          data.upLevelHighcost = data.upLevelHighcost || 0;
          data.upLevelDaystored = data.upLevelDaystored || 0;
          data.upLevelSumcostDays = data.upLevelSumcostDays || 0;
          data.upLevelSumcost = data.upLevelSumcost || 0;
          data.upLevelCosttimesDays = data.upLevelCosttimesDays || 0;
          data.upLevelCosttimes = data.upLevelCosttimes || 0;
          data.upLevelSumstoredDays = data.upLevelSumstoredDays || 0;
          data.upLevelSumstored = data.upLevelSumstored || 0;
          data.upLevelSumintegralDays = data.upLevelSumintegralDays || 0;
          data.upLevelSumintegral = data.upLevelSumintegral || 0;

          data.gradeEffectDay = data.gradeEffectDay || 0;
          data.lowLevelHighcostDays = data.lowLevelHighcostDays || 0;
          data.lowLevelHighcost = data.lowLevelHighcost || 0;
          data.lowLevelDaystoredDays = data.lowLevelDaystoredDays || 0;
          data.lowLevelDaystored = data.lowLevelDaystored || 0;
          data.lowLevelSumcostDays = data.lowLevelSumcostDays || 0;
          data.lowLevelSumcost = data.lowLevelSumcost || 0;
          data.lowLevelCosttimesDays = data.lowLevelCosttimesDays || 0;
          data.lowLevelCosttimes = data.lowLevelCosttimes || 0;
          data.lowLevelSumstoredDays = data.lowLevelSumstoredDays || 0;
          data.lowLevelSumstored = data.lowLevelSumstored || 0;
          data.lowLevelSumintegralDays = data.lowLevelSumintegralDays || 0;
          data.lowLevelSumintegral = data.lowLevelSumintegral || 0;

          that.saveInfo(data)
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

      postRequest('/api-admin/do-save-member-grade',para)
      .then((res) => {
        console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {

          showMsg.showmsg('保存成功','success')
          that.goBack()
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

    focus(name,num) {
      var that = this
      console.log(name,num)
      that.inputFlag = name;
      that.inputFlagNum = num;
    },

    // 输入
    toInput: function(value) {
      var that = this;
      console.log(value)

      var temp = '';
      var temp = strLength.getByteVal(value.target.value,that.inputFlagNum)
      console.log(temp)
      that.ruleForm[that.inputFlag] = temp.trim()

      that.inputNumObj[that.inputFlag] = strLength.getZhLen(that.ruleForm[that.inputFlag]);

      console.log(that.ruleForm[that.inputFlag])
    },
  },
  components: {
    topNav
  },
  mounted() {
    var that = this
    that.enterpId = sessionStorage.getItem('enterpriseId')
  }
}

</script>
<style lang="less" scoped>
.attention-wrap {
  .item-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 80px;
    }
  }
  .el-input {
    width: 180px;
    &.w-300 {
      width: 300px;
    }
    &.w-340 {
      width: 340px;
    }
  }

  /deep/ .input-label {
    position: absolute;
    left: 303px;
    color: #ccc;
    font-size: 12px;
  }

  .check-cell {
    .el-input {
      margin: 0 10px;
    }
    &+.check-cell {
      margin-top: 15px;
    }
  }
}

</style>
