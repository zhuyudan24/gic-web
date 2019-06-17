<template>
  <div class="right-wrap ad-manage-wrap" :style="{minHeight: (bodyHeight - 164) + 'px'}">
	  <topNav v-if="addOrEdit" :navpath="navpath"></topNav>
	  <topNav v-else :navpath="navpathedit"></topNav>
	  <div class="right-content bottom-wrap">
	  	<div class="right-box bottom-content-wrap">
	  		<div class="item-content-wrap">
	  			<div class="title">特例内容设置</div>
	  			<el-form :model="specialForm" :rules="rules" label-position="right" ref="ruleForm" label-width="100px" class="special-ruleForm">
						<el-form-item label="特例名称" prop="name" class="active-name">
					    <el-input v-model="specialForm.name" @keyup.native="toInput(specialForm.name,$event)"></el-input>
					    <span class="tag-name-num">{{inputNum}}/{{inputLength}}</span>
						</el-form-item>
						<el-form-item label="权重" prop="zIndex" class="active-name">
					    <el-input v-model="specialForm.zIndex" @keyup.native="toInputZIndex(specialForm.zIndex,$event)"></el-input>
					    <!-- <span class="tag-name-num">{{inputZIndex}}/{{inputZIndexLength}}</span> -->
						</el-form-item>
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
							<vue-gic-people :projectName="projectName" :flag="true" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"></vue-gic-people>
							<div v-show="toggleTag" class="people-btn-wrap">
								<el-row>
									<el-button @click="getData" type="primary" size="small">确定</el-button>
							  	<el-button @click="cancelFilter" size="small">取消</el-button>
								</el-row>
							</div>
						</div>
						<el-form-item label="" prop="">
							<div class="two-btn">
								<el-row>
					  			<el-button @click="saveBtn('ruleForm')" type="primary">保 存</el-button>
					  			<el-button @click="backPre">返 回</el-button>
					  		</el-row>
							</div>
						</el-form-item>
					</el-form>
	  		</div>
	  		<div class="height-24"></div>
	  		<div class="item-content-wrap">
	  			<div class="title">5个轮播图设置</div>
	  			<div class="five-banner">
	  				<fiveBannerNew :carTab='3' :id="intervalServiceId" :bannerData="tableData4"></fiveBannerNew>
	  			</div>
	  		</div>
	  	</div>
	  </div>
	  <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import fiveBannerNew from 'components/basicConfig/fiveBanner/fiveBannerNew'
	import strLength from '../../../common/js/strlen'
	let qs = require('qs')
  export default {
    name: "ad_add_special",
    data(){
    	return{
    		bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
	        {
            name: '配置中心',
            path: ''
          },
	        {
	          name: '广告位管理',
	          path: ''
	        },
	        {
	          name: '特例广告位',
	          path: '/ad_manage_special'
	        },
	        {
	          name: '新增特例',
	          path: ''
	        }
	      ],
	      navpathedit: [
	        {
            name: '配置中心',
            path: ''
          },
	        {
	          name: '广告位管理',
	          path: ''
	        },
	        {
	          name: '特例广告位',
	          path: '/ad_manage_special'
	        },
	        {
	          name: '编辑特例',
	          path: ''
	        }
	      ],
	      addOrEdit:false,
	      tableData4:[],
	      specialForm:{
	      	name:'',
	      	zIndex:'',
	      },
	      rules: {		// 规则
	        name: [
	          { required: true, message: '请输入特例名称', trigger: 'blur' }
	        ],
	        zIndex: [
	          { required: true, message: '请输入权重', trigger: 'change' }
	        ]
		    },
		    intervalServiceId:"",
		    /* 名称输入框限制字符个数 */
        inputNum: 0, 		// 输入文字个数(两个字母/汉字算一个字)
        inputLength: 20, 	// 限制最大字数
        /* 权重输入框限制字符个数 */
        inputZIndex: 0, 		// 输入文字个数(两个字母/汉字算一个字)
        inputZIndexLength: 20, 	// 限制最大字数
				radioPeople:"0",
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

				saveBool:true,	// 保存按钮
				
	    }
    },
    computed:{
    	
    },
    mounted(){
    	// window.onresize = () => {
      //   return (() => {
      //     this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
      //   })()
      // };
    	this.getEditSpecialData()
    },
    methods:{
    	async getEditSpecialData(){
    		this.intervalServiceId = this.$route.query.intervalServiceId;
    		if(this.intervalServiceId){	// 编辑
    			this.addOrEdit = false;
    		}else{	// 新增
    			this.intervalServiceId='';
    			this.addOrEdit = true;
    		}
				let res = await this.axios.post('/api-admin/interval-service-case',qs.stringify({
					requestProject:'gic-web',
					intervalServiceId:this.intervalServiceId
				}))
				var data = res.data;
				// console.log(data);
				if(data.errorCode==0){
					this.tableData4 = data.result.caseList;
					if(this.intervalServiceId){
						var editData = data.result.intervalServiceDTO;
						this.specialForm.zIndex = editData.serviceWeight;
						this.specialForm.name = editData.serviceName;
						var len = strLength.getZhLen(this.specialForm.name);  // 特例名称的字符长度
						this.inputNum = len;
						var l = strLength.getZhLen(this.specialForm.zIndex.toString());  // 权重的字符长度
						this.inputZIndex = l;
						this.searchParams = editData.searchParams;	// 筛选条件
						this.radioPeople = editData.visibleType.toString();
						if(this.radioPeople=="0"){

						}else if(this.radioPeople=="2"){
							if(this.searchParams){
								this.memberGroupReRender = false;
								this.defaltSelected = await this.getMemberGroupList();
								this.tagGroupIdList = this.defaltSelected;
								this.$nextTick(_ => {
									this.memberGroupReRender = true;
								});
								// console.log(this.defaltSelected);
							}
						}else if(this.radioPeople=="1"){
							this.useId = data.result.selectorId;
							this.hasSearchData = this.searchParams;
						}
					}
				}else{
					this.$message.error(data.message);
				}
			},
			getMemberGroupList(){
				return new Promise((resolve,reject) => {
					this.axios.post('/api-admin/get-member-tag-group-list',qs.stringify({
						requestProject:'gic-web',
						tagGroupIds:this.searchParams
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
    	toInput(value,e) {  // 名称输入时控制字符数量
        var that = this;
        that.specialForm.name = strLength.getByteVal(e.target.value,that.inputLength);
        that.inputNum = strLength.getZhLen(that.specialForm.name);
    	},
    	toInputZIndex(value,e) {  // 权重输入时控制字符数量
        this.specialForm.zIndex = strLength.getCharVal(String(this.specialForm.zIndex).replace(/[^\d]/g,''),20);
    	},
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
				this.tagGroupIdList = data;
			},
			handleDataLeft(selectedData, selectionToRemove) { // selectedData 剔除后剩下的数据  selectionToRemove 剔除的数据
				this.tagGroupIdList = selectedData;
			},
    	backPre(){	// 返回按钮
    		this.$router.push({
  				path:'/ad_manage_special',
  				query:{
  					carTab:3
  				}
  			});
    	},
    	saveBtn(formName){
    		var that = this;
    		that.$refs[formName].validate((valid) => {
          if (valid) {
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    	},
    	saveData(){
    		if(this.saveBool){
    			this.saveBool = false;
    			this.axios.post('/api-admin/interval-service-case-save',qs.stringify({
	    			requestProject:'gic-web',
			  		serviceName:this.specialForm.name,
			  		serviceWeight:this.specialForm.zIndex,
			  		intervalServiceId:this.intervalServiceId,
			  		searchParams:this.searchParams,
						detailParams:this.sendObj,
						visibleType:this.radioPeople,
			  	})).then((res)=>{
			  		var data = res.data;
						// console.log(data);
						this.saveBool = true;
			  		if(data.errorCode==0){
			  			this.$router.push({
			  				path:'/ad_manage_special',
			  				query:{
			  					carTab:3
			  				}
			  			});
	    				this.$message.success('保存成功');
			  		}else{
			  			this.$message({
	              type: 'error',
	              message: data.message
	            });
			  		}
			  	})
    		}
    	}
    },
    components: {
     	topNav,
     	fiveBannerNew
	  }
  }
</script>

<style lang="less" scoped>
	.right-box{
		padding: 0;
		position: relative;
	}
	.right-wrap{
		// padding-bottom: 88px;
	}
	.bottom-content-wrap{
    .item-content-wrap{
    	background: #fff;
    	border-radius: 2px;
    	.special-ruleForm{
    		padding: 24px 32px;
	    	.active-name{
					position: relative;
					width: 550px;
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
    	}
    	.five-banner{
    		padding:24px 32px;
    	}
    }
    .title{
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
    .save-btn{
    	position: absolute;
    	bottom: 0;
    	left: 0;
    	width: 100%;
    	background: #fff;
    	text-align: center;
    	padding: 24px 0;
    	z-index: 10;
    }
	}
	.height-24{
    width: 100%;
    height: 24px;
    background: #f0f2f5;
  }
	.special-ruleForm /deep/ .el-form-item:last-child{
		margin-bottom: 0
	}
	/*人群筛选器*/
	.select-people-ad{
		padding: 0 32px 24px;
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

	.two-btn{
		padding-bottom: 22px;
	}

	// 会员分组
	.select-people  /deep/ .group-set-transfer{
		padding-top: 0;
	}
</style>
