# DNSの操作

DNS（Domain Name System）の基本と、Vercelでの使用方法について説明します。

## DNS概要

DNSは、ドメイン名をIPアドレスに接続するシステムです。

### DNS解決プロセス

Webサイトがリクエストされると、ブラウザは再帰リゾルバを通じてDNSクエリを実行します:

1. **ルートDNSネームサーバー**を確認
2. **TLD（トップレベルドメイン）ネームサーバー**に問い合わせ
3. **権威サーバー**から最終的なIPアドレスを取得

## DNSレコードタイプ

### 1. Aレコード

**用途**: ドメイン名をIPv4アドレスに変換

**例**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**使用ケース**: Apexドメイン（`example.com`）

### 2. AAAAレコード

**用途**: ドメイン名をIPv6アドレスに変換

**注意**: Vercelではサポートされていません

### 3. ALIASレコード

**用途**: ゾーンApexでドメイン名を別のドメイン名にマッピング

**特徴**:
- CNAMEレコードに似ているが、Apexドメインで使用可能
- すべてのDNSプロバイダーがサポートしているわけではない

### 4. CAAレコード

**用途**: 許可された認証局（CA）を指定

**例**:
```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
```

**効果**: 指定されたCAのみがSSL証明書を発行可能

### 5. CNAMEレコード

**用途**: ドメイン名のエイリアスを作成

**例**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**制限**: ゾーンApexでは使用不可

**使用ケース**: サブドメイン（`www.example.com`）

### 6. HTTPSレコード

**用途**: プロトコル詳細を含むCNAMEのような機能を提供

**特徴**: 新しいレコードタイプで、広くサポートされていない

### 7. MXレコード

**用途**: メールサーバーを指定

**例**:
```
Type: MX
Name: @
Value: mx1.improvmx.com
Priority: 10
```

**注意**: Vercelはメールサービスを提供していません

### 8. NSレコード

**用途**: 権威ネームサーバーを指定

**例**:
```
Type: NS
Name: @
Value: ns1.vercel-dns.com
```

### 9. TXTレコード

**用途**: テキストベースのドメイン情報を提供

**使用ケース**:
- ドメイン検証
- SPFレコード
- DKIMレコード

**例**:
```
Type: TXT
Name: _vercel
Value: vc-domain-verify=abc123...
```

### 10. SRVレコード

**用途**: サービスロケーションの詳細を指定

**例**:
```
Type: SRV
Name: _service._proto
Value: 10 60 5060 sipserver.example.com
```

## DNS伝播

### 伝播時間

DNS変更は、完全に伝播するまで**24〜48時間**かかる場合があります。

### TTL（Time to Live）

**定義**: DNS情報がキャッシュされる期間

#### Vercelのデフォルト

- **60秒のTTL**

#### TTLの影響

**短いTTL（例: 60秒）**:
- **利点**: 変更が迅速に反映
- **欠点**: サイトの読み込みが若干遅くなる可能性

**長いTTL（例: 86400秒 = 24時間）**:
- **利点**: サイトの読み込みが高速
- **欠点**: 変更の反映に時間がかかる

## DNSのベストプラクティス

### 1. ドメイン転送前のTTL短縮

ドメインを転送する前に、TTLを60秒に短縮します。

**手順**:
1. TTLを60秒に設定
2. 24時間待つ（古いTTLの有効期限切れを待つ）
3. ドメインを転送

### 2. DNS設定の検証

以下のツールを使用して、DNS設定を確認します:

- https://www.whatsmydns.net
- `dig`コマンド
- `nslookup`コマンド

### 3. 適切なレコードタイプの選択

- **Apexドメイン**: Aレコード
- **サブドメイン**: CNAMEレコード
- **ワイルドカードドメイン**: Vercelネームサーバー

## DNS設定の検証コマンド

### digコマンド

```bash
# Aレコードの確認
dig a example.com

# CNAMEレコードの確認
dig cname www.example.com

# ネームサーバーの確認
dig ns example.com

# MXレコードの確認
dig mx example.com
```

### nslookupコマンド

```bash
# 基本的なDNSルックアップ
nslookup example.com

# 特定のレコードタイプ
nslookup -type=mx example.com
```

## トラブルシューティング

### DNS伝播の確認

1. https://www.whatsmydns.net にアクセス
2. ドメインとレコードタイプを入力
3. グローバルな伝播状態を確認

### キャッシュのクリア

**DNS キャッシュのクリア**:

```bash
# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemd-resolve --flush-caches
```

## 関連ドキュメント

- [DNSレコードの管理](/docs/domains/managing-dns-records)
- [ネームサーバーの操作](/docs/domains/working-with-nameservers)
- [ドメインのトラブルシューティング](/docs/domains/troubleshooting)

## まとめ

DNSは、ドメイン名をIPアドレスにマッピングする重要なシステムです。適切なDNSレコードを設定し、TTLを理解することで、ドメインを効果的に管理できます。
