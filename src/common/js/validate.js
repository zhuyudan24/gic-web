export function isvalidPhone(str) {		// 手机号验证
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}

export function isCommonCode(str) {   // 不允许有特殊符号，只能是 数字 字母 下划线 汉字 -
  const reg = /^[\w\u4e00-\u9fa5-]+$/; 
  return reg.test(str)
}

export function isCommonCodeSpace(str) {   // 不允许有特殊符号，只能是 数字 字母 下划线 汉字 - 可以有空格
  const reg = /^[\s\w\u4e00-\u9fa5-]+$/; 
  return reg.test(str)
}

export function isNumAndCode(str) {   // 只允许有字母和数字
  const reg = /^[a-zA-Z0-9]/; 
  return reg.test(str)
}

export function isvalidGPS(str) {   // GPS坐标 2.4545,4.564
  var gps = str.split(',');
  if(gps.length!=2){
    return false;
  }else{
    var a = gps[0];
    var b = gps[1];
    if(!b){
      return false;
    }
    var reg = /^[\+\-]?\d*?\.?\d*?$/; // 可以为数字和小数
    if(reg.test(a) && reg.test(b)){
      return true;
    }else{
      return false;
    }
  }
}



export function isvalidKind(option1,kind1,option2,kind2,option3,kind3) {		// 是否选择经营类目
  if(option1.length>0 && kind1==""){
  	return false;
  }
  if(option2.length>0 && kind2==""){
  	return false;
  }
  if(option3.length>0 && kind3==""){
  	return false;
  }
}