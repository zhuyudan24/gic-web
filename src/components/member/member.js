import leftMenu from 'components/leftMenu/leftMenu.vue'
import navbar from 'components/navbar/navbartwo.vue'
import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
let qs = require('qs');
export default {
  name: "member",
  data() {
    return {
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      defaultActive: '/member',
			defaultOpeneds: ['/member'],
			searchtext: '',
      navpath: [
        {
          name: '小程序配置',
          path: ''
        },
        {
          name: '会员功能页面',
          path: ''
        },
        {
          name: '会员体系',
          path: '/member'
        }
      ],
      navtab: [
        {
          name: '会员卡',
          tab: 2
        },
        {
          name: '积分',
          tab:  3
        },
        {
          name: '特权',
          tab:  4
        },
        {
          name: '集团商户',
          tab:  5
        }
      ],
      shopBack:{
        'shopBackShow':false,
        'shopBackCount':0
      },
      tableData: [],
      curpageType: 2,
      page: {
        currentPage: 1,
        pageSize: 20,
				totalPage: 0
      },
      pageLink: '',
      curSortType: 0,
      deleteAll: [],
      sortColumn: '',
      dialogLinkVisible: false,
      activeLinkName: 'first',
      path: '',
      qrcode: '',
      collapseFlag: false,
      leftModulesName: '小程序配置',
      leftMenuRouter: [],
      backtab: this.$route.query.backtab || '',
      activeitem: 2,
      relevance: true,

      loading:false,
    }
  },
  methods: {
    onError() {
      this.$message({
        message: '复制失败',
        type: 'error'
      });
    },
    onCopy() {
      this.$message({
        message: '已复制到粘贴板',
        type: 'success'
      });
    },
    handleLinkPage(pageId) {
      this.activeLinkName = 'first';
      this.dialogLinkVisible = true;
      this.axios.get('/api-admin/page-qrcode',{
        params: {
          requestProject: 'gic-web',
          pageId: pageId
        }
      }).then(res => {
        if(res.data.errorCode === 0) {
          if(res.data.result) {
            this.path = res.data.result.path;
            this.qrcode = res.data.result.qrcode;
          }else {
            checkFalse('页面链接数据为空');
            this.dialogLinkVisible = false;
          }
        }else {
          checkFalse();
          this.dialogLinkVisible = false;
        }
      }).catch(err => {

      })
    },
    sortChange(column, prop, order) {
      this.sortColumn = column.prop;
      if(column.order === 'descending') {
        this.curSortType = 2;
      }else if(column.order === 'ascending') {
        this.curSortType = 1;
      }
      this.getList();
    },
		hanldeSearch() {
			this.page.currentPage = 1;
			this.getList();
		},
    handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getList();
    },
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getList();
    },
		changePublish(item) {
      let status = '';
      if(item.status > 1) {
        status = 1;
      }else {
        status = 2;
      }
			this.axios.post('/api-admin/update-page-state',qs.stringify({
        requestProject: 'gic-web',
				pageId: item.pageId,
				updateType: status,
				pageType: this.curpageType
			})).then(res => {
				if(res.data.errorCode === 0) {
          item.status = status;
					checkSuccess();
					setTimeout(() => {
            this.getList();
          },1000);
				}else {
					checkFalse(res.data.message);
					return false;
				}
			}).catch(err => {
				checkStatus(err);
			})
		},
    handleLink(row) {
      if(this.curpageType == 2) {
        this.pageLink = 'membercard';
      }else if(this.curpageType == 3) {
        this.pageLink = 'integral';
      }else if(this.curpageType == 4) {
        this.pageLink = 'privilege';
      }else if(this.curpageType == 5) {
        this.pageLink = 'merchant';
      }
      if(this.curpageType !== 5) {
        this.$router.push({ path: this.pageLink, query: { pageId: row.pageId}});
      }else {
        this.$router.push({ path: this.pageLink, query: { pageId: row.pageId,title: row.title}});
      }
    },
    handleSelectionChange(val) {
      let tempArr = val;
      this.deleteAll = tempArr.filter(item => {
        if(item.status == 1) {
          this.$refs.multipleTable.toggleRowSelection(item,false);
        }
        return item.status !== 1
      });
    },
    handleDeleteAll() {
      if(this.deleteAll.length <= 0) {
        checkFalse('请勾选删除条目');
        return false;
      }
      let pageIds = [];
      this.deleteAll.forEach(item => {
        pageIds.push(item.pageId);
      });
      let ids = '';
      if(pageIds.length > 0) {
        ids = pageIds.join(',');
      }
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/api-admin/del-pages',qs.stringify({'pageIds': ids, requestProject: 'gic-web'})).then(res =>{
          if(res.data.errorCode == 0) {
            checkSuccess();
            this.getList();
          }else {
            checkFalse();
            return false;
          }
        }).catch(err => {
          checkStatus(err);
        })
      }).catch((err) => {
        checkStatus(err);
      });
    },
    handleDelete(id){
      this.axios.post('/api-admin/del-page',qs.stringify({'pageId':id, requestProject: 'gic-web'})).then(res =>{
        if(res.data.errorCode == 0) {
          checkSuccess();
          this.getList();
          return false;
        }else {
          checkFalse();
          return false;
        }
      }).catch(err => {
        checkStatus(err);
      })
    },
    getList() {
      this.loading = true;
      this.axios.get('/api-admin/list-page',{params:{
          requestProject: 'gic-web',
          pageType: this.curpageType,
          title: this.searchtext,
          sortType: this.curSortType,
          currentPage: this.page.currentPage,
          pageSize: this.page.pageSize,
          sortColumn: this.sortColumn
        }}).then(res => {
          this.loading = false;
        if(res.data.errorCode === 0) {
          this.page.currentPage = res.data.result.currentPage;
          this.page.totalPage = res.data.result.totalCount;
          this.tableData = res.data.result.result;
        }
      }).catch(err => {
        checkStatus(err);
      });
    },
    getCurTab(tab) {
      this.curpageType = tab;
      this.tableData = [];
      this.curSortType = 0;
      this.sortColumn = '';
      this.page.currentPage = 1;
      this.page.pageSize = 20;
      this.page.totalPage = 0;
      this.getList();
    },
    addPage() {
      if(this.curpageType == 2) {
        this.pageLink = 'membercard';
      }else if(this.curpageType == 3) {
        this.pageLink = 'integral';
      }else if(this.curpageType == 4) {
        this.pageLink = 'privilege';
      }else if(this.curpageType == 5) {
        this.pageLink = 'merchant';
      }
      this.$router.push({ path: this.pageLink, query: { id: ''}})
    },
    isRelevance() {
      this.axios.get('/api-auth/is-relevance-clique',{
        params: {
          requestProject: 'gic-web'
        }
      }).then(res => {
        if(res.data.errorCode === 0) {
          this.relevance = res.data.result;
          if(this.relevance) {
            this.getTabList();
          }else {
            this.navtab = this.navtab.filter(item => {
              return item.tab !== 5;
            });
            this.getTabListTwo();
          }
        }
      }).catch(err => {
        checkStatus(err);
      })
    },
    getTabListTwo() {
      if(this.backtab) {
        if(this.backtab == 'membercard') {
          this.getCurTab(2);
          this.activeitem = 2;
        }
        if(this.backtab == 'integral') {
          this.getCurTab(3);
          this.activeitem = 3;
        }
        if(this.backtab == 'privilege') {
          this.getCurTab(4);
          this.activeitem = 4;
        }
      }else {
        this.getList();
      }
    },
    getTabList() {
      if(this.backtab) {
        if(this.backtab == 'membercard') {
          this.getCurTab(2);
          this.activeitem = 2;
        }
        if(this.backtab == 'integral') {
          this.getCurTab(3);
          this.activeitem = 3;
        }
        if(this.backtab == 'privilege') {
          this.getCurTab(4);
          this.activeitem = 4;
        }
        if(this.backtab == 'merchant') {
          this.getCurTab(5);
          this.activeitem = 5;
        }
      }else {
        this.getList();
      }
    }
  },
  filters: {
    formatTime(value) {
      var date = new Date(value);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = (date.getDate() < 10 ? '0'+ (date.getDate()): date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y+M+D+h+m+s;
    }
  },
  mounted() {
    this.isRelevance();
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
    'v-leftMenu': leftMenu,
    'v-navbar': navbar,
  }
}
