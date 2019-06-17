<template>
<div>
  <div class="right-wrap" :style="{minHeight: (bodyHeight - 164) + 'px'}">
  	<topNav :navpath="navpath"></topNav>
  	<div class="right-content">
      <div class="right-box" v-loading="loading">
        <ul class="item-list clearfix">
          <li class="fl one">
            <h3 class="title">客单价设置</h3>
            <div class="one-single">
              <div class="single-input">
                <span class="input-span">P≥</span><el-input maxlength="5" @keyup.native="regLeftInput1(leftInput1)" v-model="leftInput1" class="input"></el-input>
              </div>
              <div class="double-input">
                <el-input maxlength="5" @keyup.native="regLeftInput2" v-model="leftInput2" class="input"></el-input><span class="input-span">≤P&lt;</span><el-input maxlength="5" @keyup.native="regLeftInput3" v-model="leftInput3" class="input"></el-input>
              </div>
              <div class="double-input">
                <el-input maxlength="5" @keyup.native="regLeftInput4" v-model="leftInput4" class="input"></el-input><span class="input-span">≤P&lt;</span><el-input maxlength="5" @keyup.native="regLeftInput5" v-model="leftInput5" class="input"></el-input>
              </div>
            </div>
          </li>
          <li class="fl two-new">
            <div class="title-wrap clearfix">
              <h3 class="title first-title">C类会员</h3>
              <h3 class="title">A类会员</h3>
            </div>
            <ul class="member-wrap clearfix">
              <li v-for="(item,index) in firstArr">
                <p v-if="item.avgCostMax==999999">客单价：≥{{item.avgCostMin==-1?"":item.avgCostMin}}</p>
                <p v-else>客单价：{{item.avgCostMin==-1?"":item.avgCostMin}}-{{item.avgCostMax==-1?"":item.avgCostMax}}</p>

                <p v-if="item.costTimesMin==-2">消费次数：≤{{item.costTimesMax==-1?"":item.costTimesMax}}</p>
                <p v-else-if="item.costTimesMax==999999">消费次数：≥{{item.costTimesMin==-1?"":item.costTimesMin}}</p>
                <p v-else>消费次数：{{item.costTimesMin==-1?"":item.costTimesMin}}-{{item.costTimesMax==-1?"":item.costTimesMax}}</p>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="item-list clearfix" style="border-top: none;">
          <li class="fl one">
            <h3 class="title"></h3>
            <div class="one-single">
              <div class="double-input">
                <el-input maxlength="5" @keyup.native="regLeftInput6" v-model="leftInput6" class="input"></el-input><span class="input-span">≤P&lt;</span><el-input maxlength="5" @keyup.native="regLeftInput7" v-model="leftInput7" class="input"></el-input>
              </div>
              <div class="double-input">
                <el-input maxlength="5" @keyup.native="regLeftInput8" v-model="leftInput8" class="input"></el-input><span class="input-span">≤P&lt;</span><el-input maxlength="5" @keyup.native="regLeftInput9" v-model="leftInput9" class="input"></el-input>
              </div>
              <div class="single-input">
                <span class="input-span">P&lt;</span><el-input maxlength="5" @keyup.native="regLeftInput10" v-model="leftInput10" class="input"></el-input>
              </div>
            </div>
          </li>
          <li class="fl two-new">
            <div class="title-wrap clearfix">
              <h3 class="title first-title">D类会员</h3>
              <h3 class="title">B类会员</h3>
            </div>
            <ul class="member-wrap clearfix">
              <li v-for="(item,index) in secondArr">
                <p v-if="item.avgCostMin==-2">客单价：&lt;{{item.avgCostMax==-1?"":item.avgCostMax}}</p>
                <p v-else>客单价：{{item.avgCostMin==-1?"":item.avgCostMin}}-{{item.avgCostMax==-1?"":item.avgCostMax}}</p>

                <p v-if="item.costTimesMin==-2">消费次数：≤{{item.costTimesMax==-1?"":item.costTimesMax}}</p>
                <p v-else-if="item.costTimesMax==999999">消费次数：≥{{item.costTimesMin==-1?"":item.costTimesMin}}</p>
                <p v-else>消费次数：{{item.costTimesMin==-1?"":item.costTimesMin}}-{{item.costTimesMax==-1?"":item.costTimesMax}}</p>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="item-list clearfix foot-item-list" style="border-top: none;">
          <li class="fl one">
            <h3 class="title">消费次数设置</h3>
          </li>
          <li class="fl two-new foot-two">
            <ul class="foot-two-wrap clearfix">
              <li>
                <span class="input-span">≤</span><el-input maxlength="3" @keyup.native="regBottomInput1" v-model="bottomInput1" class="foot-input"></el-input>
              </li>
              <li>
                <el-input maxlength="3" @keyup.native="regBottomInput2" v-model="bottomInput2" class="foot-input"></el-input><span class="input-span">-</span><el-input maxlength="3" @keyup.native="regBottomInput3" v-model="bottomInput3" class="foot-input"></el-input>
              </li>
              <li>
                <el-input maxlength="3" @keyup.native="regBottomInput4" v-model="bottomInput4" class="foot-input"></el-input><span class="input-span">-</span><el-input maxlength="3" @keyup.native="regBottomInput5" v-model="bottomInput5" class="foot-input"></el-input>
              </li>
              <li>
                <el-input maxlength="3" @keyup.native="regBottomInput6" v-model="bottomInput6" class="foot-input"></el-input><span class="input-span">-</span><el-input maxlength="3" @keyup.native="regBottomInput7" v-model="bottomInput7" class="foot-input"></el-input>
              </li>
              <li>
                <el-input maxlength="3" @keyup.native="regBottomInput8" v-model="bottomInput8" class="foot-input"></el-input><span class="input-span">-</span><el-input maxlength="3" @keyup.native="regBottomInput9" v-model="bottomInput9" class="foot-input"></el-input>
              </li>
              <li>
                <span class="input-span">≥</span><el-input maxlength="3" @keyup.native="regBottomInput10" v-model="bottomInput10" class="foot-input"></el-input>
              </li>
            </ul>
          </li>
        </ul>
        <div class="save-btn">
          <el-button @click="saveBtn" type="primary">保存</el-button>
        </div>
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
    inject:['reload'],  // 注入依赖
    name: "member_value",
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
            name: '会员价值分类',
            path: ''
          }
        ],
        allArr:[],
        firstArr:[],
        secondArr:[],
        leftInput1:'',
        leftInput2:'',
        leftInput3:'',
        leftInput4:'',
        leftInput5:'',
        leftInput6:'',
        leftInput7:'',
        leftInput8:'',
        leftInput9:'',
        leftInput10:'',
        bottomInput1:'',
        bottomInput2:'',
        bottomInput3:'',
        bottomInput4:'',
        bottomInput5:'',
        bottomInput6:'',
        bottomInput7:'',
        bottomInput8:'',
        bottomInput9:'',
        bottomInput10:'',
        leftArr:[],
        bottomArr:[],
        loading:false,

        saveBool:true,
    	}
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      },
      this.getValueData();
    },
    methods:{
      getValueData(){
        this.loading = true;
        this.axios.get('/api-admin/get-member-value-set-detail',{
          params: {
            requestProject:'gic-web'
          }
        }).then((res)=>{
          var data = res.data;
          console.log(data);
          if(data.errorCode == 0){
            this.loading = false;
            this.allArr = data.result;
            if(this.allArr.length>0){
              for(var i=0;i<this.allArr.length/2;i++){
                this.firstArr[i]=this.allArr[i];
                this.secondArr[i]=this.allArr[i+this.allArr.length/2];
              }
              this.leftInput1=this.firstArr[0].avgCostMin==-1?"":this.firstArr[0].avgCostMin.toString();
              this.leftInput2=this.firstArr[6].avgCostMin==-1?"":this.firstArr[6].avgCostMin.toString();
              this.leftInput3=this.firstArr[6].avgCostMax==-1?"":this.firstArr[6].avgCostMax.toString();
              this.leftInput4=this.firstArr[12].avgCostMin==-1?"":this.firstArr[12].avgCostMin.toString();
              this.leftInput5=this.firstArr[12].avgCostMax==-1?"":this.firstArr[12].avgCostMax.toString();
              this.leftInput6=this.secondArr[0].avgCostMin==-1?"":this.secondArr[0].avgCostMin.toString();
              this.leftInput7=this.secondArr[0].avgCostMax==-1?"":this.secondArr[0].avgCostMax.toString();
              this.leftInput8=this.secondArr[6].avgCostMin==-1?"":this.secondArr[6].avgCostMin.toString();
              this.leftInput9=this.secondArr[6].avgCostMax==-1?"":this.secondArr[6].avgCostMax.toString();
              this.leftInput10=this.secondArr[12].avgCostMax==-1?"":this.secondArr[12].avgCostMax.toString();
              this.bottomInput1=this.firstArr[0].costTimesMax==-1?"":this.firstArr[0].costTimesMax.toString();
              this.bottomInput2=this.firstArr[1].costTimesMin==-1?"":this.firstArr[1].costTimesMin.toString();
              this.bottomInput3=this.firstArr[1].costTimesMax==-1?"":this.firstArr[1].costTimesMax.toString();
              this.bottomInput4=this.firstArr[2].costTimesMin==-1?"":this.firstArr[2].costTimesMin.toString();
              this.bottomInput5=this.firstArr[2].costTimesMax==-1?"":this.firstArr[2].costTimesMax.toString();
              this.bottomInput6=this.firstArr[3].costTimesMin==-1?"":this.firstArr[3].costTimesMin.toString();
              this.bottomInput7=this.firstArr[3].costTimesMax==-1?"":this.firstArr[3].costTimesMax.toString();
              this.bottomInput8=this.firstArr[4].costTimesMin==-1?"":this.firstArr[4].costTimesMin.toString();
              this.bottomInput9=this.firstArr[4].costTimesMax==-1?"":this.firstArr[4].costTimesMax.toString();
              this.bottomInput10=this.firstArr[5].costTimesMin==-1?"":this.firstArr[5].costTimesMin.toString();
            }else{
              // this.allArr = new Array(36);
              // console.log(this.allArr);
              // for(var i=0;i<this.allArr.length/2;i++){
              //   this.firstArr[i]=this.allArr[i];
              //   this.secondArr[i]=this.allArr[i+this.allArr.length/2];
              // }
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      regLeftInput1(value){
        // console.log(this.leftInput1);
        // console.log(value);
        // var reg = /^\+?[1-9][0-9]*$/;
        // if(! reg.test(value)){
        //   this.$message.error('只能输入5位整数哦');
        // }
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput1)>0){
          this.leftInput1=this.leftInput1.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput1)){
            this.leftInput1="";
          }
        }
      },
      regLeftInput2(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput2)>0){
          this.leftInput2=this.leftInput2.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput2)){
            this.leftInput2="";
          }
        }
      },
      regLeftInput3(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput3)>0){
          this.leftInput3=this.leftInput3.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput3)){
            this.leftInput3="";
          }
        }
      },
      regLeftInput4(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput4)>0){
          this.leftInput4=this.leftInput4.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput4)){
            this.leftInput4="";
          }
        }
      },
      regLeftInput5(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput5)>0){
          this.leftInput5=this.leftInput5.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput5)){
            this.leftInput5="";
          }
        }
      },
      regLeftInput6(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput6)>0){
          this.leftInput6=this.leftInput6.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput6)){
            this.leftInput6="";
          }
        }
      },
      regLeftInput7(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput7)>0){
          this.leftInput7=this.leftInput7.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput7)){
            this.leftInput7="";
          }
        }
      },
      regLeftInput8(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput8)>0){
          this.leftInput8=this.leftInput8.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput8)){
            this.leftInput8="";
          }
        }
      },
      regLeftInput9(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput9)>0){
          this.leftInput9=this.leftInput9.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput9)){
            this.leftInput9="";
          }
        }
      },
      regLeftInput10(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.leftInput10)>0){
          this.leftInput10=this.leftInput10.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.leftInput10)){
            this.leftInput10="";
          }
        }
      },
      regBottomInput1(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput1)>0){
          this.bottomInput1=this.bottomInput1.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput1)){
            this.bottomInput1="";
          }
        }
      },
      regBottomInput2(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput2)>0){
          this.bottomInput2=this.bottomInput2.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput2)){
            this.bottomInput2="";
          }
        }
      },
      regBottomInput3(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput3)>0){
          this.bottomInput3=this.bottomInput3.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput3)){
            this.bottomInput3="";
          }
        }
      },
      regBottomInput4(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput4)>0){
          this.bottomInput4=this.bottomInput4.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput4)){
            this.bottomInput4="";
          }
        }
      },
      regBottomInput5(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput5)>0){
          this.bottomInput5=this.bottomInput5.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput5)){
            this.bottomInput5="";
          }
        }
      },
      regBottomInput6(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput6)>0){
          this.bottomInput6=this.bottomInput6.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput6)){
            this.bottomInput6="";
          }
        }
      },
      regBottomInput7(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput7)>0){
          this.bottomInput7=this.bottomInput7.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput7)){
            this.bottomInput7="";
          }
        }
      },
      regBottomInput8(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput8)>0){
          this.bottomInput8=this.bottomInput8.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput8)){
            this.bottomInput8="";
          }
        }
      },
      regBottomInput9(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput9)>0){
          this.bottomInput9=this.bottomInput9.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput9)){
            this.bottomInput9="";
          }
        }
      },
      regBottomInput10(){
        var reg = /^\+?[1-9]\d*$/;
        if(parseInt(this.bottomInput10)>0){
          this.bottomInput10=this.bottomInput10.toString().replace(/\D/g,'');
        }else{
          if(!reg.test(this.bottomInput10)){
            this.bottomInput10="";
          }
        }
      },

      saveBtn(){
        if(parseInt(this.leftInput1) < 1 || parseInt(this.leftInput2) < 1 || parseInt(this.leftInput3) < 1 || parseInt(this.leftInput4) < 1 || parseInt(this.leftInput5) < 1 || parseInt(this.leftInput6) < 1 || parseInt(this.leftInput7) < 1 || parseInt(this.leftInput8) < 1 || parseInt(this.leftInput9) < 1 || parseInt(this.leftInput10) < 1){
          this.$message.error('请输入客单价');
          return;
        }
        if(parseInt(this.leftInput3) < parseInt(this.leftInput2) || parseInt(this.leftInput5) < parseInt(this.leftInput4) || parseInt(this.leftInput7) < parseInt(this.leftInput6) || parseInt(this.leftInput9) < parseInt(this.leftInput8)){
          this.$message.error('客单价中的最大值不能小于最小值');
          return;
        }
        if(parseInt(this.leftInput10) != parseInt(this.leftInput8) || parseInt(this.leftInput9) != parseInt(this.leftInput6) || parseInt(this.leftInput7) != parseInt(this.leftInput4) || parseInt(this.leftInput5) != parseInt(this.leftInput2) || parseInt(this.leftInput3) != parseInt(this.leftInput1) ){
          this.$message.error('客单价必须连续');
          return;
        }
        if(parseInt(this.bottomInput1) < 1 || parseInt(this.bottomInput2) < 1 || parseInt(this.bottomInput3) < 1 || parseInt(this.bottomInput4) < 1 || parseInt(this.bottomInput5) < 1 || parseInt(this.bottomInput6) < 1 || parseInt(this.bottomInput7) < 1 || parseInt(this.bottomInput8) < 1 || parseInt(this.bottomInput9) < 1 || parseInt(this.bottomInput10) < 1){
          this.$message.error('请输入消费次数');
          return;
        }
        if(parseInt(this.bottomInput3) < parseInt(this.bottomInput2) || parseInt(this.bottomInput5) < parseInt(this.bottomInput4) || parseInt(this.bottomInput7) < parseInt(this.bottomInput6) || parseInt(this.bottomInput9) < parseInt(this.bottomInput8)){
          this.$message.error('消费次数中的最大值不能小于最小值');
          return;
        }
        if(parseInt(this.bottomInput2) != parseInt(this.bottomInput1)+1 || parseInt(this.bottomInput4) != parseInt(this.bottomInput3)+1 || parseInt(this.bottomInput6) != parseInt(this.bottomInput5)+1 || parseInt(this.bottomInput8) != parseInt(this.bottomInput7)+1 || parseInt(this.bottomInput10) != parseInt(this.bottomInput9)+1){
          this.$message.error('消费次数必须连续');
          return;
        }
        
        var leftObj1={};
        leftObj1.start=this.leftInput1.replace(/\b(0+)/gi,"");
        leftObj1.end=999999;
        this.leftArr.push(leftObj1);

        var leftObj2={};
        leftObj2.start=this.leftInput2.replace(/\b(0+)/gi,"");
        leftObj2.end=this.leftInput3.replace(/\b(0+)/gi,"");
        this.leftArr.push(leftObj2);

        var leftObj3={};
        leftObj3.start=this.leftInput4.replace(/\b(0+)/gi,"");
        leftObj3.end=this.leftInput5.replace(/\b(0+)/gi,"");
        this.leftArr.push(leftObj3);

        var leftObj4={};
        leftObj4.start=this.leftInput6.replace(/\b(0+)/gi,"");
        leftObj4.end=this.leftInput7.replace(/\b(0+)/gi,"");
        this.leftArr.push(leftObj4);

        var leftObj5={};
        leftObj5.start=this.leftInput8.replace(/\b(0+)/gi,"");
        leftObj5.end=this.leftInput9.replace(/\b(0+)/gi,"");
        this.leftArr.push(leftObj5);

        var leftObj6={};
        leftObj6.start=-2;
        leftObj6.end=this.leftInput10.replace(/\b(0+)/gi,"");
        this.leftArr.push(leftObj6);

        var bottomObj1={};
        bottomObj1.start=-2;
        bottomObj1.end=this.bottomInput1.replace(/\b(0+)/gi,"");
        this.bottomArr.push(bottomObj1);

        var bottomObj2={};
        bottomObj2.start=this.bottomInput2.replace(/\b(0+)/gi,"");
        bottomObj2.end=this.bottomInput3.replace(/\b(0+)/gi,"");
        this.bottomArr.push(bottomObj2);

        var bottomObj3={};
        bottomObj3.start=this.bottomInput4.replace(/\b(0+)/gi,"");
        bottomObj3.end=this.bottomInput5.replace(/\b(0+)/gi,"");
        this.bottomArr.push(bottomObj3);

        var bottomObj4={};
        bottomObj4.start=this.bottomInput6.replace(/\b(0+)/gi,"");
        bottomObj4.end=this.bottomInput7.replace(/\b(0+)/gi,"");
        this.bottomArr.push(bottomObj4);

        var bottomObj5={};
        bottomObj5.start=this.bottomInput8.replace(/\b(0+)/gi,"");
        bottomObj5.end=this.bottomInput9.replace(/\b(0+)/gi,"");
        this.bottomArr.push(bottomObj5);

        var bottomObj6={};
        bottomObj6.start=this.bottomInput10.replace(/\b(0+)/gi,"");
        bottomObj6.end=999999;
        this.bottomArr.push(bottomObj6);

        if(this.saveBool){
          this.saveBool = false;
          this.axios.post('/api-admin/member-value-set-save',qs.stringify({
            requestProject:'gic-web',
            a:JSON.stringify(this.leftArr),
            b:JSON.stringify(this.bottomArr)
          })).then((res)=>{
            var data = res.data;
            //console.log(data);
            this.saveBool = true;
            if(data.errorCode == 0){
              this.$message.success('保存成功');
              this.reload();    // 调用依赖
            }
          })
        }
      }
    },
    components:{
    	topNav
    }
  }
</script>

<style lang="less" scoped>
  .item-list{
    border: 1px solid #e7e7eb;
    font-size: 12px;
    .one{
      width: 22%;
      border-right: 1px solid #e7e7eb;
      box-sizing: border-box;
    }
    .three{
      width: 39%;
      box-sizing: border-box;
    }
    .title{
      background: #f1f3f7;
      color: #909399;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      padding-left: 10px;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
    }
    .single-input,.double-input{
      text-align: center;
      height: 80px;
      border-top: 1px solid #e7e7eb;
      line-height: 80px;
    }
    .input-span{
      padding: 0 5px;
    }
    .input{
      display: inline-block;
      width: 85px;
      height: 32px;
      vertical-align: sub;
    }
    .member-wrap{
      li{
        width: 16.66%;
        box-sizing: border-box;
        float: left;
        padding:15px 8px;
        height: 80px;
        border-top: 1px solid #e7e7eb;
        border-right: 1px solid #e7e7eb;
        >p{
          font-size: 12px;
          color: #606266;
          line-height: 26px;
        }
        .switch-state{
          margin-top: 8px;
        }
      }
    }
    .member-wrap li:nth-child(6n){
      border-right: none;
    }
    .two-new{
      width: 78%;
      box-sizing:border-box;
      .title-wrap{
        width: 100%;
        .title{
          width: 50%;
          float: left;
        }
        .first-title{
          border-right: 1px solid #e7e7eb;
        }
      }
    }
  }
  .foot-item-list{
    .title{
      height: 100%;
      line-height: 56px;
    }
    .foot-two{
      line-height: 55px;
      text-align: center;
      .foot-two-wrap{
        li{
          float: left;
          width: 16.66%;
          border-right: 1px solid #e7e7eb;
          box-sizing: border-box;
          .foot-input{
            display: inline-block;
            width: 57px;
            height: 32px;
            vertical-align: sub;
          }
        }
      }
    }
  }
  .foot-item-list .foot-two .foot-two-wrap li:nth-child(6n){
    border-right: none;
  }
  .item-list /deep/ .el-input--medium .el-input__inner{
    font-size: 12px;
  }
  .save-btn{
    margin: 24px 0;
    text-align: center;
  }
</style>
