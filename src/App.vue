<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){	// 刷新本页面
  	return {
  		reload:this.reload
  	}
  },
  data() {
    return {
    	isRouterAlive:true
    }
  },
  methods:{
  	reload(){
  		this.isRouterAlive = false;
  		this.$nextTick(function(){
  			this.isRouterAlive = true
  		})
  	}
  }
}
</script>
<style>
</style>
