# vercel switch

`vercel switch` コマンドは、Vercel CLIで異なるチームスコープに切り替えるために使用されます。

## 使用方法

### 対話的にチームを選択

```bash
vercel switch
```

チームのリストから選択してチームスコープを変更します。

### 特定のチームに直接切り替え

```bash
vercel switch [team-name]
```

指定したチームスコープに直接切り替えます。

## スコープとは

スコープは、Vercelでのプロジェクトとリソースの所有者を表します：

- 個人アカウント（Hobby）
- チームアカウント（Pro/Enterprise）

## 使用シナリオ

- 個人プロジェクトとチームプロジェクト間の切り替え
- 複数のチームに所属している場合のチーム切り替え
- CI/CD環境でのスコープ指定

## 例

```bash
# チームリストから選択
vercel switch

# 特定のチームに切り替え
vercel switch my-company

# 個人アカウントに切り替え
vercel switch my-username
```

## 現在のスコープの確認

現在のスコープを確認するには：

```bash
vercel whoami
```

## グローバルオプション

以下のグローバルオプションを使用できます：

- `--cwd`
- `--debug`
- `--global-config`
- `--help`
- `--local-config`
- `--no-color`
- `--scope`
- `--token`

詳細は[グローバルオプションセクション](/docs/cli/global-options)を参照してください。

## 関連コマンド

- [`vercel whoami`](/docs/cli/whoami) - 現在のユーザーとスコープを表示
- [`vercel teams`](/docs/cli/teams) - チームの管理
