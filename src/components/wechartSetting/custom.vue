<template>
  <div class="xcx-wrap">
    <v-nav :navpath="navpath"></v-nav>
    <div class="containerwrap">
      <div class="xcx-container-wrap">
        <div class="data-search">
          <div class="fl">
            <div class="mall-search-input">
              <el-input v-model='searchtext' placeholder="请输入页面名称" class="search-input"  :clearable="true"
                        prefix-icon='el-icon-search' @keyup.native.enter='hanldeSearch'></el-input>
            </div>
          </div>
          <div class="fr">
            <el-row>
              <el-button type="danger" plain @click="handleDeleteAll">批量删除</el-button>
              <el-button type="primary" @click="addPage">新建页面</el-button>
            </el-row>
          </div>
        </div>
        <div class="table-content">
          <el-table :data="tableData" tooltip-effect="dark"  ref="multipleTable" @selection-change="handleSelectionChange" @sort-change='sortChange' class="table-no-line-wrap">
            <el-table-column type="selection"  width="55"> </el-table-column>
            <el-table-column prop="title" label="页面名称"> </el-table-column>
            <el-table-column prop="createTime" sortable='custom' label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | formatTime}}
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" sortable='custom' label="最后编辑时间">
              <template slot-scope="scope">
                {{ scope.row.updateTime | formatTime}}
              </template>
            </el-table-column>
            <el-table-column prop="useTimes" label="使用次数" >
              <template slot-scope="scope">
                <span v-if="scope.row.useTimes">{{ scope.row.useTimes}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="发布状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status == 1 ? true: false" @change='changePublish(scope.row)'></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="操作" width="180">
              <template slot-scope="scope">
                <div class="operate">
                  <router-link  :to="{path:'/customAdd',query:{pageId:scope.row.pageId}}" class="operate-btn">编辑</router-link>
                  <a class="operate-btn" v-if="scope.row.status == 1" @click="handleLinkPage(scope.row.pageId)">页面链接</a>
                  <delete-tip @confirm="handleDelete(scope.row.pageId)" tips="确定删除该自定义页面吗?">
                    <a class="operate-btn" v-if="scope.row.useTimes < 1">删除</a>
                  </delete-tip>
                  <!-- <a class="operate-btn" v-if="scope.row.useTimes < 1" @click="handleDelete(scope.row.pageId)" >删除</a> -->
                </div>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="no-data-wrap">
                <div class="no-data-icon" >
                  <img src="../../../static/img/no-data_icon.png" alt="">
                </div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
          <div class="page" v-if="tableData.length > 0">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="page.totalPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <el-dialog  title="页面链接" :visible.sync="dialogLinkVisible"  width="500px">
      <el-tabs v-model="activeLinkName">
        <el-tab-pane label="页面链接" name="first">
          <div class="paneheight">
            <el-input style="width: 400px;"  v-model="path" :disabled="true"></el-input>
            <a v-if="path" class="linkcopybtn"  v-clipboard:copy="path" v-clipboard:success="onCopy" v-clipboard:error="onError">
              复制
            </a>
          </div>
        </el-tab-pane>
        <el-tab-pane label="小程序二维码" name="second">
          <div class="paneheight imgpos">
            <img width="150" height="150" :src="qrcode" alt="">
          </div>
        </el-tab-pane>
      </el-tabs>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogLinkVisible = false">关 闭</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
  import nav from 'components/nav/nav.vue'
  import { checkSuccess,checkFalse,checkStatus } from '../../common/js/checkStatus.js'
  let qs = require('qs');
  export default {
    name: "custom",
    data() {
      return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        defaultActive: '/custom',
        searchtext: '',
        navpath: [
          {
            name: '小程序配置',
            path: ''
          },
          {
            name: '自定义页面',
            path: '/custom'
          }
        ],
        tableData: [],
        carTab: 'customAdd',
        page: {
          currentPage: 1,
          pageSize: 20,
          totalPage: 0
        },
        curSortType: 0,
        sortColumn: '',
        dialogLinkVisible: false,
        activeLinkName: 'first',
        path: '',
        qrcode: '',
        collapseFlag: false,
        leftModulesName: '小程序配置',
        leftMenuRouter: [],
        deleteAll: []
      }
    },
    methods: {
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
              this.getList()
            },1000);
          }else {
            checkFalse(res.data.message);
            return false;
          }
        }).catch(err => {
          checkStatus(err);
        })
      },
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
      addPage() {
        this.$router.push({ path: this.carTab})
      },
      getList() {
        this.axios.get('/api-admin/list-page',{params:{
            requestProject: 'gic-web',
            pageType: 1,
            title: this.searchtext,
            sortType: this.curSortType,
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
            sortColumn: this.sortColumn
          }}).then(res => {
          if(res.data.errorCode === 0) {
            this.page.currentPage = res.data.result.currentPage;
            this.page.totalPage = res.data.result.totalCount;
            this.tableData = res.data.result.result;
          }
        }).catch(err => {
          checkStatus(err);
        });
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
      // handleSelectionChange(val) {
      //   this.deleteAll = val;
      // },
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
          this.axios.post('/api-admin/del-pages',qs.stringify({'pageIds': ids,requestProject: 'gic-web'})).then(res =>{
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
        this.axios.post('/api-admin/del-page',qs.stringify({'pageId':id,requestProject: 'gic-web'})).then(res =>{
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
      this.getList();
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
      'v-nav': nav,
    }
  }

</script>

<style lang="less" scoped>
  .data-search{
    height:40px;
  }
  .table-content{
    margin-top:15px;
  }
  .operate{
    font-size:0;
    line-height: 1;
  }
  .operate a{
    color: #1890ff;
    font-size:14px;
    margin-right:20px;
  }
  .operate a:last-child{
    margin-right: 0
  }
  .operate a:hover{
    color: #1e6cd5;
  }
  /*页面链接*/
  .paneheight{
    width: 100%;
    min-height: 50px;
    padding: 20px 0;
  }
  .linkcopybtn{
     color: #1890ff;
     cursor: pointer;
  }
  .imgpos{
    text-align: center;
  }
  .downloadcode{
    display: block;
    line-height: 30px;
    cursor: pointer;
    color: #1890ff;
  }
</style>
