<template>
  <div>
    <div  class="gic-formarea-item" :class="{'curfocus': curfocus}">
      <div class="gic-formarea-wrap">
      <textarea @keyup="handleKeyup($event.target.value)" @keydown="handleKeyup($event.target.value)" @change="handleKeyup($event.target.value)"
                ref="input" class="gic-form-area" :max="max" :value="value"
                v-on:input="update($event.target.value)" @focus="handleFocus(true)" @blur="handleFocus(false)" :placeholder="placeholder">
      </textarea>
      </div>
    </div>
    <div class="gic-formarea-count"> {{ curcount }}/{{ max }}</div>
  </div>
</template>
<script>
  export default {
    name: "gicinput",
    data() {
      return {
        curcount: 0,
        curfocus: false,
        curValue: '',
        avalue: ''
      }
    },
    props: [ 'value','max','placeholder'],
//    watch: {
//      value(newVal,oldVal) {
//        var byteValLen = 0;
//        var max =  this.max;
//        if(newVal) {
//          for (var i = 0; i < newVal.length; i++) {
//            if (newVal[i].match(/[^\x00-\xff]/ig) != null)
//              byteValLen += 1;
//            else
//              byteValLen += 0.5;
//            if (byteValLen > max)
//              break;
//            this.curcount = Math.floor(byteValLen);
//          }
//        }else {
//          this.curcount = 0;
//        }
//      }
//    },
    mounted() {
      var byteValLen = 0;
      var max =  this.max;
      if(this.value) {
        for (var i = 0; i < this.value.length; i++) {
          if (this.value[i].match(/[^\x00-\xff]/ig) != null)
            byteValLen += 1;
          else
            byteValLen += 0.5;
          if (byteValLen > max)
            break;
          this.curcount = Math.floor(byteValLen);
        }
      }else {
        this.curcount = 0;
      }
    },
    methods: {
      handleFocus(boolean) {
        this.curfocus = boolean;
      },
      update: function(value) {
        this.$emit('input', value)
      },
      handleKeyup: _.debounce(
        function(val) {
          var returnValue = '';
          var byteValLen = 0;
          var max =  this.max;
          if(val) {
            for (var i = 0; i < val.length; i++) {
              if (val[i].match(/[^\x00-\xff]/ig) != null)
                byteValLen += 1;
              else
                byteValLen += 0.5;
              if (byteValLen > max)
                break;
              returnValue += val[i];
              this.curcount = Math.floor(byteValLen);
              this.$emit('input', returnValue);
            }
          }else {
            this.curcount = 0;
            this.$emit('input', returnValue)
          }

        }
        ,800)
    }
  }
</script>

<style scoped>
  .gic-formarea-item{
    width: 100%;
    height: 116px;
    padding: 5px;
    border: 1px solid #dcdfe6;
    /*line-height: 38px;*/
    display: flex;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .gic-formarea-wrap{
    flex: 1;
    /*margin-left: 10px;*/
  }
  .gic-form-area{
    width: 98%;
    height: 100px;
    border: 0;
    line-height: 20px;
    font-size: 12px;
    color: #444;
    outline: none;
  }
  .gic-formarea-count{
    line-height: 20px;
    text-align: right;
    color: #c0c4cc;
    font-size: 12px;
  }
  .curfocus{
    border: 1px solid #1890ff;
  }
</style>
