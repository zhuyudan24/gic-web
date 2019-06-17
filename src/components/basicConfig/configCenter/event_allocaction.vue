<template>
  <div class="right-wrap">
    <topNav :navpath.sync="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="day-range-wrap">
          <span>话务任务分配
            <el-popover
              class="item"
              placement="top"
              width="200"
              trigger="hover"
              title=""
              content="用于控制话务任务的分配给哪个企业号的用户">
              <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
            </el-popover>
            <!-- <el-tooltip class="item" effect="light" content="用于控制话务任务的分配给哪个企业号的用户" placement="top"><i class="tooltip-icon el-icon-question"></i></el-tooltip> -->
          </span>
          <div class="day-range">
            <el-radio-group v-model="radio" @change="selectRadio">
              <el-radio label="0">分配给主门店的店长</el-radio>
              <el-radio label="1">分配给专属导购</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="day-range-wrap give-up-task">
          <span>话务任务放弃前提</span>
          <div class="day-range">
            <el-select v-model="value" class="select-time" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select><span class="give-up-text">次呼叫后无响应</span>
          </div>
        </div>
        <div class="save-btn">
          <el-button @click="saveBtn" type="primary">保 存</el-button>
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
    name: "event_allocaction",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [],
        options: [{
          value: '0',
          label: '0'
        }, {
          value: '1',
          label: '1'
        }, {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }],
        value: '',
        radio:"1",
      }
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getEventData();
      
      var path = this.$route.path;
      path = path.substring(1,path.length);
      getBreadcrumb(path).then(res => {   // 获得左侧侧边栏的面包屑
        this.navpath = res;
      })

    },
    methods:{
      getEventData(){
        this.axios.post('/api-admin/operation-strategy-enter-transaction',qs.stringify({
          requestProject:'gic-web'
        })).then(res=>{
          var data = res.data;
          if(data.errorCode ==0){
            var result = data.result.enterTransactionDTO;
            this.radio = result.trafficAllocationType.toString();
            this.value = result.trafficGiveupTimes.toString();
          }
        })
      },
      selectRadio(val){
        console.log(val);
      },
      saveBtn(){
        this.axios.post('/api-admin/enter-transaction-save',qs.stringify({
          requestProject:'gic-web',
          trafficAllocationType:parseInt(this.radio),
          trafficGiveupTimes:parseInt(this.value)
        })).then(res=>{
          var data = res.data;
          if(data.errorCode ==0){
            this.$message.success('保存成功')
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
    .day-range-wrap{
      position: relative;
      line-height: 36px;
      font-size: 14px;
      margin-bottom: 22px;
      > span{
        position: absolute;
        width: 120px;
        color: #606266;
        text-align: right;
      }
      .day-range{
        padding-left: 140px;
      }

    }
    .give-up-task{
      .select-time{
        width: 150px;
      }
      .give-up-text{
        padding-left: 10px;
        color: #606266;
      }
    }
  }
  .save-btn{
    margin: 22px 0 24px 0;
    margin-left: 140px;
  }
</style>
