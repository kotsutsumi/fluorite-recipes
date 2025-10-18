# 依存関係の管理 | Supabase Docs

## 依存関係のインポート

Supabase Edge Functionsは、以下の方法で依存関係をインポートできます：

- npmからのJavaScriptモジュール
- 組み込みのNode API
- JSRまたはdeno.land/xに公開されたモジュール

### `deno.json`の使用（推奨）

各関数には、依存関係を管理し、Deno固有の設定を構成するための独自の`deno.json`ファイルを用意する必要があります。これにより、関数間の適切な分離が保証され、デプロイメントに推奨されるアプローチとなります。ある関数の依存関係を更新しても、異なるバージョンを必要とする別の関数に影響を与えることはありません。

```json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2",
    "lodash": "https://cdn.skypack.dev/lodash"
  }
}
```

このファイルは、関数のディレクトリに直接追加できます：

```
└── supabase
    ├── functions
    │   ├── function-one
    │   │   ├── index.ts
    │   │   └── deno.json    # 関数固有のDeno設定
    │   └── function-two
    │       ├── index.ts
    │       └── deno.json    # 関数固有のDeno設定
    └── config.toml
```

> 注意：`/supabase/functions`ディレクトリでグローバルな`deno.json`を使用することは可能ですが、デプロイメントには推奨されません。各関数は、適切な分離と依存関係管理のために独自の`deno.json`を持つべきです。

---

## npm パッケージのインポート

npmパッケージは、`npm:`スキームを使用してインポートできます：

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'
```

または、`deno.json`で定義：

```json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2"
  }
}
```

そして、関数内で使用：

```typescript
import { createClient } from 'supabase'
```

---

## JSR パッケージのインポート

JSR (JavaScript Registry) からパッケージをインポートできます：

```typescript
import { say } from 'jsr:@luca/greet'
```

または、`deno.json`で：

```json
{
  "imports": {
    "greet": "jsr:@luca/greet"
  }
}
```

---

## deno.land/x からのインポート

Denoの公式モジュールレジストリからインポート：

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
```

または、`deno.json`で：

```json
{
  "imports": {
    "http": "https://deno.land/std@0.177.0/http/server.ts"
  }
}
```

---

## Node.js 組み込みモジュール

DenoはNode.js組み込みモジュールをサポートしています：

```typescript
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
```

---

## バージョンの固定

本番環境では、常にバージョンを固定してください：

```json
{
  "imports": {
    "supabase": "npm:@supabase/supabase-js@2.39.0",
    "oak": "https://deno.land/x/oak@v12.6.1/mod.ts"
  }
}
```

これにより、デプロイメント間で一貫した動作が保証されます。

---

## 共通の依存関係

### Supabase クライアント

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)
```

### HTTP リクエスト（fetch は組み込み）

```typescript
const response = await fetch('https://api.example.com/data')
const data = await response.json()
```

### データベース接続

```typescript
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

const client = new Client(Deno.env.get('SUPABASE_DB_URL'))
await client.connect()
```

---

## ローカル開発での依存関係

ローカルで関数を提供すると、Denoは自動的に依存関係をキャッシュします：

```bash
supabase functions serve function-name
```

キャッシュをクリアする必要がある場合：

```bash
deno cache --reload supabase/functions/function-name/index.ts
```

---

## プライベート npm パッケージ

プライベートnpmパッケージを使用する場合、`.npmrc`ファイルを設定します：

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

そして、`NPM_TOKEN`をシークレットとして設定：

```bash
supabase secrets set NPM_TOKEN=your-token-here
```

---

## ベストプラクティス

1. **バージョンを常に固定**: 予期しない破壊的変更を避ける
2. **関数ごとに`deno.json`を使用**: 適切な分離を維持
3. **依存関係を最小限に**: バンドルサイズを小さく、起動時間を短く保つ
4. **信頼できるソースのみを使用**: 公式のレジストリとよく知られたパッケージを優先
5. **定期的に更新**: セキュリティパッチと新機能を入手

---

## トラブルシューティング

### モジュールが見つからない

エラー：`error: Module not found`

解決策：
1. インポートパスとバージョンを確認
2. `deno.json`が正しく設定されているか確認
3. キャッシュをクリアして再試行：`deno cache --reload`

### 型エラー

TypeScriptの型エラーが発生する場合：

1. パッケージに型定義が含まれているか確認
2. `@types/`パッケージをインストール（必要に応じて）
3. エディターのDeno拡張機能が有効になっているか確認

---

## 次のステップ

- [関数の設定](/docs/guides/functions/function-configuration)をカスタマイズ
- [シークレット](/docs/guides/functions/secrets)の管理方法を学習
- [アーキテクチャ](/docs/guides/functions/architecture)を理解
