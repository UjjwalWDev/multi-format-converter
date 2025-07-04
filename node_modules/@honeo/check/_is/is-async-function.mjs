import isInstanceof from './is-instanceof.mjs';

let AsyncFunction;

function isAsyncFunction(arg){

	if( !AsyncFunction ){
		AsyncFunction = (async()=>0).constructor;
	}

	return isInstanceof(arg, AsyncFunction);
}

export default isAsyncFunction;
