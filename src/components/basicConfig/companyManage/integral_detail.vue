<template>
  <div class="right-wrap">
    <navbar :shopBack="shopBack" :activeitem="activeitem" :navpath="navpath" :navtab="navtab" @getCurTab="getCurTab"></navbar>
    <div class="right-content">
      <div class="right-box">
        <!-- 积分汇总 -->
        <integral-all v-if="activeitem==2"></integral-all>    
        <!-- 积分产生汇总 -->
        <integral-produce-all v-if="activeitem==3"></integral-produce-all>
        <!-- 积分消耗汇总 -->
        <integral-consume-all v-if="activeitem==4"></integral-consume-all>
        <!-- 积分结算汇总 -->
        <integral-close-all v-if="activeitem==5"></integral-close-all>
        <!-- 积分补贴明细 -->
        <integral-help-dtl v-if="activeitem==6"></integral-help-dtl>
        <!-- 积分产生明细 -->
        <integral-produce-dtl v-if="activeitem==7"></integral-produce-dtl>
        <!-- 积分结算明细 -->
        <integral-close-dtl v-if="activeitem==8"></integral-close-dtl>
      </div>
    </div>
    
  </div>
</template>

<script>
  import navbar from 'components/navbar/navbartwo'
  import integralAll from 'components/basicConfig/companyManage/integral_all'
  import integralProduceAll from 'components/basicConfig/companyManage/integral_produce_all'
  import integralConsumeAll from 'components/basicConfig/companyManage/integral_consume_all'
  import integralCloseAll from 'components/basicConfig/companyManage/integral_close_all'
  import integralHelpDtl from 'components/basicConfig/companyManage/integral_help_dtl'
  import integralProduceDtl from 'components/basicConfig/companyManage/integral_produce_dtl'
  import integralCloseDtl from 'components/basicConfig/companyManage/integral_close_dtl'
  export default {
    name: "integral_detail",
    data(){
    	return {
        navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '积分结算',
            path: '/integral_detail'
          },
          {
            name: '积分明细表',
            path: ''
          }
        ],
        navtab: [
          {
            name: '积分汇总',
            tab: 2
          },
          {
            name: '积分产生汇总',
            tab: 3
          },
          {
            name: '积分消耗汇总',
            tab: 4
          },
          {
            name: '积分结算汇总',
            tab: 5
          },
          {
            name: '积分补贴明细',
            tab: 6
          },
          {
            name: '积分产生明细',
            tab: 7
          },
          {
            name: '积分结算明细',
            tab: 8
          }
        ],
        activeitem: 2,
        shopBack:{
          'shopBackShow':false,
          'shopBackCount':0
        },
    	}
    },
    methods:{
      getCurTab(tab) {
        // console.log(tab);
        this.activeitem = tab;
      }
    },
    components:{
    	navbar,
      integralAll,
      integralProduceAll,
      integralConsumeAll,
      integralCloseAll,
      integralHelpDtl,
      integralProduceDtl,
      integralCloseDtl
    }  
  }
</script>

<style lang="less" scoped>

</style>
