# ソースファイルでのクラスの検出

## 概要

Tailwindは、プロジェクトファイルをスキャンして、使用されているユーティリティクラスに基づいてCSSを生成します。

### クラスの検出方法

- Tailwindはソースファイルをプレーンテキストとして扱います
- クラス名になり得るトークンを探します
- 検出されたユーティリティクラスのCSSを生成します
- 既知のユーティリティクラスに一致しないトークンは破棄します

### 重要な制限事項

**動的なクラス名に関する警告**：

> クラス名を動的に構築しないでください

間違った例：

```html
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>
```

正しいアプローチ：

```html
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

### スキャン動作

Tailwindは、以下を除くプロジェクト内のすべてのファイルをスキャンします：

- `.gitignore`内のファイル
- `node_modules`ディレクトリ
- バイナリファイル
- CSSファイル
- パッケージマネージャーのロックファイル

## 高度なソース検出

### ソースパスの明示的な登録

`@source`を使用してソースパスを登録します：

```css
@import "tailwindcss";
@source "../node_modules/@acmecorp/ui-lib";
```

### ベースパスの設定

```css
@import "tailwindcss" source("../src");
```

### パスの無視

```css
@import "tailwindcss";
@source not "../src/components/legacy";
```

## ユーティリティのセーフリスト化

特定のクラスの生成を強制します：

```css
@import "tailwindcss";
@source inline("underline");
```

バリアント付きのクラスを生成：

```css
@source inline("{hover:,focus:,}underline");
```

複数のクラスを生成：

```css
@source inline("{hover:,}bg-red-{50,{100..900..100},950}");
```

## 重要なポイント

- 常に完全な静的クラス名を使用してください
- Tailwindは検出されたユーティリティクラスに基づいてCSSを生成します
- ソースファイルの検出とクラス生成のための柔軟な方法を提供します

このドキュメントは、Tailwindがどのようにクラスを検出し、開発者がこのプロセスをどのように制御できるかについての包括的なガイダンスを提供しています。
