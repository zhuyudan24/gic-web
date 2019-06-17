<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <h3 class="title-wrap">积分结算基本概念</h3>
        <div class="integral-wrap">
          <div class="item-wrap clearfix">
            <div class="fl icon">
              <img class="heng-img" src="../../../../static/img/old-cost.png" alt="" />
              <p>原始成本主体</p>
              <img class="down-img" src="../../../../static/img/add2.png" alt="" />
            </div>
            <div class="fl text">
              <img src="../../../../static/img/add1.png" alt="" />
              <span>积分使用后进行结算时的最终承担方</span>
              <img src="../../../../static/img/add1.png" alt="" />
            </div>
            <div class="fl info">
              <div class="item">
                <span>渠道来源：</span>
                <p>GIC、第三方平台……</p>
              </div>
              <div class="item">
                <span>产生渠道：</span>
                <p>初始导入积分、门店消费、线上消费、退款返还、积分兑换退货、管理员赠送、线上签到、任务奖励、成就奖励、投资奖励、游戏奖励、门店签到、积分清零</p>
              </div>
            </div>
          </div>
          <div class="item-wrap item-one clearfix">
            <div class="fl icon">
              <img class="heng-img" src="../../../../static/img/cost.png" alt="" />
              <p>成本主体</p>
              <img class="down-img" src="../../../../static/img/add2.png" alt="" />
            </div>
            <div class="fl text">
              <img src="../../../../static/img/add1.png" alt="" />
              <span>一般等于原始成本主体；发生闭店时，需要选择新的成本主体，承担闭店门店先前产生的积分在后续积分使用过程中产生的积分成本金额</span>
              <img src="../../../../static/img/add1.png" alt="" />
            </div>
            <div class="fl info">
              <div class="item">
                <span>渠道来源：</span>
                <p>GIC、第三方平台……</p>
              </div>
              <div class="item">
                <span>使用渠道：</span>
                <p>消费抵现、积分兑换、服务费用、抽奖费用、游戏费用、管理员扣除、退款追扣、积分过期、积分清零</p>
              </div>
            </div>
          </div>
          <div class="item-wrap item-one clearfix">
            <div class="fl icon">
              <img class="heng-img" src="../../../../static/img/belong.png" alt="" />
              <p>结算归属</p>
            </div>
            <div class="fl text">
              <img src="../../../../static/img/add1.png" alt="" />
              <span>成本主体的新分组，一般用门店所属加盟进行成本主体分组</span>
              <img src="../../../../static/img/add1.png" alt="" />
            </div>
            <div class="fl info">
              <div class="item">
                <span>渠道来源：</span>
                <p>GIC、第三方平台……</p>
              </div>
              <div class="item">
                <span>结算时间：</span>
                <p>线上订单完成、卡券使用、礼品兑换、管理员扣除 另使用渠道为服务费用 、抽奖费用、游戏费用、退款追扣、积分过期、积分清零的积分进行结算，但成本金额为0</p>
              </div>
            </div>
          </div>
        </div>
        <h3 class="title-wrap">原始成本主体配置</h3>
        <div class="original-table-wrap">
          <el-table :data="tableData" style="width: 100%" :span-method="objectSpanMethod" v-loading="loading">
            <el-table-column prop="integralTypeName" label="渠道来源">
              <template>
                <div class="qudao-form">
                  <p>所有来源</p>
                  <p>（GIC、第三方平台…）</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="integralTypeName" label="产生渠道"> </el-table-column>
            <el-table-column prop="jiesuan" label="原始成本（若选择服务门店/开卡门店，而会员该字段为空，则记在无归属下）" width="600">
              <template slot-scope="scope">
                <div v-if="scope.row.chengben.length > 0">
                  <el-radio-group @change="changeOldObj(scope.row, scope.row.showMainPartCost, scope.$index)" v-model="scope.row.showMainPartCost">
                    <el-radio v-for="(item, index) in scope.row.chengben" :key="index" :label="item.MP_CODE">{{ item.MP_NAME }}</el-radio>
                  </el-radio-group>
                </div>
                <div v-else>管理员增加积分操作时选择的原始成本主体，如无具体门店请选择总部</div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="save-btn">
            <el-button @click="saveBtn" type="primary">保 存</el-button>
          </div> -->
        </div>
        <h3 class="title-wrap">特殊原始成本配置策略<span>（针对某来源/某产生渠道配置特殊的原始成本主体）</span></h3>
        <div class="special-table-wrap">
          <div class="add-btn">
            <el-button @click="addStrategy('add')" type="primary">新增策略</el-button>
          </div>
          <el-table :data="tableData2" style="width: 100%" class="table-no-line-wrap">
            <el-table-column prop="channelName" label="渠道来源" sortable> </el-table-column>
            <el-table-column prop="integralTypeName" label="产生渠道" sortable> </el-table-column>
            <el-table-column prop="mainPartCostName" label="原始成本主体"> </el-table-column>
            <el-table-column prop="jiesuan" label="操作" width="100px">
              <template slot-scope="scope">
                <el-button @click="addStrategy('edit', scope.row)" type="text">编辑</el-button>
                <el-button @click="handleDelClick(scope.$index, scope.row)" type="text">删除</el-button>
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
    <!-- 新增、编辑策略 -->
    <el-dialog :title="specialTitle" :visible.sync="dialogVisible" :before-close="cancelStrategyBtn" width="500px">
      <div class="special-wrap">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="渠道来源" prop="channel">
            <el-select class="change-select" v-model="ruleForm.channel" placeholder="选择渠道来源">
              <el-option v-for="item in channelList" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产生渠道" prop="produce">
            <el-select @change="selecProduce" class="change-select" v-model="ruleForm.produce" placeholder="选择产生渠道">
              <el-option v-for="item in produceList" :key="item.integralTypeCode" :label="item.integralTypeName" :value="item.integralTypeCode"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原始成本主体" prop="mainPart">
            <el-radio-group @change="selecMain" v-model="ruleForm.mainPart">
              <el-radio v-for="item in mainList" :key="item.MP_CODE" :label="item.MP_CODE">{{ item.MP_NAME }}</el-radio>
            </el-radio-group>
            <p class="original-text">若选择服务门店/开卡门店，而会员该字段为空，则记在无归属下</p>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelStrategyBtn">取 消</el-button>
        <el-button type="primary" @click="sureStrategyBtn('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog title="删除提示" :visible.sync="dialogVisible2" width="425px">
      <div class="del-wrap">
        <h3>确认将此策略删除？</h3>
        <p>一旦删除，即刻生效，无法变更</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sureDelBtn">确 定</el-button>
      </span>
    </el-dialog>
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
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
let qs = require('qs')
export default {
  name: 'integral_cost',
  data() {
    return {
      repProjectName: 'gic-web',
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
          name: '原始成本主体配置',
          path: ''
        }
      ],
      tableData: [],
      saveArr: [],
      tableData2: [],
      dialogVisible: false,
      specialTitle: '新增特殊原始成本配置策略',
      integralSettlementSettingId: '',
      ruleForm: {
        channel: '',
        produce: '',
        mainPart: ''
      },
      integralTypeName: '',
      MP_NAME: '',
      rules: {
        channel: [{ required: true, message: '请选择渠道来源', trigger: 'change' }],
        produce: [{ required: true, message: '请选择产生渠道', trigger: 'change' }],
        mainPart: [{ required: true, message: '请选择原始成本主体', trigger: 'change' }]
      },
      channelList: [], // 渠道来源列表
      produceList: [], // 产生渠道来源列表
      mainList: [], // 原始成本主体列表
      loading: false,
      dialogVisible2: false,
      curIndex: 0,
      contactDialog:false,
    };
  },
  mounted() {
    this.getContact();
    this.getCostData();
    this.getSpecialData();
    this.getChannelList();
    this.getProduceList();
    this.getMainList();
  },
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
    // 获得数据
    getCostData() {
      this.loading = true;
      this.axios.post('/api-admin/integral-costing-setting', qs.stringify({
        requestProject:this.repProjectName
      })).then(res => {
        let data = res.data;
        this.loading = false;
        if (data.errorCode == 0) {
          this.tableData = data.result.type1List ? data.result.type1List : [];
          this.tableData.forEach(row => {
            let obj = {};
            obj.integralTypeName = row.integralTypeName;
            obj.integralTypeCode = row.integralTypeCode;
            let chenbenName = ''; // 原始积分
            if (row.chengben && row.chengben.length > 0) {
              row.chengben.forEach(item => {
                // 获得相应code下的名字
                if (item.MP_CODE == row.showMainPartCost) {
                  chenbenName = item.MP_NAME;
                }
              });
            }
            obj.mainPartCostName = chenbenName;
            obj.mainPartCostCode = row.showMainPartCost;
            this.saveArr.push(obj);
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    changeOldObj(row, code, index) {
      let chenbenName = '';
      row.chengben.forEach(item => {
        if (item.MP_CODE == code) {
          chenbenName = item.MP_NAME;
        }
      });
      this.saveArr[index].mainPartCostName = chenbenName; // 更改
      this.saveArr[index].mainPartCostCode = code;
      this.saveBtn();
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % this.tableData.length === 0) {
          return {
            rowspan: this.tableData.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    saveBtn() {
      this.axios.post('/api-admin/save-integral-costing-setting', qs.stringify({
        requestProject:this.repProjectName,
        jsonData: JSON.stringify(this.saveArr)
      })).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 获得特殊策略
    getSpecialData() {
      this.axios.post('/api-admin/get-special-list', qs.stringify({
        requestProject:this.repProjectName
      })).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.tableData2 = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 获得渠道来源
    getChannelList() {
      this.axios.post('/api-admin/get-channel-list', qs.stringify({
        requestProject:this.repProjectName
      })).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.channelList = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 获得产生渠道
    getProduceList() {
      this.axios.post('/api-admin/get-config-dict', qs.stringify({
        requestProject:this.repProjectName
      })).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.produceList = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 获得原始成本主体列表
    getMainList() {
      this.axios.post('/api-admin/get-main-part-cost', qs.stringify({
        requestProject:this.repProjectName
      })).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.mainList = data.result ? data.result : [];
        } else {
          this.$message.error(data.message);
        }
      });
    },
    // 新增 、编辑 策略
    addStrategy(type, row) {
      this.dialogVisible = true;
      if (type == 'add') {
        this.specialTitle = '新增特殊原始成本配置策略';
        this.integralSettlementSettingId = '';
        this.ruleForm.produce = '';
        this.ruleForm.channel = '';
        this.ruleForm.mainPart = this.mainList[0].MP_CODE;
        this.MP_NAME = this.mainList[0].MP_NAME;
      } else if (type == 'edit') {
        this.specialTitle = '编辑特殊原始成本配置策略';
        this.axios.post('/api-admin/get-special-by-id', qs.stringify({
          requestProject:this.repProjectName,
          id: row.integralSettlementSettingId
        })).then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.integralSettlementSettingId = data.result.integralSettlementSettingId;
            this.ruleForm.produce = data.result.integralTypeCode;
            this.integralTypeName = data.result.integralTypeName;
            this.ruleForm.mainPart = parseInt(data.result.mainPartCostCode);
            this.MP_NAME = data.result.mainPartCostName;
            this.ruleForm.channel = data.result.channelType;
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    // 选择产生渠道
    selecProduce(val) {
      let obj = {};
      obj = this.produceList.find(item => {
        return item.integralTypeCode === val;
      });
      this.integralTypeName = obj.integralTypeName;
    },
    // 选择原始成本主体
    selecMain(val) {
      let obj = {};
      obj = this.mainList.find(item => {
        return item.MP_CODE === val;
      });
      this.MP_NAME = obj.MP_NAME;
    },
    // 新增策略取消按钮
    cancelStrategyBtn() {
      this.dialogVisible = false;
      this.$refs.ruleForm.clearValidate();
      this.$refs.ruleForm.resetFields();
    },
    // 新增策略确认按钮
    sureStrategyBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = {
            integralSettlementSettingId: this.integralSettlementSettingId, //主键id，如果是编辑需要传递，如果是新增，则不用该字段
            integralTypeName: this.integralTypeName, //产生渠道名称
            integralTypeCode: this.ruleForm.produce, //产生渠道code
            mainPartCostName: this.MP_NAME, //原始成本主体名称
            mainPartCostCode: this.ruleForm.mainPart, //原始成本主体code
            mainPartSettlementName: '所属结算主体分组', //写死的
            mainPartSettlementCode: '2002', //写死的
            infoType: 1, //写死的
            channelType: this.ruleForm.channel //渠道来源
          };
          this.axios.post('/api-admin/save-special-integral-costing-setting', qs.stringify({
            requestProject:this.repProjectName,
            jsonData: JSON.stringify(obj)
          })).then(res => {
            let data = res.data;
            if (data.errorCode == 0) {
              this.dialogVisible = false;
              this.getSpecialData();
              this.$refs[formName].resetFields();
              this.$message.success('保存成功');
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除
    handleDelClick(index, row) {
      this.dialogVisible2 = true;
      this.curIndex = index;
      this.integralSettlementSettingId = row.integralSettlementSettingId;
    },
    // 确认删除按钮
    sureDelBtn() {
      this.axios.post('/api-admin/delete-special-by-id', qs.stringify({
        requestProject:this.repProjectName,
        id: this.integralSettlementSettingId
      })).then(res => {
        let data = res.data;
        if (data.errorCode == 0) {
          this.dialogVisible2 = false;
          this.tableData2.splice(this.curIndex, 1);
          this.$message.success('删除成功');
        } else {
          this.$message.error(data.message);
        }
      });
    }
  },
  components: {
    topNav
  }
};
</script>
<style lang="less" scoped>
.right-box {
  background: #fff;
  padding: 0;
}
.item-one {
  margin-top: 15px;
}
.title-wrap {
  padding: 20px 24px;
  font-size: 16px;
  line-height: 25px;
  font-weight: 500;
  span {
    font-size: 14px;
    color: #606266;
    padding-left: 5px;
  }
}
.integral-wrap {
  padding: 35px 0 30px 125px;
  border-bottom: 1px solid #e7e7eb;
  border-top: 1px solid #e7e7eb;
  margin-bottom: 10px;
  .icon {
    text-align: center;
    width: 85px;
    .heng-img {
      margin-bottom: 13px;
      width: 32px;
      height: 32px;
    }
    p {
      color: #303133;
      font-size: 14px;
      line-height: 20px;
    }
    .down-img {
      margin-top: 32px;
    }
  }
  .text {
    font-size: 14px;
    color: #606266;
    margin: 51px 32px 0;
    span {
      margin: 0 25px;
      display: inline-block;
      width: 240px;
      line-height: 24px;
      margin-top: -5px;
    }
    img {
      display: inline-block;
      vertical-align: top;
    }
  }
  .info {
    width: 390px;
    font-size: 14px;
    margin-top: 47px;
    .item {
      position: relative;
      line-height: 24px;
      span {
        color: #303133;
        position: absolute;
        font-weight: 500;
      }
      p {
        color: #606266;
        padding-left: 70px;
      }
    }
  }
}
.original-table-wrap {
  margin-bottom: 10px;
  padding: 0 24px;
  .qudao-form {
    text-align: center;
  }
  .save-btn {
    text-align: center;
    padding: 24px 0;
  }
}
.special-table-wrap {
  border-top: 1px solid #e7e7eb;
  padding: 0 24px;
  .add-btn {
    padding: 24px 0 22px 0;
    text-align: right;
  }
}
.demo-ruleForm .change-select {
  width: 330px;
}
.original-text {
  line-height: 20px;
  color: #909399;
  font-size: 12px;
}
.del-wrap {
  font-size: 14px;
  h3 {
    color: #303133;
    line-height: 20px;
    margin-bottom: 12px;
  }
  p {
    color: #f5222d;
    line-height: 20px;
  }
}
/* 去掉表格的最后一条线 */
.table-no-line-wrap::before{
  height: 0
}
.el-message-box__wrapper{
  left: 200px;
  top: 64px;
  background: rgba(0, 0, 0, .5);
}
</style>
