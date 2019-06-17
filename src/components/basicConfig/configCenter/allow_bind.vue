<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
    	<div class="bottom-content-wrap">
    		<div class="bind-info-wrap clearfix">
      		<div class="bind-wrap">
      			<div class="bind-info fl">
        			<p>为保证所有功能正常，公众号/小程序授权时请保持默认选择，把所有权限同意授权给GIC</p>
        			<p>请保证授权公众号/小程序绑定在同一第三方平台账号下（即第三方绑定appId相同），否则会造成会员身份无法打通<br>
							如遇到绑定第三方平台appId不同的情况，可以去open.weixin.qq.com（微信开放平台）解绑后重新绑定，并联系客户经理重新刷新Unionid</p>
        			<p>如在第三方平台解绑后重新绑定过，可点击“更新信息”更新第三方平台绑定appId</p>
        		</div>
        		<div class="succes-btn fr">
        			<el-button type="primary" @click="bindAccount" :disabled="btnState">{{btnState==false?'立即创建':'已创建'}}</el-button>
        		</div>
      		</div>
    		</div>
    		<div class="bind-public-num">
    			<div class="bind-btn">
    				<p class="text-tip">账号绑定个数的上限为10个，绑定次数的上限为每个月10次</p>
    				<el-button @click="bindAccount" type="primary">绑定公众号/小程序</el-button>
    			</div>
    			<el-table
				    ref="multipleTable"
				    :data="tableData3"
				    tooltip-effect="dark"
				    style="width: 100%"
				    v-loading="loading"
				    class="bind-table table-no-line-wrap">
				    <el-table-column
				      prop="authName"
				      label="公众号/小程序">
				      <template slot-scope="scope">
				      	<div class="list-img clearfix">
				      		<img :src="scope.row.authImg" alt="">
				      		<p>{{scope.row.authName}}</p>
				      	</div>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="authType"
				      label="账号类型">
				      <template slot-scope="scope">
				      	<p v-show="scope.row.authType==2">服务号</p>
                <p v-show="scope.row.authType==4">小程序</p>
                <p v-show="scope.row.authType==5">商城小程序</p>
                <p v-show="scope.row.authType==0 || scope.row.authType==1">订阅号</p>
				      </template>
				    </el-table-column>
						<el-table-column
				      prop="thirdPartAppId"
				      label="第三方绑定appId">
				    </el-table-column>
				    <el-table-column
				      prop="operate"
				      label="账号信息"
				      width="300">
				      <template slot-scope="scope">
				      	<el-button type="text" @click="handleOpenDetail(scope.row.wxaAppkey)">查看</el-button>
								<el-button type="text" @click="updateInfo(scope.row.wxaAppkey,scope.row)">更新信息</el-button>
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
    <!-- 授权结果 -->
    <el-dialog
      title="授权结果"
      :visible.sync="dialogVisible"
      width="500px">
      <span>{{alertMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">{{ sureMsgBtn }}</el-button>
      </span>
    </el-dialog>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "allow_bind",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '授权绑定管理',
            path: ''
          }
        ],
        tableData3:[],
        currentPage:1,
        btnState:false,
        bindFlag:null,
        bindUrl: '',
        appId:'',		// 小程序的appId
        loading:false,
				dialogVisible:false,
				alertObj:"", // 授权结果的状态
				alertMessage:'',  // 授权结果信息
				sureMsgBtn:"确 定", // 弹框按钮
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
    	this.getAllowBindData();
      this.getBindResult();
    },
    computed:{

    },
    methods:{
      getBindResult(){    // 获取绑定结果
        this.alertObj = this.getUrlKey('alert');
        if(this.alertObj){
					this.dialogVisible=true;
					if(this.alertObj==1){
						this.alertMessage = "授权成功"
					}else if(this.alertObj==2){
						this.alertMessage = "授权失败，请确保已将所有公众号/小程序权限授权给达摩"
						this.sureMsgBtn = "重新授权"
					}else if(this.alertObj==3){
						this.alertMessage = "授权失败，没有支付权限"
					}else if(this.alertObj==5){
						this.alertMessage = "绑定失败，该公众号/小程序已绑定开放平台账号"
					}else if(this.alertObj==6){
						this.alertMessage = "授权失败，创建公众平台失败"
					}else if(this.alertObj==7){
						this.alertMessage = "授权失败，保存失败"
					}else if(this.alertObj==8){
						this.alertMessage = "授权失败，已经其它平台绑定"
					}else if(this.alertObj==9){
						this.alertMessage = "授权失败，绑定公众平台失败"
					}else if(this.alertObj==10){
						this.alertMessage = "授权失败，不同主体帐号"
					}else if(this.alertObj==11){
						this.alertMessage = "授权失败，程序信息不全"
					}else if(this.alertObj==12){
						this.alertMessage = "授权失败"
					}
        }else{
          this.dialogVisible=false;
        }
      },
      getUrlKey(name){    // 获取路由参数
        return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
      },
    	getAllowBindData(){		// 获取授权绑定管理的数据
    		var self = this;
    		self.loading=true;
    		self.axios.post('/api-admin/authorize-manage',qs.stringify({
          requestProject:'gic-web'
        })).then(res=>{
    			var data = res.data;
          //console.log(data);
    			self.bindFlag = data.result.flag;
    			if(data.errorCode ==0){
    				self.loading=false;
    				self.tableData3=data.result.list
    				if(data.result.flag>0){
    					self.btnState = true;
    				}
    			}
    		})
    	},
    	bindAccount(){		// 绑定微信小程序、公众号
    		// console.log(this.bindFlag);
    		var self = this;
    		if(self.bindFlag>9){
    			self.$message('账号绑定个数的上限为10个哦');
    		} else {
          var protocol = window.location.protocol;  // 获取协议
          var host = window.location.host;  // 获取域名
          var url = protocol + '//' + host;
          // console.log(url);
    			self.axios.post('/api-admin/app-auth-load',qs.stringify({
            requestProject:'gic-web',
            domainName:url
          })).then(res=>{
	    			var data = res.data;
	    			if(data.errorCode ==0){
	    				self.bindUrl = data.result.grantAuthUrl;
              window.location.href=self.bindUrl
	    			}
	    		})
    		}
			},
			sureBtn(){  // 授权结果的弹框按钮
				this.dialogVisible=false;
				if(this.alertObj==2){ // 重新授权
					this.bindAccount()
				}
			},
			updateInfo(id,row){ // 更新信息
				this.axios.post('/api-admin/re-find-third-part-app-id',qs.stringify({
					requestProject:'gic-web',
					appId:id
				})).then(res=>{
					var data = res.data;
					if(data.errorCode ==0){
						row.thirdPartAppId = data.result
					}
				})
			},
    	handleOpenDetail(id, row){	// 查看详情  改变路由  传参
    		var self = this;
    		self.$router.push({
					path:'/allow_bind_detail',
					query:{
						appId:id
					}
				})
    	},
    },
    components: {
    	topNav
    }      
  }
</script>

<style lang="less" scoped>
  .bottom-content-wrap{
  	.bind-info-wrap{
  		padding: 24px;
  		background: #fff;
    	.bind-wrap{
    		display: flex;
    		border: 1px solid #1890ff;
    		padding: 10px 16px;
	    	box-sizing: border-box;
	    	border-radius: 4px;
	    	background: #ecf5ff;
	    	color: rgba(0,0,0,.65);
    		.bind-info{
	    		flex:1;
				p{
					line-height: 30px;
					position: relative;
					padding-left: 16px;
          font-size: 14px;
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
	    	.succes-btn{
	    		flex: 0 0 200px;
	    		line-height: 120px;
	    		text-align: right;
	    	}
    	}
  	}
  	.bind-public-num{
  		background: #fff;
  		padding: 0 24px 24px 24px;
  		.bind-btn{
  			text-align: right;
  			margin-bottom: 22px;
  			.text-tip{
  				display: inline-block;
  				font-size: 12px;
  				color: #909399;
  				margin-right: 10px;
  			}
  		}
  		.bind-table{
  			.list-img{
  				img{
  					width: 80px;
  					height: 80px;
  					float: left;
  				}
  				p{
					float: left;
					line-height: 80px;
					margin-left: 10px;
  				}
  			}
  		}
  		.pagination{
			text-align: right;
			margin-top: 24px;
		}
  	}
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
