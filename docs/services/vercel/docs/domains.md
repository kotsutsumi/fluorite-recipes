# Domains（ドメイン）

ドメインは、"vercel.com"のような、ユーザーフレンドリーなWebアドレスです。Webサイトの郵便住所のような機能を果たします。

## ドメインの概要

ドメインは、人間が読みやすいアドレスをコンピューターが理解できるIPアドレスにマッピングします。

**例**:
- ドメイン: `vercel.com`
- IPアドレス: `76.76.21.21`

## 主要な概念

### DNS (Domain Name System)

DNSは、ドメイン名をIPアドレスにマッピングするシステムです。

#### DNS解決プロセス

1. **ブラウザのローカルDNSキャッシュを確認**
   - 最近訪問したサイトの情報がキャッシュされている

2. **再帰リゾルバにクエリ**
   - 通常はISP（インターネットサービスプロバイダー）から提供される

3. **ルートネームサーバーを確認**
   - DNSシステムの最上位レベル
   - TLDサーバーへの方向を提供

4. **TLD（トップレベルドメイン）サーバーに問い合わせ**
   - `.com`、`.org`、`.jp`などのTLD情報を管理

5. **権威ネームサーバーの詳細を取得**
   - 特定のドメインの情報を管理

6. **権威ネームサーバーがIPアドレスを返す**
   - 最終的なIPアドレスを取得

### Vercelでの開発時

- サイトはVercelのWebサーバー上に存在（IP: `76.76.21.21`）
- ブラウザはDNSルックアップを実行してドメインをマッピング

## 重要なDNS設定要素

### 1. DNS Records（DNSレコード）

ドメインをIPアドレスにマッピングします。

**主要なレコードタイプ**:
- **CNAME**: ドメイン名のエイリアスを作成
- **A**: IPv4アドレスにマッピング
- **NS**: ネームサーバーを指定
- **MX**: メールサーバーを指定

詳細: [Working with DNS](/docs/domains/working-with-dns)

### 2. Nameservers（ネームサーバー）

DNSレコードのメンテナンスを管理します。

**Vercelのネームサーバー**:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

詳細: [Working with Nameservers](/docs/domains/working-with-nameservers)

### 3. SSL Certificates（SSL証明書）

Webサイトのセキュアな接続を保証します。

**Vercelの機能**:
- 自動SSL証明書生成
- Let's Encryptを使用
- 自動更新

詳細: [Working with SSL](/docs/domains/working-with-ssl)

## ドメインの取得

### Vercel経由での購入

**利点**:
- 自動ネームサーバー設定
- 簡素化されたDNS管理
- 自動SSL証明書更新

### サードパーティ経由での購入

**主要なレジストラ**:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare

**設定手順**:
1. ドメインを購入
2. VercelのDNSレコードを設定
3. SSL証明書を生成

## ドメインタイプ

### Apex Domain（ルートドメイン）

**例**: `example.com`

**特徴**:
- サブドメインを含まないルートレベルのドメイン
- A recordまたはALIASレコードで設定

### Subdomain（サブドメイン）

**例**: `blog.example.com`、`api.example.com`

**特徴**:
- ドメインの特定部分
- CNAMEレコードで設定

### Wildcard Domain（ワイルドカードドメイン）

**例**: `*.example.com`

**特徴**:
- 複数のサブドメインをサポート
- Vercelのネームサーバーが必要

**マッチ例**:
- `anything.example.com`
- `test.example.com`
- `api.example.com`

## Vercelドメインの利点

### 1. 自動ネームサーバー設定

手動設定が不要で、即座に利用可能です。

### 2. 簡素化されたDNS管理

Vercelダッシュボードから直接DNSレコードを管理できます。

### 3. 自動SSL証明書更新

SSL証明書の有効期限を気にする必要がありません。

### 4. `.vercel.app`ドメイン

すべてのデプロイメントに自動的に割り当てられます。

**例**:
- `my-project-abc123.vercel.app`

## メール設定

### 重要な注意事項

**Vercelはメールサービスを提供していません**

### 推奨サービス

- **ImprovMX**: https://improvmx.com
- **Forward Email**: https://forwardemail.net

### 設定方法

MXレコードを設定する必要があります。

**例**:

```
Type: MX
Name: @
Value: mx1.improvmx.com
Priority: 10
```

詳細: [Managing DNS Records](/docs/domains/managing-dns-records)

## ドメイン管理

### プロジェクトへの割り当て

ドメインは特定のプロジェクトに割り当てられます。

**管理場所**:
1. チームのDomainsタブ
2. プロジェクトのSettings > Domains

### Gitブランチへの割り当て

特定のGitブランチにドメインを割り当てることができます。

**用途**:
- ステージング環境
- プレビュー環境
- 開発環境

詳細: [Assign Domain to Git Branch](/docs/domains/working-with-domains/assign-domain-to-a-git-branch)

## 推奨プラクティス

### 1. ApexドメインをWWWサブドメインにリダイレクト

```
example.com → www.example.com
```

**理由**:
- CDN制御の向上
- DNS設定の柔軟性

詳細: [Deploying and Redirecting](/docs/domains/working-with-domains/deploying-and-redirecting)

### 2. Vercelネームサーバーの使用

簡単な管理と自動設定のために推奨されます。

### 3. DNS設定の検証

ドメインを追加した後、DNS設定を確認します。

```bash
# ネームサーバーの確認
dig ns example.com

# Aレコードの確認
dig a example.com

# CNAMEレコードの確認
dig cname www.example.com
```

## トラブルシューティング

一般的な問題と解決方法については、トラブルシューティングガイドを参照してください。

詳細: [Troubleshooting Domains](/docs/domains/troubleshooting)

## 追加リソース

- [ドメインの操作](/docs/domains/working-with-domains)
- [DNSの操作](/docs/domains/working-with-dns)
- [ネームサーバーの操作](/docs/domains/working-with-nameservers)
- [SSLの操作](/docs/domains/working-with-ssl)
- [サポートされているドメイン](/docs/domains/supported-domains)
- [Registrar API](/docs/domains/registrar-api)

## まとめ

ドメインは、Webサイトへのアクセスを可能にする重要な要素です。Vercelは、ドメインの購入、設定、管理を簡素化し、自動SSL証明書とDNS管理を提供することで、開発者がアプリケーションの構築に集中できるようにします。
