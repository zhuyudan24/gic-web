<template>
  <div class="right-wrap">
    <topNav v-if="!edit" :navpath="navpath"></topNav>
    <topNav v-else :navpath="navpathedit"></topNav>
    <div class="right-content">
      <div class="right-box" v-loading="loading">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <h2 class="func-title" style="border-top:none;">基础信息</h2>
          <el-form-item label="权限模板名称" prop="name" class="shop-name">
            <el-input v-model="ruleForm.name" @keyup.native="toInput(ruleForm.name,$event)"></el-input>
            <span class="shop-name-num">{{inputNum}}/{{inputLength}}</span>
          </el-form-item>
          <el-form-item label="直属下级" class="shop-name">
            <el-select :disabled="nextBool" @change="selectNextRole" style="width:100%" v-model="ruleForm.next" placeholder="请选择直属下级">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="projectList.length>0" label="系统权限">
            <el-checkbox-group @change="selectSystem" v-model="ruleForm.system">
              <el-checkbox v-for="item in projectList" :key="item.rightId" :label="item.rightId">{{item.rightName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div v-show="ruleForm.system.indexOf('gic-web')!=-1">
            <h2 class="func-title">商户后台功能权限</h2>
            <el-form-item v-for="(item,i) in funcList" :key="i" :label="item.rightName">
              <selectAll :sendSelectData="item" :index="i" @sendDataToFather="getChildSelectData"></selectAll>
            </el-form-item>
          </div>
          <el-form-item style="margin-bottom:0">
            <el-row>
              <el-button @click="saveBtn('ruleForm')" type="primary">保 存</el-button>
              <el-button @click="backPre">返 回</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import selectAll from 'components/basicConfig/selectAll/selectAll'
  let qs = require('qs')
  let list = []   // 用时可不写this
  export default {
    name: "clerk_quanxian_edit",
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
            name: '权限管理',
            path: '/clerk_quanxian_manage'
          },
          {
            name: '新建职位',
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
            name: '权限管理',
            path: '/clerk_quanxian_manage'
          },
          {
            name: '编辑职位',
            path: ''
          }
        ],
        edit:true,
        ruleForm:{
          name:'',
          next:'',
          system:[],  // 系统权限的选中值
          func:[]
        },
        rules: {
          name: [
            { required: true, message: '请输入权限模板名称', trigger: 'blur' }
          ]
        },
        roleType:3,  // 新增的时候为3
        roleId:'',
        inputNum:0,
        inputLength:16,
        roleList:[],  // 直属下级
        projectList:[], // 系统权限
        funcList:[],  // 功能权限
        loading:false,

        rightList:[], // 选择功能权限
        selectPro:[], // 选择系统权限
        AllList:[], // 最后要保存的数据

        roleType:'2', // 店长2 店员3
        nextBool:false
      }
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getUrlData()
    },
    methods:{
      getUrlData(){
        this.loading = true;
        this.roleId = this.$route.query.roleId;
        this.roleType = this.$route.query.roleType;
        if(this.roleType){
          if(this.roleType=='2' || this.roleType=='1'){
            this.nextBool = true;
          }
        }
        if(this.roleId){ // 编辑
          this.edit = true;
        }else{  // 新建
          this.edit = false;
          this.roleId = null;
        }
        this.axios.post('/api-admin/edit-right-role',qs.stringify({
          requestProject:'gic-web',
          roleId:this.roleId
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.loading = false;
            this.roleList = data.result.roleList;   // 直属下级列表
            this.projectList = data.result.projectList; // 系统权限列表
            data.result.projectList.forEach((item)=>{
              if(item.hasRight==1){
                this.ruleForm.system.push(item.rightId)
              }
            })
            this.funcList = data.result.rightList;  // 功能权限列表
            this.funcList.forEach((item)=>{    // 获得功能权限默认选中值
              if(item.hasRight == 1){  // 全选
                var obj = {};
                obj.rightId = item.rightId;
                obj.rightType = item.rightType;
                this.rightList.push(obj);
              }
              item.childList.forEach((ele)=>{ // 获得默认选中值
                if(ele.hasRight==1){
                  var obj = {};
                  obj.rightId = ele.rightId;
                  obj.rightType = ele.rightType;
                  this.rightList.push(obj);
                }
              })
            })
            // console.log(this.rightList);
            if(data.result.role){ // 存在是编辑
              var role = data.result.role;
              this.roleType = role.roleType;
              this.ruleForm.name = role.roleName;
              this.ruleForm.next = role.lowLevelRole;
              this.inputNum = strLength.getZhLen(this.ruleForm.name);
            }else{
              this.roleType = 3;  // 不存在是新增
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      toInput(value,e) {  // 控制字符数量
        var that = this;
        that.ruleForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.ruleForm.name);
      },
      selectNextRole(val){
        this.ruleForm.next = val;
      },
      selectSystem(val){ // 选择系统权限
        this.ruleForm.system = val;
      },
      getChildSelectData(val){ // 获得子组件中选中的数据
        // console.log(val);
        list[val.index] = val.data;
        // console.log(list);
      },
      backPre(){
        this.$router.push('clerk_quanxian_manage')
      },
      saveBtn(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.system.length>0){  //  选择系统权限
              this.ruleForm.system.forEach((item,index)=>{
                this.projectList.forEach((ele,idx)=>{  // 通过循环，拼接所有选中的值的数据
                  if(item==ele.rightId){  
                    var obj = {};
                    obj.rightId = ele.rightId;
                    obj.rightType = ele.rightType;
                    this.selectPro.push(obj)
                  }
                })
              })
            }
            // 选择了商户后台  功能权限 
            if(this.ruleForm.system.indexOf('gic-web')!=-1 && list.length>0){    
              this.rightList = [];
              list.forEach((item)=>{
                if(item.length>0){
                  item.forEach((ele)=>{
                    this.rightList.push(ele)
                  })
                }
              })
            }
            this.AllList = this.selectPro.concat(this.rightList);
            console.log(this.AllList);
            this.axios.post('/api-admin/save-right-role?requestProject=gic-web',{
              roleId:this.roleId,
              roleName:this.ruleForm.name,
              roleType:this.roleType,
              lowRoleId:this.ruleForm.next,
              rightList:this.AllList
            },{
              headers:{'Content-Type':'application/json'
            }}).then((res)=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode==0){
                this.$message.success('保存成功');
                this.$router.push('/clerk_quanxian_manage')
              }else{
                this.$message.error(data.message)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    components:{
      topNav,
      selectAll
    }  
  }
</script>

<style lang="less" scoped>
  .right-wrap .right-content .right-box{
    background: #fff;
    padding:0 32px 24px;
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
  }
  .func-wrap{
    width: 1030px;
  }
  .func-title{
    font-size: 16px;
    font-weight: 700;
    color: #303133;
    border-top: 1px solid #e8e8e8;
    padding: 34px 0 24px 0;
  }
  .func-wrap /deep/ .el-checkbox{
    width: 180px;
  }
  .func-wrap /deep/ .el-checkbox:nth-child(5n+1){
    margin-left: 0;
  }
</style>
