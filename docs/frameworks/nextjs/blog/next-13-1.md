# Next.js 13.1

**投稿日**: 2022年12月22日（木曜日）

**著者**: OJ Kwon、Tim Neutkens

Next.js 13.1には、`pages/`（安定版）と`app/`（ベータ）ディレクトリの両方の改善が含まれています：

## 主な改善点

### `app`ディレクトリ（ベータ）の改善

信頼性とパフォーマンスの向上

### 組み込みモジュール変換

`next-transpile-modules`の機能をコアに導入

### Edgeランタイム（安定版）

Edge用の軽量Node.jsランタイム

### Turbopackアップデート

Tailwind CSS、`next/image`、`@next/font`などのサポート

### ミドルウェアの改善

レスポンスを返し、リクエストヘッダーを設定可能

### SWCインポート解決

バレルファイル使用時により小さなJavaScriptバンドル

## 更新コマンド

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## 詳細セクション

### Appディレクトリの改善

主な変更点：
- 追加のレイアウト`<div>`要素なし
- コンポーネント提案を持つ新しいTypeScriptプラグイン
- 信頼性の改善
- クライアント側JavaScriptの削減（9.3kB削減）

### 組み込みモジュール変換

設定で依存関係を直接変換できるようになりました：

```typescript
const nextConfig = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
};

module.exports = nextConfig;
```

### インポート解決

バレルファイルからのインポートをモジュール化する新しいSWC変換により、バンドルサイズが削減されます。

### Edgeランタイム

EdgeランタイムがAPIルート用に安定版になり、プラットフォーム間で互換性のある軽量Node.jsランタイムを提供します。

### その他の改善

- `@next/font`が複数のフォントウェイトをサポート
- `next/dynamic`がReactプリミティブを使用
- 更新された`create-next-app`テンプレート
- パフォーマンス重視の新しいテンプレート

## まとめ

このブログ記事は、開発者体験とパフォーマンスに焦点を当てたNext.jsの継続的な改善を強調しています。
