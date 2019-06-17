<template>
  <div class="content-wrap">
    <div class="left-menu" :style="{minHeight: (bodyHeight - 66) + 'px'}" :class="{'small-left': $store.state.show}">
      <vue-gic-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu>
    </div>
    <div class="right-right" :class="{'margin64':$store.state.show}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "integral",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        projectName:'gic-web',
        leftModulesName: '广告位管理',
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
            path: 'ad_manage_common'
          }
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.leftMenuRouter = res.data.result.leftMenu;
          }
        }).catch(err => {
          // checkStatus(err);
        })
      },
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
