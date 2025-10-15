# Video (expo-av)

`expo-av`は、アプリでビデオの再生と録画を行うためのライブラリです。

> **非推奨**: 新しいプロジェクトでは`expo-video`の使用を推奨します。

## プラットフォームの互換性

- Android
- iOS
- tvOS
- Web

## インストール

```bash
npx expo install expo-av
```

## 基本的な使用方法

```javascript
import { useState, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function App() {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? '一時停止' : '再生'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## 主な機能

- ビデオの再生と一時停止
- ネイティブコントロールのサポート
- リサイズモード（CONTAIN、COVER、STRETCH）
- フルスクリーンサポート
- 再生ステータスの更新
- ポスター画像のサポート
- ループ再生

## コンポーネント

### Video

ビデオを再生するためのコンポーネント。

#### Props

##### `source` (必須)

ビデオソース。

```javascript
// リモートURL
source={{ uri: 'https://example.com/video.mp4' }}

// ローカルファイル
source={require('./assets/video.mp4')}
```

##### `useNativeControls`

ネイティブの再生コントロールを表示するかどうか。

```javascript
useNativeControls={true}
```

##### `resizeMode`

ビデオのスケーリング方法。

- **ResizeMode.CONTAIN**: アスペクト比を保持して枠内に収める
- **ResizeMode.COVER**: アスペクト比を保持して枠を埋める
- **ResizeMode.STRETCH**: 枠に合わせて伸縮

```javascript
resizeMode={ResizeMode.CONTAIN}
```

##### `isLooping`

ビデオをループ再生するかどうか。

```javascript
isLooping={true}
```

##### `isMuted`

ビデオをミュートするかどうか。

```javascript
isMuted={false}
```

##### `volume`

音量（0.0 - 1.0）。

```javascript
volume={1.0}
```

##### `rate`

再生速度（1.0が通常速度）。

```javascript
rate={1.0}
```

##### `shouldCorrectPitch`

再生速度を変更した際にピッチを補正するかどうか。

```javascript
shouldCorrectPitch={true}
```

##### `positionMillis`

再生位置（ミリ秒）。

```javascript
positionMillis={5000}
```

##### `progressUpdateIntervalMillis`

再生ステータス更新の間隔（ミリ秒）。

```javascript
progressUpdateIntervalMillis={500}
```

##### `usePoster`

ポスター画像を使用するかどうか。

```javascript
usePoster={true}
```

##### `posterSource`

ポスター画像のソース。

```javascript
posterSource={{ uri: 'https://example.com/poster.jpg' }}
```

##### `posterStyle`

ポスター画像のスタイル。

```javascript
posterStyle={{ resizeMode: 'cover' }}
```

#### イベント

##### `onPlaybackStatusUpdate`

再生ステータスが更新されたときに呼び出されます。

```javascript
onPlaybackStatusUpdate={status => {
  if (status.isLoaded) {
    console.log('再生位置:', status.positionMillis);
    console.log('再生中:', status.isPlaying);
    console.log('再生完了:', status.didJustFinish);
  }
}}
```

##### `onLoadStart`

ビデオの読み込みが開始されたときに呼び出されます。

```javascript
onLoadStart={() => console.log('読み込み開始')}
```

##### `onLoad`

ビデオの読み込みが完了したときに呼び出されます。

```javascript
onLoad={status => console.log('読み込み完了:', status)}
```

##### `onError`

エラーが発生したときに呼び出されます。

```javascript
onError={error => console.error('エラー:', error)}
```

##### `onReadyForDisplay`

ビデオの表示準備ができたときに呼び出されます。

```javascript
onReadyForDisplay={({ naturalSize }) => {
  console.log('サイズ:', naturalSize.width, 'x', naturalSize.height);
}}
```

##### `onFullscreenUpdate`

フルスクリーン状態が変更されたときに呼び出されます。

```javascript
onFullscreenUpdate={({ fullscreenUpdate }) => {
  console.log('フルスクリーン:', fullscreenUpdate);
}}
```

## メソッド

### `playAsync()`

ビデオを再生します。

```javascript
await video.current.playAsync();
```

### `pauseAsync()`

ビデオを一時停止します。

```javascript
await video.current.pauseAsync();
```

### `stopAsync()`

ビデオを停止し、先頭に戻します。

```javascript
await video.current.stopAsync();
```

### `setPositionAsync(millis)`

再生位置を設定します。

```javascript
await video.current.setPositionAsync(5000);
```

### `setRateAsync(rate, shouldCorrectPitch)`

再生速度を設定します。

```javascript
await video.current.setRateAsync(2.0, true);
```

### `setVolumeAsync(volume)`

音量を設定します。

```javascript
await video.current.setVolumeAsync(0.5);
```

### `setIsMutedAsync(isMuted)`

ミュート状態を設定します。

```javascript
await video.current.setIsMutedAsync(true);
```

### `setIsLoopingAsync(isLooping)`

ループ再生を設定します。

```javascript
await video.current.setIsLoopingAsync(true);
```

### `presentFullscreenPlayer()`

フルスクリーンモードに切り替えます（iOS/Android）。

```javascript
await video.current.presentFullscreenPlayer();
```

### `dismissFullscreenPlayer()`

フルスクリーンモードを終了します（iOS/Android）。

```javascript
await video.current.dismissFullscreenPlayer();
```

### `getStatusAsync()`

現在の再生ステータスを取得します。

```javascript
const status = await video.current.getStatusAsync();
console.log('再生中:', status.isPlaying);
```

### `unloadAsync()`

ビデオをアンロードします。

```javascript
await video.current.unloadAsync();
```

### `loadAsync(source, initialStatus, downloadFirst)`

新しいビデオを読み込みます。

```javascript
await video.current.loadAsync(
  { uri: 'https://example.com/video.mp4' },
  { shouldPlay: true }
);
```

## ResizeMode

ビデオのスケーリング方法を定義します。

- **CONTAIN**: アスペクト比を保持して枠内に収める
- **COVER**: アスペクト比を保持して枠を埋める
- **STRETCH**: 枠に合わせて伸縮

```javascript
import { ResizeMode } from 'expo-av';

<Video resizeMode={ResizeMode.CONTAIN} />
```

## 再生ステータス

`onPlaybackStatusUpdate`イベントで返されるステータスオブジェクトには以下のプロパティがあります:

- **isLoaded**: ビデオが読み込まれているかどうか
- **isPlaying**: 再生中かどうか
- **isBuffering**: バッファリング中かどうか
- **positionMillis**: 現在の再生位置（ミリ秒）
- **durationMillis**: ビデオの長さ（ミリ秒）
- **didJustFinish**: 再生が完了したかどうか
- **rate**: 再生速度
- **volume**: 音量
- **isMuted**: ミュート状態

## 移行について

新しいプロジェクトでは`expo-video`への移行を推奨します。`expo-video`はより優れたパフォーマンスと機能を提供します。

[expo-videoドキュメント](./video/)を参照してください。

## 関連リソース

- [expo-video](./video/)
- [Audio](./audio/)
- [AVPlaybackStatus](https://docs.expo.dev/versions/latest/sdk/av/#avplaybackstatus)
