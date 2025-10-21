# CAPTCHA保護を有効にする

Supabaseは、ボットや悪意のあるスクリプトから保護するために、サインイン、サインアップ、パスワードリセットフォームのCAPTCHAオプションを提供しています。プラットフォームは2つのCAPTCHAプロバイダーをサポートしています:
1. hCaptcha
2. Cloudflare Turnstile

## CAPTCHAにサインアップ

### hCaptcha
1. hCaptchaのウェブサイトにアクセスしてアカウントを作成
2. **Sitekey**と**Secret key**をコピー
3. 初回サインアップ時に見逃した場合は、設定ページからSecret keyを取得
4. アクティブなサイトの設定でSitekeyを見つける

### Cloudflare Turnstile
1. Cloudflareのウェブサイトでサインアップ
2. Turnstileセクションに移動
3. 新しいサイトを追加
4. SitekeyとSecret Keyをメモ

## SupabaseでCAPTCHA保護を有効にする

以下に移動:
- プロジェクト設定
- Authセクション
- ボットと悪用保護
- CAPTCHA保護を有効にするトグル

CAPTCHAプロバイダーを選択し、Secret keyを入力して保存します。

## フロントエンドCAPTCHAコンポーネント（React例）

### hCaptcha実装

ライブラリをインストール:
```bash
npm install @hcaptcha/react-hcaptcha
```

コンポーネントをインポートして使用:
```javascript
import HCaptcha from '@hcaptcha/react-hcaptcha'
const [captchaToken, setCaptchaToken] = useState()

<HCaptcha
  sitekey="your-sitekey"
  onVerify={(token) => {
    setCaptchaToken(token)
  }}
/>

// サインアップでトークンを使用
await supabase.auth.signUp({
  email,
  password,
  options: { captchaToken }
})
```

### ローカル開発の注意事項
- ngrokを使用するか、hostsファイルを変更
- ローカルテストの詳細については、hCaptchaドキュメントを参照

ドキュメントは、異なるフレームワークとプロバイダー間でCAPTCHA保護を実装するための包括的なガイダンスを提供しています。
