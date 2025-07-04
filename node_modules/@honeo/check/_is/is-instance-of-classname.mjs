// mod
import isInstance from './is-instance.mjs';
import isString from './is-string.mjs';

/*
	インスタンスの親クラスが指定した名称か

		args
			1: instance
			2: string
			3: op, object
		return
			boolean
*/


function isInstanceOfClassName(instance, str_name, options={debug:false}){

	options.debug && console.log('isInstanceOfClassName()', instance, str_name);

	if( !isInstance(instance) ){
		throw new TypeError('arg1 not instance');
	}
	if( !isString(str_name) ){
		throw new TypeError('arg2 not string');
	}

	return instance.constructor.name===str_name;
}

export default isInstanceOfClassName;
