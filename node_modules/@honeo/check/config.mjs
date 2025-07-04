/*
	設定オブジェクトを返す
*/
const config = {

	// 可変長引数に関する設定
	variadic: {
		ignore: [// 無視する関数名(非対応・元から対応などで)
			'isInstanceof',
			'isInstanceOfClassName',
			'isMultiple',
			'isValidDate',
			'isSameDay'
		]
	},

	// 別名付けるやつ
	short: {
		isArray: 'isArr',
		isBoolean: 'isBool',
		isBuffer: 'isBuf',
		isArrayBuffer: 'isArrBuf',
		isError: 'isErr',
		isFunction: ['isFunc', 'isFn'],
		isNumber: 'isNum',
		isRegExp: 'isRE',
		isString: 'isStr',
		isObject: 'isObj',
		isUndefined: 'isUndef',
		isElement: 'isElm',
		isDocumentFragment: 'isDF',
		isVersion: 'isVer'
	}
}

export default config;
