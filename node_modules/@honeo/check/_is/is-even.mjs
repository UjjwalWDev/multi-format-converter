// Mod
import isNumber from './is-number.mjs';

/*
	偶数判定（0含む)
*/
function isEven(num){
	return isNumber(num) &&	!(num % 2);
}

export default isEven;
