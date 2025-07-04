/*
	可変長引数ではないis関数詰め合わせモジュール
		略称版メソッドもなし
*/

// 型・インスタンス
import isArray from './is-array.mjs';
import isBoolean from './is-boolean.mjs';
import isBuffer from './is-buffer.mjs';
import isArrayBuffer from './is-array-buffer.mjs';
import isError from './is-error.mjs';
import isFunction from './is-function.mjs';
import isAsyncFunction from './is-async-function.mjs';
import isAsyncGeneratorFunction from './is-async-generator-function.mjs';
import isGeneratorFunction from './is-generator-function.mjs';
import isNumber from './is-number.mjs';
import isRegExp from './is-reg-exp.mjs';
import isStats from './is-stats.mjs';
import isString from './is-string.mjs';
import isUndefined from './is-undefined.mjs';
import isNull from './is-null.mjs';
import isNaN from './is-nan.mjs';
import isDate from './is-date.mjs';
import isEvent from './is-event.mjs';
import isEventTarget from './is-event-target.mjs';
import isObject from './is-object.mjs';
import isPromise from './is-promise.mjs';
import isAbortController from './is-abort-controller.mjs';
import isAbortSignal from './is-abort-signal.mjs';

// Number系
import isOdd from './is-odd.mjs';
import isEven from './is-even.mjs';
import isMultiple from './is-multiple.mjs';

// String系
import isLowercase from './is-lowercase.mjs';
import isUppercase from './is-uppercase.mjs';
import isIPv4 from './is-ipv4.mjs';
import isHostname from './is-hostname.mjs';

// DOM
import isNode from './is-node.mjs';
import isTextNode from './is-text-node.mjs';
import isElement from './is-element.mjs';
import isDocumentFragment from './is-document-fragment.mjs';


// 雑多
import isTrue from './is-true.mjs';
import isFalse from './is-false.mjs';
import isTruthy from './is-truthy.mjs';
import isFalsy from './is-falsy.mjs';
import isInstance from './is-instance.mjs';
import isInstanceof from './is-instanceof.mjs';
import isInstanceOfClassName from './is-instance-of-classname.mjs';
import isNullish from './is-nullish.mjs';
import isObjectLiteral from './is-object-literal.mjs';
import isArrayLike from './is-array-like.mjs';
import isComparisonOperator from './is-comparison-operator.mjs';
import isSameDay from './is-same-day.mjs';
import isSemVer from './is-sem-ver.mjs';
import isVersion from './is-version.mjs';
import isEmpty from './is-empty.mjs';
import isLeapYear from './is-leap-year.mjs';
import isValidDate from './is-valid-date.mjs';

// 返り値
const _is = {
	isArray,
	isBoolean,
	isBuffer,
	isArrayBuffer,
	isError,
	isFunction,
	isAsyncFunction,
	isAsyncGeneratorFunction,
	isGeneratorFunction,
	isNumber,
	isRegExp,
	isStats,
	isString,
	isUndefined,
	isNull,
	isNaN,
	isDate,
	isEvent,
	isEventTarget,
	isObject,
	isPromise,
	isAbortController,
	isAbortSignal,
	isOdd,
	isEven,
	isMultiple,
	isLowercase,
	isUppercase,
	isIPv4,
	isHostname,
	isNode,
	isTextNode,
	isElement,
	isDocumentFragment,
	isTrue,
	isFalse,
	isTruthy,
	isFalsy,
	isInstance,
	isInstanceof,
	isInstanceOfClassName,
	isNullish,
	isObjectLiteral,
	isArrayLike,
	isComparisonOperator,
	isSameDay,
	isSemVer,
	isVersion,
	isEmpty,
	isLeapYear,
	isValidDate
}

export default _is;
