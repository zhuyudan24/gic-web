<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box">
        <div class="top-wrap clearfix">
          <h2 class="fl title">权限模板共{{roleList.length}}个</h2>
          <p class="fr">
            <el-button v-show="!isMiddleGround" @click="addRole()" type="primary">新增职位</el-button>
          </p>
        </div>
        <ul class="tpl-wrap clearfix" v-loading="loading">
          <li v-for="(item,index) in roleList" :key="index" >
            <div class="tpl-item" >
              <div class="tpl-content">
                <div class="title-wrap">
                  <p class="tpl-name fl">{{item.roleName}}</p>
                  <p class="fr">{{item.clerkCount}}人</p>
                </div>
                <ul>
                  <li class="clearfix">
                    <p class="fl">直属下级</p>
                    <p class="fr">{{item.lowLevelRoleName?item.lowLevelRoleName:'无'}}</p>
                  </li>
                  <!-- <li class="clearfix">
                    <p class="fl">好办APP</p>
                    <p class="fr">{{item.app==1?'开启':'关闭'}}</p>
                  </li> -->
                  <li class="clearfix">
                    <p class="fl">Web后台管理</p>
                    <p class="fr">{{item.gicWeb==1?'开启':'关闭'}}</p>
                  </li>
                </ul>
              </div>
              <div class="opr-btn flex-wrap">
                <span @click="editRole(item)" class="flex-con"><i class="el-icon-edit" title="编辑"></i></span>
                <span @click="deleteRole(item.roleId,index)" v-show="item.roleType==3" class="flex-con line"><i class="el-icon-delete" title="删除"></i></span>
              </div>
            </div>
          </li>
        </ul>

        <!-- <div style='width:280px;'>
           <vue-ztree :list='ztreeDataSource' :is-open='true'></vue-ztree>
        </div> -->

      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import strLength from '../../../common/js/strlen'
  import {isvalidPhone} from '../../../common/js/validate'
  import vueZtree from 'components/basicConfig/vueZtree/vue-ztree.vue'
  let qs = require('qs')
  export default {
    name: "clerk_quanxian_manage",
    data(){
      return {
        bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
        navpath: [
          {
            name: '企业管理',
            path: ''
          },
          {
            name: '企业资料',
            path: ''
          },
          {
            name: '成员管理',
            path: ''
          },
          {
            name: '权限管理',
            path: ''
          }
        ],
        roleList:[],
        roleCount:0,  //  模板数量
        lowLevelRoleName:'',  // 直属下级
        loading:false,

        isMiddleGround:false,
      }
    },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        })()
      };
      this.getLoginInfo();
      // this.getRoleList();
    },
    methods:{
      getLoginInfo(){ // 获取是否是中台的标识
        this.axios.get('/api-auth/get-login-user-info',{
          params: {
            requestProject:'gic-web'
          }
        }).then((res) => {
          var resData = res.data
          if (resData.errorCode == 0) {
            var isMiddleGround = resData.result.enterpriseDTO.backgroundMode;
            this.isMiddleGround = isMiddleGround==1?true:false;
            this.getRoleList()
          }else{
            this.$message.error(resData.message)
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getRoleList(){  // 角色列表
        this.loading = true;
        this.axios.post('/api-admin/list-right-role',qs.stringify({
          requestProject:'gic-web'
        })).then((res)=>{
          var data = res.data;
          if(data.errorCode==0){
            this.loading = false;
            if(this.isMiddleGround){ // 为中台
              data.result.forEach((item,index)=>{
                if(item.roleType==1 || item.roleType==2){
                  this.roleList.push(item)
                }
              })
            }else{
              this.roleList = data.result?data.result:[];
            }
          }else{
            this.$message.error(data.message)
          }
        })
      },
      addRole(){
        this.$router.push('/clerk_quanxian_edit')
      },
      editRole(item){
        this.$router.push({
          path:'/clerk_quanxian_edit',
          query:{
            roleId:item.roleId,
            roleType:item.roleType
          }
        })
      },
      deleteRole(roleId,index){
        this.$confirm('是否确认删除该权限模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api-admin/delete-right-role',qs.stringify({
            requestProject:'gic-web',
            roleId:roleId
          })).then((res)=>{
            var data = res.data;
            console.log(data);
            if(data.errorCode==0){
              this.roleList.splice(index,1);
              this.$message.success('删除成功');
            }else{
              this.$message.error(data.message)
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });

        
      }
    },
    components:{
      topNav,
      vueZtree
    }  
  }
</script>

<style lang="less" scoped>
  .right-wrap .right-content .right-box{
    background: #fff;
    padding:0 24px 9px 24px;
  }
  .top-wrap{
    .title{
      font-size: 16px;
      color: #606266;
      padding: 24px 0 22px 0;
      line-height: 40px;
    }
    p{
      line-height: 86px;
    }
  }
  
  .tpl-wrap{
    > li {
      float: left;
      margin: 0 15px 15px 0;
    }
    .tpl-item{
      color: #606266;
      width: 252px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      .tpl-content{
        padding: 0 15px;
        .title-wrap{
          height: 40px;
          line-height: 40px;
          font-size: 15px;
          color: #606266;
          border-bottom: 1px solid #ebeef5;
        }
        .tpl-name{
          width: 160px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        ul{
          p{
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            color: #606266;
          }
        }
      }
      .opr-btn{
        height: 40px;
        line-height: 40px;
        color: #606266;
        font-size: 14px;
        text-align: center;
        border-top: 1px solid #ebeef5;
        background: #f1f3f7;
        span{
          font-size: 16px;
          color: #909399;
          cursor: pointer;
          &:hover{
            .el-icon-edit{
              color: #1890ff;
            }
            .el-icon-delete{
              color: #f56c6c
            }
          }
        }
        .line{
          border-left: 1px solid #ebeef5;
        }
      }
    }
  }
  
</style>
