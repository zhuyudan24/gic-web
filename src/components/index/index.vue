<template>
    <div id="index">
      <vue-gic-header :projectName="projectName"  :collapseFlag="collapseFlag" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-gic-header>
      <div id="content" class="content">
        <router-view></router-view>
      </div>
    </div>
</template>
<script>
  import {checkFalse, checkStatus, checkSuccess} from "../../common/js/checkStatus.js";
  export default {
    name: 'App',
    data () {
      return {
          collapseFlag: false,
          projectName: 'gic-web'
      }
    },
    methods: {
      toRouterView(val) {
        this.$router.push({
          path: val.path
        })
      },
      collapseTag(val){
        console.log(val);
        this.$store.state.show = val;
      }
    },
    mounted() {
      document.title = window.localStorage.getItem('brandName');
    }
  }
</script>
<style lang="scss" scoped>
#index{
  .content{
    padding-top: 64px;
    box-sizing: border-box;
  }
}

/*.user-header-pop {
  min-width: 95px;
}

.el-popover {
  min-width: 95px;
}*/
.user-header-pop {
  min-width: 95px;
}
.el-popover.user-header-pop {
  min-width: 95px;
}
.el-dialog__wrapper.user-form-dialog /deep/ {
  width: 100px;
}

.user-form-dialog /deep/ {
  .el-dialog {
    min-width: 425px;
  }

  .el-dialog__body {
    min-width: 425px;
  }

  .el-form {
    min-width: 425px;
  }
}
</style>

