# Vercel REST APIを使用したEdge Configの管理

## 概要

このドキュメントは、Vercel REST APIを使用してEdge Configを作成、更新、読み取る方法について説明しています。

## Edge Configの作成

### エンドポイント

```
POST https://api.vercel.com/v1/edge-config
```

### リクエストヘッダー

```
Authorization: Bearer <token>
Content-Type: application/json
```

### リクエストボディ

```json
{
  "slug": "my-edge-config"
}
```

### スラッグの制限

- 英数字、アンダースコア、ハイフンのみ使用可能
- 32文字以内

### cURLの例

```bash
curl -X POST \
  "https://api.vercel.com/v1/edge-config" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-edge-config"
  }'
```

## Edge Config項目の更新

### エンドポイント

```
PATCH https://api.vercel.com/v1/edge-config/<edgeConfigId>/items
```

### サポートされる操作

- **create**: 新しいキーを作成（既存のキーがある場合はエラー）
- **update**: 既存のキーを更新（キーが存在しない場合はエラー）
- **upsert**: キーを作成または更新
- **delete**: キーを削除

### リクエストボディの例

#### 単一の更新

```json
{
  "items": [
    {
      "operation": "upsert",
      "key": "greeting",
      "value": "hello world"
    }
  ]
}
```

#### 複数の更新

```json
{
  "items": [
    {
      "operation": "create",
      "key": "newKey",
      "value": "newValue"
    },
    {
      "operation": "update",
      "key": "existingKey",
      "value": "updatedValue"
    },
    {
      "operation": "delete",
      "key": "oldKey"
    }
  ]
}
```

### cURLの例

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

## データの読み取り

### メタデータの読み取り

#### エンドポイント

```
GET https://api.vercel.com/v1/edge-config/<edgeConfigId>
```

#### cURLの例

```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.vercel.com/v1/edge-config/<edgeConfigId>"
```

### 全項目の読み取り

#### エンドポイント

```
GET https://edge-config.vercel.com/<edgeConfigId>/items?token=<token>
```

#### cURLの例

```bash
curl "https://edge-config.vercel.com/<edgeConfigId>/items?token=<token>"
```

### 特定項目の読み取り

#### エンドポイント

```
GET https://edge-config.vercel.com/<edgeConfigId>/item/<itemKey>?token=<token>
```

#### cURLの例

```bash
curl "https://edge-config.vercel.com/<edgeConfigId>/item/greeting?token=<token>"
```

## Edge Configの削除

### エンドポイント

```
DELETE https://api.vercel.com/v1/edge-config/<edgeConfigId>
```

### cURLの例

```bash
curl -X DELETE \
  "https://api.vercel.com/v1/edge-config/<edgeConfigId>" \
  -H "Authorization: Bearer <token>"
```

## チームスコープ

チームスコープの場合は、URLに`teamId`クエリパラメータを追加します：

```bash
curl -X POST \
  "https://api.vercel.com/v1/edge-config?teamId=<teamId>" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-edge-config"
  }'
```

## 重要な注意点

- 更新には最大数秒かかる場合がある
- 読み取りにはSDKの使用を推奨
- API レート制限に注意（`api.vercel.com`は1分間に20回）
- `edge-config.vercel.com`エンドポイントにはレート制限がない

## エラーハンドリング

### 一般的なエラー

- `400 Bad Request`: 無効なリクエストボディ
- `401 Unauthorized`: 無効なトークン
- `404 Not Found`: Edge Configが見つからない
- `409 Conflict`: キーが既に存在（create操作時）

### エラーレスポンスの例

```json
{
  "error": {
    "code": "bad_request",
    "message": "Invalid request body"
  }
}
```

## 次のステップ

- [Edge Config SDK](/docs/edge-config/edge-config-sdk)を使用してデータを読み取る
- [ダッシュボード](/docs/edge-config/edge-config-dashboard)でEdge Configを管理
- [制限](/docs/edge-config/edge-config-limits)を確認
