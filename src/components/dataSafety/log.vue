<template>
  <div class="content-wrap">
    <div class="left-menu" :style="{minHeight: (bodyHeight - 64) + 'px'}" :class="{'small-left': $store.state.show}">
      <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu>
    </div>
    <div class="right-right" :class="{'margin64':$store.state.show}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
  let qs = require('qs');
  export default {
    name: "log",
    data () {
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        projectName:'gic-web',
        leftModulesName: '日志管理',
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    methods: {

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
