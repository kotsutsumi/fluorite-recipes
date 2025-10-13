# Bugsnagを使用する

ExpoアプリでBugsnagを統合し、安定性監視とエラーレポートを実装する方法を学びます。

## 概要

Bugsnagは、リッチでエンドツーエンドのエラーレポートと分析を提供する安定性監視ソリューションです。

**主な機能**：
- リリースヘルスダッシュボード
- 安定性スコアとターゲット
- Email、Slack、PagerDuty経由のアラート
- 診断データと完全なスタックトレース
- 自動ブレッドクラム

**サポートされるプラットフォーム**：
- 50以上のプラットフォーム（React Native含む）
- Android
- iOS
- Web

## セットアップ

### ステップ1: Bugsnagアカウントの作成

1. [app.bugsnag.com](https://app.bugsnag.com/)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成（React Native）
3. **API Key**を取得

### ステップ2: SDKのインストール

```bash
npx expo install @bugsnag/expo
```

### ステップ3: 設定プラグインの追加

**app.json**:
```json
{
  "expo": {
    "plugins": [
      [
        "@bugsnag/expo",
        {
          "apiKey": "YOUR_API_KEY_HERE"
        }
      ]
    ]
  }
}
```

**環境変数を使用（推奨）**：
```json
{
  "expo": {
    "plugins": [
      [
        "@bugsnag/expo",
        {
          "apiKey": "${BUGSNAG_API_KEY}"
        }
      ]
    ]
  }
}
```

**.env.local**:
```bash
BUGSNAG_API_KEY=your-api-key
```

### ステップ4: 開発ビルドの作成

```bash
# 変更を適用するために開発ビルドを作成
npx expo prebuild

# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 初期化

### 基本的な初期化

```typescript
// app/_layout.tsx
import Bugsnag from '@bugsnag/expo';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    Bugsnag.start({
      apiKey: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY!,
    });
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### 詳細な設定

```typescript
import Bugsnag from '@bugsnag/expo';
import * as Updates from 'expo-updates';

Bugsnag.start({
  apiKey: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY!,

  // アプリバージョン情報
  appVersion: Updates.manifest?.version,
  releaseStage: __DEV__ ? 'development' : 'production',

  // 有効にするリリースステージ
  enabledReleaseStages: ['production', 'staging'],

  // エラーレポートのカスタマイズ
  onError: (event) => {
    // カスタムデータを追加
    event.addMetadata('app', {
      updateId: Updates.updateId,
      channel: Updates.channel,
    });

    return true; // エラーを送信
  },
});
```

## エラー追跡

### エラーの手動通知

```typescript
import Bugsnag from '@bugsnag/expo';

// エラーの通知
try {
  riskyOperation();
} catch (error) {
  Bugsnag.notify(error as Error);
}

// カスタムデータ付きエラー
try {
  await processPayment(amount);
} catch (error) {
  Bugsnag.notify(error as Error, (event) => {
    event.severity = 'error';
    event.addMetadata('payment', {
      amount,
      userId: 'user-123',
      timestamp: new Date().toISOString(),
    });
  });
}
```

### カスタムエラーの作成

```typescript
// カスタムエラークラス
class PaymentError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

// エラーの送信
const error = new PaymentError('Payment failed', 'PAYMENT_001');
Bugsnag.notify(error, (event) => {
  event.addMetadata('error', {
    code: error.code,
  });
});
```

## ユーザーとコンテキスト

### ユーザーの設定

```typescript
import Bugsnag from '@bugsnag/expo';

// ユーザーがサインインした後
Bugsnag.setUser('user-123', 'user@example.com', 'John Doe');

// サインアウト時
Bugsnag.setUser();
```

### カスタムメタデータ

```typescript
// セクション別メタデータ
Bugsnag.addMetadata('account', {
  plan: 'premium',
  signupDate: '2024-01-01',
  lastLogin: new Date().toISOString(),
});

Bugsnag.addMetadata('feature', {
  name: 'checkout',
  version: '2.0',
});

// メタデータのクリア
Bugsnag.clearMetadata('account');
```

### ブレッドクラムの追加

```typescript
// ユーザーアクションの記録
Bugsnag.leaveBreadcrumb('Button clicked', {
  buttonName: 'checkout',
  screen: 'product-details',
});

Bugsnag.leaveBreadcrumb('API request', {
  url: '/api/products',
  method: 'GET',
  status: 200,
});

// ナビゲーション
Bugsnag.leaveBreadcrumb('Navigation', {
  from: 'home',
  to: 'profile',
});
```

## エラー境界

### React Error Boundaryの統合

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';
import Bugsnag from '@bugsnag/expo';

const BugsnagErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  return (
    <BugsnagErrorBoundary
      FallbackComponent={({ error, clearError }) => (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ marginBottom: 20 }}>
            {error.message}
          </Text>
          <Button title="Try Again" onPress={clearError} />
        </View>
      )}
    >
      {children}
    </BugsnagErrorBoundary>
  );
}

// app/_layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      {/* アプリコンテンツ */}
    </ErrorBoundary>
  );
}
```

## EAS Updatesとの統合

### ソースマップのアップロード

**eas.json**:
```json
{
  "build": {
    "production": {
      "env": {
        "BUGSNAG_API_KEY": "@BUGSNAG_API_KEY"
      }
    }
  }
}
```

**EAS Secretsに保存**：
```bash
eas secret:create --scope project --name BUGSNAG_API_KEY --value "your-api-key"
```

### app.jsonでの設定

```json
{
  "expo": {
    "plugins": [
      [
        "@bugsnag/expo",
        {
          "apiKey": "${BUGSNAG_API_KEY}"
        }
      ]
    ],
    "hooks": {
      "postPublish": [
        {
          "file": "@bugsnag/expo/hooks/post-publish.js",
          "config": {
            "apiKey": "${BUGSNAG_API_KEY}"
          }
        }
      ]
    }
  }
}
```

## セッション追跡

### 自動セッション追跡

```typescript
// デフォルトで有効
Bugsnag.start({
  apiKey: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY!,
  // 自動セッション追跡を有効化（デフォルト: true）
  autoTrackSessions: true,
});
```

### 手動セッション管理

```typescript
// セッション開始
Bugsnag.startSession();

// セッション一時停止
Bugsnag.pauseSession();

// セッション再開
Bugsnag.resumeSession();
```

## フィーチャーフラグ

### フィーチャーフラグの追加

```typescript
import Bugsnag from '@bugsnag/expo';

// フィーチャーフラグを追加
Bugsnag.addFeatureFlag('new_checkout', 'variant_a');
Bugsnag.addFeatureFlag('dark_mode', 'enabled');

// 複数のフラグを追加
Bugsnag.addFeatureFlags([
  { name: 'payment_v2', variant: 'enabled' },
  { name: 'analytics', variant: 'test' },
]);

// フィーチャーフラグをクリア
Bugsnag.clearFeatureFlag('new_checkout');
Bugsnag.clearFeatureFlags();
```

## エラーのフィルタリング

### onErrorコールバック

```typescript
Bugsnag.start({
  apiKey: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY!,
  onError: (event) => {
    // 機密情報を削除
    event.clearMetadata('user', 'password');

    // 特定のエラーを無視
    if (event.errors[0].errorClass === 'NetworkError') {
      return false; // エラーを送信しない
    }

    // エラーの重要度を調整
    if (event.errors[0].errorMessage?.includes('Warning')) {
      event.severity = 'warning';
    }

    return true; // エラーを送信
  },
});
```

## ベストプラクティス

### 1. 環境別の設定

```typescript
import Bugsnag from '@bugsnag/expo';
import Constants from 'expo-constants';

Bugsnag.start({
  apiKey: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY!,
  releaseStage: __DEV__ ? 'development' : Constants.manifest?.releaseChannel || 'production',
  enabledReleaseStages: ['production', 'staging'],
  // 開発環境ではエラーを送信しない
  enabledBreadcrumbTypes: __DEV__ ? [] : ['navigation', 'request', 'log', 'user', 'state'],
});
```

### 2. エラーの優先順位付け

```typescript
Bugsnag.notify(error, (event) => {
  // 重要度に基づいてセベリティを設定
  if (isPaymentError(error)) {
    event.severity = 'error';
    event.addMetadata('priority', { level: 'high' });
  } else if (isUIError(error)) {
    event.severity = 'warning';
    event.addMetadata('priority', { level: 'low' });
  }
});
```

### 3. コンテキストの追加

```typescript
// グローバルコンテキスト
Bugsnag.addMetadata('app', {
  environment: __DEV__ ? 'development' : 'production',
  version: Constants.expoConfig?.version,
  buildNumber: Constants.expoConfig?.ios?.buildNumber,
});

// ユーザーアクションごと
const handleCheckout = async () => {
  Bugsnag.leaveBreadcrumb('Checkout started', {
    cartTotal: calculateTotal(),
    itemCount: cart.length,
  });

  try {
    await processCheckout();
    Bugsnag.leaveBreadcrumb('Checkout completed');
  } catch (error) {
    Bugsnag.notify(error as Error, (event) => {
      event.addMetadata('checkout', {
        cartTotal: calculateTotal(),
        paymentMethod: selectedMethod,
      });
    });
  }
};
```

## トラブルシューティング

### 問題1: エラーが表示されない

**原因**: API Keyが正しく設定されていない

**解決策**：
```typescript
// API Keyを確認
console.log('Bugsnag API Key:', process.env.EXPO_PUBLIC_BUGSNAG_API_KEY);

// テストエラーを送信
Bugsnag.notify(new Error('Test error'));
```

### 問題2: ソースマップが機能しない

**原因**: ソースマップがアップロードされていない

**解決策**：
- app.jsonのhooksセクションを確認
- EAS Updateを使用してソースマップを自動アップロード

### 問題3: 開発環境でエラーが送信される

**原因**: releaseStage設定が正しくない

**解決策**：
```typescript
Bugsnag.start({
  apiKey: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY!,
  releaseStage: __DEV__ ? 'development' : 'production',
  enabledReleaseStages: ['production', 'staging'],
});
```

## まとめ

Bugsnagは、以下の安定性監視機能を提供します：

### 主な機能
- **エラーレポート**: リッチな診断データと完全なスタックトレース
- **安定性監視**: リリースヘルスダッシュボードとスコア
- **アラート**: Email、Slack、PagerDuty経由の通知
- **自動ブレッドクラム**: ユーザーアクションの自動記録

### 統合ステップ
1. Bugsnagアカウントの作成とAPI Key取得
2. `@bugsnag/expo`のインストール
3. app.jsonでの設定
4. 初期化とエラー追跡の実装

### ベストプラクティス
- 環境別の設定
- エラーの優先順位付け
- 詳細なコンテキストの追加
- セッション追跡の活用

これらのパターンを活用して、アプリの安定性を監視し、バグを迅速に特定・修正できます。
