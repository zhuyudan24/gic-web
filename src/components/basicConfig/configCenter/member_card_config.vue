<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      会员在线沟通
  	</div>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "event_allocaction",
    data(){
    	return {
    		navpath: [
          {
            name: '首页',
            path: '/'
          },
          {
            name: '会员在线沟通',
            path: ''
          }
        ]
    	}
    },
    mounted(){
      
    },
    methods:{
      
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	
</style>
