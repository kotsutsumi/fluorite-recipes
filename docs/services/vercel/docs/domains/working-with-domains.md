# Working with Domains（ドメインの操作）

Vercelでドメインを管理するための包括的なガイドです。

## ドメイン名の購入

### Vercelの自動割り当て

Vercelは、すべてのデプロイメントに`.vercel.app`ドメインを自動的に割り当てます。

**例**:
- `my-project-abc123.vercel.app`

### ドメイン取得の2つの方法

#### 1. Vercel経由での購入

**利点**:
- 自動ネームサーバー設定
- 簡素化されたDNS管理
- 自動SSL証明書更新
- シームレスな統合

#### 2. サードパーティ経由での購入

**主要なレジストラ**:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- その他のレジストラ

## ドメインの所有権とプロジェクトへの割り当て

### ドメインの所有権

ドメインは、特定のチームが所有します。

**管理場所**:
1. **チームのDomainsタブ**: すべてのドメインの一覧表示
2. **プロジェクトのSettings > Domains**: プロジェクト固有のドメイン

### プロジェクトへの割り当て

- ドメインは1つまたは複数のプロジェクトに割り当て可能
- 各プロジェクトで個別に管理

## ドメインタイプ

### 1. Apex Domain（ルートドメイン）

**定義**: サブドメインを含まないルートレベルのドメイン

**例**:
- `acme.com`
- `example.org`

**設定方法**:
- Aレコードを使用
- ALIASレコードを使用（一部のDNSプロバイダー）

### 2. Subdomain（サブドメイン）

**定義**: ドメインの特定部分

**例**:
- `blog.acme.com`
- `api.example.com`
- `docs.mysite.org`

**設定方法**:
- CNAMEレコードを使用

### 3. Wildcard Domain（ワイルドカードドメイン）

**定義**: 複数のサブドメインをサポートするドメイン

**例**:
- `*.acme.com`

**マッチするサブドメイン**:
- `anything.acme.com`
- `test.acme.com`
- `user123.acme.com`

**要件**:
- Vercelのネームサーバーを使用する必要がある

## Vercel経由でのドメイン購入の利点

### 1. 自動ネームサーバー設定

手動でのネームサーバー設定が不要です。

### 2. 簡素化されたDNS管理

Vercelダッシュボードから直接DNSレコードを管理できます。

**操作**:
- Aレコードの追加
- CNAMEレコードの追加
- MXレコードの追加
- その他のDNSレコードの管理

### 3. 自動SSL証明書更新

SSL証明書が自動的に生成および更新されます。

**特徴**:
- Let's Encryptを使用
- 追加コストなし
- メンテナンス不要

### 4. シームレスな統合

ドメインがVercelプロジェクトとシームレスに統合されます。

## メール設定

### 重要な注意事項

**Vercelはメールサービスを提供していません**

### 推奨サービス

#### 1. ImprovMX

**URL**: https://improvmx.com

**特徴**:
- 無料プランあり
- メール転送サービス
- 簡単な設定

#### 2. Forward Email

**URL**: https://forwardemail.net

**特徴**:
- オープンソース
- プライバシー重視
- 無料プランあり

### メール設定の手順

1. **サードパーティメールサービスに登録**
2. **MXレコードを設定**

**MXレコード例（ImprovMX）**:

```
Type: MX
Name: @
Value: mx1.improvmx.com
Priority: 10

Type: MX
Name: @
Value: mx2.improvmx.com
Priority: 20
```

3. **設定を検証**

```bash
dig mx example.com
```

## 推奨プラクティス

### 1. ApexドメインをWWWサブドメインにリダイレクト

**推奨設定**:

```
acme.com → www.acme.com
```

**理由**:
- **CDN制御の向上**: CNAMEレコードの柔軟性
- **DNS管理の簡素化**: サブドメインの方が管理しやすい
- **ブラウザの表示**: 一部のブラウザ（Chrome）は自動的にwwwを非表示

**設定方法**:

```json
{
  "redirects": [
    {
      "source": "acme.com/:path*",
      "destination": "https://www.acme.com/:path*",
      "permanent": true
    }
  ]
}
```

### 2. ApexとWWWの両方を追加

**推奨**:
- `acme.com`を追加
- `www.acme.com`を追加
- 一方から他方へリダイレクト

**効果**:
- ユーザーがどちらでアクセスしても適切に機能
- SEOの向上

### 3. Vercelネームサーバーの使用

ワイルドカードドメインや簡単な管理のために、Vercelのネームサーバーを使用します。

**Vercelのネームサーバー**:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

## ドメインURL割り当て

**割り当てルール**: 先着順

ドメインURLは、先着順で割り当てられます。

## Gitブランチへのドメイン割り当て

**機能**: 特定のGitブランチにドメインを割り当てることができます

**用途**:
- ステージング環境
- 開発環境
- プレビュー環境
- A/Bテスト

**例**:
- `staging.example.com` → `staging`ブランチ
- `dev.example.com` → `develop`ブランチ

詳細: [Assign Domain to Git Branch](/docs/domains/working-with-domains/assign-domain-to-a-git-branch)

## カスタムリダイレクション

ドメイン間でカスタムリダイレクションを設定できます。

**例**:

```json
{
  "redirects": [
    {
      "source": "old-domain.com/:path*",
      "destination": "https://new-domain.com/:path*",
      "permanent": true
    }
  ]
}
```

## DNS設定の検証

### ネームサーバーの確認

```bash
dig ns example.com
```

**期待される出力**:

```
example.com.  3600  IN  NS  ns1.vercel-dns.com.
example.com.  3600  IN  NS  ns2.vercel-dns.com.
```

### Aレコードの確認

```bash
dig a example.com
```

**期待される出力**:

```
example.com.  300  IN  A  76.76.21.21
```

### CNAMEレコードの確認

```bash
dig cname www.example.com
```

**期待される出力**:

```
www.example.com.  300  IN  CNAME  cname.vercel-dns.com.
```

## ベストプラクティス

### 1. 適切なドメインタイプの選択

- **Apex domain**: メインサイト
- **Subdomain**: サービスやセクション別
- **Wildcard domain**: ユーザー固有のサブドメイン

### 2. SSL証明書の自動更新

Vercel経由でドメインを購入すると、SSL証明書が自動的に管理されます。

### 3. DNSの伝播時間を考慮

DNS変更は、完全に伝播するまで24〜48時間かかる場合があります。

### 4. 本番環境とプレビュー環境の分離

- 本番ドメイン: `example.com`
- ステージング: `staging.example.com`
- 開発: `dev.example.com`

## 関連ドキュメント

- [ドメインの追加](/docs/domains/working-with-domains/add-a-domain)
- [環境へのドメイン追加](/docs/domains/working-with-domains/add-a-domain-to-environment)
- [Gitブランチへのドメイン割り当て](/docs/domains/working-with-domains/assign-domain-to-a-git-branch)
- [デプロイとリダイレクト](/docs/domains/working-with-domains/deploying-and-redirecting)
- [ドメインの削除](/docs/domains/working-with-domains/remove-a-domain)
- [ドメインの更新](/docs/domains/working-with-domains/renew-a-domain)
- [ドメインの転送](/docs/domains/working-with-domains/transfer-your-domain)
- [ドメインの表示と検索](/docs/domains/working-with-domains/view-and-search-domains)

## まとめ

Vercelのドメイン管理は、シンプルで強力な機能を提供します。自動SSL証明書、簡素化されたDNS管理、柔軟なドメイン割り当てにより、開発者はインフラストラクチャの管理ではなく、アプリケーションの構築に集中できます。
