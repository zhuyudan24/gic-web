<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="search-wrap">
          <el-date-picker class="date-picker" @change="selectDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-input
            class="search-input"
            @keyup.native.enter="selectType"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchInput">
            <el-select slot="prepend" class="search-select" v-model="searchType" placeholder="请选择">
              <el-option
                v-for="item in searchOptions"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </el-input>
          <el-button class="fr" type="primary" @click="addChecker('add')">新增审核员</el-button>
        </div>
        <el-table
          :data="tableData"
          class="table-no-line-wrap"
          style="width: 100%">
          <el-table-column
            prop="auditorName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="mobilePhone"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="opr"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button type="text" @click="addChecker('edit',scope.row)">编辑</el-button>
              <delete-tip @confirm="delChecker(scope.row,scope.$index)" tips="确定删除该审核员吗?">
                <el-button type="text">删除</el-button>
              </delete-tip>
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="no-data-wrap">
              <div class="no-data-icon no_checker_icon" >
                <img src="../../../static/img/no_checker_icon.png" alt="">
              </div>
              <p>暂无审核人员</p>
            </div>
          </template>
        </el-table>
        <div class="pagination" v-show="totalCount>0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="dialogCancelBtn"
      width="480px">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
          <el-form-item label="姓名" prop="name" class="edit-input">
            <el-input v-model="ruleForm.name" @keyup.native="toInput(ruleForm.name,$event)"></el-input>
            <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
          </el-form-item>
          <el-form-item label="手机" prop="phone" class="number-wrap">
            <el-input type="number" v-model="ruleForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <div v-if="isShowErweima && editErweimaBool" class="img-wrap">
          <!-- 未绑定微信 -->
          <div v-if="isShowTip">
            <p class="img">
              <qrcode :value="qrcodeUrl2" v-if="qrcodeUrl2" :options="{ size: 96 }"></qrcode>
            </p>
            <p class="img-tip">待扫码绑定账户</p>
          </div>
          <!-- 已绑定微信 -->
          <div v-else>
            <p class="img">
              <img :src="wxImg" alt="">
            </p>
            <!-- <p class="img-tip">待扫码绑定账户</p> -->
          </div>
        </div>
        <div v-if="!isShowErweima && editErweimaBool" class="img-wrap">
          <p class="img"></p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancelBtn">取 消</el-button>
        <el-button type="primary" @click="dialogSureBtn('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="erweimaBool"
      width="300px">
      <div>
        <div class="img-wrap img-dialog-wrap">
          <p class="img">
            <!-- <img :src="erweimaImg" alt="二维码"> -->
            <qrcode :value="qrcodeUrl" v-if="qrcodeUrl" :options="{ size: 128 }"></qrcode>
          </p>
          <p class="img-tip">待扫码绑定账户</p>
        </div>
      </div>
    </el-dialog>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
import strLength from '../../common/js/strlen'
import {isvalidPhone} from '../../common/js/validate'
import QRcode from '@xkeshi/vue-qrcode' // 生成二维码
var validPhone=(rule, value,callback)=>{    //定义一个全局的变量  特殊字符的验证 可以有空格
  if (!value){
    callback(new Error('请输入手机号码'))
  }else if (!isvalidPhone(value)){
    callback(new Error('请输入正确的11位手机号码'))
  }else {
    callback()
  }
}
let qs = require('qs')
export default {
  name: "checkerManage", 
  data() {
    return {
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      navpath: [
        {
          name: '配置中心',
          path: ''
        },
        {
          name: '运营策略',
          path: ''
        },
        {
          name: '审核员管理',
          path: ''
        }
      ],
      dateValue:[],
      startTimeStr:'',
      endTimeStr:'',
      timeDefaultShow:'',    // 默认日期
      searchOptions:[
        {
          type: 'auditor_name',
          name:'姓名'
        },{
          type: 'mobile_phone',
          name:'手机号码'
        }
      ],
      searchType:'auditor_name',
      searchInput:'',
      ruleForm:{
        name:'',
        phone:''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }  //这里需要用到全局变量
        ]
      },
      dialogVisible:false,
      dialogTitle:'新增审核员',
      isShowErweima:false,
      erweimaBool:false, // 显示二维码的弹框
      erweimaImg:'', // 二维码
      wxImg:'', // 微信图片 或 二维码
      isShowTip:false, // 头像下的文案
      inputNum: 0,
      inputLength: 12,
      auditorId:'', // 审核员id （新增不传或者null，修改必传）
      openid:'', // 微信openid
      tableData: [],
      currentPage:1,	// 分页符的当前页
      pageSize:20,
      totalCount:0,
      loading:false,
      qrcodeUrl:"", // 生成二维码
      qrcodeUrl2:"",
      checkerType:'add', // 审核员  编辑or新增
      editErweimaBool:false,
    }
  },
  created(){
    this.timeDefaultShow = new Date();
    this.timeDefaultShow.setMonth(new Date().getMonth() - 1);  // 设置日期
    this.getCheckerList();	// 获取日志列表
  },
  mounted(){
    window.onresize = () => {
      return (() => {
        this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
      })()
    }
  },
  methods: {
    getCheckerList(){
      this.loading = true;
      this.axios.post('/api-admin/page-auditor',qs.stringify({
        requestProject:'gic-web',
        createStartTime:this.startTimeStr,
        createEndTime:this.endTimeStr,
        searchColumn:this.searchType,
        searchValue:this.searchInput,
        currentPage:this.currentPage,
        pageSize:this.pageSize
      })).then((res)=>{
        var data = res.data;
        this.loading = false;
        if(data.errorCode==0){
          this.tableData = data.result.result;
          this.totalCount = data.result.totalCount;
        }else{
          this.$message.error(data.message);
        }
      })
    },
    selectDate(val){		// 选择日期
      this.startTimeStr = val[0];
      this.endTimeStr = val[1];
      this.currentPage = 1;
      this.getCheckerList();
    },
    selectType(){  // 查询
      this.currentPage = 1;
      this.getCheckerList();
    },
    handleSizeChange(val){		// 选择分页符
      this.currentPage = 1;
      this.pageSize = val;
      this.getCheckerList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCheckerList();
    },
    addChecker(type,row){  // 新增、编辑审核员
      this.dialogVisible = true;
      this.checkerType = type;
      if(this.checkerType=='add'){
        this.dialogTitle = '新增审核员';
        this.isShowErweima = false;
        this.editErweimaBool = false;
        this.ruleForm.name = "";
        this.ruleForm.phone = "";
        this.inputNum = 0;
        this.openid = '';
        this.auditorId = '';
        this.isShowTip = false;
      }else if(this.checkerType=='edit'){
        this.dialogTitle = '编辑审核员';
        this.auditorId = row.auditorId;
        // this.openid = row.openid;
        // this.isShowTip = row.openid?false:true;
        this.isShowErweima = false;
        this.editErweimaBool = true;
        this.axios.post('/api-admin/auditor-info',qs.stringify({
          requestProject:'gic-web',
          auditorId:row.auditorId
        })).then((res)=>{
          var data = res.data;
          this.isShowErweima = true;
          if(data.errorCode==0){
            this.isShowTip = data.result.openid?false:true;
            if(data.result.openid){ // 存在，已绑定
              this.openid = data.result.openid;
              this.wxImg = data.result.headImgUrl;
            }else{
              this.qrcodeUrl2 = data.result.headImgUrl;
            }
            this.ruleForm.name = data.result.auditorName;
            this.ruleForm.phone = data.result.mobilePhone;
            this.inputNum = strLength.getZhLen(this.ruleForm.name);
          }else{
            this.$message.error(data.message);
          }
        })
      }
    },
    toInput(value,e) {  // 名称输入时控制字符数量
      this.ruleForm.name = strLength.getByteVal(e.target.value,this.inputLength);
      this.inputNum = strLength.getZhLen(this.ruleForm.name);
    },
    dialogCancelBtn(){ // 弹框的取消按钮
      this.dialogVisible = false;
      this.$refs.ruleForm.clearValidate();
    },
    dialogSureBtn(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveChecker();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveChecker(){
      this.axios.post('/api-admin/save-auditor',qs.stringify({
        requestProject:'gic-web',
        auditorName:this.ruleForm.name,
        mobilePhone:this.ruleForm.phone,
        openid:this.openid,
        auditorId:this.auditorId,
      })).then((res)=>{
        var data = res.data;
        if(data.errorCode==0){
          this.dialogVisible = false;
          this.getCheckerList();
          if(!this.isShowErweima){  // true 新增
            this.erweimaBool = true; // 显示出二维码弹框
            this.qrcodeUrl = data.result;
          }
        }else{
          this.$message.error(data.message);
        }
      })
    },
    delChecker(row,index){  // 删除审核员
      this.axios.post('/api-admin/update-auditor-status',qs.stringify({
        requestProject:'gic-web',
        auditorId:row.auditorId,
        status:0
      })).then((res)=>{
        var data = res.data;
        if(data.errorCode==0){
          this.tableData.splice(index,1);
          this.totalCount--;
          if(this.tableData.length==0){
            if(this.currentPage>1){
              this.currentPage -= 1;
              this.getCheckerList()
            }
          }
        }else{
          this.$message.error(data.message);
        }
      })
    },
  },
  components: {
    topNav,
    "qrcode":QRcode
  }     
}
</script>

<style lang="less" scoped>
  .search-wrap{
    font-size: 0;
    margin-bottom: 22px;
    .search-select{
      width: 100px;
    }
    .search-input{
      width: 300px;
      margin-left: 8px;
    }
  }
  .img-wrap{
    margin: 40px 0;
    .img{
      width: 105px;
      height: 105px;
      border: 1px solid rgba(220,223,230,1);
      border-radius: 6px;
      padding: 4px;
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .img-tip{
      font-size: 13px;
      color: #606266;
      margin-top: 15px;
      text-align: center;
    }
  }
  .img-dialog-wrap{
    margin: 10px 0 30px 0;
    .img{
      width: 140px;
      height: 140px;
      padding: 5px;
    }
  }
  .edit-input{
    width: 100%;
    position: relative;
    display: inline-block;
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
  .pagination{
		text-align: right;
		margin-top: 24px;
  }
  .no-data-wrap .no_checker_icon{
    width: 160px;
    height: 112px;
  }
  .table-no-line-wrap.el-table:before{
    height: 0;
  }
  .search-select /deep/ .el-input__inner{
    background-color: #F1F3F7;
    border-right: 0;
    padding-left: 12px;
  }
  .number-wrap /deep/ .el-input__inner{
    line-height: 1;
  }
</style>
