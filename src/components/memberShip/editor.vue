<template>
  <div class="tinymce-contain">
    <textarea :id="id" :value="value"></textarea>
  </div>
</template>
<script>
import { getRequest,postForm } from '../../api/api';

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'

import 'tinymce/plugins/image'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
const INIT = 0;
const CHANGED = 2;
var EDITOR = null;

export default {
  name: "editor",
  props: {
    value: {
      type: String,
      required: true
    },
    projectName:String,
    editindex:Number
  },
  data() {
    return {
      status: INIT,
      id: 'editor-'+new Date().getMilliseconds()
    }
  },
  watch: {
    projectName: function(newData,oldData){
      var that = this;
      // console.log("新数据:",newData,oldData)
      that.repProjectName = newData || 'gic-web';
    },
    value: function (val) {              
      //console.log('init ' + val)
      if (this.status == INIT || tinymce.activeEditor.getContent() != val){
        tinymce.activeEditor.setContent(val);
      }
      this.status = CHANGED
    }
  },
  mounted() {
    const _this = this;
    const setting = {
      selector:'#'+_this.id,
      language:"zh_CN",
      language_url: 'static/tinymce/zh_CN.js',
      skin_url: 'static/tinymce/skins/lightgray',
      height: 400,
      // 图片上传
      images_upload_credentials: true, //是否应传递cookie等跨域的凭据
      images_upload_handler: (blobInfo, success, failure)=>{
        //console.log(blobInfo)
        _this.handleImgUpload(blobInfo, success, failure)
      },
      // 添加插件
      // plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
      // toolbar:
      //   'fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
      plugins: 'image textcolor',
      toolbar:
        'fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify |  link unlink image code',
      fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
      branding: false,
      menubar: false,
      init_instance_callback:function(editor) {
          // EDITOR = editor;
          // console.log("Editor: " + editor.id + " is now initialized.");
          editor.on('input change undo redo', () => {
              var content = editor.getContent()
              var obj = {};
              obj.content = content;
              obj.index = _this.editindex;
              _this.$emit('input', obj);
          });
      },
    };
    Object.assign(setting,_this.setting)
    tinymce.init(setting)
  },
  methods: {
    // 上传图片
    handleImgUpload (blobInfo, success, failure) {
      var that = this
      let formdata = new FormData()
      formdata.set('upload_file', blobInfo.blob())
      formdata.set("requestProject",that.repProjectName);
      //console.log(formdata)
      postForm('/api-plug/upload-img', formdata).then(res => {
        success(res.data.result[0].qcloudImageUrl)
      }).catch(res => {
        //console.log(res)
        failure('error')
      })
    },
  },
  beforeDestroy: function () {
    tinymce.get(this.id).destroy();
  }
}
</script>
<style scoped>
  .tinymce-contain {
    width: 900px
  }
</style>
