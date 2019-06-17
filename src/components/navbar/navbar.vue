<template>
  <div class="navbarwrap boxshow">
    <el-breadcrumb separator="/">
    
      <span class="el-breadcrumb__item no-link link-active"><a :href="linkHref" role="link" class="el-breadcrumb__inner is-link">首页</a><span role="presentation" class="el-breadcrumb__separator">/</span></span>

      <el-breadcrumb-item v-for="(item, index) in navpath"  :key="index" :to="{ path: item.path}">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="navtitle">{{ navpath[navpath.length - 1].name }}</h1>
    <div class="navbar">
      <!-- <a class="navbar-item" :class="curitem == item.tab ? 'curnavbar' : ''" v-for="(item,index) in navtab" @click="changeTab(item)">{{ item.name }}</a> -->
      <a class="navbar-item" :class="curitem == item.value ? 'curnavbar' : ''" v-for="(item,index) in navtab" @click="changeTab(item)">{{ item.name }}
        <el-tooltip v-if="item.tab=='specialAd'" class="item" effect="light" content="针对特定的会员单独设置广告位" placement="top"><i class="tooltip-icon el-icon-question"></i></el-tooltip>
      </a>
    </div>
  </div>
</template>

<script>
    import excelConfig from '../../common/js/excel_config.js'
    export default {
      name: "navpath",
      data() {
        return {
          // curitem: 'membercard'
          curitem: 0
        }
      },
      props: {
        navpath: {
          type: Array,
          default: []
        },
        navtab: {
          type: Array,
          default: []
        }
      },
      mounted(){
        this.linkHref = excelConfig.config + '/report/#/memberSummary'
      },
      methods: {
        changeTab(item) {
          // this.curitem = item.tab;
          // this.$emit('getCurTab',item.tab);
          this.curitem = item.value;
          this.$emit('getCurTab',item.value);
        }
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../static/css/variable.less";
 .navbarwrap{
   padding: 20px 0 0 25px;
   background-color: #fff;
   border-radius: 2px;
   .navtitle{
      margin: 24px 0 0 0;
      font-size: 20px;
      color: #303133;
      font-weight: 500;
   }
   .navbar{
     margin-top: 10px;
     height: 40px;
     line-height: 40px;
     &-item{
       display: inline-block;
       margin-right: 38px;
       font-size: 14px;
       color: #303133;
       cursor: pointer;
       &:last-child{
         margin-right: 0;
       }
     }
   }
   .curnavbar{
     position: relative;
     color: @main-color;
     &:after{
       position: absolute;
       content: '';
       left: 0;
       right: 0;
       bottom: 0;
       width: 100%;
       height: 2px;
       background-color: @main-color;
     }
   }
 }
 .boxshow {
   border-bottom: 1px solid #e4e7ed;
   box-shadow: 5px -1px 5px #dfdfdf;
 }

</style>
