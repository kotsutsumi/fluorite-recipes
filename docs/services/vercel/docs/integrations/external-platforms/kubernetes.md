# Vercel と Kubernetes の統合

Kubernetes (K8s) は、コンテナ化されたアプリケーションの展開、スケーリング、管理を自動化するオープンソースシステムです。多くの企業で人気のある強力な方法となっています。

Vercelを既存のKubernetesインフラストラクチャと統合することで、フロントエンドアプリケーションの配信を最適化できます。これにより、チームが管理する必要のあるサービスの数を減らしながら、バックエンドや他のコンテナ化されたワークロードにはKubernetesの利点を活かすことができます。

## 主要なKubernetesの概念とVercelの管理インフラストラクチャ

以下の観点から、Kubernetesとの統合を詳しく見ていきます：

- [サーバー管理とプロビジョニング](#サーバー管理とプロビジョニング)
- [スケーリングと冗長性](#スケーリングと冗長性)
- [環境と展開の管理](#環境と展開の管理)
- [アクセスとセキュリティの管理](#アクセスとセキュリティの管理)
- [観測性](#観測性)
- [KubernetesバックエンドとのVercel統合](#kubernetesバックエンドとのvercel統合)
- [比較：Kubernetes vs Vercel](#比較-kubernetes-vs-vercel)
- [Kubernetesからの移行](#kubernetesからの移行)

## サーバー管理とプロビジョニング

### Kubernetes

Kubernetesでは、各ノードとクラスターのWebサーバー（Nginx等）、リソース（CPU、メモリ）、ストレージを管理する必要があります。

**主要タスク**:
- ノードのプロビジョニング
- クラスターの設定
- リソースの割り当て
- ストレージの管理
- ネットワークの設定

**設定例**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: myapp:latest
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

### Vercel

Vercelは自動的にインフラストラクチャをプロビジョニングし、管理します。

**自動化される内容**:
- サーバープロビジョニング
- リソース割り当て
- スケーリング
- ロードバランシング
- CDN設定

## スケーリングと冗長性

### Kubernetes

**水平ポッドオートスケーラー (HPA)**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**主要な責任**:
- レプリカ数の設定
- スケーリングメトリクスの定義
- ヘルスチェックの実装
- ローリングアップデートの管理

### Vercel

**自動スケーリング**:
- トラフィックに基づく自動スケーリング
- グローバルエッジネットワーク
- 組み込みの冗長性
- ゼロダウンタイムデプロイ

## 環境と展開の管理

### Kubernetes

**デプロイメント設定**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
      env: production
  template:
    metadata:
      labels:
        app: frontend
        env: production
    spec:
      containers:
      - name: app
        image: myapp:v1.2.3
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: API_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: api-url
```

**環境管理**:
- ネームスペースで環境を分離
- ConfigMapsとSecretsで設定管理
- 異なる環境用の複数のマニフェスト

### Vercel

**簡素化された環境管理**:
```typescript
// vercel.json
{
  "env": {
    "API_URL": "@api-url"
  },
  "build": {
    "env": {
      "BUILD_ENV": "production"
    }
  }
}
```

**自動プレビュー環境**:
- プルリクエストごとの自動プレビュー
- 環境変数の自動継承
- 簡単な環境切り替え

## アクセスとセキュリティの管理

### Kubernetes

**RBAC設定**:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: production
subjects:
- kind: User
  name: developer
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

**セキュリティタスク**:
- RBAC ポリシーの設定
- ネットワークポリシーの管理
- シークレットの管理
- TLS/SSL 証明書の更新

### Vercel

**統合されたアクセス管理**:
- チームベースのアクセス制御
- プロジェクトレベルの権限
- 自動HTTPS/SSL
- 組み込みのセキュリティ機能

## 観測性

### Kubernetes

**モニタリングスタック**:
```yaml
# Prometheus設定例
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
```

**必要なツール**:
- Prometheus（メトリクス）
- Grafana（可視化）
- Fluentd/Fluent Bit（ログ）
- Jaeger（トレーシング）

### Vercel

**組み込みの観測性**:
- リアルタイムログ
- パフォーマンスメトリクス
- Web Analytics
- デプロイメント履歴
- エラートラッキング

アクセス方法：
```bash
vercel logs
vercel inspect [deployment-url]
```

## KubernetesバックエンドとのVercel統合

Vercelフロントエンドとk8sバックエンドを統合する最良の方法：

### 1. APIゲートウェイパターン

**Kubernetes側**:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```

**Vercel側**:
```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};
```

### 2. 環境変数の設定

```bash
# Vercelプロジェクトに環境変数を追加
vercel env add API_URL production
# 値: https://api.example.com

vercel env add API_KEY production
# 値: your-api-key
```

### 3. CORSの設定

**Kubernetes APIサービス**:
```typescript
// Express.js例
import cors from 'cors';

app.use(cors({
  origin: [
    'https://yourapp.vercel.app',
    'https://*.vercel.app', // プレビューデプロイメント用
  ],
  credentials: true,
}));
```

### 4. 認証とセキュリティ

**JWTトークン認証**:
```typescript
// Vercelフロントエンド
async function callAPI(endpoint: string) {
  const token = await getAuthToken();

  const response = await fetch(`${process.env.API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
```

**Kubernetes APIでの検証**:
```typescript
// バックエンドミドルウェア
import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

## 比較：Kubernetes vs Vercel

| 側面 | Kubernetes | Vercel |
|------|-----------|--------|
| **セットアップ** | 複雑、手動設定が必要 | シンプル、自動化 |
| **スケーリング** | 手動設定（HPA） | 自動 |
| **デプロイ** | CI/CD設定が必要 | Git統合 |
| **環境管理** | ネームスペース、マニフェスト | 自動プレビュー |
| **モニタリング** | 外部ツールが必要 | 組み込み |
| **コスト** | インフラ＋運用 | 使用量ベース |
| **学習曲線** | 急勾配 | 緩やか |
| **柔軟性** | 非常に高い | フロントエンドに最適化 |

## Kubernetesからの移行

### フロントエンドの移行手順

1. **既存アプリケーションの評価**:
   ```bash
   # Kubernetesデプロイメントの確認
   kubectl get deployments
   kubectl describe deployment frontend
   ```

2. **Vercelプロジェクトの作成**:
   ```bash
   # リポジトリをVercelにインポート
   vercel login
   vercel link
   vercel
   ```

3. **環境変数の移行**:
   ```bash
   # Kubernetesから環境変数を取得
   kubectl get configmap app-config -o yaml

   # Vercelに追加
   vercel env add API_URL production
   ```

4. **段階的な移行**:
   - まずステージング環境をVercelに移行
   - プレビューデプロイメントでテスト
   - トラフィックを徐々に切り替え
   - 本番環境を移行

5. **DNSの更新**:
   ```bash
   # 古いDNS
   frontend.example.com → Kubernetes LoadBalancer IP

   # 新しいDNS
   frontend.example.com → CNAME → cname.vercel-dns.com
   ```

### バックエンドの保持

Kubernetesバックエンドを保持しながらVercelフロントエンドを使用：

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://k8s-api.example.com/:path*',
      },
    ];
  },
};
```

## ベストプラクティス

### パフォーマンス

- **エッジキャッシング**: Vercelのエッジネットワークを活用
- **API最適化**: 必要なデータのみを取得
- **静的生成**: 可能な限りSSGを使用

### セキュリティ

- **環境変数**: 機密情報を安全に管理
- **CORS**: 適切なCORS設定
- **認証**: トークンベースの認証を実装

### モニタリング

- **ログ**: Vercelとk8sの両方でログを監視
- **メトリクス**: パフォーマンスメトリクスを追跡
- **アラート**: 問題の早期検出

## トラブルシューティング

### CORS エラー

1. k8s APIのCORS設定を確認
2. Vercelドメインをallowlistに追加
3. プリフライトリクエストを処理

### 認証問題

1. トークンの有効期限を確認
2. JWT署名を検証
3. 環境変数が正しく設定されているか確認

### パフォーマンス問題

1. API レスポンスタイムを確認
2. ネットワークレイテンシを測定
3. キャッシング戦略を最適化

## 関連リソース

- [Kubernetes ドキュメント](https://kubernetes.io/docs/)
- [Vercel ドキュメント](https://vercel.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
