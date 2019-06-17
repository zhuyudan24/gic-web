import {checkFalse, checkStatus, checkSuccess} from "../../common/js/checkStatus.js";
let qs = require('qs');
export default{
  data (){
    return {
      bodyHeight: document.body.clientHeight || document.documentElement.clientHeight,
      bodyWidth:document.body.clientWidth || document.documentElement.clientWidth,
      pageId: this.$route.query.pageId || '',
      ruleForm: {
        title: '',
        entryCondition: 0,
        pageType: 3,
        bgImg: {
          code: '',
          url: 'http://pic01-10001430.picsh.myqcloud.com/integral-top-bg.png'
        },
        integral: {
          show: true,
          title: '可用积分',
          fontColor: '#fff',
          numColor: '#dfb772'
        },
        unIntegral: {
          show: true,
          title: '冻结积分',
          fontColor: '#bdbbbb',
          numColor: '#bc8e3c'
        },
        sign: {
          status: true,
          before:{
            code: '',
            url: 'http://pic01-10001430.picsh.myqcloud.com/credit-sign_bg01.png'
          },
          after:{
            code: '',
            url: 'http://pic01-10001430.picsh.myqcloud.com/credit-sign_bg02.png'
          }
        },
        detailBgImg:{
          code: '',
          url: 'http://pic01-10001430.picsh.myqcloud.com/point-detail-head-bg.png'
        },
        detailIntegral: {
          show: true,
          title: '可用积分',
          fontColor: '#fff',
          numColor: '#fff'
        },
        detailUnIntegral: {
          show: true,
          title: '冻结积分',
          fontColor: '#fff',
          numColor: '#fff'
        },
        detailIntegralmx: {
          show: 1,
          title: '积分明细'
        },
        detailIntegralsm: {
          show: 1,
          title:  '积分说明'
        }
      },
      curImg: '',
      imageUrl: '',
      list:true,
      theme: ''
    }
  },
  methods:{
    changeIntegral(type) {
      if(type == 1) {
        if(!this.ruleForm.integral.show) {
          if(!this.ruleForm.unIntegral.show) {
            this.ruleForm.integral.show = true;
            checkFalse('可用积分和冻结积分只能关闭一个');
            return false;
          }
        }
      }
      if(type == 2) {
        if(!this.ruleForm.unIntegral.show) {
          if(!this.ruleForm.integral.show) {
            this.ruleForm.unIntegral.show = true;
            checkFalse('可用积分和冻结积分只能关闭一个');
            return false;
          }
        }
      }
    },
    submitForm(saveType) {
      if(!this.ruleForm.title.trim()) {
        checkFalse('请填写页面名称');
        return false;
      }
      if(!this.ruleForm.integral.title.trim()) {
        checkFalse('请填写可用积分标签名称');
        return false;
      }
      if(!this.ruleForm.unIntegral.title.trim()) {
        checkFalse('请填写冻结积分标签名称');
        return false;
      }
      if(!this.ruleForm.detailIntegral.title.trim()) {
        checkFalse('请填写积分详情可用积分标签名称');
        return false;
      }
      if(!this.ruleForm.detailUnIntegral.title.trim()) {
        checkFalse('请填写积分详情冻结积分标签名称');
        return false;
      }
      if(!this.ruleForm.detailIntegralmx.title.trim()) {
        checkFalse('请填写积分详情积分明细标签名称');
        return false;
      }
      if(!this.ruleForm.detailIntegralsm.title.trim()) {
        checkFalse('请填写积分详情积分说明标签名称');
        return false;
      }

      let params = {
        pageId: this.pageId,
        title: this.ruleForm.title,
        entryCondition: 0,
        pageType: 3,
        setting:{
          bgImg: {
            code: this.ruleForm.bgImg.code,
            url: this.ruleForm.bgImg.url
          },
          integral:{
            show: this.ruleForm.integral.show == true ? 1 : 0,
            title: this.ruleForm.integral.title,
            fontColor: this.ruleForm.integral.fontColor,
            numColor: this.ruleForm.integral.numColor
          },
          unIntegral:{
            show: this.ruleForm.unIntegral.show == true ? 1 : 0,
            title: this.ruleForm.unIntegral.title,
            fontColor: this.ruleForm.unIntegral.fontColor,
            numColor: this.ruleForm.unIntegral.numColor
          },
          sign:{
            status: this.ruleForm.sign.status == true ? 1 : 0,
            before:{
              code: this.ruleForm.sign.before.code,
              url: this.ruleForm.sign.before.url
            },
            after:{
              code: this.ruleForm.sign.after.code,
              url: this.ruleForm.sign.after.url,
            }
          },
          detailBgImg:{
            code: this.ruleForm.detailBgImg.code,
            url: this.ruleForm.detailBgImg.url
          },
          detailIntegral:{
            show: this.ruleForm.detailIntegral.show == true ? 1 : 0,
            title: this.ruleForm.detailIntegral.title,
            fontColor: this.ruleForm.detailIntegral.fontColor,
            numColor: this.ruleForm.detailIntegral.numColor
          },
          detailUnIntegral: {
            show: this.ruleForm.detailUnIntegral.show == true ? 1 : 0,
            title: this.ruleForm.detailUnIntegral.title,
            fontColor: this.ruleForm.detailUnIntegral.fontColor,
            numColor: this.ruleForm.detailUnIntegral.numColor
          },
          detailIntegralmx: {
            title: this.ruleForm.detailIntegralmx.title
           },
          detailIntegralsm: {
            title: this.ruleForm.detailIntegralsm.title
          }
        }
      };
      this.axios.post('/api-admin/save-page',qs.stringify({
        requestProject:'gic-web',
        saveType: saveType,
        params: JSON.stringify(params)
      })).then(res => {
        if(res.data.errorCode == 0) {
          checkSuccess('保存成功');
          setTimeout( this.$router.push({path: '/member', query:{backtab:'integral' }}),3000);
        }else {
          checkFalse('操作失败');
          return false;
        }
      }).catch(err => {
        checkStatus(err);
      })
    },
    changeImg(type) {
      this.curImg = type;
      document.getElementById('jifenupload').getElementsByClassName('el-upload__input')[0].click();
    },
    handleImgSuccess(res,file) {
      if(res.errorCode == 0) {
        if(this.curImg == '1') {
          this.ruleForm.bgImg.url = res.result[0].qcloudImageUrl;
          this.ruleForm.bgImg.code = res.result[0].imageFiledCode;
        }else if(this.curImg == '2') {
          this.ruleForm.sign.before.url = res.result[0].qcloudImageUrl;
          this.ruleForm.sign.before.code = res.result[0].imageFiledCode;
        }else if(this.curImg == '3') {
          this.ruleForm.sign.after.url = res.result[0].qcloudImageUrl;
          this.ruleForm.sign.after.code = res.result[0].imageFiledCode;
        }else if(this.curImg == '4') {
          this.ruleForm.detailBgImg.url = res.result[0].qcloudImageUrl;
          this.ruleForm.detailBgImg.code = res.result[0].imageFiledCode;
        }
        this.imageUrl = res.result[0].qcloudImageUrl;
        checkSuccess('图片上传成功');
      }else {
        checkFalse('图片上传失败');
      }
    },
    beforeImgUpload(file) {
      const isImg = file.type === 'image/jpeg' || 'image/png' || 'image/gif' || 'image/svg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImg) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF/SVG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      let _this = this;
      return  isImg && isLt2M && new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function () {
            let width = this.width;
            let height = this.height;
            if(parseInt(_this.curImg) == 1) {
              if (width !== 750){
                _this.$message.error('图片尺寸必须为750px*375px!');
                reject();
              }
              if (height !== 375) {
                _this.$message.error('图片尺寸必须为750px*375px!');
                reject();
              }
            }
            if(parseInt(_this.curImg) == 2 || parseInt(_this.curImg) == 3) {
              if (width !== 706){
                _this.$message.error('图片尺寸必须为706px*170px!');
                reject();
              }
              if (height !== 170) {
                _this.$message.error('图片尺寸必须为706px*170px!');
                reject();
              }
            }
            if(parseInt(_this.curImg) == 4) {
              if (width !== 750){
                _this.$message.error('图片尺寸必须为706px*240px!');
                reject();
              }
              if (height !== 240) {
                _this.$message.error('图片尺寸必须为706px*240px!');
                reject();
              }
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    setList() {
      this.list=true
    },
    setDetail() {
      this.list=false
    },
    getDetail(pageId) {
      this.axios.get('/api-admin/page-detail',{
        params: {
          requestProject:'gic-web',
          pageId: pageId
        }
      }).then(res => {
        if(res.data.errorCode == 0) {
          let tempDetail = res.data.result;
          this.ruleForm.title = tempDetail.title;
          this.ruleForm.bgImg.code = tempDetail.setting.bgImg.code;
          this.ruleForm.bgImg.url = tempDetail.setting.bgImg.url;
          this.ruleForm.integral.show = tempDetail.setting.integral.show == 1 ? true : false;
          this.ruleForm.integral.title = tempDetail.setting.integral.title;
          this.ruleForm.integral.fontColor = tempDetail.setting.integral.fontColor;
          this.ruleForm.integral.numColor = tempDetail.setting.integral.numColor;
          this.ruleForm.unIntegral.show = tempDetail.setting.unIntegral.show == 1 ? true : false;
          this.ruleForm.unIntegral.title = tempDetail.setting.unIntegral.title;
          this.ruleForm.unIntegral.fontColor = tempDetail.setting.unIntegral.fontColor;
          this.ruleForm.unIntegral.numColor = tempDetail.setting.unIntegral.numColor;
          this.ruleForm.sign.status = tempDetail.setting.sign.status == 1 ? true : false;
          this.ruleForm.sign.before.code = tempDetail.setting.sign.before.code;
          this.ruleForm.sign.before.url = tempDetail.setting.sign.before.url;
          this.ruleForm.sign.after.code = tempDetail.setting.sign.after.code;
          this.ruleForm.sign.after.url = tempDetail.setting.sign.after.url;
          this.ruleForm.detailBgImg.code = tempDetail.setting.detailBgImg.code;
          this.ruleForm.detailBgImg.url = tempDetail.setting.detailBgImg.url;
          this.ruleForm.detailIntegral.show = tempDetail.setting.detailIntegral.show == 1 ? true : false;
          this.ruleForm.detailIntegral.title = tempDetail.setting.detailIntegral.title;
          this.ruleForm.detailIntegral.fontColor = tempDetail.setting.detailIntegral.fontColor;
          this.ruleForm.detailIntegral.numColor = tempDetail.setting.detailIntegral.numColor;
          this.ruleForm.detailIntegralmx.title = tempDetail.setting.detailIntegralmx.title;
          this.ruleForm.detailIntegralsm.title = tempDetail.setting.detailIntegralsm.title;
          this.ruleForm.detailUnIntegral.show = tempDetail.setting.detailUnIntegral.show == 1 ? true : false;
          this.ruleForm.detailUnIntegral.title = tempDetail.setting.detailUnIntegral.title;
          this.ruleForm.detailUnIntegral.fontColor = tempDetail.setting.detailUnIntegral.fontColor;
          this.ruleForm.detailUnIntegral.numColor = tempDetail.setting.detailUnIntegral.numColor;
        }
      }).catch(err => {
        checkStatus(err);
      })
    },
    getTheme() {
      this.axios.get('/api-admin/get-custom-theme',{
        params:{
          requestProject:'gic-web'
        }
      }).then(res => {
        if(res.data.errorCode === 0) {
          this.theme = res.data.result.theme;
        }else {
          checkFalse('主题获取失败');
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
        this.$router.push({path: '/member', query:{backtab:'integral' }});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    }
  },
  mounted() {
    if(this.pageId) {
      this.getDetail(this.pageId);
    }else {
      this.getTheme();
    }
    window.onresize = () => {
      return (() => {
        this.bodyHeight =  document.body.clientHeight || document.documentElement.clientHeight;
        this.bodyWidth =  document.body.bodyWidth || document.documentElement.bodyWidth;
      })()
    }
  },
  created() {
    this.$store.commit('isShowFoot',false);
  }
}
