# Sentryを使用する

ExpoアプリでSentryを統合し、クラッシュレポートとエラー監視を実装する方法を学びます。

## 概要

Sentryは、本番環境でのアプリデプロイメントにリアルタイムの洞察を提供するクラッシュレポートプラットフォームです。

**主な機能**：
- 自動的な例外のキャプチャと整理
- スタックトレース、デバイス情報、アプリバージョンなどの詳細なコンテキスト
- リアルタイムエラーアラート
- パフォーマンス監視
- セッションリプレイ

**サポートされるプラットフォーム**：
- Android（デバイスとエミュレーター）
- iOS（デバイスとシミュレーター）
- Web

## セットアップ

### ステップ1: Sentryアカウントの作成

1. [Sentry.io](https://sentry.io/)にサインアップ
   - 無料プランで月5,000イベントまでサポート
2. 新しいプロジェクトを作成（React Native）
3. 以下の情報を取得：
   - **Organization slug**: 組織の識別子
   - **Project name**: プロジェクト名
   - **DSN (Data Source Name)**: データソース名
   - **Organization Auth Token**: 組織認証トークン

### ステップ2: Sentry Wizardのインストール

```bash
npx @sentry/wizard@latest -i reactNative
```

**Wizardが自動的に実行する処理**：
1. 必要な依存関係のインストール
2. プロジェクトの設定
3. Metro設定の追加
4. 初期化コードの追加
5. 環境変数の設定

### ステップ3: 環境変数の設定

**.env.local**:
```bash
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-name
EXPO_PUBLIC_SENTRY_DSN=your-dsn
```

## 初期化

### 自動初期化（Wizard使用時）

Wizardは自動的に初期化コードを追加します：

```typescript
// app/_layout.tsx（または最上位ファイル）
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // パフォーマンス監視を有効化
  enableTracing: true,
  // エラーサンプリングレート（1.0 = 100%）
  tracesSampleRate: 1.0,
});

export default function RootLayout() {
  return (
    // レイアウトコンポーネント
  );
}
```

### 手動初期化

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/react-native';
import * as Updates from 'expo-updates';

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

    // 環境の設定
    environment: __DEV__ ? 'development' : 'production',

    // アプリバージョン情報
    release: Updates.manifest?.version,
    dist: Updates.manifest?.id,

    // トレーシング
    enableTracing: true,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,

    // セッションリプレイ
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // ブレッドクラムを有効化
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,

    // 統合の設定
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation: Sentry.reactNavigationIntegration(),
      }),
    ],
  });
}
```

## エラー追跡

### エラーの手動キャプチャ

```typescript
import * as Sentry from '@sentry/react-native';

// シンプルなエラー
try {
  // 何か危険な操作
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// コンテキスト付きエラー
try {
  await processPayment(amount);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
      amount: amount.toString(),
    },
    level: 'error',
  });
}
```

### カスタムメッセージの送信

```typescript
// エラーではないがログしたいイベント
Sentry.captureMessage('User completed onboarding', {
  level: 'info',
  tags: {
    feature: 'onboarding',
  },
  extra: {
    userId: 'user-123',
    completedAt: new Date().toISOString(),
  },
});
```

### グローバルエラーハンドラー

```typescript
// lib/error-handler.ts
import * as Sentry from '@sentry/react-native';

export function setupGlobalErrorHandler() {
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Sentry.captureException(error, {
      tags: {
        isFatal: isFatal.toString(),
      },
    });

    // デフォルトハンドラーを呼び出す
    defaultHandler(error, isFatal);
  });
}

// app/_layout.tsx
import { setupGlobalErrorHandler } from '@/lib/error-handler';

export default function RootLayout() {
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

## ユーザーコンテキスト

### ユーザーの設定

```typescript
import * as Sentry from '@sentry/react-native';

// ユーザーがサインインした後
Sentry.setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'johndoe',
  // カスタムプロパティ
  plan: 'premium',
  signupDate: '2024-01-01',
});

// サインアウト時にクリア
Sentry.setUser(null);
```

### タグとコンテキストの追加

```typescript
// タグの設定（検索可能）
Sentry.setTag('environment', 'staging');
Sentry.setTag('feature', 'checkout');

// コンテキストの設定（追加情報）
Sentry.setContext('payment', {
  method: 'credit_card',
  amount: 99.99,
  currency: 'USD',
});

// ブレッドクラムの追加（ユーザーアクションの記録）
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
  data: {
    userId: 'user-123',
    method: 'email',
  },
});
```

## パフォーマンス監視

### トランザクションの追跡

```typescript
import * as Sentry from '@sentry/react-native';

// カスタムトランザクション
const transaction = Sentry.startTransaction({
  name: 'ProcessPayment',
  op: 'task',
});

try {
  // 処理の実行
  await processPayment();

  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('internal_error');
  Sentry.captureException(error);
} finally {
  transaction.finish();
}
```

### スパンの追跡

```typescript
const transaction = Sentry.startTransaction({
  name: 'CheckoutFlow',
  op: 'task',
});

// ステップ1
const span1 = transaction.startChild({
  op: 'validation',
  description: 'Validate cart items',
});
await validateCart();
span1.finish();

// ステップ2
const span2 = transaction.startChild({
  op: 'payment',
  description: 'Process payment',
});
await processPayment();
span2.finish();

transaction.finish();
```

## Expo Routerとの統合

### ナビゲーション追跡

```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      const routingInstrumentation = new Sentry.ReactNativeTracing.RoutingInstrumentation();

      Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
        integrations: [
          new Sentry.ReactNativeTracing({
            routingInstrumentation,
          }),
        ],
      });

      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    // レイアウトコンポーネント
  );
}
```

## ソースマップのアップロード

### EAS Updateでのソースマップアップロード

```json
{
  "expo": {
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your-org-slug",
            "project": "your-project-name"
          }
        }
      ]
    }
  }
}
```

**ビルド時の自動アップロード**：
```bash
# EAS Buildは自動的にソースマップをアップロード
npx eas update
```

### 手動でのソースマップアップロード

```bash
# Sentry CLIのインストール
npm install -g @sentry/cli

# ソースマップのアップロード
sentry-cli releases files <RELEASE_NAME> upload-sourcemaps \
  --dist <DIST> \
  --rewrite ./dist
```

## EAS Dashboardとの統合

### Sentryアカウントの接続

1. [Expo Dashboard](https://expo.dev/)にログイン
2. プロジェクトを選択
3. **Settings** → **Integrations**
4. **Sentry**を選択して接続
5. Sentryアカウントを認証

**統合の利点**：
- EAS Dashboardで直接エラーを表示
- アップデートごとのエラー追跡
- デプロイとエラーの相関

## エラーのテスト

### テストエラーの送信

```typescript
// components/ErrorTestButton.tsx
import { Button } from 'react-native';
import * as Sentry from '@sentry/react-native';

export function ErrorTestButton() {
  const testError = () => {
    // テストエラーを送信
    Sentry.captureException(new Error('Test error from Expo app'));

    // または、実際のエラーをスロー
    throw new Error('This is a test error');
  };

  return <Button title="Test Sentry Error" onPress={testError} />;
}
```

### デバッグモード

```typescript
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // デバッグログを有効化
  debug: __DEV__,
  // 本番環境でのみエラーを送信
  enabled: !__DEV__,
});
```

## ベストプラクティス

### 1. エラーフィルタリング

```typescript
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  beforeSend(event, hint) {
    // 機密情報を削除
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    // 特定のエラーを無視
    if (event.exception?.values?.[0]?.value?.includes('Network request failed')) {
      return null;
    }

    return event;
  },
});
```

### 2. サンプリングレートの調整

```typescript
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // エラーサンプリング（開発: 100%, 本番: 100%）
  sampleRate: 1.0,

  // パフォーマンストレーシング（開発: 100%, 本番: 10%）
  tracesSampleRate: __DEV__ ? 1.0 : 0.1,

  // セッションリプレイ（エラー時: 100%, 通常: 10%）
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 3. エラー境界との統合

```typescript
// components/ErrorBoundary.tsx
import * as Sentry from '@sentry/react-native';

const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  {
    fallback: ({ error, resetError }) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text>Something went wrong</Text>
        <Text>{error.message}</Text>
        <Button title="Try Again" onPress={resetError} />
      </View>
    ),
    showDialog: true,
  }
);

// app/_layout.tsx
export default function RootLayout() {
  return (
    <ErrorBoundary>
      {/* アプリコンテンツ */}
    </ErrorBoundary>
  );
}
```

## トラブルシューティング

### 問題1: エラーが送信されない

**原因**: DSNが正しく設定されていない

**解決策**：
```typescript
// DSNを確認
console.log('Sentry DSN:', process.env.EXPO_PUBLIC_SENTRY_DSN);

// デバッグモードを有効化
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: true,
});
```

### 問題2: ソースマップが機能しない

**原因**: ソースマップがアップロードされていない

**解決策**：
```bash
# 手動でソースマップをアップロード
sentry-cli releases files <VERSION> upload-sourcemaps ./dist

# または、EAS Updateを使用
npx eas update
```

### 問題3: パフォーマンスデータが表示されない

**原因**: トレーシングが有効化されていない

**解決策**：
```typescript
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableTracing: true,
  tracesSampleRate: 0.1,
});
```

## まとめ

Sentryは、以下の包括的なエラー監視機能を提供します：

### 主な機能
- **自動エラー追跡**: 例外の自動キャプチャと整理
- **詳細なコンテキスト**: スタックトレース、デバイス情報、アプリバージョン
- **パフォーマンス監視**: トランザクションとスパンの追跡
- **セッションリプレイ**: ユーザーセッションの記録と再生

### セットアップ
- Sentry Wizardで自動セットアップ
- 環境変数での設定管理
- EAS Dashboardとの統合

### ベストプラクティス
- エラーフィルタリングと機密情報の削除
- 適切なサンプリングレートの設定
- エラー境界との統合
- ソースマップの自動アップロード

これらのパターンを活用して、本番環境でのアプリの健全性を監視し、問題を迅速に特定・修正できます。
