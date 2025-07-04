/*
	const obj = {} みたいなの
		arg.constructor===Object でもよさそう。

		2020.11.08
			Object#__proto__ => Object.getPrototypeOf()
*/
function isObjectLiteral(arg){
    return Object.getPrototypeOf(arg)===Object.prototype;
}

export default isObjectLiteral;
