<template>
  <div class="right-wrap ad-manage-wrap">
	  <topNav :navpath="navpath"></topNav>
	  <div class="right-content bottom-wrap">
	  	<div class="right-box bottom-content-wrap">
	  		<!-- 通用广告位 -->
		  	<div class="common-ad">
		  		<fiveBannerNew :carTab='2' :id="''" :bannerData="tableData3"></fiveBannerNew>
		  	</div>
	  	</div>
	  </div>
	  <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
	import fiveBannerNew from 'components/basicConfig/fiveBanner/fiveBannerNew'
	let qs = require('qs')
  export default {
    name: "ad_manage_common",
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
	          name: '通用广告位',
	          path: ''
	        }
	      ],
	      activeitem: 2,
	      tableData3: [{},{},{},{},{}], 	// 通用广告位的5个轮播图
    	}
    },
    computed:{

    },
    mounted(){
    	window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
    	this.getAdData();
    },
    methods:{
    	getAdData(){		// 获取通用的数据
    		this.loading = true;
    		var tab = this.$route.query.carTab;
    		if(tab){
    			this.activeitem = parseInt(tab)
    		}
    		this.axios.post('/api-admin/advert-interval-service',qs.stringify({
    			requestProject:'gic-web'
		  	})).then((res)=>{
		  		var data = res.data;
		  		// console.log(data);
		  		if(data.errorCode==0){
		  			this.loading = false;
		  			this.tableData3 = data.result.caseList
		  		}else{
		  			this.$message({
              type: 'error',
              message: data.message
            });
		  		}
		  	})
    	},
    },
    components: {
     	topNav,
     	fiveBannerNew
	  }
  }
</script>

<style lang="less" scoped>
	.bottom-content-wrap{
		background: #fff;
    padding: 24px;
    .special-ad{
			.operate-btn{
				margin-bottom: 22px;
				text-align: right;
			}
			.pagination{
				text-align: right;
			}
    }
	}
	.five-banner-wrap{		// 通用广告位的5个轮播
  	.all-use-table{
    	.list-img{
    		width: 200px;
    		height: 59px;
    		img{
    			width: 100%;
    			height: 100%;
    		}
    	}
    }
  }
	.show-location-wrap{
		position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 22;
    background: rgba(0,0,0,.5);
    .show-location{
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	transform: translate(-50%,-50%);
	    width: 375px;
	    height: 731px;
	    border-radius: 2px;
	    background: url('../fiveBanner/credit_banner_popup.png') no-repeat;
	    background-size: 100% 100%;
	    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
	    .show-img{
				width: 375px;
				height: 110px;
				margin-top: 267px;
				img{
					width: 100%;
					height: 100%;
				}
	    }
    }
	}
	.table-no-line-wrap::before{	
	  height: 0
	}
</style>
