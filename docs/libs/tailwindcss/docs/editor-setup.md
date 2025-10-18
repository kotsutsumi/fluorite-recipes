# エディタのセットアップ

Tailwind CSSでの開発体験を向上させるツールについて説明します。

## 構文サポート

Tailwindは`@theme`、`@variant`、`@source`などのカスタムCSS構文を使用します。これらは一部のエディタで警告を引き起こす可能性があります。

推奨される解決策：VS Codeの公式Tailwind CSS IntelliSense プラグインを使用してください。

## VS Code IntelliSense拡張機能

主な機能：

- **オートコンプリート**：ユーティリティクラスとCSS関数の自動補完
- **リンティング**：潜在的なエラーをハイライト表示
- **ホバープレビュー**：ユーティリティクラスの完全なCSSを表示
- **構文ハイライト**：カスタムTailwind CSS構文の構文強調表示

## Prettierでのクラスソート

公式のPrettierプラグインを使用すると、クラスを自動的にソートできます。

- カスタムTailwind設定と連携
- ほとんどのエディタとIDEで互換性あり

クラスソートの例：

```html
<!-- 整形前 -->
<button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">Submit</button>

<!-- 整形後 -->
<button class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">Submit</button>
```

## その他のIDEサポート

- **JetBrains IDE**（WebStorm、PhpStorm）：インテリジェントなTailwind CSS補完機能を提供
- **Zed**エディタ：組み込みのTailwind CSSサポートを含む

このドキュメントは、インテリジェントなツールと拡張機能を通じて開発ワークフローの改善を重視しています。
