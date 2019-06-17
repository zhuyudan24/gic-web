<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <h3 class="big-title title">归属佣金结算规则</h3>
        <el-form :model="settleRuleDTO" ref="ruleForm" label-width="200px" class="demo-ruleForm">
          <!-- <el-form-item label="归属佣金短信提醒">
            <el-switch v-model="settleRuleDTO.openSms"></el-switch>
          </el-form-item> -->
          <el-form-item label="服务门店归属佣金结算规则">
            <label slot="label">服务门店归属佣金结算规则
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="消费会员的服务门店的佣金规则配置">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="settleRuleDTO.serviceStoreCommissionSettle"></el-switch>
          </el-form-item>
          <div class="form-child" v-if="settleRuleDTO.serviceStoreCommissionSettle">
            <el-form-item label="导购分享约束">
              <label slot="label">导购分享约束
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="如果开启，当订单的分享者为导购时（通过分享者的手机号和导购手机号做匹配识别），将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="settleRuleDTO.serviceStoreGuideShareConstraint"></el-switch>
            </el-form-item>
            <el-form-item label="单品佣金额度">
              <label slot="label">单品佣金额度
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="佣金细化到单品计算，此处设置每件商品的佣金额度。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="settleRuleDTO.serviceStoreCommissionAmount" controls-position="right" :min="0.00" :max="100.00" :step="0.01" :precision="2"></el-input-number> %
            </el-form-item>
            <el-form-item label="单品佣金封顶" >
              <label slot="label">单品佣金封顶
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="单品佣金封顶额度的设置，一般针对高价值商品做控制。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="settleRuleDTO.serviceStoreCommissionCap" controls-position="right" :min="0.00" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
            </el-form-item>
          </div>
          <el-form-item label="开卡门店归属佣金结算规则" label-width="200px">
            <label slot="label">开卡门店归属佣金结算规则
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="消费会员的开卡门店的佣金规则配置">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="settleRuleDTO.openStoreCommissionSettle"></el-switch>
          </el-form-item>
          <div class="form-child" v-if="settleRuleDTO.openStoreCommissionSettle">
            <el-form-item label="导购分享约束" >
              <label slot="label">导购分享约束
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="如果开启，当订单的分享者为导购时（通过分享者的手机号和导购手机号做匹配识别），将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="settleRuleDTO.openStoreGuideShareConstraint"></el-switch>
            </el-form-item>
            <el-form-item label="单品佣金额度" >
              <label slot="label">单品佣金额度
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="佣金细化到单品计算，此处设置每件商品的佣金额度。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="settleRuleDTO.openStoreCommissionAmount" controls-position="right" :min="0.00" :max="100.00" :step="0.01" :precision="2"></el-input-number> %
              <div style="margin-top:10px;">
                <el-checkbox v-model="settleRuleDTO.whenNoServiceStore" label="0">仅当会员无服务门店时生效。<el-popover
                    placement="top"
                    width="190"
                    trigger="hover"
                    content="当该订单的消费会员有服务门店时，开卡门店不获得佣金。">
                    <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                  </el-popover>
                </el-checkbox>
              </div>
              <div>
                <el-checkbox v-model="settleRuleDTO.whenServiceEqualOpenStore" label="1">当开卡门店与服务门店相同时，不生效。<el-popover
                    placement="top"
                    width="190"
                    trigger="hover"
                    content="当开卡门店和服务门店为同一家门店时，开卡门店不获得佣金。">
                    <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                  </el-popover>
                </el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="单品佣金封顶">
              <label slot="label">单品佣金封顶
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="单品佣金封顶额度的设置，一般针对高价值商品做控制。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="settleRuleDTO.openStoreCommissionCap" controls-position="right" :min="0.00" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
            </el-form-item>
          </div>
          <el-form-item >
            <el-button type="primary" @click="belongRuleSave">保 存</el-button>
          </el-form-item>
        </el-form>
        <h3 class="small-title title">特殊归属佣金结算策略
          <el-popover
            placement="top"
            width="190"
            trigger="hover"
            content="如果订单命中特殊策略的规则，将优先根据特殊策略的规则做结算。若同时命中多个特殊策略，则取最大值进行结算。">
            <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
          </el-popover>
        </h3>
        <div class="btn-r-wrap"><el-button type="primary" @click="addNewSpecial('add')">新增策略</el-button></div>
        <div class="table-wrap">
          <el-table
            :data="ruleSpecialDTOList"
            class="table-no-line-wrap"
            style="width: 100%">
            <el-table-column
              prop="specialStrategyName"
              label="策略名称">
            </el-table-column>
            <el-table-column
              prop="serviceStoreCommissionAmount"
              label="服务门店佣金额度">
            </el-table-column>
            <el-table-column
              prop="serviceStoreCommissionCap"
              label="服务门店单品佣金封顶">
            </el-table-column>
            <el-table-column
              prop="openStoreCommissionAmount"
              label="开卡门店佣金额度">
            </el-table-column>
            <el-table-column
              prop="openStoreCommissionCap"
              label="开卡门店单品佣金封顶">
            </el-table-column>
            <el-table-column
              prop="opr"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="addNewSpecial('edit',scope.row.specialStrategyId)">编辑</el-button>
                <delete-tip @confirm="deleteItem('belong',scope.$index,scope.row.specialStrategyId)" tips="确认删除吗?">
                  <el-button type="text">删除</el-button>
                </delete-tip>
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
        </div>
        <!-- <div class="height-24"></div>
        <h3 class="big-title title">发货佣金结算规则</h3>
        <el-form :model="sendSettleRuleDTO" ref="ruleForm2" label-width="130px" class="demo-ruleForm">
          <el-form-item label="发货佣金短信提醒" >
            <el-switch v-model="sendSettleRuleDTO.openSms"></el-switch>
          </el-form-item>
          <el-form-item label="发货佣金结算">
            <label slot="label">发货佣金结算
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="开启该项佣金结算，系统将为商品的发货门店做佣金结算。">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="sendSettleRuleDTO.sendCommissionSettle"></el-switch>
          </el-form-item>
          <div v-show="sendSettleRuleDTO.sendCommissionSettle">
            <el-form-item label="佣金计算方式">
              <el-radio-group v-model="sendSettleRuleDTO.commissionCalculateWay">
                <el-radio :label="1">按单数
                  <el-popover
                    placement="top"
                    width="190"
                    trigger="hover"
                    content="按发货单的数量做佣金结算，即无论该发货单中的货品有多少件、值多少钱，都统一计算固定额度的佣金。">
                    <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                  </el-popover>
                </el-radio>
                <el-radio :label="2">按商品成交价
                  <el-popover
                    placement="top"
                    width="190"
                    trigger="hover"
                    content="根据发货单中的商品成交总价，按固定比例做佣金结算。">
                    <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                  </el-popover>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="sendSettleRuleDTO.commissionCalculateWay==1" label="佣金额度">
              <label slot="label">佣金额度
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="设置每一笔发货单所能得到的固定佣金。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="sendSettleRuleDTO.singalAmount" controls-position="right" :min="0.00" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
              <div style="margin-top:10px;">
                <el-checkbox v-model="sendSettleRuleDTO.singleCheck" label="0">仅当发货门店和归属门店为非同一家门店时生效。   <el-popover
                    placement="top"
                    width="190"
                    trigger="hover"
                    content="当发货门店和关联消费订单的归属门店（服务门店或开卡门店）是同一家店，将不发放发货佣金。">
                    <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                  </el-popover>
                </el-checkbox>
              </div>
            </el-form-item>
            <el-form-item v-show="sendSettleRuleDTO.commissionCalculateWay==2" label="单品佣金额度">
              <label slot="label">单品佣金额度
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="佣金细化到单品计算，此处设置每件商品的佣金额度。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="sendSettleRuleDTO.goodsAmount" controls-position="right" :min="0.00" :max="100.00" :step="0.01" :precision="2"></el-input-number> %
              <div style="margin-top:10px;">
                <el-checkbox v-model="sendSettleRuleDTO.goodsCheck" label="0">仅当发货门店和归属门店为非同一家门店时生效。    <el-popover
                    placement="top"
                    width="190"
                    trigger="hover"
                    content="当发货门店和关联消费订单的归属门店（服务门店或开卡门店）是同一家店，将不发放发货佣金。">
                    <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                  </el-popover>
                </el-checkbox>
              </div>
            </el-form-item>
            <el-form-item v-show="sendSettleRuleDTO.commissionCalculateWay==2" label="单品佣金封顶">
              <label slot="label">单品佣金封顶
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="单品佣金封顶额度的设置，一般针对高价值商品做控制。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="sendSettleRuleDTO.commissionCap" controls-position="right" :min="0.00" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
            </el-form-item>
          </div>
          <el-form-item >
            <el-button type="primary" @click="sendRuleSave">保 存</el-button>
          </el-form-item>
        </el-form>
        <h3 class="small-title title">特殊发货佣金结算策略
          <el-popover
            placement="top"
            width="190"
            trigger="hover"
            content="如果发货单命中特殊策略的规则，将优先根据特殊策略的规则做结算。若同时命中多个特殊策略，则取最大值进行结算。">
            <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
          </el-popover>
        </h3>
        <div class="btn-r-wrap"><el-button type="primary" @click="addSpecialDeliver('add')">新增策略</el-button></div>
        <div class="table-wrap">
          <el-table
            :data="sendRuleSpecialDTOList"
            class="table-no-line-wrap"
            style="width: 100%">
            <el-table-column
              prop="specialStrategyName"
              label="策略名称">
            </el-table-column>
            <el-table-column
              prop="commissionCalculateWayName"
              label="佣金计算方式">
            </el-table-column>
            <el-table-column
              prop="commissionAmount"
              label="佣金额度">
            </el-table-column>
            <el-table-column
              prop="commissionCap"
              label="单品佣金封顶">
            </el-table-column>
            <el-table-column
              prop="opr"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="addSpecialDeliver('edit',scope.row.sendCommissionSpecialId)">编辑</el-button>
                <delete-tip @confirm="deleteItem('deliver',scope.$index,scope.row.sendCommissionSpecialId)" tips="确认删除吗?">
                  <el-button type="text">删除</el-button>
                </delete-tip>
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
        </div> -->
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
import { dateFormat } from '../../common/js/filter'
let qs = require('qs')
export default {
  name: "brokerage_rule", 
  data() {
    return {
      projectName:'gic-web',
      navpath: [
        {
          name: '佣金结算',
          path: ''
        },
        {
          name: '佣金结算规则',
          path: ''
        },
      ],
      settleRuleDTO:{ //归属佣金结算规则
        commissionSettleId:'', // 主键id
        openSms:false, // 短信提醒 
        serviceStoreCommissionSettle:false, //服务门店佣金结算规则1:开启 0：关闭
        serviceStoreGuideShareConstraint:false, //服务门店导购分享约束1：约束 0：不约束
        serviceStoreCommissionAmount:0, //单品佣金额度，单位是%，数值不超过100
        serviceStoreCommissionCap:0,//单品佣金封顶，单位是元
        openStoreCommissionSettle:false,//开卡门店佣金结算规则1:开启 0：关闭
        openStoreGuideShareConstraint:false,//开卡门店导购分享约束1：约束 0：不约束
        openStoreCommissionAmount:0,//开卡单品佣金额度，单位是%，数值不超过100
        whenNoServiceStore:[],//仅当会员无服务门店时生效 1：启动 0：不启动
        whenServiceEqualOpenStore:[],//当开卡门店与服务门店相同时，不生效 1：启动 0：不启动
        openStoreCommissionCap:0,//单品佣金封顶，单位是元
      },
      ruleSpecialDTOList:[],
      sendSettleRuleDTO:{  //发货佣金结算规则
        openSms:false, // 短信提醒 
        sendCommissionSettle:false,  //发货佣金结算 0：关闭 1：开启
        commissionCalculateWay:1, //佣金计算方式 1：按单数 2：按商品成交价
        singalAmount:0,
        singleCheck:[],
        goodsAmount:0,
        goodsCheck:[],
        commissionCap:0,//单品佣金封顶，单位是元
      },
      sendRuleSpecialDTOList:[],
    }  
  },
  mounted(){
    this.getData()
  },
  methods: {
    getData(){  // 获取数据
      this.axios.post('/api-admin/main-commission-settle',qs.stringify({
        requestProject:this.projectName
      })).then((res)=>{
        var data = res.data;
        if(data.errorCode==0){
          if(data.result.settleRuleDTO){
            var settleRuleDTO = data.result.settleRuleDTO
            settleRuleDTO.openSms = settleRuleDTO.openSms==1?true:false;
            settleRuleDTO.serviceStoreCommissionSettle = settleRuleDTO.serviceStoreCommissionSettle==1?true:false;
            settleRuleDTO.serviceStoreGuideShareConstraint = settleRuleDTO.serviceStoreGuideShareConstraint==1?true:false;
            settleRuleDTO.openStoreCommissionSettle = settleRuleDTO.openStoreCommissionSettle==1?true:false;
            settleRuleDTO.openStoreGuideShareConstraint = settleRuleDTO.openStoreGuideShareConstraint==1?true:false;
            settleRuleDTO.whenNoServiceStore = settleRuleDTO.whenNoServiceStore==1?['0']:[];
            settleRuleDTO.whenServiceEqualOpenStore = settleRuleDTO.whenServiceEqualOpenStore==1?['1']:[];
            this.settleRuleDTO = settleRuleDTO; // 归属佣金结算规则
          }
          if(data.result.sendSettleRuleDTO){
            var sendSettleRuleDTO = data.result.sendSettleRuleDTO
            sendSettleRuleDTO.openSms = sendSettleRuleDTO.openSms==1?true:false;
            sendSettleRuleDTO.sendCommissionSettle = sendSettleRuleDTO.sendCommissionSettle==1?true:false;
            sendSettleRuleDTO.whenOnNotSameStore = sendSettleRuleDTO.whenOnNotSameStore==1?true:false;
            if(sendSettleRuleDTO.commissionCalculateWay==1){
              sendSettleRuleDTO.singalAmount = sendSettleRuleDTO.commissionAmount;
              sendSettleRuleDTO.singleCheck = sendSettleRuleDTO.whenOnNotSameStore==1?['0']:[];
              sendSettleRuleDTO.goodsAmount = 0;
              sendSettleRuleDTO.goodsCheck = [];
            }else{
              sendSettleRuleDTO.goodsAmount = sendSettleRuleDTO.commissionAmount;
              sendSettleRuleDTO.goodsCheck = sendSettleRuleDTO.whenOnNotSameStore==1?['0']:[];
              sendSettleRuleDTO.singalAmount = 0;
              sendSettleRuleDTO.singleCheck = [];
            }
            this.sendSettleRuleDTO = sendSettleRuleDTO; //发货佣金结算规则
          }
          this.ruleSpecialDTOList = data.result.ruleSpecialDTOList?data.result.ruleSpecialDTOList:[]; // 特殊归属佣金结算策略
          this.sendRuleSpecialDTOList = data.result.sendRuleSpecialDTOList?data.result.sendRuleSpecialDTOList:[]; //发货特殊策略佣金结算规则列表
        }else{
          this.$message.error(data.message)
        }
      })
    },
    belongRuleSave(){  // 归属佣金结算规则保存
      this.axios.post('/api-admin/commission-settle-save',qs.stringify({
        requestProject:this.projectName,
        commissionSettleId:this.settleRuleDTO.commissionSettleId,
        openSms:this.settleRuleDTO.openSms?1:0,
        serviceStoreCommissionSettle:this.settleRuleDTO.serviceStoreCommissionSettle?1:0,
        serviceStoreGuideShareConstraint:this.settleRuleDTO.serviceStoreGuideShareConstraint?1:0,
        serviceStoreCommissionAmount:this.settleRuleDTO.serviceStoreCommissionAmount,
        serviceStoreCommissionCap:this.settleRuleDTO.serviceStoreCommissionCap,
        openStoreCommissionSettle:this.settleRuleDTO.openStoreCommissionSettle?1:0,
        openStoreGuideShareConstraint:this.settleRuleDTO.openStoreGuideShareConstraint?1:0,
        openStoreCommissionAmount:this.settleRuleDTO.openStoreCommissionAmount,
        whenNoServiceStore:this.settleRuleDTO.whenNoServiceStore.length>0?1:0,
        whenServiceEqualOpenStore:this.settleRuleDTO.whenServiceEqualOpenStore.length>0?1:0,
        openStoreCommissionCap:this.settleRuleDTO.openStoreCommissionCap,
      })).then((res)=>{
        var data = res.data;
        if(data.errorCode==0){
          this.$message.success('保存成功')
        }else{
          this.$message.error(data.message)
        }
      })
    },
    sendRuleSave(){  // 发货佣金结算规则-保存
      this.axios.post('/api-admin/send-commission-settle-rule-save',qs.stringify({
        requestProject:this.projectName,
        sendCommissionId:this.sendSettleRuleDTO.sendCommissionId,
        openSms:this.sendSettleRuleDTO.openSms?1:0,
        sendCommissionSettle:this.sendSettleRuleDTO.sendCommissionSettle?1:0,
        commissionCalculateWay:this.sendSettleRuleDTO.commissionCalculateWay,
        commissionAmount:this.sendSettleRuleDTO.commissionCalculateWay==1?this.sendSettleRuleDTO.singalAmount:this.sendSettleRuleDTO.goodsAmount,
        whenOnNotSameStore:this.sendSettleRuleDTO.commissionCalculateWay==1?(this.sendSettleRuleDTO.singleCheck.length>0?1:0):(this.sendSettleRuleDTO.goodsCheck.length>0?1:0),
        commissionCap:this.sendSettleRuleDTO.commissionCap,
      })).then((res)=>{
        var data = res.data;
        if(data.errorCode==0){
          this.$message.success('保存成功')
        }else{
          this.$message.error(data.message)
        }
      })
    },
    deleteItem(type,index,id){ // 删除
      if(type=="belong"){
        this.axios.post('/api-admin/delete-commission-settle-rule-special',qs.stringify({
          requestProject:this.projectName,
          specialStrategyId:id
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            this.ruleSpecialDTOList.splice(index,1)
          }else{
            this.$message.error(data.message)
          }
        })
      }else if(type=="deliver"){
        this.axios.post('/api-admin/delete-send-commission-settle-rule-special',qs.stringify({
          requestProject:this.projectName,
          sendCommissionSpecialId:id
        })).then(res=>{
          var data = res.data;
          if(data.errorCode==0){
            this.sendRuleSpecialDTOList.splice(index,1)
          }else{
            this.$message.error(data.message)
          }
        })
      }
    },
    addNewSpecial(type,specialStrategyId){ // 特殊归属佣金结算策略  新增、编辑
      if(type=='edit'){
        this.$router.push({
          path:'/add_special_belong',
          query:{
            id:specialStrategyId
          }
        })
      }else{
        this.$router.push('/add_special_belong')
      }
    },
    addSpecialDeliver(type,sendCommissionSpecialId){  // 特殊策略发货佣金结算规则 新增、编辑
      if(type=='edit'){
        this.$router.push({
          path:'/add_special_deliver',
          query:{
            id:sendCommissionSpecialId
          }
        })
      }else{
        this.$router.push('/add_special_deliver')
      }
    }
  },
  components: {
    topNav,
  }     
}
</script>

<style lang="less" scoped>
  .right-box{
    padding: 0;
  }
  .title{
    font-size: 16px;
    font-weight: 500;
    padding: 24px 32px;
  }
  .small-title{
    border-bottom: 1px solid #e7e7eb
  }
  .demo-ruleForm{
    padding: 0 32px;
  }
  .ques-icon{
    color:#909399;
    cursor: pointer;
  }
  .btn-r-wrap{
    padding: 24px 32px 22px 0;
    text-align: right;
  }
  .demo-ruleForm .form-child {
    width: 100%;
    padding: 22px 20px 1px 0;
    margin: 22px 0;
    background: #f5f6f9;
    box-sizing: border-box;
  }
  .table-wrap{
    padding: 0 32px 24px;
  }
    /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
