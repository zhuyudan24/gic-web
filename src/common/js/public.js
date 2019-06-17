// 防抖
export function _debounce(fn, delay) {
  var delay = delay || 200;
  var timer;
  // console.log(fn)
  return function() {
    var that = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      fn.apply(that, args);
    }, delay);
  };
}
// 节流
export function _throttle(fn, interval) {
  var last;
  var timer;
  var interval = interval || 200;
  return function() {
    var that = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(that, args);
      }, interval);
    } else {
      last = now;
      fn.apply(that, args);
    }
  };
}

/**
 * 手机号格式化
 * @param {String} phone
 */
export function formatPhone(phone) {
  phone = phone.toString();
  return phone.substr(0, 3) + '****' + phone.substr(7, 11);
}

function formatDig(num) {
  return num > 9 ? '' + num : '0' + num;
}
export function formatDate(time) {
  let now = new Date(time);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  let data = year + '-' + formatDig(month) + '-' + formatDig(date) + ' ' + formatDig(hour) + ':' + formatDig(minute) + ':' + formatDig(second);
  return data;
}
