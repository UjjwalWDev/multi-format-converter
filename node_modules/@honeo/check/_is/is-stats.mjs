// Mod
import fs from 'fs';

function isStats(arg){
	try{
		return arg instanceof fs.Stats;
	}catch(e){
		return false;
	}
}

export default isStats;
