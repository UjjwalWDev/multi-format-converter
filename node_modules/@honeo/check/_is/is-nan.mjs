// arg!=argでいい気もするがPolyfill前提のコンセプトのため
function isNaN(arg){
	return Number.isNaN(arg);
}

export default isNaN;
