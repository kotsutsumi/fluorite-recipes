# Tailwind CSS のダークモード

## 概要

ダークモードは現在、多くのオペレーティングシステムで標準機能となっており、Tailwindは`dark`バリアントを通じてその実装を簡単にします。

## 主要概念

### 基本的な使用法

Tailwindは、ダークモードが有効な場合に要素を異なるスタイルで表示できる`dark`バリアントを提供します：

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <!-- ライト/ダークのバリエーションを持つコンテンツ -->
</div>
```

### デフォルトの動作

デフォルトでは、ダークモードは`prefers-color-scheme` CSS メディア機能を使用し、ユーザーのシステム設定を尊重します。

## ダークモードの手動切り替え

### CSSセレクタメソッド

CSSでdarkバリアントをカスタマイズすることで、デフォルトの動作をオーバーライドできます：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### データ属性の使用

あるいは、データ属性アプローチを使用できます：

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

### システムテーマのサポート

包括的な実装は、ライトモード、ダークモード、システム設定をサポートできます：

```javascript
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
);

// 特定のテーマを設定
localStorage.theme = "light";  // ライトモードを強制
localStorage.theme = "dark";   // ダークモードを強制
localStorage.removeItem("theme");  // システム設定を尊重
```

このドキュメントは、ダークモードの実装における柔軟性を強調し、開発者がプロジェクトのニーズに最適な方法を選択できるようにしています。
