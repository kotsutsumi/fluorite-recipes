# インテグレーション構成の製品一覧

特定のインテグレーション構成で利用可能なすべての製品を取得します。

## エンドポイント

```
GET /v1/integrations/configuration/{id}/products
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `id` | string | ✓ | インテグレーション構成ID（例: `icfg_cuwj0AdCdH3BwWT4LPijCC7t`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  protocols: Array<
    | "storage"
    | "experimentation"
    | "AI"
    | "authentication"
    | "observability"
    | "video"
    | "workflow"
    | "checks"
    | "logDrain"
    | "traceDrain"
    | "messaging"
    | "other"
  >;
  primaryProtocol: string;
  metadataSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

interface Response {
  products: Product[];
  integration: {
    id: string;
    slug: string;
    name: string;
  };
  configuration: {
    id: string;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | リソースが見つかりません |
| 500 | サーバーエラー |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.integrations.getConfigurationProducts({
  id: 'icfg_abc123',
  teamId: 'team_my_team'
});

console.log(`Integration: ${result.integration.name}`);
console.log(`Available Products: ${result.products.length}`);

result.products.forEach(product => {
  console.log(`\nProduct: ${product.name}`);
  console.log(`Primary Protocol: ${product.primaryProtocol}`);
  console.log(`Supported Protocols: ${product.protocols.join(', ')}`);

  if (product.metadataSchema.required) {
    console.log(`Required Metadata: ${product.metadataSchema.required.join(', ')}`);
  }
});
```

## プロトコルタイプ

製品がサポートする機能タイプ：

- **storage**: ストレージサービス
- **experimentation**: 実験・A/Bテスト
- **AI**: AI/機械学習
- **authentication**: 認証サービス
- **observability**: 監視・オブザーバビリティ
- **video**: ビデオ処理
- **workflow**: ワークフロー自動化
- **checks**: デプロイメントチェック
- **logDrain**: ログドレイン
- **traceDrain**: トレースドレイン
- **messaging**: メッセージング
- **other**: その他

## 関連リンク

- [Retrieve Configuration](/docs/services/vercel/docs/rest-api/reference/endpoints/integrations/retrieve-an-integration-configuration.md)
