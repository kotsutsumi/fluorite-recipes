# Edge Configの使用

## 概要

Edge Configは、Vercelの CDN を通じて世界中からウルトラ低遅延で読み取り可能なグローバルデータストアです。

## データの読み取り

Edge Configからデータを読み取るには、[Edge Config クライアントSDK](/docs/edge-config/edge-config-sdk) の使用を推奨しています。

## Edge Configエンドポイント

2つの異なるREST APIが利用可能です：

### 1. api.vercel.com

- **用途**: Edge Configの管理用
- **レート制限**: 1分間に20回の読み取りに制限
- **特徴**: 常に最新バージョンを返す

### 2. edge-config.vercel.com

- **用途**: グローバル、低遅延、高ボリュームの読み取り用
- **レート制限**: なし
- **認証**: Edge Config専用の読み取りアクセストークンを使用

## エンドポイントのクエリルート

以下のルートが利用可能です：

- `/<edgeConfigId>/items` - すべてのアイテムを取得
- `/<edgeConfigId>/item/<itemKey>` - 特定のアイテムを取得
- `/<edgeConfigId>/digest` - Edge Configのバージョンを取得

## Edge Config IDの見つけ方

Edge Config IDは以下の方法で確認できます：

### Vercelダッシュボード

1. プロジェクトの Storage タブに移動
2. Edge Config を選択
3. IDをコピー

### Vercel REST API

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.vercel.com/v1/edge-config"
```

## 読み取りアクセストークン

読み取りアクセストークンは、プロジェクトにEdge Configを接続すると自動的に生成されます。

### 接続文字列の使用

接続文字列には、Edge Config IDとトークンの両方が含まれています。

#### 接続文字列のコピー方法

1. ストレージダッシュボードのトークンタブに移動
2. 3つのドットアイコンを選択
3. 「接続文字列をコピー」を選択

接続文字列の形式：

```
https://edge-config.vercel.com/<edgeConfigId>?token=<token>
```

## データの書き込み

Edge Configは、多くの読み取りと少ない書き込みに最適化されています。

### Vercel REST APIを使用

データの書き込みには、[Vercel REST API](/docs/edge-config/vercel-api)を使用します：

```bash
curl -X PATCH \
  "https://api.vercel.com/v1/edge-config/<edgeConfigId>/items" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "operation": "upsert",
        "key": "greeting",
        "value": "hello world"
      }
    ]
  }'
```

## Edge Config SDKを使用した読み取り

```typescript
import { get } from '@vercel/edge-config';

// 単一の値を取得
const greeting = await get('greeting');

// 複数の値を取得
import { getAll } from '@vercel/edge-config';
const allItems = await getAll();

// キーの存在確認
import { has } from '@vercel/edge-config';
const exists = await has('greeting');
```

## ベストプラクティス

- 頻繁にアクセスされ、めったに更新されないデータに使用する
- Edge Config SDKを使用してデータを読み取る
- 書き込みは最小限に抑える
- 適切なキャッシュ戦略を実装する

## 次のステップ

- [Edge Config SDK](/docs/edge-config/edge-config-sdk)の詳細
- [Vercel API](/docs/edge-config/vercel-api)でデータを書き込む方法
- [制限](/docs/edge-config/edge-config-limits)を確認
