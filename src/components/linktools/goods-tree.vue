<template>
  <div class="plug-sg">
    <el-popover popper-class="plug-sg__popover"  placement="bottom" trigger="click" v-model="treeVis">
      <el-input slot="reference" suffix-icon="el-icon-arrow-down" v-model="ategory" placeholder="所有分类"></el-input>
      <el-tree
        class="plug-sg__tree"
        ref="tree"
        :default-expand-all="true"
        node-key="mallProTagId"
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="handleNodeClick">
      </el-tree>
      <div class="good-tree-btn">
				<el-button @click.prevent.stop="hideTree" type="text" size="small" style="color:#303133">取消</el-button>
				<el-button @click.prevent.stop="confirmBtn" type="text" size="small">确定</el-button>
			</div>
    </el-popover>
    
  </div>
  </template>
<script>
export default {
  name:'goods-tree',
  props:{
    model:{
      type:Object,
      default(){
        return {}
      },
      
    },
    width:{
      type:String,
      default:'300'
    },
    treeData: Array
  },
  data() {
    return {
      treeVis: false,
      ategory: '',
      defaultProps: {
        children: 'childrenList',
        label: 'tagName'
      }
    }
  },
  methods:{
    handleNodeClick(data) {
      this.mallData = data;
      this.ategory = data.tagName;
    },
    hideTree() {
      this.treeVis = false;
    },
    confirmBtn() {
      this.treeVis = false;
    }
  },

  watch: {
    treeVis(newval) {
      if (!newval) {
        if (this.mallData) {
          this.$emit('pass-mall', this.mallData);
        }
      }
    }
  }
}
</script>

<style lang="scss">
.plug-sg {
  display: inline-block;
  width: 200px;
  &__popover{
    padding:10px 0 0 0;
  }
  &__btn{
    height: 36px;
    padding: 0 10px;
    border-top:1px solid #ebeef5;
    line-height: 34px;
    text-align:right;
    &--cancel {
      color: #606266;
    }
  }
  &__tree {
    height: 260px;
    width: 200px;
    overflow-y: auto;
    .el-tree-node__label {
      text-overflow: ellipsis;
      display: inline-block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
    }
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
}
.good-tree-btn {
  float: right;
  margin-right: 10px; 
}
</style>

