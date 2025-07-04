import isInstanceof from './is-instanceof.mjs';

let AsyncGeneratorFunction;

function isAsyncGeneratorFunction(arg){

	if( !AsyncGeneratorFunction ){
		AsyncGeneratorFunction = (async function*(){}).constructor;
	}

	return isInstanceof(arg, AsyncGeneratorFunction);
}

export default isAsyncGeneratorFunction;
