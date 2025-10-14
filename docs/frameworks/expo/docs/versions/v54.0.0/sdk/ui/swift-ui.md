# SwiftUI

`@expo/ui`のSwiftUIコンポーネントは、SwiftUIを使用してネイティブなiOSインターフェースを構築するためのライブラリです。

## バージョン

- **バンドルバージョン**: ~0.2.0-beta.7

## プラットフォームの互換性

- iOS
- tvOS（一部制限あり）

## 概要

このライブラリはベータステージにあり、SwiftUIを使用してネイティブなiOSインターフェースを構築できます。Expo Goでは利用できず、開発ビルドが必要です。

## インストール

```bash
npx expo install @expo/ui
```

## サポートされているコンポーネント

### 1. BottomSheet
ボトムシートコンポーネント

### 2. Button
ネイティブなiOSボタンコンポーネント

### 3. CircularProgress
円形のプログレスインジケーター

### 4. ColorPicker
カラー選択コンポーネント

### 5. ContextMenu
コンテキストメニュー

### 6. DateTimePicker
日付と時刻の選択コンポーネント

### 7. Gauge
ゲージメーター（iOS 16+）

### 8. Host
SwiftUIコンポーネントをラップするためのホストコンポーネント

### 9. LinearProgress
線形のプログレスインジケーター

### 10. List
リストコンポーネント

### 11. Picker
セグメント化されたピッカーまたはホイールピッカー

### 12. Slider
値を選択するためのスライダー

### 13. Switch
トグルまたはチェックボックススイッチ

### 14. TextField
テキスト入力フィールド

## 基本的な使用方法

SwiftUIコンポーネントを使用するには、`<Host>`コンポーネントでラップする必要があります:

```javascript
import { Button, Host } from '@expo/ui/swift-ui';

export default function MyComponent() {
  return (
    <Host style={{ flex: 1 }}>
      <Button onPress={() => console.log('押されました')}>
        クリックしてください
      </Button>
    </Host>
  );
}
```

## 重要な注意事項

- APIは現在も開発中です
- 破壊的な変更が発生する可能性があります
- 完全なドキュメントはまだ利用できません
- TypeScriptの型定義を使用してAPIを探索することをお勧めします

## コンポーネントの詳細

### Host

SwiftUIコンポーネントをホストするためのコンテナコンポーネントです。すべてのSwiftUIコンポーネントは`Host`内に配置する必要があります。

#### Props

- **style** - スタイルオブジェクト
- **children** - SwiftUIコンポーネント

### Button

ネイティブなiOSボタンを実装します。

#### Props

- **onPress** (`function`) - ボタンが押されたときのコールバック
- **variant** (`string`) - ボタンのバリアント
- **children** - ボタンのテキストまたはコンテンツ

### BottomSheet

ボトムシートモーダルを表示します（iOS 16+）。

#### Props

- **isPresented** (`boolean`) - シートの表示状態
- **onDismiss** (`function`) - シートが閉じられたときのコールバック
- **children** - シートのコンテンツ

### CircularProgress

円形のプログレスインジケーターを表示します。

#### Props

- **progress** (`number`) - 進捗状況（0〜1）
- **indeterminate** (`boolean`) - 不確定なプログレス表示

### ColorPicker

色を選択するためのピッカーです（iOS 14+）。

#### Props

- **color** (`string`) - 選択された色
- **onChange** (`function`) - 色が変更されたときのコールバック

### DateTimePicker

日付と時刻を選択するためのピッカーです。

#### Props

- **mode** (`'date' | 'time' | 'dateTime'`) - ピッカーのモード
- **value** (`Date`) - 選択された日付/時刻
- **onChange** (`function`) - 値が変更されたときのコールバック

### Gauge

ゲージメーターを表示します（iOS 16+、Apple TVでは利用不可）。

#### Props

- **value** (`number`) - ゲージの値
- **minimumValue** (`number`) - 最小値
- **maximumValue** (`number`) - 最大値

### List

スクロール可能なリストを表示します。

#### Props

- **data** (`array`) - リストのデータ
- **renderItem** (`function`) - アイテムをレンダリングする関数

### Picker

値を選択するためのピッカーです。

#### Props

- **variant** (`'segmented' | 'wheel'`) - ピッカーのバリアント
- **selectedValue** - 選択された値
- **onValueChange** (`function`) - 値が変更されたときのコールバック
- **children** - ピッカーのアイテム

### Slider

数値を選択するためのスライダーコンポーネントです。

#### Props

- **value** (`number`) - 現在の値
- **minimumValue** (`number`) - 最小値
- **maximumValue** (`number`) - 最大値
- **onValueChange** (`function`) - 値が変更されたときのコールバック

### Switch

トグルスイッチまたはチェックボックスを実装します。

#### Props

- **value** (`boolean`) - スイッチの状態
- **onValueChange** (`function`) - 状態が変更されたときのコールバック
- **variant** (`'toggle' | 'checkbox'`) - スイッチのバリアント

### TextField

テキスト入力フィールドを提供します。

#### Props

- **value** (`string`) - 入力テキスト
- **onChangeText** (`function`) - テキストが変更されたときのコールバック
- **placeholder** (`string`) - プレースホルダーテキスト
- **secureTextEntry** (`boolean`) - パスワード入力用

## API探索

完全なドキュメントはまだ利用できません。TypeScriptの型定義を使用してAPIを探索することをお勧めします:

```javascript
import * as SwiftUI from '@expo/ui/swift-ui';
```

## 公式ドキュメントとの対応

これらのコンポーネントは、公式のSwiftUIドキュメントに密接に対応しています。詳細については、[Apple SwiftUIドキュメント](https://developer.apple.com/documentation/swiftui)を参照してください。

## プラットフォーム固有の機能

### iOS
すべてのコンポーネントがサポートされています。

### tvOS
一部のコンポーネント（Gaugeなど）はApple TVで利用できません。

## 制限事項

- Expo Goでは動作しません
- 開発ビルドが必要です
- ベータステージのため、APIが変更される可能性があります
- 一部の機能はiOSのバージョンに依存します

## ベストプラクティス

1. **Hostコンポーネントを使用**: すべてのSwiftUIコンポーネントは`Host`内に配置
2. **開発ビルドを使用**: Expo Goではテストできません
3. **TypeScript使用**: 型定義により、利用可能なpropsを確認できます
4. **公式ドキュメントを参照**: SwiftUIの公式ドキュメントも確認してください
5. **プラットフォーム要件を確認**: 一部の機能はiOSのバージョンに依存します

## 使用例

### 基本的なフォーム

```javascript
import { Host, TextField, Button, Switch } from '@expo/ui/swift-ui';
import { useState } from 'react';

export default function FormExample() {
  const [name, setName] = useState('');
  const [enabled, setEnabled] = useState(false);

  return (
    <Host style={{ flex: 1, padding: 20 }}>
      <TextField
        value={name}
        onChangeText={setName}
        placeholder="名前を入力"
      />
      <Switch
        value={enabled}
        onValueChange={setEnabled}
        variant="toggle"
      />
      <Button onPress={() => console.log({ name, enabled })}>
        送信
      </Button>
    </Host>
  );
}
```

## 関連リソース

- [Apple SwiftUI](https://developer.apple.com/documentation/swiftui)
- [Expo UIドキュメント](../ui/)
- [GitHubリポジトリ](https://github.com/expo/expo)

## 次のステップ

実際のプロジェクトでこれらのコンポーネントを使用して、ネイティブなiOS UIを構築してください。TypeScriptの型定義を活用して、利用可能なpropsとメソッドを探索することをお勧めします。
