<template>
    <div>
      <!--弹框-->
      <el-dialog
        title="门店选择"
        @close="closeDialog"
        :visible.sync="dialogCardVisible"
        width="600px">
        <div class="dialogwrap">
          <div class="dialogcontent">
            <el-radio-group v-model="radio" style="width: 100%;">
            <el-table ref="singleTable" :data="tableData">
              <el-table-column  width="33" prop="id">
                <template slot-scope="scope">
                  <el-radio fill="red" :label="scope.row.id"></el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="门店名称"></el-table-column>
              <el-table-column prop="remarks" label="门店代码"></el-table-column>
            </el-table>
            </el-radio-group>
            <div class="page">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="page.current_page"
                :page-size="page.page_size"
                layout="prev, pager, next"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sureCard">确 定</el-button>
          <el-button @click="cancle">取 消</el-button>
         </span>
      </el-dialog>
      <!--弹框end-->
    </div>
</template>

<script>
  module.exports = require('./dialog')
</script>

<style lang="less" scoped>
  .dialogwrap{
    position: relative;
    &:before{
      position: absolute;
      left: -20px;
      top: -20px;
      right: -20px;
      content: '';
      border-bottom: 1px solid #dedede;
    }
  }
  .dialogcontent{
    padding: 0 10px;
  }
  .cue{
    margin-bottom: 20px;
    text-indent: 2rem;
  }
  .el-radio__label{
    color: transparent;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: transparent;
  }
  .page{
    margin: 20px 0;
    text-align: right;
  }
</style>
