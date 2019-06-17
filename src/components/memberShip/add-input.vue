<template>
  <div class="input-line-cell">
    <el-input class="w-340" v-model="itemValue" placeholder="" :disabled="disableInput==0? false: true"  @focus="inputFocus(c3Index)" @keyup.native="(value) => toInput(value)"></el-input>
    <span class="tip"><span class="len_span">{{inputNum}}</span>/{{limitLength}}</span>
  </div>

</template>
<script>
  import strLength from '@/common/js/strlen';
  export default {
    name: "addinput",
    props: {
      childItem: String,   // 传入是不是 k303(原C3)
      childIndex: Number,  // 传入的 k303(原C3)  索引

      titleName: String,  //传入的标题子段
      inputValue: String, // 传入 input value
      maxLength: Number, // 限制长度
      disFlag: Number,  // 禁用标志,0: false,1: true

      child: String, // 传入的子级标题
    },
    data() {
      return {
        inputNum: 0,
        limitLength: 10,
        itemValue: '',
        disableInput: false,

        c3Flag: '',
        c3Index: '',

        titleFlag: '',
        childFlag: '',
      }
    },
    methods: {
      inputFocus(num) {
        var that = this
        console.log(num)
      },
      // 输入
      toInput: function(value) {
        var that = this;
        console.log(value)

        var temp = '';
        var temp = strLength.getByteVal(value.target.value,that.limitLength)
        // console.log(temp)
        that.itemValue= temp.trim()

        that.inputNum = strLength.getZhLen(that.itemValue);

        // 如果是子级
        if (!!that.childFlag) {
          var obj = {}
          obj.child = that.childFlag
          obj.value = that.itemValue;
          if (that.titleFlag == 'title') {
            obj.title = that.titleFlag;
          }

          if (that.c3Flag == 'k303') {
            obj.c3Index = that.c3Index;
            obj.flag = that.c3Flag;
          }
          that.$emit('itemInput',obj)
          return;
        }

        // 如果是标题
        if (that.titleFlag == 'title') {
          var obj = {}
          obj.value = that.itemValue;
          obj.title = that.titleFlag;



          that.$emit('itemInput',obj)
          return;
        }

        // console.log(that.inputNum )
        if (that.c3Flag == 'k303') {
          var obj = {}
          obj.value = that.itemValue;
          obj.flag = that.c3Flag;
          obj.c3Index = that.c3Index;
          that.$emit('itemInput',obj)
          return;
        }
        that.$emit('itemInput',that.itemValue)
      },
    },
    watch: {
      maxLength: function(newData,oldData){
        var that = this;
        that.limitLength = newData
      },
      inputValue: function(newData,oldData){
        var that = this;
        that.itemValue = newData
        that.inputNum = strLength.getZhLen(that.itemValue)
      },
      disFlag: function(newData,oldData){
        var that = this;
        that.disableInput = newData
      },
      childItem: function(newData,oldData){
        var that = this;
        that.c3Flag = newData
      },
      childIndex: function(newData,oldData){
        var that = this;
        that.c3Index = newData
      },

      titleName: function(newData,oldData){
        var that = this;
        that.titleFlag = newData
      },

      child: function(newData,oldData){
        var that = this;
        that.childFlag = newData
      },
    },
    /* 接收数据 */
    mounted(){
      var that = this;
      console.log(that.childIndex)
      that.limitLength = that.maxLength;
      that.itemValue = that.inputValue || '';
      that.inputNum = strLength.getZhLen(that.inputValue);
      that.disableInput = that.disFlag || 0;

      that.c3Flag = that.childItem || '';
      that.c3Index = that.childIndex==0? 0: that.childIndex;
      that.titleFlag = that.titleName
      that.childFlag = that.child
    },
  }
</script>
<style lang="less" scoped>

.input-line-cell {
  display: inline-block;
}

.w-340 {
  width: 340px;
  /deep/ .el-input__inner {
    font-size: 12px;
    color: #fff;
    background-color: rgba(255,255,255,.1);
  }
}
.el-input {
  /deep/ .el-input__inner {
    font-size: 12px;
    color: #fff;
    background-color: rgba(255,255,255,.1);
  }

  .is-disabled{

    /deep/ .el-input__inner {
      font-size: 12px;
      color: #fff;
      background-color: rgba(255,255,255,.1);
    }
  }
}

.edit-item {
  color:#fff;

  .tip {
      margin-left: -40px;
      color: rgba(255,255,255,0.7);
      width: 30px;
      display: inline-block;
      text-align: right;
      margin-right: 10px;
      font-size: 12px;
      padding-right: 6px;
  }
}
</style>
