<template>
	<div class="attention-textAndImg-wrap">
		<el-dialog
      title="选择门店"
      :visible.sync="dialogCard"
      width="800px">
      <div>
      	<div class="text-img-search clearfix">
					<span>选择卡券（共81条）</span>
					<div class="fl">
						<el-input
						    placeholder="请输入内容"
						    prefix-icon="el-icon-search"
						    class="search-input"
						    v-model="searchText">
						</el-input>
						<!-- <el-button class="search-btn" type="primary">查询</el-button> -->
						<p class="limit-text">取限制>1的卡券不支持选择，系统已自动过滤</p>
					</div>
				</div>
				<div class="pic-list-box">
					<el-table
				    ref="multipleTable"
				    :data="tableData3"
				    class="card-table"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @current-change="handleCurrentChangeTable">
				    <el-table-column label="" width="55">
				      <template slot-scope="scope">
		            <el-radio class="radio-style" :label="scope.row.id" v-model="radio">
		            	&nbsp;
		            </el-radio>
		          </template>
				    </el-table-column>

				    <el-table-column
				      label="卡券名称">
				      <template slot-scope="scope">{{ scope.row.cardName }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="noticeName"
				      label="备注名">
				    </el-table-column>
				    <el-table-column
				      prop="limit"
				      label="领取限制"
				      width="100">
				    </el-table-column>
				    <el-table-column
				      prop="shop"
				      label="适用门店"
				      width="100">
				    </el-table-column>
				    <el-table-column
				      prop="all"
				      label="库存"
				      width="130">
				    </el-table-column>
					</el-table>
					<div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              small
              :page-size="4"
              layout="prev, pager, next"
              :total="40">
            </el-pagination>
          </div>
				</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCardp = false">取 消</el-button>
        <el-button type="primary" @click="chooseShopBtn">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
  export default {
    name: "public_attention_textAndImg",
    data(){
    	return {
    		searchText: '',
    		tableData3: [{
    		  id: 0,
          cardName: '三只松鼠',
          noticeName: '这是备注',
          limit: 1,
          shop: '所有门店',
          all: 100
        }, {
          id: 1,
          cardName: '三只松鼠',
          noticeName: '这是备注',
          limit: 1,
          shop: '所有门店',
          all: 100
        }, {
          id: 11,
          cardName: '三只松鼠',
          noticeName: '这是备注',
          limit: 1,
          shop: '所有门店',
          all: 100
        }, {
          id: 12,
          cardName: '三只松鼠',
          noticeName: '这是备注',
          limit: 1,
          shop: '所有门店',
          all: 100
        }, {
          id: 13,
          cardName: '三只松鼠',
          noticeName: '这是备注',
          limit: 1,
          shop: '所有门店',
          all: 100
        }],
        currentRow:null,
        radio:null,
        dialogCard:true,
        currentPage:1
    	}
    },
    methods:{
    	handleCurrentChangeTable(val) {	// 当前格发生变化时触发
    		this.radio = val.id;
        this.currentRow = val;
    	},
    	handleSizeChange(val){		// 选择分页符
    		console.log(`每页 ${val} 条`);
    	},
    	handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
    	}
    }
  }
</script>

<style lang="less" scoped>
	#wrap{
		background: #fff;
	}
  .attention-textAndImg-wrap{
		.text-img-search {
	    margin: 10px 15px;
	    font-size: 14px;
	    color: #292929;
	    height: 36px;
	    line-height: 36px;
	    > span{
	    	float: left;
	    	margin-right: 10px;
	    }
	    .search-input{
	    	width: 180px;
	    }
	    .search-btn{
	    	margin-left: 4px;
	    }
	    .limit-text{
	    	color: #909399;
		    font-size: 12px;
		    line-height: 1;
		    padding-top: 4px;
		    display: inline-block;
		    margin-left: 20px;
	    }
		}
		.pic-list-box{
			.list-img{
				width: 80px;
				height: 80px;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.card-table{
				position: relative;
				.radio-style{
					position: absolute;
					left: 27px;
					top: 15px;
				}
			}
		}
  }
  .pagination{
		text-align: right;
		margin-top: 20px;
	}
	.pic-list-box /deep/ .el-table__row{
  	cursor: pointer;
  }
  .attention-textAndImg-wrap /deep/ .el-dialog__body{
    padding: 10px 20px;
  }
</style>
