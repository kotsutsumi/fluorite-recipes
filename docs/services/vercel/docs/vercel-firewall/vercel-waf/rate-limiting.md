# WAF Rate Limiting

WAF Rate Limitingは[すべてのプラン](/docs/plans)で利用可能です。

レートリミティングにより、同じソースからのリクエストが特定の時間枠内にアプリケーションにヒットする回数を制御できます。これは、悪意のあるアクティビティやソフトウェアのバグなど、複数の理由で発生する可能性があります。

レートリミティングルールを使用することで、API エンドポイントや外部サービスなどのリソースに意図したトラフィックのみがアクセスできるようになり、使用コストをより適切に制御できます。

## はじめに

1. [ダッシュボード](https://vercel.com/dashboard/)から、レートリミティングを設定するプロジェクトを選択し、Firewallタブを選択
2. 右上の「Configure」を選択し、「+ New Rule」を選択
3. ルールのフィールドを以下のように入力：
   - ルールの目的を識別するための名前を入力
   - 「Configure」セクションで、必要な数の「If」条件を追加
     - すべての条件が真の場合にアクションが実行されます
   - 「Then」アクションで「Rate Limit」を選択
   - レート制限戦略を選択（Fixed WindowまたはToken Bucket）
   - 時間枠（デフォルト60秒）とリクエスト制限（デフォルト100リクエスト）を更新
   - リクエストソースからマッチさせるキーを選択
   - 「Then」アクションで、デフォルト（429）またはLog、Deny、Challengeを選択
4. 「Save Rule」を選択

## レート制限戦略

### Fixed Window（固定ウィンドウ）

- 固定された時間枠内でリクエスト数をカウント
- 時間枠が終了すると、カウンターがリセット
- シンプルで予測可能

例：60秒間に100リクエストまで許可

### Token Bucket（トークンバケット）

- より柔軟なレート制限アルゴリズム
- バーストトラフィックを許可
- 一定のレートでトークンが補充される

例：バケットサイズ100、補充レート毎秒2トークン

## レート制限キー

リクエストをグループ化するための識別子を選択できます：

- **IPアドレス**: クライアントのIPアドレスごとに制限
- **ユーザーエージェント**: ユーザーエージェントごとに制限
- **パス**: URLパスごとに制限
- **カスタムヘッダー**: 特定のヘッダー値ごとに制限
- **Cookie**: Cookie値ごとに制限

複数のキーを組み合わせることも可能です。

## レート制限時のアクション

制限を超えた場合の動作を選択できます：

- **429 (Too Many Requests)**: デフォルトのHTTPステータスコード
- **Log**: リクエストを記録し、通過させる（テスト用）
- **Deny**: リクエストを拒否（403 Forbidden）
- **Challenge**: チャレンジを要求

## 使用例

### API エンドポイントの保護

```
IF path starts with /api
THEN rate limit:
  - Strategy: Fixed Window
  - Window: 60 seconds
  - Limit: 100 requests
  - Key: IP Address
  - Action: 429
```

### ログインエンドポイントのブルートフォース対策

```
IF path equals /api/login
THEN rate limit:
  - Strategy: Fixed Window
  - Window: 300 seconds (5分)
  - Limit: 5 requests
  - Key: IP Address
  - Action: Deny
```

### ユーザーごとのAPI制限

```
IF path starts with /api AND header "Authorization" exists
THEN rate limit:
  - Strategy: Token Bucket
  - Bucket Size: 1000
  - Refill Rate: 10/second
  - Key: Authorization Header
  - Action: 429
```

## ベストプラクティス

1. **適切な制限値を設定**: 正当なユーザーに影響を与えない範囲で設定
2. **最初はログモードで**: 本番適用前にログモードで影響を確認
3. **適切なキーを選択**: 用途に応じて最適な識別子を選択
4. **段階的な制限**: 重要度に応じて異なる制限値を設定
5. **監視とチューニング**: ログを定期的に確認し、必要に応じて調整

## レート制限のバイパス

特定のクライアントをレート制限から除外する必要がある場合：

1. バイパスルールを作成
2. レート制限ルールより上位に配置
3. 信頼できるIPアドレスやAPI キーで識別

例：
```
IF IP address equals 203.0.113.0/24
THEN bypass
```

## 制限とクォータ

- プランによってレート制限ルールの数が異なります
- 非常に短い時間枠（1秒未満）は推奨されません
- 極端に高い制限値はパフォーマンスに影響を与える可能性があります

詳細は[Usage and Pricing](/docs/security/vercel-waf/usage-and-pricing)を参照してください。
