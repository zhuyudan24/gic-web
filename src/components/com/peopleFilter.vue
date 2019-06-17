<template>
	<div>
		<div class="visible-crowd-modal" v-show="peopleModal">
			<div class="people-modal-content">
				<div class="people-modal-title">
					<span>可见人群</span>
					<i class="el-icon-close" @click="closeModal('ruleForm')"></i>
				</div>
				<div class="people-modal-bd">
					<el-form label-position="right" label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm">
						<el-form-item label="会员等级" class="form-item">
							<div class="group-value">
								  <el-select v-model="ruleForm.gradeLevel" multiple placeholder="请选择" class="w-280">
								    <el-option
								      v-for="item in memberGrade"
								      :key="item.value"
								      :label="item.label"
								      :value="item.value">
								    </el-option>
								  </el-select>
							</div>
						</el-form-item>
						<el-form-item label="消费总额" class="form-item">
							<el-col :span="9">
								<el-form-item prop='costAllBegin'>
									<el-input v-model="ruleForm.costAllBegin" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">至</el-col>
							<el-col :span="9">
								<el-form-item prop='costAllEnd'>
									<el-input v-model="ruleForm.costAllEnd" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">元</el-col>
						</el-form-item>
						<el-form-item label="消费次数" class="form-item">
							<el-col :span="9">
								<el-form-item prop='costTimeBegin'>
									<el-input v-model="ruleForm.costTimeBegin" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">至</el-col>
							<el-col :span="9">
								<el-form-item prop='costTimeEnd'>
									<el-input v-model="ruleForm.costTimeEnd" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">次</el-col>
						</el-form-item>
						<el-form-item label="客单价" class="form-item">
							<el-col :span="9">
								<el-form-item prop='avgCostBegin'>
									<el-input v-model="ruleForm.avgCostBegin" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">至</el-col>
							<el-col :span="9">
								<el-form-item prop='avgCostEnd'>
									<el-input v-model="ruleForm.avgCostEnd" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">元</el-col>
						</el-form-item>
						<el-form-item label="连带率" class="form-item">
							<el-col :span="9">
								<el-form-item prop='avgNumberBegin'>
									<el-input v-model="ruleForm.avgNumberBegin" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">至</el-col>
							<el-col :span="9">
								<el-form-item prop='avgNumberEnd'>
									<el-input v-model="ruleForm.avgNumberEnd" placeholder="" class="w-120"></el-input>
								</el-form-item>
							</el-col>
						</el-form-item>
					</el-form>
				</div>
				<div class="people-modal-ft">
					<div class="modal-btn-group">
						<el-button @click="closeModal('ruleForm')">取消</el-button>
						<el-button type="primary" @click="getCrowdData">确定</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name:"peopleFilter",
		data(){
			let costAllBeginValidate = (rule, value, callback) => {
				let rge = /^\d+(\.\d+)?$/;
				if(value!==''||this.ruleForm.costAllEnd!==''){
					if(rge.test(value)){
						if (value==''&&this.ruleForm.costAllEnd) {
				          callback(new Error('请输入销售总额'));
				        } else if(value>this.ruleForm.costAllEnd&&this.ruleForm.costAllEnd) {
				          callback(new Error('消费上限不能大于下限'));
				        }else{
				        	callback();
				        }
					}else{
						callback(new Error('请输入数字'));
					}
				}

			}
			let costAllEndValidate = (rule, value, callback) => {
				let rge = /^\d+(\.\d+)?$/;
				if(value!==''||this.ruleForm.costAllBegin!==''){
					if(rge.test(value)){
						if (value==''&&this.ruleForm.costAllBegin) {
				          callback(new Error('请输入销售总额'));
				        } else if(value<this.ruleForm.costAllBegin&&this.ruleForm.costAllBegin) {
				          callback(new Error('消费下限不能小于上限'));

				        }else{
				        	callback();
				        }
					}else{
						 callback(new Error('请输入数字'));
					}
				}
			}
			let costTimeBeginValidate = (rule, value, callback) => {
				let reg = /^-?[1-9]+[0-9]*$///整数
				if(reg.test(value)){
					if(this.ruleForm.costTimeEnd!==''){
						if(reg.test(value)){
							if(value>this.ruleForm.costTimeEnd){
								callback(new Error('次数上限不能大于下限'));
							}
						}else if(value===''){
							callback(new Error('请输入销售次数'));
						}else{
							callback(new Error('请输入整数'));
						}
					}else{
						callback();
					}
				}else{
					callback(new Error('请输入整数'));
				}
			}
			let costTimeEndValidate = (rule, value, callback) => {
				let reg = /^-?[1-9]+[0-9]*$/
				if(reg.test(value)){
					if(this.ruleForm.costTimeBegin!==''){
						if(reg.test(value)){
							if(value<this.ruleForm.costTimeBegin){
								callback(new Error('次数下限不能小于上限'));
							}
						}else if(value===''){
							callback(new Error('请输入销售次数'));
						}else{
							callback(new Error('请输入整数'));
						}
					}else{
						callback();
					}

				}else{
					callback(new Error('请输入整数'));
				}
			}
			let avgCostBeginValidate=(rule, value, callback)=>{
				let rge = /^\d+(\.\d+)?$/;
				if(rge.test(value)){
					if(this.ruleForm.avgCostEnd!==""){
						if(rge.test(value)){
							if(value>this.ruleForm.avgCostEnd){

								callback(new Error('客单价上限不能大于下限'));

							}else{
								this.ruleForm.avgCostBegin=Number(value).toFixed(2)

								callback();
							}

						}else{

							callback(new Error('请输入数字'));

						}
					}
					this.ruleForm.avgCostBegin=Number(value).toFixed(2)

				}else{
					callback(new Error('请输入数字'));

				}
			}
			let avgCostEndValidate=(rule, value, callback)=>{
				let rge = /^\d+(\.\d+)?$/;
				if(rge.test(value)){
					if(this.ruleForm.avgCostBegin!==""){
						if(rge.test(value)){
							if(value<this.ruleForm.avgCostBegin){
								callback(new Error('客单价下限不能小于上限'));
							}else{
								this.ruleForm.avgCostEnd=Number(value).toFixed(2)
								callback();
							}
						}else{
							callback(new Error('请输入数字'));

						}
					}
					this.ruleForm.avgCostEnd=Number(value).toFixed(2)
				}else{
					callback(new Error('请输入数字'));
				}
			}
			let avgNumberBeginValidate=(rule, value, callback)=>{
				let rge = /^\d+(\.\d+)?$/;
				if(rge.test(value)){
					if(this.ruleForm.avgNumberEnd!==""){
						if(rge.test(value)){
							if(value>this.ruleForm.avgNumberEnd){
								callback(new Error('连带率上限不能大于下限'));

							}else{
								this.ruleForm.avgNumberBegin=Number(value).toFixed(2)
								callback();
							}

						}else{

							callback(new Error('请输入数字'));

						}
					}
					this.ruleForm.avgNumberBegin=Number(value).toFixed(2)
				}else{
					callback(new Error('请输入数字'));
				}
			}
			let avgNumberEndValidate=(rule, value, callback)=>{
				let rge = /^\d+(\.\d+)?$/;
				if(rge.test(value)){
					if(this.ruleForm.avgNumberBegin!==""){
						if(rge.test(value)){
							if(value<this.ruleForm.avgNumberBegin){
								callback(new Error('连带率下限不能小于上限'));

							}else{
								this.ruleForm.avgNumberEnd=Number(value).toFixed(2)
								callback();
							}

						}else{

							callback(new Error('请输入数字'));

						}
					}
					this.ruleForm.avgNumberEnd=Number(value).toFixed(2)
				}else{
					callback(new Error('请输入数字'));
				}
			}
			return{
				memberGrade:[{
		          value: '1',
		          label: '2级青铜'
			        },{
			          value: '2',
			          label: '普卡'
			        },{
			          value: '3',
			          label: '钻石会员'
			        },{
			          value: '4',
			          label: 'rinkiung'
			        },{
			          value: '5',
			          label: '特殊卡1'
			        },{
			          value: '6',
			          label: '特殊卡2'
			        },{
			          value: '7',
			          label: '特殊卡3'
			        }
			    ],
			    ruleForm:{
            gradeLevel:[],//选择的会员等级
				  	costAllBegin:'',//消费总额
				    costAllEnd:'',//消费总额
				    costTimeBegin:'',//消费次数
				    costTimeEnd:'',//消费次数
				    avgCostBegin:'',//客单件
				    avgCostEnd:'',//客单件
				    avgNumberBegin:'',//连带率
				    avgNumberEnd:'',//连带率
			    },
			    rules:{
			    	costAllBegin:[
			    		{ validator: costAllBeginValidate, trigger: 'blur' }
			    	],
			    	costAllEnd:[
			    		{ validator: costAllEndValidate, trigger: 'blur' }
			    	],
			    	costTimeBegin:[
			    		{ validator: costTimeBeginValidate, trigger: 'blur' }
			    	],
			    	costTimeEnd:[
			    		{ validator: costTimeEndValidate, trigger: 'blur' }
			    	],
			    	avgCostBegin:[
			    		{ validator:avgCostBeginValidate, trigger: 'blur' }
			    	],
			    	avgCostEnd:[
			    		{ validator:avgCostEndValidate, trigger: 'blur' }
			    	],
			    	avgNumberBegin:[
			    		{ validator:avgNumberBeginValidate, trigger: 'blur' }
			    	],
			    	avgNumberEnd:[
			    		{ validator:avgNumberEndValidate, trigger: 'blur' }
			    	],

			    }
			}
		},
    props: {
      peopleModal: {
        type: Boolean,
        default: false
      }
    },
		methods:{
			getCrowdData() {
				let data = {
					costAllBegin: this.ruleForm.costAllBegin,
					costAllEnd: this.ruleForm.costAllEnd,
					costTimeBegin:this.ruleForm.costTimeBegin,
					costTimeEnd:this.ruleForm.costTimeEnd,
					avgCostBegin:this.ruleForm.avgCostBegin,
					avgCostEnd:this.ruleForm.avgCostEnd,
					avgNumberBegin:this.ruleForm.avgNumberBegin,
					avgNumberEnd:this.ruleForm.avgNumberEnd,
					gradeLevel: this.ruleForm.gradeLevel,
				}
				this.$emit("getCrowdData",data);
			},
			closeModal(formName) {
			  this.ruleForm.gradeLevel = [];
        this.$refs[formName].resetFields();
        this.$emit('closeDiolog');
			}
		}
	}
</script>
<style scoped>
	.visible-crowd-modal{
		position: fixed;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 100%;
	    background: rgba(0,0,0,0.5);
	    z-index:10;
	}
	.people-modal-content{
		position:fixed;
		left:50%;
		top:50%;
		transform: translate(-50%,-50%);
		display: inline-block;
	    width: 500px;
	    padding-bottom: 10px;
	    vertical-align: middle;
	    background-color: #fff;
	    border-radius: 4px;
	    border: 1px solid #ebeef5;
	    font-size: 18px;
	    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
	    text-align: left;
	    overflow: hidden;
	    backface-visibility: hidden;
	    z-index:11;
	}
	.people-modal-bd{
		padding:20px 0;
	}
	.people-modal-title{
		height:56px;
		line-height:56px;
		padding-left:20px;
		border-bottom:1px solid #e3e5e9;
		font-size:14px;
		position:relative;
	}
	.people-modal-title .el-icon-close{
		position:absolute;
		right:15px;
		top:15px;
		font-size:20px;
		cursor: pointer;
	}

	.el-select{
		width:100%;
	}
	.tree-box .el-input{
		width:280px;
		margin:10px;
	}
	.w-120{
		width:120px;
	}
	.w-280{
		width:280px;
	}
	.interval-input{
		font-size:14px;
	}
	.people-modal-ft{
		height:60px;
		line-height:60px;
		border-top:1px solid #e3e5e9;
		margin-top:20px;
	}
	.modal-btn-group{
		float: right;
		margin-right:20px;
	}
	.form-item{
		margin-left:50px;
	}
</style>
