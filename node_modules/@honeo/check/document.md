# document
という名の制作メモ。


## 仕様
* ESM


## Mod

### devDependencies
* jsdom
    - DOM関連。


## dir構成

### ./
* index.mjs
    - is.mjs, not.mjs, any.mjsをまとめて返すだけ。
* is.mjs
    - ./\_is/index.mjsを可変長引数化する。
* not.mjs
    - is.mjsを元にnot関数を作成する。
* any.mjs
    - ./\_is/index.mjsを元にany関数を作成する。
* config.mjs
    - 設定オブジェクトを返すモジュール。

### ./\_is.
素の判定関数詰め合わせモジュールを返すディレクトリ。
* index.mjs
    - 本体。
* ^is-[a-z-]+\.mjs$
    - 個別の判定関数を返すモジュール。

### ./test
* index.mjs
    - npm tで呼び出されるテストスクリプト。
