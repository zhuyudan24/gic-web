<template>
	<div class="func-wrap" >
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div class="func-list">
      <el-checkbox-group @change="handleCheckedCitiesChange" v-model="selectArr">
        <el-checkbox v-for="child in sendSelectData.childList" :label="child.rightId" :key="child.rightId">{{child.rightName}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "selectAll",
    props:{
      sendSelectData:{
        type:Object,
        default:{}
      },
      index:{
        type:Number,
        default:0
      }
    },
    data(){
    	return {
    		isIndeterminate:false,
        checkAll:false,
        selectArr:[], // 选中的值 只有id
        selectObj:{}, // 选中的值 整理成对象
        sendSelected:[],  // 整理之后的值  发送给父元素

        hasRight:[],  

        loading:false
    	}
    },
    created(){
      // this.options = this.sendSelectData;
      // console.log(this.sendSelectData);
    },
    mounted(){
      this.defaultSelect()
    },
    methods:{
      defaultSelect(){  // 默认选中的值
        this.selectArr = [];
        this.sendSelected = [];
        var count = 0;
        this.hasRight = [];
        this.sendSelectData.childList.forEach((item)=>{ // 获得默认选中值
          this.hasRight.push(item.hasRight);
          if(item.hasRight==1){
            count++;
            this.selectArr.push(item.rightId);
            var obj1 = {};
            obj1.rightId = item.rightId;
            obj1.rightType = item.rightType;
            this.sendSelected.push(obj1);
          }
        })
        // console.log(this.hasRight);
        if(this.hasRight.indexOf('1')!=-1 || this.sendSelectData.hasRight == 1){  // 有子元素  或者  选中第一级
          var obj = {};
          obj.rightId = this.sendSelectData.rightId;
          obj.rightType = this.sendSelectData.rightType;
          this.sendSelected.push(obj);
        }
        if(count>0 && count<this.sendSelectData.childList.length){ // 有子元素 且 未全选
          this.isIndeterminate = true;
        }
        if(count==this.sendSelectData.childList.length && this.sendSelectData.hasRight == 1){  // 全选样式的取消与清除 与值的传递
            this.checkAll = true;
            this.isIndeterminate = false;
          }
        this.$emit('sendDataToFather',{index:this.index,data:this.sendSelected});
        // console.log(this.selectArr);
      },
    	handleCheckAllChange(val) { // 全选
        // console.log(val);
        this.sendSelected = [];
        var rightId = [];
        this.sendSelectData.childList.forEach((item)=>{  // 获得所有的id
          rightId.push(item.rightId)
        })
        this.selectArr = val ? rightId : [];
        this.isIndeterminate = false;
        // console.log(this.selectArr);
        if(val){    // 若全选
          var obj = {};
          obj.rightId = this.sendSelectData.rightId;
          obj.rightType = this.sendSelectData.rightType;
          this.sendSelected.push(obj);
          this.sendSelectData.childList.forEach((item)=>{
            var obj1 = {};
            obj1.rightId = item.rightId;
            obj1.rightType = item.rightType;
            this.sendSelected.push(obj1);
          })
          // console.log(this.sendSelected);
        }
        this.$emit('sendDataToFather',{index:this.index,data:this.sendSelected});
      },
      handleCheckedCitiesChange(value) {  // 单个选
        // console.log(this.selectArr);
        let checkedCount = value.length;
        let allCount = this.sendSelectData.childList.length;
        this.checkAll = checkedCount === allCount;
        this.isIndeterminate = checkedCount > 0 && checkedCount < allCount;
        this.sendSelected = [];
        if(checkedCount>0){ // 单个的选择有内容
          if(checkedCount!=allCount){   // 单个选择时  若相等 即全选
            var obj = {};
            obj.rightId = this.sendSelectData.rightId;
            obj.rightType = this.sendSelectData.rightType;
            this.sendSelected.push(obj);

            value.forEach((item,index)=>{
              this.sendSelectData.childList.forEach((ele,idx)=>{  // 通过循环，拼接所有选中的值的数据
                if(item==ele.rightId){  
                  var obj1 = {};
                  obj1.rightId = ele.rightId;
                  obj1.rightType = ele.rightType;
                  this.sendSelected.push(obj1);
                }
              })
            })
          }else{    // 全选
            var obj = {};
            obj.rightId = this.sendSelectData.rightId;
            obj.rightType = this.sendSelectData.rightType;
            this.sendSelected.push(obj);
            this.sendSelectData.childList.forEach((item)=>{
              var obj = {};
              obj.rightId = item.rightId;
              obj.rightType = item.rightType;
              this.sendSelected.push(obj);
            })
          }
        }else{  // 二级无选择内容
          this.sendSelected = [];
        }
        // console.log(this.sendSelected);
        this.$emit('sendDataToFather',{index:this.index,data:this.sendSelected});
      },
    },
    components: {

    }
  }
</script>

<style lang="less" scoped>
  .func-wrap{
    width: 1030px;
  }
  .func-wrap /deep/ .el-checkbox{
    width: 180px;
  }
  .func-wrap /deep/ .el-checkbox:nth-child(5n+1){
    margin-left: 0;
  }
</style>
