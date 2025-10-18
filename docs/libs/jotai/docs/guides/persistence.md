# 永続化

Jotaiは、`localStorage`、`sessionStorage`、`AsyncStorage`などのストレージメカニズムを使用した状態の永続化のための複数の戦略を提供します。

## 主要な永続化テクニック

### シンプルなlocalStorageパターン

```javascript
import { atom } from 'jotai'

const strAtom = atom(localStorage.getItem('myKey') ?? 'foo')

const strAtomWithPersistence = atom(
  (get) => get(strAtom),
  (get, set, newStr) => {
    set(strAtom, newStr)
    localStorage.setItem('myKey', newStr)
  }
)
```

このパターンは以下を行います:
- 初期化時に`localStorage`から値を読み込みます
- 値が更新されるたびに`localStorage`に保存します

### JSONパースを使用したヘルパー関数

```javascript
const atomWithLocalStorage = (key, initialValue) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item)
    }
    return initialValue
  }

  const baseAtom = atom(getInitialValue())

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
    }
  )

  return derivedAtom
}
```

### 使用例

```javascript
const darkModeAtom = atomWithLocalStorage('darkMode', false)
const countAtom = atomWithLocalStorage('count', 0)
const userAtom = atomWithLocalStorage('user', { name: '', email: '' })

function App() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)
  const [count, setCount] = useAtom(countAtom)
  const [user, setUser] = useAtom(userAtom)

  return (
    <div>
      <button onClick={() => setDarkMode(!darkMode)}>
        テーマを切り替え
      </button>
      <button onClick={() => setCount((c) => c + 1)}>カウント: {count}</button>
    </div>
  )
}
```

## AsyncStorageの例（React Native）

```javascript
import { atom } from 'jotai'
import AsyncStorage from '@react-native-async-storage/async-storage'

const atomWithAsyncStorage = (key, initialValue) => {
  const baseAtom = atom(initialValue)

  baseAtom.onMount = (setValue) => {
    ;(async () => {
      const item = await AsyncStorage.getItem(key)
      if (item !== null) {
        setValue(JSON.parse(item))
      }
    })()
  }

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      AsyncStorage.setItem(key, JSON.stringify(nextValue))
    }
  )

  return derivedAtom
}
```

### React Nativeでの使用

```javascript
import { useAtom } from 'jotai'

const userPreferencesAtom = atomWithAsyncStorage('userPreferences', {
  theme: 'light',
  notifications: true,
})

function SettingsScreen() {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom)

  return (
    <View>
      <Switch
        value={preferences.notifications}
        onValueChange={(value) =>
          setPreferences({ ...preferences, notifications: value })
        }
      />
    </View>
  )
}
```

## atomWithStorageユーティリティの使用

Jotaiは、一般的な永続化パターンのための組み込みユーティリティ`atomWithStorage`を提供します。

```javascript
import { atomWithStorage } from 'jotai/utils'

// localStorage（デフォルト）
const darkModeAtom = atomWithStorage('darkMode', false)

// sessionStorage
const sessionAtom = atomWithStorage('sessionData', {}, sessionStorage)

// カスタムストレージ
const customStorage = {
  getItem: (key) => {
    // カスタム取得ロジック
    return localStorage.getItem(key)
  },
  setItem: (key, value) => {
    // カスタム設定ロジック
    localStorage.setItem(key, value)
  },
  removeItem: (key) => {
    // カスタム削除ロジック
    localStorage.removeItem(key)
  },
}

const customAtom = atomWithStorage('customKey', 'default', customStorage)
```

## 高度な永続化パターン

### デバウンスされた永続化

頻繁な書き込みを避けるために、ストレージへの書き込みをデバウンスします。

```javascript
import { atom } from 'jotai'
import { debounce } from 'lodash'

const atomWithDebouncedStorage = (key, initialValue, delay = 500) => {
  const baseAtom = atom(initialValue)

  const debouncedSetItem = debounce((value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }, delay)

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      debouncedSetItem(nextValue)
    }
  )

  return derivedAtom
}

const searchQueryAtom = atomWithDebouncedStorage('searchQuery', '', 300)
```

### バージョン管理された永続化

ストレージスキーマのバージョン管理を処理します。

```javascript
const atomWithVersionedStorage = (key, initialValue, version = 1) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      try {
        const parsed = JSON.parse(item)
        if (parsed.version === version) {
          return parsed.value
        }
      } catch (e) {
        console.error('永続化されたデータの解析に失敗しました', e)
      }
    }
    return initialValue
  }

  const baseAtom = atom(getInitialValue())

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(
        key,
        JSON.stringify({ version, value: nextValue })
      )
    }
  )

  return derivedAtom
}

const userSettingsAtom = atomWithVersionedStorage('userSettings', {}, 2)
```

### 暗号化された永続化

機密データのストレージを暗号化します。

```javascript
import CryptoJS from 'crypto-js'

const atomWithEncryptedStorage = (key, initialValue, secretKey) => {
  const encrypt = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
  }

  const decrypt = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }

  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      try {
        return decrypt(item)
      } catch (e) {
        console.error('データの復号化に失敗しました', e)
      }
    }
    return initialValue
  }

  const baseAtom = atom(getInitialValue())

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, encrypt(nextValue))
    }
  )

  return derivedAtom
}

const sensitiveDataAtom = atomWithEncryptedStorage(
  'sensitiveData',
  {},
  'my-secret-key'
)
```

## 永続化のベストプラクティス

1. **エラー処理**: ストレージの読み取り/書き込み操作は失敗する可能性があります
2. **JSONシリアライゼーション**: ほとんどのストレージメカニズムには文字列が必要です
3. **初期化**: ストレージから値を読み込むときの初期値を常に提供します
4. **パフォーマンス**: 頻繁な書き込みにはデバウンスを検討します
5. **セキュリティ**: 機密データには暗号化を使用します
6. **バージョン管理**: 将来のスキーマ変更のためにバージョン管理を実装します
7. **ストレージ制限**: `localStorage`のサイズ制限に注意します（通常5-10MB）
8. **SSR対応**: サーバーサイドレンダリング環境でストレージAPIが利用できない可能性があることを処理します

## SSR（サーバーサイドレンダリング）の考慮事項

```javascript
const atomWithSafeStorage = (key, initialValue) => {
  // サーバー環境をチェック
  const isServer = typeof window === 'undefined'

  const getInitialValue = () => {
    if (isServer) return initialValue

    const item = localStorage.getItem(key)
    if (item !== null) {
      try {
        return JSON.parse(item)
      } catch (e) {
        console.error('解析エラー', e)
      }
    }
    return initialValue
  }

  const baseAtom = atom(getInitialValue())

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)

      if (!isServer) {
        localStorage.setItem(key, JSON.stringify(nextValue))
      }
    }
  )

  return derivedAtom
}
```

## まとめ

Jotaiの永続化戦略により、以下が可能になります:
- アプリケーションの状態をさまざまなストレージメカニズムに保存
- カスタム永続化ロジックを実装
- エラー処理、暗号化、バージョン管理を処理
- React NativeやSSR環境で動作

`atomWithStorage`ユーティリティを使用するか、特定のニーズに合わせてカスタムソリューションを構築できます。
