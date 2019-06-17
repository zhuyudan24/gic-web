<template>
    <div class="wrap" style="height: 100%;" :style="{minHeight: (bodyHeight - 164) + 'px'}">
      <navbar :activeitem="activeitem" :navpath="navpath" :navtab="navtab" @getCurTab="getCurTab"></navbar>
      <div class="box-wrap">
        <div style="min-height: 553px; width: 100%;background: #EEF1F8">
          <div v-show="activeitem==2" class="left-wrap">
            <el-tree
              class="filter-tree"
              :class="{'active':allStore}"
              :data="data1"
              :highlight-current="true"
              :props="defaultProps"
              node-key="storeGroupId"
              :expand-on-click-node="false"
              :data-id="storeGroupId"
              :default-expanded-keys="defaultExpandArr"
              @node-click="handleNodeClick"
              ref="tree2">
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <span class="tree-label" :title="node.label">{{ node.label }}</span>
                <span class="tree-opr-icon"><i v-show="data.groupLevel<5" @click.stop.prevent="addShopGroup(data)" title="增加" class="el-icon-plus tree-icon"></i><i @click.stop.prevent="editShopGroup(data)" v-show="data.parentGroupId!='0'" title="编辑" class="el-icon-edit tree-icon"></i><i v-show="node.parent.data.children &&node.parent.data.children.length>1 && data.storeGroupId != node.parent.data.children[0].storeGroupId" @click.stop.prevent="moveUpOrDown(data,node,'up')" title="上移" class="el-icon-back tree-icon turn-top"></i><i v-show="node.parent.data.children && node.parent.data.children.length>1 && data.storeGroupId != node.parent.data.children[node.parent.data.children.length-1].storeGroupId" @click.stop.prevent="moveUpOrDown(data,node,'down')" title="下移" class="el-icon-back tree-icon turn-bottom"></i><i v-show="data.parentGroupId!='0'&&data.children.length < 1" @click.stop.prevent="deleteShopGroup(node,data)" title="删除" class="el-icon-close tree-icon"></i></span>
              </div>
            </el-tree>
          </div>
          <div v-show="activeitem==3" class="left-area-wrap">
            <div class="area-title-wrap">
              <el-radio-group @change="changeAreaTitle" size="small" v-model="radio3">
                <el-radio-button class="area-title" label="1">省</el-radio-button>
                <el-radio-button class="area-title" label="2">市</el-radio-button>
                <el-radio-button class="area-title" label="3">区</el-radio-button>
              </el-radio-group>
            </div>
            <!-- <el-input class="search-area-input" v-model="searchAreaName" prefix-icon="el-icon-search" placeholder="请搜索"></el-input> -->
            <div class="area-wrap">
              <div v-show="radio3=='1'">
                <ul>
                  <li @click="getProList(item,index)" :class="{'on':currentPro==index}" v-for="(item,index) in proData">{{item.provinceName}}</li>
                </ul>
              </div>
              <div v-show="radio3=='2'">
                <ul>
                  <li @click="getCityList(item,index)" :class="{'on':currentCity==index}" v-for="(item,index) in cityData">{{item.cityName}}</li>
                </ul>
                <p v-show="cityData.length<1" class="no-area-data">暂无数据</p>
              </div>
              <div v-show="radio3=='3'">
                <ul>
                  <li @click="getAreaList(item,index)" :class="{'on':currentArea==index}" v-for="(item,index) in areaData">{{item.countyName}}</li>
                </ul>
                <p v-show="areaData.length<1" class="no-area-data">暂无数据</p>
              </div>
            </div>
          </div>
          <div class="right-list-wrap" :class="{'padding-l':activeitem==3}">
            <div class="right-box-content">
              <div class="right-box">
                <div class="title-wrap clearfix">
                  <h2 class="fl">门店<span>{{totalCount}}</span>家</h2>
                  <!-- <p class="fr"><el-button @click="recycleBtn">门店回收站({{recycleStoreCount}})</el-button></p> -->
                  <!-- <p class="fr" style="margin-right:20px;"><el-checkbox @change="showChild" v-model="checkedChild">
                  显示子分组门店</el-checkbox></p> -->
                </div>
                <h3 v-show="storeNumLimit>0" class="title-tip"><i class="el-icon-info"></i>同时上线门店最大为{{ storeNumLimit }}家，超过限制的门店状态默认更改为未上线</h3>
                <div class="first-line clearfix">
                  <div class="fl">
                    <el-input @keyup.native.enter="searchStore" clearable class="search-input" v-model="searchName" prefix-icon="el-icon-search" placeholder="门店名称/代码/地区名称"></el-input>
                    <el-select @change="changeMoreOpe" class="search-select" v-model="moreOpe" placeholder="请选择批量操作" style="margin-left:8px">
                      <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="fr">
                    <el-button @click="recycleBtn">门店回收站({{recycleStoreCount}})</el-button>
                    <el-button @click="addShop(activeitem)" class="add-btn" type="primary">新增门店</el-button>
                  </div>
                </div>
                <div class="search-wrap clearfix second-line">
                  <el-select @change="changeStoreState" size="small" class="search-select" v-model="status" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select @change="changeOnlineState" size="small" class="search-select" v-model="onlStatus" placeholder="请选择">
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select @change="changeFrom" size="small" class="search-select" v-model="comeFrom" placeholder="请选择来源">
                    <el-option
                      v-for="item in options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select @change="changeStyle" size="small" class="search-select" v-model="allStyle" placeholder="请选择类型">
                    <el-option
                      v-for="item in options5"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-checkbox @change="showChild" v-model="checkedChild" border size="small" class="small-checkbox">显示子分组门店</el-checkbox>
                </div>
                <div class="table-wrap">
                  <el-table
                    class="table-no-line-wrap"
                    ref="multipleTable"
                    :data="tableData3"
                    tooltip-effect="dark"
                    v-loading="loading"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column
                      label="门店名称">
                      <template slot-scope="scope">
                        <p>{{ scope.row.storeName }}</p>
                        <p>{{ scope.row.storeCode }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="storeType"
                      label="门店类型"
                      width="80">
                      <template slot-scope="scope">
                        <p v-show="scope.row.storeType==0">自营</p>
                        <p v-show="scope.row.storeType==1">联营</p>
                        <p v-show="scope.row.storeType==2">代理</p>
                        <p v-show="scope.row.storeType==3">代销</p>
                        <p v-show="scope.row.storeType==4">托管</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="storeGroupName"
                      label="门店分组">
                    </el-table-column>
                    <el-table-column
                      prop="fullArea"
                      label="地区">
                      <template slot-scope="scope">
                        <p>{{ scope.row.fullArea }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="status"
                      label="门店状态"
                      width="90">
                      <template slot-scope="scope">
                        <p v-show="scope.row.status==6" class="dm-status--error">停业整顿</p>
                        <p v-show="scope.row.status==2" class="dm-status--success">已上线</p>
                        <p v-show="scope.row.status==3" class="dm-status--info">未上线</p>
                        <p v-show="scope.row.status==7" class="dm-status--primary">待上线</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="completeStatus"
                      label="资料完善状态"
                      width="120">
                      <template slot-scope="scope">
                        <p v-show="scope.row.completeStatus==0" class="dm-status--info">未完善</p>
                        <p v-show="scope.row.completeStatus==1" class="dm-status--success">已完善</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="操作"
                      width="170">
                      <template slot-scope="scope">
                        <!-- <el-button @click="onlineStore(scope.row.storeId)" v-if="scope.row.status==4" type="text">上线</el-button> -->
                        <el-button @click="selectStatus(scope.row)" type="text">更改状态</el-button>
                        <el-button @click="editShop(scope.row.storeId,scope.row.status,activeitem)" type="text">编辑</el-button>
                        <el-button @click="deleteStore(scope.row)" type="text">删除</el-button>
                      </template>
                    </el-table-column>
                    <template slot="empty">
                      <div class="no-data-wrap">
                        <div class="no-data-icon" >
                          <img src="../../../../static/img/no-data_icon.png" alt="">
                        </div>
                        <p>暂无数据</p>
                      </div>
                    </template>
                  </el-table>
                  <div class="pagination" v-show="totalCount>0">
                    <el-pagination
                      background
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[20, 40, 60, 80]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next"
                      :total="totalCount"
                      v-if="totalCount!=0">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vue-gic-footer></vue-gic-footer>
      <!-- 添加子分组 -->
      <el-dialog
        title="添加子分组"
        :visible.sync="dialogVisibleAdd"
        width="500px">
        <div class="new-create-content">
          <el-form ref="form" label-width="80px" label-position="right">
            <div class="create-content">
              <el-form-item class="add-wrap" label="分组名称">
                <el-input @keyup.native="toInput(addInput,$event)" v-model="addInput" placeholder="请输入内容"></el-input>
                <span class="add-num">{{inputNum}}/{{inputLength}}</span>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addShopGroupBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改子分组名称 -->
      <el-dialog
        title="修改名称"
        :visible.sync="dialogVisibleEdit"
        width="500px">
        <div class="new-create-content">
          <el-form ref="form" label-width="80px" label-position="right">
            <div class="create-content">
              <el-form-item class="add-wrap" label="分组名称">
                <el-input @keyup.native="toInput2(editInput,$event)" v-model="editInput" placeholder="请输入内容"></el-input>
                <span class="add-num">{{inputNum2}}/{{inputLength2}}</span>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editShopGroupBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量修改分组 -->
      <el-dialog
        title="设置所属分组"
        :visible.sync="dialogVisibleGroup"
        width="600px">
        <div class="add-wrap">
          <el-tree
            class="set-group filter-tree"
            :class="{'active':allStore}"
            :data="data1"
            :highlight-current="true"
            :props="defaultProps"
            node-key="storeGroupId"
            :expand-on-click-node="false"
            :default-expanded-keys="['ff808081593917d90159398eca480016']"
            :data-id="storeGroupId"
            @node-click="handleNodeClick2"
            ref="tree3">
          </el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGroupCancelBtn">取 消</el-button>
          <el-button type="primary" @click="dialogGroupSaveBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量编辑 -->
      <el-dialog
        title="批量编辑属性"
        :visible.sync="dialogVisibleAttr"
        width="655px">
        <div class="dialog-wrap">
          <el-form :model="attrForm" label-width="120px">
            <el-form-item label="更新1个属性" >
              <el-select @change="changeAttr" class="attr-select" v-model="attrForm.attr" placeholder="请选择要更新的属性">
                <el-option value="1" label="关联商户"></el-option>
                <!-- <el-option value="2" label="店招品牌"></el-option> -->
                <el-option value="3" label="营业时间"></el-option>
                <el-option value="4" label="门店类型"></el-option>
                <el-option value="5" label="门店分区"></el-option>
                <el-option value="6" label="门店面积"></el-option>
                <!-- <el-option value="7" label="门店状态"></el-option> -->
                <el-option value="8" label="附近门店显示"></el-option>
              </el-select>
            </el-form-item>
            <!-- 关联商户 -->
            <el-form-item v-show="attrForm.attr=='1'" label="更新后属性值为" >
              <el-select @change="selectEnterprise" class="attr-select" multiple v-model="attrForm.contact" placeholder="请选择">
                <el-option
                  v-for="item in contactShop"
                  :key="item.enterpriseId"
                  :label="item.enterpriseName"
                  :value="item.enterpriseId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 店招品牌 -->
            <el-form-item v-show="attrForm.attr=='2'" label="更新后属性值为" >
              <el-select @change="selectSignage" class="attr-select" v-model="attrForm.signage" placeholder="请选择">
                <el-option
                  v-for="item in options4"
                  :key="item.signageCode"
                  :label="item.signageName"
                  :value="item.signageCode">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 营业时间 -->
            <el-form-item  v-show="attrForm.attr=='3'" label="更新后属性值为" >
              <div class="attr-select">
                <el-time-select
                  @change="selectOpenTime"
                  class="select-time"
                  placeholder="起始时间"
                  :clearable="false"
                  v-model="attrForm.openTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '24:00',
                    maxTime:attrForm.closeTime
                  }">
                </el-time-select>
                <span>至</span>
                <el-time-select
                  @change="selectCloseTime"
                  class="select-time"
                  placeholder="结束时间"
                  :clearable="false"
                  v-model="attrForm.closeTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '24:00',
                    minTime: attrForm.openTime
                  }">
                </el-time-select>
              </div>
            </el-form-item>
            <!-- 门店类型 -->
            <el-form-item v-show="attrForm.attr=='4'" label="更新后属性值为" >
              <el-select @change="selectStoreStype" class="attr-select" v-model="attrForm.style" placeholder="请选择">
                <el-option value="0" label="自营"></el-option>
                <el-option value="1" label="联营"></el-option>
                <el-option value="2" label="代理"></el-option>
                <el-option value="3" label="代销"></el-option>
                <el-option value="4" label="托管"></el-option>
              </el-select>
            </el-form-item>
            <!-- 门店分区 -->
            <el-form-item class="select-region-content" v-show="attrForm.attr=='5'" label="更新后属性值为" >
              <vue-area-ab :areaOptions="areaOptions" @selected="selectedArea"></vue-area-ab>
            </el-form-item>
            <!-- 门店面积 -->
            <el-form-item v-show="attrForm.attr=='6'" label="更新后属性值为" >
              <div class="edit-input">
                <el-input @blur="floatTime(attrForm.area)" @keyup.native="numAndFloat" class="input-input" v-model="attrForm.area"></el-input>
              </div>
              <div class="right-input-tip">
                <span>平方米</span>
              </div>
            </el-form-item>
            <!-- 门店状态 -->
            <el-form-item v-show="attrForm.attr=='7'" label="更新后属性值为" >
              <el-select @change="selectStoreStatus" class="attr-select" v-model="attrForm.state" placeholder="请选择">
                <el-option value="0" label="正常"></el-option>
                <el-option value="-3" label="闭店（删除门店）"></el-option>
                <el-option value="3" label="停业整顿"></el-option>
              </el-select>
            </el-form-item>
            <!-- 附近门店显示 -->
            <el-form-item v-show="attrForm.attr=='8'" label="更新后属性值为" >
              <el-switch @change="selectStoreShow" v-model="attrForm.open"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAttrCancelBtn">取 消</el-button>
          <el-button type="primary" @click="dialogAttrSaveBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量上传图片 -->
      <el-upload
        id="imgupload" 
        style="display: none"
        action="123"
        :limit="10"
        name="picFile"
        :show-file-list="false"
        :on-exceed="handleExceed"
        :before-upload="beforeImgUpload"
        :on-error="handleImgError">
      </el-upload>
      <!-- 批量转移会员 -->
      <div>
        <vue-gic-store :showStoreDialog="showStoreDialog" @selectStore="selectStore"></vue-gic-store>
      </div>
      <!-- 删除门店 -->
      <el-dialog
        class="delete-store-wrap"
        title="提示"
        :visible.sync="dialogDeleteStore"
        width="500px">
        <div class="delete-store-body">
          <h2 class="delete-tip-text"><i class="el-icon-warning"></i><span>请再仔细核对门店信息，删除后将无法恢复！</span></h2>
          <div class="store-info">
            <p>门店名称：{{storeInfo.storeName}}</p>
            <p>门店代码：{{storeInfo.storeCode}}</p>
            <p>所在地区：{{storeInfo.proName}}/{{storeInfo.cityName}}/{{storeInfo.countyName}}</p>
            <p>详细地址：{{storeInfo.storeAddress}}</p>
            <p>现有会员数：{{storeInfo.memberNum==null?0:storeInfo.memberNum}}<span>(请及时至回收站内处理这些会员)</span></p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteStore = false">取 消</el-button>
          <el-button type="primary" @click="sureDeleteBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 成本主体 -->
      <div @click="hideSelectList">
        <el-dialog
          class="delete-store-wrap"
          title="选择成本主体"
          :visible.sync="dialogZhuti"
          width="500px" 
          >
          <div class="all-style-wrap">
            <div class="select-shop" @click.prevent.stop="showSelectList">
              <p class="select-search-shop">{{selectDataName}}</p>
            </div>
            <transition name="slide-fade">
              <div class="select-shop-url-wrap search-shop-wrap" v-show="showSearchList" >
                <div class="search-shop-input" @click.stop="">
                  <el-input @keyup.native="value => toInput(value, searchValueList)" class="input-name" prefix-icon="el-icon-search" v-model="searchValueList" placeholder="输入搜索内容" ></el-input>
                </div>
                <div class="search-shop-list">
                  <ul v-if="selectList.length>0">
                    <li @click.prevent.stop="selectShopSuccess(list,index)" v-for="(list,index) in selectList"><span>{{list.storeName}}</span></li>
                  </ul>
                  <p v-else class="no-data">无搜索内容</p>
                  <p class="search-list-tip">最多显示5条数据</p>
                </div>
              </div>
            </transition>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelZhutiBtn">取 消</el-button>
            <el-button type="primary" @click="sureZhutiBtn">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 成功删除之后的弹框提示 -->
      <el-dialog
        class="delete-succ-wrap"
        title="提示"
        :visible.sync="deleteStoreSucc"
        width="500px">
        <div class="delete-succ-body">
          <span><i class="el-icon-success"></i></span>
          <p>门店已经删除，请到回收站处理门店会员、店员、事务等信息然后彻底删除该门店</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sureSuccBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 更改状态 -->
      <el-dialog
        class="select-status-wrap"
        title="更改门店状态"
        :visible.sync="selectStatusDialog"
        width="500px">
        <div class="delete-succ-body">
          <el-form :rules="statusRules" ref="ruleForm" :model="statusForm" label-width="100px">
            <el-form-item label="更改状态" prop="status" >
              <el-select @change="changeStatus" v-model="statusForm.status" placeholder="请选择要更改的状态" style="width: 100%">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectStatusDialog = false">取消</el-button>
          <el-button type="primary" @click="selectStatusBtn('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 批量更改状态 -->
      <el-dialog
        class="change-status-wrap"
        title="批量更改状态"
        :visible.sync="changeStatusDialog"
        width="500px">
        <div>
          <el-form :rules="statusRules" ref="ruleForm2" :model="statusForm2" label-width="100px">
            <el-form-item label="更改状态" prop="statusMore" >
              <el-select @change="changeStatus2" v-model="statusForm2.statusMore" placeholder="请选择要更改的状态" style="width: 100%">
                <el-option
                  vishow=""
                  v-for="item in options6"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelStatusBtn">取 消</el-button>
          <el-button type="primary" @click="changeStatusBtn('ruleForm2')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
    import navbar from 'components/navbar/navbartwo'
    import strLength from '../../../common/js/strlen'
    import excelConfig from '../../../common/js/excel_config.js'
    import { _debounce } from '../../../common/js/public';
    let qs = require('qs')
    export default {
      name: "shop_list",
      data(){
        return {
          bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
          navpath: [
            {
              name: '企业管理',
              path: ''
            },
            {
              name: '企业资料',
              path: ''
            },
            {
              name: '门店管理',
              path: ''
            },
            {
              name: '门店列表',
              path: ''
            }
          ],
          navtab: [
            {
              name: '门店分组',
              tab: 2
            },
            {
              name: '门店分区',
              tab: 3
            }
          ],
          activeitem: 2,
          data1: [],  // 门店分组
          defaultProps: {
            children: 'children',
            label: 'storeGroupName'
          },
          options: [
            {
              value: '',
              label: '所有门店状态'
            },{
              value: '3',
              label: '未上线'
            },{
              value: '7',
              label: '待上线'
            },{
              value: '2',
              label: '已上线'
            },{
              value: '6',
              label: '停业整顿'
            }
          ],
          options1: [
            {
              value: '',
              label: '资料完善状态'
            }, {
              value: '1',
              label: '已完善'
            }, {
              value: '0',
              label: '未完善'
            }
          ],
          options2: [
            {
              value: '0',
              label: '批量修改分组'
            }, {
              value: '9',
              label: '批量更改状态'
            },
            // {
            //   value: '8',
            //   label: '批量上线'
            // }, 
            {
              value: '1',
              label: '批量编辑'
            }, {
              value: '2',
              label: '批量下载二维码'
            }, {
              value: '3',
              label: '批量下载门店资料'
            }, {
              value: '4',
              label: '批量上传图片'
            }, {
              value: '5',
              label: '批量转移会员'
            }, {
              value: '6',
              label: '批量删除'
            }, {
              value: '7',
              label: '批量导入'
            }
          ],
          options3:[
            {
              value: '',
              label: '所有渠道'
            }, {
              value: '1',
              label: '批量导入'
            }, {
              value: '0',
              label: '手工新增'
            }, {
              value: '3',
              label: '订单同步'
            }, {
              value: '4',
              label: '批量拉取'
            }
          ],
          options5:[
            {
              value: null,
              label: '所有类型'
            }, 
            {
              value: '0',
              label: '自营'
            }, {
              value: '1',
              label: '联营'
            }, {
              value: '2',
              label: '代理(加盟)'
            }, {
              value: '3',
              label: '代销'
            }, {
              value: '4',
              label: '托管'
            }
          ],
          // storeState: '2',
          // onlineState: '',
          moreOpe:'',
          comeFrom:'',
  
          value:'',
          recycleStoreCount:0,
          allStore:true,    // 所有门店的默认状态
          storeGroupId:null,    // 分组id
          defaultGroupId:'',  // 默认显示的分组id
          allGroupId:'', // 所有分组
          inputNum:0,     // 添加子分组
          inputLength:15,
          dialogVisibleAdd:false,
          addInput:'',
          inputNum2:0,     // 修改分组名称
          inputLength2:15,
          dialogVisibleEdit:false,
          editInput:'',
          editData:{},
          parentGroupId:'',
          groupLevel:'',
          storeChildrenArr:[],   //  添加子分组时  点击选中的节点的children
          searchName: '',   // 搜索
          tableData3: [],     // 门店列表
          multipleSelection: [],    // 选中的门店
          checkedChild:true,  // 是否显示子分组门店
          currentPage:1,    //  分页
          pageSize:20,
          totalCount:0,
          loading:false,
          status:'2',    // 门店状态
          onlStatus:'', // 上线状态
          moreSelectStoreIds:'',    // 批量操作中被选中的门店的id
          dialogVisibleGroup:false,   // 批量修改分组
          dialogStoreGroupId:'',    // 弹框中选中的分组id
          dialogStoreGroupName:'',
          dialogVisibleAttr:false,  // 批量编辑属性
          showStoreDialog:false,  // 批量转移会员
          selectShopUrl:'',
          attrForm:{
            attr:'',
            contact:'', 
            signage:'',
            time:'',
            openTime:'',
            closeTime:'',
            style:'',
            area:'',
            state:'',
            open:true,
          },
          contactShop:[],   // 关联的商户
          options4:[],   // 店招列表
          saveType:'',  // 弹框按钮保存时的类型
          saveValue:'', // 弹框按钮保存时的值
  
          areaOptions: {    // 默认的省市县传值
            provinceName: '',
            provinceId: '',
            cityName: '',
            cityId: '',
            countryName: '',
            countyId: '',
          },
          areaOptionsNew:{},
          areaId:'',  // 是否选择省市区的标识
  
          uploadImg:{}, // 批量上传图片
  
          proData:[],     // 省
          cityData: [],   // 市
          areaData: [],   // 区
          provinceId:null,  // id
          cityId:null,
          countyId:null,
          noAddressId: null,
          currentPro:0, 
          currentCity:0,
          currentArea:0,
          radio3: '1', // 省市区的选择
          searchAreaName: '', // 搜索
  
          integralFlag:'',  // 删除门店时是否显示成本主体的标识
          dialogDeleteStore:false,  // 删除门店
          deleteMoreStoreBool:false,  // 删除多个 单个的标识
          deleteMemberBool:false, // 门店有会员的提醒
          storeInfo:{}, 
  
          dialogZhuti:false,   // 门店主体
          dialogZhutiType:'', // 'delete' 闭店（删除门店） 删除时； 'edit' 编辑
          showSearchList:false,
          deleteStoreSucc:false,
          searchValueList:'',  // 部分门店的下拉框的搜索值
          selectList:[],
          selectDataName:'',
          selectDataId:'',
  
          allStyle:null,
  
          storeNumLimit:0,
  
          selectStatusDialog:false, // 更改门店状态
          statusForm:{
            status:''
          },
          statusRules:{
            status: [
              { required: true, message: '请选择要更改的门店状态', trigger: 'hh' }
            ],
            statusMore: [
              { required: true, message: '请选择要更改的门店状态', trigger: 'hh' }
            ]
          },
          statusOptions: [],
          selectStoreIds:'',
  
          changeStatusDialog:false, // 批量更改门店状态
          options6:[
            {
              value: '3',
              label: '未上线'
            }, 
            {
              value: '7',
              label: '待上线'
            }, {
              value: '2',
              label: '上线'
            }, {
              value: '6',
              label: '停业整顿'
            }, {
              value: '-3',
              label: '闭店（删除门店）'
            }
          ],
          statusForm2:{
            status:''
          },
          defaultExpandArr:[]
        }
      },
      created(){
        
      },
      mounted(){
        window.onresize = () => {
          return (() => {
            this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
          })()
        },
        this.getUrlData();  // 获得保存时传来的参数 2 门店分组，3 分区
        // this.getShopGroup('get'); // 获得门店分组
        this.getContactShop();  // 获得关联商户和营业时间
        this.getSignagesData(); // 获得店招列表
      },
      methods: {
        // 分组上移 或 下移
        moveUpOrDown(data,node,type){
          var allDataArr = node.parent.data.children;
          var index = allDataArr.indexOf(data);
          var oldData = JSON.parse(JSON.stringify(data));
          var newData;

          var allData = [];
          var obj1 = {
            storeGroupId:data.storeGroupId,
            parentGroupId:data.parentGroupId,
            groupLevel:data.groupLevel,
            storeGroupSort:data.storeGroupSort //门店分组排序值
          }
          allData.push(obj1);
          var obj2 = {};
          if(type=='up'){
            obj2 = {
              storeGroupId:allDataArr[index-1].storeGroupId,
              parentGroupId:allDataArr[index-1].parentGroupId,
              groupLevel:allDataArr[index-1].groupLevel,
              storeGroupSort:allDataArr[index-1].storeGroupSort //门店分组排序值
            }
          }else if(type=='down'){
            obj2 = {
              storeGroupId:allDataArr[index+1].storeGroupId,
              parentGroupId:allDataArr[index+1].parentGroupId,
              groupLevel:allDataArr[index+1].groupLevel,
              storeGroupSort:allDataArr[index+1].storeGroupSort //门店分组排序值
            }
          }
          allData.push(obj2);
          // console.log(allData);
          this.axios.post('/api-admin/update-store-group-sort',qs.stringify({
            requestProject:'gic-web',
            params:JSON.stringify(allData)
          })).then((res)=>{
            if(res.data.errorCode==0){
              // this.getShopGroup('update'); // 获得门店分组
              if(type=='up'){
                newData = JSON.parse(JSON.stringify(node.parent.data.children[index-1]));
                data.storeGroupName = newData.storeGroupName;
                data.storeGroupId = newData.storeGroupId;
                data.storeGroupSort = newData.storeGroupSort;
                data.children = newData.children;
                node.parent.data.children[index-1].storeGroupName = oldData.storeGroupName;
                node.parent.data.children[index-1].storeGroupId = oldData.storeGroupId;
                node.parent.data.children[index-1].storeGroupSort = oldData.storeGroupSort;
                node.parent.data.children[index-1].children = oldData.children;
              }else if(type=='down'){
                newData = JSON.parse(JSON.stringify(node.parent.data.children[index+1]));
                data.storeGroupName = newData.storeGroupName;
                data.storeGroupId = newData.storeGroupId;
                data.storeGroupSort = newData.storeGroupSort;
                data.children = newData.children;
                node.parent.data.children[index+1].storeGroupName = oldData.storeGroupName;
                node.parent.data.children[index+1].storeGroupId = oldData.storeGroupId;
                node.parent.data.children[index+1].storeGroupSort = oldData.storeGroupSort;
                node.parent.data.children[index+1].children = oldData.children;
              }
              // console.log(allDataArr);
            }else{
              this.$message.error(res.data.message)
            }
          })
        },
        getUrlData(){
          var tab = this.$route.query.type;
          if(tab){
            this.activeitem = parseInt(tab)
            if(this.activeitem==2){
              this.provinceId=null;
              this.cityId=null;
              this.countyId=null;
              this.allStore = true; // 所有分组的默认样式
              this.getShopGroup('get'); // 获得门店分组
            }else if(this.activeitem==3){
              this.storeGroupId = null;
              this.radio3 = '1';
              this.currentPro =  0;
              this.cityData = [];
              this.areaData = [];
              this.getProvince(1,null); // 获得省
            }
          }else{
            this.activeitem = 2;
            this.provinceId=null;
            this.cityId=null;
            this.countyId=null;
            this.allStore = true; // 所有分组的默认样式
            this.getShopGroup('get'); // 获得门店分组
          }
        },
        getCurTab(val){ // 分组与分区的切换
          this.activeitem = val;
          if(val==3){
            this.storeGroupId = null;
            this.radio3 = '1';
            this.currentPro =  0;
            this.cityData = [];
            this.areaData = [];
            this.getProvince(1,null); // 获得省
          }
          if(val==2){
            this.provinceId=null;
            this.cityId=null;
            this.countyId=null;
            this.allStore = true; // 所有分组的默认样式
            this.getShopGroup('get'); // 获得门店分组
          }
        },
        getShopGroup(type){   // 获得门店分组
          this.axios.post('/api-admin/store-group-list',qs.stringify({
            requestProject:'gic-web'
          })).then((res)=>{
            var data = res.data;
            // console.log(data);
            if(data.errorCode==0){
              this.data1 = data.result;
              if(type=="get"){
                this.defaultExpandArr = [];
                this.storeGroupId = data.result[0].storeGroupId;
                this.defaultGroupId = data.result[0].storeGroupId;
                this.allGroupId = data.result[0].storeGroupId;
                this.provinceId = data.result[0].storeGroupId;  // 在所有省时点击市
                this.defaultExpandArr.push(this.defaultGroupId);
                this.getShopList(this.defaultGroupId,this.allStyle,this.provinceId,this.cityId,this.countyId,this.currentPage,this.pageSize);
              }else if(type=="update"){
                this.$nextTick(_ => {
                  // this.$refs.tree2.setCurrentKey(this.storeGroupId);
                })
              }
            }else{
              this.$message.error(data.message)
            }
          })
        },
        getProvince(type,id){   // 获得所有省 市 区
          this.axios.post('/api-admin/dict-district-list',qs.stringify({
            requestProject:'gic-web',
            type:type,
            id:id
          })).then(res=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode == 0){
              if(type==1){  // 对于省的拼接
                this.proData = [];
                var objAll = {};
                objAll.provinceId=null;  // 所有组的id
                objAll.provinceName='所有省';
                objAll.provincePy='suoyousheng';
                this.proData.push(objAll);
                var objNo = {};
                objNo.provinceId='0';  // 未定位的id
                objNo.provinceName='未定位';
                objNo.provincePy='weidingwei';
                this.proData.push(objNo);
                var oldObj = data.result;
                for(var key in oldObj){
                  this.proData.push(oldObj[key]);
                }
                this.noAddressId = '0';
                this.cityId=null;
                this.countyId=null;
                this.currentPage=1;
                this.pageSize=20;
                this.getShopList(this.storeGroupId,this.allStyle,id,this.cityId,this.countyId,this.currentPage,this.pageSize);
              }else if(type==2){  // 市
                var objBool = false;
                for (var key in data.result){
                  console.log(data.result[key]);
            　　  objBool = false; // 返回false，不为空对象
            　　}　　
            　　objBool = true;//返回true，为空对象
                if(objBool){
                  this.cityData = data.result;
                }else{
                  this.cityData = [];
                }
              }else if(type==3){  // 区
                var objBool = false;
                for (var key in data.result){
            　　  objBool = false; // 返回false，不为空对象
            　　}　　
            　　objBool = true;   //返回true，为空对象
                if(objBool){
                  this.areaData = data.result;
                }else{
                  this.areaData = [];
                }
              }
            }else{
              this.$message({
                type: 'error',
                message: data.message
              });
            }
          })
        },
        getProList(item,index){ // 点击切换 省 时的门店列表
          this.currentPro = index;
          this.provinceId = item.provinceId;
          this.currentPage=1;
          this.pageSize=20;
          this.getShopList(null,this.allStyle,this.provinceId,null,null,this.currentPage,this.pageSize);
          this.areaData = [];
          this.cityData = [];
          if(item.provinceId==this.defaultGroupId || item.provinceId=='0' || item.provinceId==null){
            
          }else{
            this.getProvince(parseInt(this.radio3)+1,this.provinceId);
          }
        },
        getCityList(item,index){ // 点击切换 市 时的门店列表
          this.currentCity = index;
          this.cityId = item.cityId;
          this.currentPage=1;
          this.pageSize=20;
          this.getShopList(null,this.allStyle,null,this.cityId,null,this.currentPage,this.pageSize);
          this.areaData = [];
          this.getProvince(parseInt(this.radio3)+1,this.cityId);
        },
        getAreaList(item,index){ // 点击切换 区 时的门店列表
          // console.log(item);
          this.currentArea = index;
          this.areaId = item.countyId;
          this.currentPage=1;
          this.pageSize=20;
          this.getShopList(null,this.allStyle,null,null,this.areaId,this.currentPage,this.pageSize);
        },
        changeAreaTitle(val){  // 切换门店分区的省市区
          // console.log(val);
          this.radio3 = val;
        },
        getShopList(groupId,style,provinceId,cityId,countyId,page,size){    // 获得门店列表
          this.loading = true;
          if(this.activeitem=='2'){  // 分组
            provinceId="";
            cityId="";
            countyId="";
          }else if (this.activeitem=='3'){  // 分区
            groupId="";
          }
          this.axios.post('/api-admin/store-list',qs.stringify({
            requestProject:'gic-web',
            storeGroupId:groupId,
            currentPage:page,
            pageSize:size,
            searchName:this.searchName,
            recursionStr:this.checkedChild,
            status:this.status,
            completeStatus:this.onlStatus,
            channelType:this.comeFrom,
            provinceId:provinceId,
            cityId:cityId,
            countyId:countyId,
            hasPage:true,
            storeType:style
          })).then((res)=>{
            var data = res.data;
            console.log(data);
            this.loading = false
            if(data.errorCode==0){
              this.recycleStoreCount = data.result.recycleStoreCount;
              this.tableData3 = data.result.list;
              this.totalCount = data.result.page.totalCount;
              this.storeNumLimit = data.result.storeNumLimit;
              this.integralFlag = data.result.integralFlag; // gic时需要选择成本主体，erp时不需要
            }else{
              this.$message.error(data.message)
            }
          })
        },
        getContactShop(){   // 获得关联商户和营业时间
          this.axios.post('/api-admin/list-enterprise',qs.stringify({
            requestProject:'gic-web'
          })).then((res)=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode==0){
              var result = data.result;
              this.contactShop = result.listEnterprise;
            }else{
              this.$message.error(data.message)
            }
          })
        },
        getSignagesData(){    // 获得店招列表
          this.axios.post('/api-admin/signages-list',qs.stringify({
            requestProject:'gic-web'
          })).then((res)=>{
            var data = res.data;
            if(data.errorCode==0){
              this.options4 = data.result;
            }else{
              this.$message.error(data.message)
            }
          })
        },
        changeStoreState(val){   // 改变门店状态
          this.status = val;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        }, 
        changeOnlineState(val){   // 改变上线状态
          this.onlStatus = val;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        changeFrom(val){  // 改变来源
          this.comeFrom = val;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        changeStyle(val){
          this.allStyle = val;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        showChild(){  // 是否显示子分组门店
          this.currentPage=1;    //  分页
          this.pageSize=20;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        searchStore(){  // 搜索门店
          this.currentPage=1;    //  分页
          this.pageSize=20;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        handleSizeChange(val){    // 选择分页符
          this.currentPage=1;
          this.pageSize = val;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          // this.pageSize = 20;
          if(this.activeitem=='2'){  // 分组
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        handleNodeClick(data, node, indeterminate){    // 树形控件的点击
          this.allStore = false;
          this.currentPage=1;    //  分页
          this.pageSize=20;
          if(this.activeitem=='2'){  // 分组
            this.storeGroupId = data.storeGroupId;
            this.provinceId=null;
            this.cityId=null;
            this.areaId=null;
          }else if (this.activeitem=='3'){  // 分区
            this.storeGroupId=null;
          }
          this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
        },
        handleNodeClick2(data, node, indeterminate){    // 弹框中树形控件的点击
          this.dialogStoreGroupId = data.storeGroupId;
          var one = data.storeGroupName;
          this.dialogStoreGroupName = one;
          if(node.parent && !Array.isArray(node.parent.data)){
            var two = node.parent.data.storeGroupName;
            this.dialogStoreGroupName = two + '/' + this.dialogStoreGroupName;
            if(node.parent.parent && !Array.isArray(node.parent.parent.data) ){
              var three = node.parent.parent.data.storeGroupName;
              this.dialogStoreGroupName = three + '/' + this.dialogStoreGroupName;
              if(node.parent.parent.parent && !Array.isArray(node.parent.parent.parent.data) ){
                var four = node.parent.parent.parent.data.storeGroupName;
                this.dialogStoreGroupName = four + '/' + this.dialogStoreGroupName;
                if(node.parent.parent.parent.parent && !Array.isArray(node.parent.parent.parent.parent.data) ){
                  var five = node.parent.parent.parent.parent.data.storeGroupName;
                  this.dialogStoreGroupName = five + '/' + this.dialogStoreGroupName;
                  if(node.parent.parent.parent.parent.parent && !Array.isArray(node.parent.parent.parent.parent.parent.data) ){
                    var six = node.parent.parent.parent.parent.parent.data.storeGroupName;
                    this.dialogStoreGroupName = six + '/' + this.dialogStoreGroupName;
                  }
                }
              }
            }
          }
          console.log(this.dialogStoreGroupName);
        },
        toInput(value,e) {  // 添加子分组 输入时控制字符数量
          var that = this;
          that.addInput = strLength.getByteVal(e.target.value,that.inputLength);
          that.inputNum = strLength.getZhLen(that.addInput);
        },
        toInput2(value,e) {  // 添加子分组 输入时控制字符数量
          var that = this;
          that.editInput = strLength.getByteVal(e.target.value,that.inputLength2);
          that.inputNum2 = strLength.getZhLen(that.editInput);
        },
        addShopGroup(data){   // 添加子分组
          console.log(data);
          this.storeChildrenArr = data.children;
          this.dialogVisibleAdd = true;
          this.inputNum = 0;
          this.addInput = "";
          this.parentGroupId = data.parentGroupId;
          this.groupLevel = data.groupLevel;
          this.storeGroupId = data.storeGroupId;
        },
        addShopGroupBtn(){  // 添加子分组的保存
          this.addInput = this.addInput.replace(/(^\s+)|(\s+$)/g,""); // 去除前后空格
          if(this.addInput==""){
            this.$message.error('请输入子分组名称');
            return;
          }
          this.axios.post('/api-admin/store-group-edit',qs.stringify({
            requestProject:'gic-web',
            storeGroupName:this.addInput,
            parentGroupId:this.storeGroupId,
            groupLevel:parseInt(this.groupLevel+1)
          })).then((res)=>{
            var data = res.data;
            if(data.errorCode==0){
              this.dialogVisibleAdd = false;
              this.storeChildrenArr.push(data.result);
            }else{
              this.$message.error(data.message)
            }
          })
        },
        editShopGroup(data){  // 修改分组名称
          console.log(data);
          this.dialogVisibleEdit = true;
          this.parentGroupId = data.parentGroupId;
          this.groupLevel = data.groupLevel;
          this.editInput = data.storeGroupName;
          this.storeGroupId = data.storeGroupId;
          this.inputNum2 = strLength.getZhLen(this.editInput);
          this.editData = data;
        },
        editShopGroupBtn(){ // 修改子分组名称的保存
          this.editInput = this.editInput.replace(/(^\s+)|(\s+$)/g,""); // 去除前后空格
          if(this.editInput==''){
            this.$message.error('请输入门店名称');
            return;
          }
          this.axios.post('/api-admin/store-group-edit',qs.stringify({
            requestProject:'gic-web',
            storeGroupId:this.storeGroupId,
            storeGroupName:this.editInput,
            parentGroupId:this.parentGroupId,
            groupLevel:parseInt(this.groupLevel)
          })).then((res)=>{
            var data = res.data;
            if(data.errorCode==0){
              this.dialogVisibleEdit = false;
              this.editData.storeGroupName = this.editInput;
              this.$message.success('修改成功')
            }else{
              this.$message.error(data.message)
            }
          })
        },
        deleteShopGroup(node,data){  // 删除门店分组  要先判断此分组下是否有门店
          this.$confirm('确认要删除该门店分组吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.post('/api-admin/store-group-delete',qs.stringify({
              requestProject:'gic-web',
              storeGroupId:data.storeGroupId,
            })).then((res)=>{
              var dataDel = res.data;
              if(dataDel.errorCode==0){
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.storeGroupId === data.storeGroupId);
                children.splice(index, 1);
                if(this.storeGroupId==data.storeGroupId){ // 删除选中的分组
                  this.allStore = true;
                  this.getShopList(this.allGroupId,this.allStyle,this.provinceId,this.cityId,this.countyId,this.currentPage,this.pageSize);
                }
                this.$message.success('删除成功!');
              }else{
                this.$message.error(dataDel.message)
              }
            })
            // this.axios.post('/api-admin/store-list',qs.stringify({
            //   requestProject:'gic-web',
            //   storeGroupId:node.groupId,
            //   recursionStr:true
            // })).then((res)=>{
            //   var dataData = res.data;
            //   if(dataData.errorCode==0){
            //     this.axios.post('/api-admin/store-group-delete',qs.stringify({
            //       requestProject:'gic-web',
            //       storeGroupId:data.storeGroupId,
            //     })).then((res)=>{
            //       var dataDel = res.data;
            //       if(dataDel.errorCode==0){
            //         this.allStore = true;
            //         this.getShopGroup('get');
            //         this.$message.success('删除成功!');
            //       }else{
            //         this.$message.error(dataDel.message)
            //       }
            //     })
            //   }else{
            //     this.$message.error(dataData.message)
            //   }
            // })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        deleteStore(row){   // 是否删除门店   -- 单个删除
          //console.log(row);
          this.storeInfo = row;
          this.dialogDeleteStore = true;
          this.deleteMoreStoreBool = false;
        },
        sureDeleteBtn(){  // 弹框中确认删除之后出现成本主体
          // this.dialogDeleteStore = false;
          if(this.integralFlag=='gic'){
            this.dialogZhuti = true;
            this.selectDataName='';
            this.selectDataId='';
            this.dialogZhutiType = 'delete';
          }else{
            this.dialogDeleteStore = false;
            this.selectDataId = ''; // 成本主体
            this.deleteStoreZhuti(); // 直接删除门店
          }
        },
        deleteStoreZhuti(){   // 删除门店  是否包含门店主体
          var moreStoreIds = "";
          if(this.deleteMoreStoreBool){   // 批量删除
            moreStoreIds = this.moreSelectStoreIds;
          }else{
            moreStoreIds = this.storeInfo.storeId;
          }
          this.axios.post('/api-admin/store-deltorecycle',qs.stringify({
            requestProject:'gic-web',
            storeIds:moreStoreIds,
            toStoreId:this.selectDataId
          })).then((res)=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode==0){
              this.dialogZhuti = false;
              this.deleteStoreSucc = true;  // 确定之后 页面跳转
              this.selectDataId = '';  // 清掉之前选的门店主体
            }
          })
        },
        showSelectList(){
          this.showSearchList = !this.showSearchList;
        },
        hideSelectList(){
          this.showSearchList = false;
        },
        toInput: _debounce(function(e, value) {
          this.getSearchData();
        }, 500),
        getSearchData(){    // 部分门店的查询
          this.axios.post('/api-plug/query-store-by-code-name',qs.stringify({
            requestProject:'gic-web',
            searchParam:this.searchValueList,
            selectedIds:'',
            flag:'1'
          })).then((res)=>{
            var data = res.data;
            if(data.errorCode==0){
              this.selectList = data.result;
            }
          })
        },
        selectShopSuccess(list,index){    // 成功选择门店主体 
          console.log(list);
          this.selectDataName=list.storeName;
          this.selectDataId=list.storeId;
        },
        cancelZhutiBtn(){   // 门店主体的取消按钮
          this.dialogZhuti = false;
          this.selectDataName='';
          this.selectDataId='';
          this.moreOpe = '';
        },
        sureZhutiBtn(){   // 选择门店主体之后的确认按钮
          if(this.selectDataId==""){
            this.$message.error('请选择门店主体');
            return;
          }else{
            if(this.dialogZhutiType == 'delete'){   // 删除的门店主体
              this.dialogDeleteStore = false;
              this.deleteStoreSucc = true;
              this.deleteStoreZhuti();
            }else if(this.dialogZhutiType == 'edit'){   // 更改门店的门店主体
              this.dialogZhuti = false
            }else if(this.dialogZhutiType == 'editMore'){   // 批量更改状态时的门店主体
              this.dialogZhuti = false
            }
          }
        },
        sureSuccBtn(){  // 点击选择门店主体后 提示框的确定按钮
          this.deleteStoreSucc = false;
          this.$router.push('shop_list_recycle')
        },
        changeMoreOpe(val){    // 改变批量操作
          // console.log(this.multipleSelection);
          if(val=='7'){ // 批量导入
            this.$router.push('/shop_list_import')
          }else{
            if(this.multipleSelection.length<1){
              this.$message.error('请先选择要操作的门店');
              this.moreOpe = '';
              return;
            }else{
              this.attrForm.attr = '';  // 改变时，需先清空，批量编辑里的值需重新选择
              this.moreOpe = val;
              var storeId = '';
              this.multipleSelection.forEach((item)=>{  
                storeId += item.storeId + ',';  // 获得选中门店的id
              })
              this.moreSelectStoreIds = storeId.substring(0,storeId.length-1);
              if(val=='0'){   // 批量修改门店分组
                this.dialogVisibleGroup = true;
              }else if(val=='1'){   // 批量编辑
                this.dialogVisibleAttr = true
              }else if(val=='2'){   // 批量下载二维码
                this.moreExcelDownload()
              }else if(val=='3'){ // 批量下载门店资料
                this.moreDataDownload()
              }else if(val=='4'){ // 批量上传图片
                this.moreUploadImg()
              }else if (val=='5') { // 批量转移会员
                // console.log(this.multipleSelection);
                var totalMemberNum = 0;
                this.multipleSelection.forEach((item)=>{
                  if(item.memberNum==null){
                    item.memberNum = 0
                  }
                  totalMemberNum = totalMemberNum + parseInt(item.memberNum);
                })
                if(totalMemberNum>0){ // 判断多选的门店是否有会员
                  this.showStoreDialog = true;
                }else{
                  this.$message('选中门店没有会员，无需转移');
                  this.moreOpe = '';
                }
              }else if (val=='6') { // 批量删除门店
                this.deleteMoreStoreBool = true;  // 单选、多选的标识
                var totalMemberNum = 0;
                this.multipleSelection.forEach((item)=>{
                  if(item.memberNum==null){
                    item.memberNum = 0
                  }
                  totalMemberNum = totalMemberNum + parseInt(item.memberNum);
                })
                if(totalMemberNum>0){ // 判断多选的门店是否有会员
                  this.$confirm('这些门店下面有会员未转移，删除后这些会员将直接变为无归属，确认要删除该门店吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    if(this.integralFlag=='gic'){
                      this.dialogZhuti = true;  // 显示出成本主体
                      this.selectDataName='';
                      this.selectDataId='';
                      this.dialogZhutiType = 'delete';
                    }else{
                      this.selectDataId = ''; // 成本主体
                      this.deleteStoreZhuti(); // 直接删除门店
                    }
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });          
                  });
                }else{
                  if(this.integralFlag=='gic'){
                    this.dialogZhuti = true;  // 显示出成本主体
                    this.selectDataName='';
                    this.selectDataId='';
                    this.dialogZhutiType = 'delete';
                  }else{
                    this.selectDataId = ''; // 成本主体
                    this.deleteStoreZhuti(); // 直接删除门店
                  }
                }
              }else if(val=='8'){   // 批量上线
                var count = 0;
                var lineBool=false;
                this.multipleSelection.forEach((item)=>{
                  if(item.status!=4){
                    this.$message.error('请选择待上线的门店');
                    this.moreOpe = '';
                    return;
                  }else{
                    count++;
                    if(count==this.multipleSelection.length){
                      lineBool = true
                    }
                  }
                })
                if(lineBool){
                  this.axios.post('/api-admin/pub-store',qs.stringify({
                    requestProject:'gic-web',
                    storeIds:this.moreSelectStoreIds
                  })).then((res)=>{
                    var data = res.data;
                    console.log(data);
                    if(data.errorCode==0){
                      this.moreOpe = '';
  
                      this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize); // 刷新列表
                      this.$message.success('上线成功');
  
                    }else{
                      this.$message.error(data.message)
                    }
                  })
                }
              }else if(val=='9'){   // 批量更改状态
                this.changeStatusDialog = true;
                // var state = this.multipleSelection[0].status;
                // var count = 0;
                // this.multipleSelection.forEach((item)=>{
                //   if(item.status==state){
                //     count++
                //   }
                // })
                // if(count==this.multipleSelection.length){
                //   this.changeStatusDialog = true;
                //   this.statusForm2.statusMore = ''
                // }else{
                //   this.$message.error('请选择相同门店状态的门店');
                //   this.attrForm.attr = '';
                //   this.saveType = '';
                //   return;
                // }
              }
            }
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        dialogGroupSaveBtn(){   // 批量设置分组的保存按钮
          if(this.dialogStoreGroupId == ''){
            this.$message.error('请选择要移动的分组');
            return;
          }else{
            this.dialogVisibleGroup = false;
            this.axios.post('/api-admin/store-group-relation-update',qs.stringify({
              requestProject:'gic-web',
              storeIds:this.moreSelectStoreIds,
              storeGroupId:this.dialogStoreGroupId,
              storeGroupName:this.dialogStoreGroupName
            })).then((res)=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode==0){
                this.moreOpe = '';
                this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize); // 刷新列表
                this.$message.success('设置分组成功');
              }else{
                this.$message.error(data.message)
              }
            })
          }
        },
        dialogGroupCancelBtn(){   // 批量设置分组的取消按钮
          this.dialogVisibleGroup = false;
          this.dialogStoreGroupId = '';
          this.dialogStoreGroupName = '';
          this.moreOpe = '';
        },
        floatTime(val){  // 保留两位小数
          if(val){
            var reg = /^\d+(\.\d{2})?$/g;
            if(!reg.test(val)){
              this.$message.error('请输入整数或者最多两位小数的小数');
            }
          }
        },
        numAndFloat(){  // 只能输入数字和小数点
          this.attrForm.area=this.attrForm.area.toString().replace(/[^0-9.]/g,'');
        },
        selectEnterprise(val){ // 编辑属性 -- 关联商户
          this.attrForm.contact = val;
        },
        selectSignage(val){  // 编辑属性 -- 选择店招
          let obj = {};
          obj = this.options.find((item)=>{
              return item.signageCode === val;//筛选出匹配数据
          });
          // console.log(obj.signageName); // 获得对应的label值
          this.attrForm.signage = val + '_' + obj.signageName;
          console.log(this.attrForm.signage);
        },
        selectOpenTime(val){    // 编辑属性 -- 营业时间
          this.attrForm.openTime = val;
        },
        selectCloseTime(val){
          this.attrForm.closeTime = val;
        },
        selectStoreStype(){ // 编辑属性 -- 门店类型
          this.attrForm.style = val;
        },
        selectedArea(val) {   // 编辑属性 -- 门店分区
          console.log(val);
          if(val.areaId){
            this.areaId = val.areaId;
            this.areaOptionsNew.provinceName = val.provinceName;    // 默认的省市区传值
            this.areaOptionsNew.provinceId = val.province;
            this.areaOptionsNew.cityName = val.cityName;
            this.areaOptionsNew.cityId = val.city;
            this.areaOptionsNew.countryName = val.countryName;
            this.areaOptionsNew.countyId = val.country;
          }
        },
        selectStoreStatus(val){ // 编辑属性 -- 门店状态
          this.attrForm.state = val;
          if(this.integralFlag=='gic' && this.attrForm.state=='-3'){    // 闭店（删除门店）  选择成本主体
            this.dialogZhuti = true;
            this.selectDataName='';
            this.selectDataId='';
            this.dialogZhutiType = 'edit';
          }
          var state = this.multipleSelection[0].status;
          var completeStatus = this.multipleSelection[0].completeStatus;
          if(state==3 && completeStatus==0 && this.attrForm.state=='0'){  // 停业 未完善  X  正常
            this.$message.error('停业整顿且未完善状态不能改为正常状态');
            this.attrForm.state="";
            return;
          }
        },
        selectStoreShow(val){  // 编辑属性 -- 附近门店显示
          this.attrForm.open = val
        },
        changeAttr(val){   // 改变批量编辑的值
          // console.log(this.multipleSelection); // 选中的门店
          if(val=='1'){   // 关联商户
            var enterpriseIds = this.multipleSelection[0].enterpriseId;
            var count = 0;
            this.saveType = 'enterpriseIds';
            // this.multipleSelection.forEach((item)=>{
            //   if(enterpriseIds!=item.enterpriseId){ // 是否不相同，只需要判断所有的跟第一个是否相同
            //     this.$message.error('请选择相同关联商户的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }else{
            //     count++;    // 判断是否相同，需要判断相同的个数与总长度是否相同
            //     if(count == this.multipleSelection.length){
  
            //     }
            //   }
            // })
          }else if(val=='2'){   // 店招品牌
            this.saveType = 'signages';
            var signages = this.multipleSelection[0].signages;
            // this.multipleSelection.forEach((item)=>{
            //   if(signages!=item.signages){
            //     this.$message.error('请选择相同店招品牌的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }
            // })
          }else if(val=='3'){   // 营业时间
            this.saveType = 'businessTime';
            // var openTime = this.multipleSelection[0].openTime;
            // var closeTime = this.multipleSelection[0].closeTime;
            // this.multipleSelection.forEach((item)=>{
            //   if(openTime!=item.openTime && closeTime!=item.closeTime){
            //     this.$message.error('请选择相同营业时间的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }
            // })
          }else if(val=='4'){   // 门店类型
            this.saveType = 'storeType';
            // var storeType = this.multipleSelection[0].storeType;
            // this.multipleSelection.forEach((item)=>{
            //   if(storeType!=item.storeType){
            //     this.$message.error('请选择相同门店类型的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }
            // })
          }else if(val=='5'){   // 门店分区
            this.saveType = 'countyId';
            // var areaId = this.multipleSelection[0].areaId;
            // this.multipleSelection.forEach((item)=>{
            //   if(areaId!=item.areaId){
            //     this.$message.error('请选择相同门店分区的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }
            // })
          }else if(val=='6'){   // 门店面积
            this.saveType = 'storeArea';
            // var area = this.multipleSelection[0].storeArea;
            // this.multipleSelection.forEach((item)=>{
            //   if(area!=item.storeArea){
            //     this.$message.error('请选择相同门店面积的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }
            // })
          }else if(val=='7'){   // 门店状态
            this.saveType = 'status';
            var state = this.multipleSelection[0].status;
            this.multipleSelection.forEach((item)=>{
              if(state!=item.status){
                this.$message.error('请选择相同门店状态的门店');
                this.attrForm.attr = '';
                this.saveType = '';
                return;
              }
            })
            
          }else if(val=='8'){   // 附近门店显示
            this.saveType = 'near';
            // var open = this.multipleSelection[0].isShowNearbyStore;
            // this.multipleSelection.forEach((item)=>{
            //   if(open!=item.isShowNearbyStore){
            //     this.$message.error('请选择相同附近门店显示状态的门店');
            //     this.attrForm.attr = '';
            //     this.saveType = '';
            //   }
            // })
          }
        },
        dialogAttrSaveBtn(){    // 批量编辑属性的保存按钮
          if(this.saveType == ''){
            this.$message.error('请先选择要关联的属性');
            return;
          }
          if(this.saveType=='enterpriseIds'){  // 关联商户
            if(this.attrForm.contact.length<1){
              this.$message.error('请选择关联商户');
              return;
            }else{
              this.saveValue = this.attrForm.contact.join(',');
            }
          }
          if(this.saveType=='signages'){  // 店招
            if(this.attrForm.signage==''){
              this.$message.error('请选择店招品牌');
              return;
            }else{
              this.saveValue = this.attrForm.signage;
            }
          }
          if(this.saveType=='businessTime'){  // 营业时间
            if(this.attrForm.openTime==''){
              this.$message.error('请选择开始营业时间');
              return;
            }else if(this.attrForm.closeTime==''){
              this.$message.error('请选择结束营业时间');
              return;
            }else{
              this.saveValue = this.attrForm.openTime + '-' + this.attrForm.closeTime;
            }
          }
          if(this.saveType=='storeType'){  // 门店类型
            if(this.attrForm.style==''){
              this.$message.error('请选择门店类型');
              return;
            }else{
              this.saveValue = this.attrForm.style
            }
          }
          if(this.saveType=='countyId'){  // 门店分区
            if(this.areaId==''){
              this.$message.error('请选择门店分区');
              return;
            }else{
              this.saveValue = this.areaId;
            }
          }
          if(this.saveType=='storeArea'){  // 门店面积
            if(this.attrForm.area==''){
              this.$message.error('请输入门店面积');
              return;
            }else{
              this.saveValue = this.attrForm.area
            }
          }
          if(this.saveType=='status'){  // 门店状态
            if(this.attrForm.state==''){
              this.$message.error('请选择门店状态');
              return;
            }else{
              this.saveValue = this.attrForm.state;
              if(this.attrForm.state=='-3' && this.selectDataId==''){
                this.$message.error('请选择成本主体');
                return;
              }
              var status = this.multipleSelection[0].status; // 门店状态
              if(status==3 && this.attrForm.state=='0'){  // 停业 - 正常
                this.saveValue = '4';
              }
              if(status==4 && this.attrForm.state=='0'){  // 正常 待完善 - 正常
                this.saveValue = '4';
              }
              if(status==2 && this.attrForm.state=='0'){  // 正常 已完善 - 正常
                this.saveValue = '2';
              }
            }
          }
          if(this.saveType=='near'){  // 附近门店显示
            this.saveValue = this.attrForm.open==true?'1':'0';
          }
          this.attrForm.time = this.attrForm.openTime + '-' + this.attrForm.closeTime;  // 营业时间
          this.axios.post('/api-admin/bluk-store-edit',qs.stringify({
            requestProject:'gic-web',
            storeIds:this.moreSelectStoreIds,
            clumn:this.saveType,
            value:this.saveValue,
            toStoreId:this.selectDataId
          })).then((res)=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode==0){
              this.dialogVisibleAttr = false;
              this.$message.success('保存成功');
              this.moreOpe = '';
              this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
              this.attrForm.state=""; 
            }else{
              this.$message.error(data.message)
            }
          })
        },
        dialogAttrCancelBtn(){  // 批量编辑属性的取消按钮
          this.dialogVisibleAttr = false;
          this.moreOpe = '';
        },
        moreExcelDownload(){  // 批量下载二维码
          this.axios.post('/api-admin/store-code-download',qs.stringify({
            requestProject:'gic-web',
            storeIds:this.moreSelectStoreIds
          })).then(res=>{
            // console.log(res);
            if(res.errorCode){   // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
              this.$message({
                type: 'error',
                message: data.message
              });
            }else{
              window.location.href = excelConfig.config + '/api-admin/store-code-download?requestProject=gic-web&storeIds=' + this.moreSelectStoreIds;
              this.moreOpe = '';  // 重新选择需要的批量操作
            }
          })
        },
        moreDataDownload(){  // 批量下载门店资料
          this.axios.post('/api-admin/bluk-down-store',qs.stringify({
            requestProject:'gic-web',
            storeIds:this.moreSelectStoreIds
          })).then(res=>{
            var data = res.data
            window.location.href = excelConfig.config + '/api-admin/bluk-down-store?requestProject=gic-web&storeIds=' + this.moreSelectStoreIds;
            this.moreOpe = '';  // 重新选择需要的批量操作
            if(data.errorCode == 500){    // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
              this.$message({
                type: 'error',
                message: data.message
              });
            }
          })
        },
        moreUploadImg(){  // 批量上传图片
          document.getElementById('imgupload').getElementsByClassName('el-upload__input')[0].click();
        },
        handleExceed(files, fileList) {   // 限制上传个数
          this.$message.warning('最多只能上传10个哦');
        },
        beforeImgUpload(picFile){    // 批量上传图片
          // console.log(picFile);
          let fd = new FormData();
          fd.append('picFile', picFile);
          fd.append('requestProject', 'gic-web');
          fd.append('wxFlag','1');
          this.axios.post('/api-plug/upload-img', fd).then((res)=> {//成功后回调
            var data = res.data;
            console.log(data);
            if(data.errorCode==0){
              this.uploadImg = {};
              this.uploadImg.imageFiledCode = data.result[0].imageFiledCode;
              this.uploadImg.wxImg = data.result[0].wxImg;
              this.uploadImg.qcloudImageUrl = data.result[0].qcloudImageUrl;
              this.sendImgData();   // 文件上传成功之后设置门店图片：传值给后台
              this.moreOpe = '';  // 重新选择需要的批量操作
            } else {
              this.$message({
                type:'error',
                message:data.message
              })
            }
          });
          return true
        },
        sendImgData() {    // 文件上传成功之后设置门店图片：传值给后台
          this.axios.post('/api-admin/bluk-set-store-img',qs.stringify({ // 文件上传成功之后设置门店图片：传值给后台 
            requestProject:'gic-web',
            storeIds:this.moreSelectStoreIds,
            img:JSON.stringify(this.uploadImg)
          })).then(res=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode == 0){
              this.$message({
                type:'success',
                message:'上传成功'
              })
            }else{
              this.$message({
                type: 'error',
                message: data.message
              });
            }
          })
        },
        handleImgError(res){          // 文件上传失败
          // console.log(res);
        },
        selectStore(val) {    // 批量转移会员  选择门店  子组件触发方法
          // 模拟检查数据
          // console.log(val);
          this.showStoreDialog = false;
          this.selectShopUrl = val.storeName;
          // console.log(this.selectShopUrl);
          this.$emit('sendShopData',val.storeId);
          if(val.storeId){
            this.axios.post('/api-admin/batch-transfer-member',qs.stringify({ // 文件上传成功之后设置门店图片：传值给后台 
              requestProject:'gic-web',
              storeIds:this.moreSelectStoreIds,
              storeId:val.storeId
            })).then(res=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode == 0){
                this.moreOpe = '';  // 重新选择需要的批量操作
                this.$message({
                  type:'success',
                  message:data.message
                })
              }else if(data.errorCode == '110021'){
                this.$message(data.message);
              }else{
                this.$message({
                  type: 'error',
                  message: data.message
                });
              }
            })
          }
        },
        onlineStore(id){ // 上线
          this.axios.post('/api-admin/pub-store',qs.stringify({ 
            requestProject:'gic-web',
            storeIds:id
          })).then(res=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode == 0){
              this.$message({
                type:'success',
                message:'上线成功'
              })
              if(this.activeitem=='2'){  // 分组
                this.provinceId=null;
                this.cityId=null;
                this.areaId=null;
              }else if (this.activeitem=='3'){  // 分区
                this.storeGroupId=null;
              }
              this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
            }else{
              this.$message({
                type: 'error',
                message: data.message
              });
            }
          })
        },
        // 更改状态
        selectStatus(row){   
          // this.statusForm.status = '';
          if(this.statusForm.status){
            this.$refs.ruleForm.resetFields();
          }
          this.selectStatusDialog = true;
          this.selectStoreIds = row.storeId;
          if(row.status==3){ // 未上线
            if(row.completeStatus==0){  // 未完善
              this.statusOptions = [{
                value: '7',
                label: '待上线'
              }, {
                value: '6',
                label: '停业整顿'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            } else if(row.completeStatus==1){  // 已完善
              this.statusOptions = [{
                value: '7',
                label: '待上线'
              }, {
                value: '2',
                label: '上线'
              }, {
                value: '6',
                label: '停业整顿'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            }
          }
          if(row.status==7){  // 待上线
            if(row.completeStatus==0){  // 未完善
              this.statusOptions = [{
                value: '3',
                label: '未上线'
              }, {
                value: '6',
                label: '停业整顿'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            } else if(row.completeStatus==1){  // 已完善
              this.statusOptions = [{
                value: '3',
                label: '未上线'
              }, {
                value: '2',
                label: '上线'
              }, {
                value: '6',
                label: '停业整顿'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            }
          }
          if(row.status==2){  // 已上线
            if(row.completeStatus==1){  // 已完善
              this.statusOptions = [{
                value: '3',
                label: '未上线'
              }, {
                value: '2',
                label: '上线'
              }, {
                value: '6',
                label: '停业整顿'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            }
          }
          if(row.status==6){  // 停业整顿
            if(row.completeStatus==0){  // 未完善
              this.statusOptions = [{
                value: '3',
                label: '未上线'
              }, {
                value: '7',
                label: '待上线'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            } else if(row.completeStatus==1){  // 已完善
              this.statusOptions = [{
                value: '3',
                label: '未上线'
              }, {
                value: '7',
                label: '待上线'
              }, {
                value: '2',
                label: '上线'
              }, {
                value: '-3',
                label: '闭店（删除门店）'
              }]
            }
          }
        },
        changeStatus(val){ // 选择更改状态
          if(this.integralFlag=='gic' && this.statusForm.status=='-3'){  // 闭店（删除门店）时要选择门店主体
            this.dialogZhuti = true;
            this.selectDataName='';
            this.selectDataId='';
            this.dialogZhutiType = 'edit';
          }
        },
        selectStatusBtn(formName){  // 更改状态弹框的确定按钮
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.integralFlag=='gic' && this.statusForm.status=='-3'){
                if(this.selectDataId){
                  this.selectStatusSave()
                }else{
                  this.dialogZhuti = true;
                  this.selectDataName='';
                  this.selectDataId='';
                  this.dialogZhutiType = 'edit';
                }
              }else{
                this.selectStatusSave()
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        selectStatusSave(){  // 保存数据
          if(this.statusForm.status=='2'){  // 上线
            this.axios.post('/api-admin/pub-store',qs.stringify({
              requestProject:'gic-web',
              storeIds:this.selectStoreIds
            })).then((res)=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode==0){
                this.selectStatusDialog = false;
                this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
                this.$message.success('更改成功');
                this.selectDataId = "";
              }else{
                this.$message.error(data.message)
              }
            })
          }else{
            this.axios.post('/api-admin/update-store-status',qs.stringify({ 
              requestProject:'gic-web',
              storeIds:this.selectStoreIds,
              status:this.statusForm.status,
              toStoreId:this.selectDataId
            })).then(res=>{
              var data = res.data;
              //console.log(data);
              if(data.errorCode == 0){
                this.selectStatusDialog = false;
                this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
                this.$message.success('更改成功');
                this.selectDataId = "";
              }else{
                this.$message({
                  type: 'error',
                  message: data.message
                });
              }
            })
          }
        },
        // 批量更改状态
        changeStatus2(){
          if(this.statusForm2.statusMore == '2'){ // 选择上线
            // var completeStatus = this.multipleSelection[0].completeStatus;
            var count = 0;
            this.multipleSelection.forEach((item)=>{
              if(item.completeStatus==1){
                count++
              }
            })
            if(count==this.multipleSelection.length){ //选择上线时，须保证所选门店的资料完善状态均为“已完善”
  
            }else{
              this.$message.error('部门门店资料未完善，请先完善资料再上线');
              this.statusForm2.statusMore = '';
              return
            }
          }
          if(this.integralFlag=='gic' && this.statusForm2.statusMore == '-3'){  // 闭店（删除门店）
            if(this.selectDataId){
              // this.selectStatusSave()
            }else{
              this.dialogZhuti = true;
              this.selectDataName='';
              this.selectDataId='';
              this.dialogZhutiType = 'editMore';
            }
          }
        },
        cancelStatusBtn(){  // 取消按钮
          this.moreOpe = '';
          this.changeStatusDialog = false;
        },
        changeStatusBtn(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.statusForm2.statusMore=='2'){ // 上线
                this.axios.post('/api-admin/pub-store',qs.stringify({
                  requestProject:'gic-web',
                  storeIds:this.moreSelectStoreIds
                })).then((res)=>{
                  var data = res.data;
                  // console.log(data);
                  if(data.errorCode==0){
                    this.moreOpe = '';
                    this.changeStatusDialog = false;
                    this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize); // 刷新列表
                    this.$message.success('上线成功');
                  }else{
                    this.$message.error(data.message)
                  }
                })
              }else{
                if(this.integralFlag=='gic' && this.statusForm2.statusMore=='-3'){  // 闭店（删除门店）
                  if(this.selectDataId==''){
                    this.dialogZhuti = true;
                    return;
                  }
                }
                this.axios.post('/api-admin/update-store-status',qs.stringify({ 
                  requestProject:'gic-web',
                  storeIds:this.moreSelectStoreIds,
                  status:this.statusForm2.statusMore,
                  toStoreId:this.selectDataId
                })).then(res=>{
                  var data = res.data;
                  //console.log(data);
                  if(data.errorCode == 0){
                    this.moreOpe = '';
                    this.changeStatusDialog = false;
                    this.getShopList(this.storeGroupId,this.allStyle,this.provinceId,this.cityId,this.areaId,this.currentPage,this.pageSize);
                    this.selectDataId=''; // 清掉门店主体
                    this.$message.success('更改成功')
                  }else{
                    this.$message({
                      type: 'error',
                      message: data.message
                    });
                  }
                })
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        // 新增门店
        addShop(type){  
          this.$router.push({
            path:'/shop_list_add',
            query:{
              type:type
            }
          })
        },
        editShop(id,status,type){
          this.$router.push({
            path:'/shop_list_add',
            query:{
              id:id,
              status:status,
              integralFlag:this.integralFlag,
              type:type
            }
          })
        },
        recycleBtn(){
          if(this.recycleStoreCount>0){
            this.$router.push('shop_list_recycle')
          }else{
            this.$message.error('门店回收站中暂无内容')
          }
        }
      },
      components: {
        navbar
      }       
    }
  </script>
  
  <style lang="less" scoped>
    .wrap{
      width: 100%;
      overflow: auto;
    }
    .box-wrap{
      min-height: 500px;
      padding: 24px 24px 0 24px;
      /* background: #EEF1F8; */
      position: relative;
      min-height: calc(100% - 240px);
    }
    .left-wrap{
      width: 294px;
      background: #EEF1F8;
      height: 553px;
      padding: 15px 5px 15px 15px;
      box-sizing: border-box;
      overflow: auto;
      position: absolute;
      .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right:2px;
        width: 100%;
        overflow: auto;
        /* &:hover{
          width:87%;
          padding-right:80px;
        } */
        .turn-top{
          padding-left: 0;
          transform: rotate(90deg)
        }
        .turn-bottom{
          padding-left: 0;
          transform: rotate(-90deg)
        }
        i{
          padding-left: 2px;
          cursor: pointer;
          display: none;
        }
      }
      .tree-label{
        display: inline-block;
        /* max-width: 140px; */
        line-height: 32px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .tree-opr-icon{
        /* position: absolute;
        right: 2px; */
      }
    }
    .left-area-wrap{
      width: 237px;
      background: #EEF1F8;
      height: 554px;
      // margin-right: 10px;
      box-sizing: border-box;
      position: absolute;
      .area-title-wrap{
        text-align:center; 
        margin: 15px;
      }
      .area-tree-wrap{
        height: 491px;
        overflow: auto;
        font-size: 14px;
      }
      .search-area-input{
        margin: 10px 0;
      }
      .area-wrap{
        height: 492px;
        overflow: auto;
        ul{
          li{
            height: 35px;
            line-height: 35px;
            text-align: left;
            padding: 0 15px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
            color: #606266;
            cursor: pointer;
            &.on{
              color: #1890ff;
              font-weight: 700;
            }
            &:hover{
              background: #e4e7ed;
            }
          }
        }
      }
    }
    .right-list-wrap{
      width: 100%;
      padding-left: 294px;
      &.padding-l{
        padding-left: 237px;
      }
      .right-box-content{
        background: #fff;
        .right-box{
          padding: 0 24px 24px;
          box-sizing: border-box;
          .title-wrap{
            height: 55px;
            line-height: 55px;
            color: #303133;
            /*border-bottom: 1px solid #EBEEF5;*/
            h2{
              font-size: 18px;
              font-weight: 500;
              span{
                padding: 0 5px;
                font-weight: 500;
              }
            }
            p{
              font-size: 14px;
              font-weight: 500;
            }
          }
          .title-tip{
            width: 100%;
            height: 38px;
            line-height: 38px;
            font-size: 13px;
            border-radius: 2px;
            color: #606266;
            background-color: #f4f4f5;
            i{
              margin: 0 12px;
              color: #1890ff;
            }
          }
          .search-wrap{
            /* padding: 20px 0; */
            .search-select{
              width: 130px;
              margin-right: 8px;
            }
            .search-input{
              width: 180px;
            }
            .add-btn{
              margin-left: 3px;
            }
          }
        }
      }
    }
    .add-wrap{
      position: relative;
      width: 100%;
      .add-num{
        position: absolute;
        right: 10px;
        bottom: 1px;
        color: #c0c4cc;
        font-size: 12px;
        background: #fff;
        height: 30px;
        line-height: 32px;
        padding-left: 10px;
      }
    }
    .area-title-wrap /deep/ .el-radio-button--medium .el-radio-button__inner{
      padding: 10px 28.5px
    }
    .filter-tree{
      font-size: 14px;
    }
    .filter-tree.active > .el-tree-node:first-child > .el-tree-node__content:first-child > .custom-tree-node:last-child{
      color: #1890ff;
      font-weight: 700 !important;
    }
    .attr-select{
      width: 100%;
      .select-time{
        width: 231px;
      }
      span{
        padding: 0 5px;
      }
    }
    .edit-input{
      width: 447px;
    }
    .edit-input,.right-input-tip{
      display: inline-block;
    }
    .filter-tree /deep/ .el-tree-node__content:hover .tree-icon{
      display:inline-block;
    }
    .filter-tree /deep/ .el-tree-node.is-current>.el-tree-node__content{
      color: #1890ff;
      font-weight: 700 !important;
      background: transparent;
    }
    .delete-store-wrap{
      .delete-store-body{
        .delete-tip-text{
          font-size: 14px;
          color: #606266;
          text-align: center;
          height: 24px;
          line-height: 24px;
          position: relative;
          i{
            position: absolute;
            color:#e6a23c;
            position: absolute;
            font-size: 24px;
          }
          span{
            padding-left:36px;
          }
        }
        .store-info{
          /*width: 320px;
          margin: 0 auto;*/
          margin-left: 60px;
          padding: 15px 15px 0 15px;
          font-size: 14px;
          line-height: 30px;
          color: #606266;
          span{
            color: #ff0000;
          }
        }
      }
    }
    .all-style-wrap{
      width: 100%;
      position: relative;
      .search-input{
        width:180px;
      }
      .select-shop{
        width: 100%;
        min-height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #606266;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 0 10px;
        box-sizing: border-box;
        input{
          cursor: pointer;
          padding-left: 15px;
          box-sizing: border-box;
          width: 190px;
          height: 100%;
          color: #606266;
        }
        .shop-style-icon{
          color: #c0c4cc;
          transition: all 0.3s;
          &.on{
            transform:rotate(-180deg)
          }
        }
      }
      .select-shop-url-wrap{
        width: 100%;
        max-height: 260px;
        position: absolute;
        right: 0;
        margin-top: 10px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        z-index: 3000;
        .shop-tree-wrap{
          padding: 0 10px;
          overflow: auto;
          height: 212px;
          border: 1px solid #e4e7ed;
          box-sizing: border-box;
          position: relative;
        }
        .select-group-btn{
          margin-top: 8px;
          text-align: center;
        }
      }
    }
    .select-shop-wrap{
      /* 显示隐藏的动画 */
      .slide-fade-enter-active, .slide-fade-leave-active {
        transition: all 0.3s;
      }
      .slide-fade-enter, .slide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    .search-shop-wrap{
      .search-shop-input{
        padding: 10px;
      }
      .search-shop-list{
        .no-data{
          height: 34px;
          line-height: 34px;
          text-align: center;
        }
        ul{
          padding: 0 10px;
          li{
            font-size: 14px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;
            &:hover{
              background-color: #f0f2f5;
            }
            &.on{
              color: #1890ff;
              background-color: #fff;
              font-weight:700;
              &:after{
                position: absolute;
                right: 20px;
                font-family: element-icons;
                content: "\E611";
                font-size: 12px;
                font-weight: 700;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            }
          }
        }
      }
      .search-list-tip{
        font-size: 12px;
        background-color: #f6f8f9;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        box-sizing: border-box;
      }
    }
    .delete-succ-body{
      line-height: 25px;
      position: relative;
      span{
        position: absolute;
        font-size: 26px;
        top: 11px;
        color: #67c23a;
      }
      p{
        padding-left: 40px;
      }
    }
    .no-area-data{
      height: 523px;
      line-height: 523px;
      font-size: 14px;
      color: #909399;
      text-align: center;
    }
    .select-shop-wrap /deep/ .select-shop-url-wrap .el-input__inner{
      width: 100%;
    }
    .area-title-wrap /deep/ .el-radio-button span{
      width: 69px;
    }
    .left-wrap /deep/ .el-tree{
      background: #EEF1F8
    }
    .first-line{
      margin:22px 0;
      font-size: 0;
      .search-input{
        width: 200px;
      }
      .small-checkbox{
        background: #fff;
        height: 38px;
        box-sizing: border-box;
        margin-left: 10px;
      }
      .search-select{
        width: 150px;
        margin-right: 10px;
      }
    }
    .second-line /deep/ .el-checkbox.is-bordered.el-checkbox--small{
      height: 30px;
    }
    .second-line .small-checkbox{
      background: #fff;
      height: 30px;
      box-sizing: border-box;
    }
    .pagination{
      text-align: right;
    }
    .second-line{
      background: #EBEEF5;
      padding: 8px 15px;
      box-sizing: border-box;
      font-size: 0;
    }
    /*---滚动框背景样式--*/ 
    .left-wrap::-webkit-scrollbar-track-piece,.area-wrap::-webkit-scrollbar-track-piece{  
       background-color:#EEF1F8;  
       -webkit-border-radius:6px;  
    }
    /* 去掉表格的最后一条线 */
    .table-no-line-wrap::before{
      height: 0
    }
    /* 设置所属分组 */
    .set-group{
      padding: 15px;
      height: 400px;
      overflow: auto;
      background: #f0f2f5;
    }
    .left-wrap /deep/ .el-tree-node__content,.set-group /deep/ .el-tree-node__content{
      height: 32px;
    }
    .left-wrap /deep/ .el-tree-node__content:hover,.set-group /deep/ .el-tree-node__content:hover{
      background: #e4e7ed
    }
  
    .select-region-content /deep/ .w-160{
      width: 158px;
    }
    .select-region-content /deep/ .w-160+.w-160{
      margin-left:6px;
    }
  </style>
  