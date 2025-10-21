# Locations API - ロケーション一覧の取得

Tursoが提供するすべてのグローバルロケーションの一覧を取得します。

## エンドポイント

```
GET /v1/locations
```

## リクエスト

### 認証

このエンドポイントは認証不要で公開アクセス可能です。

### リクエストヘッダー

```http
# 認証ヘッダーは不要（オプション）
Authorization: Bearer YOUR_API_TOKEN
```

## レスポンス

### 成功レスポンス (200 OK)

```typescript
interface LocationsResponse {
  locations: {
    [code: string]: string;  // ロケーションコード: ロケーション名
  };
}
```

### レスポンス例

```json
{
  "locations": {
    "ams": "Amsterdam, Netherlands",
    "arn": "Stockholm, Sweden",
    "bog": "Bogotá, Colombia",
    "bos": "Boston, Massachusetts (US)",
    "cdg": "Paris, France",
    "den": "Denver, Colorado (US)",
    "dfw": "Dallas, Texas (US)",
    "ewr": "Secaucus, NJ (US)",
    "fra": "Frankfurt, Germany",
    "gdl": "Guadalajara, Mexico",
    "gig": "Rio de Janeiro, Brazil",
    "gru": "Sao Paulo, Brazil",
    "hkg": "Hong Kong, Hong Kong",
    "iad": "Ashburn, Virginia (US)",
    "jnb": "Johannesburg, South Africa",
    "lax": "Los Angeles, California (US)",
    "lhr": "London, United Kingdom",
    "mad": "Madrid, Spain",
    "mia": "Miami, Florida (US)",
    "nrt": "Tokyo, Japan",
    "ord": "Chicago, Illinois (US)",
    "otp": "Bucharest, Romania",
    "qro": "Queretaro, Mexico",
    "scl": "Santiago, Chile",
    "sea": "Seattle, Washington (US)",
    "sin": "Singapore, Singapore",
    "sjc": "San Jose, California (US)",
    "syd": "Sydney, Australia",
    "waw": "Warsaw, Poland",
    "yul": "Montreal, Canada",
    "yyz": "Toronto, Canada"
  }
}
```

## 使用例

### cURL

```bash
curl -L 'https://api.turso.tech/v1/locations'
```

### JavaScript / TypeScript

```typescript
async function listLocations() {
  const response = await fetch('https://api.turso.tech/v1/locations');

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.locations;
}

const locations = await listLocations();

// すべてのロケーションを表示
Object.entries(locations).forEach(([code, name]) => {
  console.log(`${code}: ${name}`);
});
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

const locations = await turso.locations.list();
console.log('Available locations:', Object.keys(locations.locations).length);
```

## ロケーション選択ガイド

### 地域別ロケーション

#### 北米

```typescript
const northAmerica = {
  'bos': 'Boston, Massachusetts (US)',
  'ord': 'Chicago, Illinois (US)',
  'dfw': 'Dallas, Texas (US)',
  'den': 'Denver, Colorado (US)',
  'lax': 'Los Angeles, California (US)',
  'mia': 'Miami, Florida (US)',
  'sjc': 'San Jose, California (US)',
  'sea': 'Seattle, Washington (US)',
  'iad': 'Ashburn, Virginia (US)',
  'ewr': 'Secaucus, NJ (US)',
  'yyz': 'Toronto, Canada',
  'yul': 'Montreal, Canada'
};
```

#### 欧州

```typescript
const europe = {
  'ams': 'Amsterdam, Netherlands',
  'arn': 'Stockholm, Sweden',
  'cdg': 'Paris, France',
  'fra': 'Frankfurt, Germany',
  'lhr': 'London, United Kingdom',
  'mad': 'Madrid, Spain',
  'otp': 'Bucharest, Romania',
  'waw': 'Warsaw, Poland'
};
```

#### アジア太平洋

```typescript
const asiaPacific = {
  'hkg': 'Hong Kong, Hong Kong',
  'nrt': 'Tokyo, Japan',
  'sin': 'Singapore, Singapore',
  'syd': 'Sydney, Australia'
};
```

#### 南米

```typescript
const southAmerica = {
  'bog': 'Bogotá, Colombia',
  'gig': 'Rio de Janeiro, Brazil',
  'gru': 'Sao Paulo, Brazil',
  'scl': 'Santiago, Chile',
  'gdl': 'Guadalajara, Mexico',
  'qro': 'Queretaro, Mexico'
};
```

#### アフリカ

```typescript
const africa = {
  'jnb': 'Johannesburg, South Africa'
};
```

## 実用的な例

### 最寄りのロケーションを見つける

```typescript
interface LocationLatency {
  code: string;
  name: string;
  latency: number;
}

async function findClosestLocation(): Promise<LocationLatency> {
  const locations = await listLocations();
  const latencies: LocationLatency[] = [];

  for (const [code, name] of Object.entries(locations)) {
    const start = Date.now();

    try {
      // 各ロケーションへのping（実際はAPI経由でインスタンスに接続）
      await fetch(`https://api.turso.tech/v1/locations`);
      const latency = Date.now() - start;

      latencies.push({ code, name, latency });
    } catch (error) {
      console.error(`Failed to ping ${code}:`, error);
    }
  }

  // レイテンシが最小のロケーションを返す
  return latencies.reduce((min, loc) =>
    loc.latency < min.latency ? loc : min
  );
}

const closest = await findClosestLocation();
console.log(`Closest location: ${closest.code} (${closest.name})`);
console.log(`Latency: ${closest.latency}ms`);
```

### ユーザーの地域に基づくロケーション選択

```typescript
function selectLocationByRegion(userRegion: string): string {
  const regionMap: Record<string, string> = {
    'US-EAST': 'iad',      // バージニア
    'US-WEST': 'sjc',      // サンノゼ
    'US-CENTRAL': 'ord',   // シカゴ
    'EU-WEST': 'lhr',      // ロンドン
    'EU-CENTRAL': 'fra',   // フランクフルト
    'ASIA-EAST': 'nrt',    // 東京
    'ASIA-SOUTHEAST': 'sin', // シンガポール
    'OCEANIA': 'syd',      // シドニー
    'SOUTH-AMERICA': 'gru', // サンパウロ
    'AFRICA': 'jnb'        // ヨハネスブルグ
  };

  return regionMap[userRegion] || 'iad'; // デフォルトはバージニア
}

// 使用例
const userRegion = 'ASIA-EAST';
const location = selectLocationByRegion(userRegion);
console.log(`Selected location: ${location}`);
```

### マルチリージョン戦略

```typescript
interface MultiRegionConfig {
  primary: string;
  replicas: string[];
}

function selectMultiRegionLocations(
  targetRegions: string[]
): MultiRegionConfig {
  const locationSets: Record<string, MultiRegionConfig> = {
    'global-us-eu': {
      primary: 'iad',          // バージニア（プライマリ）
      replicas: ['lhr', 'fra'] // ロンドン、フランクフルト
    },
    'global-us-asia': {
      primary: 'sjc',          // サンノゼ（プライマリ）
      replicas: ['nrt', 'sin'] // 東京、シンガポール
    },
    'global-full': {
      primary: 'iad',          // バージニア（プライマリ）
      replicas: [
        'lhr',  // ロンドン
        'fra',  // フランクフルト
        'nrt',  // 東京
        'sin',  // シンガポール
        'syd',  // シドニー
        'gru'   // サンパウロ
      ]
    },
    'asia-pacific': {
      primary: 'nrt',          // 東京（プライマリ）
      replicas: ['sin', 'syd', 'hkg'] // シンガポール、シドニー、香港
    },
    'europe': {
      primary: 'fra',          // フランクフルト（プライマリ）
      replicas: ['lhr', 'ams', 'cdg'] // ロンドン、アムステルダム、パリ
    },
    'americas': {
      primary: 'iad',          // バージニア（プライマリ）
      replicas: ['sjc', 'gru', 'bog'] // サンノゼ、サンパウロ、ボゴタ
    }
  };

  const strategy = targetRegions.join('-');
  return locationSets[strategy] || locationSets['global-us-eu'];
}

// 使用例
const config = selectMultiRegionLocations(['global', 'full']);
console.log(`Primary: ${config.primary}`);
console.log(`Replicas: ${config.replicas.join(', ')}`);
```

### ロケーション情報の表示

```typescript
interface LocationInfo {
  code: string;
  name: string;
  region: string;
  continent: string;
}

function getLocationDetails(code: string, name: string): LocationInfo {
  // 国から大陸を判定
  const continent = (() => {
    if (name.includes('US') || name.includes('Canada') || name.includes('Mexico')) {
      return 'North America';
    }
    if (name.includes('Brazil') || name.includes('Colombia') || name.includes('Chile')) {
      return 'South America';
    }
    if (name.includes('United Kingdom') || name.includes('Netherlands') ||
        name.includes('France') || name.includes('Germany') ||
        name.includes('Spain') || name.includes('Sweden') ||
        name.includes('Poland') || name.includes('Romania')) {
      return 'Europe';
    }
    if (name.includes('Japan') || name.includes('Singapore') ||
        name.includes('Hong Kong') || name.includes('Australia')) {
      return 'Asia Pacific';
    }
    if (name.includes('South Africa')) {
      return 'Africa';
    }
    return 'Unknown';
  })();

  return {
    code,
    name,
    region: name.split(',')[1]?.trim() || '',
    continent
  };
}

async function displayLocationsByContinent() {
  const locations = await listLocations();
  const locationDetails = Object.entries(locations).map(([code, name]) =>
    getLocationDetails(code, name)
  );

  const byContinent = locationDetails.reduce((acc, loc) => {
    if (!acc[loc.continent]) acc[loc.continent] = [];
    acc[loc.continent].push(loc);
    return acc;
  }, {} as Record<string, LocationInfo[]>);

  console.log('\n=== Turso Global Locations ===\n');

  Object.entries(byContinent)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([continent, locs]) => {
      console.log(`${continent} (${locs.length} locations):`);
      locs.forEach(loc => {
        console.log(`  ${loc.code.toUpperCase()} - ${loc.name}`);
      });
      console.log('');
    });
}

await displayLocationsByContinent();
```

### ロケーション選択ウィザード

```typescript
async function locationWizard() {
  const locations = await listLocations();

  console.log('=== Turso Location Selection Wizard ===\n');

  // ステップ1: ターゲット地域を選択
  console.log('1. Select your primary region:');
  console.log('  [1] North America');
  console.log('  [2] Europe');
  console.log('  [3] Asia Pacific');
  console.log('  [4] South America');
  console.log('  [5] Africa');

  const primaryRegion = 1; // ユーザー入力をシミュレート

  // ステップ2: 具体的なロケーションを推奨
  const recommendations: Record<number, string[]> = {
    1: ['iad', 'sjc', 'ord'], // 北米
    2: ['lhr', 'fra', 'ams'], // 欧州
    3: ['nrt', 'sin', 'syd'], // アジア太平洋
    4: ['gru', 'bog', 'scl'], // 南米
    5: ['jnb']                // アフリカ
  };

  const suggested = recommendations[primaryRegion];

  console.log('\nRecommended locations:');
  suggested.forEach((code, i) => {
    console.log(`  [${i + 1}] ${code.toUpperCase()} - ${locations[code]}`);
  });

  // ステップ3: レプリケーション戦略
  console.log('\n3. Do you want multi-region replication?');
  console.log('  [1] No (single region)');
  console.log('  [2] Yes (select additional regions)');

  const enableReplication = 2;

  if (enableReplication === 2) {
    console.log('\nSelect additional regions for replicas:');
    Object.entries(locations)
      .filter(([code]) => !suggested.includes(code))
      .slice(0, 10)
      .forEach(([code, name], i) => {
        console.log(`  [${i + 1}] ${code.toUpperCase()} - ${name}`);
      });
  }

  return {
    primary: suggested[0],
    replicas: enableReplication === 2 ? ['lhr', 'fra'] : []
  };
}
```

## パフォーマンス最適化

### ロケーション選択のベストプラクティス

1. **ユーザーベースの近くを選択**: エンドユーザーに最も近いロケーションを選択してレイテンシを最小化

2. **コンプライアンス要件を考慮**: GDPRなどのデータ所在地要件を満たすロケーションを選択

3. **冗長性のための複数リージョン**: 高可用性のために複数のロケーションにレプリケート

4. **コスト最適化**: データ転送コストを考慮してロケーションを選択

### レイテンシ測定

```typescript
async function measureLocationLatency(locationCode: string): Promise<number> {
  const measurements: number[] = [];

  // 複数回測定して平均を取る
  for (let i = 0; i < 5; i++) {
    const start = performance.now();
    await fetch('https://api.turso.tech/v1/locations');
    const end = performance.now();
    measurements.push(end - start);

    // 測定間隔
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 平均レイテンシを計算
  const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
  return Math.round(avg);
}

async function compareLocations(codes: string[]) {
  const results = await Promise.all(
    codes.map(async code => ({
      code,
      latency: await measureLocationLatency(code)
    }))
  );

  results.sort((a, b) => a.latency - b.latency);

  console.log('\n=== Location Latency Comparison ===');
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.code.toUpperCase()}: ${result.latency}ms`);
  });

  return results[0]; // 最速のロケーションを返す
}

// 使用例
const fastest = await compareLocations(['iad', 'lhr', 'nrt', 'sin']);
console.log(`\nFastest location: ${fastest.code} (${fastest.latency}ms)`);
```

## 関連API

- [グループの作成](./18-groups-create.md) - ロケーションを指定してグループを作成
- [ロケーションの追加](./24-groups-add-location.md) - グループにロケーションを追加
- [ロケーションの削除](./25-groups-remove-location.md) - グループからロケーションを削除

---

**参考リンク**:
- [API Introduction](./01-introduction.md)
- [Groups API](./17-groups-list.md)
- [Databases API](./05-databases-list.md)
