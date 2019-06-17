<template>
	<div class="wrap" style="height: 100%" :style="{minHeight: (bodyHeight - 164) + 'px'}">
    <navbar :activeitem="activeitem" :navpath="navpath" :navtab="isMiddleGround?navtab2:navtab" @getCurTab="getCurTab"></navbar>
    <div v-show="activeitem==2" class="box-wrap">
      <div style="min-height: 487px; width: 100%;background: #EEF1F8">
        <div class="left-wrap store-group-wrap">   <!-- :class="{'active':allStore}" -->
          <el-tree
            ref="tree1"
            class="filter-tree"
            :data="data1"
            highlight-current
            :props="defaultProps"
            node-key="storeGroupId"
            :default-expanded-keys="defaultExpandArr"
            :expand-on-click-node="false"
            @node-click="handleNodeClick">
            <div class="custom-tree-node-new" slot-scope="{ node, data }">
              <span class="tree-label" :title="node.label">{{ node.label }}</span>
              <span class="tree-opr-icon"><i v-show="node.parent.data.children &&node.parent.data.children.length>1 && data.storeGroupId != node.parent.data.children[0].storeGroupId" @click.stop.prevent="moveUpOrDownStore(data,node,'up')" title="上移" class="el-icon-back tree-icon turn-top"></i><i v-show="node.parent.data.children && node.parent.data.children.length>1 && data.storeGroupId != node.parent.data.children[node.parent.data.children.length-1].storeGroupId" @click.stop.prevent="moveUpOrDownStore(data,node,'down')" title="下移" class="el-icon-back tree-icon turn-bottom"></i></span>
            </div>
          </el-tree>
        </div>
        <div class="right-list-wrap">
          <div class="right-box-content">
            <div class="right-box">
              <div class="title-wrap clearfix">
                <h2 class="fl">门店<span>{{totalCount}}</span>家</h2>
                <!-- <p class="fr"><el-checkbox @change="changeChild" v-model="checkedChild">
                显示子分组门店</el-checkbox></p> -->
              </div>
              <div class="first-line clearfix">
                <div class="fl">
                  <el-input @keyup.native.enter="searchClerk" class="search-input" v-model="searchNameStore" prefix-icon="el-icon-search" placeholder="门店名称/code" clearable></el-input>
                  <el-input @keyup.native.enter="searchClerk" class="search-input" v-model="searchNameClerk" prefix-icon="el-icon-search" placeholder="店员名称/手机号/code" clearable></el-input>
                </div>
                <div class="fr">
                  <el-button @click="importExcel" class="add-btn fr" type="primary">Excel导出</el-button>
                  <el-button @click="importErweima" class="add-btn fr" type="primary">成员二维码导出</el-button>
                </div>
              </div>
              <div class="search-wrap clearfix second-line">
                <el-select @change="changeState" class="search-select" size="small" v-model="allState" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select @change="changeStyle" class="search-select" size="small" v-model="allStyle" placeholder="请选择">
                  <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-checkbox @change="changeChild" v-model="checkedChild" border size="small" class="small-checkbox">
                  显示子分组门店</el-checkbox>
              </div>
              <div class="table-wrap"  v-loading="loading">
                <div class="table-wrap">
                  <ul class="table-title clearfix">
                    <li class="first-list clearfix">
                      <div class="fl one-wrap">门店名称</div>
                      <div class="fl two-wrap">
                        <div class="list">设为店长</div>
                        <div class="list">姓名</div>
                        <div class="list">手机号码</div>
                        <div class="list">状态</div>
                        <div class="list">操作</div>
                      </div>
                    </li>
                  </ul>
                  <ul v-if="tableData.length>0" class="table-content">
                    <li class="clearfix" v-show="item.clerkList!=null" v-for="(item,index) in tableData" :key="index">
                      <div class="fl one-wrap store-name-wrap">
                        <h2>{{item.storeName}}</h2>
                        <h2 style="padding-top:10px;">{{item.storeCode}}</h2>
                        <h3 @click="addClerkInfo(item,'0')">新增成员</h3>
                      </div>
                      <div class="fl two-wrap">
                        <ul class="second-table-wrap" v-show="item.clerkList!=null&&item.clerkList.length>0" >
                          <li v-for="(childItem,idx) in item.clerkList" class="second-list clearfix" :key="idx">
                            <div class="list">
                              <el-radio v-model="item.clerker " :label="childItem.clerkId" @change="changeClerk($event,index,idx,childItem,item)">&nbsp;</el-radio>
                            </div>
                            <div class="list">
                              <div class="member-info-wrap clearfix">
                                <div class="fl img">
                                  <img :src="childItem.imageUrl?childItem.imageUrl:defaultImg" alt="">
                                </div>
                                <div class="fl">
                                  <p>{{childItem.clerkName}}</p>
                                  <p>{{childItem.positionName}}</p>
                                  <p>{{childItem.clerkCode}}</p>
                                </div>
                              </div>
                            </div>
                            <div class="list">{{childItem.phoneNumber?childItem.phoneNumber:'--'}}</div>
                            <div class="list clerk-state">
                              <span v-if="childItem.appActiveStatus==1" class="ok-app" title="已安装"></span>
                              <span v-else class="no-app" title="未安装"></span>
                            </div>
                            <div class="list">
                              <el-button @click="editClerkInfo(childItem,'0')" type="text">编辑</el-button>
                              <el-button v-show="childItem.status==1" @click="deleteClerk(childItem,'store',idx)" type="text">删除</el-button>
                              <el-button v-show="childItem.clerkType==0" @click="moveStoreClerk(childItem,'store',item.clerkList,idx)" type="text">转移</el-button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                  <div v-else class="no-data-wrap">
                    <div class="no-data-icon" >
                      <img src="../../../../static/img/no-data_icon.png" alt="">
                    </div>
                    <p>暂无数据</p>
                  </div>
                </div>
                <div class="pagination" v-show="totalCount>0">
                  <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[20, 40, 60, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next"
                    :total="totalCount">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="activeitem==3" class="box-wrap">
      <div style="min-height: 487px; width: 100%;background: #EEF1F8">
        <div class="left-wrap">
          <el-tree
            class="filter-tree"
            :class="{'active':allStore2}"
            :data="data2"
            :highlight-current="true"
            :props="defaultProps2"
            node-key="departId"
            :default-expanded-keys="defaultExpandArrDepart"
            :expand-on-click-node="false"
            @node-click="handleNodeClick2"
            ref="tree2">
            <div class="custom-tree-node-new" slot-scope="{ node, data }">
              <span class="tree-label" :title="node.label">{{ node.label }}</span>
              <span class="tree-opr-icon"><i @click.stop.prevent="addDepart(data)" title="增加" class="el-icon-plus tree-icon"></i><i @click.stop.prevent="editDepart(data)" v-show="data.departId!='0'" title="编辑" class="el-icon-edit tree-icon"></i><i v-show="node.parent.data.childList && node.parent.data.childList.length>1 && data.departId != node.parent.data.childList[0].departId" @click.stop.prevent="moveUpOrDownDep(data,node,'up')" title="上移" class="el-icon-back tree-icon turn-top"></i><i v-show="node.parent.data.childList && node.parent.data.childList.length>1 && data.departId != node.parent.data.childList[node.parent.data.childList.length-1].departId" @click.stop.prevent="moveUpOrDownDep(data,node,'down')" title="下移" class="el-icon-back tree-icon turn-bottom"></i><i @click.stop.prevent="deleteDepart(data,node)" v-show="data.departId!='0'&&data.childList.length<1" title="删除" class="el-icon-close tree-icon"></i></span>
            </div>
          </el-tree>
        </div>
        <div class="right-list-wrap">
          <div class="right-box-content">
            <div class="right-box">
              <div class="title-wrap clearfix">
                <h2 class="fl">成员<span>{{totalCount2}}</span>位</h2>
                <!-- <p class="fr"><el-checkbox @change="changeChild2" v-model="checkedChild2">
                显示子分组门店</el-checkbox></p> -->
              </div>

              <div class="first-line clearfix">
                <div class="fl">
                  <el-input @keyup.native.enter="searchDepart" class="search-input" v-model="searchName2" prefix-icon="el-icon-search" placeholder="姓名/手机号/code" clearable></el-input>
                </div>
                <div class="fr">
                  <el-button @click="importDepartExcel" class="add-btn fr" type="primary">Excel导出</el-button>
                  <el-button @click="addClerkInfo('','2')" class="add-btn fr" type="primary">新增成员</el-button>
                </div>
              </div>
              <div class="search-wrap clearfix second-line">
                <el-select @change="changeState2" class="search-select" size="small" v-model="allState2" placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-checkbox @change="changeChild2" v-model="checkedChild2" border size="small" class="small-checkbox">
                  显示子分组门店</el-checkbox>
              </div>
              <el-table
                class="table-no-line-wrap"
                :data="tableData2"
                style="width: 100%"
                v-loading="loading2">
                <el-table-column
                  prop="date"
                  label="成员信息"
                  width="200">
                  <template slot-scope="scope">
                    <div class="member-info-wrap clearfix">
                      <div class="fl img">
                        <img :src="scope.row.imageUrl?scope.row.imageUrl:defaultImg" alt="">
                      </div>
                      <div class="fl">
                        <p>{{scope.row.clerkName}}</p>
                        <p>{{scope.row.positionName}}</p>
                        <p>{{scope.row.clerkCode}}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="departName"
                  label="部门"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.departName?scope.row.departName:'--'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="storeCount"
                  label="管辖门店数">
                  <template slot-scope="scope">
                    {{scope.row.storeCount?scope.row.storeCount:'0'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="phoneNumber"
                  label="手机号码">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="状态"
                  width="100">
                  <template slot-scope="scope" >
                    <div class="clerk-state">
                      <span v-if="scope.row.inviteStatus==1" class="ok-app" title="已关注"></span>
                      <span v-else class="no-app" title="未关注"></span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ope"
                  label="操作"
                  width="150">
                  <template slot-scope="scope">
                    <el-button @click="editClerkInfo(scope.row,'2')" type="text">编辑</el-button>
                    <el-button @click="deleteClerk(scope.row,'depart',scope.$index)" type="text">删除</el-button>
                    <el-button @click="moveDepartClerk(scope.row,'depart',scope.$index)" type="text">转移</el-button>
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
              <div class="pagination" v-show="totalCount2>0">
                <el-pagination
                  background
                  @size-change="handleSizeChange2"
                  @current-change="handleCurrentChange2"
                  :current-page.sync="currentPage2"
                  :page-sizes="[20, 40, 60, 80]"
                  :page-size="pageSize2"
                  layout="total, sizes, prev, pager, next"
                  :total="totalCount2">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 添加子部门 -->
    <el-dialog
      title="新建子部门"
      :visible.sync="addDepartDialog"
      width="500px">
      <div class="new-create-content">
        <el-form ref="form" label-width="80px" label-position="right">
          <div class="create-content" style="width: 460px">
            <el-form-item class="add-wrap" label="部门名称">
              <el-input class="input-input" @keyup.native="toInput(dialogName,$event)" :value="dialogName" v-model="dialogName" placeholder="请输入部门名称"></el-input>
              <span class="add-num">{{inputNum}}/{{inputLength}}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDepartDialog = false">取 消</el-button>
        <el-button type="primary" @click.prevent.stop="saveAddDepart">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改部门名称 -->
    <el-dialog
      title="修改名称"
      :visible.sync="editDepartDialog"
      width="612px">
      <div class="new-create-content">
        <el-form ref="form" label-width="80px" label-position="right">
          <div class="create-content">
            <el-form-item class="add-wrap" label="部门名称">
              <el-input class="input-input" @keyup.native="toInput1(editDepartName,$event)" v-model="editDepartName" placeholder="请输入部门名称"></el-input>
              <span class="add-num">{{inputNum1}}/{{inputLength1}}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDepartDialog = false">取 消</el-button>
        <el-button type="primary" @click.prevent.stop="saveEditDepart">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 转移门店成员 -->
    <vue-gic-store :showStoreDialog="showStoreDialog" @selectStore="selectStore"></vue-gic-store>
    <!-- 转移部门成员 -->
    <el-dialog
      title="选择部门"
      :visible.sync="selectDepartDialog"
      width="612px">
      <div class="move-store-wrap">
        <el-tree v-if="depDialogShow"
          class="filter-tree"
          :data="data2"
          :highlight-current="true"
          :props="defaultProps2"
          node-key="departId"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick3"
          ref="tree3">
          <span class="custom-tree-node-new" slot-scope="{ node, data }">
            <span class="tree-label" :title="node.label">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDepartDialog = false">取 消</el-button>
        <el-button type="primary" @click.prevent.stop="saveMoveDepart">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导出数据 -->
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
	</div>
</template>

<script>
	import navbar from 'components/navbar/navbartwo'
  import strLength from '../../../common/js/strlen'
  import excelConfig from '../../../common/js/excel_config.js'
  // import defaultImg from '../../../../static/img/head_default.jpg'
	let qs = require('qs')
  export default {
    name: "clerk_list",
    data(){
    	return {
        projectName:'gic-web',
        depDialogShow:true,
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
            name: '成员管理',
            path: ''
          },
          {
            name: '成员与部门',
            path: ''
          }
        ],
        navtab: [
          {
            name: '门店成员',
            tab: 2
          },
          {
            name: '企业部门',
            tab: 3
          }
        ],
        navtab2: [
          {
            name: '门店成员',
            tab: 2
          },
        ],
        activeitem: 2,
        data1: [],  // 门店分组
        defaultProps: {
          children: 'children',
          label: 'storeGroupName'
        },
        tableData:[], // 店员列表
        options: [
          {
            value: '',
            label: '全部状态'
          }, {
            value: '1',
            label: '已安装APP'
          }, {
            value: '0',
            label: '未安装APP'
          }
        ],
        options3: [
         {
            value: '2',
            label: '已上线'
          }, {
            value: '3',
            label: '未上线'
          }, {
            value: '7',
            label: '待上线'
          }, {
            value: '6',
            label: '停业整顿'
          }
        ],
        allStyle:'2',
        allStore:true,    // 所有店员的默认状态
        storeGroupId:'',  // 所有分组的id
        checkedChild:true,  // 是否显示子分组门店
        showChildren:'1',
        allState:'',
        searchNameStore:'',
        searchNameClerk:'',
        currentPage:1,    //  分页
        pageSize:20,
        totalCount:0,
        radio:'1',   // 选中店长
        defaultImg:require('../../../../static/img/head_default.jpg'),

        data2: [],  // 企业部门
        defaultProps2: {
          children: 'childList',
          label: 'departName'
        },
        tableData2:[], // 店员列表
        allStore2:true,    // 所有店员的默认状态
        checkedChild2:true,  // 是否显示子分组门店
        showChildren2:'1',
        departId:'',
        options2: [
          {
            value: '',
            label: '全部状态'
          }, {
            value: '1',
            label: '已关注'
          }, {
            value: '4',
            label: '未关注'
          }
        ],
        allState2:'',
        searchName2:'',
        currentPage2:1,    //  分页
        pageSize2:20,
        totalCount2:0,
        loading2:false,

        addDepartDialog:false,  // 添加子分组
        parentDepartId:'',      // 父id
        addDepartChildren:[],   //  添加子分组时  点击选中的节点的children
        dialogName:'',
        inputNum: 0,
        inputLength: 10,
        editDepartDialog:false, // 修改部门名称
        editDepartArr:[],   // 点击选中的节点的children
        editDepartId:'',
        editDepartName:'',
        inputNum1: 0,
        inputLength1: 16,

        showStoreDialog:false,
        showSearchList:false,
        deleteStoreSucc:false,
        searchValueList:'',  // 部分门店的下拉框的搜索值
        selectList:[],
        selectDataName:'',
        selectDataId:'',
        loading:false,
        moveType:'',  // 转移类型
        moveClerkId:'',
        childClerkRow:[],  // 门店成员
        childClerkList:null,
        moveDepartId:'',
        selectDepartDialog:false, // 部门弹框
        moveSelectDepartId:'',  // 转移到的部门id
        departmentName:'企业部门',  // 部门 Excel导出时用到
        moveDepartIndex:null, //  转移部门成员时用
        storeObj:'',
        departObj:'',
        defaultExpandArr:[],
        defaultExpandArrDepart:['0'],
        isMiddleGround:false, // 是否是中台的标识
        // 导出数据
        dialogVisible:false,
        excelUrl:'/api-admin/power-clerk-excel',
        params:{}
    	}
    },
    created(){

    },
    watch:{
      data2:{
        handler(val){
          //console.log(val);
          this.data2 = val
        },
        deep:true
      }
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
      this.getUrlData();
      this.getLoginInfo();
      //this.getShopGroup('get'); // 获得门店分组
    },
    methods: {
      getLoginInfo(){ // 获取是否是中台的标识
        this.axios.get('/api-auth/get-login-user-info',{
          params: {
            requestProject:'gic-web'
          }
        }).then((res) => {
          var resData = res.data
          if (resData.errorCode == 0) {
            var isMiddleGround = resData.result.enterpriseDTO.backgroundMode;
            this.isMiddleGround = isMiddleGround==1?true:false;
          }else{
            this.$message.error(resData.message)
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      // 门店分组上移 或 下移
      moveUpOrDownStore(data,node,type){
        var allDataArr = node.parent.data.children;
        var index = allDataArr.indexOf(data);
        var oldData = JSON.parse(JSON.stringify(data));
        var newData;
        // console.log(data);
        // console.log(allDataArr);
        // console.log(index);
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
        //  console.log(allData);
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
        }else{
            this.$message.error(res.data.message)
          }
        })
      },
      // 部门 上移 或 下移
      moveUpOrDownDep(data,node,type){
        var allDataArr = node.parent.data.childList;
        var index = allDataArr.indexOf(data);
        var oldData = JSON.parse(JSON.stringify(data));
        var newData;
        var allData = [];
        var obj1 = {
          departId:data.departId,
          parentDepartId:data.parentDepartId,
          departmentSort:data.departmentSort //部门分组排序值
        }
        allData.push(obj1);
        var obj2 = {};
        if(type=='up'){
          obj2 = {
            departId:allDataArr[index-1].departId,
            parentDepartId:allDataArr[index-1].parentDepartId,
            departmentSort:allDataArr[index-1].departmentSort //部门分组排序值
          }
        }else if(type=='down'){
          obj2 = {
            departId:allDataArr[index+1].departId,
            parentDepartId:allDataArr[index+1].parentDepartId,
            departmentSort:allDataArr[index+1].departmentSort //门店分组排序值
          }
        }
        allData.push(obj2);
        this.axios.post('/api-admin/sort-department',qs.stringify({
          requestProject:'gic-web',
          params:JSON.stringify(allData)
        })).then((res)=>{
          if(res.data.errorCode==0){
            // this.getShopGroup('update'); // 获得门店分组
            if(type=='up'){
              newData = JSON.parse(JSON.stringify(node.parent.data.childList[index-1]));
              data.departName = newData.departName;
              data.departId = newData.departId;
              data.departmentSort = newData.departmentSort;
              data.childList = newData.childList;
              node.parent.data.childList[index-1].departName = oldData.departName;
              node.parent.data.childList[index-1].departId = oldData.departId;
              node.parent.data.childList[index-1].departmentSort = oldData.departmentSort;
              node.parent.data.childList[index-1].childList = oldData.childList;
            }else if(type=='down'){
              newData = JSON.parse(JSON.stringify(node.parent.data.childList[index+1]));

              data.departName = newData.departName;
              data.departId = newData.departId;
              data.departmentSort = newData.departmentSort;
              data.childList = newData.childList;
              node.parent.data.childList[index+1].departName = oldData.departName;
              node.parent.data.childList[index+1].departId = oldData.departId;
              node.parent.data.childList[index+1].departmentSort = oldData.departmentSort;
              node.parent.data.childList[index+1].childList = oldData.childList;
            }
        }else{
            this.$message.error(res.data.message)
          }
        })
      },
      getUrlData(){
        // var tab = this.$route.query.type;
        var tab = sessionStorage.getItem('clerkType');
        if(tab){
          this.activeitem = parseInt(tab);
          if(this.activeitem==2){
            this.allStore = true;
            var storeObj = JSON.parse(sessionStorage.getItem('storeObj'));
            // console.log(this.storeObj);
            if(storeObj){
              this.storeGroupId = storeObj.storeGroupId;
              this.searchNameStore = storeObj.searchNameStore;
              this.searchNameClerk = storeObj.searchNameClerk;
              this.allState = storeObj.allState;
              this.allStyle = storeObj.allStyle; // 上线 停业
              this.showChildren = storeObj.showChildren;  // 是否显示子分组门店
              this.checkedChild = this.showChildren=='1'?true:false;
            }
            this.getShopGroup('get'); // 获得门店分组
          }else if(this.activeitem==3){
            this.allStore2 = true;
            var departObj = JSON.parse(sessionStorage.getItem('departObj'));
            if(departObj){
              this.departId = departObj.departId;
              this.searchName2 = departObj.searchName;
              this.allState2 = departObj.allState;
              this.showChildren2 = departObj.showChildren;  // 是否显示子分组门店
              this.checkedChild2 = this.showChildren2=='1'?true:false;
              this.currentPage2 = departObj.currentPage;    //  分页
              this.pageSize2 = departObj.pageSize;
            }
            this.getDepart();
          }
        }else{
          this.allStore = true;
          this.getShopGroup('get'); // 获得门店分组
        }
      },
      getCurTab(val){ // 分组与分区的切换
        this.activeitem = val;
        if(val==3){ // 企业部门
          this.allStore2 = true;
          this.getDepart();
        }
        if(val==2){
          this.allStore = true;
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
            // console.log(this.data1);
            if(type=="get"){
              this.defaultExpandArr = [];
              if(!this.storeGroupId){
                this.storeGroupId = data.result[0].storeGroupId;
                this.defaultGroupId = data.result[0].storeGroupId;
              }
              this.defaultExpandArr.push(this.defaultGroupId);
              this.$nextTick(_ => {
                this.$refs.tree1.setCurrentKey(this.storeGroupId);
              })
              var storeObj = JSON.parse(sessionStorage.getItem('storeObj'));
              if(storeObj){
                this.currentPage = storeObj.currentPage;    //  分页
                this.pageSize = storeObj.pageSize;
              }
              this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
            }else if(type=="update"){
              this.$nextTick(_ => {
                this.$refs.tree1.setCurrentKey(this.storeGroupId);
              })
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getShopList(groupId,page,size){    // 获得店员列表
        this.loading = true;
        this.showChildren = this.checkedChild==true?'1':'0';
        this.axios.post('/api-admin/store-clerk-list',qs.stringify({
          requestProject:'gic-web',
          storeGroupId:groupId,
          currentPage:page,
          pageSize:size,
          storeSearchParams:this.searchNameStore,
          clerkSearchParams:this.searchNameClerk,
          showChildren:this.showChildren,
          activeStatus:this.allState,
          status:parseInt(this.allStyle)
        })).then((res)=>{
          var data = res.data;
          // console.log(res.data);
          this.loading = false
          if(data.errorCode==0){
            var dataArr = data.result.result;
            if(dataArr&&dataArr.length>0){
              var storeObj = JSON.parse(sessionStorage.getItem('storeObj'));
              if (storeObj){
                this.$nextTick(_ => {
                  this.currentPage = storeObj.currentPage;    //  分页
                  this.pageSize = storeObj.pageSize;
                })
                sessionStorage.removeItem('storeObj');
              }
              dataArr.forEach(function(ele,index){  // 把店长的id拿出来
                if(ele.clerkList){
                  ele.clerkList.forEach(function(el,ind){
                    if (el.clerkType == 1) {
                      ele.clerker = el.clerkId;   // 每条数据 即对象 添加新的参数
                    }
                  })
                }
              })
              this.tableData = dataArr;
              this.totalCount = data.result.totalCount;
            }else{
              this.tableData = [];
              this.totalCount = 0;
            }

          }else{
            this.$message.error(data.message)
          }
        })
      },
      handleSizeChange(val){    // 选择分页符
        this.currentPage = 1;
        this.pageSize = val;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      handleNodeClick(data, node, indeterminate){    // 所有分组  树形控件的点击 显示出对应的店员列表
        this.allStore = false;
        this.currentPage=1;    //  分页
        this.pageSize=20;
        this.storeGroupId = data.storeGroupId;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      changeChild(val){ // 是否显示子分组
        this.currentPage=1;    //  分页
        this.pageSize=20;
        this.checkedChild = val;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      changeState(val){  // 切换状态
        this.currentPage=1;    //  分页
        this.pageSize=20;
        this.allState  = val;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      changeStyle(val){
        this.currentPage=1;    //  分页
        this.pageSize=20;
        this.allStyle  = val;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      searchClerk(){    // 搜索店员
        this.currentPage=1;
        this.pageSize=20;
        this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
      },
      changeClerk(e,index,idx,child,item) {  // 改变店长
        console.log(item);
        var clerker = item.clerker;
        this.$confirm('确认设置该店员为店长吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api-admin/set-store-manager',qs.stringify({
            requestProject:'gic-web',
            clerkId:child.clerkId,
            storeId:item.storeId
          })).then((res)=>{
            var data = res.data;
            if(data.errorCode==0){
              item.clerker = child.clerkId; // 设置店长
              item.clerkList.forEach((row)=>{
                row.positionName = '店员';
                row.clerkType = 0;
              })
              child.positionName = '店长';
              child.clerkType = 1;
              this.$message.success('设置店长成功')
            }else{
              this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
              this.$message.error(data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          });
        });
      },
      importErweima(){  // 门店成员二维码导出
        var type = 1
        if(this.allStyle=='2'){
          type = 1
        }else{
          type = 2
        }
        this.axios.post('/api-admin/clerk-qrcode-export',qs.stringify({
          requestProject:'gic-web',
          type:type
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode){   // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            this.$message({
              type: 'error',
              message: data.message
            });
          }else{
            window.location.href = excelConfig.config + '/api-admin/clerk-qrcode-export?requestProject=gic-web&type=1';
          }
        })
      },
      importExcel(){  // 门店成员 excel导出
        this.dialogVisible = true;
        this.params = {
          requestProject:this.projectName,
          storeGroupId:this.storeGroupId,
          storeSearchParams:this.searchNameStore,
          clerkSearchParams:this.searchNameClerk,
          showChildren:this.showChildren,
          activeStatus:this.allState
        };
      },
      deleteClerk(row,type,index){  // 门店、部门的店员删除
        if(row.status==2){
          this.$message('该成员处于新增审核中，不能删除哦')
        }else if(row.status==3){
          this.$message('该成员处于离职审核中，不能删除哦')
        }else if(row.status==4){
          this.$message('该成员处于转岗审核中，不能删除哦')
        }else{
          if(type=='store' && row.clerkType==1){   // 不可删除店长
            this.$message('转移店长身份后方可删除');
            return;
          }
          if((type=='store' && row.clerkType==0) || type=='depart'){
            this.$confirm('确认删除该成员吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.axios.post('/api-admin/delete-clerk',qs.stringify({
                requestProject:'gic-web',
                clerkId:row.clerkId
              })).then((res)=>{
                var data = res.data;
                // console.log(data);
                if(data.errorCode==0){
                  if(type=='store'){
                    this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
                  }else if(type=='depart'){
                    this.tableData2.splice(index, 1);
                    this.totalCount2--;
                  }
                  this.$message.success('删除成功');
                }else{
                  this.$message.error(data.message)
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          }
        }
      },
      moveStoreClerk(row,type,list,index){ // 转移门店成员
        this.showStoreDialog = true;
        this.moveType = type;
        this.moveClerkId = row.clerkId;
        this.childClerkRow = list; // 用于门店成员转移成功之后的操作
        this.childClerkList = index;
      },
      selectStore(val) {
        console.log(val);
        this.showStoreDialog = false;
        if(this.moveType=='store'){   // 转移  门店
          if(val.storeId){
            this.axios.post('/api-admin/transfer-clerk-store',qs.stringify({
              requestProject:'gic-web',
              clerkId:this.moveClerkId,
              storeId:val.storeId
            })).then(res=>{
              var data = res.data;
              console.log(data);
              if(data.errorCode == 0){
                // this.childClerkRow.splice(this.childClerkList,1);
                this.getShopList(this.storeGroupId,this.currentPage,this.pageSize);
                this.$message({
                  type:'success',
                  message:'转移成功'
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
        }else if(this.moveType=='depart'){  // 没用

        }
      },

      // 企业部门
      getDepart(){   // 获得企业部门
        this.allStore2 = true;
        this.axios.post('/api-admin/list-clerk-department',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          this.data2 = [];
          if(data.errorCode==0){
            var obj = {};
            obj.departId  = '0';
            obj.departName = '企业部门';
            obj.childList = data.result;
            obj.parentDepartId = null;
            this.data2.push(obj);
            if(!this.departId){
              this.departId = '0';
            }
            this.$nextTick(_ => {
              this.$refs.tree2.setCurrentKey(this.departId);
            })
            var departObj = JSON.parse(sessionStorage.getItem('departObj'));
            if(departObj){
              this.currentPage2 = departObj.currentPage;    //  分页
              this.pageSize2 = departObj.pageSize;
            }
            this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getDepartList(departId,page,size){    // 获得店员列表
        this.loading2 = true;
        this.showChildren2 = this.checkedChild2==true?'1':'0';
        this.axios.post('/api-admin/depart-clerk-list',qs.stringify({
          requestProject:'gic-web',
          departId:departId,
          currentPage:page,
          pageSize:size,
          searchParams:this.searchName2,
          showChildren:this.showChildren2,
          inviteStatus:this.allState2
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          this.loading2 = false
          if(data.errorCode==0){
            var dataArr = data.result.result;
            this.tableData2 = dataArr;
            this.totalCount2 = data.result.totalCount;

            var departObj = JSON.parse(sessionStorage.getItem('departObj'));
            if (departObj){
              this.$nextTick(_ => {
                this.currentPage2 = departObj.currentPage;    //  分页
                this.pageSize2 = departObj.pageSize;
              })
              sessionStorage.removeItem('departObj');
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      handleSizeChange2(val){    // 选择分页符
        this.currentPage2 = 1;
        this.pageSize2 = val;
        this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
      },
      handleCurrentChange2(val) {
        this.currentPage2 = val;
        this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
      },
      changeChild2(val){ // 是否显示子分组
        this.currentPage2=1;
        this.pageSize2=20;
        this.checkedChild2 = val;
        console.log(this.checkedChild2);
        this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
      },
      changeState2(val){  // 切换状态
        this.currentPage2=1;
        this.pageSize2=20;
        this.allState2  = val;
        this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
      },
      handleNodeClick2(data, node, indeterminate){    // 企业门店 树形控件的点击 显示出对应的店员列表
        this.allStore2 = false;
        this.currentPage2=1;
        this.pageSize2=20;
        this.departId = data.departId;
        this.departmentName = data.departName;
        this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
      },
      searchDepart(){ // 搜索部门店员
        this.currentPage2=1;
        this.pageSize2=20;
        this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
      },
      addDepart(data){  // 新建子部门
        console.log(data);
        this.dialogName = "";
        this.addDepartDialog = true;
        this.parentDepartId = data.departId;
        this.addDepartChildren = data.childList;
      },
      toInput(value,e) {  // 标签名称输入时控制字符数量
        var that = this;
        that.dialogName = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.dialogName);
      },
      saveAddDepart(){  // 新建子部门 按钮保存
        this.dialogName = this.dialogName.replace(/(^\s+)|(\s+$)/g,""); // 去除前后空格
        if(this.dialogName==''){
          this.$message.error('请输入部门名称');
          return;
        }
        this.axios.post('/api-admin/add-clerk-department',qs.stringify({
          requestProject:'gic-web',
          parentDepartId:this.parentDepartId,
          departName:this.dialogName
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            this.addDepartDialog = false;
            this.addDepartChildren.push(data.result);
            this.depDialogShow = false;
            this.$nextTick(function(){
              this.depDialogShow = true;
            })
          }else{
            this.$message.error(data.message)
          }
        })
      },
      editDepart(data){  // 修改部门名称
        this.editDepartName = "";
        this.editDepartDialog = true;
        this.editDepartArr = data;
        this.editDepartId = data.departId;
        this.editDepartName = data.departName;
        this.inputNum1 = strLength.getZhLen(this.editDepartName);
      },
      toInput1(value,e) {  // 部门名称输入时控制字符数量
        var that = this;
        that.editDepartName = strLength.getByteVal(e.target.value,that.inputLength1);
        that.inputNum1 = strLength.getZhLen(this.editDepartName);
      },
      saveEditDepart(){  // 修改部门名称 按钮保存
        this.editDepartName = this.editDepartName.replace(/(^\s+)|(\s+$)/g,""); // 去除前后空格
        if(this.editDepartName==''){
          this.$message.error('请输入部门名称');
          return;
        }
        this.axios.post('/api-admin/update-clerk-department',qs.stringify({
          requestProject:'gic-web',
          departId:this.editDepartId,
          departName:this.editDepartName
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            this.editDepartDialog = false;
            this.editDepartArr.departName = this.editDepartName;
            //this.getDepartList(this.departId,this.currentPage2,this.pageSize2); // 更新列表
          }else{
            this.$message.error(data.message)
          }
        })
      },
      deleteDepart(data,node){ // 删除部门
        console.log(node);
        this.$confirm('确认删除该部门吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api-admin/delete-clerk-department',qs.stringify({
            requestProject:'gic-web',
            departId:data.departId
          })).then((res)=>{
            var dataDel = res.data;
            if(dataDel.errorCode==0){
              const parent = node.parent;
              const children = parent.data.childList || parent.data;
              const index = children.findIndex(d => d.departId === data.departId);
              children.splice(index, 1);
              if(this.departId==data.departId){ // 删除选中的分组
                this.allStore2 = true;
                this.departId = '0';
                this.getDepartList(this.departId,this.currentPage2,this.pageSize2);
              }
              this.$message.success('删除成功!');
              // this.allStore2 = true;
              // this.getDepart(); // 重新刷新
              // this.$message.success('删除成功');
            }else{
              this.$message.error(dataDel.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      moveDepartClerk(row,type,index){  // 转移部门成员
        console.log(row);
        this.selectDepartDialog = true;
        this.moveDepartId = row.clerkId;
        this.moveDepartIndex = index;
      },
      handleNodeClick3(data, node, indeterminate){    // 转移部门成员 树形控件的点击
        console.log(data);
        this.moveSelectDepartId = data.departId;
      },
      saveMoveDepart(){
        if(this.moveSelectDepartId==''){
          this.$message.error('请选择要转移的部门');
          return;
        }else{
          this.selectDepartDialog = false;
          this.axios.post('/api-admin/transfer-clerk-depart',qs.stringify({
            requestProject:'gic-web',
            clerkId:this.moveDepartId,
            departId:this.moveSelectDepartId
          })).then(res=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode == 0){
              // this.getDepart();
              this.tableData2.splice(this.moveDepartIndex,1);
              this.totalCount2--;
              this.$message({
                type:'success',
                message:'转移成功'
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
      importDepartExcel(){  // 部门成员 excel导出
        this.axios.post('/api-admin/power-depart-excel',qs.stringify({
          requestProject:'gic-web',
          departId:this.departId,
          searchParams:this.searchName2,
          showChildren:this.showChildren2,
          inviteStatus:this.allState2,
          departmentName:this.departmentName
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode){   // 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
            this.$message({
              type: 'error',
              message: data.message
            });
          }else{
            window.location.href = excelConfig.config + '/api-admin/power-depart-excel?requestProject=gic-web&departId='+this.departId+'&searchParams='+this.searchName2+'&showChildren='+this.showChildren2+'&inviteStatus='+this.allState2+'&departmentName='+this.departmentName;
          }
        })
      },
      editClerkInfo(row,type){ // 编辑成员
        // console.log(row);
        if(type=='0'){
          this.$router.push({
            path:'/clerk_list_add',
            query:{
              clerkId:row.clerkId, // 店员id
              storeId:row.storeId, // 门店id
              clerkType:row.clerkType,  // 类型
              type:type,    // 0门店成员 2部门人员
            }
          })
        }else if(type=='2'){
          this.$router.push({
            path:'/clerk_list_add',
            query:{
              clerkId:row.clerkId,
              departId:row.departId,
              type:type,   // 0门店成员 2部门人员
            }
          })
        }
      },
      addClerkInfo(row,type){ // 新增成员
        console.log(row);
        if(type=='0'){  // 门店新增成员
          this.$router.push({
            path:'/clerk_list_add',
            query:{
              storeId:row.storeId,
              storeName:row.storeName,
              type:type,    // 0门店成员 2部门人员
            }
          })
          // this.$router.push({
          //   path:'/clerk_list_add',
          //   query:{
          //     groupId:this.storeGroupId,
          //     storeId:row.storeId,
          //     storeName:row.storeName,
          //     type:type,    // 0门店成员 2部门人员
          //     search:this.searchName
          //   }
          // })
        }else if(type=='2'){  // 部门新增成员
          this.$router.push({
            path:'/clerk_list_add',
            query:{
              departId:this.departId,
              type:type,    // 0门店成员 2部门人员
            }
          })
        }
      },
    },
    beforeRouteLeave (to, from, next) { // 路由离开之前存储数据
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      // console.log(to,from,next)
      var d = to;
      if(d.path == '/clerk_list_add'){
        if(this.activeitem==2){ // 门店成员
          var obj = {};
          obj.storeGroupId = this.storeGroupId;  // 部门id
          obj.searchNameStore = this.searchNameStore; // 搜索值
          obj.searchNameClerk = this.searchNameClerk; // 搜索值
          obj.allState = this.allState; // 全部状态
          obj.allStyle = this.allStyle; // 上线 停业
          obj.showChildren = this.showChildren;  // 是否显示子分组门店
          obj.currentPage = this.currentPage;    //  分页
          obj.pageSize = this.pageSize;
          sessionStorage.setItem('storeObj',JSON.stringify(obj))
        }else if(this.activeitem==3){   // 企业部门
          var obj2 = {};
          obj2.departId = this.departId;  // 部门id
          obj2.searchName = this.searchName2; // 搜索值
          obj2.allState = this.allState2; // 全部状态
          obj2.showChildren = this.showChildren2;  // 是否显示子分组门店
          obj2.currentPage = this.currentPage2;   //  分页
          obj2.pageSize = this.pageSize2;
          sessionStorage.setItem('departObj',JSON.stringify(obj2))
        }
        sessionStorage.setItem('clerkType',this.activeitem)
      }else{
        sessionStorage.removeItem('clerkType');
      }
      next()
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
    min-height: 434px;
    padding: 24px 24px 0 24px;
    position: relative;
    min-height: calc(100% - 240px);
  }
  .left-wrap{
    width: 294px;
    background: #EEF1F8;
    height: 487px;
    padding: 15px 5px 15px 15px;
    box-sizing: border-box;
    overflow: auto;
    position: absolute;
    .custom-tree-node-new {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right:2px;
      position: relative;
      width: 100%;
      overflow: auto;
      /* width:87%; */
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
      line-height: 32px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .tree-opr-icon{
      /* position: absolute;
      right: 5px; */
    }
  }
  .first-line{
    margin:22px 0;
    font-size: 0;
    .search-input /deep/ {
      width: 210px;
      margin-right:8px;
    }
    .add-btn{
      margin-left: 8px;
    }
  }
  .second-line{
    background: #EBEEF5;
    padding: 8px 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 0;
  }
  .second-line .small-checkbox{
    background: #fff;
    height: 30px;
    box-sizing: border-box;
  }
  .second-line .el-checkbox.is-bordered.el-checkbox--small{
    height: 30px;
  }
  .right-list-wrap{
    width: 100%;
    padding-left: 294px;
    .right-box-content{
      background: #fff;
      .right-box{
        padding: 0 17px;
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
            width: 240px;
          }
          .add-btn{
            margin-left: 8px;
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
  .table-wrap{
    font-size: 14px;
    width: 100%;
    .table-title{
      background: #f1f3f7;
      height: 44px;
      line-height: 44px;
      color: #909399;
      width: 100%;
      text-align: left;
      padding: 0 10px ;
      box-sizing: border-box;
      position: relative;
    }
    .one-wrap{
      width: 18%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      h2{
        font-size: 14px;
        color: #606266;
        font-weight: normal;
      }
      h3{
        font-size: 14px;
        color: #1890ff;
        padding-top: 8px;
        cursor: pointer;
      }
    }
    .two-wrap{
      width: 100%;
      padding-left: 18%;
      box-sizing: border-box;
      .list{
        float: left;
      }
      .list:first-child{
        width: 15%;
      }
      .list:nth-child(2){
        width: 30%;
      }
      .list:nth-child(3){
        width: 20%;
      }
      .list:nth-child(4){
        width: 15%;
      }
      .list:nth-child(5){
        width: 20%;
      }
      i{
        cursor: pointer;
      }
    }
    .table-content{
      margin-top: 0 !important;
      padding: 0 10px;
      color: #606266;
      width: 100%;
      box-sizing: border-box;
      .second-table-wrap{
        li:last-child{
          border-bottom: none;
        }
      }
      li{
        position: relative;
        border-bottom: 1px solid #ebeef5;
      }
      .list{
        height: 73px;
        line-height: 63px;
        margin-top: 12px;
      }
    }
  }
  .clerk-state{
    span{
      background: url('../../../../static/img/operate_tool.png') no-repeat;
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
      &.no-app{
        background-position: -66px -224px;
      }
      &.ok-app{
        background-position: -66px -200px;
      }
    }
  }
  .member-info-wrap{
    .img{
      width: 40px;
      height: 40px;
      margin-top:13px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    p{
      height: 22px;
      line-height: 22px;
      padding-left: 10px;
      width: 100px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .filter-tree{
    font-size: 14px;
  }
  .filter-tree.active > .el-tree-node:first-child > .el-tree-node__content:first-child > .custom-tree-node:last-child{
    color: #1890ff;
  }
  .filter-tree /deep/ .el-tree-node.is-current>.el-tree-node__content{
    color: #1890ff;
    font-weight: 700 !important;
    background: transparent;
  }
  .left-wrap /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    color: #1890ff;
  }
  .left-wrap /deep/ .el-tree-node__content:hover .tree-icon{
    display:inline-block;
  }
  .left-wrap /deep/ .el-tree{
    background: #EEF1F8
  }
  .pagination{
    text-align: right;
    padding-bottom: 34px;
    margin-bottom: 0;
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

  /* 转移部门门店  */
  .move-store-wrap{
    height: 500px;
    overflow-y: auto;
    background: #f0f2f5;
    padding: 10px;
  }

  .move-store-wrap /deep/ .el-tree{
    background: #f0f2f5;
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
  .store-group-wrap .custom-tree-node-new{
    padding-right: 0;
  }
</style>
