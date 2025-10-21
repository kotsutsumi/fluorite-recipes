# vercel remove

`vercel remove`（短縮形: `vercel rm`）は、デプロイメントをIDまたは特定のVercelプロジェクトから削除するために使用するCLIコマンドです。

## 使用方法

### 単一デプロイメントの削除

```bash
vercel remove [deployment-url]
```

指定したデプロイメントを削除します。

短縮形：

```bash
vercel rm [deployment-url]
```

### 拡張された使用方法

#### 複数のデプロイメントを削除

```bash
vercel remove [deployment-url-1 deployment-url-2]
```

複数のデプロイメントを一度に削除します。

#### プロジェクトの全デプロイメントを削除

```bash
vercel remove [project-name]
```

プロジェクト内のすべてのデプロイメントを削除します。

## オプション

### Safe オプション

`--safe`（短縮形: `-s`）オプションは、アクティブなプレビューURLまたは本番ドメインを持つデプロイメントのスキップを可能にします。

```bash
vercel remove my-deployment --safe
```

### Yes オプション

`--yes`（短縮形: `-y`）オプションは、削除の確認ステップをスキップします。

```bash
vercel remove my-deployment --yes
```

## 注意事項

- 削除されたデプロイメントは復元できません
- 本番環境のデプロイメントを削除する場合は注意が必要
- `--safe`オプションの使用を推奨

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

## 関連コマンド

- [`vercel list`](/docs/cli/list) - デプロイメントの一覧表示
- [`vercel inspect`](/docs/cli/inspect) - デプロイメント情報の確認
