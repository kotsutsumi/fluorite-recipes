# Vercel SDK - ローリングリリース

段階的なデプロイメントロールアウトによるローリングリリースの管理方法を説明します。

## 📚 目次

- [概要](#概要)
- [デプロイメント戦略](#デプロイメント戦略)
- [コア操作](#コア操作)
- [実装例](#実装例)

## 概要

Vercel SDKを使用したローリングリリースにより、安定性を監視しながら新しいバージョンへのトラフィックを段階的に増やす段階的なデプロイメントロールアウトが可能になります。

```typescript
interface RollingReleaseStrategy {
  purpose: "リスク削減";
  method: "段階的トラフィック分割";
  benefit: "早期に問題を発見し、ユーザーへの影響を最小限に";
}
```

## デプロイメント戦略

### 多段階トラフィック分割アプローチ

ローリングリリースは段階的なトラフィック分割戦略を実装します：

```typescript
interface RollingReleaseStages {
  stage1: {
    traffic: "5%";
    duration: "5分待機";
  };
  stage2: {
    traffic: "25%";
    duration: "10分後に進行";
  };
  stage3: {
    traffic: "50%";
    option: "承認要求オプション";
  };
  stage4: {
    traffic: "100%";
    status: "ロールアウト完了";
  };
}
```

この段階的な方法は、最小限のユーザー影響で早期に問題を発見することでリスクを削減します。

### 段階設定

```typescript
interface Stage {
  targetPercentage: number;      // この段階のトラフィック配分
  duration: number;              // 自動進行前の待機時間（秒）
  requireApproval?: boolean;     // 手動承認ゲート
}

const defaultStages: Stage[] = [
  { targetPercentage: 5, duration: 300 },      // 5% で5分
  { targetPercentage: 25, duration: 600 },     // 25% で10分
  { targetPercentage: 50, duration: 0, requireApproval: true },  // 50% 手動承認
  { targetPercentage: 100, duration: 0 }       // 100% 完了
];
```

## コア操作

### 1. ローリングリリースの設定

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function configureRollingRelease(
  projectId: string,
  canaryDeploymentId: string,
  targetEnvironment: "production" | "preview" = "production"
) {
  try {
    const result = await vercel.deployments.createRollingRelease({
      projectId,
      requestBody: {
        canaryDeploymentId,
        targetEnvironment,
        stages: [
          { targetPercentage: 5, duration: 300 },
          { targetPercentage: 25, duration: 600 },
          { targetPercentage: 50, duration: 0, requireApproval: true },
          { targetPercentage: 100, duration: 0 }
        ]
      }
    });

    console.log('Rolling release configured:');
    console.log(`- Canary Deployment: ${canaryDeploymentId}`);
    console.log(`- Environment: ${targetEnvironment}`);
    console.log(`- Stages: ${result.stages.length}`);

    return result;
  } catch (error) {
    console.error('Failed to configure rolling release:', error);
    throw error;
  }
}
```

### 2. 手動承認

段階で承認が必要な場合、開発者はメトリクスと安定性データを確認した後、次のフェーズに明示的に進むことができます：

```typescript
async function approveRollingReleaseStage(
  projectId: string,
  releaseId: string
) {
  try {
    // ステータスチェック
    const status = await vercel.deployments.getRollingReleaseStatus({
      projectId,
      releaseId
    });

    console.log(`Current stage: ${status.currentStage}`);
    console.log(`Traffic percentage: ${status.currentPercentage}%`);

    // メトリクスと安定性を確認した後、次の段階に進む
    const result = await vercel.deployments.advanceRollingRelease({
      projectId,
      releaseId
    });

    console.log('Advanced to next stage');
    console.log(`New percentage: ${result.currentPercentage}%`);

    return result;
  } catch (error) {
    console.error('Failed to approve stage:', error);
    throw error;
  }
}
```

### 3. 強制完了

緊急プロモーション機能は、残りの段階をバイパスしてカナリアデプロイメントから即座に100%のトラフィックを提供します：

```typescript
async function forceCompleteRollingRelease(
  projectId: string,
  releaseId: string
) {
  try {
    const result = await vercel.deployments.completeRollingRelease({
      projectId,
      releaseId
    });

    console.log('Rolling release completed immediately');
    console.log('All traffic now directed to canary deployment');

    return result;
  } catch (error) {
    console.error('Failed to force complete:', error);
    throw error;
  }
}
```

緊急時や緊急ロールバックに有用です。

## 実装例

### 完全なローリングリリースワークフロー

```typescript
async function executeRollingRelease(
  projectId: string,
  canaryDeploymentId: string
) {
  console.log('Starting rolling release...\n');

  // 1. ローリングリリースを設定
  const release = await configureRollingRelease(
    projectId,
    canaryDeploymentId
  );

  console.log(`Release ID: ${release.id}\n`);

  // 2. 各段階を監視
  let currentStage = 0;
  const maxStages = release.stages.length;

  while (currentStage < maxStages) {
    const status = await vercel.deployments.getRollingReleaseStatus({
      projectId,
      releaseId: release.id
    });

    console.log(`Stage ${currentStage + 1}/${maxStages}`);
    console.log(`Traffic: ${status.currentPercentage}%`);

    const stage = release.stages[currentStage];

    if (stage.requireApproval) {
      console.log('⏸  Awaiting manual approval...');

      // 承認を待つ（実際のシナリオでは、ここでメトリクスをチェック）
      const shouldContinue = await checkMetricsAndGetApproval();

      if (!shouldContinue) {
        console.log('❌ Rolling release cancelled');
        return;
      }

      await approveRollingReleaseStage(projectId, release.id);
    } else {
      console.log(`⏳ Waiting ${stage.duration} seconds...`);
      await new Promise(resolve => setTimeout(resolve, stage.duration * 1000));
    }

    currentStage++;
  }

  console.log('\n✅ Rolling release completed successfully!');
}

async function checkMetricsAndGetApproval(): Promise<boolean> {
  // メトリクス分析ロジック
  // - エラー率
  // - レスポンスタイム
  // - ユーザーフィードバック
  // - カスタムKPI

  // この例では自動的にtrueを返す
  return true;
}
```

### エラー監視とロールバック

```typescript
async function monitorAndRollback(
  projectId: string,
  releaseId: string,
  errorThreshold: number = 0.05  // 5%エラー率
) {
  const checkInterval = 30000;  // 30秒ごとにチェック

  const monitorInterval = setInterval(async () => {
    try {
      // エラーメトリクスを取得
      const metrics = await getDeploymentMetrics(projectId, releaseId);

      const errorRate = metrics.errors / metrics.requests;

      console.log(`Error rate: ${(errorRate * 100).toFixed(2)}%`);

      if (errorRate > errorThreshold) {
        console.log('🚨 Error threshold exceeded! Rolling back...');

        // ロールバック: 前のデプロイメントに戻す
        await rollbackDeployment(projectId);

        clearInterval(monitorInterval);
      }
    } catch (error) {
      console.error('Monitoring error:', error);
    }
  }, checkInterval);
}

async function getDeploymentMetrics(projectId: string, deploymentId: string) {
  // デプロイメントメトリクスを取得するロジック
  // 実際の実装では、Vercel Analyticsまたは他の監視ツールを使用

  return {
    requests: 1000,
    errors: 25,
    avgResponseTime: 150
  };
}

async function rollbackDeployment(projectId: string) {
  // 前の安定したデプロイメントに戻す
  const deployments = await vercel.deployments.listDeployments({
    projectId,
    limit: 10
  });

  const stableDeployment = deployments.deployments.find(
    d => d.readyState === 'READY' && d.target === 'production'
  );

  if (stableDeployment) {
    await vercel.deployments.promoteDeployment({
      deploymentId: stableDeployment.uid
    });

    console.log(`✓ Rolled back to ${stableDeployment.uid}`);
  }
}
```

## キーパラメータ

```typescript
interface RollingReleaseParameters {
  targetPercentage: number;          // 段階ごとのトラフィック配分
  duration: number;                  // 自動進行前の待機時間（秒）
  requireApproval: boolean;          // 手動承認ゲートオプション
  canaryDeploymentId: string;        // プロモートされるバージョンの識別子
}
```

## エラーハンドリング

SDKは操作前のステータスチェックと、トラブルシューティング用の説明的なエラーコードを提供します：

```typescript
async function safeRollingRelease(projectId: string, canaryId: string) {
  try {
    return await configureRollingRelease(projectId, canaryId);
  } catch (error) {
    switch (error.code) {
      case '404':
        console.error('プロジェクトまたはデプロイメントが見つかりません');
        break;
      case '400':
        console.error('無効な設定パラメータ');
        break;
      case '403':
        console.error('権限不足');
        break;
      default:
        console.error('予期しないエラー:', error);
    }

    throw error;
  }
}
```

## ベストプラクティス

### ローリングリリース戦略

1. **小さく始める**: 初期段階では低いトラフィックパーセンテージ（5-10%）
2. **監視**: 各段階でメトリクスを密接に監視
3. **段階的な進行**: 各段階に十分な時間を確保してメトリクスを収集
4. **承認ゲート**: 重要な段階（50%など）に手動承認を使用

### メトリクス監視

1. **エラー率**: 異常なエラーパターンを監視
2. **レスポンスタイム**: パフォーマンス低下をチェック
3. **ユーザーフィードバック**: 新しいバージョンに関するユーザーレポートを追跡
4. **ビジネスKPI**: 重要なビジネスメトリクスが影響を受けていないか確認

### ロールバック準備

1. **ロールバック計画**: 常にロールバック手順を準備
2. **クイックロールバック**: 問題が検出されたら迅速にロールバック
3. **コミュニケーション**: 問題が発生した場合のチーム通知計画

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [デプロイメント自動化](/docs/services/vercel/docs/rest-api/reference/examples/deployments-automation.md)
- [ログとモニタリング](/docs/services/vercel/docs/rest-api/reference/examples/logs-monitoring.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/rolling-releases)
