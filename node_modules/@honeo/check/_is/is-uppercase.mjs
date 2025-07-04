// Mod
import isString from './is-string.mjs';

/*
	引数文字列がすべて大文字か
*/
function isUppercase(arg){

	if( !isString(arg) ){
		return false;
	}

	return /^[A-Z]+$/.test(arg);
}

export default isUppercase;
