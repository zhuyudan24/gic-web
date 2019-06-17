<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content" @click="selectTreeHide">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="form-wrap">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="策略名称" prop="strategyName">
                 <el-input v-model="ruleForm.strategyName" class="w-340" @keyup.native="(value) => toInput(value)">
                 </el-input>
                 <label class="input-label">{{cateNameLength}}/20</label>
              </el-form-item>
              <template v-for="(item,index) in ruleForm.channelList">
                <!-- 线下渠道 -->
                <template v-if="item.channelType==3">
                  <el-form-item label="适用线下渠道" prop="">
                    <el-switch
                      v-model="item.openStatus">
                    </el-switch>
                  </el-form-item>
                  <div class="form-child" v-if="item.openStatus" >
                    <!-- 选择门店 -->
                    <el-form-item label="消费门店" prop="region">
                      <!-- <selectShopTree :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree> -->
                      <vue-gic-store-new :scenesVal="scencs" :options="options" :isAdd="isAdd" :uuid.sync="uuid" ref="storeGroup"></vue-gic-store-new>
                    </el-form-item>
                    <el-form-item label="适用商品" prop="name" class="padding-0">
                      <el-select @change="lineGoods" v-model="item.channelRelationProType" placeholder="请选择" class="margin-r-6">
                        <el-option
                          v-for="item in applyGoods"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <!-- 二级 -->
                      <!-- 商品品牌 -->
                      <el-select  size="small" @change="selectGoodsStoreLine" v-if="item.channelRelationProType == 2" v-model="valueLine" multiple placeholder="请选择">
                        <el-option
                          v-for="item in goodsTreeOptionsLine"
                          :key="item.brandId"
                          :label="item.brandName"
                          :value="item.brandId">
                        </el-option>
                      </el-select>

                      <!-- 商品品类 -->
                      <div v-if="item.channelRelationProType==3" class="all-style-wrap">
                        <!-- <goodsCate :selectCateType="selectCateTypeLine" :selectCateData="selectCateDataLine" @getCateIds="getCateIds"></goodsCate> -->
                        <div class="select-shop" @click.prevent.stop="toggleShopTree">
                          <input type="text" readonly v-model="shopGroupValue">
                        </div>
                        <transition name="slide-fade">
                          <div class="select-shop-url-wrap" v-show="showGoodsTree" >
                            <div class="shop-tree-wrap">
                              <el-tree
                                ref="goodsGroupTree"
                                :data="dataObj"
                                show-checkbox
                                default-expand-all
                                :default-checked-keys="keysArr"
                                node-key="categoryId"
                                highlight-current
                                :props="defaultProps2">
                              </el-tree>
                            </div>
                            <div class="select-group-btn">
                              <el-row style="height:16px;margin-top:6px">
                                <el-button @click.prevent.stop="goodsHideTree" type="text" size="small" style="color:#303133">取消</el-button>
                                <el-button @click.prevent.stop="goodsBtnSure" type="text" size="small">确定</el-button>
                              </el-row>
                            </div>
                          </div>
                        </transition>

                      </div>

                      <el-button v-if="item.channelRelationProType==4" @click="showGoodsDialog('line')">已选{{goodsListLine.length}}件商品</el-button>
                    </el-form-item>

                    <el-form-item label="折扣控制" prop="region" class="input-margin-b">
                      <div class="radio-cell">
                         <el-radio v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20">
                         <el-radio v-model="item.integralUseDiscountControl" label="2">折扣</el-radio>
                         <!-- <el-input @focus="inputFocus(item,'integralUseDiscountControlLower')"  @change="formatInputChange($event)" v-model="item.integralUseDiscountControlLower"></el-input> -->
                         <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                         <label>至</label>
                         <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                         <label>折商品都适用</label>
                         <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>

                <!-- 微信商城 -->
                <template v-if="item.channelType==1">
                  <el-form-item label="适用微信商城" prop="">
                    <el-switch
                      v-model="item.openStatus">
                    </el-switch>
                  </el-form-item>
                  <div class="form-child" v-if="item.openStatus==true">
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

                      <el-button style="width:240px" class="fl" v-if="item.channelRelationProType==4" @click="showGoodsDialog('wx')">已选{{goodsListWx.length}}件商品</el-button>

                    </el-form-item>
                    <el-form-item label="折扣控制" prop="region" class="input-margin-b">
                      <div class="radio-cell">
                        <el-radio  v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20" >
                        <el-radio v-model="item.integralUseDiscountControl"
                         label="2">折扣</el-radio>
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>至</label>
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
                <!-- 第三方 -->
                <template v-if="false">
                  <el-form-item label="第三方电商渠道" prop="">
                    <el-switch
                      v-model="item.openStatus">
                    </el-switch>
                  </el-form-item>
                  <div class="form-child margin-20" v-if="item.openStatus==true">
                    <el-form-item label="选择店铺">
                      <el-select @change="otherStore" v-model="item.channelRelationStoreType" placeholder="请选择" >
                        <el-option
                          v-for="item in allShopOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="天猫商品" class="padding-0">
                      <el-select @change="otherGoods" v-model="item.channelRelationProType" placeholder="请选择">
                        <el-option
                          v-for="item in allGoodOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="折扣控制" prop="region" class="input-margin-b">
                      <div class="radio-cell">
                        <el-radio  v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20" >
                        <el-radio v-model="item.integralUseDiscountControl"  label="2">折扣</el-radio>
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>至</label>
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>

                      </div>
                    </el-form-item>
                  </div>
                </template>
                <!-- 微盟渠道-->
                <template v-if="item.channelType==9" >
                  <el-form-item label="微盟渠道" prop="">
                    <el-switch
                      v-model="item.openStatus">
                    </el-switch>
                  </el-form-item>
                  <div class="form-child margin-20" v-if="item.openStatus==true">
                    <el-form-item label="选择店铺">
                      <el-select v-model="item.channelRelationStoreType" placeholder="请选择" >
                        <el-option
                          v-for="item in wMShopOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="微盟商品" class="padding-0">
                      <el-select v-model="item.channelRelationProType" placeholder="请选择">
                        <el-option
                          v-for="item in wMGoodOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="折扣控制" prop="region" class="input-margin-b">
                      <div class="radio-cell">
                        <el-radio  v-model="item.integralUseDiscountControl" label="1">所有折扣商品都适用</el-radio>
                      </div>
                      <div class="radio-cell margin-20" >
                        <el-radio v-model="item.integralUseDiscountControl"  label="2">折扣</el-radio>
                        <el-input-number v-model="item.integralUseDiscountControlLower" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>至</label>
                        <el-input-number v-model="item.integralUseDiscountControlUpper" :precision="2" :controls="false" :max="10.00" :min="0.01"></el-input-number>
                        <label>折商品都适用</label>
                        <span style="font-size: 13px;color: #828282;line-height: 1;padding-left: 10px;">注意：折扣范围0.01-10.00，最低折扣不能大于最高折扣</span>
                      </div>
                    </el-form-item>
                  </div>
                </template>
              </template>

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
                <el-button style="width: 240px;" @click="showPeople">已设置{{ selectCount }}项筛选</el-button>
              </el-form-item>

              <el-form-item label="获取规则" prop="" class="input-margin-b">
                <div>
                  <el-radio v-model="ruleForm.integralGetStatus" label="1">每消费</el-radio>
                  <!-- <el-input @blur="formatInputNumBlur($event)" v-model="ruleForm.integralGet.fee"></el-input> -->
                  <el-input-number v-model="ruleForm.integralGet.fee" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
                  <label>元，获取 </label>
                  <!-- <el-input @keyup.native="formatInputNum($event)" v-model="ruleForm.integralGet.integral"></el-input> -->
                  <el-input-number v-model="ruleForm.integralGet.integral" :precision="1" :controls="false" :max="10000.0" :min="0.1"></el-input-number>
                  <label>积分。取整策略为</label>
                  <el-select @chane="getStrategy" v-model="ruleForm.integralGetStrategy" placeholder="请选择">
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
              <el-form-item label="积分冻结期" v-if="ruleForm.integralGetStatus==1" class="input-margin-r">
                <el-input @keyup.native="formatInputNum($event)" v-model="ruleForm.integralGetFreezeDays"></el-input><label>天</label>
              </el-form-item>
               <el-form-item label="积分有效期" v-if="ruleForm.integralGetStatus==1" class="input-margin-r">
                <el-input @keyup.native="formatInputNum($event)" v-model="ruleForm.integralGetEffectiveDays"></el-input><label>天</label>
              </el-form-item>
              <el-form-item>
                <el-row>
                  <el-button :disabled="contactBool" type="primary" @click.stop.prevent="submitForm('ruleForm')">保 存</el-button>
                  <el-button @click.stop.prevent="goBack">返 回</el-button>
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
        <vue-gic-people :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
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
import selectShopTree from 'components/basicConfig/selectShopTree/selectShopTreeMany'
import goodsCate from 'components/memberShip/goodsCate'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import { getRequest, postRequest, postJsonRequest, postJson, postForm } from '@/api/api';
import strLength from '@/common/js/strlen';
export default {
  name: "editPointSytem",
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
          name: '编辑积分获取策略',
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
      // 输入字限制
      inputFlagNum: 20,

      // 门店
      StoreOptions: [
        {
          label: '所有门店',
          value: '1',
        },
        {
          label: '门店分组',
          value: '2',
        },
        {
          label: '部分门店',
          value: '3',
        },
      ],
      StoreTypeOptions: [
        {
          label: '所有门店',
          value: '-1',
        },
        {
          label: '自营',
          value: '0',
        },
        {
          label: '联营',
          value: '1',
        },
        {
          label: '加盟',
          value: '2',
        },
        {
          label: '代销',
          value: '3',
        },
        {
          label: '托管',
          value: '4',
        },
      ],
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
      // 商户
      mechantOption:[],
      // 第三方下拉
      allShopOption: [
       {
          label: '所有店铺',
          value: '1',
        },
      ],
      allGoodOption: [
        {
          label: '所有商品',
          value: '1',
        },
      ],
      // 微盟渠道
      wMShopOption: [
       {
          label: '所有店铺', // 就是所有门店
          value: '1',
        },
      ],
      wMGoodOption: [
        {
          label: '所有商品',
          value: '1',
        },
      ],
      storeListOptions: [], //下拉搜索出现的门店列表
      // 长度
      cateNameLength: 0,

      ruleForm: {
        // 积分获取规则
        integralStrategyId: "ff80808163a7a09b0163b01171e202db", //策略id
        enterpriseId: "ff8080815dacd3a2015dacd3ef5c0000",
        strategyName: '', //策略名称
        strategyType: 1, // 策略类型 1消费积分 2积分抵现
        useCrowd: 1, // 策略类型 1所有 2人群筛选
        selectorParams:'', // 传给后台的值
        crowdJson: '', //人群筛选器内容
        integralGetStatus: '1', // 积分获取开启 1是0否
        integralGet: {fee:11,integral:12},
        integralGetStrategy: '1', // 取整策略 1四舍五入 2抹零 3向上取整
        integralGetFreezeDays: 1, // 获取积分冻结天数
        integralGetEffectiveDays: 1, // 获取积分有效天
        integralUseStatus: 0, // 积分抵现开启 1是0否
        integralUse: null, // 积分抵现 {fee:5,integral:5}
        channelList: [],
      },
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

      // 适用对象  --- 人群筛选器
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

      /* 人群筛选器 */
      dialogVisiblePeople:false,
      projectName:'gic-web',
      sceneValue: 'member',  // 场景值
      useId:'',
      searchParams:'',
      hasSearchData: '' , // 当前页回显的数据(接口返回)
      toggleTag:false,
      selectCount:0,
      tempBusinessId:'', // 人群筛选器的临时保存

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

      // 线下渠道  商品品类
      defaultProps2: {
        children: 'childList',
        label: 'categoryName'
      },
      value: '0',
      dataObj:[],
      showGoodsTree: false,  // 显示门店的树级结构
      showSearchList:false, // 显示部分门店的搜索结果
      shopGroupValue:'已选择0个商品品类',
      searchShop:'',
      searchValue:'',   // 部分门店
      searchValueList:'',  // 部分门店的下拉框的搜索值
      searchOptions:[],
      selectList:[],
      selecData:[],
      selecDataName:[],
      selecDataId:[],
      selectListId:[],    // 选中的门店的id
      selectListGroupId:[],
      keysArr:[],  // 默认选中的门店分组
      // 门店  新
      uuid: '', // 新增传空，编辑必传,
      options: [0, 1, 2, 3, 4, 5], // 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
      isAdd: true,
      scencs: 'integral'
    }
  },

  methods: {
    // 是否关联集团
    getContact(){
      var para = {};
      getRequest('/api-auth/is-relevance-clique',para)
      .then((res) => {
        var resData = res.data
        // console.log(resData);
        if (resData.errorCode == 0) {
          this.contactDialog = resData.result;
          this.contactBool = resData.result;
        }else{
          errMsg.errorMsg(resData)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 返回
    goBack() {
      this.$router.push('/pointSystem')
    },

    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
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
    // input focus
    // inputFocus(obj){
    //   var that = this
    //   that.tempData = obj
    // },
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
      that.ruleForm.integralGetEffectiveDays = strLength.getCharVal(String(that.ruleForm.integralGetEffectiveDays).replace(/[^\d]/g,''),4)
      that.ruleForm.integralGetFreezeDays = strLength.getCharVal(String(that.ruleForm.integralGetFreezeDays).replace(/[^\d]/g,''),4)

      // that.ruleForm.integralGet.fee = strLength.getCharVal(String(that.ruleForm.integralGet.fee).replace(/[^\.\d]/g,''),6)
      that.ruleForm.integralGet.integral = strLength.getCharVal(String(that.ruleForm.integralGet.integral).replace(/[^\d]/g,''),8)
    },

    formatInputNumBlur(){
      var that = this
      that.ruleForm.integralGet.fee = Number(strLength.getCharVal(String(that.ruleForm.integralGet.fee).replace(/[^\.\d]/g,''),6)).toFixed(1)
      // that.ruleForm.integralGet.integral = Number(strLength.getCharVal(String(that.ruleForm.integralGet.integral).replace(/[^\.\d]/g,''),8)).toFixed(1)
    },

    async checkListValue(data) {
      var that = this
      var obj = {
        flag : true,
        text: ''
      }
      if (!!data.channelList.length) {
        for (let i = 0; i < data.channelList.length; i++) {
          if(!!data.channelList[i].openStatus){
            if ( data.channelList[i].integralUseDiscountControl == 2) {
              if (!data.channelList[i].integralUseDiscountControlUpper || !data.channelList[i].integralUseDiscountControlLower) {
                obj.flag = false;
                obj.text = '请填写折扣';
              }
              if (parseInt(data.channelList[i].integralUseDiscountControlUpper) > 10 || parseInt(data.channelList[i].integralUseDiscountControlLower) > 10 || Number(data.channelList[i].integralUseDiscountControlUpper) <= Number(data.channelList[i].integralUseDiscountControlLower)) {
                obj.flag = false;
                obj.text = '折扣格式有误';
              }
            }
            if (data.channelList[i].channelType == 3) {
              const storeGroupDom = this.$refs.storeGroup;
              let flag = null;
              if (storeGroupDom instanceof Array) {
                flag = await this.$refs.storeGroup[0].isStoreSave();
              } else {
                flag = await this.$refs.storeGroup.isStoreSave();
              }
              if (!flag) {
                obj.flag = false;
                obj.text = '请选择门店';
              }
            }
          }
        }
      }
      return obj;
    },

    // 保存
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          // 处理数据
          var data = JSON.parse(JSON.stringify(that.ruleForm))
          // console.log(data)

          if (!data.strategyName) {
            showMsg.showmsg('请填写策略名称','error')
            return;
          }
          var flag = !data.integralGet.fee || String(data.integralGet.integral)=="";
          if (data.integralGetStatus == 1 && flag) {
            showMsg.showmsg('请填写获取规则','error')
            return;
          }
          if (data.integralGetStatus == 1) {
            if(!Number(data.integralGet.fee)){
              showMsg.showmsg('获取规则中的消费金额不能为0','error')
              return;
            }
            if(!Number(data.integralGet.integral)){
              showMsg.showmsg('获取规则中的获取积分不能为0','error')
              return;
            }
          }
          if(Number(data.integralGetFreezeDays)!=0){
            if (data.integralGetStatus == 1 && !Number(data.integralGetFreezeDays)) {
              showMsg.showmsg('请填写积分冻结期','error')
              return;
            }
          }

          if (data.integralGetStatus == 1 && !Number(data.integralGetEffectiveDays)) {
            showMsg.showmsg('请填写积分有效期','error')
            return;
          }
          that.checkListValue(data).then(res => {
            if (!res.flag) {
              showMsg.showmsg(res.text, 'error');
              return;
            } else {
              var saveBool = true;
              data.channelList.forEach((item)=>{
                if(item.openStatus==1){    // 开启
                  if (item.channelType == 1) {   // 微信商城
                    // 适用商品
                    if(item.channelRelationProType==2 && this.valueWx.length<1){  // 商品品牌
                      showMsg.showmsg('请选择微信商城的商品品牌','error')
                      return saveBool = false;
                    }
                    if(item.channelRelationProType==3 && this.cateDataWx.length<1){  // 商品品类
                      showMsg.showmsg('请选择微信商城的商品品类','error')
                      return saveBool = false;
                    }
                    if(item.channelRelationProType==4 && this.goodsListWx.length<1){  // 单件商品
                      showMsg.showmsg('请选择微信商城的单件商品','error')
                      return saveBool = false;
                    }
                  }

                  if (item.channelType == 3) {   // 线下渠道
                    // 适用商品
                    if(item.channelRelationProType==2 && this.valueLine.length<1){  // 商品品牌
                      showMsg.showmsg('请选择线下渠道的商品品牌','error')
                      return saveBool = false;
                    }
                    if(item.channelRelationProType==3 && this.keysArr.length<1){  // 商品品类
                      showMsg.showmsg('请选择线下渠道的商品品类','error')
                      return saveBool = false;
                    }
                    if(item.channelRelationProType==4 && this.goodsListLine.length<1){  // 单件商品
                      showMsg.showmsg('请选择线下渠道的单件商品','error')
                      return saveBool = false;
                    }
                    // 门店选择
                    if(this.storeType==1 && this.storeGroupIds.length<1){
                      showMsg.showmsg('请选择线下渠道的门店分组','error')
                      return saveBool = false;
                    }
                    if(this.storeType==2 && this.storeIds.length<1){
                      showMsg.showmsg('请选择线下渠道的部分门店','error')
                      return saveBool = false;
                    }
                  }

                }else if(item.openStatus==0){  // 关闭，不做任何判断

                }

              })
              // 自定义人群
              if(data.useCrowd==2 && this.selectCount<1){
                showMsg.showmsg('请选择人群定向','error')
                return;
              }
              // return;
              // 设置开启状态 1-->true
              data.channelList.forEach(function(ele,index){
                ele.openStatus = ele.openStatus== true? 1: 0
                delete ele.strategyGoodsRelationIds;
                delete ele.enterpriseRelationIds;
                delete ele.storeRelationIds;

                if (ele.channelType == 1) {
                  // ele.strategyGoodsRelationIdArr = ele.goodsRelationIdArr
                  // // console.log(ele.strategyGoodsRelationIds)
                  delete ele.goodsRelationIdArr;
                }
                if (!ele.enterpriseRelationIdArr||!ele.enterpriseRelationIdArr.length) {
                  ele.enterpriseRelationIdArr = []
                }
                if (!ele.storeRelationIdArr||!ele.storeRelationIdArr.length) {
                  ele.storeRelationIdArr = []
                }
                if (!ele.strategyGoodsRelationIdArr||!ele.strategyGoodsRelationIdArr.length) {
                  ele.strategyGoodsRelationIdArr = []
                }
                if (ele.channelType == '3') {
                  ele.channelRelationStoreType = '1';
                  ele.channelStoreType = '-1';
                  ele.storeControlId = that.uuid;
                }
              })
              delete data.selectorParamsId;
              data.integralGet.fee = parseInt(data.integralGet.fee*10)
              data.integralGet.integral = parseInt(data.integralGet.integral*10)
              data.integralGet = JSON.stringify(data.integralGet)
              if(saveBool){
                that.saveForm(data);
              }
            }
          })
        } else {
          showMsg.showmsg('表单信息未填写完整','error')
          return false;
        }
      });
    },

    // 保存数据
    saveForm(data) {
      var that = this
      var para = data
      // var para = that.ruleForm;
      postJson('/api-admin/save-member-integral-strategy',para)
      .then((res) => {
        // console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {
          that.$message({
            message: '保存成功',
            type: 'success'
          });
          that.changeRoute('/pointSystem');
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

    // 获取策略信息
    getInfo() {
      var that = this
      var para = {
        strategyId: that.ruleForm.integralStrategyId
      }
      postRequest('/api-admin/get-member-integral-strategy',para)
      .then((res) => {
        // console.log(res.data.result)
        var resData = res.data
        if (resData.errorCode == 0) {
          var item = res.data.result.strategy;
          // 获取微信商城、线下渠道的单件商品
          if(item.channelList){
            item.channelList.forEach((item)=>{
              if(item.channelType=='1'){  // 微信商城
                if(item.channelRelationProType==3){  // 商品品类
                  if(item.goodsCategoryList){
                    item.goodsCategoryList.forEach((item)=>{
                      that.selectCateDataWx.push(item);
                    })
                  }
                  if(item.strategyGoodsRelationIdArr){
                    item.strategyGoodsRelationIdArr.forEach((item)=>{
                      that.cateDataWx.push(item)
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
              }else if(item.channelType=='3'){  // 线下渠道
                if(item.channelRelationProType==3){ // 商品品类
                  this.keysArr.splice(0,this.keysArr.length);
                  // this.shopGroupValue = '已选择'+(dataObj.storeGroupIds.split(',').length)+'个门店分组';
                  item.strategyGoodsRelationIdArr.forEach((item)=>{
                    this.keysArr.push(item);
                  });
                  this.shopGroupValue = '已选择'+this.keysArr.length+'个商品品类';
                }

                if(item.channelRelationProType==4){  // 单件商品
                  if(item.strategyGoodsRelationIdArr){
                    item.strategyGoodsRelationIdArr.forEach((item)=>{
                      that.goodsListLine.push(item)
                    })
                  }
                }

                if(item.channelRelationProType==2){  // 商品品牌
                  if(item.strategyGoodsRelationIdArr){
                    item.strategyGoodsRelationIdArr.forEach((item)=>{
                      that.valueLine.push(item)
                    })
                  }
                }

                // 门店选择
                if(item.channelRelationStoreType=='2'){    // 向子组件传递数据
                  this.sendChildData = {};
                  this.sendChildData.storeType = 1;
                  this.sendChildData.storeGroupIds = item.storeRelationIdArr.join(',');

                  this.storeGroupIds = item.storeRelationIdArr
                } else if(item.channelRelationStoreType=='1'){    // 向子组件传递数据
                  this.sendChildData = {};
                  this.sendChildData.storeType = 0;

                  item.storeRelationIdArr = [];
                } else if(item.channelRelationStoreType=='3'){
                  this.sendChildData = {};    // 向子组件传递数据
                  this.sendChildData.storeType = 2;
                  this.sendChildData.storeName = item.storeNameList.join(',');
                  this.sendChildData.storeIds = item.storeRelationIdArr.join(',');

                  this.storeIds = item.storeRelationIdArr
                }
              }
            })
          }
          // 自定义人群
          if(item.useCrowd==2){
            var arr = item.crowdJson?JSON.parse(item.crowdJson):[];
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
          that.ruleForm = that.formatData(item)

          // 字数控制
          that.cateNameLength = strLength.getZhLen(that.ruleForm.strategyName)
          return;
        }
        errMsg.errorMsg(resData)
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    formatData(item) {
      var that = this
      item.integralGetStatus = String(item.integralGetStatus);
      item.integralUseStatus = String(item.integralUseStatus);
      item.integralGetStrategy = String(item.integralGetStrategy);
      item.useCrowd = String(item.useCrowd);

      item.integralGet = JSON.parse(item.integralGet);
      // 获取规则需要除以 10
      // console.log(item.integralGet)
      item.integralGet.fee = Number(item.integralGet.fee/10).toFixed(1)
      item.integralGet.integral = Number(item.integralGet.integral/10)
      // item.integralGet.integral = Number(item.integralGet.integral/10).toFixed(1)
      var channelType = [];
      if (!!item.channelList.length) {
        item.channelList[0] = item.channelList.splice(1,1,item.channelList[0])[0]; // 第一个与第二个互换位置
        item.channelList.forEach(function(ele,index) {
          ele.openStatus = ele.openStatus == 0? false: true;
          ele.channelType = String(ele.channelType);
          // ele.useCrowd = String(ele.useCrowd);
          ele.channelRelationStoreType = String(ele.channelRelationStoreType)
          ele.channelStoreType = String(ele.channelStoreType)
          ele.channelRelationProType = String(ele.channelRelationProType)
          ele.integralUseDiscountControl = String(ele.integralUseDiscountControl)
          ele.integralUseDiscountControlUpper = String(ele.integralUseDiscountControlUpper)
          ele.integralUseDiscountControlLower = String(ele.integralUseDiscountControlLower)
          ele.useProportionalRestriction = String(ele.useProportionalRestriction)

          if (!ele.enterpriseRelationIdArr||!ele.enterpriseRelationIdArr.length || ele.enterpriseRelationIdArr[0]=='[]') {
            ele.enterpriseRelationIdArr = []
          }
          if (!ele.storeRelationIdArr||!ele.storeRelationIdArr.length) {
            ele.storeRelationIdArr = []
          }
          if (!ele.strategyGoodsRelationIdArr||!ele.strategyGoodsRelationIdArr.length) {
            ele.strategyGoodsRelationIdArr = []
          }

          if (ele.channelType == 1) {
            // ele.goodsRelationIdArr = [];
            // ele.goodsRelationIdArr = ele.strategyGoodsRelationIdArr || [] // 复制商品字段
          }
          if (ele.channelType == 3) {
            that.uuid = ele.storeControlId;
            that.isAdd = false;
          }
          // 判断是否有微盟
          channelType.push(ele.channelType);
        })
        if(channelType.indexOf('9') < 0){
          item.channelList.push({
            integralStrategyChannelId: "", //id
            enterpriseId: "",
            integralStrategyId: "", //策略id
            channelType: "9", //渠道类型 1微信 3:线下 5淘宝 6京东 7唯品会 8天猫
            openStatus: true, //渠道配置是否启用 1启用 0停用
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
            enterpriseRelationIdArr: [] //商户
          })
        }
      }
      return item;
    },
    // 获取商品品牌  1
    getGoodsBrand(){
      var that = this
      var para = {}
      getRequest('/api-mall/list-enterprise-brand',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          var data = resData.result
          that.goodsTreeOptionsWx = data
          that.goodsTreeOptionsLine = data
        }
        errMsg.errorMsg(resData)
      })
      .catch(function (error) {
        console.log(error);
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
    selectGoodsStoreLine(val){  // 线下渠道
      this.valueLine = val;
      this.ruleForm.channelList.forEach((item,index)=>{
        if(item.channelType=='3'){
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

    // 选择门店
    selectTreeHide(){   // 调用子组件 门店树级 结构的函数
      if(this.ruleForm.channelList.length>0 ){
        this.ruleForm.channelList.forEach((item,index)=>{
          if(item.channelType=='1' && item.openStatus==1 && item.channelRelationProType==3){  // 微信商城
            if (this.$refs.selectGoodsCate  instanceof Array) {
              this.$refs.selectGoodsCate[0].hideDragClick();
            }else {
              this.$refs.selectGoodsCate.hideDragClick();
            }
          }
        })
        this.showGoodsTree=false;  // 商品品类
      }
    },
    showPeople(){
      this.dialogVisiblePeople = true;
    },
    /* 人群筛选器 start */
    getData() { // 父组件调用子组件方法,触发父组件事件
      this.$refs.peopleFilter.confirmSet()
    },
    findFilter(value){  // 子组件触发父组件事件,返回过滤条件数据
      // console.log(value);
      this.ruleForm.crowdJson = value;
      this.searchParams = value;
      if(this.ruleForm.crowdJson){
        var arr = JSON.parse(this.ruleForm.crowdJson);
        this.selectCount = 0;
        if(arr.list){
          arr.list.forEach((item)=>{
            if(item.list){
              this.selectCount += item.list.length;
            }
          })
        }
      }
    },
    cancelFilter(){
      this.$refs.peopleFilter.cancelSet()
    },
    getBackData(val) {
      // console.log(val);
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
      postJson('/api-admin/get-screen-detail-param',{
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
    /* end */

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
    // 线下渠道的商品品类
    getGoodsTreeData(){
      var that = this
      var para = {}
      getRequest('/api-goods/list_gic_goods_category_data',para)
      .then((res) => {
        console.log(res.data)
        var resData = res.data
        if (resData.errorCode == 0) {
          that.dataObj = resData.result;
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
    toggleShopTree(){
      this.showGoodsTree = !this.showGoodsTree
    },
    goodsBtnSure(){         // 选择商品品类的确定按钮
      this.showGoodsTree=false;
      var obj = {};
      this.storeGroupList = [];
      if(this.$refs.goodsGroupTree  instanceof Array){
        this.storeGroupList = this.$refs.goodsGroupTree[0].getCheckedKeys();
      }else {
        this.storeGroupList = this.$refs.goodsGroupTree.getCheckedKeys();
      }
      var len = this.storeGroupList.length;  // elementUI 里的函数方法
      this.shopGroupValue = '已选择'+len+'个商品品类';
      this.keysArr.splice(0,this.keysArr.length);
      this.ruleForm.channelList.forEach((item,index)=>{
        if(item.channelType=='3'){
          this.ruleForm.channelList[index].strategyGoodsRelationIdArr = [];
          this.storeGroupList.forEach((ele)=>{
            this.ruleForm.channelList[index].strategyGoodsRelationIdArr.push(ele);
            this.keysArr.push(ele)
          })
        }
      })
    },
    goodsHideTree(){
      this.showGoodsTree=false;  // 商品品类
    },
    lineStore(){  // 线下  选择门店  隐藏商品品类
      this.goodsHideTree();
    },
    lineGoods(){
      this.goodsHideTree();
    },
    otherStore(){
      this.goodsHideTree();
    },
    otherGoods(){
      this.goodsHideTree();
    },
    changePeople(){
      this.goodsHideTree();
    },
    getStrategy(){
      this.goodsHideTree();
    }
  },
  components: {
    topNav,
    Treeselect,
    addGoods,
    selectShopTree,
    goodsCate
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

    // 线下渠道的商品品类
    that.getGoodsTreeData();

    // 是否关联集团
    that.getContact();
  },
  destoryed() {

  }
}

</script>
<style lang="scss" scoped>
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
  .attention-content-wrap {}
}

.form-wrap {

  .el-input {
    width: 178px;
    /*padding: 0 10px;*/
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
    color: #c0c4cc;
    font-size: 12px;
  }

  .el-select {
    vertical-align: top;
    width: 240px;
  }

  .span-txt {
    position: absolute;
    z-index: 2;
    width: 300px;
    text-align: center;
  }

  .padding-0 {
    padding: 0;
  }

  .form-child {
    width: 100%;
    padding: 22px 20px 1px 0px;
    margin: 22px 0;
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
  .select-people /deep/ .screening-condition{
    margin-top: 0;
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

  /* 线下渠道的商品品类*/
  .all-style-wrap{
    width: 240px;
    position: relative;
    display: inline-block;
    .search-input{
      width:180px;
    }
    .select-shop{
      width: 240px;
      min-height: 28px;
      line-height: 28px;
      font-size: 14px;
      color: #606266;
      border-radius: 4px;
      padding: 1px 0;
      border: 1px solid #dcdfe6;
      background: #fff;
      input{
        cursor: pointer;
        padding-left: 15px;
        box-sizing: border-box;
        width: 190px;
        height: 100%;
        color: #606266;
      }
      .shop-style-icon{
        color: #c0c4cc;
        transition: all 0.3s;
        &.on{
          transform:rotate(-180deg)
        }
      }
    }
    .select-shop-url-wrap{
      width: 240px;
      max-height: 260px;
      position: absolute;
      right: 0;
      margin-top: 10px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      z-index: 3000;
      .shop-tree-wrap{
        padding: 10px;
        overflow: auto;
        height: 212px;
        border: 1px solid #e4e7ed;
        box-sizing: border-box;
        position: relative;
      }
      .select-group-btn{
        padding: 4px 15px;
        height: 36px;
        line-height: 25px;
        text-align: right;
        box-sizing: border-box;
      }
    }
  }
  .select-shop-wrap{
    /* 显示隐藏的动画 */
    .slide-fade-enter-active, .slide-fade-leave-active {
      transition: all 0.3s;
    }
    .slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
  .select-shop-wrap /deep/ .select-shop-url-wrap .el-input__inner{
    width: 100%;
  }
  .all-style-wrap .select-shop .search-input-width{
    max-width: 80px;
    padding-left: 5px;
  }
  .select-shop{
    position: relative;
    .shop-style-icon{
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
  .input-margin-b /deep/ .el-input-number{
    width: 178px;
    padding: 0 10px;
    .el-input{
      margin: 0;
      .el-input__inner{
        text-align:left;
      }
    }
  }
  .input-margin-b /deep/ .el-input__inner{
    padding-right: 12px;
  }
  .input-margin-r /deep/ .el-input__inner{
    padding-right: 12px;
  }
  .input-margin-b /deep/ .el-input{
    margin: 0 10px;
  }
  .input-margin-r /deep/ .el-input{
    margin-right: 10px;
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
    width: 240px;
  }
</style>
