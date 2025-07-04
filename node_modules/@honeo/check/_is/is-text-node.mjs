/*
	comment
*/
import isNode from './is-node.mjs';

function isTextNode(arg){
	return isNode(arg) && arg.nodeType===3;
}

export default isTextNode;
