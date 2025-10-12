# Next.js 13.3

**投稿日**: 2023年4月6日（木曜日）

**著者**:
- Delba de Oliveira ([@delba_oliveira](https://twitter.com/delba_oliveira))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主な機能

### 1. ファイルベースのメタデータAPI

- サイトマップ、robots、faviconなどの動的生成を許可
- `opengraph-image`、`favicon.ico`、`sitemap`などのファイル規則をサポート

### 2. 動的Open Graph画像生成

- `next/server`の`ImageResponse`を使用して画像を生成
- JSX、HTML、CSSを使用してOpen GraphとTwitter画像を生成をサポート

### 3. App Routerの静的エクスポート

- 静的サイトとシングルページアプリケーション（SPA）の完全サポート
- ルートごとにHTMLファイルを生成
- サーバーコンポーネントと静的ルートハンドラーをサポート

### 4. 並列ルートとインターセプト

- 複雑なレイアウト用の高度なルーティング機能
- 複数の同時ルートビューを作成
- モーダルのようなルーティング体験を実装

## 更新コマンド

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## まとめ

チームは、App Routerを安定版としてマークすることに近づいており、パフォーマンスの最適化とバグ修正に焦点を当てています。
