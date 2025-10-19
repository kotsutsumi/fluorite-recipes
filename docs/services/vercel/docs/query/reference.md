# クエリリファレンス

## メトリック

メトリックは、表示するクエリデータを選択します。一度に1つのフィールドを選択でき、同じメトリックを異なるイベントタイプに適用できます。

### 主なメトリック

| フィールド名 | 説明 | 集約方法 |
|-----------|-------------|--------------|
| Edge Requests | エッジリクエストの数 | Count、Count per Second、Percentages |
| Duration | CDNがリクエストを処理するのにかかった時間 | Sum、Min/Max、Percentiles |
| Function Invocations | Function呼び出しの数 | Count、Count per Second、Percentages |
| Function Duration | GB時間単位のFunction期間 | Sum、Min/Max、Percentiles |
| Requests Blocked | システムまたはユーザーによってブロックされたリクエスト | Count、Count per Second、Percentages |

### 集約タイプ

集約タイプには以下が含まれます：

- **Count**: イベント数のカウント
- **Count per Second**: 1秒あたりのイベント数
- **Sum**: 値の合計
- **Sum per Second**: 1秒あたりの合計
- **Minimum**: 最小値
- **Maximum**: 最大値
- **Percentiles**: パーセンタイル
  - 75th（75パーセンタイル）
  - 90th（90パーセンタイル）
  - 95th（95パーセンタイル）
  - 99th（99パーセンタイル）
- **Percentages**: パーセンテージ

## フィルタ

フィルタは、演算子を使用して特定のクエリデータを取得する条件を定義します。

### 演算子

- `is`、`is not`: 等しい、等しくない
- `is any of`、`is not any of`: いずれか、いずれでもない
- `startsWith`: で始まる
- `endsWith`: で終わる
- `>`、`>=`、`<`、`<=`: 比較演算子

### フィルタの使用例

```
host is "example.com"
status is not 200
path startsWith "/api"
duration > 1000
```

## Group By（グループ化）

「Group By」句は、フィールド値の各組み合わせの統計を計算し、各グループをチャート内の個別の色として表示します。

### グループ化の例

- **パス別**: 各パスのメトリクスを表示
- **リージョン別**: 地理的分布を分析
- **ステータスコード別**: エラー率を追跡

## Group ByとWhereフィールド

### 主要なフィルタリングおよびグループ化フィールド

| フィールド | 説明 |
|-----------|-------------|
| Request Hostname | リクエストのホスト名 |
| Project | プロジェクト名 |
| HTTP Status | HTTPステータスコード |
| Route | ルート |
| Request Path | リクエストパス |
| Environment | 環境（Production/Preview） |
| Request Method | HTTPメソッド（GET、POST等） |
| Client IP | クライアントIPアドレス |
| Client IP Country | クライアントの国 |
| CDN Region | CDNリージョン |
| WAF Action | WAFアクション |

## クエリの例

### ホスト名別リクエスト

```
メトリック: Requests
グループ化: Request Hostname
時間範囲: Last 24 hours
```

### エラー率の追跡

```
メトリック: Requests
フィルタ: HTTP Status >= 500
グループ化: Request Path
集約: Count per Second
```

### レイテンシ分析

```
メトリック: Duration
集約: 95th Percentile
グループ化: Route
フィルタ: Environment is "production"
```

### リージョン別トラフィック

```
メトリック: Requests
グループ化: CDN Region
時間範囲: Last 7 days
```

## ベストプラクティス

### 効果的なフィルタリング

- 特定の条件に焦点を当てる
- 複数のフィルタを組み合わせる
- 関連する時間範囲を使用

### 意味のあるグループ化

- ビジネス質問に合わせる
- 適切な粒度を選択
- グループ数を管理

### パフォーマンスの考慮事項

- 必要なデータのみをクエリ
- 適切な時間範囲を使用
- 過度なグループ化を避ける

## 次のステップ

- [モニタリング](/docs/query/monitoring)について学ぶ
- [ノートブック](/docs/notebooks)を作成
- クエリを実験して練習

## 関連リソース

- [クエリの概要](/docs/query)
- [モニタリングリファレンス](/docs/query/monitoring/monitoring-reference)
- [可観測性](/docs/observability)
