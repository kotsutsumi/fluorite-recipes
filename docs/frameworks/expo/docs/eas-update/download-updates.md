# アップデートのダウンロード

## アップデートダウンロード戦略

### 1. デフォルトの動作

- アップデートは起動時に非同期でロード
- コールドブート時にアップデートをチェック
- アプリの読み込みをブロックしない
- 新しいアップデートのユーザー採用が遅くなる

### 2. 実行中のアップデートチェック

```javascript
import * as Updates from 'expo-updates';

async function checkForUpdates() {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
}
```

### 3. バックグラウンドでのアップデートチェック

```javascript
import * as BackgroundTask from 'expo-background-task';
import * as Updates from 'expo-updates';

const BACKGROUND_TASK_NAME = 'background-update-check';

const setupBackgroundUpdates = async () => {
  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    return Promise.resolve();
  });

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: 60 * 24, // 24時間ごと
  });
};
```

### 4. アップデート制御方法

- `Updates.setUpdateURLAndRequestHeadersOverride()`でアップデートURLをオーバーライド可能
- 通常はEASダッシュボードまたはCLIでアップデートを制御

### 5. アップデート採用の監視

- Expoはアップデートインストールのメトリクスを提供
- デプロイメントページで特定のアップデートのユーザー採用率を表示

## ベストプラクティス

1. ユーザーエクスペリエンスを考慮してダウンロード戦略を選択
2. バックグラウンドアップデートは慎重に実装
3. ダッシュボードで採用率を監視
