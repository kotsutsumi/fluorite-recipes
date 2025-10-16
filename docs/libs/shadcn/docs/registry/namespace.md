# 名前空間

## 概要

名前空間レジストリにより、1つのプロジェクト内で複数のリソースレジストリを構成および使用できます。これにより、コンポーネント、ライブラリ、ユーティリティ、AIプロンプト、設定ファイルなどのリソースを、パブリック、サードパーティ、または独自のプライベートライブラリから、インストールできます。

## 分散型名前空間システム

名前空間システムは意図的に分散型として設計されています。オープンソースのレジストリインデックスはありますが、任意の名前空間を自由に作成して使用できます。

### 名前空間の例

- `@shadcn/button` - shadcnレジストリのUIコンポーネント
- `@v0/dashboard` - v0レジストリのダッシュボードコンポーネント
- `@acme/auth-utils` - 会社のプライベートレジストリの認証ユーティリティ

## リソースのインストール

名前空間構文を使用してリソースをインストールできます：

```bash
pnpm dlx shadcn@latest add @v0/dashboard
```

または複数のリソースを一度にインストール：

```bash
pnpm dlx shadcn@latest add @acme/header @lib/auth-utils @ai/chatbot-rules
```

## 設定例

`components.json`に以下のように追加します：

```json
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}",
    "@acme": "https://registry.acme.com/resources/{name}.json",
    "@lib": "https://example.com/lib/{name}"
  }
}
```

## 名前空間の作成

独自の名前空間を作成するには：

1. レジストリをホスト
2. `components.json`に名前空間を追加
3. 名前空間構文を使用してリソースをインストール

例：

```json
{
  "registries": {
    "@mycompany": "https://registry.mycompany.com/{name}.json"
  }
}
```

その後、以下のようにインストールできます：

```bash
pnpm dlx shadcn@latest add @mycompany/button
```
