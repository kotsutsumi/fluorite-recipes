# Vercel CMSインテグレーション

Vercelコンテンツ管理システム（CMS）インテグレーションにより、[Contentful](/docs/integrations/contentful)、[Sanity](/integrations/sanity)、[Sitecore XM Cloud](/docs/integrations/sitecore)などのCMSプラットフォームにプロジェクトを接続できます。これらのインテグレーションは、CMSの機能を最小限の手間で組み込むための直接的な方法を提供します。

CMSをVercelと統合するには、以下の方法を使用できます：

* [環境変数のインポート](#環境変数のインポート)：CMSから環境変数を迅速にセットアップ
* [Vercelツールバーの編集モード](#vercelツールバーの編集モード)：Vercelデプロイメント内のコンテンツを可視化し、CMSで直接編集
    * [コンテンツリンク](/docs/edit-mode#content-link)：Vercelデプロイメント内のCMSコンテンツモデルを可視化し、直接編集
* [CMSからの変更をデプロイ](#cmsからの変更をデプロイ)：CMSからVercelサイトにコンテンツを接続およびデプロイ

## 環境変数のインポート

最も一般的なCMSのセットアップ方法は、[インテグレーションマーケットプレイス](https://vercel.com/integrations#cms)を通じてインテグレーションをインストールすることです。

### 1. Vercel CLIのインストール

CMSから環境変数を取得するには、[Vercel CLI](/docs/cli)をインストールします：

```bash
pnpm i -g vercel@latest
```

```bash
yarn global add vercel@latest
```

```bash
npm i -g vercel@latest
```

```bash
bun add -g vercel@latest
```

### 2. CMSインテグレーションのインストール

1. [インテグレーションマーケットプレイス](https://vercel.com/integrations#cms)にアクセス
2. 使用したいCMSインテグレーションを選択
3. 「インストール」ボタンをクリック
4. インストール手順に従います

### 3. 環境変数の取得

インテグレーションをインストールした後、プロジェクトディレクトリで以下のコマンドを実行して環境変数を取得します：

```bash
vercel env pull
```

このコマンドは、CMSから必要な環境変数をすべて取得し、ローカルの `.env` ファイルに保存します。

## Vercelツールバーの編集モード

[Vercelツールバー](/docs/workflow-collaboration/vercel-toolbar)の編集モードを使用すると、Vercelデプロイメント内で直接CMSコンテンツを可視化し、編集できます。

### 編集モードの有効化

1. **Vercelツールバーのインストール**:

```typescript
// app/layout.tsx または pages/_app.tsx
import { VercelToolbar } from '@vercel/toolbar/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <VercelToolbar />
      </body>
    </html>
  );
}
```

2. **編集モードの設定**:

```typescript
// lib/cms.ts
export function enableEditMode() {
  if (process.env.VERCEL_ENV === 'preview') {
    return {
      editMode: true,
      // CMS固有の設定
    };
  }
  return { editMode: false };
}
```

3. **コンテンツリンクの追加**:

```typescript
// components/BlogPost.tsx
import { ContentLink } from '@vercel/toolbar/next';

export function BlogPost({ post }) {
  return (
    <ContentLink
      href={`https://cms.example.com/posts/${post.id}`}
      label="Edit in CMS"
    >
      <article>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </ContentLink>
  );
}
```

### サポートされているCMS

以下のCMSは編集モードとコンテンツリンクをサポートしています：

- [Contentful](/docs/integrations/cms/contentful)
- [Sanity](/docs/integrations/cms/sanity)
- [DatoCMS](/docs/integrations/cms/datocms)
- [Makeswift](/docs/integrations/cms/makeswift)

## CMSからの変更をデプロイ

CMSでコンテンツが更新されたときに、自動的にVercelサイトを再デプロイできます。

### 1. Deploy Hookの作成

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Git」タブに移動
3. 「Deploy Hooks」セクションまでスクロール
4. 「Create Hook」をクリック
5. フック名とブランチを入力
6. 生成されたURLをコピー

### 2. CMSでWebhookを設定

生成されたDeploy Hook URLをCMSのWebhook設定に追加します。CMSによって手順は異なります：

**Contentful**:
1. Settings → Webhooks
2. Add webhook
3. URLフィールドにDeploy Hook URLを貼り付け
4. トリガーとなるイベントを選択（例：Entry published）

**Sanity**:
```typescript
// sanity.config.ts
export default defineConfig({
  // ... 他の設定
  document: {
    productionUrl: async (prev, context) => {
      // Deploy Hookをトリガー
      await fetch('YOUR_DEPLOY_HOOK_URL', { method: 'POST' });
      return prev;
    }
  }
});
```

**DatoCMS**:
1. Settings → Webhooks
2. Create webhook
3. URLフィールドにDeploy Hook URLを貼り付け
4. トリガーとなるイベントを選択

### 3. インクリメンタル静的再生成（ISR）の使用

すべてのページを再デプロイする代わりに、Next.jsの[ISR](/docs/frameworks/nextjs/incremental-static-regeneration)を使用して特定のページを再検証できます：

```typescript
// pages/blog/[slug].tsx
export async function getStaticProps({ params }) {
  const post = await cms.getPost(params.slug);

  return {
    props: { post },
    revalidate: 60, // 60秒ごとに再検証
  };
}
```

または、オンデマンド再検証を使用：

```typescript
// pages/api/revalidate.ts
export default async function handler(req, res) {
  // CMSからのWebhookを検証
  if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { slug } = req.body;
    await res.revalidate(`/blog/${slug}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

## 利用可能なCMSインテグレーション

Vercelは以下のCMSとのインテグレーションを提供しています：

- [Contentful](/docs/integrations/cms/contentful) - ヘッドレスCMSプラットフォーム
- [Sanity](/docs/integrations/cms/sanity) - リアルタイムコラボレーション対応CMS
- [DatoCMS](/docs/integrations/cms/datocms) - GraphQLベースのヘッドレスCMS
- [Sitecore XM Cloud](/docs/integrations/cms/sitecore) - エンタープライズCMSソリューション
- [Makeswift](/docs/integrations/cms/makeswift) - ノーコードウェブサイトビルダー
- [Formspree](/docs/integrations/cms/formspree) - フォーム管理サービス

## ベストプラクティス

### パフォーマンス

- **ISRの使用**: すべてのページを再ビルドする代わりにISRを使用
- **キャッシング**: 適切なキャッシュ戦略を実装
- **画像最適化**: Next.js Image コンポーネントを使用

### セキュリティ

- **環境変数の保護**: APIキーとトークンを環境変数として安全に保存
- **Webhook検証**: Webhookリクエストを検証して不正アクセスを防ぐ
- **CORS設定**: 適切なCORS設定を実装

### 開発ワークフロー

- **プレビューモード**: 下書きコンテンツのプレビュー機能を実装
- **ローカル開発**: ローカルでCMSコンテンツをテスト
- **ステージング環境**: 本番前にステージング環境でテスト

## トラブルシューティング

### 環境変数が取得できない

1. インテグレーションが正しくインストールされているか確認
2. Vercel CLIが最新バージョンか確認: `vercel --version`
3. 正しいプロジェクトにリンクされているか確認: `vercel link`

### Webhookが動作しない

1. Deploy Hook URLが正しいか確認
2. CMSのWebhook設定を確認
3. Vercelのデプロイメントログでエラーを確認

### 編集モードが表示されない

1. Vercelツールバーが正しくインストールされているか確認
2. プレビューデプロイメントで表示しているか確認
3. ブラウザのコンソールでエラーを確認

## 関連リソース

- [Vercel インテグレーションマーケットプレイス](https://vercel.com/integrations#cms)
- [Vercel ツールバー](/docs/workflow-collaboration/vercel-toolbar)
- [編集モード](/docs/edit-mode)
- [Deploy Hooks](/docs/deployments/deploy-hooks)
- [ISR](/docs/frameworks/nextjs/incremental-static-regeneration)
