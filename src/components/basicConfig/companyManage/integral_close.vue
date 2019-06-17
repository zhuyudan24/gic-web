<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="contain-box"  v-loading="saveLoading">
        <div class="btn-wrap">
          <p class="text-tip">上次导入时间：<span></span></p>
          <el-upload
            class="upload-text"
            action="123"
            name="file"
            :show-file-list="false"
            :before-upload="beforeTextUpload">
            <el-button type="primary" icon="el-icon-upload">导入归属配置</el-button>
          </el-upload>
          <!-- <el-button type="primary" icon="el-icon-upload">导入归属配置</el-button> -->
          <el-button plain @click="exportExl"><i class="iconfont icon-icon_yunxiazai" style="padding-right: 5px;font-size: 15px;"></i>导出归属结构</el-button>
        </div>
        <div class="container-inner clearfix">
          <div class="integral-settlementint-content" style="margin: 0">
            <a href="javascript:void(0);" class="fold-btn fold-btn-flag" title="收起">
              <i class="icon-fold-btn"></i>
            </a>
            <!-- left start -->
            <div class="cost-subject-box">
              <div class="cost-subject">
                <div class="cost-subject-title">
                  <p>成本主体</p>
                </div>
                <div  class="cost-subject-content">
                  <div class="inline-block gic-input-search-box">
                    <i class="gic-icon gic-icon-search"></i>
                    <input type="text" class="w-280 gic-input-search lh30 empty treeNode-serach search-flag" placeholder="请输入搜索内容">
                    <i class="iconfont icon-shanchu2 gic-icon-shanchu2 treeNode-serach-del delete-flag"></i>
                  </div>
                </div>
                <div class="cost-subject-shop cost-subject-treecon">
                  <div class="tree-left-contain">
                        <div class="tree-left-wrap">
                            <ul id="leftTree" class="ztree"></ul>
                        </div>
                    </div>
                </div>
                <div class="cost-subject-shop cost-subject-treecon">
                  <div class="tree-left-contain">
                        <div class="tree-left-wrap">
                            <ul id="leftTree" class="ztree"></ul>
                            <ul id="leftTreeSearch" class="ztree" style="display:none;"></ul>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <!-- left end -->
            <!-- right start -->
            <div class="integral-belong">
              <div class="integral-belong-container">
                <div class="integral-belong-title">
                  <p>积分结算归属</p>
                </div>
                <div class="integral-belong-drag">
                  <div class="content_wrap">
                        <div class="zTreeDemoBackground">
                            <ul id="rightTree" class="ztree"></ul>
                        </div>
                    </div>
                </div>
              </div>
              <!-- 签到表格start -->
              <div class="integral-belong-content">
                <div class="integral-belong-scroll">
                  <table class="integral-belong-table">
                    <thead>
                      <tr class="right-table-title">

                      </tr>
                    </thead>
                    <tbody class="right-tbody">

                    </tbody>
                  </table>
                </div>
              </div>
              <!-- 签到表格end -->
            </div>
            <!-- right end -->
          </div>
          <div class="btn-fixed-wrap btn-fixed-two jq-btn">
            <button class="el-button el-button--primary gic-btn gic-btn-preserve tree-nodes-save">保 存</button><button class="el-button el-button--default gic-btn gic-btn-cancel tree-nodes-cancel">取 消</button>
          </div>
          <!-- <div class="integral-set-btn">
            <button class="el-button el-button--primary gic-btn gic-btn-preserve tree-nodes-save">保存</button>
            <button class="el-button el-button--default gic-btn gic-btn-cancel tree-nodes-cancel">取消</button>
          </div> -->
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- <div class="footer">
      <vue-gic-footer></vue-gic-footer>
    </div> -->
    <!-- 删除弹出框 -->
    <div class="gic-modal gic-modal-flex del-treenodes-content" style="display: none;">
      <div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-message-box__wrapper" style="z-index: 2005;"><div class="el-message-box"><div class="el-message-box__header"><div class="el-message-box__title"><!----><span>提示</span></div><button type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close deltree-cancel"></i></button></div><div class="el-message-box__content"><div class="el-message-box__status el-icon-warning"></div><div class="el-message-box__message"><p>点击确定后，此组别下的所有门店将释放回成本主体列表中，是否继续?</p></div><div class="el-message-box__input" style="display: none;"><div class="el-input"><!----><input type="text" autocomplete="off" placeholder="" class="el-input__inner"><!----><!----><!----></div><div class="el-message-box__errormsg" style="visibility: hidden;"></div></div></div>
        <div class="el-message-box__btns"><button type="button" class="el-button el-button--default el-button--small deltree-cancel"><!----><!----><span>
          取 消
        </span></button><button type="button" class="el-button el-button--default el-button--small el-button--primary deltree-confirm"><!----><!----><span>
          确 定
        </span></button></div>
        </div>
        </div>
    </div>
    <!-- 添加子分类 -->
    <div class="gic-modal gic-modal-flex operate-modal-flag add-treenodes-content" style="display: none;">
        <div class="gic-modal-m" style="min-height: auto">
            <div class="gic-modal-hd">
                <p>添加子分类</p>
                <button type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close addtree-cancel"></i></button>
            </div>
            <div class="gic-modal-bd">
                <div class="gic-input-num" style="width: 100%">
                    <div class="gic-input-relative" style="width: 100%">
                        <input type="text" class="w-330 gic-input addtree-input" maxlength="20" style="width: 100%"/>
                        <!-- <span class="changeNum" style="font-size: 12px;top: 15px;"><span class="num add-group">{{ inputNum }}</span>/{{ inputLength }}</span> -->
                    </div>
                </div>
                <p class="gic-error-text error-addtree">请输入添加节点名称</p>
            </div>
            <div class="gic-modal-ft gic-bar-btn">
                <button class="el-button el-button--default gic-btn gic-btn-cancel addtree-cancel">取 消</button>
                <button class="el-button el-button--primary gic-btn gic-btn-preserve addtree-confirm">确 定</button>
            </div>
        </div>
    </div>
    <!-- 选择分组归属 -->
    <div class="gic-modal gic-modal-flex operate-modal-flag move-treenodes-content" style="display: none;">
        <div class="gic-modal-m dialog-modle">
            <div class="gic-modal-hd">
                <p>选择分组归属</p>
                <button type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close movetree-cancel"></i></button>
            </div>
            <div class="gic-modal-bd tree-dialog-content">
              <div class="content_wrap-tree">
                <div class="zTreeDemoBackground">
                  <ul id="rightDialogTree" class="ztree dialogtree"></ul>
                </div>
              </div>
            </div>
            <div class="gic-modal-ft gic-bar-btn">
                <button class="el-button el-button--default gic-btn gic-btn-cancel movetree-cancel">取 消</button>
                <button class="el-button el-button--primary gic-btn gic-btn-preserve movetree-confirm">确 定</button>
            </div>
        </div>
    </div>
    <!-- 导出数据 -->
    <vue-gic-export-excel :dataArr="settingStoreGroupList" :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
    <!-- 是否关联集团 -->
    <div class="el-message-box__wrapper" v-show="contactDialog">
      <div class="el-message-box el-message-box--center">
        <div class="el-message-box__header">
          <div class="el-message-box__title"><div class="el-message-box__status el-icon-warning"></div><span>提示</span></div>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__message"><p>已关联集团，请至集团后台-积分结算模块编辑查看</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/plugins/jquery-1.11.1.min.js'
  import '@/plugins/jquery.ztree.core.js'
  import '@/plugins/jquery.ztree.excheck.js'
  import '@/plugins/jquery.ztree.exedit.js'
  import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import excelConfig from '../../../common/js/excel_config.js'
  import qs from'qs'
  export default {
    name: "integral_close",
    inject:['reload'],  	// 注入依赖
    data(){
    	return {
        projectName:'gic-web',
        navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '积分结算',
            path: ''
          },
          {
            name: '积分结算归属',
            path: ''
          }
        ],
        repProjectName: 'gic-web', // 项目名
        saveLoading: false, //加载
        baseUrl: '',
        dialogVisible1:false,
        inputNum:0,
        inputLength:16,
        lastImportDate:'', //结算归属导入最新时间
        // 导出数据
        dialogVisible:false,
        excelUrl:'/api-admin/export-settlement',
        params:{},
        settingStoreGroupList:[], // 是否有数据
        contactDialog:false,
    	}
    },
    beforeMount() {
      var that = this
      var host = window.location.origin;
      //console.log("当前host:",host)
      if (host.indexOf('localhost') != '-1') {
        that.baseUrl = 'http://gicdev.demogic.com';
      }else {
        that.baseUrl = host
      }
    },
    watch: {

    },
    // mounted(){
    //   this.getGroupData();  // 获得左侧的分组 以及分组下的门店
    // },
    methods: {
      // 是否关联集团
      getContact(){   
        this.axios.post('/api-auth/is-relevance-clique',qs.stringify({
          requestProject:this.repProjectName
        })).then((res) => {
          let resData = res.data
          if (resData.errorCode == 0) {
            this.contactDialog = resData.result;
          }else{
            this.$message.error(resData.message)
          }
        })
      },
      // 导出
      exportExl() {
        this.dialogVisible = true;
        this.params = {
          requestProject:this.projectName,
        };
	    	// this.axios.post('/api-admin/export-settlement',qs.stringify({
	    	// 	requestProject:'gic-web'
	    	// })).then(res=>{
	    	// 	var data = res.data;
	    	// 	if(data.errorCode){		// 如果报错，会有返回信息，如果成功，直接下载文件，没有返回信息
	      //   	this.$message({
	      //       type: 'error',
	      //       message: data.message
	      //     });
	      //   }else{
	      //   	window.location.href = excelConfig.config + '/api-admin/export-settlement?requestProject=gic-web';
	      //   }
	      // })
      },
      // 导入 之前的判断
      beforeTextUpload(file){
        // console.log(file);
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        if (!extension && !extension2) {
          this.$message.error('只能上传xls、xlsx格式!');
					return;
        }
        let fd = new FormData();
        fd.append('file', file);
        fd.append('requestProject', 'gic-web');
        this.axios.post('/api-admin/import-settlement', fd).then((res)=> {//成功后回调
        	var data = res.data;
        	if(data.errorCode==0){
            this.reload();    //  保存成功之后，调用依赖，从而刷新本页面
		      	this.$message({
		      		type:'success',
		      		message:'上传成功'
		      	})
		      }else{
		      	this.$message({
		      		type:'error',
		      		message:data.message
		      	})
		      }
        });
        return extension || extension2 || true
      },
      toInput(e) {  // 名称输入时控制字符数量
        var that = this;
        var val = $('.addtree-input').val();
        //console.log(val);
        val = strLength.getByteVal(e.target.value,16);
        that.inputNum = strLength.getZhLen(val);
      },
      // 提示信息
      showMsg(msg,num) {
        var that = this

        if (!!num) {
          that.$message({
            showClose: true,
            message: msg,
            type: 'error'
          });
          return;
        }
        that.$message({
          showClose: true,
          message: msg,
          type: 'success'
        });
      },
    },
    mounted() {
      var that = this;
      that.getContact();
      // 成本主体收起与展开
      $(".fold-btn-flag").on("click",function(){
        if($(this).hasClass("fold-active")){// 折叠状态
          $(this).removeClass("fold-active")
          $(this).css("left","284px")
          $(".cost-subject-box").css("display","block")
          $(".integral-belong").css({"marginLeft":"315px","transition":"0.3s"})
        }else{// 未折叠状态
          $(this).addClass("fold-active")
          $(this).css({"left":"0px","transition":"0.3s"})
          $(".cost-subject-box").css("display","none")
          $(".integral-belong").css({"marginLeft":"0","transition":"0.3s"})
        }
      })

      // this.getGroupData();
        // 拒绝修改的类型
      var denyModiyIntegralCodeArr=[];
      var leftzNodes=[] ;
      var rightzNodes = [];
      var tableTilte = [] ;
      var detail = {}; // 总数据
      var detailMap ;

      function initLeftData(leftzNodes , rightzNodes , tableTilte , detailArr){
        that.axios.post(that.baseUrl+'/api-admin/load-integral-settlement-data?loadDataType=1',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var retData = res.data; //that.responseData; //res.data;
          //console.log(retData);
          if(retData.errorCode==0){
              var lastImportDate = retData.result.lastImportDate;
              $('.text-tip').find('span').html(lastImportDate);
              //门店分组
              var storeGroupList = retData.result.storeGroupList ;
              for(var i=0;i<storeGroupList.length;i++) {
                var item = storeGroupList[i] ;
                leftzNodes.push({
                  id: item.storeGroupId, pId: item.parentGroupId, name: item.storeGroupName, level:item.groupLevel
                })
              }
              //门店
              var storeList = retData.result.storeList ;
              if(storeList) {
                for(var i=0;i<storeList.length;i++) {
                  var item = storeList[i] ;
                  leftzNodes.push({
                      id: item.storeId, pId: item.storeGroupId, name: item.storeName, flag:'store' ,storeCode:item.storeCode
                    })
                }
              }
              //设置的分组
              var settingStoreGroupList = retData.result.settingStoreGroupList ;
              that.settingStoreGroupList = retData.result.settingStoreGroupList?retData.result.settingStoreGroupList:[];
              for(var i=0;i<settingStoreGroupList.length;i++) {
                var item = settingStoreGroupList[i] ;
                rightzNodes.push({
                  id: item.integralSettlementGroupId, pId: item.parentGroupId, name: item.groupName, level:item.groupLevel
                })
              }
              //设置的门店
              var settingStoreList = retData.result.settingStoreList ;
              if(settingStoreList) {
                for(var i=0;i<settingStoreList.length;i++) {
                  var item = settingStoreList[i] ;
                  rightzNodes.push({
                      id: item.storeId, pId: item.groupId, name: item.storeName, flag:'store'
                    })
                }
              }
              //标题
              var titleList = retData.result.titleList ;
              for(var i=0;i<titleList.length;i++) {
                var item = titleList[i] ;
                tableTilte.push({
                  id: item.integralTypeCode, name: item.integralTypeName
                })
              }
              //详细数据
              detailArr.detailMap = retData.result.detailList ;

              if(retData.result.denyCodeList) {
                for(var i=0;i<retData.result.denyCodeList.length;i++) {
                  var item = retData.result.denyCodeList[i] ;
                  denyModiyIntegralCodeArr.push(item) ;
                }
              }
            }
        //    console.log(new Date().format("hh:mm:ss"))

            detailMap = detail.detailMap || [] ;

            treeDateInit(leftzNodes,rightzNodes);


        })
      }

      initLeftData(leftzNodes,rightzNodes,tableTilte,detail) ;
      // var detailMap = detail.detailMap || [] ;
      // console.log(leftzNodes,detailMap)

      // 右侧添加新节点
      var newCount = 1;
      var addtreeNode; // 添加的当前节点对象
      var deltreeNode; // 删除的当前节点对象
      var deldeltreeNode_arr; // 删除的当前节点对象的转换成的数组
      var newZree = []; // 添加或删除后获取的新的所有节点数据集合
      var dragtreeNode; // 拖拽的节点

      var newNode;

      var dellefttreeNode; // 需要删除的左侧数据
      var seltreenode; // 弹窗选择的节点

      function treeDateInit(leftzNodes,rightzNodes){
        var leftsetting = {
              view: {
                  addHoverDom: addleftHoverDom,
                  removeHoverDom: removeleftHoverDom,
                  selectedMulti: false,
                  showIcon: false,
                  showLine: false,
                  dblClickExpand: false,
                  fontCss: getFontCss,
              },
              check: {
                  enable: true
              },
              data: {

                  simpleData: {
                      enable: true
                  },
              },
              edit: {
                  enable: false
              },
              callback: {
                  onNodeCreated: zTreeOnNodeCreated, // 节点创建
                  onCheck: zTreeOnCheck, // 节点选择
                  onCollapse: zTreeOnCollapse, // 折叠节点
                  onClick: onClick, // 单击
                  beforeRemove: beforeleftRemove, // 删除
                  onRemove: onleftRemove,
              }
          };
        var rightsetting = {
              view: {
                  addHoverDom: addHoverDom,
                  removeHoverDom: removeHoverDom,
                  selectedMulti: false,
                  showIcon: false,
                  dblClickExpand: false
              },
              check: {
                  enable: false
              },
              data: {
                  simpleData: {
                      enable: true
                  }
              },
              edit: {
                  enable: true
                  // showRemoveBtn: false // 不显示删除按钮
              },
              callback: {
                  beforeDrag: beforeDrag, // 拖拽
                  onDrag: onDrag,
                  beforeDrop: zTreeBeforeDrop,
                  onDrop: onDrop,
                  beforeRemove: beforeRemove, // 删除
                  onRemove: onRemove,
                  onNodeCreated: zTreeOnNodeCreated, // 节点创建
                  // onCheck: zTreeOnCheck, // 节点选择
                  onCollapse: zTreeOnCollapse, // 折叠节点
                  beforeCollapse: zTreeBeforeCollapse, // 折叠之前
              }
          };
          // 弹窗节点设置
          var rightdialogsetting = {
              view: {
                  selectedMulti: false,
                  showIcon: false,
                  dblClickExpand: false,
                  showLine: false,
              },
              data: {
                  simpleData: {
                      enable: true
                  }
              },
              callback: {
                  // onCheck: zTreeOnCheck, // 节点选择
                  onCollapse: zTreeOnCollapse, // 折叠节点
                  beforeCollapse: zTreeBeforeCollapse, // 折叠之前
                  onClick: onSelClick
              }
          };

          var nodeList = [];
          var nodeList2 = [];
          var inputKey = $("input.treeNode-serach");

          var log, className = "dark";
          // 筛选左侧未选择
          var originData = leftzNodes;
          var filterData = [];
          // 从左侧分组找出已选门店
          var selectFilter = [];
          rightzNodes.forEach(function(ele,key){
            if(!!ele.flag){
              selectFilter.push(ele.id)
            }
          })
          leftzNodes.forEach(function(ele,index){
            if (selectFilter.indexOf(ele.id) < 0) {
              filterData.push(ele)
            }
          })
          var leftzNodes = filterData;

          var rightzNodes = rightzNodes;

          // 筛选弹层
          var dialogData = [];
          rightzNodes.forEach(function(ele,index){
            if (!ele.flag) {
              dialogData.push(ele);
            }
          })

          // 保存初始化节点数据
          var initTreeData = {
            left: [], // 左侧数据
            right: [], // 右侧数据
            table: [], // table 列表数据
            dialog: [] // 弹层数据
          };

          // 重新渲染时候用的所有节点,每次转移和右侧返回都要变化
          var reinitTreeData = [];
          // 列表标题
          // $(document).ready(function() {
            // 右侧初始化
            $.fn.zTree.init($("#rightTree"), rightsetting, rightzNodes);
            var righttreeObj = $.fn.zTree.getZTreeObj("rightTree");
            var rnodes = righttreeObj.getNodes();
            initTreeData.right = righttreeObj.transformToArray(rnodes); // 获取所有节点数据,返回
                                      // [{},{},...]

            righttreeObj.expandAll(true); // 展开 全部节点
            var nodes = righttreeObj.getSelectedNodes();
            if (nodes.length > 0) {
                righttreeObj.expandNode(nodes[0], true, true, true);
            }
            $('.level1 line').show();

              // 最右侧添加数据
            var rightSelect = {
              nodes:[],
              newZree: []
            }
            rightSelect.nodes = righttreeObj.getNodes();
            rightSelect.newZree = righttreeObj.transformToArray(rightSelect.nodes);
              initTreeData.table = rightSelect.newZree;
            initTreeData.table.forEach(function(ele,index) {
              ele.row = [];
              var _storeId = ele.id ;
              if(detailMap[_storeId]) {
                ele.row = detailMap[_storeId] ;
              }
            });
            showNewTableData(rightSelect.newZree);
            // 左侧初始化
            $.fn.zTree.init($("#leftTree"), leftsetting, leftzNodes);
            var treeObj = $.fn.zTree.getZTreeObj("leftTree");
            // console.log(treeObj)
            var lnodes = treeObj.getNodes();
            initTreeData.left = treeObj.transformToArray(lnodes); // 获取所有节点数据,返回
            treeObj.expandAll(true); // 展开 全部节点

            // leftTreeSearch 左侧初始化
            $.fn.zTree.init($("#leftTreeSearch"), leftsetting, leftzNodes);
            var treeObjSearch = $.fn.zTree.getZTreeObj("leftTreeSearch");
            var lnodesSearch = treeObjSearch.getNodes();
            treeObjSearch.expandAll(true); // 展开 全部节点
            reinitTreeData = treeObjSearch.transformToArray(lnodesSearch);
            //console.log("reinitTreeData:",reinitTreeData)

            // 弹层初始化
            // console.log("弹层初始化>>>>>>>>>>>>>",dialogData)
            $.fn.zTree.init($("#rightDialogTree"), rightdialogsetting, dialogData);
            var rightdialog = $.fn.zTree.getZTreeObj("rightDialogTree");
            var dianodes = rightdialog.getNodes();
            initTreeData.dialog = rightdialog.transformToArray(dianodes); // 获取所有节点数据,返回
            rightdialog.expandAll(true); // 展开 全部节点
            // console.log(" 弹层初始化:",initTreeData.dialog);
            //
            // 列表头部
            initTableTitle(tableTilte);
            // console.log("标题>>>>>>>>>>>>>",tableTilte)
            function initTableTitle(data) {
              data.forEach(function(ele,index){
                // console.log("标题>>>>>>>>>>>>>",ele)
                var td = '<th data-titId ="'+ele.id+'">'+ele.name+'</th>'
                $('.right-table-title').append(td);
              })
            }
          // });
          // 遍历最右侧表格数据
          function showNewTableData(newtree) {
            $(".right-tbody").empty();
            var _html = "";
            newtree.forEach(function(ele,index){
              // console.log(ele.id)
              if (ele.id == 0) {
                _html += '<tr class="registed">';
                tableTilte.forEach(function(v,key) {
                  var _storeId = ele.id ;
                        var _codeId = v.id ;
                  _html += ('<td class="no-edit-flag" data-store-type="1" data-title="'+v.name+'" data-id="'+_storeId+"_"+_codeId+'" data-index="'+key+'" data-trindex="'+index+'"  data-store-id="'+_storeId+'" data-code-id="'+_codeId+'" data-value="1"><div class="icon-register-select"></div></td>') ;
                })
                _html += "</tr>" ;
            }else {
                      _html += '<tr data-tr="'+index+'" class="registed registe-flag">';
                      tableTilte.forEach(function(v,key) {
                        // console.log(ele.row)
                        var selClass = "no";
                        var _storeId = ele.id ;
                        var _codeId = v.id +"";
                        var relationType = 1 ;
                        if(!ele.row) {
                          ele.row = {};
                        }
                        var _v = ele.row[_codeId] ;
                        var _allotStatus = 0 ;
                        // console.log(_v)
                        if(_v && _v.allotStatus==1) {
                           selClass = "select" ;
                           _allotStatus = 1 ;
                        }else {
                        }
                        if(ele.flag=="store") {
                        relationType = 2 ;
                      }
                      if(ele.id=="9999") {
                        relationType=2 ;
                      }
                  _html += ('<td data-store-type="'+relationType+'" data-title="'+v.name+'" data-id="'+_storeId+"_"+_codeId+'" data-index="'+key+'" data-trindex="'+index+'"  data-store-id="'+_storeId+'" data-code-id="'+_codeId+'" data-value="'+_allotStatus+'"><div class="icon-register-'+selClass+'"></div></td>') ;
                })
                      _html += "</tr>" ;
            }
            })
            $(".right-tbody").append(_html);
          }


          $(".right-tbody").on("click","td:not(.no-edit-flag)",function(){
             var td_id = $(this).attr("data-id");
             var storeId =  td_id.split("_")[0] ;
             var integralCode = td_id.split("_")[1] ;
               var indexFlag = $.inArray(integralCode,denyModiyIntegralCodeArr) ;
               if(indexFlag != -1) {
                that.showMsg("已指定结算主体",4) ;
                return ;
               }
               var td_index = $(this).attr("data-index");
               var tr_index = $(this).attr("data-trindex");
               // debugger ;
               console.log("当前id,index:",td_id,td_index,tr_index,initTreeData.table);
            if($(this).children("div").hasClass("icon-register-no")){
              $(this).attr("data-value",1) ;

               var _zTree = $.fn.zTree.getZTreeObj("rightTree");
                   var _nodes = _zTree.getNodeByParam("id",storeId,null);
                   var _newZtree = _zTree.transformToArray(_nodes)[0]; // 获取所有节点数据,返回
                 if(_newZtree.row[integralCode]) {
                   _newZtree.row[integralCode].allotStatus = 1 ;
                 } else {
                   _newZtree.row[integralCode] = {} ;
                   _newZtree.row[integralCode].allotStatus = 1 ;
                 }

              $(this).children("div").addClass("icon-register-select").removeClass("icon-register-no")
            }else{
              $(this).attr("data-value",0) ;

               var _zTree = $.fn.zTree.getZTreeObj("rightTree");
                   var _nodes = _zTree.getNodeByParam("id",storeId,null);
                   var _newZtree = _zTree.transformToArray(_nodes); // 获取所有节点数据,返回
                 if(_newZtree.row) {
                   _newZtree.row[integralCode].allotStatus = 0 ;
                 }

              $(this).children("div").addClass("icon-register-no").removeClass("icon-register-select")
            }
               console.log("修改的table数据：",initTreeData.table)
          }) ;


          // 左侧节点选择 check
          function zTreeOnCheck(event, treeId, treeNode) {
              console.log("选择或不选择");
              var zTree = $.fn.zTree.getZTreeObj("leftTree");
              var nodes = zTree.getCheckedNodes(true);// 获取所有选中节点
              // console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked,nodes);
          };

          // 折叠节点
          function zTreeOnCollapse(event, treeId, treeNode) {
              // alert(treeNode.tId + ", " + treeNode.name);
              return false;
          };



          function addHoverDom(treeId, treeNode) {
              // 判断根节点,不显示删除
              if (!treeNode.pId) {
                $("#" + treeNode.tId + "_a").find('.remove').hide();
              }
              // 判断门店,不显示添加
              if (!!treeNode.flag) {
                return false;
              }
              // 层级判断
              if(treeNode.level >= 5) {
                  return false;
              }
              var sObj = $("#" + treeNode.tId + "_span");// 在a之后加入添加按钮
              if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
              var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                  "' title='add node' onfocus='this.blur();'></span>";// 添加添加按钮
              sObj.after(addStr);
              var btn = $("#addBtn_" + treeNode.tId);
              if (btn)
                  btn.bind("click", function() {
                      var zTree = $.fn.zTree.getZTreeObj("rightTree");
                      addtreeNode = treeNode;
                      // 添加节点判断层级
                      console.log("add", rightzNodes, '当前id:'+treeNode.id, treeNode.level);
                      if (!!treeNode.flag) {
                        console.log("这是门店!");
                        return false;
                      }
                      if (treeNode.level >= 5) {
                          console.log("层级超过5了!!!!!");
                          return false;
                      }
                      $(".add-treenodes-content").show(); // 添加节点输入框
                      $('.addtree-input').val(''); // 清空添加节点输入框
                      $(".add-group.num").html(0); // 重置长度
                      $('.error-addtree').hide(); // 输入框错误提示
                      // lenCounter.init(); // 计算输入字符长度方法调用
                      return false;
                  });
          };
          // 添加输入框绑定
          $(".addtree-input").bind("input",function() {
            // $(".add-group.num").html(lengthOfString($('.addtree-input').val(),
          // 1))
          })
          // 添加每行默认数据
          /*
         * function addrow(tablerow,newZree) { var add = [];
         * tablerow.forEach(function(ele,index){ add.push({id: ele.id,value: 0}); //
         * 根据标题个数添加每行数据 }) return add; }
         */
          // 右侧确认添加
          $('.addtree-confirm').bind('click',function() {
              var name = $('.addtree-input').val();
              // 添加节点方法
              if(name.trim()){
                  var zTree = $.fn.zTree.getZTreeObj("rightTree");
                  // var addRow = addrow(tableTilte,newZree);
                  var callBackData ;
                  callBackData = addGroup(name,addtreeNode.id,callBackData) ;
                  // console.log("callBackData>>>>>>",callBackData)
                  if(!callBackData) {
                    that.showMsg("保存失败",4) ;
                    return ;
                  }

                  var addobj_node =  { id: callBackData.integralSettlementGroupId, pId: callBackData.parentGroupId, name: name , level: callBackData.groupLevel};
                  zTree.addNodes(addtreeNode, addobj_node);
                  newCount++;

            // 更新弹出框节点
                  var dialogtree = $.fn.zTree.getZTreeObj("rightDialogTree");
              // zTree.getNodeByTId(seltreenode.tId) 通过获取的tID 找到右侧对应的节点,相当于父节点
              newNode = dialogtree.addNodes(dialogtree.getNodeByParam("id", addtreeNode.id, null), addobj_node);

            // 更新 table 数据
                  var nodes = zTree.getNodes();
                  newZree = zTree.transformToArray(nodes); // 获取所有节点数据,返回
                                  // [{},{},...]
                  showNewTableData(newZree);
                  $(".add-treenodes-content").hide();
                  $('.error-addtree').hide();
                  $(".add-group.num").html(0);
              }else {
                  $('.error-addtree').show();
              }
          })
          // 右侧添加 node 弹出层取消按钮
          $('.addtree-cancel').bind('click',function() {
              $(".add-treenodes-content").hide();
          })

          // 节点创建的时候
          function zTreeOnNodeCreated(event, treeId, treeNode) {
              // console.log("初始化创建dom:",treeNode.tId + ", " + treeNode.name);
          }
          // 右侧节点拖拽之前
          function beforeDrag(treeId, treeNodes) {
              console.log("beforeDrag",treeNodes[0])
          }
          function onDrag(event, treeId, treeNodes) {
              console.log("onDrag",treeNodes)
              className = (className === "dark" ? "" : "dark");
              dragtreeNode = treeNodes; // 拖动的节点
              // console.log(treeNodes,treeNodes.tId);
          }
          function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) { // 不能移动根节点
            return !(targetNode == null || (moveType != "inner" && !targetNode.parentTId) || !!targetNode.flag);
        };
          function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {

              console.log("onDrop",targetNode)
              var moveFlag = true ;
              // 门店
              if(treeNodes[0].flag=="store") {
                moveFlag=groupOrStoreMove(treeNodes[0].id,targetNode.id,"store");
              }else {
                // 分组
                moveFlag=groupOrStoreMove(treeNodes[0].id,targetNode.id,"group");
              }
              if(!moveFlag) {
                return ;
              }
              className = (className === "dark" ? "" : "dark");

              var zTree = $.fn.zTree.getZTreeObj("rightTree");
              var nodes = zTree.getNodes();
              newZree = zTree.transformToArray(nodes); // 获取所有节点数据,返回 [{},{},...]

              showNewTableData(newZree); // 更新 table 数据

              // 更新弹出框
              var dragdialogtree = $.fn.zTree.getZTreeObj("rightDialogTree");
              // console.log(treeNodes);
              dragdialogtree.moveNode(dragdialogtree.getNodeByParam("id",targetNode.id,null), dragdialogtree.getNodeByParam("id", dragtreeNode[0].id, null), "inner");
          }

          function removeHoverDom(treeId, treeNode) {
              // console.log("removeHoverDom",$("#addBtn_"+treeNode.tId),treeNode)
              // $("#addTip_" + treeNode.tId).unbind().remove();
              $("#addBtn_" + treeNode.tId).unbind().remove();

          };

          // 删除之前
          function beforeRemove(treeId, treeNode) {
              console.log("beforeRemove");
              className = (className === "dark" ? "" : "dark");
              var zTree = $.fn.zTree.getZTreeObj("rightTree");
              console.log("转换被删除的节点:",zTree.transformToArray(treeNode));
              deldeltreeNode_arr = zTree.transformToArray(treeNode)
              deltreeNode = treeNode;

              // 判断是不是在搜索状态
              if (!checkInput()) {
                  console.log("请关闭搜索后操作")
                  that.showMsg("请清空搜索内容后操作",4) ;
                  return false;
              }

              if (!!treeNode.pId) {
                $(".del-treenodes-content").show();
              }else {
                that.showMsg("不能删除根节点");
              }


              $(".tree-nodeName").html(treeNode.name);

              // 判断是否是分组,分组显示,门店不显示
              if(!treeNode.flag){
                $(".tree-nodeName-show").show();
              }else {
                $(".tree-nodeName-show").hide();
              }

              return false;
              // return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
          }
          function onRemove(e, treeId, treeNode) {
              console.log("del")
          }

          // 右侧确认删除
          $(".deltree-confirm").bind("click",function() {
              console.log("确认删除");
              var zTree = $.fn.zTree.getZTreeObj("rightTree");
              var delFlag = true ;
              if(deltreeNode.flag=='store') {
                // 门店删除
                delFlag = deleteGroupStore(deltreeNode.id) ;
              }else {
                // 分组删除
                delFlag = deleteGroup(deltreeNode.id) ;
              }
              if(!delFlag) {
                return ;
              }
              zTree.removeNode(deltreeNode);

              // 更新 dialog 节点
              var deldialogtree = $.fn.zTree.getZTreeObj("rightDialogTree"); // 更新弹出框节点
              deldialogtree.removeNode(deldialogtree.getNodeByParam("id", deltreeNode.id, null));

              // 更新 table 数据
              var nodes = zTree.getNodes();
              newZree = zTree.transformToArray(nodes); // 获取所有节点数据,返回 [{},{},...]
              showNewTableData(newZree);

              // 更新左侧节点,把删除节点返回左侧
              var leftdelzTree = $.fn.zTree.getZTreeObj("leftTree");
              console.log("左侧初始数据",initTreeData.left);
              console.log("删除的数据",deltreeNode);

              // 更新左侧搜索节点,把删除节点返回左侧
              var leftdelzTreeSearch = $.fn.zTree.getZTreeObj("leftTreeSearch");
              var delSearchData = '';
              console.log("添加前data:",reinitTreeData)

              var pid = "";
              deldeltreeNode_arr.forEach(function(ele,index){
                if (!!ele.flag) { // 如果删除的节点是门店,才可以重新回到左侧
                  initTreeData.left.forEach(function(el,key){ // 从原数据中找出当前门店 id
                                    // 对应的父id
                    if (el.id == ele.id) {
                      console.log(el.id);
                      pid = el.pId;
                      return false;
                    }
                  })
                      if (!!leftdelzTree.getNodeByParam("id", pid, null)) { // 如果可以找到，直接回原分组下
                          leftdelzTree.addNodes(leftdelzTree.getNodeByParam("id", pid, null),ele);
                          leftdelzTreeSearch.addNodes(leftdelzTreeSearch.getNodeByParam("id", pid, null),ele);
                      }else {
                          originData.forEach(function(el,key){ // 从未筛选数据找
                              if (el.id == ele.id) {
                                  console.log(el.id);
                                  pid = el.pId;
                                  return false;
                              }
                          })
                          leftdelzTree.addNodes(leftdelzTree.getNodeByParam("id", pid, null),ele);
                          leftdelzTreeSearch.addNodes(leftdelzTreeSearch.getNodeByParam("id", pid, null),ele);
                      }

                }else { // 如果删除节点是分组
                  return false;
                }
            })

            delSearchData = leftdelzTreeSearch.getNodes();
              reinitTreeData = leftdelzTreeSearch.transformToArray(delSearchData); // 获取所有节点数据,返回
                                              // [{},{},...]

              //console.log(pid,deltreeNode.tId,leftdelzTree.getNodeByParam("id", pid, null))
              // leftdelzTree.addNodes(leftdelzTree.getNodeByParam("id", pid,
          // null),deltreeNode)
              //console.log("删除后数据:",newZree); // 所有数据
              //console.log("删除后搜索数据:",reinitTreeData)
              $(".del-treenodes-content").hide();
          })
          // 右侧取消
          $('.deltree-cancel').bind('click',function() {
              $(".del-treenodes-content").hide();
          })


          // 左侧单击回调
          function onClick(e,treeId, treeNode) {
              // var zTree = $.fn.zTree.getZTreeObj("leftTree");
              // zTree.expandNode(treeNode);
              return false;
          }

          // 折叠之前
          function zTreeBeforeCollapse(treeId, treeNode) {
              // console.log("折叠之前")
              return false;
          };

          // 左侧鼠标移入 添加到右侧按钮
          var movenodes;
          function addleftHoverDom(treeId, treeNode) {
              // console.log("到右侧的节点: 父节点是" + treeNode.id, treeNode)
              var sObj = $("#" + treeNode.tId + "_check"); // 在a之后加入添加按钮
              if (treeNode.editNameFlag || $("#torightBtn_" + treeNode.tId).length > 0) return;
              var addStr = "<span class='button move' id='torightBtn_" + treeNode.tId +
                  "' title='add node' onfocus='this.blur();'></span>"; // 添加添加按钮
              sObj.after(addStr);
              var btn = $("#torightBtn_" + treeNode.tId);
              if (btn)
                btn.bind("click", function() {
                    dellefttreeNode = treeNode;
                    // searchNode();
                    // 获取被选中的节点
                    var leftmove_zTree = $.fn.zTree.getZTreeObj("leftTree");
                    var nodes = leftmove_zTree.getCheckedNodes(true);// 获取所有选中节点
                    movenodes = checkstore(nodes); // 检查门店的节点
                    console.log("当前节点:",treeNode,"所有选中节点:",nodes,"判断是门店的节点",movenodes);
                    if (movenodes.length) {
                      $(".move-treenodes-content").show(); // 显示弹出框
                    }else {
                      /* alert("请选择转移门店"); */
                      that.showMsg("该分组下暂无门店可转移",4) ;
                    }
                  return false;
                });
          };
          // 鼠标移出 隐藏
          function removeleftHoverDom(treeId, treeNode) {
              // console.log("removeleftHoverDom",$("#torightBtn_"+treeNode.tId),treeNode)
              $("#torightBtn_" + treeNode.tId).unbind().remove();
          };

          // 弹窗选择
          function onSelClick(event, treeId, treeNode, clickFlag) {
            //console.log(treeNode,$.fn.zTree.consts,clickFlag);
            seltreenode = treeNode;
          }

          // 弹出框确认转移
          $('.movetree-confirm').bind("click",function(){
            //console.log("确认移动的:",movenodes,"选择的:",seltreenode)
            var storeIdArr = [] ;
            for(var i=0;i<movenodes.length;i++) {
              storeIdArr.push(movenodes[i].id);
            }

            addGroupStore(seltreenode.id,storeIdArr.join(","))


            // 删除左侧
            var zTreeleft = $.fn.zTree.getZTreeObj("leftTree"); // 删除左侧

            // 删除 leftsearch 数据
              var treeObjSearch = $.fn.zTree.getZTreeObj("leftTreeSearch");
              //console.log("reinitTreeData:",reinitTreeData)

            if (movenodes.length) {
              movenodes.forEach(function(ele,key) {
                zTreeleft.removeNode(ele);
                      // ele.row = addrow(tableTilte); // 列表添加默认数据

                // 删除另一个搜索时候需要 重绘的数据
                      if (treeObjSearch.getNodeByParam("id", ele.id, null)) {
                          treeObjSearch.removeNode(treeObjSearch.getNodeByParam("id", ele.id, null));
                      }
              })

              var lnodesSearch = treeObjSearch.getNodes();
                  treeObjSearch.expandAll(true); // 展开全部节点
                  reinitTreeData = treeObjSearch.transformToArray(lnodesSearch);
                  //console.log("删除后reinitTreeData:",reinitTreeData)
            }

            // 添加右侧
            var zTree = $.fn.zTree.getZTreeObj("rightTree"); // 添加右侧
            //console.log(zTree.getNodeByParam("id", seltreenode.id, null));
          newNode = zTree.addNodes(zTree.getNodeByParam("id", seltreenode.id, null), movenodes);

            // (只转移的门店所以不更新)更新弹窗
            /*
           * var dialogzTree = $.fn.zTree.getZTreeObj("rightDialogTree");
           * console.log(dellefttreeNode,zTree.transformTozTreeNodes(movenodes),movenodes)
           * newdiaNode =
           * dialogzTree.addNodes(dialogzTree.getNodeByTId(seltreenode.tId),
           * movenodes);
           */

            // zTree.getNodeByTId(seltreenode.tId) 通过获取的tID 找到右侧对应的节点,相当于父节点

            // 更新 table 数据
            var nodes = zTree.getNodes();
              newZree = zTree.transformToArray(nodes); // 获取所有节点数据,返回 [{},{},...]

              showNewTableData(newZree); // 更新 table 数据

              // 取消选中节点
              $('a').removeClass('curSelectedNode');

            $(".move-treenodes-content").hide(); // 隐藏弹出框
          })
          function checkstore(nodes) {
            // nodes : 所有被选中节点
            // var zTree = $.fn.zTree.getZTreeObj("rightTree"); //添加右侧
            // // 更新弹窗
            // var dialogzTree = $.fn.zTree.getZTreeObj("rightDialogTree");
            //console.log(nodes);
            var newarrnode = [];
            nodes.forEach(function(el,key) {
            if(!!el.flag){ // 判断只能是门店才可以转移右侧
              newarrnode.push(el);
            }
          })

            //console.log("选中:",nodes,newarrnode);
            return newarrnode;
          }
          // 取消转移
          $('.movetree-cancel').bind("click",function(){
            $(".move-treenodes-content").hide(); // 隐藏弹出框
          })

          // 删除之前
          function beforeleftRemove(treeId, treeNode) {
              //console.log("beforeleftRemove");
              className = (className === "dark" ? "" : "dark");
              // showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; "
          // + treeNode.name);

              return false;
              // return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
          }
          function onleftRemove(e, treeId, treeNode) {
              //console.log("leftdel")
              // showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " +
          // treeNode.name);
          }

          // 删除左侧后添加到右侧
          function removeleft() {
              var zTree = $.fn.zTree.getZTreeObj("leftTree");
              zTree.removeNode(dellefttreeNode);
          }

          // 判断数组中最大最小值
          function getMaximin(arr,maximin){
            if(maximin=="max") {
              return Math.max.apply(Math,arr);
            }
            else if(maximin=="min") {
              return Math.min.apply(Math, arr);
            }
          }

          // 搜索节点

          //console.log(inputKey)
          inputKey.bind("focus", focusKey)
            .bind("blur", blurKey).bind("propertychange", searchNode);
          function searchNode(e) {
              var zTreeleft = $.fn.zTree.getZTreeObj("leftTreeSearch");
              var value = inputKey.val().trim(); // 获取搜索关键字
              //console.log(value)
              if (inputKey.hasClass("empty")) {
                value = "";
              }

              if (value === ""){
                      reRenderLeft();
                return;
              }
              updateNodes(false);

              nodeList = zTreeleft.getNodesByParamFuzzy("name", value);
              nodeList2 = zTreeleft.getNodesByParamFuzzy("storeCode", value); // 只有门店有
              //console.log("搜索:",nodeList,nodeList2);
              // 左侧搜索初始化
              var newnodelist = null;
              if(nodeList.length || nodeList2.length){
                  $.fn.zTree.destroy($("#leftTree")); // 先销毁
                  newnodelist = nodeList.length == 0? nodeList2 : nodeList2.length == 0? nodeList : checkRepeat(zTreeleft,nodeList,nodeList2);
                  // 去重复节点
                  if (nodeList.length && (nodeList2.length == 0)) {
                      var n = zTreeleft.transformToArray(nodeList);
                      //console.log("##转换后:",[...new Set(n)])
                      newnodelist = [...new Set(n)];
                      newnodelist.forEach(function(ele,index){
                          if (!ele.pId) {
                             newnodelist = ele;
                          }
                      })
                  }
                  $.fn.zTree.destroy($("#leftTree")); // 先销毁
                  //console.log("newnodelist:",newnodelist);

                  $.fn.zTree.init($("#leftTree"), leftsetting, newnodelist);
                  var treeObj = $.fn.zTree.getZTreeObj("leftTree");
                  var lnodes = treeObj.getNodes();
                  var searchData = treeObj.transformToArray(lnodes); // 获取所有节点数据,返回
                                      // [{},{},...]
                  treeObj.expandAll(true); // 展开 全部节点
                  //console.log('已经搜索到:::',searchData)
              }
              // updateNodes(true);
          }

          // 判断搜索到的节点重复
          function checkRepeat(zTreeleft,nameNode,codeNode) {

              var n = zTreeleft.transformToArray(nameNode);
              var c = zTreeleft.transformToArray(codeNode);
              var conArr = [...new Set(n.concat(c))];
              var minArr = [];
              //("合并后初始数据:",[...new Set(n.concat(c))])
              var returnArr = [];
              conArr.forEach(function(ele,index){
                if(ele.children){
              returnArr.push(ele)
                }

              })
              returnArr.forEach(function(ele,index){
                minArr.push(ele.level);
              })
              returnArr.forEach(function(ele,index){
                if(ele.level == getMaximin(minArr,"min")){
                  returnArr = ele;
                }
              })
              //console.log("returnArr:",returnArr,"conArr:",conArr)
              if(Object.keys(returnArr).length){
                return returnArr;
              }else {
                return conArr;
              }

          }

          function emptyleft() {
            $('#leftTree').empty();
            $.fn.zTree.init($("#leftTree"), leftsetting, leftzNodes);
              var treeObj = $.fn.zTree.getZTreeObj("leftTree");
              treeObj.expandAll(true); // 展开 全部节点
          }

          // 监听 enter 和 backspace
          $(document).bind('keyup',function(e){

              if(e.keyCode == 13){
                  // 输入之后按住 enter 搜索
                  searchNode();
              }
              if(e.keyCode == 8){
                  //(checkInput())
                  checkInput() == true? reRenderLeft():'';
              }
          })

          // 重新渲染左侧树
          function reRenderLeft() {
              $.fn.zTree.destroy($("#leftTree")); // 先销毁
              console.log("销毁重新渲染：",reinitTreeData);
              reinitTreeData.forEach(function(ele,index){
                  if(!ele.pId){
                      reinitTreeData = [ele];
                  }
              })
              console.log("重新生成后：",reinitTreeData);
            // 这里左侧数据节点信息需要从之前保存,不再是最初的数据节点
            $.fn.zTree.init($("#leftTree"), leftsetting, reinitTreeData);
              var treeObj = $.fn.zTree.getZTreeObj("leftTree");
              treeObj.expandAll(true); // 展开 全部节点
          }

          // 检查搜索输入框是否为空
          function checkInput() {
            //console.log(inputKey)
              if (inputKey.val().trim() == '') {
                  return true;
              }else {
                  return false;
              }
          }

          // 搜索框删除内容按钮
          $(".treeNode-serach-del").click(function() {
            reRenderLeft()
          })

          function updateNodes(highlight) {
            // if (nodeList.length) {
            // $('#leftTree').empty();
            // var zTree = $.fn.zTree.init($("#leftTree"),leftsetting, nodeList);
            // }
            var zTree = $.fn.zTree.getZTreeObj("leftTree");

              for( var i=0, l=nodeList.length; i<l; i++) {
                  nodeList[i].highlight = highlight;
                  zTree.updateNode(nodeList[i]);
              }
          }

          function getFontCss(treeId, treeNode) {
          return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
        }
        function focusKey(e) {
          if (inputKey.hasClass("empty")) {
            inputKey.removeClass("empty");
             updateNodes(false);
          }
        }
        function blurKey(e) {
          if (inputKey.get(0).value === "") {
            inputKey.addClass("empty");
             updateNodes(false);
          }
        }
          // 最右侧
          // 保存
          $(".tree-nodes-save").bind("click",function() {
            //console.log("save");
            var leftJson = "";
              //console.log("table 数据",initTreeData.table);
              // 判断左侧是否还有未选门店
              var ltreeObj = $.fn.zTree.getZTreeObj("leftTree");
              var lnodes = ltreeObj.getNodes();
              var leftArrs = ltreeObj.transformToArray(lnodes); // 获取所有节点数据,返回
                                    // [{},{},...]
              var arrFlags = [];
              leftArrs.forEach(function(ele,key){
                if(!!ele.flag){
                  arrFlags.push(ele.flag);
                }
              })
              // 如果有未选门店,直接返回
              if(!!arrFlags.length){
                that.showMsg("门店未全部转移",4) ;
                return false;
              }
              doSave(initTreeData.table) ;
          })

          // 取消
          $(".tree-nodes-cancel").bind("click",function() {
            // console.log("cancel");
            window.location.reload();
          })

          //保存分组名称
          function addGroup(groupName , parentId , callBackData) {
            var data ={} ;
            data.groupName = groupName ;
            data.parentGroupId = parentId ;
            data.requestProject = that.repProjectName
            $.ajax({
              type:"post",
              data:data,
              async:false ,
              url: that.baseUrl+'/api-admin/do-save-settlement-group',
              xhrFields:{withCredentials:true},
              success:function(retData){
                if(retData.errorCode == 0) {
                  callBackData = retData.result ;
                  that.showMsg("保存成功") ;
                }else {
                  that.showMsg("保存失败",4) ;
                }
              }
            }) ;
            return callBackData ;
          }
          //删除分组
          function deleteGroup(groupId) {
            var data={};
            data.groupId = groupId ;
            data.requestProject = that.repProjectName
            var flag = false ;
            $.ajax({
              type:"post",
              data:data,
              async:false ,
              url: that.baseUrl+'/api-admin/do-delete-settlement-group',
              xhrFields:{withCredentials:true},
              success:function(retData){
                if(retData.errorCode == 0) {
                  flag = true ;
                  that.showMsg("保存成功") ;
                }else {
                  that.showMsg("保存失败",4) ;
                }
              }
            })
            return flag ;
          }
          //保存分组门店
          function addGroupStore(groupId,storeIds) {
            var data={};
            data.groupId = groupId ;
            data.storeIds = storeIds ;
            data.requestProject = that.repProjectName
            $.ajax({
              type:"post",
              data:data,
              async:false ,
              url:that.baseUrl+'/api-admin/do-save-settlement-group-store',
              xhrFields:{withCredentials:true},
              success:function(retData){
                if(retData.errorCode == 0) {
                  that.showMsg("保存成功") ;
                }else {
                  that.showMsg("保存失败",4) ;
                }
              }
            })
          }
          //删除分组门店
          function deleteGroupStore(storeIds) {
            var data={};
            data.storeIds = storeIds ;
            data.requestProject = that.repProjectName
            var flag = false ;
            $.ajax({
              type:"post",
              data:data,
              async:false ,
              url: that.baseUrl+'/api-admin/do-delete-settlement-group-store',
              xhrFields:{withCredentials:true},
              success:function(retData){
                if(retData.errorCode == 0) {
                  flag = true ;
                  that.showMsg("保存成功") ;
                }else {
                  that.showMsg("保存失败",4) ;
                }
              }
            })
            return flag ;
          }

          //分组、门店移动
          function groupOrStoreMove(moveId , toGroupId , moveType) {
            var data = {} ;
            data.moveType=moveType ;
            data.moveId = moveId ;
            data.toGroupId = toGroupId ;
            data.requestProject = that.repProjectName;
            var flag = false ;
            $.ajax({
              type:"post",
              data:data,
              async:false ,
              url: that.baseUrl+'/api-admin/move-settlement-group-store',
              xhrFields:{withCredentials:true},
              success:function(retData){
                if(retData.errorCode == 0) {
                  flag = true ;
                  that.showMsg("保存成功") ;
                }else {
                  that.showMsg("保存失败",4) ;
                }
              }
            })
            return flag ;
          }
          //保存数据
          function doSave(detailDataJson){
            var flag = false ;
            //先删除
            $.ajax({
              type:'post',
              async :false ,
              data:{requestProject: that.repProjectName},
              xhrFields:{withCredentials:true},
              url: that.baseUrl+'/api-admin/do-delete-settlement-detail',
              success:function(retData){
                if(retData.errorCode == 0) {
                  flag = true ;
                }
              }
            }) ;
            if(flag) {
            //  that.showMsg('删除成功') ;
            }
            // Tip.openLoading() ;
            that.saveLoading = true; // 加载 ing
            var jsonArr = [] ;

            $(".right-tbody td").each(function(){
              var relationId = $(this).attr("data-store-id") ;
              var relationType= $(this).attr("data-store-type") ;// 1分组 2门店
              var integralTypeName = $(this).attr("data-title") ;
              var integralTypeCode = $(this).attr("data-code-id") ;
              var allotStatus = $(this).attr("data-value")  ;
              jsonArr.push({p1:relationId ,p2:relationType ,p3:integralTypeName,p4:integralTypeCode ,p5:allotStatus})
            }) ;

            var len = 1000 ;
          //  console.log(jsonArr.length) ;
            var arr = [] ;
            for(var k=0;k<jsonArr.length;k++) {
              arr.push(jsonArr[k]) ;
              if(k!=0 && k%len==0) {
                var jsonStr =  JSON.stringify(arr);
                arr.length=0;
                $.ajax({
                  type:'post',
                  data:{jsonStr:jsonStr,requestProject: that.repProjectName},
                  url: that.baseUrl+'/api-admin/do-save-settlement-detail',
                  xhrFields:{withCredentials:true},
                  success:function(retData){
                    // Tip.closeLoading() ;
                    if(retData.errorCode == 0) {
                      //that.showMsg("保存") ;
                    }else {
                      //that.showMsg("保存失败",4) ;
                    }
                  }
                })
              }
              if(k==jsonArr.length-1 && (k==0 || k%len!=0)) {
                var jsonStr =  JSON.stringify(arr);
                arr.length=0;
                $.ajax({
                  type:'post',
                  data:{jsonStr:jsonStr,requestProject: that.repProjectName},
                  url: that.baseUrl+'/api-admin/do-save-settlement-detail',
                  xhrFields:{withCredentials:true},
                  success:function(retData){
                    // Tip.closeLoading() ;
                    that.saveLoading = false; // hide 加载 ing
                    if(retData.errorCode == 0) {
                      that.showMsg("保存成功") ;
                    }else {
                      that.showMsg("保存失败",4) ;
                    }
                  }
                })
              }
            }
          }
      }

    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
  /*@import '../../../plugins/css/integral-settlementint.css';*/
  @import '../../../plugins/css/gic-4.0.css';
  .contain-box{
    padding: 24px;
    background: #fff;
    margin-right:0;
  }
  .right-box-wrap{
    position: relative;
    .left-integral-wrap{
      position: absolute;
      width: 300px;
      background: #fff;
      .title-wrap{
        background: #f2f2f7;
        .title{
          width: 180px;
          height: 44px;
          line-height: 44px;
          font-size: 14px;
          color: #292929;
          font-weight: 600;
          padding-left: 15px;
          box-sizing: border-box;
        }
        .left-icon{
          font-size: 14px;
          height: 44px;
          line-height: 44px;
          width: 18px;
          text-align: center;
          background: #d2d6e1;
          cursor: pointer;
        }
      }
      .left-tree-wrap{
        font-size: 12px;
        .search-tree-input{
          padding: 10px;
          box-sizing: border-box;
        }
        .filter-tree{
          height: 500px;
          overflow: auto;
        }
        .right-rotate-icon{
          transform:rotate(180deg);
          display: none;
        }
        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
        }
        .tree-label{
          display: inline-block;
          max-width: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .right-integral-wrap{
      min-height: 500px;
      padding-left: 310px;
      box-sizing: border-box;
      transition: all 0.3s;
      .left-belong-wrap{
        width: 300px;
        background: #f2f2f7;
        .title{
          width: 282px;
          height: 44px;
          line-height: 44px;
          font-size: 14px;
          color: #292929;
          font-weight: 600;
          padding-left: 15px;
          box-sizing: border-box;
        }
        .left-icon{
          font-size: 14px;
          height: 44px;
          line-height: 44px;
          width: 18px;
          text-align: center;
          background: #d2d6e1;
          cursor: pointer;
          transform: rotate(180deg);
        }
      }
      .right-table-wrap{
        width: calc(100% - 300px);
        -moz-width: calc(100% - 300px);
        -webkit-width: calc(100% - 300px);
        -o-width: calc(100% - 300px);
        .table-icon{
          font-size: 16px;
          font-weight: 700;
          &.success-icon{
            color: #1890ff;
          }
          &.error-icon{
            color: #c0c4cc
          }
        }
        .integral-belong-scroll{
          min-width: 440px;
          overflow-x: auto;
          font-size: 14px;
          .integral-belong-table{
            width: 100%;
            border-left: 1px solid #e7e7eb;
            thead{
              white-space:nowrap;
              width: 100%;
              tr{
                height: 44px;
                line-height: 44px;
                background: #f2f2f7;
                th{
                  min-width: 100px;
                  color: #909399
                }
              }
            }
            tbody{
              background: #fff;
              tr{
                height: 39px;
                line-height: 39px;
                border-bottom: 1px solid #e7e7eb;
                box-sizing: border-box;
                td{
                  border-right: 1px solid #e7e7eb;
                  cursor: pointer;
                  text-align: center;
                  box-sizing: border-box;
                }
              }
            }
          }
        }
        .table-title-wrap{
          width: 100%;
        }
        .table-title{
          background: #f1f3f7;
          li{
            min-width: 100px;
            padding: 0 5px;
            text-align: center;
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            color: #909399;
            box-sizing: border-box;
          }
        }
        .table-list{
          background: #fff;
          li{
            p{
              float: left;
              min-width: 100px;
              text-align: center;
              height: 44px;
              line-height: 44px;
              font-size: 14px;
              color: #909399;
            }
          }
        }
      }
    }
    &.hide-left{
      .right-integral-wrap{
        padding-left: 0;
      }
      .left-integral-wrap{
        display: none;
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
      height: 34px;
      line-height: 34px;
      padding-left: 10px;
    }
  }
  .integral-belong-drag{
    font-size: 14px;
    .ztree {
      height: auto;
      overflow:hidden;

      width: 300px;
      margin: 0;
      padding: 0;
      color: #606266;
      padding-left: 5px;
      box-sizing: border-box;
      border: none;
      
      li{
        padding: 0;
        margin: 0;
        list-style: none;
        line-height: 17px;
        text-align: left;
        white-space: nowrap;
        outline: 0;
        ul{
          margin: 0;
          padding: 0 0 0 18px;
          &.line{
            background:url('../../../../static/img/line_conn.png') 0 0 repeat-y;
          }
        }
        .node_name{
          width: calc(100% - 30px);
          -moz-width: calc(100% - 30px);
          -webkit-width: calc(100% - 30px);
          -o-width: calc(100% - 30px);
          padding: 9px 0;
          padding-right: 3px;
          margin: 0;
          cursor: pointer;
          height: 36px;
          color: #606266;
          display: inline-block;
          box-sizing: border-box;
          .operate-icon{
            font-size: 14px;
            padding-left: 5px;
            color: #606266;
            cursor: pointer;
          }
        }
        .button{
          line-height: 0;
          margin: 0;
          padding: 0;
          width: 21px;
          height: 44px;
          display: inline-block;
          vertical-align: middle;
          border: 0 none;
          cursor: pointer;
          outline: none;
          box-sizing: border-box;
          background-color: transparent;
          background-repeat: no-repeat;
          background-attachment: scroll;
          background-image: url('../../../../static/img/metro.png');
          &.root_open {
            background-position: -107px -126px;
            padding: 20px 0 0 0;
          }
          &.bottom_docu {
            background-position: -84px -77px;
          }
          &.center_docu {
            background-position: -84px -34px;
          }
          &.center_open {
            background-position: -105px -34px;
          }
          &.bottom_open {
            background-position: -105px -77px;
          }
        }
      }
    }
  }
  .double-btn{
    padding: 24px 0;
    .el-row{
      text-align: right;
    }
  }
  .select-group-wrap{
    max-height: 280px;
    overflow: auto;
  }
  .left-integral-wrap /deep/ .el-tree-node__content:hover .right-rotate-icon{
    display:inline-block;
  }
  .right-table-wrap /deep/ .el-table thead tr,.right-table-wrap /deep/ .el-table thead th,.right-table-wrap /deep/ .el-table .cell{
    text-align: center;
  }
  .contain-box ul.ztree {
    border: none;
    background: transparent;
    overflow: hidden;
  }
  .contain-box .content_wrap, .contain-box .tree-left-contain{
    float: none;
  }
  .contain-box .zTreeDemoBackground{
    height: auto;
  }
  .integral-set-btn{
    font-size: 0;
    text-align: right;
    button{
      margin:0;
      margin-left: 10px
    }
  }
  .contain-box /deep/ .ztree li a:hover{
    color: #333;
  }
  .contain-box /deep/ .ztree li span.button.remove{
    margin: 0 0 0 5PX;
  }

  /* 样式修改 */
  .cost-subject-content .gic-input-search {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    border-radius: 4px;
  }
  /*选择分组归属*/
  .move-treenodes-content /deep/ div.zTreeDemoBackground{
    width: auto;
    height: auto;
  }
  .move-treenodes-content ul.ztree{
    border: none;
    overflow:hidden;
  }
  .move-treenodes-content /deep/ .tree-dialog-content .content_wrap-tree{
    overflow-y: auto;
    overflow-x: hidden;
  }
  .move-treenodes-content /deep/ .ztree li a:hover{
    color: #1890ff;
  }
  .move-treenodes-content /deep/ .dialogtree.ztree li a.curSelectedNode{
    color: #1890ff
  }
  .integral-belong-content .integral-belong-scroll{
    min-width: auto;
  }

  .gic-modal .gic-modal-m .gic-modal-ft{
    margin-right: 10px !important;
  }
  .gic-modal .gic-modal-m .gic-modal-ft .gic-btn{
    border-radius: 4px;
    height: 32px;
    line-height: 1;
    padding: 8px 15px;
    box-sizing: border-box;
  }
  .gic-modal .gic-modal-m .gic-modal-bd{
    padding: 24px 24px 20px;
    position: relative;
  }
  .gic-modal .tree-dialog-content,.gic-modal .gic-modal-hd{
    border: none;
    position: relative;
  }
  .gic-modal .gic-modal-hd p{
    font-size: 18px
  }
  .gic-modal .tree-dialog-content .content_wrap-tree{
    height: 100%;
  }
  .gic-modal .gic-modal-bd{
    position: relative;
  }
  .gic-modal .gic-modal-bd .error-addtree{
    position: absolute;
    margin-top: 5px;
  }
  .jq-btn button{
    padding: 8px 15px;
    height: auto;
    line-height: 1;
    font-size: 14px;
    border-radius: 3px;
  }
  .ztree li span.button.add{
    margin-top: 2px !important;
  }
  .ztree li span{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif !important;
  }
  /* 输入框样式 */
  .gic-input-relative input{
    height: 32px;
    line-height: 32px;
  }
  /* 新加导入导出样式 */
  .upload-text{
    display: inline-block;
    margin-right: 8px;
  }
  .btn-wrap{
    text-align: right;
    margin-bottom: 22px;
    font-size: 0;
    button{
      font-size:14px;
    }
    .text-tip{
      display: inline-block;
      font-size: 12px;
      color: #909399;
      margin-right: 10px;
    }
  }
  .el-message-box__wrapper{
    left: 200px;
    top: 64px;
    background: rgba(0, 0, 0, .5);
    z-index: 11;
  }
</style>
