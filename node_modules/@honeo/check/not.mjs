/*
	isを元にnot作成
*/
import is from './is.mjs';

const not = Object.create(null);

for(let [key, func] of Object.entries(is) ){
	not[key] = (...args)=>{
		return !func(...args);
	}
}

export default not;
