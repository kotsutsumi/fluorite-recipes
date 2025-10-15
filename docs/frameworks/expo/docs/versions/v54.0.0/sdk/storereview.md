# StoreReview

AndroidおよびiOSでアプリ内レビューを実現するネイティブAPIを提供するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-store-review
```

## 概要

`expo-store-review`は、ユーザーがアプリを離れることなくアプリの評価をリクエストできるネイティブAPIを提供します。Android 5以降とiOSをサポートしています。

## プラットフォームサポート

- Android（5.0以降）
- iOS

## 使用ガイドライン

### ベストプラクティス

✅ **すべきこと**:
- 自然なタイミングでレビューをリクエスト
- ポジティブな体験の後にリクエスト
- ユーザーが満足していそうなタイミングを選ぶ

❌ **すべきでないこと**:
- ボタンからレビューをリクエストしない
- ユーザーにスパムのように繰り返さない
- 時間的制約のあるユーザー操作を中断しない
- レビューリクエストの前後に質問しない

## API リファレンス

### hasAction()

レビューリクエストが可能かどうかを確認します。

```javascript
import * as StoreReview from 'expo-store-review';

const canReview = await StoreReview.hasAction();
console.log('レビュー可能:', canReview);
```

**戻り値**: `Promise<boolean>` - レビューアクションが利用可能な場合は`true`

### isAvailableAsync()

プラットフォームのレビュー機能が利用可能かどうかを判定します。

```javascript
const isAvailable = await StoreReview.isAvailableAsync();
```

**戻り値**: `Promise<boolean>` - レビュー機能が利用可能な場合は`true`

### requestReview()

ネイティブレビューモーダルを開きます。

```javascript
await StoreReview.requestReview();
```

**戻り値**: `Promise<void>` - 完了時にresolveされる

**注意**: 古いバージョンのAndroidでは、ストアページへのフォールバックが行われます。

### storeUrl()

現在のプラットフォームのアプリストアURLを取得します。

```javascript
const url = StoreReview.storeUrl();
console.log('ストアURL:', url);
```

**戻り値**: `string | null` - アプリストアのURL

## 使用例

### 基本的な実装

```javascript
import * as StoreReview from 'expo-store-review';
import { Button, View } from 'react-native';

export default function App() {
  const handleRequestReview = async () => {
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    }
  };

  // 注意: 実際にはボタンから呼び出すべきではありません
  // これは単なる例です
  return (
    <View>
      <Button title="レビュー（デモ用）" onPress={handleRequestReview} />
    </View>
  );
}
```

### 適切なタイミングでのリクエスト

```javascript
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_PROMPT_KEY = 'review_prompt_count';
const REVIEW_THRESHOLD = 5; // 5回の使用後

async function checkAndRequestReview() {
  try {
    // 使用回数を取得
    const countStr = await AsyncStorage.getItem(REVIEW_PROMPT_KEY);
    const count = countStr ? parseInt(countStr, 10) : 0;

    // カウントを増やす
    await AsyncStorage.setItem(REVIEW_PROMPT_KEY, (count + 1).toString());

    // 閾値に達したらレビューをリクエスト
    if (count === REVIEW_THRESHOLD) {
      const hasAction = await StoreReview.hasAction();
      if (hasAction) {
        await StoreReview.requestReview();
      }
    }
  } catch (error) {
    console.error('レビューリクエストエラー:', error);
  }
}

// アプリの重要なアクション完了時に呼び出す
export function onTaskCompleted() {
  checkAndRequestReview();
}
```

### 条件付きレビューリクエスト

```javascript
import * as StoreReview from 'expo-store-review';

async function requestReviewIfAppropriate() {
  // レビュー機能が利用可能か確認
  const isAvailable = await StoreReview.isAvailableAsync();

  if (!isAvailable) {
    console.log('レビュー機能は利用できません');
    return;
  }

  // アクションが実行可能か確認
  const hasAction = await StoreReview.hasAction();

  if (hasAction) {
    // ユーザーが最近レビューをリクエストされていないか確認
    const lastReviewDate = await getLastReviewRequestDate();
    const daysSinceLastRequest = getDaysSince(lastReviewDate);

    if (daysSinceLastRequest > 30) {
      await StoreReview.requestReview();
      await setLastReviewRequestDate(new Date());
    }
  }
}
```

## プラットフォーム固有のレビュー誘導

### Android（Google Play）

直接レビューページにリダイレクトする場合:

```javascript
import { Linking } from 'react-native';

const androidPackageName = 'com.example.app'; // app.jsonから取得

Linking.openURL(
  `https://play.google.com/store/apps/details?id=${androidPackageName}&showAllReviews=true`
);
```

### iOS（App Store）

直接レビューページにリダイレクトする場合:

```javascript
import { Linking } from 'react-native';

const itunesItemId = '1234567890'; // app.jsonから取得

Linking.openURL(
  `https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`
);
```

### クロスプラットフォームの実装

```javascript
import * as StoreReview from 'expo-store-review';
import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';

async function openStoreReview() {
  // ネイティブレビューを試みる
  const hasAction = await StoreReview.hasAction();

  if (hasAction) {
    await StoreReview.requestReview();
  } else {
    // フォールバック: ストアページを開く
    const storeUrl = StoreReview.storeUrl();
    if (storeUrl) {
      await Linking.openURL(storeUrl);
    }
  }
}
```

## エラーハンドリング

### ERR_STORE_REVIEW_FAILED

レビューリクエストが失敗したことを示します。

```javascript
import * as StoreReview from 'expo-store-review';

try {
  await StoreReview.requestReview();
} catch (error) {
  if (error.code === 'ERR_STORE_REVIEW_FAILED') {
    console.log('レビューリクエストに失敗しました');
    // フォールバック処理
    const url = StoreReview.storeUrl();
    if (url) {
      await Linking.openURL(url);
    }
  }
}
```

## ベストプラクティス

### 1. 適切なタイミング

```javascript
// 良い例: タスク完了後
async function onTaskCompleted() {
  // ユーザーが何かを達成した直後
  await checkAndMaybeRequestReview();
}

// 悪い例: アプリ起動時
async function onAppLaunch() {
  // これは避ける
  await StoreReview.requestReview();
}
```

### 2. 頻度制限

```javascript
const MIN_DAYS_BETWEEN_PROMPTS = 30;
const MIN_APP_LAUNCHES = 5;

async function shouldShowReviewPrompt() {
  const launches = await getAppLaunchCount();
  const lastPrompt = await getLastReviewPromptDate();
  const daysSince = getDaysSince(lastPrompt);

  return launches >= MIN_APP_LAUNCHES &&
         daysSince >= MIN_DAYS_BETWEEN_PROMPTS;
}
```

### 3. ユーザー体験を優先

```javascript
// ポジティブな体験の後にリクエスト
async function onPositiveEvent() {
  // 例: ゲームのレベルクリア、目標達成など
  if (await shouldShowReviewPrompt()) {
    await StoreReview.requestReview();
  }
}
```

## 注意事項

1. **システム制限**: iOSはアプリごとに年3回までレビューダイアログを表示する制限があります

2. **ユーザーコントロール**: ユーザーはシステム設定でレビュープロンプトを無効にできます

3. **保証なし**: `requestReview()`を呼び出しても、必ずダイアログが表示されるとは限りません

4. **テスト**: 開発中は実際のレビューは送信されません

5. **ガイドライン遵守**: Apple App StoreとGoogle Playのレビューガイドラインに従ってください

## トラブルシューティング

### レビューダイアログが表示されない

- システムがリクエストを制限している可能性があります
- ユーザーがレビュープロンプトを無効にしている可能性があります
- 年間の表示制限に達している可能性があります（iOS）

### 本番環境でのみテスト

- 開発ビルドでは実際のレビューダイアログが表示されないことがあります
- 実機の本番ビルドでテストしてください

### フォールバックの実装

```javascript
async function safeRequestReview() {
  try {
    const hasAction = await StoreReview.hasAction();
    if (hasAction) {
      await StoreReview.requestReview();
    } else {
      // フォールバック: ストアを開く
      const url = StoreReview.storeUrl();
      if (url) {
        await Linking.openURL(url);
      }
    }
  } catch (error) {
    console.error('レビューリクエストエラー:', error);
    // サイレントに失敗（ユーザー体験を損なわない）
  }
}
```
