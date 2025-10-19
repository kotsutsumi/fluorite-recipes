# Express on Vercel

## 概要

Express.jsは、Node.jsのための高速で柔軟なウェブフレームワークであり、Vercelに追加設定なしでデプロイできます。

## 主な特徴

- **Fluid compute**: 自動スケーリングと最適化された同時実行
- **プレビューデプロイメント**: プルリクエストごとのプレビュー環境
- **インスタントロールバック**: 以前のデプロイメントへの迅速な復帰
- **Vercelファイアウォール**: 多層セキュリティシステム
- **セキュアコンピュート**: 安全な実行環境

## はじめ方

### Vercel CLIでプロジェクトを初期化

```bash
vc init express
```

このコマンドは、Expressアプリケーションの基本的なテンプレートを作成します。

## アプリケーションのエクスポート

Expressアプリケーションは、以下のいずれかのファイルでエクスポートできます：

- `app.{js,ts}`
- `index.{js,ts}`
- `server.{js,ts}`
- `src/`ディレクトリ内の同様のファイル

### デフォルトエクスポート例 (TypeScript)

```typescript
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});

export default app;
```

### ポートリスナーを使用する方法

```typescript
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

この場合、Vercelは自動的に`app.listen()`呼び出しを検出し、適切にデプロイします。

## ローカル開発

```bash
vercel dev
```

このコマンドで、Vercel環境をローカルで再現し、開発中にアプリケーションをテストできます。

## デプロイ

```bash
vc deploy
```

## 静的アセットの提供

### 静的ファイルの配置

- `public/**`ディレクトリに静的ファイルを配置
- VercelのCDNで自動的に提供されます
- `express.static()`ミドルウェアは無視されます

**注意**: Vercelでは、`public`ディレクトリ内のファイルは自動的にCDNで提供されるため、Expressの静的ファイル提供機能は使用されません。

## Vercelファンクション

Expressアプリケーション全体が単一のVercelファンクションとして動作します：

- トラフィックに応じて自動的にスケールアップ/ダウン
- デフォルトでFluid Computeを使用

## 制限事項

### アプリケーションサイズ

- アプリケーションサイズは250MB以内である必要があります

### エラーハンドリング

Expressのエラーハンドリングミドルウェアは通常通り動作しますが、サーバーレス環境特有の考慮事項に注意が必要です。

## 追加リソース

- [Express公式ドキュメント](https://expressjs.com/)
- [Vercel Functions](/docs/functions)
- [バックエンドテンプレート](https://vercel.com/templates?type=backend)
- [Fluid Compute](/docs/fluid-compute)
