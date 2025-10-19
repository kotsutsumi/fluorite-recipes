# vercel cache

`vercel cache` コマンドは、プロジェクトの [CDNキャッシュ](https://vercel.com/docs/edge-cache) と [データキャッシュ](https://vercel.com/docs/data-cache) を管理するために使用されます。

## 使用方法

```bash
vercel cache purge
```

現在のプロジェクトのCDNキャッシュとデータキャッシュを消去します。

## 拡張された使用方法

### CDNキャッシュの消去

```bash
vercel cache purge --type cdn
```

現在のプロジェクトのCDNキャッシュを消去します。

### データキャッシュの消去

```bash
vercel cache purge --type data
```

現在のプロジェクトのデータキャッシュを消去します。

### キャッシュタグの無効化

```bash
vercel cache invalidate --tag foo
```

現在のプロジェクトで "foo" タグに関連付けられたキャッシュコンテンツを無効化します。この後のリクエストは、STALEを提供し、バックグラウンドで再検証されます。

### キャッシュタグの危険な削除

```bash
vercel cache dangerously-delete --tag foo
```

現在のプロジェクトで "foo" タグに関連付けられたキャッシュコンテンツを危険に削除します。この後のリクエストは、MISSを提供し、再検証中にブロックされます。

## ユニークなオプション

### Yes

`--yes` オプションは、キャッシュ消去時の確認プロンプトをバイパスするために使用できます。

```bash
vercel cache purge --yes
```

### Type

`--type` オプションは、消去するキャッシュのタイプを指定します：

- `cdn` - CDNキャッシュのみ
- `data` - データキャッシュのみ

### Tag

`--tag` オプションは、特定のタグに関連付けられたキャッシュを操作します。

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel cache`コマンドで使用できます。
