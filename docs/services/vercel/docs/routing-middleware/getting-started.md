# Routing Middlewareの開始

## 学習内容

- 最初のRouting Middlewareを作成
- URLに基づいてユーザーをリダイレクト
- さまざまなシナリオを処理するための条件ロジックを追加
- Routing Middlewareが実行されるパスを設定

## 前提条件

- Vercelプロジェクト
- JavaScript/TypeScriptの基本知識

## Routing Middlewareの作成

### Routing Middleware用の新しいファイルを作成

プロジェクトルートに`middleware.ts`というファイルを作成し、以下のコードを記述:

```typescript
export const config = {
  runtime: 'nodejs', // デフォルトは'edge'
};

export default function middleware(request: Request) {
  console.log('Request to:', request.url);
  return new Response('Logging request URL from Middleware');
}
```

主なポイント:

- サイトへのすべてのリクエストがこの関数をトリガーします
- リクエストURLをログに記録
- ミドルウェアが実行されていることを確認するレスポンスを返す

プロジェクトをデプロイし、任意のページにアクセスしてミドルウェアの動作を確認します。

### ユーザーのリダイレクト

`middleware.ts`を変更してリダイレクト条件を含める:

```typescript
export const config = {
  runtime: 'nodejs', // デフォルトは'edge'
};

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // 古いブログパスを新しいパスにリダイレクト
  if (url.pathname === '/old-blog') {
    return new Response(null, {
      status: 302,
      headers: { Location: '/blog' },
    });
  }

  // 他のリクエストは通常通り続行
  return new Response('Other pages work normally');
}
```

主なポイント:

- `new URL(request.url)`を使用して受信URLを解析
- パスが`/old-blog`と一致するかチェック
- リダイレクトレスポンスを返す(ステータス302)
- `Location`ヘッダーがブラウザにどこに行くかを指示

### ミドルウェアをトリガーするパスを設定

```typescript
export const config = {
  runtime: 'nodejs', // デフォルトは'edge'
};

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // 特定のリダイレクトのみ処理
  if (url.pathname === '/old-blog') {
    return new Response(null, {
      status: 302,
      headers: { Location: '/blog' },
    });
  }
}
```
