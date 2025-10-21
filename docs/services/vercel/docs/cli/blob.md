# vercel blob

`vercel blob` コマンドは、[Vercel Blob](/docs/storage/vercel-blob) ストレージを操作するために使用され、ファイルのアップロード、一覧表示、削除、コピー、および Blob ストアの管理を行うことができます。

詳細については、[Vercel Blob ドキュメント](/docs/storage/vercel-blob)と [Vercel Blob SDK リファレンス](/docs/storage/vercel-blob/using-blob-sdk)を参照してください。

## 使用方法

`vercel blob` コマンドは、以下の操作をサポートしています：

- [`list`](#list-ls) - Blob ストア内のすべてのファイルを一覧表示
- [`put`](#put) - Blob ストアにファイルをアップロード
- [`del`](#del) - Blob ストアからファイルを削除
- [`copy`](#copy-cp) - Blob ストア内のファイルをコピー
- [`store add`](#store-add) - 新しい Blob ストアを追加
- [`store remove`](#store-remove-rm) - Blob ストアを削除
- [`store get`](#store-get) - Blob ストアを取得

認証には、CLI は env ファイルから `BLOB_READ_WRITE_TOKEN` 値を読み取るか、[`--rw-token` オプション](#rw-token)を使用できます。

## サブコマンド

### list (ls)

```bash
vercel blob list
```

Blob ストア内のすべてのファイルを一覧表示するには、`vercel blob list` コマンドを使用します。

### put

```bash
vercel blob put [path-to-file]
```

Blob ストアにファイルをアップロードするには、`vercel blob put` コマンドを使用します。

### del

```bash
vercel blob del [blob-url]
```

Blob ストアからファイルを削除するには、`vercel blob del` コマンドを使用します。

### copy (cp)

```bash
vercel blob copy [source-url] [destination-path]
```

Blob ストア内のファイルをコピーします。

### store add

```bash
vercel blob store add
```

新しい Blob ストアを追加します。

### store remove (rm)

```bash
vercel blob store remove [store-name]
```

Blob ストアを削除します。

### store get

```bash
vercel blob store get [store-name]
```

Blob ストアの情報を取得します。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel blob`コマンドで使用できます。
