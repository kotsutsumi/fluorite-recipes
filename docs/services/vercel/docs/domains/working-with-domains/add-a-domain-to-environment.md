# 環境へのドメインの追加

特定の環境にカスタムドメインを割り当てる方法を説明します。

## 概要

Vercelでは、特定の環境（本番、プレビュー、カスタム環境）にドメインを割り当てることができます。

## カスタムドメインを環境に割り当てる手順

### 1. プロジェクト設定に移動

1. Vercelダッシュボードに移動
2. プロジェクトを選択
3. **Settings**タブをクリック
4. **Environments**メニュー項目を選択

### 2. 環境の選択

割り当てたい特定の環境を選択します。

**注意**: ProおよびEnterpriseプランでは、カスタム環境を作成できます。

### 3. ドメイン設定の要件

#### 既に使用されているドメインの場合

TXTレコードを使用して「ドメインへのアクセスを検証」する必要があります。

**検証手順**:
1. Vercelが提供するTXTレコードを取得
2. DNSレジストラにTXTレコードを追加
3. Vercelで検証を実行

#### Apexドメインの設定

**方法**: Aレコードを使用

**DNSレジストラでの設定**:
```
Type: A
Name: @ (または空白)
Value: 76.76.21.21
```

**例**: `example.com`

#### サブドメインの設定

**方法**: CNAMEレコードを使用

**DNSレジストラでの設定**:
```
Type: CNAME
Name: docs (またはサブドメイン名)
Value: cname.vercel-dns.com
```

**例**: `docs.example.com`

## 環境の種類

### 1. Production（本番環境）

**用途**: 本番トラフィック用のメインドメイン

**例**:
- `example.com`
- `www.example.com`

### 2. Preview（プレビュー環境）

**用途**: Pull RequestやGitブランチのプレビュー

**例**:
- `preview.example.com`
- `staging.example.com`

### 3. Custom Environments（カスタム環境）

**利用可能プラン**: ProおよびEnterprise

**用途**: 特定の環境やチーム用のカスタムドメイン

**例**:
- `dev.example.com`
- `qa.example.com`
- `internal.example.com`

## DNS設定の検証

### Aレコードの検証

```bash
dig a example.com
```

**期待される出力**:
```
example.com.  300  IN  A  76.76.21.21
```

### CNAMEレコードの検証

```bash
dig cname docs.example.com
```

**期待される出力**:
```
docs.example.com.  300  IN  CNAME  cname.vercel-dns.com.
```

## ベストプラクティス

### 1. 環境ごとの分離

明確な命名規則を使用して、環境を分離します。

**推奨**:
- 本番: `example.com`, `www.example.com`
- ステージング: `staging.example.com`
- 開発: `dev.example.com`
- QA: `qa.example.com`

### 2. 適切なDNS設定

環境ごとに適切なDNSレコードを設定します。

### 3. SSL証明書の自動生成

ドメインを環境に割り当てると、Vercelが自動的にSSL証明書を生成します。

### 4. アクセス制御

プレビューや開発環境には、適切なアクセス制御を実装します。

**実装例（Next.js Middleware）**:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');

  // 開発環境へのアクセスを制限
  if (host?.startsWith('dev.')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !isValidAuth(authHeader)) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

function isValidAuth(auth: string): boolean {
  // 認証ロジック
  return true;
}
```

## トラブルシューティング

### ドメインが環境に表示されない

1. DNS設定が正しいか確認
2. DNS伝播を待つ（最大48時間）
3. Vercelダッシュボードでドメインの状態を確認

### SSL証明書の生成に失敗

1. DNSレコードが正しく設定されているか確認
2. `/.well-known`パスがブロックされていないか確認
3. Vercelダッシュボードで再試行

## 関連ドキュメント

- [ドメインの追加](/docs/domains/working-with-domains/add-a-domain)
- [Gitブランチへのドメイン割り当て](/docs/domains/working-with-domains/assign-domain-to-a-git-branch)
- [SSL証明書の操作](/docs/domains/working-with-ssl)
- [トラブルシューティング](/docs/domains/troubleshooting)

## まとめ

環境へのドメイン割り当ては、開発、ステージング、本番環境を分離する強力な方法です。ProおよびEnterpriseプランでは、カスタム環境を作成してさらに柔軟な管理が可能です。
