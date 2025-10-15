# Jetpack Compose

`@expo/ui`のJetpack Composeコンポーネントは、Jetpack Composeを使用してネイティブなAndroidインターフェースを構築するためのライブラリです。

## バージョン

- **バンドルバージョン**: ~0.2.0-beta.7

## プラットフォームの互換性

- Android

## 概要

このライブラリはアルファステージにあり、Jetpack Composeを使用してネイティブなAndroidインターフェースを構築できます。Expo Goでは利用できず、開発ビルドが必要です。

## インストール

```bash
npx expo install @expo/ui
```

## サポートされているコンポーネント

### 1. Button
ネイティブなAndroidボタンコンポーネント

### 2. CircularProgress
円形のプログレスインジケーター

### 3. ContextMenu
コンテキストメニュー

### 4. Chip
選択可能なチップコンポーネント

### 5. DateTimePicker
日付と時刻の選択コンポーネント

### 6. LinearProgress
線形のプログレスインジケーター

### 7. Picker
ラジオボタンまたはセグメント化されたピッカー

### 8. Slider
値を選択するためのスライダー

### 9. Switch
トグルまたはチェックボックススイッチ

### 10. TextInput
テキスト入力フィールド

## 基本的な使用方法

```javascript
import { Button } from '@expo/ui/jetpack-compose';

export default function MyComponent() {
  return (
    <Button
      style={{ flex: 1 }}
      variant="default"
      onPress={() => {
        console.log('ボタンが押されました');
      }}>
      プロフィールを編集
    </Button>
  );
}
```

## 重要な警告

> このライブラリは現在アルファ版であり、頻繁に破壊的な変更が発生します。

## コンポーネントの詳細

### Button

ネイティブなAndroidボタンを実装します。

#### Props

- **variant** (`string`) - ボタンのバリアント（`default`、`filled`、`outlined`など）
- **onPress** (`function`) - ボタンが押されたときのコールバック
- **style** - スタイルオブジェクト
- **children** - ボタンのテキストまたはコンテンツ

### CircularProgress

円形のプログレスインジケーターを表示します。

#### Props

- **progress** (`number`) - 進捗状況（0〜1）
- **indeterminate** (`boolean`) - 不確定なプログレス表示
- **style** - スタイルオブジェクト

### DateTimePicker

日付と時刻を選択するためのピッカーです。

#### Props

- **mode** (`'date' | 'time'`) - ピッカーのモード
- **value** (`Date`) - 選択された日付/時刻
- **onChange** (`function`) - 値が変更されたときのコールバック

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

### TextInput

テキスト入力フィールドを提供します。

#### Props

- **value** (`string`) - 入力テキスト
- **onChangeText** (`function`) - テキストが変更されたときのコールバック
- **placeholder** (`string`) - プレースホルダーテキスト
- **secureTextEntry** (`boolean`) - パスワード入力用

## API探索

完全なドキュメントはまだ利用できません。TypeScriptの型定義を使用してAPIを探索することをお勧めします。

```javascript
import * as JetpackCompose from '@expo/ui/jetpack-compose';
```

## 公式ドキュメントとの対応

これらのコンポーネントは、公式のAndroid Jetpack Composeドキュメントに密接に対応しています。詳細については、[Android Jetpack Composeドキュメント](https://developer.android.com/jetpack/compose)を参照してください。

## 制限事項

- Expo Goでは動作しません
- 開発ビルドが必要です
- アルファステージのため、APIが変更される可能性があります
- Android専用です

## ベストプラクティス

1. **開発ビルドを使用**: Expo Goではテストできません
2. **TypeScript使用**: 型定義により、利用可能なpropsを確認できます
3. **公式ドキュメントを参照**: Jetpack Composeの公式ドキュメントも確認してください
4. **更新に注意**: アルファ版のため、頻繁に更新を確認してください

## 関連リソース

- [Android Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Expo UIドキュメント](../ui/)
- [GitHubリポジトリ](https://github.com/expo/expo)

## 次のステップ

実際のプロジェクトでこれらのコンポーネントを使用して、ネイティブなAndroid UIを構築してください。TypeScriptの型定義を活用して、利用可能なpropsとメソッドを探索することをお勧めします。
