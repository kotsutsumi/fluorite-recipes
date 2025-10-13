# 画面トラッキング

Expo Routerで画面トラッキングを実装する方法を学びます。

## 画面トラッキングとは

画面トラッキングは、ユーザーがアプリ内でどの画面を訪れたかを追跡する機能です。アナリティクスプロバイダーと統合して、ユーザー行動を分析できます。

## Expo Routerの利点

Expo Routerは、React Navigationと比較して画面トラッキングがシンプルです。

**理由**: 内蔵のURL アクセスにより、複雑なコールバックが不要です。

## 基本的な実装

### 2つのステップ

1. 現在のURLを監視する高階コンポーネントを作成
2. アナリティクスプロバイダーでURLを追跡

### コード例

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { usePathname, useGlobalSearchParams, Slot } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  // アナリティクスプロバイダーで位置を追跡
  useEffect(() => {
    // カスタムアナリティクス関数
    analytics.track({ pathname, params });
  }, [pathname, params]);

  return <Slot />;
}
```

## アナリティクスプロバイダーとの統合

### Firebase Analytics

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import * as Analytics from 'expo-firebase-analytics';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    Analytics.logEvent('screen_view', {
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

### Google Analytics

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { GoogleAnalytics } from '@/lib/analytics';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    GoogleAnalytics.send({
      hitType: 'pageview',
      page: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

### Mixpanel

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { Mixpanel } from 'mixpanel-react-native';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    Mixpanel.track('Page View', {
      page: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

### Segment

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import analytics from '@segment/analytics-react-native';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.screen(pathname);
  }, [pathname]);

  return <Slot />;
}
```

## パラメータを含むトラッキング

### グローバルパラメータの使用

```typescript
import { useEffect } from 'react';
import { usePathname, useGlobalSearchParams } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    analytics.track('screen_view', {
      screen_name: pathname,
      ...params, // すべてのパラメータを含める
    });
  }, [pathname, params]);

  return <Slot />;
}
```

### カスタムプロパティの追加

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { Platform } from 'react-native';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track('screen_view', {
      screen_name: pathname,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
    });
  }, [pathname]);

  return <Slot />;
}
```

## React Navigationとの比較

### React Navigation（複雑）

```typescript
import { NavigationContainer } from '@react-navigation/native';

function App() {
  const routeNameRef = useRef();
  const navigationRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics.logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      {/* ナビゲーター */}
    </NavigationContainer>
  );
}
```

### Expo Router（シンプル）

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track({ pathname });
  }, [pathname]);

  return <Slot />;
}
```

## ベストプラクティス

### 1. ルートレイアウトでトラッキング

アプリ全体のトラッキングには、ルートレイアウトを使用します。

```typescript
// app/_layout.tsx
export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track({ pathname });
  }, [pathname]);

  return <Slot />;
}
```

### 2. 特定のセクションでトラッキング

特定のセクションのみトラッキングする場合は、そのレイアウトに実装します。

```typescript
// app/(tabs)/_layout.tsx
export default function TabLayout() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track('tab_view', { pathname });
  }, [pathname]);

  return <Tabs />;
}
```

### 3. ユーザープロパティの追加

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Layout() {
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    analytics.track('screen_view', {
      screen_name: pathname,
      user_id: user?.id,
      user_type: user?.type,
    });
  }, [pathname, user]);

  return <Slot />;
}
```

### 4. エラートラッキング

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      analytics.track({ pathname });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [pathname]);

  return <Slot />;
}
```

## まとめ

Expo Routerの画面トラッキングは、以下の特徴があります：

1. **シンプルな実装**: 内蔵URLアクセスによる簡素化
2. **柔軟な統合**: 多様なアナリティクスプロバイダーをサポート
3. **React Navigationより簡単**: 複雑なコールバック不要

**主な機能**：
- usePathname()でURLを監視
- useGlobalSearchParams()でパラメータを取得
- useEffect()でトラッキングを実装

**サポートされるアナリティクスプロバイダー**：
- Firebase Analytics
- Google Analytics
- Mixpanel
- Segment
- カスタムアナリティクス

**ベストプラクティス**：
- ルートレイアウトでトラッキング
- 特定のセクションでトラッキング
- ユーザープロパティの追加
- エラートラッキング

これらの機能を活用して、効率的なユーザー行動分析を実装できます。
