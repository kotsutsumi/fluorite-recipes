# vercel whoami

`vercel whoami` コマンドは、現在 [Vercel CLI](/cli) にログインしているユーザーのユーザー名を表示します。

## 使用方法

```bash
vercel whoami
```

現在ログインしているユーザー名とスコープを表示します。

## 出力例

```bash
$ vercel whoami
> username (Personal Account)
```

または、チームスコープの場合：

```bash
$ vercel whoami
> username (Team: my-team)
```

## 表示される情報

- ユーザー名
- 現在のスコープ（個人アカウントまたはチーム名）

## 使用シナリオ

- 現在のログイン状態を確認
- 複数のアカウントを使用している場合の確認
- CI/CD環境で正しいアカウントでログインしているか確認

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を使用できます：

- `--cwd`
- `--debug`
- `--global-config`
- `--help`
- `--local-config`
- `--no-color`
- `--scope`
- `--token`

詳細は[オプションセクション](/docs/cli/global-options)を参照してください。

## 関連コマンド

- [`vercel login`](/docs/cli/login) - Vercelにログイン
- [`vercel logout`](/docs/cli/logout) - Vercelからログアウト
- [`vercel switch`](/docs/cli/switch) - チーム間の切り替え
