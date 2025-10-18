# 多要素認証（電話）

## 電話多要素認証の仕組み

電話多要素認証は、Supabase Authとエンドユーザーによって生成される共有コードを使用します。コードはSMSやWhatsAppなどのメッセージングチャネルを介して配信され、ユーザーはそのコードを使用して認証します。

### 登録フローの追加

登録フローは、ユーザーが追加の認証要素を設定するためのUIを提供します。ほとんどのアプリケーションは、登録フローを2つの場所に追加します：

1. ログインまたはサインアップの直後
2. 設定ページ内から

電話MFAの要素を登録するには、3つのステップがあります：

1. `supabase.auth.mfa.enroll()`を呼び出す
2. `supabase.auth.mfa.challenge()`を呼び出す（SMS/WhatsApp経由でコードを送信）
3. `supabase.auth.mfa.verify()`を呼び出してコードを検証する

#### ステップ1：登録を開始する

```javascript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'phone',
  phone: '+1234567890'
})
```

#### ステップ2：チャレンジを作成（コードを送信）

```javascript
const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
  factorId: data.id
})

// SMSまたはWhatsAppでコードが送信されます
```

#### ステップ3：コードを検証する

```javascript
// ユーザーがSMS/WhatsAppで受け取ったコードを入力
const verificationCode = '123456' // ユーザー入力

const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
  factorId: data.id,
  challengeId: challengeData.id,
  code: verificationCode
})
```

### 完全なReact実装例

```jsx
import { useState } from 'react'
import { supabase } from './supabaseClient'

function PhoneMFAEnrollment() {
  const [phone, setPhone] = useState('')
  const [factorId, setFactorId] = useState(null)
  const [challengeId, setChallengeId] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState('input') // 'input', 'verify', 'complete'

  // ステップ1：電話番号を登録
  const enrollPhone = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'phone',
      phone: phone
    })

    if (error) {
      console.error('登録エラー:', error)
      return
    }

    setFactorId(data.id)

    // すぐにチャレンジを作成（コードを送信）
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: data.id })

    if (challengeError) {
      console.error('チャレンジエラー:', challengeError)
      return
    }

    setChallengeId(challengeData.id)
    setStep('verify')
  }

  // ステップ2：コードを検証
  const verifyCode = async () => {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId: factorId,
      challengeId: challengeId,
      code: verificationCode
    })

    if (error) {
      console.error('検証エラー:', error)
      return
    }

    setStep('complete')
  }

  return (
    <div>
      {step === 'input' && (
        <div>
          <h2>電話番号でMFAを設定</h2>
          <input
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={enrollPhone}>コードを送信</button>
        </div>
      )}

      {step === 'verify' && (
        <div>
          <h2>確認コードを入力</h2>
          <p>{phone}に送信されたコードを入力してください</p>
          <input
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={verifyCode}>検証</button>
        </div>
      )}

      {step === 'complete' && (
        <div>
          <h2>MFAが有効になりました！</h2>
          <p>電話番号が正常に登録されました。</p>
        </div>
      )}
    </div>
  )
}

export default PhoneMFAEnrollment
```

### ログインにチャレンジステップを追加する

初期ログイン後、`supabase.auth.mfa.getAuthenticatorAssuranceLevel()`を使用して、追加の要素を検証する必要があるかどうかを確認します。

```javascript
const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

if (data) {
  const { currentLevel, nextLevel } = data

  if (currentLevel === 'aal1' && nextLevel === 'aal2') {
    // ユーザーはMFA要素を登録していますが、検証していません
    // 電話MFAチャレンジを表示
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const phoneFactor = factors.phone[0]

    // チャレンジを作成（コードを送信）
    const { data: challenge } = await supabase.auth.mfa.challenge({
      factorId: phoneFactor.id
    })

    // ユーザーに検証UIを表示
  }
}
```

## セキュリティ設定

### コードの有効期限

- コードは最大5分間有効です
- 最小6桁のコード長を使用してください

### SIMスワップ攻撃に注意

電話ベースのMFAは、SIMスワップ攻撃に対して脆弱です。攻撃者がユーザーの電話番号を別のSIMカードに転送できる場合、SMSベースの認証を傍受できる可能性があります。

**緩和策：**
- TOTPベースのMFAも提供する
- 機密性の高い操作には追加の検証を要求する
- SIMスワップ攻撃についてユーザーを教育する

## 料金

電話MFA機能の料金：

### 最初のプロジェクト
- $0.1027/時間（月額$75）

### 追加プロジェクト
- $0.0137/時間（月額$10）

料金はプラン（Pro、Team、Enterprise）によって異なります。

## ベストプラクティス

### 1. レート制限

SMS送信とコード検証試行にレート制限を実装します：

- チャレンジ作成：ユーザーあたり1分あたり3リクエスト
- コード検証：ユーザーあたり5分あたり5試行

### 2. エラーハンドリング

```javascript
try {
  const { data, error } = await supabase.auth.mfa.challenge({
    factorId: factorId
  })

  if (error) {
    if (error.message.includes('rate limit')) {
      // レート制限エラーの処理
      alert('送信回数が多すぎます。後でもう一度お試しください。')
    } else {
      // その他のエラーの処理
      console.error('エラー:', error)
    }
  }
} catch (err) {
  console.error('予期しないエラー:', err)
}
```

### 3. ユーザーエクスペリエンス

- コードの有効期限を明確に表示
- コードの再送信オプションを提供
- 明確なエラーメッセージを表示
- アクセシビリティを考慮（大きなフォント、明確な指示）

### 4. 複数の要素

ユーザーに複数のMFA方法を設定するよう促します：

- 電話番号（SMS）
- 認証アプリ（TOTP）
- リカバリーコード

これにより、1つの方法が利用できない場合でもアカウントへのアクセスが可能になります。
