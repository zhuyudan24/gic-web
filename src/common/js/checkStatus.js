import { Message } from 'element-ui'
export function checkFalse(message) {
  if(message) {
    Message.warning(message);
    return false
  }else{
    Message.warning('操作失败');
  }
  return false;
}
export function checkSuccess(message) {
  if(message) {
    Message.success(message);
  }else{
    Message.success('操作成功');
  }
}
export function checkStatus(err) {
  if(err == 'cancel') {
    Message.info(err || 'cancel');
    return false;
  }else if(err.hasOwnProperty('response')){
    if(err.response.status == 401) {
      Message.error('登录过期');
      return false;
    }else if(err.response.status == 500){
      Message.error('服务器错误500');
      return false;
    }
  }else {
    Message.error(err);
    return false;
  }
}
