/**
 * created by syo 2018/07/24
 * 时间段 开始时间默认当天的前一个月 结束时间默认当天 时间格式 yyyy-mm-dd
 * 注意开始时间的单月有多少天
 */

export function getNowFormatDate() {
  let date = new Date();
  const seperator1 = "-";
  const seperator2 = ":";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  let cDate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  let eDate;
  if (date.getMonth() <= 0) {
    eDate = date.getFullYear() - 1 + seperator1 + 12 + seperator1 + strDate;
  } else {
    let mon = date.getMonth();
    if (mon >= 1 && mon <= 9) {
      mon = "0" + mon;
    }
    eDate = date.getFullYear() + seperator1 + mon + seperator1 + strDate;
  }

  return {
    currentDate: cDate,
    endDate: eDate
  };
}

// 解析时间
export function Dateformat(time, fmt) {
  let o = { 
     "M+" : time.getMonth()+1,                 //月份 
     "d+" : time.getDate(),                    //日 
     "h+" : time.getHours(),                   //小时 
     "m+" : time.getMinutes(),                 //分 
     "s+" : time.getSeconds(),                 //秒 
     "q+" : Math.floor((time.getMonth()+3)/3), //季度 
     "S"  : time.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt; 
}
