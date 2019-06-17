<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
        <!-- 开卡策略 -->
          <div class="title-group">
            <h3 class="open-card-title">开卡策略</h3>
            <p class="open-card-descript">设置办理电子会员卡的基本规则</p>
          </div>
          <div class="cell-body">
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
                    <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            <!-- <card-cate :contactBool="contactBool" :cardCateInfo="cardCateInfo" :projectName="projectName" :suffixKey="suffixKey" :useSuffix="useSuffix"></card-cate> -->
          </div>
          <div class="height-24"></div>
          <!-- 开卡基本信息配置 -->
          <div class="title-group">
            <h3 class="open-card-title">开卡基本信息配置</h3>
            <p class="open-card-descript">设置办理电子会员卡的基本信息字段</p>
          </div>
          <div class="cell-body">
            <el-form>
              <el-form-item label="微信会员" prop="">
                <el-button type="primary" @click="changeRoute('/memberInfoTemplate')">编辑模板</el-button>
              </el-form-item>
            </el-form>
            <div class="phone-container">
              <div class="phone-view">
                <div class="phone-show-content">
                  <ul class="phone-list-bottom" id="showPhoneView">
                    <template v-for="(item,index) in memberTemp">
                      <li class="phone-list-item" v-show="item.systemFieldId == 'k103' && item.fieldContent.birthType" :key="index">
                        <div class="opend-card-item sex" style="height:71px">
                          <div class="item-title" style="line-height:70px">{{item.fieldName}}</div>
                          <div style="float:left;"> 
                            <el-radio-group v-model="item.radio">
                              <el-radio :label="0">农历</el-radio>
                              <el-radio :label="1">阳历</el-radio>
                            </el-radio-group>
                            <p style="line-height: 30px;margin-top: -5px;">{{item.fieldDescription}}</p>
                          </div>
                        </div>
                      </li>
                      <li class="phone-list-item" v-show="!(item.systemFieldId == -1 && item.fieldType == 5) && !(item.systemFieldId == 'k103' && item.fieldContent.birthType)" :key="index">
                        <template v-if="item.fieldType != 2">
                          <div class="opend-card-item" v-if="!(item.systemFieldId == -1 && item.fieldType == 5)">
                            <div :class="['item-title',item.fieldName.length>6?'item-title-prewrap':'']">{{item.fieldName}}</div>
                            <span>{{item.fieldDescription}}</span>
                          </div>
                        </template>
                        <template v-if="item.fieldType == 2">
                          <div class="opend-card-item sex">
                            <div class="item-title">{{item.fieldName}}</div>
                            <template v-for="(child,ind) in item.fieldContent">
                               <el-radio v-model="firstRadio" :label="ind" :key="ind">{{child.name}}</el-radio>
                            </template>
                          </div>
                        </template>
                      </li>
                      <li v-if="item.systemFieldId == -1 && item.fieldType == 5" class="block" :key="index">
                        <template >
                          <div class="block-head">
                            <div class="opencard-item-title">{{item.fieldName}}</div>
                          </div>
                          <div class="opend-card-item" v-for="(child,childIdx) in item.sonList" :key="childIdx">
                            <div :class="['item-title',child.fieldName.length>6?'item-title-prewrap':'']">{{child.fieldName}}</div>
                            <span>{{child.fieldDescription}}</span>
                          </div>
                        </template>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="height-24"></div>
          <!-- 开卡门店配置 -->
          <div class="title-group">
            <h3 class="open-card-title">开卡门店配置</h3>
            <p class="open-card-descript">设置会员的开卡门店规则</p>
          </div>
          <div class="cell-body">
            <el-form :model="openCardForm" ref="openCardForm" label-width="130px" class="demo-ruleForm">
              <el-form-item label="微信会员" prop="">
                  <el-radio v-model="openCardForm.wxOpenCardStoreSet" label="0" @change="changeRadio($event,6)">首次关注门店</el-radio>
                  <el-radio v-model="openCardForm.wxOpenCardStoreSet" label="1" @change="changeRadio($event,6)">开卡前最后关联门店</el-radio>
              </el-form-item>
              <el-form-item label="POS转微信会员" prop="">
                  <el-radio v-model="openCardForm.posOpenCardStoreSet" label="0" @change="changeRadio($event,7)">ERP中的开卡门店</el-radio>
              </el-form-item>
            </el-form>
          </div>
          <div class="height-24"></div>
          <!-- 第三方电商账号选择开关 -->
          <!-- <div class="title-group">
            <h3 class="open-card-title">第三方电商账号选择开关</h3>
            <p class="open-card-descript">设置会员开卡流程中选择第三方平台账号</p>
          </div>
          <div class="cell-body">
            <el-form :model="thirdForm" ref="thirdForm" label-width="130px" class="demo-ruleForm">
              <el-form-item label="开卡选择第三方电商账号" prop="">
                  <el-switch
                    :disabled="contactBool"
                    v-model="thirdForm.switch"
                    @change="changeSwitch($event,1)">
                  </el-switch>
              </el-form-item>
            </el-form>
          </div>
          <div class="height-24"></div> -->
          <!-- 服务门店配置 -->
          <div class="title-group">
            <h3 class="open-card-title">服务门店配置</h3>
            <p class="open-card-descript">设置会员的服务门店规则</p>
          </div>
          <div class="cell-body">
            <el-form :model="mainStoreForm" ref="mainStoreForm" label-width="130px" class="demo-ruleForm">
              <el-form-item label="微信会员" prop="">
                <el-radio :disabled="contactBool && (mainStoreForm.wxMainStoreSet=='0'?false:true)" v-model="mainStoreForm.wxMainStoreSet" label="0" @change="changeRadio($event,8)">首次关注门店</el-radio>
                <el-radio :disabled="contactBool && (mainStoreForm.wxMainStoreSet=='1'?false:true)" v-model="mainStoreForm.wxMainStoreSet" label="1" @change="changeRadio($event,8)">开卡前最后关联门店</el-radio>
              </el-form-item>
              <el-form-item label="POS转微信会员" prop="">
                <el-radio v-model="mainStoreForm.posMainStoreSet" label="0" @change="changeRadio($event,9)">ERP中的开卡门店</el-radio>
              </el-form-item>
              <el-form-item label="开卡选择服务门店" prop="">
                <el-switch
                  :disabled="contactBool"
                  v-model="mainStoreForm.openCardStoreEdit"
                  @change="changeSwitch($event,2)">
                </el-switch>
              </el-form-item>
              <el-form-item label="开卡选择专属导购" prop="">
                <el-switch
                  :disabled="contactBool"
                  v-model="mainStoreForm.openCardClerkEdit"
                    @change="changeSwitch($event,3)">
                </el-switch>
              </el-form-item>
              <el-form-item label="服务门店变更逻辑" prop="">
                <el-table
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="对象"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="rules"
                    label="变更服务门店规则">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="优先级"
                    width="150">
                    <template slot-scope="scope">
                      <i class="el-icon-back" style="transform:rotate(-90deg)"></i>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="typeValue"
                    label="是否开启"
                    width="150">
                    <template slot-scope="scope">
                      <el-switch v-model="scope.row.typeValue" :disabled="contactBool" @change="changeServiceSwitch(scope.row.typeValue)"></el-switch>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
          <div class="height-24"></div>
          <!-- 归属修改权限 -->
          <div class="title-group">
            <h3 class="open-card-title">归属修改权限</h3>
            <p class="open-card-descript">设置会员是否有权限对服务门店和专属导购进行修改</p>
          </div>
          <div class="cell-body">
            <el-form :model="belongAuthForm" ref="belongAuthForm" label-width="130px" class="demo-ruleForm">
              <el-form-item label="修改服务门店" prop="">
                  <el-switch
                    :disabled="contactBool"
                    v-model="belongAuthForm.storeEdit"
                    @change="changeSwitch($event,4)">
                  </el-switch>
              </el-form-item>
              <el-form-item label="修改次数限制" prop="" v-if="belongAuthForm.storeEdit==true" class="input-count-limit">
                  <el-radio :disabled="contactBool && (belongAuthForm.storeEditTimesType=='1'?false:true)" v-model="belongAuthForm.storeEditTimesType" label="1" @change="changeRadio($event,11,'store')">最多修改<el-input :disabled=" contactBool && (belongAuthForm.storeEditTimesType=='1'?false:true)" maxLength="6" v-model="belongAuthForm.storeEditTimes" @change="changeInput($event,13,'storeEditTimes')"></el-input><label>次</label></el-radio>
                  <el-radio :disabled="contactBool && (belongAuthForm.storeEditTimesType=='2'?false:true)" v-model="belongAuthForm.storeEditTimesType" label="2" @change="changeRadio($event,11,'store')">每月最多修改1次</el-radio>
                  <el-radio :disabled="contactBool && (belongAuthForm.storeEditTimesType=='3'?false:true)" v-model="belongAuthForm.storeEditTimesType" label="3" @change="changeRadio($event,11,'store')">每年最多修改1次</el-radio>
              </el-form-item>

              <el-form-item label="修改专属导购" prop="">
                  <el-switch
                    :disabled="contactBool"
                    v-model="belongAuthForm.clerkEdit"
                    @change="changeSwitch($event,5)">
                  </el-switch>
              </el-form-item>

              <el-form-item label="修改次数限制" prop="" v-if="belongAuthForm.clerkEdit==true" class="input-count-limit">
                  <el-radio :disabled="(contactBool && (belongAuthForm.clerkEditTimesType=='1'?false:true)) || belongAuthForm.storeEditTimesType==2||belongAuthForm.storeEditTimesType==3? true:false" v-model="belongAuthForm.clerkEditTimesType"  label="1" @change="changeRadio($event,12)">最多修改<el-input :disabled="contactBool && (belongAuthForm.clerkEditTimesType=='1'?false:true)" maxLength="6" v-model="belongAuthForm.clerkEditTimes" @change="changeInput($event,14,'clerkEditTimes')"></el-input><label>次</label></el-radio>
                  <el-radio :disabled="contactBool && (belongAuthForm.clerkEditTimesType=='2'?false:true)" v-model="belongAuthForm.clerkEditTimesType" label="2" @change="changeRadio($event,12)">每月最多修改1次 </el-radio>
                  <el-radio :disabled="(contactBool && (belongAuthForm.clerkEditTimesType=='3'?false:true) )|| belongAuthForm.storeEditTimesType==2? true:false" v-model="belongAuthForm.clerkEditTimesType" label="3" @change="changeRadio($event,12)">每年最多修改1次</el-radio>
              </el-form-item>
            </el-form>
          </div>
          <div class="height-24"></div>
          <!-- 商户会员等级  无  -->
          <div class="title-group" style="display: none">
            <h3 class="open-card-title">商户会员等级</h3>
            <p class="open-card-descript">商户具体会员等级，请点击对应商户行的编辑按钮查看</p>
          </div>
          <div class="cell-body" style="display: none">
            <el-table
              :data="merchantTableData"
              style="width: 100%">
              <el-table-column
                prop="enterpriseName"
                label="商户名称"
                >
              </el-table-column>
              <el-table-column
                prop="gradeCount"
                label="等级数量">
              </el-table-column>
              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <!-- <el-button
                    @click="editMerchant(scope.$index,scope.row,merchantTableData)"
                    type="text"
                    size="small">
                    编辑
                  </el-button> -->
                  <router-link :to="{path:'/memberGrade',query:{enterpriseId: scope.row.enterpriseId}}" class="edit-btn el-button--text">编辑</router-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 会员等级设置 更改 -->
          <div class="title-group">
            <h3 class="open-card-title">会员等级设置</h3>
            <p class="open-card-descript">会员等级根据从低到高的顺序，自向上而下进行排序</p>
          </div>
          <div class="cell-body" style="padding-bottom: 24px">
            <el-form :model="cliqueForm" ref="cliqueForm" label-width="120px" class="demo-ruleForm" style="display: none">
              <el-form-item label="升级模式" prop="">
                <el-radio v-model="cliqueForm.gradeUpModel" label="0" @change="changeCliqueUp($event)">单商户独立计算</el-radio>
                <el-radio v-model="cliqueForm.gradeUpModel" label="1" @change="changeCliqueUp($event)">跨商户联合计算</el-radio>
              </el-form-item>
              <el-form-item label="关联升级" prop="" v-if="cliqueForm.gradeUpModel==0">
                 <el-switch
                    v-model="cliqueForm.gradeUpModelSyncchange"
                    active-text="启用"
                    inactive-text="停用"
                    @change="changeSwitch($event,10)">
                  </el-switch>
              </el-form-item>
            </el-form>
            <div class="add-level"><el-button :disabled="contactBool" type="primary" @click="changeRoute('/addGroupGrade')">新增等级</el-button></div>
            <el-table
              class="table-no-line-wrap"
              :data="cliqueTableData"
              style="width: 100%">
              <el-table-column
                prop=""
                label="卡面预览"
                width="260"
                >
                <template slot-scope="scope">
                  <div class="card-cell" :style="{background: scope.row.cardColor}">
                    <img :src="logoImg"/>
                    <span :style="{color: scope.row.cardFontColor}">{{scope.row.gradeName}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="gradeCode"
                label="等级编码">
              </el-table-column>
              <el-table-column
                prop=""
                label="等级类型">
                <template slot-scope="scope">
                  {{scope.row.gradeType == 1? '常规卡': '特殊卡'}}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="移动">
                <template slot-scope="scope">
                  <div class="move-icon">
                    <i :class="['iconfont','sort-icon-all', 'icon-yd-icon-upload2', scope.$index==0? 'disable': '']" @click="toPre(scope.$index,scope.row,cliqueTableData)"></i>
                    <i :class="['sort-icon-all', 'sort-icon-down','iconfont','icon-yd-icon-upload2', scope.$index == cliqueTableData.length-1?'disable':'']" class="icon-font-down" @click="toNext(scope.$index,scope.row,cliqueTableData)"></i>
                    <i :class="['sort-icon-all', 'el-icon-upload2', 'sort-icon', scope.$index==0? 'disable':'']" @click="toUp(scope.$index,scope.row,cliqueTableData)"></i>
                    <i :class="['sort-icon-all', 'el-icon-download','sort-icon', scope.$index == cliqueTableData.length-1?'disable':'']" @click="toBottom(scope.$index,scope.row,cliqueTableData)"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <el-row v-if="!contactBool">
                    <el-button
                      @click="editCliqueLevel(scope.$index,scope.row,cliqueTableData)"
                      type="text">
                      编辑
                    </el-button>
                    <delete-tip @confirm="delCliqueLevel(scope.$index,scope.row,cliqueTableData)" tips="确认删除吗?">
                      <el-button v-show="cliqueTableData.length>1" type="text">删除</el-button>
                    </delete-tip>
                  </el-row>
                  <el-button
                    v-else
                    @click="editCliqueLevel(scope.$index,scope.row,cliqueTableData)"
                    type="text">
                    查看
                  </el-button>
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
          </div>
          <!-- end -->
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import topNav from 'components/nav/nav'
// import cardCate from 'components/memberShip/card-cate' // 开卡策略
import tinymceEdit from 'components/memberShip/tinymce-edit' // 开卡策略

import { getRequest, postRequest, postForm } from '@/api/api';
export default {
  name: "memberCardSet",
  data() {
    return {
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
          path: ''
        }
      ],
      projectName: 'gic-web', //当前项目名

      firstRadio: 0,

      // 信息对象
      cardCateInfo: {},

      // 会员模板
      memberTemp: [],

      // 开卡门店配置
      openCardForm: {
        wxOpenCardStoreSet: '0',
        posOpenCardStoreSet: '0'
      },
      // 第三方
      thirdForm: {
        switch: true
      },
      // 主门店
      mainStoreForm: {
        wxMainStoreSet: '0',
        posMainStoreSet: '0',
        openCardStoreEdit: true,
        openCardClerkEdit: true,
        typeValue:false
      },

      // 归属修改权限
      belongAuthForm: {
        storeEdit: true,
        storeEditTimesType: '1',
        storeEditTimes: '',
        clerkEdit: true,
        clerkEditTimesType: '1',
        clerkEditTimes: '',

      },

      // 商户会员等级
      merchantTableData:[],

      // 集团会员等级
      cliqueForm: {
        gradeUpModelSyncchange: false,  // 单商户独立计算下是否关联升级 1是 0否 (集团)
        gradeUpModel: '0',  // 等级升级模式 0单商户独立计算 1跨商户联合计算 (集团参数)
      },
      cliqueTableData:[],
      logoImg: "",   //企业logo

      contactBool:false,  //  是否关联集团

      suffixKey:'', // 后缀的值
      useSuffix:false,

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
          // console.log(blobInfo)
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
              // console.log('Editor was clicked');
            });
        }
      },

      errorBool1:false,
      errorBool2:false,
      errorBool3:false,
      errorMsg1:'请输入前缀',
      errorMsg2:'请输入后缀',
      errorMsg3:'请输入起始号段',

      cardBeginBool:true,
      cardBeginStr:'',
      // 服务门店变更
      tableData: [{
        name: '所有认证会员',
        rules:'会员历史消费次数为0时，取在GIC系统上线后的首次消费门店为服务门店',
        typeValue:false
      }]
    }
  },
  created() {
    // this.selectReplayStyle()
  },
  mounted() {
    var that = this;
    that.getMemberSetInfo()
    that.getTempInfo()

    that.getContact();  // 是否关联集团
  },
  methods: {
    // 服务门店变更逻辑
    changeServiceSwitch(val){
      var typeValue = val?1:0;
      var para = {
        type: 16,
        typeValue: typeValue
      }
      postRequest('/api-admin/modify-member-card-setting-flag',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          showMsg.showmsg('设置成功','success')
          return;
        }
        errMsg.errorMsg(resData)
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },

    // 是否关联集团
    getContact(){   
      var para = {};
      getRequest('/api-auth/is-relevance-clique',para)
      .then((res) => {
        var resData = res.data
        // console.log(resData);
        if (resData.errorCode == 0) {
          this.contactBool = resData.result;
        }else{
          errMsg.errorMsg(resData)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 开卡门店配置 等 radio change
    changeRadio(e,tag,flag) {
      var that = this
      console.log(e,tag)

      that.saveSet(tag,e)

      // 判断归属门店修改次数
      if (!!flag && flag=='store') {
        if (e == 2) {
          that.belongAuthForm.clerkEditTimesType = '2'
          that.saveSet('12',2)
        }
        if (e == 3) {
          that.belongAuthForm.clerkEditTimesType = '3'
          that.saveSet('12',3)
        }
      }
    },

    saveSet(type,value) {
      var that = this
      var para = {
        type: type,
        typeValue: value
      }
      postRequest('/api-admin/modify-member-card-setting-flag',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          showMsg.showmsg('设置成功','success')
          if (type==2 && value == '0') {
            that.mainStoreForm.openCardClerkEdit = false
          }
          return;
        }

        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 第三方等 switch change
    changeSwitch(e,num) {
      var that = this

      // 开卡
      if (num == 2 && !e) {
        that.saveSet(2,0)
        that.saveSet(3,0)

        return;
      }
      if (num == 3 && e && !that.mainStoreForm.openCardStoreEdit) {
        showMsg.showmsg('开卡选择服务门店停用时不允许修改','warning')
        that.mainStoreForm.openCardClerkEdit = false
        return;
      }

      // 修改服务门店
      if (num == 4 && e && !that.belongAuthForm.clerkEdit) {
         showMsg.showmsg('修改专属导购停用时不允许修改','warning')
         that.belongAuthForm.storeEdit = false
        return;
      }
      if (num == 4 && !e ) {
        that.belongAuthForm.storeEditTimesType = '1'
        that.changeRadio(1,11)
      }

      // 修改专属导购
      if (num == 5 && !e) {
        var v = e==true? 1:0
        that.saveSet(num,0)
        that.belongAuthForm.storeEdit = false
        that.saveSet(4,0)
        return;
      }
      var v = e==true? 1:0
      that.saveSet(num,v)
    },

    // input
    changeInput(e,num,tag) {
      var that = this
      e =  !!parseInt(String(e).replace(/[^\d]/g,''))? parseInt(String(e).replace(/[^\d]/g,'')): '0';
      that.belongAuthForm.storeEditTimes = !!parseInt(String(that.belongAuthForm.storeEditTimes).replace(/[^\d]/g,''))? parseInt(String(that.belongAuthForm.storeEditTimes).replace(/[^\d]/g,'')) : 0;
      that.belongAuthForm.clerkEditTimes = !!parseInt(String(that.belongAuthForm.clerkEditTimes).replace(/[^\d]/g,''))? parseInt(String(that.belongAuthForm.clerkEditTimes).replace(/[^\d]/g,'')) : 0;
      if (that.belongAuthForm.storeEditTimes > that.belongAuthForm.clerkEditTimes) {
        that.$message.error({
          duration: 1000,
          message: "修改服务门店次数必须小于修改专属导购次数"
        })
       return;
      }
      that.saveSet(num,e)
    },

    // 商户会员等级列表编辑
    editMerchant(index,row,obj) {
      var that = this
      console.log(index,row,obj)

      that.changeRoute('/memberGrade');

    },

    // 编辑集团
    editCliqueLevel(index,row,obj) {
      var that = this
      console.log(row)

      that.$router.push({
        path:'/editGroupGrade',
        query:{
          gradeId: row.gradeId
        }
      })

    },

    // 新增集团等级
    addLevel() {
      var that = this

    },
    // 删除
    delCliqueLevel(index, row,obj) {
      var that = this
      // console.log(index,row,obj)
      var para = {
        gradeId: row.gradeId,
        enterpriseId: '',
      }
      postRequest('/api-admin/delete-member-grade',para)
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
      });
      // that.$confirm('确认删除吗?', '提示', {
      //     //type: 'warning'
      //   }).then(() => {
          

      //   }).catch(() => {
      //     // console.log(error);
      //     // that.$message.error({
      //     //     duration: 1000,
      //     //     message: error.message
      //     //   })
      //   });
    },

    // 修改集团升级模式
    changeCliqueUp(e){
      var that = this
      var para = {
        gradeUpModel: e
      }
      postRequest('/api-admin/modify-clique-grade-up-model',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          showMsg.showmsg('设置成功','success')
          return;
        }

        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 置顶 先删除后追加首部
    toUp(index, row,obj) {
      var that = this
      if (index == 0) {return;}
      console.log(index, row,obj)
      var newTable = JSON.parse(JSON.stringify(that.cliqueTableData))

      newTable.splice(index,1)
      newTable.unshift(row)
      console.log(newTable)

      // 保存设置
      that.setSort(row.gradeId,10)
      that.cliqueTableData = newTable;
    },
    // 向上
    toPre(index, row,obj) {
      var that = this
      if (index == 0) {return;}
      console.log(index, row,obj)
      var newTable = JSON.parse(JSON.stringify(that.cliqueTableData))
      var temp = {}
      temp = newTable[index-1]
      newTable[index-1] = row
      newTable[index] = temp
      // 保存设置
      that.setSort(row.gradeId,20)
      that.cliqueTableData = newTable;

    },
    // 向下
    toNext(index, row,obj) {
      var that = this
      if (index == obj.length-1) {return;}
      console.log(index, row,obj)
      var newTable = JSON.parse(JSON.stringify(that.cliqueTableData))
      var temp = {}
      temp = newTable[index+1]
      newTable[index+1] = row
      newTable[index] = temp
      // 保存设置
      that.setSort(row.gradeId,30)
      that.cliqueTableData = newTable;
    },
    //置底 先删除后追加尾部
    toBottom(index, row,obj) {
      var that = this
      if (index == obj.length-1) {return;}
      console.log(index, row,obj)

      var newTable = JSON.parse(JSON.stringify(that.cliqueTableData))

      newTable.splice(index,1)
      newTable.push(row)
      // 保存设置
      that.setSort(row.gradeId,40)
      that.cliqueTableData = newTable;
    },

    // 等级排序
    setSort(gradeId,type,enterpriseId) {
      var para = {
        gradeId: gradeId,
        sortType: type,
        // enterpriseId: enterpriseId
      }

      postRequest('/api-admin/sort-member-grade',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {

          showMsg.showmsg('设置成功','success')
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 获取会员卡设置信息
    getMemberSetInfo() {
      var that = this;

      getRequest('/api-admin/get-enterprise-grade-info',{})
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          if(resData.result.memberSystem){
            var member = resData.result.memberSystem;
            // that.setCateInfo(member)
            that.cardCateInfo = that.setCateInfo(member)
            that.ruleForm = that.cardCateInfo;
            console.log(that.ruleForm)
            if(that.cardCateInfo.cardBegin=='null' || that.cardCateInfo.cardBegin==""){
              that.cardBeginBool = false;
              that.ruleForm.cardBegin = "";
            }else{
              that.cardBeginBool = true;
            }
          }else{
            if(that.ruleForm.cardBegin=='' || that.ruleForm.cardBegin==null){
              that.ruleForm.cardBegin = "";
              that.cardBeginBool = false;
            }
          }
          // 设置开卡策略信息
          if(resData.result.memberSystem){
            // var member = resData.result.memberSystem;
            this.ruleForm.suffixKey = member.suffixKey; // 后缀的值
            this.ruleForm.useSuffix = member.useSuffix==1?true:false;
            // that.setCateInfo(member)
            // that.cardCateInfo = that.setCateInfo(member)
            // 开卡门店配置
            that.openCardForm.wxOpenCardStoreSet = String(member.wxOpenCardStoreSet)
            that.openCardForm.posOpenCardStoreSet = String(member.posOpenCardStoreSet)
            // 第三方
            that.thirdForm.switch = member.ecommerceRelationFlag == 1? true:false
            // 主门店
            that.mainStoreForm.wxMainStoreSet = String(member.wxMainStoreSet)
            that.mainStoreForm.posMainStoreSet = String(member.posMainStoreSet)
            that.mainStoreForm.openCardStoreEdit = member.openCardStoreEdit == 1? true:false
            that.mainStoreForm.openCardClerkEdit = member.openCardClerkEdit == 1? true:false
            // 服务门店变更逻辑
            that.tableData[0].typeValue = member.storeChangeLogic==1?true:false
            //归属修改权限
            that.belongAuthForm.storeEdit = member.storeEdit==1? true:false
            that.belongAuthForm.clerkEdit = member.clerkEdit==1? true:false
            that.belongAuthForm.storeEditTimesType = String(member.storeEditTimesType)  //1自定义次数 2 每月修改1次 3每年修改1次
            that.belongAuthForm.storeEditTimes = member. storeEditTimes    //自定义次数
            that.belongAuthForm.clerkEditTimesType = String(member.clerkEditTimesType)  //1自定义次数 2 每月修改1次 3每年修改1次
            that.belongAuthForm.clerkEditTimes = member.clerkEditTimes  //自定义次数

            // 商户会员等级
            that.merchantTableData = resData.result.CountList

            // 集团会员卡设置
            that.cliqueForm.gradeUpModel = String(member.gradeUpModel)
            that.cliqueForm.gradeUpModelSyncchange = member.gradeUpModelSyncchange == 1? true:false
          }
          // 卡面
          if(resData.result.logoImg){
            that.logoImg = resData.result.logoImg
          }
          if(resData.result.List){
            that.cliqueTableData = resData.result.List
          }
          return;
        }
        that.$message.error({
          duration: 1000,
          message: resData.message
        })

      })
      .catch(function (error) {
        console.log(error);
      });
    },

    // 设置开卡策略
    setCateInfo(item) {
      var that = this
      item.cardCreateType = (item.cardCreateType==null || item.cardCreateType=='') ? '0' : String(item.cardCreateType)
      item.cardNoStatus = (item.cardNoStatus==null || item.cardNoStatus=='') ? '0' : String(item.cardNoStatus)
      item.cardNoTimeType = (item.cardNoTimeType==null || item.cardNoTimeType=='') ? '0' : String(item.cardNoTimeType)
      item.cardBegin = String(item.cardBegin)
      item.prefixKey = item.prefixKey==null?'':String(item.prefixKey)
      item.suffixKey = item.suffixKey==null?'':String(item.suffixKey)
      item.usePrefix = item.usePrefix ==1? true: false
      item.useSuffix = item.useSuffix ==1? true: false
      item.gradeDescribe = item.gradeDescribe
      item.memberSystemId = item.memberSystemId
      return item;
    },

    // // 获取模板信息
    getTempInfo() {
      var that = this
      var para = {}
      postRequest('/api-admin/get-card-field-template-detail',para)
      .then((res) => {
        // console.log( res.data)
        var resData = res.data
        if (resData.errorCode == 0) {
          var data = resData.result
          data.forEach(function(ele,index){
            if (ele.fieldType == 2) {
              ele.fieldContent = JSON.parse(ele.fieldContent.replace(/'/g, '"'))
            }
            // 生日 农历
            if(ele.systemFieldId=='k103'){
              ele.radio = '';
              ele.fieldContent = JSON.parse(ele.fieldContent);
              ele.fieldContent.birthType = ele.fieldContent.birthType==0?true:false;
            }
          })
          that.memberTemp = data
          return;
        }
        errMsg.errorMsg(resData)
      })
      .catch(function (error) {
        console.log(error);
      });
    },
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
      //console.log(formdata)
      postForm('/api-plug/upload-img', formdata).then(res => {
        success(res.data.result[0].qcloudImageUrl)
      }).catch(res => {
        //console.log(res)
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
    checkNum(){ // 只能首字母为4 不能全0
      if(this.ruleForm.cardBegin){
        var reg = /^0+$/g;
        if(reg.test(this.ruleForm.cardBegin)){
          this.errorMsg3 = '起始号段不能全为0';
          this.errorBool3 = true;
        }else{
          if(this.ruleForm.cardBegin.lastIndexOf('4')>0){  // 最后一个4的位置下标
            this.errorMsg3 = '起始号段只能首位为4，其余位置均不能为4';
            this.errorBool3 = true;
          }else{
            this.errorBool3 = false;
          }
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
              var reg = /^0+$/g;
              if(reg.test(data.cardBegin)){
                this.errorMsg3 = '起始号段不能全为0';
                this.errorBool3 = true;
              }else{
                if(data.cardBegin.lastIndexOf('4')>0){  // 最后一个4的位置下标
                  this.errorMsg3 = '起始号段只能首位为4，其余位置均不能为4';
                  this.errorBool3 = true;
                }else{
                  this.errorBool3 = false;
                }
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
              this.ruleForm.useSuffix = false;
              this.errorBool2 = false;
            }
          }else{
            if (data.useSuffix) {   // 选了后缀  却无值
              if(!data.suffixKey){
                data.useSuffix = false;
              }
            }
            if(this.ruleForm.useSuffix && this.errorBool2){ // 初始值选中了后缀 且报错
              data.useSuffix = false;
              data.suffixKey = this.ruleForm.suffixKey;
            }else if(!this.ruleForm.useSuffix && this.errorBool2){ // 初始值未选中后缀 且报错
              data.useSuffix = false;
              data.suffixKey = "";
            }
            this.errorBool2 = false;
          }

          if(this.errorBool1 || this.errorBool2 || this.errorBool3){

          }else{
            data.usePrefix = data.usePrefix == true? 1:0;
            data.useSuffix = data.useSuffix == true? 1:0;
            that.saveInfo(data)
          }
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
          // that.reload();    //  保存成功之后，调用依赖，从而刷新本页面

          if(!form.useSuffix){   // 选中后缀
            that.ruleForm.useSuffix = false;
          }
          showMsg.showmsg('保存成功','success');
          that.cardBeginBool = true;
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);
      });
    },
  },
  components: {
    topNav,
    tinymceEdit
    // cardCate
  }
}
</script>
<style lang="less" scoped>
.right-box{
  padding: 0;
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

  /* 模板 */
  .phone-container{
    margin-top:40px;
    padding-bottom: 24px;
  }
  .phone-view{
    background: url(../../../assets/iphone.png) no-repeat;
    background-size: 100%;
    width: 410px;
    height: 740px;
    margin: 0 20px;
    position: relative;
  }

  .phone-show-content{
    width: 330px;
    height: 537px;
    position:absolute;
    left:41px;
    top: 83px;
    overflow-y: auto;
  }

  .block {
    margin-bottom: 2px;
  }

  .block-head {
    width: 100%;
    background: #f5f5f8;
    padding: 0;
    height: 46px;

    .opencard-item-title {
      line-height: 46px;
      padding-left: 10px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  }

  .opend-card-item {
    height: 46px;
    line-height: 46px;
    background: #fff;
    border-bottom: 1px solid #e7e7eb;
    font-size: 14px;
    position: relative;

    &.sex::after {
      content: '';
      width: 100%;
      height: 100%;
      z-index: 2;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }

  .opend-card-group-title {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }

  .opend-card-item {
    height: 46px;
    line-height: 46px;
    background: #fff;
    border-bottom: 1px solid #e7e7eb;
  }

  .phone-list-item{
    // height: 44px;
    // line-height: 44px;
    background: #fff;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .item-title {
    width: 100px;
    float: left;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    &.item-title-prewrap {
      line-height: 15px;
      word-break: break-all;
      white-space: pre-wrap;
      padding-top: 9px;
    }
  }

  .el-icon-upload2 {
    font-size: 16px;
    cursor: pointer;
  }

  .el-icon-download {
    font-size: 16px;
    cursor: pointer;
  }
  .icon-font-down{
    display: inline-block;
    transform: rotateX(180deg);
  }

  i.icon-color {
    color: #606266;
  }
  i.disable {
    color: #e6e6e6;
    cursor: not-allowed;
  }

  .cell-body {
    padding: 24px 32px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    /deep/ .el-form {
      .el-form-item:nth-child(1) {
        /*margin-top: 30px;*/
      }

      .el-form-item:last-child {
        /*margin-bottom: 0;*/
      }
    }
  }

  .add-level {
    width: 100%;
    margin-bottom: 24px;
    text-align: right;
  }

  .card-cell {
    display: flex;
    width: 250px;
    padding: 10px;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      margin-left: 5px;
    }
  }

  .el-input {
    width: 60px;
    margin: 0 10px;
  }

  /* .el-form-item {
    /deep/.el-form-item__label {
      line-height: 1;
      padding-top: 13px;
    }
  } */

  .member-cell {
    background: #fff;
    padding: 0;
  }

  .title-group {
    position: relative;
    border-bottom: 1px solid #e7e7eb;
    padding: 20px 0 15px 32px;
  }
  .open-card-title{
    font-size: 16px;
    font-weight: 500;
    /*padding:5px 0;*/
  }
  .open-card-descript{
    font-size:13px;
    color:#828282;
    padding:5px 0;
  }
}
.move-icon i {
  cursor: pointer;
}
.right-box /deep/ .el-form-item .el-input__inner{
  padding-right: 12px;
}

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
  padding-right: 12px
}
/* 去掉表格的最后一条线 */
.table-no-line-wrap::before{
  height: 0
}
</style>
