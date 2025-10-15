# Speech

モバイルおよびWebアプリケーションにテキスト読み上げ機能を提供するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-speech
```

## 概要

`expo-speech`は、Android、iOS、Webプラットフォームでテキスト読み上げ機能を提供します。テキストを音声に変換し、カスタマイズ可能な音声オプションを備えています。

## プラットフォームサポート

- Android
- iOS
- Web

## 基本的な使用方法

```javascript
import * as Speech from 'expo-speech';

const speak = () => {
  const thingToSay = 'こんにちは';
  Speech.speak(thingToSay);
};
```

## API リファレンス

### speak(text, options)

テキストを音声に変換します。

```javascript
Speech.speak('読み上げるテキスト', {
  language: 'ja-JP',
  pitch: 1.0,
  rate: 1.0,
  onDone: () => console.log('完了'),
  onError: (error) => console.error(error)
});
```

**パラメータ**:
- `text` (string): 読み上げるテキスト
- `options` (オプション): 音声設定

**主なオプション**:
- `language` (string): 言語コード（例: 'ja-JP'）
- `pitch` (number): ピッチ（0.5 - 2.0）
- `rate` (number): 速度（0.5 - 2.0）
- `voice` (string): 使用する音声のID
- `onStart` (function): 読み上げ開始時のコールバック
- `onDone` (function): 読み上げ完了時のコールバック
- `onError` (function): エラー発生時のコールバック
- `onStopped` (function): 読み上げ停止時のコールバック

### getAvailableVoicesAsync()

利用可能な音声のリストを取得します。

```javascript
const voices = await Speech.getAvailableVoicesAsync();
console.log(voices);
```

**戻り値**: 利用可能な音声の配列を含むPromise。

### isSpeakingAsync()

現在読み上げ中かどうかを確認します。

```javascript
const speaking = await Speech.isSpeakingAsync();
```

**戻り値**: 読み上げ中の場合は`true`を返すPromise。

### pause()

読み上げを一時停止します。

```javascript
Speech.pause();
```

**注意**: Androidではサポートされていません。

### resume()

一時停止した読み上げを再開します。

```javascript
Speech.resume();
```

### stop()

現在の読み上げを中断します。

```javascript
Speech.stop();
```

## 使用例

### 基本的な読み上げ

```javascript
import * as Speech from 'expo-speech';
import { Button } from 'react-native';

export default function App() {
  const speak = () => {
    Speech.speak('こんにちは、世界！', {
      language: 'ja-JP',
    });
  };

  return <Button title="読み上げ" onPress={speak} />;
}
```

### カスタム音声の選択

```javascript
const speakWithCustomVoice = async () => {
  const voices = await Speech.getAvailableVoicesAsync();
  const japaneseVoice = voices.find(v => v.language === 'ja-JP');

  Speech.speak('カスタム音声を使用', {
    voice: japaneseVoice?.identifier
  });
};
```

### イベントハンドリング

```javascript
Speech.speak('イベント付き読み上げ', {
  onStart: () => console.log('開始'),
  onDone: () => console.log('完了'),
  onError: (error) => console.error('エラー:', error),
  onStopped: () => console.log('停止')
});
```

## 重要な注意事項

**iOS物理デバイスの注意**: デバイスがサイレントモードの場合、`expo-speech`は音声を出力しません。

## プラットフォーム固有の動作

- **Android**: `pause()`メソッドはサポートされていません
- **iOS**: サイレントモードでは音声が出力されません
- **Web**: ブラウザの対応によって機能が異なる場合があります
