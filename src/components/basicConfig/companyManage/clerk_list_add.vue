<template>
	<div class="right-wrap">
    <topNav v-if="!editNavBool" :navpath="navpath"></topNav>
    <topNav v-else :navpath="navpathedit"></topNav>
    <div class="right-content" @click="selectTreeHide">
      <div class="right-box" v-loading="loading">
        <div class="item-info">
          <el-form :rules="rules" ref="ruleForm" label-position="right" :model="editForm" label-width="100px" class="form-wrap">
            <div class="item-wrap">
              <el-form-item label="姓名" prop="name">
                <div class="edit-input">
                  <el-input class="input-input" v-model="editForm.name" @keyup.native="toInput1(editForm.name,$event)"></el-input>
                  <span class="tag-name-num">{{inputNum1}}/{{inputLength1}}</span>
                </div>
              </el-form-item>
              <el-form-item label="性别" prop="sex" class="is-required">
                <el-radio-group v-model="editForm.sex">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="员工代码" prop="code">
                <div class="edit-input">
                  <el-input :disabled="editStoreBool || editDepartBool" class="input-input" v-model="editForm.code" @keyup.native="toInput2(editForm.code,$event)"></el-input>
                  <span class="tag-name-num">{{inputNum2}}/{{inputLength2}}</span>
                </div>
              </el-form-item>
              <!-- <div class="clerk-code">
                <span>员工代码 <el-tooltip class="item" effect="light" content="用于控制话务任务的分配给哪个企业号的用户" placement="top"><i class="tooltip-icon el-icon-question"></i></el-tooltip></span>
                <div class="edit-input el-form-item" :class="{'is-error':errorBool1}">
                  <el-input :disabled="editStoreBool || editDepartBool" class="input-input" v-model="editForm.code" @keyup.native="toInput2(editForm.code,$event)"></el-input>
                  <span class="tag-name-num">{{inputNum2}}/{{inputLength2}}</span>
                  <p v-show="errorBool1" class="el-form-item__error" style="padding-left: 100px">{{ errorMsg1 }}</p>
                </div>
              </div> -->
              <el-form-item label="手机号码" prop="mobile">
                <div class="edit-input">
                  <el-input type="number" @keyup.native="toInput4(editForm.mobile,$event)" class="input-input" v-model="editForm.mobile"></el-input>
                  <span class="tag-name-num">{{inputNum4}}/{{inputLength4}}</span>
                </div>
              </el-form-item>
              <el-form-item label="职位" prop="level">
                <div class="edit-input">
                  <el-input :disabled="addStoreBool || editStoreBool" class="input-input" v-model="editForm.level" @keyup.native="toInput3(editForm.level,$event)"></el-input>
                  <span class="tag-name-num">{{inputNum3}}/{{inputLength3}}</span>
                </div>
                <div class="right-input-tip"><span>(如需指定店长，请到列表上单独设置)</span></div>
              </el-form-item>
              <el-form-item label="权限模板" class="is-required">
                <!-- 门店成员 无    部门成员  有 -->
                <p v-show="!storeOrDepart" :class="{'margin-b-10':showTpl}"><el-button @click="selectAgain">{{showTpl?'重新选择':'选择模板'}}</el-button></p>
                <div v-show="showTpl" class="tpl-wrap" >
                  <div class="title-wrap">
                    <p class="tpl-name fl">{{editStore.roleName}}</p>
                    <p class="fr">{{editStore.clerkCount}}人</p>
                  </div>
                  <ul>
                    <li class="clearfix">
                      <p class="tpl-name fl">直属下级</p>
                      <p class="fr">{{editStore.lowLevelRoleName?editStore.lowLevelRoleName:'无'}}</p>
                    </li>
                    <!-- <li class="clearfix">
                      <p class="fl">好办APP</p>
                      <p class="fr">{{editStore.app==1?'开启':'关闭'}}</p>
                    </li> -->
                    <li class="clearfix">
                      <p class="fl">Web后台管理</p>
                      <p class="fr">{{editStore.gicWeb==1?'开启':'关闭'}}</p>
                    </li>
                  </ul>
                </div>
                <p v-show="errorBool2" class="el-form-item__error">{{ errorMsg2 }}</p>
              </el-form-item>
              <!-- 门店成员 -->
              <div v-show="storeOrDepart" class="store-clerk">
                <el-form-item label="所属门店">
                  <div class="edit-input">
                    <el-input disabled class="input-input" v-model="editForm.storeName"></el-input>
                  </div>
                </el-form-item>
              </div>
              <!-- 部门成员 -->
              <div v-show="!storeOrDepart" class="depart-clerk">
                <el-form-item label="重设登录密码">
                  <div class="edit-input">
                    <el-input class="input-input" v-model="editForm.password"></el-input>
                    <!-- <el-input @keyup.native="inputPwd(editForm.password)" class="input-input" v-model="editForm.password"></el-input> -->
                  </div>
                  <!-- <div class="right-input-tip"><span @click="passwordBtn" class="gps-tool">{{showPassword?'重设密码':'取消重设'}}</span></div> -->
                </el-form-item>
                <el-form-item label="管辖门店" prop="store" class="is-required">
                  <selectShopTree :groupTopBool="groupTopBool" :storeTopBool="storeTopBool" :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree>
                </el-form-item>
              </div>
              <el-form-item v-show="saveBtnBool">
                <el-button @click="saveBtn('ruleForm')" type="primary">保 存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 选择权限模板 -->
    <el-dialog
      title="权限模板"
      :visible.sync="selectTplDialog"
      width="610px">
      <div class="select-tpl-wrap clearfix">
        <div @click="selectTpl(item,index)" class="tpl-wrap" :class="{'on':currentIndex == index}"  v-for="(item,index) in roleList" :key="index">
          <div class="title-wrap">
            <p class="tpl-name fl">{{item.roleName}}</p>
            <p class="fr">{{item.clerkCount}}人</p>
          </div>
          <ul>
            <li class="clearfix">
              <p class="fl">直属下级</p>
              <p class="fr">{{item.lowLevelRoleName?item.lowLevelRoleName:'无'}}</p>
            </li>
            <!-- <li class="clearfix">
              <p class="fl">好办APP</p>
              <p class="fr">{{item.app==1?'开启':'关闭'}}</p>
            </li> -->
            <li class="clearfix">
              <p class="fl">Web后台管理</p>
              <p class="fr">{{item.gicWeb==1?'开启':'关闭'}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectTplDialog = false">取 消</el-button>
        <el-button type="primary" @click.prevent.stop="selectTplBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 不能编辑的成员 -->
    <el-dialog
      title="提示"
      :visible.sync="contactDialog"
      width="500px">
      <span>{{ saveBtnHtml }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="contactDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import selectShopTree from 'components/basicConfig/selectShopTree/selectShopTreeMany'
  import {isvalidPhone,isCommonCode} from '../../../common/js/validate'
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
  var commonCode=(rule, value,callback)=>{    //定义一个全局的变量  手机号验证
    if (!value){
      callback(new Error('请输入员工代码'))
    }else if (!isCommonCode(value)){
      callback(new Error('员工代码不允许有特殊符号'))
    }else {
      callback()
    }
  }
  export default {
    name: "clerk_list_add",
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
            name: '成员管理',
            path: ''
          },
          {
            name: '店员列表',
            path: '/clerk_list'
          },
          {
            name: '新增成员',
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
            path: ''
          },
          {
            name: '成员管理',
            path: ''
          },
          {
            name: '店员列表',
            path: '/clerk_list'
          },
          {
            name: '编辑成员',
            path: ''
          }
        ],
        editNavBool:false,
        editForm:{
          name:'',
          sex:'1',
          code:'',
          mobile:'',
          level:'',
          store:'',
          password:null,  // 显示
          pwd:'123456', // 传递
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          code:[
            { required: true, trigger: 'blur', validator: commonCode }  //这里需要用到全局变量
          ],
          mobile:[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
          ],
          level:[
            { required: true, message: '请输入职位', trigger: 'blur' }
          ],
        },
        inputNum1: 0, 
        inputLength1: 10,
        inputNum2: 0, 
        inputLength2: 20,
        inputNum3: 0, 
        inputLength3: 10,
        inputNum4: 0, 
        inputLength4: 10,
        
        clerkId:"", // 店员 id
        clerkType:'',  // 店员类型
        storeId:null,
        storeMode:'0',
        activationStatus:'0',
        store:'0',  //  管辖门店
        
        loading:false,
        sendChildData:{},  // 向子元素 门店 传递的对象
        showPassword:true,  // 是否重设密码
        editType:'',  // 编辑类型  门店  部门

        storeOrDepart:false,  // 是门店还是部门  门店true，部门false
        editStoreBool:false,  // 门店编辑  的显示部分
        addStoreBool:false,
        editDepartBool:false, // 部门编辑 的显示部分

        editStore:{ // 门店编辑  默认的权限模板
          roleName:'',
          clerkCount:0,
          lowLevelRoleName:null,
          app:1,
          gicWeb:1,
        },
        roleId:null,
        departId:null,  // 部门id

        selectTplDialog:false, // 选择权限模板
        showTpl:true,
        loading2:false,
        roleList:[],  
        currentIndex:-1,
        selelctTplData:{},

        storeGroupId:'',  // 门店分组的id
        departStoreId:'', // 部分门店的id
        storeList:[],

        saveBtnBool:true,  // 编辑保存按钮的出现与隐藏
        contactDialog:false,
        saveBtnHtml:'该成员处于新增审核中，不能编辑哦',

        type:2,
        search:'',
        search2:'',
        groupId:'',

        errorBool1:false,
        errorMsg1:'',
        errorBool2:false,
        errorMsg2:'jkj',

        storeOrDepartType:'0',  // 0门店成员 2部门人员,

        groupTopBool:true,
        storeTopBool:true,
    	}
    },
    created(){
      this.getUrlData();
      // this.inputPwd(); // 让密码变为点
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods: {
      getUrlData(){   // 获得路由参数
        this.storeOrDepartType = this.$route.query.type;  // 0门店成员 2部门人员
        this.clerkId = this.$route.query.clerkId; 
        if(this.clerkId){    // 编辑
          this.editNavBool = true;
        }else{
          this.editNavBool = false;
        }
        if(this.storeOrDepartType=='0'){  // 门店
          this.type = 2;
          this.storeOrDepart = true;  // 是门店还是部门 部分的显示和隐藏
          this.storeId = this.$route.query.storeId;
          this.clerkType = this.$route.query.clerkType;
          // this.groupId = this.$route.query.groupId;
          // this.search = this.$route.query.search;
          if(this.clerkId){    // 编辑
            this.editStoreBool = true;   // 门店新增 编辑时的隐藏与显示
            this.addStoreBool = false;
          }else{    // 新增
            this.addStoreBool = true;
            this.editStoreBool = false;
            this.editForm.level = '店员';
            this.clerkType = '0';
            this.storeMode = '0';
            this.editForm.name = '';
            this.editForm.password = null;
            this.editForm.pwd = null;
            this.editForm.storeName = this.$route.query.storeName;
            this.inputNum3 = strLength.getZhLen(this.editForm.level);
          }
        }else if(this.storeOrDepartType=='2'){  // 部门
          this.type = 3;
          this.storeOrDepart = false;  // 是门店还是部门 部分的显示和隐藏
          this.editDepartBool = true;
          // this.search2 = this.$route.query.search;
          this.departId = this.$route.query.departId; // 部门id
          if(this.clerkId){    // 编辑
            this.navpathedit[2].path='/clerk_list?type='+this.type;
            this.showTpl = true;
          }else{
            this.navpath[2].path='/clerk_list?type='+this.type;
            this.showTpl = false;
          }
        }
        this.getClerkInfo();  // 编辑、新增时获得店员信息
      },
      getClerkInfo(){  // 编辑时获得店员信息
        this.loading = true;
        this.axios.post('/api-admin/clerk-info',qs.stringify({
          requestProject:'gic-web',
          clerkId:this.clerkId,
          clerkType:this.storeOrDepartType
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          this.loading = false;
          if(data.errorCode==0){
            if(data.result.role){ // 门店、部门  新增、编辑获得默认权限模板  
              var editStoreData = data.result.role;
              this.editStore.roleName = editStoreData.roleName;
              this.editStore.clerkCount = editStoreData.clerkCount;
              this.editStore.lowLevelRoleName = editStoreData.lowLevelRoleName;
              this.editStore.app = editStoreData.app;
              this.editStore.gicWeb = editStoreData.gicWeb;
              this.roleId = editStoreData.roleId;
            }
            if(this.storeOrDepartType=='2'){  // 部门  新增、编辑获得权限列表
              this.roleList = data.result.roleList;
            }
            if(this.clerkId){ // 编辑
              var result = data.result.clerkInfo;
              this.editForm.name = result.clerkName;   // 店员姓名
              this.editForm.sex = result.clerkGender;  // 性别
              this.editForm.code = result.clerkCode;   // 代码
              this.editForm.mobile = result.phoneNumber; // 手机号
              this.editForm.level = result.positionName; // 职位
              this.inputNum1 = strLength.getZhLen(this.editForm.name);
              this.inputNum2 = strLength.getZhLen(this.editForm.code);
              this.inputNum3 = strLength.getZhLen(this.editForm.level);
              this.inputNum4 = strLength.getZhLen(this.editForm.mobile);

              if(result.status==2){
                this.saveBtnHtml  = '该成员处于新增审核中，不能编辑哦';
                this.saveBtnBool = false;
                this.contactDialog = true;
              }else if(result.status==3){
                this.saveBtnHtml = '该成员处于离职审核中，不能编辑哦';
                this.saveBtnBool = false;
                this.contactDialog = true;
              }else if(result.status==4){
                this.saveBtnHtml = '该成员处于转岗审核中，不能编辑哦';
                this.saveBtnBool = false;
                this.contactDialog = true;
              }else{
                this.saveBtnBool = true;
              }

              if(this.storeOrDepartType=='0'){  // 门店店员编辑
                this.editForm.storeName = result.storeName;  // 所属门店
                this.storeId = result.storeId;   // 门店id
              }else if(this.storeOrDepartType=='2'){  // 部门店员的编辑
                this.storeMode = result.storeMode.toString(); // 管辖门店
                this.activationStatus = result.activationStatus;
                if(this.storeMode=='1'){    // 向子组件传递数据
                  this.storeList = result.storeList;
                  this.sendChildData = {};
                  this.sendChildData.storeType = this.storeMode;
                  var storeGroupId = '';
                  result.storeList.forEach((item)=>{
                    storeGroupId += item.storeGroupId + ',';
                  })
                  this.sendChildData.storeList = result.storeList;
                  this.sendChildData.storeGroupIds = storeGroupId.substring(0,storeGroupId.length-1);
                } else if(this.storeMode=='0'){    // 向子组件传递数据
                  this.sendChildData = {};
                  this.sendChildData.storeType = this.storeMode;
                } else if(this.storeMode=='2'){    
                  this.storeList = result.storeList;
                  this.sendChildData = {};    // 向子组件传递数据
                  this.sendChildData.storeType = this.storeMode;
                  var storeIds = '';
                  var storeNames = '';
                  result.storeList.forEach((item)=>{
                    storeIds += item.storeId + ',';
                    storeNames += item.storeName + ',';
                  })
                  this.sendChildData.storeList = result.storeList;
                  this.sendChildData.storeIds = storeIds.substring(0,storeIds.length-1);
                  this.sendChildData.storeName = storeNames.substring(0,storeNames.length-1);
                }
              }
            }else{  // 新增
              if(this.storeOrDepartType=='2'){  // 部门
                this.storeMode = '0'; // 管辖门店
                this.editDepartBool = false;
              }
            }
          }else{
            this.$message.error(data.message);
            this.roleId = null
          }
        })
      },
      toInput1(value,e) { 
        this.editForm.name = strLength.getByteVal(e.target.value,this.inputLength1);
        this.inputNum1 = strLength.getZhLen(this.editForm.name);
      },
      toInput2(value,e) {
        if(this.editForm.code){
          this.editForm.code = strLength.getByteVal(e.target.value,this.inputLength2);
          this.inputNum2 = strLength.getZhLen(this.editForm.code);
        }
      },
      toInput3(value,e) { 
        this.editForm.level = strLength.getByteVal(e.target.value,this.inputLength3);
        this.inputNum3 = strLength.getZhLen(this.editForm.level);
      },
      toInput4(value,e) { 
        this.editForm.mobile = strLength.getByteVal(e.target.value,this.inputLength4);
        this.inputNum4 = strLength.getZhLen(this.editForm.mobile);
      },
      onlyNumTime(){    // 手机号只能输入数字
        this.editForm.mobile=this.editForm.mobile.replace(/\D/g,'');
      },
      // inputPwd(val){ // 输入的密码变为点
      //   this.editForm.pwd = val;
      //   console.log(this.editForm.pwd);
      //   this.editForm.password = this.editForm.password.replace(/./g,'•')
      // },
      // passwordBtn(){  // 是否重设密码
      //   this.showPassword = !this.showPassword;
      //   if(this.showPassword){
      //     this.editForm.password = '123456';
      //     this.editForm.pwd = '123456';
      //     this.editForm.password = this.editForm.password.replace(/./g,'•');
      //   }else{
      //     this.editForm.password = null;
      //     this.editForm.pwd = null;
      //   }
      // },
      selectAgain(){  // 重新选择权限模板
        this.selectTplDialog = true;
      },
      selectTpl(row,index){  // 选择权限模板
        this.currentIndex = index;
        this.selelctTplData = row;
      },
      selectTplBtn(){  // 选择权限模板的确认按钮
        this.showTpl = true;
        this.selectTplDialog = false;
        this.roleId = this.selelctTplData.roleId;
        this.editStore.roleName = this.selelctTplData.roleName;   // 选择之后更改默认您的权限模板的值
        this.editStore.clerkCount = this.selelctTplData.clerkCount;
        this.editStore.lowLevelRoleName = this.selelctTplData.lowLevelRoleName;
        this.editStore.app = this.selelctTplData.app;
        this.editStore.gicWeb = this.selelctTplData.gicWeb;

        this.errorBool2 = false;
      },
      selectTreeHide(){   // 调用子组件 门店树级 结构的值  部门的管辖门店
        this.$refs.selectTree.hideTree();
      },
      getSelectGroupData(val){   // 获得子元素 门店 传递的数据
        console.log(val);
        this.storeMode = val.storeType.toString();
        if(val.storeList){
          this.storeList=val.storeList
        }
      },
      saveBtn(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.roleId==null) {
              this.errorBool2 = true;
              this.errorMsg2 = '请选择模板'
            }else{
              this.errorBool2 = false;
            }
            if(!this.errorBool2){
              if(this.storeMode=='1'){  // 门店分组
                if(this.storeList.length<1){
                  this.$message.error('请选择门店分组');
                  return;
                }
              }else if(this.storeMode=='2'){  // 部分门店
                if(this.storeList.length<1){
                  this.$message.error('请选择部分门店');
                  return;
                }
              }
              this.saveBtnData();
            }
          } else {
            this.checkError()
            return false;
          }
        });
      },
      checkError(){
        if (this.roleId==null) {
          this.errorBool2 = true;
          this.errorMsg2 = '请选择模板'
        }else{
          this.errorBool2 = false;
        }
      },
      saveBtnData(){
        var type = 0;
        if(this.storeOrDepartType=='0'){  // 门店成员
          type = Number(this.clerkType);
        }else if(this.storeOrDepartType=='2'){  // 企业成员
          type = 2;
        }
        this.axios.post('/api-admin/save-clerk-info?requestProject=gic-web',{
          clerkId:this.clerkId,             // 成员ID
          clerkType:type, // 成员类型
          clerkName:this.editForm.name,     // 成员名称
          phoneNumber:this.editForm.mobile, // 手机号
          positionName:this.editForm.level, // 职位名称
          storeId:this.storeId,
          roleId:this.roleId,
          departId:this.departId,
          storeMode:this.storeMode, // 企业部门需要的参数
          clerkCode:this.editForm.code,     // 成员编码
          clerkGender:this.editForm.sex,  // 性别
          resetPwd:this.editForm.password,
          storeList:this.storeList, // 部门选择门店
        },{
          headers:{'Content-Type':'application/json'}
        }).then((res)=>{
          var data = res.data;
          // console.log(data);
          this.loading = false;
          if(data.errorCode==0){
            this.$message.success('保存成功');
            this.$router.push({
              path:'/clerk_list',
              query:{
                type:this.type
              }
            })
            // if(this.storeOrDepartType=='0'){  // 门店成员
            //   this.$router.push({
            //     path:'/clerk_list',
            //     query:{
            //       groupId:this.groupId,
            //       type:this.type,
            //       search:this.search,
            //     }
            //   })
            // }else if(this.storeOrDepartType=='2'){  // 部门成员
            //   this.$router.push({
            //     path:'/clerk_list',
            //     query:{
            //       type:this.type,
            //       departId:this.departId,
            //       search:this.search2
            //     }
            //   })
            // } 
          }else if(data.errorCode==110021){
            this.$message(data.message);
          }else{
            this.$message.error(data.message)
          }
        })
      },
      saveBtn2(){
        var reg = /\s+/g;
        this.editForm.name = this.editForm.name.replace(/\s+/g, "");

        this.inputNum1 = strLength.getZhLen(this.editForm.name);

        if(this.editForm.name == ''){
          this.$message.error('请输入姓名');
          return;
        }
        if(this.editForm.code == ''){
          this.$message.error('请输入员工代码');
          return;
        }else{
          var reg = /^[\w\u4e00-\u9fa5-]+$/;  
          if(!reg.test(this.editForm.code)){
            this.$message.error('员工代码不允许有特殊符号');
            return;
          }
        }
        if(this.editForm.mobile == ''){
          this.$message.error('请输入手机号码');
          return;
        }else{    
          var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          if(!reg.test(this.editForm.mobile)){
            this.$message.error('请输入有效的手机号码');
            return;
          }
        }
        if(this.editForm.level==''){
          this.$message.error('请输入职位');
          return;
        }
        if(this.roleId==null){
          this.$message.error('请选择模板');
          return;
        }
        // if(this.editForm.pwd==null){
        //   this.$message.error('请输入重设的密码');
        //   return;
        // }
        if(this.storeMode=='1'){  // 门店分组
          if(this.storeList.length<1){
            this.$message.error('请选择门店分组');
            return;
          }
        }else if(this.storeMode=='2'){  // 部分门店
          if(this.storeList.length<1){
            this.$message.error('请选择部分门店');
            return;
          }
        }
        this.axios.post('/api-admin/save-clerk-info?requestProject=gic-web',{
          clerkId:this.clerkId,             // 成员ID
          clerkType:Number(this.clerkType), // 成员类型
          clerkName:this.editForm.name,     // 成员名称
          phoneNumber:this.editForm.mobile, // 手机号
          positionName:this.editForm.level, // 职位名称
          storeId:this.storeId,
          roleId:this.roleId,
          departId:this.departId,
          storeMode:this.storeMode, // 企业部门需要的参数
          clerkCode:this.editForm.code,     // 成员编码
          clerkGender:this.editForm.sex,  // 性别
          resetPwd:this.editForm.password,
          storeList:this.storeList, // 部门选择门店
        },{
          headers:{'Content-Type':'application/json'}
        }).then((res)=>{
          var data = res.data;
          console.log(data);
          this.loading = false;
          if(data.errorCode==0){
            this.$message.success('保存成功');
            this.$router.push({
              path:'/clerk_list',
              query:{
                type:this.type
              }
            })
          }else if(data.errorCode==110021){
            this.$message(data.message);
          }else{
            this.$message.error(data.message)
          }
        })
      },
    },
    components: {
    	topNav,
      selectShopTree
    }       
  }
</script>

<style lang="less" scoped>
  .right-box{
    padding: 24px 32px;
    .item-info{
      .input-wrap{
        padding: 24px 24px 1px 24px;
      }
      .textarea-wrap{
        margin-bottom: 18px;
      }
      .edit-input{
        /*width: 494px;*/
        position: relative;
        display: inline-block;
        .input-input{
          width: 489px;
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
          width: 243px;
          &:last-child{
            margin-left: 3px;
          }
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
  .clerk-code{
    position: relative;
    line-height: 40px;
    font-size: 14px;
    > span{
      position: absolute;
      width: 100px;
      z-index: 1;
      color: #606266;
      &:before{
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .edit-input{
      padding-left: 100px;
    }
  }
  .right-input-tip{
    display: inline-block;
    span{
      font-size: 13px;
      color: #909399;
    }
  }
  .tpl-wrap{
    cursor: pointer;
    float: left;
    margin: 15px 15px 0 0;
    &.on{
      border-color: #1890ff;
    }
    li{
      line-height: 35px;
      height: 35px;
    }
    color: #606266;
    width: 270px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .title-wrap{
      height: 40px;
      line-height: 40px;
      font-size: 15px;
      border-bottom: 1px solid #dcdfe6;
    }
    .tpl-name{
      width: 160px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .tpl-wrap:nth-child(2),.tpl-wrap:first-child{
    margin-top: 0;
  }
  .tpl-wrap:nth-child(2n){
    margin-right: 0;
  }
  .select-tpl-wrap{
    height: 313px;
    overflow: auto;
  }
  .margin-b-10{
    margin-bottom: 10px;
  }
  .input-input /deep/ .el-input__inner{
    line-height: 1
  }
</style>
