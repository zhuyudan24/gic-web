<template>
<div class="total-wrap">
  <div class="shop-tag-wrap" :style="{minHeight: (bodyHeight - 164) + 'px'}">
    <topNav :navpath="navpath"></topNav>
    <div class="bottom-wrap">
    	<div class="bottom-content-wrap" v-loading="loading">
    		<div class="detail-content-wrap basic-detail-wrap">
    			<div class="title">账号基础信息</div>
    			<div class="detail-wrap clearfix">
            <div class="item">
              <span>公众账号/小程序名称：</span>
              <p>{{detail.nick_name}}</p>
            </div>
            <div class="item">
              <span>公众账号/小程序介绍：</span>
              <p>{{detail.signature}}</p>
            </div>
            <div class="item">
              <span>公众账号/小程序头像：</span>
              <div class="img">
                <img :src="detail.head_img" alt="">
              </div>
            </div>
          </div>
    		</div>
    		<div class="detail-content-wrap other-detail-wrap">
    			<div class="title">其他信息</div>
    			<div class="detail-wrap clearfix">
    				<div class="item">
      				<span>微信号：</span>
      				<p>{{detail.alias?detail.alias:'--'}}</p>
      			</div>
      			<div class="item">
      				<span>原始ID：</span>
      				<p>{{detail.user_name}}</p>
      			</div>
      			<div class="item">
      				<span>资质认证：</span>
              <p>{{verifyType=='0'?'已认证':'未认证'}}</p>
      			</div>
      			<div class="item">
      				<span>二维码：</span>
      				<div class="img">
      					<img :src="detail.qrcode_url" alt="">
      				</div>
      			</div>
    			</div>
    		</div>
    	</div>
    </div>
  </div>
  <vue-gic-footer></vue-gic-footer>
</div>
</template>

<script>
	import topNav from 'components/nav/nav.vue'
  let qs = require('qs');
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
            path: '/allow_bind'
          },
          {
            name: '授权详情',
            path: ''
          }
        ],
        detail:{},
        loading:false,
        verifyType:null,
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getBindDetail()
    },
    methods:{
    	getBindDetail(){     // 获取绑定信息的详情
        var self = this;
        var appId = self.$route.query.appId;
        self.loading = true;
        self.axios.post('/api-admin/authorize-detail',qs.stringify({
          requestProject:'gic-web',
          appId:appId
        })).then(res=>{
          var data = res.data;
          //console.log(data);
          if(data.errorCode ==0){
            self.loading = false;
            self.detail=data.result.detail;
            self.verifyType = self.detail.verify_type_info.id;
            //console.log(self.detail.verify_type_info.id);
          }
        })
      }
    },
    components: {
    	topNav
    }      
  }
</script>

<style lang="less" scoped>
  .bottom-content-wrap{
  	padding: 24px 36px;
  	background: #fff;
  	.detail-content-wrap{
  		background: #fff;
  		.title{
  			color: rgba(0,0,0,.85);
  			font-weight: 500;
  			margin-bottom: 16px;
  			font-size: 16px;
        font-weight: 700;
  		}
      .item{
        line-height: 20px;
        padding-bottom: 16px;
        color: rgba(0,0,0,.85);
        position: relative;
        width: 33.333%;
        float: left;
        span{
          position: absolute;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
  	}
  	.basic-detail-wrap{
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 32px;
  		.item{
  			span{
  				width: 150px;
  			}
        p{
          padding-right: 20px;
        }
  			p,.img{
  				padding-left: 150px;
  			}
  			.img{
				width: 230px;
				height: 80px;
  			}
  		}
  	}
    .other-detail-wrap{
      .item{
        span{
          width: 70px;
        }
        p,.img{
          padding-left: 70px;
        }
        .img{
          width: 202px;
          height: 132px;
        }
      }
    }
  }
</style>
