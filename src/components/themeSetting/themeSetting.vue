<template>
  <div>
    <div class="themespace">
      <v-nav :navpath="navpath"></v-nav>
      <div class="theme-content">
        <div class="theme-group">
          <label>配色方案</label>
          <div class="theme-value">
            <div class="style-color" :class="curTheme==2?'style-active':''" @click="selectColor(2)">
              <span class="style1-color1"></span>
              <span class="style1-color2"></span>
              <span class="style1-color3"></span>
            </div>
            <div class="style-color" :class="curTheme==1?'style-active':''" @click="selectColor(1)">
              <span class="style2-color1"></span>
              <span class="style2-color2"></span>
              <span class="style2-color3"></span>
            </div>
            <div class="style-color" :class="curTheme==3?'style-active':''" @click="selectColor(3)">
              <span class="style3-color1"></span>
              <span class="style3-color2"></span>
              <span class="style3-color3"></span>
            </div>
          </div>
        </div>
        <div class="theme-group">
          <label>风格示例</label>
          <div class="theme-value">
            <img v-if="curTheme == 2 " style="min-width: 800px;max-width: 900px;" :src="red_themes">
            <img v-if="curTheme == 1 " style="min-width: 800px;max-width: 900px;" :src="gray_themes">
            <img v-if="curTheme == 3 " style="min-width: 800px;max-width: 900px;" :src="green_themes">
          </div>
        </div>
      </div>
    </div>
    <div class="footwrap" :class="{mLeftWrap: $store.state.show}">
      <el-button size="small" type="primary" @click="submitPreve">保 存</el-button>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import nav from 'components/nav/nav.vue'
  import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
  let qs = require('qs');
  export default {
    data() {
      return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        defaultActive: '/themeSetting',
        red_themes: require('../../../static/img/red_themes.png'),
        gray_themes: require('../../../static/img/gray_themes.png'),
        green_themes: require('../../../static/img/green_themes.png'),
        navpath: [
          {
            name: '小程序配置',
            path: ''
          },
          {
            name: '主题设置',
            path: '/themeSetting'
          }
        ],
        curTheme: 2,
        collapseFlag: false,
        leftModulesName: '小程序配置',
        leftMenuRouter: []
      }
    },
    methods: {
      getTheme() {
        this.axios.get('/api-admin/get-custom-theme',{
          params: {
            requestProject: 'gic-web'
          }
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.curTheme = res.data.result.theme;
          }
        }).catch(err => {
          checkStatus(err);
        })
      },
      selectColor(type) {
        this.curTheme = type;
      },
      submitPreve() {
        this.axios.post('/api-admin/save-custom-theme',qs.stringify({
          requestProject: 'gic-web',
          theme: this.curTheme
        })).then(res => {
          if(res.data.errorCode == 0) {
            checkSuccess();
          }
        }).catch(err => {
          checkStatus(err);
        })
      }
    },
    mounted() {
      this.getTheme();
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      }
    },
    created() {
      this.$store.commit('isShowFoot',true);
    },
    components: {
      'v-nav': nav
    }
  }
</script>

<style lang="less">
  .themespace{
    /*padding-bottom: 80px;*/
  }
  .theme-content{
    height: 700px;
    margin:25px;
    background: #fff;
    padding:25px;
  }
  .theme-group{
    margin-top:30px;
    white-space: nowrap;
    display:flex;
  }
  .theme-group label{
    width:70px;
    display:inline-block;
    text-align: right;
    font-size:14px;
    color:#606266;
    margin-right:10px;
  }
  .theme-value{
    display:inline-block;
    vertical-align: top;
    flex:1;
  }
  .style-color{
    display:flex;
    width:50px;
    height:16px;
    cursor: pointer;
    float:left;
    margin-right:20px;
    padding:2px;
    border:1px solid #fff;
  }
  .style-active{
    border:1px solid #1890ff;
  }
  .style-color span{
    flex:1;
  }
  .style1-color1{
    background:#f64e4e;

  }
  .style1-color2{
    // border:1px solid #dcdfe6;
    background:#303033;
    border-left:none;
  }
  .style1-color3{
    border:1px solid #dcdfe6;
    background:#fff;
    border-left:none;
  }
  .style2-color1{
    background:#232321;
    border:1px solid #232321;
    border-left:none;
  }
  .style2-color2{
    background:#dabb7d;
    border:1px solid #dabb7d;
    border-left:none;
  }
  .style2-color3{
    background:#fff;
    border:1px solid #dcdfe6;
    border-left: none;
  }
  .style3-color1{
    background:#476968;
    border:1px solid #476968;
    border-left:none;
  }
  .style3-color2{
    background:#393939;
    border:1px solid #393939;
    border-left:none;
  }
  .style3-color3{
    background:#fff;
    border:1px solid #dcdfe6;
    border-left:none;
  }
  .theme-value img{
    width: 100%;
    display:inline-block;
    vertical-align:top;
  }
  .theme-btn{
    margin:25px 0 50px 80px;
  }
  .footwrap{
    position: fixed;
    bottom: 0;
    right: 0;
    left: 200px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid #ddd;
    background: #fff;
    transition: all .2s ease;
    z-index: 3;
  }
  .mLeftWrap{
    left: 64px;
    transition: all .3s ease;
  }
</style>
