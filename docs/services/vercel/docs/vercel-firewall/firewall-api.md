# Vercel Firewall REST API の使用

セキュリティセクションの [Vercel REST API](/docs/rest-api) を使用すると、以下のような Vercel Firewall の機能を プログラム的に操作できます：

- [システムバイパスルールの作成](/docs/rest-api/reference/endpoints/security/create-system-bypass-rule)
- [Vercel WAF ルール設定の更新](/docs/rest-api/reference/endpoints/security/update-firewall-configuration)

REST API を使用する方法：

1. [Vercel SDK](/docs/rest-api/sdk) をインストールし、[セキュリティメソッド](https://github.com/vercel/sdk/blob/HEAD/docs/sdks/security/README.md)を使用
2. エンドポイントを直接呼び出す

複数のプロジェクトに適用されるファイアウォールルールをコードで定義するには、[Vercel Terraform プロバイダー](https://registry.terraform.io/providers/vercel/vercel/latest)を使用できます。

Terraformセットアップ後、以下のルールを使用可能：

- `vercel_firewall_config`
- `vercel_firewall_bypass`

## Vercel SDK の使用

### インストール

```bash
npm install @vercel/sdk
# または
pnpm add @vercel/sdk
# または
yarn add @vercel/sdk
```

### 認証

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});
```

### ファイアウォール設定の取得

```typescript
async function getFirewallConfig(projectId: string) {
  const response = await vercel.security.getFirewallConfig({
    projectId,
  });

  console.log(response.firewallConfig);
}
```

### カスタムルールの作成

```typescript
async function createCustomRule(projectId: string) {
  const response = await vercel.security.updateFirewallConfig({
    projectId,
    firewallConfig: {
      rules: [
        {
          name: 'Block suspicious IPs',
          description: 'Block known malicious IP addresses',
          active: true,
          conditionGroup: [
            {
              conditions: [
                {
                  type: 'ip_address',
                  op: 'inc',
                  value: ['192.0.2.0/24', '198.51.100.0/24'],
                },
              ],
            },
          ],
          action: {
            mitigate: {
              action: 'deny',
              actionDuration: null,
            },
          },
        },
      ],
    },
  });

  console.log('Rule created:', response);
}
```

### レートリミットルールの作成

```typescript
async function createRateLimitRule(projectId: string) {
  const response = await vercel.security.updateFirewallConfig({
    projectId,
    firewallConfig: {
      rules: [
        {
          name: 'API Rate Limit',
          description: 'Limit API requests to 100 per minute',
          active: true,
          conditionGroup: [
            {
              conditions: [
                {
                  type: 'path',
                  op: 'pre',
                  value: '/api',
                },
              ],
            },
          ],
          action: {
            mitigate: {
              action: 'rate_limit',
              rateLimit: {
                algo: 'fixed_window',
                window: 60,
                limit: 100,
                keys: ['ip'],
                action: {
                  action: 'deny',
                },
              },
            },
          },
        },
      ],
    },
  });

  console.log('Rate limit rule created:', response);
}
```

### システムバイパスルールの作成

```typescript
async function createSystemBypass(projectId: string) {
  const response = await vercel.security.createSystemBypass({
    projectId,
    ipAddress: '203.0.113.0/24',
    domain: 'example.com',
    note: 'Corporate VPN network',
  });

  console.log('System bypass created:', response);
}
```

## REST API の直接使用

### エンドポイント

```
GET    /v1/projects/{projectId}/firewall-config
POST   /v1/projects/{projectId}/firewall-config
PATCH  /v1/projects/{projectId}/firewall-config
DELETE /v1/projects/{projectId}/firewall-config
```

### ファイアウォール設定の取得

```bash
curl -X GET "https://api.vercel.com/v1/projects/{projectId}/firewall-config" \
  -H "Authorization: Bearer $VERCEL_TOKEN"
```

### カスタムルールの作成

```bash
curl -X POST "https://api.vercel.com/v1/projects/{projectId}/firewall-config" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {
        "name": "Block malicious IPs",
        "active": true,
        "conditionGroup": [
          {
            "conditions": [
              {
                "type": "ip_address",
                "op": "eq",
                "value": "192.0.2.1"
              }
            ]
          }
        ],
        "action": {
          "mitigate": {
            "action": "deny"
          }
        }
      }
    ]
  }'
```

## Terraform の使用

### プロバイダー設定

```hcl
terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}
```

### ファイアウォール設定

```hcl
resource "vercel_firewall_config" "example" {
  project_id = var.project_id

  rules {
    name        = "Block suspicious traffic"
    description = "Block known malicious IP ranges"
    active      = true

    condition_group {
      conditions {
        type  = "ip_address"
        op    = "inc"
        value = ["192.0.2.0/24"]
      }
    }

    action {
      action = "deny"
    }
  }
}
```

### システムバイパスルール

```hcl
resource "vercel_firewall_bypass" "corporate_vpn" {
  project_id = var.project_id
  ip_address = "203.0.113.0/24"
  domain     = "*"
  note       = "Corporate VPN network"
}
```

## 実用例

### cURLリクエストのチャレンジ

```typescript
const rule = {
  name: 'Challenge cURL requests',
  active: true,
  conditionGroup: [
    {
      conditions: [
        {
          type: 'user_agent',
          op: 'inc',
          value: 'curl',
        },
      ],
    },
  ],
  action: {
    mitigate: {
      action: 'challenge',
    },
  },
};
```

### 特定のパスでCookieなしリクエストをチャレンジ

```typescript
const rule = {
  name: 'Challenge cookieless requests on dashboard',
  active: true,
  conditionGroup: [
    {
      conditions: [
        {
          type: 'path',
          op: 'pre',
          value: '/dashboard',
        },
        {
          type: 'cookie',
          op: 'em',
          value: '',
        },
      ],
    },
  ],
  action: {
    mitigate: {
      action: 'challenge',
    },
  },
};
```

### 非ブラウザトラフィックまたはブロックリストASNの拒否

```typescript
const rule = {
  name: 'Deny non-browser traffic or blocklisted ASNs',
  active: true,
  conditionGroup: [
    {
      conditions: [
        {
          type: 'ja3',
          op: 'em',
          value: '',
        },
      ],
    },
    {
      conditions: [
        {
          type: 'asn',
          op: 'inc',
          value: ['AS12345', 'AS67890'],
        },
      ],
    },
  ],
  action: {
    mitigate: {
      action: 'deny',
    },
  },
};
```

## 条件タイプと演算子

### 条件タイプ

- `ip_address`: IPアドレス
- `path`: リクエストパス
- `method`: HTTPメソッド
- `user_agent`: ユーザーエージェント
- `host`: ホスト名
- `query`: クエリ文字列
- `cookie`: Cookie
- `header`: HTTPヘッダー
- `geo_country`: 国コード
- `asn`: 自律システム番号
- `ja3`: JA3指紋
- `ja4`: JA4指紋

### 演算子

- `eq`: 等しい (equals)
- `ne`: 等しくない (not equals)
- `inc`: 含む (includes)
- `ninc`: 含まない (not includes)
- `pre`: 前方一致 (prefix)
- `suf`: 後方一致 (suffix)
- `re`: 正規表現 (regex)
- `em`: 空 (empty)
- `nem`: 空でない (not empty)

## エラーハンドリング

```typescript
try {
  const response = await vercel.security.updateFirewallConfig({
    projectId,
    firewallConfig,
  });
  console.log('Success:', response);
} catch (error) {
  if (error.status === 400) {
    console.error('Invalid configuration:', error.message);
  } else if (error.status === 401) {
    console.error('Authentication failed');
  } else if (error.status === 403) {
    console.error('Insufficient permissions');
  } else {
    console.error('Error:', error);
  }
}
```

## ベストプラクティス

1. **環境変数の使用**: API トークンは環境変数で管理
2. **バージョン管理**: Terraformを使用して設定をバージョン管理
3. **テスト環境**: 本番環境に適用する前にステージング環境でテスト
4. **エラーハンドリング**: 適切なエラーハンドリングを実装
5. **ドキュメント化**: APIを使用して作成したルールをドキュメント化

詳細については、[Vercel REST API ドキュメント](/docs/rest-api)を参照してください。
