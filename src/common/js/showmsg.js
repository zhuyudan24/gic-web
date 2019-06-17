/* 消息提示 */
import { Message } from 'element-ui';

export default {
  showmsg: function(msg,type) {
    Message({
      duration: 1000,
      message: msg,
      type: type
    })
  }
};


