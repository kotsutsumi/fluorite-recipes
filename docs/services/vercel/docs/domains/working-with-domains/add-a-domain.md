# カスタムドメインの追加と設定

Vercelプロジェクトにカスタムドメインを追加する手順を説明します。

## カスタムドメイン追加の主要ステップ

### 1. ドメイン設定へのナビゲーション

1. プロジェクトダッシュボードに移動
2. **Settings**タブをクリック
3. **Domains**メニュー項目を選択

### 2. ドメインの追加

1. **Add Domain**ボタンをクリック
2. ドメイン名を入力
3. （オプション）ワイルドカードドメインの場合は`*.`を前置

**例**:
- 通常のドメイン: `example.com`
- ワイルドカードドメイン: `*.example.com`

### 3. ドメインDNSの設定

ドメインを追加した後、DNSを設定する必要があります。3つの主要な設定方法があります:

#### A. Aレコード（Apexドメイン用）

**用途**: `example.com`のようなルートドメイン

**設定**:
```
Type: A
Name: @
Value: 76.76.21.21
```

#### B. CNAMEレコード（サブドメイン用）

**用途**: `www.example.com`のようなサブドメイン

**設定**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### C. ネームサーバー方式（ワイルドカードドメイン推奨）

**用途**: `*.example.com`のようなワイルドカードドメイン

**Vercelのネームサーバー**:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

## ドメイン設定の詳細

### Hobbyチームの制限

- **プロジェクトごとに最大50個**のカスタムドメイン

### 自動`.vercel.app` URL

Vercelは、すべてのデプロイメントに自動的に`.vercel.app` URLを提供します。

**例**:
- `my-project-abc123.vercel.app`

### ApexドメインとWWWドメインの両方を追加することを推奨

**推奨設定**:
1. `example.com`を追加
2. `www.example.com`を追加
3. 一方から他方へリダイレクト

## DNS設定オプション

### 1. Apexドメインの設定

**方法**: Aレコードを使用

**DNSレジストラでの設定**:
```
Type: A
Name: @ (または空白)
Value: 76.76.21.21
TTL: 自動または3600
```

**検証**:
```bash
dig a example.com
```

### 2. サブドメインの設定

**方法**: CNAMEレコードを使用

**DNSレジストラでの設定**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 自動または3600
```

**検証**:
```bash
dig cname www.example.com
```

### 3. ワイルドカードドメインの設定

**方法**: Vercelのネームサーバーを使用

**DNSレジストラでの設定**:
```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

**検証**:
```bash
dig ns example.com
```

## ドメイン検証プロセス

### 他のVercelアカウントで使用されているドメインの場合

ドメインが既に他のVercelアカウントで使用されている場合、TXTレコード経由でアクセスを検証する必要があります。

**検証手順**:
1. Vercelが提供するTXTレコードを取得
2. DNSレジストラにTXTレコードを追加
3. Vercelで検証を実行

**TXTレコード例**:
```
Type: TXT
Name: _vercel
Value: vc-domain-verify=abc123def456...
```

## 自動リダイレクト

Vercelは、`www`プレフィックスの有無でドメインを自動的にリダイレクトしようとします。

**例**:
- `example.com` → `www.example.com`（または逆）

**カスタムリダイレクトの設定**:

プロジェクトのDomainsタブでカスタムリダイレクトを設定できます。

## ベストプラクティス

### 1. ApexとWWWの両方を追加

ユーザーがどちらでアクセスしても適切に機能するようにします。

```
追加するドメイン:
- example.com
- www.example.com
```

### 2. ネームサーバー方式の使用（ワイルドカードドメイン）

ワイルドカードドメインには、Vercelのネームサーバーを使用してください。

### 3. 適切なDNSレコードの設定

- **Apexドメイン**: Aレコード
- **サブドメイン**: CNAMEレコード
- **ワイルドカードドメイン**: Vercelネームサーバー

### 4. DNS伝播の確認

DNS変更は、完全に伝播するまで最大48時間かかる場合があります。

**確認ツール**:
- https://www.whatsmydns.net
- `dig`コマンド
- `nslookup`コマンド

### 5. SSL証明書の自動生成

ドメインを追加すると、Vercelが自動的にSSL証明書を生成します。

## トラブルシューティング

### DNS設定が機能しない

1. **TTLの確認**: TTLが低く設定されているか確認（推奨: 60-300秒）
2. **伝播時間**: 24-48時間待つ
3. **レコードの正確性**: AレコードまたはCNAMEレコードが正しいか確認

### ドメイン検証に失敗

1. TXTレコードが正しく追加されているか確認
2. DNS伝播を待つ
3. Vercelダッシュボードで再検証を実行

### SSL証明書の生成に失敗

1. DNSレコードが正しく設定されているか確認
2. `/.well-known`パスがブロックされていないか確認
3. ワイルドカードドメインの場合、Vercelネームサーバーを使用しているか確認

## 関連ドキュメント

- [環境へのドメイン追加](/docs/domains/working-with-domains/add-a-domain-to-environment)
- [Gitブランチへのドメイン割り当て](/docs/domains/working-with-domains/assign-domain-to-a-git-branch)
- [DNSレコードの管理](/docs/domains/managing-dns-records)
- [SSL証明書の操作](/docs/domains/working-with-ssl)
- [トラブルシューティング](/docs/domains/troubleshooting)

## まとめ

カスタムドメインの追加は、Vercelダッシュボードから簡単に行えます。適切なDNS設定（Aレコード、CNAME、またはネームサーバー）を選択し、DNS伝播を待つことで、カスタムドメインがVercelプロジェクトで利用可能になります。
