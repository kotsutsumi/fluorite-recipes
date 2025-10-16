# サーバーレスパフォーマンス

Drizzle ORMのサーバーレス環境でのパフォーマンスガイダンスです。

## サーバーレスパフォーマンスに関する主な洞察

- AWS LambdaやVercel Server Functionsなどのサーバーレス関数は、大幅なパフォーマンス向上を提供可能
- これらの関数は最大15分実行でき、データベース接続とプリペアドステートメントを再利用できる
- エッジ関数は通常、各呼び出し後にリセットされ、最小限のパフォーマンス優位性を提供

## 推奨される接続戦略

```typescript
const databaseConnection = ...;
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

// AWSハンドラーの例
export const handler = async (event: APIGatewayProxyEvent) => {
  return prepared.execute();
}
```

## 主な推奨事項

ハンドラースコープの外でデータベース接続とプリペアドステートメントを宣言し、関数呼び出し間で再利用できるようにして、全体的なパフォーマンスを向上させます。

この戦略により、接続のオーバーヘッドを削減し、サーバーレス環境でのクエリ実行を最適化できます。
