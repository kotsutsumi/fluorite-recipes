# Vercel Functionsのリージョンの設定

## 概要

Vercelプラットフォームは、デフォルトでエッジに静的コンテンツを自動的にキャッシュします。関数は、レイテンシとパフォーマンスを最適化するために、特定のリージョンで実行するように設定できます。

## デフォルトリージョン

- デフォルトリージョンはワシントンD.C.、USA(`iad1`)
- アメリカ東海岸のほとんどの外部データソースに近い場所が選ばれています

## デフォルトリージョンの設定

### ダッシュボードメソッド

1. Vercelダッシュボードからプロジェクトを選択
2. Settingsタブに移動
3. Functionsを選択
4. Function Regionsアコーディオンを使用してリージョンを選択

### プロジェクト設定(vercel.json)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["sfo1"]
}
```

### Vercel CLI

プロジェクトのルートディレクトリで`vercel --regions`コマンドを使用

## リージョンデプロイメントの制限

- Proユーザー: 最大3つのリージョン
- Enterpriseユーザー: 無制限のリージョン

## 自動フェイルオーバー(Enterpriseのみ)

### Node.jsランタイムのフェイルオーバー

- マルチリージョンの冗長性を有効化
- 障害時に最も近いリージョンへ自動的に再ルーティング

設定例:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functionFailoverRegions": ["dub1", "fra1"]
}
```

## 利用可能なリージョン

完全な詳細については、Vercelの[リージョンリスト](/docs/regions#region-list)を参照してください。

## 主要な考慮事項

- 関数とデータソース間の物理的距離がレイテンシに影響
- 主要なデータソースに近いリージョンを選択
- ユーザーの地理的分布を考慮
