# 最寄りリージョンの取得 - Turso API リファレンス

ユーザーの位置に最も近いリージョンを返します。

## エンドポイント

```
GET https://region.turso.io
```

## パラメータ

なし（パラメータ不要）

## TypeScript インターフェース

```typescript
interface ClosestRegionResponse {
  server: string;  // レスポンスを返すサーバーのロケーションコード
  client: string;  // クライアントリクエストのロケーションコード
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "server": "lhr",
  "client": "lhr"
}
```

#### レスポンスフィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `server` | string | レスポンスを返すサーバーのロケーションコード |
| `client` | string | クライアントのロケーションコード |

## ロケーションコード一覧

主要なロケーションコード：

| コード | リージョン | 説明 |
|-------|----------|------|
| `lhr` | London (Heathrow) | ヨーロッパ - イギリス |
| `ams` | Amsterdam | ヨーロッパ - オランダ |
| `fra` | Frankfurt | ヨーロッパ - ドイツ |
| `iad` | Washington DC (Dulles) | 北米 - アメリカ東海岸 |
| `bos` | Boston | 北米 - アメリカ東海岸 |
| `ord` | Chicago | 北米 - アメリカ中部 |
| `dfw` | Dallas | 北米 - アメリカ中部 |
| `sea` | Seattle | 北米 - アメリカ西海岸 |
| `sjc` | San Jose | 北米 - アメリカ西海岸 |
| `lax` | Los Angeles | 北米 - アメリカ西海岸 |
| `gru` | São Paulo | 南米 - ブラジル |
| `nrt` | Tokyo (Narita) | アジア - 日本 |
| `hnd` | Tokyo (Haneda) | アジア - 日本 |
| `hkg` | Hong Kong | アジア - 香港 |
| `sin` | Singapore | アジア - シンガポール |
| `syd` | Sydney | オセアニア - オーストラリア |

## コード例

### cURL

```bash
curl https://region.turso.io
```

### JavaScript

```javascript
const getClosestRegion = async () => {
  const response = await fetch('https://region.turso.io');

  if (!response.ok) {
    throw new Error('Failed to get closest region');
  }

  return await response.json();
};

// 使用例
const region = await getClosestRegion();
console.log('Closest region:', region.client);
console.log('Server region:', region.server);
```

### TypeScript

```typescript
import { ClosestRegionResponse } from './types';

async function getClosestRegion(): Promise<ClosestRegionResponse> {
  const response = await fetch('https://region.turso.io');

  if (!response.ok) {
    throw new Error('Failed to get closest region');
  }

  return await response.json();
}

// 使用例: 最適なリージョンでグループを作成
async function createGroupInOptimalRegion(
  orgSlug: string,
  groupName: string
): Promise<void> {
  // 最寄りのリージョンを取得
  const { client } = await getClosestRegion();

  console.log(`Creating group in closest region: ${client}`);

  // そのリージョンでグループを作成
  await createGroup(orgSlug, {
    name: groupName,
    location: client,
  });

  console.log(`✓ Group created in ${client}`);
}
```

### Python

```python
import requests
from typing import Dict

def get_closest_region() -> Dict[str, str]:
    """ユーザーに最も近いリージョンを取得します。"""

    response = requests.get("https://region.turso.io")
    response.raise_for_status()

    return response.json()

# 使用例
region = get_closest_region()
print(f"Closest region: {region['client']}")
print(f"Server region: {region['server']}")

# 最適なリージョンでグループを作成
def create_group_in_optimal_region(org_slug: str, group_name: str) -> None:
    """最寄りのリージョンでグループを作成します。"""

    # 最寄りのリージョンを取得
    region = get_closest_region()
    location = region["client"]

    print(f"Creating group in closest region: {location}")

    # グループを作成
    create_group(
        org_slug=org_slug,
        name=group_name,
        location=location
    )

    print(f"✓ Group created in {location}")
```

### Node.js (Turso SDK)

```typescript
import { createClient } from '@tursodatabase/api';

const turso = createClient({
  token: process.env.TURSO_API_TOKEN,
});

// SDKを使用してリージョンを取得
const region = await turso.locations.closestRegion();
console.log('Closest region:', region.client);
```

## ベストプラクティス

### 1. グループ作成時の自動リージョン選択

```typescript
async function createGroupWithAutoRegion(
  orgSlug: string,
  groupName: string,
  options?: {
    fallbackRegion?: string;
  }
): Promise<void> {
  try {
    // 最寄りのリージョンを取得
    const { client } = await getClosestRegion();

    await createGroup(orgSlug, {
      name: groupName,
      location: client,
    });

    console.log(`✓ Group created in optimal region: ${client}`);
  } catch (error) {
    // リージョン取得に失敗した場合、フォールバックを使用
    const fallback = options?.fallbackRegion || 'iad';
    console.warn(`Failed to get closest region, using fallback: ${fallback}`);

    await createGroup(orgSlug, {
      name: groupName,
      location: fallback,
    });
  }
}
```

### 2. リージョン情報のキャッシング

```typescript
class RegionCache {
  private cachedRegion: string | null = null;
  private cacheTime: number = 0;
  private ttl = 24 * 60 * 60 * 1000; // 24時間

  async getClosestRegion(): Promise<string> {
    const now = Date.now();

    // キャッシュが有効な場合は再利用
    if (this.cachedRegion && now - this.cacheTime < this.ttl) {
      return this.cachedRegion;
    }

    // 新しいリージョン情報を取得
    const { client } = await getClosestRegion();

    // キャッシュを更新
    this.cachedRegion = client;
    this.cacheTime = now;

    return client;
  }

  invalidate(): void {
    this.cachedRegion = null;
    this.cacheTime = 0;
  }
}

// 使用例
const regionCache = new RegionCache();
const region = await regionCache.getClosestRegion();
```

### 3. マルチリージョンデプロイメント

```typescript
interface RegionPreference {
  primary: string;
  replicas: string[];
}

async function determineRegionStrategy(): Promise<RegionPreference> {
  // ユーザーの最寄りリージョンを取得
  const { client } = await getClosestRegion();

  // リージョン別のレプリカ戦略
  const strategies: Record<string, RegionPreference> = {
    // アジア
    nrt: { primary: 'nrt', replicas: ['hkg', 'sin'] },
    hkg: { primary: 'hkg', replicas: ['nrt', 'sin'] },
    sin: { primary: 'sin', replicas: ['hkg', 'nrt'] },

    // ヨーロッパ
    lhr: { primary: 'lhr', replicas: ['ams', 'fra'] },
    ams: { primary: 'ams', replicas: ['lhr', 'fra'] },
    fra: { primary: 'fra', replicas: ['lhr', 'ams'] },

    // 北米
    iad: { primary: 'iad', replicas: ['ord', 'sjc'] },
    ord: { primary: 'ord', replicas: ['iad', 'dfw'] },
    sjc: { primary: 'sjc', replicas: ['sea', 'lax'] },
  };

  return strategies[client] || { primary: client, replicas: [] };
}

// 使用例
const strategy = await determineRegionStrategy();
console.log('Primary region:', strategy.primary);
console.log('Replica regions:', strategy.replicas.join(', '));
```

### 4. レイテンシベースのリージョン選択

```typescript
async function measureLatency(region: string): Promise<number> {
  const start = Date.now();

  try {
    // リージョン固有のエンドポイントに対してping
    await fetch(`https://${region}.turso.io/health`, {
      method: 'HEAD',
    });

    return Date.now() - start;
  } catch {
    return Infinity;
  }
}

async function findFastestRegion(
  candidates: string[]
): Promise<{ region: string; latency: number }> {
  const latencies = await Promise.all(
    candidates.map(async (region) => ({
      region,
      latency: await measureLatency(region),
    }))
  );

  // 最も低いレイテンシのリージョンを選択
  return latencies.reduce((best, current) =>
    current.latency < best.latency ? current : best
  );
}

// 使用例
const candidates = ['lhr', 'ams', 'fra'];
const fastest = await findFastestRegion(candidates);
console.log(`Fastest region: ${fastest.region} (${fastest.latency}ms)`);
```

## 実用例

### ユーザー位置に基づく最適化

```typescript
async function setupOptimalDatabase(
  orgSlug: string,
  userId: string
): Promise<void> {
  // ユーザーの最寄りリージョンを取得
  const { client } = await getClosestRegion();

  // ユーザー専用のグループを作成
  const groupName = `user-${userId}`;

  await createGroup(orgSlug, {
    name: groupName,
    location: client,
  });

  console.log(`✓ Created optimized database for user ${userId} in ${client}`);
}
```

### グローバルアプリケーションの設定

```typescript
async function setupGlobalApplication(
  orgSlug: string,
  appName: string
): Promise<void> {
  // ユーザーの位置を検出
  const { client } = await getClosestRegion();

  console.log(`User is closest to: ${client}`);

  // グローバル展開のための地域マッピング
  const regionalMapping: Record<string, string[]> = {
    asia: ['nrt', 'hkg', 'sin'],
    europe: ['lhr', 'ams', 'fra'],
    americas: ['iad', 'ord', 'sjc'],
  };

  // ユーザーのリージョンに基づいて地域を判定
  let userRegion = 'americas'; // デフォルト

  for (const [region, locations] of Object.entries(regionalMapping)) {
    if (locations.includes(client)) {
      userRegion = region;
      break;
    }
  }

  console.log(`Deploying to ${userRegion} region`);

  // その地域のロケーションでグループを作成
  await createGroup(orgSlug, {
    name: `${appName}-${userRegion}`,
    location: client,
  });
}
```

### A/Bテスト用のリージョン選択

```typescript
async function selectRegionForExperiment(
  experimentId: string
): Promise<string> {
  // 最寄りのリージョンを取得
  const { client } = await getClosestRegion();

  // 実験IDに基づいてリージョンを決定
  const experimentHash = hashCode(experimentId);

  // 50/50でユーザーのリージョンまたは代替リージョンを使用
  if (experimentHash % 2 === 0) {
    return client;
  }

  // 代替リージョンマッピング
  const alternatives: Record<string, string> = {
    lhr: 'ams',
    ams: 'fra',
    fra: 'lhr',
    iad: 'ord',
    ord: 'sjc',
    sjc: 'iad',
  };

  return alternatives[client] || client;
}
```

## セキュリティ考慮事項

### 1. レート制限

このエンドポイントは認証不要ですが、過度なリクエストは避けてください：

```typescript
// リクエストを制限
let lastRequest = 0;
const MIN_INTERVAL = 60000; // 1分

async function getClosestRegionWithRateLimit(): Promise<ClosestRegionResponse> {
  const now = Date.now();

  if (now - lastRequest < MIN_INTERVAL) {
    throw new Error('Rate limit: please wait before requesting again');
  }

  lastRequest = now;
  return await getClosestRegion();
}
```

### 2. フォールバック戦略

```typescript
async function getRegionWithFallback(
  fallback = 'iad'
): Promise<string> {
  try {
    const { client } = await getClosestRegion();
    return client;
  } catch (error) {
    console.warn('Failed to get closest region, using fallback');
    return fallback;
  }
}
```

## 関連リンク

- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [Turso Cloudについて](/docs/services/turso/docs/turso-cloud.md)
- [データとエッジ](/docs/services/turso/docs/features/data-edge.md)
