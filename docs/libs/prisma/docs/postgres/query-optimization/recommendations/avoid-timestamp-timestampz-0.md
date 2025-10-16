# timestamp(0)またはtimestamptz(0)の使用

Optimizeは、PostgreSQLで`@db.Timestamp(0)`および`@db.Timestamptz(0)`ネイティブタイプの使用によって引き起こされるパフォーマンス問題を特定して解決するのに役立つ推奨事項を提供します。

以下の`User`モデル内で`@db.Timestamp(0)`および`@db.Timestamptz(0)`ネイティブタイプが使用されています:

```
model User {
  // ...
  date DateTime @db.Timestamp(0)
  deletedAt DateTime @db.Timestamptz(0)
  // ...
}
```

## なぜこれが問題なのか

精度が`0`の`@db.Timestamp(n)`または`@db.Timestamptz(n)`カラムを使用すると、データベースは時間を最も近い秒に丸めるため、予期しない結果につながる可能性があります。

たとえば、`15:30:45.678`などの現在時刻をこの精度のカラムに挿入すると、`15:30:46`に切り上げられます。この動作により、記録された時間が元の時間と比較して最大0.5秒未来に表示される可能性があり、正確な時間精度が重要な場合に驚くかもしれません。
