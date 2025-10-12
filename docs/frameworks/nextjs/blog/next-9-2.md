# Next.js 9.2

**投稿日**: 2020年1月15日（水曜日）

**著者**:
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Joe Haddad ([@timer150](https://twitter.com/timer150))
- Luis Alvarez ([@luis_fades](https://twitter.com/luis_fades))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主な機能

Next.js 9.2では以下を導入します：

### 1. グローバルスタイルシート用の組み込みCSSサポート

- `.css`ファイルをグローバルスタイルシートとして直接インポート
- `pages/_app.js`でインポート
- 本番環境でCSSファイルを自動的に連結

### 2. コンポーネントレベルスタイル用の組み込みCSSモジュールサポート

- `.module.css`ファイル命名規則を使用
- 一意のクラス名によるローカルスコープCSS
- グローバルCSSスタイルと共存可能

### 3. 改善されたコード分割戦略

- Google Chromeチームによって最適化
- より小さなクライアント側バンドル
- HTTP/2の利用を最大化

### 4. キャッチオール動的ルート

- `[...slug]`構文のサポート
- より柔軟なルーティングを実現、特にCMSを利用したウェブサイトに最適

## インストール

```bash
npm i next@latest react@latest react-dom@latest
```

## まとめ

このブログ記事は、各機能について詳細な説明とコード例を提供し、下位互換性と採用の容易さを強調しています。
