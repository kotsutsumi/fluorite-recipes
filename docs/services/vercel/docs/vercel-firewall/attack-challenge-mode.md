# Attack Challenge Mode

Attack Challenge Modeは、[すべてのプラン](/docs/plans)で利用可能な機能です。

[メンバー](/docs/rbac/access-roles#member-role)ロールを持つユーザーがこの機能にアクセスできます。

## 概要

Attack Challenge Modeは、サイトをDDoS攻撃から保護するセキュリティ機能です。有効にすると、訪問者は[セキュリティチャレンジ](/docs/vercel-firewall/firewall-concepts#challenge)を完了する必要があり、検索エンジンやWebhookプロバイダーなどの既知のボットは自動的に許可されます。

## 主な特徴

### 既知のボットのサポート

Vercelは、インターネット上の正当な既知のボットの包括的なディレクトリを維持し、継続的に更新しています。Attack Challenge Modeは、これらのボットを自動的に認識し、チャレンジなしで通過させます。

以下のようなボットが自動的に許可されます：
- 検索エンジンクローラー（Google、Bing、Yahoo等）
- ソーシャルメディアボット
- モニタリングサービス
- Webhookプロバイダー

### 内部リクエスト

Attack Challenge Modeが有効な場合:
- 独自の[Functions](/docs/functions)と[Cronジョブ](/docs/cron-jobs)からのリクエストは自動的に許可されます
- アカウント内の複数のプロジェクトが通信可能
- 外部からのリクエストのみがチャレンジされます

## 有効化方法

1. ダッシュボードからプロジェクトを選択
2. 「Firewall」タブに移動
3. 「Bot Management」をクリック
4. 「Attack Challenge Mode」で「Enable」を選択

## 注意点

- すべてのWebブラウザトラフィックとAPIトラフィックをサポート
- チャレンジに合格したクライアントは1時間有効なセッションを取得
- JavaScriptを実行できないクライアントはアクセスできません
- 正当なボットは自動的にバイパスされます

## 使用シナリオ

Attack Challenge Modeは以下の場合に特に有効です：

- DDoS攻撃を受けている場合
- 異常なトラフィックスパイクを検出した場合
- ボット攻撃からサイトを保護したい場合
- 一時的なセキュリティ強化が必要な場合

## 無効化

攻撃が収まった後は、以下の手順で無効化できます：

1. ダッシュボードからプロジェクトを選択
2. 「Firewall」タブに移動
3. 「Bot Management」をクリック
4. 「Attack Challenge Mode」で「Disable」を選択

無効化すると、通常のトラフィックフローに即座に戻ります。
