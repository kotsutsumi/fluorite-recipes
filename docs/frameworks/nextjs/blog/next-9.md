# Next.js 9

**投稿日**: 2019年7月8日（月曜日）

**著者**:
- Connor Davis ([@connordav_is](https://twitter.com/connordav_is))
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Joe Haddad ([@timer150](https://twitter.com/timer150))
- Luis Alvarez ([@luis_fades](https://twitter.com/luis_fades))
- Lukáš Huvar ([@huv1k](https://twitter.com/huv1k))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主な機能

70のカナリアリリースを経て、Next.js 9は以下の重要な改善を導入します：

### 1. ゼロ設定のTypeScriptサポート

- 自動TypeScriptサポート
- 統合された型チェック
- 自動`tsconfig.json`作成

### 2. ファイルシステムベースの動的ルーティング

- ファイルシステムを使用して動的ルートを作成
- 例：`pages/post/[pid].js`は`/post/1`、`/post/hello-nextjs`にマッチ

### 3. 自動静的最適化

- ハイブリッドレンダリングアプローチ
- 一部のページは静的生成、他は サーバーサイドレンダリング
- 静的ページと動的ページの自動検出

### 4. APIルート

- Next.js内で直接バックエンドエンドポイントを構築
- ホットリロードサポート
- 簡素化されたバックエンド開発

### 5. 本番環境の最適化

- ビューポート内のリンクプリフェッチ
- アプリケーションの応答性の向上

### 6. 開発者体験の改善

- 控えめで使いやすさの向上

## アップグレード手順

```bash
npm i next@latest react@latest react-dom@latest
```

## コミュニティハイライト

- 720人以上のコントリビューター
- 38,600以上のGitHubスター
- IGN、Bang & Olufsen、Intercom、Buffer、Ferrariなどの企業がNext.jsを使用

このブログ記事は、コード例と詳細な説明を含む各機能の詳細を提供しています。
