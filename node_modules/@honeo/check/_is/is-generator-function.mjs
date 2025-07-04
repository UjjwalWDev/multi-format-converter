import isInstanceof from './is-instanceof.mjs';

let GeneratorFunction;

function isGeneratorFunction(arg){

	if( !GeneratorFunction ){
		GeneratorFunction = (function*(){}).constructor;
	}

	return isInstanceof(arg, GeneratorFunction);
}

export default isGeneratorFunction;
