<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="right-box">
        <div class="add-new-btn">
          <el-button @click="addMemberInfo" type="primary">新增字段</el-button>
        </div>
        <el-table
          class="table-no-line-wrap"
          :data="tableData"
          style="width: 100%"
          max-height="1023"
          v-loading="loading">
          <el-table-column
            prop="sort"
            label="字段序列"
            width="180">
            <template slot-scope="scope">
              <i @click="sortInfo('up',scope.$index)" v-show="scope.$index!=0" title="上移" class="sort-icon-all iconfont icon-yd-icon-upload2"></i>
              <i @click="sortInfo('down',scope.$index)" v-show="scope.$index!=tableData.length-1" title="下移" class="sort-icon-all sort-icon-down iconfont icon-yd-icon-upload2"></i>

              <i @click="sortInfo('sortUp',scope.$index)" v-show="scope.$index!=0" title="置顶" class="sort-icon-all el-icon-upload2 sort-icon"></i>
              <i @click="sortInfo('sortDown',scope.$index)" v-show="scope.$index!=tableData.length-1" title="置底" class="sort-icon-all el-icon-download sort-icon"></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldName"
            label="字段名称">
          </el-table-column>
          <el-table-column
            prop="fieldLevelName"
            label="字段级别">
          </el-table-column>
          <el-table-column
            prop="fieldType"
            label="字段类型">
            <template slot-scope="scope">
              <p v-show="scope.row.fieldType==0">输入框</p>
              <p v-show="scope.row.fieldType==1">复选框</p>
              <p v-show="scope.row.fieldType==2">单选框</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="ope"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="editMemberInfo(scope.row.memberFieldId)" type="text">详情</el-button>
              <delete-tip @confirm="handleDelete(scope.$index,scope.row.memberFieldId)" tips="确定删除该会员信息吗?">
                <el-button type="text">删除</el-button>
              </delete-tip>
              <!-- <el-button @click="handleDelete(scope.$index,scope.row.memberFieldId)" type="text">删除</el-button> -->
            </template>
          </el-table-column>
          <template slot="empty" >
            <div class="no-data-wrap">
              <div class="no-data-icon" >
                <img src="../../../../static/img/no-data_icon.png" alt="">
              </div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
        <!-- <div class="pagination" v-show="totalCount>0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div> -->
      </div>
  	</div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
	import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "member_info",
    data(){
    	return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
    		navpath: [
          {
            name: '会员管理',
            path: ''
          },
          {
            name: '会员体系',
            path: ''
          },
          {
            name: '会员信息字段',
            path: ''
          }
        ],
        tableData: [],
        currentPage:1,
        pageSize:100,
        totalCount:0,
        loading:false,
        fieldIdPrev:'',
        sortNumPrev:'',
        fieldIdNext:'',
        sortNumNext:''
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getInfoData(this.currentPage,this.pageSize)
    },
    methods:{
      getInfoData(page,size){   // 获取会员细信息字段的列表
        this.loading = true;
        this.axios.post('/api-admin/member-field-list',qs.stringify({
          requestProject:'gic-web',
          currentPage:page,
          pageSize:size
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.loading = false;
            this.tableData = data.result.result;
            // this.totalCount = data.result.totalCount;
            this.totalCount = this.tableData.length;
            // console.log(this.tableData);
          }else{
            this.$message.error(data.message)
          }
        })
      },
      handleSizeChange(val){     // 选择分页符
        this.pageSize =  val;
        this.getInfoData(this.currentPage,this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getInfoData(this.currentPage,this.pageSize)
      },
      sortInfo(flag,index){   // 排序
        this.loading = true;
        if(flag=='up'){ 
          this.fieldIdPrev=this.tableData[index-1].memberFieldId;
          this.sortNumPrev=this.tableData[index].sortNum;
          this.fieldIdNext=this.tableData[index].memberFieldId;
          this.sortNumNext=this.tableData[index-1].sortNum;
        }else if(flag=='down'){ 
          this.fieldIdPrev=this.tableData[index].memberFieldId;
          this.sortNumPrev=this.tableData[index+1].sortNum;
          this.fieldIdNext=this.tableData[index+1].memberFieldId;
          this.sortNumNext=this.tableData[index].sortNum;
        }else if(flag=='sortUp'){  // 置顶
          this.fieldIdPrev=this.tableData[0].memberFieldId;
          this.sortNumPrev=this.tableData[0].sortNum;
          this.fieldIdNext=this.tableData[index].memberFieldId;
          this.sortNumNext=this.tableData[0].sortNum-1;
        }else if(flag=='sortDown'){  // 置底
          this.fieldIdPrev=this.tableData[index].memberFieldId;
          this.sortNumPrev=this.tableData[this.tableData.length-1].sortNum+1;
          this.fieldIdNext=this.tableData[this.tableData.length-1].memberFieldId;
          this.sortNumNext=this.tableData[this.tableData.length-1].sortNum;
        }
        this.axios.post('/api-admin/member-field-sort',qs.stringify({
          requestProject:'gic-web',
          fieldIdPrev:this.fieldIdPrev,
          sortNumPrev:this.sortNumPrev,
          fieldIdNext:this.fieldIdNext,
          sortNumNext:this.sortNumNext
        })).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.loading = false;
            this.getInfoData(this.currentPage,this.pageSize);
            this.$message.success('排序成功')
          }else{
            this.$message.error(data.message)
          }
        })
      },
      handleDelete(index, id) {     // 删除会员信息字段
        // console.log(this.tableData);
        // console.log(id);
        this.loading = true;
        this.axios.post('/api-admin/member-field-del',qs.stringify({
          requestProject:'gic-web',
          id:id
        })).then((res)=>{
          var data = res.data;
          // console.log(data);
          this.loading = false;
          if(data.errorCode == 0){
            this.tableData.splice(index,1);
            this.totalCount = this.tableData.length;
            this.$message.success('删除成功')
          }else{
            this.$message.error(data.message)
          }
        })
      },
      addMemberInfo(){   // 新增
        this.$router.push('member_info_edit');
      },
      editMemberInfo(id){    // 编辑
        this.$router.push({
          path:'/member_info_edit',
          query:{
            id:id
          }
        })
      },
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.right-box{
    background: #fff;
    padding: 24px;
    .add-new-btn{
      text-align: right;
      margin-bottom: 22px;
    }
    .sort-icon-all{
      font-size: 16px;
      color: #606266;
      display: inline-block;
      cursor: pointer;
    }
    .sort-icon-down{
      transform: rotate(180deg);
    }
  }
  .pagination{
    text-align: right;
    margin-top: 20px;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
