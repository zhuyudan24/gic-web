<template>
  <div class="navwrap boxbttom">
    <el-breadcrumb separator="/">

      <span class="el-breadcrumb__item no-link link-active"><a :href="linkHref" role="link" class="el-breadcrumb__inner is-link">首页</a><span role="presentation" class="el-breadcrumb__separator">/</span></span>

      <el-breadcrumb-item class="no-link" :class="{'link-active':item.path!=''&&index!=navpath.length-1}" v-for="(item, index) in navpath" :key="index" :to="{ path: item.path}">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <h1 class="navtitle" v-if="navpath.length>0">{{ navpath[navpath.length-1].name}}</h1>
    <div class="navtip navmTop" v-if="navtip == true"><i class="el-icon-info navtipcolor"></i>变更导航个数，移动顺序，更换页面链接均需提交小程序审核后重新发布生效，其他变更立即生效。小程序审核请联系品牌项目经理。</div>
  </div>
</template>

<script>
  import excelConfig from '../../common/js/excel_config.js'
  export default {
    name: "navpath",
    data() {
      return {
        projectName: 'gic-web', // 当前项目名
        linkHref:''
      }
    },
    props: {
      navpath: {
        type: Array,
        default: []
      },
      navtip: {
        type: Boolean,
        default: false
      }
    },
    mounted(){
      this.linkHref = excelConfig.config + '/report/#/memberSummary'
    },
    methods:{ 
      
    }
  }
</script>

<style scoped>
.navwrap{
  padding: 20px 25px;
  /*margin-top: 20px;*/
  background-color: #fff;
  border-radius: 2px;
  /*height: 100px;*/
  box-sizing: border-box;
}
.boxbttom{
  border-bottom: 1px solid #e4e7ed;
}
.boxshow {
  border-bottom: 1px solid #e4e7ed;
  /*box-shadow: 5px -1px 5px #dfdfdf;*/
}
 .navtitle{
   margin: 24px 0 0 0;
   font-size: 20px;
   color: #303133;
   font-weight:500;
 }
  .navtip{
    width: 100%;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
    border-radius: 2px;
    color: #606266;
    background-color: #f4f4f5;
  }
  .navmTop{
    margin-top: 25px;
  }
  .navtipcolor{
    margin: 0 12px;
    color: #1890ff;
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
