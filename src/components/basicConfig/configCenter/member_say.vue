<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="day-range-wrap give-up-task">
          <span>会员在线沟通功能</span>
          <div class="day-range">
            <el-switch @change="selectRadio" v-model="openOnline"></el-switch>
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
    name: "event_allocaction",
    data(){
    	return {
    		navpath: [],
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        openOnline:false,
    	}
    },
    mounted(){
      this.getOnlineData();
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
      getOnlineData(){
        this.axios.post('/api-admin/operation-strategy-chat-switch',qs.stringify({
          requestProject:'gic-web'
        })).then(res=>{
          var data = res.data;
          if(data.errorCode ==0){
            var state = data.result.ChatSwitchDTO.switchStatus;
            if(state==1){
              this.openOnline=true
            }else if(state==0){
              this.openOnline=false
            }
          }
        })
      },
      selectRadio(val){
        console.log(val);
        if(val){
          this.axios.post('/api-admin/operation-strategy-save-chat-switch',qs.stringify({
            requestProject:'gic-web',
            switchStatus:1
          })).then(res=>{
            var data = res.data;
            if(data.errorCode ==0){
              this.openOnline=true;
              this.$message({
                type: 'success',
                message: '开启成功!'
              });
            }
          })
        }else{
          this.$confirm('关闭后会员将无法与导购进行在线沟通，是否确认关闭?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.post('/api-admin/operation-strategy-save-chat-switch',qs.stringify({
              requestProject:'gic-web',
              switchStatus:0
            })).then(res=>{
              var data = res.data;
              if(data.errorCode ==0){
                this.openOnline=false
              }
            })
            this.$message({
              type: 'success',
              message: '关闭成功!'
            });
          }).catch(() => {
            this.openOnline=true;
            this.$message({
              type: 'info',
              message: '已取消'
            });          
          });
        }
      },
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
  .right-box{
    padding: 24px 32px;
    background: #fff;
    .day-range-wrap{
      position: relative;
      line-height: 36px;
      font-size: 14px;
      color: #606266;
      margin-bottom: 22px;
      > span{
        position: absolute;
        width: 120px;
      }
      .day-range{
        padding-left: 140px;
      }
    }
  }
</style>
