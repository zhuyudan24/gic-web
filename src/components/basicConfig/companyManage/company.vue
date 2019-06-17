<template>
  <div class="content-wrap">
    <div class="left-menu" :style="{minHeight: (bodyHeight - 66) + 'px'}" :class="{'small-left': $store.state.show}">
      <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu>
    </div>
    <div class="right-right" :class="{'margin64':$store.state.show}">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
  import { checkSuccess,checkFalse,checkStatus } from '../../../common/js/checkStatus.js'
  let qs = require('qs');
  export default {
    name: "company",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        // 模块名
        // leftModulesName: '企业资料',
        // // 路由菜单
        // leftMenuRouter: [],
        // 
        projectName:'gic-web',
        leftModulesName: '企业资料',
    	}
    },
    mounted(){
      // this.getAsideMenu();
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods:{
      getAsideMenu() {
        this.axios.get('/api-auth/get-current-memu-data',{
          params: {
            requestProject:'gic-web',
            project: 'gic-web',
            path: 'merchant_info'
          }
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.leftMenuRouter = res.data.result.leftMenu;
          }
        }).catch(err => {
          checkStatus(err);
        })
      }
    },
    components:{
    	
    }  
  }
</script>

<style lang="less" scoped>
  .content-wrap{
    display: flex;
    .left-menu{
      flex: 0 0 200px;
      width: 200px;
      height: 100%;
      background: #020b21;
      transition: all .2s ease;
      position: fixed;
      z-index: 5;
    }
    .right-right{
      flex: 1;
      overflow: auto;
      margin-left: 200px;
    }
    .margin64{
      margin-left: 64px;
    }
    .small-left{
      transition: all .3s ease;
      flex: 0 0 64px;
      width: 64px;
    }
  }
</style>
