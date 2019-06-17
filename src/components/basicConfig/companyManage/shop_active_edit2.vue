<template>
  <div class="right-wrap">
  	<topNav v-show="type!='recycle' && !editBool" :navpath="navpath"></topNav>
  	<topNav v-show="type!='recycle' && editBool" :navpath="navpathedit"></topNav>
  	<topNav v-show="type=='recycle'" :navpath="navpathRecycle"></topNav>
  	<div class="right-content" @click="selectTreeHide">
  		<div class="right-box" v-loading="loading">
				<el-form :model="ruleForm" :rules="rules" label-position="right" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<h2 class="title-wrap">活动设置</h2>
					<div class="input-wrap">
						<el-form-item label="活动名称" prop="name" class="active-name">
							<div class="keyword-input">
	              <el-input v-model="ruleForm.name" @keyup.native="toInput(ruleForm.name,$event)"></el-input>
	              <span class="text-num">{{inputNum}}/{{inputLength}}</span>
	            </div>
						</el-form-item>
						<el-form-item label="活动时间" class="active-name is-required" :class="{'is-error':errorBool1}">
					    <el-date-picker
					      v-model="ruleForm.activeDate"
					      type="daterange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期"
					      :picker-options="pickerOptions"
					      value-format="yyyy-MM-dd"
					      @change="selectActiveDate">
					    </el-date-picker>
					    <p v-show="errorBool1" class="el-form-item__error">{{ errorMsg1 }}</p>
						</el-form-item>
						<!-- <el-form-item label="上线时间" class="active-name" prop="onlineDate">
							<el-date-picker
					      v-model="ruleForm.onlineDate"
					      align="left"
					      type="date"
					      placeholder="选择日期"
					      :picker-options="pickerOptions1"
					      value-format="yyyy-MM-dd"
					      @change="selectOnlineDate"
					      >
					    </el-date-picker>
						</el-form-item> -->
						<div class="online-date">
							<span class="online-date-label">上线时间
								<el-popover
							    placement="top"
							    title=""
							    width="160"
							    trigger="hover"
							    content="活动在服务号显示的时间">
							    <i slot="reference" class="tooltip-icon el-icon-question"></i>
							  </el-popover></span>
							<div class="choose-date el-form-item" :class="{'is-error':errorBool2}">
								<el-date-picker
						      v-model="ruleForm.onlineDate"
						      align="left"
						      type="date"
						      placeholder="选择日期"
						      :picker-options="pickerOptions1"
						      value-format="yyyy-MM-dd"
						      @change="selectOnlineDate"
						      >
						    </el-date-picker>
						    <p v-show="errorBool2" class="el-form-item__error" style="padding-left: 100px;">{{ errorMsg2 }}</p>
							</div>
						</div>
						<el-form-item label="活动类型" prop="activeStyle">
					    <el-radio-group v-model="ruleForm.activeStyle">
					      <el-radio label="0">促销</el-radio>
					      <el-radio label="1">新品</el-radio>
					      <el-radio label="2">免费</el-radio>
					      <el-radio label="3">赠送</el-radio>
					      <el-radio label="4">试用</el-radio>
					      <el-radio label="5">抽奖</el-radio>
					      <el-radio label="6">活动</el-radio>
					    </el-radio-group>
						</el-form-item>
						<el-form-item label="活动说明" prop="desc" class="active-info">
							<el-input type="textarea" v-model="ruleForm.desc" @keyup.native="toInput3(ruleForm.desc,$event)" ></el-input>
	             <span class="text-num">{{textNum}}/{{textLength}}</span>
						</el-form-item>
						<el-form-item label="选择门店" prop="chooseShop" style="margin-top:34px" class="is-required">
					    <selectShopTree :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></selectShopTree>
						</el-form-item>
					</div>
					<div class="height-24"></div>
					<h2 class="title-wrap">人群设置</h2>
					<div class="input-wrap">
						<el-form-item label="筛选条件" prop="">
							<el-radio v-model="radioPeople" label="0">所有会员</el-radio>
							<el-radio v-model="radioPeople" label="2">会员分组</el-radio>
	  					<el-radio v-model="radioPeople" label="1">自定义人群</el-radio>
  					</el-form-item>
						<div v-if="radioPeople=='2'">
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
						<div v-if="radioPeople=='1'" class="select-people-ad">
							<vue-gic-people :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
							<div v-show="toggleTag" class="people-btn-wrap">
								<el-row>
									<el-button @click="getData" type="primary" size="small">确定</el-button>
									<el-button @click="cancelFilter" size="small">取消</el-button>
								</el-row>
							</div>
						</div>
					</div>
    		</el-form>
    		<div class="btn-fixed-wrap btn-fixed-two" :class="{'m-left':$store.state.show}">
		      <el-row>
		        <el-button :disabled="saveBtnBool"  @click="saveBtn('ruleForm')" type="primary" size="small">保 存</el-button>
		        <el-button @click="preBack" size="small">返 回</el-button>
		      </el-row>
		    </div>
  		</div>
  	</div>
  	<vue-gic-footer></vue-gic-footer>
  	<!-- 不能编辑的活动 -->
    <el-dialog
      title="提示"
      :visible.sync="contactDialog"
      width="500px">
      <span>已结束的活动不能编辑哦</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="contactDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import strLength from '../../../common/js/strlen'
	import selectShopTree from 'components/basicConfig/selectShopTree/selectShopTreeMany'
	let qs = require('qs')
  export default {
    name: "shop_active_edit",
    data(){
    	return {
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
            name: '门店活动',
            path: '/shop_active'
          },
          {
            name: '新建活动',
            path: ''
          }
        ],
        navpathedit: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '企业资料',
            path: ''
          },
          {
            name: '门店活动',
            path: '/shop_active'
          },
          {
            name: '编辑活动',
            path: ''
          }
        ],
        navpathRecycle: [
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
            name: '门店列表',
            path: '/shop_list'
          },
          {
            name: '门店回收站',
            path: '/shop_list_recycle'
          },
          {
            name: '待处理事务',
            path: '/shop_recycle_event'
          },
          {
            name: '编辑活动',
            path: ''
          }
        ],
        editBool:false,	
				ruleForm: {
	      	name: '',
	      	activeDate: [],
	      	onlineDate: '',
	      	activeStyle:'0',
	      	desc:''
	      },
	      rules: {		// 规则
	        name: [
	            { required: true, message: '请输入活动名称', trigger: 'blur' }
	        ],
	        desc: [
	            { required: true, message: '请输入活动说明', trigger: 'blur' }
	        ]
		    },
		    pickerOptions:{	// 活动时间
		    	disabledDate(time) {
			      return time.getTime() < Date.now() - 8.64e7
			    }
		    },
		    pickerOptions1: {	// 上线时间
	        disabledDate(time) {
	          return time.getTime() < Date.now() - 8.64e7
	        },
	        shortcuts: [{
	          text: '今天',
	          onClick(picker) {
	            picker.$emit('pick', new Date());
	          }
	        }, {
	          text: '昨天',
	          onClick(picker) {
	            const date = new Date();
	            date.setTime(date.getTime() - 3600 * 1000 * 24);
	            picker.$emit('pick', date);
	          }
	        }, {
	          text: '一周前',
	          onClick(picker) {
	            const date = new Date();
	            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
	            picker.$emit('pick', date);
	          }
	        }]
	      },
	      /*选择日期*/
	      startDate:'',
	      endDate:'',
	      // onlineDate:'',

	  		/* 输入框限制字符个数 */
	      inputNum: 0, 		// 输入文字个数(两个字母/汉字算一个字)
	      inputLength: 25, 	// 限制最大字数
	      /* 文本域限制字符个数 */
	      textNum: 0, 		// 输入文字个数(两个字母/汉字算一个字)
	      textLength: 200, 	// 限制最大字数

	      activityId:'',
	      loading:false,

	      /* 门店 */
				sendChildData:{},
				storeType:'0',
				storeGroupId:'',  // 门店分组的id
        departStoreId:'', // 部分门店的id
        storeList:[],

        /*  人群筛选器 */
        projectName:'gic-web',
        sceneValue: 'member',  // 场景值
        useId:'',
        searchParams:'',
        sendObj:'',
        hasSearchData: '' , // 当前页回显的数据(接口返回)
        toggleTag:false,
        open:false,
        radioPeople:'0',

        type:'',	//	编辑来源
        flag:'',	// 活动是否能够编辑
        contactDialog:false,
        saveBtnBool:false,

        errorBool1:false,
        errorMsg1:'请输入活动时间',
        errorBool2:false,
				errorMsg2:'请输入上线时间',
				
				/*  人群筛选器 */
        projectName:'gic-web',
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
    	}
    },
    mounted(){
    	this.getEditData()
    },
    methods:{
    	async getEditData(){
    		this.activityId = this.$route.query.activityId;
    		if(this.$route.query.storeId){
    			this.storeId = this.$route.query.storeId;
    			this.navpathRecycle[5].path = '/shop_recycle_event?storeId='+this.storeId
    		}
    		if(this.$route.query.type){
    			this.type = this.$route.query.type;
    		}
    		if(this.$route.query.flag){
    			this.flag = this.$route.query.flag;
    			if(this.flag=='edit'){
    				this.contactDialog = true;
    				this.saveBtnBool = true
    			}
    		}
    		if(this.activityId){	// 存在, 编辑
    			this.loading = true;
    			this.editBool = true;
	    		this.axios.post('/api-admin/activity_detail',qs.stringify({
	          requestProject:'gic-web',
	          activityId:this.activityId
					}))
					// .then((res)=>{
	          var data = res.data;
	          console.log(data);
	          if(data.errorCode==0){
	          	this.loading = false;
	          	var result = data.result;
	          	this.ruleForm.name = result.activityName;	// 名称
			        this.startDate = this.dateFormat(result.activityStartTime);	// 活动开始时间
			        this.endDate = this.dateFormat(result.activityEndTime);	// 活动结束时间
			        this.ruleForm.activeDate.push(this.startDate,this.endDate);
			        this.ruleForm.onlineDate = this.dateFormat(result.activityOnlineTime);	// 上线时间
			        this.ruleForm.activeStyle = result.activityType.toString();		// 活动类型
			        this.ruleForm.desc = result.activityRemark;	// 活动说明
			        this.storeType = result.storeType.toString();	// 门店类型
			        this.searchParams = result.searchParams;	// 人群筛选器
			        this.inputNum = strLength.getZhLen(this.ruleForm.name);
							this.textNum = strLength.getZhLen(this.ruleForm.desc);
							// 人群
							if(this.radioPeople=="0"){

							}else if(this.radioPeople=="2"){
								if(this.searchParams){
									this.memberGroupReRender = false;
									this.defaltSelected = await this.getMemberGroupList();
									this.$nextTick(_ => {
										this.memberGroupReRender = true;
									});
								}
							}else if(this.radioPeople=="1"){
								this.useId = result.selectorParamsId;
								this.hasSearchData = this.searchParams;
							}
							// 门店
			        if(this.storeType=='1'){    // 向子组件传递数据
	              this.storeList = result.storeList;
	              this.sendChildData = {};
	              this.sendChildData.storeType = this.storeType;
	              var storeGroupId = '';
	              result.storeList.forEach((item)=>{
	                storeGroupId += item.storeGroupId + ',';
	              })
	              this.sendChildData.storeList = result.storeList;
	              this.sendChildData.storeGroupIds = storeGroupId.substring(0,storeGroupId.length-1);
	            } else if(this.storeType=='0'){    // 向子组件传递数据
	              this.sendChildData = {};
	              this.sendChildData.storeType = this.storeType;
	            } else if(this.storeType=='2'){    
	              this.storeList = result.storeList;
	              this.sendChildData = {};    // 向子组件传递数据
	              this.sendChildData.storeType = this.storeType;
	              var storeIds = '';
	              var storeNames = '';
	              result.storeList.forEach((item)=>{
	                storeIds += item.storeId + ',';
	                storeNames += item.storeName + ',';
	              })
	              this.sendChildData.storeList = result.storeList;
	              this.sendChildData.storeIds = storeIds.substring(0,storeIds.length-1);
	              this.sendChildData.storeName = storeNames.substring(0,storeNames.length-1);
	            }
	          }else{
	            this.$message({
	              type: 'error',
	              message: data.message
	            });
	          }
	        // })
        }else{	// 新增
        	this.editBool = false
        }
    	},
    	dateFormat(time){		// 时间戳转日期
    		var date = new Date(time);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
        return Y+M+D
    	},
	    toInput(value,e) {  // 名称输入时控制字符数量
        var that = this;
        that.ruleForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.ruleForm.name);
    	},
      toInput3(value,e) {  // 活动说明输入时控制字符数量
        var that = this;
        that.ruleForm.desc = strLength.getByteVal(e.target.value,that.textLength);
        that.textNum = strLength.getZhLen(that.ruleForm.desc);
      },
	    selectActiveDate(val){			// 选择活动时间
	    	if(val){
	    		this.startDate = val[0];
	    		this.endDate = val[1];
	    		if(this.ruleForm.onlineDate){
						if(this.ruleForm.onlineDate > this.startDate){
		    			this.errorBool1 = true;
		    			this.errorMsg1 = '活动开始时间应在上线时间之后';
			        this.ruleForm.activeDate=[];
			        this.startDate = '';
	          }else{
	          	this.errorBool1 = false;
	          }
	    		}else{
	    			this.errorBool1 = false;
	    		}
	    	}
	    },
	    selectOnlineDate(val){		// 选择上线时间
	    	// console.log(val);
	    	if(val){
	    		this.ruleForm.onlineDate = val;
	    		if(this.startDate){
	    			if(this.ruleForm.onlineDate > this.startDate){
			    		this.errorBool2 = true;
		    			this.errorMsg2 = '上线时间应在活动开始时间之前';
			        this.ruleForm.onlineDate=''
	          }else{
	          	this.errorBool2 = false;
	          }
	    		}else{
	    			this.errorBool2 = false;
	    		}
	    	}
	    },
			/* 选择门店 start*/
			selectTreeHide(){   // 调用子组件 门店树级 结构的值  隐藏
      	this.$refs.selectTree.hideTree();
			},
			getSelectGroupData(val){   // 获得子元素 门店 传递的数据
				this.storeType = val.storeType.toString();
				this.storeList=val.storeList?val.storeList:[];
			},
      /* end */

		  /* 人群筛选器 start */
			getData() {	// 父组件调用子组件方法,触发父组件事件
		    var that = this
		    that.$refs.peopleFilter.confirmSet()
		  },
		  findFilter(value){	// 子组件触发父组件事件,返回过滤条件数据
		    // console.log(value);
		    this.searchParams = value;
		    if(this.searchParams){
		    	// this.saveData();
		    }
		  },
		  cancelFilter(){
		  	this.$refs.peopleFilter.cancelSet();
		  },
		  getBackData(val) {
		    var that = this
		    // console.log(val)
		    that.sendObj = val;
		  },
		  // 隐藏保存按钮和确认按钮  (子组件会调用)
		  hideBtn() {
		    var that = this
		    that.toggleTag= false;
		  },
		  // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
		  editShow() {
		    var that = this
		    that.toggleTag= true
		  },
		  editHide() {
		    var that = this
		    that.toggleTag= false
		  },
			// 会员分组
			handleDataTransferred(data) { // 选择分组后子组件触发的事件
				// console.log(data);
				this.tagGroupIdList = data;
			},
			handleDataLeft(selectedData, selectionToRemove) { // selectedData 剔除后剩下的数据  selectionToRemove 剔除的数据
				// console.log(selectedData);
				this.tagGroupIdList = selectedData;
			},
		  preBack(){
		  	this.$router.go(-1)
		  },
		  checkError(){
		  	if(this.startDate == ''){
          this.errorMsg1 = '请选择活动时间';
          this.errorBool1 = true;
        }else{
        	this.errorBool1 = false
        }
        if(this.ruleForm.onlineDate == ''){
        	this.errorMsg2 = '请选择活动上线时间';
          this.errorBool2 = true;
        }else{
        	this.errorBool2 = false
        }
		  },
		  saveBtn(formName){
      	var that = this;
      	that.$refs[formName].validate((valid) => {
          if (valid) {
            if(that.startDate==""){
		          that.errorMsg1 = '请选择活动时间';
		          that.errorBool1 = true;
		        }else{
		        	if(that.ruleForm.onlineDate){
								if(that.ruleForm.onlineDate > that.startDate){
				    			that.errorBool1 = true;
				    			that.errorMsg1 = '活动开始时间应在上线时间之后';
					        that.ruleForm.activeDate=[];
					        that.startDate = '';
			          }else{
			          	that.errorBool1 = false;
			          }
			    		}else{
			    			that.errorBool1 = false;
			    		}
		        }

		        if(that.ruleForm.onlineDate==""){
		        	that.errorMsg2 = '请选择活动上线时间';
		          that.errorBool2 = true;
		        }else{
		        	if(that.startDate){
			    			if(that.ruleForm.onlineDate > that.startDate){
					    		that.errorBool2 = true;
				    			that.errorMsg2 = '上线时间应在活动开始时间之前';
					        that.ruleForm.onlineDate=''
			          }else{
			          	that.errorBool2 = false;
			          }
			    		}else{
			    			that.errorBool2 = false;
			    		}
		        }
		        if(!that.errorBool2 && !that.errorBool1){
		        	if(that.storeType=='1'){  // 门店分组
			          if(that.storeList.length<1){
			            that.$message.error('请选择门店分组');
			            return;
			          }
			        }else if(that.storeType=='2'){  // 部分门店
			          if(that.storeList.length<1){
			            that.$message.error('请选择部分门店');
			            return;
			          }
							}
							
							if(that.radioPeople==0){ // 所有
								that.searchParams = '';
								that.sendObj = "";
								that.saveData();
							}else if(that.radioPeople==2){  // 会员分组
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
							}else if(that.radioPeople==1){	// 若开启人群筛选器
								that.$refs.peopleFilter.confirmSet();	// 人群筛选器  组件调用子组件方法,触发父组件事件
								setTimeout(function(){
									if(that.searchParams!='{}' && that.sendObj && that.sendObj!='{}'){
										that.saveData()
									}
								},500)
							}
		        }
          } else {
            that.checkError();
            return false;
          }
        });
      },
      saveData(){  // 差一个参数
      	this.axios.post('/api-admin/activity_save?requestProject=gic-web',{
          activityId:this.activityId,
        	activityName:this.ruleForm.name,
        	activityStartTime:this.startDate,
        	activityEndTime:this.endDate,
        	activityOnlineTime:this.ruleForm.onlineDate,
        	activityRemark:this.ruleForm.desc,
        	activityType:parseInt(this.ruleForm.activeStyle),
        	storeType:parseInt(this.storeType),
        	storeList:this.storeList,
        	searchParams:this.searchParams,
        	selectorParams:this.sendObj
        },{
          headers:{'Content-Type':'application/json'}
        }).then((res)=>{
          var data = res.data;
          // console.log(data);
          this.loading = false;
          if(data.errorCode==0){
            this.$message.success('保存成功');
            if(this.type=='recycle'){
            	this.$router.push('/shop_recycle_event?storeId='+this.storeId)
            }else{
            	this.$router.push('/shop_active')
            }
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
	// @import "./shop_active.less";
	.right-box{
		padding: 0 ;
		.online-date{
			position: relative;
			width: 590px;
			margin-bottom: 22px;
			span{
				display: inline-block;
				height: 40px;
				line-height: 40px;
				position: absolute;
				font-size: 14px;
				color: #606266;
				width: 100px;
				i{
					cursor: pointer;
					padding-left: 4px;
				}
			}
			.choose-date{
				width: 590px;
				padding-left: 100px;
			}
		}
		// textarea{
		// 	resize: none;
		// 	height: 100%
		// }
	}
	.height-24{
		width: 100%;
    height: 24px;
    background: #f0f2f5;
	}
	.active-name .el-form-item /deep/ .el-input__inner,.el-textarea{
		width:490px;
	}
	.active-name /deep/ .el-input__inner{
		padding-right: 55px;
	}
	.active-name{
		position: relative;
		width: 590px;
	}
	.active-name{
    .text-num{
      position: absolute;
      right: 10px;
      bottom: 0;
      color: #c0c4cc;
      font-size: 12px;
    }
  }
	.active-info{
		position: relative;
		width: 590px;
		.text-num{
			position: absolute;
      bottom: -32px;
      color: #c0c4cc;
      font-size: 12px;
      right: 0;
		}
	}
	.save-btn{
		margin: 22px 0 24px 0;
	}
	.input-wrap{
		padding: 24px 32px 1px;
	}
	.title-wrap{
		font-weight: 700;
    color: #303133;
    font-size: 16px;
    padding-left: 32px;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;
    zoom: 1;
    height: 56px;
    line-height: 56px;
	}
	.line{
		width: 100%;
		height: 1px;
		background: #E4E7ED;
		margin: 34px 0;
	}
	.el-date-editor.el-input, .el-date-editor.el-input__inner {
	    width: 100%;
	}
  .footer{
    padding-bottom: 60px !important;
  }
  /* 人群筛选器 */
  .select-people{
  	padding: 0 32px 24px 32px;
    background: #fff;
  }
	.select-people /deep/ .filter-content{
		padding: 24px 0;
		margin-top: 0;
	}
	.select-people .people-content{
		padding: 0 16px;
		color: #606266;
	}
	.select-people /deep/ .detail{
		margin-bottom: 14px;
	}
	.select-people /deep/ .filter-content .member-templates-condition-title{
		font-size: 14px;
		color: #606266;
		text-align: left;
		height: 24px;
		line-height: 24px;
		width: 100px;
		z-index: 1;
		padding-top: 34px;
	}
	.select-people /deep/ .screening-condition{
		margin-top: 0;
		padding: 24px 0;
	}
	.select-people /deep/ .marginLeft134{
		margin-left: 100px;
	}
	.people-btn-wrap{
		width: 100%;
		background: #f2f3f4;
		box-sizing: border-box;
		padding: 0 0 24px 100px;
	}
	.online-date .online-date-label:before{
		content: "*";
    color: #f56c6c;
    margin-right: 4px;
	}
	.select-people-ad{
		margin-bottom: 22px;
	}
</style>
