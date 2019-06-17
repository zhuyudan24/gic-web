<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
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
              <!-- <el-checkbox label="1">GIC微商城</el-checkbox> -->
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
            <vue-gic-people :projectName="projectName" :flag="true" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
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
          <el-form-item label="服务门店归属佣金结算规则" label-width="200px">
            <label slot="label">服务门店归属佣金结算规则
              <el-popover
                placement="top"
                width="190"
                trigger="hover"
                content="消费会员的服务门店的佣金规则配置">
                <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
              </el-popover>
            </label>
            <el-switch v-model="ruleForm.serviceStoreCommissionSettle"></el-switch>
          </el-form-item>
          <div class="form-child" v-if="ruleForm.serviceStoreCommissionSettle">
            <el-form-item label="导购分享约束" label-width="140px">
              <label slot="label">导购分享约束
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="如果开启，当订单的分享者为导购时（通过分享者的手机号和导购手机号做匹配识别），将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="ruleForm.serviceStoreGuideShareConstraint"></el-switch>
            </el-form-item>
            <el-form-item label="单品佣金额度" label-width="140px">
              <label slot="label">单品佣金额度
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="佣金细化到单品计算，此处设置每件商品的佣金额度。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="ruleForm.serviceStoreCommissionAmount" controls-position="right" :min="0.00" :max="100.00" :step="0.01" :precision="2"></el-input-number> %
            </el-form-item>
            <el-form-item label="单品佣金封顶" label-width="140px">
              <label slot="label">单品佣金封顶
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="单品佣金封顶额度的设置，一般针对高价值商品做控制。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="ruleForm.serviceStoreCommissionCap" controls-position="right" :min="0" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
            </el-form-item>
            <el-form-item label="适用门店" label-width="140px" class="store-wrap">
              <label slot="label">适用门店
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="只有当消费会员的服务门店满足适用门店范围，才执行归属佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <vue-gic-store-new ref="storeNew"  :options="optionsStore" :uuid.sync="uuid" :isAdd="isAdd"></vue-gic-store-new>
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
            <el-switch v-model="ruleForm.openStoreCommissionSettle"></el-switch>
          </el-form-item>
          <div class="form-child" v-if="ruleForm.openStoreCommissionSettle">
            <el-form-item label="导购分享约束" label-width="140px">
              <label slot="label">导购分享约束
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="如果开启，当订单的分享者为导购时（通过分享者的手机号和导购手机号做匹配识别），将不执行该项佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-switch v-model="ruleForm.openStoreGuideShareConstraint"></el-switch>
            </el-form-item>
            <el-form-item label="单品佣金额度" label-width="140px">
              <label slot="label">单品佣金额度
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="佣金细化到单品计算，此处设置每件商品的佣金额度。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="ruleForm.openStoreCommissionAmount" controls-position="right" :min="0.00" :max="100.00" :step="0.01" :precision="2"></el-input-number> %
              <div style="margin-top:10px;">
                <el-checkbox v-model="ruleForm.whenNoServiceStore" label="0">仅当会员无服务门店时生效</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="单品佣金封顶" label-width="140px">
              <label slot="label">单品佣金封顶
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="单品佣金封顶额度的设置，一般针对高价值商品做控制。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <el-input-number v-model="ruleForm.openStoreCommissionCap" controls-position="right" :min="0" :max="999999.99" :step="0.01" :precision="2"></el-input-number> 元
            </el-form-item>
            <el-form-item label="适用门店" label-width="140px" class="store-wrap">
              <label slot="label">适用门店
                <el-popover
                  placement="top"
                  width="190"
                  trigger="hover"
                  content="只有当消费会员的开卡门店满足适用门店范围，才执行归属佣金的结算。">
                  <i slot="reference" class="iconfont tooltip-icon icon-xinxixianshi"></i>
                </el-popover>
              </label>
              <vue-gic-store-new ref="storeNew2" :options="optionsStore2" :uuid.sync="uuid2" :isAdd="isAdd2"></vue-gic-store-new>
            </el-form-item>
          </div>
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
  name: "add_special_belong", 
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
          name: '新建特殊归属佣金结算策略',
          path: ''
        }
      ],
      ruleForm: {
        specialStrategyId:"",
        specialStrategyName:"",  //特殊策略名称
        applicableChannel:[], //适用渠道 1：GIC微商城 2：微盟微商城  英文逗号隔开，多选
        visibleCondition:'0',  //可见人群；1人群筛选器 2:会员分组 0:所有
        limitCondition:"",  //可见人群参数值
        productLimitCondition:"", //适用商品参数值
        serviceStoreCommissionSettle:false, //服务门店佣金结算规则1:开启 0：关闭
        serviceStoreGuideShareConstraint:false, //服务门店导购分享约束1：约束 0：不约束
        serviceStoreCommissionAmount:0, //单品佣金额度，单位是%，数值不超过100
        serviceStoreCommissionCap:0, //单品佣金封顶，单位是元
        serviceStoreWidgetId:"", //服务门店门店控件id
        openStoreCommissionSettle:false, //开卡门店佣金结算规则1:开启 0：关闭
        openStoreGuideShareConstraint:false, //开卡门店导购分享约束1：约束 0：不约束
        openStoreCommissionAmount:0, //开卡单品佣金额度，单位是%，数值不超过100
        whenNoServiceStore:[], //仅当会员无服务门店时生效 1：启动 0：不启动
        openStoreCommissionCap:0, //单品佣金封顶，单位是元
        openStoreWidgetId:"", //开卡门店适用门店控件id
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
      uuid2:'',  // 新增传空，编辑必传,
      optionsStore2:[0,1,3,4,5],
      isAdd2:true,
      // 编辑
      specialStrategyId:'', // 主键id
    }  
  },
  watch:{
    uuid(val) {
      console.log('uuid========>'+val)
    }
  },
  mounted(){
    this.getDetailData()
  },
  methods: {
    async getDetailData(){
      this.specialStrategyId = this.$route.query.id;
      if(this.specialStrategyId){ // 编辑
        this.navpath[2].name = '编辑特殊归属佣金结算策略';
        let res = await this.axios.post('/api-admin/get-commission-settle-rule-special',qs.stringify({
          requestProject:this.projectName,
          specialStrategyId:this.specialStrategyId
        }))
        var data = res.data;
        if(data.errorCode == 0){
          var _result = data.result;
          _result.applicableChannel = _result.applicableChannel.split(',');
          _result.serviceStoreCommissionSettle = _result.serviceStoreCommissionSettle==1?true:false;
          _result.serviceStoreGuideShareConstraint = _result.serviceStoreGuideShareConstraint==1?true:false;
          _result.openStoreCommissionSettle = _result.openStoreCommissionSettle==1?true:false;
          _result.openStoreGuideShareConstraint = _result.openStoreGuideShareConstraint==1?true:false;
          _result.whenNoServiceStore = _result.whenNoServiceStore==1?['0']:[];
          this.uuid = _result.serviceStoreWidgetId;
          this.uuid2 = _result.openStoreWidgetId;
          this.isAdd = false;
          this.isAdd2 = false;
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
            this.useId = _result.specialStrategyId;
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
          if(that.ruleForm.serviceStoreCommissionSettle || that.ruleForm.openStoreCommissionSettle){
            console.log('至少选中了一个');
          }else{
            that.$message.error('服务门店归属佣金结算规则与开卡门店归属佣金结算规则必须开启其中一项');
            return;
          }
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
      this.axios.post('/api-admin/commission-settle-rule-special-save',qs.stringify({
        requestProject:this.projectName,
        specialStrategyId:this.ruleForm.specialStrategyId,
        specialStrategyName:this.ruleForm.specialStrategyName,
        applicableChannel:this.ruleForm.applicableChannel.join(','),
        visibleCondition:parseInt(this.ruleForm.visibleCondition),
        limitCondition:this.searchParams,
        productLimitCondition:this.ruleForm.productLimitCondition,
        serviceStoreCommissionSettle:this.ruleForm.serviceStoreCommissionSettle?1:0,
        serviceStoreGuideShareConstraint:this.ruleForm.serviceStoreGuideShareConstraint?1:0,
        serviceStoreCommissionAmount:this.ruleForm.serviceStoreCommissionAmount,
        serviceStoreCommissionCap:this.ruleForm.serviceStoreCommissionCap,
        serviceStoreWidgetId:this.uuid,
        openStoreCommissionSettle:this.ruleForm.openStoreCommissionSettle?1:0,
        openStoreGuideShareConstraint:this.ruleForm.openStoreGuideShareConstraint?1:0,
        openStoreCommissionAmount:this.ruleForm.openStoreCommissionAmount,
        whenNoServiceStore:this.ruleForm.whenNoServiceStore.length>0?1:0,
        openStoreWidgetId:this.uuid2,
        openStoreCommissionCap:this.ruleForm.openStoreCommissionCap,
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
