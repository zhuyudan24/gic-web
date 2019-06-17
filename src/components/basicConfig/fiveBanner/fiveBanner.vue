<template>
	<div class="five-banner-wrap">
		<el-table
	    ref="multipleTable3"
	    :data="tableData3"
	    tooltip-effect="dark"
	    :cell-class-name="firstColStyle"
	    class="all-use-table"
	    :span-method="objectSpanMethod">
	    <el-table-column
	    	prop="adStyle"
	      label="广告位类型"
	      width="120"
	      style="background:#f00">
	    </el-table-column>
			<el-table-column
	      prop="num"
	      label="位置编号"
	      width="150">
	      <template slot-scope="scope">
		      <div @click="toggleImgUrl(scope.row.img)" style="cursor:pointer">
		      	{{scope.$index + 1}}<i class="el-icon-location-outline"></i>
		      </div>
	      </template>
	    </el-table-column>
			<el-table-column
	    	prop="standard"
	      label="图片规格要求"
	      width="120">
	    </el-table-column>
	    <el-table-column
	      prop="img"
	      label="图片"
	      width="300">
	      <template slot-scope="scope">
	      	<div v-if="scope.row.img!=''" class="list-img">
	      		<img :src="scope.row.img" alt="">
	      	</div>
	      	<div v-else>--</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="urlStyle"
	      label="链接地址类型"
	      width="120">
	      <template slot-scope="scope">
	      	<div v-if="scope.row.urlStyle!=''">
	      		{{scope.row.urlStyle}}
	      	</div>
	      	<div v-else>--</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="url"
	      label="链接地址">
	      <template slot-scope="scope">
	      	<div v-if="scope.row.url!=''">
	      		{{scope.row.url}}
	      	</div>
	      	<div v-else>--</div>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="operate"
	      label="操作"
	      width="260">
	      <template slot-scope="scope">
	      	<el-button v-show="scope.$index!=lunboLength" @click="sortDown(scope.$index)" type="text">下移</el-button>
	      	<el-button v-show="scope.$index!=0" @click="sortUp(scope.$index)" type="text">上移</el-button>
	      	<el-button v-show="scope.row.url==''" @click="changeRoute('ad_manage_edit')" type="text">添加</el-button>
	      	<el-button v-show="scope.row.url!=''" @click="changeRoute('ad_manage_edit')" type="text">编辑</el-button>
	      	<el-button v-show="scope.row.url!=''" @click="deleteBanner" type="text">删除</el-button>
	      </template>
	    </el-table-column>
		</el-table>
		<!-- 显示位置样板 -->
	  <div class="show-location-wrap" @click="hideDialog" v-show="dialogVisible">
	  	<div class="show-location">
	  		<div class="show-img">
	  			<img :src="showImgUrl" alt="">
	  		</div>
	  	</div>
	  </div>
	</div>
</template>

<script>
  export default {
    name: "five_banner",
    data(){
    	return{
	      tableData3: [
	      	{
	    		  id:1,
	    		  adStyle: '轮播焦点图',
	    		  standard: '450*220',
	    		  img: 'https://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7c',
	    		  urlStyle: '网址',
	    		  url: 'https://pic01-10001430.image.myqcloud.com'
	        }, {
	          id:12,
	          adStyle: '轮播焦点图',
	    		  standard: '550*220',
	    		  img: 'https://pic01-10001430.image.myqcloud.com/2e77dfb0-01b7-483b-9585-92d2d751efb1',
	    		  urlStyle: '网址',
	    		  url: 'https://pic01-10001430.image.myqcloud.com'
	        },{
	          id:13,
	          adStyle: '轮播焦点图',
	    		  standard: '650*220',
	    		  img: 'https://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7c',
	    		  urlStyle: '网址',
	    		  url: 'https://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7chttps://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7c'
	        }, {
	          id:14,
	          adStyle: '轮播焦点图',
	    		  standard: '750*220',
	    		  img: 'https://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7c',
	    		  urlStyle: '网址',
	    		  url: 'https://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7chttps://pic01-10001430.image.myqcloud.com/215dbd96-b73b-4201-9538-353bf07a7f7c'
	        }, {
	          id:15,
	          adStyle: '轮播焦点图',
	    		  standard: '850*220',
	    		  img: '',
	    		  urlStyle: '',
	    		  url: ''
	        }
	      ],
	      dialogVisible: false,		// 位置弹框
	      showImgUrl: '',					// 图片链接
    	}
    },
    computed:{
    	lunboLength(){
    		var l = this.tableData3.length-1;
    		return l
    	}
    },
    methods:{
	    objectSpanMethod({ row, column, rowIndex, columnIndex }) {		// 合并单元格
	    	if (columnIndex === 0) {
          if (rowIndex % 5 === 0) {
            return {
              rowspan: 5,
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
      firstColStyle({row, column, rowIndex, columnIndex}){		// 为第一列添加样式：右线
      	console.log('klklklkl');
      	// if(columnIndex == 0){	// 第一列添加 right-line 这个类
       //    return 'right-line'
       //  }
      },
      sortUp(idx){			  			// 上移
      	this.changeItem(this.tableData3,idx,idx-1)
      },
      sortDown(idx){			  		// 下移
      	this.changeItem(this.tableData3,idx,idx+1)
      },
      changeItem(arr, index1, index2) {	// 交换数组位置
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    	},
      toggleImgUrl(url){		// 切换显示图片
      	this.showImgUrl = url;
      	this.dialogVisible = true;
      },
      hideDialog(){				// 点击body隐藏
      	this.dialogVisible = false
      },
      changeRoute(route) {	// 路由跳转
      	this.$router.push(route);
    	},
    	deleteBanner(){				// 删除通用焦点图
    		this.$confirm('确定删除选中的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    	}
    }
  }
</script>

<style lang="less" >
	.five-banner-wrap{
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
   	.right-line{
   		// border-right: 1px solid #ebeef5;
   		// background: #f00;
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
	    background: url('credit_banner_popup.png') no-repeat;
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
</style>
