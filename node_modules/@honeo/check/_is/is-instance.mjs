// Mod
import isObject from './is-object.mjs';
import isFunction from './is-function.mjs';




/*
	args === 2
	引数なにかのコンストラクタ関数・クラスのインスタンスか
		true条件
			オブジェクト
			.constructorが関数
			.__proto__が上記関数のprototype

		args
			1: any
		result
			boolean
*/
function isInstance(any){
	if( isObject(any) ){
		const parent = any.constructor;
		return isFunction(parent) &&
			Object.getPrototypeOf(any)===parent.prototype;
	}else{
		return false;
	}
}

export default isInstance;
