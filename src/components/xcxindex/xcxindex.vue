<template>
  <div class="xcxindex">
    <div class="xcxindex-left" :style="{minHeight: (bodyHeight - 64) + 'px'}" :class="{'xcxindex-mLeft': $store.state.show}">
      <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu>
    </div>
    <div class="xcxindex-right" :class="{'margin64':$store.state.show}">
      <router-view></router-view>
    </div>
  </div>
  <!-- <div class="xcxindex" :style="{height: (bodyHeight - 66) + 'px'}">
    <div class="xcxindex-left" :style="{height: (bodyHeight - 66) + 'px'}" :class="{'xcxindex-mLeft': $store.state.show}">
      <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu>
    </div>
    <div class="xcxindex-right" :class="{'margin64':$store.state.show}">
      <div :style="{minHeight: (bodyHeight - 190) + 'px'}">
        <router-view></router-view>
      </div>
      <vue-gic-footer v-show="$store.state.showfoot"></vue-gic-footer>
    </div>
  </div> -->
</template>

<script>
  import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
  let qs = require('qs');
  export default {
    data() {
      return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        defaultActive: this.$route.path,
        collapseFlag: false,
        leftModulesName: '小程序配置',
        projectName: 'gic-web'
      }
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    }
  }
</script>

<style lang="less" scoped>
  .xcxindex{
    display: flex;
    min-width: 1200px;
    height: 100%;
    &-left{
      flex: 0 0 200px;
      width: 200px;
      height: 100%;
      /*overflow-y: auto;*/
      background-color: #020b21;
      transition: all .2s ease;
      position: fixed;
      z-index: 5;
    }
    &-right{
      flex: 1;
      overflow: auto;
      margin-left: 200px;
    }
    &-mLeft{
      transition: all .3s ease;
      flex: 0 0 64px;
      width: 64px;
    }
    .margin64{
      margin-left: 64px;
    }
  }
  .footlogo{
    padding-bottom: 60px !important;
    margin-top: 40px;
    text-align: center;
    &-text{
      font-size: 14px;
      color: #909399;
    }
  }

</style>
