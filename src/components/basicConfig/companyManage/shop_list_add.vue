<template>
	<div class="right-wrap">
    <topNav v-if="!editNavBool" :navpath="navpath"></topNav>
    <topNav v-else :navpath="navpathedit"></topNav>
    <div class="right-content">
      <div class="right-box" v-loading="loading">
        <div class="item-wrap">
          <div class="item-title">门店信息</div>
          <div class="item-info">
            <el-form ref="ruleForm" label-position="right" :rules="rules" :model="editForm" label-width="100px" class="form-wrap">
              <div class="input-wrap">
                <!-- <el-form-item label="关联商户" prop="name1" :class="{'is-error':errorBool1}" class="is-required">
                  <div class="edit-input">
                    <el-select @change="selectEnterprise" size="small" class="input-input" v-model="selectEnterpriseVal" multiple placeholder="请选择关联商户">
                      <el-option
                        v-for="item in enterprise"
                        :key="item.enterpriseId"
                        :label="item.brandName"
                        :value="item.enterpriseId">
                      </el-option>
                    </el-select>
                  </div>
                  <p v-show="errorBool1" class="el-form-item__error">请选择关联商户</p>
                </el-form-item> -->
                <!-- <el-form-item label="店招品牌" prop="signagesCode">
                  <div class="edit-input">
                    <el-select @change="selectSignage" class="input-input" v-model="editForm.signagesCode" placeholder="请选择店招品牌">
                      <el-option
                        v-for="item in options"
                        :key="item.signageCode"
                        :label="item.signageName"
                        :value="item.signageCode">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item> -->
                <el-form-item label="门店名称" prop="name2">
                  <div class="edit-input">
                    <el-input class="input-input" v-model="editForm.name2" placeholder="请输入门店名称" @keyup.native="toInput(editForm.name2,$event)"></el-input>
                    <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="门店代码" prop="shopCode">
                  <div class="edit-input"><!-- :disabled="editNavBool" -->
                    <el-input :class="{'input-code-disabled':editNavBool}" placeholder="请输入门店代码" :readonly="editNavBool"  class="input-input" v-model="editForm.shopCode" @keyup.native="toInput1(editForm.shopCode,$event)"></el-input>
                    <span class="tag-name-num">{{inputNum1}}/{{inputLength1}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="门店照片" prop="img" :class="{'is-error':errorBool2}" class="is-required">
                  <div class="upload-content">
                    <vue-gic-upload-image
                      :projectName="projectName"
                      :wxFlag="wxFlag"
                      :actionUrl="actionUrl"
                      :imageList="imageList"
                      :limitW="limitW"
                      :limitH="limitH"
                      :maxImageLength="maxlength"
                      @uploadOnSuccess="uploadOnSuccess"
                      @sortImg="sortImg"
                      @deleteImage="deleteImage">
                    </vue-gic-upload-image>
                    <p>上传规格为640*340px的jpg/jpeg/png图片，最多可以上传10张</p>
                  </div>
                  <p v-show="errorBool2" class="el-form-item__error">请选择门店照片</p>
                  <!-- <div class="upload-content">
                    <el-upload
                      style="height: 148px"
                      action="/api-plug/upload-img?requestProject=gic-web&wxFlag=1"
                      ref="uploadImg"
                      name="picFile"
                      list-type="picture-card"
                      :file-list="fileList2"
                      multiple
                      :limit="10"
                      :on-exceed="handleExceed"
                      :before-upload="beforeImgUpload"
                      :on-preview="handlePictureCardPreview"
                      :on-success="handleAvatarSuccess"
                      :on-remove="handleRemove">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <p>上传规格为640*340px的jpg/jpeg/png图片，最多可以上传10张</p>
                    <el-dialog :visible.sync="dialogVisible">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </div>
                  <p v-show="errorBool2" class="el-form-item__error">请选择门店照片</p> -->
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                  <div class="edit-input">
                    <el-input class="input-input" v-model="editForm.phone" @keyup.native="toInput2(editForm.phone,$event)"></el-input>
                    <span class="tag-name-num">{{inputNum2}}/{{inputLength2}}</span>
                  </div>
                </el-form-item>
                <el-form-item class="is-required" v-if="!storeId" label="营业时间" prop="time">
                  <div class="edit-input select-time-wrap">
                    <el-time-select
                      @change="selectOpenTime"
                      class="select-time"
                      placeholder="起始时间"
                      :clearable="false"
                      :editable="false"
                      v-model="editForm.newStartTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '24:00',
                        maxTime:editForm.newEndTime
                      }">
                    </el-time-select>
                    <span>至</span>
                    <el-time-select
                      @change="selectCloseTime"
                      class="select-time"
                      placeholder="结束时间"
                      :clearable="false"
                      :editable="false"
                      v-model="editForm.newEndTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '24:00',
                        minTime: editForm.newStartTime
                      }">
                    </el-time-select>
                  </div>
                </el-form-item>
                <el-form-item class="is-required" v-else label="营业时间" prop="time">
                  <div class="edit-input select-time-wrap">
                    <el-time-select
                      @change="selectOpenTime"
                      class="select-time"
                      placeholder="起始时间"
                      :clearable="false"
                      :editable="false"
                      v-model="editForm.openTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '24:00',
                        maxTime:editForm.closeTime
                      }">
                    </el-time-select>
                    <span>至</span>
                    <el-time-select
                      @change="selectCloseTime"
                      class="select-time"
                      placeholder="结束时间"
                      :clearable="false"
                      :editable="false"
                      v-model="editForm.closeTime"
                      :picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '24:00',
                        minTime: editForm.openTime
                      }">
                    </el-time-select>
                  </div>
                </el-form-item>
                <el-form-item label="门店类型" prop="style">
                  <el-radio-group v-model="editForm.style">
                    <el-radio label="0">自营</el-radio>
                    <el-radio label="1">联营</el-radio>
                    <el-radio label="2">代理</el-radio>
                    <el-radio label="3">代销</el-radio>
                    <el-radio label="4">托管</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="门店地址" prop="address" :class="{'is-error':errorBool4}" class="is-required">
                  <div class="select-region-content">
                    <vue-area-ab :areaOptions="areaOptions" @selected="selectedArea"></vue-area-ab>
                  </div>
                  <p v-show="errorBool4" class="el-form-item__error">请选择门店地址</p>
                </el-form-item>
                <el-form-item prop="detailAddress">
                  <div class="edit-input">
                    <el-input class="input-input" placeholder="请不要填写省市区信息" v-model="editForm.detailAddress" @keyup.native="toInput4(editForm.detailAddress,$event)"></el-input>
                    <span class="tag-name-num">{{inputNum4}}/{{inputLength4}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="GPS坐标" prop="gps">
                  <div class="edit-input">
                    <el-input class="input-input" v-model="editForm.gps"></el-input>
                  </div>
                  <div class="right-input-tip">
                    <span @click="otherLink" style="cursor:pointer" class="gps-tool">经纬度测量工具</span><span>纬度,经度</span>
                  </div>
                </el-form-item>
                <el-form-item label="门店面积" prop="area">
                  <div class="edit-input">
                    <el-input @change="formatInputChange($event,'area')" class="input-input" v-model="editForm.area"></el-input>
                    <!-- <el-input @blur="floatTime(editForm.area)" @keyup.native="numAndFloat" class="input-input" v-model="editForm.area"></el-input> -->
                  </div>
                  <div class="right-input-tip">
                    <span>平方米</span>
                  </div>
                </el-form-item>
                <el-form-item label="所属分组" prop="group" :class="{'is-error':errorBool3}" class="is-required">
                  <div class="edit-input">
                    <el-input disabled class="input-input" v-model="editForm.group"></el-input>
                  </div>
                  <div class="right-input-tip">
                    <span @click="selectGroup" class="gps-tool">重新选择</span>
                  </div>
                  <p v-show="errorBool3" class="el-form-item__error">请选择所属分组</p>
                </el-form-item>
                <!-- <el-form-item label="门店状态" prop="state">
                  <el-radio-group @change="changeStoreState" v-model="editForm.state">
                    <el-radio label="2">正常</el-radio>
                    <el-radio label="3">停业整顿</el-radio>
                    <el-radio label="-3">闭店</el-radio>
                  </el-radio-group>
                </el-form-item> -->
                <el-form-item label="附近门店显示" prop="open">
                  <el-switch v-model="editForm.open"></el-switch>
                </el-form-item>
              </div>
              <div class="height-24"></div>
              <div class="item-title">店长信息</div>
              <div class="input-wrap">
                <el-form-item label="店长姓名" prop="name">
                  <div class="edit-input">
                    <el-input class="input-input" v-model="editForm.name" @keyup.native="toInput5(editForm.name,$event)"></el-input>
                    <span class="tag-name-num">{{inputNum5}}/{{inputLength5}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="店长性别" prop="sex">
                  <el-radio-group v-model="editForm.sex">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="店长代码" prop="code">
                  <div class="edit-input">
                    <el-input :disabled="codeBool" class="input-input" v-model="editForm.code" @keyup.native="toInput6(editForm.code,$event)"></el-input>
                    <span class="tag-name-num">{{inputNum6}}/{{inputLength6}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                  <div class="edit-input">
                    <el-input class="input-input" v-model="editForm.mobile"></el-input>
                  </div>
                </el-form-item>
              </div>
              <div class="height-24"></div>
              <div class="item-title">经营信息</div>
              <div class="input-wrap">
                <el-form-item label="特色服务">
                  <div class="edit-input textarea-wrap">
                    <el-input type="textarea" v-model="editForm.ser" @keyup.native="textInput1(editForm.ser,$event)"></el-input>
                    <span class="text-num">{{textNum1}}/{{textLength1}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="人均消费">
                  <div class="edit-input">
                    <el-input @change="formatInputChange($event,'money')" class="input-input" v-model="editForm.money"></el-input>
                    <!-- <el-input @blur="floatTime(editForm.money)" class="input-input" v-model="editForm.money" @keyup.native="toInput7(editForm.money,$event)"></el-input> -->
                    <!-- <span class="tag-name-num">{{inputNum7}}/{{inputLength7}}</span> -->
                  </div>
                </el-form-item>
                <el-form-item label="推荐商品">
                  <div class="edit-input textarea-wrap">
                    <el-input type="textarea" v-model="editForm.goods" @keyup.native="textInput2(editForm.goods,$event)"></el-input>
                    <span class="text-num">{{textNum2}}/{{textLength2}}</span>
                  </div>
                </el-form-item>
                <el-form-item label="品牌介绍">
                  <div class="edit-input textarea-wrap">
                    <el-input type="textarea" v-model="editForm.desc" @keyup.native="textInput3(editForm.desc,$event)"></el-input>
                    <span class="text-num">{{textNum3}}/{{textLength3}}</span>
                  </div>
                </el-form-item>
                <!-- <el-form-item>
                  <el-row>
                    <el-button @click="saveBtn(1)" type="primary">保存</el-button>
                    <el-button @click="saveBtn(2)" type="primary">发布上线</el-button>
                  </el-row>
                </el-form-item> -->
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-fixed-wrap btn-fixed-two" :class="{'m-left':$store.state.show}">
      <el-row>
        <el-button @click="saveBtn(1,'ruleForm')" type="primary" size="small">保 存</el-button>
        <el-button @click="saveBtn(2,'ruleForm')" type="primary" size="small">发布上线</el-button>
      </el-row>
    </div>
    <!-- 设置所属分组 -->
    <el-dialog
      title="设置所属分组"
      :visible.sync="dialogVisibleGroup"
      width="600px">
      <div class="add-wrap">
        <el-tree
          class="filter-tree set-group"
          :data="data1"
          :highlight-current="true"
          :props="defaultProps"
          node-key="storeGroupId"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick2"
          ref="tree3">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupCancelBtn">取 消</el-button>
        <el-button type="primary" @click="dialogGroupSaveBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 成本主体 -->
    <div @click="hideSelectList">
      <el-dialog
        class="delete-store-wrap"
        title="选择成本主体"
        :visible.sync="dialogZhuti"
        width="500px" 
        >
        <div class="all-style-wrap">
          <div class="select-shop" @click.prevent.stop="showSelectList">
            <p class="select-search-shop">{{selectDataName}}</p>
          </div>
          <transition name="slide-fade">
            <div class="select-shop-url-wrap search-shop-wrap" v-show="showSearchList" >
              <div class="search-shop-input" @click.stop="">
                <el-input @keyup.native="value => toInputSearch(value, searchValueList)" class="input-name" prefix-icon="el-icon-search" v-model="searchValueList" placeholder="输入搜索内容" ></el-input>
              </div>
              <div class="search-shop-list">
                <ul v-if="selectList.length>0">
                  <li @click.prevent.stop="selectShopSuccess(list,index)" v-for="(list,index) in selectList" :key="index"><span>{{list.storeName}}</span></li>
                </ul>
                <p v-else class="no-data">无搜索内容</p>
                <p class="search-list-tip">最多显示5条数据</p>
              </div>
            </div>
          </transition>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelZhutiBtn">取 消</el-button>
          <el-button type="primary" @click="sureZhutiBtn">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 门店代码在回收站中是否存在 -->
    <el-dialog
      title="提示"
      :visible.sync="isStoreCode"
      width="500px" >
      <div>该门店代码已存在回收站中，请问是否从回收站恢复该门店代码？（门店资料信息以当前新增信息为准）</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelStoreCode">取 消</el-button>
        <el-button type="primary" @click="sureStoreCode">确 定</el-button>
      </div>
    </el-dialog>
    <vue-gic-footer></vue-gic-footer>
    <!-- <div class="footer">
      <vue-gic-footer></vue-gic-footer>
    </div> -->
	</div>
</template>

<script>
	import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import {isvalidPhone,isvalidGPS} from '../../../common/js/validate'
  import { _debounce } from '../../../common/js/public';
	let qs = require('qs')
  var validPhone=(rule, value,callback)=>{    //定义一个全局的变量  手机号验证
    if (!value){
      callback(new Error('请输入手机号码'))
    }else if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  }
  var validGPS=(rule, value,callback)=>{    //定义一个全局的变量  GPS
    if (!value){
      callback(new Error('请输入GPS坐标'))
    }else if (!isvalidGPS(value)){
      callback(new Error('请输入正确的经纬度（例如30.132504,120.34617）'))
    }else {
      callback()
    }
  }
  export default {
    name: "shop_list_add",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '企业资料',
            path: ''
          },
          {
            name: '门店管理',
            path: ''
          },
          {
            name: '门店列表',
            path: '/shop_list'
          },
          {
            name: '新增门店',
            path: ''
          }
        ],
        navpathedit: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '企业资料',
            path: '/merchant_info'
          },
          {
            name: '门店列表',
            path: '/shop_list'
          },
          {
            name: '编辑门店',
            path: ''
          }
        ],
        editNavBool:false,
        fileList2:[],   // 门店照片列表
        fileList1:[],   // 编辑时获得的图片列表
        deleteAllImageFiledCode:'',  // 被删除的图片的总code
        deleteImageFiledCode:'',  // 被删除的图片的code
        editForm:{
          name:'',
          name1:'',
          name1Id:'',
          signages:'',
          signagesCode:'',
          name2:'',
          shopCode:'',
          phone:'',
          time:'',
          newStartTime: '', // 新增时的营业时间
          newEndTime: '',
          openTime:'',  // 编辑时的营业时间
          closeTime:'', 
          style:'0',
          detailAddress:'',
          gps:'',
          area:'',
          groupId:'',
          group:'',
          state:'2',
          open:true,
          openString:'',
          sex:'1',
          code:'',
          money:'',
          goods:'',
          desc:'',
          mobile:'',
          ser:''
        },
        rules: {
          // name1:[
          //   { required: true, message: '请选择关联商户', trigger: 'hh' }
          // ],
          signagesCode:[
            { required: true, message: '请选择店招品牌', trigger: 'change' }
          ],
          name2: [
            { required: true, message: '请输入门店名称', trigger: 'blur' }
          ],
          shopCode: [
            { required: true, message: '请输入门店代码', trigger: 'blur' }
          ],
          // img: [
          //   { required: true, message: '请上传图片', trigger: 'hh' }
          // ],
          // phone: [
          //   { required: true, message: '请输入联系电话', trigger: 'blur' }
          // ],
          // address: [
          //   { required: true, message: '请选择门店地址', trigger: 'hh' }
          // ],
          detailAddress:[
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          gps: [
            { required: true, trigger: 'blur',validator:validGPS } 
          ],
          // group: [
          //   { required: true, message: '请选择所属分组', trigger: 'hh' }
          // ],
          name: [
            { required: true, message: '请输入店长姓名', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入店长代码', trigger: 'blur' }
          ],
          mobile: [
            { required: true, trigger: 'blur', validator: validPhone }
          ],
        },
        enterprise:[],  // 关联商户
        selectEnterpriseVal:[],  // 多选选中的关联商户
        options:[],   // 店招
        inputNum: 0, // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 20, // 限制最大字数
        inputNum1: 0, 
        inputLength1: 20,
        inputNum2: 0, 
        inputLength2: 50,
        inputNum3: 0, 
        inputLength3: 30,
        inputNum4: 0, 
        inputLength4: 50,
        inputNum5: 0, 
        inputLength5: 10,
        inputNum6: 0, 
        inputLength6: 20,
        inputNum7: 0, 
        inputLength7: 10,
        textNum1: 0, 
        textLength1: 100,
        textNum2: 0, 
        textLength2: 100,
        textNum3: 0, 
        textLength3: 200,

        areaOptions: {    // 默认的省市县传值
          provinceName: '',
          provinceId: '',
          cityName: '',
          cityId: '',
          countryName: '',
          countyId: '',
        },
        areaId:'',  // 是否选择省市区的标识
        country:'', // 改变之后的标识
        areaOptionsNew:{},
        dialogImageUrl: '',   // 上传图片
        dialogVisible: false,

        storeId:'', // 门店id
        longitude:'', // 经度
        latitude:'', // 纬度
        memberId:null,    // 成员id，保存时使用
        operationId:null,   // 保存时使用

        data1: [],  // 门店分组
        defaultProps: {
          children: 'children',
          label: 'storeGroupName'
        },
        dialogVisibleGroup:false,
        dialogStoreGroupId:'',    // 弹框中选中的分组id
        dialogStoreGroupName:'',

        dialogZhuti:false,   // 门店主体
        dialogZhutiType:'', // 'delete' 闭店 删除时； 'edit' 编辑
        showSearchList:false,
        deleteStoreSucc:false,
        searchValueList:'',  // 部分门店的下拉框的搜索值
        selectList:[],
        selectDataName:'',
        selectDataId:'',
        integralFlag:'',  // 是否有门店主体

        loading:false,

        codeBool:false,
        storeStatus:'',

        type:2, // 2 返回门店分组 3 门店分区

        errorBool1:false,
        errorBool2:false,
        errorBool3:false,
        errorBool4:false,
        saveBtnBool:true,

        saveAgainBool:true,

        projectName: 'gic-web', // 当前项目名(必传参数)
        wxFlag: '1', // '1': 表示需要返回微信图片地址(可选参数),插件内已默认 '1'
        imgRate: '', // 限制图片上传比例 如 '1:1' (可选参数),(比例和限制宽高是二选一的,如果都不传参数,表示不限制)
        limitW: 640, // 上传图片的限制宽度(数字)
        limitH: 340, // 上传图片的限制高度(数字)
        actionUrl: '/api-plug/upload-img', // 必选参数，上传的相对地址 String 类型,切勿硬编码写死地址
        maxlength: 10, // 图片数量 默认 5
        imageList: [], // 是否显示已上传文件列表

        isStoreCode:false,
        saveType:1,
    	}
    },
    activated() {
      this.init();
    },
    mounted(){
      this.init();
    },
    methods: {
      init() {
        window.onresize = () => {
          return (() => {
            this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
          })()
        },
        this.getUrlData();
        this.getSignagesData();  // 获得店招列表
        this.getContactShop();  // 获得关联商户和营业时间
        this.getShopGroup('get'); // 获得门店分组
      },
      getUrlData(){   // 获得路由参数
        Object.assign(this.$data, this.$options.data());
        // console.log(this)
        this.$nextTick(_ => {
          this.$refs.ruleForm.resetFields();
        })
        this.storeId = this.$route.query.id;
        this.storeStatus = this.$route.query.status;
        this.integralFlag = this.$route.query.integralFlag;
        this.type = this.$route.query.type;

        this.loading = true;
        
        if(this.storeId){    // 编辑
          this.editNavBool = true;
          this.navpathedit[2].path='/shop_list?type='+this.type;
          this.axios.post('/api-admin/store-detail',qs.stringify({
            requestProject:'gic-web',
            storeId:this.storeId
          })).then((res)=>{
            var data = res.data;
            // console.log(data);
            if(data.errorCode==0){
              this.loading = false;
              var result = data.result;
              this.editForm.name1Id = result.enterpriseIds;  // 关联商户的id
              this.selectEnterpriseVal = [];
              if(result.enterpriseIds){
                var name1Id = result.enterpriseIds.split(',');
                name1Id.forEach((item)=>{
                  this.selectEnterpriseVal.push(item);
                })
              }
              this.editForm.signages = result.signages;  // 店招的村储值
              if(result.signages){
                this.editForm.signagesCode = result.signages.split('_')[0];  // 店招的选择值 code
              }
              this.editForm.name2 = result.storeName;   // 门店名称
              this.editForm.shopCode = result.storeCode;  // 门店代码
              if(result.storePhotoList){
                this.fileList1 = [];
                this.fileList2 = [];
                this.imageList = [];
                result.storePhotoList.forEach((item)=>{   // 门店照片
                  var obj = {};
                  obj.storePhotoId = item.storePhotoId;
                  obj.imageFiledCode = item.imageFiledCode;
                  obj.imageUrl = item.imageUrl;
                  obj.qcloudImageUrl = item.qcloudImageUrl;
                  obj.url = item.qcloudImageUrl;
                  this.fileList2.push(obj);
                  this.fileList1.push(obj);

                  this.imageList.push(obj)
                })
              }
              this.editForm.phone = result.conactsPhone;  // 联系电话
              this.editForm.style = result.storeType.toString();  // 门店类型
              this.editForm.detailAddress = result.storeAddress;  // 详细地址
              this.editForm.gps = result.latitude + ',' + result.longitude; // GPS坐标
              this.editForm.area = result.storeArea==null || result.storeArea==-1?'':result.storeArea;  // 门店面积
              this.editForm.group = result.storeGroupName;  // 所属分组名称
              this.editForm.groupId = result.storeGroupId;  // 所属分组id
              this.editForm.state = result.status.toString();  // 门店状态
              this.editForm.open = result.isShowNearbyStore == '1'?true:false;  // 附近门店显示
              this.editForm.openString = result.isShowNearbyStore;
              if(result.openTime&&result.closeTime){
                var num1= result.openTime.replace(/[^0-9]/ig,"");
                var num2= result.closeTime.replace(/[^0-9]/ig,"");
                var startTime = '';
                var endTime = '';
                if(num1.length==3){
                  startTime = '0'+num1.substring(0,1) +':'+ num1.substring(1,3);
                }else if(num1.length==4){
                  startTime = num1.substring(0,2) +':'+ num1.substring(2,4);
                }
                if(num2.length==3){
                  endTime = '0'+num2.substring(0,1) +':'+ num2.substring(1,3);
                }else if(num2.length==4){
                  endTime = num2.substring(0,2) +':'+ num2.substring(2,4);
                }
                this.editForm.openTime = startTime; 
                this.editForm.closeTime = endTime; 
              }else{  // 若没有则取新增时的时间 
                this.editForm.openTime = this.editForm.newStartTime; 
                this.editForm.closeTime = this.editForm.newEndTime; 
              }
              if(result.clerkDTO){
                this.editForm.name = result.clerkDTO.clerkName; // 店长姓名
                this.memberId = result.clerkDTO.clerkId;  // 成员id
                this.editForm.sex = result.clerkDTO.clerkGender.toString(); // 店长性别
                this.editForm.code = result.clerkDTO.clerkCode; // 店长代码
                this.editForm.mobile = result.clerkDTO.phoneNumber; // 手机号码
                if(this.storeStatus==2){
                  if(this.editForm.code){
                    this.codeBool = true;
                    this.inputNum6 = strLength.getZhLen(this.editForm.code);
                  }else{
                    this.codeBool = false;
                  }
                }
                this.inputNum5 = strLength.getZhLen(this.editForm.name);
              }
              if(result.storeOperationDTO){
                this.editForm.ser = result.storeOperationDTO.specialService;  // 特色服务
                this.editForm.money = result.storeOperationDTO.personCost==null || result.storeOperationDTO.personCost==-1?'':result.storeOperationDTO.personCost;  // 人均消费
                this.editForm.goods = result.storeOperationDTO.recommondGoods;  // 推荐商品
                this.editForm.desc = result.storeOperationDTO.brandRemark;  // 品牌介绍
                this.operationId = result.storeOperationDTO.operationId
              }
              this.country = result.areaId;
              this.areaId = result.areaId;
              this.areaOptionsNew.provinceName = result.provinceName;    // 默认的省市区传值
              this.areaOptionsNew.provinceId = result.provinceId;
              this.areaOptionsNew.cityName = result.cityName;
              this.areaOptionsNew.cityId = result.cityId;
              this.areaOptionsNew.countryName = result.countyName;
              this.areaOptionsNew.countyId = result.areaId;   // 
              
              var obj = JSON.stringify(this.areaOptionsNew);  // 深拷贝
              this.areaOptions = JSON.parse(obj);

              this.inputNum = strLength.getZhLen(this.editForm.name2);
              this.inputNum1 = strLength.getZhLen(this.editForm.shopCode);
              this.inputNum2 = strLength.getZhLen(this.editForm.phone);
              this.inputNum4 = strLength.getZhLen(this.editForm.detailAddress);
              
              if(this.editForm.money){
                this.inputNum7 = strLength.getZhLen(this.editForm.money.toString());
              }
              if(this.editForm.ser){
                this.textNum1 = strLength.getZhLen(this.editForm.ser);
              }
              if(this.editForm.goods){
                this.textNum2 = strLength.getZhLen(this.editForm.goods);
              }
              if(this.editForm.desc){
                this.textNum3 = strLength.getZhLen(this.editForm.desc);
              }
            }else{
              this.$message.error(data.message)
            }
          })
        }else{    // 新增
          this.navpath[2].path='/shop_list?type='+this.type;
          this.editNavBool = false;
          this.loading = false;
          this.storeId = '';
        }
      },
      getContactShop(){   // 获得集团下的所有的关联商户和营业模板时间时间（新建的时候需要）
        this.axios.post('/api-admin/list-enterprise',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          //console.log(data);
          if(data.errorCode==0){
            var result = data.result;
            var num1= result.startTime.replace(/[^0-9]/ig,"");
            var num2= result.endTime.replace(/[^0-9]/ig,"");
            var startTime = '';
            var endTime = '';
            if(num1.length==3){
              startTime = '0'+num1.substring(0,1) +':'+ num1.substring(1,3);
            }else if(num1.length==4){
              startTime = num1.substring(0,2) +':'+ num1.substring(2,4);
            }
            if(num2.length==3){
              endTime = '0'+num2.substring(0,1) +':'+ num2.substring(1,3);
            }else if(num2.length==4){
              endTime = num2.substring(0,2) +':'+ num2.substring(2,4);
            }
            this.editForm.newStartTime = startTime;   // 营业时间
            this.editForm.newEndTime = endTime;
            this.editForm.openTime = startTime;
            this.editForm.closeTime = endTime;
            this.enterprise = result.listEnterprise; // 所有的关联商户
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getSignagesData(){    // 获得店招列表
        this.axios.post('/api-admin/signages-list',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            this.options = data.result;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      // selectEnterprise(val){   // 选择关联的商户
      //   this.selectEnterpriseVal = val;
      //   if(this.selectEnterpriseVal.length>0){
      //     this.errorBool1 = false;
      //   }else{
      //     this.errorBool1 = true;
      //   }
      // },
      selectSignage(val){    // 选择店招
        let obj = {};
        obj = this.options.find((item)=>{
            return item.signageCode === val;//筛选出匹配数据
        });
        // console.log(obj.signageName); // 获得对应的label值
        this.editForm.signages = val + '_' + obj.signageName;
        console.log(this.editForm.signages);
      },
      toInput(value,e) {  // 名称输入时控制字符数量
        this.editForm.name2 = strLength.getByteVal(e.target.value,this.inputLength);
        this.inputNum = strLength.getZhLen(this.editForm.name2);
      },
      toInput1(value,e) { 
        this.editForm.shopCode = strLength.getByteVal(e.target.value,this.inputLength1);
        this.inputNum1 = strLength.getZhLen(this.editForm.shopCode);
      },
      toInput2(value,e) { 
        this.editForm.phone = strLength.getByteVal(e.target.value,this.inputLength2);
        this.inputNum2 = strLength.getZhLen(this.editForm.phone);
      },
      toInput3(value,e) { 
        this.editForm.time = strLength.getByteVal(e.target.value,this.inputLength3);
        this.inputNum3 = strLength.getZhLen(this.editForm.time);
      },
      toInput4(value,e) { 
        this.editForm.detailAddress = strLength.getByteVal(e.target.value,this.inputLength4);
        this.inputNum4 = strLength.getZhLen(this.editForm.detailAddress);
      },
      toInput5(value,e) { 
        this.editForm.name = strLength.getByteVal(e.target.value,this.inputLength5);
        this.inputNum5 = strLength.getZhLen(this.editForm.name);
      },
      toInput6(value,e) { 
        this.editForm.code = strLength.getByteVal(e.target.value,this.inputLength6);
        this.inputNum6 = strLength.getZhLen(this.editForm.code);
      },
      toInput7(value,e) { 
        this.editForm.money=this.editForm.money.replace(/[^0-9.]/g,'');
        this.editForm.money = strLength.getByteVal(e.target.value,this.inputLength7);
        this.inputNum7 = strLength.getZhLen(this.editForm.money);
      },
      textInput1(value,e){
        this.editForm.ser = strLength.getByteVal(e.target.value,this.textLength1);
        this.textNum1 = strLength.getZhLen(this.editForm.ser);
      },
      textInput2(value,e){
        this.editForm.goods = strLength.getByteVal(e.target.value,this.textLength2);
        this.textNum2 = strLength.getZhLen(this.editForm.goods);
      },
      textInput3(value,e){
        this.editForm.desc = strLength.getByteVal(e.target.value,this.textLength3);
        this.textNum3 = strLength.getZhLen(this.editForm.desc);
      },
      floatTime(val){  // 保留两位小数
        if(val){
          var reg = /^\d+(\.\d{2})?$/g;
          if(!reg.test(val)){
            this.$message.error('请输入整数或者最多两位小数的小数');
          }
        }
      },
      numAndFloat(){
        this.editForm.area=this.editForm.area.toString().replace(/[^0-9.]/g,'');
      },
      numAndFloat2(){
        this.editForm.money=this.editForm.money.toString().replace(/[^0-9.]/g,'');
      },
      beforeImgUpload(file){   // 上传之前
        const isImg = file.type === 'image/jpg' || 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImg) {
          this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF/SVG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        let _this = this;
        return isLt2M && isImg && new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(event) {
            let image = new Image();
            image.onload = function () {
              let width = this.width;
              let height = this.height;
              if(width !== 640 && height !== 340){
                _this.$message.error('只能上传规格为640*340px的图片');
                reject();
              }
              resolve();
            }
            image.src = event.target.result;
          }
          reader.readAsDataURL(file);
        })
      },
      handleAvatarSuccess(res,picFile){ // 上传成功
        var data = res;
        // console.log(res);
        if(data.errorCode==0){
          var obj = {};
          obj.storePhotoId = null;
          obj.imageFiledCode = data.result[0].imageFiledCode;
          obj.imageUrl = data.result[0].wxImg;
          obj.qcloudImageUrl = data.result[0].qcloudImageUrl;
          obj.url = data.result[0].qcloudImageUrl;
          this.fileList2.push(obj);
          this.$message({
            type:'success',
            message:'上传成功'
          })
          this.errorBool2 = false;
        } else {
          this.$message({
            type:'error',
            message:data.message
          })
        }
      },
      handleRemove(picFile, fileList) { // 移除图片
        this.fileList2 = fileList;
        if(this.fileList2.length>0){  //  门店照片
          this.errorBool2 = false;
        }else{
          this.errorBool2 = true;
        }
        var imageFiledCode = picFile.imageFiledCode;
        if(this.fileList1.length>0){
          this.fileList1.forEach((file)=>{
            if(file.imageFiledCode == imageFiledCode){
              this.deleteImageFiledCode += imageFiledCode + ',';
            }
          })
        }
      },
      handlePictureCardPreview(picFile) { // 放大图片
        this.dialogImageUrl = picFile.url;
        this.dialogVisible = true;
      },
      handleExceed(files, fileList) {   // 限制上传个数
        this.$message.warning('最多只能上传10个哦');
      },
      selectOpenTime(val){    // 选择营业开始时间
        this.editForm.openTime = val;
      },
      selectCloseTime(val){    // 选择营业结束时间
        this.editForm.closeTime = val;
      },
      selectedArea(val) {   // 选择省市区后返回的参数
        console.log(val);
        this.country = val.country;
        if(val.country){
          this.areaId = val.areaId;
          this.areaOptionsNew.provinceName = val.provinceName;    // 默认的省市区传值
          this.areaOptionsNew.provinceId = val.province;
          this.areaOptionsNew.cityName = val.cityName;
          this.areaOptionsNew.cityId = val.city;
          this.areaOptionsNew.countryName = val.countryName;
          this.areaOptionsNew.countyId = val.country;
          this.errorBool4 = false;
        }else{
          this.errorBool4 = true;
        }
      },
      getShopGroup(type){   // 获得门店分组
        this.axios.post('/api-admin/store-group-list',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.data1 = data.result;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      selectGroup(){    // 重新选择分组  弹框
        this.dialogVisibleGroup = true;
      },
      handleNodeClick2(data, node){    // 弹框中树形控件的点击
        console.log(data);
        this.editForm.group = data.storeGroupName;
        this.editForm.groupId = data.storeGroupId;
        this.dialogStoreGroupId = data.storeGroupId;
        var one = data.storeGroupName;
        this.dialogStoreGroupName = one;
        if(node.parent && !Array.isArray(node.parent.data)){
          var two = node.parent.data.storeGroupName;
          this.dialogStoreGroupName = two + '/' + this.dialogStoreGroupName;
          if(node.parent.parent && !Array.isArray(node.parent.parent.data) ){
            var three = node.parent.parent.data.storeGroupName;
            this.dialogStoreGroupName = three + '/' + this.dialogStoreGroupName;
            if(node.parent.parent.parent && !Array.isArray(node.parent.parent.parent.data) ){
              var four = node.parent.parent.parent.data.storeGroupName;
              this.dialogStoreGroupName = four + '/' + this.dialogStoreGroupName;
              if(node.parent.parent.parent.parent && !Array.isArray(node.parent.parent.parent.parent.data) ){
                var five = node.parent.parent.parent.parent.data.storeGroupName;
                this.dialogStoreGroupName = five + '/' + this.dialogStoreGroupName;
                if(node.parent.parent.parent.parent.parent && !Array.isArray(node.parent.parent.parent.parent.parent.data) ){
                  var six = node.parent.parent.parent.parent.parent.data.storeGroupName;
                  this.dialogStoreGroupName = six + '/' + this.dialogStoreGroupName;
                }
              }
            }
          }
        }
        // console.log(this.dialogStoreGroupName);
      },
      dialogGroupSaveBtn(){   // 批量设置分组的保存按钮
        console.log(this.editForm.group);
        if(this.dialogStoreGroupName == ''){
          this.errorBool3 = true;
          // this.$message.error('请选择所属分组');
          // return;
        }else{
          this.dialogVisibleGroup = false;
          this.editForm.group = this.dialogStoreGroupName;
          this.errorBool3 = false;
        }
      },
      otherLink(){
        window.open('http://m.gpsspg.com/maps.htm',"_blank")
      },
      dialogGroupCancelBtn(){   // 批量设置分组的取消按钮
        this.dialogVisibleGroup = false;
      },
      changeStoreState(val){  // 改变门店状态
        this.editForm.state = val;
        if(val=='-3' && this.integralFlag == 'gic'){  // gic时选择闭店  出现门店主体
          this.dialogZhuti = true;
        }
      },
      /* 成本主体 start */
      showSelectList(){
        this.showSearchList = !this.showSearchList;
      },
      hideSelectList(){
        this.showSearchList = false;
      },
      toInputSearch: _debounce(function(e, value) {
        this.getSearchData();
      }, 500),
      getSearchData(){    // 部分门店的查询
        this.axios.post('/api-plug/query-store-by-code-name',qs.stringify({
          requestProject:'gic-web',
          searchParam:this.searchValueList,
          selectedIds:'',
          flag:'1'
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.selectList = data.result;
          }
        })
      },
      selectShopSuccess(list,index){    // 成功选择门店主体 
        // console.log(list);
        this.selectDataName=list.storeName;
        this.selectDataId=list.storeId;
      },
      cancelZhutiBtn(){   // 门店主体的取消按钮
        this.dialogZhuti = false;
        this.selectDataName='';
        this.selectDataId='';
      },
      sureZhutiBtn(){   // 选择门店主体之后的确认按钮
        if(this.selectDataId==""){
          this.$message.error('请选择门店主体');
          return;
        }else{
          this.dialogZhuti = false;
        }
      },
      formatInputChange(e,type){
        var that = this;
        if(type=="area"){
          if(that.editForm.area){
            that.editForm.area = Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2);
          }
        }else if(type=="money"){
          if(that.editForm.money){
            that.editForm.money = Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2) == 'NaN'? '0.00': Number(String(e).replace(/[^\.\d]/g,'')).toFixed(2);
          }
        }
      },
      /* 成本主体 end */
      saveBtn(type,formName){
        this.saveType = type;
        // 关联商户
        var count = 0;
        // if(this.selectEnterpriseVal.length>0){  
        //   this.errorBool1 = false;
        //   this.saveBtnBool = true;
        //   count++;
        // }else{
        //   this.errorBool1 = true;
        //   this.saveBtnBool = false;
        // }
        // //  门店照片
        if(this.imageList.length>0){  
          this.errorBool2 = false;
          this.saveBtnBool = true;
          count++;
        }else{
          this.errorBool2 = true;
          this.saveBtnBool = false;
        }
        // 所属分组
        if(this.editForm.group){  
          this.errorBool3 = false;
          this.saveBtnBool = true;
          count++;
        }else{
          this.errorBool3 = true;
          this.saveBtnBool = false;
        }
        // 门店地址
        if(this.areaId && this.country){  
          this.errorBool4 = false;
          this.saveBtnBool = true;
          count++;
        }else{
          this.errorBool4 = true;
          this.saveBtnBool = false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(count==3){
              if(this.saveAgainBool){
                this.saveAgainBool = false;
                if(this.storeId){ // 编辑
                  this.saveData();
                }else{ // 新增
                  this.axios.post('/api-admin/storeid-recycle',qs.stringify({
                    requestProject:'gic-web',
                    storeCode:this.editForm.shopCode
                  })).then((res)=>{
                    var data = res.data;
                    if(data.errorCode==0){
                      if(data.result.storeId){ // 有值，重复
                        if(data.result.task==1){
                          this.$confirm('该门店代码已存在回收站中，请问是否从回收站恢复该门店代码？（门店资料信息以当前新增信息为准）', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                          }).then(() => {
                            this.storeId = data.result.storeId;
                            this.editForm.state = "7";
                            this.saveData();
                          }).catch(() => {
                            this.saveAgainBool = true;
                          });
                        }else{
                          this.$confirm('该门店代码已存在回收站中，且有待处理任务，是否前往回收站处理？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                          }).then(() => {
                            this.$router.push({
                              path:'/shop_list_recycle',
                              query:{
                                storeCode:this.editForm.shopCode
                              }
                            })
                          }).catch(() => {
                            this.saveAgainBool = true;  
                          });
                        }
                        // this.isStoreCode = true;
                      }else{ // 无值，直接保存
                        this.saveData();
                      }
                    }else{
                      this.$message.error(data.message)
                    }
                  })
                }
                
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelStoreCode(){
        this.isStoreCode = false;
        this.saveAgainBool = true;
      },
      sureStoreCode(){
        this.isStoreCode = false;
        this.saveData();
      },
      saveData(){ // 最后的保存
        if(this.fileList1.length>0){  
          this.deleteAllImageFiledCode = this.deleteImageFiledCode.substring(0,this.deleteImageFiledCode.length-1)
        }
        // GPS坐标
        var gps = this.editForm.gps.split(',');
        this.latitude = gps[0];
        this.longitude = gps[1];
        // 是否显示附近门店的数据处理
        this.editForm.openString = this.editForm.open==true?'1':'0';   
        // 门店面积
        this.editForm.area = this.editForm.area?this.editForm.area:-1
        // 人均消费
        this.editForm.money = this.editForm.money?this.editForm.money:"";
        this.axios.post('/api-admin/store-detail-edit',qs.stringify({
          requestProject:'gic-web',
          storeId:this.storeId,
          storeGroupId:this.editForm.groupId,
          storeGroupName:this.editForm.group,
          storeArea:parseFloat(this.editForm.area),
          enterpriseIds:this.selectEnterpriseVal.join(','),
          signages:this.editForm.signages,
          storeName:this.editForm.name2,
          storeCode:this.editForm.shopCode,
          conactsPhone:this.editForm.phone,
          openTime:this.editForm.openTime,
          closeTime:this.editForm.closeTime,
          storeAddress:this.editForm.detailAddress,
          longitude:this.longitude,
          latitude:this.latitude,
          completeStatus:1,
          storeType:parseInt(this.editForm.style),
          areaId:this.areaId,
          provinceName:this.areaOptionsNew.provinceName,
          cityName:this.areaOptionsNew.cityName,
          countyName:this.areaOptionsNew.countryName,
          status:parseInt(this.editForm.state),
          saveType:this.saveType,  
          isShowNearbyStore:this.editForm.openString,
          clerkId:this.memberId, 
          clerkGender:parseInt(this.editForm.sex),
          clerkName:this.editForm.name,
          clerkCode:this.editForm.code,
          phoneNumber:this.editForm.mobile,
          operationId:this.operationId,
          specialService:this.editForm.ser,
          personCost:this.editForm.money!=""?parseFloat(this.editForm.money):-1,
          recommondGoods:this.editForm.goods,
          brandRemark:this.editForm.desc,
          delPhotos:this.deleteAllImageFiledCode,
          photos:JSON.stringify(this.imageList),
          toStoreId:this.selectDataId
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          this.saveAgainBool = true;
          if(data.errorCode==0){
            if(parseInt(this.saveType)==2){
              this.$confirm('上线成功，是否立即前往配置积分结算归属？', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
              }).then(() => {
                this.$router.push('/integral_close')
              }).catch(() => {
                this.$router.push({
                  path:'/shop_list',
                  query:{
                    type:this.type
                  }
                });          
              });
            }else{
              this.$message.success('保存成功');
              this.$router.push({
                path:'/shop_list',
                query:{
                  type:this.type
                }
              });
            }
          }else if(data.errorCode=='110021'){
            this.$message(data.message);
            this.$router.push({
              path:'/shop_list',
              query:{
                type:this.type
              }
            });
          }else{
            this.$message.error(data.message)
          }
        })
      },
      
      /* 照片墙插件  --- start */
      // 上传成功 返回的图片对象 里面有图片 大小 类型 等相关信息
      uploadOnSuccess(picObj) {
        // 目前返回两个参数 {res:res,file:file}
        // console.log(picObj.file);
        picObj.file.url = picObj.res.result[0].qcloudImageUrl;
        var obj = {};
        var data = picObj.res;
        obj.storePhotoId = null;
        obj.imageFiledCode = data.result[0].imageFiledCode;
        obj.imageUrl = data.result[0].wxImg;
        obj.qcloudImageUrl = data.result[0].qcloudImageUrl;
        obj.url = data.result[0].qcloudImageUrl;
        this.imageList.push(obj);
        // console.log(this.imageList);
        if(this.imageList.length>0){
          this.errorBool2 = false;
        }else{
          this.errorBool2 = true;
        }
      },
      // 删除图片 返回图片列表的索引 你可以根据这个索引去找对应图片的id
      deleteImage(i) {
        if(this.fileList1.length>0){
          var imageFiledCode = this.imageList[i].imageFiledCode;
          this.fileList1.forEach((file)=>{
            if(file.imageFiledCode == imageFiledCode){
              this.deleteImageFiledCode += imageFiledCode + ',';
            }
          })
        }
        this.imageList.splice(i, 1);
        if(this.imageList.length>0){
          this.errorBool2 = false;
        }else{
          this.errorBool2 = true;
        }
      },
      // 排序图片
      sortImg(val) {
        this.imageList = val;
      },
      /* 照片墙插件  --- end */
    },
    components: {
    	topNav
    }       
  }
</script>

<style lang="less" scoped>
.right-wrap{
  position: relative;
  .btn-fixed-wrap{
    position: fixed;
    height: 57px;
    text-align: center;
    bottom: 0;
    /*left: 200px;*/
    width: 100%;
    right: 0;
    background: #fff;
    border-top: 1px solid #E4E7ED;
    padding-top: 12px;
    box-sizing: border-box;
  }
}
  .right-box{
    padding: 0;
    .item-wrap{
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      .item-title{
        font-weight: 500;
        color: #303133;
        font-size: 16px;
        padding-left: 32px;
        border-bottom: 1px solid #e8e8e8;
        border-radius: 2px 2px 0 0;
        zoom: 1;
        height: 56px;
        line-height: 56px;
      }
      .item-info{
        .input-wrap{
          padding: 24px 32px 1px;
        }
        .textarea-wrap{
          margin-bottom: 18px;
        }
        .edit-input{
          width: 494px;
          position: relative;
          display: inline-block;
          .input-input{
            width: 494px;
          }
          .tag-name-num{
            position: absolute;
            right: 10px;
            bottom: 1px;
            color: #c0c4cc;
            font-size: 12px;
            height: 30px;
            line-height: 32px;
            padding-left: 10px;
          }
          .text-num{
            position: absolute;
            right: 0;
            bottom: -31px;
            color: #c0c4cc;
            font-size: 12px;
          }
        }
        .select-time-wrap{
          .select-time{
            width: 231px;
          }
          span{
            padding: 0 5px;
          }
        }
        .right-input-tip{
          display: inline-block;
          color: #606266;
          span{
            padding: 0 10px 0 5px; 
          }
          .gps-tool{
            color: #1890ff;
            cursor: pointer;
          }
        }
        .upload-content{
          > p{
            height: 36px;
            line-height: 36px;
            font-size: 12px;
            color: #b8b8b8
          }
        }
      }
    }
  }
  .all-style-wrap{
    width: 100%;
    position: relative;
    .search-input{
      width:180px;
    }
    .select-shop{
      width: 100%;
      min-height: 34px;
      line-height: 34px;
      font-size: 14px;
      color: #606266;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      padding: 0 10px;
      box-sizing: border-box;
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
      width: 100%;
      max-height: 260px;
      position: absolute;
      right: 0;
      margin-top: 10px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      z-index: 3000;
      .shop-tree-wrap{
        padding: 0 10px;
        overflow: auto;
        height: 212px;
        border: 1px solid #e4e7ed;
        box-sizing: border-box;
        position: relative;
      }
      .select-group-btn{
        margin-top: 8px;
        text-align: center;
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
  .search-shop-wrap{
    .search-shop-input{
      padding: 10px;
    }
    .search-shop-list{
      .no-data{
        height: 34px;
        line-height: 34px;
        text-align: center;
      }
      ul{
        padding: 0 10px;
        li{
          font-size: 14px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #606266;
          height: 34px;
          line-height: 34px;
          box-sizing: border-box;
          cursor: pointer;
          &:hover{
            background-color: #f0f2f5;
          }
          &.on{
            color: #1890ff;
            background-color: #fff;
            font-weight:700;
            &:after{
              position: absolute;
              right: 20px;
              font-family: element-icons;
              content: "\E611";
              font-size: 12px;
              font-weight: 700;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          }
        }
      }
    }
    .search-list-tip{
      font-size: 12px;
      background-color: #f6f8f9;
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
  .filter-tree{
    font-size: 14px;
  }
  .filter-tree.active > .el-tree-node:first-child > .el-tree-node__content:first-child > .custom-tree-node:last-child{
    color: #1890ff;
  }
  .height-24{
    width: 100%;
    height: 24px;
    background: #f0f2f5;
  }
  .footer{
    padding-bottom: 60px !important;
  }
  /* 固定在底部的按钮 */
  /*.btn-fixed-two{
    padding-left: 200px;
    &.m-left{
      padding-left: 64px;
    }
  }*/
  /* 门店代码不能操作 */
  .input-code-disabled /deep/ input{
    cursor: not-allowed;
    background-color: #f0f2f5;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
  .input-code-disabled /deep/ input:focus{
    border-color: #e4e7ed;
  }

  .add-wrap .set-group{
    padding: 10px;
    height: 400px;
    overflow: auto;
    background: #f0f2f5;
  }
  .filter-tree /deep/ .el-tree-node.is-current>.el-tree-node__content {
    color: #1890ff;
    background: #eef1f8;
  }
  .select-region-content /deep/ .w-160{
    width: 158px;
  }
  .select-region-content /deep/ .w-160+.w-160{
    margin-left:6px;
  }
</style>
