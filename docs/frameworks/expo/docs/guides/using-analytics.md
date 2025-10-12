# Expoでアナリティクスを使用する

Expoアプリでアナリティクスサービスを統合する方法を学びます。

## 概要

アナリティクスサービスは、モバイルアプリでのユーザーインタラクションを追跡し、アプリ改善戦略のための洞察を提供します。

**主な利点**：
- ユーザー行動の理解
- 機能使用状況の追跡
- パフォーマンスメトリクスの監視
- データ駆動型の意思決定

## サポートされているアナリティクスサービス

### 開発ビルドが必要なサービス

以下のサービスは、カスタムネイティブコードの設定が必要です：

1. **Google Firebase Analytics**
   - 包括的なアプリ分析
   - ユーザーセグメンテーション
   - イベント追跡
   - コンバージョントラッキング

2. **Segment**
   - 複数のアナリティクスツールへのデータ配信
   - 統一されたAPIインターフェース
   - リアルタイムデータ同期

3. **Amplitude**
   - プロダクト分析プラットフォーム
   - ユーザー行動分析
   - リテンションレポート
   - コホート分析

4. **AWS Amplify**
   - AWSサービスとの統合
   - 包括的な分析機能
   - カスタムイベント追跡

5. **Vexo**
   - モバイルアプリ分析
   - ユーザーセッション追跡

### Expo Goで動作するサービス

以下のサービスは、Expo Goアプリで直接使用できます：

6. **Aptabase**
   - プライバシー重視の分析
   - シンプルな統合
   - Expo Go互換

7. **Astrolytics**
   - 軽量な分析ソリューション
   - Expo Go互換

8. **PostHog**
   - オープンソースのプロダクト分析
   - セッションリプレイ
   - 機能フラグ
   - Expo Go互換

## 重要な制限事項

**Expo Goの制限**：
```
ほとんどのアナリティクスSDKは、カスタムネイティブコードの設定が必要です。
Expo Goではネイティブコードを設定できないため、
アナリティクスサービスを使用するには開発ビルドを作成することを推奨します。
```

**解決策**：
- 開発ビルドの作成
- EAS Buildの使用
- カスタムネイティブモジュールの統合

## 開発ビルドのセットアップ

### ステップ1: 開発ビルドの作成

```bash
# EAS Buildを使用
npx eas build --profile development --platform ios
npx eas build --profile development --platform android

# またはローカルビルド
npx expo run:ios
npx expo run:android
```

### ステップ2: アナリティクスSDKのインストール

**Firebase Analytics の例**：
```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

**Segment の例**：
```bash
npx expo install @segment/analytics-react-native
```

**Amplitude の例**：
```bash
npx expo install @amplitude/analytics-react-native
```

## 実装例

### 例1: Firebase Analytics

```typescript
// app/_layout.tsx
import analytics from '@react-native-firebase/analytics';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // 画面追跡
    analytics().logScreenView({
      screen_name: 'Home',
      screen_class: 'HomeScreen',
    });
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

**イベント追跡**：
```typescript
import analytics from '@react-native-firebase/analytics';

// カスタムイベント
const trackButtonPress = async () => {
  await analytics().logEvent('button_pressed', {
    button_name: 'signup',
    screen: 'home',
    timestamp: Date.now(),
  });
};

// コンバージョントラッキング
const trackPurchase = async (item: string, price: number) => {
  await analytics().logEvent('purchase', {
    item_name: item,
    price: price,
    currency: 'USD',
  });
};
```

### 例2: Aptabase（Expo Go互換）

```bash
# インストール
npx expo install @aptabase/react-native
```

```typescript
// app/_layout.tsx
import { init, trackEvent } from '@aptabase/react-native';

export default function RootLayout() {
  useEffect(() => {
    // Aptabaseを初期化
    init('<YOUR_APP_KEY>');
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

**イベント追跡**：
```typescript
import { trackEvent } from '@aptabase/react-native';

// シンプルなイベント
trackEvent('app_started');

// プロパティ付きイベント
trackEvent('button_clicked', {
  button_id: 'signup',
  screen: 'home',
});
```

### 例3: PostHog（Expo Go互換）

```bash
# インストール
npx expo install posthog-react-native expo-file-system expo-application expo-device expo-localization
```

```typescript
// app/_layout.tsx
import PostHog from 'posthog-react-native';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    const posthog = new PostHog(
      '<YOUR_API_KEY>',
      {
        host: 'https://app.posthog.com', // または自己ホストインスタンス
      }
    );

    // イベント追跡
    posthog.capture('app_opened');

    return () => {
      posthog.shutdown();
    };
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

**高度な機能**：
```typescript
import PostHog from 'posthog-react-native';

const posthog = new PostHog('<YOUR_API_KEY>');

// ユーザー識別
posthog.identify('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
});

// セッションリプレイ
posthog.startSessionRecording();

// 機能フラグ
const isFeatureEnabled = await posthog.isFeatureEnabled('new-feature');

if (isFeatureEnabled) {
  // 新機能を表示
}
```

## プラットフォーム固有の考慮事項

### iOS設定

**Info.plist設定**（Firebase等）：
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.yourapp.analytics</string>
    </array>
  </dict>
</array>
```

### Android設定

**AndroidManifest.xml設定**：
```xml
<application>
  <meta-data
    android:name="com.google.android.gms.analytics.globalConfigResource"
    android:resource="@xml/global_tracker" />
</application>
```

## サービス選択ガイド

### Firebase Analytics
**適している場合**：
- 包括的なGoogleエコシステム統合が必要
- 高度なセグメンテーションが必要
- 無料で大規模なスケーラビリティが必要

**制限事項**：
- 開発ビルドが必要
- Googleサービスへの依存

### Aptabase
**適している場合**：
- プライバシー重視
- Expo Goでのテストが必要
- シンプルな統合を求める

**制限事項**：
- 機能がより基本的
- エコシステムが小さい

### PostHog
**適している場合**：
- オープンソースソリューションを好む
- セッションリプレイが必要
- 機能フラグが必要
- Expo Goでのテストが必要

**制限事項**：
- 自己ホスティングには追加のセットアップが必要

### Segment
**適している場合**：
- 複数のアナリティクスツールを使用
- 統一されたデータパイプラインが必要
- 柔軟性が重要

**制限事項**：
- 開発ビルドが必要
- 追加コストの可能性

## ベストプラクティス

### 1. イベント命名規則

```typescript
// ✅ 推奨: 明確で一貫した命名
trackEvent('button_clicked', {
  button_id: 'signup',
  screen: 'home',
  action: 'submit',
});

// ❌ 非推奨: 曖昧な命名
trackEvent('click', {
  b: 'signup',
});
```

### 2. 個人情報の保護

```typescript
// ✅ 推奨: 個人情報を除外
trackEvent('user_registered', {
  user_id: hashedUserId,
  plan: 'premium',
  // email, name等は含めない
});

// ❌ 非推奨: 個人情報を含める
trackEvent('user_registered', {
  email: 'user@example.com', // プライバシー違反
  name: 'John Doe',
});
```

### 3. エラーハンドリング

```typescript
const trackEventSafely = async (eventName: string, properties?: object) => {
  try {
    await analytics().logEvent(eventName, properties);
  } catch (error) {
    console.error('Analytics tracking failed:', error);
    // エラーを静かに処理、アプリをクラッシュさせない
  }
};
```

### 4. パフォーマンスの最適化

```typescript
// イベントのバッチ処理
const eventQueue: Array<{ name: string; properties: object }> = [];

const queueEvent = (name: string, properties: object) => {
  eventQueue.push({ name, properties });

  if (eventQueue.length >= 10) {
    flushEvents();
  }
};

const flushEvents = async () => {
  const events = [...eventQueue];
  eventQueue.length = 0;

  for (const event of events) {
    await analytics().logEvent(event.name, event.properties);
  }
};
```

## トラブルシューティング

### 問題1: イベントが記録されない

**原因**: SDKの初期化が不完全

**解決策**：
```typescript
useEffect(() => {
  const initAnalytics = async () => {
    await analytics().setAnalyticsCollectionEnabled(true);
    console.log('Analytics initialized');
  };

  initAnalytics();
}, []);
```

### 問題2: Expo Goでの制限

**原因**: ネイティブコードが必要なSDK

**解決策**：
- Expo Go互換サービスを使用（Aptabase、PostHog）
- 開発ビルドを作成

### 問題3: データの遅延

**原因**: バッチ処理とネットワーク遅延

**解決策**：
- リアルタイム追跡には適切なサービスを選択
- デバッグモードで即時送信を有効化

## まとめ

Expoでのアナリティクス統合は、以下の要素を提供します：

### サービスオプション
- **開発ビルド必須**: Firebase Analytics、Segment、Amplitude、AWS Amplify、Vexo
- **Expo Go互換**: Aptabase、Astrolytics、PostHog

### 主な考慮事項
- ネイティブコード要件の理解
- 適切なサービスの選択
- プライバシーとコンプライアンスの遵守
- パフォーマンスの最適化

### ベストプラクティス
- 明確なイベント命名規則
- 個人情報の保護
- エラーハンドリング
- イベントのバッチ処理

適切なアナリティクスサービスを選択し、ベストプラクティスに従うことで、ユーザー行動の深い洞察を得て、データ駆動型の意思決定を行うことができます。
