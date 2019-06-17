
/* 后台返回消息提示 */
import { Message } from 'element-ui';

// 后台返回异常提示


// export default {
//   errorMsg: function(response) {
//     var local = sessionStorage.getItem('localhost');
//     if (response.errcode != 1) {
//       if (response.errcode == 4) {
//         window.location.href = local + "/gicweb/login";
//         return false;
//       }
//       Message.error({
//         duration: 1000,
//         message: response.errmsg
//       })
//     }
//   }
// }


export default {
  errorMsg: function(response) {
    var local = window.location.origin;
    if (local.indexOf('localhost')) {
      local = 'http://gicdev.demogic.com';
    }
    console.log(response)
    if (response.errorCode != 0) {
      if (response.errorCode == 401) {
        // window.location.href = local + "/gic-web/#/";
        return false;
      }
      Message.error({
        duration: 1000,
        message: response.message
      })
    }
  }
}