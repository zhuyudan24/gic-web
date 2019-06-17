<template>
  <div class="erweima-wrap clearfix content-wrap">
  	<!-- <vue-gic-aside-menu :leftMenuRouter="leftMenuRouter" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu> -->
  	<router-view></router-view>
  </div>
</template>

<script>
  import { checkSuccess,checkFalse,checkStatus } from '../../../common/js/checkStatus.js'
  let qs = require('qs');
  export default {
    name: "erweima",
    data(){
    	return {
    		leftModulesName: '二维码管理',
        // 路由菜单
        leftMenuRouter: []
    	}
    },
    mounted(){
      // this.getAsideMenu()
    },
    methods:{
      getAsideMenu() {
        this.axios.get('/api-auth/get-current-memu-data',{
          params: {
            project: 'gic-web',
            path: 'erweima'
          }
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.leftMenuRouter = res.data.result.leftMenu;
          }
        }).catch(err => {
          // checkStatus(err);
        })
      },
    }
  }
</script>

<style lang="less" scoped>
	
</style>
