<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="bottom-content-wrap">
        <div class="add-btn">
          <el-button @click="addScene('add')" type="primary">添加营销场景</el-button>
        </div>
        <el-table
          class="table-no-line-wrap"
          :data="tableData"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="scene"
            label="营销场景">
            <template slot-scope="scope">
              {{scope.row.sceneName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status == 1 ? true: false" @change='changeStatus(scope.row.sceneSettingId,scope.row.status)'></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="ope"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="addScene('edit',scope.row)" type="text">编辑</el-button>
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
    <el-dialog @close="cancelDialogBtn('ruleForm')" :title="title" :visible.sync="dialogFormVisible" width="500px">
      <el-form :rules="rules" ref="ruleForm" :model="form" label-width="110px">
        <el-form-item label="营销场景名称" prop="name" class="active-name">
          <el-input v-model="form.name" @keyup.native="toInput(form.name,$event)"></el-input>
          <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
        </el-form-item>
        <el-form-item label="是否启用" style="margin-bottom:0">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialogBtn('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="saveDialogBtn('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import {isCommonCode} from '../../../common/js/validate'
  let qs = require('qs')
  var commonCode=(rule, value,callback)=>{    //定义一个全局的变量  特殊字符的验证
    if (!value){
      callback(new Error('请输入营销场景名称'))
    }else if (!isCommonCode(value)){
      callback(new Error('场景名称不允许有特殊符号'))
    }else {
      callback()
    }
  }
  export default {
    name: "marketing_scene",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '营销场景配置',
            path: ''
          }
        ],
        tableData: [],
        delivery:true,
        loading:false,
        currentPage:1,
        pageSize:20,
        totalCount:null,
        dialogFormVisible:false,
        form:{
          name:'',
          status:true
        },
        rules:{
          name:[
            { required: true, trigger: 'blur', validator: commonCode }  //这里需要用到全局变量
          ]
        },
        title:'',
        inputNum: 0,    // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 10,  // 限制最大字数

        dialogDeleteStore:false,
        selectId:'',
        selectState:''
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getSceneList(this.currentPage,this.pageSize)
    },
    methods:{
      getSceneList(page,size){
        this.loading=true;
        this.axios.post('/api-admin/scene-setting-page',qs.stringify({
          requestProject:'gic-web',
          currentPage:page,
          pageSize:size
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.loading=false;
            this.tableData = data.result.result;
            this.totalCount = data.result.totalCount;
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      handleSizeChange(val){    // 选择分页符
        this.pageSize = val;
        this.getSceneList(this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getSceneList(this.currentPage,this.pageSize)
      },
      changeStatus(id,status){   // 切换状态
        this.selectId = id;
        this.selectState = status;
        if(this.selectState==1){
          this.$confirm('停用该营销场景，不会影响之前的数据；停用后，对应的各营销模板将无法在营销场景下拉选项中搜索到此选项；请确认停用该营销场景?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.selectState=0;
            this.changeState();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消停用'
            });          
          });
        }else if(this.selectState==0){
          this.selectState=1;
          this.changeState();
        }
      },
      stopBtn(){
        this.dialogDeleteStore = false;
        this.changeState();
      },
      changeState(){
        this.loading=true;
        this.axios.post('/api-admin/marketing-scene-update-status',qs.stringify({
          requestProject:'gic-web',
          sceneSettingId:this.selectId,
          status:this.selectState
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.loading=false;
            // row.status=status;
            this.getSceneList(this.currentPage,this.pageSize);
            this.$message.success(data.message)
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      toInput(value,e) {  // 名称输入时控制字符数量
        var that = this;
        that.form.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.form.name);
      },
      addScene(type,row){ // 编辑营销场景
        this.dialogFormVisible = true;
        if(type=="add"){
          this.title="添加营销场景";
          this.sceneSettingId='';
          this.form.name = '';
          this.form.status=true;
          var len = strLength.getZhLen(this.form.name);  // 规则名称的字符长度
          this.inputNum = len;
        } else if(type=="edit"){
          this.title="修改营销场景";
          this.sceneSettingId=row.sceneSettingId;
          // this.form.status=row.status;
          this.form.name = row.sceneName;
          if(row.status==1){
            this.form.status=true
          }else if(row.status==0){
            this.form.status=false
          }
          var len = strLength.getZhLen(this.form.name);  // 规则名称的字符长度
          this.inputNum = len;
        }
      },
      cancelDialogBtn(formName){
        this.dialogFormVisible = false;
        this.$refs[formName].clearValidate();
      },
      saveDialogBtn(formName){    // 修改 添加 保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.status==true){
              this.form.status=1
            }else if(this.form.status==false){
              this.form.status=0
            }
            this.axios.post('/api-admin/do-edit-scene',qs.stringify({
              requestProject:'gic-web',
              sceneSettingId:this.sceneSettingId,
              status:this.form.status,
              sceneName:this.form.name
            })).then((res)=>{
              this.dialogFormVisible = false;
              var data = res.data;
              console.log(data);
              if(data.errorCode==0){
                this.getSceneList(this.currentPage,this.pageSize);
                this.$message.success(data.message)
              }else{
                this.$message({
                  type: 'error',
                  message: data.message
                });
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
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.bottom-content-wrap{
    padding: 24px;
    background: #fff;
    .add-btn{
      margin-bottom: 22px;
      text-align: right;
    }
  }
  .active-name{
    position: relative;
    .tag-name-num{
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
  .delete-store-wrap{
    .delete-store-body{
      .delete-tip-text{
        font-size: 14px;
        color: #606266;
        height: 24px;
        line-height: 24px;
        position: relative;
        i{
          position: absolute;
          color:#e6a23c;
          position: absolute;
          font-size: 24px;
        }
        span{
          padding-left:36px;
        }
      }
    }
  }
  .pagination{
    text-align: right;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
