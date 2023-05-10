// 1、工具函数里面增加防抖函数
export function debounce(func,delay) {
		let timer;
		return function () {			
			clearTimeout(timer);
			timer= setTimeout(()=>{
				func.call(this,...arguments);
			},delay);
	 }
 }

export function throttle(fn, delay) {
  let timer;
  let t_start = Date.now();
  return function () {
    const context = this;
    const args = arguments;
    const t_curr = Date.now();
    clearTimeout(timer);
    if (t_curr - t_start >= delay) {
      fn.apply(context, args);
      t_start = t_curr;
    } else {
      timer = setTimeout(() => {
          fn.apply(context, args);
      }, delay);        
    }
  };
}
