# マイクロフロントエンドのセキュリティ管理

マイクロフロントエンドは、[ベータ版](/docs/release-phases#beta)で[すべてのプラン](/docs/plans)で利用可能です。

## デプロイメント保護とマイクロフロントエンド

マイクロフロントエンドのセキュリティは、リクエストがどのドメインに向けられているかによって決まります。

### マイクロフロントエンドホストへのリクエスト

デフォルトアプリケーションのドメインへのリクエストの場合：

- リクエストは、デフォルトアプリケーションのプロジェクトの[デプロイメント保護](/docs/security/deployment-protection)設定のみで検証されます

### 子アプリケーションへの直接リクエスト

子マイクロフロントエンドのドメインへの直接リクエストの場合：

- リクエストは、子アプリケーションのプロジェクトの[デプロイメント保護](/docs/security/deployment-protection)設定のみで検証されます

## サポートされている保護方法

これは、以下を含むすべての[保護方法](/docs/security/deployment-protection/methods-to-protect-deployments)と[バイパス方法](/docs/security/deployment-protection/methods-to-bypass-deployment-protection)に適用されます：

### 保護方法

- [Vercel認証](/docs/security/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [パスワード保護](/docs/security/deployment-protection/methods-to-protect-deployments/password-protection)
- [信頼できるIP](/docs/security/deployment-protection/methods-to-protect-deployments/trusted-ips)

### バイパス方法

- [共有可能なリンク](/docs/security/deployment-protection/methods-to-bypass-deployment-protection/sharable-links)
- [自動化のための保護バイパス](/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)

## セキュリティのベストプラクティス

### 1. 適切なアクセス制御

- デフォルトアプリケーションと各子マイクロフロントエンドに適切なデプロイメント保護を設定
- プレビューデプロイメントには、Vercel認証またはパスワード保護を使用
- 本番環境には、信頼できるIPを使用（必要に応じて）

### 2. 環境変数の管理

- センシティブな情報は環境変数に保存
- 各マイクロフロントエンドプロジェクトで個別に設定
- プレビュー環境と本番環境で異なる値を使用

### 3. ファイアウォールルール

Vercelのファイアウォール機能を使用して、不正なアクセスから保護：

- IPホワイトリスト/ブラックリスト
- レート制限
- DDoS保護

### 4. HTTPS とセキュアヘッダー

- すべてのマイクロフロントエンドでHTTPSを使用（Vercelはデフォルトで有効）
- セキュリティヘッダーを設定（CSP、HSTS、X-Frame-Optionsなど）

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## セキュリティ設定の例

### デフォルトアプリケーション

1. Vercelダッシュボードで「Settings」→「Deployment Protection」に移動
2. Vercel認証を有効化（プレビューデプロイメント用）
3. 信頼できるIPを設定（本番環境へのアクセスを制限する場合）

### 子マイクロフロントエンド

1. 各子マイクロフロントエンドプロジェクトで同様の設定を行う
2. 必要に応じて、異なる保護レベルを設定
3. 共有可能なリンクを使用して、外部関係者とプレビューを共有

## トラブルシューティング

### 認証エラー

- デフォルトアプリケーションと子マイクロフロントエンドの両方で認証設定を確認
- 共有可能なリンクが期限切れになっていないか確認
- ブラウザのCookieが有効になっているか確認

### アクセス拒否

- IPアドレスが信頼できるIPリストに含まれているか確認
- パスワード保護が正しく設定されているか確認
- ファイアウォールルールを確認

## 関連リンク

- [デプロイメント保護](/docs/security/deployment-protection)
- [Vercel認証](/docs/security/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [ファイアウォール](/docs/security/vercel-firewall)
- [マイクロフロントエンドの管理](/docs/microfrontends/managing-microfrontends)
