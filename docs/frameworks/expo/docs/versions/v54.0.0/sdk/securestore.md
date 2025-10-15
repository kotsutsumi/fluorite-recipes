# SecureStore

デバイス上で暗号化されたキーと値のペアをローカルに安全に保存するためのライブラリです。

## 概要

SecureStoreは、機密情報を安全に保存するための暗号化されたキーバリューストレージを提供します。プラットフォーム固有のセキュアストレージメカニズムを使用して、データを保護します。

## インストール

```bash
npx expo install expo-secure-store
```

## プラットフォーム

- Android
- iOS

## プラットフォームストレージ

### Android
- 暗号化されたSharedPreferencesに値を保存
- Android Keystoreを使用した暗号化

### iOS
- keychainサービスを使用
- `kSecClassGenericPassword`で保存

## 主な機能

- 暗号化されたキーバリュー保存
- 生体認証による保護
- プラットフォームネイティブなセキュリティ
- アクセシビリティレベルの設定（iOS）
- セキュアなデータの削除

## 基本的な使用例

```typescript
import * as SecureStore from 'expo-secure-store';

// 値を保存
async function saveToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

// 値を取得
async function getToken(key: string) {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
  return null;
}

// 値を削除
async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}

// 使用例
await saveToken('userToken', 'abc123xyz');
const token = await getToken('userToken');
console.log('トークン:', token);
await deleteToken('userToken');
```

## API

### `SecureStore.setItemAsync(key, value, options?)`

キーと値のペアを安全に保存します。

**パラメータ:**
- `key` (string): ストレージキー（最大2048バイト）
- `value` (string): 保存する値（最大2048バイト）
- `options` (SecureStoreOptions, optional): 設定オプション

**戻り値:**
- `Promise<void>`

```typescript
await SecureStore.setItemAsync('userToken', 'secret-token-123', {
  keychainService: 'myAppKeychain',
});
```

### `SecureStore.getItemAsync(key, options?)`

保存された値を取得します。

**パラメータ:**
- `key` (string): 取得するキー
- `options` (SecureStoreOptions, optional): 設定オプション

**戻り値:**
- `Promise<string | null>` - 保存された値、または存在しない場合はnull

```typescript
const value = await SecureStore.getItemAsync('userToken');
if (value) {
  console.log('値:', value);
}
```

### `SecureStore.deleteItemAsync(key, options?)`

保存された値を削除します。

**パラメータ:**
- `key` (string): 削除するキー
- `options` (SecureStoreOptions, optional): 設定オプション

**戻り値:**
- `Promise<void>`

```typescript
await SecureStore.deleteItemAsync('userToken');
```

## 設定オプション

### `SecureStoreOptions`

```typescript
type SecureStoreOptions = {
  keychainService?: string;           // iOS: キーチェーンサービス名
  keychainAccessible?: number;        // iOS: アクセシビリティレベル
  requireAuthentication?: boolean;    // 生体認証を要求
  authenticationPrompt?: string;      // 認証プロンプトメッセージ
};
```

### iOS アクセシビリティレベル

```typescript
import * as SecureStore from 'expo-secure-store';

// デバイスロック解除時にアクセス可能
await SecureStore.setItemAsync('key', 'value', {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
});

// デバイス起動後にアクセス可能
await SecureStore.setItemAsync('key', 'value', {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
});

// 常にアクセス可能（非推奨）
await SecureStore.setItemAsync('key', 'value', {
  keychainAccessible: SecureStore.ALWAYS,
});
```

**アクセシビリティレベル:**
- `WHEN_UNLOCKED`: デバイスがロック解除されているときのみ
- `AFTER_FIRST_UNLOCK`: デバイス起動後の最初のロック解除後
- `WHEN_UNLOCKED_THIS_DEVICE_ONLY`: デバイスのみ、バックアップなし
- `WHEN_PASSCODE_SET_THIS_DEVICE_ONLY`: パスコード設定時のみ
- `ALWAYS`: 常にアクセス可能（セキュリティ上推奨されません）

## 生体認証

```typescript
import * as SecureStore from 'expo-secure-store';

// 生体認証を要求して保存
await SecureStore.setItemAsync('sensitiveData', 'secret', {
  requireAuthentication: true,
  authenticationPrompt: '機密データにアクセスするには認証してください',
});

// 生体認証を要求して取得
const data = await SecureStore.getItemAsync('sensitiveData', {
  requireAuthentication: true,
  authenticationPrompt: 'データを取得するには認証してください',
});
```

## 実用例

### ユーザー認証トークンの保存

```typescript
import * as SecureStore from 'expo-secure-store';

class AuthService {
  private static TOKEN_KEY = 'authToken';
  private static REFRESH_TOKEN_KEY = 'refreshToken';

  static async saveTokens(token: string, refreshToken: string) {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('トークン保存エラー:', error);
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('トークン取得エラー:', error);
      return null;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('リフレッシュトークン取得エラー:', error);
      return null;
    }
  }

  static async clearTokens() {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('トークン削除エラー:', error);
    }
  }
}

// 使用例
await AuthService.saveTokens('access-token', 'refresh-token');
const token = await AuthService.getToken();
await AuthService.clearTokens();
```

### ユーザー設定の保存

```typescript
import * as SecureStore from 'expo-secure-store';

interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

class SettingsService {
  private static SETTINGS_KEY = 'userSettings';

  static async saveSettings(settings: UserSettings) {
    try {
      const jsonSettings = JSON.stringify(settings);
      await SecureStore.setItemAsync(this.SETTINGS_KEY, jsonSettings);
    } catch (error) {
      console.error('設定保存エラー:', error);
    }
  }

  static async getSettings(): Promise<UserSettings | null> {
    try {
      const jsonSettings = await SecureStore.getItemAsync(this.SETTINGS_KEY);
      if (jsonSettings) {
        return JSON.parse(jsonSettings);
      }
      return null;
    } catch (error) {
      console.error('設定取得エラー:', error);
      return null;
    }
  }
}
```

### 機密データの暗号化保存

```typescript
import * as SecureStore from 'expo-secure-store';

class SecureDataService {
  static async saveSensitiveData(key: string, data: string) {
    try {
      await SecureStore.setItemAsync(key, data, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        requireAuthentication: true,
        authenticationPrompt: '機密データにアクセスするには認証してください',
      });
    } catch (error) {
      console.error('データ保存エラー:', error);
      throw error;
    }
  }

  static async getSensitiveData(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key, {
        requireAuthentication: true,
        authenticationPrompt: 'データにアクセスするには認証してください',
      });
    } catch (error) {
      console.error('データ取得エラー:', error);
      return null;
    }
  }
}
```

### React Hookでの使用

```typescript
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

function useSecureStore(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await SecureStore.getItemAsync(key);
        setValue(storedValue);
      } catch (error) {
        console.error('値の読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const updateValue = async (newValue: string) => {
    try {
      await SecureStore.setItemAsync(key, newValue);
      setValue(newValue);
    } catch (error) {
      console.error('値の更新エラー:', error);
    }
  };

  const deleteValue = async () => {
    try {
      await SecureStore.deleteItemAsync(key);
      setValue(null);
    } catch (error) {
      console.error('値の削除エラー:', error);
    }
  };

  return { value, loading, updateValue, deleteValue };
}

// 使用例
function MyComponent() {
  const { value, loading, updateValue, deleteValue } = useSecureStore('myKey');

  if (loading) {
    return <Text>読み込み中...</Text>;
  }

  return (
    <View>
      <Text>値: {value}</Text>
      <Button title="更新" onPress={() => updateValue('新しい値')} />
      <Button title="削除" onPress={deleteValue} />
    </View>
  );
}
```

## 重要な考慮事項

### データ永続性
- データはアプリのアンインストール後には保持されません
- iOSのキーチェーンデータはデバイスのバックアップに含まれる場合があります（アクセシビリティ設定による）

### サイズ制限
- キーと値の最大サイズは2048バイト
- 大きなペイロードはプラットフォームによって拒否される可能性があります

### エラー処理
- 常にSecureStore操作をtry-catchブロックでラップ
- ストレージの失敗に対する適切なフォールバックを提供

## ベストプラクティス

1. **機密データのみ**: パスワード、トークン、個人情報などの機密データにのみ使用
2. **適切なアクセシビリティ**: iOSで適切なアクセシビリティレベルを選択
3. **エラー処理**: すべての操作を適切なエラー処理でラップ
4. **サイズ管理**: 大きなデータを保存しない（2048バイト制限）
5. **クリーンアップ**: 不要になったデータは削除

## トラブルシューティング

- **保存に失敗**: データサイズが2048バイトを超えていないか確認
- **取得時にnull**: キーが正しいか、データが保存されているか確認
- **生体認証エラー**: デバイスで生体認証が設定されているか確認

このライブラリは、ExpoとReact Nativeアプリケーションで機密データを保存するための安全でクロスプラットフォームなソリューションを提供します。
