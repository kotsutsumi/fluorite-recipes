# Crypto

暗号化操作のためのユニバーサルライブラリです。Node.jsの`crypto` APIと同様の機能を提供します。

## インストール

```bash
npx expo install expo-crypto
```

## 使用方法

```javascript
import * as Crypto from 'expo-crypto';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function App() {
  const [digest, setDigest] = useState('');

  useEffect(() => {
    (async () => {
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        'GitHub stars are neat 🌟'
      );
      setDigest(hash);
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ダイジェスト: {digest}</Text>
    </View>
  );
}
```

## API

```javascript
import * as Crypto from 'expo-crypto';
```

## メソッド

### `Crypto.digest(algorithm, data)`

暗号化ダイジェストを生成します。

**パラメータ**

- **algorithm** (`CryptoDigestAlgorithm`) - 使用するハッシュアルゴリズム
- **data** (`ArrayBuffer | TypedArray | DataView`) - ハッシュ化するデータ

**戻り値**

`Promise<ArrayBuffer>` - ハッシュ化されたデータを含むPromiseを返します。

---

### `Crypto.digestStringAsync(algorithm, data, options)`

文字列から暗号化ダイジェストを生成します。

**パラメータ**

- **algorithm** (`CryptoDigestAlgorithm`) - 使用するハッシュアルゴリズム
- **data** (`string`) - ハッシュ化する文字列
- **options** (`CryptoDigestOptions`、オプション) - エンコーディングオプション

**戻り値**

`Promise<string>` - ハッシュ化された文字列を返します。

---

### `Crypto.getRandomBytes(byteCount)`

暗号学的に安全なランダムバイトを生成します。

**パラメータ**

- **byteCount** (`number`) - 生成するバイト数

**戻り値**

`Uint8Array` - ランダムバイトの配列を返します。

---

### `Crypto.getRandomBytesAsync(byteCount)`

暗号学的に安全なランダムバイトを非同期で生成します。

**パラメータ**

- **byteCount** (`number`) - 生成するバイト数

**戻り値**

`Promise<Uint8Array>` - ランダムバイトの配列を含むPromiseを返します。

---

### `Crypto.getRandomValues(typedArray)`

型付き配列を暗号学的に安全なランダム値で埋めます。

**パラメータ**

- **typedArray** (`TypedArray`) - ランダム値で埋める型付き配列

**戻り値**

`TypedArray` - ランダム値で埋められた配列を返します。

---

### `Crypto.randomUUID()`

一意の識別子（UUIDv4）を生成します。

**戻り値**

`string` - UUIDv4形式の文字列を返します。

## 定数

### `Crypto.CryptoDigestAlgorithm`

サポートされているハッシュアルゴリズムを表す列挙型です。

```typescript
enum CryptoDigestAlgorithm {
  MD2 = 'MD2',
  MD4 = 'MD4',
  MD5 = 'MD5',
  SHA1 = 'SHA-1',
  SHA256 = 'SHA-256',
  SHA384 = 'SHA-384',
  SHA512 = 'SHA-512'
}
```

- **MD2** - MD2ハッシュアルゴリズム（非推奨）
- **MD4** - MD4ハッシュアルゴリズム（非推奨）
- **MD5** - MD5ハッシュアルゴリズム
- **SHA1** - SHA-1ハッシュアルゴリズム
- **SHA256** - SHA-256ハッシュアルゴリズム
- **SHA384** - SHA-384ハッシュアルゴリズム
- **SHA512** - SHA-512ハッシュアルゴリズム

### `Crypto.CryptoEncoding`

出力エンコーディングを表す列挙型です。

```typescript
enum CryptoEncoding {
  HEX = 'hex',
  BASE64 = 'base64'
}
```

- **HEX** - 16進数エンコーディング
- **BASE64** - Base64エンコーディング

## 型

### `CryptoDigestOptions`

ダイジェストオプションを表す型です。

```typescript
interface CryptoDigestOptions {
  encoding?: CryptoEncoding;
}
```

## 使用例

### SHA-256ハッシュの生成

```javascript
import * as Crypto from 'expo-crypto';

const hash = await Crypto.digestStringAsync(
  Crypto.CryptoDigestAlgorithm.SHA256,
  'Hello, World!'
);
console.log('SHA-256:', hash);
```

### Base64エンコーディングでのハッシュ生成

```javascript
import * as Crypto from 'expo-crypto';

const hash = await Crypto.digestStringAsync(
  Crypto.CryptoDigestAlgorithm.SHA256,
  'Hello, World!',
  { encoding: Crypto.CryptoEncoding.BASE64 }
);
console.log('SHA-256 (Base64):', hash);
```

### ランダムバイトの生成

```javascript
import * as Crypto from 'expo-crypto';

const randomBytes = await Crypto.getRandomBytesAsync(16);
console.log('ランダムバイト:', randomBytes);
```

### UUIDの生成

```javascript
import * as Crypto from 'expo-crypto';

const uuid = Crypto.randomUUID();
console.log('UUID:', uuid);
```

### ランダム値での配列の埋め込み

```javascript
import * as Crypto from 'expo-crypto';

const array = new Uint8Array(10);
Crypto.getRandomValues(array);
console.log('ランダム配列:', array);
```

## セキュリティに関する注意

- MD2、MD4、MD5、SHA-1は暗号学的に安全ではないと見なされており、新しいアプリケーションでは使用しないでください。
- セキュリティが重要なアプリケーションでは、SHA-256以上を使用してください。
- `getRandomBytes`と`getRandomValues`は、暗号学的に安全な乱数生成器を使用しています。

## プラットフォームサポート

- Android
- iOS
- tvOS
- Web
