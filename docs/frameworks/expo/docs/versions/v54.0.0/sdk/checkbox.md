# Checkbox

基本的なチェックボックス機能を提供するユニバーサルReactコンポーネントです。

## インストール

```bash
npx expo install expo-checkbox
```

## 使用方法

```javascript
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
        />
        <Text style={styles.paragraph}>通常のチェックボックス</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  paragraph: {
    fontSize: 15,
  },
});
```

## API

```javascript
import { Checkbox } from 'expo-checkbox';
```

## Props

### `color`

**型:** `string`（オプション）

チェックボックスの色を指定します。

---

### `disabled`

**型:** `boolean`（オプション）

`true`の場合、ユーザーはチェックボックスと対話できなくなります。デフォルトは`false`です。

---

### `onChange`

**型:** `(event: CheckboxEvent) => void`（オプション）

チェックボックスの値が変更されたときに呼び出されるコールバック関数です。

---

### `onValueChange`

**型:** `(value: boolean) => void`（オプション）

チェックボックスの値が変更されたときに呼び出されるコールバック関数です。新しいチェック状態を引数として受け取ります。

---

### `value`

**型:** `boolean`

チェックボックスがチェックされているかどうかを示すブール値です。`true`の場合、チェックボックスはチェックされた状態で表示されます。

## 型

### `CheckboxEvent`

チェックボックスイベントを表す型です。

```typescript
interface CheckboxEvent {
  nativeEvent: {
    target: number;
    value: boolean;
  };
}
```

## プラットフォームサポート

- Android
- iOS
- tvOS
- Web

## 追加の例

### 無効化されたチェックボックス

```javascript
<Checkbox
  value={isChecked}
  onValueChange={setChecked}
  disabled={true}
  color="#ccc"
/>
```

### カスタム色のチェックボックス

```javascript
<Checkbox
  value={isChecked}
  onValueChange={setChecked}
  color={isChecked ? '#4630EB' : undefined}
/>
```
