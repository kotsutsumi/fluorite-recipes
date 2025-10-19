# vercel list

`vercel list` コマンド（`vercel ls` と省略可）は、現在リンクされているVercelプロジェクトの最近のデプロイメントのリストを提供します。

## 使用方法

```bash
vercel list
```

現在リンクされているVercelプロジェクトの複数のデプロイメントに関する情報を取得するために使用します。

または、短縮形：

```bash
vercel ls
```

## 拡張された使用方法

### 特定のプロジェクトのデプロイメントを表示

```bash
vercel list [project-name]
```

特定のVercelプロジェクトのデプロイメントに関する情報を取得するために使用します。

### ステータスでフィルタリング

```bash
vercel list [project-name] --status READY,BUILDING
```

ステータスでフィルタリングしたデプロイメントの情報を取得するために使用します。

### メタデータでフィルタリング

```bash
vercel list [project-name] --meta foo=bar
```

メタデータでフィルタリングしたデプロイメントの情報を取得するために使用します。

### 保持ポリシーでフィルタリング

```bash
vercel list [project-name] --policy errored=6m
```

保持ポリシーを含むデプロイメントの情報を取得するために使用します。

## ユニークなオプション

### メタ

`--meta`オプション（省略形 `-m`）は、Vercelデプロイメントのメタデータに基づいて結果をフィルタリングするために使用できます。

```bash
vercel list --meta key1=value1 key2=value2
```

デプロイメントのメタ値を確認するには、[GET /deployments/{idOrUrl}](https://vercel.com/docs/rest-api/reference/endpoints/deployments/get-a-deployment-by-id-or-url) を使用します。

### ステータス

`--status` オプションは、特定のステータスのデプロイメントのみを表示します：

- `READY` - 正常にデプロイされたもの
- `BUILDING` - ビルド中
- `ERROR` - エラーが発生したもの
- `CANCELED` - キャンセルされたもの

### リミット

`--limit` オプションは、返されるデプロイメントの最大数を指定します。

```bash
vercel list --limit 50
```

## 出力情報

リストには以下の情報が表示されます：

- デプロイメントURL
- デプロイメント状態
- 作成日時
- ブランチ名
- コミット情報

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel list`コマンドで使用できます。
