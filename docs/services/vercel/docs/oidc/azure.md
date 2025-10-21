# Microsoft Azureに接続する

セキュアなバックエンドアクセスのためのOIDC連携は、[すべてのプラン](/docs/plans)で利用可能です。

Azure WorkloadアイデンティティフェデレーションによるOIDCのサポートについては、[Azureドキュメント](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation)を参照してください。

## Azure アカウントの設定

### 1. マネージドIDの作成

1. Azure Portal > すべてのサービスに移動
2. 「マネージドID」を選択
3. 「作成」をクリック
4. 以下を設定：
   - **サブスクリプション**: Azureサブスクリプションを選択
   - **リソースグループ**: 既存のグループまたは新規作成
   - **リージョン**: 適切なリージョンを選択
   - **名前**: マネージドIDの名前（例：`vercel-oidc-identity`）
5. 「レビュー + 作成」をクリック

### 2. フェデレーション資格情報の作成

1. 作成したマネージドIDに移動
2. 「フェデレーション資格情報」タブを選択
3. 「資格情報を追加」をクリック
4. 「その他」シナリオを選択
5. 以下を入力：
   - **発行者URL**:
     - チーム: `https://oidc.vercel.com/[TEAM_SLUG]`
     - グローバル: `https://oidc.vercel.com`
   - **サブジェクト識別子**:
     `owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:[production | preview | development]`
   - **名前**: 参照用の名前（例：`vercel-prod`）
   - **オーディエンス**: `https://vercel.com/[TEAM_SLUG]`
6. 「追加」をクリック

**重要**: Azureは部分的な要求条件を許可しないため、サブジェクトとオーディエンスフィールドを正確に指定する必要があります。

### 3. Azure サービスへのアクセス許可

使用するAzureサービスにマネージドIDへのアクセス許可を付与：

#### Blob Storageの例

1. Storageアカウントに移動
2. 「アクセス制御 (IAM)」を選択
3. 「ロールの割り当ての追加」をクリック
4. 「Storage Blob Data Contributor」ロールを選択
5. マネージドIDを割り当て

#### Cosmos DBの例

1. Cosmos DBアカウントに移動
2. 「アクセス制御 (IAM)」を選択
3. 「Cosmos DB Built-in Data Contributor」ロールを割り当て

## Vercelでの使用

### 環境変数の設定

プロジェクト設定で以下の環境変数を設定：

- `AZURE_CLIENT_ID`: マネージドIDのクライアントID
- `AZURE_TENANT_ID`: AzureテナントID
- `AZURE_SUBSCRIPTION_ID`: サブスクリプションID（必要に応じて）

### コード例

#### Azure Blob Storageへのアクセス

```typescript
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { getVercelOidcToken } from '@vercel/functions/oidc';

export async function GET() {
  const token = await getVercelOidcToken();

  const credential = new DefaultAzureCredential({
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
  });

  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
    credential
  );

  const containerClient = blobServiceClient.getContainerClient('my-container');
  const blobs = [];

  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push(blob.name);
  }

  return Response.json({ blobs });
}
```

#### Azure Cosmos DBへのアクセス

```typescript
import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

export async function GET() {
  const credential = new DefaultAzureCredential({
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
  });

  const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT!,
    aadCredentials: credential,
  });

  const database = client.database('my-database');
  const container = database.container('my-container');

  const { resources } = await container.items.readAll().fetchAll();

  return Response.json({ items: resources });
}
```

## 環境ごとの設定

異なる環境で異なるフェデレーション資格情報を設定：

### 本番環境

```
Subject: owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:production
```

### プレビュー環境

```
Subject: owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:preview
```

### 開発環境

```
Subject: owner:[TEAM_SLUG]:project:[PROJECT_NAME]:environment:development
```

## トラブルシューティング

### 認証エラー

1. マネージドIDのクライアントIDが正しいか確認
2. フェデレーション資格情報のサブジェクトが正確か確認
3. オーディエンスが一致しているか確認

### アクセス拒否エラー

1. マネージドIDに必要なロールが割り当てられているか確認
2. リソースのアクセス制御 (IAM) 設定を確認
3. ロールの伝播に数分かかる場合があることに注意

## ベストプラクティス

1. **環境ごとに異なるマネージドID**: 本番環境とプレビュー環境で異なるマネージドIDを使用
2. **最小権限**: 必要最小限のロールのみを付与
3. **リソースグループ**: 関連リソースをリソースグループで整理
4. **監視**: Azure Monitorでマネージドidの使用を監視

詳細については、[OIDC ドキュメント](/docs/oidc)および[Azure Workload Identity ドキュメント](https://learn.microsoft.com/en-us/entra/workload-id/)を参照してください。
