import axios from 'axios'
 import { getToken } from '@/utils/auth'
/**
 * 通用js方法封装处理
 */

 // 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	})
	return actions.join('');
}