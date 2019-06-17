<template>
  <div class="xcx-wrap">
    <v-navbar :shopBack="shopBack" :activeitem="activeitem" :navpath="navpath" :navtab="navtab" @getCurTab="getCurTab"></v-navbar>
    <div class="containerwrap">
      <div class="xcx-container-wrap">
        <div class="data-search">
          <div class="fl">
            <div class="mall-search-input">
              <el-input v-model='searchtext'  placeholder="请输入页面名称" class="search-input"  :clearable="true"
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
        <div class="table-content" v-loading="loading">
            <el-table :data="tableData" tooltip-effect="dark" class="table-no-line-wrap" @sort-change='sortChange'
              ref="multipleTable" @selection-change="handleSelectionChange">
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
              <el-table-column prop="status" label="发布状态">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.status == 1 ? true: false" @change='changePublish(scope.row)'></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <div class="operate">
                    <a @click="handleLink(scope.row)" class="operate-btn">编辑</a>
                    <!--<a class="operate-btn" @click="handleLinkPage(scope.row.pageId)">页面链接</a>-->
                    <delete-tip @confirm="handleDelete(scope.row.pageId)" tips="确定删除该页面吗?">
                        <a class="operate-btn" v-if="scope.row.status !== 1">删除</a>
                    </delete-tip>
                    
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

    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  module.exports = require('./member.js')
</script>

<style lang="less" scoped>
  .xcx-wrap .containerwrap{
    min-height: calc(100% - 240px);
    flex:1;
  }
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
  .operate a:hover{
    color: #1e6cd5;
  }
  .operate-btn{
    cursor: pointer;
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
  .table-no-line-wrap:before{
    height: 0;
  }
</style>
