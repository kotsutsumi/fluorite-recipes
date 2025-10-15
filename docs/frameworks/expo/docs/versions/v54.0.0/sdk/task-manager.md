# TaskManager

`expo-task-manager`は、バックグラウンドで実行できるタスクのサポートを提供するライブラリです。複数のExpoライブラリで長時間実行されるバックグラウンドタスクを可能にします。

## プラットフォームの互換性

- Android
- iOS
- tvOS

## TaskManagerを使用するライブラリ

以下のライブラリがTaskManagerを使用してバックグラウンドタスクを実装しています:

- Location
- BackgroundTask
- BackgroundFetch
- Notifications

## インストール

```bash
npx expo install expo-task-manager
```

## 主な機能

- 長時間実行されるバックグラウンドタスクの管理
- タスクの登録と登録解除
- タスクのステータス確認
- タスク実行関数の定義

## 使用例

```javascript
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // エラーを処理
    return;
  }
  if (data) {
    const { locations } = data;
    // バックグラウンドの位置情報更新を処理
  }
});
```

## API

### `defineTask(taskName, task)`

バックグラウンドタスクを定義します。

#### パラメータ

- **taskName** (`string`) - タスクの一意の名前
- **task** (`function`) - タスクが実行されたときに呼び出される関数。`data`と`error`を含むオブジェクトを受け取ります

### `getRegisteredTasksAsync()`

登録されているすべてのタスクの配列を返します。

#### 戻り値

`Promise<TaskManagerTask[]>` - 登録されているタスクの配列を解決するPromise

### `isTaskRegisteredAsync(taskName)`

指定されたタスクが登録されているかどうかを確認します。

#### パラメータ

- **taskName** (`string`) - 確認するタスクの名前

#### 戻り値

`Promise<boolean>` - タスクが登録されている場合は`true`、そうでない場合は`false`を解決するPromise

### `unregisterTaskAsync(taskName)`

特定のタスクの登録を解除します。

#### パラメータ

- **taskName** (`string`) - 登録解除するタスクの名前

#### 戻り値

`Promise<void>` - タスクが登録解除されたときに解決するPromise

### `unregisterAllTasksAsync()`

登録されているすべてのタスクを削除します。

#### 戻り値

`Promise<void>` - すべてのタスクが登録解除されたときに解決するPromise

## 設定に関する注意事項

- iOSのスタンドアロンアプリでは追加の設定が必要です
- Expo Goでは完全にサポートされていません
- 開発ビルドの使用が推奨されます

## タスクの実装

TaskManagerを使用するには、タスク定義関数を実装する必要があります。この関数は、タスクが実行されるたびに呼び出されます。

### タスク定義関数

タスク定義関数は、以下のプロパティを持つオブジェクトを受け取ります:

- **data** - タスクに関連するデータ（使用しているライブラリによって異なります）
- **error** - タスクの実行中に発生したエラー

### ベストプラクティス

1. タスク定義関数は軽量に保ち、時間のかかる操作は避けてください
2. エラーを適切に処理し、ログに記録してください
3. タスクが不要になったら登録を解除してください
4. バックグラウンドタスクの実行時間には制限があることに注意してください

## 関連ドキュメント

- [Location](./location/)
- [BackgroundFetch](./background-fetch/)
- [Notifications](./notifications/)
