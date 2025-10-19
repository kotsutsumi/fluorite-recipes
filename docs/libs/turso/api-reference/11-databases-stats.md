# Databases API - データベース統計の取得

データベースの上位クエリとその統計情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/databases/{databaseName}/stats
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |
| `databaseName` | string | はい | データベース名 |

## レスポンス

```typescript
interface DatabaseStatsResponse {
  top_queries: QueryStats[];
}

interface QueryStats {
  query: string;         // SQLクエリ
  rows_read: number;     // 読み取り行数
  rows_written: number;  // 書き込み行数
}
```

### レスポンス例

```json
{
  "top_queries": [
    {
      "query": "SELECT COUNT(*), CustomerID FROM Orders GROUP BY CustomerID HAVING COUNT(*) > 5;",
      "rows_read": 15420,
      "rows_written": 0
    },
    {
      "query": "INSERT INTO logs (timestamp, message, level) VALUES (?, ?, ?);",
      "rows_read": 0,
      "rows_written": 8650
    },
    {
      "query": "SELECT * FROM users WHERE email = ?;",
      "rows_read": 3210,
      "rows_written": 0
    }
  ]
}
```

## 使用例

### cURL

```bash
curl -L 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/stats' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

### JavaScript / TypeScript

```typescript
async function getDatabaseStats(
  organizationSlug: string,
  databaseName: string
) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/stats`,
    {
      headers: { 'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}` }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

const stats = await getDatabaseStats('my-org', 'my-db');

// 上位クエリを表示
console.log('=== Top Queries ===');
stats.top_queries.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.query}`);
  console.log(`   Rows read: ${q.rows_read.toLocaleString()}`);
  console.log(`   Rows written: ${q.rows_written.toLocaleString()}`);
});
```

### クエリ分析

```typescript
interface QueryAnalysis {
  totalReads: number;
  totalWrites: number;
  readQueries: QueryStats[];
  writeQueries: QueryStats[];
  heaviestQuery: QueryStats;
}

function analyzeQueries(stats: DatabaseStatsResponse): QueryAnalysis {
  const queries = stats.top_queries;

  const analysis: QueryAnalysis = {
    totalReads: queries.reduce((sum, q) => sum + q.rows_read, 0),
    totalWrites: queries.reduce((sum, q) => sum + q.rows_written, 0),
    readQueries: queries.filter(q => q.rows_read > 0 && q.rows_written === 0),
    writeQueries: queries.filter(q => q.rows_written > 0),
    heaviestQuery: queries.reduce((max, q) =>
      (q.rows_read + q.rows_written) > (max.rows_read + max.rows_written) ? q : max
    )
  };

  return analysis;
}

const stats = await getDatabaseStats('my-org', 'my-db');
const analysis = analyzeQueries(stats);

console.log('Total reads:', analysis.totalReads.toLocaleString());
console.log('Total writes:', analysis.totalWrites.toLocaleString());
console.log('Read-only queries:', analysis.readQueries.length);
console.log('Write queries:', analysis.writeQueries.length);
console.log('Heaviest query:', analysis.heaviestQuery.query);
```

### パフォーマンス最適化の提案

```typescript
function suggestOptimizations(stats: DatabaseStatsResponse) {
  const suggestions: string[] = [];

  stats.top_queries.forEach(query => {
    // 大量の行を読み取るクエリ
    if (query.rows_read > 10000) {
      suggestions.push(
        `High read count query: Consider adding indexes or pagination\n` +
        `Query: ${query.query}\n` +
        `Rows read: ${query.rows_read.toLocaleString()}`
      );
    }

    // SELECT *の使用
    if (query.query.includes('SELECT *')) {
      suggestions.push(
        `SELECT * detected: Specify only needed columns\n` +
        `Query: ${query.query}`
      );
    }

    // GROUP BYを使用する重いクエリ
    if (query.query.includes('GROUP BY') && query.rows_read > 5000) {
      suggestions.push(
        `Heavy GROUP BY query: Consider materialized views or caching\n` +
        `Query: ${query.query}\n` +
        `Rows read: ${query.rows_read.toLocaleString()}`
      );
    }
  });

  return suggestions;
}

const stats = await getDatabaseStats('my-org', 'my-db');
const optimizations = suggestOptimizations(stats);

console.log('=== Optimization Suggestions ===');
optimizations.forEach((suggestion, i) => {
  console.log(`\n${i + 1}. ${suggestion}`);
});
```

---

**参考リンク**:
- [データベース使用量の取得](./10-databases-usage.md)
- [データベース設定の更新](./09-databases-update-configuration.md)
