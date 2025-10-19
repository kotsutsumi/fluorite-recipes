# Bot Management

## Bot管理の概要

ボットは、インターネットトラフィックのほぼ半分を生成しています。多くのボットは検索エンジンのクローリングやコンテンツ集約などの正当な目的を持つ一方で、悪意のあるソースから発生するボットも存在します。

効果的なBot管理は、正当なボットを許可しながら、悪意のあるボットからアプリケーションを保護します。

## Bot管理の仕組み

Bot管理システムは、以下の方法で受信トラフィックを分析・分類します：

### 分析手法

- **正当なボットの検証と許可**: 検索エンジンクローラーやモニタリングサービスなどの既知の良いボットを識別
- **ボットトラフィックパターンの監視**: 異常なリクエストパターンやリソース消費を検出
- **不審なトラフィックの検出**: 自動化された攻撃や悪意のある動作を識別
- **ブラウザ動作の検証**: JavaScriptの実行能力やナビゲーションパターンを確認

### Bot管理と保護の方法

効果的なBot管理を行うため、以下の技術が使用されます：

#### シグネチャベースの検出

既知のボットシグネチャのHTTPリクエスト検査により、ボットを識別します。

```
User-Agent: Googlebot/2.1 (+http://www.google.com/bot.html)
```

#### レート制限

悪用を防ぐための特定のアクションの実行頻度制限：

- APIエンドポイントへのリクエスト数制限
- ログイン試行回数の制限
- データスクレイピングの防止

#### チャレンジ

JavaScriptチェックによる人間の存在確認：

- CAPTCHA
- ブラウザ指紋認証
- 動作分析

#### 行動分析

自動化を示す異常なユーザー活動の検出：

- マウスの動きとキーボード入力パターン
- ページ遷移の速度
- セッション時間と深度

## Vercelでのボット管理機能

Vercelでは以下のBot管理機能を提供しています：

### 1. マネージドルールセット

[ボット保護マネージドルールセット](/docs/vercel-waf/managed-rulesets#configure-bot-protection-managed-ruleset)により、悪意のあるボットからアプリケーションを保護します。

機能：
- 自動ボット検出
- 既知の良いボットの許可
- 悪意のあるボットのブロックまたはチャレンジ

### 2. WAFカスタムルール

[WAFカスタムルール](/docs/vercel-waf/custom-rules)を使用して、独自のボット保護ロジックを実装：

```
IF user-agent contains "bot"
AND user-agent does not contain "Googlebot"
AND user-agent does not contain "Bingbot"
THEN challenge
```

### 3. レートリミット

[レートリミット](/docs/vercel-waf/rate-limiting)でボットの過度なリクエストを制限：

```
IF path starts with /api
THEN rate limit (100 requests per minute, by IP)
```

### 4. DDoS緩和

[DDoS緩和](/docs/security/ddos-mitigation)により、ボットネットからの大規模攻撃を自動的にブロック。

### 5. Attack Challenge Mode

[Attack Challenge Mode](/docs/attack-challenge-mode)を有効にして、すべての訪問者にチャレンジを提示（既知の良いボットを除く）。

### 6. BotID

[BotID](/docs/botid)は、Vercelが管理する検証済みボットのディレクトリで、正当なボットを自動的に識別します。

## ボットの種類

### 良いボット（許可すべき）

#### 検索エンジンクローラー
- Googlebot
- Bingbot
- Yandex Bot
- DuckDuckBot

#### ソーシャルメディアボット
- Twitterbot
- Facebookbot
- LinkedInbot
- Pinterestbot

#### モニタリングサービス
- UptimeRobot
- Pingdom
- StatusCake

#### その他の正当なボット
- Feed readers
- Archive bots
- Research crawlers

### 悪いボット（ブロックすべき）

#### スクレイピングボット
- コンテンツの無断収集
- 価格情報の抽出
- データマイニング

#### 攻撃ボット
- ブルートフォース攻撃
- クレデンシャルスタッフィング
- DDoS攻撃

#### スパムボット
- コメントスパム
- フォームスパム
- メールハーベスティング

#### その他の悪意のあるボット
- 在庫買い占めボット
- クリック詐欺ボット
- 脆弱性スキャナー

## Bot管理の実装

### ステップ1: 現状の分析

1. ファイアウォールログでボットトラフィックを確認
2. ユーザーエージェントとIPアドレスを分析
3. 正当なボットと悪意のあるボットを識別

### ステップ2: 基本保護の実装

1. **Attack Challenge Modeの有効化**（攻撃時）
   ```
   Dashboard > Firewall > Bot Management > Attack Challenge Mode
   ```

2. **ボット保護マネージドルールセットの有効化**
   ```
   Dashboard > Firewall > Configure > Managed Rulesets > Bot Protection
   ```

### ステップ3: カスタムルールの作成

既知の良いボットをバイパス：

```
IF user-agent contains "Googlebot"
OR user-agent contains "Bingbot"
THEN bypass
```

疑わしいボットをチャレンジ：

```
IF user-agent contains "bot"
AND JA3 fingerprint is empty
THEN challenge
```

### ステップ4: レート制限の設定

APIエンドポイントを保護：

```
IF path starts with /api
THEN rate limit (1000 requests per minute, by IP)
```

### ステップ5: 監視と調整

1. ファイアウォールログを定期的に確認
2. 誤検知を特定して修正
3. ルールをチューニング

## ユースケース別の設定

### ECサイト

```
# 在庫買い占めボット対策
IF path contains "/checkout"
OR path contains "/add-to-cart"
THEN rate limit (10 requests per minute, by IP)

# 価格スクレイピング対策
IF path contains "/products"
AND user-agent does not contain known good bots
THEN rate limit (100 requests per hour, by IP)
```

### APIサービス

```
# API保護
IF path starts with /api
AND header "Authorization" is empty
THEN deny

IF path starts with /api
THEN rate limit (1000 requests per hour, by API key)
```

### コンテンツサイト

```
# コンテンツスクレイピング対策
IF path contains "/articles"
THEN rate limit (50 requests per minute, by IP)

# 正当なボットを許可
IF user-agent contains "Googlebot"
OR user-agent contains "Bingbot"
THEN bypass
```

## ベストプラクティス

1. **段階的なアプローチ**: 最初は監視（Log）から開始し、徐々に厳格化
2. **良いボットを保護**: 検索エンジンやモニタリングサービスは必ずバイパス
3. **適切なレート制限**: 正当なユーザーに影響を与えない範囲で設定
4. **定期的な見直し**: ボットの動向は変化するため、定期的にルールを更新
5. **複数層の防御**: 異なる技術を組み合わせて多層的に保護

## トラブルシューティング

### 正当なボットがブロックされている

1. BotIDで検証済みボットを確認
2. バイパスルールを追加
3. ユーザーエージェントを検証

### 悪意のあるボットが通過している

1. ボット保護マネージドルールセットを有効化
2. レート制限を厳格化
3. チャレンジモードを使用
4. JA3/JA4指紋を活用

### パフォーマンスへの影響

1. 不要なルールを削除
2. レート制限の閾値を最適化
3. バイパスルールを活用して不要な処理を削減

詳細については、以下のドキュメントを参照してください：

- [BotID](/docs/botid)
- [Attack Challenge Mode](/docs/attack-challenge-mode)
- [Managed Rulesets](/docs/vercel-waf/managed-rulesets)
- [Custom Rules](/docs/vercel-waf/custom-rules)
