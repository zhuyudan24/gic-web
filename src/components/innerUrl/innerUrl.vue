<template>
  <div class="innerUrl-wrap menu-item">
    <div class="menu-item">
      <el-select @change="selectLeftUrl" class="fl select-shop" label="黄精" v-model="leftUrl" placeholder="请选择">
        <el-option
          v-for="item in leftOptions"
          :key="item.wechat_menu_dict_id"
          :label="item.wechat_menu_dict_name"
          :value="item.wechat_menu_dict_id">
        </el-option>
      </el-select>

      <div v-show="leftUrl=='12'" class="fr select-shop">
        <el-input @focus="dialogShopShow" suffix-icon="el-icon-arrow-down" v-model="selectShopUrl" placeholder="选择门店"></el-input>
      </div>
      <el-select v-show="leftUrl!='12'&&rightOptions.length>0 || leftUrl!='12'&&rightUrl!=''" @change="selectRighgtUrl" class="fr select-shop" label="黄精" v-model="rightUrl" placeholder="请选择">
        <el-option
          v-for="item in rightOptions"
          :key="item.wechat_menu_dict_id"
          :label="item.wechat_menu_dict_name"
          :value="item.wechat_menu_dict_code">
        </el-option>
      </el-select>
    </div>
    <!-- 选择门店 -->
    <div class="choose-wrap">
      <vue-gic-store :showStoreDialog="showStoreDialog" @selectStore="selectStore"></vue-gic-store>
      <!-- <el-dialog
        title="选择门店"
        :visible.sync="dialogShop"
        width="600px">
        <div class="choose-content-wrap">
          <div class="search">
            <el-input class="input-search" placeholder="请输入们门店名称/code" prefix-icon="el-icon-search" v-model="searchShopValue"></el-input>
          </div>
          <div class="choose-shop-list">
            <el-table
              ref="multipleTable"
              :data="tableData2"
              tooltip-effect="dark"
              style="width: 100%"
              @current-change="handleCurrentChangeSelectShop">
              <el-table-column label="" width="55">
                <template slot-scope="scope">
                  <el-radio class="radio-style" v-model="radioShop" :label="scope.row.storeId">
                    &nbsp;
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="门店名称">
                <template slot-scope="scope">
                  <h2 style="color: #606266">{{ scope.row.storeName }}</h2>
                  <p style="color: #909399">{{ scope.row.storeGroupName }}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="门店代码"
                width="200">
                <template slot-scope="scope">{{ scope.row.storeCode }}</template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
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
          <el-button @click="dialogShop = false">取 消</el-button>
          <el-button type="primary" @click="chooseShopBtn">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
  let qs = require('qs')
  export default {
    name: "innerUrl",
    props:{
      menuCode:String
    },
    data() {
      return {
        /*内部链接 级联选择器*/
        leftOptions:[],
        rightOptions:[],
        leftUrl:'',
        rightUrl:'',
        
        dialogShop: false,    // 选择门店的弹窗
        selectShopUrl: '',     // 门店的弹窗，选中之后的url
        
        tableData2: [],         // 门店列表
        searchShopValue: '',    // 搜索门店
        radioShop:null,
        showShopDetail: '',     // 用于显示选中的门店
        totalCount:null,
        currentPage:1,          // 分页
        pageSize:5,
        edit:true,
        defaultUrl:false,

        showStoreDialog: false,  // 门店
      }
    },
    watch: {
      menuCode(newVal,oldVal){    // 内链
        console.log(newVal);
        if(newVal=="null" || newVal=="" || newVal==undefined){ 
          return;
        }else{
          var valObj = JSON.parse(newVal);
          this.leftUrl = valObj.precode;
          this.rightUrl = valObj.nextcode;
          this.defaultUrl = true;
          this.selectLeftUrl(this.leftUrl,this.rightUrl);  // 获取默认信息
        }
        
      }
    },
    created(){
      // console.log(this.$parent.menuCode);
    },
    mounted(){
      this.getLeftUrlData();  // 获取左侧地址
      // this.getShopList();     // 获取门店列表
    },
    methods:{
      getLeftUrlData(){     // 获取左侧
        this.axios.post('/api-admin/get-inner-url',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.leftOptions = data.result;
          }else{
            this.$message({
              type:'error',
              message:data.message
            })
          }
        })
      },
      selectLeftUrl(val,valR){        // 选择左侧链接  获取右侧
        this.leftUrl = val;
        this.rightUrl = valR;
        //console.log(this.leftUrl);
        //console.log(this.rightUrl);
        
        this.$emit('sendLeftUrl',this.leftUrl);
        this.$emit('sendRightUrl',this.rightUrl);
        if(!this.defaultUrl){
          this.rightUrl = '';
        }
        this.axios.post('/api-admin/pre-code-select',qs.stringify({
          requestProject:'gic-web',
          pid:val
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.rightOptions = data.result.menuList;
            this.defaultUrl = false
          }else{
            this.$message({
              type:'error',
              message:data.message
            })
          }
        })
      },
      selectRighgtUrl(val){    // 选择右侧链接
        this.rightUrl = val;
        //console.log(this.rightUrl);
        this.$emit('sendRightUrl',this.rightUrl);
      },
      dialogShopShow(){     // 显示门店弹窗
        var that = this;
        that.showStoreDialog = true;
      },
      selectStore(val) {    // 子组件触发方法
        // 模拟检查数据
        console.log(val);
        this.showStoreDialog = false;
        this.selectShopUrl = val.storeName;
        console.log(this.selectShopUrl);
        this.$emit('sendShopData',val.storeId)
      },
      // getShopList(){    // 获取门店列表
      //   this.axios.post('/api-admin/store-list-paging',qs.stringify({
      //     searchName:'',
      //     completeStatus:1,
      //     status:1,
      //     channelType:0,
      //     storeGroupId:'',
      //     pageSize:this.pageSize,
      //     currentPage:this.currentPage
      //   })).then((res)=>{
      //     var data = res.data;
      //     // console.log(data);
      //     if(data.errorCode==0){
      //       var result = data.result;
      //       this.tableData2 = result.list;
      //       this.totalCount = result.page.totalCount
      //     }else{
      //       this.$message({
      //         type:'error',
      //         message:data.message
      //       })
      //     }
      //   })
      // },
      // handleCurrentChangeSelectShop(val){   // 选择门店发生变化时触发
      //   this.radioShop = val.storeId;
      //   this.showShopDetail = val.storeName
      // },  
      // chooseShopBtn(){    // 选择门店
      //   if(this.radioShop==''){
      //     this.dialogShop = false;
      //   } else {
      //     this.dialogShop = false;
      //     this.selectShopUrl = this.showShopDetail
      //   }
      // },
      // handleSizeChange(val){                // 选择分页符
      //   console.log(`每页 ${val} 条`);
      // },
      // handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      // },
    }
  }
</script>

<style scoped lang="less">
  .innerUrl-wrap{
    .menu-item{
      width: 450px;
      position: relative;
      .select-shop{
        width: 220px;
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
      .pagination{
          text-align: right;
          margin-top: 20px;
          line-height: 1
        }
    }
  }
  .choose-shop-list /deep/ .el-table__row{
    cursor: pointer;
  }
  .choose-shop-list /deep/ .el-table .has-gutter{
    line-height: 1
  }
  .choose-wrap /deep/ .el-dialog__body{
    padding: 10px 20px;
  }
</style>
