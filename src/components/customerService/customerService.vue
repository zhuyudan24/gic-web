<template>
  <div class="right-wrap">
    <topNav :navpath="navpath"></topNav>
    <div class="right-content">
      <div class="right-box" v-loading="loading">
        <div class="ser-lt-wrap">
          <div class="ser-lt">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="是否开启" class="open-wrap">
                <el-switch v-model="form.open"></el-switch>
                <p>开启该功能则客户在移动端点击客服咨询优先至客户服务页；<br>反之则客户在移动端点击客服咨询直接跳转至原生对话框</p>
              </el-form-item>
              <div v-if="form.open">
                <el-form-item label="页面名称" class="name-wrap">
                  <gic-input v-model="form.name" :max="4"></gic-input>
                  <div v-show="errorBool && form.name==''" class="el-form-item__error">请输入页面名称</div>
                </el-form-item>
                <el-form-item label="页面内容">
                  <div class="rich-tinymce-wrap">
                    <editor ref="richTextContent" :value="form.richTextContent" :editindex="0" @input="contentUe" :projectName="projectName"></editor>
                    <!-- <tinymce-edit ref="tinymceWrap" :bodyHtml="form.richTextContent" :projectName="projectName"></tinymce-edit> -->
                    <div v-show="errorBool && form.richTextContent==''" class="el-form-item__error">请输入页面内容</div>
                  </div>
                </el-form-item>
                <el-form-item label="按钮文本" class="name-wrap">
                  <gic-input v-model="form.btnText" :max="6"></gic-input>
                  <div v-show="errorBool && form.btnText==''" class="el-form-item__error">请输入按钮文本</div>
                </el-form-item>
                <el-form-item label="按钮颜色" class="color-wrap">
                  <span><el-color-picker v-model="form.btnColor"></el-color-picker></span>
                  <span class="formreset" @click="form.btnColor = '#F64E4E'">重置</span>
                  <div v-show="errorBool && !form.btnColor" class="el-form-item__error">请选择按钮颜色</div>
                </el-form-item>
                <el-form-item label="文本颜色" class="color-wrap">
                  <span><el-color-picker v-model="form.textColor"></el-color-picker></span>
                  <span class="formreset" @click="form.textColor = '#fff'">重置</span>
                  <div v-show="errorBool && !form.textColor" class="el-form-item__error">请选择文本颜色</div>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button type="primary" @click="savePage('form')">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="form.open" class="ser-rt-wrap">
          <div class="title">
            <p>{{ form.name }}</p>
          </div>
          <!-- <img width="100%" height="64" src="./navbar-service_mould-head.png" alt=""> -->
          <div class="ser-rt-content" v-html="form.richTextContent"></div>
          <div class="rt-btn-wrap">
            <div class="rt-btn" :style="{color:form.textColor,background:form.btnColor}">{{ form.btnText }}</div>
            <p>其余时间请留言，我们会第一时间回复您</p>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>

<script>
  import topNav from 'components/nav/nav'
  import strLength from '../../common/js/strlen'
  import tinymceEdit from 'components/memberShip/tinymce-edit'
  import editor from 'components/memberShip/editor'
  let qs = require('qs')
  export default {
    name: "customerService",
    data(){
    	return {
        projectName: 'gic-web',
    		navpath: [
          {
            name: '小程序配置',
            path: ''
          },{
            name: '会员功能页面',
            path: ''
          },{
            name: '客户服务',
            path: ''
          }
        ],
        form: {
          open:false,
          name:"客户服务",
          richTextContent:'<p style="text-align:center;margin: 95px 0 40px 0;"><img src="https://pic01-10001430.image.myqcloud.com/4f577861-0cf1-4905-a752-c0d46faf7306" alt="" width="80px" height="80px"></p><p style="text-align:center;color:#666666;font-size:14px;line-height:1.5;margin:0">在这里，我们会为您解决对于我们<br>网上商店的所有疑问。<br><br>在线咨询时间<br>8:30-17:30（工作日周一至周五）</p>',
          // richTextContent:"",
          btnText:"联系客服",
          btnColor:"#F64E4E",
          textColor:"#fff"
        },
        errorBool:false,

        pageId:'',
        loading:false,
      }
    },
    mounted(){
      this.init()
    },
    methods:{
      init(){
        this.getDetail();
      },
      getDetail(){ // 获取详情
        this.loading = true;
        this.axios.post('/api-admin/custom-service-detail',qs.stringify({
          requestProject: 'gic-web',
        })).then(res => {
          var data = res.data;
          this.loading = false;
          if(data.errorCode == 0) {
            var setData = data.result.setting;
            this.pageId = data.result.pageId;
            this.form.open = data.result.status==1?true:false;
            this.form.name = data.result.title;
            this.form.btnColor = setData.btnColor;
            this.form.btnText = setData.btnTxt;
            this.form.textColor = setData.btnTxtColor;
            this.form.richTextContent = data.result.value[0].richTextContent;
          }else{
            this.$message.error(data.message);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 获取富文本内容
      contentUe(val){
        // console.log(val);
        this.form.richTextContent = val.content
      }, 
      savePage(){  // 保存
        let flag = true;
        if(this.form.name=="" || this.form.richTextContent=="" || this.form.btnText=="" || !this.form.btnColor || !this.form.textColor){
          flag = false
        }
        if(flag){
          var params = {
            pageId:this.pageId,
            title:this.form.name,
            entryCondition:0,
            pageType:7,
            isEnable:this.form.open?1:2,
            setting: {
              btnColor:this.form.btnColor,
              btnTxt:this.form.btnText,
              btnTxtColor:this.form.textColor,
            },
            value: [{
              key:"A1",
              visibleCondition: 0,  //可见人群；0不限，1限
              limitCondition: "",   //人群条件
              backgroundColor: "#fff",
              fillWay: 0,  //填充方式 0全屏
              richTextContent: this.form.richTextContent,  //文本内容
              elementIndex: 1
            }]
          };
          this.axios.post('/api-admin/save-page',qs.stringify({
            requestProject: 'gic-web',
            saveType:1,
            params:JSON.stringify(params),
          })).then(res => {
            var data = res.data;
            if(data.errorCode == 0) {
              this.$message.success("保存成功");
            }else{
              this.$message.error(data.message);
            }
          }).catch(err => {
            console.log(err);
          })
        }else{
          this.errorBool = true
        }
      },
    },
    components:{
      topNav,
      editor,
      tinymceEdit
    }
  }
</script>

<style lang="less" scoped>
  .right-box{
    display: flex;
    padding: 24px;
    background: #fff;
    justify-content: center;
  }
  .ser-lt-wrap{
    flex: 0 0 600px;
    padding: 24px;
    background-color: #f0f2f5;
    .ser-lt{
      padding: 24px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 2px;
    }
    .open-wrap{
      p{
        color: #909399;
        font-size: 12px;
        line-height: 18px;
        margin-top: 8px;
      }
    }
    .name-wrap{
      .gic-form-item{
        width: 230px;
      }
    }
    .rich-tinymce-wrap .tinymce-contain{
      width: 450px;
    }
    .color-wrap{
      /deep/ .el-form-item__content{
        height: 32px;
      }
      .formreset{
        margin: 0 10px;
        color: #1890ff;
        cursor: pointer;
        line-height: 32px;
        display: inline-block;
        vertical-align: top;
      }
    }
  }
  .ser-rt-wrap{
    flex: 0 0 374px;
    height: 670px;
    margin-left: 60px;
    border: 1px solid #dcdfe6;
    position: relative;
    .ser-rt-content{
      height: 480px;
      overflow: auto;
    }
    .rt-btn-wrap{
      width: 100%;
      position: absolute;
      bottom: 0;
      .rt-btn{
        width: 250px;
        height: 45px;
        margin: 0 auto;
        line-height: 45px;
        border-radius:3px;
        font-size: 18px;
        text-align: center;
      }
      p{
        color: #BFBFBF;
        font-size: 10px;
        margin: 30px 0 20px 0;
        text-align: center;
      }
    }
    .title{
      width: 100%;
      height: 64px;
      background: url(./navbar-service_mould-head.png) no-repeat;
      background-size: 100% 100%;
      p{
        width: 100px;
        text-align: center;
        padding-top: 8px;
        font-size: 18px;
        font-weight: 600;
        color: #000;
        margin: 0 auto;
        height: 64px;
        line-height: 64px;
        overflow: hidden;
      }
    }
  }
  .ser-lt /deep/ .el-form-item__label{
    color: #606266;
  }
  .ser-rt-content /deep/ p{
    color: #666666;
    font-size: 14px;
    line-height: 1.5;
  }
</style>
