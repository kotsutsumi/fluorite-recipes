# Expo KeepAwake

## 概要

レンダリング時に画面がスリープするのを防ぐReactコンポーネントとライブラリで、Android、iOS、tvOS、Webプラットフォームをサポートしています。

## インストール

```bash
npx expo install expo-keep-awake
```

## 使用方法

### フックの使用

```javascript
import { useKeepAwake } from 'expo-keep-awake';

export default function KeepAwakeExample() {
  useKeepAwake();
  return (
    <View>
      <Text>この画面はスリープしません！</Text>
    </View>
  );
}
```

### 命令的な関数の使用

```javascript
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

export default class KeepAwakeExample extends React.Component {
  _activate = () => {
    activateKeepAwake();
    alert('アクティブ化されました！');
  };

  _deactivate = () => {
    deactivateKeepAwake();
    alert('非アクティブ化されました！');
  };
}
```

## 主要なAPIメソッド

- `useKeepAwake()`: 画面のスリープを防ぐReactフック
- `activateKeepAwake()`: 画面がスリープするのを防ぐ
- `deactivateKeepAwake()`: 画面のスリープを再度有効にする
- `isAvailableAsync()`: keep awakeの利用可能性を確認

## プラットフォーム

Android、iOS、tvOS、およびWeb（限定的なサポート）でサポート

## 重要な注意事項

- Webのサポートは限定的
- オプションのタグを使用して複数のkeep awake状態を管理可能
- フックと命令的な関数の両方のアプローチを提供
