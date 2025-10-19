# Vercel FunctionsでのNode.jsランタイムの使用

## 概要

Node.jsを使用したVercel Functionsは、計算集約的なワークロードに適しており、以下を提供します:

- より多くのRAMとCPUパワー
- 完全なNode.js API互換性
- 最大250 MBまでの関数サイズのサポート

## Node.js関数の作成

### 基本的な関数の例

```typescript
export default {
  fetch(request: Request) {
    return new Response('Hello from Vercel!');
  },
};
```

### 代替HTTPメソッドエクスポート

```typescript
export function GET(request: Request) {
  return new Response('Hello from Vercel!');
}
```

## サポートされているAPI

- すべての[Node.js API](https://nodejs.org/docs/latest/api/)をサポート
- 標準のWeb APIと互換性あり

## Node.jsの依存関係

依存関係のインストールはロックファイルに依存します:

- `bun.lock`: `bun install`
- `yarn.lock`: `yarn install`
- `pnpm-lock.yaml`: `pnpm install`
- `package-lock.json`: `npm install`
- ロックファイルなし: デフォルトで`npm install`

## TypeScriptサポート

- `/api`ディレクトリ内の`.ts`ファイルをサポート
- `tsconfig.json`設定を許可
- パスマッピングとプロジェクト参照に制限あり

## RequestおよびResponseオブジェクト

ヘルパーメソッドを提供:

- `request.query`
- `request.cookies`
- `request.body`
- `response.status()`
- `response.send()`
- `response.json()`
- `response.redirect()`

### リクエストボディの解析

`Content-Type`に基づいてリクエストボディを自動的に解析:

- `application/json`: 解析されたJSONオブジェクト
- `application/x-www-form-urlencoded`: 解析されたデータオブジェクト
- `text/plain`: テキスト文字列
- `application/octet-stream`: Buffer

## その他の機能

- Express.js互換性
- ミドルウェアサポート(実験的)
- ドキュメントで指定されたNode.jsバージョンをサポート

## 重要な注意事項

- `/api`ディレクトリ内の関数は自動的に提供されます
- JavaScriptとTypeScriptの両方をサポート
- 堅牢なリクエスト/レスポンス処理を提供
