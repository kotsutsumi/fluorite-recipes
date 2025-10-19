# vercel domains

`vercel domains` コマンドは、現在のスコープ内のドメインを管理するために使用され、ドメインの一覧表示、検査、追加、削除、購入、移動、転入、および検証の機能を提供します。

Vercelダッシュボードのプロジェクトのドメインタブから、より詳細なオプションと高度な制御でドメインを管理できます。

## 使用方法

```bash
vercel domains ls
```

現在のスコープ内のすべてのドメインを一覧表示します。

## 拡張使用法

### ドメインの検査

```bash
vercel domains inspect [domain]
```

特定のドメインに関する情報を取得します。

### ドメインの追加

```bash
vercel domains add [domain] [project]
```

現在のスコープまたはVercelプロジェクトにドメインを追加します。

### ドメインの削除

```bash
vercel domains rm [domain]
```

現在のスコープからドメインを削除します。

### ドメインの購入

```bash
vercel domains buy [domain]
```

現在のスコープのドメインを購入します。

### ドメインの移動

```bash
vercel domains move [domain] [scope-name]
```

ドメインを別のスコープに移動します。

### ドメインの転入

```bash
vercel domains transfer-in [domain]
```

現在のスコープにドメインを転入します。

## ユニークなオプション

### Yes

`--yes` オプションは、ドメイン削除時の確認プロンプトをスキップするために使用できます。

```bash
vercel domains rm [domain] --yes
```

### Limit

`--limit` オプションは、`ls` を使用する際に返されるドメインの最大数を指定するために使用できます。デフォルト値は `20`、最大値は `100` です。

```bash
vercel domains ls --limit 100
```

## ダッシュボードでの管理

より詳細なドメイン管理オプションについては、Vercelダッシュボードのプロジェクトのドメインタブを使用することをお勧めします。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel domains`コマンドで使用できます。
