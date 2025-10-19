# マイクロフロントエンドのテストとトラブルシューティング

マイクロフロントエンドは、[ベータ版](/docs/release-phases#beta)で[すべてのプラン](/docs/plans)で利用可能です。

## テスト

`@vercel/microfrontends` パッケージには、一般的な設定ミスを回避するためのテストユーティリティが含まれています。

### `validateMiddlewareConfig`

`validateMiddlewareConfig` テストは、ミドルウェアがマイクロフロントエンドと正しく連携するように設定されていることを確認します。このテストに合格しても、ミドルウェアが完全に正しく設定されていることを保証するものではありませんが、多くの一般的な問題を見つけることができます。

ミドルウェアはデフォルトアプリケーションでのみ実行されるため、デフォルトアプリケーションでのみこのテストを実行する必要があります。設定の問題が見つかった場合、例外をスローして、任意のテストフレームワークで使用できるようにします。

#### Jestでの使用例

```typescript
/* @jest-environment node */

import { validateMiddlewareConfig } from '@vercel/microfrontends/next/testing';
import { config } from '../middleware';

describe('middleware', () => {
  test('matches microfrontends paths', () => {
    expect(() =>
      validateMiddlewareConfig(config, './microfrontends.json'),
    ).not.toThrow();
  });
});
```

#### Vitestでの使用例

```typescript
import { describe, test, expect } from 'vitest';
import { validateMiddlewareConfig } from '@vercel/microfrontends/next/testing';
import { config } from '../middleware';

describe('middleware', () => {
  test('matches microfrontends paths', () => {
    expect(() =>
      validateMiddlewareConfig(config, './microfrontends.json'),
    ).not.toThrow();
  });
});
```

### `validateMiddlewareOnFlaggedPaths`

`validateMiddlewareOnFlaggedPaths` テストは、フラグ付きパスに対してミドルウェアが正しく設定されていることを確認します。ミドルウェアはデフォルトアプリケーションでのみ実行されるため、デフォルトアプリケーションでのみこのテストを実行します。

```typescript
import { validateMiddlewareOnFlaggedPaths } from '@vercel/microfrontends/next/testing';
import { config } from '../middleware';

describe('middleware with flags', () => {
  test('handles flagged paths correctly', () => {
    expect(() =>
      validateMiddlewareOnFlaggedPaths(config, './microfrontends.json'),
    ).not.toThrow();
  });
});
```

## よくある問題とトラブルシューティング

### 1. ルーティングが機能しない

#### 症状
- パスが期待したマイクロフロントエンドにルーティングされない
- 404エラーが表示される

#### 解決方法

**設定ファイルを確認**

```bash
# microfrontends.jsonの構文エラーをチェック
cat microfrontends.json | jq .
```

**パスパターンを確認**

```json
{
  "applications": {
    "docs": {
      "routing": [
        {
          // ワイルドカードを忘れていないか確認
          "paths": ["/docs", "/docs/:path*"]
        }
      ]
    }
  }
}
```

**デプロイメントログを確認**

Vercelダッシュボードでデプロイメントログを確認し、設定ファイルが正しく読み込まれているか確認します。

### 2. ローカル開発プロキシの問題

#### 症状
- ローカルでマイクロフロントエンドが表示されない
- プロキシが起動しない

#### 解決方法

**ポートの競合を確認**

```bash
# ポート3000が使用されているか確認
lsof -i :3000

# 別のポートを使用
MICROFRONTENDS_PROXY_PORT=3001 microfrontends proxy
```

**依存関係を確認**

```bash
# パッケージが正しくインストールされているか確認
npm list @vercel/microfrontends

# 再インストール
npm install @vercel/microfrontends@latest
```

**設定ファイルのパスを確認**

```json
{
  "applications": {
    "web": {
      "development": {
        "fallback": "vercel.com" // 有効なドメインか確認
      }
    }
  }
}
```

### 3. 環境変数が共有されない

#### 症状
- 子マイクロフロントエンドで環境変数が利用できない

#### 解決方法

環境変数は各プロジェクトで個別に設定する必要があります：

1. Vercelダッシュボードで各プロジェクトに移動
2. 「Settings」→「Environment Variables」を選択
3. 必要な環境変数を追加

**自動化スクリプトの例**

```bash
#!/bin/bash
# すべてのマイクロフロントエンドに環境変数を設定

PROJECTS=("web" "docs" "blog")
ENV_VAR_NAME="API_KEY"
ENV_VAR_VALUE="your-api-key"

for PROJECT in "${PROJECTS[@]}"; do
  vercel env add $ENV_VAR_NAME production $ENV_VAR_VALUE --scope $PROJECT
done
```

### 4. CORSエラー

#### 症状
- マイクロフロントエンド間でAPIリクエストが失敗する
- ブラウザコンソールにCORSエラーが表示される

#### 解決方法

**Next.jsでのCORS設定**

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

### 5. デプロイメント保護の問題

#### 症状
- マイクロフロントエンドへのアクセスが拒否される
- 認証ループが発生する

#### 解決方法

デフォルトアプリケーションと子マイクロフロントエンドの両方で一貫した保護設定を確認：

1. すべてのプロジェクトで同じ認証方法を使用
2. 共有可能なリンクが有効期限内であることを確認
3. IPホワイトリストが正しく設定されていることを確認

### 6. パフォーマンスの問題

#### 症状
- ページの読み込みが遅い
- マイクロフロントエンド間の遷移が遅い

#### 解決方法

**プリフェッチの実装**

```javascript
// Next.jsの例
import Link from 'next/link';

<Link href="/docs" prefetch={true}>
  ドキュメント
</Link>
```

**キャッシュの活用**

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

**Speed Insightsでの監視**

各マイクロフロントエンドでSpeed Insightsを有効にし、パフォーマンスボトルネックを特定します。

## デバッグツール

### Vercelツールバー

[Vercelツールバー](/docs/microfrontends/managing-microfrontends/vercel-toolbar)を使用して、マイクロフロントエンドの状態を視覚化：

```bash
npm install @vercel/toolbar
```

### ブラウザ開発者ツール

**ネットワークタブ**
- リクエストがどのマイクロフロントエンドに送信されているか確認
- レスポンスヘッダーを確認

**コンソール**
- JavaScriptエラーを確認
- ルーティング情報をログ出力

### ログの確認

```javascript
// デバッグ用のログ出力
console.log('Current microfrontend:', process.env.NEXT_PUBLIC_APP_NAME);
console.log('Request path:', window.location.pathname);
```

## サポートとリソース

### さらにヘルプが必要な場合

- [Vercelサポート](https://vercel.com/support)に連絡
- [Vercelコミュニティ](https://github.com/vercel/vercel/discussions)で質問
- [公式ドキュメント](/docs/microfrontends)を確認

### 関連リンク

- [クイックスタート](/docs/microfrontends/quickstart)
- [ローカル開発](/docs/microfrontends/local-development)
- [マイクロフロントエンドの管理](/docs/microfrontends/managing-microfrontends)
- [Vercelツールバー](/docs/microfrontends/managing-microfrontends/vercel-toolbar)
