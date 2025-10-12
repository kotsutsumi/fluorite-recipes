# Edge Runtime

Next.js Edge Runtimeは、標準のWeb APIに基づいており、次のAPIをサポートしています:

## ネットワーク API

| API                                                                               | 説明                             |
| --------------------------------------------------------------------------------- | -------------------------------- |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                        | BLOBを表す                       |
| [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API)                  | リソースをフェッチする            |
| [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent)            | フェッチイベントを表す            |
| [`File`](https://developer.mozilla.org/docs/Web/API/File)                        | ファイルを表す                    |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData)                | フォームデータを表す              |
| [`Headers`](https://developer.mozilla.org/docs/Web/API/Headers)                  | HTTPヘッダーを表す                |
| [`Request`](https://developer.mozilla.org/docs/Web/API/Request)                  | HTTPリクエストを表す              |
| [`Response`](https://developer.mozilla.org/docs/Web/API/Response)                | HTTPレスポンスを表す              |
| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams)  | URLパラメーターを表す             |
| [`WebSocket`](https://developer.mozilla.org/docs/Web/API/WebSocket)              | Websocket接続を表す               |

## エンコーディング API

| API                                                                                 | 説明                                  |
| ----------------------------------------------------------------------------------- | ------------------------------------- |
| [`atob`](https://developer.mozilla.org/docs/Web/API/atob)                          | base-64エンコードされた文字列をデコード |
| [`btoa`](https://developer.mozilla.org/docs/Web/API/btoa)                          | 文字列をbase-64でエンコード            |
| [`TextDecoder`](https://developer.mozilla.org/docs/Web/API/TextDecoder)            | Uint8Arrayを文字列にデコード           |
| [`TextDecoderStream`](https://developer.mozilla.org/docs/Web/API/TextDecoderStream)| ストリームの連鎖可能なデコーダー        |
| [`TextEncoder`](https://developer.mozilla.org/docs/Web/API/TextEncoder)            | 文字列をUint8Arrayにエンコード         |
| [`TextEncoderStream`](https://developer.mozilla.org/docs/Web/API/TextEncoderStream)| ストリームの連鎖可能なエンコーダー      |

## ストリーム API

| API                                                                                                       | 説明                       |
| --------------------------------------------------------------------------------------------------------- | -------------------------- |
| [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream)                            | 読み取り可能なストリーム    |
| [`ReadableStreamBYOBReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader)        | ReadableStreamのリーダー    |
| [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)  | ReadableStreamのリーダー    |
| [`TransformStream`](https://developer.mozilla.org/docs/Web/API/TransformStream)                          | 変換ストリーム              |
| [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream)                            | 書き込み可能なストリーム    |
| [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)  | WritableStreamのライター    |

## 暗号 API

| API                                                                       | 説明                                        |
| ------------------------------------------------------------------------- | ------------------------------------------- |
| [`crypto`](https://developer.mozilla.org/docs/Web/API/crypto_property)   | プラットフォームの暗号機能へのアクセスを提供 |
| [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)      | 暗号鍵を表す                                |
| [`SubtleCrypto`](https://developer.mozilla.org/docs/Web/API/SubtleCrypto)| ハッシュ化、署名、暗号化、復号化などの一般的な暗号プリミティブ |

## Web標準API

| API                                                                                                 | 説明                                                  |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController)                    | 1つ以上のDOMリクエストを望むときに中止できる          |
| [`Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)        | 値の配列を表す                                        |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)| 汎用の固定長生バイナリデータバッファを表す            |
| [`Atomics`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Atomics)    | アトミック操作を静的メソッドとして提供                |
| [`BigInt`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt)      | 任意の精度の整数を表す                                |
| [`BigInt64Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)| 64ビット符号付き整数の型付き配列を表す        |
| [`BigUint64Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)| 64ビット符号なし整数の型付き配列を表す      |
| [`Boolean`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)    | 論理エンティティを表し、2つの値を持つことができる: `true`と`false` |
| [`clearInterval`](https://developer.mozilla.org/docs/Web/API/clearInterval)                        | `setInterval()`への以前の呼び出しで確立されたタイマー付きの繰り返しアクションをキャンセル |
| [`clearTimeout`](https://developer.mozilla.org/docs/Web/API/clearTimeout)                          | `setTimeout()`への以前の呼び出しで確立されたタイマーをキャンセル |
| [`console`](https://developer.mozilla.org/docs/Web/API/Console)                                    | ブラウザのデバッグコンソールへのアクセスを提供        |
| [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)  | `ArrayBuffer`の汎用ビューを表す                       |
| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)          | プラットフォームに依存しない形式で単一の瞬間を表す    |
| [`decodeURI`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)| 以前に`encodeURI`によって作成されたUniform Resource Identifier (URI)をデコード |
| [`decodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)| 以前に`encodeURIComponent`によって作成されたUniform Resource Identifier (URI)コンポーネントをデコード |
| [`DOMException`](https://developer.mozilla.org/docs/Web/API/DOMException)                          | DOM内で発生したエラーを表す                           |
| [`encodeURI`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)| 特定の文字の各インスタンスをUTF-8エンコーディングを表す1、2、3、または4つのエスケープシーケンスに置き換えることによってUniform Resource Identifier (URI)をエンコード |
| [`encodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)| 特定の文字の各インスタンスをUTF-8エンコーディングを表す1、2、3、または4つのエスケープシーケンスに置き換えることによってUniform Resource Identifier (URI)コンポーネントをエンコード |
| [`Error`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)        | ステートメントを実行したり、プロパティにアクセスしようとしたときにエラーを表す |
| [`EvalError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/EvalError)| グローバル関数`eval()`に関するエラーを表す            |
| [`Float32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)| 32ビット浮動小数点数の型付き配列を表す          |
| [`Float64Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)| 64ビット浮動小数点数の型付き配列を表す          |
| [`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)  | 関数を表す                                            |
| [`Infinity`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity)  | 数学的な無限大の値を表す                              |
| [`Int8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)| 8ビット符号付き整数の型付き配列を表す                |
| [`Int16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)| 16ビット符号付き整数の型付き配列を表す              |
| [`Int32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)| 32ビット符号付き整数の型付き配列を表す              |
| [`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl)          | ECMAScript Internationalization API へのアクセスを提供 |
| [`isFinite`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/isFinite)  | 値が有限の数値かどうかを判定                          |
| [`isNaN`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/isNaN)        | 値が`NaN`かどうかを判定                               |
| [`JSON`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON)          | JavaScriptとJSON間の変換機能を提供                    |
| [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)            | キーと値のペアのコレクションを表す                    |
| [`Math`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math)          | 数学的な関数と定数へのアクセスを提供                  |
| [`Number`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)      | 数値を表す                                            |
| [`Object`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)      | すべてのJavaScriptオブジェクトの基本を表す            |
| [`parseFloat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)| 文字列引数を解析し、浮動小数点数を返す              |
| [`parseInt`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/parseInt)  | 文字列引数を解析し、指定された基数の整数を返す        |
| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)    | 非同期操作の最終的な完了（または失敗）とその結果の値を表す |
| [`Proxy`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy)        | 基本操作（プロパティ検索、代入、列挙、関数呼び出しなど）のカスタム動作を定義するために使用されるオブジェクトを表す |
| [`queueMicrotask`](https://developer.mozilla.org/docs/Web/API/queueMicrotask)                      | 実行されるマイクロタスクをキューに入れる              |
| [`RangeError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RangeError)| 値が許可された値のセットまたは範囲内にない場合のエラーを表す |
| [`ReferenceError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)| 存在しない変数が参照されたときのエラーを表す  |
| [`Reflect`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect)    | 傍受可能なJavaScript操作のメソッドを提供              |
| [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp)      | テキスト内の文字の組み合わせをマッチングするために使用されるパターンを表す |
| [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)            | 任意の型の一意の値のコレクションを表す                |
| [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval)                            | 固定された時間遅延で関数を繰り返し呼び出す            |
| [`setTimeout`](https://developer.mozilla.org/docs/Web/API/setTimeout)                              | 指定されたミリ秒数の後に関数を呼び出す                |
| [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)| 汎用の固定長生バイナリデータバッファを表す  |
| [`String`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)      | 文字のシーケンスを表す                                |
| [`structuredClone`](https://developer.mozilla.org/docs/Web/API/structuredClone)                    | 値のディープコピーを作成                              |
| [`Symbol`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol)      | 一意で不変のデータ型を表す                            |
| [`SyntaxError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)| 構文的に無効なコードを解釈しようとしたときのエラーを表す |
| [`TypeError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypeError)| 値が期待される型でない場合のエラーを表す              |
| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)| 8ビット符号なし整数の型付き配列を表す              |
| [`Uint8ClampedArray`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)| 0-255にクランプされた8ビット符号なし整数の型付き配列を表す |
| [`Uint16Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)| 16ビット符号なし整数の型付き配列を表す            |
| [`Uint32Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)| 32ビット符号なし整数の型付き配列を表す            |
| [`URIError`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/URIError)  | グローバルURI処理関数が誤った方法で使用されたときのエラーを表す |
| [`URL`](https://developer.mozilla.org/docs/Web/API/URL)                                            | URLを解析、構築、正規化、エンコードするために使用されるオブジェクトを表す |
| [`URLPattern`](https://developer.mozilla.org/docs/Web/API/URLPattern)                              | URLパターンを表す                                     |
| [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams)                    | キーと値のペアのコレクションを表す                    |
| [`WeakMap`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)    | キーが弱く参照されるキーと値のペアのコレクションを表す |
| [`WeakSet`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)    | オブジェクトが弱く参照されるオブジェクトのコレクションを表す |
| [`WebAssembly`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly)| WebAssembly へのアクセスを提供                      |

## Next.js 固有のポリフィル

- [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage)

## 環境変数

`process.env`を使用して、`next dev`と`next build`の両方で[環境変数](/docs/app/building-your-application/configuring/environment-variables)にアクセスできます。

## サポートされていない API

Edge Runtimeには、いくつかの制限があります:

- ネイティブのNode.js APIは**サポートされていません**。たとえば、ファイルシステムへの読み取りや書き込みはできません。
- `node_modules`は、ES Modulesを実装し、ネイティブのNode.js APIを使用しない限り使用できます。
- `require`を直接呼び出すことは**許可されていません**。代わりにES Modulesを使用してください。

次のJavaScript言語機能は無効になっており、**動作しません**:

| API                                                                                                           | 説明                                                 |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`eval`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/eval)                    | 文字列として表されたJavaScriptコードを評価            |
| [`new Function(evalString)`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)| 引数として提供されたコードで新しい関数を作成        |
| [`WebAssembly.compile`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compile)| バッファソースからWebAssembly.Moduleをコンパイル |
| [`WebAssembly.instantiate`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate)| バッファソースからWebAssembly.Moduleをコンパイルおよびインスタンス化 |

まれなケースでは、コードに動的コード評価ステートメントに到達できない（または使用されない）動的コード評価ステートメントが含まれている場合があり、特定のファイルに対してバンドラーツリーシェイキングを緩和できます:

```javascript filename="middleware.ts"
export const config = {
  unstable_allowDynamic: [
    // 単一のファイルを許可
    '/lib/utilities.js',
    // グロブを使用して、3rdパーティSDK内のすべての関数を許可
    '/node_modules/function-bind/**',
  ],
}
```

`unstable_allowDynamic`は[glob](https://github.com/micromatch/micromatch#matching-features)、またはglobの配列で、特定のファイルに対する動的コード評価を無視します。globはアプリケーションのルートフォルダからの相対パスです。

ただし、これらのステートメントがEdge上で実行され、評価が到達されると、ランタイムエラーが発生して失敗することに注意してください。
