<template>
  <div class="navuserinfo fr">
    <el-popover placement="bottom" title="" width="95" trigger="hover">
      <ul class="navsuerwrap">
        <li class="useritem"><a class="usertext" href="">账户信息</a></li>
        <li class="useritem"><a class="usertext" href="">修改密码</a></li>
        <li class="useritem loginout"><a class="usertext" href="">退出登录</a></li>
      </ul>
      <a class="navusername" slot="reference">管理员
        <i class="el-icon-arrow-down arrowico"></i>
      </a>
    </el-popover>
  </div>
</template>

<script>
  import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
    export default {
      name: "user",
      methods: {
        loginOut() {
          this.axios.post('/api/gic/doLogout').then(res => {
              if(res.data.success) {
                checkSuccess('已退出，请重新登录');
                this.$router.push('login');
              }else{
                checkFalse();
              }
          }).catch(err => {
            checkStatus(err);
          })
        }
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../static/css/variable.less";
  .navuserinfo{
    width: 140px;
    text-align: center;
    .navusername{
      position: relative;
      display: inline-block;
      padding: 0 20px;
      height: 48px;
      &:hover{
        color: @main-color;
      }
      &:hover .arrowico{
        transform: rotate(180deg);
      }
    }
  }
  .navsuerwrap{
    .useritem{
      position: relative;
      line-height: 35px;
      height: 35px;
      margin-bottom: 10px;
      text-align: center;
      &:hover .usertext{
        display: block;
        width: 119px;
        margin-left: -12px;
        color: @main-color;
        background-color: @userinfobgcolor;
        cursor: pointer;
      }
    }
    .loginout{
      border-top: 1px solid #eee;
      box-sizing: border-box;
      padding: 15px 0;
      margin-bottom: 20px;
    }
  }
</style>
