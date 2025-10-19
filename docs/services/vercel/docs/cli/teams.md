# vercel teams

`vercel teams` コマンドは、[Teams](/docs/accounts/create-a-team) を管理するために使用され、[Team Members](/docs/rbac/managing-team-members) の一覧表示、追加、招待の機能を提供します。

## 使用方法

### チームメンバーの一覧表示

```bash
vercel teams list
```

現在のチームのメンバーを一覧表示します。

短縮形：

```bash
vercel teams ls
```

## 拡張使用法

### 新しいチームの作成

```bash
vercel teams add
```

新しいチームを作成します。対話的にチーム名とプランを選択します。

### チームメンバーの招待

```bash
vercel teams invite [email]
```

新しいチームメンバーをメールアドレスで招待します。

例：

```bash
vercel teams invite user@example.com
```

### 複数のメンバーを招待

```bash
vercel teams invite user1@example.com user2@example.com
```

## チーム管理の機能

- メンバーの招待と削除
- ロールと権限の管理
- チーム設定の変更
- 請求情報の管理

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

- [`vercel switch`](/docs/cli/switch) - チーム間の切り替え
- [`vercel whoami`](/docs/cli/whoami) - 現在のユーザーとチームを表示

## ダッシュボードでの管理

より詳細なチーム管理については、Vercelダッシュボードのチーム設定を使用することをお勧めします。
