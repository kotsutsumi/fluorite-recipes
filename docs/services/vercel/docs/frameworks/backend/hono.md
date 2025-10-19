# Hono on Vercel

## 概要

Honoは、Web標準に基づいた高速で軽量なウェブアプリケーションフレームワークです。Vercelでは、追加設定なしにデプロイできます。

## はじめに

### Vercelテンプレートを使用

[Vercelにデプロイ](https://vercel.com/templates/backend/hono-starter)ボタンで簡単にスタートできます。

- Vercelは各プルリクエストに対してプレビューURLを自動生成
- テンプレートから直接デプロイメントを開始可能

### Vercel CLIでの初期化

```bash
vc init hono
```

このコマンドは、Honoアプリケーションの基本的なテンプレートを作成します。

## アプリケーションのエクスポート

以下のいずれかのファイルにHonoアプリをエクスポート：

- `app.{js,ts}`
- `index.{js,ts}`
- `server.{js,ts}`
- `src/`配下の同様のファイル

### サンプルコード

```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono on Vercel!' });
});

app.get('/api/users', (c) => {
  return c.json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  });
});

export default app;
```

## ローカル開発

```bash
vc dev
```

このコマンドで、Vercel環境をローカルで再現し、開発中にアプリケーションをテストできます。

## ミドルウェア

### Honoミドルウェア

Honoのミドルウェアは、リクエストハンドラの前に実行されます。以下の用途で使用できます：

- ロギング
- CORS設定
- 認証
- エラーハンドリング

```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { basicAuth } from 'hono/basic-auth';

const app = new Hono();

// グローバルミドルウェア
app.use(logger());

// 特定のパスに対するミドルウェア
app.use('/posts/*', cors());
app.post('/posts/*', basicAuth({
  username: 'admin',
  password: 'secret'
}));

app.get('/posts', (c) => {
  return c.json({ posts: [] });
});

export default app;
```

### Vercelルーティングミドルウェア

Vercelのミドルウェア機能を使用すると、リクエスト処理前にコードを実行できます：

- リダイレクト
- ヘッダー管理
- 認証チェック
- A/Bテスト

詳細は[Vercel Middleware](/docs/functions/middleware)を参照してください。

## 静的アセット

`public/`ディレクトリ内のファイルは、VercelのCDNで自動的に提供されます：

```
project/
├── public/
│   ├── images/
│   │   └── logo.png
│   └── styles/
│       └── main.css
└── src/
    └── index.ts
```

これらのファイルは、`/images/logo.png`や`/styles/main.css`のようなパスでアクセスできます。

## Vercelファンクション

Honoアプリケーションは、単一のVercelファンクションとして動作します：

- トラフィックに応じて自動的にスケールアップ/ダウン
- デフォルトでFluid Computeを使用
- 複数のランタイム（Node.js、Edge Runtime）をサポート

## デプロイ

```bash
vc deploy
```

## 追加リソース

- [Hono公式ドキュメント](https://hono.dev/)
- [Vercel Functions](/docs/functions)
- [バックエンドテンプレート](https://vercel.com/templates?type=backend)
- [Vercel Middleware](/docs/functions/middleware)
