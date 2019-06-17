<template>
    <div class="leftBar-wrap">
        <div class="cardmenu" :class="{collapse: $store.state.show}">
            <div class="cardtitle" v-show="!$store.state.show">
                <span>{{leftPath.navTitle}}</span>
            </div>
            <div class="cardmenu-item">
              <el-menu :default-active="$route.path" style="border-right: 0;" class="el-menu-vertical-demo cardmenupanel" :router="true" unique-opened text-color="#fff" :collapse="$store.state.show">
                <el-menu-item index="/erweima_edit">
                  <i class="iconfont menu-icon icon-wsc"></i>
                  <span slot="title">接口二维码</span>
                </el-menu-item>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="iconfont menu-icon icon-huiyuan-"></i>
                    <span slot="title">会员功能页面</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/member" style="padding-left:53px;">会员体系</el-menu-item>
                    <el-menu-item index="/membercenter" style="padding-left:53px;">会员中心</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="">
                  <i class="iconfont menu-icon icon-wsc"></i>
                  <span slot="title">微信商城</span>
                </el-menu-item>
              </el-menu>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "leftBar",
        data() {
            return {
                leftPath:{
                  navTitle: '公众号配置',
                  nav:[{
                    title:'自动回复',
                    icon: 'icon-wsc',
                    url: '',
                    children: [{
                      title:'被关注回复',
                      url: '/public_num'
                    },{
                      title:'关键字回复',
                      url: '/public_num_keyword'
                    }]
                  },{
                    title:'自定义菜单',
                    icon: 'icon-wsc',
                    url: '/public_num_defined'
                  }]
                }
            }
        }
    }
</script>

<style scoped lang="less">
  .leftBar-wrap .cardmenu{
    flex: 0 0 200px;
    width: 200px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #020b21;
    cursor: pointer;
    transition: all .2s ease;
   }
  .leftBar-wrap .collapse{
    transition: all .3s ease;
    flex: 0 0 58px;
    width: 58px;
    transform: translateX(-8px);
    overflow: hidden;
  }
  .leftBar-wrap .cardtitle{
    font-size: 20px;
    color: #fff;
    padding-left: 20px;
    height: 56px;
    line-height: 56px;
  }
  .leftBar-wrap .el-menu .el-menu-item,.el-menu .el-submenu{
    background: #020b21;
  }
  .leftBar-wrap .cardmenu-item /deep/ .el-submenu__title:hover {
    background-color: #020b21;
  }
  .leftBar-wrap .cardmenu-item /deep/ .el-menu-item-group .el-menu-item-group__title{
    background-color: #020b21;
    display: none;
  }
  .leftBar-wrap .cardmenu-item /deep/ .el-submenu__title i {
    color: #fff;
  }
 .leftBar-wrap .el-menu-item.is-active {
    color: #fff;
    background-color: #1890ff;
}
  .leftBar-wrap .cardmenu-item /deep/ .el-submenu__title,.leftBar-wrap .cardmenu-item /deep/ .el-menu-item,.leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item{
    height: 40px;
    line-height: 40px;
  }
  .leftBar-wrap .cardmenu-item /deep/ li.el-menu-item:hover{
    background-color: #1890ff;
  }
  .leftBar-wrap .cardmenupanel .el-submenu .el-menu-item {
    position: relative;
  &:before{
     position: absolute;
     content: '●';
     left: 35px;
     top: 0px;
     font-size: 10px;
     color: #c0c4cc;
   }
  }
  .leftBar-wrap .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .leftBar-wrap .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .leftBar-wrap .cardmenu-item .menu-icon{
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
    display: inline-block;
    color: #fff
  }
</style>
