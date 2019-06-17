<template>
<div>
  <div class="right-wrap" :style="{minHeight: (bodyHeight - 164) + 'px'}">
    <navbar :activeitem="activeitem" :navpath="navpath" :navtab="navtab" @getCurTab="getCurTab"></navbar>
    <div class="right-content">
      <div v-show="activeitem==2" class="right-box" >
        <div class="bind-info">
          <p>导入的门店将存于暂存区，若要上线请在批量导入后批量发布上线</p>
          <p>导入门店时请导入与ERP门店code一致的门店，如果出现不一致的，gic拉取ERP门店的数据时，将自动将ERP中不存在的门店清除</p>
          <!-- <p>导入门店数量小于100家实时导入，大于100家异步导入</p> -->
        </div>
        <h2 class="begin-title">开始批量导入门店</h2>
        <div class="step-wrap">
          <el-steps direction="vertical">
            <el-step title="">
              <div class="first-step" slot="description">
                <span>下载门店导入模板，批量填写门店信息</span>
                <el-button @click="downloadFile" type="primary" size="small">下载</el-button>
              </div>
            </el-step>
            <el-step title="">
              <div class="first-step" slot="description">
                <span>上传填写好的门店信息</span>
                <el-upload
                  class="upload-demo"
                  name="uploadFile"
                  action="123"
                  :show-file-list="false"
                  :on-success="handleTextSuccess"
                  :before-upload="beforeTextUpload">
                  <el-button size="small" type="primary">上传</el-button>
                </el-upload>
                <!-- <el-button type="primary" size="small">选择文件</el-button> -->
                <b>{{excelName}}</b>
                <p>文件格式必须为xlsx格式</p>
              </div>
            </el-step>
          </el-steps>
        </div>
        <div v-show="uuIdFlagBool" class="progress-wrap">
          <div class="progress-step">
            <el-progress :percentage="processData"></el-progress>
          </div>
          <p v-show="errorProcessBool" class="error-tip">部分门店导入错误，请到错误日志查看错误记录</p>
        </div>
        <!-- <div class="btn-wrap">
          <el-button type="primary">导入数据库</el-button>
        </div> -->
      </div>
      <div v-show="activeitem==3" class="right-box" >
        <div class="top-wrap clearfix">
          <div class="error-num fl">导入总条数：{{total}}条，成功导入{{success}}条，<span>错误{{error}}条</span></div>
          <div class="import-btn fr"><el-button @click="importErrorData" type="primary">导出错误记录</el-button></div>
        </div>
        <el-table
          ref="singleTable"
          :data="tableData"
          v-loading="loading"
          style="width: 100%;font-size:12px;">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="errorMessage"
            label="错误提示"
            width="120">
            <template slot-scope="scope"><p style="color:#f56c6c">{{scope.row.errorMessage}}</p></template>
          </el-table-column>
          <el-table-column
            prop="storeGroupName"
            label="门店分组"
            width="80">
          </el-table-column>
          <el-table-column
            prop="storeArea"
            label="门店面积"
            width="80">
          </el-table-column>
           <el-table-column
            prop="storeName"
            label="门店名称"
            width="80">
          </el-table-column>
           <el-table-column
            prop="storeCode"
            label="门店code"
            width="80">
          </el-table-column>
           <el-table-column
            prop="storeType"
            label="门店类型"
            width="80">
          </el-table-column>
           <el-table-column
            prop="conactsPhone"
            label="门店电话"
            width="100">
          </el-table-column>
           <el-table-column
            prop="province"
            label="省"
            width="80">
          </el-table-column>
           <el-table-column
            prop="city"
            label="市"
            width="80">
          </el-table-column>
           <el-table-column
            prop="region"
            label="区"
            width="80">
          </el-table-column>
           <el-table-column
            prop="storeAddress"
            label="门店详细地址"
            min-width="100">
          </el-table-column>
           <el-table-column
            prop="longitude"
            label="经度"
            width="120">
          </el-table-column>
          <el-table-column
            prop="latitude"
            label="纬度"
            width="120">
          </el-table-column>
          <el-table-column
            prop="clerkName"
            label="店长"
            width="80">
          </el-table-column>
          <el-table-column
            prop="clerkGender"
            label="性别"
            width="60">
          </el-table-column>
          <el-table-column
            prop="clerkCode"
            label="店长编码"
            width="120">
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="手机号码"
            width="100">
          </el-table-column>
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
  </div>
  <vue-gic-footer></vue-gic-footer>
</div>
</template>

<script>
  import navbar from 'components/navbar/navbartwo'
  import excelConfig from '../../../common/js/excel_config.js'
  let qs = require('qs')
  export default {
    name: "shop_recycle_member",
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
            name: '批量导入门店',
            path: ''
          }
        ],
        navtab: [
          {
            name: '导入门店',
            tab: 2
          },
          {
            name: '错误日志',
            tab: 3
          }
        ],
        activeitem: 2,
        loading:false,
        tableData: [],
        total:0,
        error:0,
        success:0,
        uuId:'',  // 32位的随机数
        excelName:'', // 上传的文件名

        processData:0,
        uuIdFlag:'',
        uuIdFlagBool:false,
        errorProcessBool:false,
        timer:'', // 定时器
        timer1:'', // 定时器

        totalCount:0,
        currentPage:1,
        pageSize:20
      }
    },
    created(){
      this.getImportFlag();
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods: {
      getCurTab(val){   // 切换
        this.activeitem = val;
        if(val=='3'){
          this.getErrorList();  // 获取错误日志
        }
      },
      getImportFlag(){  // 开始导入数据库
        var self = this;
       self.axios.get('/api-admin/get-importing-task-key',{
          params:{
            requestProject:'gic-web'
          }
        }).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){   
           self.uuIdFlag = data.result;
            if(self.uuIdFlag==''){
              
            }else{
              this.uuIdFlagBool = true;
              this.timer = setInterval( ()=>{
                self.getProcess(self.uuIdFlag);
              },1000);
            }
          }
        })
      },
      getProcess(uuid){   // 获取进度条  有的话  需要文件名
        // console.log(uuid);
        this.axios.get('/api-admin/get_store_batch_process',{
          params:{
            requestProject:'gic-web',
            uuId:uuid
          }
        }).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){   
            this.processData = data.result.process;
            if(this.processData==100){
              clearInterval(this.timer);
              clearInterval(this.timer1);
              // this.uuIdFlagBool = false;
              this.$message.success('导入成功')
            }
          }
        })
      },
      downloadFile(){   // 下载模板
        this.axios.get('/api-admin/store-import-template-download',{
          params:{
            requestProject:'gic-web'
          }
        }).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode){   // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            this.$message({
              type: 'error',
              message: data.message
            });
          }else{
            window.location.href = excelConfig.config + '/api-admin/store-import-template-download?requestProject=gic-web';
          }
        })
      },
      beforeTextUpload(uploadFile) {
        var self = this;
        self.uuIdFlagBool = false;
        self.errorProcessBool = false; // 关闭导入错误的提示
        self.processData = 0;
        console.log(uploadFile);
        self.getUuid(); // 32位随机数
        let fd = new FormData();
        fd.append('file', uploadFile);
        fd.append('uuId', this.uuId);
        fd.append('requestProject', 'gic-web');
        self.axios.post('/api-admin/store-tmp-file-upload', fd).then((res)=> {//成功后回调
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            self.excelName = uploadFile.name;
            // this.qrCodeArray = JSON.stringify(data.result);
            self.$message({
              type:'success',
              message:'上传成功'
            })
            this.uuIdFlagBool = true;
            if(data.result==null){
              this.timer1=setInterval(function(){
                self.getProcess(self.uuId);
              },1000);
            }else{
              this.timer1 = '';
              self.processData = 100;
              self.errorProcessBool = true; // 导入出错时
            }
          }else{
            self.$message({
              type:'error',
              message:data.message
            })
          }
        });
        return true
      },
      handleTextSuccess(res,uploadFile) {   // 文件上传成功
        // console.log(file);
      },
      getUuid() { // 也即每次上传成功之后的随机数
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        this.uuId = s.join("");
        return this.uuId
      },
      getErrorList(){ // 错误日志
        this.loading = true;
        this.axios.post('/api-admin/store-import-load-error-data',qs.stringify({
          requestProject:'gic-web',
          currentPage:this.currentPage,
          pageSize:this.pageSize
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          this.loading = false;
          if(data.errorCode==0){
            this.tableData = data.result.errorData.result;
            this.total = data.result.total;
            this.error = data.result.error;
            this.success = data.result.success;
            this.totalCount = data.result.errorData.totalCount;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      importErrorData(){   // 导出错误记录
        this.axios.get('/api-admin/export-error-data',{
          params:{
            requestProject:'gic-web'
          }
        }).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode){   // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            this.$message({
              type: 'error',
              message: data.message
            });
          }else{
            window.location.href = excelConfig.config + '/api-admin/export-error-data?requestProject=gic-web';
          }
        })
      },
      handleSizeChange(val){    // 选择分页符
        this.pageSize = val;
        this.getErrorList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getErrorList();
      },
    },
    components: {
      navbar
    }       
  }
</script>

<style lang="less" scoped>
  .right-box{
    .bind-info{
      border: 1px solid #1890ff;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 4px;
      background: #ecf5ff;
      color: rgba(0, 0, 0, 0.65);
      p{
        line-height: 30px;
        position: relative;
        padding-left: 16px;
        font-size: 14px;
        &:before{
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          width: 6px;
          height: 6px;
          background: #1890ff;
          border-radius: 50%;
        }
      }
    }
    .begin-title{
      font-size: 16px;
      margin: 24px 0;
      color: #606266;
    }
    .step-wrap{
      height: 150px;
      span{
        color: #606266;
        font-size: 14px;
      }
      .first-step{
        span{
          margin-right: 5px;
        }
      }
      b{
        font-size: 12px;
        color: #1890ff;
        padding-left: 5px;
      }
      p{
        padding-left: 149px;
        color: #606266;
        font-size: 12px;
        padding-top: 5px;
      }
      .upload-demo{
        display: inline-block;
      }
    }
    .btn-wrap{
      margin-top: 24px;
      margin-left: 35px;
    }
  }
  .top-wrap{
    margin-bottom: 24px;
    .error-num{
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #606266;
      span{
        color: #f56c6c;
      }
    }
  }
  .progress-wrap{
    margin: 24px 0 24px 35px;
    .progress-step{
      width: 365px;
      display: inline-block;
    }
    .error-tip{
      font-size: 14px;
      color: #f56c6c;
      display: inline-block;
    }
  }
  .pagination{
    text-align: right;
    padding-top: 20px;
  }
  .step-wrap /deep/ .el-step.is-vertical .el-step__title{
    padding: 0;
  }
</style>
