<template>
  <div class="navbarwrap boxshow">
    <el-breadcrumb separator="/">

      <span class="el-breadcrumb__item no-link link-active"><a :href="linkHref" role="link" class="el-breadcrumb__inner is-link">首页</a><span role="presentation" class="el-breadcrumb__separator">/</span></span>

      <el-breadcrumb-item class="no-link" :class="{'link-active':item.path!=''&&index!=navpath.length-1}" v-for="(item, index) in navpath" :key="index" :to="{ path: item.path}">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="navtitle">{{ navpath[navpath.length - 1].name }}</h1>
    <div class="navbar clearfix">
      <div class="fl">
        <a class="navbar-item" :class="curitem === item.tab ? 'curnavbar' : ''" v-for="(item, index) in navtab" :key="index" @click="changeTab(item)">{{ item.name }}
          <el-popover
            v-if="item.name=='特例广告位'"
            class="item"
            placement="top"
            width="200"
            trigger="hover"
            title=""
            content="针对特定的会员单独设置广告位">
            <i slot="reference" class="tooltip-icon el-icon-question"></i>
          </el-popover>
        </a>
      </div>
      <!-- <div class="fr shop-back" v-show="shopBack.shopBackShow">
        <p>门店回收站<span>{{shopBack.shopBackCount}}</span></p>
      </div> -->
    </div>
  </div>
</template>

<script>
    import excelConfig from '../../common/js/excel_config.js'
    export default {
      name: "navpath",
      data() {
        return {
          curitem: 2,
          linkHref:''
        }
      },
      props: {
        activeitem: {
          type: Number,
          default: 2
        },
        navpath: {
          type: Array,
          default: []
        },
        navtab: {
          type: Array,
          default: []
        },
      },
      mounted(){
        this.linkHref = excelConfig.config + '/report/#/memberSummary'
      },
      methods: {
        changeTab(item) {
          this.curitem = item.tab;
          this.$emit('getCurTab',item.tab);
        }
      },
      watch: {
        activeitem(newVal,oldVal) {
          this.curitem = newVal;
          // console.log(newVal)
        }
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../static/css/variable.less";
 .navbarwrap{
   padding: 20px 25px 0 25px;
   background-color: #fff;
   border-radius: 2px;
   .navtitle{
     margin: 24px 0 0;
     font-size: 20px;
     font-weight: 500;
     color: #303133;
   }
   .navbar{
     margin-top: 18px;
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
   // box-shadow: 5px -1px 5px #dfdfdf;
 }
  .shop-back{
    font-size: 14px;
    color: #909399;
    span{
      color: #303133;
      padding-left: 10px;
    }
  }
  .link-active /deep/ .el-breadcrumb__inner{
    font-weight: 700 !important;
    cursor: pointer !important;
    color: #303133 !important;
  }
  .link-active /deep/ .el-breadcrumb__inner:hover{
    color: #1890ff !important;
  }
  .no-link /deep/ .el-breadcrumb__inner,.no-link /deep/ .el-breadcrumb__inner:hover {
    font-weight: normal;
    cursor: text;
    color:#606266;
  }
</style>
