import isObj from './is-object.mjs';
import isFunc from './is-function.mjs';

/*
	引数がAbortSignalインスタンスか
		Polyfillでも機能するようにしている。
*/
function isAbortSignal(abortSignal){
	// const isETExtend = abortSignal instanceof EventTarget;
	return isObj(abortSignal)
		&& isFunc(abortSignal.constructor)
		&& abortSignal.constructor.name==='AbortSignal';
}

export default isAbortSignal;
