# WebAssembly(Wasm)の使用

WebAssembly(Wasm)は、C、Go、Rustなどの言語からコンパイルできる、ポータブルで低レベルなアセンブリ風の言語です。ほとんどのJavaScript仮想マシンでJavaScriptと並行して効率的に実行されるように設計されています。

## サポートされている環境

Vercelでは、以下の環境でWasmを使用できます:

- Vercel Functions
- Routing Middleware

サポートされているランタイム:

- `edge`
- `nodejs`

## Wasmファイルの使用

### 1. Wasmファイルの準備

- プロジェクトをコンパイルして`.wasm`バイナリファイルを作成
- 例: 数値に1を加算するRust関数
- コンパイルされたファイルをプロジェクトのルートにコピー
- 必要に応じてTypeScriptの型定義を追加

### 2. APIルートの作成

`nodejs`ランタイムの例:

```typescript
import path from 'node:path';
import fs from 'node:fs';
import type * as addWasmModule from '../../../add.wasm';

const wasmBuffer = fs.readFileSync(path.resolve(process.cwd(), './add.wasm'));
const wasmPromise = WebAssembly.instantiate(wasmBuffer);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const num = Number(url.searchParams.get('number') || 10);
  const { add_one: addOne } = (await wasmPromise).instance
    .exports as typeof addWasmModule;

  return new Response(`got: ${addOne(num)}`);
}
```

### 3. Wasmエンドポイントの呼び出し

- `vercel dev`でローカルに実行
- アクセス: `http://localhost:3000/api/wasm?number=12`
- 期待される出力: `got: 13`

## 重要な注意事項

- プリコンパイルされたWebAssemblyは`?module`サフィックスでインポート可能
- `WebAssembly.instantiate`はEdge Runtimeでサポート
- import文を介してWasmソースコードを提供する必要があります
- ランタイムでの動的コンパイルにバッファまたはバイト配列を使用できません
