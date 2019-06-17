<template>
  <div class="gic-form-item" :class="{'curfocus': curfocus}">
    <div class="gic-form-wrap">
      <input ref="input" class="gic-form-input" type="text" :max="max" :value="value" @keyup="handleKeyup($event.target.value)"
             v-on:input="update($event.target.value)" @focus="handleFocus(true)" @blur="handleFocus(false)" :placeholder="placeholder">
    </div>
    <div class="gic-form-count"> {{ curcount }}/{{ max }}</div>
  </div>
</template>
<script>
  export default {
    name: "gicinput",
    data() {
      return {
        curcount: 0,
        curfocus: false,
      }
    },
    props: [ 'value','max','placeholder'],
    watch: {
      value(newVal,oldVal) {
        var byteValLen = 0;
        var max =  this.max;
        if(newVal) {
          for (var i = 0; i < newVal.length; i++) {
            if (newVal[i].match(/[^\x00-\xff]/ig) != null)
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
      }
    },
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
      handleKeyup(val){
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
      },
      // handleKeyup: _.debounce(
      //   function(val) {
      //     var returnValue = '';
      //     var byteValLen = 0;
      //     var max =  this.max;
      //     if(val) {
      //       for (var i = 0; i < val.length; i++) {
      //         if (val[i].match(/[^\x00-\xff]/ig) != null)
      //           byteValLen += 1;
      //         else
      //           byteValLen += 0.5;
      //         if (byteValLen > max)
      //           break;
      //         returnValue += val[i];
      //         this.curcount = Math.floor(byteValLen);
      //         this.$emit('input', returnValue);
      //       }
      //     }else {
      //       this.curcount = 0;
      //       this.$emit('input', returnValue)
      //     }

      //   },800)
    },
  }
</script>

<style scoped>
  .gic-form-item{
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .gic-form-wrap{
    flex: 1;
    margin-left: 10px;
  }
  .gic-form-count{
    flex: 0 0 40px;
    width: 40px;
    text-align: center;
    color: #c0c4cc;
    font-size: 12px;
  }
  .gic-form-input{
    width: 100%;
    font-size: 14px;
    color: #606266;
  }
  .curfocus{
    border: 1px solid #1890ff;
  }

</style>
