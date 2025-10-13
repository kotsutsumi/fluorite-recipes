# Vexoを使用する

ExpoアプリでVexo分析を統合し、ユーザーインタラクションとアプリパフォーマンスを追跡する方法を学びます。

## 概要

Vexoは、Expoアプリケーション向けのリアルタイムユーザー分析プラットフォームです。

**主な機能**：
- アクティブユーザー追跡
- セッション時間監視
- ダウンロード分析
- OS分布
- バージョン採用インサイト
- 地理的データ
- 人気画面の特定
- セッションリプレイ
- ヒートマップ
- ユーザーフローファネル
- カスタムイベント追跡

**互換性**：
- Expo Development builds ✅
- Expo Go ❌（ネイティブコードが必要）

## セットアップ

### ステップ1: Vexoアカウントの作成

1. [Vexo](https://vexo.co/)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. **API Key**を生成

### ステップ2: SDKのインストール

```bash
npm install vexo-analytics
```

### ステップ3: 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { vexo } from 'vexo-analytics';

export default function RootLayout() {
  useEffect(() => {
    // Vexoを初期化
    vexo('YOUR_API_KEY');
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ4: 開発ビルドの作成

```bash
# 変更を適用するためにアプリを再ビルド
npx expo prebuild

# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 環境変数の使用

**.env.local**:
```bash
EXPO_PUBLIC_VEXO_API_KEY=your-api-key
```

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { vexo } from 'vexo-analytics';

export default function RootLayout() {
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;

    if (apiKey) {
      vexo(apiKey);
    } else {
      console.warn('Vexo API Key is not set');
    }
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

## 本番環境のみで有効化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { vexo } from 'vexo-analytics';

export default function RootLayout() {
  useEffect(() => {
    // 本番環境でのみVexoを初期化
    if (!__DEV__) {
      const apiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;
      if (apiKey) {
        vexo(apiKey);
      }
    }
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

## カスタムイベントの追跡

### 基本的なイベント

```typescript
import { vexo } from 'vexo-analytics';

// シンプルなイベント
vexo.track('Button Clicked');

// プロパティ付きイベント
vexo.track('Purchase Completed', {
  productId: 'prod-123',
  price: 99.99,
  currency: 'USD',
  category: 'electronics',
});
```

### ユーザーアクションの追跡

```typescript
// ボタンクリック
const handleButtonClick = () => {
  vexo.track('CTA Button Clicked', {
    buttonText: 'Get Started',
    screenName: 'Home',
  });
};

// フォーム送信
const handleFormSubmit = (data: any) => {
  vexo.track('Form Submitted', {
    formName: 'Contact Form',
    fields: Object.keys(data),
  });
};

// 機能使用
const handleFeatureUse = (featureName: string) => {
  vexo.track('Feature Used', {
    featureName,
    timestamp: new Date().toISOString(),
  });
};
```

## 画面追跡

### Expo Routerでの自動画面追跡

```typescript
// hooks/useScreenTracking.ts
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { vexo } from 'vexo-analytics';

export function useScreenTracking() {
  const pathname = usePathname();

  useEffect(() => {
    vexo.track('Screen View', {
      screenName: pathname,
      timestamp: new Date().toISOString(),
    });
  }, [pathname]);
}

// 各画面で使用
export default function HomeScreen() {
  useScreenTracking();

  return (
    // 画面コンテンツ
  );
}
```

### 手動画面追跡

```typescript
import { vexo } from 'vexo-analytics';

// 画面遷移時
vexo.track('Screen View', {
  screenName: 'Product Details',
  productId: 'prod-123',
  previousScreen: 'Product List',
});
```

## ユーザー識別

### ユーザーの識別

```typescript
import { vexo } from 'vexo-analytics';

// ユーザーがサインインした後
const identifyUser = (user: any) => {
  vexo.identify(user.id, {
    email: user.email,
    name: user.name,
    plan: user.subscriptionType,
    signupDate: user.createdAt,
  });
};

// サインアウト時
const clearUser = () => {
  vexo.reset();
};
```

### カスタムユーザープロパティ

```typescript
// ユーザープロパティを更新
vexo.setUserProperties({
  plan: 'premium',
  lastPurchase: new Date().toISOString(),
  totalSpent: 299.97,
  favoriteCategory: 'electronics',
});
```

## セッション追跡

### セッション開始

```typescript
import { vexo } from 'vexo-analytics';

// セッション開始（自動）
// Vexoは自動的にセッションを追跡

// カスタムセッションイベント
vexo.track('Session Started', {
  source: 'push-notification',
  campaign: 'spring-sale',
});
```

### セッション終了

```typescript
// セッション終了時
vexo.track('Session Ended', {
  duration: calculateSessionDuration(),
  actionsPerformed: getActionCount(),
});
```

## コンバージョントラッキング

### 購入イベント

```typescript
import { vexo } from 'vexo-analytics';

const trackPurchase = (order: any) => {
  vexo.track('Purchase', {
    orderId: order.id,
    revenue: order.total,
    currency: 'USD',
    items: order.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};
```

### サインアップトラッキング

```typescript
const trackSignup = (method: string) => {
  vexo.track('User Signed Up', {
    method, // 'email', 'google', 'facebook'
    timestamp: new Date().toISOString(),
    referralSource: getReferralSource(),
  });
};
```

## エラートラッキング

### エラーイベント

```typescript
import { vexo } from 'vexo-analytics';

const trackError = (error: Error, context?: any) => {
  vexo.track('Error Occurred', {
    errorMessage: error.message,
    errorName: error.name,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// 使用例
try {
  await processPayment();
} catch (error) {
  trackError(error as Error, {
    feature: 'payment',
    userId: 'user-123',
  });
}
```

## パフォーマンス追跡

### ロード時間の測定

```typescript
import { vexo } from 'vexo-analytics';

const trackLoadTime = (screenName: string, startTime: number) => {
  const loadTime = Date.now() - startTime;

  vexo.track('Screen Load Time', {
    screenName,
    loadTime,
    isSlowLoad: loadTime > 3000,
  });
};

// 使用例
export default function ProductDetailsScreen() {
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // データ読み込み完了後
    trackLoadTime('Product Details', startTime);
  }, []);

  return (
    // 画面コンテンツ
  );
}
```

### API レスポンス時間

```typescript
const trackAPIRequest = async (endpoint: string) => {
  const startTime = Date.now();

  try {
    const response = await fetch(endpoint);
    const duration = Date.now() - startTime;

    vexo.track('API Request', {
      endpoint,
      duration,
      status: response.status,
      success: response.ok,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    vexo.track('API Request Failed', {
      endpoint,
      duration,
      error: (error as Error).message,
    });

    throw error;
  }
};
```

## A/Bテストトラッキング

### バリアント追跡

```typescript
import { vexo } from 'vexo-analytics';

// A/Bテストバリアントを設定
const setABTestVariant = (testName: string, variant: string) => {
  vexo.setUserProperties({
    [`abtest_${testName}`]: variant,
  });

  vexo.track('AB Test Variant Assigned', {
    testName,
    variant,
  });
};

// コンバージョンを追跡
const trackABTestConversion = (testName: string, variant: string) => {
  vexo.track('AB Test Conversion', {
    testName,
    variant,
    timestamp: new Date().toISOString(),
  });
};
```

## ベストプラクティス

### 1. イベント命名規則

```typescript
// ✅ 推奨: 明確で一貫した命名
vexo.track('Button Clicked', {
  buttonText: 'Sign Up',
  screenName: 'Home',
  action: 'submit',
});

// ❌ 非推奨: 曖昧な命名
vexo.track('click', {
  b: 'signup',
});
```

### 2. 構造化されたプロパティ

```typescript
// ✅ 推奨: 構造化されたデータ
vexo.track('Product Viewed', {
  product: {
    id: 'prod-123',
    name: 'Wireless Headphones',
    price: 99.99,
    category: 'Electronics',
  },
  source: 'search',
  query: 'headphones',
});

// ❌ 非推奨: フラットな構造
vexo.track('Product Viewed', {
  productId: 'prod-123',
  productName: 'Wireless Headphones',
  productPrice: 99.99,
  productCategory: 'Electronics',
  source: 'search',
  query: 'headphones',
});
```

### 3. 個人情報の保護

```typescript
// ✅ 推奨: 個人情報を除外
vexo.track('User Registered', {
  userId: hashUserId(user.id),
  plan: 'premium',
  referralSource: 'google',
  // email, nameは含めない
});

// ❌ 非推奨: 個人情報を含める
vexo.track('User Registered', {
  email: 'user@example.com', // プライバシー違反
  name: 'John Doe',
});
```

### 4. イベントのバッチ処理

```typescript
// イベントキューを作成
const eventQueue: Array<{ name: string; properties: any }> = [];

const queueEvent = (name: string, properties: any) => {
  eventQueue.push({ name, properties });

  // 10イベントごとにフラッシュ
  if (eventQueue.length >= 10) {
    flushEvents();
  }
};

const flushEvents = () => {
  eventQueue.forEach(({ name, properties }) => {
    vexo.track(name, properties);
  });
  eventQueue.length = 0;
};
```

## Vexoダッシュボードの活用

### 利用可能なダッシュボード機能

1. **アクティブユーザー**: リアルタイムアクティブユーザー数
2. **セッション時間**: 平均およびTotal セッション時間
3. **ダウンロード数**: アプリダウンロード数の推移
4. **OS分布**: iOS vs Android使用率
5. **バージョン採用**: アプリバージョン別ユーザー分布
6. **地理的データ**: 国/地域別ユーザー分布
7. **人気画面**: 最も訪問された画面
8. **カスタムイベント**: 設定したカスタムイベントの追跡

## トラブルシューティング

### 問題1: イベントが記録されない

**原因**: API Keyが正しく設定されていない

**解決策**：
```typescript
// API Keyを確認
console.log('Vexo API Key:', process.env.EXPO_PUBLIC_VEXO_API_KEY);

// テストイベントを送信
vexo.track('Test Event', { test: true });
```

### 問題2: Vexoダッシュボードにデータが表示されない

**原因**: ネイティブコードの再ビルドが必要

**解決策**：
```bash
# アプリを再ビルド
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

### 問題3: Expo Goで動作しない

**原因**: VexoはExpo Goと互換性がない

**解決策**：
- 開発ビルドを作成
- EAS Buildを使用

## まとめ

Vexoは、以下のリアルタイム分析機能を提供します：

### 主な機能
- **ユーザー追跡**: アクティブユーザー、セッション時間
- **アプリメトリクス**: ダウンロード、OS分布、バージョン採用
- **カスタムイベント**: 任意のユーザーアクションの追跡
- **高度な機能**: セッションリプレイ、ヒートマップ、ファネル分析

### セットアップステップ
1. Vexoアカウントの作成とAPI Key取得
2. `vexo-analytics`のインストール
3. 初期化コードの追加
4. 開発ビルドの作成

### ベストプラクティス
- 本番環境でのみ有効化
- 明確なイベント命名規則
- 個人情報の保護
- イベントのバッチ処理

これらのパターンを活用して、ユーザー行動の深い洞察を得て、データ駆動型の意思決定を行うことができます。
