# デプロイメント統合アクション

デプロイメント統合アクションにより、統合プロバイダーは[統合リソース](/docs/integrations/create-integration/native-integration#resources)のタスクを実行できます。例えば、データベースのブランチ作成、環境変数の設定、準備状況チェックの実行などが可能です。これにより、統合ユーザーはデプロイメント中にこれらのアクションを自動的に設定およびトリガーできます。

例えば、デプロイメント統合アクションをチェックAPIと組み合わせて、デプロイメントにテスト機能を提供する[統合を作成](/docs/checks#build-your-checks-integration)できます。

## デプロイメントアクションの仕組み

1. **アクション宣言**:
   - 統合[製品](/docs/integrations/create-integration/native-integration#resources)が、IDと名前、メタデータを持つデプロイメントアクションを宣言します。
   - アクションは、統合ユーザーが変更できる設定オプションを指定できます。
   - アクションには、「このアクションはプレビュー時に実行する必要がある」などのデフォルトアクションの提案を含めることができます。

2. **プロジェクト設定**:
   - リソースがプロジェクトに接続されると、統合ユーザーはデプロイメント中にトリガーするアクションを選択できます。
   - 統合ユーザーには、アクション宣言で設定された提案が表示されます。

3. **デプロイメント実行**:
   - デプロイメントが作成されると、設定されたアクションがデプロイメントに登録されます。
   - Vercelは統合サーバーのWebhookエンドポイントを呼び出して、アクションを実行します。
   - 統合サーバーは必要なタスク（例：データベースブランチの作成）を実行します。
   - アクションの結果は、デプロイメントログとダッシュボードに表示されます。

## デプロイメントアクションの実装

### 1. アクションの宣言

統合サーバーで、利用可能なデプロイメントアクションを宣言します：

```typescript
{
  "actions": [
    {
      "id": "create-database-branch",
      "name": "データベースブランチを作成",
      "description": "プレビューデプロイメント用の新しいデータベースブランチを作成します",
      "type": "deployment",
      "triggers": ["deployment.created"],
      "configuration": {
        "branchName": {
          "type": "string",
          "description": "作成するブランチの名前",
          "default": "preview-${deployment.id}"
        }
      },
      "suggestions": {
        "environments": ["preview"],
        "enabled": true
      }
    }
  ]
}
```

### 2. Webhookエンドポイントの実装

デプロイメントアクションをトリガーするWebhookを処理するエンドポイントを実装します：

```typescript
app.post('/webhook', async (req, res) => {
  const { type, payload } = req.body;

  if (type === 'deployment.created') {
    const { deployment, action } = payload;

    // アクション設定を取得
    const { branchName } = action.configuration;

    // データベースブランチを作成
    const branch = await createDatabaseBranch({
      name: branchName,
      deploymentId: deployment.id
    });

    // 環境変数を更新
    await updateEnvironmentVariables(deployment.projectId, {
      DATABASE_URL: branch.connectionString
    });

    // アクション結果を返す
    res.json({
      status: 'success',
      message: `データベースブランチ ${branchName} が作成されました`,
      data: {
        branchId: branch.id,
        connectionString: branch.connectionString
      }
    });
  }
});
```

### 3. アクション結果の報告

アクションの実行結果をVercelに報告します：

```typescript
{
  "status": "success" | "failure" | "pending",
  "message": "アクションの結果を説明するメッセージ",
  "data": {
    // アクション固有のデータ
  },
  "logs": [
    {
      "timestamp": "2023-10-20T10:30:00Z",
      "message": "データベースブランチの作成を開始"
    },
    {
      "timestamp": "2023-10-20T10:30:15Z",
      "message": "データベースブランチが正常に作成されました"
    }
  ]
}
```

### 4. エラーハンドリング

アクションの実行中にエラーが発生した場合、適切なエラー情報を返します：

```typescript
{
  "status": "failure",
  "message": "データベースブランチの作成に失敗しました",
  "error": {
    "code": "BRANCH_CREATION_FAILED",
    "details": "接続タイムアウト: データベースサーバーに到達できません"
  }
}
```

## ユースケース

### データベースブランチング

プレビューデプロイメントごとに独立したデータベースブランチを作成：

- Gitブランチに対応するデータベースブランチを自動作成
- プレビュー環境に適切な接続文字列を設定
- デプロイメント削除時にブランチをクリーンアップ

### 環境変数の動的設定

デプロイメントに基づいて環境変数を動的に設定：

- 環境固有の設定を適用
- 一時的なAPIキーを生成
- 機能フラグを設定

### 準備状況チェック

デプロイメント前にリソースの準備状況を確認：

- データベースマイグレーションの実行
- キャッシュのウォームアップ
- 外部サービスの可用性確認

### テスト実行

デプロイメント後に自動テストを実行：

- 統合テストの実行
- パフォーマンステストの実行
- セキュリティスキャンの実行

## ベストプラクティス

- **冪等性**: アクションは複数回実行されても安全であるべき
- **タイムアウト**: 長時間実行されるアクションにはタイムアウトを設定
- **詳細なログ**: アクションの進行状況を詳細にログに記録
- **ロールバック**: 失敗時に変更をロールバックする機能を提供
- **非同期処理**: 時間のかかる操作は非同期で処理
