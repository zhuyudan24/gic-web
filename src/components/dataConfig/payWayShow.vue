<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="text-tip"><i class="el-icon-info navtipcolor"></i><b>是否优惠支付：</b>实付销售额（去除优惠支付）将按此配置计算</div>
        <el-table
          class="table-no-line-wrap"
          :data="tableData"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="payCode"
            label="支付方式编码">
          </el-table-column>
          <el-table-column
            prop="payName"
            label="支付方式名称">
          </el-table-column>
          <el-table-column
            prop="isDiscountsPay"
            label="是否优惠支付"
            width="200">
             <template slot-scope="scope">
               {{scope.row.isDiscountsPay==1?"优惠":"非优惠"}}
            </template>
          </el-table-column>
          <template slot="empty">
            <div class="no-data-wrap">
              <div class="no-data-icon" >
                <img src="../../../static/img/no-data_icon.png" alt="">
              </div>
              <p>暂无数据</p>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
import topNav from 'components/nav/nav'
let qs = require('qs')
export default {
  name: "payWayShow", 
  data() {
    return {
      requestProject:'gic-web',
      navpath: [
        {
          name: '配置中心',
          path: ''
        },
        {
          name: '数据设置',
          path: ''
        },
        {
          name: '支付方式展示',
          path: ''
        }
      ],
      tableData:[],
      loading:false,
    }
  },
  mounted(){
    this.getPayList()
  },
  methods: {
    // 获取支付方式列表
    getPayList(){ 
        this.loading = true;
        this.axios.post('/api-admin/list-pay-setting',qs.stringify({
          requestProject:this.requestProject,
          isGic:1
        })).then(res=>{
          var data = res.data;
          this.loading = false;
          if(data.errorCode==0){
            this.tableData = data.result.result?data.result.result:[];
          }else{
            this.$message.error(data.message);
          }
        })
      },
  },
  components: {
    topNav,
  }     
}
</script>

<style lang="less" scoped>
  .text-tip{
    margin-bottom: 24px;
    min-width: 1200px;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
    border-radius: 2px;
    color: #606266;
    background-color: #f4f4f5;
    .navtipcolor{
      margin: 0 12px;
      color: #1890ff;
    }
    b{
      font-weight: 700
    }
  }
</style>
