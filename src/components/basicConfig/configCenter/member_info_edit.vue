<template>
  <div class="right-wrap">
  	<topNav v-if="editNav" :navpath="navpathedit"></topNav>
    <topNav v-else :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="right-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="字段名称" prop="name" class="text-content">
            <div class="keyword-input">
              <el-input :disabled="editNav" v-model="ruleForm.name" @keyup.native="toInput(ruleForm.name,$event)"></el-input>
              <span class="text-num">{{inputNum}}/{{inputLength}}</span>
            </div>
          </el-form-item>
          <el-form-item label="字段类型">
            <el-radio-group @change="selectType" :disabled="editNav" v-model="ruleForm.radio">
              <el-radio label="0">输入框</el-radio>
              <el-radio label="2">单选框</el-radio>
              <el-radio label="1">多选框</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="ruleForm.radio=='0'">
            <el-form-item label="文本类型">
              <el-radio-group :disabled="editNav" v-model="ruleForm.textRadio">
                <el-radio label="0">仅数字</el-radio>
                <el-radio label="1">仅日期</el-radio>
                <el-radio label="2">通用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :disabled="editNav" label="字符限制" style="height:40px;">
              <el-radio-group :disabled="editNav" v-model="ruleForm.limit">
                <el-radio label="0">不限制字符</el-radio>
                <el-radio label="1">限制</el-radio><div v-show="ruleForm.limit=='1'" class="limit-wrap"><el-input :disabled="editNav" @focus="limitInput" @keyup.native="onlyNumTime" class="limit-input" v-model="ruleForm.limitNum"></el-input><p>字符以内</p></div>
              </el-radio-group>
            </el-form-item>
          </div>

          <div v-show="ruleForm.radio=='2'">
            <div @mouseenter="addKeywordState(index)" @mouseleave="remomveKeywordState(index)" v-for="(domain, index) in ruleForm.addKeyword" class="keyword-input-item-hook clearfix" :key="index">
              <el-form-item
                :label="'单选项' + (index+1)"
                :key="index"
                class="text-content fl">
                <div class="keyword-input">
                  <el-input :disabled="editNav" v-model="domain.name" @keyup.native="toKeyword(index,$event)"></el-input>
                  <span class="text-num">{{domain.keyNum}}/{{inputLength}}</span>
                </div>
              </el-form-item>
              <el-radio @change="selectDefault" class="select-radio fl" v-model="radio" :label="index">设为默认</el-radio>
              <div class="operate-btn fl" v-show="!editNav">
                <b v-show="(index+1)==ruleForm.addKeyword.length" class="add-keyword-btn" @click="addKeywordBtn">添加</b>
                <b v-show="ruleForm.addKeyword.length>2 && (index+1)!=ruleForm.addKeyword.length && index!=0" class="remove-keyword-btn" @click="removeKeywordBtn(domain)">删除</b>
              </div>
            </div>
          </div>

          <div v-show="ruleForm.radio=='1'">
            <div @mouseenter="addKeywordState2(index)" @mouseleave="remomveKeywordState2(index)" v-for="(domain, index) in ruleForm.addKeyword2" class="keyword-input-item-hook2 clearfix" :key="index">
              <el-form-item
                :label="'多选项' + (index+1)"
                :key="index"
                class="text-content fl">
                <div class="keyword-input">
                  <el-input :disabled="editNav" v-model="domain.name" @keyup.native="toKeyword2(index,$event)"></el-input>
                  <span class="text-num">{{domain.keyNum}}/{{inputLength}}</span>
                </div>
              </el-form-item>
              <div class="operate-btn fl" v-show="!editNav">
                <b v-show="(index+1)==ruleForm.addKeyword2.length" class="add-keyword-btn2" @click="addKeywordBtn2">添加</b>
                <b v-show="ruleForm.addKeyword2.length>2 && (index+1)!=ruleForm.addKeyword2.length && index!=0" class="remove-keyword-btn2" @click="removeKeywordBtn2(domain)">删除</b>

                <!-- <b v-show="(ruleForm.addKeyword2.length==2 && (index)!=ruleForm.addKeyword2.length) || (ruleForm.addKeyword2.length>2 && (index+1)==ruleForm.addKeyword2.length)" class="add-keyword-btn2" @click="addKeywordBtn2">添加</b>
                <b v-show="ruleForm.addKeyword2.length>2 && (index+1)!=ruleForm.addKeyword2.length" class="remove-keyword-btn2" @click="removeKeywordBtn2(domain)">删除</b> -->
              </div>
            </div>
          </div>
  
          <el-form-item label="允许会员修改">
            <el-radio-group :disabled="editNav" v-model="ruleForm.allow">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="!editNav">
            <el-button @click="saveBtn" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
  	</div>
    <vue-gic-footer></vue-gic-footer>
  </div>
  
</template>

<script>
	import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen';
  let qs = require('qs')
  export default {
    name: "member_info_edit",
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
            name: '会员信息字段',
            path: '/member_info'
          },
          {
            name: '新增字段',
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
            name: '会员信息字段',
            path: '/member_info'
          },
          {
            name: '字段详情',
            path: ''
          }
        ],
        ruleForm:{
          name:'',
          radio:'0',
          textRadio:'2',
          limit:'0',
          limitNum:'',
          allow:'0',
          keyCount:0, // 关键词个数，id
          addKeyword:[{
            name:'',
            keyNum: 0,
            id:0,
            checked:1
          },{
            value:'',
            keyNum: 0,
            id:1,
            checked:0
          }],
          addKeyword2:[{
            name:'',
            value:'',
            keyNum: 0
          },{
            value:'',
            name:'',
            keyNum: 0
          }]
        },
        rules: {
          name: [
            { required: true, message: '请输入字段名称', trigger: 'blur' }
          ]
        },
        inputNum: 0,        // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 10,   // 限制最大字数

        memberFieldId:'',
        editNav:false,

        radio:0,    // 单选框 是否默认
        radio2:0,    // 多选框 是否默认
        fieldContent:'',
        fieldContentArr:[]
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
      this.getRouterData();
    },
    methods:{
      getRouterData(){    // 获取路由参数，判断是新增还是详情
        this.memberFieldId = this.$route.query.id;
        if(this.memberFieldId==undefined || this.memberFieldId==""){    // 新增
          this.editNav = false;
          this.memberFieldId = null;
        }else{
          this.editNav = true;
          this.getEditData(this.memberFieldId)
        }
      },
      getEditData(id){    // 获取编辑的信息
        this.axios.post('/api-admin/member-field-detail',qs.stringify({
          requestProject:'gic-web',
          id:id
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.ruleForm.name = data.result.fieldName; // 字段名称
            this.ruleForm.radio = data.result.fieldType.toString(); // 字段类型
            this.fieldContent = data.result.fieldContent;
            this.fieldContentArr = eval('('+this.fieldContent+')');
            console.log(this.fieldContentArr);
            // this.ruleForm.textRadio = data.result.
            if(this.ruleForm.radio == '0'){ // 输入框
              if(this.fieldContentArr[0].type=="number"){
                this.ruleForm.textRadio = '0'
              }else if(this.fieldContentArr[0].type=="date"){
                this.ruleForm.textRadio = '1'
              }else if(this.fieldContentArr[0].type=="input"){
                this.ruleForm.textRadio = '2'
              }
              if(data.result.limitCount==-1){  // 字符限制的选择
                this.ruleForm.limit = "0"
              }else{
                this.ruleForm.limit = "1";
                this.ruleForm.limitNum = data.result.limitCount;
              }
            } else if(this.ruleForm.radio == '2'){ // 单选框
              var objArr = [];
              this.fieldContentArr.forEach((item,index)=>{
                var obj = {};
                obj.name = item.name;
                var l = strLength.getZhLen(item.name);  // 关键词的字符长度
                obj.keyNum = l;
                objArr.push(obj);
                if(item.checked=='checked'){
                  this.radio = index;
                }
              })
              this.ruleForm.addKeyword= objArr;
            } else if(this.ruleForm.radio == '1'){ // 复选框
              var objArr = [];
              this.fieldContentArr.forEach((item)=>{
                var obj = {};
                obj.name = item.name;
                var l = strLength.getZhLen(item.name);  // 关键词的字符长度
                obj.keyNum = l;
                objArr.push(obj);
              })
              this.ruleForm.addKeyword2= objArr;
            }
            this.ruleForm.allow = data.result.fieldEdited.toString();  // 是否允许会员修改
            this.inputNum = strLength.getZhLen(this.ruleForm.name);
          }
        })
      },
      toInput(value,e) {          // 控制字符数量
        var that = this;
        that.ruleForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.ruleForm.name);
      },
      limitInput(){
        this.ruleForm.limit="1"
      },
      onlyNumTime(){
        this.ruleForm.limitNum=this.ruleForm.limitNum.replace(/\D/g,'');
      },
      toKeyword(idx,e) {          // 控制单选项字符数量
        var that = this;
        that.ruleForm.addKeyword[idx].name = strLength.getByteVal(e.target.value,that.inputLength);
        that.ruleForm.addKeyword[idx].keyNum = strLength.getZhLen(that.ruleForm.addKeyword[idx].name);
        // console.log(that.ruleForm.addKeyword);
      },
      selectDefault(val){    // 选择默认
        console.log(val);
      },
      addKeywordBtn(){    // 增加关键词
        // this.addKeywordLength++;
        this.ruleForm.addKeyword.push({
          name: '',
          keyNum: 0
          // key: this.addKeywordLength
        });
      },
      removeKeywordBtn(item) {  // 删除关键词
        this.$confirm('确定移除该单选项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var index = this.ruleForm.addKeyword.indexOf(item);
          if (index !== -1) {
            this.ruleForm.addKeyword.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          
        }).catch(() => {
           this.$message({
            type: 'info',
            message: '已取消删除'
           });          
        });  
      },
      addKeywordState(idx){
        var total = this.ruleForm.addKeyword.length;
        if(total==2){
          var keywordInput = document.getElementsByClassName('keyword-input-item-hook')[idx];
          var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn')[0];
          var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn')[0];
          removeKeyword.style.display="none";
          addKeyword.style.display="inline-block";
          if(idx==0){
            addKeyword.style.display="none";
          }
        }
        if(total>2){            
          var keywordInput = document.getElementsByClassName('keyword-input-item-hook')[idx];
          var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn')[0];
          var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn')[0];
          if((idx+1)==total){
            // var index = this.formReply.addKeyword.length-1;
            addKeyword.style.display="inline-block";
            removeKeyword.style.display="inline-block";
          }else{
            addKeyword.style.display="none";
            removeKeyword.style.display="inline-block";
          }
        }
      },
      remomveKeywordState(idx){
        var keywordInput = document.getElementsByClassName('keyword-input-item-hook')[idx];
        var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn')[0];
        var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn')[0];
        removeKeyword.style.display="none";
        addKeyword.style.display="none";
      },
      toKeyword2(idx,e) {          // 控制多选项字符数量
        var that = this;
        that.ruleForm.addKeyword2[idx].name = strLength.getByteVal(e.target.value,that.inputLength);
        that.ruleForm.addKeyword2[idx].keyNum = strLength.getZhLen(that.ruleForm.addKeyword2[idx].name);
      },
      addKeywordBtn2(){    // 增加关键词
        // this.addKeywordLength++;
        this.ruleForm.addKeyword2.push({
          name: '',
          keyNum: 0
          // key: this.addKeywordLength
        });
      },
      removeKeywordBtn2(item) {  // 删除关键词
        this.$confirm('确定移除该多选项吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var index = this.ruleForm.addKeyword2.indexOf(item);
          if (index !== -1) {
            this.ruleForm.addKeyword2.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          
        }).catch(() => {
           this.$message({
            type: 'info',
            message: '已取消删除'
           });          
        });  
      },
      addKeywordState2(idx){
        var total = this.ruleForm.addKeyword2.length;
        //console.log(total);
        if(total==2){
          var keywordInput = document.getElementsByClassName('keyword-input-item-hook2')[idx];
          var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn2')[0];
          var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn2')[0];
          removeKeyword.style.display="none";
          addKeyword.style.display="inline-block";
          if(idx==0){
            addKeyword.style.display="none"
          }
        }
        if(total>2){            
          var keywordInput = document.getElementsByClassName('keyword-input-item-hook2')[idx];
          var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn2')[0];
          var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn2')[0];
          if((idx+1)==total){
            // var index = this.formReply.addKeyword.length-1;
            addKeyword.style.display="inline-block";
            removeKeyword.style.display="inline-block";
          }else{
            addKeyword.style.display="none";
            removeKeyword.style.display="inline-block";
          }
        }
      },
      remomveKeywordState2(idx){
        var keywordInput = document.getElementsByClassName('keyword-input-item-hook2')[idx];
        var addKeyword = keywordInput.getElementsByClassName('add-keyword-btn2')[0];
        var removeKeyword = keywordInput.getElementsByClassName('remove-keyword-btn2')[0];
        removeKeyword.style.display="none";
        addKeyword.style.display="none";
      },
      selectType(val){ // 选择字段类型
        this.ruleForm.radio = val;
      },
      saveBtn(){    // 保存  新增
        if(this.ruleForm.name==""){
          this.$message.error('请输入字段名称');
          return;
        }
        // var limitNum = this.ruleForm.limitNum;
        if(this.ruleForm.radio == '0'){ // 输入框
          var textObj = {};
          this.fieldContentArr = [];
          if(this.ruleForm.textRadio == '0'){
            textObj.type="number"
          } else if(this.ruleForm.textRadio == '1'){
            textObj.type="date"
          } else if(this.ruleForm.textRadio == '2'){
            textObj.type="input"
          }
          this.fieldContentArr.push(textObj);
          this.fieldContent = JSON.stringify(this.fieldContentArr);
          if(this.ruleForm.limit == "0"){  // 字符限制的选择
            // limitNum = -1
            this.ruleForm.limitNum = -1
          }else{
            if(this.ruleForm.limitNum=="" || this.ruleForm.limitNum== -1){
              this.$message.error('请输入限制多少字符');
              return;
            }else{
              // limitNum = this.ruleForm.limitNum
            }
          }
        } else if(this.ruleForm.radio == '1'){ // 复选框
          // console.log(this.ruleForm.addKeyword2);
          var checkArr = [];
          var valCount2 = 0;
          this.ruleForm.addKeyword2.forEach((item)=>{
            if(item.name!=''){
              valCount2 ++ ;
            }
          })
          console.log(this.ruleForm.addKeyword2);
          if(valCount2 != this.ruleForm.addKeyword2.length){
            this.$message({
              type:'error',
              message:'请输入多选项'
            })
            return;
          }else{
            this.ruleForm.addKeyword2.forEach((item)=>{
              var checkObj = {};
              checkObj.type = 'checkbox';
              checkObj.name = item.name;
              checkArr.push(checkObj);
            })
            this.fieldContent = JSON.stringify(checkArr);
            this.ruleForm.limitNum = "-1"
          }
        } else if(this.ruleForm.radio == '2'){ // 单选框
          // console.log(this.ruleForm.addKeyword);
          var radioArr = [];
          var valCount = 0;
          this.ruleForm.addKeyword.forEach((item)=>{
            if(item.name!=''){
              valCount ++ ;
            }
          })
          if(valCount != this.ruleForm.addKeyword.length){
            this.$message({
              type:'error',
              message:'请输入单选项'
            })
            return;
          }else{
            this.ruleForm.addKeyword.forEach((item)=>{
              var radioObj = {};
              radioObj.type = 'radio';
              radioObj.name = item.name;
              radioArr.push(radioObj);
            })
            radioArr[this.radio].checked="checked";
            this.fieldContent = JSON.stringify(radioArr);
            this.ruleForm.limitNum = "-1"
          }
        }
        this.axios.post('/api-admin/member-field-save',qs.stringify({
          requestProject:'gic-web',
          fieldName:this.ruleForm.name,
          fieldType:parseInt(this.ruleForm.radio),
          fieldContent:this.fieldContent,
          limitCount:parseInt(this.ruleForm.limitNum),
          fieldEdited:parseInt(this.ruleForm.allow)
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.$message.success('保存成功');
            this.$router.push('member_info')
          }else{
            this.$message.error(data.message);
          }
        })
      }
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
    background: #fff;
    padding: 24px 32px;
    .keyword-input{
      position: relative;
      width: 420px;
      .text-num{
        position: absolute;
        right: 10px;
        bottom: 0;
        color: #c0c4cc;
        font-size: 12px;
      }
    }
    .limit-input{
      width: 120px;
      margin: 0 10px;
    }
    .keyword-input{
      position: relative;
      width: 420px;
      .text-num{
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
    .operate-btn{
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      padding-left: 10px;
      color: #1890ff;
      b{
        cursor: pointer;
        padding-right: 5px;
      }
    }
    .item-label{
      font-size: 14px;
      color: #606266;
      margin-bottom: 30px;
      span{
        display: inline-block;
        width: 80px;
      }
    }
  }
  .limit-wrap{
    display: inline-block;
    font-size: 14px;
    color: #606266;
    p{
      display: inline-block;
    }
  }
  .select-radio{
    height: 36px;
    line-height: 36px;
    margin-left: 10px;
  }
</style>
