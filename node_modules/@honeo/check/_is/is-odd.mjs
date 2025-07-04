/*
	奇数判定（0含む)
*/
import isNumber from './is-number.mjs';

function isOdd(num){
	return isNumber(num) && !!(num % 2);
}

export default isOdd;
