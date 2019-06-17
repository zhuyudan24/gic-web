<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content" @click="selectGoodsCateHide">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="form-wrap">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="策略名称" prop="strategyName" class="padding-0 padding-r-45">
                 <el-input v-model="ruleForm.strategyName" class="w-340 padding-0" @keyup.native="(value) => toInput(value)">
                 </el-input>
                 <label class="input-label">{{cateNameLength}}/20</label>
              </el-form-item>

              <el-form-item label="适用对象" prop="" class="margin-20">
                <el-select @change="changePeople" v-model="ruleForm.useCrowd" placeholder="请选择">
                  <el-option
                    v-for="item in applyObjOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="人群定向" v-if="ruleForm.useCrowd==2" prop="" class="padding-0">
                <el-button @click="showPeople">已设置{{ selectCount }}项筛选</el-button>
              </el-form-item>

              <el-form-item label="适用条件" class="padding-0">
                <div class="title-tip">该设置只对微信商城中的积分抵现起作用。</div>
              </el-form-item>
              <!-- 只获取微信的 -->
              <template v-for="(item,index) in ruleForm.channelList">
                <template v-if="item.channelType==1">
                  <div class="form-child margin-20" >

                    <el-form-item label="选择商户" style="display: none;">
                      <el-select v-model="item.enterpriseRelationIdArr" placeholder="请选择" multiple >
                        <el-option
                          v-for="item in mechantOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="适用商品" class="padding-0">
                      <el-select class="fl" style="margin-right: 10px;" v-model="item.channelRelationProType" placeholder="请选择">
                        <el-option
                          v-for="item in applyGoods"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <!-- 二级 -->

                      <!-- 商品品牌 -->
                      <el-select size="small" class="fl" @change="selectGoodsStoreWx" v-if="item.channelRelationProType == 2" v-model="valueWx" multiple placeholder="请选择">
                        <el-option
                          v-for="item in goodsTreeOptionsWx"
                          :key="item.brandId"
                          :label="item.brandName"
                          :value="item.brandId">
                        </el-option>
                      </el-select>

                      <!-- 商品品类 -->
                      <div v-if="item.channelRelationProType==3" class="fl goods-cate">
                        <goodsCate ref="selectGoodsCate" :selectCateType="selectCateTypeWx" :selectCateData="selectCateDataWx" @getCateIds="getCateIds"></goodsCate>
                      </div>

                      <el-button style="width:202px" class="fl" v-if="item.channelRelationProType==4" @click="showGoodsDialog('wx')">已选{{goodsListWx.length}}件商品</el-button>

                    </el-form-item>

                    <el-form-item label="折扣控制" prop="region">
                      <div class="radio-cell">
                        <el-radio  v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20" >
                        <el-radio v-model="item.integralUseDiscountControl"  label="2">折扣</el-radio>
                        <!-- <el-input @focus="inputFocus(item,'integralUseDiscountControlLower')"  @change="formatInputChange($event)" v-model="item.integralUseDiscountControlLower"></el-input> -->
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>至</label>
                        <!-- <el-input @focus="inputFocus(item,'integralUseDiscountControlUpper')"  @change="formatInputChange($event)" v-model="item.integralUseDiscountControlUpper"></el-input> -->
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
              </template>

              <el-form-item label="抵现规则" prop="" class="margin-20">
                <div>
                  <el-radio v-model="ruleForm.integralUseStatus" label="1">每使用</el-radio>
                  <!-- <el-input @keyup.native="formatInputNum($event)" v-model="ruleForm.integralUse.integral"></el-input> -->
                  <el-input-number v-model="ruleForm.integralUse.integral" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
                  <label>积分,抵 </label>
                  <!-- <el-input @blur="formatInputNumBlur($event)" v-model="ruleForm.integralUse.fee"></el-input> -->
                  <el-input-number v-model="ruleForm.integralUse.fee" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
                  <label>元</label>
                </div>
                <div>
                  <el-radio v-model="ruleForm.integralUseStatus" label="0" class="margin-20">不支持抵现</el-radio>
                </div>
              </el-form-item>
              <el-form-item label="比例限制" prop="name">
                  <label style="color: #606266">最多可抵用商品金额的 </label>
                  <el-input @keyup.native="formatInputNum($event)" v-model="ruleForm.channelList[0].useProportionalRestriction"><template slot="append">%</template></el-input>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <el-button :disabled="contactBool" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                  <el-button @click="goBack">返 回</el-button>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
     <!-- 添加商品 -->
    <add-goods :goodsListId="goodsListId" :goodsType="goodsType" :goodShow.sync="goodShow" :projectName="repProjectName" @selectGoods="selectGoods"></add-goods>

    <!-- 人群筛选器的弹框 -->
    <el-dialog
      title="自定义人群"
      :visible.sync="dialogVisiblePeople"
      width="1175px">
      <div class="select-people">
        <vue-gic-people :projectName="repProjectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
        <div v-show="toggleTag" class="people-btn-wrap">
          <el-row>
            <el-button @click="getData" type="primary" size="small">确定</el-button>
            <el-button @click="cancelFilter" size="small">取消</el-button>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-button @click="dialogVisiblePeople = false">取 消</el-button>
          <el-button type="primary" @click="getPeopleData">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>

    <!-- 是否关联集团的提示 -->
    <el-dialog
      title="提示"
      :visible.sync="contactDialog"
      width="500px">
      <span>已关联集团，此页面只能查看不能编辑保存。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="contactDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import topNav from 'components/nav/nav'
import addGoods from 'components/memberShip/add-goods'
import Treeselect from '@riophae/vue-treeselect'
import goodsCate from 'components/memberShip/goodsCate'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import strLength from '@/common/js/strlen';

import { getRequest, postRequest, postJsonRequest, postJson, postForm } from '@/api/api';

export default {
  name: "addIntegralSytem",
  data() {
    return {
      contactBool:false,    // 是否关联集团的标识
      contactDialog:false,
      repProjectName: 'gic-web',
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
          name: '积分制度',
          path: '/pointSystem'
        },
        {
          name: '编辑积分抵现策略',
          path: ''
        }
      ],
      rules:{
        strategyName:[
          { required: true, message: '请填写策略名称', trigger: 'blur' },
        ]
      },
      // 添加商品弹窗
      goodShow: false,

      // 长度
      cateNameLength: 0,
      // 输入字限制
      inputFlagNum: 20,


      // 商户
      mechantOption:[],

      applyGoods:[
        {
          label: '所有商品',
          value: '1',
        },
        {
          label: '按商品品牌',
          value: '2',
        },
        {
          label: '按商品品类',
          value: '3',
        },
        {
          label: '按单件商品',
          value: '4',
        },
      ],
      ruleForm: {
        // 积分获取规则
        integralStrategyId: "ff80808163a7a09b0163b01171e202db", //策略id
        enterpriseId: "ff8080815dacd3a2015dacd3ef5c0000",
        strategyName: 1, //策略名称
        strategyType: 1, // 策略类型 1消费积分 2积分抵现
        useCrowd: '1', // 策略类型 1所有 2人群筛选
        crowdJson: '', //人群筛选器内容
        selectorParams:'',
        integralGetStatus: '1', // 积分获取开启 1是0否
        integralGet: {fee:11,integral:12},
        integralGetStrategy: '1', // 取整策略 1四舍五入 2抹零 3向上取整
        integralGetFreezeDays: 1, // 获取积分冻结天数
        integralGetEffectiveDays: 1, // 获取积分有效天
        integralUseStatus: '0', // 积分抵现开启 1是0否
        integralUse: {fee:'',integral:''}, // 积分抵现 {fee:5,integral:5}
        channelList: [
          {
            integralStrategyChannelId: "ff808081649321d20164a1fafbdd01df", //id
            enterpriseId: "ff8080815dacd3a2015dacd3ef5c0000",
            integralStrategyId: "ff80808163a7a09b0163b01171e202db", //策略id
            channelType: "1", //渠道类型 1微信 3:线下 5淘宝 6京东 7唯品会 8天猫
            openStatus: 1, //渠道配置是否启用 1启用 0停用
            channelRelationEnterpriseType: "1", // 策略关联企业 1所有企业 2部分企业
            channelRelationStoreType: "1", //策略关联门店类型 1所有门店 2门店分组 3部分门店
            channelStoreType: "-1", // 策略选择门店类型 （-1:所有 0:自营 1:联营 2:加盟,3代销4托管）
            channelRelationProType: "1", // 策略关联商品类型 1所有商品 2商品品牌 3商品类目 4部分商品
            integralUseDiscountControl: "1", // 折扣控制 1所有折扣商品适用 2折扣范围
            integralUseDiscountControlUpper: "0.0",
            integralUseDiscountControlLower: "0.0",
            useProportionalRestriction: "0.0", // 抵现比例限制
            strategyGoodsRelationIdArr: [], // 商品
            storeRelationIdArr: [], //门店
            enterpriseRelationIdArr: [], //商户
            useProportionalRestriction: '0', //  抵现比例限制
          },
        ],
      },

      // 适用对象
      applyObjOption:[
        {
          label: '所有会员',
          value: '1',
        },
        {
          label: '自定义人群',
          value: '2',
        },
      ],
      dialogVisiblePeople:false,

      /* 人群筛选器 */
      sceneValue: 'member',  // 场景值
      useId:'',
      searchParams:'',
      hasSearchData: '' , // 当前页回显的数据(接口返回)
      toggleTag:false,
      selectCount:0,

      // 单个商品类型
      goodsType:'wx',   // 单个商品类型  wx：微信商城，line：线下渠道
      goodsListId:[],
      goodsListWx:[],
      goodsListLine:[],

      // 商品品类
      selectCateDataWx:[],  // 用于回显
      selectCateDataLine:[],
      selectCateTypeWx:'wx',
      selectCateTypeLine:'line',
      cateDataWx:[],
      cateDataLine:[],
      storeGroupList:[],

      // 商品品牌
      goodsTreeOptionsWx: [],
      valueWx: [],
      goodsTreeOptionsLine: [],
      valueLine: [],

    }
  },
  created() {
    // this.selectReplayStyle()
  },
  mounted() {
    var that = this
    console.log(that.$route.query.integralStrategyId)
    // 获取策略 id
    var id = that.$route.query.integralStrategyId;
    that.ruleForm.integralStrategyId = id;
    that.getInfo();

    // 商品品牌
    that.getGoodsBrand();

    // 是否关联集团
    that.getContact()
  },
  methods: {
    getContact(){   // 是否关联集团
      var para = {};
      getRequest('/api-auth/is-relevance-clique',para)
      .then((res) => {
        var resData = res.data
        // console.log(resData);
        if (resData.errorCode == 0) {
          this.contactBool = resData.result;
          this.contactDialog = resData.result;
        }else{
          errMsg.errorMsg(resData)
        }
      })
      .catch(function (error) {
        console.log(error);

        this.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 保存
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(that.ruleForm);
          var data = JSON.parse(JSON.stringify(that.ruleForm))

          // 非空验证
          if (!data.strategyName) {
            showMsg.showmsg('请填写策略名称','error')
            return;
          }

          // if (!data.channelList[0].enterpriseRelationIdArr.length) {
          //   showMsg.showmsg('请填写选择商户','error')
          //   return;
          // }
          if(data.channelList[0].integralUseDiscountControl==2){
            var flagA = Number(data.channelList[0].integralUseDiscountControlLower)>=Number(data.channelList[0].integralUseDiscountControlUpper);

            if( !data.channelList[0].integralUseDiscountControlLower || !data.channelList[0].integralUseDiscountControlUpper ){
              that.$message.error('折扣控制中的折扣不能为空')
              return;
            }
            if (flagA) {
              that.$message.error("折扣控制中的折扣格式有误")
              return;
            }
          }
          var flag = !data.integralUse.fee || String(data.integralUse.integral)=="";
          if (data.integralUseStatus == 1 && flag) {
            that.$message.error("请填写抵现规则")
            return;
          }
          if (data.integralUseStatus == 1) {
            if(!Number(data.integralUse.fee)){
              showMsg.showmsg('抵现规则中的抵现金额不能为0','error')
              return;
            }
            if(!Number(data.integralUse.integral)){
              showMsg.showmsg('抵现规则中的使用积分不能为0','error')
              return;
            }
          }

          // if (data.integralUseStatus==1 && (!Number(data.integralUse.integral)||!Number(data.integralUse.fee))) {
          //   showMsg.showmsg('请填写抵现规则','error')
          //   return;
          // }

          if (!data.channelList[0].useProportionalRestriction) {
            showMsg.showmsg('请填写比例限制','error')
            return;
          }else{
            if(data.channelList[0].useProportionalRestriction>100){
              showMsg.showmsg('比例限制不能大于100','error')
              return;
            }
          }

          var saveBool = true;
          data.channelList.forEach((item)=>{
            if (item.channelType == 1) {   // 微信商城
              // 适用商品
              if(item.channelRelationProType==2 && this.valueWx.length<1){  // 商品品牌
                showMsg.showmsg('请选择商品品牌','error')
                return saveBool = false;
              }
              if(item.channelRelationProType==3 && this.cateDataWx.length<1){  // 商品品类
                showMsg.showmsg('请选择商品品类','error')
                return saveBool = false;
              }
              if(item.channelRelationProType==4 && this.goodsListWx.length<1){  // 单件商品
                showMsg.showmsg('请选择单件商品','error')
                return saveBool = false;
              }
            }
          })
          // 自定义人群
          if(data.useCrowd==2 && this.selectCount<1){
            showMsg.showmsg('请选择人群定向','error')
            return;
          }

          delete data.selectorParamsId;

          // 规则需要乘以 10 去掉---20180906
          data.integralUse.fee = data.integralUse.fee
          data.integralUse.integral = data.integralUse.integral
          data.integralUse = JSON.stringify(data.integralUse)

          if(data.channelList){
            data.channelList.forEach(function(ele,index) {
              ele.openStatus = 1
            })
          }
          if(saveBool){
            that.saveForm(data)
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

     // 保存数据
    saveForm(data) {
      var that = this
      // console.log("编辑积分抵现策略:" ,data)
      var para = data;

      postJson('/api-admin/save-member-integral-strategy',para)
      .then((res) => {
        console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {
          // that.updateData()
          that.$message({
            message: '保存成功',
            type: 'success'
          });

          that.changeRoute('/pointSystem');

          return;
        }
        errMsg.errorMsg(resData)
        // that.updateData()
      })
      .catch(function (error) {
        console.log(error);
        // that.updateData()
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 输入
    toInput: function(value) {
      var that = this;
      console.log(value)

      var temp = '';
      var temp = strLength.getByteVal(value.target.value,that.inputFlagNum)
      console.log(temp)
      that.ruleForm.strategyName = temp.trim()

      that.cateNameLength = strLength.getZhLen(that.ruleForm.strategyName);

      console.log(that.ruleForm)
    },

    inputFocus(obj,tag,flag){
      var that = this
      //console.log(tag);
      that.tempTag = tag;
      that.tempData = obj;
      console.log(that.tempData);
      if (!!flag) {
        that.tempFlag = flag;
      }else {
        that.tempFlag = '';
      }
    },
    // 折扣重新写的判断
    formatInputChange(e) {
      var that = this
      console.log(e);
      if (that.tempTag == 'integralUseDiscountControlLower' || that.tempTag =='integralUseDiscountControlUpper') {
        that.tempData[that.tempTag] = Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2);
        if (Number(that.tempData[that.tempTag])>10) {
          that.tempData[that.tempTag] = Number(10).toFixed(2)
        }
        // if (Number(that.tempData.integralUseDiscountControlLower) >= Number(that.tempData.integralUseDiscountControlUpper)) {
        //   that.tempData.integralUseDiscountControlLower = String(Number(that.tempData.integralUseDiscountControlUpper - 1).toFixed(2)).indexOf('-') !='-1'? '0.00':Number(that.tempData.integralUseDiscountControlUpper - 1).toFixed(2)
        // }
        return;
      }
    },

    // 输入框输入校验数字
    formatInput(e){
      var that = this
      console.log(e,e.target.value,that.tempData.integralUseDiscountControlLower)
      that.tempData.integralUseDiscountControlLower = Number(String(that.tempData.integralUseDiscountControlLower).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.tempData.integralUseDiscountControlLower).replace(/[^\.\d]/g,'')).toFixed(2);
      that.tempData.integralUseDiscountControlUpper = Number(String(that.tempData.integralUseDiscountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.tempData.integralUseDiscountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2);
    },
    formatInputNum(e){
      var that = this
      that.ruleForm.integralUse.fee = strLength.getCharVal(String(that.ruleForm.integralUse.fee).replace(/[^\.\d]/g,''),6)
      that.ruleForm.integralUse.integral = strLength.getCharVal(String(that.ruleForm.integralUse.integral).replace(/[^\.\d]/g,''),8)
      that.ruleForm.channelList[0].useProportionalRestriction = strLength.getCharVal(String(that.ruleForm.channelList[0].useProportionalRestriction).replace(/[^\d]/g,''),3)
    },
    formatInputNumBlur(){
      var that = this
      that.ruleForm.integralUse.fee = Number(strLength.getCharVal(String(that.ruleForm.integralUse.fee).replace(/[^\.\d]/g,''),6)).toFixed(1)
      // that.ruleForm.integralGet.integral = Number(strLength.getCharVal(String(that.ruleForm.integralGet.integral).replace(/[^\.\d]/g,''),8)).toFixed(1)
    },
    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },

    // 获取策略信息
    getInfo() {
      var that = this
      var para = {
        strategyId: that.ruleForm.integralStrategyId
      }

      postRequest('/api-admin/get-member-integral-strategy',para)
      .then((res) => {
        console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {

          // 商户列表
          // var prise = res.data.result.enterpriseList
          // prise.forEach(function(ele,index){
          //   ele.label = ele.enterpriseName;
          //   ele.value = ele.enterpriseId;
          // })
          // that.mechantOption = prise

          var item = res.data.result.strategy;

          if(item.channelList){
            item.channelList.forEach((item)=>{
              if(item.channelType=='1'){  // 微信商城
                if(item.channelRelationProType==3){  // 商品品类
                  if(item.goodsCategoryList){
                    item.goodsCategoryList.forEach((item)=>{
                      that.selectCateDataWx.push(item)
                    })
                  }
                }
                if(item.channelRelationProType==4){  // 单件商品
                  if(item.strategyGoodsRelationIdArr){
                    item.strategyGoodsRelationIdArr.forEach((item)=>{
                      that.goodsListWx.push(item)
                    })
                  }
                }
                if(item.channelRelationProType==2){  // 商品品牌
                  if(item.strategyGoodsRelationIdArr){
                    item.strategyGoodsRelationIdArr.forEach((item)=>{
                      that.valueWx.push(item)
                    })
                  }
                }
              }
            })
          }

          // 自定义人群
          if(item.useCrowd==2){
            var arr = JSON.parse(item.crowdJson);
            this.selectCount = 0;
            if(arr.list){
              arr.list.forEach((item)=>{
                if(item.list){
                  this.selectCount += item.list.length;
                }
              })
            }
            this.useId = item.selectorParamsId;
            this.hasSearchData = item.crowdJson;
          }

          item.integralUse = JSON.parse(item.integralUse)
          if (!item.integralUse) {
            item.integralUse = {}
            item.integralUse.fee = '';
            item.integralUse.integral = '';
          }
          // 规则需要先除以10去掉 -----20180906
          if (item.integralUse.fee !='') {
            item.integralUse.fee = item.integralUse.fee
          }
          if (item.integralUse.integral) {
            item.integralUse.integral = item.integralUse.integral
          }

          that.ruleForm = that.formatData(item)
          // 字数控制
          that.cateNameLength = strLength.getZhLen(that.ruleForm.strategyName)
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

    // 去空值
    bouncer(arr) {

      return arr.filter(function(val){
        return !(!val || val === "");
      });
    },

    formatData(item) {
      var that = this
      item.integralGetStatus = String(item.integralGetStatus);
      item.integralUseStatus = String(item.integralUseStatus);
      item.useCrowd = String(item.useCrowd);

      item.integralGet = JSON.parse(item.integralGet);


      item.channelList.forEach(function(ele,index) {
        ele.channelType = String(ele.channelType);
        // ele.useCrowd = String(ele.useCrowd);
        ele.channelRelationStoreType = String(ele.channelRelationStoreType)
        ele.channelStoreType = String(ele.channelStoreType)
        ele.channelRelationProType = String(ele.channelRelationProType)
        ele.integralUseDiscountControl = String(ele.integralUseDiscountControl)
        ele.integralUseDiscountControlUpper = String(ele.integralUseDiscountControlUpper)
        ele.integralUseDiscountControlLower = String(ele.integralUseDiscountControlLower)
        ele.useProportionalRestriction = String(ele.useProportionalRestriction)

        if (!ele.strategyGoodsRelationIdArr || !ele.strategyGoodsRelationIdArr.length) {

          ele.strategyGoodsRelationIdArr = []
        }
        if (!ele.storeRelationIdArr || !ele.storeRelationIdArr.length) {
          ele.storeRelationIdArr = []
        }
        if (!ele.enterpriseRelationIdArr || !ele.enterpriseRelationIdArr.length) {
          ele.enterpriseRelationIdArr = []
        }
      })
      return item;
    },

    // 获取商品品牌  1
    getGoodsBrand(){
      var that = this
      var para = {}
      getRequest('/api-mall/list-enterprise-brand',para)
      .then((res) => {
        // console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {
          var data = resData.result
          that.goodsTreeOptionsWx = data
          that.goodsTreeOptionsLine = data
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 选择商品品牌  微信商城
    selectGoodsStoreWx(val){
      this.valueWx = val;
      this.ruleForm.channelList.forEach((item,index)=>{
        if(item.channelType=='1'){
          this.ruleForm.channelList[index].strategyGoodsRelationIdArr = [];
          val.forEach((ele)=>{
            this.ruleForm.channelList[index].strategyGoodsRelationIdArr.push(ele)
          })
        }
      })
    },
    // 单件商品 的 子组件显示方法
    showGoodsDialog(type) {
      var that = this
      that.goodsType = type
      that.goodShow = true;
      that.goodsListId = [];
      if(type=='wx'){
        // that.goodsListId = ['1']
        that.goodsListId = that.goodsListWx;
      }else if(type=='line'){
        // that.goodsListId = ['12121']
        that.goodsListId = that.goodsListLine;
      }
    },

    // 单件商品 的 子组件触发方法
    selectGoods(val){
      var that = this
      that.goodShow = false;
      that.goodsListId = [];
      if(val){
        if(val.goodsType=='wx'){
          that.ruleForm.channelList.forEach((item,index)=>{
            if(item.channelType=='1'){
              that.ruleForm.channelList[index].strategyGoodsRelationIdArr = [];
              val.strategyGoodsRelationIds.forEach((ele)=>{
                that.ruleForm.channelList[index].strategyGoodsRelationIdArr.push(ele)
              })
            }
          })
          that.goodsListWx = val.strategyGoodsRelationIds;
        }else if(val.goodsType=='line'){
          that.ruleForm.channelList.forEach((item,index)=>{
            if(item.channelType=='3'){
              that.ruleForm.channelList[index].strategyGoodsRelationIdArr = [];
              val.strategyGoodsRelationIds.forEach((ele)=>{
                that.ruleForm.channelList[index].strategyGoodsRelationIdArr.push(ele)
              })
            }
          })
          that.goodsListLine = val.strategyGoodsRelationIds;
        }
      }
    },

    // 选择适用对象
    changePeople(val){
      console.log(this.ruleForm.useCrowd);
    },
    showPeople(){
      this.dialogVisiblePeople = true;
    },
    /* 人群筛选器 start */
    getData() { // 父组件调用子组件方法,触发父组件事件
      this.$refs.peopleFilter.confirmSet()
    },
    findFilter(value){  // 子组件触发父组件事件,返回过滤条件数据
      console.log(value);
      this.ruleForm.crowdJson = value;
      this.searchParams = value;
      if(this.ruleForm.crowdJson){
        var arr = JSON.parse(this.ruleForm.crowdJson);
        this.selectCount = 0;
        if(arr.list){
          arr.list.forEach((item)=>{
            this.selectCount += item.list.length;
          })
        }
      }
    },
    cancelFilter(){
      this.$refs.peopleFilter.cancelSet()
    },
    getBackData(val) {
      console.log(val);
      this.ruleForm.selectorParams = val;
    },
    // 隐藏保存按钮和确认按钮  (子组件会调用)
    hideBtn() {
      var that = this
      that.toggleTag= false;
    },
    // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
    editShow() {
      this.toggleTag= true
    },
    editHide() {
      this.toggleTag= false
    },
    getPeopleData(){  // 筛选器 弹框的确认按钮
      var that = this;
      that.$refs.peopleFilter.confirmSet();
      setTimeout(function(){
        if(that.searchParams){
          that.lsSaveBtn(that.searchParams)
        }
      },500)
    },
    lsSaveBtn(searchParams){  // 人群筛选器弹框的确定按钮  临时保存
      postRequest('/api-admin/get-screen-detail-param',{
        requestProject: 'gic-web',
        tempBusinessId: this.tempBusinessId?this.tempBusinessId:"",
        detailParams: searchParams
      }).then(res => {
        if(res.data.errorCode == 0) {
          this.tempBusinessId = res.data.result;
          this.useId = res.data.result;
          this.dialogVisiblePeople = false;
          this.searchParams = ""
        }else {
          this.$message.error(data.message);
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 商品品类
    getCateIds(val){  // 获取数据
      console.log(val);
      if(val.selectCateType=='wx'){
        this.ruleForm.channelList.forEach((item,index)=>{
          if(item.channelType=='1'){
            this.ruleForm.channelList[index].strategyGoodsRelationIdArr = [];
            val.cateIdsList.forEach((ele)=>{
              this.ruleForm.channelList[index].strategyGoodsRelationIdArr.push(ele);
              this.cateDataWx.push(ele)
            })
          }
        })

      }else if(val.selectCateType=='line'){
        this.ruleForm.channelList.forEach((item,index)=>{
          if(item.channelType=='3'){
            this.ruleForm.channelList[index].strategyGoodsRelationIdArr = [];
            val.cateIdsList.forEach((ele)=>{
              this.ruleForm.channelList[index].strategyGoodsRelationIdArr.push(ele);
              this.cateDataLine.push(ele)
            })
          }
        })
      }
    },
    selectGoodsCateHide(){   // 调用子组件 商品品类组件的函数
      if(this.ruleForm.channelList.length>0 ){
        this.ruleForm.channelList.forEach((item,index)=>{
          if(item.channelType=='1' && item.channelRelationProType==3){  // 微信商城
            if (this.$refs.selectGoodsCate  instanceof Array) {
              this.$refs.selectGoodsCate[0].hideDragClick();
            }else {
              this.$refs.selectGoodsCate.hideDragClick();
            }
          }
        })
      }
    },

  },
  components: {
    topNav,
    Treeselect,
    addGoods,
    goodsCate
  }
}

</script>
<style lang="less" scoped>
.right-box{
  padding: 24px 32px;
}
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

  .vue-treeselect {
    display: inline-block;
    vertical-align: top;
    width: 300px;
  }

  .title-tip {
    font-size: 12px;
    color: #888;
  }
  .attention-content-wrap {}
}

.form-wrap {
  .el-input,/deep/ .el-input-number {
    width: 178px;
    padding: 0 10px;
    .el-input__inner{
      text-align: left;
    }
    &.w-300 {
      width: 300px;

      /*/deep/ .el-input-group__append{
        background-color: #fff;
        border-left: 0px;
      }
      /deep/ .el-input__inner {
        border-right: 0px;
      }*/
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


  .el-select {
    vertical-align: top;
  }

  .span-txt {
    position: absolute;
    left: 222px;
    z-index: 2;
    width: 300px;
    text-align: center;
  }

  .padding-0 {
    padding: 0;
  }

  .form-child {
    width: 100%;
    padding: 15px 20px 10px 0px;
    background: #f5f6f9;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

  }

  .margin-l-120 {
    margin-left: 120px;
  }

  .margin-20 {
    margin-top: 20px;
  }

  .tinymce-wrap {
    width: 780px;
  }
}

  /*人群筛选器*/
  .select-people{
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .select-people /deep/ .marginLeft134{
    margin-left: 80px;
  }
  .select-people /deep/ .filter-content .member-templates-condition-title{
    text-align: left;
    font-size: 14px;
    line-height: 24px;
  }
  .select-people /deep/ .filter-content{
    margin-top: 0;
  }
  .people-btn-wrap{
    width: 100%;
    background: #f2f3f4;
    box-sizing: border-box;
    padding: 0 0 24px 100px;
  }
  .select-people /deep/ .detail{
    margin-top: 0;
  }

  .margin-r-6{
    margin-right: 6px
  }

  .right-box /deep/ .el-input__inner{
    padding-right: 12px;
  }
  .right-box .padding-r-45 /deep/ .el-input__inner{
    padding-right: 45px;
  }
  /* 商品品类 */
  .goods-cate{
    display: inline-block;
  }
  .goods-cate .goods-cate-content{
    width: 217px;
  }
</style>
