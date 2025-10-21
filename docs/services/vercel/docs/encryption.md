# Encryption（暗号化）

Vercelは、すべてのデプロイメントに対して自動的にHTTPS暗号化を提供し、セキュアな通信を保証します。

## 自動HTTPS

### 主要機能

- **すべてのデプロイメントがHTTPS経由で配信**
- **SSL証明書の自動生成（無料）**
- **HTTPからHTTPSへの自動リダイレクト（308ステータスコード）**

### 利点

- 設定不要で即座にセキュア
- 追加コストなし
- メンテナンス作業不要

## TLS詳細

### サポートされているTLSバージョン

- **TLS 1.2**
- **TLS 1.3**

### TLS機能

#### 1. TLS再開 (TLS Resumption)

**サポート方式**:
- セッション識別子（Session Identifiers）
- セッションチケット（Session Tickets）

**効果**:
- ハンドシェイク時間の短縮
- 接続速度の向上

#### 2. OCSPステープリング

**目的**:
- 証明書検証の高速化

**動作**:
- サーバーが証明書の有効性情報を事前に取得
- クライアントの検証プロセスを簡素化

## サポートされている暗号

Vercelは、フォワードセキュアシーを備えた強力な暗号アルゴリズムを使用します。

### TLS 1.3の暗号スイート

- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256

### TLS 1.2の暗号スイート

- ECDHE-RSA-AES128-GCM-SHA256
- ECDHE-RSA-AES256-GCM-SHA384
- ECDHE-RSA-CHACHA20-POLY1305
- その他のECDHE暗号

### 推奨設定

Mozillaの推奨設定に従っています。

## HSTS（HTTP Strict Transport Security）

### .vercel.appドメイン

`.vercel.app`ドメインは、HSTSでプリロードされています。

**効果**:
- ブラウザが常にHTTPS接続を使用
- 中間者攻撃（MITM）の防止

### カスタムドメイン

カスタムドメインには、特定のサブドメインに対してHSTSが有効化されています。

**デフォルトHSTSヘッダー**:

```
Strict-Transport-Security: max-age=63072000
```

**意味**:
- `max-age=63072000`: 2年間（63,072,000秒）

### HSTSヘッダーのカスタマイズ

`vercel.json`でHSTSヘッダーをカスタマイズできます:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

**パラメータの説明**:
- `max-age=31536000`: 1年間
- `includeSubDomains`: すべてのサブドメインに適用
- `preload`: ブラウザのHSTSプリロードリストに含める

## 証明書の処理

### ワイルドカード証明書

**証明書発行機関**: LetsEncrypt

**特徴**:
- ワイルドカード証明書を自動生成
- サブドメインに対応

### カスタム証明書

**Enterpriseプランのみ**:
- カスタムSSL証明書の設定が可能

**暗号化**:
- データベースで静的に暗号化
- メモリにキャッシュされて最適なパフォーマンス

詳細: [Custom SSL Certificate](/docs/domains/custom-ssl-certificate)

## SSL証明書の発行プロセス

### 1. 証明書のリクエスト

Vercelが自動的にLetsEncryptに証明書をリクエストします。

### 2. チャレンジの受信

ドメイン制御を証明するためのチャレンジを受信します。

### 3. 検証ファイル/レコードの作成

チャレンジに応じた検証ファイルまたはDNSレコードを作成します。

### 4. LetsEncryptによる検証

LetsEncryptがチャレンジを検証します。

### 5. 証明書の発行

検証が成功すると、証明書が発行され、インフラストラクチャに追加されます。

## 検証方法

### HTTP-01チャレンジ

**対象**: 非ワイルドカードドメイン

**方法**:
- `/.well-known/acme-challenge/`パスに検証ファイルを配置
- LetsEncryptがHTTP経由で検証

### DNS-01チャレンジ

**対象**: ワイルドカードドメイン

**要件**: Vercelのネームサーバーを使用

**方法**:
- DNSレコードに検証用のTXTレコードを追加
- LetsEncryptがDNSクエリで検証

## 重要な注意事項

### 1. 自動証明書生成

ドメインを追加すると、Vercelが自動的に証明書の生成を試みます。

### 2. /.well-knownパスの予約

`/.well-known`パスは予約されており、リダイレクトできません。

**理由**:
- SSL証明書の検証に必要
- HTTP-01チャレンジに使用

### 3. Enterprise専用のカスタムSSL

カスタムSSL証明書の設定は、Enterpriseチームのみが利用できます。

## セキュリティの完全な技術仕様

### SSL Labs

詳細な暗号化仕様は、SSL Labsで確認できます。

**確認方法**:
```
https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

## 主要なセキュリティ原則

### 1. 常にセキュアな接続

すべてのコンテンツがセキュアな接続経由で配信されます。

### 2. ユーザーデータとプライバシーの保護

暗号化により、ユーザーデータとプライバシーを保護します。

### 3. データの整合性

転送中のデータの整合性を保証します。

## ベストプラクティス

### 1. HSTSの有効化

カスタムドメインでHSTSヘッダーを適切に設定します。

### 2. TLS 1.2以上の使用

古いプロトコル（TLS 1.0、1.1）は使用しません。

### 3. 証明書の自動更新

Vercelの自動証明書更新機能を活用します。

### 4. セキュリティヘッダーの追加

HSTSに加えて、他のセキュリティヘッダーも設定します:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## まとめ

Vercelの自動HTTPS暗号化により、追加の設定やコストなしで、すべてのデプロイメントがセキュアになります。TLS 1.2/1.3、強力な暗号スイート、自動証明書管理により、最高レベルのセキュリティが提供されます。
