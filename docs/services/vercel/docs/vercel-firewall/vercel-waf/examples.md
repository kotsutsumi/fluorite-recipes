# WAF 例

このページでは、Vercel WAFのカスタムルールを使用した実践的な例を紹介します。

## カスタムルールの例

### 1. 特定の国からの不審なトラフィックをログ

特定の国からのトラフィックスパイクを調査する場合：

```
IF country equals IE
THEN log
Description: アイルランドからのトラフィックスパイクを理解
```

この例は、まずログモードで動作を確認する良い実践例です。

### 2. 管理者パスの保護

管理者エリアへのアクセスを制限：

```
IF path starts with /admin
AND IP address is not in list [203.0.113.0/24]
THEN deny
```

信頼できるIPアドレス範囲からのみ管理者パスへのアクセスを許可します。

### 3. APIエンドポイントのレート制限

APIの過度な使用を防ぐ：

```
IF path starts with /api
THEN rate limit:
  - Strategy: Fixed Window
  - Window: 60 seconds
  - Limit: 100 requests
  - Key: IP Address
  - Action: 429
```

### 4. ログインエンドポイントのブルートフォース対策

```
IF path equals /api/login
AND method equals POST
THEN rate limit:
  - Strategy: Fixed Window
  - Window: 300 seconds (5分)
  - Limit: 5 requests
  - Key: IP Address
  - Action: Deny for 1 hour
```

### 5. cURLリクエストのチャレンジ

自動化ツールからのリクエストを検証：

```
IF user-agent contains "curl"
THEN challenge
```

### 6. 特定のパスでCookieなしリクエストをチャレンジ

認証が必要なエリアでCookieのないリクエストをチャレンジ：

```
IF path starts with /dashboard
AND cookie is empty
THEN challenge
```

### 7. 非ブラウザトラフィックの拒否

ブラウザ以外からのアクセスをブロック：

```
IF JA3 fingerprint is empty
THEN deny
Description: ブラウザ以外のクライアントを拒否
```

### 8. ブロックリストASNからのトラフィック拒否

特定の自律システム番号（ASN）からのトラフィックをブロック：

```
IF ASN is in list [AS12345, AS67890]
THEN deny for 24 hours
```

### 9. IPアドレスセットからのトラフィック拒否

複数のIPアドレスまたはCIDR範囲をブロック：

```
IF IP address is in list [192.0.2.0/24, 198.51.100.0/24, 203.0.113.50]
THEN deny
```

### 10. 特定のクエリパラメータを持つリクエストをログ

SQLインジェクション試行の可能性を監視：

```
IF query string contains "select"
OR query string contains "union"
OR query string contains "drop"
THEN log
Description: SQL injection attempts
```

### 11. 疑わしいユーザーエージェントのチャレンジ

ボットのような動作を示すユーザーエージェントをチャレンジ：

```
IF user-agent contains "bot"
OR user-agent contains "crawler"
OR user-agent contains "spider"
AND user-agent does not contain "Googlebot"
AND user-agent does not contain "Bingbot"
THEN challenge
```

### 12. 特定の国からのアクセスブロック

地理的制限を実装：

```
IF country is in list [CN, RU, KP]
AND path does not start with /public
THEN deny
```

### 13. 高頻度リクエストの検出

特定のIPからの異常な頻度のリクエストをログ：

```
IF method equals GET
THEN rate limit:
  - Strategy: Token Bucket
  - Bucket Size: 1000
  - Refill Rate: 10/second
  - Key: IP Address
  - Action: Log
```

### 14. APIキーなしのAPIリクエストを拒否

認証ヘッダーが必須のエンドポイント：

```
IF path starts with /api/private
AND header "Authorization" is empty
THEN deny
```

### 15. 開発環境への本番トラフィック制限

開発ドメインへのアクセスを制限：

```
IF host equals dev.example.com
AND IP address is not in list [203.0.113.0/24]
THEN deny
Description: 開発環境へのアクセスを社内ネットワークのみに制限
```

## 複合ルールの例

### セキュアな管理エリア

```
# ルール1: 信頼できるIPをバイパス
IF IP address is in list [203.0.113.0/24]
AND path starts with /admin
THEN bypass

# ルール2: その他のアクセスをチャレンジ
IF path starts with /admin
THEN challenge
```

### 多層API保護

```
# ルール1: グローバルレート制限
IF path starts with /api
THEN rate limit (1000 requests per minute, by IP)

# ルール2: 認証エンドポイントの厳格な制限
IF path equals /api/auth/login
THEN rate limit (5 requests per 5 minutes, by IP)

# ルール3: APIキーなしのリクエストを拒否
IF path starts with /api/private
AND header "X-API-Key" is empty
THEN deny
```

## ベストプラクティス

1. **段階的な実装**: 新しいルールは最初に「Log」アクションで作成し、影響を確認
2. **明確な説明**: 各ルールに説明を追加し、目的を明確にする
3. **定期的な見直し**: ルールを定期的に確認し、不要なものを削除
4. **テスト**: 本番環境に適用する前に、プレビュー環境でテスト
5. **監視**: ファイアウォールログを定期的に確認し、ルールの効果を評価

## テンプレートの使用

Vercelダッシュボードでは、一般的なユースケース向けの事前定義されたテンプレートを提供しています。ファイアウォール設定ページで「Templates」を選択すると、すぐに使用できるルールが表示されます。

## さらに詳しく

- [カスタムルール](/docs/security/vercel-waf/custom-rules)
- [レートリミット](/docs/security/vercel-waf/rate-limiting)
- [ルール設定リファレンス](/docs/security/vercel-waf/rule-configuration)
