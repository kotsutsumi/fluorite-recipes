# Vercel プロジェクト設定 (vercel.json)

`vercel.json` ファイルは、Vercelのデフォルトの動作を設定およびオーバーライドするために使用されます。プロジェクトのルートディレクトリに作成し、以下の設定が可能です。

## 主な設定プロパティ

### スキーマ自動補完

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json"
}
```

### buildCommand

ビルドコマンドをオーバーライドします：

```json
{
  "buildCommand": "next build"
}
```

### cleanUrls

HTMLファイルと関数の拡張子を削除します：

```json
{
  "cleanUrls": true
}
```

### crons

クロンジョブを設定します：

```json
{
  "crons": [
    {
      "path": "/api/every-minute",
      "schedule": "* * * * *"
    }
  ]
}
```

### devCommand

開発コマンドをオーバーライドします：

```json
{
  "devCommand": "next dev"
}
```

### regions

Vercel関数の実行リージョンを定義します：

```json
{
  "regions": ["sfo1"]
}
```

### redirects

URLのリダイレクトを設定します。

### headers

カスタムHTTPヘッダーを設定します。

### rewrites

URLの書き換えルールを定義します。

## 詳細

プロジェクト設定の詳細については、[プロジェクト設定ドキュメント](/docs/project-configuration/project-settings)を参照してください。
