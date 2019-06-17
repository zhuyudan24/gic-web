<template>
  <div>
    <div class="right-wrap" :style="{minHeight: (bodyHeight - 164) + 'px'}">
      <topNav :navpath="navpath"></topNav>
      <div class="right-content">
        <div class="right-box">
          <div class="day-range-wrap">
            <span>业绩结算区间</span>
            <div class="day-range">
              <el-radio-group v-model="radio" @change="selectRadio">
                <el-radio disabled label="0">
                  起始于上月<el-input @keyup.native="onlyNumTime" :disabled="inputOneShow" class="day-input" v-model="preMonth" placeholder="请输入"></el-input>号
                </el-radio>
                <el-radio disabled label="1">
                  起始于本月<el-input @keyup.native="onlyNumTime1" :disabled="inputTwoShow" class="day-input" v-model="nextMonth" placeholder="请输入"></el-input>号
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="text-tip"><i class="el-icon-info navtipcolor"></i>设置计入销售额的优惠支付方式，开启即表示该支付方式计入销售额，关闭则反之</div>
          <ul class="list-wrap" v-loading="loading">
            <li class="clearfix" v-for="(item,index) in switchList">
              <p class="fl">{{item.name}}</p>
              <p class="fr switch-btn">
                <el-switch @change="selectSwitch(item)" v-model="item.turn=='1'?true:false"></el-switch>
              </p>
            </li>
          </ul>
          <div v-show="switchList.length<1" class="no-data-wrap">
            <div class="no-data-icon" >
              <img src="../../../../static/img/no-data_icon.png" alt="">
            </div>
            <p>暂无数据</p>
          </div>
          <div v-show="switchList.length>0" class="save-btn">
            <el-button @click="saveBtn" type="primary">保 存</el-button>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import { getBreadcrumb } from '../../../utils/getBreadcrumb.js'
  import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "money_performance",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        navpath: [],
        radio:'0',
        preMonth:'',
        nextMonth:'',
        inputOneShow: true,     // 第一个输入框是否可以输入
        inputTwoShow: true,     // 第二个输入框是否可以输入
        radioShow: false,     // 单选框是否可选
        delivery:true,    // switch开关
        listObj:{},
        switchList:[],
        enterPerformanceId:'',
        loading:false
    	}
    },
    mounted(){
      this.getCloseData();
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
      getCloseData(){   // 业绩结算数据
        this.loading = true;
        this.axios.post('/api-admin/operation-strategy-performance',qs.stringify({
          requestProject:'gic-web'
        })).then(res=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode ==0){
            this.loading = false;
            var result = data.result.enterPerformanceDTO;
            this.nextMonth = result.performanceDay;
            this.enterPerformanceId = result.enterPerformanceId;
            this.radio=result.dayType.toString();
            var open = data.result.useType;
            var close = data.result.noUseType;
            open.push.apply(open,close);
            this.switchList = open;
          }else{
            this.$message.error(data.message)
          }
        })
      },
      selectRadio(val){
        if(val=='0'){
          this.inputOneShow = false;
          this.inputTwoShow = true;
        }else if(val=='1'){
          this.inputOneShow = true;
          this.inputTwoShow = false;
        }
      },
      onlyNumTime(){    // 只能输入数字
        this.preMonth=this.preMonth.replace(/\D/g,'');
      },
      onlyNumTime1(){    // 只能输入数字
        this.nextMonth=this.nextMonth.replace(/\D/g,'');
      },
      selectSwitch(row){
        if(row.turn=='1'){
          row.turn="0"
        }else if(row.turn=='0'){
          row.turn="1"
        }
      },
      saveBtn(){
        var day;
        if(parseInt(this.radio)==0){
          if(this.preMonth==""){
            this.$message.error('请输入业绩结算日')
          }else{
            day = parseInt(this.preMonth)
          }
        }else if(parseInt(this.radio)==1){
          if(this.nextMonth==""){
            this.$message.error('请输入业绩结算日')
          }else{
            day = parseInt(this.nextMonth)
          }
        }
        var feeParams = [];
        this.switchList.forEach((item)=>{ // 开启的列表
          var openItem={};
          if(item.turn=='1'){
            openItem.code=item.code;
            openItem.turn=item.turn;
            feeParams.push(openItem);
          }
        })
        this.axios.post('/api-admin/operation-strategy-performance-save',qs.stringify({
          requestProject:'gic-web',
          performanceDay:day,
          dayType:parseInt(this.radio),
          feeParams:JSON.stringify(feeParams),
          enterPerformanceId:this.enterPerformanceId
        })).then(res=>{
          var data = res.data;
          if(data.errorCode ==0){
            this.$message.success('保存成功');
            this.getCloseData()
          }
        })
      }
    },
    components:{
    	topNav,
    }  
  }
</script>

<style lang="less" scoped>
  .day-range-wrap{
    position: relative;
    line-height: 36px;
    > span{
      position: absolute;
      width: 100px;
      font-size: 14px;
    }
    .day-range{
      padding-left: 120px;
      .day-input{
        width: 100px;
        margin: 0 5px;
      }
    }
  }
  .list-wrap{
    border:1px solid #dcdfe6;
    font-size: 14px;
    color: #606266;
    max-width: 1200px;
    li{
      height: 45px;
      line-height: 45px;
      padding: 0 24px;
    }
    .switch-btn{
      width: 400px;
      text-align: center;
    }
  }
  .text-tip{
    max-width: 1200px;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
    border-radius: 2px;
    color: #606266;
    background-color: #f4f4f5;
    margin: 24px 0;
    .navtipcolor{
      margin: 0 12px;
      color: #1890ff;
    }
  }
  .save-btn{
    max-width: 1200px;
    margin: 24px 0;
    text-align: center;
  }
  .list-wrap li + li{
    border-top:1px solid #dcdfe6;
  }
</style>
