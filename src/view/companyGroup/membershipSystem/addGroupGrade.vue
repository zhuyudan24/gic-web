<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item class="padding-l-45" label="等级名称" prop="gradeName">
              <div style="width: 340px;position: relative;">
                <el-input v-model="ruleForm.gradeName" class="w-340" @focus="focus('gradeName',12)"  @keyup.native="(value) => toInput(value)">
               </el-input>
               <label class="input-label">{{inputNumObj.gradeName}}/12</label>
              </div>
            </el-form-item>
            <el-form-item class="padding-l-45" label="等级编码" prop="gradeCode">
              <div style="width: 340px;position: relative;">
                  <el-input v-model="ruleForm.gradeCode" class="w-340" @focus="focus('gradeCode',6)"  @keyup.native="(value) => toInput(value)">
                   <!-- <template slot="append"><label class="input-label">{{inputNumObj.gradeCode}}/6</label></template> -->
                 </el-input>
                 <label class="input-label">{{inputNumObj.gradeCode}}/6</label>
              </div>
            </el-form-item>
            <el-form-item class="color-wrap" label="卡面颜色" prop="cardColor" >
              <el-color-picker v-model="ruleForm.cardColor"></el-color-picker>
            </el-form-item>
            <el-form-item class="color-wrap" label="文字颜色" prop="cardFontColor">
              <el-color-picker v-model="ruleForm.cardFontColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="等级类型" prop="gradeType">
              <el-radio v-model="ruleForm.gradeType" label="1">常规卡</el-radio>
              <el-radio v-model="ruleForm.gradeType"  label="2">特殊卡</el-radio>
            </el-form-item>
            <el-form-item label="折扣" prop="discountRate">
              <el-input @focus="inputFocus('discountRate')" @change="formatInputChange($event)" v-model="ruleForm.discountRate"></el-input>
              折 <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00</span>
            </el-form-item>
            <el-form-item label="计算方式" prop="calculationMethod">
              <el-radio  v-model="ruleForm.calculationMethod" label="1">就低原则</el-radio>
              <el-radio v-model="ruleForm.calculationMethod"  label="2">折上折</el-radio>
            </el-form-item>
            <!-- 折扣控制 -->
            <el-form-item label="折扣控制" prop="">
              <div style="margin-bottom: 22px;">
                <el-radio v-model="ruleForm.discountControl" label="1">所有折扣商品都适用</el-radio>
              </div>
              <div class="discount-control-wrap">
                <el-radio v-model="ruleForm.discountControl" label="2">折扣</el-radio>
                <!-- <el-input @focus="inputFocus('discountControlLower')"  @change="formatInputChange($event)" v-model="ruleForm.discountControlLower"></el-input> -->
                <el-input-number v-model="ruleForm.discountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                <label>至</label>
                <!-- <el-input @focus="inputFocus('discountControlUpper')"  @change="formatInputChange($event)" v-model="ruleForm.discountControlUpper"></el-input> -->
                <el-input-number v-model="ruleForm.discountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                <label>折商品都适用</label>
                <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
              </div>
            </el-form-item>
            <!-- 特殊折扣控制 -->
            <el-form-item label="特殊折扣控制" prop=""  class="discount-ctrl-wrap">
              <el-table
                class="discount-table"
                :data="countTableData"
                style="width: 100%">
                <el-table-column
                  prop="strategyName"
                  label="策略名称"
                  >
                </el-table-column>
                <el-table-column
                  prop="applyGoods"
                  label="适用商品">
                  <template slot-scope="scope">
                    <template v-if="scope.row.strategyRelationType ==1">所有商品</template>
                    <template v-if="scope.row.strategyRelationType ==2">商品品牌</template>
                    <template v-if="scope.row.strategyRelationType ==3">商品类目</template>
                    <template v-if="scope.row.strategyRelationType ==4">部分商品</template>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="折扣">
                  <template slot-scope="scope">
                    {{ scope.row.discountRate }} 折
                  </template>
                </el-table-column>
                <el-table-column
                  prop="calWay"
                  label="计算方式">
                  <template slot-scope="scope">
                    {{scope.row.calculationMethod == 1? '就低原则': '折上折'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="折扣控制">
                  <template slot-scope="scope">
                  {{scope.row.discountControl==1?'所有折扣商品适用':'折扣范围'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="操作">
                  <template slot-scope="scope">
                    <!-- <el-button
                      @click="editGroupCate(scope.$index,scope.row,ruleForm.countTableData)"
                      type="text"
                      size="small">
                      编辑
                    </el-button> -->
                     <router-link :to="{path:'/editGroupCate',query:{strategyId: scope.row.gradeStrategyId}}" class="edit-btn el-button--text">编辑</router-link>
                    <delete-tip @confirm="delGroupCate(scope.$index,scope.row,countTableData)" tips="确认删除吗?">
                      <el-button type="text">删除</el-button>
                    </delete-tip>
                    <!-- <el-button
                      @click="delGroupCate(scope.$index,scope.row,countTableData)"
                      type="text"
                      size="small">
                      删除
                    </el-button> -->
                  </template>
                </el-table-column>
                <template slot="empty">
                  <div class="no-data-wrap">
                    <div class="no-data-icon" >
                      <img src="../../../../static/img/no-data_icon.png" alt="">
                    </div>
                    <p>暂无数据</p>
                  </div>
                </template>
              </el-table>
              <div><el-button type="text" icon="el-icon-circle-plus-outline" @click="changeRoute('/addGroupCate')">新增策略</el-button></div>
            </el-form-item>
            <!-- 关联商户等级 -->
            <el-form-item label="关联商户等级" prop="" style="display: none;">
              <el-table
                :data="linkLevelTableData"
                style="width: 100%">
                <el-table-column
                  prop="enterpriseName"
                  label="商户名称"
                  >
                </el-table-column>
                <el-table-column
                  prop=""
                  label="会员等级">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.selectedGradeId" placeholder="请选择" @change="changeCardLevel($event,scope.row)">
                      <el-option
                        v-for="item in scope.row.gradeList"
                        :label="item.gradeName"
                        :key="item.gradeId"
                        :value="item.gradeId">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="selectedGradeCode"
                  label="等级编码">

                </el-table-column>
                <el-table-column
                  prop=""
                  label="自动升级">
                  <template slot-scope="scope">
                    <template v-if="scope.row.selectedAutoUpgrade">
                      {{scope.row.selectedAutoUpgrade==1? '是':'否'}}
                    </template>
                    <template v-else>
                      {{'--'}}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="自动降级">
                  <template slot-scope="scope">
                    <template v-if="scope.row.selectedAutoDowngrade">
                      {{scope.row.selectedAutoDowngrade==1? '是':'否'}}
                    </template>
                    <template v-else>
                      {{'--'}}
                    </template>
                  </template>
                </el-table-column>

              </el-table>
            </el-form-item>
            <!-- 自动升级 -->
            <el-form-item label="自动升级" prop="">
              <el-switch
                v-model="ruleForm.autoUpgrade">
              </el-switch>
            </el-form-item>
            <el-form-item label="升级条件" prop="" v-if="ruleForm.autoUpgrade">
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelHighcostSelect">当天消费满</el-checkbox>
                <el-input v-model="ruleForm.upLevelHighcost" @focus="inputFocus('upLevelHighcost','money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelDaystoredSelect">当天储值满</el-checkbox>
                <el-input v-model="ruleForm.upLevelDaystored" @focus="inputFocus('upLevelDaystored','money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumcostSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumcostDays" @focus="inputFocus('upLevelSumcostDays','day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内消费满</label>
                <el-input v-model="ruleForm.upLevelSumcost" @focus="inputFocus('upLevelSumcost','money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelCostimesSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelCosttimesDays" @focus="inputFocus('upLevelCosttimesDays','day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内消费满</label>
                <el-input v-model="ruleForm.upLevelCosttimes" @focus="inputFocus('upLevelCosttimes','day')" @keyup.native="formatInput($event)"></el-input>
                <label> 次 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumstoredSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumstoredDays" @focus="inputFocus('upLevelSumstoredDays','day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内储值满</label>
                <el-input v-model="ruleForm.upLevelSumstored" @focus="inputFocus('upLevelSumstored','money')" @keyup.native="formatInput($event)"></el-input>
                <label> 元 </label>
              </div>
              <div class="check-cell">
                <el-checkbox v-model="ruleForm.upLevelSumintegralSelect"></el-checkbox>
                <el-input v-model="ruleForm.upLevelSumintegralDays" @focus="inputFocus('upLevelSumintegralDays','day')" @keyup.native="formatInput($event)"></el-input>
                <label>天内获得 </label>
                <el-input v-model="ruleForm.upLevelSumintegral" @focus="inputFocus('upLevelSumintegral','point')" @keyup.native="formatInput($event)"></el-input>
                <label> 积分 </label>
              </div>

            </el-form-item>
            <!-- 自动降级 -->
            <el-form-item label="自动降级" prop="">
              <el-switch
                v-model="ruleForm.autoDowngrade">
              </el-switch>
            </el-form-item>
            <div v-if="ruleForm.autoDowngrade">
              <el-form-item label="会员等级有效期" prop="" >
                <label> 自升级之日起算 </label>
                <el-input v-model="ruleForm.gradeEffectDay" @focus="inputFocus('gradeEffectDay','day')" @keyup.native="formatInput($event)"></el-input>
                <label> 天 </label>
              </el-form-item>
              <el-form-item label="保级条件" prop="">
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelHighcostSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelHighcostDays" @focus="inputFocus('lowLevelHighcostDays','day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内单天消费满</label>
                  <el-input v-model="ruleForm.lowLevelHighcost" @focus="inputFocus('lowLevelHighcost','money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelDaystoredSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelDaystoredDays" @focus="inputFocus('lowLevelDaystoredDays','day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内单天储值满</label>
                  <el-input v-model="ruleForm.lowLevelDaystored" @focus="inputFocus('lowLevelDaystored','money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumcostSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumcostDays" @focus="inputFocus('lowLevelSumcostDays','day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内消费满</label>
                  <el-input v-model="ruleForm.lowLevelSumcost" @focus="inputFocus('lowLevelSumcost','money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelCosttimesSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelCosttimesDays" @focus="inputFocus('lowLevelCosttimesDays','day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内消费满</label>
                  <el-input v-model="ruleForm.lowLevelCosttimes" @focus="inputFocus('lowLevelCosttimes','day')" @keyup.native="formatInput($event)"></el-input>
                  <label> 次 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumstoredSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumstoredDays" @focus="inputFocus('lowLevelSumstoredDays','day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内储值满</label>
                  <el-input v-model="ruleForm.lowLevelSumstored" @focus="inputFocus('lowLevelSumstored','money')" @keyup.native="formatInput($event)"></el-input>
                  <label> 元 </label>
                </div>
                <div class="check-cell">
                  <el-checkbox v-model="ruleForm.lowLevelSumintegralSelect"></el-checkbox>
                  <el-input v-model="ruleForm.lowLevelSumintegralDays" @focus="inputFocus('lowLevelSumintegralDays','day')" @keyup.native="formatInput($event)"></el-input>
                  <label>天内获得</label>
                  <el-input v-model="ruleForm.lowLevelSumintegral" @focus="inputFocus('lowLevelSumintegral','point')" @keyup.native="formatInput($event)"></el-input>
                  <label> 积分 </label>
                </div>
              </el-form-item>
            </div>
            <el-form-item label="会员等级说明">
              <div class="tinymce-wrap">
                <tinymce-edit ref="tinymceWrap" :bodyHtml="ruleForm.gradeDescribe" :projectName="projectName"></tinymce-edit>
                <!-- <editor ref="tinymceWrap" :bodyHtml="ruleForm.gradeDescribe" :projectName="projectName"></editor> -->
              </div>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                <el-button @click="goBack">返 回</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav'
import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import strLength from '@/common/js/strlen';
import tinymceEdit from 'components/memberShip/tinymce-edit'
import editor from 'components/memberShip/editor'

import { getRequest, postRequest, postForm } from '@/api/api';

export default {
  name: "addMemberGrade",
  data() {
    return {
      projectName:'gic-web',
      navpath: [
        {
          name: '会员管理',
          path: ''
        },
        {
          name: '会员体系',
          path: ''
        },
        {
          name: '会员卡设置',
          path: '/memberCardSet'
        },
        {
          name: '添加会员等级',
          path: ''
        }
      ],
      rules: {
        gradeName: [
          { required: true, message: '请填写等级名称', trigger: 'blur' },
        ],
        gradeCode: [
          { required: true, message: '请填写等级编码', trigger: 'blur' },
        ],
        cardColor: [
          { required: true, message: '请填写卡面颜色',  trigger: 'change' }
        ],
        cardFontColor: [
          { required: true, message: '请填写文字颜色',  trigger: 'change' }
        ],
        gradeType: [
          { required: true, message: '请选择等级类型',  trigger: 'change' }
        ],
        discountRate: [
          { required: true, message: '请填写折扣',  trigger: 'change' }
        ],
        calculationMethod: [
          { required: true, message: '请填写计算方式',  trigger: 'change' }
        ],
      },
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
        "cardColor": "#000000",  //卡片颜色
        "cardFontColor": "#ffffff",  //卡字体颜色
        "gradeType": '1',  //常规还是特殊卡 1常规 2特殊
        "discountRate": '1',   // 折扣率
        "calculationMethod": '2',    // 计算方式 1就低原则 2折上折
        "discountControl": '1',     // 折扣控制 1所有折扣商品适用 2折扣范围
        "discountControlUpper": '0',
        "discountControlLower": '0',
        "autoUpgrade": true,   //自动升级 1启用 2停用
        "upLevelHighcostSelect":false,  // 当天消费满
        "upLevelHighcost": '0',
        "upLevelDaystoredSelect": false, //  当天储值满
        "upLevelDaystored": '0',
        "upLevelSumcostSelect": false,  //x天内消费满x元
        "upLevelSumcostDays": '0',
        "upLevelSumcost": '0',
        "upLevelCostimesSelect": false, // x天内消费满x次
        "upLevelCosttimes": '0',
        "upLevelCosttimesDays": '0',
        "upLevelSumstoredSelect": false, //x天内储值满x元
        "upLevelSumstored": '0',
        "upLevelSumstoredDays": '0',
        "upLevelSumintegralSelect": false,  //x天内获得x积分
        "upLevelSumintegral": '0',
        "upLevelSumintegralDays": '',
        "autoDowngrade": true,    //自动降级 1启用 2停用
        "gradeEffectDay": '0',   //自升级之日起算X天
        "lowLevelHighcostDays": '0',  //x天内单天消费满x元
        "lowLevelHighcost": '0',
        "lowLevelHighcostSelect": false,
        "lowLevelDaystoredSelect": false,  //x天内单天储值满x元
        "lowLevelDaystoredDays": '0',
        "lowLevelDaystored": '0',
        "lowLevelSumcostDays": '0',  //x天内消费满x元
        "lowLevelSumcostSelect": false,
        "lowLevelSumcost": '0',
        "lowLevelCosttimesSelect": false,  //x天内消费满x次
        "lowLevelCosttimesDays": '0',
        "lowLevelCosttimes": '0',
        "lowLevelSumstoredSelect": false,  //x天内储值满x元
        "lowLevelSumstored": '0',
        "lowLevelSumstoredDays": '0',
        "lowLevelSumintegralSelect": false, //x天内获得x积分
        "lowLevelSumintegral": '0',
        "lowLevelSumintegralDays": '0',
        "gradeDescribe": "",  //会员等级说明
        "upCliqueEnterpriseRelation": null,
      },

      /*rules: {
        gradeName: [
          { required: true, message: '请输入等级名称', trigger: 'blur' },
        ],
        gradeCode: [
          { required: true, message: '请输入等级编码', trigger: 'blur' }
        ],
        discountRate: [
          { required: true, message: '请输入折扣率', trigger: 'blur' }
        ],
      },*/
      // 特殊折扣控制
        countTableData: [
          // {
          //  "gradeStrategyId": "",
          //   "gradeId": "-1",
          //   "strategyName": "121",  //策略名称
          //   "strategyRelationType": 1,  //策略关联类型 1所有商品 2商品品牌 3商品类目 4部分商品
          //   "discountRate": 1.0,  //折扣率
          //   "calculationMethod": 2,  //  计算方式 1就低原则 2折上折
          //   "discountControl": 1,  // 折扣控制 1所有折扣商品适用 2折扣范围
          //   "discountControlUpper": 0.0,
          //   "discountControlLower": 0.0,
          //   "gradeStrategyGoodsRelationIds": null,
          //   "cliqueEnterpriseIds": null,
          //   "relationCount": 0,  //关联数量(商品、分类、品牌)
          //   "enterpriseMS": null
          // }
        ],

        // 关联商户等级
        linkLevelTableData: [
          // {
          //   merchantName: '达摩',
          //   level: '0',
          //   gradeCode: '',
          //   autoUpdate: '',
          //   autoDeupdate: '',
          // }
        ],

      // 会员卡等级
      levelOptions:[
        {
          value: '0',
          label: '普卡'
        },
        {
          value: '1',
          label: '青铜卡卡'
        },
      ]

    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },
    // 返回
    goBack() {
      this.$router.push('/memberCardSet')
      // this.$router.go(-1)
    },

    inputFocus(tag,flag){
      var that = this
      console.log(tag);
      that.tempTag = tag;
      if (!!flag) {
        that.tempFlag = flag;
      }else {
        that.tempFlag = '';
      }
    },
    // 折扣重新写的判断
    formatInputChange(e) {
      var that = this
      console.log(e)

      if (that.tempTag == 'discountControlLower' || that.tempTag =='discountControlUpper') {
        that.ruleForm[that.tempTag] = Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2);
        if (Number(that.ruleForm[that.tempTag])>10) {
          that.ruleForm[that.tempTag] = Number(10).toFixed(2)
        }
        // 比较大小
        if (that.ruleForm.discountControlLower > 10) {
          that.ruleForm.discountControlLower = Number(10).toFixed(2)
        }
        if (that.ruleForm.discountControlUpper > 10) {
          that.ruleForm.discountControlUpper = Number(10).toFixed(2)
        }
        that.ruleForm.discountControlLower = Number(String(that.ruleForm.discountControlLower).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.discountControlLower).replace(/[^\.\d]/g,'')).toFixed(2);
        that.ruleForm.discountControlUpper = Number(String(that.ruleForm.discountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.discountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2);
        that.$forceUpdate()
      }

      if (that.tempTag == 'discountRate') {
        that.ruleForm[that.tempTag] = Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2)
        if (Number(that.ruleForm[that.tempTag])>10) {
          that.ruleForm[that.tempTag] = Number(10).toFixed(2)
        }

        return;
      }
    },

    // 输入框输入校验数字
    formatInput(e){
      var that = this
      console.log(e,e.target.value)
      that.ruleForm[that.tempTag] = String(e.target.value).replace(/[^\.\d]/g,'')
      if (that.tempTag == 'discountControlLower' || that.tempTag =='discountControlUpper') {
        that.ruleForm[that.tempTag] = Number(String(e.target.value).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(e.target.value).replace(/[^\.\d]/g,'')).toFixed(2);
        if (Number(that.ruleForm[that.tempTag])>10) {
          that.ruleForm[that.tempTag] = Number(10).toFixed(2)
        }
        return;
      }

      if (that.tempTag == 'discountRate') {
        that.ruleForm[that.tempTag] = Number(String(e.target.value).replace(/[^\.\d]/g,'')).toFixed(2)
        if (Number(that.ruleForm[that.tempTag])>10) {
          that.ruleForm[that.tempTag] = Number(10).toFixed(2)
        }

        return;
      }


      if (!!that.tempFlag && that.tempFlag == 'day') {
        that.ruleForm[that.tempTag] = strLength.getCharVal(String(e.target.value).replace(/[^\.\d]/g,''),4)
      }
      if (!!that.tempFlag && that.tempFlag == 'money') {
        that.ruleForm[that.tempTag] = strLength.getCharVal(String(e.target.value).replace(/[^\.\d]/g,''),6)
      }
      if (!!that.tempFlag && that.tempFlag == 'point') {
        that.ruleForm[that.tempTag] = strLength.getCharVal(String(e.target.value).replace(/[^\.\d]/g,''),8)
      }
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!that.ruleForm.gradeName) {
            showMsg.showmsg('请填写等级名称','error')
            return;
          }
          if (!that.ruleForm.gradeCode) {
            showMsg.showmsg('请填写等级编码','error')
            return;
          }
          if (that.ruleForm.discountRate=="") {
            showMsg.showmsg('请填写折扣','error')
            return;
          }else if (that.ruleForm.discountRate < 0.01){
            showMsg.showmsg('折扣不能为0哦','error')
            return;
          }

          if(that.ruleForm.discountControl==2){
            var flagA = Number(that.ruleForm.discountControlUpper) <= Number(that.ruleForm.discountControlLower);
            if( !that.ruleForm.discountControlUpper || !that.ruleForm.discountControlLower ){
              that.$message.error('折扣控制中的折扣不能为空')
              return;
            }
            if (flagA) {
              that.$message.error("折扣控制中的折扣格式有误")
              return;
            }
          }

          if (parseInt(that.ruleForm.discountControlLower) >10 ) {
            that.ruleForm.discountControlLower = 10.00
          }
          if (parseInt(that.ruleForm.discountControlUpper) > 10 ) {
            that.ruleForm.discountControlUpper = 10.00
          }

          if (!that.checkUp(that.ruleForm)) {
            showMsg.showmsg('请填写升级条件','error')
            return;
          }
          if (!that.checkDown(that.ruleForm)) {
            showMsg.showmsg('请填写降级条件','error')
            return;
          }

          that.ruleForm.gradeDescribe = that.$refs.tinymceWrap.tinymceHtml; // 会员等级说明
          if (!that.ruleForm.gradeDescribe) {
            showMsg.showmsg('请填写会员等级说明','error')
            return;
          }

          var data = JSON.parse(JSON.stringify(that.ruleForm))
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

          data.discountControlUpper = data.discountControlUpper || '0';
          data.discountControlLower = data.discountControlLower || '0';

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

          // 关联商户等级
          var relation= '';
          that.linkLevelTableData.forEach(function(ele,index){
            if (!!ele.selectedGradeId) {
              relation += ele.enterpriseId+':'+ele.selectedGradeId+(that.linkLevelTableData.length>1?',':'')
            }
          })
          data.upCliqueEnterpriseRelation = relation
          console.log(data.upCliqueEnterpriseRelation)

          // 策略ids
          data.gradeStrategyIds = '';
          var cateArr = []
          var gradeIdArr = []
          if (!!that.countTableData.length) {
            that.countTableData.forEach(function(ele,index){
              cateArr.push(ele.gradeStrategyId)
              gradeIdArr.push(ele.gradeStrategyId)
            })
          }
          if (!!gradeIdArr.length) {
            data.gradeStrategyIds = gradeIdArr.join(',')
          }

          console.log(data.gradeStrategyIds)

          that.saveInfo(data)
        } else {
          showMsg.showmsg('表单信息未填写完整','error');
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
          // 返回
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

    // 输入控制
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

    // 编辑策略
    editGroupCate(index,row,obj) {
      var that = this;
      console.log(index,row,obj)
      // this.$router.push({ name: 'editGroupCate', params: { strategyId: row.gradeStrategyId }})
      // that.changeRoute('/editGroupCate');
    },

    // 删除
    delGroupCate(index, row,obj) {
      var that = this
      // console.log(index,row,obj)
      var para = {
        strategyId: row.gradeStrategyId
      }
      getRequest('/api-admin/delete-member-grade-strategy',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {

          showMsg.showmsg('删除成功','success')
          obj.splice(index,1)
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

    // 选择卡
    changeCardLevel(e,row) {
      var that = this
      console.log(e,row)
      row.gradeList.forEach(function(ele,index){
        if (ele.gradeId == e) {
          row.selectedGradeCode = ele.gradeCode
          row.selectedAutoDowngrade = ele.autoDowngrade
          row.selectedAutoUpgrade = ele.autoUpgrade
        }
      })
      console.log(row)

    },

    // 获取关联商户等级信息
    getMemberGradeInfo() {
      var that = this
      var para = {
        gradeId: '',
      }
      postRequest('/api-admin/get-member-grade-info',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          // 策略
          // that.countTableData = resData.result.strategyList

          // 关联商户等级
          var levelArr = resData.result.enterpriseGradeList
          if(levelArr){
            levelArr.forEach(function(ele,index){
              ele.gradeList.unshift({
                gradeId: '',
                gradeName: '请选择',
                gradeCode: '',
                autoDowngrade: '',
                autoUpgrade: '',
              })
            })
            that.linkLevelTableData = levelArr
          }
          
          // that.linkLevelTableData = resData.result.enterpriseGradeList
          // dto
          // var data = resData.result.dto
          // data.autoDowngrade = data.autoDowngrade == 1? true:false
          // data.autoUpgrade = data.autoUpgrade == 1? true:false
          // data.gradeType = String(data.gradeType)
          // data.calculationMethod = String(data.calculationMethod)
          // data.discountControl = String(data.discountControl)
          // data.discountControlUpper = String(data.discountControlUpper)
          // data.discountControlLower = String(data.discountControlLower)

          // data.upLevelHighcostSelect = data.upLevelHighcostSelect==1? true:false
          // data.upLevelDaystoredSelect = data.upLevelDaystoredSelect==1? true:false
          // data.upLevelSumcostSelect = data.upLevelSumcostSelect==1? true:false
          // data.upLevelCostimesSelect = data.upLevelCostimesSelect==1? true:false
          // data.upLevelSumstoredSelect = data.upLevelSumstoredSelect==1? true:false
          // data.upLevelSumintegralSelect = data.upLevelSumintegralSelect==1? true:false
          // console.log(data.lowLevelHighcostSelect,data.lowLevelDaystoredSelect,data.lowLevelSumcostSelect,data.lowLevelCosttimesSelect,data.lowLevelSumstoredSelect,data.lowLevelSumintegralSelect)
          // data.lowLevelHighcostSelect = data.lowLevelHighcostSelect==1? true:false
          // data.lowLevelDaystoredSelect = data.lowLevelDaystoredSelect==1? true:false
          // data.lowLevelSumcostSelect = data.lowLevelSumcostSelect==1? true:false
          // data.lowLevelCosttimesSelect = data.lowLevelCosttimesSelect==1? true:false
          // data.lowLevelSumstoredSelect = data.lowLevelSumstoredSelect==1? true:false
          // data.lowLevelSumintegralSelect = data.lowLevelSumintegralSelect==1? true:false

          // that.ruleForm = data
          // that.inputNumObj.gradeName = strLength.getZhLen(that.ruleForm.gradeName)
          // that.inputNumObj.gradeCode = strLength.getZhLen(that.ruleForm.gradeCode)


          // showMsg.showmsg('设置成功','success')
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
    }

  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    var that = this
    console.log(to,from,next)
    // 存储已经填写的数据
    console.log(that.ruleForm)
    var d = to
    if (d.path == '/editGroupCate' || d.path == '/addGroupCate' ) {
      sessionStorage.setItem('localForm',JSON.stringify(that.ruleForm))
      sessionStorage.setItem('strategy',JSON.stringify(that.countTableData))
      sessionStorage.setItem('relation',JSON.stringify(that.linkLevelTableData))
    }

    next()
  },
  components: {
    topNav,
    tinymceEdit,
    editor
  },
  mounted() {
    var that = this;

    var data = JSON.parse(sessionStorage.getItem('localForm'))
    var strategy = JSON.parse(sessionStorage.getItem('strategy'))
    var relation = JSON.parse(sessionStorage.getItem('relation'))
    if (data|| strategy|| relation) {
      console.log(data,strategy,relation)
      that.ruleForm = data;
      that.countTableData = strategy; // 获取已经增加的策略
      that.linkLevelTableData = relation; // 获取已经填写的关联商户等级
      that.inputNumObj.gradeName = strLength.getZhLen(that.ruleForm.gradeName);
      that.inputNumObj.gradeCode = strLength.getZhLen(that.ruleForm.gradeCode);
      sessionStorage.removeItem('localForm');
      sessionStorage.removeItem('strategy');
      sessionStorage.removeItem('relation');
      return
    }

    // 获取关联商户等级
    that.getMemberGradeInfo()
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
    right: 10px;
    top: 0;
    color: #c0c4cc;
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
.right-box /deep/ .el-form-item .el-input__inner{
  padding-right: 12px;
}
.right-box /deep/ .padding-l-45 .el-input__inner{
  padding-right: 45px;
}
.discount-table /deep/ th.is-leaf{
  line-height: 1
}
.discount-ctrl-wrap /deep/ .el-form-item__label{
  line-height: 48px;
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
.color-wrap /deep/ .el-form-item__content{
  height: 40px;
}
/*折扣率*/
.discount-control-wrap /deep/ .el-input-number .el-input{
  padding: 0 10px;
  .el-input__inner{
    text-align: left;
  }
}
</style>
