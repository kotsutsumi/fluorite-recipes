# カスタムドメイン

EAS Hostingでカスタムドメインを設定する方法を説明します。

## 前提条件

- EAS Hostingプロジェクトとプロダクションデプロイメントが必要
- 所有するドメイン名が必要
- **カスタムドメインはプレミアム機能です**（無料プランでは利用できません）

## カスタムドメインの割り当て

### ステップ1: Hostingの設定にアクセス

1. [expo.dev](https://expo.dev)でプロジェクトダッシュボードにアクセス
2. Hosting設定に移動

### ステップ2: カスタムドメインを入力

- Apexドメイン（`example.com`）またはサブドメイン（`app.example.com`）をサポート
- プロジェクトごとに1つのカスタムドメインのみ

### ステップ3: DNSレコードを設定

以下のDNSレコードを設定する必要があります：

#### 1. 検証用TXTレコード
ドメインの所有権を証明するため：
```
_expo-hosting.example.com TXT "verification-token"
```

#### 2. SSL用CNAMEレコード
SSL証明書の検証用：
```
_acme-challenge.example.com CNAME _acme-challenge.expo.app
```

#### 3. ドメインポインティングレコード

**Apexドメインの場合（example.com）:**
```
example.com A 76.76.21.21
```

**サブドメインの場合（app.example.com）:**
```
app.example.com CNAME your-app.expo.app
```

## DNSレコードの詳細

### 検証レコード

ドメインの所有権を証明するために作成されます：
- カスタムドメインのサブドメインに作成
- EAS Hostingが所有権を確認するために使用

### SSLレコード

HTTPS接続用のSSL証明書を取得するために必要：
- 自動的にSSL証明書が発行されます
- Let's Encryptを使用

### ポインティングレコード

実際のトラフィックをEAS Hostingに転送：
- Apexドメインは**Aレコード**を使用
- サブドメインは**CNAMEレコード**を使用

## 高度な設定

### wwwサブドメインの自動リダイレクト

`www.example.com`を自動的に`example.com`にリダイレクトできます：

1. `www`サブドメイン用のCNAMEレコードを追加
2. EAS Hostingが自動的にリダイレクトを処理

### ワイルドカードサブドメイン

異なるデプロイメントエイリアスにワイルドカードサブドメインをルーティング：

```
*.example.com CNAME your-app.expo.app
```

これにより以下が可能になります：
- `staging.example.com` → `staging`エイリアス
- `dev.example.com` → `dev`エイリアス

## カスタムドメインの動作

### プロダクションへのルーティング

**重要:** カスタムドメインは常にプロダクションデプロイメントにルーティングされます。

これは以下を意味します：
```bash
# プロダクションに昇格
eas deploy --prod
```

このデプロイメントがカスタムドメインで提供されます。

## DNSプロバイダー別の設定

### Cloudflare
1. DNSセクションに移動
2. 上記のレコードを追加
3. プロキシステータスを「DNS only」に設定

### Google Domains
1. DNS設定にアクセス
2. カスタムレコードを追加
3. TTLはデフォルトのままでOK

### Namecheap
1. Advanced DNSに移動
2. 新しいレコードを追加
3. 変更を保存

## 検証とトラブルシューティング

### DNSの伝播

DNSレコードの伝播には最大48時間かかる場合がありますが、通常は数分から数時間です。

### 伝播の確認

```bash
# TXTレコードの確認
dig TXT _expo-hosting.example.com

# Aレコードの確認
dig A example.com

# CNAMEレコードの確認
dig CNAME app.example.com
```

### 一般的な問題

1. **DNSが伝播していない**: 待つか、DNSキャッシュをクリア
2. **証明書エラー**: SSLレコードが正しく設定されているか確認
3. **404エラー**: ドメインがプロダクションデプロイメントを指しているか確認

## ベストプラクティス

1. **テスト**: カスタムドメイン設定前にプレビューURLでテスト
2. **バックアップ**: DNS設定を変更する前にバックアップ
3. **監視**: DNS設定後にサイトの可用性を監視
4. **ドキュメント**: DNS設定をチーム内で文書化

## 制限事項

- プロジェクトごとに1つのカスタムドメイン
- プレミアムプラン必要
- カスタムドメインは常にプロダクションにルーティング

## 次のステップ

- [APIルートの実装](/frameworks/expo/docs/eas/hosting/api-routes)
- [デプロイワークフローの自動化](/frameworks/expo/docs/eas/hosting/workflows)
- [キャッシング戦略の最適化](/frameworks/expo/docs/eas/hosting/reference/caching)
