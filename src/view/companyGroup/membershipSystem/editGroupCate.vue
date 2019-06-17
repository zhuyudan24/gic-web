<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content" @click="selectGoodsCateHide">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="form-wrap">
            <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="策略名称" prop="strategyName" class="padding-0">
                 <el-input v-model="ruleForm.strategyName" class="w-340 padding-0" @keyup.native="(value) => toInput(value)">
                    <!-- <template slot="append"><label class="input-label">{{cateNameLength}}/20</label></template> -->
                 </el-input>
                 <label class="input-label">{{cateNameLength}}/20</label>
              </el-form-item>

              <el-form-item label="适用条件" class="padding-0">
                <div class="title-tip">该设置只对微信商城中的积分抵现起作用。</div>
              </el-form-item>
              <div class="form-child margin-20" >
                <el-form-item label="选择商户" style="display: none;">
                  <el-select v-model="ruleForm.cliqueEnterpriseIds" placeholder="请选择" multiple >
                    <el-option
                      v-for="item in mechantOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
  
                <el-form-item label="适用商品" class="padding-0">
                  <div>
                    <el-select class="fl" style="margin-right: 10px;" v-model="ruleForm.strategyRelationType" placeholder="请选择" @change="changeGood($event)">
                      <el-option
                        v-for="item in applyGoods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <!-- 商品品牌 -->
                    <el-select class="fl" @change="selectGoodsStore" v-if="ruleForm.strategyRelationType == 2" v-model="value5" multiple placeholder="请选择">
                      <el-option
                        v-for="item in goodsTreeOptions"
                        :key="item.brandId"
                        :label="item.brandName"
                        :value="item.brandId">
                      </el-option>
                    </el-select>
                    <!-- 商品品类 -->
                    <div class="fl goods-cate" v-if="ruleForm.strategyRelationType == 3">
                      <goodsCate ref="selectGoodsCate" :selectCateType="selectCateTypeWx" :selectCateData="selectCateDataWx" @getCateIds="getCateIds"></goodsCate>
                    </div>
                    <el-button style="width:217px" class="fl" v-if="ruleForm.strategyRelationType == 4" @click.stop.prevent="showGoodsDialog('wx')">已选{{goodsListWx.length}}件商品</el-button>
                  </div>
                </el-form-item>

                <el-form-item label="折扣控制" prop="region">
                  <div class="radio-cell">
                    <el-radio  v-model="ruleForm.discountControl" label="1">所有折扣商品都适用</el-radio>
                  </div>
                  <div class="radio-cell margin-20" >
                    <el-radio v-model="ruleForm.discountControl"  label="2">折扣</el-radio>
                    <!-- <el-input @change="formatInputChange($event)" v-model="ruleForm.discountControlLower"></el-input> -->
                    <el-input-number v-model="ruleForm.discountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                    <label>至</label>
                    <!-- <el-input @change="formatInputChange($event)" v-model="ruleForm.discountControlUpper"></el-input> -->
                    <el-input-number v-model="ruleForm.discountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                    <label>折商品都适用</label>
                    <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                  </div>
                </el-form-item>
              </div>
              <el-form-item label="折扣" prop="discountRate" class="margin-20">
                <el-input @focus="inputFocus('discountRate')" @change="formatInputChange($event)" v-model="ruleForm.discountRate"></el-input>
                折 <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00</span>
              </el-form-item>
              <el-form-item label="计算方式" prop="">
                <el-radio  v-model="ruleForm.calculationMethod" label="1">就低原则</el-radio>
                <el-radio v-model="ruleForm.calculationMethod"  label="2">折上折</el-radio>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <el-button type="primary" @click.stop.prevent="submitForm('ruleForm')">保 存</el-button>
                  <el-button @click.stop.prevent="goBack">返 回</el-button>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
     <!-- 添加商品 -->
    <add-goods :goodsListId="goodsListId" :goodsType="goodsType" :goodShow.sync="goodShow" :projectName="repProjectName" @selectGoods="selectGoods"></add-goods>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav'
import addGoods from 'components/memberShip/add-goods' 
import goodsCate from 'components/memberShip/goodsCate'
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import strLength from '@/common/js/strlen';

import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';

import { getRequest, postRequest, postForm } from '@/api/api';

export default {
  name: "editGroupCate",
  data() {
    return {
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
          name: '会员卡设置',
          path: '/memberCardSet'
        },
        {
          name: '编辑会员等级',
          path: '/editGroupGrade'
        },
        {
          name: '编辑折扣策略',
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

      // 门店
      StoreOptions: [
        {
          label: '所有门店',
          value: '0',
        },
        {
          label: '门店分组',
          value: '1',
        },
        {
          label: '部分门店',
          value: '2',
        },
      ],
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
      
      // tree
      wxOpen: false,
      valueConsistsOf: 'ALL',
      treeOptions: [ {
        id: 'company',
        label: 'Company',
        children: [ {
          id: 'team-i',
          label: 'Team I',
          children: [ {
            id: 'person-a',
            label: 'Person A',
          }, {
            id: 'person-b',
            label: 'Person B',
          } ],
        }],
      }],

      ruleForm: {
        // 积分获取规则
        "gradeStrategyId": "",  //策略id
        "gradeId": "",  //等级id
        "strategyName": "1211",   //策略名称
        "strategyRelationType": 3,  // /** 策略关联类型 1所有商品 2商品品牌 3商品类目 4部分商品 */
        "discountRate": 1.0,   // 折扣率
        "calculationMethod": 2,   // 计算方式 1就低原则 2折上折
        "discountControl": 2,  // 折扣控制 1所有折扣商品适用 2折扣范围
        "discountControlUpper": 0,  // 折扣控制 折扣范围 下限
        "discountControlLower": 0,  //折扣控制 折扣范围 上限
        "gradeStrategyGoodsRelationIds": [],    // 策略关联商品信息id
        "cliqueEnterpriseIds": [],  // 策略关联商户信息
        "relationCount": 0,
        "enterpriseMS": null,
        "goodsCategoryList":[]
      },

      // 商品品类
      selectCateDataWx:[],  // 用于回显
      selectCateDataLine:[],  
      selectCateTypeWx:'wx',
      selectCateTypeLine:'line', 
      cateDataWx:[],
      cateDataLine:[],  

      // 单个商品类型
      goodsType:'wx',   // 单个商品类型  wx：微信商城，line：线下渠道
      goodsListId:[],
      goodsListWx:[],
      goodsListLine:[],

      // 商品品牌
      goodsTreeOptions: [],
      value5: [],

      changeGoodData:''
    }
  },
  created() {
    // this.selectReplayStyle()
  },
  mounted() {
    var that = this

    that.getGoodsBrand();  // 商品品牌

    that.ruleForm.strategyId = that.$route.query.strategyId;
    that.ruleForm.gradeId = that.$route.query.gradeId;
    if(that.ruleForm.gradeId){
      that.navpath[3].path = '/editGroupGrade?gradeId='+that.ruleForm.gradeId;
    }
    that.getInfo()
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 保存
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(that.ruleForm))

          if (!data.strategyName) {
            showMsg.showmsg('请填写策略名称','error')
            return;
          }

          if(data.strategyRelationType == 2 && that.value5.length<1){
            showMsg.showmsg('请选择商品品牌','error')
            return;
          }

          if(data.strategyRelationType == 3 && that.cateDataWx.length<1){
            showMsg.showmsg('请选择商品品类','error')
            return;
          }

          if(data.strategyRelationType == 4 && that.goodsListWx.length<1){
            showMsg.showmsg('请选择单件商品','error')
            return;
          }
          // if (!data.cliqueEnterpriseIds.length) {
          //   showMsg.showmsg('请选择商户','error')
          //   return;
          // }

          // if (data.discountControl == 2&&(!data.discountControlLower||!data.discountControlUpper)) {
          //   showMsg.showmsg('请选择折扣控制中的折扣率','error')
          //   return;
          // }
          
          // 扣控制中的折扣率判断

          if(data.discountControl == 2){
            var flagA = Number(data.discountControlUpper) <= Number(data.discountControlLower);
            if( !data.discountControlUpper || !data.discountControlLower ){
              that.$message.error('折扣控制中的折扣率不能为空')
              return;
            }
            if (flagA) {
              that.$message.error("折扣控制中的折扣率格式有误")
              return;
            }
          }

          // var flagA = (data.discountControl == 2 && (parseInt(data.discountControlLower) >10 || parseInt(data.discountControlUpper) > 10 || Number(data.discountControlUpper) <= Number(data.discountControlLower)))
          // if (flagA) {
          //   that.$message.error({
          //     duration: 1000,
          //     message: "扣控制中的折扣率格式有误"
          //   })
          //   return;
          // }

          if (data.discountRate=="") {
            showMsg.showmsg('请填写折扣率','error')
            return;
          }else if (data.discountRate < 0.01){
            showMsg.showmsg('折扣率不能为0哦','error')
            return;
          }

          data.discountControlUpper = data.discountControlUpper || '0';
          data.discountControlLower = data.discountControlLower || '0';

          data.cliqueEnterpriseIds = data.cliqueEnterpriseIds.join(',')
          data.gradeStrategyGoodsRelationIds = data.gradeStrategyGoodsRelationIds.join(',')


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

      postRequest('/api-admin/save-member-grade-strategy',para)
      .then((res) => {
        // console.log("edit:",res.data.result,form.gradeStrategyId)
        var resData = res.data
        if (resData.errorCode == 0) {
          // 向本地暂存替换一条
          var data = JSON.parse(sessionStorage.getItem('strategy'))
          // console.log(data)
          data.forEach(function(ele,index){
            // console.log(ele.gradeStrategyId,form.gradeStrategyId)
            if (ele.gradeStrategyId == form.gradeStrategyId) {
              ele.strategyName = resData.result.strategyName;
              ele.cliqueEnterpriseIds = resData.result.cliqueEnterpriseIds;
              ele.discountControl = resData.result.discountControl;
              ele.discountControlLower = resData.result.discountControlLower;
              ele.discountControlUpper = resData.result.discountControlUpper;
              ele.discountRate = resData.result.discountRate
              ele.gradeStrategyGoodsRelationIds = resData.result.gradeStrategyGoodsRelationIds
              ele.relationCount = resData.result.relationCount
              ele.strategyRelationType = resData.result.strategyRelationType

              // console.log(ele)
            }
          })
          sessionStorage.setItem('strategy',JSON.stringify(data))

          showMsg.showmsg('保存成功','success')
          that.goBack();
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 输入
    toInput: function(value) {
      var that = this;
      // console.log(value)

      var temp = '';
      var temp = strLength.getByteVal(value.target.value,that.inputFlagNum)
      // console.log(temp)
      that.ruleForm.cateName = temp.trim()

      that.cateNameLength = strLength.getZhLen(that.ruleForm.cateName);

      // console.log(that.ruleForm)
    },
    inputFocus(tag,flag){
      var that = this
      // console.log(tag);
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
      // console.log(e)

      that.ruleForm.discountControlLower = Number(String(that.ruleForm.discountControlLower).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.discountControlLower).replace(/[^\.\d]/g,'')).toFixed(2);
      that.ruleForm.discountControlUpper = Number(String(that.ruleForm.discountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(that.ruleForm.discountControlUpper).replace(/[^\.\d]/g,'')).toFixed(2);

      // 比较大小
      if (Number(that.ruleForm.discountControlLower)>10) {
        that.ruleForm.discountControlLower = Number(10).toFixed(2);
      }
      if (Number(that.ruleForm.discountControlUpper)>10) {
        that.ruleForm.discountControlUpper = Number(10).toFixed(2);
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
      // console.log(e,e.target.value)
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
    changeRoute(route) {
      this.$router.push(route);
    },

    // 树形结构
    toggle(flag) {
      var that = this
      that.treeFlag = flag

      if(flag== 'wx'){
        that.wxOpen = true
      }
      document.addEventListener('click', that.hidePanel, false)
    },

    hidePanel(e) {
      var that = this
      // console.log(that.$refs.treeinput,typeof(e.target.className))
      if (typeof(e.target.className)== 'object') {return;}
      var tag = e.target.className !='span-txt' && e.target.className !='vue-treeselect__list' && e.target.className != 'vue-treeselect__label' && e.target.className != 'vue-treeselect__list-item vue-treeselect__indent-level-1' && e.target.className != 'vue-treeselect__minus-mark' && e.target.className !='vue-treeselect__option' && e.target.className !='vue-treeselect__option vue-treeselect__option--highlight' && e.target.className !='vue-treeselect__checkbox vue-treeselect__checkbox--unchecked'&& e.target.className != 'vue-treeselect__option-arrow-placeholder' && e.target.className!='el-form demo-ruleForm' && e.target.className!='vue-treeselect__option vue-treeselect__option--selected vue-treeselect__option--highlight' && e.target.className !='vue-treeselect__list-item vue-treeselect__indent-level-1' && e.target.className!= 'vue-treeselect__list-item vue-treeselect__indent-level-0' && e.target.className !='vue-treeselect__checkbox-container' && e.target.className !='vue-treeselect__option-arrow-container';
        console.log(tag)
      if (tag){

        if(that.treeFlag== 'wx'){
          that.wxOpen = false
        }
      }
    },

    // 去空值
    bouncer(arr) {
      return arr.filter(function(val){
        return !(!val || val === "");
      });
    },

    // 获取信息
    getInfo() {
      var that = this
      var para = {
        strategyId: that.ruleForm.strategyId,
      }
      postRequest('/api-admin/get-member-grade-strategy-info',para)
      .then((res) => {
        var resData = res.data
        console.log(resData)
        if (resData.errorCode == 0) {

          // 商户列表
          // var prise = resData.result.enterpriseList
          // if(prise){
          //   prise.forEach(function(ele,index){
          //     ele.label = ele.enterpriseName;
          //     ele.value = ele.enterpriseId;
          //   })
          //   that.mechantOption = prise
          // }
          
          var data = resData.result.strategyDTO

          if (!!data.cliqueEnterpriseIds) {
            data.cliqueEnterpriseIds = that.bouncer(data.cliqueEnterpriseIds.split(','))
          }else {
            data.cliqueEnterpriseIds= []
          }

          if (!!data.gradeStrategyGoodsRelationIds) {
            data.gradeStrategyGoodsRelationIds = that.bouncer(data.gradeStrategyGoodsRelationIds.split(','))
            // 所有商品
            if(data.strategyRelationType==1){
              data.gradeStrategyGoodsRelationIds = []
            }
            // 商品品牌  
            if(data.strategyRelationType==2){
              that.value5 = data.gradeStrategyGoodsRelationIds
            }
            // 商品品类
            if(data.strategyRelationType==3){
              that.selectCateDataWx = data.goodsCategoryList;
              that.cateDataWx = data.gradeStrategyGoodsRelationIds;
            }
            // 单件商品
            if(data.strategyRelationType==4){
              that.goodsListWx = data.gradeStrategyGoodsRelationIds
            }
          }else {
            data.gradeStrategyGoodsRelationIds= []
          }

          data.discountRate = String(data.discountRate)
          data.calculationMethod = String(data.calculationMethod)
          data.discountControl = String(data.discountControl)
          data.discountControlUpper = String(data.discountControlUpper)
          data.discountControlLower = String(data.discountControlLower)
          data.strategyRelationType = String(data.strategyRelationType)

          that.ruleForm = data

          that.ruleForm.goodsCategoryList = []
          // 字数控制
          that.cateNameLength = strLength.getZhLen(that.ruleForm.strategyName)
          // showMsg.showmsg('设置成功','success')
          // console.log(data)
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

    changeGood(e){    // 切换适用商品
      if(this.ruleForm.strategyRelationType == '1'){
        this.ruleForm.gradeStrategyGoodsRelationIds = [];
      }
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
          that.goodsTreeOptions = data
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        // console.log(error);

        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 选择商品品牌  
    selectGoodsStore(val){
      this.value5 = val;
      this.ruleForm.gradeStrategyGoodsRelationIds=this.value5;
    },

    // 单件商品 的 子组件显示方法   3
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
      console.log(val);
      that.goodShow = false;
      that.goodsListId = [];
      if(val){
        if(val.goodsType=='wx'){
          that.ruleForm.gradeStrategyGoodsRelationIds = val.strategyGoodsRelationIds;
          that.goodsListWx = val.strategyGoodsRelationIds;
        }else if(val.goodsType=='line'){
          
        }
      }
    },

    // 商品品类
    getCateIds(val){  // 获取数据
      console.log(val);
      if(val.selectCateType=='wx'){
        this.ruleForm.gradeStrategyGoodsRelationIds = [];
        this.cateDataWx = [];
        val.cateIdsList.forEach((ele)=>{
          this.ruleForm.gradeStrategyGoodsRelationIds.push(ele);
          this.cateDataWx.push(ele)
        })
        console.log(this.ruleForm.gradeStrategyGoodsRelationIds);
      }else if(val.selectCateType=='line'){
       
      }
    },
    selectGoodsCateHide(){   // 调用子组件 商品品类组件的函数
      if(this.ruleForm.strategyRelationType == 3){
        this.$refs.selectGoodsCate.hideDragClick();
      }
    },

  },
  components: {
    topNav,
    Treeselect,
    addGoods,
    goodsCate
  },
 
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

  .el-input {
    width: 178px;
    padding: 0 10px;
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
    color: #c0c4cc;;
    font-size: 12px;
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


/*树形*/
.vue-treeselect /deep/ {

    /deep/ .vue-treeselect__control {
      height: 36px;
      /*line-height: 36px;*/
      cursor: pointer;
    }

    .vue-treeselect__placeholder {
      line-height: 36px;
      font-size: 12px;
    }

    /deep/ .vue-treeselect__multi-value-item-container,/deep/ .vue-treeselect__multi-value {
      line-height: 1;
      height: 0;
      opacity: 0;
    }

    span.vue-treeselect__multi-value-label {
      line-height: 1;
    }

    .vue-treeselect__multi-value-item {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background-color: #f0f2f5;
      color: #909399;
    }

    .vue-treeselect__value-remove {
      color: #909399;
    }

    &:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover {
      background-color: #f0f2f5;
      color: #909399;
    }

    .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
      cursor: pointer;
    }

    .vue-treeselect__x-container {
      display: none;
    }

    /deep/.vue-treeselect__control-arrow {
      display: none;
      color: #fff;
    }

    .vue-treeselect__control-arrow-container {
      position: relative;
    }

    /deep/.vue-treeselect__control-arrow-container:after, .vue-treeselect__control-arrow-container:before {
      border: 6px solid transparent;
      border-left: 6px solid #fff;
      width: 0;
      height: 0;
      position: absolute;
      top: 49%;
      left: 50%;
      margin-left: -6px;
      content: ' ';
      margin-top: -3px;
      -webkit-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      transform: rotate(90deg);
      -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s, -webkit-transform .3s;
      transition: transform .3s,-webkit-transform .3s;
    }

    /deep/ .vue-treeselect__control-arrow-container:before {
      border-left-color: #c0c4cc;
      top: 52%;
    }

    &.vue-treeselect--focused .vue-treeselect__control-arrow-container:after, &.vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
      margin-top: -6px;
      -webkit-transform: rotateZ(-90deg);
      -moz-transform: rotateZ(-90deg);
      -o-transform: rotateZ(-90deg);
      transform: rotateZ(-90deg);
      -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s, -webkit-transform .3s;
      transition: transform .3s,-webkit-transform .3s;
    }

    &.vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
      border-left-color: #c0c4cc;
      top: 47%;
    }

    .vue-treeselect--has-value .vue-treeselect__multi-value {
      margin-bottom: 0;
    }
  }
  /* 商品品类 */
  .goods-cate{
    display: inline-block;
  }
  .goods-cate .goods-cate-content{
    width: 217px;
  }
  /*折扣率*/
  .form-wrap /deep/ .el-input-number .el-input{
    padding: 0 10px;
    .el-input__inner{
      text-align: left;
    }
  }
</style>
