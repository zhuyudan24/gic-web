<template>
   <div class="navheader">
     <div class="navheader-logo fl" :class="{moveleft: $store.state.show ,moveright: !$store.state.show}"></div>
     <div class="navheader-item fl">
       <a class="itemlink" @click="showMenu">
         <i class="iconfont" :class="{'icon-shouqi': $store.state.show,'icon-zhankai': !$store.state.show}"></i></a>
       <a class="itemlink bottom">总览</a>
       <gicitem></gicitem>
       <a class="itemlink bottom" href="">微信商城</a>
       <a class="itemlink bottom" href="">观云台</a>
       <navuserinfo></navuserinfo>
     </div>
   </div>
</template>
<script>
    import gicitem from 'components/header/gicitem.vue'
    import navuserinfo from 'components/header/navuserinfo.vue'
    import * as types from '../../store/types'
    export default {
      name: "vheader",
      data() {
        return {
          activeIndex: '1',
          menuList: [],
          isShow: false
        }


      },
      methods: {
        // handleSelect(key, keyPath) {
        //   console.log(key, keyPath);
        // },
        showMenu() {
          this.isShow = !this.isShow;
          this.$store.commit(types.SHOW,this.isShow)
        }
      },
      created() {
      },
      components: {
        gicitem,
        navuserinfo
      }
    }
</script>

<style lang="less">
   @import "../../../static/css/variable.less";
   .navheader {
     position: fixed;
     display: flex;
     top: 0;
     left: 0;
     width: 100%;
     min-width: 1300px;
     height: 64px;
     line-height: 64px;
     font-size: 14px;
     background-color: #fff;
     z-index: 2;
     color: #fff;
     &-logo {
       flex: 0 0 200px;
       width: 200px;
       height: 64px;
       float: left;
       text-align: center;
       background: url("./logo.png") no-repeat center center @navbgcolor;
     }
     &-pic {
       vertical-align: middle;
     }
     &-item {
       flex: 1;
       box-shadow: 5px -1px 10px #ddd;
     }
     .itemlink {
       float: left;
       padding: 0 20px;
       display: inline-block;
       height: 62px;
       cursor: pointer;
       &:hover {
         color: @main-color;
       }
     }

     .bottom:hover {
       border-bottom: 2px solid @main-color;
     }
   }
   .moveleft{
     margin-left: -150px;
     transition: all .3s ease;
     background-position: 165px 10px;
   }
   .moveright{
     margin-left: 0px;
     transition: all .2s ease;
   }
   .el-popover{
     min-width: 95px;
   }
</style>
