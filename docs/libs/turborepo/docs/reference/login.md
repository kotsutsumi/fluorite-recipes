# login

Remote Cacheプロバイダーにログインします。

## 基本的な使用方法

```bash
turbo login
```

デフォルトプロバイダー: Vercel

別のプロバイダーを指定するには、`--api` オプションを使用します。

## フラグオプション

### `--api <url>`

目的: Remote CacheプロバイダーのAPI URLを設定します。

例:
```bash
turbo login --api=https://acme.com/api
```

### `--login <url>`

目的: トークンを動的に生成するログインリクエストのURLを設定します。

例:
```bash
turbo login --login=https://acme.com
```

### `--sso-team <team>`

目的: チームスラッグを提供することで、SSO対応チームに接続します。

例:
```bash
turbo login --sso-team=slug-for-team
```

### `--manual`

目的: ログインサービスからリクエストする代わりに、手動でトークンを入力します。
