/* 获取左侧侧边栏  拼装头部面包屑*/
import axios from 'axios'
let qs = require('qs')
export function getBreadcrumb(path) {
  var navpath = [];
  return new Promise((resolve,reject) => {
    axios.post('/api-auth/get-current-memu-data',qs.stringify({
      requestProject:'gic-web',
      project: 'gic-web',
      path:path
    })).then(res=>{
      var data = res.data;
      console.log(data);
      if(data.errorCode ==0){   /* 异步操作成功 */
        var leftMenu = data.result.list;
        leftMenu.forEach((item)=>{
          var obj = {};
          obj.name = item.menuName;
          if(item.menuUrl==''){
            obj.path = item.menuUrl;
          }else{
            obj.path = '/' + item.menuUrl;
          }
          navpath.push(obj)
        })
        resolve(navpath)
      } else {  /* 异步操作失败 */
        reject([]);
      }
    })
  })
}
  