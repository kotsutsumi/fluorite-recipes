# VideoThumbnails

`expo-video-thumbnails`は、ビデオファイルから画像サムネイルを生成するためのライブラリです。

## プラットフォームの互換性

- Android
- iOS
- tvOS

## インストール

```bash
npx expo install expo-video-thumbnails
```

## 基本的な使用方法

```javascript
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';

export default function App() {
  const [image, setImage] = useState(null);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        {
          time: 15000,
        }
      );
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={generateThumbnail} title="サムネイルを生成" />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
```

## API

### `getThumbnailAsync(sourceFilename, options)`

ビデオファイルからサムネイル画像を生成します。

#### パラメータ

##### `sourceFilename` (必須)

- **型**: `string`
- **説明**: ビデオファイルのURI（ローカルまたはリモート）

```javascript
// リモートURL
await VideoThumbnails.getThumbnailAsync(
  'https://example.com/video.mp4'
);

// ローカルファイル
await VideoThumbnails.getThumbnailAsync(
  'file:///path/to/video.mp4'
);
```

##### `options` (オプション)

サムネイル生成のオプション設定。

#### Options

##### `time`

- **型**: `number`
- **デフォルト**: `0`
- **説明**: サムネイルを生成する位置（ミリ秒）

```javascript
await VideoThumbnails.getThumbnailAsync(sourceFilename, {
  time: 15000, // 15秒の位置
});
```

##### `quality`

- **型**: `number`
- **範囲**: `0.0` - `1.0`
- **デフォルト**: `1.0`
- **説明**: 画像の品質（1.0が最高品質）

```javascript
await VideoThumbnails.getThumbnailAsync(sourceFilename, {
  quality: 0.8, // 80%の品質
});
```

##### `headers`

- **型**: `object`
- **説明**: ネットワークリクエスト用のヘッダー（リモートビデオの場合）

```javascript
await VideoThumbnails.getThumbnailAsync(sourceFilename, {
  headers: {
    'Authorization': 'Bearer token',
  },
});
```

#### 戻り値

`Promise<ThumbnailResult>` - サムネイル情報を含むオブジェクトを解決するPromise

##### ThumbnailResult

- **uri** (`string`) - 生成されたサムネイル画像のURI
- **width** (`number`) - 画像の幅（ピクセル）
- **height** (`number`) - 画像の高さ（ピクセル）

```javascript
const { uri, width, height } = await VideoThumbnails.getThumbnailAsync(
  sourceFilename,
  { time: 5000 }
);

console.log('サムネイルURI:', uri);
console.log('サイズ:', width, 'x', height);
```

## 使用例

### 特定の時間のサムネイル

```javascript
const generateThumbnailAtTime = async (videoUri, timeInSeconds) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: timeInSeconds * 1000, // 秒をミリ秒に変換
      }
    );
    return uri;
  } catch (error) {
    console.error('サムネイル生成エラー:', error);
    return null;
  }
};

// 使用例
const thumbnailUri = await generateThumbnailAtTime(
  'https://example.com/video.mp4',
  30 // 30秒の位置
);
```

### 複数のサムネイルを生成

```javascript
const generateMultipleThumbnails = async (videoUri, times) => {
  const thumbnails = await Promise.all(
    times.map(async (time) => {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        videoUri,
        { time: time * 1000 }
      );
      return { time, uri };
    })
  );
  return thumbnails;
};

// 使用例
const thumbnails = await generateMultipleThumbnails(
  'https://example.com/video.mp4',
  [0, 10, 20, 30] // 0秒、10秒、20秒、30秒
);
```

### カスタム品質のサムネイル

```javascript
const generateLowQualityThumbnail = async (videoUri) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: 0,
        quality: 0.5, // 低品質（ファイルサイズを小さくする）
      }
    );
    return uri;
  } catch (error) {
    console.error('エラー:', error);
    return null;
  }
};
```

### 認証が必要なビデオ

```javascript
const generateThumbnailWithAuth = async (videoUri, authToken) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      {
        time: 5000,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    return uri;
  } catch (error) {
    console.error('認証エラー:', error);
    return null;
  }
};
```

### サムネイルギャラリー

```javascript
import { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

export default function ThumbnailGallery({ videoUri }) {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    generateThumbnails();
  }, [videoUri]);

  const generateThumbnails = async () => {
    const times = [0, 5, 10, 15, 20]; // 5秒間隔
    const results = await Promise.all(
      times.map(async (time) => {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          videoUri,
          { time: time * 1000 }
        );
        return { id: time.toString(), uri };
      })
    );
    setThumbnails(results);
  };

  return (
    <FlatList
      data={thumbnails}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
});
```

## エラーハンドリング

```javascript
const generateThumbnailWithErrorHandling = async (videoUri) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(
      videoUri,
      { time: 5000 }
    );
    return { success: true, uri };
  } catch (error) {
    console.error('サムネイル生成エラー:', error);

    if (error.message.includes('not found')) {
      return { success: false, error: 'ビデオファイルが見つかりません' };
    } else if (error.message.includes('format')) {
      return { success: false, error: 'サポートされていないビデオフォーマット' };
    } else {
      return { success: false, error: 'サムネイル生成に失敗しました' };
    }
  }
};
```

## パフォーマンスの考慮事項

### キャッシング

生成されたサムネイルをキャッシュして、再生成を避けます。

```javascript
const thumbnailCache = new Map();

const getCachedThumbnail = async (videoUri, time) => {
  const cacheKey = `${videoUri}-${time}`;

  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey);
  }

  const { uri } = await VideoThumbnails.getThumbnailAsync(
    videoUri,
    { time }
  );

  thumbnailCache.set(cacheKey, uri);
  return uri;
};
```

### バッチ処理

複数のサムネイルを生成する場合は、適切に間隔を空けて実行します。

```javascript
const generateThumbnailsBatch = async (videoUri, times) => {
  const batchSize = 3;
  const results = [];

  for (let i = 0; i < times.length; i += batchSize) {
    const batch = times.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((time) =>
        VideoThumbnails.getThumbnailAsync(videoUri, { time: time * 1000 })
      )
    );
    results.push(...batchResults);
  }

  return results;
};
```

## ベストプラクティス

1. **適切な時間を選択**: ビデオの重要なシーンでサムネイルを生成
2. **品質の調整**: ファイルサイズとパフォーマンスのバランスを取る
3. **エラーハンドリング**: ネットワークエラーやフォーマットエラーを適切に処理
4. **キャッシング**: 同じサムネイルを再生成しない
5. **メモリ管理**: 大量のサムネイルを生成する場合は注意

## 制限事項

- サムネイル生成はビデオのデコードが必要なため、時間がかかる場合があります
- 非常に大きなビデオファイルではメモリ使用量が増加する可能性があります
- すべてのビデオフォーマットがサポートされているわけではありません

## トラブルシューティング

### サムネイルが生成されない

1. ビデオファイルが存在し、アクセス可能か確認
2. ビデオフォーマットがサポートされているか確認
3. 指定した時間がビデオの長さ内にあるか確認

### 品質が低い

1. `quality`オプションを増やす（最大1.0）
2. より高品質なソースビデオを使用

## 関連リソース

- [Video (expo-video)](./video/)
- [Video (expo-av)](./video-av/)
- [ImageManipulator](./imagemanipulator/)
