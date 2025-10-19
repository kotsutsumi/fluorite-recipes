# Google Cloud Platform (GCP) への接続

セキュアなバックエンドアクセスのためのOIDCフェデレーションは、[すべてのプラン](/docs/plans)で利用可能です。

GCPがWorkload Identity Federationを通じてOIDCをサポートする仕組みについては、[GCPドキュメント](https://cloud.google.com/iam/docs/workload-identity-federation)を参照してください。

## GCPプロジェクトの設定

### 1. Workload Identity Federationの設定

1. [Google Cloud Console](https://console.cloud.google.com/)に移動
2. IAM & Admin → Workload Identity Federationに移動
3. 「プールを作成」をクリック

### 2. IDプールの作成

1. プール名を入力（例：`vercel-pool`）
2. プールIDを入力（例：`vercel-pool`）
3. 説明を追加（オプション）
4. 「続行」をクリック

### 3. IDプロバイダの追加

1. プロバイダタイプで「OpenID Connect (OIDC)」を選択
2. プロバイダ名を入力（例：`vercel-provider`）
3. プロバイダIDを入力（例：`vercel-provider`）
4. 発行者URLを入力：
   - **チーム**: `https://oidc.vercel.com/[TEAM_SLUG]`
   - **グローバル**: `https://oidc.vercel.com`
5. JWKファイル（JSON）は空のまま（自動取得）
6. 「対象」から「許可された対象」を選択
7. 「対象1」に `https://vercel.com/[TEAM_SLUG]` を入力
8. 「続行」をクリック

### 4. プロバイダ属性の設定

1. 属性マッピングを設定：
   - `google.subject` → `assertion.sub`
   - その他の属性は必要に応じて追加
2. 「保存」をクリック

### 5. サービスアカウントの作成と権限付与

1. IAM & Admin → サービスアカウントに移動
2. 「サービスアカウントを作成」をクリック
3. サービスアカウントの詳細を入力
4. 必要なロールを付与（例：Storage Object Viewer）
5. 「完了」をクリック

### 6. サービスアカウントへのアクセス許可

1. 作成したサービスアカウントを選択
2. 「権限」タブで「アクセスを許可」をクリック
3. プリンシパルに以下を入力：
   ```
   principalSet://iam.googleapis.com/projects/[PROJECT_NUMBER]/locations/global/workloadIdentityPools/[POOL_ID]/attribute.sub/owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production
   ```
4. ロール「Service Account Token Creator」を付与
5. 「保存」をクリック

## Vercelでの使用

### 環境変数の設定

プロジェクト設定で以下の環境変数を設定：

- `GCP_PROJECT_ID`: GCPプロジェクトID
- `GCP_SERVICE_ACCOUNT_EMAIL`: サービスアカウントのメールアドレス
- `GCP_WORKLOAD_IDENTITY_POOL`: Workload Identity Pool の完全な識別子
  ```
  projects/[PROJECT_NUMBER]/locations/global/workloadIdentityPools/[POOL_ID]/providers/[PROVIDER_ID]
  ```

### コード例

#### Google Cloud Storageへのアクセス

```typescript
import { Storage } from '@google-cloud/storage';
import { getVercelOidcToken } from '@vercel/functions/oidc';

export async function GET() {
  const token = await getVercelOidcToken();

  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    authClient: {
      getAccessToken: async () => {
        // OIDCトークンをGCPアクセストークンと交換
        // 実際の実装ではGCP SDKを使用
        return { token };
      },
    },
  });

  const [buckets] = await storage.getBuckets();

  return Response.json({
    buckets: buckets.map((bucket) => bucket.name),
  });
}
```

#### BigQueryへのアクセス

```typescript
import { BigQuery } from '@google-cloud/bigquery';

export async function GET() {
  const bigquery = new BigQuery({
    projectId: process.env.GCP_PROJECT_ID,
  });

  const query = 'SELECT * FROM `project.dataset.table` LIMIT 10';
  const [rows] = await bigquery.query(query);

  return Response.json({ rows });
}
```

## 条件の詳細設定

### 環境ベースのアクセス制御

本番環境のみアクセスを許可：

```
attribute.sub/owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production
```

### すべての環境を許可

```
attribute.sub/owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:*
```

ワイルドカードは、GCPのWorkload Identity Federationではサポートされていないため、環境ごとに個別の設定が必要です。

## トラブルシューティング

### 認証エラー

1. Workload Identity Poolが正しく設定されているか確認
2. プロバイダの発行者URLが正しいか確認
3. サブジェクトクレームが一致しているか確認

### アクセス拒否エラー

1. サービスアカウントに必要なロールが付与されているか確認
2. サービスアカウントへのアクセス許可が正しく設定されているか確認
3. プロジェクト番号とプールIDが正確か確認

### トークン交換の失敗

1. OIDCトークンが有効か確認
2. Workload Identity Poolが有効か確認
3. ネットワーク接続を確認

## ベストプラクティス

1. **サービスアカウントごとに異なる権限**: 用途に応じて異なるサービスアカウントを使用
2. **最小権限**: 必要最小限のIAMロールのみを付与
3. **環境の分離**: 本番環境とプレビュー環境で異なるプールまたはプロバイダを使用
4. **監視**: Cloud Audit Logsでトークンの使用を監視

詳細については、[OIDC ドキュメント](/docs/oidc)および[GCP Workload Identity Federation ドキュメント](https://cloud.google.com/iam/docs/workload-identity-federation)を参照してください。
