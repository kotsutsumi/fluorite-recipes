# Next.js 8.0.4

**投稿日**: 2019年4月2日（火曜日）

**著者**:
- Connor Davis ([@connordav_is](https://twitter.com/connordav_is))
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Joe Haddad ([@timer150](https://twitter.com/timer150))
- Luis Alvarez ([@luis_fades](https://twitter.com/luis_fades))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主な改善点

本番環境対応のNext.js 8.0.4を以下の機能強化とともに紹介します：

- ビルドパフォーマンスの改善
- 決定論的ビルド
- より小さなクライアントランタイム
- より小さなサーバーレス関数
- デフォルトのビューポートタグ
- 学習ガイドの改善

### ビルドパフォーマンス

Next.jsのビルドがより決定論的になり、コードが変更されていない場合、一貫したビルド出力が生成されます。これにより以下が可能になります：

- より効率的なビルドキャッシング
- 本番コードの高速リビルド
- 改善されたミニフィケーションキャッシング

### より小さなランタイムフットプリント

ハイライト：
- クライアント側JavaScriptが5.58KB削減
- `withRouter`が`hoist-non-react-statics`に依存しなくなった
- 最適化された`next/babel`プリセット
- `X-Powered-By`ヘッダーを削除
- サーバーレス関数が44KB削減（5.44KB gzip）

### デフォルトのビューポートメタタグ

8.0.4から、デフォルトのビューポートタグが自動的に追加されます：

```html
<meta
  name="viewport"
  content="width=device-width,minimum-scale=1,initial-scale=1"
/>
```

これは`next/head`を使用してオーバーライドできます。

### 新しいMDXプラグイン

マークダウンとJSXの統合を容易にする`@next/mdx`を導入しました。

### 学習ガイドの改善

Next.js Learnウェブサイトは、MDXを使用して再構築され、サーバーレスターゲットを使用するようにアップグレードされました。

## 貢献

- 660人以上のコントリビューター
- 36,150以上のGitHubスター
- 2,950以上のプルリクエスト

このブログ記事は、コミュニティの関与を奨励し、プロジェクトの成長を強調しています。
