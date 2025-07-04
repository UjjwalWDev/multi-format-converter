
/*
	instanceof

		args
			1: any
			2: any
		result
			boolean
*/
function isInstanceof(arg, arg2){
	try{
		return arg instanceof arg2;
	}catch(e){
		return false;
	}
}

export default isInstanceof;
