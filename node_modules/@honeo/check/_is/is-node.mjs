// Mod
import isNumber from './is-number.mjs';
import isObject from './is-object.mjs';

function isNode(arg){
	return arg instanceof Node;
}

export default isNode;
