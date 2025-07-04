# check
* [honeo/check](https://github.com/honeo/check)
* [@honeo/check](https://www.npmjs.com/package/@honeo/check)


## なにこれ
型・インスタンス等をチェックするやつ。


## 使い方
```bash
$ npm i @honeo/check
```
```js
import {is, not, any} from '@honeo/check';

is.arr([]); // true

is.arr([], {}); // false
not.arr([], {}); // false
any.arr([], {}); // true


// single
import is from '@honeo/check/is.mjs'; // or not.mjs, any.mjs

// default export
import check from '@honeo/check';
check.is.foobar();
```
```js
// webpack v4~ webpack.config.js
{
	node: {
		fs: 'empty'
	}
}
```


## API
is, not, any共用。

### Alias
```js
is.FooBar===is.foobar; // true
```


### Type, Instance
```js
is.array([]); // true
is.arr([], []); // true

is.boolean(false); // true
is.bool(true, false); // true

is.buffer(new Buffer('foobar')); // true
is.arraybuffer( new ArrayBuffer(0)); // true

is.error(new Error('hoge')); // true

is.function(function(){}); // true
is.func(()=>{}); // true
is.fn(_=>_); // true

is.asyncfunction(async()=>{}); // true
is.asyncgeneratorfunction(async function*(){}); // true
is.generatorfunction(function*(){}); // true

is.number(1); // true
is.num(0, 1); // true

is.regexp(/hoge/); // true
is.re(/foo/, /bar/); // true

is.string('hoge'); // true
is.str('fuga', 'piyo'); // true

is.undefined(undefined); // true
is.undef(null); // false

is.null(null); // true

is.nan(NaN); // true

is.date(new Date()); // true

is.object({}); // true
is.obj(null); // false

is.promise(new Promise(_=>_)); // true

is.stats( fs.statSync('./') ); // true

is.abortcontroller(new AbortController() ); // true
is.abortsignal(new AbortController().signal); // true
```

| name                                           | type | varargs | description                                                                                                         |
|:---------------------------------------------- |:---- |:-------:|:------------------------------------------------------------------------------------------------------------------- |
| Array, Arr, array, arr                         | any  |    ○    |                                                                                                                     |
| Boolean, Bool, boolean, bool                   | any  |    ○    |                                                                                                                     |
| Buffer, Buf, buffer, buf                       | any  |    ○    |                                                                                                                     |
| Error, Err, error, err                         | any  |    ○    |                                                                                                                     |
| Function, Func, Fn, function, func, fn         | any  |    ○    |                                                                                                                     |
| AsyncFunction, asyncfunction                   | any  |    ○    |                                                                                                                     |
| AsyncGeneratorFunction, asyncgeneratorfunction | any  |    ○    |                                                                                                                     |
| GeneratorFunction, generatorfunction           | any  |    ○    |                                                                                                                     |
| Number, Num, number, num                       | any  |    ○    |                                                                                                                     |
| RegExp, RE, regexp, re                         | any  |    ○    |                                                                                                                     |
| String, Str, string, str                       | any  |    ○    |                                                                                                                     |
| Undefined, Undef, undefined, undef             | any  |    ○    |                                                                                                                     |
| Null, null                                     | any  |    ○    |                                                                                                                     |
| NaN, nan                                       | any  |    ○    |                                                                                                                     |
| Date, date                                     | any  |    ○    |                                                                                                                     |
| Object, Obj, object, obj                       | any  |    ○    |                                                                                                                     |
| Promise, promise                               | any  |    ○    |                                                                                                                     |
| Stats, stats                                   | any  |    ○    |                                                                                                                     |
| ArrayBuffer, ArrBuf, arraybuffer, arrbuf       | any  |    ○    |                                                                                                                     |
| AbortController, abortcontroller               | any  |    ○    | [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)インスタンスか（Polyfill対応）。 |
| AbortSignal, abortsignal                       | any  |    ○    | [AbortSignal](https://developer.mozilla.org/ja/docs/Web/API/AbortSignal)インスタンスか（Polyfill対応）。            |



### Number

```js
is.even(2); // true

is.odd(3); // true

is.multiple(8080, 80); // true
```

| name               | type   | varargs | description            |
|:------------------ |:------ |:-------:|:---------------------- |
| Odd, odd           | number |    ○    | 引数がすべて奇数か。   |
| Even, even         | number |    ○    | 引数がすべて偶数か。   |
| Multiple, multiple | number |    ✗    | 引数1が引数2の倍数か。 |

### String
```js
is.ipv4('192.168.1.1'); // true

is.hostname('www.example.com'); // true

is.lowercase('hoge'); // true

is.uppercase('FOO', 'BAR'); // true
```

| name                 | type   | varargs | description    |
|:-------------------- |:------ |:-------:|:-------------- |
| IPv4, ipv4           | string |    ○    |                |
| Hostname, hostname   | string |    ○    | やっつけ実装。 |
| Lowercase, lowercase | string |    ○    |                |
| Uppercase, uppercase | string |    ○    |                |

### DOM

```js
is.node(document.body, document.createTextNode('hoge')); // true

is.textnode(document.createTextNode('hoge')); // true

is.element(document.head, document.body); // true

is.df(document.createDocumentFragment()); // true

is.event( new Event("hoge") ); // true

is.eventtarget(document, window); // true
```

| name                                       | type | varargs | description |
|:------------------------------------------ |:---- |:-------:|:----------- |
| Node, node                                 | any  |    ○    |             |
| TextNode, textnode                         | any  |    ○    |             |
| Element, Elm, element, elm                 | any  |    ○    |             |
| DocumentFragment, DF, documentfragment, df | any  |    ○    |             |
| Event, event                               | any  |    ○    |             |
| EventTarget, eventtarget                   | any  |    ○    |             |


### その他

```js
is.true(true, !0); // true

is.false(false !1); // true

is.truthy(true, "hoge", 1, [], {}); // true

is.falsy(null, undefined, "", 0, NaN); // true

is.instance([], {}); // true
is.instance("hoge"); // false

is.instanceof(new Date(), Date); //true

is.instanceOfClassName([], "Array"); // true

is.objectliteral({}); // true
not.objectliteral([], new function(){}); // true

is.arraylike([], 'hoge'); // true

is.comparisonoperator('<='); // true

is.sameDay(new Date(), new Date()); // true

is.semver('1.2.3'); // true
is.semver('1.0.0-foo.bar'); // true

is.version('7.7.4', '2.5.0.1') // true
is.version('1.2A', 1.0); // false

is.empty('', [], {}) // true
is.empty(0, null); // false

is.leapyear(2020, new Date('2024'));

is.validdate(2019, 4, 17); // true
is.validdate(2020, 12, 32); // false
```

| name                                         | type         | varargs | description                                       |
|:-------------------------------------------- |:------------ |:-------:|:------------------------------------------------- |
| ArrayLike(), arraylike()                     | any          |    ○    |                                                   |
| True(), true()                               | any          |    ○    |                                                   |
| False(), false()                             | any          |    ○    |                                                   |
| Truthy(), truthy()                           | any          |    ○    |                                                   |
| Falsy(), falsy()                             | any          |    ○    |                                                   |
| Empty(), empty()                             | any          |    ○    | 要素が空か。                                      |
| Instance(), instance()                       | any          |    ○    | 何らかのインスタンスであるオブジェクトか。        |
| Instanceof(), instanceof()                   | any          |    ✗    | 引数1が引数2のConstructor/Classのインスタンスか。 |
| InstanceOfClassName(), instanceofclassname() | instance, string     |    ✗    | 引数1が引数2の名称を持つClassのインスタンスか。 |
| Nullish(), nullish()                         | any          |    ○    | null or undefined                                 |
| ObjectLiteral(), objectliteral()             | any          |    ○    | 未継承の素のオブジェクトか。                      |
| ComparisonOperator(), comparisonoperator()   | any          |    ○    | 有効な比較演算子の文字列か。                      |
| SameDay(), sameday()                         | date         |    ○    | 同じ日か                                          |
| SemVer(), semver()                           | any          |    ○    | 有効なSemVer文字列か。                            |
| Version(), Ver(), versiom(), ver()           | any          |    ○    | 有効な数字, dotのバージョン文字列か。             |
| LeapYear(), leapyear()                       | number, date |    ○    | 閏年か。                                          |
| ValidDate(year, mon, day), validdate()       | number       |    ✗    | 存在する日付か。                                  |


## Breaking Changes

### v2.0.0

#### CommonJS => ES Modules
```js
// before CJS
const {is, not, any} = require('@honeo/check');


// after ESM
import {is, not, any} from '@honeo/check';
```


#### rename: instance() => instanceof()
```js
// before
is.instance([], Array);

// after
is.instanceof([], Array);
```
