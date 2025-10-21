# モニタリングリファレンス

## 概要

モニタリングリファレンスは、Vercelデプロイメントのパフォーマンスメトリクスをクエリおよび分析するための詳細を提供します。

### サンセット通知

- Proプラン向けのモニタリングは2025年11月の次回請求サイクル終了時にサンセット予定
- Observability Queryへの移行を推奨

## 主要な句

### Visualize（可視化）

表示するクエリデータを選択します。フィールドには以下が含まれます：

#### 利用可能なフィールド

- **Edge Requests**: エッジリクエスト
- **Duration**: 期間
- **Function Invocations**: Function呼び出し
- **Bandwidth**: 帯域幅
- **Memory Usage**: メモリ使用量

#### 集約方法

- **Count**: カウント
- **Sum**: 合計
- **Minimum/Maximum**: 最小/最大
- **Percentiles**: パーセンタイル（p75、p90、p95、p99）
- **Percentages**: パーセンテージ

### Where句

演算子を使用してクエリデータをフィルタリング：

- `=`（完全一致）
- `in`（複数の値）
- `and`/`or`（論理演算）
- `not`（否定）
- `like`（パターンマッチング）
- `startsWith`（前方一致）
- `match`（正規表現）

#### Where句の例

```sql
host = 'example.com'
status in (500, 502, 503)
path like '/api%'
duration > 1000
```

### Group By（グループ化）

フィールド値の組み合わせの統計を計算し、各グループを個別の色/行として表示します。

#### グループ化の例

```sql
Group By: host
Group By: request_path
Group By: cdn_region
```

### Limit（制限）

表示される最大結果数を定義します。超過分は「Other(s)」としてコンパイルされます。

#### Limitオプション

- 5、10、25、50、100件の結果

## サポートされているフィールド

### リクエストフィールド

- **Host**: ホスト名
- **Path Type**: パスタイプ
- **Project ID**: プロジェクトID
- **Status**: ステータスコード
- **Environment**: 環境
- **Request Method**: リクエストメソッド
- **User Agent**: ユーザーエージェント
- **Region**: リージョン

### パスタイプ

- **Static**: 静的
- **Function**: Function
- **External**: 外部
- **Edge**: エッジ
- **Prerender**: プリレンダー

## チャートとテーブルビュー

### チャートビュー

- データの粒度を表示（時間単位/日単位）
- 時間経過に伴う傾向を可視化
- 複数のグループを色分け

### テーブルビュー

- クエリ結果を要約
- 詳細な数値データ
- エクスポート可能

## サンプルクエリ

### ホスト名別リクエスト

```sql
Visualize: requests
Group By: host
```

### プロジェクト別帯域幅

```sql
Visualize: bandwidth (sum)
Group By: project_id
```

### キャッシュヒット率

```sql
Visualize: requests (percentage)
Where: cache_status = 'HIT'
```

### ステータスコード分析

```sql
Visualize: requests
Where: status >= 400
Group By: status
```

### Function実行メトリクス

```sql
Visualize: function_duration (p95)
Group By: function_name
Limit: 10
```

## ベストプラクティス

### 効果的なクエリ作成

- 特定の質問から開始
- 適切なフィールドを選択
- 意味のあるグループ化を使用

### パフォーマンス考慮事項

- 適切な時間範囲を使用
- 必要なフィルタのみを適用
- Limit句でデータ量を管理

### データ解釈

- パーセンタイルを理解
- 外れ値を考慮
- コンテキストでデータを分析

## 次のステップ

- [Observability Query](/docs/query)への移行
- より高度なクエリを作成
- カスタムダッシュボードを構築

## 関連リソース

- [モニタリングの概要](/docs/query/monitoring)
- [モニタリングクイックスタート](/docs/query/monitoring/quickstart)
- [料金と制限](/docs/query/monitoring/limits-and-pricing)
