# Vercel への段階的移行ガイド

## 段階的移行の概要

段階的移行は、リスクを最小限に抑えながら、アプリケーションやウェブサイトをVercelに移行するための戦略的アプローチです。

## 段階的移行のメリット

### リスクの低減
- 一度にすべてを移行する必要がない
- 問題が発生した場合、影響範囲が限定される
- 段階的なテストとバリデーションが可能

### スムーズなロールバックパス
- 各段階で元の状態に戻すことが容易
- 問題の特定と修正が迅速

### 早期の技術的実装と事業価値の検証
- 小規模な機能から始めて価値を実証
- 段階的に学習しながら移行を進められる

### ダウンタイムのない移行
- ユーザーに影響を与えずに移行を実施
- 継続的なサービス提供が可能

## 移行戦略

### 垂直移行

機能ごとに段階的に移行するアプローチ：

1. レガシーシステムの全機能を特定
2. 初期移行のための主要機能を選択
3. 選択した機能をVercelに移行
4. すべての機能が移行されるまで繰り返す

**例**: Eコマースサイトの場合
- フェーズ1: 商品カタログページ
- フェーズ2: ショッピングカート
- フェーズ3: チェックアウトプロセス
- フェーズ4: ユーザーアカウント管理

### 水平移行

ユーザーグループごとに段階的に移行するアプローチ：

1. すべてのユーザーグループを特定
2. 最初に移行するユーザーグループを選択（例：内部ユーザー、ベータテスター）
3. 選択したグループのトラフィックをVercelにルーティング
4. すべてのユーザーが移行されるまで繰り返す

**例**: グローバルWebサイトの場合
- フェーズ1: 社内スタッフ（5%）
- フェーズ2: 特定地域のユーザー（25%）
- フェーズ3: 追加地域（50%）
- フェーズ4: 全ユーザー（100%）

### ハイブリッド移行

垂直および水平戦略を組み合わせたアプローチ：

1. 特定の機能を選択
2. その機能を特定のユーザーグループに展開
3. フィードバックを収集し、調整
4. 段階的に拡大

**例**: SaaSアプリケーションの場合
- フェーズ1: 新しいダッシュボード機能をベータユーザーに展開
- フェーズ2: すべてのユーザーにダッシュボードを展開
- フェーズ3: API機能をベータユーザーに展開
- フェーズ4: すべてのユーザーにAPI機能を展開

## 実装アプローチ

### アプローチ 1: ドメインを Vercel に向ける

このアプローチは、DNSをVercelに向け、Vercelから元のサーバーにトラフィックをリダイレクトする方法です。

#### 手順

1. **アプリケーションをVercelにデプロイ**
   - 移行したい機能のみを実装
   - Vercelプロジェクトを作成

2. **トラフィックを再ルーティング**

   **方法A: フレームワーク固有のリライト**

   Next.jsの例：
   ```javascript
   // next.config.js
   module.exports = {
     async rewrites() {
       return {
         beforeFiles: [
           {
             source: '/new-feature/:path*',
             destination: '/new-feature/:path*', // Vercelで処理
           },
         ],
         fallback: [
           {
             source: '/:path*',
             destination: 'https://legacy-server.com/:path*', // レガシーサーバーへ
           },
         ],
       };
     },
   };
   ```

   **方法B: Vercel設定のリライト**

   ```json
   {
     "rewrites": [
       {
         "source": "/new-feature/:path*",
         "destination": "/new-feature/:path*"
       },
       {
         "source": "/:path*",
         "destination": "https://legacy-server.com/:path*"
       }
     ]
   }
   ```

   **方法C: Edge Configの使用**

   動的なルーティング制御が可能：
   ```typescript
   import { get } from '@vercel/edge-config';

   export async function middleware(request) {
     const config = await get('migration-routes');

     if (config.migratedRoutes.includes(request.nextUrl.pathname)) {
       // Vercelで処理
       return NextResponse.next();
     }

     // レガシーサーバーへリダイレクト
     return NextResponse.rewrite(
       new URL(request.nextUrl.pathname, 'https://legacy-server.com')
     );
   }
   ```

3. **DNSをVercelに向ける**
   - Vercelダッシュボードでドメインを設定
   - DNS設定を更新

### アプローチ 2: レガシーサーバーにドメインを残す

このアプローチは、DNSをレガシーサーバーに向けたまま、特定のパスをVercelにリダイレクトする方法です。

#### 手順

1. **最初の機能をVercelにデプロイ**
   - Vercelプロジェクトを作成
   - デプロイURLを取得（例：`my-app.vercel.app`）

2. **リライトまたはリバースプロキシを追加**

   **Nginx の例：**
   ```nginx
   location /new-feature {
     proxy_pass https://my-app.vercel.app;
     proxy_set_header Host my-app.vercel.app;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

   **Apache の例：**
   ```apache
   <Location /new-feature>
     ProxyPass https://my-app.vercel.app/new-feature
     ProxyPassReverse https://my-app.vercel.app/new-feature
   </Location>
   ```

3. **段階的に移行を拡大**
   - 追加の機能をVercelに移行
   - プロキシ設定を更新

4. **完全移行後、DNSをVercelに向ける**

## トラブルシューティング

### ルート数の制限

Vercelでは、最大1024のルート（リライト、リダイレクト、ヘッダー）が設定可能です。

**解決策：**
- 動的ルーティングパターンを使用
- Edge Configで動的にルートを管理
- Vercel Middlewareでプログラマティックにルーティング

### キャッシュの問題

レガシーサーバーとVercel間でキャッシュの動作が異なる場合があります。

**解決策：**
- キャッシュヘッダーを明示的に設定
- Vercelのキャッシング動作を理解する
- 必要に応じてキャッシュをパージ

### CORS の問題

異なるオリジン間でリソースを共有する場合、CORSエラーが発生する可能性があります。

**解決策：**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
```

### セッション管理

レガシーサーバーとVercel間でセッションを共有する必要がある場合があります。

**解決策：**
- 共有セッションストア（Redis等）を使用
- JWTトークンベースの認証に移行
- 同じCookieドメインを使用

## ベストプラクティス

### 1. 小規模から始める
最も単純な機能から移行を開始し、複雑な機能は後回しにします。

### 2. モニタリングを設定
- Vercelのアナリティクスを有効化
- エラー追跡ツール（Sentry等）を設定
- パフォーマンスモニタリングを実装

### 3. 段階的なロールアウト
- 内部ユーザーでテスト
- ベータユーザーに展開
- 段階的に全ユーザーに展開

### 4. ロールバック計画
各段階で、問題が発生した場合のロールバック手順を準備します。

### 5. ドキュメント化
移行プロセス、設定変更、学んだ教訓を文書化します。

## 例: 実際の移行シナリオ

### シナリオ: Eコマースサイトの移行

**現状：**
- レガシーサーバー（example.com）でホスト
- 商品カタログ、カート、チェックアウト、ユーザーアカウント

**移行計画：**

**フェーズ1: 商品カタログページ**
1. Next.jsで商品カタログページを実装
2. Vercelにデプロイ
3. `/products/*`パスをVercelにルーティング
4. 2週間モニタリング

**フェーズ2: 静的コンテンツページ**
1. ブログ、FAQ、About ページを移行
2. `/blog/*`、`/faq`、`/about`をVercelにルーティング
3. 2週間モニタリング

**フェーズ3: ショッピングカート**
1. カート機能を実装（APIはレガシーサーバーを使用）
2. `/cart`をVercelにルーティング
3. セッション共有を設定
4. 2週間モニタリング

**フェーズ4: チェックアウトとユーザーアカウント**
1. チェックアウトフローを実装
2. ユーザーアカウント管理を移行
3. すべてのトラフィックをVercelに切り替え
4. レガシーサーバーを段階的に廃止

## 関連リソース

- [Vercelへのデプロイ](/docs/deployments)
- [Edge Config](/docs/edge-config)
- [Vercel Middleware](/docs/functions/middleware)
- [Next.js Rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites)
- [リバースプロキシ設定](/docs/reverse-proxy)
