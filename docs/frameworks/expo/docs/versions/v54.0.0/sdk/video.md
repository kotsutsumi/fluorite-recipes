# Video (expo-video)

`expo-video`は、React NativeとExpo向けのクロスプラットフォームで高性能なビデオコンポーネントです。Webサポートも含まれ、アプリでビデオ再生を実装するためのAPIを提供します。

## プラットフォームの互換性

- Android
- iOS
- tvOS
- Web

## 主な機能

- クロスプラットフォームサポート（Android、iOS、tvOS、Web）
- 高度なコントロールを備えたビデオ再生
- ローカルおよびリモートビデオソースのサポート
- キャッシング機能
- ピクチャーインピクチャーモード
- フルスクリーンおよびインライン再生
- 複数トラックのサポート（オーディオ、字幕、ビデオ）

## インストール

```bash
npx expo install expo-video
```

## 基本的な使用方法

```javascript
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';

const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  const ref = useRef(null);
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('playingChange', isPlaying => {
      console.log('再生中:', isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.controlsContainer}>
        <Button
          title="再生"
          onPress={() => {
            player.play();
          }}
        />
        <Button
          title="一時停止"
          onPress={() => {
            player.pause();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
```

## 主要なコンポーネントとフック

### `useVideoPlayer(source, setup)`

ビデオプレーヤーインスタンスを作成して管理するフック。

#### パラメータ

- **source** (`string | VideoSource`) - ビデオソース
- **setup** (`function`) - プレーヤーの初期設定を行うコールバック関数

#### 戻り値

`VideoPlayer` - ビデオプレーヤーインスタンス

```javascript
const player = useVideoPlayer(videoSource, player => {
  player.loop = true;
  player.volume = 0.5;
  player.play();
});
```

### `VideoView`

ビデオを表示するためのコンポーネント。

#### Props

##### `player` (必須)

`useVideoPlayer`から取得したプレーヤーインスタンス。

```javascript
<VideoView player={player} />
```

##### `style`

ビデオビューのスタイル。

```javascript
<VideoView style={{ width: 300, height: 200 }} player={player} />
```

##### `nativeControls`

ネイティブの再生コントロールを表示するかどうか。

```javascript
<VideoView nativeControls player={player} />
```

##### `contentFit`

ビデオのスケーリング方法。

- **contain**: アスペクト比を保持して枠内に収める
- **cover**: アスペクト比を保持して枠を埋める
- **fill**: 枠に合わせて伸縮

```javascript
<VideoView contentFit="contain" player={player} />
```

##### `contentPosition`

ビデオの配置位置。

```javascript
<VideoView contentPosition={{ dx: 0, dy: 0 }} player={player} />
```

##### `allowsFullscreen`

フルスクリーンモードを許可するかどうか。

```javascript
<VideoView allowsFullscreen player={player} />
```

##### `allowsPictureInPicture`

ピクチャーインピクチャーモードを許可するかどうか。

```javascript
<VideoView allowsPictureInPicture player={player} />
```

##### `showsTimecodes`

タイムコードを表示するかどうか。

```javascript
<VideoView showsTimecodes player={player} />
```

##### `requiresLinearPlayback`

リニア再生を要求するかどうか（シークを無効化）。

```javascript
<VideoView requiresLinearPlayback player={player} />
```

## VideoPlayerメソッド

### `play()`

ビデオを再生します。

```javascript
player.play();
```

### `pause()`

ビデオを一時停止します。

```javascript
player.pause();
```

### `replace(source)`

ビデオソースを置き換えます。

```javascript
player.replace('https://example.com/new-video.mp4');
```

### `seekBy(seconds)`

指定された秒数だけシークします。

```javascript
player.seekBy(10); // 10秒進める
player.seekBy(-5); // 5秒戻す
```

### `replay()`

ビデオを最初から再生します。

```javascript
player.replay();
```

## VideoPlayerプロパティ

### `playing`

再生中かどうかを示すブール値。

```javascript
console.log('再生中:', player.playing);
```

### `muted`

ミュート状態を示すブール値。

```javascript
player.muted = true;
```

### `volume`

音量（0.0 - 1.0）。

```javascript
player.volume = 0.5;
```

### `loop`

ループ再生を有効にするかどうか。

```javascript
player.loop = true;
```

### `playbackRate`

再生速度（1.0が通常速度）。

```javascript
player.playbackRate = 2.0; // 2倍速
```

### `currentTime`

現在の再生位置（秒）。

```javascript
console.log('現在の位置:', player.currentTime);
```

### `duration`

ビデオの長さ（秒）。

```javascript
console.log('ビデオの長さ:', player.duration);
```

### `status`

現在のプレーヤーのステータス。

```javascript
console.log('ステータス:', player.status);
```

## イベントリスナー

### `playingChange`

再生状態が変更されたときに発火します。

```javascript
player.addListener('playingChange', isPlaying => {
  console.log('再生中:', isPlaying);
});
```

### `playbackRateChange`

再生速度が変更されたときに発火します。

```javascript
player.addListener('playbackRateChange', rate => {
  console.log('再生速度:', rate);
});
```

### `volumeChange`

音量が変更されたときに発火します。

```javascript
player.addListener('volumeChange', volume => {
  console.log('音量:', volume);
});
```

### `mutedChange`

ミュート状態が変更されたときに発火します。

```javascript
player.addListener('mutedChange', isMuted => {
  console.log('ミュート:', isMuted);
});
```

### `statusChange`

ステータスが変更されたときに発火します。

```javascript
player.addListener('statusChange', (status, oldStatus, error) => {
  console.log('ステータス変更:', status, error);
});
```

### `playToEnd`

ビデオが最後まで再生されたときに発火します。

```javascript
player.addListener('playToEnd', () => {
  console.log('再生完了');
});
```

## ビデオソースの種類

### リモートURL

```javascript
const player = useVideoPlayer('https://example.com/video.mp4');
```

### ローカルファイル

```javascript
const player = useVideoPlayer(require('./assets/video.mp4'));
```

### オブジェクト形式

```javascript
const player = useVideoPlayer({
  uri: 'https://example.com/video.mp4',
  headers: {
    'Authorization': 'Bearer token'
  }
});
```

## 高度な機能

### DRM保護されたコンテンツ

DRM（Digital Rights Management）保護されたビデオを再生できます。

```javascript
const player = useVideoPlayer({
  uri: 'https://example.com/drm-video.mp4',
  drm: {
    type: 'widevine',
    licenseServer: 'https://license.example.com',
    headers: {
      'Authorization': 'Bearer token'
    }
  }
});
```

### ビデオのプリロード

```javascript
const player = useVideoPlayer(videoSource, player => {
  player.preload(); // ビデオを事前に読み込む
});
```

### キャッシング

ビデオコンテンツをキャッシュして、オフライン再生やパフォーマンス向上を実現します。

```javascript
const player = useVideoPlayer({
  uri: 'https://example.com/video.mp4',
  overrideFileExtensionAndroid: 'mp4'
});
```

### 複数の字幕トラック

```javascript
// 字幕トラックの取得
const tracks = player.textTracks;

// 字幕トラックの選択
player.currentTextTrack = tracks[0];
```

### オーディオトラックの管理

```javascript
// オーディオトラックの取得
const audioTracks = player.audioTracks;

// オーディオトラックの選択
player.currentAudioTrack = audioTracks[1];
```

## バックグラウンド再生

### iOSの設定

`app.json`に以下を追加:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

### Androidの設定

Androidではデフォルトでバックグラウンド再生がサポートされています。

## ピクチャーインピクチャー

### 基本的な実装

```javascript
<VideoView
  player={player}
  allowsPictureInPicture
  onPictureInPictureStart={() => {
    console.log('PiP開始');
  }}
  onPictureInPictureStop={() => {
    console.log('PiP終了');
  }}
/>
```

## パフォーマンスの最適化

### ビデオの解像度

適切な解像度のビデオを使用してパフォーマンスを向上させます。

### プリロード戦略

```javascript
const player = useVideoPlayer(videoSource, player => {
  player.preload(); // 事前読み込み
});
```

### メモリ管理

```javascript
useEffect(() => {
  return () => {
    player.release(); // クリーンアップ
  };
}, [player]);
```

## トラブルシューティング

### ビデオが再生されない

1. ビデオソースのURLが正しいか確認
2. ネットワーク接続を確認
3. ビデオフォーマットがサポートされているか確認
4. プラットフォーム固有の権限を確認

### パフォーマンスの問題

1. ビデオの解像度を下げる
2. キャッシングを有効にする
3. プリロードを使用する
4. ハードウェアアクセラレーションを確認

## ベストプラクティス

1. **リソース管理**: 使用後はプレーヤーを適切にクリーンアップ
2. **エラーハンドリング**: ステータス変更イベントでエラーを処理
3. **ユーザー体験**: ローディングインジケーターとエラーメッセージを表示
4. **パフォーマンス**: 適切な解像度とキャッシング戦略を使用
5. **アクセシビリティ**: 字幕とオーディオトラックのオプションを提供

## 関連リソース

- [expo-video GitHub](https://github.com/expo/expo/tree/main/packages/expo-video)
- [Video Thumbnails](./video-thumbnails/)
- [Audio](./audio/)
