# React Native

このガイドでは、JotaiをReact Nativeアプリケーションで使用する方法を説明します。

## 互換性

Jotai atomsはReact Nativeアプリケーションで**完全に変更なしで使用できます**。JotaiはReact Nativeとの100%互換性を目指しています。

## 基本的な使用

React Nativeでのatomsの使用方法は、React Webアプリケーションと同じです：

```javascript
import { atom, useAtom } from 'jotai'
import { View, Text, Button } from 'react-native'

const countAtom = atom(0)

export default function Counter() {
  const [count, setCount] = useAtom(countAtom)

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button
        title="Increment"
        onPress={() => setCount((c) => c + 1)}
      />
    </View>
  )
}
```

## 永続化

React Nativeでatomの状態を永続化するには、`atomWithStorage`関数を使用します。

### AsyncStorageとの統合

```javascript
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = createJSONStorage(() => AsyncStorage)

const countAtom = atomWithStorage('count', 0, storage)
```

### 完全な例

```javascript
import { atom, useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Button } from 'react-native'

const storage = createJSONStorage(() => AsyncStorage)
const persistedCountAtom = atomWithStorage('count', 0, storage)

export default function PersistedCounter() {
  const [count, setCount] = useAtom(persistedCountAtom)

  return (
    <View>
      <Text>Persisted Count: {count}</Text>
      <Button
        title="Increment"
        onPress={() => setCount((c) => c + 1)}
      />
      <Button
        title="Reset"
        onPress={() => setCount(0)}
      />
    </View>
  )
}
```

### インストール

AsyncStorageを使用するには、まずインストールする必要があります：

```bash
npm install @react-native-async-storage/async-storage
# または
yarn add @react-native-async-storage/async-storage
```

## パフォーマンス

### オーバーヘッド

Jotaiを使用する際の既知の特定のオーバーヘッドはありません。Jotaiのアトミックアーキテクチャは、ロジックとデータの分割を促進します。

### 最適化のベストプラクティス

1. **ロジックとデータの分割**：atomsを小さく保ち、関心事を分離します
2. **効率的なレンダリング**：必要なatomsのみを購読します
3. **計算ロジックをasyncアクションに移動**：重い計算は非同期処理に分離します

```javascript
// 良い例：小さく分割されたatoms
const nameAtom = atom('')
const ageAtom = atom(0)
const emailAtom = atom('')

// 避けるべき：大きな単一のatom
const userAtom = atom({
  name: '',
  age: 0,
  email: '',
  // ... 多くのフィールド
})
```

### Derived Atomsの活用

計算ロジックをderived atomsに分離することで、効率的な再レンダリングを実現できます：

```javascript
const itemsAtom = atom([])
const filterAtom = atom('')

// Derived atom：フィルタリングロジックを分離
const filteredItemsAtom = atom((get) => {
  const items = get(itemsAtom)
  const filter = get(filterAtom)
  return items.filter((item) => item.includes(filter))
})

function ItemList() {
  const [filteredItems] = useAtom(filteredItemsAtom)
  // filteredItemsが変更されたときのみ再レンダリング
  return (
    <View>
      {filteredItems.map((item) => (
        <Text key={item}>{item}</Text>
      ))}
    </View>
  )
}
```

### Async処理の最適化

非同期処理を使用して重い計算をメインスレッドから分離します：

```javascript
const dataAtom = atom([])

const processedDataAtom = atom(async (get) => {
  const data = get(dataAtom)
  // 重い計算を非同期で実行
  const result = await processDataInBackground(data)
  return result
})
```

## React Navigationとの統合

React Navigationとシームレスに統合できます：

```javascript
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from 'jotai'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
```

## Expoとの使用

ExpoプロジェクトでもJotaiは完全に動作します：

```javascript
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'jotai'
import { StyleSheet, View } from 'react-native'

export default function App() {
  return (
    <Provider>
      <View style={styles.container}>
        <Counter />
        <StatusBar style="auto" />
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
```

## ベストプラクティス

1. **Atomsを小さく保つ**：単一の責任原則に従います
2. **Derived atomsを活用する**：計算ロジックを分離します
3. **AsyncStorageで永続化**：重要な状態を保存します
4. **パフォーマンスを監視する**：React Native Performance Monitorを使用します
5. **必要な場所でのみ購読する**：不要な再レンダリングを避けます

## デバッグ

React Native Debuggerと組み合わせてJotaiのデバッグが可能です：

```javascript
const countAtom = atom(0)

if (__DEV__) {
  countAtom.debugLabel = 'count'
}
```

詳細は[デバッグガイド](./debugging.md)を参照してください。

## トラブルシューティング

### AsyncStorageの問題

AsyncStorageが正しくインストールされ、リンクされていることを確認してください：

```bash
# iOSの場合
cd ios && pod install

# React Native CLIプロジェクトの場合
npx react-native link @react-native-async-storage/async-storage
```

### パフォーマンスの問題

1. Atomsが細かく分割されていることを確認
2. 不要な再レンダリングがないかチェック
3. React Native Performance Monitorを使用

## まとめ

JotaiはReact Nativeと完全に互換性があり、パフォーマンスオーバーヘッドはほとんどありません。AsyncStorageとの統合により、状態の永続化も簡単に実現できます。アトミックアーキテクチャにより、効率的で保守しやすい状態管理が可能になります。
