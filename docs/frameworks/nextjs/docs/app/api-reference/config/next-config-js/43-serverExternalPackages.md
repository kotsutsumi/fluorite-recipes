# serverExternalPackages

Server ComponentsとRoute Handlersで使用される依存関係は、Next.jsによって自動的にバンドルされます。ただし、Node.js固有の機能を持つ依存関係については、バンドルからオプトアウトして、ネイティブのNode.js `require`を使用できます。

## 設定例

```javascript filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@acme/ui'],
}

module.exports = nextConfig
```

## 事前設定されたパッケージ

Next.jsには、以下を含む自動的にオプトアウトされる事前定義されたパッケージリストが含まれています：

- データベースクライアント（例：`@prisma/client`、`pg`）
- AWS SDKパッケージ
- テストライブラリ（例：`jest`、`playwright`）
- 画像処理ライブラリ（例：`sharp`、`canvas`）
- その他のNode.js固有のツールとライブラリ

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.0.0` | 実験的機能から安定版に移行 |
| `v15.0.0` | `serverComponentsExternalPackages`から`serverExternalPackages`に名称変更 |
| `v13.0.0` | `serverComponentsExternalPackages`が導入されました |

## Good to know

この設定により、開発者はサーバーサイドコードをバンドルする際に外部として扱うべきパッケージを明示的に指定でき、Node.js固有の依存関係を柔軟に処理できます。
