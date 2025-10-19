# turso db locations - 利用可能なロケーション一覧

Turso CLIの`turso db locations`コマンドは、Tursoでサポートされているすべてのデータベースロケーション（地域）の一覧を表示します。レイテンシ情報も確認できます。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [ロケーションコード](#ロケーションコード)
- [レイテンシ最適化](#レイテンシ最適化)
- [ベストプラクティス](#ベストプラクティス)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db locations [オプション]
```

## オプション

### `-l, --show-latencies`

現在地から各Tursoロケーションまでのネットワークレイテンシを表示します。

```bash
turso db locations --show-latencies
```

または短縮形:

```bash
turso db locations -l
```

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db locations --help
```

## 使用例

### 基本的な使用

#### ロケーション一覧の表示

```bash
turso db locations
```

**出力例:**

```
Code    Location
ams     Amsterdam, Netherlands
arn     Stockholm, Sweden
atl     Atlanta, Georgia (US)
bog     Bogotá, Colombia
bom     Mumbai, India
bos     Boston, Massachusetts (US)
cdg     Paris, France
den     Denver, Colorado (US)
dfw     Dallas, Texas (US)
ewr     Secaucus, NJ (US)
fra     Frankfurt, Germany
gdl     Guadalajara, Mexico
gig     Rio de Janeiro, Brazil
gru     São Paulo, Brazil
hkg     Hong Kong
iad     Ashburn, Virginia (US)
jnb     Johannesburg, South Africa
lax     Los Angeles, California (US)
lhr     London, United Kingdom
mad     Madrid, Spain
mia     Miami, Florida (US)
nrt     Tokyo, Japan
ord     Chicago, Illinois (US)
otp     Bucharest, Romania
phx     Phoenix, Arizona (US)
qro     Querétaro, Mexico
scl     Santiago, Chile
sea     Seattle, Washington (US)
sin     Singapore
sjc     San Jose, California (US)
syd     Sydney, Australia
waw     Warsaw, Poland
yul     Montreal, Canada
yyz     Toronto, Canada
```

### レイテンシ情報の表示

#### レイテンシ付きで表示

```bash
turso db locations --show-latencies
```

**出力例（東京からアクセスした場合）:**

```
Code    Location                          Latency
nrt     Tokyo, Japan                      2 ms
sin     Singapore                         65 ms
hkg     Hong Kong                         48 ms
syd     Sydney, Australia                 112 ms
lax     Los Angeles, California (US)      98 ms
sjc     San Jose, California (US)         105 ms
sea     Seattle, Washington (US)          118 ms
ord     Chicago, Illinois (US)            156 ms
iad     Ashburn, Virginia (US)            168 ms
lhr     London, United Kingdom            214 ms
fra     Frankfurt, Germany                228 ms
ams     Amsterdam, Netherlands            235 ms
cdg     Paris, France                     242 ms
```

レイテンシが低い順に表示されるため、最適なロケーションを簡単に特定できます。

## ロケーションコード

### 主要ロケーション

```typescript
interface LocationCodes {
  アジア太平洋: {
    nrt: "Tokyo, Japan";
    sin: "Singapore";
    hkg: "Hong Kong";
    syd: "Sydney, Australia";
    bom: "Mumbai, India";
  };
  北米: {
    lax: "Los Angeles, CA";
    sjc: "San Jose, CA";
    sea: "Seattle, WA";
    den: "Denver, CO";
    dfw: "Dallas, TX";
    ord: "Chicago, IL";
    atl: "Atlanta, GA";
    mia: "Miami, FL";
    bos: "Boston, MA";
    iad: "Ashburn, VA";
    ewr: "Secaucus, NJ";
    phx: "Phoenix, AZ";
  };
  ヨーロッパ: {
    lhr: "London, UK";
    fra: "Frankfurt, Germany";
    ams: "Amsterdam, Netherlands";
    cdg: "Paris, France";
    mad: "Madrid, Spain";
    arn: "Stockholm, Sweden";
    waw: "Warsaw, Poland";
    otp: "Bucharest, Romania";
  };
  南米: {
    gru: "São Paulo, Brazil";
    gig: "Rio de Janeiro, Brazil";
    scl: "Santiago, Chile";
    bog: "Bogotá, Colombia";
    gdl: "Guadalajara, Mexico";
    qro: "Querétaro, Mexico";
  };
  アフリカ: {
    jnb: "Johannesburg, South Africa";
  };
}
```

### ロケーションコードの使用

```bash
# 特定のロケーションにデータベースを作成
turso db create my-database --group production

# グループのプライマリロケーションを設定
turso group create production --location nrt

# 特定のロケーションに接続
turso db shell my-database --location nrt
```

## レイテンシ最適化

### 最適なロケーションの選択

#### ユーザーベースに基づく選択

```bash
#!/bin/bash

echo "Checking latencies from your current location..."
turso db locations --show-latencies > latencies.txt

# 最もレイテンシが低いロケーションを取得
BEST_LOCATION=$(head -2 latencies.txt | tail -1 | awk '{print $1}')

echo "Recommended location: $BEST_LOCATION"
echo ""
echo "Create database with:"
echo "turso group create my-group --location $BEST_LOCATION"
```

#### マルチリージョン戦略

```typescript
interface MultiRegionStrategy {
  global: {
    primary: "ユーザーが最も多い地域";
    replicas: ["主要な地域すべて"];
    strategy: "読み取りは最寄りのレプリカ、書き込みはプライマリ";
  };
  regional: {
    asia: ["nrt", "sin", "hkg"];
    americas: ["lax", "iad", "gru"];
    europe: ["fra", "lhr", "ams"];
  };
  considerations: {
    latency: "ユーザーへの応答時間";
    cost: "データ転送コスト";
    compliance: "データ主権要件";
  };
}
```

### レイテンシテスト

#### 複数ロケーションのレイテンシを測定

```bash
#!/bin/bash

echo "Testing latencies to Turso locations..."
echo "========================================"

turso db locations --show-latencies | while read line; do
  if [[ $line =~ ^[a-z]{3} ]]; then
    CODE=$(echo $line | awk '{print $1}')
    LOCATION=$(echo $line | awk '{print $2}')
    LATENCY=$(echo $line | awk '{print $NF}')

    echo "$CODE ($LOCATION): $LATENCY"
  fi
done
```

#### レイテンシに基づくアラート

```bash
#!/bin/bash

MAX_LATENCY=100  # ms

turso db locations --show-latencies | while read line; do
  if [[ $line =~ ^[a-z]{3} ]]; then
    CODE=$(echo $line | awk '{print $1}')
    LATENCY=$(echo $line | awk '{print $NF}' | sed 's/ ms//')

    if [ "$LATENCY" -gt "$MAX_LATENCY" ]; then
      echo "WARNING: $CODE has high latency: ${LATENCY}ms"
    fi
  fi
done
```

## 実践的なワークフロー

### ロケーション選択の自動化

#### 最適なロケーションを自動選択

```bash
#!/bin/bash

# 最適なロケーションを選択してデータベースを作成
APP_NAME="my-app"
GROUP_NAME="${APP_NAME}-group"

echo "Finding optimal location..."
OPTIMAL_LOCATION=$(turso db locations --show-latencies | sed -n '2p' | awk '{print $1}')

echo "Optimal location: $OPTIMAL_LOCATION"
echo "Creating group with optimal location..."

turso group create "$GROUP_NAME" --location "$OPTIMAL_LOCATION"
turso db create "${APP_NAME}-db" --group "$GROUP_NAME"

echo "Database created at optimal location: $OPTIMAL_LOCATION"
```

### リージョナル展開

#### 各リージョンにデータベースを配置

```bash
#!/bin/bash

APP_NAME="global-app"

# リージョンごとにグループとデータベースを作成
declare -A REGIONS=(
  ["asia"]="nrt"
  ["americas"]="iad"
  ["europe"]="fra"
)

for region in "${!REGIONS[@]}"; do
  LOCATION="${REGIONS[$region]}"
  GROUP_NAME="${APP_NAME}-${region}"
  DB_NAME="${APP_NAME}-${region}-db"

  echo "Setting up $region region at $LOCATION..."

  turso group create "$GROUP_NAME" --location "$LOCATION"
  turso db create "$DB_NAME" --group "$GROUP_NAME"

  echo "✓ $region region setup complete"
done

echo ""
echo "Global deployment completed!"
```

### ロケーション情報のドキュメント化

```bash
#!/bin/bash

OUTPUT_FILE="supported-locations.md"

cat > "$OUTPUT_FILE" <<'EOF'
# Turso Supported Locations

Generated: $(date)

## Available Locations

EOF

turso db locations >> "$OUTPUT_FILE"

echo ""
echo "## Latencies from Current Location"
echo ""
echo '```' >> "$OUTPUT_FILE"
turso db locations --show-latencies >> "$OUTPUT_FILE"
echo '```' >> "$OUTPUT_FILE"

echo "Documentation generated: $OUTPUT_FILE"
```

## ユーザーロケーションとの対応

### 地域別推奨ロケーション

```typescript
interface RegionalRecommendations {
  Japan: ["nrt"];
  "Southeast Asia": ["sin", "hkg"];
  Australia: ["syd"];
  India: ["bom"];

  "West Coast US": ["lax", "sjc", "sea"];
  "Central US": ["den", "dfw", "ord"];
  "East Coast US": ["iad", "ewr", "bos"];

  "Western Europe": ["lhr", "fra", "ams", "cdg"];
  "Eastern Europe": ["waw", "otp"];
  "Northern Europe": ["arn"];

  Brazil: ["gru", "gig"];
  "South America": ["scl", "bog"];
  Mexico: ["gdl", "qro"];

  "South Africa": ["jnb"];
}
```

### ユーザー分布に基づく配置

```bash
#!/bin/bash

# ユーザー分布に基づいて最適なロケーションを提案
echo "User Distribution Analysis"
echo "=========================="

cat <<EOF
If your users are primarily in:

- Japan, Korea, Taiwan: use 'nrt' (Tokyo)
- Southeast Asia: use 'sin' (Singapore)
- China, Hong Kong: use 'hkg' (Hong Kong)
- Australia, New Zealand: use 'syd' (Sydney)
- India: use 'bom' (Mumbai)

- US West Coast: use 'lax' or 'sjc'
- US Central: use 'ord' or 'dfw'
- US East Coast: use 'iad' or 'ewr'

- UK, Ireland: use 'lhr' (London)
- Western Europe: use 'fra' (Frankfurt)
- Southern Europe: use 'mad' (Madrid)

- Brazil: use 'gru' (São Paulo)
- South America: use 'scl' or 'bog'

For global applications, consider multi-region deployment with:
- Primary: Your largest user base
- Replicas: Other major regions
EOF
```

## ベストプラクティス

### 1. レイテンシの定期チェック

```bash
# crontab エントリ
# 毎日午前2時にレイテンシをチェック
0 2 * * * /path/to/check-latencies.sh
```

**check-latencies.sh:**

```bash
#!/bin/bash

LOG_FILE="./logs/latency-$(date +%Y%m).log"
mkdir -p ./logs

echo "=== $(date) ===" >> "$LOG_FILE"
turso db locations --show-latencies >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
```

### 2. プライマリロケーションの選定基準

```typescript
interface LocationSelectionCriteria {
  primary: {
    userConcentration: "ユーザーの50%以上が存在";
    latency: "平均レイテンシが最小";
    compliance: "データ保存規制を満たす";
  };
  replicas: {
    coverage: "残りのユーザーをカバー";
    distribution: "地理的に分散";
    fallback: "プライマリの冗長性";
  };
}
```

### 3. コンプライアンス考慮

```bash
#!/bin/bash

# GDPR準拠: EUユーザーのデータはEU内に保存
EU_LOCATIONS=("lhr" "fra" "ams" "cdg" "mad" "arn" "waw" "otp")

echo "GDPR-compliant locations:"
for loc in "${EU_LOCATIONS[@]}"; do
  echo "- $loc"
done

# EUリージョンでのデプロイ
turso group create eu-group --location fra
turso db create eu-users-db --group eu-group
```

### 4. パフォーマンステスト

```bash
#!/bin/bash

# 各ロケーションのパフォーマンスをテスト
TEST_LOCATIONS=("nrt" "sin" "lax" "iad" "fra")

for loc in "${TEST_LOCATIONS[@]}"; do
  echo "Testing location: $loc"

  # テストデータベースを作成
  TEST_DB="perf-test-$loc"
  turso db create "$TEST_DB" --group "test-$loc"

  # クエリ実行時間を測定
  START=$(date +%s%N)
  turso db shell "$TEST_DB" --location "$loc" "SELECT 1;"
  END=$(date +%s%N)

  DURATION=$(( (END - START) / 1000000 ))
  echo "Query time: ${DURATION}ms"

  # クリーンアップ
  turso db destroy "$TEST_DB" --yes

  echo ""
done
```

### 5. ドキュメント化

プロジェクトのREADMEにロケーション情報を記載:

```markdown
## Database Locations

### Production
- Primary: nrt (Tokyo) - Serves APAC users
- Replica: iad (Virginia) - Serves Americas users
- Replica: fra (Frankfurt) - Serves EMEA users

### Staging
- Location: sin (Singapore)

### Development
- Location: nrt (Tokyo)

### Selection Rationale
- Primary location chosen based on 60% of users in APAC region
- Replicas provide <100ms latency for 95% of global users
- Complies with regional data sovereignty requirements
```

## トラブルシューティング

### レイテンシが異常に高い

**原因:**
- ネットワークの問題
- ISPの経路の問題
- Tursoサービスの一時的な問題

**解決方法:**

```bash
# 複数回測定して平均を取る
for i in {1..5}; do
  echo "Measurement $i:"
  turso db locations --show-latencies | head -5
  sleep 2
done
```

### ロケーションが表示されない

**原因:**
- 新しいロケーションが追加された
- CLIのバージョンが古い

**解決方法:**

```bash
# CLIをアップデート
turso update

# 再度確認
turso db locations
```

## レイテンシの理解

### 期待されるレイテンシ範囲

```typescript
interface LatencyRanges {
  excellent: "<20ms - 同一または隣接リージョン";
  good: "20-50ms - 同一大陸内";
  acceptable: "50-100ms - 大陸間（近距離）";
  slow: "100-200ms - 大陸間（中距離）";
  verySlow: ">200ms - 地球の反対側";
}
```

### レイテンシに影響する要因

```typescript
interface LatencyFactors {
  physical: {
    distance: "物理的な距離";
    routing: "ネットワーク経路";
    infrastructure: "ISPのインフラ";
  };
  technical: {
    dns: "DNS解決時間";
    tls: "TLS/SSLハンドシェイク";
    protocol: "プロトコルオーバーヘッド";
  };
  temporary: {
    congestion: "ネットワーク混雑";
    maintenance: "メンテナンス";
    outages: "障害";
  };
}
```

## 関連コマンド

- [`turso db create`](./db-create.md) - データベースを作成
- [`turso group create`](./group-create.md) - グループを作成（ロケーション指定）
- [`turso db shell`](./db-shell.md) - 特定ロケーションに接続
- [`turso db show`](./db-show.md) - データベースのロケーションを確認

## 参考リンク

- [Turso リージョンとロケーション](https://docs.turso.tech/concepts/locations)
- [グローバル展開戦略](https://docs.turso.tech/guides/global-deployment)
- [パフォーマンス最適化](https://docs.turso.tech/guides/performance)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
