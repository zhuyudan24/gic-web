import {checkFalse, checkStatus, checkSuccess} from "../../common/js/checkStatus.js";
let qs = require('qs');
export default {
  data() {
    return {
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      curFrontCard: 'one',
      ruleForm: {
        title: ''
      },
      rules: {},
      curIndex: null,
      imageUrl: '',
      merchantList: [],
      curImgIdx: null,
      curpageId: this.$route.query.pageId || '',
      curtitle: this.$route.query.title || '',
    }
  },
  methods: {
    changeStatus(val,item){ // 集团列表配置  是否开启
      if(val){
        this.axios.post('/api-admin/applet-app-valid-existed',qs.stringify({
          requestProject: 'gic-web',
          enterpriseId:item.eId
        })).then(res => {
          if(res.data.errorCode == 0) {
            if(!res.data.result.flag){
              item.status = false;
              var html = '请先至小程序API管理页启用该小程序';
              this.$alert(html, '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText:'知道了',
                cancelButtonText: '取消',
                showCancelButton:false,
                type: 'warning'
              }).then(() => {
                
              }).catch(() => {
    
              });
            }
          }else {
            checkFalse(data.message);
            return false;
          }
        }).catch(err => {
          checkStatus(err);
        })
      }
    },
    submitForm(saveType) {
      if(!this.ruleForm.title.trim()) {
        checkFalse('请填写页面名称');
        return false;
      }
      let flag = true;
      if(this.merchantList.length > 0) {
        this.merchantList.forEach((item,index) => {
          if(item.status == true) {
            if(!item.title.trim()) {
              checkFalse(`请填写商户名称` );
              flag = false;
            }
            if(item.url == '') {
              checkFalse(`请上传商户logo` );
              flag = false;
            }
          }
        })
      }
      if(flag) {
        this.merchantList.forEach((item,index) => {
          if(item.status == true) {
            item.status = 1;
          }else {
            item.status = 2;
          }
        });
      }else {
        return false;
      }
      let params = {
        pageId: this.curpageId,
        title: this.ruleForm.title,
        entryCondition: 0,
        pageType: 5,
        setting: this.merchantList
      };
      this.axios.post('/api-admin/save-page',qs.stringify({
        requestProject: 'gic-web',
        saveType: saveType,
        params: JSON.stringify(params)
      })).then(res => {
        if(res.data.errorCode == 0) {
          checkSuccess('保存成功');
          setTimeout( this.$router.push({path: '/member', query:{backtab:'merchant' }}),3000);
        }else {
          checkFalse('操作失败');
          return false;
        }
      }).catch(err => {
        checkStatus(err);
      })
    },
    uploadImg(idx) {
      this.curImgIdx = idx;
      document.getElementById('merchantupload').getElementsByClassName('el-upload__input')[0].click();
    },
    handleImgSuccess(res,file) {
      if(res.errorCode == 0) {
        this.merchantList[this.curImgIdx].url = res.result[0].qcloudImageUrl;
        this.merchantList[this.curImgIdx].code = res.result[0].imageFiledCode;
        checkSuccess('图片上传成功');
      }else {
        checkFalse('图片上传失败');
      }
    },
    beforeImgUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    getList() {
      this.axios.get('/api-admin/list-clique',{
        params: {
          requestProject: 'gic-web',
          pageId: this.curpageId
        }
      }).then(res => {
          if(res.data.errorCode === 0) {
            this.merchantList = res.data.result;
            this.merchantList.forEach(item => {
              if(item.status == 2) {
                item.status = false;
              }else if(item.status == 1) {
                item.status = true;
              }
            })
          }else {
            checkFalse();
            return false;
          }
      }).catch(err => {
            checkStatus(err);
      })
    },
    backBtn(){
      this.$confirm('确认放弃编辑内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({path: '/member', query:{backtab:'merchant' }});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    }
  },
  mounted() {
    this.getList();
    if(this.curtitle) {
      this.ruleForm.title = this.curtitle;
    }
    window.onresize = () => {
      return (() => {
        this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
      })()
    }
  },
  created() {
    this.$store.commit('isShowFoot',false);
  }
}
