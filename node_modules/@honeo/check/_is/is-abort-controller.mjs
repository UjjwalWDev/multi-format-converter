import isObj from './is-object.mjs';
import isFunc from './is-function.mjs';

/*
	引数がAbortControllerインスタンスか
		Polyfillでも機能するようにしている。
*/
function isAbortController(ac){
	return isObj(ac)
		&& isFunc(ac.constructor)
		&& ac.constructor.name==='AbortController';
}

export default isAbortController;
