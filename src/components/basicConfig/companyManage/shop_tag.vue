<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box-wrap clearfix">
        <div class="fl shop-tag-left">
          <div class="leftBar-wrap">
            <div class="newCreateBtn">
              <el-button @click="addTag" size="small">新建标签</el-button>
            </div>
            <ul class="leftBar-nav-list">
              <li class="clearfix" :class="{'on':currentIndex==index}" @click="getShopList(item,index)" v-for="(item,index) in tagData" :key="index">
                <p class="fl item-title">{{item.tagName}}</p>
                <p class="fr item-operate"><i @click.prevent.stop="editTag(item)" class="el-icon-edit"></i><i @click.prevent.stop="deleteTag(item.tagId,index)" class="el-icon-close"></i></p>
              </li>
            </ul>
          </div>
        </div>
        <div class="fl shop-tag-right-wrap">
          <div class="shop-tag-right">
            <div class="search">
              <el-input clearable @keydown.enter.native="searchStore" class="input-search" placeholder="请输入门店名称/代码/地区名称" prefix-icon="el-icon-search" v-model="inputValue"></el-input>
              <!-- <el-button class="search" type="primary">查询</el-button> -->
              <el-button :disabled="btnBool" @click="editTag(itemChild)" class="editBtn fr" type="primary">编辑标签</el-button>
            </div>
            <div class="search-all">
              <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                class="table-no-line-wrap"
                >
                <el-table-column
                  prop="storeName"
                  label="门店名称">
                  <template slot-scope="scope">
                    <p>{{scope.row.storeName}}</p>
                    <p>{{scope.row.storeCode}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="storeTypeName"
                  label="类型"
                  width="300">
                  <template slot-scope="scope">
                    <p v-show="scope.row.storeType==0">自营</p>
                    <p v-show="scope.row.storeType==1">联营</p>
                    <p v-show="scope.row.storeType==2">代理</p>
                    <p v-show="scope.row.storeType==3">代销</p>
                    <p v-show="scope.row.storeType==4">托管</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="storeAddress"
                  label="地区">
                  <template slot-scope="scope">
                    {{scope.row.fullArea==null?'--':scope.row.fullArea}}
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
            </div>
            <div class="pagination" v-show="totalCount>0">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
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
    <!-- 新建标签的dialog -->
    <div class="new-create" @click="selectTreeHide">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="newCreateDialog"
        width="571px">
        <div class="new-create-content">
          <el-form ref="form" :model="form" label-width="80px" label-position="right">
            <div class="create-content">
              <el-form-item class="create-item" label="标签名称">
                <el-input class="input-input" @keyup.native="toInput(form.name,$event)" v-model="form.name" placeholder="请输入标签名称"></el-input>
                <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
              </el-form-item>
              <el-form-item class="create-item" label="门店选择">
                <vue-gic-store-new v-if="newCreateDialog" ref="storeNew" :options="optionsStore" :uuid.sync="uuid" :isAdd="isAdd"></vue-gic-store-new>
                <!-- <selectShopTree :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree> -->
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newCreateDialog = false">取 消</el-button>
          <el-button type="primary" @click.prevent.stop="saveTag">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import selectShopTree from 'components/basicConfig/selectShopTree/selectShopTreeMany'
  import strLength from '../../../common/js/strlen';
  let qs = require('qs')
  export default {
    name: "shop_tag",
    data(){
    	return {
        isAdd:true,
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
            name: '门店标签',
            path: ''
          }
        ],
        /*标签内容*/
        form: {
          name: '',
          shopGroup: '',
          shopValue: ''
        },
        /*选择门店*/
        options: [],
        tagData:[],   // 门店标签
        tableData: [],  // 门店列表
        value: '',
    		toggle:false,
        newCreateDialog:false,
        editCreateDialog:false,
        inputValue:'',
        currentPage:1,
        pageSize:20,
        totalCount:0,

        /*限制字符个数*/
        inputNum: 0, // 输入文字个数(两个字母/汉字算一个字)
        inputLength: 15, // 限制最大字数

        /*级联选择器*/
        shopGroupValue: 0,
        loading:false,

        firstTagId:'',
        currentIndex:0,
        tagId:'',
        tagName:'',
        storeType:'0',
        storeGroupIds:'',
        storeIds:'',
        dialogTitle:'',
        sendChildData:{},  // 向子元素传递的对象
        itemChild:{},   // 选中的门店标签的数据

        btnBool:false,

        uuid:'',  // 新增传空，编辑必传,
        optionsStore:[0,1,3,4,5],
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getTagData('add');
    },
    watch:{
      uuid(val){
        console.log(val);
        this.uuid = val;
      }
    },
    methods:{
      getTagData(type){   // 获得门店标签数据
        this.currentPage = 1;
        this.pageSize = 20;
        this.axios.post('/api-admin/tag-list',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode==0){
            this.tagData = data.result;
            if(data.result.length>0){
              // this.firstTagId = data.result[0].tagId;
              if(type=="add"){
                this.firstTagId = data.result[0].tagId;
                this.tagId = data.result[0].tagId;      // 用于不点击的搜索用
                this.tagName = data.result[0].tagName;
                if(this.currentIndex==0){
                  this.itemChild = data.result[0];
                }
                this.getShopListData(this.firstTagId,this.currentPage,this.pageSize);
              } else if(type=="edit"){
                this.getShopListData(this.tagId,this.currentPage,this.pageSize)
              }
            }else{
              this.btnBool = true;
              this.tableData = [];
              this.totalCount = 0;
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      getShopList(item,index){   // 点击标签 获得标签下的门店列表
        this.itemChild = item;
        this.currentIndex = index;
        this.tagId = item.tagId;
        this.tagName=item.tagName;
        this.currentPage = 1;
        this.pageSize = 20;
        this.getShopListData(this.tagId,this.currentPage,this.pageSize)
      },
      getShopListData(id,page,size){    // 获得标签下的门店列表
        this.loading = true;
        this.axios.post('/api-admin/tag-store-list',qs.stringify({
          requestProject:'gic-web',
          tagId:id,
          search:this.inputValue,
          currentPage:page,
          pageSize:size
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          this.loading = false;
          if(data.errorCode==0){
            if(data.result==null){
              this.totalCount = 0;
              this.tableData = [];
            }else{
              this.totalCount = data.result.totalCount;
              this.tableData = data.result.result;
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      searchStore(){  // 搜索门店
        this.currentPage = 1;
        this.pageSize = 20;
        this.getShopListData(this.tagId,this.currentPage,this.pageSize)
      },
      handleSizeChange(val){    // 选择分页符
        this.pageSize = val;
        this.getShopListData(this.tagId,this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getShopListData(this.tagId,this.currentPage,this.pageSize)
      },
      deleteTag(id,index){    // 是否删除门店标签
        this.$confirm('若删除后，可能会导致其他模块的门店标签为空，例如卡券试用门店，是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api-admin/tag-delete',qs.stringify({
            requestProject:'gic-web',
            tagId:id,
          })).then((res)=>{
            var data = res.data;
            // console.log(data);
            if(data.errorCode==0){
              this.currentIndex = 0;
              this.getTagData('add');
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
      },
      toInput(value,e) {  // 标签名称输入时控制字符数量
        var that = this;
        that.form.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.form.name);
      },
      selectShop(val){
        this.shopGroupValue=val;
        this.form.shopValue='';
      },
      addTag(){
        // debugger;
        this.newCreateDialog = true;
        this.form.name='';
        this.dialogTitle = '新增标签';
        this.inputNum = 0;
        this.tagId = '',
        this.sendChildData = {};
        this.sendChildData.storeType = 0;
        this.sendChildData.storeGroupIds = '';
        this.sendChildData.storeName = '';
        this.sendChildData.storeIds = ''
        this.isAdd = true;
        this.uuid = ""
      },
      editTag(item){
        //console.log(item);
        if(item.tagId){
          this.newCreateDialog = true;
          this.form.name=item.tagName;
          this.tagId = item.tagId;
          this.dialogTitle = '编辑标签';
          this.uuid = item.storeWidgetKey
          this.isAdd = false;
          // this.storeType = item.storeType.toString();
          this.inputNum = strLength.getZhLen(this.form.name);

          // if(this.storeType=='1'){    // 向子组件传递数据
          //   this.sendChildData = {};
          //   this.sendChildData.storeType = item.storeType;
          //   this.sendChildData.storeGroupIds = item.storeGroupIds.substring(0,item.storeGroupIds.length-1);
          //   this.storeGroupIds = item.storeGroupIds.substring(0,item.storeGroupIds.length-1);
          // } else if(this.storeType=='0'){    // 向子组件传递数据
          //   this.sendChildData = {};
          //   this.sendChildData.storeType = item.storeType;
          // } else if(this.storeType=='2'){    
          //   this.sendChildData = {};    // 向子组件传递数据
          //   this.sendChildData.storeType = item.storeType;
          //   this.sendChildData.storeName = item.storeNames;
          //   this.sendChildData.storeGroupIds = null;
          //   this.sendChildData.storeIds = item.storeIds.substring(0,item.storeIds.length-1);
          //   this.storeIds = item.storeIds.substring(0,item.storeIds.length-1);
          // }
        }else{
          this.$message.error('请选择门店标签');
        }
      },
      selectTreeHide(){   // 调用子组件 门店树级 结构的值
        // this.$refs.selectTree.hideTree();
      },
      getSelectGroupData(val){   // 获得子元素传递的数据
        //console.log(val);
        this.storeType = val.storeType.toString();
        if( (val.storeType==1 && val.storeGroupIds) || (val.storeType==2 && val.storeIds) || (val.storeType==0) ){
          this.storeGroupIds = val.storeGroupIds;
          this.storeIds = val.storeIds;
        }
      },
      async saveTag(){    // 新建 编辑  弹框的保存
        let flag = await this.$refs.storeNew.isStoreSave();
        if(this.form.name==""){
          this.$message.error('请输入标签名称');
          return;
        }
        if (!flag) {
          this.$message.error('请选择门店');
          return;
        }
        // if(this.storeType=='1' && this.storeGroupIds==""){
        //   this.$message.error('请选择门店分组');
        //   return;
        // }
        // if(this.storeType=='2' && this.storeIds==""){
        //   this.$message.error('请选择部分门店');
        //   return;
        // }
        this.axios.post('/api-admin/tag-edit',qs.stringify({
          requestProject:'gic-web',
          tagId:this.tagId,
          tagName:this.form.name,
          storeWidgetKey:this.uuid
          // storeType:parseInt(this.storeType),
          // storeGroupIds:this.storeGroupIds,
          // storeIds:this.storeIds
        })).then((res)=>{
          var data = res.data;
          //console.log(data);
          if(data.errorCode==0){
            this.currentIndex = 0;
            this.getTagData('add');
            this.sendChildData = {};
            this.btnBool = false;
            this.$message.success('保存成功');
            this.newCreateDialog = false;
          }else{
            this.$message.error(data.message)
          }
        })
      }
    },
    components:{
      topNav,
      selectShopTree
    }
  }
</script>

<style lang="less" scoped>
  .right-box-wrap{
    background: #eef1f8;
    .shop-tag-left{
      width: 260px;
      background: #EEF1F8;
      overflow: auto;
      overflow: auto;
      height: 407px;
      box-sizing: border-box;
      border-right:1px solid #e4e7ed;
    }
    .shop-tag-right-wrap{
      background: #fff;
      padding:24px;
      box-sizing: border-box;
      width: calc(100% - 260px);
      -moz-width: calc(100% - 260px);
      -webkit-width: calc(100% - 260px);
      -o-width: calc(100% - 260px);
    }
  }
  .shop-tag-right{
    .search{
      .input-search{
        width: 260px;
      }
      button{
        margin-left: 4px;
      }
    }
    .search-all{
      margin-top: 22px;
    }
    .pagination{
      text-align: right;
    }
  }
  .new-create-content{
    position: relative;
    .create-content{
      .create-item + .create-item{
        margin-top: 25px;
      }
      .create-item{
        position: relative;
        width: 100%;
        .tag-name-num{
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
      .label-name{
        margin-bottom: 15px;
      }
    }
    .select-shop{
      width: 230px;
    }
  }
  .leftBar-wrap{
    .newCreateBtn{
      margin: 20px 0;
      text-align: center;
    }
    .leftBar-nav-list{
      li{
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        padding: 0 15px;
        box-sizing: border-box;
        cursor: pointer;
        color: #606266;
        i{
          color: #909399;
        }
        &.on{
          background: #1890ff;
          color: #fff;
        }
        &:hover{
          background: #E4E7ED;
          color: #606266;
          .item-operate{
            i{
              display: inline-block;
            }
          }
        }
        .item-title{
          max-width: 190px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .item-operate{
          i{
            padding-left: 5px;
            display: none;
            cursor: pointer;
          }
        }
      }
    }
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  } 
  /* 门店选择插件的样式 */
  .create-item /deep/ .inline-block{
    margin-right: 6px
  }
  .create-item /deep/ .dm-store__inputtag--total{
    top: 2px;
  }
</style>
