# 認証

AI Gateway を使用するには、リクエストを認証する必要があります。利用可能な認証方法は2つあります：

1. **APIキー認証**: Vercelダッシュボードを通じてAPIキーを作成および管理
2. **OIDCトークン認証**: Vercelが自動生成するOIDCトークンを使用

## APIキー

APIキーは、AI Gatewayへのリクエストを安全に認証する方法を提供します。Vercelダッシュボードで複数のAPIキーを作成および管理できます。

### APIキーの作成

1. **AIゲートウェイタブに移動**
   - [Vercelダッシュボード](https://vercel.com/dashboard)から、AIゲートウェイタブをクリックしてAIゲートウェイ設定にアクセスします。

2. **APIキー管理にアクセス**
   - 左サイドバーのAPIキーをクリックして、APIキーを表示および管理します。

3. **新しいAPIキーを作成**
   - 「キーを作成」をクリックし、ダイアログから「キーを作成」を選択して新しいAPIキーを生成します。

4. **APIキーを保存**
   - APIキーを取得したら、プロジェクトのルートにある `.env.local`（または任意の環境ファイル）に保存します：

   ```env
   AI_GATEWAY_API_KEY=your_api_key_here
   ```

### APIキーの使用

モデルIDをプレーンな文字列として指定すると、AI SDKは自動的にVercel AI Gatewayプロバイダを使用してリクエストをルーティングします。AI Gatewayプロバイダは、デフォルトで `AI_GATEWAY_API_KEY` 環境変数を探します。

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Hello, world!',
});
```

OpenAI SDK を使用する場合は、API キーを明示的に指定する必要があります：

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});
```

### APIキーの管理

#### キーの一覧表示

Vercelダッシュボードの「APIキー」セクションで、すべてのAPIキーを表示できます。各キーには、以下の情報が表示されます：

- キー名
- 作成日
- 最終使用日
- 使用状況

#### キーの削除

不要になったAPIキーは、Vercelダッシュボードから削除できます。削除されたキーは、すぐに無効になります。

#### キーのローテーション

セキュリティのベストプラクティスとして、APIキーを定期的にローテーションすることをお勧めします：

1. 新しいAPIキーを作成
2. アプリケーションの環境変数を新しいキーで更新
3. 古いキーを削除

## OIDCトークン認証

Vercelデプロイメント内から AI Gateway を使用する場合、Vercelが自動的に生成する OIDC トークンを使用して認証できます。

### OIDCトークンの使用

Vercelは、デプロイメント実行時に `VERCEL_OIDC_TOKEN` 環境変数を自動的に設定します。この環境変数を使用して、AI Gatewayへのリクエストを認証できます。

```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Hello, world!',
  headers: {
    Authorization: `Bearer ${process.env.VERCEL_OIDC_TOKEN}`,
  },
});
```

### OIDCトークンの利点

- **自動管理**: Vercelが自動的にトークンを生成および管理
- **セキュア**: トークンは各デプロイメントに固有で、短命
- **簡単**: 追加の設定やキー管理が不要

### 制限事項

- OIDCトークンは、Vercelデプロイメント内でのみ使用可能
- ローカル開発環境では、APIキーを使用する必要があります

## ベストプラクティス

### APIキーのセキュリティ

- **環境変数を使用**: APIキーを環境変数に保存し、コードに直接埋め込まない
- **gitignoreに追加**: `.env.local` ファイルを `.gitignore` に追加して、バージョン管理にコミットしない
- **最小権限の原則**: 必要な権限のみを持つAPIキーを使用
- **定期的なローテーション**: セキュリティを向上させるために、APIキーを定期的にローテーション

### 開発と本番環境の分離

- 開発環境と本番環境で異なるAPIキーを使用
- Vercelの環境変数機能を使用して、環境ごとに異なるキーを管理

### 監視とアラート

- APIキーの使用状況を定期的に監視
- 異常なアクティビティや予期しない使用パターンに対してアラートを設定

## トラブルシューティング

### 認証エラー

**エラー**: `Unauthorized` または `401` レスポンス

**解決策**:
- APIキーが正しく設定されているか確認
- 環境変数名が正しいか確認（`AI_GATEWAY_API_KEY`）
- APIキーが有効で、削除されていないか確認

### OIDCトークンエラー

**エラー**: `VERCEL_OIDC_TOKEN` が見つからない

**解決策**:
- Vercelデプロイメント内で実行しているか確認
- ローカル開発の場合は、APIキーを使用

## 関連リンク

- [はじめに](/docs/ai-gateway/getting-started)
- [OpenAI互換API](/docs/ai-gateway/openai-compat)
- [Bring Your Own Key (BYOK)](/docs/ai-gateway/byok)
