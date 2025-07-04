// Mod: core
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';
// Mod: npm
import JSDOM from 'jsdom';
// Mod: local
import check from '../index.mjs';
import {is, not, any} from '../index.mjs';
import _is from '../is.mjs';


// jsdom set
global.document = JSDOM.jsdom('hogehoge');
global.head = document.head;
global.window = document.defaultView;
global.Node = window.Node;
global.Element = window.Element;
global.Event = window.Event;

// Var
//const {is, not, any} = check;
const cases = {}
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Main
assert(is===check.is, 'Hybrid export failed')



console.log('.arraybuffer');
if( !is.arraybuffer(new ArrayBuffer(0)) ){
	throw new Error('failed');
}
if( !not.arrbuf('hoge') ){
	throw new Error('failed');
}


console.log('.abortcontroller');
{
	const ac = new AbortController();
	if( is.abortcontroller(ac) ){
	}else{
		throw new Error('native: failed');
	}
}
{
	const {AbortController} = await import('@azure/abort-controller');
	const ac = new AbortController();
	if( is.abortcontroller(ac) ){
	}else{
		throw new Error('@azure/abort-controller: failed');
	}
}
{
	const {AbortController} = await import('node-abort-controller');
	const ac = new AbortController();
	if( is.abortcontroller(ac) ){
	}else{
		throw new Error('node-abort-controller: failed');
	}
}

console.log('.abortsignal');
{
	const as = new AbortController().signal;
	if( is.abortsignal(as) ){
	}else{
		throw new Error('native: failed');
	}
}
{
	const {AbortController} = await import('@azure/abort-controller');
	const as = new AbortController().signal;
	if( is.abortsignal(as) ){
	}else{
		throw new Error('@azure/abort-controller: failed');
	}
}
{
	const {AbortController} = await import('node-abort-controller');
	const as = new AbortController().signal;
	if( is.abortsignal(as) ){
	}else{
		throw new Error('node-abort-controller: failed');
	}
}


console.log('.asyncfunction');
{
	const asyncFunc = async()=>{}
	const bool = is.asyncfunction(asyncFunc);
	if( !bool ){
		throw new Error('case async: failed');
	}
}
{
	const bool = is.asyncfunction(_=>{});
	if( bool ){
		throw new Error('case sync: failed');
	}
}
{
	const asyncFunc = async()=>{}
	const bool = is.asyncfunction(asyncFunc, asyncFunc);
	if( !bool ){
		throw new Error('case async2: failed');
	}
}
{
	const asyncFunc = async()=>{}
	const bool = is.asyncfunction(asyncFunc, _=>{});
	if( bool ){
		throw new Error('case async, sync: failed');
	}
}


console.log('.asyncgeneratorfunction');
{
	const asyncGeneFunc = async function*(){}

	{
		const bool = is.asyncgeneratorfunction(asyncGeneFunc);
		if( !bool ){
			throw new Error('case asyncGene: failed');
		}
	}
	{
		const bool = is.asyncgeneratorfunction(_=>{});
		if( bool ){
			throw new Error('case sync: failed');
		}
	}
	{
		const bool = is.asyncgeneratorfunction(asyncGeneFunc, asyncGeneFunc);
		if( !bool ){
			throw new Error('case asyncGene2: failed');
		}
	}
	{
		const bool = is.asyncgeneratorfunction(asyncGeneFunc, _=>{});
		if( bool ){
			throw new Error('case asyncGene, sync: failed');
		}
	}
}


console.log('.generatorfunction');
{
	const geneFunc = function*(){}
	const bool = is.generatorfunction(geneFunc);
	if( !bool ){
		throw new Error('case gene: failed');
	}
}
{
	const bool = is.generatorfunction(_=>{});
	if( bool ){
		throw new Error('case func: failed');
	}
}
{
	const geneFunc = function*(){}
	const bool = is.generatorfunction(geneFunc, geneFunc);
	if( !bool ){
		throw new Error('case gene2: failed');
	}
}
{
	const geneFunc = function*(){}
	const bool = is.generatorfunction(_=>{}, geneFunc);
	if( bool ){
		throw new Error('case func, gene: failed');
	}
}




console.log('isInstanceOfClassName');
{
	let bool;
	try{
		is.instanceofclassname();
		bool = false;
	}catch(e){
		bool = true;
	}
	assert(bool, 'case none arg: failed');
}
{
	const bool = is.instanceofclassname(new Date(), 'Date');
	assert(bool, 'case success: failed');
}
{
	const bool = is.instanceofclassname({}, 'Array');
	assert(!bool, 'case invalid classname: failed');
}
{
	let bool;
	try{
		is.instanceofclassname(true, false);
		bool = false;
	}catch(e){
		bool = true;
	}
	assert(bool, 'case invalid arg: failed');
}


console.log('.hostname');
if(
	!is.hostname('example.com') &&
	!is.hostname('www.example.com') &&
	!is.hostname('foo-bar-2000.example.com') &&
	!is.hostname('hoge-1234.fu.ga.pi.yo') &&
	!is.hostname('Hoge.example.com') &&
	not.hostname('-invalid-hostname.example.com') &&
	not.hostname('very-long-hostnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame.example.com')
){
	throw new Error('failed');
}

console.log('.ipv4');
if(
	!is.ipv4('192.168.1.1') &&
	!is.ipv4('0.0.0.0') &&
	!is.ipv4('255.255.255.255') &&
	!not.ipv4('32.64.128.256') &&
	!not.ipv4('123.123.123') &&
	!not.ipv4('123.123.123.123.123')
){
	throw new Error('failed');
}

// multiple
console.log('.multiple');
{
	assert(is.Multiple(4, 2), 'is 4, 2');
	assert(is.Multiple(8080, 80), 'is 8080, 80');
	assert(not.Multiple(151, 50), 'not 151, 50');
	assert(is.Multiple(0, 5), '0が全ての数の倍数になっていない');
	assert(is.Multiple(0, 0), '0が0の倍数になっていない');

	let bool;
	try{
		is.Multiple('multiple!');
		bool = false;
	}catch(e){
		bool = true;
	}
	assert(bool, 'validation failed');
}



console.log('.nullish');
if( !is.nullish(null) ){
	throw new Error('failed');
}
if( !is.nullish(undefined) ){
	throw new Error('failed');
}
if( !is.nullish(null, undefined) ){
	throw new Error('failed');
}
if( !not.nullish(true, "", []) ){
	throw new Error('failed');
}
if( not.nullish(null) ){
	throw new Error('failed');
}
if( !any.nullish(null, true) ){
	throw new Error('failed');
}

console.log('.sameday');
{
	if( !is.sameday(new Date(), new Date()) ){
		throw new Error('failed1');
	}
	const bool2 = is.sameday(
		new Date(),
		new Date('1999')
	);
	if( bool2 ){
		throw new Error('failed2');
	}

	const bool3 = is.sameday(
		new Date(),
		new Date(),
		new Date()
	);
	if( !bool3 ){
		throw new Error('failed3');
	}
}


/// type

// array, arr
cases.array = (arg)=>{
	return !is.Array()
		&& is.array([])
		&& is.Arr([])
		&& is.arr([], [])
		&& !is.arr('array!')
		&& !is.arr([], true);
}

// boolean, bool
cases.boolean = (arg)=>{
	return !is.Boolean()
		&& is.boolean(true)
		&& is.Bool(false)
		&& is.bool(true, false)
		&& !is.bool('boolean!')
		&& !is.bool(true, 'true');
}

// error, err
cases.error = (arg)=>{
	return !is.Error()
		&& is.error(new Error())
		&& is.Err(new Error())
		&& is.err(new Error(), new Error())
		&& !is.err('error')
		&& !is.err(new Error(), 'error');
}

// function, func, fn
cases.function = (arg)=>{
	const f = function(){};
	return !is.Function()
		&& is.function(f)
		&& is.Func(f)
		&& is.func(f, f)
		&& is.fn(f)
		&& !is.func('function!')
		&& !is.func(f, true);
}

// number, num
cases.number = (arg)=>{
	return !is.Number()
		&& is.number(123)
		&& is.Num(45)
		&& is.num(22, 80, 443)
		&& !is.num('number!')
		&& !is.num(1, true);
}

// regexp, re
cases.regexp = (arg)=>{
	const r = /hoge/;
	return !is.RegExp()
		&& is.regexp(r)
		&& is.RE(r)
		&& is.re(r, r)
		&& !is.re('rexexp!')
		&& !is.re(r, true);
}

// string, str
cases.string = (arg)=>{
	return !is.String()
		&& is.string('hoge')
		&& is.Str('fuga')
		&& is.str('foo', 'bar')
		&& !is.str(123)
		&& !is.str('piyo', true);
}

// undefined
cases.undefined = (arg)=>{
	return !is.Undefined()
		&& is.undefined(undefined)
		&& is.undefined(undefined, undefined)
		&& !is.undefined(null);
}

// null
cases.null = (arg)=>{
	return !is.Null()
		&& is.null(null)
		&& is.null(null, null)
		&& !is.null(undefined);
}

// NaN
cases.nan = (arg)=>{
	return !is.NaN()
		&& is.nan(NaN)
		&& is.nan(NaN, NaN)
		&& !is.nan(undefined);
}



/// instance


// buffer
cases.buffer = ()=>{
	const buffer = Buffer.from('hoge');
	return is.Buffer(buffer)
		&& is.Buf(buffer)
		&& is.buffer(buffer)
		&& is.buf(buffer)
		&& !is.Buffer('hoge')
		&& !is.Buffer()
		&& !is.Buffer(true)
		&& !is.Buffer({});
}


// date
cases.date = (arg)=>{
	return !is.Date()
		&& !is.date({})
		&& !is.date('date object')
		&& is.date(new Date());
}

// event
cases.event = (arg)=>{
	return !is.Event()
		&& !is.event({})
		&& !is.event('event')
		&& is.event( new Event('hoge') );
}

/// jsdomではEventTargetがfunctionではなくobjectなためinstanceofで判定ができないから省略
// // eventtarget
// cases.eventtarget = (arg)=>{
// 	return !is.eventtarget()
// 		&& !is.eventtarget({})
// 		&& !is.eventtarget('eventtarget')
// 	&& is.eventtarget(window);
// }

// eventtarget

// object, obj
cases.object = (arg)=>{
	return !is.Object()
		&& is.object({})
		&& is.Obj({})
		&& is.obj( Object.create(null) )
		&& is.obj({}, {})
		&& !is.obj('object!')
		&& !is.obj({}, true);
}

// stats
cases.stats = (arg)=>{
	const stats_dir = fs.statSync('./');
	const stats_file = fs.statSync(__filename);
	return !is.stats()
		&& is.stats(stats_dir)
		&& is.stats(stats_dir, stats_file)
		&& !is.stats({}, true);
}

// promise
cases.promise = (arg)=>{
	const p = new Promise(_=>_);
	return !is.Promise()
		&& is.promise(p)
		&& is.promise(p, p)
		&& !is.promise('promise!')
		&& !is.promise(p, true);
}



/*
	Number
*/

// even
cases.even = (arg)=>{
	return is.Even(0)
		&& is.even(2)
		&& is.even(4, 6)
		&& !is.even(8, 9)
		&& !is.even('evennumber!');
}

// odd
cases.odd = (arg)=>{
	return is.Odd(1)
		&& is.odd(3)
		&& is.odd(5, 7)
		&& !is.odd(9, 10)
		&& !is.odd('oddnumber!');
}




/*
	String系
 */
cases.lowercase = (arg)=>{
	return is.Lowercase('hoge')
		&& is.lowercase('foo', 'bar')
		&& !is.lowercase('Fuga')
		&& !is.lowercase(true);
}
cases.uppercase = (arg)=>{
	return is.Uppercase('HOGE')
		&& is.uppercase('FOO', 'BAR')
		&& !is.uppercase('Fuga')
		&& !is.uppercase(true);
}


/// DOM
const textnode = document.createTextNode('');
const element = document.createElement('div');

// node
cases.node = (arg)=>{
	return !is.Node()
		&& is.node(textnode)
		&& is.node(element)
		&& is.node(textnode, element)
		&& !is.node('node!')
		&& !is.node(textnode, true);
}

// textnode
cases.textnode = (arg)=>{
	return !is.TextNode()
		&& is.textnode(textnode)
		&& is.textnode(textnode, textnode)
		&& !is.textnode('textnode!')
		&& !is.textnode(textnode, true);
}

// element
cases.element = (arg)=>{
	return !is.Element()
		&& is.Elm(element)
		&& is.element(element, element)
		&& !is.elm('element!')
		&& !is.element(element, true);
}

// documentfragment, df
cases.documentfragment = (arg)=>{
	const df = document.createDocumentFragment();
	return !is.DocumentFragment()
		&& is.documentfragment(df)
		&& is.DF(df)
		&& is.df(df, df)
		&& !is.df('documentfragment!')
		&& !is.df(df, true);
}



/*
	Other
*/

// true
cases.true = (arg)=>{
	return !is.True()
		&& is.true(true)
		&& is.true(true, true)
		&& !is.true('true!')
		&& !is.true(true, false);
}

// false
cases.false = (arg)=>{
	return !is.False()
		&& is.false(false)
		&& is.false(false, false)
		&& !is.false('false!')
		&& !is.false(false, true);
}

// truthy
cases.truthy = (arg)=>{
	return !is.Truthy()
		&& is.truthy(true)
		&& is.truthy("hoge", 123, [], {})
		&& !is.truthy(null, undefined)
		&& !is.truthy(true, false);
}

// falsy
cases.falsy = (arg)=>{
	return !is.Falsy()
		&& is.falsy(false)
		&& is.falsy("", 0, null, undefined, NaN)
		&& !is.falsy(true, "hoge", 123)
		&& !is.falsy(true, false);
}


// isInstanceof
cases.instanceof = (arg)=>{
	return !is.instanceof()
		&& is.instanceof(new Date, Date)
		&& !is.instanceof({}, Array)
		&& !is.instanceof(true, false);
}

// objectliteral
cases.objectliteral = (arg)=>{
	return !is.ObjectLiteral()
		&& is.objectliteral({})
		&& is.objectliteral({}, new Object({}))
		&& !is.objectliteral( new function(){} )
		&& !is.objectliteral({}, []);
}

// arraylike
cases.arraylike = (arg)=>{
	return !is.ArrayLike()
		&& is.arraylike([])
		&& is.arraylike('hoge', {length: 0})
		&& !is.arraylike(12345)
		&& !is.arraylike([], undefined);
}

// isComparisonOperator
cases.comparisonoperator = (arg)=>{
	return !is.ComparisonOperator()
		&& is.comparisonoperator('<')
		&& is.comparisonoperator('!==')
		&& !is.comparisonoperator('&&')
		&& !is.comparisonoperator(true, '>');
}

// isSemVer
cases.semver = (arg)=>{
	return !is.SemVer()
		&& is.semver('1.2.3')
		&& is.semver('1.0.0-foo.bar', '2.2.2')
		&& !is.semver('1.2.3.4')
		&& !is.semver(1.0)
		&& !is.semver(true, '1.0.0')
}

// isVersion
cases.version = (arg)=>{
	return !is.Version()
		&& is.Ver('1.2.3')
		&& is.version('1.0.0.0', '7.7.7.7.7.7.7')
		&& !is.ver('1.2.3.4.')
		&& !is.version(1.0)
		&& !is.version(true, '1.0.0A')
}

// isEmpty
cases.empty = (arg)=>{
	return is.Empty({})
		&& is.empty([])
		&& is.empty('')
		&& !is.empty()
		&& !is.empty(null)
		&& !is.empty({a: 1})
		&& !is.empty([1])
		&& !is.empty('0');
}

// isLeapYear
cases.leapyear = (arg)=>{
	return is.LeapYear(2020)
		&& is.leapyear(new Date('2016'))
		&& !is.leapyear(2019)
		&& !is.leapyear(new Date('2018'));
}

// isValidDate
cases.isvaliddate = (arg)=>{
	return is.ValidDate(2020, 11, 11)
		&& is.validdate(2019, 4, 17)
		&& !is.validdate(1995, 13, 1)
		&& !is.validdate(2010, 4, 32);
}

// 本体
for(let [key, method] of Object.entries(cases)){
	if( method() ){
		console.log(`${key}: success`);
	}else{
		throw new Error(`${key}: failed`);
	}
}


/*
	not
		中身はほぼ一緒だから適当
*/
const resultArr = [
	// string
	not.String(),
	!not.string('hoge'),
	!not.Str('fuga'),
	!not.str('foo', 'bar'),
	not.str(123),
	not.str(true, false),
	not.str('piyo', true),

	// element
	not.Element(true),
	!not.element(element),

	// 読み込みチェック
	(is===_is)
];


resultArr.forEach( (bool, index, arr)=>{
	if( bool ){
		console.log(`not: ${index+1}/${arr.length} success`);
	}else{
		throw new Error(`not: ${index}/${arr.length} failed`);
	}
});


/*
	any
*/
const resultArr_any = [
	any.true(false, true),
	any.True(false, true),
	!any.Number('123', true),
	!any.number('123', true),
	!any.Num('123', true),
	!any.num('123', true)
];

resultArr_any.forEach( (bool, index, arr)=>{
	if( bool ){
		console.log(`any: ${index+1}/${arr.length} success`);
	}else{
		throw new Error(`any: ${index}/${arr.length} failed`);
	}
});

console.log('test: done');
