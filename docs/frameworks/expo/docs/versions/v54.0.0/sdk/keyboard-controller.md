# react-native-keyboard-controller

`react-native-keyboard-controller` は、React Native向けのクロスプラットフォームキーボード管理ライブラリで、AndroidとiOSで一貫したキーボード処理を提供します。

## 主な機能

- AndroidとiOSで同一の動作
- 高度なキーボード管理を提供
- 最小限の設定で使用可能
- ネイティブなユーザーエクスペリエンス

## インストール

```bash
npx expo install react-native-keyboard-controller
```

## 使用例

```jsx
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function FormScreen() {
  return (
    <>
      <KeyboardAwareScrollView bottomOffset={62}>
        {/* TextInputコンポーネント */}
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}
```

## 主なコンポーネント

### KeyboardAwareScrollView

キーボードを考慮したスクロールビューコンポーネント。キーボードが表示されたときに自動的にコンテンツをスクロールします。

### KeyboardToolbar

キーボード上に表示されるツールバーコンポーネント。

## その他のリソース

- [公式ドキュメント](https://kirillzyusko.github.io/react-native-keyboard-controller/) - 詳細な使用方法とAPIリファレンス
- [GitHub Repository](https://github.com/kirillzyusko/react-native-keyboard-controller) - ソースコードとissue
- [npm Package](https://www.npmjs.com/package/react-native-keyboard-controller) - パッケージ情報

## 概要

このライブラリは、異なるプラットフォーム間で一貫性のある使いやすいインターフェースを提供することで、React Nativeアプリケーションでのキーボードインタラクションを簡素化することを目的としています。
