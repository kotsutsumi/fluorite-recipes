# reactStrictMode

`reactStrictMode` は、アプリケーションの潜在的な問題を強調表示する開発モード専用の機能です。

## 主要なポイント

- Next.js 13.5.1 以降、Strict Mode は App Router でデフォルトで `true` です
- `reactStrictMode: false` を設定することで Strict Mode を無効にできます
- 設定は `next.config.js` ファイルに追加されます

## 設定例

```javascript
module.exports = {
  reactStrictMode: true,
}
```

## 重要な注意事項

Strict Mode は「アプリケーションの潜在的な問題を強調表示するための開発モード専用機能」です。

以下を識別するのに役立ちます:
- 安全でないライフサイクル
- レガシー API の使用
- その他の潜在的な問題

## 推奨事項

> 「Next.js アプリケーションで Strict Mode を有効にして、React の将来に向けてアプリケーションをより適切に準備することを強くお勧めします。」

アプリケーション全体で Strict Mode を使用する準備ができていない場合は、特定のページで `<React.StrictMode>` を使用して段階的に移行できます。
