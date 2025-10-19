# Build Output API - 設定

`.vercel/output/config.json`によるデプロイメント設定。

## 概要

Build Output Configuration（`config.json`）は、Vercelデプロイメントの設定ファイルで、`.vercel/output/config.json`に配置されます。現在のバージョンは**version 3**です。

## 設定ファイルの場所

```
.vercel/output/config.json
```

## 主要な設定プロパティ

### 1. version（必須）

Build Output APIのバージョンを示します。

```json
{
  "version": 3
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
}
```

### 2. routes

デプロイメントのルーティングルールを定義します。

```json
{
  "version": 3,
  "routes": [
    {
      "src": "/blog",
      "dest": "/blog.html"
    },
    {
      "src": "/about",
      "dest": "/about.html"
    }
  ]
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  routes?: Route[];
}

type Route = Source | Handler;

interface Source {
  src: string;
  dest?: string;
  headers?: Record<string, string>;
  methods?: string[];
  continue?: boolean;
  check?: boolean;
  status?: number;
  has?: Array<HasField>;
  missing?: Array<HasField>;
  locale?: Locale;
}

interface Handler {
  handle: string;
  src?: string;
  dest?: string;
}
```

**機能:**

- リダイレクトの設定
- リライトの設定
- パス変換
- ヘッダーの追加
- HTTPメソッドのフィルタリング

### 3. images

Vercelの画像最適化APIを設定します。

```json
{
  "version": 3,
  "images": {
    "sizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    "domains": ["example.com", "cdn.example.com"],
    "formats": ["image/avif", "image/webp"],
    "minimumCacheTTL": 60,
    "dangerouslyAllowSVG": false
  }
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  images?: {
    sizes?: number[];
    domains?: string[];
    formats?: ('image/avif' | 'image/webp')[];
    minimumCacheTTL?: number;
    dangerouslyAllowSVG?: boolean;
    contentSecurityPolicy?: string;
    remotePatterns?: Array<{
      protocol?: 'http' | 'https';
      hostname: string;
      port?: string;
      pathname?: string;
    }>;
  };
}
```

**パラメータ:**

- `sizes`: 画像サイズの配列
- `domains`: 許可されたドメイン
- `formats`: サポートされる画像フォーマット
- `minimumCacheTTL`: 最小キャッシュTTL（秒）
- `dangerouslyAllowSVG`: SVGの最適化を許可
- `contentSecurityPolicy`: SVG用のCSPヘッダー
- `remotePatterns`: リモート画像のパターンマッチング

### 4. wildcard

国際化のためのドメインマッピングをサポートします。

```json
{
  "version": 3,
  "wildcard": [
    {
      "domain": "example.com",
      "value": "example-com"
    },
    {
      "domain": "*.example.com",
      "value": "subdomain"
    }
  ]
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  wildcard?: Array<{
    domain: string;
    value: string;
  }>;
}
```

**用途:**

- ドメインベースのルーティング
- マルチテナント対応
- サブドメイン処理

### 5. overrides

静的ファイルのプロパティを上書きします。

```json
{
  "version": 3,
  "overrides": {
    "path/to/file.txt": {
      "contentType": "text/plain; charset=utf-8",
      "path": "custom/path/file.txt"
    }
  }
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  overrides?: Record<string, {
    contentType?: string;
    path?: string;
  }>;
}
```

**用途:**

- コンテンツタイプの変更
- URLパスのカスタマイズ

### 6. cache

ビルドサンドボックスで再利用するファイル・ディレクトリを指定します。

```json
{
  "version": 3,
  "cache": [
    "node_modules/**",
    ".next/cache/**"
  ]
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  cache?: string[];
}
```

**用途:**

- ビルドキャッシュの保持
- ビルド時間の短縮
- 依存関係の再利用

### 7. framework

使用しているフレームワークのメタデータ（表示用）。

```json
{
  "version": 3,
  "framework": {
    "version": "13.4.0",
    "slug": "nextjs"
  }
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  framework?: {
    version?: string;
    slug?: string;
  };
}
```

### 8. crons

本番デプロイメント用のcronジョブを定義します。

```json
{
  "version": 3,
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cleanup",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**型定義:**

```typescript
interface Config {
  version: 3;
  crons?: Array<{
    path: string;
    schedule: string;
  }>;
}
```

**スケジュール形式:**

標準的なcron式を使用：

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ 曜日 (0-6)
│ │ │ └─── 月 (1-12)
│ │ └───── 日 (1-31)
│ └─────── 時 (0-23)
└───────── 分 (0-59)
```

## 完全な設定例

```json
{
  "version": 3,
  "routes": [
    {
      "src": "/old-path",
      "dest": "/new-path",
      "status": 308
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "images": {
    "sizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    "domains": ["cdn.example.com"],
    "formats": ["image/avif", "image/webp"],
    "minimumCacheTTL": 60
  },
  "cache": [
    "node_modules/**",
    ".next/cache/**"
  ],
  "framework": {
    "version": "13.4.0",
    "slug": "nextjs"
  },
  "crons": [
    {
      "path": "/api/daily-report",
      "schedule": "0 9 * * *"
    }
  ]
}
```

## ベストプラクティス

1. **バージョンの明示**
   - 常に`version: 3`を指定

2. **ルーティングの最適化**
   - 明確で保守しやすいルーティングルールを作成
   - 正規表現を適切に使用

3. **画像最適化の設定**
   - プロジェクトに適したサイズを定義
   - 必要なドメインのみを許可

4. **キャッシュの活用**
   - ビルド時間を短縮するためにキャッシュを適切に設定

5. **セキュリティ**
   - `dangerouslyAllowSVG`は慎重に使用
   - 適切なCSPヘッダーを設定

## 関連リンク

- [Build Output API 概要](/docs/build-output-api)
- [Build Output API 機能](/docs/build-output-api/features)
- [Build Output API プリミティブ](/docs/build-output-api/primitives)
