# turso db inspect - データベース使用状況の検査

Turso CLIの`turso db inspect`コマンドは、データベースの使用状況、パフォーマンスメトリクス、クエリ統計を詳細に表示します。データベースの最適化やトラブルシューティングに役立ちます。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [表示される情報](#表示される情報)
- [使用例](#使用例)
- [パフォーマンス分析](#パフォーマンス分析)
- [最適化のヒント](#最適化のヒント)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db inspect <データベース名> [オプション]
```

### パラメータ

- `データベース名` (必須): 検査するデータベースの名前

## オプション

### `--queries`

データベースのクエリ統計を表示します。

```bash
turso db inspect my-database --queries
```

最も実行されたクエリ、リソース集約型のクエリなどの詳細情報が表示されます。

### `--verbose`

詳細なデータベース情報を表示します（ロケーション、インスタンスタイプなど）。

```bash
turso db inspect my-database --verbose
```

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db inspect --help
```

## 表示される情報

### 基本使用状況

```typescript
interface DatabaseUsage {
  storage: {
    totalSpace: string;        // 使用中のストレージ容量
    dataSize: string;          // 実データのサイズ
    indexSize: string;         // インデックスのサイズ
  };
  operations: {
    rowsRead: number;          // 読み取られた行数
    rowsWritten: number;       // 書き込まれた行数
    queries: number;           // 実行されたクエリ数
  };
  performance: {
    avgQueryTime: string;      // 平均クエリ時間
    slowQueries: number;       // 遅いクエリの数
  };
}
```

### クエリ統計（--queries）

```typescript
interface QueryStatistics {
  topQueries: Array<{
    sql: string;               // SQL文
    executionCount: number;    // 実行回数
    avgDuration: string;       // 平均実行時間
    rowsAffected: number;      // 影響を受けた行数
  }>;
  performance: {
    fastestQuery: string;
    slowestQuery: string;
    mostFrequent: string;
  };
}
```

### 詳細情報（--verbose）

```typescript
interface VerboseInfo {
  deployment: {
    locations: string[];       // すべてのロケーション
    instanceType: string;      // インスタンスタイプ
    replicaCount: number;      // レプリカ数
  };
  configuration: {
    extensions: boolean;       // 拡張機能の有効/無効
    sizeLimit: string;         // サイズ制限
    autoScale: boolean;        // 自動スケーリング
  };
}
```

## 使用例

### 基本的な使用状況の確認

#### データベース使用状況の表示

```bash
turso db inspect my-database
```

**出力例:**

```
Database: my-database
======================

Storage Usage:
  Total Space: 42.3 MB
  Data Size: 35.1 MB
  Index Size: 7.2 MB

Operations:
  Rows Read: 1,234,567
  Rows Written: 89,123
  Total Queries: 45,678

Performance:
  Average Query Time: 12.5 ms
  Slow Queries: 23
```

### クエリ統計の表示

#### 最も実行されたクエリを確認

```bash
turso db inspect my-database --queries
```

**出力例:**

```
Database Query Statistics
=========================

Top Executed Queries:
1. SELECT * FROM orders WHERE status = 'pending'
   Executions: 12,345
   Avg Duration: 8.2 ms
   Rows Affected: 156

2. SELECT COUNT(*) FROM orders WHERE customer_id = ?
   Executions: 8,901
   Avg Duration: 15.3 ms
   Rows Affected: 1

3. SELECT o.*, c.name FROM orders o JOIN customers c ON o.customer_id = c.id
   Executions: 5,432
   Avg Duration: 45.7 ms
   Rows Affected: 234

4. UPDATE products SET price = ? WHERE id = ?
   Executions: 3,210
   Avg Duration: 22.1 ms
   Rows Affected: 1

Performance Analysis:
  Fastest Query: 2.1 ms (SELECT id FROM cache WHERE key = ?)
  Slowest Query: 342.5 ms (Full table scan on large_table)
  Most Resource Intensive: JOIN operations on orders and customers
```

### 詳細情報の表示

```bash
turso db inspect my-database --verbose
```

**出力例:**

```
Database: my-database (Detailed)
================================

Basic Info:
  ID: abc123def456
  Version: libsql-server-0.24.1
  Group: production

Storage:
  Total Space: 42.3 MB
  Data Size: 35.1 MB
  Index Size: 7.2 MB
  Size Limit: 10 GB

Deployment:
  Primary Location: nrt (Tokyo)
  Replica Locations: lax (Los Angeles), fra (Frankfurt)
  Instance Type: Shared
  Replicas: 3

Configuration:
  Extensions: Enabled
  Auto-scaling: Enabled
  Backup: Automatic

Operations (Last 24 hours):
  Rows Read: 1,234,567
  Rows Written: 89,123
  Total Queries: 45,678

Performance Metrics:
  Average Query Time: 12.5 ms
  P95 Query Time: 45.2 ms
  P99 Query Time: 123.7 ms
  Slow Queries (>1s): 23
```

## パフォーマンス分析

### クエリパフォーマンスの監視

#### 定期的なパフォーマンスチェック

```bash
#!/bin/bash

DB_NAME="production-db"
LOG_FILE="performance-log.txt"

echo "=== Performance Check $(date) ===" >> "$LOG_FILE"
turso db inspect "$DB_NAME" --queries >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# アラートの設定
SLOW_QUERIES=$(turso db inspect "$DB_NAME" | grep "Slow Queries:" | awk '{print $3}')
if [ "$SLOW_QUERIES" -gt 100 ]; then
  echo "WARNING: High number of slow queries detected: $SLOW_QUERIES"
fi
```

#### パフォーマンスメトリクスの収集

```bash
#!/bin/bash

# 複数のデータベースのパフォーマンスを比較
DATABASES=("db1" "db2" "db3")

echo "Database Performance Comparison"
echo "================================"

for db in "${DATABASES[@]}"; do
  echo ""
  echo "Database: $db"
  turso db inspect "$db" | grep -E "(Average Query Time|Slow Queries)"
done
```

### クエリ最適化の識別

```bash
#!/bin/bash

DB_NAME="my-database"

echo "Analyzing query performance..."
turso db inspect "$DB_NAME" --queries > query-analysis.txt

# 遅いクエリを抽出
echo ""
echo "Slow Queries (>100ms):"
grep -A 2 "Duration.*ms" query-analysis.txt | grep -E "1[0-9]{2}\.|[2-9][0-9]{2}\."

echo ""
echo "Recommendations:"
echo "1. Add indexes for frequently queried columns"
echo "2. Optimize JOIN operations"
echo "3. Use prepared statements"
echo "4. Consider query result caching"
```

## 実践的なワークフロー

### 日次パフォーマンスレポート

```bash
#!/bin/bash

# 日次パフォーマンスレポートスクリプト
REPORT_DIR="./reports"
DATE=$(date +%Y%m%d)
REPORT_FILE="$REPORT_DIR/performance-report-$DATE.md"

mkdir -p "$REPORT_DIR"

cat > "$REPORT_FILE" <<EOF
# Database Performance Report
Date: $(date)

## Production Database

\`\`\`
$(turso db inspect production-db)
\`\`\`

## Query Statistics

\`\`\`
$(turso db inspect production-db --queries)
\`\`\`

## Detailed Information

\`\`\`
$(turso db inspect production-db --verbose)
\`\`\`

## Recommendations

EOF

# 推奨事項を自動生成
SLOW_QUERIES=$(turso db inspect production-db | grep "Slow Queries:" | awk '{print $3}')

if [ "$SLOW_QUERIES" -gt 50 ]; then
  echo "- ⚠️  High number of slow queries detected. Review and optimize." >> "$REPORT_FILE"
fi

echo ""
echo "Report generated: $REPORT_FILE"
```

### キャパシティプランニング

```bash
#!/bin/bash

DB_NAME="production-db"

# 現在の使用状況を取得
USAGE_INFO=$(turso db inspect "$DB_NAME")

# ストレージ使用率を計算
CURRENT_SIZE=$(echo "$USAGE_INFO" | grep "Total Space:" | awk '{print $3}')
SIZE_LIMIT=$(turso db show "$DB_NAME" | grep "Size:" | awk '{print $2}')

echo "Capacity Planning for $DB_NAME"
echo "=============================="
echo "Current Size: $CURRENT_SIZE"
echo "Size Limit: $SIZE_LIMIT"
echo ""

# 使用率に基づいた推奨
echo "Recommendations:"
if [[ "$CURRENT_SIZE" =~ "GB" ]]; then
  echo "- Consider upgrading storage capacity"
  echo "- Review and archive old data"
  echo "- Implement data retention policies"
fi
```

### パフォーマンス比較

```bash
#!/bin/bash

# 同じアプリケーションの異なる環境を比較
echo "Environment Performance Comparison"
echo "==================================="

for env in production staging development; do
  echo ""
  echo "Environment: $env"
  echo "-------------------"
  turso db inspect "${env}-db" | grep -E "(Average Query Time|Rows Read|Rows Written)"
done
```

## 最適化のヒント

### 1. インデックスの最適化

```typescript
interface IndexOptimization {
  indicators: {
    slowQueries: "遅いクエリが多い";
    highRowsRead: "読み取り行数が多い";
    frequentScans: "フルテーブルスキャンが頻繁";
  };
  actions: {
    createIndexes: "頻繁にクエリされるカラムにインデックスを追加";
    reviewExisting: "既存のインデックスを見直し";
    removeUnused: "使用されていないインデックスを削除";
  };
}
```

**実践例:**

```bash
# 遅いクエリを特定
turso db inspect my-database --queries

# データベースシェルでインデックスを追加
turso db shell my-database <<EOF
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
EOF

# 改善を確認
turso db inspect my-database --queries
```

### 2. クエリの最適化

```bash
# 最も実行されるクエリを特定
turso db inspect my-database --queries > query-stats.txt

# N+1 クエリ問題を特定
# 同じパターンのクエリが大量に実行されている場合
```

### 3. データのアーカイブ

```bash
#!/bin/bash

# 古いデータをアーカイブして容量を削減
DB_NAME="production-db"

# 現在のサイズを確認
echo "Before archival:"
turso db inspect "$DB_NAME" | grep "Total Space"

# アーカイブ処理（例：6ヶ月以上前のデータを削除）
turso db shell "$DB_NAME" <<EOF
DELETE FROM orders WHERE created_at < date('now', '-6 months');
DELETE FROM logs WHERE created_at < date('now', '-3 months');
VACUUM;
EOF

# 結果を確認
echo ""
echo "After archival:"
turso db inspect "$DB_NAME" | grep "Total Space"
```

### 4. キャッシング戦略

```typescript
interface CachingStrategy {
  identification: {
    frequentQueries: "inspect --queries で特定";
    readHeavy: "読み取りが書き込みより多い";
    predictableData: "変更頻度が低いデータ";
  };
  implementation: {
    applicationCache: "Redis, Memcached";
    queryResults: "結果セットのキャッシュ";
    embeddedReplicas: "ローカルレプリカの使用";
  };
}
```

## トラブルシューティング

### 遅いクエリの診断

```bash
#!/bin/bash

DB_NAME="my-database"

echo "Diagnosing slow queries..."

# クエリ統計を取得
turso db inspect "$DB_NAME" --queries > slow-queries.txt

# 遅いクエリ（>100ms）を抽出
echo "Queries taking more than 100ms:"
grep -B 1 -A 2 "Duration.*[1-9][0-9]{2}" slow-queries.txt

# 推奨事項を表示
echo ""
echo "Optimization recommendations:"
echo "1. Add indexes on frequently filtered columns"
echo "2. Avoid SELECT * queries"
echo "3. Use LIMIT for large result sets"
echo "4. Consider denormalization for complex JOINs"
```

### ストレージ容量の問題

```bash
#!/bin/bash

DB_NAME="my-database"

# ストレージ使用状況を確認
USAGE=$(turso db inspect "$DB_NAME")
echo "$USAGE"

# サイズ制限に近い場合
TOTAL_SPACE=$(echo "$USAGE" | grep "Total Space:" | awk '{print $3}')

echo ""
echo "Storage Analysis:"
echo "Current Usage: $TOTAL_SPACE"
echo ""
echo "Recommendations:"
echo "1. Run VACUUM to reclaim space"
echo "2. Archive old data"
echo "3. Review and remove unnecessary indexes"
echo "4. Consider increasing size limit"

# VACUUM の実行
read -p "Run VACUUM now? [y/N]: " confirm
if [ "$confirm" = "y" ]; then
  turso db shell "$DB_NAME" "VACUUM;"
  echo "VACUUM completed. Checking new size..."
  turso db inspect "$DB_NAME" | grep "Total Space"
fi
```

### パフォーマンス低下の調査

```bash
#!/bin/bash

DB_NAME="production-db"
BASELINE_FILE="baseline-performance.txt"

# ベースラインが存在しない場合は作成
if [ ! -f "$BASELINE_FILE" ]; then
  echo "Creating performance baseline..."
  turso db inspect "$DB_NAME" > "$BASELINE_FILE"
  echo "Baseline created"
  exit 0
fi

# 現在のパフォーマンスを取得
CURRENT=$(turso db inspect "$DB_NAME")

# ベースラインと比較
echo "Performance Comparison"
echo "====================="
echo ""
echo "Baseline:"
grep "Average Query Time" "$BASELINE_FILE"
echo ""
echo "Current:"
echo "$CURRENT" | grep "Average Query Time"
echo ""

# 差異を報告
echo "Analysis:"
echo "Run detailed query analysis with: turso db inspect $DB_NAME --queries"
```

## モニタリング統合

### Prometheus メトリクスのエクスポート

```bash
#!/bin/bash

# Prometheus形式でメトリクスを出力
DB_NAME="production-db"

USAGE=$(turso db inspect "$DB_NAME")

# メトリクスを抽出してPrometheus形式に変換
echo "# HELP turso_rows_read Total rows read"
echo "# TYPE turso_rows_read counter"
echo "turso_rows_read{database=\"$DB_NAME\"} $(echo "$USAGE" | grep "Rows Read:" | awk '{gsub(",",""); print $3}')"

echo "# HELP turso_rows_written Total rows written"
echo "# TYPE turso_rows_written counter"
echo "turso_rows_written{database=\"$DB_NAME\"} $(echo "$USAGE" | grep "Rows Written:" | awk '{gsub(",",""); print $3}')"
```

### アラート設定

```bash
#!/bin/bash

DB_NAME="production-db"

# しきい値の設定
SLOW_QUERY_THRESHOLD=50
AVG_QUERY_TIME_THRESHOLD=50  # ms

# メトリクスを取得
USAGE=$(turso db inspect "$DB_NAME")

SLOW_QUERIES=$(echo "$USAGE" | grep "Slow Queries:" | awk '{print $3}')
AVG_TIME=$(echo "$USAGE" | grep "Average Query Time:" | awk '{print $4}')

# アラート判定
if [ "$SLOW_QUERIES" -gt "$SLOW_QUERY_THRESHOLD" ]; then
  echo "ALERT: Slow queries exceed threshold ($SLOW_QUERIES > $SLOW_QUERY_THRESHOLD)"
  # 通知を送信（例：Slack, Email など）
fi

if (( $(echo "$AVG_TIME > $AVG_QUERY_TIME_THRESHOLD" | bc -l) )); then
  echo "ALERT: Average query time is high ($AVG_TIME ms)"
fi
```

## ベストプラクティス

### 1. 定期的な監視

```bash
# crontab エントリ
# 毎時パフォーマンスをチェック
0 * * * * /path/to/scripts/hourly-inspect.sh

# 日次レポート生成（午前1時）
0 1 * * * /path/to/scripts/daily-report.sh
```

### 2. ベースラインの確立

```bash
# 初回実行時にベースラインを設定
turso db inspect my-database > baseline-$(date +%Y%m%d).txt
turso db inspect my-database --queries > baseline-queries-$(date +%Y%m%d).txt
```

### 3. トレンド分析

```bash
#!/bin/bash

# 週次トレンド分析
DB_NAME="production-db"
WEEK=$(date +%Y-W%U)

turso db inspect "$DB_NAME" >> "trends-$WEEK.log"

# 月末にトレンドを分析
if [ $(date +%d) = "01" ]; then
  echo "Monthly trend analysis..."
  # 分析ロジック
fi
```

## 関連コマンド

- [`turso db show`](./db-show.md) - データベース基本情報を表示
- [`turso db shell`](./db-shell.md) - SQLクエリを直接実行
- [`turso db list`](./db-list.md) - データベース一覧を表示
- [`turso db create`](./db-create.md) - 新しいデータベースを作成

## 参考リンク

- [Turso パフォーマンス最適化](https://docs.turso.tech/guides/performance)
- [クエリ最適化ガイド](https://docs.turso.tech/guides/query-optimization)
- [監視とアラート](https://docs.turso.tech/guides/monitoring)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
