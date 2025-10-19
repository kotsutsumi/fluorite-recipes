# Wasmモジュールの使用

## 概要

Edge Functionsは[WebAssembly (Wasm)](https://developer.mozilla.org/en-US/docs/WebAssembly)モジュールの実行をサポートしています。WebAssemblyは以下の用途に役立ちます:

- JavaScriptの機能を超えたパフォーマンスクリティカルなコードの最適化
- 他の言語（C、C++、Rust）の既存ライブラリをJavaScriptに移植
- JavaScriptでは利用できない低レベルのシステム操作へのアクセス

たとえば、[magick-wasm](/docs/guides/functions/examples/image-manipulation)のようなライブラリは、複雑な画像処理のために既存のCライブラリをWebAssemblyに移植しています。

## Wasmモジュールの作成

さまざまな言語とSDKを使用してWasmモジュールを記述できます。このチュートリアルでは、2つの数値を加算する簡単なWasmモジュールをRustで作成する方法を示します。

### 1. 新しいEdge Functionを作成

```bash
supabase functions new wasm-add
```

### 2. 新しいCargoプロジェクトを作成

```bash
cd supabase/functions/wasm-add
cargo new --lib add-wasm
```

### 3. Wasmモジュールコードを追加

`add-wasm/src/lib.rs`:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}
```

### 4. Cargo.tomlを更新

```toml
[package]
name = "add-wasm"
version = "0.1.0"
description = "A simple wasm module that adds two numbers"
license = "MIT/Apache-2.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

### 5. Wasmモジュールをビルド

```bash
wasm-pack build --target deno
```

これにより、`add-wasm/pkg/`ディレクトリにDenoで使用可能なWasmモジュールが生成されます。

## Edge FunctionからWasmモジュールを呼び出す

Edge Functionを更新してadd関数を呼び出します:

```typescript
import { add } from "./add-wasm/pkg/add_wasm.js"

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const a = parseInt(url.searchParams.get('a') || '0')
  const b = parseInt(url.searchParams.get('b') || '0')

  const result = add(a, b)

  return new Response(
    JSON.stringify({ result }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

## ローカルでテスト

```bash
supabase functions serve wasm-add
```

別のターミナルで:

```bash
curl "http://localhost:54321/functions/v1/wasm-add?a=5&b=3"
# {"result":8}
```

## デプロイ

```bash
supabase functions deploy wasm-add
```

## 実用例

### 画像処理

```typescript
import { ImageMagick, initialize } from 'npm:@imagemagick/magick-wasm'

Deno.serve(async (req) => {
  // ImageMagickを初期化
  await initialize()

  const imageData = await req.arrayBuffer()

  // Wasmモジュールを使用して画像を処理
  const result = ImageMagick.read(new Uint8Array(imageData), (img) => {
    img.resize(300, 300)
    return img.write((data) => data)
  })

  return new Response(result, {
    headers: { 'Content-Type': 'image/jpeg' }
  })
})
```

### 暗号化操作

```rust
// Rustで暗号化関数を作成
use wasm_bindgen::prelude::*;
use sha2::{Sha256, Digest};

#[wasm_bindgen]
pub fn hash_data(data: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    format!("{:x}", hasher.finalize())
}
```

```typescript
// Edge Functionから使用
import { hash_data } from "./crypto-wasm/pkg/crypto_wasm.js"

Deno.serve(async (req) => {
  const { data } = await req.json()
  const hash = hash_data(data)

  return new Response(JSON.stringify({ hash }), {
    headers: { "Content-Type": "application/json" }
  })
})
```

## パフォーマンスの考慮事項

1. **初期化コスト**: Wasmモジュールの初期化は1回だけ行い、関数の外で行います
2. **メモリ使用量**: Wasmモジュールはメモリを消費するため、256MBの制限に注意
3. **データ変換**: JavaScriptとWasm間のデータ変換にはオーバーヘッドがあります

## 最適化のヒント

```typescript
// ✅ 良い: モジュールを一度初期化
import { initialize, ImageMagick } from 'npm:@imagemagick/magick-wasm'

// 関数の外で初期化
await initialize()

Deno.serve(async (req) => {
  // 初期化済みのモジュールを使用
  const result = ImageMagick.read(...)
  return new Response(result)
})
```

```typescript
// ❌ 悪い: 毎回初期化
Deno.serve(async (req) => {
  await initialize() // リクエストごとに初期化 - 遅い！
  const result = ImageMagick.read(...)
  return new Response(result)
})
```

## トラブルシューティング

### Wasmモジュールが見つからない

```bash
# pkgディレクトリが存在することを確認
ls add-wasm/pkg/

# 必要に応じて再ビルド
wasm-pack build --target deno
```

### メモリエラー

大きなWasmモジュールまたは大量のデータを処理する場合、256MBのメモリ制限に達する可能性があります。データをチャンクで処理するか、モジュールサイズを削減することを検討してください。

## その他のリソース

- [WebAssembly公式サイト](https://webassembly.org/)
- [wasm-pack ドキュメント](https://rustwasm.github.io/wasm-pack/)
- [wasm-bindgen ガイド](https://rustwasm.github.io/wasm-bindgen/)
