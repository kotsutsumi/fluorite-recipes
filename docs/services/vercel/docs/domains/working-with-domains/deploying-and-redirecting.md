# デプロイとドメインリダイレクト

ドメインのデプロイとリダイレクトの設定について説明します。

## ドメインのデプロイ

### 自動デプロイ

ドメインが追加され設定されると、最新の本番デプロイメントに自動的に適用されます。

### デプロイのタイミング

#### 初回デプロイメント

新しいプロジェクトの最初のデプロイメントが本番デプロイメントになります。

#### Git接続プロジェクト

Git接続されたプロジェクトでは、本番ブランチ（通常は`main`）へのプッシュごとにデプロイメントがトリガーされます。

**自動デプロイフロー**:
```
git push origin main → Vercel自動デプロイ → カスタムドメインに適用
```

### 異なるブランチへのドメイン割り当て

ドメインを異なるブランチに割り当てる場合、正しく解決されるために新しいデプロイメントが必要です。

### ロールバック

ロールバックは即座に反映され、カスタムドメインが前のデプロイメントに割り当てられます。

**ロールバック手順**:
1. Vercelダッシュボードでプロジェクトに移動
2. Deploymentsタブを選択
3. ロールバックしたいデプロイメントを選択
4. 「Promote to Production」をクリック

## ドメインのリダイレクト

### ドメインリダイレクトの追加

Domainsタブで、複数のドメインがある場合にドメインリダイレクトを追加できます。

**用途**:
- `www`とApexドメイン間のリダイレクト
- 古いドメインから新しいドメインへのリダイレクト

### 自動リダイレクト

Vercelは、`www`とnon-`www`バージョン間で自動的にリダイレクトを試みます。

**例**:
```
example.com → www.example.com
または
www.example.com → example.com
```

## 推奨されるドメイン設定

### WWWサブドメインを優先ドメインとして使用

**推奨設定**:
```
example.com → www.example.com (リダイレクト)
www.example.com (メインドメイン)
```

**理由**:

#### 1. CDN制御の向上

CNAMEレコードは、Aレコードよりも柔軟です。

**技術的詳細**:
- **Apexドメイン**: Aレコードを使用（IPアドレスに直接ポイント）
- **WWWサブドメイン**: CNAMEレコードを使用（柔軟なルーティング）

#### 2. DNS仕様の制約

DNS仕様では、Apexドメインに対するCNAMEレコードを防ぎます。

**制約**:
```
✅ 許可: www.example.com CNAME cname.vercel-dns.com
❌ 禁止: example.com CNAME cname.vercel-dns.com
```

### ブラウザの表示

一部のブラウザ（Chrome）は、`www`を自動的に非表示にします。

**ユーザーの表示**:
```
実際: https://www.example.com/page
表示: example.com/page
```

## 技術的なドメインリダイレクトの詳細

### Anycast方式

Vercelは、ApexドメインのAnycast方式を使用して、信頼性の高いルーティングを実現します。

**Anycastの利点**:
- 高可用性
- 低レイテンシ
- 自動フェイルオーバー

### CNAMEの柔軟性

CNAMEレコードは、Aレコードよりも多くの柔軟性を提供します。

**柔軟性の例**:
- 自動スケーリング
- 地理的負荷分散
- サーバー変更時の即座の更新

## プログラマティックリダイレクト

フレームワークやVercel Functionsを使用して、追加のリダイレクトを実装できます。

### Next.js でのリダイレクト

**next.config.js**:

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        destination: 'https://www.example.com/:path*',
        permanent: true,
      },
    ];
  },
};
```

### Middlewareでのリダイレクト

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');

  // Apexドメインからwwwにリダイレクト
  if (host === 'example.com') {
    return NextResponse.redirect(
      `https://www.example.com${request.nextUrl.pathname}`,
      301
    );
  }

  return NextResponse.next();
}
```

### vercel.json でのリダイレクト

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "example.com"
        }
      ],
      "destination": "https://www.example.com/:path*",
      "permanent": true
    }
  ]
}
```

## ベストプラクティス

### 1. 一貫したリダイレクト方向

常に同じ方向にリダイレクトします。

**推奨**:
```
example.com → www.example.com (一貫性)
```

**避けるべき**:
```
一部のページ: example.com → www.example.com
他のページ: www.example.com → example.com (非一貫性)
```

### 2. 永続的リダイレクトの使用

ドメインリダイレクトには、308または301ステータスコードを使用します。

**理由**:
- SEOへの影響が良い
- ブラウザキャッシュが効果的

### 3. HTTPSの強制

すべてのリダイレクトでHTTPSを使用します。

```javascript
{
  source: 'http://example.com/:path*',
  destination: 'https://www.example.com/:path*',
  permanent: true
}
```

### 4. テストの実施

リダイレクトが正しく機能するかテストします。

```bash
# curlでリダイレクトをテスト
curl -I http://example.com

# 期待されるレスポンス
HTTP/2 301
location: https://www.example.com/
```

## トラブルシューティング

### リダイレクトが機能しない

1. DNS設定を確認
2. リダイレクト設定を確認
3. ブラウザキャッシュをクリア
4. DNSキャッシュをクリア

### リダイレクトループ

リダイレクト設定が相互に矛盾していないか確認します。

**避けるべき例**:
```
example.com → www.example.com
www.example.com → example.com (ループ!)
```

## 関連ドキュメント

- [ドメインの追加](/docs/domains/working-with-domains/add-a-domain)
- [Gitブランチへのドメイン割り当て](/docs/domains/working-with-domains/assign-domain-to-a-git-branch)
- [Redirects](/docs/redirects)
- [トラブルシューティング](/docs/domains/troubleshooting)

## まとめ

適切なドメイン設定とリダイレクト戦略により、SEO、パフォーマンス、ユーザーエクスペリエンスを向上させることができます。WWWサブドメインを優先ドメインとして使用し、一貫したリダイレクト方向を維持することが推奨されます。
