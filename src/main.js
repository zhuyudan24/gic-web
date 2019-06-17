import 'babel-polyfill';
import esPromise from 'es6-promise';
esPromise.polyfill();
import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui'
import VueAxios from 'vue-axios'
import axios from 'axios'
import store from './store/store'
import * as types from './store/types'
import '../static/css/index.less'
import '../static/font/iconfont.css'
import '../theme/index.css'
import './plugins/css/metro-style.css';
import './plugins/css/integral-settlementint.css';
import gicinput from 'components/com/gicinput'
import gictextarea from 'components/com/gictextarea'
// 删除提示
import deleteTip from 'components/com/deleteTip'

// 新增公共头部插件
// import vueGicHeader from '@gic-test/vue-gic-header'
// // 新增公共左侧菜单插件
// import vueGicAsideMenu from '@gic-test/vue-gic-aside-menu'

// // 新增公共 footer插件
// import vueGicFooter from '@gic-test/vue-gic-footer'
// // 新增门店插件
// import vueGicStore from '@gic-test/vue-gic-store'
// // 省市县联动插件
// import vueAreaAb from '@gic-test/vue-area-ab'
// // 照片墙
// import vueGicUploadImage from '@gic-test/vue-gic-upload-image'
// // 单个上传图片
// import vueGicImgPreview from '@gic-test/vue-gic-img-preview'
// // 卡券
// import vueGicCard from '@gic-test/vue-gic-card'

// // 新版门店选择插件
// import vueGicStoreNew from '@gic-test/vue-gic-store-new'
// // 会员分组
// import vueGicMemberGroup from '@gic-test/vue-gic-member-group'
// // 人群筛选器
// import vueGicPeople from '@gic-test/vue-gic-people/src/lib'
// // 下载表格
// import vueGicExportExcel from '@gic-test/vue-gic-export-excel'
// 上下拖拽组件
import VueDND from 'awe-dnd'


// Vue.use(vueGicFooter)
// Vue.use(vueGicHeader)
// Vue.use(vueGicAsideMenu)
// Vue.use(vueGicStore)
// Vue.use(vueAreaAb)
// Vue.use(vueGicPeople)
// Vue.use(vueGicUploadImage)
// Vue.use(vueGicImgPreview)
// Vue.use(vueGicCard)
// Vue.use(vueGicStoreNew)
// Vue.use(vueGicMemberGroup)
// Vue.use(vueGicExportExcel)
Vue.use(VueDND)

window.Promise = Promise
// Vue.use(vueGicStoreLinkage)

/* 朱 start*/
// 下载表格
// import Blob from './vendor/Blob.js'
// import Export2Excel from './vendor/Export2Excel.js'

import * as filters from './common/js/filter'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// 复制粘贴
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 粒子运动
// import VueParticles from 'vue-particles'
// Vue.use(VueParticles)

/* 朱 end*/

Vue.config.productionTip = false;
// Vue.use(ElementUI);

Vue.use(VueAxios,axios);

Vue.axios.defaults.withCredentials = true ;// 跨域cookie访问
Vue.component('gic-textarea',gictextarea);
Vue.component('gic-input', gicinput);
Vue.component('delete-tip', deleteTip);

// Vue.axios.defaults.baseURL =  process.env['NODE_ENV'] === 'development' ? 'http://gicdev.demogic.com' : 'https://hope.demogic.com/';
Vue.axios.interceptors.request.use(
  config => {
    let sign = localStorage.getItem("sign");
    if (sign) {
      config.headers["sign"] = sign;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
Vue.axios.interceptors.response.use(
  response => {
    if(response.status == 200 && response.data.errorCode == 401) {
      router.replace({
        path: 'login',
        query: {redirect: router.currentRoute.path}
      })
    }
    return response;
  },
  error => {
    console.log(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.commit(types.LOGOUT);
          router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.path}
          });
      }
    }
    return Promise.reject(error.response.status.toString())
  });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
