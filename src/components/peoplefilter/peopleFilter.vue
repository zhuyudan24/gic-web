<template>
  <div>
    <!-- <el-dialog title="可见人群" :close-on-click-modal=false  :before-close="handleClose" @close="closeModal('ruleForm')" :visible.sync="peopleModal" width="500px"> -->
    <el-dialog title="可见人群" :modal-append-to-body="false" :close-on-click-modal=false :before-close="handleClose" @close="closeModal('ruleForm')" :visible.sync="peopleModal" width="500px">
      <div class="dialogwrap">
        <el-form label-position="right" label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="会员等级" class="form-item">
            <el-select size="small" @change="changeGradeLeval" v-model="gradeLevel" multiple placeholder="请选择" style="width: 304px;">
              <el-option v-for="item in memberGrade" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费总额" class="form-item">
            <div class="costallend">
             <div class="costallend-box">
               <el-form-item prop='costAllBegin'>
                  <inputNumber class="costallend-number"
                    v-model="ruleForm.costAllBegin" 
                    controls-position="right"
                    :controls=false         
                    :precision="2" 
                    :min="0" 
                    :max="999999999.99">
                  </inputNumber>
               </el-form-item>
             </div>
              <div class="costallend-text">至</div>
              <div class="costallend-box">
                <el-form-item prop='costAllEnd'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.costAllEnd" 
                    controls-position="right"
                    :controls=false     
                    :precision="2" 
                    :min="0" 
                    :max="999999999.99" >
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-textend">元</div>
            </div>
            <p v-show="(typeof(ruleForm.costAllBegin) == 'undefined' && parseInt(ruleForm.costAllEnd) >-1 ) || (typeof(ruleForm.costAllEnd) == 'undefined' && parseInt(ruleForm.costAllBegin) >-1 ) || parseFloat(ruleForm.costAllBegin) > parseFloat(ruleForm.costAllEnd)" class="el-form-item__error">消费总额格式错误</p>
          </el-form-item>
          <el-form-item label="消费次数" class="form-item">
            <div class="costallend">
              <div class="costallend-box">
                <el-form-item prop='costTimesBegin'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.costTimesBegin" 
                    controls-position="right"
                    :controls=false  
                    :precision="0"                
                    :min="0" 
                    :max="999999999">
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-text">至</div>
              <div class="costallend-box">
                <el-form-item prop='costTimesEnd'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.costTimesEnd" 
                    controls-position="right" 
                    :precision="0"
                    :controls=false
                    :min="0" 
                    :max="999999999.99" >
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-textend">次</div>
            </div>
            <p v-show="(typeof(ruleForm.costTimesBegin) == 'undefined' && parseInt(ruleForm.costTimesEnd) >-1 ) || (typeof(ruleForm.costTimesEnd) == 'undefined' && parseInt(ruleForm.costTimesBegin) >-1 )  || parseInt(ruleForm.costTimesBegin) > parseInt(ruleForm.costTimesEnd)" class="el-form-item__error">消费次数格式错误</p>
          </el-form-item>
          <el-form-item label="客单价" class="form-item">
            <div class="costallend">
              <div class="costallend-box">
                <el-form-item prop='avgCostBegin'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.avgCostBegin" 
                    controls-position="right"
                    :precision="2" 
                    :controls=false
                    :min="0" 
                    :max="999999999.99"
                    :step="0.01">
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-text">至</div>
              <div class="costallend-box">
                <el-form-item prop='avgCostEnd'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.avgCostEnd" 
                    controls-position="right"
                    :controls=false                
                    :precision="2"
                    :min="0" 
                    :max="999999999.99" >
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-textend">元</div>
            </div>
            <p v-show="(typeof(ruleForm.avgCostBegin) == 'undefined' && parseInt(ruleForm.avgCostEnd) >-1 ) || (typeof(ruleForm.avgCostEnd) == 'undefined' && parseInt(ruleForm.avgCostBegin) >-1 )  || parseInt(ruleForm.avgCostBegin) > parseInt(ruleForm.avgCostEnd)" class="el-form-item__error">客单价格式错误</p>
          </el-form-item>
          <el-form-item label="连带率" class="form-item">
            <div class="costallend">
              <div class="costallend-box">
                <el-form-item prop='avgNumberBegin'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.avgNumberBegin" 
                    controls-position="right"
                    :precision="2"
                    :controls=false 
                    :min="0" 
                    :max="999999999.99" 
                    :step="0.01">
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-text">至</div>
              <div class="costallend-box">
                <el-form-item prop='avgNumberEnd'>
                  <inputNumber class="costallend-number" 
                    v-model="ruleForm.avgNumberEnd"
                    controls-position="right"   
                    :precision="2" 
                    :controls=false
                    :min="0" 
                    :max="999999999.99">
                  </inputNumber>
                </el-form-item>
              </div>
              <div class="costallend-textend">件</div>
            </div>
            <p v-show="(typeof(ruleForm.avgNumberBegin) == 'undefined' && parseInt(ruleForm.avgNumberEnd) >-1 ) || (typeof(ruleForm.avgNumberEnd) == 'undefined' && parseInt(ruleForm.avgNumberBegin) >-1 )  ||parseFloat(ruleForm.avgNumberBegin) > parseFloat(ruleForm.avgNumberEnd)" class="el-form-item__error">连带率格式错误</p>
          </el-form-item>
          <el-form-item label="生日" class="form-item">
            <div class="costallend">
              <el-date-picker v-model="birthday" format="MM-dd" 
                type="daterange" 
                range-separator="至" 
                start-placeholder="开始日期"            
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeModal('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
         </span>
    </el-dialog>
  </div>
</template>
<script>
  import {checkFalse, checkSuccess,checkStatus} from "../../common/js/checkStatus.js";
  // 基于elementUI的input-number
  import inputNumber from 'components/com/inputNumber' 

  export default{
    name: 'peopleFilter',
    props: {
      peopleModal: {
        type: Boolean,
        default: false
      },
      limitCondition: {
        type: String,
        default:  ''
      }
    },
    data(){
      return{
        memberGrade:[],
        curlimitCondition: {},
        gradeLevel:[],
        ruleForm:{
          gradeLevel: '',
          gradeLevelName:'',
          avgNumberBegin: -1,
          avgNumberEnd: -1,
          avgCostBegin: -1,
          avgCostEnd: -1,
          costTimesBegin: -1,
          costTimesEnd: -1,
          costAllBegin: -1,
          costAllEnd: -1,
          birthdayMDBeginStr: '',
          birthdayMDEndStr: ''
        },
        rules:{
        },
        birthday: '',
        peopleFilterDetail:"",  // 筛选详情
        sendData:"" , // 要传递的数据
      }
    },
    methods:{
      // handleClose(done) {
      //   this.$confirm('确认关闭？')
      //     .then(_ => {
      //       this.gradeLevel = [];
      //       this.birthday = '';
      //       this.$refs.ruleForm.resetFields();
      //       this.$emit('closeModal');
      //     })
      //     .catch(_ => {});
      // },
      handleClose(done) {
        this.gradeLevel = [];
        this.birthday = '';
        this.$refs.ruleForm.resetFields();
        this.$emit('closeModal');
      },
      closeModal(formName) {
        this.gradeLevel = [];
        this.birthday = '';
        this.$refs[formName].resetFields();
        this.$emit('closeModal');
      },
      // 选择会员等级
      changeGradeLeval(val){
        var arrObj = [];
        val.forEach(child => {
          let obj = {}; 
          obj = this.memberGrade.find((item)=>{
            return item.id === child;//筛选出匹配数据 
          }); 
          arrObj.push(obj);
        })
        var levelName = '';
        arrObj.forEach( obj =>{
          levelName += obj.name + ',';
        })
        this.ruleForm.gradeLevelName = levelName.substring(0,levelName.length-1)
        // console.log(this.ruleForm.gradeLevelName);
      },
      getDetails(limitCondition){ // 编辑时获取数据
        //console.log(limitCondition);
        if(limitCondition) {
          let temp = JSON.parse(limitCondition);
          this.ruleForm.gradeLevel = temp.gradeLevel;
          this.ruleForm.costAllBegin = temp.costAllBegin> -1 ?temp.costAllBegin:-1;
          this.ruleForm.costAllEnd = temp.costAllEnd> -1 ? temp.costAllEnd:-1;
          this.ruleForm.costTimesBegin = temp.costTimesBegin> -1 ? temp.costTimesBegin:-1;
          this.ruleForm.costTimesEnd = temp.costTimesEnd> -1 ?temp.costTimesEnd:-1;
          this.ruleForm.avgCostBegin = temp.avgCostBegin > -1 ? temp.avgCostBegin:-1;
          this.ruleForm.avgCostEnd = temp.avgCostEnd> -1 ?temp.avgCostEnd:-1;
          this.ruleForm.avgNumberBegin = temp.avgNumberBegin > -1 ? temp.avgNumberBegin:-1;
          this.ruleForm.avgNumberEnd = temp.avgNumberEnd> -1 ?temp.avgNumberEnd:-1;
          this.ruleForm.birthdayMDBeginStr = temp.birthdayMDBeginStr;
          this.ruleForm.birthdayMDEndStr = temp.birthdayMDEndStr;
          if(this.ruleForm.gradeLevel && this.ruleForm.gradeLevel.length > 0) {
            this.gradeLevel = this.ruleForm.gradeLevel.split(',');
            this.ruleForm.gradeLevelName = temp.gradeLevelName
          }
          if(this.ruleForm.birthdayMDBeginStr && this.ruleForm.birthdayMDEndStr) {
            this.birthday = [this.ruleForm.birthdayMDBeginStr,this.ruleForm.birthdayMDEndStr];
          }
        }
      },
      getGradeList() {
        this.axios.get('/api-admin/grade-list',{
          params: {
            requestProject: 'gic-web'
          }
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.memberGrade = res.data.result;
            this.getDetails(this.limitCondition)
          }else {
            checkFalse('会员列表获取失败');
            this.$emit('closeModal');
          }
        }).catch(err => {
          checkStatus(err);
        })
      },
      submitForm(formName) {
        // 消费总额
        if((typeof(this.ruleForm.costAllBegin) == 'undefined' && parseInt(this.ruleForm.costAllEnd) >-1 ) || (typeof(this.ruleForm.costAllEnd) == 'undefined' && parseInt(this.ruleForm.costAllBegin) >-1 ) || parseFloat(this.ruleForm.costAllBegin) > parseFloat(this.ruleForm.costAllEnd)){
          return;
        }
        // 消费次数
        if((typeof(this.ruleForm.costTimesBegin) == 'undefined' && parseInt(this.ruleForm.costTimesEnd) >-1 ) || (typeof(this.ruleForm.costTimesEnd) == 'undefined' && parseInt(this.ruleForm.costTimesBegin) >-1 )  || parseInt(this.ruleForm.costTimesBegin) > parseInt(this.ruleForm.costTimesEnd)){
          return;
        }
        // 客单价
        if((typeof(this.ruleForm.avgCostBegin) == 'undefined' && parseInt(this.ruleForm.avgCostEnd) >-1 ) || (typeof(this.ruleForm.avgCostEnd) == 'undefined' && parseInt(this.ruleForm.avgCostBegin) >-1 )  || parseInt(this.ruleForm.avgCostBegin) > parseInt(this.ruleForm.avgCostEnd)){
          return;
        }
        // 连带率
        if((typeof(this.ruleForm.avgNumberBegin) == 'undefined' && parseInt(this.ruleForm.avgNumberEnd) >-1 ) || (typeof(this.ruleForm.avgNumberEnd) == 'undefined' && parseInt(this.ruleForm.avgNumberBegin) >-1 )  ||parseFloat(this.ruleForm.avgNumberBegin) > parseFloat(this.ruleForm.avgNumberEnd)){
          return;
        }
        if(this.birthday) { // 生日
          this.ruleForm.birthdayMDBeginStr = this.fomatDate(this.birthday[0]);
          this.ruleForm.birthdayMDEndStr = this.fomatDate(this.birthday[1]);
        }else{
          this.ruleForm.birthdayMDBeginStr = "";
          this.ruleForm.birthdayMDEndStr = "";
        }
        if(this.gradeLevel.length > 0) { // 会员等级
          let tempArr = this.gradeLevel;
          this.ruleForm.gradeLevel = tempArr.join(',');
        }else {
          this.ruleForm.gradeLevel = '';
        }
        let tempdata = {
          gradeLevel: this.ruleForm.gradeLevel,
          gradeLevelName:this.ruleForm.gradeLevelName,
          costAllBegin:  this.ruleForm.costAllBegin > -1 && this.ruleForm.costAllEnd > -1?this.ruleForm.costAllBegin:-1,
          costAllEnd: this.ruleForm.costAllBegin > -1 && this.ruleForm.costAllEnd > -1 ?this.ruleForm.costAllEnd:-1,
          costTimesBegin: this.ruleForm.costTimesBegin > -1 && this.ruleForm.costTimesEnd > -1? this.ruleForm.costTimesBegin:-1,
          costTimesEnd: this.ruleForm.costTimesBegin > -1 && this.ruleForm.costTimesEnd > -1 ?this.ruleForm.costTimesEnd:-1,
          avgCostBegin: this.ruleForm.avgCostBegin > -1 && this.ruleForm.avgCostEnd > -1 ?this.ruleForm.avgCostBegin:-1,
          avgCostEnd: this.ruleForm.avgCostBegin > -1 && this.ruleForm.avgCostEnd > -1 ?this.ruleForm.avgCostEnd:-1,
          avgNumberBegin: this.ruleForm.avgNumberBegin > -1 && this.ruleForm.avgNumberEnd > -1 ? this.ruleForm.avgNumberBegin:-1,
          avgNumberEnd: this.ruleForm.avgNumberBegin > -1 && this.ruleForm.avgNumberEnd > -1 ? this.ruleForm.avgNumberEnd:-1,
          birthdayMDBeginStr: this.ruleForm.birthdayMDBeginStr,
          birthdayMDEndStr: this.ruleForm.birthdayMDEndStr,
        };
        if(!tempdata.gradeLevel){
          delete tempdata.gradeLevel;
          delete tempdata.gradeLevelName
        }
        // if(tempdata.avgNumberBegin==-1){
        //   delete tempdata.avgNumberBegin;
        //   delete tempdata.avgNumberEnd;
        // }
        // if(tempdata.avgCostBegin==-1){
        //   delete tempdata.avgCostBegin;
        //   delete tempdata.avgCostEnd
        // }
        // if(tempdata.costTimesBegin==-1){
        //   delete tempdata.costTimesBegin;
        //   delete tempdata.costTimesEnd
        // }
        // if(tempdata.costAllBegin==-1){
        //   delete tempdata.costAllBegin;
        //   delete tempdata.costAllEnd
        // }
        if(!tempdata.birthdayMDBeginStr){
          delete tempdata.birthdayMDBeginStr;
          delete tempdata.birthdayMDEndStr
        }
        if(!tempdata.gradeLevel && !(tempdata.costAllEnd >-1) && !(tempdata.costTimesEnd >-1) && !(tempdata.avgCostEnd >-1) && !(tempdata.avgNumberEnd >-1) && !tempdata.birthdayMDEndStr ){
          this.$message.error('请选择限定条件');
          return
        }
        console.log(tempdata);
        this.$emit('getCrowdData',JSON.stringify(tempdata));
        this.$refs[formName].resetFields();
        this.gradeLevel = [];
        this.birthday = '';
      },
      fomatDate(fomatvalue) {
        if(fomatvalue) {
          let date = new Date(fomatvalue);
          let month = date.getMonth() + 1;
          let day = date.getDate();
          if(month < 10){
            month = '0' + month;
          }
          if(day < 10){
            day = '0' + day;
          }
          let result = month + '-' + day;
          return result
        }
      },
    },
    watch: {
      peopleModal(newValue,oldValue) {
        if(newValue) {
          this.getGradeList();
        }
      }
    },
    components: {
      inputNumber
    }
  }
</script>
<style scoped lang="less">
  .costallend{
    width: 304px;
    display: flex;
    &-box{
      flex: 1;
    }
    &-text{
      flex: 0 0 20px;
      text-align: center;
      padding: 0 5px;
    }
    &-textend{
      flex: 0 0 20px;
      text-align: right;
    }
    &-number{
      width: 140px;
    }
  }
  .costallend-box /deep/ .el-input-number.is-controls-right .el-input__inner{
    padding-right: 15px;
  }
</style>
