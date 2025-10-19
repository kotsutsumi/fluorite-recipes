# セッショントレーシング

## 概要

セッショントレーシングは、アプリケーションとVercelインフラストラクチャの相互作用に関するインサイトを提供し、以下を理解するのに役立ちます：

- ルーティング、ミドルウェア、キャッシング、Function起動
- ユーザーがインストルメント化したスパンの検査
- パフォーマンスのボトルネックの特定
- アプリケーションスパンと一緒にVercelインフラストラクチャスパンを表示

## トレースの構造

トレースには以下が表示されます：

- **Vercelインフラストラクチャスパン**: 三角形のアイコンが付いた白黒表示
- **ユーザースパン**: OpenTelemetryを使用している場合
- **Fetchスパン**: 外部APIリクエスト

### トレースの操作

- スパンをクリックして詳細を表示
- クリックしてドラッグしてズームイン
- 右下のズームコントロールを使用

## 前提条件

- Vercelアカウント
- Vercelプロジェクト
- プレビューまたは本番環境でToolbarが有効

## ページトレースの実行

1. Vercel toolbarで「Tracing」をクリック
2. 「Run Page Trace」を選択
3. ページがリロードされる
4. トレースステータスがトーストに表示される
5. トーストをクリックしてダッシュボードでトレースを表示

## 以前のセッショントレースの表示

1. Toolbarで「Tracing」をクリック
2. 「View Previous Session Traces」を選択
3. フィルタリングされたトレースでダッシュボードが開く

## カスタムスパンの追加

OpenTelemetryを使用してカスタムスパンを追加できます：

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('custom-tracer');

async function performOperation() {
  const span = tracer.startSpan('operation-name');

  try {
    // 操作ロジック
    span.setAttributes({
      'custom.attribute': 'value',
      'operation.type': 'database-query',
    });

    // 子スパンの作成
    const childSpan = tracer.startSpan('child-operation', {
      parent: span,
    });

    // 子操作の実行
    childSpan.end();

  } finally {
    span.end();
  }
}
```

## トレースの分析

### パフォーマンスのボトルネックの特定

1. トレースのタイムラインを確認
2. 最も長いスパンを特定
3. スパンの詳細を調査
4. 最適化の機会を見つける

### リクエストフローの理解

- ミドルウェアの実行を追跡
- キャッシュヒット/ミスを確認
- Function起動時間を分析
- 外部API呼び出しを監視

## 使用量と料金

トレーシングはすべてのプランで利用可能で、チームあたり月間100万スパンの制限があります。

### 制限の管理

- サンプリングレートの調整
- 不要なスパンの削除
- 重要なパスに焦点を当てる

## ベストプラクティス

### 効果的なトレーシング

- 意味のあるスパン名を使用
- 関連する属性を追加
- スパンを適切にネストする
- エラーを記録

### パフォーマンスの考慮事項

- 過度なインストルメンテーションを避ける
- サンプリングを使用
- 重要な操作に焦点を当てる

### デバッグ

- トレースIDを使用してリクエストを追跡
- エラースパンを特定
- タイミング情報を分析

## 使用例

### API呼び出しの追跡

```typescript
import { trace } from '@opentelemetry/api';

async function fetchUserData(userId: string) {
  const tracer = trace.getTracer('api-tracer');
  const span = tracer.startSpan('fetch-user-data');

  span.setAttributes({
    'user.id': userId,
    'operation.type': 'api-call',
  });

  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();

    span.setAttributes({
      'http.status_code': response.status,
      'response.size': JSON.stringify(data).length,
    });

    return data;
  } catch (error) {
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
}
```

### データベースクエリの追跡

```typescript
async function queryDatabase(query: string) {
  const tracer = trace.getTracer('database-tracer');
  const span = tracer.startSpan('database-query');

  span.setAttributes({
    'db.system': 'postgresql',
    'db.statement': query,
  });

  try {
    const result = await db.query(query);
    span.setAttributes({
      'db.rows_returned': result.length,
    });
    return result;
  } finally {
    span.end();
  }
}
```

## トラブルシューティング

### トレースが表示されない

- Toolbarが有効になっていることを確認
- 適切な環境を選択
- ブラウザのコンソールでエラーを確認

### スパンが欠けている

- OpenTelemetryが正しく設定されていることを確認
- スパンが適切に終了していることを確認
- サンプリング設定を確認

## 次のステップ

- [OpenTelemetry統合](/docs/otel)を設定
- [Vercel Toolbar](/docs/vercel-toolbar)を探索
- [可観測性](/docs/observability)を深く理解

## 関連リソース

- [Vercel Toolbarドキュメント](/docs/vercel-toolbar)
- [可観測性の概要](/docs/observability)
- [OpenTelemetry統合](/docs/otel)
- [ランタイムログ](/docs/logs/runtime)
