<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <el-form ref="form" :rules="rules" :model="ruleForm" label-width="110px">
          <el-form-item label="商户名称" prop="shopName" class="shop-name">
            <el-input v-model="ruleForm.shopName" @keyup.native="shopInput(ruleForm.shopName,$event)"></el-input>
            <span class="shop-name-num">{{shopNum}}/{{shopLength}}</span>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName" class="shop-name">
            <el-input v-model="ruleForm.companyName" @keyup.native="companyInput(ruleForm.companyName,$event)"></el-input>
            <span class="shop-name-num">{{companyNum}}/{{companyLength}}</span>
          </el-form-item>
          <el-form-item label="所在地区" prop="region" class="select-region-wrap">
            <!-- <div class="select-region-content" :class="{'error':okRegion}"> -->
            <div class="select-region-content">
              <vue-area-ab :areaOptions="areaOptions" @selected="selectedArea"></vue-area-ab>
            </div>
            <!-- <div v-show="okRegion" class="el-form-item__error">请选择所在地区</div> -->
          </el-form-item>
          <el-form-item label="详细地址" prop="address" class="shop-name">
            <el-input v-model="ruleForm.address" @keyup.native="addressInput(ruleForm.address,$event)"></el-input>
            <span class="shop-name-num">{{addressNum}}/{{addressLength}}</span>
          </el-form-item>
          <el-form-item label="公司logo" prop="logo" class="shop-name">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl()"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="handleImgSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" @mouseover="showImage(imageUrl)">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="img-text-tip" style="color:#999">请上传规格为1:1的jpg/jpeg图片，且文件大小不超过1MB</p>
          </el-form-item>

          <el-form-item label="经营类目" prop="kind" class="shop-name">
            <el-select @change="selectOption1" v-model="ruleForm.kind1" placeholder="请选择" class="select-kind">
              <el-option
                v-for="item in option1"
                :key="item.storeCategoryDictId"
                :label="item.storeCategoryDictName"
                :value="item.storeCategoryDictId">
              </el-option>
            </el-select>
            <el-select v-show="option2.length>0" @change="selectOption2" v-model="ruleForm.kind2" placeholder="请选择" class="select-kind">
              <el-option
                v-for="item in option2"
                :key="item.storeCategoryDictId"
                :label="item.storeCategoryDictName"
                :value="item.storeCategoryDictId">
              </el-option>
            </el-select>
            <el-select v-show="option3.length>0" @change="selectOption3" v-model="ruleForm.kind3" placeholder="请选择" class="select-kind">
              <el-option
                v-for="item in option3"
                :key="item.storeCategoryDictId"
                :label="item.storeCategoryDictName"
                :value="item.storeCategoryDictId">
              </el-option>
            </el-select>
          </el-form-item>
  
          <!-- <el-form-item label="营业时间模板" prop="time" class="shop-name">
            <el-input v-model="ruleForm.time" @keyup.native="timeInput(ruleForm.time,$event)"></el-input>
            <span class="shop-name-num">{{timeNum}}/{{timeLength}}</span>
          </el-form-item> -->
          
          <el-form-item label="营业时间模板" prop="time">
            <div class="edit-input select-time-wrap">
              <el-time-select
                @change="selectOpenTime"
                class="select-time"
                placeholder="起始时间"
                :clearable="false"
                :editable="false"
                v-model="ruleForm.openTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  maxTime:ruleForm.closeTime
                }">
              </el-time-select>
              <span>至</span>
              <el-time-select
                @change="selectCloseTime"
                class="select-time"
                placeholder="结束时间"
                :clearable="false"
                :editable="false"
                v-model="ruleForm.closeTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  minTime: ruleForm.openTime
                }">
              </el-time-select>
            </div>
            <div v-show="timeError" class="error-tip">起始时间不能大于结束时间</div>
          </el-form-item>

          <el-form-item label="客服热线" prop="customerPhone" class="shop-name">
            <el-input v-model="ruleForm.customerPhone" @keyup.native="customerInput(ruleForm.customerPhone,$event)"></el-input>
            <span class="shop-name-num">{{customerNum}}/{{customerLength}}</span>
          </el-form-item>
          <el-form-item label="客户简介" prop="userDesc" class="shop-name desc-textarea">
            <el-input type="textarea" v-model="ruleForm.userDesc" @keyup.native="descInput(ruleForm.userDesc,$event)"></el-input>
              <span class="active-info-num">{{descNum}}/{{descLength}}</span>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contactName" class="shop-name">
            <el-input v-model="ruleForm.contactName" @keyup.native="timeInput(ruleForm.time,$event)"></el-input>
            <span class="shop-name-num">{{timeNum}}/{{timeLength}}</span>
          </el-form-item>
          <el-form-item label="手机号码" prop="contactPhone" class="shop-name">
            <el-input v-model="ruleForm.contactPhone"></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱" prop="contactEmail" class="shop-name">
            <el-input v-model="ruleForm.contactEmail"></el-input>
          </el-form-item>
          <el-form-item label="服务应用ID" prop="serID" class="shop-name input-code-disabled">
            <el-input v-model="ruleForm.serID" readonly></el-input>
          </el-form-item>
          <el-form-item label="服务应用密钥" prop="serKey" class="shop-name input-code-disabled">
            <el-input v-model="ruleForm.serKey" readonly></el-input>
          </el-form-item>
          <!-- <el-form-item label="企业应用ID" prop="cpyId" class="shop-name">
            <el-input v-model="ruleForm.cpyId"></el-input>
          </el-form-item>
          <el-form-item label="企业应用密钥" prop="cpyKey" class="shop-name">
            <el-input v-model="ruleForm.cpyKey"></el-input>
          </el-form-item>
          <el-form-item label="通讯录密钥" prop="listKey" class="shop-name">
            <el-input v-model="ruleForm.listKey"></el-input>
          </el-form-item> -->
          <el-form-item label="短信签名ID" prop="messID" class="shop-name input-code-disabled">
            <el-input @keyup.native="onlyNumTime" v-model="ruleForm.messID" readonly></el-input>
          </el-form-item>
          <el-form-item label="短信签名text" prop="messText" class="shop-name input-code-disabled">
            <el-input v-model="ruleForm.messText" readonly></el-input>
          </el-form-item>
          <el-form-item label="微信支付商户号" prop="payCode" class="shop-name input-code-disabled">
            <el-input v-model="ruleForm.payCode" readonly></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 单张图片预览 -->
    <vue-gic-img-preview :imgUrl="imageUrl" :imgShowFlag="imgShowFlag" @hideImage="hideImage"></vue-gic-img-preview>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import {isvalidPhone} from '../../../common/js/validate'
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
  export default {
    inject:['reload'],  // 注入依赖
    name: "merchant_info",
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
            name: '商户信息',
            path: ''
          }
        ],
        ruleForm: {
          shopName: '',
          companyName: '',
          region:'hh',
          address: '',
          kind:'',
          kind1:'',
          kind2:'',
          kind3:'',
          time:'',
          customerPhone:'',
          userDesc: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          serID: '',
          serKey: '',
          cpyId:'',
          cpyKey: '',
          listKey: '',
          messID: '',
          messText: '',
          payCode: '',
          openTime:'',
          closeTime:''
        },
        rules: {
          shopName: [
            { required: true, message: '请输入商户名称', trigger: 'blur' }
          ],
          companyName: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择所在地区', trigger: 'hh'}
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          kind: [
            { required: true, message: '请选择经营类目', trigger: 'dfd' }
          ],
          time: [
            { required: true, message: '请输入营业时间模板', trigger: 'blur' }
          ],
          customerPhone: [
            { required: true, message: '请输入客服热线', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' }
          ],
          contactPhone: [
            { required: true, trigger: 'blur', validator: validPhone }  //这里需要用到全局变量
          ],
          contactEmail: [
            { required: true, message: '请输入联系邮箱', trigger: 'blur' }
          ],
        },
        areaOptions: {    // 省市县传值
          provinceName: '',
          provinceId: '',
          cityName: '',
          cityId: '',
          countryName: '',
          countyId: ''
        },
        areaOptionsNew:{},
        okRegion:false,       // 是否显示所在地区的错误信息
        imageUrl: '',         // 上传
        imageFiledCode:'',
        wxImg:'',
        shopNum: 0,           // 商户名称(两个字母/汉字算一个字)
        shopLength: 10,
        companyNum: 0,        // 公司名称(两个字母/汉字算一个字)
        companyLength: 20,   
        addressNum: 0,        // 详细地址
        addressLength: 50,
        timeNum: 0,           // 时间模板
        timeLength: 30,
        customerNum: 0,           // 客服热线
        customerLength: 30,
        descNum: 0,           // 客户简介
        descLength: 100,
        option1:[],   // 经营类目的第一层
        option2:[],
        option3:[],
        operateId:'',   // 经营类目选中的最后的id值
        areaId:'',      // 地区最终选中的值

        timeError:false,  // 模板时间的错误信息

        // 单个图片上传
        imgShowFlag: false, // 是否弹框显示,true: 显示；false: 不显示
        imgUrl: '', // 传递的图片 src
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
      this.getMerchantData();   // 获得商户的信息
      // this.getKindData();       // 获取商户经营类目的信息
    },
    methods:{
      getMerchantData(){    
        this.axios.post('/api-admin/enterprise-info',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            var result = data.result.enterprise;  
            this.ruleForm.shopName = result.brandName;     // 商户名称     
            this.ruleForm.companyName = result.enterpriseName;  // 公司名称
            this.areaId = result.areaId;      // 地区最终选中的值
            this.ruleForm.address = result.addressDetail; // 详细地址
            this.operateId = result.operateId;      // 经营类目最后选中的id
            this.ruleForm.kind = result.operateId;
            this.imageUrl = result.qcloudImageUrl;            // 公司logo    2
            this.imageFiledCode = result.imageFieldCode;
            this.wxImg = result.imageUrl;
            
            this.ruleForm.customerPhone = result.customerPhone; // 客服热线
            this.ruleForm.userDesc = result.enterpriseDescription;  // 客户简介   2
            this.ruleForm.contactName = result.conactsName;  // 联系人姓名 
            this.ruleForm.contactPhone = result.conactsPhone;  // 手机号码 
            this.ruleForm.contactEmail = result.conactsEmail;  // 联系邮箱
            this.ruleForm.serID = result.appkey;  // 服务应用ID    2
            this.ruleForm.serKey = result.appsecret;  // 服务应用密钥    2
            this.ruleForm.cpyId = result.qyhAppkey;  // 企业应用ID    2
            this.ruleForm.cpyKey = result.qyhAppsecret;  // 企业应用密钥    2
            this.ruleForm.listKey = result.qyhAddressBooksecret;  // 通讯录密钥    2
            this.ruleForm.messID = result.smsSignId;  // 短信签名ID    2
            this.ruleForm.messText = result.smsSignText;  // 短信签名TEXT    2
            this.ruleForm.payCode = result.mchId;  // 微信支付商户号    2
        
            this.areaOptionsNew.provinceName = result.provinceName;    // 默认的省市区传值
            this.areaOptionsNew.provinceId = result.province;
            this.areaOptionsNew.cityName = result.cityName;
            this.areaOptionsNew.cityId = result.city;
            this.areaOptionsNew.countryName = result.countryName;
            this.areaOptionsNew.countyId = result.country;

            this.ruleForm.time = result.storeBusinessTime; // 营业时间模板
            var date1 = result.storeBusinessTime.split('-')[0];
            var date2 = result.storeBusinessTime.split('-')[1];
            // this.ruleForm.openTime = result.storeBusinessTime.split('-')[0];
            // this.ruleForm.closeTime = result.storeBusinessTime.split('-')[1]; 

            var num1= date1.replace(/[^0-9]/ig,"");
            var num2= date2.replace(/[^0-9]/ig,"");
            if(num1.length==3){
              this.ruleForm.openTime = '0'+num1.substring(0,1) +':'+ num1.substring(1,3);
            }else if(num1.length==4){
              this.ruleForm.openTime = num1.substring(0,2) +':'+ num1.substring(2,4);
            }
            if(num2.length==3){
              this.ruleForm.closeTime = '0'+num2.substring(0,1) +':'+ num2.substring(1,3);
            }else if(num2.length==4){
              this.ruleForm.closeTime = num2.substring(0,2) +':'+ num2.substring(2,4);
            }
            var obj = JSON.stringify(this.areaOptionsNew);  // 深拷贝
            this.areaOptions = JSON.parse(obj);
            this.shopNum=strLength.getZhLen(this.ruleForm.shopName);
            this.companyNum=strLength.getZhLen(this.ruleForm.companyName);
            this.addressNum=strLength.getZhLen(this.ruleForm.address);
            this.timeNum=strLength.getZhLen(this.ruleForm.time);
            this.customerNum=strLength.getZhLen(this.ruleForm.customerPhone);
            this.descNum=this.ruleForm.userDesc?strLength.getZhLen(this.ruleForm.userDesc):0;
            this.getKindData();       // 获取商户经营类目的信息
          }
        })
      },
      getKindData(){    // 获取商户经营类目的信息
        this.axios.post('/api-plug/dict-store-category',qs.stringify({
          requestProject:'gic-web',
          id:this.operateId
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.option1 = data.result.list;
            this.ruleForm.kind1 = data.result.firstId;
            var kind2 = data.result.secondId;
            var kind3 = data.result.thirdId;
            if(this.option1.length>0 && kind2){
              this.selectOption1(this.ruleForm.kind1);
              if(this.option2.length>0){
                this.ruleForm.kind2 = kind2;
                if(kind3){
                  this.selectOption2(kind2);
                  this.ruleForm.kind3 = kind3
                }
              }
            }
          }
        })
      },
      selectOption1(val){    // 经营类目  选择第一层
        // console.log(val);
        this.ruleForm.kind1 = val;
        this.option2=[];
        this.option3=[];
        this.ruleForm.kind2='';
        this.ruleForm.kind3='';
        for(var i=0;i<this.option1.length;i++){
          if(this.option1[i].storeCategoryDictId==val){
            if(this.option1[i].subList){
              this.option2=this.option1[i].subList
            }
          }
        }
      },
      selectOption2(val){
        console.log(val);
        this.ruleForm.kind = val;
        this.option3=[];
        this.ruleForm.kind3='';
        for(var i=0;i<this.option2.length;i++){
          if(this.option2[i].storeCategoryDictId==val){
            if(this.option2[i].subList){
              this.option3=this.option2[i].subList
            }
          }
        }
      },
      selectOption3(val){
        console.log(val);
        this.ruleForm.kind = val;
        this.ruleForm.kind3=val;
      },
      shopInput(value,e) {  // 商户名称  控制字符数量
        var that = this;
        that.ruleForm.shopName = strLength.getByteVal(e.target.value,that.shopLength);
        that.shopNum = strLength.getZhLen(that.ruleForm.shopName);
      },
      companyInput(value,e) {  // 公司名称  控制字符数量
        var that = this;
        that.ruleForm.companyName = strLength.getByteVal(e.target.value,that.companyLength);
        that.companyNum = strLength.getZhLen(that.ruleForm.companyName);
      },
      addressInput(value,e) {  // 详细地址  控制字符数量
        var that = this;
        that.ruleForm.addressName = strLength.getByteVal(e.target.value,that.addressLength);
        that.addressNum = strLength.getZhLen(that.ruleForm.addressName);
      },
      timeInput(value,e) {  // 营业模板时间  控制字符数量
        var that = this;
        that.ruleForm.timeName = strLength.getByteVal(e.target.value,that.timeLength);
        that.timeNum = strLength.getZhLen(that.ruleForm.timeName);
      },
      customerInput(value,e) {  // 客服热线  控制字符数量
        var that = this;
        that.ruleForm.customerName = strLength.getByteVal(e.target.value,that.customerLength);
        that.customerNum = strLength.getZhLen(that.ruleForm.customerName);
      },
      descInput(value,e) {  // 商户简介  控制字符数量
        var that = this;
        that.ruleForm.userDesc = strLength.getByteVal(e.target.value,that.descLength);
        that.descNum = strLength.getZhLen(that.ruleForm.userDesc);
      },
      onlyNumTime(){    // 短信签名只能输入数字
        if(!this.ruleForm.messID){
          this.ruleForm.messID = ''
        }
        this.ruleForm.messID=this.ruleForm.messID.replace(/\D/g,'');
      },
      selectedArea(val) {   // 选择省市区后返回的参数
        if(val.areaId == this.areaId){  // 未更改  或者  未更改完成
          this.areaId = ''
        }else{
          this.areaId = val.areaId;
          this.areaOptionsNew.provinceName = val.provinceName;    // 默认的省市区传值
          this.areaOptionsNew.provinceId = val.province;
          this.areaOptionsNew.cityName = val.cityName;
          this.areaOptionsNew.cityId = val.city;
          this.areaOptionsNew.countryName = val.countryName;
          this.areaOptionsNew.countyId = val.country;
        }
        // this.areaOptionsNew = val; 
        // if(this.areaOptionsNew.areaId){
        //   this.areaId = this.areaOptionsNew.areaId;
        // }
      },
      uploadUrl() {  //  图片上传的路径 并传参
        var that = this
        var host = window.location.origin;
        var baseUrl;
        that.upUrl = host + '/api-plug/upload-img?wxFlag=1&requestProject=gic-web'
        // console.log(that.upUrl)
        return that.upUrl
      },
      beforeImgUpload(file){
        // console.log(file);
        const isLt1M = file.size / 1024 / 1024 < 1;
        const isJPG = this.checkImg(file.type);
        if (!isLt1M) {
          this.$message.error('上传图片大小不能超过 1MB!');
        }
        if(!isJPG){
          this.$message.error('上传图片必须是JPG/JPEG 格式!');
        }
        let _this = this;
        return isLt1M && isJPG && new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(event) {
            let image = new Image();
            image.onload = function () {
              let width = this.width;
              let height = this.height;
              if(width !== height){
                _this.$message.error('只能上传规格为1:1的图片');
                reject();
              }
              resolve();
            }
            image.src = event.target.result;
          }
          reader.readAsDataURL(file);
        })
      },
      checkImg(type){  // 文件名称
        if(type=='image/jpg' || type=='image/jpeg'){ // type=='image/png' || type=='image/gif' || type=='image/bmp'
          return true;
        }else{
          return false;
        }
      },
      handleImgSuccess(res,file) {    // 文件上传成功
        if(res.errorCode==0){
          this.imageUrl = res.result[0].qcloudImageUrl;
          this.imageFiledCode = res.result[0].imageFiledCode;
          this.wxImg = res.result[0].wxImg;
          this.$message({
            type:'success',
            message:'上传成功'
          })
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      },
      selectOpenTime(val){    // 选择营业开始时间
        this.ruleForm.openTime = val;
        if(this.ruleForm.openTime>this.ruleForm.closeTime){
          this.timeError = true
        }else{
          this.timeError = false
        }
      },
      selectCloseTime(val){    // 选择营业结束时间
        this.ruleForm.closeTime = val;
        if(this.ruleForm.openTime>this.ruleForm.closeTime){
          this.timeError = true
        }else{
          this.timeError = false
        }
      },
      onSubmit(formName){
        if(!this.areaId){
          this.$message.error('请选择所在地区');
          return;
        }
        if(this.option1.length>0 && this.ruleForm.kind1==""){
          this.ruleForm.kind = "";
          this.$message.error('请选择经营类目');
          return;
        }
        if(this.option2.length>0 && this.ruleForm.kind2==""){
          this.ruleForm.kind = "";
          this.$message.error('请选择经营类目');
          return;
        }
        if(this.option3.length>0 && this.ruleForm.kind3==""){
          this.ruleForm.kind = "";
          this.$message.error('请选择经营类目');
          return;
        }
        this.ruleForm.time = this.ruleForm.openTime + '-' + this.ruleForm.closeTime;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/api-admin/save-enterprise-info',qs.stringify({
              requestProject:'gic-web',
              brandName:this.ruleForm.shopName,
              enterpriseName:this.ruleForm.companyName,
              areaId:this.areaId,
              addressDetail:this.ruleForm.address,
              imageUrl:this.wxImg,
              imageFieldCode:this.imageFiledCode,
              qcloudImageUrl:this.imageUrl,
              operateId:this.ruleForm.kind,
              storeBusinessTime:this.ruleForm.time,
              customerPhone:this.ruleForm.customerPhone,
              enterpriseDescription:this.ruleForm.userDesc,
              conactsName:this.ruleForm.contactName,
              conactsPhone:this.ruleForm.contactPhone,
              conactsEmail:this.ruleForm.contactEmail,
              appkey:this.ruleForm.serID,
              appsecret:this.ruleForm.serKey,
              qyhAppkey:this.ruleForm.cpyId,
              qyhAppsecret:this.ruleForm.cpyKey,
              qyhAddressBooksecret:this.ruleForm.listKey,
              smsSignId:this.ruleForm.messID?this.ruleForm.messID:null,
              smsSignText:this.ruleForm.messText,
              mchId:this.ruleForm.payCode
            })).then((res)=>{
              var data = res.data;
              // console.log(data);
              if(data.errorCode=="0"){
                this.$message.success('保存成功');
                this.reload();    // 调用依赖
              }else{
                this.$message.error(data.message);
              }
            })
          }else if(this.areaOptionsNew.country==""){
            this.okRegion = true;
            return;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 单个图片上传之后的预览
      showImage(src) {
        var that = this
        if(!src || src == ''){
          return false;
        }
        that.imgShowFlag = true;
        that.imgUrl = src;
      },
      hideImage(val) {
        var that = this
        that.imgShowFlag = val
      },
    },
    components:{
    	topNav,
    }  
  }
</script>

<style lang="less" scoped>
  .right-wrap .right-content .right-box{
    background: #fff;
    padding:24px 32px;
  }
  .shop-name{
    position: relative;
    width: 604px;
    .shop-name-num{
      position: absolute;
      right: 10px;
      bottom: 1px;
      color: #c0c4cc;
      font-size: 12px;
      background: #fff;
      height: 30px;
      line-height: 32px;
      padding-left: 10px;
    }
    .logo-img{
      width: 80px;
      height: 80px;
      margin-top: 10px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .desc-textarea{
    position: relative;
    width: 604px;
    margin-bottom: 44px;
    .active-info-num{
      position: absolute;
      right: 0;
      bottom: -31px;
      color: #c0c4cc;
      font-size: 12px;
    }
  }
  .avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader /deep/ .el-upload:hover {
    border-color: #1890ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .avatar-uploader{
    height: 128px;
  }
  .shop-name{
    .select-kind{
      width: 158px;
      margin-right: 6px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  
  .select-region-wrap{
    width: 604px;
  }
  .select-region-wrap .select-region + .select-region{
    margin-left: 10px;
  }
  .shop-name /deep/ .el-form-item .el-input__inner,.el-textarea{
    width:494px;
  }
  .select-region-wrap /deep/ .el-input--medium{
    width: 160px;
  }
  // .el-textarea{
  //   height: 100px;
  // }
  /* .el-textarea /deep/ .el-textarea__inner{
    height: 100%;
    // resize: none;
  } */
  .select-time-wrap{
    .select-time{
      width: 231px;
    }
    span{
      padding: 0 5px;
    }
  }
  .select-region-content /deep/ .w-160{
    width: 158px;
  }
  .select-region-content /deep/ .w-160+.w-160{
    margin-left:6px;
  }
  .img-text-tip{
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    color: #b8b8b8;
  }
  /* input不能操作 */
  .input-code-disabled /deep/ input{
    cursor: not-allowed;
    background-color: #f0f2f5;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
  .input-code-disabled /deep/ input:focus{
    border-color: #e4e7ed;
  }
</style>
