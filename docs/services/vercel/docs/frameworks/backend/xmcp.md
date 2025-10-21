# xmcp on Vercel

## 概要

`xmcp`は、MCP（Model Context Protocol）互換のバックエンドを構築するためのTypeScript-firstフレームワークです。主な特徴は以下の通りです：

- オピニオネートされたプロジェクト構造
- 自動ツール検出
- リクエスト/レスポンス処理のためのストリームライン化されたミドルウェアレイヤー
- Vercelへのゼロコンフィグデプロイ

## Vercelでの始め方

### プロジェクトの作成

ターミナルで以下のコマンドを実行：

```bash
npx create-xmcp-app@latest
```

このコマンドは以下を含むプロジェクトを生成します：

- `src/tools/` ディレクトリ
- オプションの `src/middleware.ts`
- `xmcp.config.ts` ファイル

### プロジェクト構造

```
project/
├── src/
│   ├── tools/
│   │   ├── tool1.ts
│   │   └── tool2.ts
│   └── middleware.ts
├── xmcp.config.ts
└── package.json
```

## デプロイ方法

### 方法1: Gitリポジトリを接続

1. Vercelダッシュボードで「新しいプロジェクト」をクリック
2. Gitリポジトリを接続
3. 自動的にビルド設定が検出されます

### 方法2: Vercel CLIを使用

```bash
vc deploy
```

## ローカル開発

ローカルでアプリケーションを実行するには：

```bash
vc dev
# または
npm run dev
# または
yarn dev
# または
pnpm run dev
```

## ミドルウェア

### xmcpミドルウェア

`middleware.ts`ファイルでツール実行前後のカスタム処理が可能：

```typescript
import { type Middleware } from 'xmcp';

const middleware: Middleware = async (req, res, next) => {
  // ツール実行前の処理
  console.log('リクエスト受信:', req);

  // 次のミドルウェアまたはツールへ
  await next();

  // ツール実行後の処理
  console.log('レスポンス送信:', res);
};

export default middleware;
```

### 使用例

#### 認証ミドルウェア

```typescript
import { type Middleware } from 'xmcp';

const authMiddleware: Middleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status = 401;
    res.body = { error: 'Unauthorized' };
    return;
  }

  // トークンの検証
  const isValid = await verifyToken(token);

  if (!isValid) {
    res.status = 403;
    res.body = { error: 'Forbidden' };
    return;
  }

  await next();
};

export default authMiddleware;
```

### Vercelルーティングミドルウェア

Vercelのミドルウェア機能を使用すると、リクエスト処理前にコードを実行できます：

- リダイレクト
- ヘッダー管理
- 認証チェック
- レート制限

詳細は[Vercel Middleware](/docs/functions/middleware)を参照してください。

## ツールの作成

### 基本的なツール

```typescript
// src/tools/calculator.ts
export const add = {
  description: '2つの数値を加算します',
  parameters: {
    a: { type: 'number', description: '最初の数値' },
    b: { type: 'number', description: '2番目の数値' }
  },
  execute: async ({ a, b }: { a: number; b: number }) => {
    return a + b;
  }
};
```

### ツールの自動検出

`src/tools/`ディレクトリ内のすべてのツールは自動的に検出され、MCPエンドポイントとして公開されます。

## 設定

### xmcp.config.ts

```typescript
import { defineConfig } from 'xmcp';

export default defineConfig({
  tools: {
    // ツールの設定
  },
  middleware: {
    // ミドルウェアの設定
  }
});
```

## 追加リソース

- [xmcp公式ドキュメント](https://xmcp.dev/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Vercel Functions](/docs/functions)
- [Vercel Middleware](/docs/functions/middleware)
