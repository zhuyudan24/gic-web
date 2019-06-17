<template>
  <!--弹框-->
  <el-dialog
    title="添加适用单品"
    :visible.sync="goodShow"
    width="516px"
    :before-close="handleClose">

    <div class="dialogwrap">
      <div class="good-input">

        <el-input v-if="goodsTypeStr=='wx'" v-model="goodsInput1" placeholder="请输入商品货号，多个货号之间用空格隔开"></el-input>
        <el-input v-if="goodsTypeStr=='line'" v-model="goodsInput2" placeholder="请输入商品货号，多个货号之间用空格隔开"></el-input>

        <el-button class="add-btn" @click="addGoods">添加</el-button>
      </div>
      <div class="good-clear clearfix">

        <div v-if="goodsTypeStr=='wx'" class="flex-1">已添加{{goodsListAll1.length}}件商品</div>
        <div v-if="goodsTypeStr=='line'" class="flex-1">已添加{{goodsListAll2.length}}件商品</div>

        <el-button style="padding: 0" class="fr" type="text" @click="delGoods">全部清除</el-button>
      </div>

      <div v-if="goodsTypeStr=='wx'" class="good-list">
        <ul v-if="goodsListAll1.length>0" class="goods-ul">
          <li v-for="(item,index) in goodsListAll1" :key="item.proId">
            <img :src="item.mainPicUrl" :alt="item.name"/>
            <div class="good-info">
              <div class="good-name">{{item.proName}}</div>
              <div class="good-num">{{item.proNo}}</div>
            </div>
          </li>
        </ul>
        <div v-else class="no-data-wrap">
          <div class="no-data-icon" >
            <img src="../../../static/img/no-data_icon.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
      </div>
      <div v-if="goodsTypeStr=='line'" class="good-list">
        <ul v-if="goodsListAll2.length>0" class="goods-ul">
          <li v-for="(item,index) in goodsListAll2" :key="item.proId">
            <img :src="item.mainPicUrl" :alt="item.name"/>
            <div class="good-info">
              <div class="good-name">{{item.proName}}</div>
              <div class="good-num">{{item.proNo}}</div>
            </div>
          </li>
        </ul>
        <div v-else class="no-data-wrap">
          <div class="no-data-icon" >
            <img src="../../../static/img/no-data_icon.png" alt="">
          </div>
          <p>暂无数据</p>
        </div>
      </div>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-row>
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </el-row>
     </span>
  </el-dialog>
</template>

<script>
import { getRequest,postRequest } from '../../api/api';
export default {
  name: "add-goods",
  props:{
    goodShow: Boolean,
    projectName: String,
    goodsType:String,
    goodsListId:Array
  },
  data() {
    return {
      goodsInput1: '', //输入框
      goodsInput2: '',
      repProjectName: 'gic-web', //当前所在项目名
      goodsTypeStr:'',  // 单个商品类型  wx：微信商城，line：线下渠道
      // 商品列表
      // goodsListAllTotal:[],
      // goodsInputTotal:'',

      goodsListAll1: [],
      goodsListSelect1: [],
      goodsListSelectId1: [],

      goodsListAll2: [],
      goodsListSelect2: [],
      goodsListSelectId2: [],
    }
  },
  /* 接收数据 */
  watch: {
    goodShow: function(newData,oldData){
      this.repProjectName = this.projectName || 'gic-web';
      this.goodsTypeStr = this.goodsType; // 单个商品类型  wx：微信商城，line：线下渠道
      if(newData) {
        this.init()
      }
    },
  },
  created() {
    // this.selectReplayStyle()
    console.log('create1')
  },
  methods: {
    init(){
      // this.goodsListAllTotal.splice(0,this.goodsListAllTotal.length);
      // this.goodsInputTotal = "";


      if(this.goodsTypeStr == 'wx'){
        this.goodsListSelect1 = this.goodsListId;
        if(this.goodsListSelect1 && this.goodsListSelect1.length>0){
          this.goodsInput1 = this.goodsListSelect1.join(' '); // 用于搜索
          this.getGoodsWx()
        }
      }else if(this.goodsTypeStr == 'line'){
        this.goodsListSelect2 = this.goodsListId;
        if(this.goodsListSelect2 && this.goodsListSelect2.length>0){
          this.goodsInput2 = this.goodsListSelect2.join(' '); // 用于搜索
          this.getGoodsLine()
        }
      }
    },
    getGoodsWx(){   // 微信商城 的 单件商品列表
      var that = this
      var para = {
        requestProject: that.repProjectName,
        proNos:that.goodsInput1
      };
      postRequest('/api-mall/goods-search-by-pronos',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          if(resData.result){
            resData.result.forEach((item)=>{
              if(that.goodsListSelectId1.indexOf(item.proNo)==-1){
                that.goodsListSelectId1.push(item.proNo);
                that.goodsListAll1.push(item);
              }
            })
          }
        }else{
          that.$message.error({
            duration: 1000,
            message: resData.message
          })
        }
      })
      .catch(function (error) {
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },
    getGoodsLine(){   // 线下渠道 的 单件商品列表
      var that = this
      var para = {
        requestProject: that.repProjectName,
        proNos:that.goodsInput2
      };
      postRequest('/api-goods/goods-search-by-pronos',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {
          if(resData.result){
            resData.result.forEach((item)=>{
              if(that.goodsListSelectId2.indexOf(item.proNo)==-1){
                that.goodsListSelectId2.push(item.proNo);
                that.goodsListAll2.push(item);
              }
            })
          }
        }else{
          that.$message.error({
            duration: 1000,
            message: resData.message
          })
        }
      })
      .catch(function (error) {
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },
    // 确定
    confirm() {
      var that = this;
      // this.$emit('update:goodShow',false);
      var obj = {};
      obj.strategyGoodsRelationIds = [];
      obj.goodsType = that.goodsTypeStr;
      that.$emit('selectGoods',obj); // 触发父组件返回添加商品
      
      if(that.goodsTypeStr == 'wx'){
        if(that.goodsListAll1.length>0){
          var obj = {};
          obj.strategyGoodsRelationIds = that.goodsListSelectId1;
          obj.goodsType = that.goodsTypeStr;
          that.$emit('selectGoods',obj); // 触发父组件返回添加商品
        }else if(that.goodsTypeStr == 'line'){
          that.$message.error('请选择要添加的商品');
        }
      }else{
        if(that.goodsListAll2.length>0){
          var obj = {};
          obj.strategyGoodsRelationIds = that.goodsListSelectId2;
          obj.goodsType = that.goodsTypeStr;
          that.$emit('selectGoods',obj); // 触发父组件返回添加商品
        }else{
          that.$message.error('请选择要添加的商品');
        }
      }
    },
    // 关闭
    handleClose(){
      var that = this
      that.cancle();
    },
    // 取消
    cancle() {
      this.$emit('update:goodShow',false);
    },
    // 添加
    addGoods() {
      if(this.goodsTypeStr=='wx'){
        if(this.goodsListAll1.length==50){
          this.$message.error('最多添加50个商品')
        }else{
          if(this.goodsInput1==""){
            this.$message.error('请输入商品货号')
          }else{
            if(this.goodsListSelectId1.indexOf(this.goodsInput1)==-1){  // 单个  不带空格的 
              this.getGoodsWx();  // 微信商城 的 单件商品列表
            }
          }
        }
      }else if(this.goodsTypeStr=='line'){
        if(this.goodsListAll2.length==50){
          this.$message.error('最多添加50个商品')
        }else{
          if(this.goodsInput2==""){
            this.$message.error('请输入商品货号')
          }else{
            if(this.goodsListSelectId2.indexOf(this.goodsInput2)==-1){  // 单个  不带空格的 
              this.getGoodsLine()  // 线下渠道 的 单件商品列表
            }
          }
        }
      }
    },
    // 清除
    delGoods() {
      if(this.goodsTypeStr=='wx'){
        this.goodsListSelectId1.splice(0,this.goodsListSelectId1.length);
        this.goodsListAll1.splice(0,this.goodsListAll1.length);
        this.goodsInput1=""
      }else{
        this.goodsListSelectId2.splice(0,this.goodsListSelectId2.length);
        this.goodsListAll2.splice(0,this.goodsListAll2.length);
        this.goodsInput2=""
      }
    }
  },
}
</script>

<style lang="less" scoped>
  .el-dialog__wrapper {
    /deep/ .el-dialog__body {
      padding: 15px 0px;
    }
  }
  .dialogwrap{
    position: relative;
    /*&:before{
      position: absolute;
      left: 0px;
      top: -15px;
      right: 0px;
      content: '';
      border-bottom: 1px solid #dedede;
    }*/



    .good-input {
      margin-bottom: 15px;
      padding: 0 15px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .el-input {
      width: 384px;
    }

    .add-btn {
      margin-left: 5px;
    }

    .good-clear {
      display: flex;
      justify-content: space-between;
      height: 48px;
      line-height: 48px;
      padding: 0 15px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background: #F5F6FA;
      .flex-1 {
        flex: 1;
        &+.flex-1 {
          text-align: right;
        }
      }
    }

    .good-list {
      height: 300px;
      padding: 0 15px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      overflow-y: auto;
    }

    .goods-ul {
      li {
        display: flex;
        border-bottom: 1px solid #e6eaeb;
        position: relative;
        cursor: pointer;
        padding: 10px 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        img {
          width: 58px;
          height: 58px;
          vertical-align: middle;
          margin-right: 10px;
        }
        .good-info {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          div {
            flex: 1;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .no-data-wrap {
    text-align: center;
    padding: 80px 0;
    p {
      color: #909399;
    }
    .no-data-icon{
      width: 60px;
      height: 60px;
      margin: 0 auto;
      margin-bottom: 22px;
    }
  }
  .no-data{
    font-size: 14px;
    color: #606266;
    text-align: center;
    line-height: 300px;
  }
</style>
