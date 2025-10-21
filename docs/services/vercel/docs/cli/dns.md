# vercel dns

`vercel dns` コマンドは、ドメインのDNSレコードを管理するために使用されます。リスト、追加、削除、インポートなどの機能を提供します。

新しいDNSレコードを追加する際は、レコードが反映されるまで最大24時間かかる場合があります。

## 使用方法

```bash
vercel dns ls
```

現在のスコープ下のすべてのDNSレコードを一覧表示します。

## 拡張使用方法

### A/AAAA/ALIAS/CNAMEレコードの追加

```bash
vercel dns add [domain] [subdomain] [A || AAAA || ALIAS || CNAME || TXT] [value]
```

サブドメインのAレコードを追加する例。

### MXレコードの追加

```bash
vercel dns add [domain] '@' MX [record-value] [priority]
```

ドメインのMXレコードを追加する例。

### SRVレコードの追加

```bash
vercel dns add [domain] [name] SRV [priority] [weight] [port] [target]
```

ドメインのSRVレコードを追加する例。

### CAAレコードの追加

```bash
vercel dns add [domain] [name] CAA '[flags] [tag] "[value]"'
```

ドメインのCAAレコードを追加する例。

### レコードの削除

```bash
vercel dns rm [record-id]
```

ドメインのレコードを削除する例。

### ゾーンファイルのインポート

```bash
vercel dns import [domain] [path-to-zonefile]
```

ドメインのゾーンファイルをインポートする例。

## サポートされるレコードタイプ

- A - IPv4アドレス
- AAAA - IPv6アドレス
- ALIAS - エイリアス
- CNAME - 正規名
- TXT - テキストレコード
- MX - メールエクスチェンジ
- SRV - サービスロケーション
- CAA - 証明機関認証

## ユニークなオプション

### 制限

`--limit` オプションは、返されるDNSレコードの最大数を指定します。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel dns`コマンドで使用できます。
