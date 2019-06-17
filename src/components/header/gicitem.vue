<template>
  <div class="itemlink-gic"  @mouseover="showNav" @mouseout="hiddenNav">GIC商户后台
    <i class="el-icon-arrow-down arrowico"></i>
    <div class="itempanel" id="itempanel">
      <div class="gicnavlink">
        <div class="container">
          <div class="container-item">
            <ul class="container-ul">
              <h1 class="container-title">小程序</h1>
              <li class="container-listlik"  @click="changeRoute('themeSetting')">主题</li>
              <li class="container-listlik"  @click="changeRoute('navSetting')">导航设定</li>
              <li class="container-listlik"  @click="changeRoute('custom')">自定义页面</li>
              <li class="container-listlik"  @click="changeRoute('member')">会员体系</li>
              <li class="container-listlik"  @click="changeRoute('membercard')">会员卡</li>
              <li class="container-listlik"  @click="changeRoute('privilege')">特权</li>
              <li class="container-listlik"  @click="changeRoute('merchant')">集团商户</li>
              <li class="container-listlik"  @click="changeRoute('integral')">积分</li>
              <li class="container-listlik"  @click="changeRoute('membercenter')">会员中心</li>
              <!--<li :class="curactive == 'memberanalysis' ? 'curactive' : ''" class="container-listlik" @click="changeRoute('memberanalysis')">会员分析</li>-->
            </ul>
          </div>
          <div class="container-item">
            <ul class="container-ul">
              <h1 class="container-title">企业管理</h1>
              <li class="container-listlik" @click="changeRoute('shop_active')">门店活动</li>
              <li class="container-listlik" @click="changeRoute('service')">服务监督</li>
              <li class="container-listlik" @click="changeRoute('company')">企业资料</li>
              <li class="container-listlik" @click="changeRoute('money')">财务中心</li>
              
              <!-- <li class="container-listlik"  @click="changeRoute('shop_tag')">门店标签</li> -->
            </ul>
          </div>
          <div class="container-item">
            <ul class="container-ul">
              <h1 class="container-title">配置中心</h1>
              <li class="container-listlik"  @click="changeRoute('allow_bind')">授权绑定管理</li>
              <li class="container-listlik"  @click="changeRoute('public_num')">公众号配置</li>
              <li class="container-listlik"  @click="changeRoute('ad_manage')">广告位管理</li>
              <li class="container-listlik">开放平台</li>
              <li class="container-listlik"  @click="changeRoute('erweima')">二维码管理</li>
              <li class="container-listlik">营销场景配置</li>
              <!-- <li class="container-listlik"  @click="changeRoute('shop_info')">商户信息</li>
              <li class="container-listlik"  @click="changeRoute('member_config')">会员设置</li>
              <li class="container-listlik"  @click="changeRoute('operate_style')">运营策略</li>
              <li class="container-listlik"  @click="changeRoute('user_defined')">自定义配置</li> -->
            </ul>
          </div>
          <div class="container-item">
            <ul class="container-ul">
              <h1 class="container-title">好办后台</h1>
              <li class="container-listlik" @click="changeRoute('task_manage')">任务管理</li>
              <li class="container-listlik">事务分配机制</li>
              <li class="container-listlik">日报管理</li>
              <li class="container-listlik">公告管理</li>
              <li class="container-listlik">审核中心</li>
              <li class="container-listlik">会员在线沟通</li>
              <li class="container-listlik">问题反馈</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="gicnavarrow">
        <span class="arrow"></span>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "gicitem",
      data() {
        return {
            curactive: '',
            menuItem: [],
            loading: true
        }
      },
      watch: {
        "$route": function () {
          this.curactive = this.$route.meta.name;
         },
      },
      methods: {
        showNav() {
          document.getElementById('itempanel').style.display = 'block';
        },
        hiddenNav() {
          document.getElementById('itempanel').style.display = 'none';
        },
        changeRoute(route) {
          document.getElementById('itempanel').style.display = 'none';
          this.$router.push(route);
        },
        getMenu() {
          this.menuItem = JSON.parse(sessionStorage.getItem('menuList'));
          if(this.menuItem && this.menuItem.length > 0) {
            this.loading = false;
          }else {
            this.axios.get('/gic/get-menu').then(res => {
              if(res.data.success) {
                  this.menuItem = res.data.list;
              }else {
                checkFalse(res.data.errorMessage);
              }
            }).catch(err => {
              checkStatus(err);
            })
          }
        }
      },
      mounted() {
          // this.getMenu();
      }
    }
</script>

<style lang="less">
  @import "../../../static/css/variable.less";
  .itemlink-gic{
    float: left;
    display: inline-block;
    height: 66px;
    padding: 0 20px;
    position: relative;
    color: #7e8c8d;
    cursor: pointer;
    &:hover{
      color: @main-color;
    }
    &:hover .arrowico{
      transform: rotate(180deg);
    }
    &:hover .itempanel{
      display: block;
    }
    .curitemlink{
      border-bottom: 2px solid @main-color;
    }
  }
  .itempanel{
    display: none;
  }
  .gicnavlink{
    position: absolute;
    left: -100px;
    top: 60px;
    width: 966px;
    min-height: 600px;
    background: #fff;
    min-width: 150px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 12px;
    z-index: 1;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .gicnavarrow{
    position: absolute;
    left: 50%;
    top: 50px;
    transform: translate(-50%);
    z-index: 3;
    .arrow{
      position: relative;
      display: block;
      background-color: #fff;
      width: 6px;
      height: 6px;
      border: 0;
      border-top: 1px solid #ebeef5;
      border-right: 1px solid  #ebeef5;
      transform: translate(0px, 7px) rotate(-45deg);
      filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
      &:after{
        position: absolute;
        left: 0;
        top: -2px;
        width: 10px;
        height: 1px;
        content: '';
        border-radius: 2px;
        background-color: #fff;
        transform-origin: left top;
        transform: rotate(45deg);
      }
    }
  }
  .container{
    display: flex;
    flex-wrap: wrap;
    flex-flow: row  wrap;
    padding: 30px;
    &-ul{
      line-height: 40px;
    }
    &-title{
      color: #303133;
      font-size: 14px;
      font-weight: bold;
    }
    &-listlik{
      font-size: 12px;
      color: #606266;
    }
    &-item{
      flex: 0 0 150px;
    }
  }
  .curactive{
    color: #fede29;
  }
</style>
