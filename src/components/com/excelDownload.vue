<template>
  <!-- 导出数据 -->
  <el-dialog
    title="导出数据"
    :visible.sync="myDialogVisible"
    width="500px"
    @close="closeDialog">
    <div class="outer-dialogwrap">
      <ul class="clearfix">
        <li class="item " :class="{'fl':type=='2'}">
          <div class="img">
            <img src="../../../static/img/data1.svg" alt="">
          </div>
          <p class="title">脱敏数据</p>
          <p class="info">将敏感信息实现隐私保护</p>
          <el-button v-if="!goReportBool" type="primary" plain @click="senReport">生成报告</el-button>
          <el-button v-else type="primary" @click="senGoReport">去报告中心</el-button>
        </li>
        <li class="item fl item2" v-if="type=='2'">
          <div class="img">
            <img src="../../../static/img/data2.svg" alt="">
          </div>
          <p class="title">完整数据</p>
          <p class="info">未进行敏感数据隐私保护</p>
          <el-button v-if="!goReportAllBool" type="warning" plain @click="allReport" :disabled="allDataBool">生成报告</el-button>
          <el-button v-else type="warning" @click="senGoReport">去报告中心</el-button>
        </li>
      </ul>
    </div>
    <el-dialog
      width="680px"
      title="下载申请"
      :visible.sync="dialogDndVisible"
      append-to-body>
      <div class="inner-dialogwrap">
        <div class="lt-content">
          <p>该报表包含敏感数据信息，为了数据安全考虑，</p>
          <p>您所下载的数据信息将会发送到相关审核员审核，审核通过后您将获得生成该报表的权限。</p>
          <div class="btn">
            <el-row>
              <el-button @click="dialogDndVisible=false">取消</el-button>
              <el-button @click="sureApplyBtn" type="primary">发送</el-button>
            </el-row>
          </div>
        </div>
        <div class="rt-content">
          <ul>
            <li v-for="item in tableData" :key="item.auditorId">
              <p class="checker-name">{{ item.auditorName }}</p>
              <p>{{ item.mobilePhone }}</p>
            </li>
          </ul>
          <div v-if="tableData && tableData.length<1" class="no-data-wrap">
            <div class="no_checker_icon" >
              <img src="../../../static/img/no_checker_icon.png" alt="">
            </div>
            <p>暂无审核人员</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  let qs = require('qs')
  export default {
    name:'excelDownload',
    data(){
      return {
        myDialogVisible:false,
        goReportBool:false,
        allDataBool:false,
        // 完整数据
        dialogDndVisible:false,
        goReportAllBool:false,
        tableData: [],
        downloadReportId:''
      }
    },
    props:{
      dialogVisible:{
        type:Boolean,
        default:false
      },
      excelUrl:{
        type:String,
        default:''
      },
      type:{
        type:Number,
        default:1
      },
      params:{
        type:Object,
        default:{}
      },
      projectName:{
        type:String,
        default:'gic-web'
      },
    },
    watch:{
      dialogVisible(val){
        this.myDialogVisible = val;
        // 还原最初状态
        this.goReportBool = false;
        this.allDataBool = false;
        this.goReportAllBool = false;
      },
    },
    methods:{
      closeDialog(){  // 关闭  导出数据的弹框
        this.$emit('update:dialogVisible', false);
      },
      senReport(){ // 脱敏数据 生成报告
        if(this.type=='2'){
          this.params.dataType = 1;
        }
        this.axios.post(this.excelUrl,qs.stringify(
          this.params
        )).then(res=>{
          var data = res.data;
          if(data.errorCode == 0){
            this.goReportBool = true;
            this.$message.success('您下载的数据已为您打包好，请点击下面按钮去报告中心');
            this.allDataBool = true;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      senGoReport(){  // 脱敏数据 完整数据  去报告中心
        let url = '//' + window.location.host + '/gic-web/#/reportCenter';
        window.location.href = url;
      },
      async allReport(){  // 完整数据 生成报告  需申请
        this.tableData = await this.getCheckerList();
        if(this.tableData.length<1){
          this.$confirm('该商户还没有审核员，请联系超级管理员新增审核员。', '提示', {
            confirmButtonText: '知道了',
            cancelButtonText: '取消',
            showCancelButton:false,
            type: 'warning',
          }).then(() => {
            
          }).catch(() => {
            
          });
        }else{
          if(this.type=='2'){
            this.params.dataType = 2;
          }
          this.axios.post(this.excelUrl,qs.stringify(
            this.params
          )).then(res=>{
            var data = res.data;
            if(data.errorCode == 0){
              this.dialogDndVisible = true;
              this.downloadReportId = data.result
            }else{
              this.$message.error(data.message)
            }
          })
        }
      },
      sureApplyBtn(){  // 完整数据  发送申请
        this.axios.post('/api-admin/apply-download-report',qs.stringify({
          requestProject:this.projectName,
          downloadReportId:this.downloadReportId
        })).then(res=>{
          var data = res.data;
          if(data.errorCode == 0){
            this.dialogDndVisible = false;
            this.goReportAllBool = true;
            this.$message.success('申请请求发送成功')
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getCheckerList(){ // 获取审核员列表
        return new Promise((resolve,reject)=>{
          this.axios.post('/api-admin/list-auditor',qs.stringify({
            requestProject:this.projectName
          })).then(res => {
            let resData = res.data;
            if (resData.errorCode == 0) {
              var dataArr = resData.result?resData.result:[];
              resolve(dataArr);
            }else{
              reject([])
              this.$message.error({
                duration: 1000,
                message: resData.message
              });
            }
          })
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .outer-dialogwrap{
    padding: 10px 40px 30px;
    height: 250px;
    .item{
      width: 160px;
      text-align: center;
      margin: 0 auto;
      .img{
        width: 110px;
        height: 87px;
        margin: 0 auto;
      }
      img{
        width: 100%;
        height: 100%;
      }
      .title{
        color: #303133;
        font-size: 16px;
        line-height: 22px;
        margin: 18px 0 10px 0;
      }
      .info{
        font-size: 13px;
        line-height: 18px;
        margin-bottom: 24px;
      }
    }
    .item2{
      margin-left: 50px;
    }
  }
  .inner-dialogwrap{
    display: flex;
    margin-top: -20px;
    border-top: 1px solid #dcdfe6;
    .lt-content{
      padding: 35px 45px 0 30px;
      flex: 0 0 440px;
      width: 440px;
      border-right: 1px solid #dcdfe6;
      p{
        font-size: 14px;
        color: #303133;
        line-height: 20px;
      }
      .btn{
        text-align: center;
        margin: 165px 0 36px;
        padding: 0;
      }
    }
    .rt-content{
      flex: 1;
      overflow-y: auto;
      height: 340px;
      li{
        padding: 13px 0 13px 20px;
        border-bottom: 1px solid #dcdfe6;
        font-size: 14px;
        color: #606266;
        line-height: 20px;
        &:last-child{
          margin-top: 4px;
        }
        .checker-name{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
  .no-data-wrap{
    text-align: center;
    padding: 40px 0 0 0;
    line-height: 1;
    .no_checker_icon{
      width: 80px;
      height: 56px;
      margin: 0 auto;
      margin-bottom: 22px;
      img{
        width: 100%;
      }
    }
    p{
      color: #909399;
    }
  }
  .fl{
    float: left;
  }
  .clearfix:before, .clearfix:after {
    display: block;
    visibility: hidden;
    height: 0;
    content: "";
    clear: both;
  }
</style>
