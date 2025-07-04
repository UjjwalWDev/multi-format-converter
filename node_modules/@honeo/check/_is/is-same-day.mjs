import isDate from './is-date.mjs';

/*
	引数のdateインスタンスが同じ日か

		args
			1...: date
		result
			boolean
*/
function isSameday(...arr_date){
	let str_baseDateText;

	for(let date of arr_date ){
		if( !isDate(date) ){
			throw new TypeError(`Invalid arguments: ${index}`);
		}

		if( !str_baseDateText ){
			str_baseDateText = date.toDateString();
		}else{
			const str_dateText = date.toDateString();
			if(str_baseDateText!==str_dateText){
				return false;
			}
		}
	}

	return true;
}

export default isSameday;
