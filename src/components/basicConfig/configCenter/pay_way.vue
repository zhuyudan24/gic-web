<template>
  <div class="right-wrap">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="bottom-content-wrap">
        <div class="search-wrap">
          <el-select @change="getPayList" class="select-wrap" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select @change="getPayList" class="select-wrap select-middle-wrap" v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input
            @keydown.enter.native="getPayList"
            class="input-wrap"
            placeholder="支付方式名称/编码"
            clearable
            suffix-icon="el-icon-search"
            v-model="searchInput">
          </el-input>
        </div>
        <div class="tip-wrap">
          <i class="el-icon-info"></i>
          保存后不可修改，保存后3日内生效。00:00~05:00期间不可保存
        </div>
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
            <template slot-scope="scope">
              <div class="pay-name">
                <span>{{ scope.row.payNameOld }}</span> 
                <el-popover
                  placement="top"
                  width="200"
                  @hide="cancelFileName(scope.row)"
                  v-model="scope.row.payNameBool">
                  <dm-input :byteType="1" type="text" v-model="scope.row.payName" :maxlength="8"></dm-input>
                  <div class="pay-name-btn">
                    <el-button type="text" size="mini" @click="cancelFileName(scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="sureFileName(scope.row)">确定</el-button>
                  </div>
                  <i v-if="!scope.row.isEditBool" slot="reference" class="el-icon-edit"></i>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column 
            label="是否优惠支付"
            :render-header="renderHeader">
            <template slot-scope="scope">
              <el-select :disabled="scope.row.isEditBool" class="table-select-wrap" v-model="scope.row.isDiscountsPay" placeholder="请选择">
                <el-option
                  v-for="item in options.slice(1)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="scene"
            label="是否计入销售额"
            :render-header="renderHeader">
            <template slot-scope="scope">
              <el-select :disabled="scope.row.isEditBool" class="table-select-wrap" v-model="scope.row.isReckonSales" placeholder="请选择">
                <el-option
                  v-for="item in options2.slice(1)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="scene"
            label="是否用于核销纠错"
            width="150">
            <template slot-scope="scope">
              <el-select :disabled="scope.row.isEditBool" class="table-select-wrap" v-model="scope.row.isCheckError" placeholder="请选择">
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
        <div class="btn-wrap">
          <el-button type="primary" @click="submitBtn" :disabled="submitBool">提 交</el-button>
        </div>
      </div>
  	</div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  let qs = require('qs')
  export default {
    name: "pay_way",
    data(){
    	return {
        requestProject:'gic-web',
    		navpath: [
          {
            name: '配置中心',
            path: ''
          },
          {
            name: '支付方式配置',
            path: ''
          }
        ],
        options: [
          {
            value: '',
            label: '全部优惠类型'
          }, {
            value: '1',
            label: '优惠'
          }, {
            value: '0',
            label: '非优惠'
          }
        ],
        value: '',
        options2: [
          {
            value: '',
            label: '全部计入类型'
          }, {
            value: '1',
            label: '计入'
          }, {
            value: '0',
            label: '不计入'
          }
        ],
        value2: '',
        options3: [{
            value: '1',
            label: '是'
          }, {
            value: '0',
            label: '否'
          }
        ],
        searchInput:'',
        tableData: [],
        loading:false,
        submitBool:true
    	}
    },
    mounted(){
      this.getPayList()
    },
    methods:{
      getPayList(){ // 获取支付方式列表
        this.loading = true;
        this.axios.post('/api-admin/list-pay-setting',qs.stringify({
          requestProject:this.requestProject,
          search:this.searchInput,
          isDiscountsPay:this.value,
          isReckonSales:this.value2,
        })).then(res=>{
          var data = res.data;
          this.loading = false;
          if(data.errorCode==0){
            this.tableData = data.result.result?data.result.result.map(el => ({
              ...el,
              payNameBool: false,
              payName:el.payName?el.payName:'',
              payNameOld:el.payName?el.payName:'',
              isEditBool:el.payName?true:false,
              isCheckError:el.isCheckError.toString(),
              isDiscountsPay:el.isDiscountsPay.toString(),
              isReckonSales:el.isReckonSales.toString(),
            })):[];
            this.tableData.forEach((el)=>{
              if(!el.isEditBool){
                this.submitBool = false;
              }
            })
            this.totalCount = data.result.totalCount;
          }
        })
      },
      cancelFileName(row,name){  // 修改支付方式名称的 取消
        row.payNameBool = false;
        row.payName = row.payNameOld
      },
      sureFileName(row){  // 修改支付方式名称的 确认
        row.payNameBool = false;
        row.payNameOld = row.payName;
      },
      // 自定义表头
      renderHeader(h, obj) {
        let r = h('span',[obj.column.label],{
          attrs:{
            style:'text-align:left'
          }
        })
        r = h('span',[
          obj.column.label,
          h('el-popover',{
            attrs:{
              trigger:'hover',
              width:'190',
              placement:'top'
            }
          },[
            this.operation(h,obj.column.label),
            // h('span',[
            //   '实付款（应收款-优惠支付）将按此配置计算。'
            // ]),
            h('i',{
              slot:'reference',
              attrs:{
                class:'iconfont tooltip-icon icon-xinxixianshi',
                style:'padding-left:4px;cursor:pointer'
              }
            })
          ])
        ])
        return r;
      },
      operation(h,label){
        var arr = [];
        if(label=="是否优惠支付"){
          arr = [
            h('span',{},[
              <span slot="content">实付款（应收款-优惠支付）将按此配置计算。</span>
            ])
          ]
        }else{
          arr = [
            h('span',{},[
              <span slot="content">销售额（应收款-不计入）及所有销售相关数据将按此计算，如客单价、会员最近消费等。</span>
            ])
          ]
        }
        return arr;
      },
      // 提交
      submitBtn(){
        // 判断现在时间 00:00~05:00期间不可保存
        var date = new Date();
        var hour = date.getHours();
        if(hour > '00' && hour < '05'){
          this.$confirm('00:00~05:00为数据处理时间，不可保存数据', '提示', {
            confirmButtonText: '知道了',
            cancelButtonText: '取消',
            type: 'warning',
            showCancelButton:false
          }).then(() => {
            
          }).catch(() => {
                    
          });
        }else{
          var arr = [];
          var flag = true;
          this.tableData.forEach((el)=>{
            var obj = {};
            obj.paySettingId = el.paySettingId;
            obj.payName = el.payName;
            obj.isDiscountsPay = parseInt(el.isDiscountsPay);
            obj.isReckonSales = parseInt(el.isReckonSales);
            obj.isCheckError = parseInt(el.isCheckError);
            arr.push(obj);
            if(!el.payName){
              flag = false
            }
          })
          if(!flag){
            this.$message.error('支付方式名称未填写完整')
          }else{
            this.$confirm('请确认支付方式对应信息已完善，保存后将不可修改，3日后对应数据将按此配置执行', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.axios.post('/api-admin/update-pay-setting',qs.stringify({
                requestProject:this.requestProject,
                paySettingList:JSON.stringify(arr)
              })).then(res=>{
                var data = res.data;
                if(data.errorCode==0){
                  this.submitBool = true;
                  this.getPayList();
                  this.$message.success('提交成功')
                }else{
                  this.$message.error(data.message)
                }
              });
            }).catch(() => {
                      
            });
          }
        }
      }
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
	.bottom-content-wrap{
    padding: 24px;
    background: #fff;
  }
  .search-wrap{
    font-size:0;
    .select-wrap{
      width: 150px;
    }
    .select-middle-wrap{
      margin: 0 8px
    }
    .input-wrap{
      width: 200px;
    }
  }
  .tip-wrap{
    margin: 22px 0;
    width: 100%;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
    border-radius: 2px;
    color: #606266;
    background-color: #f4f4f5;
    i{
      margin: 0 12px;
      color: #1890ff;
    }
  }
  .pay-name i {
    color: #909399;
    cursor: pointer;
  }
  .pay-name-btn {
    margin-top: 20px;
    text-align: right;
  }
  .table-select-wrap{
    width: 100px;
  }
  .btn-wrap{
    margin: 22px 0;
    text-align: center;
  }
  /* 去掉表格的最后一条线 */
  .table-no-line-wrap::before{
    height: 0
  }
</style>
