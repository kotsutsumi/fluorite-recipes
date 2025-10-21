# 多要素認証（TOTP）

## アプリ認証多要素認証の仕組み

アプリ認証（TOTP）多要素認証は、認証アプリから生成される時間ベースのワンタイムパスワードを使用します。ワンタイムパスワードを生成するための共有シークレットを送信するためにQRコードを使用します。ユーザーはスマートフォンでQRコードをスキャンして共有シークレットをキャプチャできます。

QRコード形式は、Google Authenticatorによって最初に導入され、現在は普遍的に受け入れられています。これは`otpauth` URIスキームに従います：

```
otpauth://totp/supabase:alice@supabase.com?secret=<secret>&issuer=supabase
```

### 登録フローの追加

登録フローは、ユーザーが追加の認証要素を設定するためのUIを提供します。ほとんどのアプリケーションは、これを2つの場所に追加します：

1. ログインまたはサインアップの直後
2. 設定ページ内から

要素の登録には3つのステップがあります：

1. `supabase.auth.mfa.enroll()`を呼び出してQRコードとシークレットを取得します
2. `supabase.auth.mfa.challenge()`を呼び出して検証の準備をします
3. `supabase.auth.mfa.verify()`を呼び出して要素を確認します

#### ステップ1：登録を開始する

```javascript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp'
})

// data.totp.qr_code: QRコード画像URL
// data.totp.secret: 手動入力用のシークレット
// data.totp.uri: otpauth:// URI
```

#### ステップ2：QRコードを表示する

```javascript
// QRコードをユーザーに表示
<img src={data.totp.qr_code} alt="QRコード" />

// または、ユーザーが手動で入力するためのシークレットを表示
<p>シークレット: {data.totp.secret}</p>
```

#### ステップ3：チャレンジを作成して検証する

```javascript
// チャレンジを作成
const { data: challengeData } = await supabase.auth.mfa.challenge({
  factorId: data.id
})

// ユーザーが認証アプリからコードを入力
const verificationCode = '123456' // ユーザー入力

// コードを検証
const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
  factorId: data.id,
  challengeId: challengeData.id,
  code: verificationCode
})
```

### ログインにチャレンジステップを追加する

初期ログイン後、`supabase.auth.mfa.getAuthenticatorAssuranceLevel()`を使用して、追加の要素を検証する必要があるかどうかを確認します。

```javascript
const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

if (data) {
  const { currentLevel, nextLevel } = data

  if (currentLevel === 'aal1' && nextLevel === 'aal2') {
    // ユーザーはMFA要素を登録していますが、検証していません
    // MFAチャレンジを表示
  }
}
```

#### 認証保証レベル（AAL）

| 現在のレベル | 次のレベル | 意味 |
|------------|-----------|------|
| `aal1` | `aal1` | ユーザーはMFAを登録していません |
| `aal1` | `aal2` | ユーザーはMFA要素を登録していますが、検証していません |
| `aal2` | `aal2` | ユーザーはMFA要素を検証しました |
| `aal2` | `aal1` | ユーザーはMFA要素を無効にしました |

### MFAチャレンジを検証する

```javascript
// ユーザーのすべてのMFA要素を取得
const { data: factors } = await supabase.auth.mfa.listFactors()

// 最初の検証済み要素のチャレンジを作成
const totpFactor = factors.totp[0]

const { data: challenge } = await supabase.auth.mfa.challenge({
  factorId: totpFactor.id
})

// ユーザーが入力したコードで検証
const verificationCode = '123456'

const { data, error } = await supabase.auth.mfa.verify({
  factorId: totpFactor.id,
  challengeId: challenge.id,
  code: verificationCode
})
```

## よくある質問

### TOTPコードの有効期間は？

生成された各コードは、1つの30秒間隔で有効です。時刻のずれを考慮するために、1間隔のクロックスキュー許容値があります。

### ユーザーがアクセスできなくなった場合は？

ユーザーが認証デバイスにアクセスできなくなった場合：

1. **リカバリーコード**を提供します：登録時にリカバリーコードを生成してユーザーに提供します
2. **管理者によるリセット**：管理者がユーザーのMFA要素をリセットできる機能を実装します
3. **代替認証方法**：複数の認証方法を提供します（SMS、メールなど）

### セキュリティのベストプラクティス

1. **リカバリーコード**：登録時にリカバリーコードを生成して保存します
2. **レート制限**：MFA検証試行にレート制限を実装します
3. **監査ログ**：MFAイベント（登録、検証、失敗）をログに記録します
4. **ユーザー教育**：TOTPアプリの適切な使用方法をユーザーに教育します

### 推奨される認証アプリ

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Bitwarden
