<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="integral-content-wrap">
          <div class="title">积分成本结算状态</div>
          <div class="cost-state-wrap">
            <div class="bind-wrap">
              <p>兑换：积分兑换时，积分成本进行结算</p>
              <p>核销：卡券核销成功时，才进行积分成本结算</p>
            </div>
            <div class="card-state">
              <span>卡券结算状态</span>
              <!-- <p><el-radio v-model="radio" label="1">核销</el-radio></p> -->
              <p>
                <el-radio-group v-model="radio">
                  <el-radio v-show="cardSelectCode==card.MP_CODE" v-for="(card, index) in cardStateArr" :key="index" :label="card.MP_CODE">{{card.MP_NAME}}</el-radio>
                </el-radio-group>
              </p>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="integral-content-wrap">
          <div class="title">积分主体配置</div>
          <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading">
            <el-table-column
              prop="integralTypeName"
              label="积分类别"
              width="200">
            </el-table-column>
            <el-table-column
              prop="old"
              label="原始积分成本主体">
              <template slot-scope="scope">
                <el-radio-group @change="changeOldObj(scope.row,scope.row.showMainPartCost,scope.$index)" v-model="scope.row.showMainPartCost">
                  <el-radio v-for="(item, index) in scope.row.chengben" :key="index" :label="item.MP_CODE">{{item.MP_NAME}}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="config"
              label="积分结算配置">
              <template slot-scope="scope">
                <div class="clearfix">
                  <el-radio-group class="fl" @change="changeNewObj(scope.row,scope.row.showMainPartSettlement,scope.$index)" v-model="scope.row.showMainPartSettlement">
                    <el-radio v-for="(item, index) in scope.row.jiesuan" :key="index" :label="item.MP_CODE"><span @click="showDialog(scope.row,scope.$index,item.MP_CODE)">{{item.MP_NAME}}</span></el-radio>
                  </el-radio-group>
                  <p v-show="scope.row.showMainPartSettlement=='2001'" class="point-wrap fl">{{scope.row.groupName}}</p>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="save-btn">
          <el-button @click="saveBtn" type="primary">保 存</el-button>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 指定积分结算归属 -->
    <div class="close-main-wrap" @click="hideTree">
      <el-dialog
        title="指定积分结算归属"
        :visible.sync="dialogVisible"
        width="400px">
        <div class="close-main-content">
          <span>积分结算归属</span>
          <div class="all-style-wrap fl">
            <div class="select-shop" @click.prevent.stop="toggleSearchShop">
              <p v-show="selecDataName!=''" class="select-search-shop">
                <span class="gic-tag-name">{{selecDataName}}<i @click.prevent.stop="removeData" class="dele-icon el-icon-error"></i></span>
              </p>
            </div>
            <transition name="slide-fade">
              <div class="select-shop-url-wrap search-shop-wrap" v-show="showSearchList" >
                <div class="search-shop-input" @click.stop="getSearchGroup">
                  <el-input @keydown.enter.native="getSearchGroup()" @keyup.native="getSearchGroup()" size="small" class="input-name" prefix-icon="el-icon-search" v-model="searchValueList" placeholder="输入搜索内容" ></el-input>
                </div>
                <div class="search-shop-list">
                  <ul v-if="selectList.length>0">
                    <li @click.prevent.stop="selectShopSuccess(list,index)" :key="index" v-for="(list,index) in selectList"><span>{{list.groupName}}</span></li>
                  </ul>
                  <p v-else class="no-data">无搜索内容</p>
                  <p class="search-list-tip">最多显示5条数据</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureDialogBtn">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "integral_cost",
    data(){
    	return {
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
            name: '积分成本配置',
            path: ''
          }
        ],
        tableData:[],
        selectList: [], // 搜索结果的数组
        selecDataName:'',  // 选中的名字
        searchValueList: '',
        settlementStoreGroupId:'',  // 选中的id
        showSearchList:false,
        dialogVisible: false,

        cardStateArr:[],    // 所有的卡券结算状态的
        cardSelectCode:'',  // 选中的状态
        radio: '',

        showMainPartCost:'',  // 原始积分成本主体的值
        showMainPartSettlement:'',  // 积分结算配置选中的值
        
        saveAllArr:[],   // 最终保存的数组
        cardObj:{},   // 卡券结算状态的保存数据
        saveArr:[], 
        currentIndex:0,
        loading:false,
        saveBtnBoolean:false
    	}
    },
    computed:{
      
    },
    mounted(){
      this.getCostData();

      // this.oldRadio()
    },
    methods:{
      getCostData(){    // 获得数据
        this.loading = true;
        this.axios.post('/api-admin/integral-costing-setting',qs.stringify({
          requestProject:'gic-web'
        })).then(res=>{
          var data = res.data;
          // console.log(data);
          if(data.errorCode==0){
            this.loading = false;
            if(data.result.type1List.length>0){   // 积分主体配置数据
              this.tableData = data.result.type1List;
              // 刚进入时获得要保存的数据，防止不做操作而直接保存
              this.tableData.forEach((row)=>{
                var obj = {};

                obj.integralTypeName = row.integralTypeName;
                obj.integralTypeCode = row.integralTypeCode;

                var chenbenName = '';   // 原始积分
                if(row.chengben && row.chengben.length>0){
                  row.chengben.forEach((item)=>{    // 获得相应code下的名字
                    if(item.MP_CODE == row.showMainPartCost){
                      chenbenName = item.MP_NAME;
                    }
                  })
                }
                obj.mainPartCostName = chenbenName;    
                obj.mainPartCostCode = row.showMainPartCost;

                var jiesuanName = '';     // 积分结算配置
                if(row.jiesuan && row.jiesuan.length>0){
                  row.jiesuan.forEach((item)=>{   // 获得相应code下的名字
                    if(item.MP_CODE == row.showMainPartSettlement){
                      jiesuanName = item.MP_NAME;
                    }
                  })
                }
                if(row.showMainPartSettlement=='2001'){   // 指定结算主体
                  obj.settlementStoreGroupId = row.groupId;
                  // obj.settlementStoreGroupName = row.groupName;
                  this.selecDataName = row.groupName;
                }
                obj.mainPartSettlementName = jiesuanName;  
                obj.mainPartSettlementCode = row.showMainPartSettlement;

                obj.infoType = row.infoType;

                this.saveArr.push(obj)
              })
            }
            if(data.result.type2List.length>0){   // 卡券结算状态数据
              var cardCost = data.result.type2List[0];    
              this.cardStateArr = cardCost.jiesuan;
              this.cardSelectCode = cardCost.showMainPartSettlement;
              this.radio = cardCost.showMainPartSettlement;

              this.cardObj.integralTypeName = cardCost.integralTypeName;
              this.cardObj.integralTypeCode = cardCost.integralTypeCode;

              var stateName = '';
              this.cardStateArr.forEach((item)=>{
                if(item.MP_CODE == cardCost.showMainPartSettlement){
                  stateName = item.MP_NAME;
                }
              })
              this.cardObj.mainPartSettlementCode = cardCost.showMainPartSettlement;
              this.cardObj.mainPartSettlementName = stateName;
              this.cardObj.infoType = cardCost.infoType;
              this.saveAllArr.push(this.cardObj)
            }
            this.saveArr.forEach((row)=>{
              this.saveAllArr.push(row)
            })
            console.log(this.saveAllArr);
          }else{
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      },
      changeOldObj(row,code,index){
        var chenbenName = '';
        row.chengben.forEach((item)=>{
          if(item.MP_CODE == code){
            chenbenName = item.MP_NAME;
          }
        })
        this.saveArr[index].mainPartCostName = chenbenName;     // 更改
        this.saveArr[index].mainPartCostCode = code;
      },
      changeNewObj(row,code,index){   // 点击前面的圆圈  显示出弹框
        // console.log(row);
        this.currentIndex = 0;
        this.currentIndex = index;    // 操作其下标

        if(parseInt(code)==2001){   // 选中指定结算主体
          this.dialogVisible=true;
          if(row.groupId){
            this.saveArr[this.currentIndex].settlementStoreGroupId = row.groupId;
            this.selecDataName=row.groupName;
          }else{
            this.saveArr[this.currentIndex].settlementStoreGroupId = '';  
            this.selecDataName='';
          }
        }else{
          delete this.saveArr[index].settlementStoreGroupId
        }

        var jiesuanName = '';
        row.jiesuan.forEach((item)=>{
          if(item.MP_CODE == code){
            jiesuanName = item.MP_NAME;
          }
        })
        this.saveArr[index].mainPartSettlementName = jiesuanName;  
        this.saveArr[index].mainPartSettlementCode = code;
      },
      showDialog(row,index,code){   // 若是指定结算主体，则出现弹框
        this.searchValueList = '';
        this.selectList.splice(0,this.selectList.length);
        
        this.selecDataName='';
        this.currentIndex = 0;
        this.currentIndex = index;    // 操作其下标
        if(code == row.showMainPartSettlement){   // 类似于编辑
          // this.dialogVisible=true;
          if(row.groupName==null){
            this.selecDataName='';
            this.settlementStoreGroupId = '';
            this.saveArr[this.currentIndex].settlementStoreGroupId = '';
          }else{
            this.selecDataName = row.groupName;
            this.settlementStoreGroupId = row.groupId;
            this.saveArr[this.currentIndex].settlementStoreGroupId = row.groupId;
          }
        }
        if(parseInt(code)==2001){   // 切换  选中指定结算主体
          this.dialogVisible=true;
          if(row.groupId){
            this.saveArr[this.currentIndex].settlementStoreGroupId = row.groupId;
          }else{
            this.saveArr[this.currentIndex].settlementStoreGroupId = '';  
          }
        }

        var jiesuanName = '';
        row.jiesuan.forEach((item)=>{
          if(item.MP_CODE == code){
            jiesuanName = item.MP_NAME;
          }
        })
        this.saveArr[index].mainPartSettlementName = jiesuanName;  
        this.saveArr[index].mainPartSettlementCode = code;
      },
      getSearchGroup(){
        if(this.searchValueList){
          this.axios.post('/api-admin/query-settlement-group-by-name',qs.stringify({
            requestProject:'gic-web',
            searchParam:this.searchValueList
          })).then(res=>{
            var data = res.data;
            // console.log(data);
            if(data.errorCode==0){
              this.selectList = data.result;
            }else{
              this.$message.error(data.message)
            }
          })
        }
      },
      selectShopSuccess(row,index){    // 选中
        this.showSearchList = false;
        this.selecDataName = row.groupName;
        this.settlementStoreGroupId = row.integralSettlementGroupId;
      },
      removeData(){
        this.selecDataName = '';
      },
      sureDialogBtn(){    // 弹框的保存按钮
        this.dialogVisible = false;
        this.tableData[this.currentIndex].groupName = this.selecDataName;
        this.saveArr[this.currentIndex].settlementStoreGroupId = this.settlementStoreGroupId;
      },
      toggleSearchShop(){      
        this.showSearchList = !this.showSearchList
      },
      hideTree(){
        this.showSearchList = false;
      },
      saveBtn(){
        var saveBtnArr = [];
        this.saveAllArr.forEach((item)=>{
          if(item.mainPartSettlementCode=='2001' && item.settlementStoreGroupId==''){
            this.$message.error('请选择'+item.integralTypeName+'的指定结算主体');
            this.saveBtnBoolean = false;
            saveBtnArr.push(this.saveBtnBoolean)
          }
        })
        if(saveBtnArr.length<1){
          this.axios.post('/api-admin/save-integral-costing-setting',qs.stringify({
            requestProject:'gic-web',
            jsonData:JSON.stringify(this.saveAllArr)
          })).then(res=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode==0){
              this.$message.success('保存成功')
            }
          })
        }
      }
    },
    components:{
    	topNav,
    }  
  }
</script>

<style lang="less" scoped>
  .integral-content-wrap{
    font-size: 14px;
    color: rgba(0,0,0,.85);
    margin-bottom: 24px;
    .title{
      font-weight: 500;
      margin-bottom: 18px;
      font-size: 16px;
    }
    .bind-wrap{
      border: 1px solid #1890ff;
      padding: 10px 16px;
      box-sizing: border-box;
      border-radius: 4px;
      background: #ecf5ff;
      margin-bottom: 24px;
      color: rgba(0,0,0,.65);
      p{
        line-height: 30px;
        position: relative;
        padding-left: 16px;
        &:before{
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          width: 6px;
          height: 6px;
          background: #1890ff;
          border-radius: 50%;
        }
      }
    }
    .card-state{
      margin-bottom: 18px;
      position: relative;
      span{
        position: absolute;
        width: 100px;
      }
      p{
        padding-left: 110px;
      }
    }
  }
  .line{
    width: 100%;
    height: 1px;
    background: #e8e8e8;
    margin: 24px 0 32px 0;
  }
  .close-main-content{
    position: relative;
    height: 32px;
    > span{
      position: absolute;
      width: 100px;
      line-height: 32px;
      text-align: right;
    }
    /*.select-main,.all-style-wrap{
      padding-left: 118px;
    }*/
  }
  .all-style-wrap{
    width: 250px;
    position: relative;
    left: 112px;
    .search-input{
      width:180px;
    }
    .select-shop{
      width: 250px;
      min-height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #606266;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
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
      width: 250px;
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
  .gic-tag-name {
    box-sizing: border-box;
    border-color: transparent;
    margin: 2px 0 2px 6px;
    background-color: #f0f2f5;
    height: 24px;
    padding: 2px 8px;
    line-height: 22px;
    color: #909399;
    border-radius: 4px;
    font-size: 12px;
    display: inline-block;
    .dele-icon{
      padding-left: 5px;
      cursor: pointer;
    }
  }
  .select-search-shop{
    font-size: 0;
    line-height: 1;
    display: inline-block;
    span{
      font-size: 12px;
    }
  }
  .point-wrap{
    height: 16px;
    line-height: 16px;
    padding-left: 30px;
  }
  .save-btn{
    text-align: center;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
  .input-name input::-webkit-input-placeholder {
    font-size: 12px;
  }
  .input-name input::-moz-input-placeholder {
    font-size: 12px;
  }
  .input-name input::-ms-input-placeholder {
    font-size: 12px;
  }
</style>
