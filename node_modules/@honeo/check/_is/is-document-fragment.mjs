/*
	comment
*/
import isNode from './is-node.mjs';

function isDocumentFragment(arg){
	return isNode(arg) && arg.nodeType===11;
}

export default isDocumentFragment;
