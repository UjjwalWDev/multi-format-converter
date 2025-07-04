// Mod
import isString from './is-string.mjs';

/*
	引数文字列がすべて半角小文字か
*/
function isLowercase(arg){

	if( !isString(arg) ){
		return false;
	}

	return /^[a-z]+$/.test(arg);
}

export default isLowercase;
