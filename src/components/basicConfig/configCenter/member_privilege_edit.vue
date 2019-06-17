<template>
  <div class="right-wrap">
    <topNav v-if="editNav" :navpath="navpathedit"></topNav>
  	<topNav v-else :navpath="navpath"></topNav>
  	<div class="right-content" @click="selectTreeHide">
      <div class="right-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="特权名称" prop="name" class="text-content">
            <div class="keyword-input">
              <el-input v-model="ruleForm.name" @keyup.native="toInput(ruleForm.name,$event)"></el-input>
              <span class="text-num">{{inputNum}}/{{inputLength}}</span>
            </div>
          </el-form-item>
          <el-form-item label="特权简介" prop="info" class="text-content">
            <div class="keyword-input">
              <el-input v-model="ruleForm.info" @keyup.native="toInput2(ruleForm.info,$event)"></el-input>
              <span class="text-num">{{inputNum2}}/{{inputLength2}}</span>
            </div>
          </el-form-item>
          <el-form-item label="激活图标" prop="okImg">
            <div class="upload-content">
              <el-upload
                class="avatar-uploader"
                action="123"
                :show-file-list="false"
                :on-success="handleAvatarSuccessOk"
                :before-upload="beforeAvatarUploadOk">
                <img v-if="okImageUrl" :src="okImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <p>请上传规格为60*60的图片</p>
            </div>
          </el-form-item>
          <el-form-item label="未激活图标" prop="noImg">
            <div class="upload-content">
              <el-upload
                class="avatar-uploader"
                action="123"
                :show-file-list="false"
                :on-success="handleAvatarSuccessNo"
                :before-upload="beforeAvatarUploadNo">
                <img v-if="noImageUrl" :src="noImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <p>请上传规格为60*60的图片</p>
            </div>
          </el-form-item>
          <el-form-item label="特权介绍" prop="detail" class="text-num-wrap big-select">
            <el-input type="textarea" v-model="ruleForm.detail" @keyup.native="toInput3(ruleForm.detail,$event)" class="big-input"></el-input>
              <span class="text-num">{{inputNum3}}/{{inputLength3}}</span>
          </el-form-item>
          <el-form-item label="激活等级" prop="level">
            <el-checkbox-group @change="selectLevel" v-model="ruleForm.level">
              <el-checkbox v-for="(level, index) in levelData" :label="level.id" name="level" :key="index">{{level.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="适用门店">
            <selectShopTree :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveBtn('ruleForm')" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
  	</div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  import selectShopTree from 'components/basicConfig/selectShopTree/selectShopTreeMany'
  import strLength from '../../../common/js/strlen';
  let qs = require('qs')
  export default {
    name: "member_privilege",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
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
            name: '会员特权',
            path: '/member_privilege'
          },
          {
            name: '新建特权',
            path: ''
          }
        ],
        navpathedit: [
          {
            name: '会员管理',
            path: ''
          },
          {
            name: '会员体系',
            path: ''
          },
          {
            name: '会员特权',
            path: '/member_privilege'
          },
          {
            name: '编辑特权',
            path: ''
          }
        ],
        editNav:false,
        ruleForm: {
          name: '',
          info:'',
          detail:'',
          level:[],
        },
        rules: {
          name: [
            { required: true, message: '请输入特权名称', trigger: 'blur' }
          ],
          info: [
            { required: true, message: '请输入特权简介', trigger: 'blur' }
          ],
          okImg:[
            { required: true, message: '请上传激活图标', trigger: 'hh' }
          ],
          noImg:[
            { required: true, message: '请上传未激活图标', trigger: 'hh' }
          ],
          level:[
            { type: 'array',required: true, message: '请至少选择一个激活等级', trigger: 'change' }
          ],
        },
        inputNum: 0,        // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 20,   // 限制最大字数
        inputNum2: 0,        
        inputLength2: 20,
        inputNum3: 0,        
        inputLength3: 200,

        privilegeId:'',
        okImageUrl:'',    // 激活图标
        okImageFiledCode:'',
        noImageUrl:'',    // 未激活图标
        noImageFiledCode:'',
        levelData:[],

        tagId:'',
        tagName:'',
        storeType:'0',    // 门店分组类型
        storeGroupIds:'',
        storeNames:'',  

        storeIds:'',
        dialogTitle:'',
        sendChildData:{},  // 向子元素传递的对象
        itemChild:{},   // 选中的门店标签的数据
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
      this.getRouterData();
      this.getLevelData();    // 获取等级数据
    },
    methods:{
      getRouterData(){    // 获取路由参数，判断是新增还是编辑
        this.privilegeId = this.$route.query.privilegeId;
        // console.log(this.privilegeId);
        if(this.privilegeId==undefined || this.privilegeId==""){    // 新增
          this.editNav = false;
          this.privilegeId = null;

          this.sendChildData = {};
          this.sendChildData.storeType = 0;
          this.sendChildData.storeGroupIds = '';
          this.sendChildData.storeName = '';
          this.sendChildData.storeIds = ''
        }else{
          this.editNav = true;
          this.getEditData(this.privilegeId);
        }
      },
      getEditData(id){    // 获取编辑的信息
        this.axios.post('/api-admin/privilege-service-detail',qs.stringify({
          requestProject:'gic-web',
          privilegeId:id
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.ruleForm.name = data.result.privilegeName;
            this.ruleForm.info = data.result.privilegeSubname;  // 简介
            this.ruleForm.detail = data.result.privilegeRemark; // 介绍
            this.okImageUrl = data.result.onQcloudImageUrl;   // 激活图标
            this.okImageFiledCode = data.result.onImageFieldCode;
            this.noImageUrl = data.result.offQcloudImageUrl;   // 未激活图标
            this.noImageFiledCode = data.result.offImageFieldCode;
            this.ruleForm.level = data.result.gradeIds.split(",")
            this.inputNum = strLength.getZhLen(this.ruleForm.name);
            this.inputNum2 = strLength.getZhLen(this.ruleForm.info); 
            this.inputNum3 = strLength.getZhLen(this.ruleForm.detail);

            this.storeType = data.result.storeMode;   // 门店分组类型
            
            console.log(this.storeType);
            if(this.storeType==1){    // 向子组件传递数据   门店分组
              this.storeGroupIds = data.result.groupIds;
              this.sendChildData = {};
              this.sendChildData.storeType = this.storeType;
              this.sendChildData.storeGroupIds = this.storeGroupIds;
              console.log(this.sendChildData);
            } else if(this.storeType==0){    // 向子组件传递数据
              this.sendChildData = {};
              this.sendChildData.storeType = this.storeType;
            } else if(this.storeType==2){    
              this.storeNames = data.result.storeNames;
              this.storeIds = data.result.storeIds;
              this.sendChildData = {};    // 向子组件传递数据   部分门店
              this.sendChildData.storeType = this.storeType;
              this.sendChildData.storeName = this.storeNames;
              this.sendChildData.storeIds = this.storeIds;
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getLevelData(){   // 获取等级数据
        this.axios.post('/api-admin/grade-list',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode == 0){
            this.levelData = data.result;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      selectLevel(val){
        // console.log(val);
        this.ruleForm.level = val
      },
      toInput(value,e) {          // 控制字符数量
        var that = this;
        that.ruleForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.ruleForm.name);
      },
      toInput2(value,e) {          // 控制字符数量
        var that = this;
        that.ruleForm.info = strLength.getByteVal(e.target.value,that.inputLength2);
        that.inputNum2 = strLength.getZhLen(that.ruleForm.info);
      },
      toInput3(value,e) {          // 控制字符数量
        var that = this;
        that.ruleForm.detail = strLength.getByteVal(e.target.value,that.inputLength3);
        that.inputNum3 = strLength.getZhLen(that.ruleForm.detail);
      },     
      beforeAvatarUploadOk(file) {  // 图片上传之前   激活图标
        let fd = new FormData();
        fd.append('file', file);
        fd.append('requestProject', 'gic-web');
        fd.append('wxFlag','1')
        this.axios.post('/api-plug/upload-img', fd).then((res)=> {//成功后回调
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.okImageUrl = data.result[0].qcloudImageUrl;
            this.okImageFiledCode = data.result[0].imageFiledCode;
            this.$message({
              type:'success',
              message:'上传成功'
            })
          } else {
            this.$message({
              type:'error',
              message:data.message
            })
          }
        });
        return true
      },
      handleAvatarSuccessOk(res, file) {    // 图片上传成功
        console.log(file)
      },
      beforeAvatarUploadNo(file) {  // 图片上传之前 未激活图标
        let fd = new FormData();
        fd.append('file', file);
        fd.append('requestProject', 'gic-web');
        fd.append('wxFlag','1')
        this.axios.post('/api-plug/upload-img', fd).then((res)=> {//成功后回调
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.noImageUrl = data.result[0].qcloudImageUrl;
            this.noImageFiledCode = data.result[0].imageFiledCode;
            this.$message({
              type:'success',
              message:'上传成功'
            })
          } else {
            this.$message({
              type:'error',
              message:data.message
            })
          }
        });
        return true
      },
      handleAvatarSuccessNo(res, file) {    // 图片上传成功
        console.log(file)
      },
      getSelectGroupData(val){    // 获得 门店的 子组件 传递的数据
        console.log(val);
        this.storeType = val.storeType.toString();
        this.storeGroupIds = val.storeGroupIds;
        this.storeIds = val.storeIds;
      },
      selectTreeHide(){   // 调用子组件 门店树级 结构的值
        this.$refs.selectTree.hideTree();
      },
      saveBtn(formName){
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
            
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
        
        if(this.ruleForm.name==""){
          this.$message.error('请输入特权名称');
          return;
        }
        if(this.ruleForm.info==""){
          this.$message.error('请输入特权简介');
          return;
        }
        if(this.okImageFiledCode==""){
          this.$message.error('请上传激活图标');
          return;
        }
        if(this.noImageFiledCode==""){
          this.$message.error('请上传未激活图标');
          return;
        }
        if(this.ruleForm.level.length<1){
          this.$message.error('请选择激活等级');
          return;
        }

        if(this.storeType=='1' && this.storeGroupIds==""){
          this.$message.error('请选择门店分组');
          return;
        }
        if(this.storeType=='2' && this.storeIds==""){
          this.$message.error('请选择部分门店');
          return;
        }
        this.axios.post('/api-admin/privilege-service-save',qs.stringify({
          requestProject:'gic-web',
          privilegeId:this.privilegeId,
          onImageFieldCode:this.okImageFiledCode,
          onQcloudImageUrl:this.okImageUrl,
          offImageFieldCode:this.noImageFiledCode,
          offQcloudImageUrl:this.noImageUrl,
          storeIds:this.storeIds,
          groupIds:this.storeGroupIds,
          storeMode:this.storeType,
          gradeIds:this.ruleForm.level.join(','),
          privilegeName:this.ruleForm.name,
          privilegeSubname:this.ruleForm.info,
          privilegeRemark:this.ruleForm.detail
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode == 0){
            this.$message.success('保存成功');
            this.$router.push('/member_privilege')
          }else{
            this.$message.error(data.message)
          }
        })
      }
    },
    components:{
    	topNav,
      selectShopTree
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
    background: #fff;
    padding: 24px 32px;
    .text-content{
      width: 594px;
    }
    .keyword-input{
      position: relative;
      width: 494px;
      .text-num{
        position: absolute;
        right: 10px;
        bottom: 0;
        color: #c0c4cc;
        font-size: 12px;
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
  .text-num-wrap{
    width: 594px;
    position: relative;
    .text-num{
      position: absolute;
      bottom: -32px;
      color: #c0c4cc;
      font-size: 12px;
      right: 0;
    }
  }
  .avatar-uploader{
    height: 102px;
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
