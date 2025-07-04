
// Var
const re_0to255 = /(\d|[1-9]\d|1\d{2}|2(5[0-5]|[0-4]\d))/;
const re_ipv4 = new RegExp(`^(${re_0to255.source}\\.){3}${re_0to255.source}$`);

/*
	IPv4アドレス文字列か
		dotで区切られた0-255が4つ。

		args
			1: string
		result
			boolean
*/
function isIPv4(str){
	return re_ipv4.test(str);
}

export default isIPv4;
