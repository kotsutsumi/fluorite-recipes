# experimental_taintUniqueValue (実験的)

`experimental_taintUniqueValue` は、パスワード、キー、トークンなどの一意の値をクライアントコンポーネントに渡すことを防ぐ実験的な React API です。

## 注意

この機能は実験的であり、安定版の React ではまだ利用できません。

## リファレンス

```javascript
experimental_taintUniqueValue(message, lifetime, value)
```

### パラメータ

- **`message`**: 値がクライアントコンポーネントに渡された場合に表示されるエラーメッセージ
- **`lifetime`**: 値がタグ付けされる期間を示すオブジェクト。このオブジェクトが存在する間、値はブロックされる
- **`value`**: タグ付けする一意の文字列、bigint、または TypedArray

### 返り値

`experimental_taintUniqueValue` は `undefined` を返します。

## 使用法

### 環境変数の秘密鍵を保護

```javascript
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass secret keys to the client.',
  process,
  process.env.SECRET_KEY
);
```

### データベースから取得した機密情報を保護

```javascript
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;

  experimental_taintUniqueValue(
    'Do not pass the session token to client components',
    user,
    user.sessionToken
  );

  return user;
}
```

### API トークンの保護

```javascript
export async function authenticateUser(credentials) {
  const { apiToken, userId } = await authenticate(credentials);

  experimental_taintUniqueValue(
    'API token should not be exposed to clients',
    { apiToken, userId }, // lifetime オブジェクト
    apiToken
  );

  return { apiToken, userId };
}
```

## 重要な注意事項

### 派生値は自動的にタグ付けされない

元の値から派生した値(大文字変換、連結など)は自動的にタグ付けされません。

```javascript
experimental_taintUniqueValue('secret', obj, 'secret_value');

// ❌ これらはタグ付けされない
const upper = 'SECRET_VALUE'; // 大文字変換
const modified = 'secret_value' + '123'; // 連結

// ✅ 派生値もタグ付けする必要がある
experimental_taintUniqueValue('secret', obj, upper);
experimental_taintUniqueValue('secret', obj, modified);
```

### セキュリティの補助層として使用

これは機密データが意図せずクライアント側に漏洩することを防ぐための **追加の保護レイヤー** です。セキュリティの唯一の層として頼らないでください。

### 低エントロピーの値には使用しない

PIN コードや電話番号など、推測可能な値には使用しないでください。

```javascript
// ❌ 避ける: 低エントロピー
experimental_taintUniqueValue('PIN', user, user.pin); // 4桁のPIN

// ✅ 推奨: 高エントロピー
experimental_taintUniqueValue('Token', user, user.authToken); // ランダムなトークン
```

### サーバーコンポーネント内でのみ使用

この API はサーバーコンポーネント内でのみ使用できます。

## 使用例

### 複数の秘密値を保護

```javascript
import {experimental_taintUniqueValue} from 'react';

export async function initializeApp() {
  const config = {
    apiKey: process.env.API_KEY,
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET
  };

  experimental_taintUniqueValue('API Key', config, config.apiKey);
  experimental_taintUniqueValue('DB Password', config, config.dbPassword);
  experimental_taintUniqueValue('JWT Secret', config, config.jwtSecret);

  return config;
}
```

### ユーザーセッショントークンの保護

```javascript
export async function createSession(userId) {
  const sessionToken = generateSecureToken();
  const session = {
    userId,
    token: sessionToken,
    expiresAt: Date.now() + 3600000
  };

  experimental_taintUniqueValue(
    'Session token must not be sent to client',
    session,
    sessionToken
  );

  await db.sessions.create(session);
  return session;
}
```

### クレジットカード情報の保護

```javascript
export async function processPayment(paymentData) {
  const { cardNumber, cvv, expiryDate } = paymentData;

  experimental_taintUniqueValue('Card number', paymentData, cardNumber);
  experimental_taintUniqueValue('CVV', paymentData, cvv);

  // 決済処理
  const result = await paymentGateway.charge(paymentData);

  return result;
}
```

## 対象となる値の型

- **文字列**: パスワード、トークン、API キーなど
- **BigInt**: 大きな数値の ID や秘密鍵
- **TypedArray**: バイナリデータやキー

```javascript
// 文字列
experimental_taintUniqueValue('Secret', obj, 'my-secret-key');

// BigInt
experimental_taintUniqueValue('ID', obj, 123456789012345678901234567890n);

// TypedArray
const secretBytes = new Uint8Array([1, 2, 3, 4]);
experimental_taintUniqueValue('Binary secret', obj, secretBytes);
```

## トラブルシューティング

### 値がクライアントに渡されてしまう

- lifetime オブジェクトが適切に設定されているか確認
- 派生値も個別にタグ付けする必要がある
- サーバーコンポーネント内で呼び出しているか確認

## ベストプラクティス

- 環境変数の秘密値を保護
- データベースから取得した機密情報をタグ付け
- 明確で説明的なエラーメッセージを使用
- 他のセキュリティ対策と組み合わせる
- 実験的機能であることを認識
- 本番環境では使用しない

## 警告

**この機能は実験的です。** 本番環境では使用しないでください。API は将来変更される可能性があります。
