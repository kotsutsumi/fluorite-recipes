# Webhooks - Expoドキュメント

## 概要
Webhookを使用すると、EAS BuildまたはSubmitプロセスが完了したときにアラートを受け取ることができます。プロジェクトごとに設定され、`eas webhook:create`コマンドを使用してセットアップできます。

## 主要な機能
- 特定のプロジェクトイベント（BuildまたはSubmit）のWebhookを設定
- HTTP POSTリクエストを受信するためのWebhook URLを提供
- リクエスト認証のためのWebhook署名シークレットを使用

## Webhookの作成
ターミナルコマンド：
```
eas webhook:create
```

### Webhook設定
- イベントタイプを選択（BuildまたはSubmit）
- Webhook URLを提供
- 署名シークレットを設定（最低16文字）

## Webhookペイロード
Webhookは以下を含むビルドまたは送信に関する詳細情報を含むJSONペイロードを送信します：
- プロジェクトの詳細
- ビルド/送信ステータス
- メタデータ
- タイムスタンプ
- エラー情報（該当する場合）

## Webhookサーバーの例
サンプルNode.jsサーバー実装：
```javascript
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const safeCompare = require('safe-compare');

const app = express();
app.use(bodyParser.text({ type: '*/*' }));
app.post('/webhook', (req, res) => {
  const expoSignature = req.headers['expo-signature'];
  const hmac = crypto.createHmac('sha1', process.env.SECRET_WEBHOOK_KEY);
  hmac.update(req.body);
  const hash = `sha1=${hmac.digest('hex')}`;

  if (!safeCompare(expoSignature, hash)) {
    res.status(500).send("Signatures didn't match!");
  } else {
    // Webhookペイロードを処理
    res.send('OK!');
  }
});
```

## 追加のコマンド
- Webhookを更新：`eas webhook:update --id WEBHOOK_ID`
- Webhookをリスト表示：`eas webhook:list`
- Webhookを削除：`eas webhook:delete`

> **ヒント**：ngrokのようなサービスを使用して、localhostへのパブリックトンネルを作成し、Webhookをローカルでテストします。
