# Vercel SDK - ファイアウォール管理

Web Application Firewall (WAF)設定をプログラムで管理する方法を説明します。

## 📚 目次

- [概要](#概要)
- [カスタムルール管理](#カスタムルール管理)
- [高度なセキュリティ機能](#高度なセキュリティ機能)
- [マネージドルールセット](#マネージドルールセット)
- [認証要件](#認証要件)

## 概要

Vercel SDKは、セキュリティAPIエンドポイントを通じてWeb Application Firewall (WAF)設定のプログラム管理を可能にします。カスタムルール、マネージドルールセット、OWASP保護をカバーします。

## カスタムルール管理

### 新しいルールの作成

SQLインジェクションなどの脅威に対する保護措置を確立するには、null IDで`rules.insert`アクションを使用します：

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

async function createSQLInjectionRule(projectId: string) {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      firewallEnabled: true,
      rules: {
        insert: [{
          id: null,  // 新しいルールの場合はnull
          name: "Block SQL Injection",
          description: "Block requests with SQL injection patterns",
          active: true,
          conditionGroup: [{
            conditions: [{
              type: "query",
              op: "inc",  // 含む
              value: "SELECT"
            }]
          }],
          action: {
            mitigate: {
              action: "deny",
              rateLimit: null,
              redirect: null
            }
          }
        }]
      }
    }
  });

  console.log('SQL Injection rule created');
  return result;
}
```

### ルール構造

```typescript
interface CustomRule {
  id: string | null;                 // 既存ルールのID、新規はnull
  name: string;                       // ルール名
  description?: string;               // ルールの説明
  active: boolean;                    // アクティベーションステータス
  conditionGroup: ConditionGroup[];   // マッチパターン
  action: RuleAction;                 // 緩和アクション
}

interface ConditionGroup {
  conditions: Condition[];
}

interface Condition {
  type: "path" | "query" | "header" | "cookie" | "method" | "ip";
  op: "inc" | "pre" | "re" | "eq";  // inc=含む, pre=パスプレフィックス, re=正規表現, eq=等しい
  value: string;
  neg?: boolean;                     // 否定条件
}

interface RuleAction {
  mitigate: {
    action: "deny" | "challenge" | "rate_limit" | "redirect";
    rateLimit?: RateLimitConfig | null;
    redirect?: RedirectConfig | null;
  };
}
```

### オペレーター

```typescript
type MatchOperator =
  | "inc"    // 含む（contains）
  | "pre"    // パスプレフィックス
  | "re"     // 正規表現
  | "eq";    // 等しい（equals）
```

### 緩和アクション

```typescript
type MitigationAction =
  | "deny"         // リクエストをブロック
  | "challenge"    // CAPTCHA challenge
  | "rate_limit"   // レート制限を適用
  | "redirect";    // リダイレクト
```

## 既存ルールの変更

```typescript
async function updateRule(projectId: string, ruleId: string) {
  // まず現在の設定を取得してルールIDを確認
  const config = await vercel.firewallConfig.getFirewallConfig({
    projectId
  });

  // rules.updateアクションでルールを変更
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      rules: {
        update: [{
          id: ruleId,
          name: "Updated Rule Name",
          action: {
            mitigate: {
              action: "challenge",  // denyからchallengeに変更
              rateLimit: null,
              redirect: null
            }
          }
        }]
      }
    }
  });

  console.log('Rule updated');
  return result;
}
```

## ルールの削除

```typescript
async function deleteRule(projectId: string, ruleId: string) {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      rules: {
        remove: [{
          id: ruleId,
          value: null
        }]
      }
    }
  });

  console.log(`Rule ${ruleId} deleted`);
  return result;
}
```

## ルール優先順位の調整

```typescript
async function reorderRules(projectId: string, ruleIds: string[]) {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      rules: {
        priority: ruleIds  // 配列の順序がルールの実行順序を決定
      }
    }
  });

  console.log('Rule priority updated');
  return result;
}
```

デフォルトの順序付けは作成順序に従います。配列位置は0から配列の最大長まで、どのルールが最初に評価されるかに影響します。

## 高度なセキュリティ機能

### システムバイパスルール

特定のトラフィック（モバイルアプリケーションなど）がDDoS緩和やその他のシステムレベル防御をバイパスできるようにする対象免除を作成：

```typescript
async function createMobileAppBypass(projectId: string) {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      rules: {
        insert: [{
          id: null,
          name: "Mobile App Bypass",
          description: "Allow mobile apps to bypass system-level defenses",
          active: true,
          conditionGroup: [{
            conditions: [{
              type: "header",
              op: "re",  // 正規表現
              value: "Mobile|Android|iPhone|iPad",
              neg: false
            }]
          }],
          action: {
            bypass: {
              bypassSystem: true  // システムレベル防御をバイパス
            }
          }
        }]
      }
    }
  });

  console.log('Mobile app bypass rule created');
  return result;
}
```

**注意**: システムバイパスルールは現在ベータ版です。アクセスにはサポートに連絡してください。

## マネージドルールセット

### OWASPコアルールセット設定

```typescript
async function updateOWASPRule(projectId: string, ruleType: string, action: "deny" | "log") {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      crs: {
        update: {
          [ruleType]: action  // "xss", "sqli", "rce", "lfi", "rfi", "php", "gen", "sd", "max", "java", "sf"
        }
      }
    }
  });

  console.log(`OWASP ${ruleType} rule updated to ${action}`);
  return result;
}

// 使用例
await updateOWASPRule("my-project", "xss", "deny");
await updateOWASPRule("my-project", "sqli", "log");
```

### OWASPルールタイプ

```typescript
type OWASPRuleType =
  | "xss"      // クロスサイトスクリプティング
  | "sqli"     // SQLインジェクション
  | "rce"      // リモートコード実行
  | "lfi"      // ローカルファイルインクルージョン
  | "rfi"      // リモートファイルインクルージョン
  | "php"      // PHP脆弱性
  | "gen"      // 一般的な攻撃
  | "sd"       // セッションデータ
  | "max"      // 最大
  | "java"     // Java脆弱性
  | "sf";      // サーバーサイドフォージェリー
```

### すべてのOWASPルールの一括無効化

```typescript
async function disableAllOWASP(projectId: string) {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      crs: {
        disable: true  // すべてのOWASP保護を同時に無効化
      }
    }
  });

  console.log('All OWASP protections disabled');
  return result;
}
```

### マネージドルールセットの更新

```typescript
async function updateManagedRuleset(
  projectId: string,
  rulesetName: "owasp" | "bot_protection" | "ai_bots" | "bot_filter",
  active: boolean,
  action: "deny" | "log" | "challenge"
) {
  const result = await vercel.firewallConfig.updateFirewallConfig({
    projectId,
    requestBody: {
      managedRules: {
        update: {
          [rulesetName]: {
            active,
            action
          }
        }
      }
    }
  });

  console.log(`Managed ruleset ${rulesetName} updated`);
  return result;
}

// 使用例
await updateManagedRuleset("my-project", "bot_protection", true, "challenge");
await updateManagedRuleset("my-project", "ai_bots", true, "log");
```

## 認証要件

すべての操作には`bearerToken` (VERCEL_TOKEN環境変数)が必要です：

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});
```

チームスコープの操作では、エンドポイント認証でチームコンテキストが必要な場合、`teamId`を指定します：

```typescript
const result = await vercel.firewallConfig.updateFirewallConfig({
  projectId: "my-project",
  teamId: "team_abc123",  // チームスコープ操作用
  requestBody: { /* ... */ }
});
```

## ベストプラクティス

### ルール管理

1. **段階的な展開**: 新しいルールを本番環境に適用する前にテスト
2. **ログモードから開始**: 最初は`log`アクションでルールをテスト
3. **優先順位の最適化**: より一般的なルールを先に配置
4. **定期的な見直し**: ルールのパフォーマンスと効果を定期的に確認

### セキュリティ

1. **最小権限**: 必要な保護のみを有効化
2. **誤検知の監視**: ログを監視して正当なトラフィックがブロックされていないか確認
3. **段階的なアクション**: `log` → `challenge` → `deny`の順で段階的に移行

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [プロジェクト管理](/docs/services/vercel/docs/rest-api/reference/examples/project-management.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/firewall-management)
