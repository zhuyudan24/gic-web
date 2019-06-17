<template>
  <div class="right-wrap">
    <topNav v-if="mainMenu" :navpath="mainnavpath"></topNav>
    <topNav v-if="childMenu" :navpath="childnavpath"></topNav>
    <topNav v-if="editMain" :navpath="editmain"></topNav>
    <topNav v-if="editChild" :navpath="editchild"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="add-menu-wrap">
          <div class="main-menu-wrap">
            <!-- <div class="title">{{navChild==true?'子菜单内容设置':'主菜单内容设置'}}</div> -->
            <div class="menu-content" v-loading="loading">
              <el-form :model="menuForm" :rules="rules" label-position="right" ref="menuForm" label-width="100px">
                <el-form-item label="菜单名称" prop="name" class="menu-name">
                  <div class="menu-item">
                    <div class="menu-input">
                      <el-input v-model="menuForm.name" @keyup.native="toInput(menuForm.name,$event)"></el-input>
                      <span class="menu-name-num">{{inputNum}}/{{inputLength}}</span>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="菜单内容" prop="style">
                  <el-radio-group v-model="menuForm.style">
                    <el-radio label="2">网址</el-radio>
                    <el-radio label="0">文本</el-radio>
                    <el-radio label="3">图文消息</el-radio>
                    <el-radio label="1">内部链接</el-radio>
                    <el-radio label="6">小程序链接</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="menuForm.style=='2'" label="网页地址" prop="content">
                  <div class="menu-item">
                    <el-input v-model="menuForm.url" class="menu-input"></el-input>
                    <p class="tip-text-right">订阅者点击该子菜单会跳到以下链接</p>
                  </div>
                </el-form-item>
                <el-form-item v-if="menuForm.style=='0'" label="文本内容" prop="content">
                  <div class="menu-item menu-textarea">
                    <el-input type="textarea" v-model="menuForm.content"></el-input>
                  </div>
                </el-form-item>
                <el-form-item v-if="menuForm.style=='3'" label="图文消息" prop="content">
                  <div class="menu-item">
                    <div v-show="!selectImg" class="add-img" @click="dialogVisible = true">
                      <div class="add-icon-wrap">
                        <i class="el-icon-plus add-icon"></i>
                        <p>从素材库中选择</p>
                      </div>
                    </div>
                    <div v-show="selectImg" class="select-img-data">
                      <div class="img-data">
                        <p class="img-date">{{imgDate | dateFormat('YYYY-MM-DD hh:mm:ss') }}</p>
                        <h2 class="tittle">{{imgName}}</h2>
                        <div class="img">
                          <img :src="selectImgUrl" alt="">
                        </div>
                        <p class="tittle">{{imgContent}}</p>
                      </div>
                      <el-button @click="deleteImgText" type="text">删除</el-button>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item v-show="menuForm.style=='1'" label="内部链接" prop="content">
                  <innerUrl @sendRightUrl="getRightUrl" @sendLeftUrl="getLeftUrl" @sendShopData="getShopData" :menuCode="menuCode"></innerUrl>
                </el-form-item>
                <!-- 引入链接小工具 -->
                <div v-if="menuForm.style=='6'">
                  <!-- <div class="link-tool-defined">
                    <linktoolspage :projectName="projectName" class="link-tool" ref="childlinktoolspage" :isWx="isWx"  :showType="showType" @linkSelect="linkSelect"/>
                  </div>
                  <el-form-item  label="链接地址" prop="content">
                    <p style="color:#606266">{{showXcxUrl}}</p>
                  </el-form-item> -->
                  <el-form-item  label="链接类型" prop="content" class="xcx-link-wrap">
                    <el-select @change="changePreValue" v-model="preValue" placeholder="请选择" style="margin-right: 6px;">
                      <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-if="preValue" @change="changeNextValue" v-model="nextValue" placeholder="请选择">
                      <el-option
                        v-for="item in options2"
                        :key="item.linkId"
                        :label="item.name"
                        :value="item.linkId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="saveInfo('menuForm')">保 存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 选择素材 -->
          <div class="choose-wrap">
            <el-dialog
              title="选择图文"
              :visible.sync="dialogVisible"
              width="760px">
              <div class="choose-content-wrap">
                <div class="search">
                  <el-input clearable @keydown.enter.native="searchImg" v-model="searchValue" class="input-search" placeholder="请输入标题/作者/摘要搜索" prefix-icon="el-icon-search"></el-input>
                </div>
                <div class="choose-list">
                  <el-table
                    ref="multipleTable"
                    :data="tableData4"
                    tooltip-effect="dark"
                    style="width: 100%"
                    class="card-table"
                    v-loading="loading"
                    @current-change="handleCurrentChangeTable">
                    <el-table-column label="" width="55">
                      <template slot-scope="scope">
                        <el-radio class="radio-style" v-model="menuForm.radio" :label="scope.row.imageTextId">
                          &nbsp;
                        </el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="创建时间"
                      width="180">
                      <template slot-scope="scope">{{ scope.row.itemList[0].createTime | dateFormat('YYYY-MM-DD hh:mm:ss') }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="图文"
                      width="180">
                      <template slot-scope="scope">
                        <div class="list-img">
                          <img :src="scope.row.itemList[0].qcloudImageUrl" alt="">
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      label="图文详情"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <p v-for="item in scope.row.itemList">{{item.titleName}}</p>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="pagination" v-show="totalCount>0">
                    <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      small
                      :page-size="pageSize"
                      layout="prev, pager, next"
                      :total="totalCount">
                    </el-pagination>
                  </div>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectImgBtn">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import innerUrl from 'components/innerUrl/innerUrl'
  import strLength from '../../../common/js/strlen';
  // 链接工具组件
  import Linktoolspage from 'components/linktools/linktoolspage.vue'
  import { dateFormat } from '../../../common/js/filter'
  let qs = require('qs')
  export default {
    data(){
      return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        mainnavpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '公众号配置',
            path: ''
          },
          {
            name: '自定义菜单',
            path: 'public_num_defined'
          },
          {
            name: '新增主菜单',
            path: '/'
          }
        ],
        childnavpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '公众号配置',
            path: ''
          },
          {
            name: '自定义菜单',
            path: 'public_num_defined'
          },
          {
            name: '新增子菜单',
            path: '/'
          }
        ],
        editmain: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '公众号配置',
            path: ''
          },
          {
            name: '自定义菜单',
            path: 'public_num_defined'
          },
          {
            name: '编辑主菜单',
            path: '/'
          }
        ],
        editchild: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '公众号配置',
            path: ''
          },
          {
            name: '自定义菜单',
            path: 'public_num_defined'
          },
          {
            name: '编辑子菜单',
            path: '/'
          }
        ],
        menuForm:{
          name:'',
          style:'2',    // 菜单内容
          radio:null,   // 素材
          content:'',
          url:''
        },
        rules: {    // 规则
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ]
        },

        /*素材列表*/
        tableData4: [],
        mainMenu:true,   // 显示哪个头部导航
        childMenu:false,
        editMain:false,
        editChild:false,

        menuId:'',
        parentMenuId:'',

        showHeader:false, //  是否显示表头

        /*限制字符个数*/
        inputNum: 0, // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 8, // 限制最大字数

        dialogVisible: false, // 隐藏弹框
        dialogShop: false,
        searchValue:'',
        searchShopValue: '',

        currentPage:1,    // 分页
        pageSize:3,

        // 链接小工具参数
        projectName:'gic-web',
        linkToolsVisible: false,
        isWx: true,      //默认显示 h5,如果只要小程序的,参数值设为 true
        showType:2,

        menuCode:'',      // 内链 
        nextcode:'',  // 编辑  初始选择的内部链接
        precode:'',
        xcxmenuCode:'', // 小程序 
        linkSelectData:{},

        loading:false,

        totalCount:null,    // 素材
        selectImgObj:{},
        selectImgUrl:'',
        selectImg:false,
        selectImgId:'',
        imgDate:'',
        imgName:'',
        imgContent:'',
        menuUrlPara:'', // 选择的门店id

        showXcxUrl:'/',  // 显示的小程序链接

        options1: [{
          value: 3,
          label: '导航tabber页'
        }, {
          value: 4,
          label: '二级功能页'
        }],
        options2:[],
        options2IdArr:[],
        preValue: '',
        nextValue:'',

        wechatContent:{},
      }

    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
      this.getMenuData();
      this.getImgTextData(this.currentPage,this.pageSize);  //  获取图文列表
    },
    methods:{
      getMenuData(){    // 获得菜单的数据
        var pid = this.$route.query.parent_menu_id;   // 新增
        var mid = this.$route.query.menu_id;      // 编辑
        var p = this.$route.query.p;      // 编辑
        this.loading = true;
        if(pid){         // 新增菜单
          this.menuId = '';
          this.editMain = false;
          this.editChild = false;
          if(pid==0){  // 新增主
            this.mainMenu = true;
            this.childMenu = false;
            this.parentMenuId = 0;
          }else{      // 新增子
            this.mainMenu = false;
            this.childMenu = true;
            this.parentMenuId = pid;
          }
        }
        if(mid){     // 编辑菜单
          this.mainMenu = false;
          this.childMenu = false;
          if(p){        // 编辑子菜单
            this.editMain = false;
            this.editChild = true;
          }else{
            this.editMain = true;
            this.editChild = false;
          }
          this.menuId = mid;
          this.parentMenuId = ''
        }
        this.inputLength = (this.editMain || this.mainMenu) ? 4 : 8;
        this.axios.post('/api-admin/menu-wechat-config-set',qs.stringify({
          requestProject:'gic-web',
          menu_id:this.menuId,
          parent_menu_id:this.parentMenuId
        })).then(res=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){  
            this.loading = false;
            var parent_menu_id = data.result.parent_menu_id;
            var menu_id = data.result.menu_id;

            if(menu_id==""){    // 新增
              if(parent_menu_id=='0'){    // 增 主

              } else {    // 增 子

              }
            } 
            if(parent_menu_id==''){    // 编辑
              var menuData = data.result.wechatmenudto; 
              this.menuForm.name = menuData.menu_name;  
              this.menuForm.style = menuData.menu_type.toString();
              var len = strLength.getZhLen(this.menuForm.name);  // 菜单名称的字符长度
              this.inputNum = len;

              this.nextcode=data.result.nextcode;
              this.precode=data.result.precode;
              this.menuForm.content = menuData.content; // 文本
              this.menuForm.url = menuData.menu_url;    // 网址
              var imgTextData = data.result.newsItem;   // 图文
              if(this.menuForm.style == '1'){           // 内链
                this.menuCode = data.result.menuCode;
              }else if(this.menuForm.style == '6'){     //  小程序
                this.xcxmenuCode = data.result.menuCode;
                if(data.result.menuCode!='null'){
                  var obj = eval('('+data.result.menuCode+')');
                  this.preValue = obj.pageType;
                  this.getNextList(this.preValue,obj.type);
                }
              }
              if(imgTextData){
                this.selectImg = true;
                this.selectImgUrl = imgTextData.qcloudImageUrl;   
                this.selectImgId = imgTextData.imageTextId;
                this.imgDate = imgTextData.createTime;
                this.imgName = imgTextData.titleName;
                this.imgContent = imgTextData.remark;
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
      toInput(value,e) {          // 名称输入时控制字符数量
        var that = this;
        that.menuForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.menuForm.name);
      },
      getImgTextData(page,size){    //  获取图文列表
        var self = this;
        self.loading=true;
        self.axios.post('/api-admin/load-image-text-data',qs.stringify({
          requestProject:'gic-web',
          searchName:self.searchValue,
          currentPage:page,
          pageSize:size
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            self.loading=false;
            if(data.result.result==null){
              self.tableData4=[];
              self.totalCount = 0;
            }else{
              self.totalCount=data.result.totalCount;
              self.tableData4=data.result.result;
              // console.log(data.result.result)
            }
          }else{
            self.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      handleCurrentChangeTable(val) {   // 选择素材发生变化时触发
        this.menuForm.radio = val.imageTextId;
        this.selectImgObj = val;
      },
      selectImgBtn(){   // 选择素材的确定按钮
        console.log(this.selectImgObj);
        this.dialogVisible = false;
        if(this.menuForm.radio!=null){
          this.selectImg = true;
          this.selectImgUrl = this.selectImgObj.itemList[0].qcloudImageUrl;
          this.selectImgId = this.selectImgObj.itemList[0].imageTextId;
          this.imgDate = this.selectImgObj.itemList[0].createTime;
          this.imgName = this.selectImgObj.itemList[0].titleName;
          this.imgContent = this.selectImgObj.itemList[0].remark;
        }
      },
      deleteImgText(){
        this.selectImg = false;
        this.selectImgId='';
      },
      searchImg(){  // 搜索图文
        this.currentPage = 1;
        this.getImgTextData(this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {  // 当前页
        this.currentPage = val;
        this.getImgTextData(this.currentPage,this.pageSize)
      },
      // 链接工具方法
      // linktoolspage
      linkSelect(val) {   // 选择小程序链接的返回值
        this.linkSelectData = val;
        console.log(this.linkSelectData);
        var xcxObj = {};
        xcxObj.type=val.id;
        xcxObj.title=val.name;
        xcxObj.isNew = 1;
        if(val.params!=''){
          for(var k in val.params){
            xcxObj.objId=val.params[k];
          }
        }else{
          xcxObj.objId=""
        }
        this.xcxmenuCode = JSON.stringify(xcxObj)
      },
      getLeftUrl(data){
        console.log(data);
        this.precode = data
      },
      getRightUrl(data){
        // console.log(data);
        this.nextcode = data;
      },
      getShopData(data){    // 获取选择的门店id
        this.menuUrlPara=data
      },
      // 链接类型
      changePreValue(val){
        // val==3  导航tabber页 val==4 二级功能页
        if(val){
          this.nextValue = '';
          this.getNextList(val)
        }
      },
      changeNextValue(val){
        if(val){
          let obj = {};
          obj = this.options2.find((style) => {
            return style.linkId === val;
          })
          this.wechatContent.type = obj.linkId;
          this.wechatContent.objId = '';
          this.wechatContent.title = obj.name;
          this.wechatContent.pageType = this.preValue;

          this.xcxmenuCode = JSON.stringify(this.wechatContent)
        }
      },
      // 获得链接类型的二级
      getNextList(type,nextType){
        this.axios.post('/api-plug/list-link-data', qs.stringify({
          requestProject: 'gic-web',
          linkScene:parseInt(type)
        })).then((res)=> {//成功后回调
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.options2 = data.result;
            if(nextType){ // 若存在二级
              this.options2IdArr = [];
              this.options2.forEach((ele)=>{
                this.options2IdArr.push(ele.linkId)
              })
              if(this.options2IdArr.indexOf(nextType)>-1){
                this.$nextTick(_ => {
                  this.nextValue = nextType;
                })
              }else{  // 若不存在，则重新选择小程序链接
                this.preValue = '';
              } 
            }
          } else {
            this.$message({
              type:'error',
              message:data.message
            })
          }
        })
      },
      // 保存
      saveInfo(formName) {
        var pid = this.$route.query.parent_menu_id;   // 新增
        var mid = this.$route.query.menu_id;      // 编辑
        var p = this.$route.query.p;      // 编辑
        //  console.log('1');
        this.$refs[formName].validate((valid) => {
          // console.log('2');
          if (valid) {
            if(pid){         // 新增菜单
              this.menuId = '';
              if(pid==0){  // 新增主
                this.parentMenuId = 0;
              }else{      // 新增子
                this.parentMenuId = pid;
              }
            }
            if(mid){     // 编辑菜单
              if(p){        // 编辑子菜单

              }else{

              }
              this.menuId = mid;
              this.parentMenuId = ''
            }
            var txt_content = '';
            if(this.menuForm.style == '0'){     // 文本
              if(this.menuForm.content=='' || this.menuForm.content==undefined){
                this.$message({
                  type:'error',
                  message:'请输入文本内容'
                })
                return;
              } else {
                txt_content = this.menuForm.content;
              }
            }
            if(this.menuForm.style == '6'){   // 小程序
              // this.$refs.childlinktoolspage.confirmLinkSelect();

              if(!this.xcxmenuCode){
                this.$message({
                  type:'error',
                  message:'请选择链接类型'
                })
                return;
              }
            }else{
              this.xcxmenuCode="";
            }
            var wechat_source_id = '';
            if(this.menuForm.style == '3'){   // 图文
              if(this.selectImgId=='' || this.selectImgId==undefined){
                this.$message({
                  type:'error',
                  message:'请选择图文素材'
                })
                return;
              }else{
                wechat_source_id = this.selectImgId;
              }
            }
            var menu_url = '';
            if(this.menuForm.style == '2'){  // 网址
              if(this.menuForm.url==''){
                this.$message({
                  type:'error',
                  message:'请输入网页地址'
                })
                return;
              }else{
                if(this.menuForm.url.indexOf('http://')==-1 && this.menuForm.url.indexOf('https://')==-1){
                  this.$message.error('请输入正确的网页地址');
                  return;
                }else{
                  menu_url = this.menuForm.url;
                }
              }
            }
            if(this.menuForm.style == '1'){ // 内链
              if(this.precode=='12'){       // 门店  
                this.nextcode = 'store_detail';
                // console.log(this.menuUrlPara);
                if (this.menuUrlPara=="" || this.menuUrlPara==undefined) {
                  this.$message.error('请选择门店');
                  return;
                }
              }else{
                if(this.nextcode=='' || this.nextcode==undefined){
                  this.$message({
                    type:'error',
                    message:'请选择内部链接'
                  })
                  return;
                }
                this.menuUrlPara = '';     // 选择的门店id
              }
            }
            if(this.menuForm.style != '1'){ 
              this.precode = '';
              this.nextcode = ''
            }
            var menuCode = "";
            if(this.menuForm.style=='1'){
              menuCode = this.menuCode;
            }else if(this.menuForm.style=='6'){
              menuCode = this.xcxmenuCode
            }
            this.axios.post('/api-admin/menu-wechat-config-save',qs.stringify({
              requestProject:'gic-web',
              parent_menu_id:this.parentMenuId,
              menu_id:this.menuId,
              txt_content:txt_content,
              menuCode:menuCode,
              wechat_source_id:wechat_source_id,
              menu_type:this.menuForm.style,
              menu_url:menu_url,
              menu_name:this.menuForm.name,
              precode:this.precode,
              nextcode:this.nextcode,
              menuUrlPara:this.menuUrlPara
            })).then((res)=>{
              var data = res.data;
              if(data.errorCode == 0){
                this.$message({
                  type:'success',
                  message:data.message
                })
                this.$router.push('/public_num_defined')
              }else{
                this.$message({
                  type:'error',
                  message:data.message
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },

    components: {
      Linktoolspage,
      topNav,
      innerUrl
    }
  }
</script>

<style lang="less" scoped>
  .right-box{
    padding: 24px 32px;
  }
  .main-menu-wrap{
    .title{
      font-size: 16px;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 24px;
      border-radius: 2px 2px 0 0;
      zoom: 1;
      height: 56px;
      line-height: 56px;
    }
    .menu-content{
      padding:0 8px;
      .menu-item{
        .select-shop{
          width: 220px;
        }
        .menu-input{
          width: 450px;
          position: relative;
        }
        .add-img{
          width: 178px;
          height: 178px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          text-align: center;
          &:hover{
          border-color: #1890ff
        }
        .add-icon{
          font-size: 28px;
          color: #8c939d;
          text-align: center;
        }
        p{
          color: #8c939d;
          font-size: 12px;
          line-height: 1;
        }
      }
      .add-icon-wrap{
        padding-top: 60px;
      }
    }
    .menu-textarea{
      height: 180px;
    }
    .menu-name{
      position: relative;
        .menu-name-num{
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
    }
    .save-btn{
      margin: 0 0 24px 108px
    }
  }
  .choose-wrap{
    .search{
      width: 260px;
      margin-bottom: 24px;
    }
    .choose-list{
      max-height: 404px;
        border-top: 1px solid #ebeef5;
        .list-img{
        width: 80px;
        height: 80px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .select-img-data{
    .img-data{
      width: 320px;
      height: auto;
      padding: 12px;
      padding-top: 0;
      border: 1px solid #e7e7eb;
      display: inline-block;
      box-sizing: border-box;
      margin-right: 10px;
      .img-date{
        line-height: 45px;
        height: 45px;
        border-bottom: 1px solid #e7e7eb;
      }
      .tittle{
        font-weight: normal;
        line-height: 1.6;
        padding-top: 10px;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
      }
      .img{
        width: 100%;
        height: 160px;
        margin: 5px auto;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .menu-content /deep/ .el-textarea,.menu-content /deep/ .el-textarea .el-textarea__inner {
    height: 100%;
    resize: none;
  }
.choose-list /deep/ .el-table__row{
  cursor: pointer;
}
.tip-text-right{
  display: inline-block;
  font-size: 12px;
  color: #909399;
  margin-left: 5px;
}
.link-tool{
  margin-left: 30px;
}
.link-tool-defined /deep/ .el-select{
  width: 221px
}
.xcx-link-wrap /deep/ .el-select{
  width: 220px;
}
</style>
