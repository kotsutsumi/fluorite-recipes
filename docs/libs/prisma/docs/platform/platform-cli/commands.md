# プラットフォームCLI: コマンド

## はじめに

Prisma Data Platform CLIコマンドを使用するには:
- Prisma CLIをバージョン`5.10.0`以降に更新
- `prisma platform`コマンドを使用
- `--early-access`フラグを含める

💡 注意: Early Accessの期間中は常に`--early-access`フラグを使用してください。

## 認証コマンド

### `platform auth login`
Prisma Data Platformアカウントログイン用のブラウザウィンドウを開く
```
npx prisma platform auth login --early-access
```

### `platform auth logout`
Prisma Data Platformアカウントからログアウト
```
npx prisma platform auth logout --early-access
```

### `platform auth show`
現在認証されているユーザーに関する情報を表示
```
npx prisma platform auth show --early-access
```

## ワークスペース管理

### `platform workspace show`
アカウントで利用可能なすべてのワークスペースをリスト
```
npx prisma platform workspace show --early-access
```

## プロジェクト管理

### `platform project show`
指定されたワークスペース内のプロジェクトをリスト
```
npx prisma platform project show --workspace $INSERT_WORKSPACE_ID --early-access
```

### `platform project create`
ワークスペース内に新しいプロジェクトを作成
```
npx prisma platform project create --workspace $INSERT_WORKSPACE_ID --name "INSERT_PROJECT_NAME" --early-access
```

### `platform project delete`
指定されたプロジェクトを削除
```
npx prisma platform project delete --project $INSERT_PROJECT_ID --early-access
```

## 環境管理

### `platform environment show`
プロジェクト内の環境をリスト
```
npx prisma platform environment show --project $INSERT_PROJECT_ID --early-access
```

### `platform environment create`
プロジェクト内に新しい環境を作成
```
npx prisma platform environment create --project $INSERT_PROJECT_ID --name $INSERT_ENVIRONMENT_NAME --early-access
```

### `platform environment delete`
指定された環境を削除
```
npx prisma platform environment delete --environment $INSERT_ENVIRONMENT_ID --early-access
```

## APIキー管理

### `platform apikey show`
環境のAPIキーをリスト
```
npx prisma platform apikey show --environment $INSERT_ENVIRONMENT_ID --early-access
```

このドキュメントは、Prisma Data Platformをコマンドラインから管理するための包括的なCLIコマンドリファレンスを提供します。
