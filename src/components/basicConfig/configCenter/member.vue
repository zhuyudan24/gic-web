<template>
  <div class="content-wrap">
  	<vue-gic-aside-menu :leftMenuRouter="leftMenuRouter" :leftModulesName="leftModulesName" :collapseFlag="$store.state.show"></vue-gic-aside-menu>
    <router-view></router-view>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "member",
    data(){
    	return {
    		leftModulesName: '会员设置',
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
