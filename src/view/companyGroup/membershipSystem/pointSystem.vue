<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <!-- 积分制度 -->
          <div class="point-cell point-form">
            <div class="point-cell-wrap">
              <point-form :contactBool="contactBool" :pointInfo="pointInfo" :projectName="projectName"></point-form>
            </div>
          </div>
          <div class="height-24"></div>
          <!-- 特殊积分获取策略 -->
          <div class="point-cell point-table">
            <div class="flex table-top title-wrap">
              <div class="flex-1 flex-l">
                <p class="flex-title">特殊积分获取策略</p>
                <div class="flex-lable">设置除通用积分获取规则以外的特殊策略</div>
              </div>
             <!--  <div class="flex-1 flex-r"><el-button :disabled="contactBool"  type="primary" @click="handleAdd('point')">新增策略</el-button></div> -->
            </div>
            <div class="fr btn-r-wrap"><el-button :disabled="contactBool"  type="primary" @click="handleAdd('point')">新增策略</el-button></div>
            <!-- table  border-->
            <div class="table-contain">
              <el-table
                :data="achieveTableData"
                class="table-no-line-wrap"
                style="width: 100%">
                <el-table-column
                  prop="strategyName"
                  label="策略名称">
                </el-table-column>
                <el-table-column
                  prop=""
                  label="线下渠道">
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.channelList" v-if="item.channelType==3">
                        <span v-if="item.openStatus==0">关闭</span>
                        <span v-else>
                          <span v-if="item.channelRelationProType==1&&item.channelRelationStoreType==1">通用</span>
                          <span v-if="item.channelRelationProType!=1||item.channelRelationStoreType!=1">自定义配置</span>
                        </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="微信商城">
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.channelList" v-if="item.channelType==1">
                        <span v-if="item.openStatus==0">关闭</span>
                        <span v-else>
                          <span v-if="item.channelRelationProType==1">通用</span>
                          <span v-if="item.channelRelationProType!=1">自定义配置</span>
                        </span>

                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="天猫商城">
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.channelList" v-if="item.channelType==8">
                      <span v-if="item.openStatus==0">关闭</span>
                      <span v-else>
                        <span v-if="item.channelRelationProType==1">通用</span>
                        <span v-if="item.channelRelationProType!=1">自定义配置</span>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="适用对象">
                  <template slot-scope="scope">
                    {{scope.row.useCrowd == 1? '所有会员': '自定义人群'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="getRule"
                  label="获取规则">
                   <template slot-scope="scope">
                    <span v-if="scope.row.integralGetStatus == 0">无积分</span>
                    <span v-if="scope.row.integralGetStatus != 0">
                      {{scope.row.integralGet.fee/10}} : {{scope.row.integralGet.integral/10}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div v-if="!contactBool">
                      <el-button @click="handleEditClick(scope.row,'edit')" type="text">编辑</el-button>
                      <delete-tip @confirm="handleDelClick(scope.$index,scope.row,achieveTableData)" tips="确认删除吗?">
                        <el-button type="text">删除</el-button>
                      </delete-tip>
                      <!-- <el-button @click="handleDelClick(scope.$index,scope.row,achieveTableData)" type="text" >删除</el-button> -->
                    </div>
                    <div v-else>
                      <el-button @click="handleEditClick(scope.row,'look')" type="text">查看</el-button>
                    </div>
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
          </div>
          <div class="height-24"></div>
          <!-- 特殊积分抵现策略 -->
          <div class="point-cell point-table">
            <div class="flex table-top title-wrap">
              <div class="flex-1 flex-l">
                <p class="flex-title">特殊积分抵现策略</p>
                <div class="flex-lable">设置消费时使用积分抵现的规则（仅用于微信商城结算）</div>
              </div>
              <!-- <div class="flex-1 flex-r"><el-button :disabled="contactBool" type="primary" @click= "handleAdd('integ')">新增策略</el-button></div> -->
            </div>
            <div class="fr btn-r-wrap"><el-button :disabled="contactBool"  type="primary" @click= "handleAdd('integ')">新增策略</el-button></div>
            <!-- table -->
            <div class="table-contain">
              <el-table
                :data="exchangeTableData"
                class="table-no-line-wrap"
                style="width: 100%">
                <el-table-column
                  prop="strategyName"
                  label="策略名称">
                </el-table-column>
                <el-table-column
                  prop="useCrowd"
                  label="适用对象">
                  <template slot-scope="scope">
                    {{scope.row.useCrowd == 1? '所有会员': '自定义人群'}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="适用商品">
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.channelList" >
                      {{item.channelRelationProType == 1&&item.integralUseDiscountControl==1? "所有商品" : "自定义配置" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="折扣控制">
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.channelList" >
                      {{item.integralUseDiscountControl==1? "不限制" : (item.integralUseDiscountControlLower+':'+item.integralUseDiscountControlUpper) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="getRule"
                  label="抵现规则">
                  <template slot-scope="scope">
                    <span >
                      {{scope.row.integralUseStatus==0? "无积分" : (scope.row.integralUse.integral+':'+scope.row.integralUse.fee)}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="比例限制">
                  <template slot-scope="scope">
                    <span v-for="item in scope.row.channelList" >
                      {{item.useProportionalRestriction}}%
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <div v-if="!contactBool">
                      <el-button @click="handleEditClick2(scope.row,'edit')" type="text">编辑</el-button>
                      <delete-tip @confirm="handleDelClick(scope.$index,scope.row,exchangeTableData)" tips="确认删除吗?">
                        <el-button type="text">删除</el-button>
                      </delete-tip>
                    </div>
                    <div v-else>
                      <el-button @click="handleEditClick2(scope.row,'look')" type="text">查看</el-button>
                    </div>
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
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <el-dialog
      title="提示"
      :visible.sync="contactDialog"
      width="500px">
      <span>已关联集团，此页面只能查看不能编辑保存。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="contactDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import topNav from 'components/nav/nav'
import pointForm from 'components/memberShip/point-form'

import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import { getRequest, postRequest, postForm } from '@/api/api';

export default {
  name: "pointSystem",
  data() {
    return {
      projectName:  'gic-web', // 当前项目名
      navpath: [
        {
          name: '会员管理',
          path: ''
        },
        {
          name: '会员体系',
          path: ''
        },
        {
          name: '积分制度',
          path: ''
        }
      ],


      // form
      pointInfo: {},
      bodyHtml:'', //富文本 tinymce 值

      // table 获取
      achieveTableData: [],
      // table 抵现
      exchangeTableData: [],

      loading:false,
      contactBool:false,    // 是否关联集团的标识
      contactDialog:false,
    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    // 新增
    handleAdd(flag){
      var that = this
      if (flag =='point') {
        this.$router.push('/addPointSystem')
      }else {
        this.$router.push('/addIntegralSytem')
      }
    },
    // 删除
    handleDelClick(index,row,ArrData) {
      var that = this
      //console.log("del:",index,row,ArrData)
      var para = {
        strategyId: row.integralStrategyId,
        requestProject: that.projectName
      }
      postRequest('/api-admin/delete-member-integral-strategy',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          that.$message({
            message: '删除成功',
            type: 'success'
          });
          ArrData.splice(index,1)
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        //console.log(error);

        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 是否关联集团
    getContact(){   
      var para = {};
      getRequest('/api-auth/is-relevance-clique',para)
      .then((res) => {
        var resData = res.data
        // console.log(resData);
        if (resData.errorCode == 0) {
          this.contactDialog = resData.result;
          this.contactBool = resData.result;
        }else{
          errMsg.errorMsg(resData)
        }
      })
      .catch(function (error) {
        console.log(error);

        this.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },

    // 获取积分制度
    getPointInfo() {
      var that = this
      var param = {
        requestProject: that.projectName
      }

      postRequest('/api-admin/get-member-integral-setting',param)
      .then((res) => {
        // console.log(res,res.data,res.data.errorCode)
        var resData = res.data
        if (resData.errorCode == 0) {
          if(resData.result.strategyList.length>0){
            var arr = resData.result.strategyList;
            // 积分策略
            arr.forEach(function(ele,index) {
              ele.integralGet = JSON.parse(ele.integralGet);
              ele.integralUse = JSON.parse(ele.integralUse);
              if (ele.strategyType == 1) {
                that.achieveTableData.push(ele)
              }else {
                that.exchangeTableData.push(ele)
              }
            })
            // form
          }
          that.pointInfo = that.handleData(resData.result.memberIntegral)
          return;
        }
        // that.userFormVisible = false;
       errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        // console.log(error);
        // that.toLogin()
        // that.userFormVisible = false;
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },
    // 处理表单中数据
    handleData(item) {
      // 获取规则需要除以 10
      if(item){
        item.integralGetStatus = String(item.integralGetStatus);
        item.integralUseStatus = String(item.integralUseStatus);
        item.integralGetStrategy = String(item.integralGetStrategy);
        item.integralGetDiscountControl = String(item.integralGetDiscountControl);
        item.integralUseDiscountControl = String(item.integralUseDiscountControl);
        item.integralGetDiscountControlUpper = String(item.integralGetDiscountControlUpper);
        item.integralGetDiscountControlLower = String(item.integralGetDiscountControlLower);
        item.integralUseDiscountControlUpper = String(item.integralUseDiscountControlUpper);
        item.integralUseDiscountControlLower = String(item.integralUseDiscountControlLower);
        let isJSONBool1 = this.isJSON(item.integralGet);
        let isJSONBool2 = this.isJSON(item.integralUse);
        let isJSONBool3 = this.isJSON(item.integralCost);
        if(isJSONBool1){
          item.integralGet = JSON.parse(item.integralGet);
        }else{  // 不是json  先转成对象再转成json
          item.integralGet = JSON.parse(JSON.stringify(eval('('+ item.integralGet +')')))
        }
        if(isJSONBool2){
          item.integralUse = JSON.parse(item.integralUse);
        }else{
          item.integralUse = JSON.parse(JSON.stringify(eval('('+ item.integralUse +')')))
        }
        if(isJSONBool3){
          item.integralCost = JSON.parse(item.integralCost);
        }else{
          item.integralCost = JSON.parse(JSON.stringify(eval('('+ item.integralCost +')')))
        }
        item.integralGet.fee = Number(item.integralGet.fee/10).toFixed(1)
        item.integralGet.integral = Number(item.integralGet.integral/10)
        return item;
      }
    },
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj=JSON.parse(str);
          // console.log('转换成功：'+obj);
          return true;
        } catch(e) {
          // console.log('error：'+str+'!!!'+e);
          return false;
        }
      }
    },
    changeRoute(route) {
      this.$router.push(route);
    },
    // 编辑积分获取策略
    handleEditClick(row) {
      this.$router.push({
        path:'/editPointSystem',
        query:{
          integralStrategyId: row.integralStrategyId
        }
      })
    },
    // 编辑积分抵现策略
    handleEditClick2(row) {
      this.$router.push({
        path:'/editIntegralSytem',
        query:{
          integralStrategyId: row.integralStrategyId
        }
      })
    },
  },
  components: {
    topNav,
    pointForm
  },
  mounted(){
    var that = this;
    that.getContact();  // 是否关联集团
    that.getPointInfo();
  },
}

</script>
<style lang="less" scoped>
.right-box{
  padding: 0;
}
.attention-wrap {
  .item-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 80px;
    }
  }
  .attention-content-wrap {}
}

.attention-wrap {

  .point-cell {
    &+.point-cell {
      margin-top: 60px;
    }
  }
  .flex {
    display: -webkit-flex;
    display: flex;

    &.table-top {
      border-bottom: 1px solid #e7e7eb;
      padding-bottom: 22px;
      position: relative;
    }

    .flex-1 {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
    }

    .flex-title {
      font-size: 16px;
      font-weight: 500;
      padding: 5px 0;
    }

    .flex-lable {
      font-size: 13px;
      color: #828282;
    }

    .flex-l {
      text-align: left
    }

    .flex-r {
      text-align: right
    }
  }
}
.right-box /deep/ .el-form-item .el-input__inner{
  padding-right: 12px;
}
.point-cell-wrap{
  padding: 24px 32px 0
}
.title-wrap{
  border-bottom: 1px solid #e7e7eb;
  padding: 20px 32px 15px;
}
.btn-r-wrap{
  padding: 24px 24px 22px 0;
}
.table-contain{
  padding: 0 24px 24px;
}
/* 去掉表格的最后一条线 */
.table-no-line-wrap::before{
  height: 0
}
</style>
