/*
	null or undef

		args
			1: any
		result
			boolean
*/
function isNullish(arg){
	if( arg===null ){
		return true;
	}else if( arg===undefined ){
		return true;
	}else{
		return false;
	}
}

export default isNullish;
