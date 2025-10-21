# Vercel SDK - ログとモニタリング

Vercel SDKを使用してデプロイメントログの取得、ステータス監視、カスタムモニタリングシステムの構築を行う方法を説明します。

## 📚 目次

- [概要](#概要)
- [デプロイメントログとステータスの取得](#デプロイメントログとステータスの取得)
- [高度なモニタリングとアラートシステム](#高度なモニタリングとアラートシステム)

## 概要

開発者がアプリケーションのデプロイメントログを取得し、ステータスを監視し、カスタムモニタリングシステムを作成できるようにします。

## デプロイメントログとステータスの取得

### 基本的なログとステータスチェック

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function getDeploymentLogsAndStatus(deploymentIdOrUrl: string) {
  try {
    // 1. デプロイメントイベント（ログ）を取得
    const events = await vercel.deployments.getDeploymentEvents({
      idOrUrl: deploymentIdOrUrl
    });

    // 2. デプロイメントIDを抽出
    const deploymentId = events[0]?.deploymentId || deploymentIdOrUrl;

    // 3. デプロイメントステータス情報を取得
    const deployment = await vercel.deployments.getDeployment({
      idOrUrl: deploymentId
    });

    // 4. ログをフォーマットして表示
    console.log(`Deployment: ${deployment.name}`);
    console.log(`Status: ${deployment.readyState}`);
    console.log(`\nLogs:`);

    events.forEach(event => {
      const timestamp = new Date(event.created).toISOString();
      console.log(`[${timestamp}] ${event.type}: ${event.text}`);
    });

    return { deployment, events };
  } catch (error) {
    console.error('Failed to get deployment logs:', error);
    throw error;
  }
}
```

### 実装プロセス

```typescript
interface LogRetrievalProcess {
  step1: "Vercel SDKを認証情報で初期化";
  step2: "デプロイメントURLまたはIDを使用してイベントを取得";
  step3: "レスポンスからデプロイメントIDを抽出";
  step4: "デプロイメントステータス情報を取得";
  step5: "タイプ、タイムスタンプ、内容でログをフォーマット・表示";
}
```

### ログイベントの構造

```typescript
interface DeploymentEvent {
  deploymentId: string;
  type: string;          // イベントタイプ（例: "build", "ready", "error"）
  created: number;       // タイムスタンプ（ミリ秒）
  text: string;          // ログメッセージ
  serial?: string;       // イベントのシリアル番号
}
```

## 高度なモニタリングとアラートシステム

本番環境向けに、複数のデプロイメントにわたるデータを集約する高度なアプローチ：

### データ収集と分析

```typescript
import { Vercel } from '@vercel/sdk';
import nodemailer from 'nodemailer';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function monitorAndAlert(projectId: string, deploymentLimit: number = 10) {
  try {
    // データ収集
    // 1. 複数の最近のデプロイメントを取得（設定可能な制限）
    const deployments = await vercel.deployments.listDeployments({
      projectId,
      limit: deploymentLimit
    });

    // 2. 各デプロイメントのログを順次抽出
    const allLogs: DeploymentLogData[] = [];

    for (const deployment of deployments.deployments) {
      const events = await vercel.deployments.getDeploymentEvents({
        idOrUrl: deployment.uid
      });

      allLogs.push({
        deploymentId: deployment.uid,
        deploymentUrl: deployment.url,
        events
      });

      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 分析メソッド
    // 3. タイプ別にログをフィルタリング（エラー、警告）
    const errors = allLogs.flatMap(log =>
      log.events.filter(event => event.type === 'error')
    );

    const warnings = allLogs.flatMap(log =>
      log.events.filter(event => event.type === 'warning')
    );

    // 4. 各重大度レベルの出現回数をカウント
    const errorCount = errors.length;
    const warningCount = warnings.length;

    console.log(`Analysis Results:`);
    console.log(`- Errors: ${errorCount}`);
    console.log(`- Warnings: ${warningCount}`);

    // 5. デプロイメントバッチ全体でパターンを識別
    const commonErrors = identifyCommonPatterns(errors);

    // アラートメカニズム
    // 6. しきい値を超えた場合に通知をトリガー
    const errorThreshold = 10;
    const warningThreshold = 20;

    if (errorCount > errorThreshold || warningCount > warningThreshold) {
      await sendAlert({
        errorCount,
        warningCount,
        commonErrors,
        projectId
      });
    }

    return {
      errorCount,
      warningCount,
      commonErrors,
      allLogs
    };
  } catch (error) {
    console.error('Monitoring failed:', error);
    throw error;
  }
}

interface DeploymentLogData {
  deploymentId: string;
  deploymentUrl: string;
  events: any[];
}
```

### パターン識別

```typescript
function identifyCommonPatterns(errors: any[]) {
  const patterns: Record<string, number> = {};

  errors.forEach(error => {
    const pattern = extractErrorPattern(error.text);

    if (!patterns[pattern]) {
      patterns[pattern] = 0;
    }

    patterns[pattern]++;
  });

  // 頻度でソート
  const sorted = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);  // 上位5つのパターン

  return sorted.map(([pattern, count]) => ({
    pattern,
    count
  }));
}

function extractErrorPattern(errorText: string): string {
  // エラーメッセージから一般的なパターンを抽出
  // 例: ファイルパス、数値などの可変部分を削除
  return errorText
    .replace(/\/[^\s]+/g, '/<path>')
    .replace(/\d+/g, '<number>')
    .replace(/['"][^'"]+['"]/g, '<string>');
}
```

### アラート設定

```typescript
interface AlertConfig {
  errorCount: number;
  warningCount: number;
  commonErrors: Array<{ pattern: string; count: number }>;
  projectId: string;
}

async function sendAlert(config: AlertConfig) {
  // SMTPを使用したメール配信設定
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // カスタムアラートメッセージと集約メトリクス
  const message = `
    🚨 Deployment Monitoring Alert

    Project: ${config.projectId}

    Metrics:
    - Total Errors: ${config.errorCount}
    - Total Warnings: ${config.warningCount}

    Common Error Patterns:
    ${config.commonErrors.map((e, i) =>
      `${i + 1}. ${e.pattern} (${e.count} occurrences)`
    ).join('\n    ')}

    Please review the deployments and address these issues.
  `;

  await transporter.sendMail({
    from: process.env.ALERT_FROM_EMAIL,
    to: process.env.ALERT_TO_EMAIL,
    subject: `[ALERT] Deployment Issues Detected - ${config.projectId}`,
    text: message,
  });

  console.log('Alert sent successfully');
}
```

### カスタムしきい値の設定

```typescript
interface MonitoringThresholds {
  errorCount: number;
  warningCount: number;
  timeWindow: number;  // 分単位
}

async function monitorWithCustomThresholds(
  projectId: string,
  thresholds: MonitoringThresholds
) {
  const timeWindowMs = thresholds.timeWindow * 60 * 1000;
  const startTime = Date.now() - timeWindowMs;

  const deployments = await vercel.deployments.listDeployments({
    projectId,
    since: startTime
  });

  // 分析とアラートロジック...
}
```

## ベストプラクティス

### モニタリング戦略

1. **定期的なチェック**: 定期的に（例: 5-15分ごと）ログを確認
2. **しきい値設定**: 環境に適したアラートしきい値を設定
3. **パターン認識**: 一般的なエラーパターンを識別して対処
4. **履歴保持**: ログデータを保存して傾向分析に利用

### アラート設定

1. **段階的アラート**: 重大度レベルに基づいた段階的な通知
2. **ノイズ削減**: 誤検知を最小限に抑えるためにしきい値を調整
3. **アクション可能**: アラートに具体的なアクション項目を含める
4. **配信チャネル**: メール、Slack、PagerDutyなど適切なチャネルを使用

### パフォーマンス

1. **レート制限**: API呼び出し間に適切な遅延を挿入
2. **バッチ処理**: 大量のデプロイメントを効率的に処理
3. **キャッシング**: 頻繁にアクセスするデータをキャッシュ

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [デプロイメント自動化](/docs/services/vercel/docs/rest-api/reference/examples/deployments-automation.md)
- [プロジェクト管理](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/logs-monitoring)
