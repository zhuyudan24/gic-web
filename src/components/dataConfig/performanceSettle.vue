<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="day-range-wrap">
          <h2 style="border-top:none">业绩结算区间（建议起始于本月1号）</h2>
          <div class="day-range">
            <el-radio-group v-model="radio">
              <el-radio disabled label="0">
                起始于上月<el-input disabled class="day-input" v-model="preMonth" placeholder="请输入"></el-input>号
              </el-radio>
              <el-radio disabled label="1">
                起始于本月<el-input disabled class="day-input" v-model="nextMonth" placeholder="请输入"></el-input>号
              </el-radio>
            </el-radio-group>
          </div>
          <h2>销售额配置</h2>
          <div class="text-tip"><i class="el-icon-info navtipcolor"></i>销售额（未注明应收或实付的）默认按此选择展示，客单价、件单价、折扣率等将按此选择计算。提交后不允许修改</div>
          <div class="day-range">
            <el-radio-group :disabled="sellBool" v-model="radio2" @change="selectRadio2">
              <el-radio class="sell-radio" :label="1">
                销售额（应收）<span>ERP订单销售额</span>
              </el-radio>
              <br>
              <el-radio class="sell-radio" :label="2" style="margin-bottom:0">
                销售额（实付）<span>根据配置剔除优惠的支付方式</span>
              </el-radio>
            </el-radio-group>
          </div>
          <div class="save-btn">
            <el-button :disabled="sellBool" @click="saveData" type="primary">保 存</el-button>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
let qs = require('qs')
export default {
  name: "performanceSettle", 
  data() {
    return {
      requestProject:'gic-web',
      navpath: [
        {
          name: '配置中心',
          path: ''
        },
        {
          name: '数据设置',
          path: ''
        },
        {
          name: '业绩结算',
          path: ''
        }
      ],
      radio:'0',
      preMonth:'',
      nextMonth:'',
      sellBool:false,
      radio2:1
    }
  },
  mounted(){
    this.getCloseData();
  },
  methods: {
    getCloseData(){   // 业绩结算数据
      this.loading = true;
      this.axios.post('/api-admin/operation-strategy-performance',qs.stringify({
        requestProject:'gic-web'
      })).then(res=>{
        var data = res.data;
        if(data.errorCode ==0){
          this.loading = false;
          var result = data.result.enterPerformanceDTO;
          this.nextMonth = result.performanceDay;
          this.enterPerformanceId = result.enterPerformanceId;
          this.radio=result.dayType.toString();
          this.sellBool = result.saleSetting==0?false:true;
          this.radio2=result.saleSetting?result.saleSetting:1;
        }else{
          this.$message.error(data.message)
        }
      })
    },
    saveData(){
      if(!this.sellBool){
        this.axios.post('/api-admin/update-enterperformance',qs.stringify({
          requestProject:'gic-web',
          value:this.radio2
        })).then(res=>{
          var data = res.data;
          if(data.errorCode ==0){
            this.$message.success('保存成功');
          }else{
            this.$message.error(data.message);
          }
        })
      }
    }
  },
  components: {
    topNav,
  }     
}
</script>

<style lang="less" scoped>
  .right-content .right-box{
    padding-top: 0
  }
  .day-range-wrap{
    h2{
      font-size: 16px;
      font-weight: 700;
      color: #303133;
      border-top: 1px solid #e8e8e8;
      padding: 34px 0 24px;
    }
    .day-range{
      padding-left: 100px;
      margin-bottom: 24px;
      .day-input{
        width: 100px;
        margin: 0 5px;
      }
    }
  }
  .text-tip{
    margin-bottom: 24px;
    min-width: 1200px;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
    border-radius: 2px;
    color: #606266;
    background-color: #f4f4f5;
    .navtipcolor{
      margin: 0 12px;
      color: #1890ff;
    }
    b{
      font-weight: 700
    }
  }
  .sell-radio{
    margin-bottom: 24px;
    span{
      color: #909399;
      padding-left:15px;
    }
  }
  .save-btn{
    padding-left: 100px;
    margin-bottom: 24px;
  }
</style>
