# Vercel SDK - ドメイン管理

Vercel SDKを使用したドメイン管理の実践的なガイドです。

## 📚 目次

- [概要](#概要)
- [コア機能](#コア機能)
- [ドメインの追加](#ドメインの追加)
- [ドメインの検証と設定](#ドメインの検証と設定)
- [サブドメインリダイレクト](#サブドメインリダイレクト)
- [実装パターン](#実装パターン)
- [認証](#認証)

## 概要

TypeScriptの実例を通じて、Vercel SDKを使用した実践的なドメイン管理方法を説明します。

```typescript
interface DomainManagementCapabilities {
  addDomain: "プロジェクトへのドメイン追加";
  verifyDomain: "ドメインの検証と設定確認";
  configureDNS: "DNS設定の妥当性チェック";
  setupRedirects: "サブドメインリダイレクトの設定";
}
```

## コア機能

### ドメインの追加

```typescript
interface AddDomainMethod {
  method: "vercel.projects.addProjectDomain()";
  requiredParameters: {
    projectId: "プロジェクトIDまたは名前";
    domainName: "追加するドメイン名";
  };
  returns: "検証ステータスを含むドメイン詳細";
}
```

### ドメインの検証と設定

```typescript
interface DomainConfigMethod {
  method: "vercel.domains.getDomainConfig()";
  capabilities: {
    verifyStatus: "ドメインステータスの確認";
    detectIssues: "設定ミスの検出";
    checkDNS: "DNS設定の妥当性確認";
  };
}
```

### サブドメインリダイレクト

HTTPリダイレクトをサブドメインからプライマリドメインに設定できます：

```typescript
interface RedirectConfiguration {
  redirectURL: string;        // リダイレクト先URL
  statusCode: 301 | 302;     // HTTPステータスコード
  conditional: boolean;       // プライマリドメイン検証後に設定
}
```

## ドメインの追加

### 基本的な使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

async function addDomain() {
  try {
    const domain = await vercel.projects.addProjectDomain({
      idOrName: "my-project",
      requestBody: {
        name: "example.com"
      }
    });

    console.log('Domain added:', domain);
    console.log('Verification status:', domain.verification);

    return domain;
  } catch (error) {
    console.error('Failed to add domain:', error);
    throw error;
  }
}
```

### ドメイン追加の詳細設定

```typescript
async function addDomainWithConfiguration(
  projectId: string,
  domainName: string,
  gitBranch?: string
) {
  const domain = await vercel.projects.addProjectDomain({
    idOrName: projectId,
    requestBody: {
      name: domainName,
      gitBranch: gitBranch || null  // 特定のブランチに関連付け
    }
  });

  return domain;
}

// 使用例
const mainDomain = await addDomainWithConfiguration(
  "my-project",
  "example.com"
);

const previewDomain = await addDomainWithConfiguration(
  "my-project",
  "preview.example.com",
  "develop"
);
```

## ドメインの検証と設定

### 設定の確認

```typescript
async function checkDomainConfiguration(domainName: string) {
  try {
    const config = await vercel.domains.getDomainConfig({
      domain: domainName
    });

    console.log('Domain configuration:', config);

    // 設定ミスの検出
    if (config.misconfigured) {
      console.warn('Domain is misconfigured!');
      console.log('Issues:', config.errors);
    }

    // DNS設定の確認
    if (config.acceptedChallenges) {
      console.log('Accepted DNS challenges:', config.acceptedChallenges);
    }

    return config;
  } catch (error) {
    console.error('Failed to get domain config:', error);
    throw error;
  }
}
```

### 検証ステータスの確認

```typescript
interface DomainVerificationStatus {
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

async function verifyDomainStatus(
  projectId: string,
  domainName: string
): Promise<boolean> {
  const domain = await vercel.projects.getProjectDomain({
    idOrName: projectId,
    domain: domainName
  });

  if (!domain.verified) {
    console.log('Domain not verified yet');
    console.log('Verification records:', domain.verification);
    return false;
  }

  console.log('Domain verified successfully');
  return true;
}
```

## サブドメインリダイレクト

### リダイレクトの設定

```typescript
async function setupSubdomainRedirect(
  projectId: string,
  subdomainName: string,
  redirectTo: string
) {
  try {
    // 1. サブドメインを追加
    const subdomain = await vercel.projects.addProjectDomain({
      idOrName: projectId,
      requestBody: {
        name: subdomainName
      }
    });

    console.log('Subdomain added:', subdomain.name);

    // 2. プライマリドメインの検証を確認
    const isPrimaryVerified = await verifyDomainStatus(
      projectId,
      redirectTo
    );

    if (!isPrimaryVerified) {
      console.warn('Primary domain not verified. Complete verification first.');
      return subdomain;
    }

    // 3. リダイレクト設定を更新
    const updated = await vercel.projects.updateProjectDomain({
      idOrName: projectId,
      domain: subdomainName,
      requestBody: {
        redirect: redirectTo,
        redirectStatusCode: 301  // 永続的リダイレクト
      }
    });

    console.log(`Redirect set up: ${subdomainName} → ${redirectTo}`);
    return updated;
  } catch (error) {
    console.error('Failed to setup redirect:', error);
    throw error;
  }
}

// 使用例
await setupSubdomainRedirect(
  "my-project",
  "www.example.com",
  "example.com"
);
```

### 複数のサブドメインリダイレクト

```typescript
async function setupMultipleRedirects(
  projectId: string,
  redirects: Array<{ from: string; to: string }>
) {
  const results = [];

  for (const redirect of redirects) {
    const result = await setupSubdomainRedirect(
      projectId,
      redirect.from,
      redirect.to
    );
    results.push(result);

    // レート制限を避けるため少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

// 使用例
await setupMultipleRedirects("my-project", [
  { from: "www.example.com", to: "example.com" },
  { from: "blog.example.com", to: "example.com/blog" },
  { from: "shop.example.com", to: "example.com/shop" }
]);
```

## 実装パターン

### 完全なドメイン設定フロー

```typescript
async function completeD omainSetup(
  projectId: string,
  domainName: string
) {
  console.log(`Setting up domain: ${domainName}`);

  // 1. ドメインを追加
  const domain = await vercel.projects.addProjectDomain({
    idOrName: projectId,
    requestBody: { name: domainName }
  });

  console.log('Domain added. Verification required:');
  if (domain.verification) {
    domain.verification.forEach(record => {
      console.log(`Type: ${record.type}`);
      console.log(`Domain: ${record.domain}`);
      console.log(`Value: ${record.value}`);
    });
  }

  // 2. 検証を待機（ポーリング）
  let verified = false;
  let attempts = 0;
  const maxAttempts = 20;

  while (!verified && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒待機

    verified = await verifyDomainStatus(projectId, domainName);
    attempts++;

    console.log(`Verification attempt ${attempts}/${maxAttempts}`);
  }

  if (!verified) {
    throw new Error('Domain verification timeout');
  }

  // 3. 設定を確認
  const config = await vercel.domains.getDomainConfig({
    domain: domainName
  });

  if (config.misconfigured) {
    console.error('Domain misconfigured:', config.errors);
    throw new Error('Domain configuration error');
  }

  console.log('Domain setup completed successfully!');
  return { domain, config };
}
```

### ドメイン設定の検証

```typescript
async function validateDomainSetup(projectId: string, domainName: string) {
  const checks = {
    domainAdded: false,
    domainVerified: false,
    dnsConfigured: false,
    sslEnabled: false
  };

  try {
    // プロジェクトドメインの確認
    const domain = await vercel.projects.getProjectDomain({
      idOrName: projectId,
      domain: domainName
    });

    checks.domainAdded = true;
    checks.domainVerified = domain.verified || false;

    // DNS設定の確認
    const config = await vercel.domains.getDomainConfig({
      domain: domainName
    });

    checks.dnsConfigured = !config.misconfigured;

    // 結果の報告
    console.log('Domain validation results:');
    console.log('✓ Domain added:', checks.domainAdded);
    console.log('✓ Domain verified:', checks.domainVerified);
    console.log('✓ DNS configured:', checks.dnsConfigured);

    return checks;
  } catch (error) {
    console.error('Domain validation failed:', error);
    return checks;
  }
}
```

## 認証

すべてのSDK操作には、環境変数から渡される `VERCEL_TOKEN` が必要です：

```typescript
// 環境変数の設定
// .env
VERCEL_TOKEN=your_vercel_token_here

// SDKの初期化
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});
```

## ベストプラクティス

### ドメイン管理

1. **検証の待機**: ドメイン追加後は検証完了を待つ
2. **エラーハンドリング**: DNS設定ミスを適切に処理
3. **ログ記録**: すべてのドメイン操作を記録
4. **リダイレクト設定**: プライマリドメイン検証後にリダイレクトを設定

### セキュリティ

1. **トークン管理**: 環境変数でトークンを保護
2. **権限確認**: 必要な権限があることを確認
3. **検証プロセス**: ドメイン所有権を適切に検証

### パフォーマンス

1. **レート制限**: 複数操作間に適切な遅延を挿入
2. **並列処理**: 独立した操作は並列実行（制限内で）
3. **キャッシング**: 設定情報を適切にキャッシュ

## トラブルシューティング

### 一般的な問題

**ドメイン検証の失敗**
```typescript
// DNS レコードが正しく設定されているか確認
const config = await vercel.domains.getDomainConfig({ domain: 'example.com' });
if (config.misconfigured) {
  console.log('DNS issues:', config.errors);
}
```

**リダイレクトが機能しない**
```typescript
// プライマリドメインが検証済みか確認
const verified = await verifyDomainStatus(projectId, primaryDomain);
if (!verified) {
  console.log('Verify primary domain first');
}
```

## 関連リンク

- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [デプロイメント自動化](/docs/services/vercel/docs/rest-api/reference/examples/deployments-automation.md)
- [環境変数](/docs/services/vercel/docs/rest-api/reference/examples/environment-variables.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/examples/domain-management)
