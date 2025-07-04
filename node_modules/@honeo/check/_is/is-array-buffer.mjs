// Mod
import isInstance from './is-instance.mjs';

/*
	ArrayBufferインスタンスか

		args
			1: any
		result
			boolean
*/
function isArrayBuffer(arg){
	return isInstance(arg, ArrayBuffer);
}

export default isArrayBuffer;
