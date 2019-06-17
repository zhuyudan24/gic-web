<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content" @click="closeOldAPI">
      <div class="right-box">
        <div class="tip-notice-wrap">
          <h4><i class="el-icon-info"></i></h4>
          <div>
            <p>自微信2.4.0版本后，每个小程序跳转至其他小程序数量限制为不超过10个。</p>
            <p>且在发布版本更新时，不支持动态修改。故，小程序配置中若新增了跳转第三方小程序时，需重新提交审核后方可生效。</p>
          </div>
        </div>
        <div class="list-content-wrap">
          <div class="list-lt-wrap">
            <div class="lt-title-wrap">
              <span>当前配置的API名单</span>
              <el-row class="fr">
                <el-button @click="addAPI" type="primary" >新增API</el-button>
                <el-button @click.prevent.stop="openOldAPI">历史API名单</el-button>
              </el-row>
            </div>
            <div class="list-content">
              <!-- <div class="lt-search">
                <el-input @keyup.native.enter="getLeftList" clearable placeholder="请输入名称/APPID" prefix-icon="el-icon-search" v-model="ltSearch"></el-input>
              </div> -->
              <div class="table-wrap">
                <el-table
                  class="table-no-line-wrap"
                  :data="tableData1"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="名称">
                    <template slot-scope="scope">
                      <div class="name-wrap">
                        <p>{{ scope.row.appName }}</p>
                        <p>APPID:{{ scope.row.appId }}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    sortable
                    prop="createTime"
                    label="创建时间">
                    <template slot-scope="scope">
                      <p>{{scope.row.createTime | dateFormat('YYYY-MM-DD')}}</p>
                      <p>{{scope.row.createTime | dateFormat('hh:mm:ss')}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="opr"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editAPI(scope.row)">编辑</el-button>
                        <el-button type="text" @click="giveUpAPI(scope.row)">弃用</el-button>
                    </template>
                  </el-table-column>
                  <template slot="empty">
                    <div class="no-data-wrap">
                      <div class="no-data-icon" >
                        <img src="../../../static/img/no-data_icon.png" alt="">
                      </div>
                      <p>暂无数据</p>
                    </div>
                  </template>
                </el-table>
                <!-- <div class="list-center-wrap">
                  <div class="img"><i class="iconfont icon-fengefu"></i></div>
                </div> -->
              </div>
            </div>
          </div>
          <div class="list-rt-wrap" :class="{'right-list-margin':rtWrapBool}" @click.prevent.stop>
            <div class="lt-title-wrap">
              <span>配置过的API名单</span>
              <p @click="closeOldAPI" class="rt-close-btn fr"><i class="el-icon-close"></i></p>
            </div>
            <div class="list-content">
              <div class="lt-search">
                <el-input @keyup.native.enter="getRightList" placeholder="请输入名称/APPID" prefix-icon="el-icon-search" v-model="rtSearch"></el-input>
              </div>
              <el-table
                class="table-no-line-wrap"
                :data="tableData2"
                style="width: 100%"
                max-height="413">
                <el-table-column
                  prop="name"
                  label="名称">
                  <template slot-scope="scope">
                    <div class="name-wrap">
                      <p>{{ scope.row.appName }}</p>
                      <p>APPID:{{ scope.row.appId }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="time"
                  sortable
                  label="创建时间">
                  <template slot-scope="scope" >
                    <p>{{scope.row.createTime | dateFormat('YYYY-MM-DD')}}</p>
                    <p>{{scope.row.createTime | dateFormat('hh:mm:ss')}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="opr"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="openAPI(scope.row)">启用</el-button>
                    <el-button type="text" @click="deleteAPI(scope.row,scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                <template slot="empty">
                  <div class="no-data-wrap">
                    <div class="no-data-icon" >
                      <img src="../../../static/img/no-data_icon.png" alt="">
                    </div>
                    <p>暂无数据</p>
                  </div>
                </template>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增小程序API -->
    <el-dialog
      :title = "addAPITitle"
      :visible.sync="addAPIBool"
      width="500px">
      <el-form label-position="right" :model="addForm" :rules="addRules" ref="addRuleForm"  label-width="80px">
        <el-form-item label="API名称" prop="appName" class="active-name">
          <el-input v-model="addForm.appName" @keyup.native="toInput(addForm.appName,$event)"></el-input>
          <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
        </el-form-item>
        <el-form-item label="APPID" prop="appId" class="active-name">
          <el-input :disabled="APPIDBool" maxlength="32" v-model="addForm.appId" @keyup.native="toInput2(addForm.appId,$event)"></el-input>
          <span class="tag-name-num">{{inputNum1}}/{{inputLength1}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelDialogBtn('addRuleForm')">取 消</el-button>
        <el-button type="primary" @click="saveDialogBtn('addRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import { dateFormat } from '../../common/js/filter'
  import strLength from '../../common/js/strlen'
  import {isCommonCodeSpace,isNumAndCode} from '../../common/js/validate'
  let qs = require('qs')
  var commonCodeSpace=(rule, value,callback)=>{    //定义一个全局的变量  特殊字符的验证 可以有空格
    if (!value){
      callback(new Error('请输入API名称'))
    }else if (!isCommonCodeSpace(value)){
      callback(new Error('API名称不允许有特殊符号'))
    }else {
      callback()
    }
  }
  var numAndCode=(rule, value,callback)=>{    //定义一个全局的变量  字母和数字的验证
    if (!value){
      callback(new Error('请输入APPID'))
    }else if (!isNumAndCode(value)){
      callback(new Error('APPID只能输入字母和数字'))
    }else {
      callback()
    }
  }
  export default {
    name: "xcxAPI",
    data(){
    	return {
    		navpath: [
          {
            name: '小程序配置',
            path: ''
          },
          {
            name: '小程序API管理',
            path: ''
          }
        ],
        tableData1: [],
        tableData2: [],
        ltSearch:'',
        rtSearch:'',
        addAPIBool:false,
        addForm:{
          appName:'',
          appId:'',
          appletAppId:''
        },
        addRules:{
          appName:[
            { required: true, trigger: 'blur',validator: commonCodeSpace },
          ],
          appId:[
            { required: true, trigger: 'blur', validator: numAndCode }  //这里需要用到全局变量
          ],
        },
        inputNum: 0,    // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 10,  // 限制最大字数
        inputNum1: 0,    // 输入文字个数(两个字母/汉字算一个字)
        inputLength1: 16,  // 限制最大字数
        addAPITitle:'新增第三方小程序API',
        APPIDBool:false,
        addAPIType:'add',  // add 添加，edit 编辑
        loading:false,

        rtWrapBool:true,
      }
    },
    mounted(){
      this.init()
    },
    methods:{
      init(){
        this.getLeftList();
        this.getRightList();
      },
      getLeftList(){ //  左侧列表
        this.loading = true;
        this.axios.post('/api-admin/applet-app-search',qs.stringify({
          requestProject:'gic-web',
          appStatus:'1',
          sort:'create_time desc',
          search:this.ltSearch
        })).then(res=>{
          this.loading = false;
          var data = res.data;
          if(data.errorCode ==0){
            this.tableData1 = data.result;
          }else{
            this.$message.error(data.message);
            return;
          }
        })
      },
      getRightList(){ //  右侧列表
        this.loading = true;
        this.axios.post('/api-admin/applet-app-search',qs.stringify({
          requestProject:'gic-web',
          appStatus:'2',
          sort:'',
          search:this.rtSearch
        })).then(res=>{
          this.loading = false;
          var data = res.data;
          if(data.errorCode ==0){
            this.tableData2 = data.result;
          }else{
            this.$message.error(data.message);
            return;
          }
        })
      },
      toInput(value,e) {  // 名称输入时控制字符数量
        this.addForm.appName = strLength.getByteVal(e.target.value,this.inputLength);
        this.inputNum = strLength.getZhLen(this.addForm.appName);
      },
      toInput2(value,e) {  // 名称输入时控制字符数量
        this.addForm.appId = strLength.getByteVal(e.target.value,this.inputLength1);
        this.inputNum1 = strLength.getZhLen(this.addForm.appId);
      },
      addAPI(){ // 新增API
        var html = '<h2>当前配置API名单数已达上限10个<h2><p style="font-size:12px;color:#909399">若要启用该API，请先删除当前配置中无用的API<p>'
        if(this.tableData1.length>9){ // API超过10个
          this.$alert(html, '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText:'知道了',
            cancelButtonText: '取消',
            showCancelButton:false,
            type: 'warning'
          }).then(() => {
            
          }).catch(() => {

          });
        }else{
          this.addAPIBool = true;
          this.addAPITitle = '新增第三方小程序API';
          this.APPIDBool = false;
          this.addAPIType = 'add';
          this.addForm.appName = '';
          this.addForm.appId = '';
          this.inputNum = 0;
          this.inputNum1 = 0;
        }
      },
      editAPI(row){ // 编辑api
        // console.log(row);
        this.addAPIBool = true;
        this.addAPITitle = '编辑第三方小程序API';
        this.APPIDBool = true;
        this.addAPIType = 'edit';
        
        this.addForm.appName = row.appName;
        this.addForm.appId = row.appId;
        this.addForm.appletAppId = row.appletAppId;
        this.inputNum = strLength.getZhLen(this.addForm.appName);
        this.inputNum1 = strLength.getZhLen(this.addForm.appId);
      },
      openOldAPI(){  // 历史API
        this.rtWrapBool = false;
      },
      closeOldAPI(){ // 关闭历史API
        this.rtWrapBool = true;
      },
      cancelDialogBtn(formName){
        this.addAPIBool = false;
        this.$refs[formName].clearValidate();
      },
      saveDialogBtn(formName,type){    // 添加 编辑 保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addForm.appName = this.addForm.appName.trim();  // 去掉前后空格
            if(this.addAPIType=="edit"){ // 编辑时的保存按钮
              this.axios.post('/api-admin/applet-app-edit',qs.stringify({
                requestProject:'gic-web',
                appName:this.addForm.appName,
                appletAppId:this.addForm.appletAppId
              })).then(res=>{
                var data = res.data;
                if(data.errorCode ==0){
                  this.addAPIBool = false;
                  this.getLeftList();
                }else if(data.errorCode == 110024){
                  this.$message.error('小程序API名称重复');
                  return;
                }else{
                  this.$message.error(data.message);
                  return;
                }
              })
            }else if (this.addAPIType=='add'){  // 添加
              this.axios.post('/api-admin/applet-app-save',qs.stringify({
                requestProject:'gic-web',
                appName:this.addForm.appName,
                appId:this.addForm.appId
              })).then(res=>{
                var data = res.data;
                if(data.errorCode ==0){
                  this.addAPIBool = false;
                  this.getLeftList();
                  var html = '<h2>新增成功<h2><p style="font-size:12px;color:#909399">配置完成后，记得重新提交小程序审核<p>'
                  this.$alert(html, '提示', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText:'确定',
                    cancelButtonText: '取消',
                    showCancelButton:false,
                    type: 'success'
                  }).then(() => {
                    
                  }).catch(() => {

                  });
                }else if(data.errorCode == 110024){
                  this.$message.error('小程序API名称重复');
                  return;
                }else if(data.errorCode == 110025){
                  this.$message.error('小程序API超过10个');
                  return;
                }else if(data.errorCode == 110026){
                  this.$message.error('小程序APPID重复');
                  return;
                }else{
                  this.$message.error(data.message);
                  return;
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      giveUpAPI(row){ // 弃用
        var html = '<h2>你确认弃用这个小程序API？<h2><p style="font-size:12px;color:#909399">请注意：一旦弃用，原先配置跳转至该小程序API功能将失效。<p>'
        this.$alert(html, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          showCancelButton:true,
          type: 'error'
        }).then(() => {
          this.axios.post('/api-admin/applet-app-modify-status',qs.stringify({
            requestProject:'gic-web',
            appletAppId:row.appletAppId,
            appStatus:'2'
          })).then(res=>{
            var data = res.data;
            if(data.errorCode==0){
              this.getLeftList();
              this.getRightList();
            }else{
              this.$message.error(data.message)
            }
          })
          
        }).catch(() => {

        });
      },
      openAPI(row){ // 启用
        if(this.tableData1.length<10){
          this.axios.post('/api-admin/applet-app-modify-status',qs.stringify({
            requestProject:'gic-web',
            appletAppId:row.appletAppId,
            appStatus:'1'
          })).then(res=>{
            var data = res.data;
            if(data.errorCode==0){
              var html = '<h2>启用成功<h2><p style="font-size:12px;color:#909399">配置完成后，记得重新提交小程序审核<p>'
              this.$alert(html, '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText:'确定',
                cancelButtonText: '取消',
                showCancelButton:false,
                type: 'success'
              }).then(() => {
                
              }).catch(() => {

              });
              this.getLeftList();
              this.getRightList();
            }else{
              this.$message.error(data.message)
            }
          })
        }else{
          var html = '<h2>当前配置API名单数已达上限10个<h2><p style="font-size:12px;color:#909399">若要启用该API，请先删除当前配置中无用的API<p>'
          this.$alert(html, '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText:'知道了',
            cancelButtonText: '取消',
            showCancelButton:false,
            type: 'warning'
          }).then(() => {
            
          }).catch(() => {

          });
        }
      },
      deleteAPI(row,index){ // 删除
        var html = '<h2>你确认删除这个小程序API？<h2><p style="font-size:12px;color:#909399">请注意：一旦删除无法恢复。<p>'
        this.$alert(html, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText:'确定',
          cancelButtonText: '取消',
          showCancelButton:true,
          type: 'error'
        }).then(() => {
          this.axios.post('/api-admin/applet-app-modify-status',qs.stringify({
            requestProject:'gic-web',
            appletAppId:row.appletAppId,
            appStatus:'0'
          })).then(res=>{
            var data = res.data;
            if(data.errorCode==0){
              this.tableData2.splice(index,1)
            }else{
              this.$message.error(data.message)
            }
          })
          
        }).catch(() => {

        });
      },
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
  /* .right-box{
    padding-bottom: 0;
  } */
  .list-content-wrap{
    /* position: relative; */
  }
  .tip-notice-wrap{
    padding: 16px 14px;
    background: #ecf5ff;
    border: 1px solid #1890ff;
    border-radius: 4px;
    color: rgba(0,0,0,.65);
    margin-bottom: 30px;
    position: relative;
    h4{
      color:#409EFF;
      line-height:1;
      padding-bottom:17px;
      position: absolute;
      top: 14px;
      i{
        font-size: 16px;
        vertical-align:top;
      }
      span{
        padding-left: 7px;
        font-size: 13px;
      }
    }
    div{
      padding-left: 23px;
      p{
        color:#606266;
        line-height:1;
        font-size:13px;
        &:first-child{
          padding-bottom: 17px;
        }
      }
    }
  }
  .list-content-wrap{
    .list-lt-wrap{
      /* width: 58%; */
    }
    .lt-search{
      padding: 20px 0;
    }
    .lt-title-wrap{
      margin-bottom: 22px;
      span{
        font-size:14px;
        font-weight:500;
        color:#303133;
        line-height:32px;
      }
    }
    .table-wrap{
      position: relative;
    }
    .list-center-wrap{
      width: 6%;
      height: 100%;
      text-align: center;
      .img{
        position: absolute;
        top: 50%;
        right: -7%;
        /* margin-left: -37px; */
        margin-top: 16px;
      }
      i{
        font-size: 27px;
        color: #DCDFE6;
      }
    }
    .list-rt-wrap{
      width: 456px;
      padding: 18px 20px 0 20px;
      border-radius: 4px;
      background: #fff;
      box-shadow:-2px 0 8px 1px rgba(159, 159, 159, 0.12);
      position: fixed;
      bottom: 10px;
      right: 24px;
      z-index: 1;
      transition: all 0.8s;
      &.right-list-margin{
        /* margin-right: -510px; */
        bottom: -519px;
        z-index: -1;
      }
      .lt-title-wrap{
        margin-bottom: 0;
        span{
          line-height: 1;
        }
      }
      .rt-close-btn{
        cursor: pointer;
        color: #909399;
        &:hover{
          color: #1890ff;
        }
      }
    }
  }
  
  .active-name {
    position: relative;
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
  }
  .name-wrap p{
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 18px;
  }
  
  /* .list-lt-wrap /deep/ .el-table tr:last-child td,.list-rt-wrap /deep/ .el-table tr:last-child td{
    border: none;
  } */
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
