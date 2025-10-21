# Turso - Akamai (Linode)でEmbedded Replicasを使用

Akamai Connected Cloud (旧 Linode)上でTurso Embedded Replicasを使用してアプリケーションのパフォーマンスを向上させる方法を説明します。

## 概要

Akamai Connected Cloudは、世界中にデータセンターを持つクラウドプラットフォームです。Turso Embedded Replicasを組み合わせることで、各Linodeインスタンスがローカルデータベースレプリカを持ち、低レイテンシでデータにアクセスできます。

## セットアップ

### 1. Tursoデータベースの作成

```bash
# Tursoデータベースを作成
turso db create my-akamai-app

# データベースURLを取得
turso db show my-akamai-app --url

# 認証トークンを作成
turso db tokens create my-akamai-app
```

### 2. Linodeインスタンスの作成

```bash
# Linode CLIをインストール
pip3 install linode-cli

# ログイン
linode-cli configure

# インスタンスを作成
linode-cli linodes create \
  --type g6-standard-1 \
  --region ap-northeast \
  --image linode/ubuntu22.04 \
  --root_pass 'your-secure-password' \
  --label my-turso-app
```

### 3. サーバーセットアップ

```bash
# SSHでログイン
ssh root@your-linode-ip

# システムアップデート
apt update && apt upgrade -y

# Node.jsインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# アプリケーション用ディレクトリ作成
mkdir -p /opt/app
cd /opt/app
```

## 実装例

### Node.js/Express アプリケーション

```typescript
// server.ts
import express from "express";
import { createClient } from "@libsql/client";
import path from "path";

const app = express();
app.use(express.json());

// データベースファイルのパス
const dbPath = process.env.DB_PATH || "/var/lib/turso/local.db";

const client = createClient({
  url: `file:${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 初期化
async function initialize() {
  console.log("Initializing Turso Embedded Replica...");
  console.log(`Database path: ${dbPath}`);

  try {
    // 初回同期
    await client.sync();
    console.log("Initial sync completed successfully");

    // バックグラウンド同期を開始
    startBackgroundSync();
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}

function startBackgroundSync() {
  const SYNC_INTERVAL = 60000; // 1分

  setInterval(async () => {
    try {
      const startTime = Date.now();
      await client.sync();
      const duration = Date.now() - startTime;
      console.log(`Background sync completed in ${duration}ms`);
    } catch (error) {
      console.error("Background sync failed:", error);
    }
  }, SYNC_INTERVAL);

  console.log(`Background sync started (interval: ${SYNC_INTERVAL}ms)`);
}

// API Endpoints
app.get("/api/products", async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;

    let sql = "SELECT * FROM products";
    const args: any[] = [];

    if (category) {
      sql += " WHERE category = ?";
      args.push(category);
    }

    sql += " ORDER BY created_at DESC LIMIT ?";
    args.push(Number(limit));

    const result = await client.execute({ sql, args });

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    const result = await client.execute({
      sql: `
        INSERT INTO products (name, category, price, description)
        VALUES (?, ?, ?, ?)
        RETURNING *
      `,
      args: [name, category, price, description],
    });

    // 書き込み後に同期
    await client.sync();

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description } = req.body;

    const result = await client.execute({
      sql: `
        UPDATE products
        SET name = ?, category = ?, price = ?, description = ?
        WHERE id = ?
        RETURNING *
      `,
      args: [name, category, price, description, id],
    });

    await client.sync();

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await client.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [id],
    });

    await client.sync();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete product",
    });
  }
});

app.get("/health", async (req, res) => {
  try {
    await client.execute("SELECT 1");

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      dbPath,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initialize();
});
```

## システム設定

### データベースディレクトリの準備

```bash
# データベース用ディレクトリを作成
sudo mkdir -p /var/lib/turso
sudo chown -R $USER:$USER /var/lib/turso
sudo chmod 755 /var/lib/turso
```

### 環境変数の設定

```bash
# /opt/app/.env
TURSO_DATABASE_URL=libsql://my-akamai-app-[org].turso.io
TURSO_AUTH_TOKEN=your-auth-token
DB_PATH=/var/lib/turso/local.db
PORT=3000
NODE_ENV=production
```

### Systemdサービスの作成

```ini
# /etc/systemd/system/turso-app.service
[Unit]
Description=Turso Application
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/app
EnvironmentFile=/opt/app/.env
ExecStart=/usr/bin/node /opt/app/dist/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=turso-app

[Install]
WantedBy=multi-user.target
```

### サービスの起動

```bash
# サービスユーザーを作成
sudo useradd -r -s /bin/false nodejs
sudo chown -R nodejs:nodejs /opt/app
sudo chown -R nodejs:nodejs /var/lib/turso

# サービスを有効化・起動
sudo systemctl daemon-reload
sudo systemctl enable turso-app
sudo systemctl start turso-app

# ステータス確認
sudo systemctl status turso-app

# ログ確認
sudo journalctl -u turso-app -f
```

## Nginxリバースプロキシ

### Nginxのインストール

```bash
sudo apt install -y nginx
```

### Nginx設定

```nginx
# /etc/nginx/sites-available/turso-app
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ヘルスチェック
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

### SSL/TLS設定（Let's Encrypt）

```bash
# Certbotをインストール
sudo apt install -y certbot python3-certbot-nginx

# SSL証明書を取得
sudo certbot --nginx -d your-domain.com

# 自動更新の確認
sudo certbot renew --dry-run
```

### Nginxの有効化

```bash
# サイトを有効化
sudo ln -s /etc/nginx/sites-available/turso-app /etc/nginx/sites-enabled/

# 設定をテスト
sudo nginx -t

# Nginxを再起動
sudo systemctl restart nginx
```

## パフォーマンス最適化

### 1. データベースファイルの配置

```bash
# SSDストレージを使用
df -h

# 高速なディスクにDBを配置
# Linodeの場合、Block Storageを検討
```

### 2. システムチューニング

```bash
# /etc/sysctl.conf
# ファイルディスクリプタの上限を増やす
fs.file-max = 65536

# TCPバッファサイズの最適化
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# 設定を適用
sudo sysctl -p
```

### 3. Node.jsの最適化

```bash
# package.json
{
  "scripts": {
    "start": "node --max-old-space-size=512 dist/server.js"
  }
}
```

## モニタリング

### システムメトリクス収集

```typescript
// metrics.ts
import os from "os";

export function getSystemMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    memory: {
      total: Math.round(totalMem / 1024 / 1024),
      used: Math.round(usedMem / 1024 / 1024),
      free: Math.round(freeMem / 1024 / 1024),
      usagePercent: Math.round((usedMem / totalMem) * 100),
    },
    cpu: {
      loadAverage: os.loadavg(),
      cpuCount: os.cpus().length,
    },
    uptime: os.uptime(),
  };
}

// メトリクスエンドポイント
app.get("/metrics", (req, res) => {
  res.json({
    system: getSystemMetrics(),
    process: {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      version: process.version,
    },
  });
});
```

### ログ管理

```bash
# ログローテーション設定
# /etc/logrotate.d/turso-app
/var/log/turso-app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nodejs nodejs
    sharedscripts
}
```

## バックアップ

### データベースバックアップスクリプト

```bash
#!/bin/bash
# /opt/scripts/backup-turso.sh

BACKUP_DIR="/var/backups/turso"
DB_PATH="/var/lib/turso/local.db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/local_$DATE.db"

# バックアップディレクトリを作成
mkdir -p $BACKUP_DIR

# データベースをコピー
cp $DB_PATH $BACKUP_FILE

# 7日以上古いバックアップを削除
find $BACKUP_DIR -name "local_*.db" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

### Cronジョブの設定

```bash
# バックアップスクリプトを実行可能にする
chmod +x /opt/scripts/backup-turso.sh

# Cronジョブを追加（毎日午前2時）
crontab -e

# 以下を追加
0 2 * * * /opt/scripts/backup-turso.sh >> /var/log/turso-backup.log 2>&1
```

## マルチリージョンデプロイ

### リージョン選択

Akamai Connected Cloudの主要リージョン：

- **Tokyo (ap-northeast)** - 東京
- **Singapore (ap-south)** - シンガポール
- **Mumbai (ap-west)** - ムンバイ
- **Frankfurt (eu-central)** - フランクフルト
- **Newark (us-east)** - ニューアーク
- **Fremont (us-west)** - フリーモント

### 各リージョンでのセットアップ

```bash
# 各リージョンでLinodeインスタンスを作成
linode-cli linodes create --region ap-northeast --type g6-standard-1 ...
linode-cli linodes create --region eu-central --type g6-standard-1 ...
linode-cli linodes create --region us-east --type g6-standard-1 ...

# 各インスタンスで同じアプリケーションをデプロイ
# すべてのインスタンスが同じTursoデータベースを参照
```

## セキュリティ

### ファイアウォール設定

```bash
# UFWを有効化
sudo ufw enable

# SSH許可
sudo ufw allow 22/tcp

# HTTP/HTTPS許可
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# ステータス確認
sudo ufw status
```

### 環境変数の保護

```bash
# .envファイルのパーミッション
chmod 600 /opt/app/.env
chown nodejs:nodejs /opt/app/.env
```

## トラブルシューティング

### ディスク容量確認

```bash
# ディスク使用量確認
df -h

# データベースサイズ確認
du -sh /var/lib/turso/local.db
```

### メモリ使用量

```bash
# メモリ使用状況
free -h

# プロセス別メモリ使用量
ps aux --sort=-%mem | head
```

### サービスの再起動

```bash
# アプリケーションの再起動
sudo systemctl restart turso-app

# Nginxの再起動
sudo systemctl restart nginx
```

## ベストプラクティス

1. **永続ストレージ**: `/var/lib`配下にデータベースを配置
2. **Systemdサービス**: アプリケーションの自動起動と監視
3. **Nginxリバースプロキシ**: SSL/TLS、負荷分散
4. **定期バックアップ**: データの安全性確保
5. **モニタリング**: システムとアプリケーションの監視
6. **セキュリティ**: ファイアウォール、環境変数の保護

## 関連リンク

- [Akamai Connected Cloud](https://www.linode.com/)
- [Linode Documentation](https://www.linode.com/docs/)
- [Turso Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction)
- [libSQL Client](https://docs.turso.tech/sdk/ts/reference)
