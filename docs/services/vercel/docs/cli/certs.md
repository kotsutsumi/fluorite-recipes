# vercel certs

`vercel certs` コマンドは、ドメインの証明書を管理するために使用され、証明書の一覧表示、発行、および削除の機能を提供します。Vercelは、ドメインの証明書を自動的に管理します。

## 使用方法

```bash
vercel certs ls
```

現在のスコープ下のすべての証明書を一覧表示するための `vercel certs` コマンドの使用。

## 拡張された使用方法

### 証明書の発行

```bash
vercel certs issue [domain1, domain2, domain3]
```

複数のドメインの証明書を発行するための `vercel certs` コマンドの使用。

### 証明書の削除

```bash
vercel certs rm [certificate-id]
```

ID で証明書を削除するための `vercel certs` コマンドの使用。

## ユニークなオプション

### チャレンジのみ

`--challenge-only` オプションは、証明書を発行するために必要なチャレンジのみを表示するために使用できます。

```bash
vercel certs issue foo.com --challenge-only
```

`--challenge-only` オプションを使用した `vercel certs` コマンド。

### 制限

`--limit` オプションは、`ls` を使用する際に返される証明書の最大数を指定するために使用できます。デフォルト値は `20` で、最大値は `100` です。

```bash
vercel certs ls --limit 100
```

`--limit` オプションを使用した `vercel certs ls` コマンド。

## 自動証明書管理

Vercelは、カスタムドメインのSSL/TLS証明書を自動的に発行、更新、管理します。通常、手動での証明書管理は必要ありません。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel certs`コマンドで使用できます。
