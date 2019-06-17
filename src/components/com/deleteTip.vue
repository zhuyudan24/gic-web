<template>
  <el-popover class="el-button el-button--text"
  placement="top"
  width="186"
  v-model="visible">
  <p style="line-height:1.5;padding:10px 10px 20px;color:#606266;">{{tips}}</p>
  <div style="text-align: right; margin: 0">
    <el-button size="mini" type="text" @click="cancel">取消</el-button>
    <el-button type="primary" size="mini" @click="confirm">确定</el-button>
  </div>
  <span slot="reference"><slot></slot></span>
</el-popover>
</template>
<script>
  export default {
    name:'dm-delete',
    props:{
      tips:{
        type:String,
        default:'是否删除?'
      },
    },
    data() {
      return {
        visible: false,
      };
    },
    methods:{
      cancel() {
        this.visible = false
      },
      confirm() {
        this.visible = false
        this.$emit('confirm')
      }
    }
  }
</script>
