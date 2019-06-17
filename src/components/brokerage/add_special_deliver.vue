<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="特殊策略名称" prop="specialStrategyName" class="input-width">
            <dm-input :byteType="1" type="text" v-model="ruleForm.specialStrategyName" :maxlength="16"></dm-input>
          </el-form-item>
          <el-form-item label="适用渠道" prop="applicableChannel">
            <label slot="label">适用渠道
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="只有适用渠道的订单才会命中该特殊策略">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-checkbox-group v-model="ruleForm.applicableChannel">
              <el-checkbox label="1">GIC微商城</el-checkbox>
              <el-checkbox label="2">微盟微商城</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="适用人群" prop="visibleCondition">
            <label slot="label">适用人群
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="只有适用人群的消费订单才会命中该特殊策略">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-radio-group v-model="ruleForm.visibleCondition">
              <el-radio label="0">所有会员</el-radio>
							<el-radio label="2">会员分组</el-radio>
	  					<el-radio label="1">自定义人群</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.visibleCondition=='2'">
            <vue-gic-member-group
              class="select-people-ad"
              v-if="memberGroupReRender"
              ref="memberGroup"
              :defaltSelected="defaltSelected"
              :height='height'
              :projectName="projectName"
              :headerList='headerList'
              :effectiveStatus="effectiveStatus"
              @handleDataTransferred="handleDataTransferred"
              @handleDataLeft="handleDataLeft">
            </vue-gic-member-group>
          </div>
          <div v-if="ruleForm.visibleCondition=='1'" class="select-people-ad">
            <vue-gic-people :projectName="projectName" :flag="true" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
            <div v-show="toggleTag" class="people-btn-wrap">
              <el-row>
                <el-button @click="getData" type="primary" size="small">确定</el-button>
                <el-button @click="cancelFilter" size="small">取消</el-button>
              </el-row>
            </div>
          </div>
          <!-- <el-form-item label="适用商品" >
            <label slot="label">适用商品
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="消费订单中的商品，只有满足了适用商品的范围，才执行归属佣金的结算">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
          </el-form-item> -->
          <!-- 商品选择器 -->
          <el-form-item label="适用门店">
            <label slot="label">适用门店
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="只有当发货门店满足适用门店范围，才执行归属佣金的结算。">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <vue-gic-store-new ref="storeNew" :options="optionsStore" :uuid.sync="uuid" :isAdd="isAdd"></vue-gic-store-new>
          </el-form-item>
          <!-- <el-form-item label="发货佣金结算">
            <label slot="label">发货佣金结算
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="开启该项佣金结算，系统将为商品的发货门店做佣金结算。">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="ruleForm.sendCommissionSettle"></el-switch>
          </el-form-item> -->
          <el-form-item label="佣金计算方式">
            <el-radio-group v-model="ruleForm.commissionCalculateWay">
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
          <el-form-item v-show="ruleForm.commissionCalculateWay==1" label="佣金额度">
            <label slot="label">佣金额度
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="设置每一笔发货单所能得到的固定佣金。">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-input-number v-model="ruleForm.singalAmount" controls-position="right" :min="0.00" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
            <div style="margin-top:10px;">
              <el-checkbox v-model="ruleForm.singleCheck" label="0">仅当发货门店和归属门店为非同一家门店时生效。   <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="当发货门店和关联消费订单的归属门店（服务门店或开卡门店）是同一家店，将不发放发货佣金。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </el-checkbox>
            </div>
          </el-form-item>
          <el-form-item v-show="ruleForm.commissionCalculateWay==2" label="单品佣金额度">
            <label slot="label">单品佣金额度
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="佣金细化到单品计算，此处设置每件商品的佣金额度。">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-input-number v-model="ruleForm.goodsAmount" controls-position="right" :min="0.00" :max="100.00" :step="0.01" :precision="2"></el-input-number> %
            <div style="margin-top:10px;">
              <el-checkbox v-model="ruleForm.goodsCheck" label="0">仅当发货门店和归属门店为非同一家门店时生效。    <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="当发货门店和关联消费订单的归属门店（服务门店或开卡门店）是同一家店，将不发放发货佣金。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </el-checkbox>
            </div>
          </el-form-item>
          <el-form-item v-show="ruleForm.commissionCalculateWay==2" label="单品佣金封顶">
            <label slot="label">单品佣金封顶
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="单品佣金封顶额度的设置，一般针对高价值商品做控制。">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-input-number v-model="ruleForm.commissionCap" controls-position="right" :min="0.00" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
          </el-form-item>
          <el-form-item >
            <el-row>
              <el-button type="primary" @click="sureSave('ruleForm')">保 存</el-button>
              <el-button @click="goBack">返 回</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
let qs = require('qs')
export default {
  name: "add_special_deliver", 
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
          path: '/brokerage_rule'
        },
        {
          name: ' 新建特殊发货佣金结算策略',
          path: ''
        }
      ],
      ruleForm: {
        sendCommissionSpecialId:"",
        specialStrategyName:"", //特殊策略名称
        applicableChannel:[], //适用渠道 1：GIC微商城 2：微盟微商城  英文逗号隔开，多选
        visibleCondition:'0', //可见人群；1人群筛选器 2:会员分组 0:分组
        limitCondition:"", //     * 可见人群参数值
        productLimitCondition:"", //适用商品参数值
        storeWidgetId:"", //门店控件id
        sendCommissionSettle:false, //发货佣金结算 0：关闭 1：开启
        commissionCalculateWay:1, //佣金计算方式 1：按单数 2：按商品成交价
        commissionCap:0, //单品佣金封顶，单位是元
        singalAmount:0,
        singleCheck:[],
        goodsAmount:0,
        goodsCheck:[],
      },
      rules: {
        specialStrategyName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        applicableChannel: [
          { type: 'array', required: true, message: '请至少选择一个渠道', trigger: 'change' }
        ],
      },
      /*  人群筛选器 */
      sceneValue: 'member',  // 场景值
      useId:'',
      searchParams:'',
      sendObj:'',
      hasSearchData: '' , // 当前页回显的数据(接口返回)
      toggleTag:false,
      
      // 会员分组
      defaltSelected: [], //  默认穿梭窗已选入数据 groupName, isRealTime必传， 其他若无需求可不传
      height:500, // 穿梭窗高度， 默认是543
      headerList: ['isRealTime', 'latestUpdateTime', 'updateType', 'effectiveStatus', 'effectiveDate'], // 表头配置，默认全部，分组名称默认显示不可配置
      effectiveStatus:1, // 不传： 所有状态 1： 有效 0： 失效
      tagGroupIdList:[],  // 右侧  选中的数据
      memberGroupReRender:true,
      // 选择门店
      uuid:'',  // 新增传空，编辑必传,
      optionsStore:[0,1,3,4,5],
      isAdd:true,
      // 编辑
      sendCommissionSpecialId:'', // 主键id
    }  
  },
  mounted(){
    this.getDetailData()
  },
  watch:{
    uuid(val){
      console.log('uuid======>'+val);
      // this.uuid = val;
    },
  },
  methods: {
    async getDetailData(){
      this.sendCommissionSpecialId = this.$route.query.id;
      if(this.sendCommissionSpecialId){ // 编辑
        this.navpath[2].name = '编辑特殊发货佣金结算策略';
        let res = await this.axios.post('/api-admin/get-send-commission-settle-rule-special',qs.stringify({
          requestProject:this.projectName,
          sendCommissionSpecialId:this.sendCommissionSpecialId
        }))
        var data = res.data;
        if(data.errorCode == 0){
          var _result = data.result;
          _result.applicableChannel = _result.applicableChannel.split(',');
          _result.sendCommissionSettle = _result.sendCommissionSettle==1?true:false;
          this.uuid = _result.storeWidgetId;
          this.isAdd = false;
          if(_result.commissionCalculateWay==1){ // 佣金计算方式
            _result.singalAmount = _result.commissionAmount;
            _result.singleCheck = _result.whenOnNotSameStore==1?['0']:[];
            _result.goodsAmount = 0;
            _result.goodsCheck = [];
          }else{
            _result.goodsAmount = _result.commissionAmount;
            _result.goodsCheck = _result.whenOnNotSameStore==1?['0']:[];
            _result.singalAmount = 0;
            _result.singleCheck = [];
          }
          _result.visibleCondition = _result.visibleCondition.toString();
          this.searchParams = _result.limitCondition;	// 筛选条件
          if(_result.visibleCondition=="0"){

          }else if(_result.visibleCondition=="2"){
            if(this.searchParams){
              this.memberGroupReRender = false;
              this.defaltSelected = await this.getMemberGroupList(this.searchParams);
              this.tagGroupIdList = this.defaltSelected;
              this.$nextTick(_ => {
                this.memberGroupReRender = true;
              });
            }
          }else if(_result.visibleCondition=="1"){
            this.useId = _result.sendCommissionSpecialId;
            this.hasSearchData = this.searchParams;
          }
          this.ruleForm = _result;
        }else{
          this.$message.error(data.message)
        }
      }else{ // 新增

      }
    },
    getMemberGroupList(limitCondition){  // 获取会员分组要回显的数据
      return new Promise((resolve,reject) => {
        this.axios.post('/api-admin/get-member-tag-group-list',qs.stringify({
          requestProject:this.projectName,
          tagGroupIds:limitCondition
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            var defaltSelected = data.result || [];
            resolve(defaltSelected);
          }else{
            reject(data);
            this.$message.error(data.message)
          }
        })
      })
    },
    /* 人群筛选器 start */
    getData() {	// 父组件调用子组件方法,触发父组件事件
      this.$refs.peopleFilter.confirmSet()
    },
    findFilter(value){	// 子组件触发父组件事件,返回过滤条件数据
      this.searchParams = value;
      if(this.searchParams){
        // this.saveData();
      }
    },
    cancelFilter(){
      this.$refs.peopleFilter.cancelSet();
    },
    getBackData(val) {
      this.sendObj = val;
    },
    // 隐藏保存按钮和确认按钮  (子组件会调用)
    hideBtn() {
      this.toggleTag= false;
    },
    // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
    editShow() {
      this.toggleTag= true
    },
    editHide() {
      this.toggleTag= false
    },
    // 会员分组
    handleDataTransferred(data) { // 选择分组后子组件触发的事件
      this.tagGroupIdList = data;
    },
    handleDataLeft(selectedData, selectionToRemove) { // selectedData 剔除后剩下的数据  selectionToRemove 剔除的数据
      this.tagGroupIdList = selectedData;
    },
    // 确认新建
    sureSave(formName){
      var that = this;
      that.$refs[formName].validate((valid)=>{
        if(valid){
          if(that.ruleForm.visibleCondition=="0"){ // 所有
		        	that.searchParams = '';
		        	that.sendObj = "";
		        	that.saveData();
          }else if(that.ruleForm.visibleCondition=="2"){  // 会员分组
            that.sendObj = "";
            if(that.tagGroupIdList && that.tagGroupIdList.length>0){
              var ids = "";
              that.tagGroupIdList.forEach((item)=>{
                ids += item.memberTagGroupId + ',';
              })
              that.searchParams = ids.substring(0,ids.length-1);
              that.saveData();
            }else{
              this.$message.error('请选择会员分组')
            }
          }else if(that.ruleForm.visibleCondition=="1"){	// 若开启人群筛选器
            that.$refs.peopleFilter.confirmSet();	// 人群筛选器  组件调用子组件方法,触发父组件事件
            setTimeout(function(){
              if(that.searchParams!='{}' && that.sendObj && that.sendObj!='{}'){
                that.saveData()
              }
            },500)
          }
        }else{
          console.log('error');
          return false;
        }
      })
    },
    saveData(){
      console.log(this.uuid);
      this.axios.post('/api-admin/send-commission-settle-rule-special-save',qs.stringify({
        requestProject:this.projectName,
        sendCommissionSpecialId:this.ruleForm.sendCommissionSpecialId,
        specialStrategyName:this.ruleForm.specialStrategyName,
        applicableChannel:this.ruleForm.applicableChannel.join(','),
        visibleCondition:parseInt(this.ruleForm.visibleCondition),
        limitCondition:this.searchParams,
        productLimitCondition:this.ruleForm.productLimitCondition,
        storeWidgetId:this.uuid,
        sendCommissionSettle:this.ruleForm.sendCommissionSettle?1:0,
        commissionCalculateWay:this.ruleForm.commissionCalculateWay,
        commissionAmount:this.ruleForm.commissionCalculateWay==1?this.ruleForm.singalAmount:this.ruleForm.goodsAmount,
        whenOnNotSameStore:this.ruleForm.commissionCalculateWay==1?(this.ruleForm.singleCheck.length>0?1:0):(this.ruleForm.goodsCheck.length>0?1:0),
        commissionCap:this.ruleForm.commissionCap,
        searchParams:this.searchParams,
        detailParams:this.sendObj,
      })).then(res=>{
        var data = res.data;
        if(data.errorCode==0){
          this.$message.success('保存成功');
          this.goBack();
        }else{
          this.$message.error(data.message)
        }
      })
    },
    // 返回
    goBack() {
      this.$router.push('/brokerage_rule')
    },
  },
  components: {
    topNav,
  }     
}
</script>

<style lang="less" scoped>
  .ques-icon{
    color:#909399;
    cursor: pointer;
  }
  .input-width /deep/ .dm-input{
    width: 460px;
  }
  .demo-ruleForm .form-child {
    width: 100%;
    padding: 22px 20px 1px 0;
    margin: 22px 0;
    background: #f5f6f9;
    box-sizing: border-box;
  }
  /*人群筛选器*/
	.select-people-ad{
		padding: 0 26px 24px;
		background: #fff;
	}
	.select-people-ad /deep/ .filter-content{
		padding: 24px 0 22px 0;
		margin-top: 0;
	}
	.select-people-ad .people-content{
		padding: 0;
		color: #606266;
	}
	.select-people-ad /deep/ .detail{
		margin-bottom: 14px;
	}
	.select-people-ad /deep/ .filter-content .member-templates-condition-title{
		font-size: 14px;
		color: #606266;
		text-align: right;
		height: 24px;
		line-height: 24px;
		width: 100px;
		z-index: 1;
		padding-top: 34px;
		padding-right: 12px;
		box-sizing: border-box;
	}
	.select-people-ad /deep/ .screening-condition{
		margin-top: 0;
		padding: 24px 0;
	}
	.select-people-ad /deep/ .marginLeft134{
		margin-left: 100px;
	}
	.people-btn-wrap{
		width: 100%;
		background: #f2f3f4;
		box-sizing: border-box;
		padding: 0 0 24px 100px;
	}
	// 会员分组
	.select-people  /deep/ .group-set-transfer{
		padding-top: 0;
  }
  // 选择门店
  .store-wrap /deep/ .dm-store__inputtag--total{
    top: 2px;
  }
</style>
