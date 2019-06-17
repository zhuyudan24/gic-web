<template>
  <div class="cardmenu" :class="{collapse: $store.state.show}">
    <div class="cardtitle">
      <span v-show="!$store.state.show">小程序配置</span>
    </div>
    <div class="cardmenu-item">
      <el-menu style="border-right: 0;" class="el-menu-vertical-demo cardmenupanel" :default-active="defaultActive"
               :router="true" unique-opened text-color="#c0c4cc" active-text-color="#fff"  :collapse="$store.state.show">
        <el-menu-item index="/themeSetting">
          <i class="iconfont icon-shequ-zhutifenxiang"></i>
          <span slot="title">主题设置</span>
        </el-menu-item>
        <el-menu-item index="/navSetting">
          <i class="iconfont icon-daohang-"></i>
          <span slot="title">导航设置</span>
        </el-menu-item>
        <el-menu-item index="/custom">
          <i class="iconfont icon-icon_zidingyiyemianshezhi"></i>
          <span slot="title">自定义页面</span>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <i class="iconfont icon-huiyuan-"></i>
            <span slot="title">会员功能页面</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/member">会员体系</el-menu-item>
            <el-menu-item index="/membercenter">会员中心</el-menu-item>
            <el-menu-item index="2-3">积分商城</el-menu-item>
            <el-menu-item index="2-3">附近门店</el-menu-item>
            <el-menu-item index="2-3">会员任务</el-menu-item>
            <el-menu-item index="2-3">会员成就</el-menu-item>
            <el-menu-item index="2-3">兑换记录</el-menu-item>
            <el-menu-item index="2-3">门店订单</el-menu-item>
            <el-menu-item index="2-3">地址管理</el-menu-item>
            <el-menu-item index="2-3">个人资料</el-menu-item>
            <el-menu-item index="2-3">我的专属导购</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="4">
          <i class="iconfont icon-wsc"></i>
          <span slot="title">微信商城</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
    export default {
      name: "leftMenu",
      props: {
        defaultActive: {
          type: String,
          default: ''
        },
				defaultOpeneds: {
					type: Array,
					default: []
				}
      }
    }
</script>

<style scoped lang="less">
  @import "../../../static/css/variable.less";
  .cardmenu{
    flex: 0 0 200px;
    width: 200px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: @sidebgcolor;
    cursor: pointer;
    transition: all .2s ease;
   &-item{
      margin-top: 35px;
    }
   }
  .collapse{
    transition: all .3s ease;
    flex: 0 0 58px;
    transform: translateX(-8px);
    overflow: hidden;
  }
  .cardtitle{
    margin-top: 20px;
    margin-left: 24px;
    font-size: 16px;
    color: #fff;
  }
  .cardmenupanel{
    background-color: @sidebgcolor;
  }
  .cardmenupanel .el-menu li{
    background-color: @sidebgcolor;
  }
  .cardmenupanel .el-submenu .el-menu-item:hover{
    background-color: @navbgcolor;
  }
  .cardmenupanel .el-submenu__title:hover{
    background-color: @navbgcolor;
  }
  .cardmenupanel .el-menu-item:hover{
    background-color: @navbgcolor;
  }
  .cardmenupanel .el-submenu__icon-arrow{
    color: @navbgcolor;
  }
  .cardmenupanel .el-submenu:nth-child(2) .el-submenu__icon-arrow{
    color: #fff;
  }
  .cardmenupanel .el-submenu .el-menu-item {
    position: relative;
  &:before{
     position: absolute;
     content: '●';
     left: 25px;
     top: 0px;
     font-size: 10px;
     color: #c0c4cc;
   }
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to{
    /*transform: translateX(-200px);*/
    /*opacity: 1;*/
  }
  .cardmenu-item .el-menu-item.is-active{
    background: #1890ff;
  }
  .cardmenu-item .el-menu-item:hover{
  }
  .cardmenu-item .cardmenupanel .el-submenu .el-menu-item:hover .iconfont {
    color: #1890ff;
  }
  .cardmenu-item .el-menu .el-submenu{
    /*background: #1890ff;*/
  }
</style>
