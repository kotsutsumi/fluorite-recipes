# Next.js 10.2

**投稿日**: 2021年4月28日（水曜日）

**著者**:
- Connor Davis ([@connordav_is](https://twitter.com/connordav_is))
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Shu Ding ([@shuding_](https://twitter.com/shuding_))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))
- Tobias Koppers ([@wSokra](https://twitter.com/wSokra))

## 主な機能

Next.js 10.2を以下の機能とともに紹介します：

- **より高速なビルド**：キャッシングにより、後続のビルドが最大約60%高速化
- **より高速なリフレッシュ**：100msから200ms高速化
- **より高速な起動**：`next dev`が最大約24%高速化
- **改善されたアクセシビリティ**：スクリーンリーダーによるルート変更のアナウンス
- **より柔軟なリダイレクトとリライト**：任意のヘッダー、クッキー、クエリ文字列に一致
- **自動Webフォント最適化**：フォントCSSをインライン化してパフォーマンスを向上

`npm i next@latest`を実行して今すぐアップデートしてください。

## 詳細セクション

### Webpack 5

- Next.jsアプリケーションへの自動展開
- 改善されたディスクキャッシング
- より高速なFast Refresh
- より良い長期アセットキャッシング
- CommonJSモジュールのツリーシェイキングの強化

### 起動パフォーマンスの改善

- CLI初期化が最大24%高速化
- 例：`vercel.com`の起動時間が3.3秒から2.5秒に短縮

### アクセシビリティの改善

- スクリーンリーダー用のルート変更の自動アナウンス
- `<h1>`、`document.title`、パス名によるページ名の検出

### ルーティングの機能強化

- リライト、リダイレクト、ヘッダー用の新しい`has`プロパティ
- ヘッダー、クッキー、クエリ文字列に一致する機能
- ブラウザー、場所、ログインのリダイレクトの設定例

### 自動Webフォント最適化

- ビルド時にフォントCSSをインライン化
- 現在はGoogle Fontsをサポート
- First Contentful Paint（FCP）とLargest Contentful Paint（LCP）を改善

## コミュニティとチーム

- Tobias Koppers（webpack作者）がNext.jsチームに参加
- さまざまなコントリビューターへの謝辞
