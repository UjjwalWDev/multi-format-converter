// Mod
import isNumber from './is-number.mjs';

/*
	倍数判定
		引数1が引数2の倍数か

		args
			1: number
			2: number
		result
			boolean
*/

function isMultiple(arg1, arg2){

	// validation
	if( !isNumber(arg1) ){
		throw TypeError('Invalid arguments 1');
	}
	if( !isNumber(arg2) ){
		throw TypeError('Invalid arguments 1');
	}

	return !(arg1%arg2);
}

export default isMultiple;
