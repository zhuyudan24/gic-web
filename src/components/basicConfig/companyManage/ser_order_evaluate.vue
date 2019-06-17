<template>
  <div>
    <div class="right-wrap" :style="{minHeight: (bodyHeight - 164) + 'px'}">
      <topNav :navpath="navpath"></topNav>
      <div class="right-content">
        <div class="right-box">
          <el-form v-loading="loading" ref="ruleForm" class="evaluate-form" :rules="rules" label-position="right" :model="form" label-width="110px">
            <el-form-item label="评价时限">
              <div :class="{'error-input':error1}">
                <el-input @keyup.native="onlyNumTime" v-model="form.timeLimit" class="small-input margin-rt-10"></el-input>天后关闭服务评价功能
              </div>
              <div v-show="error1" class="error-tip">评价时限必须大于评价提醒时间设置的天数</div>
            </el-form-item>
            <el-form-item label="评价提醒时间">
              <div :class="{'error-input':error2}">
                消费成功<el-input @keyup.native="onlyNumTime1" v-model="form.timeNum" class="small-input margin-lt-10 margin-rt-10"></el-input>天后再次提醒
              </div>
              <div v-show="error2" class="error-tip">评价提醒时间必须小于评价时限设置的天数</div>
            </el-form-item>
            <el-form-item label="评价提醒语" prop="eltText" class="text-num-wrap big-select">
              <el-input @keyup.native="toText(form.eltText,$event)" v-model="form.eltText" type="textarea" class="big-input"></el-input>
              <span class="text-num">{{textNum}}/{{textLength}}</span>
            </el-form-item>
            <el-form-item label="不良评价判定">
              <el-checkbox-group v-model="form.badElt" @change="starChange">
                <div style="margin-bottom:22px;">
                  <el-checkbox label="one" name="badElt">任意一项评价低于</el-checkbox>
                  <el-select v-show="form.badElt.indexOf('one')!=-1" v-model="form.oneStar" placeholder="请选择" class="small-select">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div>
                  <el-checkbox label="total" name="badElt">三项评价总和低于</el-checkbox>
                  <el-select v-show="form.badElt.indexOf('total')!=-1" v-model="form.thrStar" placeholder="请选择" class="small-select" style="margin-bottom:0">
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="正面快捷短评" prop="good" class="text-num-wrap big-select">
              <el-input @keyup.native="toText1(form.good,$event)" v-model="form.good" type="textarea" class="big-input"></el-input>
              <span class="text-num">{{textNum1}}/{{textLength1}}</span>
            </el-form-item>
            <el-form-item label="负面快捷短评" prop="bad" class="text-num-wrap big-select">
              <el-input @keyup.native="toText2(form.bad,$event)" v-model="form.bad" type="textarea" class="big-input"></el-input>
              <span class="text-num">{{textNum2}}/{{textLength2}}</span>
            </el-form-item>
            <el-form-item label="回访逾期判定">
              <el-input @keyup.native="onlyNumTime2" v-model="form.overTime" class="small-input margin-rt-10"></el-input>天
            </el-form-item>
            <el-form-item>
              <el-button @click="saveBtn('ruleForm')" type="primary">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import { getBreadcrumb } from '../../../utils/getBreadcrumb.js'
  import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  let qs = require('qs')
  export default {
    name: "ser_order_evaluate",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        navpath: [],
        form: {
          timeLimit:'',
          timeNum:'',
          eltText:'',
          badElt:[],
          oneStar:'',
          thrStar:'',
          good:'',
          bad:'',
          overTime:''
        },
        rules: {
          eltText: [
            { required: true, message: '请输入评价提醒语', trigger: 'blur' }
          ],
          good: [
            { required: true, message: '请输入正面快捷短评', trigger: 'blur' }
          ],
          bad: [
            { required: true, message: '请输入负面快捷短评', trigger: 'blur' }
          ]
        },
        options: [
          {
            label:'1星',
            value:'1'
          },{
            label:'2星',
            value:'2'
          },{
            label:'3星',
            value:'3'
          },{
            label:'4星',
            value:'4'
          },{
            label:'5星',
            value:'5'
          }
        ],
        options2: [
          {
            label:'3星',
            value:'3'
          },{
            label:'6星',
            value:'6'
          },{
            label:'9星',
            value:'9'
          },{
            label:'12星',
            value:'12'
          },{
            label:'15星',
            value:'15'
          }
        ],
        textNum: 0, // 输入文字个数(两个字母/汉字算一个字)
        textLength: 60, // 限制最大字数
        textNum1: 0,
        textLength1: 100,
        textNum2: 0,
        textLength2: 100,
        loading:false,
        oneStatus:0,   // 不良评价判定  多选
        totalStatus:0,
        error1:false,
        error2:false,
        error3:false,
    	}
    },
    mounted(){
      this.getEvaluate();
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      
      var path = this.$route.path;
      path = path.substring(1,path.length);
      getBreadcrumb(path).then(res => {   // 获得左侧侧边栏的面包屑
        this.navpath = res;
      })
    },
    methods:{
      getEvaluate(){    // 获取 订单评价数据
        this.loading = true;
        this.axios.post('/api-admin/order-evaluate-system',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.loading = false;
            var result = data.result.evaluateSystemDTO;
            this.form.timeLimit = result.evaluateLimitday; // 评价时限
            this.form.timeNum = result.remindDay;  // 消费后提醒时间
            this.form.eltText = result.mindMsg; // 评价提醒语
            this.form.oneStar=data.result.onescore;  // 不良评价 星级
            this.form.thrStar=data.result.totalscore;
            var one = result.oneStatus;
            var total = result.totalStatus;
            if(one==1){     // 选中
              this.form.badElt.push('one')
            }
            if(total==1){
              this.form.badElt.push('total')
            }
            this.form.good = result.goodEvaluateQuick;  // 正面评价
            this.form.bad = result.badEvaluateQuick;  // 负面评价
            this.form.overTime = result.returnVisitLimit; // 逾期

            var len = strLength.getZhLen(this.form.eltText);  
            this.textNum = len;
            var len = strLength.getZhLen(this.form.good);  
            this.textNum1 = len;
            var len = strLength.getZhLen(this.form.bad);  
            this.textNum2 = len;
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      starChange(val){
        console.log(val)
      },
      toText(value,e) {          // 名称输入时控制字符数量
        var that = this;
        that.form.eltText = strLength.getByteVal(e.target.value,that.textLength);
        that.textNum = strLength.getZhLen(that.form.eltText);
      },
      toText1(value,e) {          // 名称输入时控制字符数量
        var that = this;
        that.form.good = strLength.getByteVal(e.target.value,that.textLength1);
        that.textNum1 = strLength.getZhLen(that.form.good);
      },
      toText2(value,e) {          // 名称输入时控制字符数量
        var that = this;
        that.form.bad = strLength.getByteVal(e.target.value,that.textLength2);
        that.textNum2 = strLength.getZhLen(that.form.bad);
      },
      onlyNumTime(){    // 只能输入数字  评价时限
        if(this.form.timeLimit){
          this.form.timeLimit=this.form.timeLimit.replace(/\D/g,'');
          if(this.form.timeLimit && this.form.timeNum){
            if(parseInt(this.form.timeLimit) < parseInt(this.form.timeNum) || parseInt(this.form.timeLimit) == parseInt(this.form.timeNum)){
              this.error1 = true;
            }else{
              this.error1 = false;
              this.error2 = false;
            }
          }
        }
      },
      onlyNumTime1(){    // 只能输入数字  评价提醒时间
        if(this.form.timeNum){
          this.form.timeNum=this.form.timeNum.replace(/\D/g,'');
          if(this.form.timeNum && this.form.timeLimit){
            if(parseInt(this.form.timeLimit) < parseInt(this.form.timeNum) || parseInt(this.form.timeLimit) == parseInt(this.form.timeNum)){
              this.error2 = true;
            }else{
              this.error1 = false;
              this.error2 = false;
            }
          }
        }
      },
      onlyNumTime2(){    // 只能输入数字  逾期判定
        if(this.form.overTime){
          this.form.overTime=this.form.overTime.replace(/\D/g,'');
        }
      },
      saveBtn(ruleForm){
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            if(this.form.timeNum){
              if(!this.form.timeLimit || !(parseInt(this.form.timeLimit) > parseInt(this.form.timeNum))){
                this.error2 = true;
                return;
              }
            }
            this.form.badElt.forEach((k)=>{ // 不良评价 星级
              if(k=="one"){
                this.oneStatus = 1
              }
              if(k=="total"){
                this.totalStatus = 1
              }
            })
            var badEvaluate = {}; // 不良星级 选中与否都存在
            badEvaluate.onescore = parseInt(this.form.oneStar); 
            badEvaluate.totalscore = parseInt(this.form.thrStar);
            if(this.form.timeLimit == '' || this.form.timeLimit == null){  // 评价时限
              this.form.timeLimit==null
            }else{
              this.form.timeLimit = parseInt(this.form.timeLimit)
            }

            if(this.form.timeNum == '' || this.form.timeNum == null){  // 评价提醒时间
              this.form.timeNum==null
            }else{
              this.form.timeNum = parseInt(this.form.timeNum)
            }
            if(this.form.overTime == '' || this.form.overTime == null){  // 逾期判定
              this.form.overTime==null
            }else{
              this.form.overTime = parseInt(this.form.overTime)
            }

            this.loading = true;
            this.axios.post('/api-admin/order-evaluate-system-save',qs.stringify({
              requestProject:'gic-web',
              oneStatus:this.oneStatus,
              totalStatus:this.totalStatus,
              noMind:"",
              badEvaluate:JSON.stringify(badEvaluate),
              evaluateLimitday:this.form.timeLimit,
              remindDay:this.form.timeNum,
              mindMsg:this.form.eltText,
              badEvaluateType:1,    // 不良评价回访（0：关闭，1：开启） 值是1
              goodEvaluateQuick:this.form.good,
              badEvaluateQuick:this.form.bad,
              returnVisitLimit:this.form.overTime
            })).then((res)=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode==0){
                this.loading = false;
                this.$message.success('保存成功');
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


        // if(this.form.timeNum!=null){
        //   if(this.form.timeLimit==null || (this.form.timeLimit!=null&&(this.form.timeLimit<this.form.timeNum))){
        //     this.$message.error('评价提醒时间必须小于评价时限设置的天数');
        //     return;
        //   }
        // }
        // if(this.form.eltText==""){    // 评价提醒语
        //   this.$message.error('请输入评价提醒语');
        //   return;
        // }
        // if(this.form.good==""){    // 正面短评
        //   this.$message.error('请输入正面快捷短评');
        //   return;
        // }
        // if(this.form.bad==""){    // 负面短评
        //   this.$message.error('请输入负面快捷短评');
        //   return;
        // }
        
      }
    },
    components:{
    	topNav
    }  
  }
</script>

<style lang="less" scoped>
  .right-box{
    padding: 24px 32px;
  }
  .evaluate-form{
    color: #606266;
    .small-input{
      width: 100px;
    }
    .margin-lt-10{
      margin-left: 10px;
    }
    .margin-rt-10{
      margin-right: 10px;
    }
    .big-input{
      width: 460px;
    }
    .big-select{
      margin-bottom: 32px;
    }
    .text-num-wrap{
      width: 570px;
      position: relative;
      .text-num{
        position: absolute;
        bottom: -32px;
        color: #c0c4cc;
        font-size: 12px;
        right: 0;
      }
    }
    .small-select{
      width: 150px;
      margin-left: 10px;
    }
  }

</style>
