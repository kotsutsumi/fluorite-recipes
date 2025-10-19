# APIトークンの検証 - Turso API リファレンス

APIトークンの有効性を検証します。

## エンドポイント

```
GET /v1/auth/validate
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

なし（ヘッダーのAuthorizationトークンを検証）

## TypeScript インターフェース

```typescript
interface ValidateTokenResponse {
  exp: number; // Unix epoch秒、-1は無期限
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "exp": 1704067200
}
```

または無期限の場合：

```json
{
  "exp": -1
}
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/auth/validate" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const validateToken = async (token) => {
  const response = await fetch('https://api.turso.tech/v1/auth/validate', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token is invalid');
  }

  return await response.json();
};

// 使用例
try {
  const result = await validateToken(process.env.TURSO_API_TOKEN);

  if (result.exp === -1) {
    console.log('Token is valid (never expires)');
  } else {
    const expiryDate = new Date(result.exp * 1000);
    console.log(`Token is valid until: ${expiryDate.toISOString()}`);

    // 有効期限までの日数を計算
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    console.log(`Days until expiry: ${daysUntilExpiry}`);
  }
} catch (error) {
  console.error('Token validation failed:', error.message);
}
```

### TypeScript

```typescript
import { ValidateTokenResponse } from './types';

async function validateToken(token: string): Promise<ValidateTokenResponse> {
  const response = await fetch('https://api.turso.tech/v1/auth/validate', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token is invalid');
  }

  return await response.json();
}

// トークンの有効期限チェック
async function checkTokenExpiry(token: string): Promise<{
  valid: boolean;
  expiresAt: Date | null;
  daysRemaining: number | null;
}> {
  try {
    const result = await validateToken(token);

    if (result.exp === -1) {
      return {
        valid: true,
        expiresAt: null,
        daysRemaining: null,
      };
    }

    const expiresAt = new Date(result.exp * 1000);
    const daysRemaining = Math.floor(
      (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return {
      valid: true,
      expiresAt,
      daysRemaining,
    };
  } catch {
    return {
      valid: false,
      expiresAt: null,
      daysRemaining: null,
    };
  }
}
```

### Python

```python
import os
import requests
from datetime import datetime, timezone

def validate_token(token: str) -> dict:
    """APIトークンを検証します。"""
    url = "https://api.turso.tech/v1/auth/validate"
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# 使用例
try:
    result = validate_token(os.environ["TURSO_API_TOKEN"])

    if result["exp"] == -1:
        print("Token is valid (never expires)")
    else:
        expiry_date = datetime.fromtimestamp(result["exp"], tz=timezone.utc)
        print(f"Token is valid until: {expiry_date.isoformat()}")

        days_until_expiry = (expiry_date - datetime.now(timezone.utc)).days
        print(f"Days until expiry: {days_until_expiry}")

except requests.RequestException as e:
    print(f"Token validation failed: {e}")

# 有効期限チェック関数
def check_token_expiry(token: str) -> dict:
    """トークンの有効期限をチェックします。"""
    try:
        result = validate_token(token)

        if result["exp"] == -1:
            return {
                "valid": True,
                "expires_at": None,
                "days_remaining": None
            }

        expires_at = datetime.fromtimestamp(result["exp"], tz=timezone.utc)
        days_remaining = (expires_at - datetime.now(timezone.utc)).days

        return {
            "valid": True,
            "expires_at": expires_at,
            "days_remaining": days_remaining
        }

    except Exception:
        return {
            "valid": False,
            "expires_at": None,
            "days_remaining": None
        }
```

## ベストプラクティス

### 1. 起動時のトークン検証

```typescript
async function validateOnStartup(): Promise<void> {
  const token = process.env.TURSO_API_TOKEN;

  if (!token) {
    throw new Error('TURSO_API_TOKEN environment variable is not set');
  }

  try {
    const result = await validateToken(token);

    if (result.exp === -1) {
      console.log('✓ API token is valid');
    } else {
      const expiresAt = new Date(result.exp * 1000);
      const daysRemaining = Math.floor(
        (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysRemaining < 7) {
        console.warn(
          `⚠️  API token will expire in ${daysRemaining} days (${expiresAt.toISOString()})`
        );
      } else {
        console.log(`✓ API token is valid (expires in ${daysRemaining} days)`);
      }
    }
  } catch (error) {
    throw new Error(`Invalid API token: ${error.message}`);
  }
}

// アプリケーション起動時に実行
await validateOnStartup();
```

### 2. 定期的なトークン検証

```typescript
class TokenValidator {
  private checkInterval: NodeJS.Timeout | null = null;

  startPeriodicValidation(intervalHours = 24): void {
    this.checkInterval = setInterval(
      async () => {
        try {
          await this.validateAndNotify();
        } catch (error) {
          console.error('Token validation failed:', error);
        }
      },
      intervalHours * 60 * 60 * 1000
    );
  }

  stopPeriodicValidation(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async validateAndNotify(): Promise<void> {
    const token = process.env.TURSO_API_TOKEN;
    if (!token) return;

    const result = await validateToken(token);

    if (result.exp !== -1) {
      const expiresAt = new Date(result.exp * 1000);
      const daysRemaining = Math.floor(
        (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysRemaining < 7) {
        await this.sendExpiryWarning(daysRemaining, expiresAt);
      }
    }
  }

  private async sendExpiryWarning(days: number, expiresAt: Date): Promise<void> {
    // 管理者に通知を送信
    await sendAlert({
      subject: 'Turso API Token Expiring Soon',
      message: `Your Turso API token will expire in ${days} days (${expiresAt.toISOString()})`,
      severity: days < 3 ? 'high' : 'medium',
    });
  }
}
```

### 3. トークンのヘルスチェック

```typescript
async function tokenHealthCheck(): Promise<{
  status: 'healthy' | 'warning' | 'critical' | 'invalid';
  message: string;
  expiresAt?: Date;
  daysRemaining?: number;
}> {
  try {
    const token = process.env.TURSO_API_TOKEN;
    if (!token) {
      return {
        status: 'invalid',
        message: 'No token configured',
      };
    }

    const result = await validateToken(token);

    if (result.exp === -1) {
      return {
        status: 'healthy',
        message: 'Token is valid (never expires)',
      };
    }

    const expiresAt = new Date(result.exp * 1000);
    const daysRemaining = Math.floor(
      (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 3) {
      return {
        status: 'critical',
        message: `Token expires in ${daysRemaining} days`,
        expiresAt,
        daysRemaining,
      };
    } else if (daysRemaining < 7) {
      return {
        status: 'warning',
        message: `Token expires in ${daysRemaining} days`,
        expiresAt,
        daysRemaining,
      };
    } else {
      return {
        status: 'healthy',
        message: `Token is valid for ${daysRemaining} more days`,
        expiresAt,
        daysRemaining,
      };
    }
  } catch (error) {
    return {
      status: 'invalid',
      message: `Token validation failed: ${error.message}`,
    };
  }
}
```

### 4. CI/CDでの使用

```typescript
// CI/CDパイプラインでトークンを検証
async function cicdTokenCheck(): Promise<void> {
  const health = await tokenHealthCheck();

  console.log(`Token status: ${health.status}`);
  console.log(`Message: ${health.message}`);

  if (health.status === 'invalid') {
    process.exit(1); // ビルド失敗
  }

  if (health.status === 'critical') {
    console.error('⚠️  Token will expire soon!');
    // 警告として扱うがビルドは続行
  }
}
```

## セキュリティ考慮事項

### 1. トークンの安全な検証

```typescript
// ✓ トークンを環境変数から取得
const token = process.env.TURSO_API_TOKEN;

// ✗ トークンをログに出力しない
console.log('Token:', token); // 絶対にしない！

// ✓ 検証結果のみをログに記録
console.log('Token validation:', result.exp !== -1 ? 'valid' : 'invalid');
```

### 2. エラーハンドリング

```typescript
async function safeValidateToken(token: string): Promise<boolean> {
  try {
    await validateToken(token);
    return true;
  } catch (error) {
    // 詳細なエラーをログに記録しない（セキュリティのため）
    console.error('Token validation failed');
    return false;
  }
}
```

## 関連リンク

- [トークンの作成](/docs/services/turso/docs/api-reference/tokens/create.md)
- [トークン一覧の取得](/docs/services/turso/docs/api-reference/tokens/list.md)
- [トークンの失効](/docs/services/turso/docs/api-reference/tokens/revoke.md)
