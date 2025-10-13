# LogRocketを使用する

ExpoアプリでLogRocketを統合し、セッション記録とエラー監視を実装する方法を学びます。

## 概要

LogRocketは、モバイルアプリ向けのセッション記録とエラー監視ツールです。

**主な機能**：
- ユーザーセッションの記録と再生
- バグの特定と診断
- セッションデータのフィルタリング
- パフォーマンスモニタリング
- ユーザー行動の分析

**重要**: LogRocketは開発ビルドまたは本番ビルドが必要です。Expo Goでは動作しません。

## セットアップ

### ステップ1: LogRocketアカウントの作成

1. [LogRocket](https://logrocket.com/)にサインアップ
2. 新しいアプリケーションを作成
3. **App ID**を取得

### ステップ2: SDKのインストール

```bash
npx expo install @logrocket/react-native expo-build-properties
```

**インストールされるパッケージ**：
- `@logrocket/react-native`: LogRocket SDK
- `expo-build-properties`: ビルド設定の調整に必要

### ステップ3: app.jsonの設定

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 25
          }
        }
      ],
      "@logrocket/react-native"
    ]
  }
}
```

**重要**: Android SDKの最小バージョンは25以上が必要です。

## 初期化

### 基本的な初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import LogRocket from '@logrocket/react-native';
import * as Updates from 'expo-updates';

export default function RootLayout() {
  useEffect(() => {
    LogRocket.init('<Your App ID>', {
      // Expo Update IDを含める（オプション）
      updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
      expoChannel: Updates.channel,
    });
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

**App IDの取得**：
LogRocketダッシュボードの**Settings** → **Setup** → **App ID**

### 環境変数を使用

**.env.local**:
```bash
EXPO_PUBLIC_LOGROCKET_APP_ID=your-app-id
```

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import LogRocket from '@logrocket/react-native';

export default function RootLayout() {
  useEffect(() => {
    const appId = process.env.EXPO_PUBLIC_LOGROCKET_APP_ID;

    if (appId) {
      LogRocket.init(appId);
    } else {
      console.warn('LogRocket App ID is not set');
    }
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

## ユーザー識別

### ユーザーの識別

```typescript
import LogRocket from '@logrocket/react-native';

// ユーザーがサインインした後
const identifyUser = (user: any) => {
  LogRocket.identify(user.id, {
    name: user.name,
    email: user.email,
    subscriptionType: user.subscriptionType,
  });
};

// 使用例
export default function LoginScreen() {
  const handleLogin = async (email: string, password: string) => {
    const user = await signIn(email, password);

    // LogRocketにユーザーを識別
    identifyUser(user);
  };

  return (
    // ログイン画面
  );
}
```

### カスタムメタデータ

```typescript
// セッションにメタデータを追加
LogRocket.identify('user-123', {
  // 基本情報
  name: 'John Doe',
  email: 'john@example.com',

  // カスタムプロパティ
  plan: 'premium',
  signupDate: '2024-01-01',
  referralSource: 'google',

  // アプリ固有の情報
  favoriteFeature: 'analytics',
  lastLogin: new Date().toISOString(),
});
```

## カスタムイベントの追跡

### イベントのログ

```typescript
import LogRocket from '@logrocket/react-native';

// シンプルなイベント
LogRocket.track('Button Clicked');

// プロパティ付きイベント
LogRocket.track('Purchase Completed', {
  productId: 'prod-123',
  price: 99.99,
  currency: 'USD',
  category: 'electronics',
});

// ユーザーアクション
LogRocket.track('Feature Used', {
  featureName: 'image-filter',
  filterType: 'vintage',
  timestamp: new Date().toISOString(),
});
```

### 画面追跡

```typescript
// hooks/useScreenTracking.ts
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import LogRocket from '@logrocket/react-native';

export function useScreenTracking() {
  const pathname = usePathname();

  useEffect(() => {
    LogRocket.track('Screen View', {
      screenName: pathname,
      timestamp: new Date().toISOString(),
    });
  }, [pathname]);
}

// 使用例
export default function HomeScreen() {
  useScreenTracking();

  return (
    // 画面コンテンツ
  );
}
```

## エラー追跡

### エラーの手動ログ

```typescript
import LogRocket from '@logrocket/react-native';

// エラーをキャプチャ
const handleError = (error: Error) => {
  LogRocket.captureException(error, {
    extra: {
      context: 'Payment processing',
      userId: 'user-123',
      timestamp: new Date().toISOString(),
    },
  });
};

// 使用例
try {
  await processPayment();
} catch (error) {
  handleError(error as Error);
  Alert.alert('Error', 'Payment failed');
}
```

### グローバルエラーハンドラー

```typescript
// lib/error-handler.ts
import LogRocket from '@logrocket/react-native';

export function setupErrorHandler() {
  // 未処理のエラーをキャプチャ
  const originalHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    LogRocket.captureException(error, {
      extra: {
        isFatal,
        timestamp: new Date().toISOString(),
      },
    });

    // 元のハンドラーを呼び出す
    originalHandler(error, isFatal);
  });
}

// app/_layout.tsxで初期化
import { setupErrorHandler } from '@/lib/error-handler';

export default function RootLayout() {
  useEffect(() => {
    setupErrorHandler();
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

## ネットワークリクエストの追跡

### Fetch APIのインターセプト

```typescript
// lib/api.ts
import LogRocket from '@logrocket/react-native';

const originalFetch = global.fetch;

global.fetch = async (...args) => {
  const startTime = Date.now();
  const [url, options] = args;

  try {
    const response = await originalFetch(...args);
    const duration = Date.now() - startTime;

    // 成功したリクエストをログ
    LogRocket.track('API Request', {
      url,
      method: options?.method || 'GET',
      status: response.status,
      duration,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    // 失敗したリクエストをログ
    LogRocket.track('API Request Failed', {
      url,
      method: options?.method || 'GET',
      duration,
      error: (error as Error).message,
    });

    throw error;
  }
};
```

## Expo Dashboardとの統合

### LogRocketアカウントの接続

1. [Expo Dashboard](https://expo.dev/)にログイン
2. プロジェクトを選択
3. **Settings** → **Integrations**
4. **LogRocket**を選択して接続
5. LogRocketアカウントを認証

### EAS Dashboardでセッションを表示

統合後、EAS Dashboardで直接セッションを表示できます：

- **Updates** → 特定のアップデートを選択
- **Sessions**タブでLogRocketセッションを確認

## パフォーマンスモニタリング

### カスタムタイミング

```typescript
import LogRocket from '@logrocket/react-native';

// パフォーマンス測定
const measurePerformance = async () => {
  const startTime = Date.now();

  try {
    await heavyOperation();
    const duration = Date.now() - startTime;

    LogRocket.track('Performance Metric', {
      operation: 'heavy-operation',
      duration,
      status: 'success',
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    LogRocket.track('Performance Metric', {
      operation: 'heavy-operation',
      duration,
      status: 'failed',
      error: (error as Error).message,
    });
  }
};
```

## プライバシーとセキュリティ

### 機密データのサニタイズ

```typescript
import LogRocket from '@logrocket/react-native';

// 機密フィールドをサニタイズ
LogRocket.init('<Your App ID>', {
  network: {
    requestSanitizer: (request) => {
      // リクエストから機密データを削除
      if (request.headers) {
        delete request.headers['Authorization'];
        delete request.headers['Cookie'];
      }

      return request;
    },
    responseSanitizer: (response) => {
      // レスポンスから機密データを削除
      if (response.body) {
        const body = JSON.parse(response.body);
        delete body.creditCard;
        delete body.ssn;
        response.body = JSON.stringify(body);
      }

      return response;
    },
  },
});
```

### ユーザー入力のマスキング

```typescript
// 機密入力フィールドには data-private 属性を使用
<TextInput
  placeholder="Credit Card Number"
  secureTextEntry
  // LogRocketは自動的にsecureTextEntryフィールドをマスク
/>
```

## セッション管理

### セッションURLの取得

```typescript
import LogRocket from '@logrocket/react-native';

const getSessionURL = () => {
  const sessionURL = LogRocket.getSessionURL();
  console.log('Session URL:', sessionURL);
  return sessionURL;
};

// エラーレポートにセッションURLを含める
const reportBug = async (description: string) => {
  const sessionURL = getSessionURL();

  await fetch('https://api.example.com/bug-reports', {
    method: 'POST',
    body: JSON.stringify({
      description,
      sessionURL,
      timestamp: new Date().toISOString(),
    }),
  });
};
```

## ベストプラクティス

### 1. 条件付き初期化

```typescript
// 本番環境でのみLogRocketを初期化
import { useEffect } from 'react';
import LogRocket from '@logrocket/react-native';
import Constants from 'expo-constants';

export default function RootLayout() {
  useEffect(() => {
    // 本番環境でのみ有効化
    if (!__DEV__) {
      LogRocket.init('<Your App ID>');
    }
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### 2. エラー境界との統合

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';
import LogRocket from '@logrocket/react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // LogRocketにエラーを送信
    LogRocket.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Button
            title="Try again"
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

### 3. パフォーマンス最適化

```typescript
// サンプリングレートの設定
LogRocket.init('<Your App ID>', {
  // 50%のセッションのみを記録
  shouldCaptureIP: false,
  console: {
    shouldAggregateConsoleErrors: true,
  },
  network: {
    // ネットワークリクエストのボディをキャプチャしない
    requestSanitizer: (request) => {
      request.body = undefined;
      return request;
    },
  },
});
```

## トラブルシューティング

### 問題1: セッションが記録されない

**原因**: LogRocketが正しく初期化されていない

**解決策**：
```typescript
// LogRocketが正しく初期化されているか確認
LogRocket.init('<Your App ID>');

// セッションURLを取得して確認
const sessionURL = LogRocket.getSessionURL();
console.log('Session URL:', sessionURL);
```

### 問題2: Androidビルドが失敗する

**原因**: minSdkVersionが25未満

**解決策**：
```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 25
          }
        }
      ]
    ]
  }
}
```

### 問題3: Expo Goで動作しない

**原因**: LogRocketはカスタムネイティブコードが必要

**解決策**：
```bash
# 開発ビルドを作成
npx expo run:ios
npx expo run:android

# または、EAS Buildを使用
npx eas build --profile development --platform ios
```

## まとめ

LogRocketは、以下の機能を提供します：

### 主な機能
- **セッション記録**: ユーザーセッションの完全な記録と再生
- **エラー監視**: 自動エラー追跡とスタックトレース
- **パフォーマンス監視**: ネットワークリクエストとカスタムメトリクス
- **ユーザー識別**: ユーザー情報とメタデータの追跡

### セットアップステップ
1. LogRocketアカウントの作成とApp ID取得
2. `@logrocket/react-native`のインストール
3. app.jsonでの設定
4. トップレベルファイルでの初期化

### ベストプラクティス
- 本番環境でのみ有効化
- 機密データのサニタイズ
- エラー境界との統合
- パフォーマンス最適化

### Expo Dashboardとの統合
- LogRocketアカウントを接続
- EAS Dashboardでセッションを表示
- アップデートごとのセッション分析

これらのパターンを活用して、Expoアプリの問題を効率的に診断し、ユーザー体験を向上させることができます。
