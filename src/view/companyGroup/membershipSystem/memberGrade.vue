<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="attention-wrap">
          <div class="title">
            <div>会员等级根据从低到高的顺序，自上而下进行排序</div>
            <div class="add-btn"><el-button type="primary" @click="changeRoute('/addMemberGrade')">新增等级</el-button></div>
          </div>
          <div class="table-wrap">
            <el-table
              :data="memberTableData"
              style="width: 100%">
              <el-table-column
                prop="gradeName"
                label="会员等级名称"
                >

              </el-table-column>
              <el-table-column
                prop="gradeCode"
                label="等级编码">
              </el-table-column>
              <el-table-column
                prop=""
                label="等级类型">
                <template slot-scope="scope">
                  {{scope.row.gradeType == 1? '常规卡': '特殊卡'}}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="移动">
                <template slot-scope="scope">
                  <i :class="['icon-color', 'el-icon-upload2', scope.$index==0? 'disable': '']" @click="toUp(scope.$index,scope.row,memberTableData)"></i>
                  <i :class="['icon-color', 'el-icon-back', 'icon-to-pre', scope.$index==0? 'disable':'']" @click="toPre(scope.$index,scope.row,memberTableData)"></i>
                  <i :class="['icon-color', 'el-icon-back', 'icon-to-next', scope.$index == memberTableData.length-1?'disable':'']" @click="toNext(scope.$index,scope.row,memberTableData)"></i>
                  <i :class="['icon-color', 'el-icon-download', scope.$index == memberTableData.length-1?'disable':'']" @click="toBottom(scope.$index,scope.row,memberTableData)"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <!-- <el-button
                    @click="editGrade(scope.$index,scope.row,memberTableData)"
                    type="text"
                    size="small">
                    编辑
                  </el-button> -->
                  <router-link :to="{path:'/editMemberGrade',query:{gradeId: scope.row.gradeId}}" class="edit-btn el-button--text">编辑</router-link>
                  <el-button
                    @click="delGrade(scope.$index,scope.row,memberTableData)"
                    type="text"
                    size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topNav from 'components/nav/nav'

import showMsg from '@/common/js/showmsg';
import errMsg  from '@/common/js/error';
import { getRequest, postRequest, postForm } from '@/api/api';

export default {
  name: "memberGrade",
  data() {
    return {
      navpath: [{
          name: '首页',
          path: '/'
        },
        {
          name: '商户会员等级列表',
          path: ''
        }
      ],

      // 商户id
      cliqueId: '',

      memberTableData:[
        {
            "gradeId": "ff808081593917d9015939d92d060059",
            "gradeName": "普卡",
            "gradeCode": "01",
            "cardColor": "#000000",  //背景颜色
            "cardFontColor": "#ffffff",  //字体颜色
            "gradeType": 1  // 常规还是特殊卡 1常规 2特殊
        },
        {
            "gradeId": "ff808081593917d9015939d92d060059",
            "gradeName": "普卡",
            "gradeCode": "01",
            "cardColor": "#000000",  //背景颜色
            "cardFontColor": "#ffffff",  //字体颜色
            "gradeType": 2  // 常规还是特殊卡 1常规 2特殊
        },
        {
            "gradeId": "ff808081593917d9015939d92d060059",
            "gradeName": "普卡",
            "gradeCode": "01",
            "cardColor": "#000000",  //背景颜色
            "cardFontColor": "#ffffff",  //字体颜色
            "gradeType": 2  // 常规还是特殊卡 1常规 2特殊
        }
      ],

    }
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {

    // 置顶 先删除后追加首部
    toUp(index, row,obj) {
      var that = this
      if (index == 0) {return;}
      console.log(index, row,obj)
      var newTable = JSON.parse(JSON.stringify(that.memberTableData))

      newTable.splice(index,1)
      newTable.unshift(row)
      console.log(newTable)

      // 保存设置
      that.setSort(row.gradeId,10,that.cliqueId)
      that.memberTableData = newTable;
    },
    // 向上
    toPre(index, row,obj) {
      var that = this
      if (index == 0) {return;}
      console.log(index, row,obj)
      var newTable = JSON.parse(JSON.stringify(that.memberTableData))
      var temp = {}
      temp = newTable[index-1]
      newTable[index-1] = row
      newTable[index] = temp
      // 保存设置
      that.setSort(row.gradeId,20,that.cliqueId)
      that.memberTableData = newTable;

    },
    // 向下
    toNext(index, row,obj) {
      var that = this
      if (index == obj.length-1) {return;}
      console.log(index, row,obj)
      var newTable = JSON.parse(JSON.stringify(that.memberTableData))
      var temp = {}
      temp = newTable[index+1]
      newTable[index+1] = row
      newTable[index] = temp
      // 保存设置
      that.setSort(row.gradeId,30,that.cliqueId)
      that.memberTableData = newTable;
    },
    //置底 先删除后追加尾部
    toBottom(index, row,obj) {
      var that = this
      if (index == obj.length-1) {return;}
      console.log(index, row,obj)

      var newTable = JSON.parse(JSON.stringify(that.memberTableData))

      newTable.splice(index,1)
      newTable.push(row)
      // 保存设置
      that.setSort(row.gradeId,40,that.cliqueId)
      that.memberTableData = newTable;
    },


    // 等级排序
    setSort(gradeId,type,enterpriseId) {
      var para = {
        gradeId: gradeId,
        sortType: type,
        enterpriseId: enterpriseId
      }

      postRequest('/api-admin/sort-member-grade',para)
      .then((res) => {
        var resData = res.data
        if (resData.errorCode == 0) {

          showMsg.showmsg('设置成功','success')
          return;
        }
        errMsg.errorMsg(resData)

      })
      .catch(function (error) {
        console.log(error);

        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },


    // 编辑
    editGrade(index,row,obj) {
      var that = this
      console.log(index,row,obj)

      if (true) {
        this.$router.push('/editMemberGrade');
      }
    },

    // 新增等级
    addGrade() {
      var that = this
      that.changeRoute('/addMemberGrade')
    },
    // 删除
    delGrade(index, row,obj) {
      var that = this
      console.log(index,row,obj)

      var para = {
        gradeId: row.gradeId,
        enterpriseId: '',
      }
      that.$confirm('确认删除吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          getRequest('/api-admin/delete-member-grade',para)
          .then((res) => {
            var resData = res.data
            if (resData.errorCode == 0) {

              showMsg.showmsg('删除成功','success')
              obj.splice(index,1)
              return;
            }
            errMsg.errorMsg(resData)

          })
          .catch(function (error) {
            console.log(error);

            that.$message.error({
              duration: 1000,
              message: error.message
            })
          });

        }).catch(() => {
          // console.log(error);
          // that.$message.error({
          //     duration: 1000,
          //     message: error.message
          //   })
        });
    },

    // 路由跳转
    changeRoute(route) {
      this.$router.push(route);
    },

    //获取列表
    getList() {
      var that = this
      var para = {
        enterpriseId: that.cliqueId
      }

      postRequest('/api-admin/get-enterprise-member-grade-list',para)
          .then((res) => {
            var resData = res.data
            if (resData.errorCode == 0) {

              that.memberTableData = resData.result.List
              return;
            }
            errMsg.errorMsg(resData)

          })
          .catch(function (error) {
            console.log(error);

            that.$message.error({
              duration: 1000,
              message: error.message
            })
          });
    }
  },
  components: {
    topNav
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    var that = this
    console.log(to,from,next)
    // 存储已经填写的数据
    console.log(that.ruleForm)
    var d = to;
    if (d.path == '/editMemberGrade' || d.path == '/addMemberGrade') {
      sessionStorage.setItem('enterpriseId',that.cliqueId)
    }
    next()
  },
  mounted() {
    var that = this

    that.cliqueId = that.$route.query.enterpriseId
    that.getList()

    sessionStorage.removeItem('enterpriseId')
  }
}

</script>
<style lang="less" scoped>
.attention-wrap {
  .item-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 80px;
    }
  }

  .title {
    padding: 15px 0;
    display: -webkit-flex;
    display: flex;
    .add-btn {
      text-align: right;
    }
    div {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
    }
  }

  .el-icon-upload2 {
    font-size: 22px;
    cursor: pointer;
  }

  .el-icon-download {
    font-size: 22px;
    cursor: pointer;
  }

  i.icon-color {
    color: #606266;
  }
  i.disable {
    color: #e6e6e6;
    cursor: not-allowed;
  }
}

</style>
