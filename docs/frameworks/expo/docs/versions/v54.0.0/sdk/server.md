# Server

Expo Routerのサーバーサイド実装を実現するAPIおよびランタイムライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-server
```

## 概要

`expo-server`は、Expo Routerのサーバーサイド用APIとランタイムライブラリを提供します。APIルートやサーバーサイドコードのためのヘルパー関数を含んでいます。

## 主な機能

### サーバーサイドランタイムAPI

サーバーサイドでのリクエストメタデータへのアクセスやタスクのスケジューリングをサポートします。

### リクエストメタデータへのアクセス

```javascript
import { origin, environment } from 'expo-server';

export async function GET() {
  return Response.json({
    isProduction: environment() == null,
    origin: origin(),
  });
}
```

### タスクのスケジューリング

```javascript
import { runTask, deferTask } from 'expo-server';

export async function GET() {
  runTask(async () => {
    console.log('will run immediately.');
  });

  return Response.json({ success: true });
}
```

## アダプター

複数のサーバーレス環境をサポートしています。

- Bun
- Express
- Node.js HTTP
- Netlify
- Vercel
- Cloudflare Workers

## API リファレンス

### クラス

#### StatusError

ステータスコードとボディを持つエラーレスポンスを表します。

### メソッド

#### deferTask()

レスポンスが送信された後にタスクを実行します。

#### environment()

リクエスト環境を返します。

#### origin()

リクエストのオリジンURLを返します。

#### runTask()

並行してタスクを実行します。

#### setResponseHeaders()

レスポンスヘッダーを変更します。

## ミドルウェアのサポート

ミドルウェア関数を作成して、リクエストを条件付きで傍受および処理することができます。

## プラットフォームサポート

このライブラリは、Expo Routerプロジェクトでサーバーサイド機能を実装するための包括的なガイダンスを提供します。
