# Preflight: Tailwind CSSのベーススタイル

## 概要

Preflightは、[modern-normalize](https://github.com/sindresorhus/modern-normalize)に基づいて構築されたベーススタイルのセットで、以下を目的としています：

- ブラウザ間の不整合を滑らかにする
- デザインシステムの制約内で作業しやすくする

## 主な特徴

### 1. マージンの削除

- すべての要素からデフォルトのマージンを削除
- ユーザーエージェントスタイルシートのマージンへの偶発的な依存を防止

### 2. ボーダースタイルのリセット

- デフォルトのボーダースタイルをオーバーライド
- `border`クラスが`currentColor`を使用して1pxの実線ボーダーを追加することを保証

### 3. 見出しのスタイル解除

すべての見出し要素は以下を持ちます：

- 継承されたフォントサイズ
- 継承されたフォントウェイト

これにより、タイプスケールからの意図しない逸脱を防ぎ、意図的なスタイリングを促進します。

### 4. リストのスタイル解除

- 順序付きリストと順序なしリストには箇条書きや番号がありません
- `list-style-type`と`list-style-position`ユーティリティを使用してスタイリングできます

### 5. 画像とメディア

- ブロックレベル表示
- 親要素の幅に制約
- 固有のアスペクト比を保持
- デフォルトでレスポンシブ

## Preflightの拡張

`base` CSSレイヤーにカスタムベーススタイルを追加します：

```css
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
  a {
    color: var(--color-blue-600);
    text-decoration-line: underline;
  }
}
```

## Preflightの無効化

Tailwind CSSをインポートする際にpreflightインポートを省略します：

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
```

## アクセシビリティに関する注意

スタイル解除されたリストには、スクリーンリーダーの互換性を維持するために`role="list"`を追加してください。

このドキュメントは、Tailwind CSSのPreflightがどのように一貫したベースラインを提供し、カスタムスタイリングのクリーンな基盤を作成するかを説明しています。
