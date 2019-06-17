<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      积分制度
  	</div>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "integral_system",
    data(){
    	return {
    		navpath: [
          {
            name: '会员管理',
            path: ''
          },
          {
            name: '会员体系',
            path: '/member_card_config'
          },
          {
            name: '积分制度',
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
