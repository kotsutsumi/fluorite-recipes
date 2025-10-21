# 電話番号ログイン

電話番号ログインは、ユーザーがパスワードを使用せずにWebサイトまたはアプリケーションにログインできる認証方法です。ユーザーは、チャネル（SMSまたはWhatsApp）経由で送信されたワンタイムパスワード（OTP）を通じて認証します。

## 主な機能

- 現時点では、WhatsAppはTwilioおよびTwilio Verify Providersのチャネルとしてのみサポートされています
- ユーザーは、組み込みIDプロバイダーを使用したネイティブモバイルログインで電話番号を使用してログインすることもできます

### 電話番号OTPログインの利点

- パスワードの作成を要求しないことで、ユーザーエクスペリエンスを向上
- パスワード関連のセキュリティ侵害を減らすことで、セキュリティを向上
- パスワードリセットのサポート負担を軽減

## 重要な考慮事項

> SMS送信コストを抑制するため、プロジェクトのレート制限を調整し、CAPTCHAを設定してください。

> 一部の国では、ユーザーにSMSメッセージを送信するサービスに対する特別な規制があります（例：インドのTRAI DLT規制）。

## 電話番号ログインの有効化

1. ホストされたSupabaseプロジェクトの場合、Auth Providersページで電話認証を有効にします
2. セルフホストプロジェクトの場合は、設定ファイルを使用します
3. SMSプロバイダーを設定します（サポート：MessageBird、Twilio、Vonage、TextLocal）

### デフォルトのOTP設定

- ユーザーは60秒ごとに1回OTPをリクエストできます
- OTPは1時間後に期限切れになります

## 電話番号OTPでサインイン

```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+13334445555'
})
```

## 電話番号OTPの検証

```javascript
const { data: { session }, error } = await supabase.auth.verifyOtp({
  phone: '13334445555',
  token: '123456',
  type: 'sms'
})
```

## 電話番号の更新

```javascript
const { data, error } = await supabase.auth.updateUser({
  phone: '123456789'
})
```

ユーザーは、電話番号の変更を確認するための6桁のPINが記載されたSMSを受信します。
