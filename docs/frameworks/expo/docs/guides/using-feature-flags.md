# フィーチャーフラグを使用する

Expoアプリでフィーチャーフラグを実装し、段階的なロールアウトとA/Bテストを実現する方法を学びます。

## 概要

フィーチャーフラグ（フィーチャーゲートとも呼ばれる）は、リモートで機能を有効化・無効化できる仕組みです。

**定義**: フィーチャーフラグは、アプリを再デプロイせずに機能の表示/非表示を制御するメカニズムです。

**主な用途**：
- 本番環境でのテスト
- A/Bテスト
- 新機能の段階的ロールアウト
- キルスイッチ（緊急機能停止）
- ユーザーセグメント別の機能提供
- 機能のプレビューアクセス

**利用可能なサービス**：
- PostHog
- Statsig
- LaunchDarkly
- Firebase Remote Config

## PostHogの使用

### 概要

PostHogは、オープンソースのプロダクト分析プラットフォームで、フィーチャーフラグ機能を提供します。

**主な機能**：
- リアルタイムフィーチャートグル
- ユーザーセグメンテーション
- ビルトインA/Bテスト
- 即座のロールバック
- プロダクト分析との統合

### ステップ1: PostHogアカウントの作成

1. [PostHog](https://posthog.com/)にサインアップ
2. 新しいプロジェクトを作成
3. **API Key**と**Host**を取得

### ステップ2: SDKのインストール

```bash
npm install posthog-react-native expo-file-system expo-application expo-device expo-localization
```

### ステップ3: 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import PostHog from 'posthog-react-native';

const POSTHOG_API_KEY = 'your-api-key';
const POSTHOG_HOST = 'https://app.posthog.com'; // またはセルフホスト

export default function RootLayout() {
  useEffect(() => {
    // PostHogを初期化
    PostHog.initAsync(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      captureApplicationLifecycleEvents: true,
      captureDeepLinks: true,
    });
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ4: フィーチャーフラグの作成

**PostHogダッシュボード**：
1. **Feature Flags** → **New Feature Flag**
2. キーを設定（例: `new-checkout-flow`）
3. ロールアウト率を設定（0-100%）
4. ターゲットユーザーを設定（オプション）

### ステップ5: フィーチャーフラグの使用

```typescript
// hooks/useFeatureFlag.ts
import { useEffect, useState } from 'react';
import PostHog from 'posthog-react-native';

export function useFeatureFlag(flagKey: string): boolean | undefined {
  const [isEnabled, setIsEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkFlag = async () => {
      const enabled = await PostHog.isFeatureEnabled(flagKey);
      setIsEnabled(enabled);
    };

    checkFlag();
  }, [flagKey]);

  return isEnabled;
}

// 使用例
export default function CheckoutScreen() {
  const newCheckoutEnabled = useFeatureFlag('new-checkout-flow');

  if (newCheckoutEnabled === undefined) {
    return <LoadingSpinner />;
  }

  return newCheckoutEnabled ? <NewCheckout /> : <OldCheckout />;
}
```

### ステップ6: ユーザーの識別

```typescript
import PostHog from 'posthog-react-native';

// ユーザーを識別
PostHog.identify('user-123', {
  email: 'user@example.com',
  plan: 'premium',
  signupDate: '2024-01-01',
});

// ユーザープロパティを更新
PostHog.capture('user_properties_updated', {
  $set: {
    plan: 'enterprise',
    lastLogin: new Date().toISOString(),
  },
});
```

### ステップ7: イベントの追跡

```typescript
// フィーチャー使用時のイベント追跡
PostHog.capture('feature_used', {
  feature_name: 'new-checkout-flow',
  screen: 'checkout',
  timestamp: new Date().toISOString(),
});

// A/Bテスト結果の追跡
PostHog.capture('checkout_completed', {
  checkout_variant: newCheckoutEnabled ? 'new' : 'old',
  order_total: 99.99,
});
```

## Statsigの使用

### 概要

Statsigは、高度な統計分析とA/Bテスト機能を提供するフィーチャーフラグサービスです。

**主な機能**：
- 段階的ロールアウト
- 高度なターゲティング
- 自動イベントログ
- 動的設定
- 統計的有意性の自動計算

### ステップ1: Statsigアカウントの作成

1. [Statsig](https://statsig.com/)にサインアップ
2. 新しいプロジェクトを作成
3. **Client API Key**を取得

### ステップ2: SDKのインストール

```bash
npm install statsig-react-native
```

### ステップ3: 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Statsig } from 'statsig-react-native';

const STATSIG_CLIENT_KEY = 'client-your-key';

export default function RootLayout() {
  useEffect(() => {
    // Statsigを初期化
    Statsig.initialize(STATSIG_CLIENT_KEY, {
      userID: 'anonymous',
    });

    return () => {
      Statsig.shutdown();
    };
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ4: フィーチャーゲートの確認

```typescript
import { Statsig } from 'statsig-react-native';

// フィーチャーゲートを確認
const checkFeatureGate = async () => {
  const isEnabled = await Statsig.checkGate('new_feature');
  console.log('Feature enabled:', isEnabled);
  return isEnabled;
};

// 使用例
export default function HomeScreen() {
  const [showNewFeature, setShowNewFeature] = useState(false);

  useEffect(() => {
    const checkGate = async () => {
      const enabled = await Statsig.checkGate('new_ui');
      setShowNewFeature(enabled);
    };

    checkGate();
  }, []);

  return (
    <View>
      {showNewFeature ? <NewUI /> : <OldUI />}
    </View>
  );
}
```

### ステップ5: 動的設定の取得

```typescript
import { Statsig } from 'statsig-react-native';

// 動的設定を取得
const config = await Statsig.getConfig('app_config');

const buttonColor = config.get('button_color', '#007AFF'); // デフォルト値
const maxItems = config.get('max_items', 10);
const features = config.get('enabled_features', []);

console.log('Button color:', buttonColor);
console.log('Max items:', maxItems);
```

### ステップ6: A/Bテストの実装

```typescript
import { Statsig } from 'statsig-react-native';

// A/Bテストのバリアントを取得
const experiment = await Statsig.getExperiment('checkout_flow_test');

const variant = experiment.get('variant', 'control'); // 'control', 'treatment_a', 'treatment_b'

// バリアントに基づいて異なるUIを表示
export default function CheckoutScreen() {
  const [variant, setVariant] = useState('control');

  useEffect(() => {
    const getVariant = async () => {
      const exp = await Statsig.getExperiment('checkout_flow_test');
      const v = exp.get('variant', 'control');
      setVariant(v);
    };

    getVariant();
  }, []);

  const renderCheckout = () => {
    switch (variant) {
      case 'treatment_a':
        return <CheckoutFlowA />;
      case 'treatment_b':
        return <CheckoutFlowB />;
      default:
        return <CheckoutFlowControl />;
    }
  };

  return <View>{renderCheckout()}</View>;
}
```

### ステップ7: イベントのログ

```typescript
import { Statsig } from 'statsig-react-native';

// カスタムイベントをログ
Statsig.logEvent('button_clicked', {
  button_name: 'checkout',
  screen: 'home',
});

// 値付きイベント
Statsig.logEvent('purchase_completed', 99.99, {
  product_id: 'prod-123',
  currency: 'USD',
});
```

## LaunchDarklyの使用

### 概要

LaunchDarklyは、エンタープライズグレードのフィーチャーマネジメントプラットフォームです。

**主な機能**：
- 即座のフィーチャートグル
- 高度なユーザーターゲティング
- 複数環境のサポート
- 包括的なダッシュボードコントロール
- エンタープライズセキュリティ

### ステップ1: LaunchDarklyアカウントの作成

1. [LaunchDarkly](https://launchdarkly.com/)にサインアップ
2. 新しいプロジェクトを作成
3. **Mobile Key**を取得

### ステップ2: SDKのインストール

```bash
npm install launchdarkly-react-native-client-sdk
```

### ステップ3: 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import LDClient, { LDConfig } from 'launchdarkly-react-native-client-sdk';

const LAUNCHDARKLY_MOBILE_KEY = 'mob-your-key';

export default function RootLayout() {
  useEffect(() => {
    const initLaunchDarkly = async () => {
      const config: LDConfig = {
        mobileKey: LAUNCHDARKLY_MOBILE_KEY,
      };

      const user = {
        key: 'user-123',
        email: 'user@example.com',
        custom: {
          plan: 'premium',
        },
      };

      try {
        await LDClient.configure(config, user);
        console.log('LaunchDarkly initialized');
      } catch (error) {
        console.error('LaunchDarkly initialization failed:', error);
      }
    };

    initLaunchDarkly();

    return () => {
      LDClient.close();
    };
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ4: フラグの評価

```typescript
import LDClient from 'launchdarkly-react-native-client-sdk';

// Boolean フラグ
const isNewFeatureEnabled = await LDClient.boolVariation(
  'new-feature',
  false // デフォルト値
);

// String フラグ
const theme = await LDClient.stringVariation(
  'app-theme',
  'light' // デフォルト値
);

// Number フラグ
const maxRetries = await LDClient.numberVariation(
  'max-retries',
  3 // デフォルト値
);

// JSON フラグ
const config = await LDClient.jsonVariation(
  'app-config',
  { enabled: false } // デフォルト値
);
```

### ステップ5: フラグ変更のリスナー

```typescript
import LDClient from 'launchdarkly-react-native-client-sdk';

// フラグ変更を監視
LDClient.registerFeatureFlagListener('new-feature', (flagKey) => {
  const newValue = await LDClient.boolVariation(flagKey, false);
  console.log(`Flag ${flagKey} changed to:`, newValue);
  // UIを更新
});

// すべてのフラグ変更を監視
LDClient.registerAllFlagsListener((flags) => {
  console.log('All flags updated:', flags);
});
```

### ステップ6: ユーザーコンテキストの更新

```typescript
import LDClient from 'launchdarkly-react-native-client-sdk';

// ユーザー情報を更新
const updateUser = async (userId: string, userData: any) => {
  const newUser = {
    key: userId,
    email: userData.email,
    name: userData.name,
    custom: {
      plan: userData.plan,
      signupDate: userData.signupDate,
    },
  };

  await LDClient.identify(newUser);
  console.log('User context updated');
};
```

## Firebase Remote Configの使用

### 概要

Firebase Remote Configは、Firebaseのクラウドサービスで、アプリの動作と外観をリモートで変更できます。

**主な機能**：
- 条件付きターゲティング
- リアルタイム更新
- Firebaseコンソールでの管理
- デフォルト値のサポート

### ステップ1: Firebaseプロジェクトのセットアップ

**Firebase SDKセットアップを参照**: [using-firebase.md](./using-firebase.md)

### ステップ2: Remote Configの初期化

```typescript
// utils/remoteConfig.ts
import remoteConfig from '@react-native-firebase/remote-config';

export async function setupRemoteConfig() {
  // デフォルト値を設定
  await remoteConfig().setDefaults({
    new_feature_enabled: false,
    welcome_message: 'Welcome!',
    max_items: 10,
    button_color: '#007AFF',
  });

  // 開発環境では短い間隔で更新
  if (__DEV__) {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 60000, // 1分
    });
  }

  // 値を取得してアクティブ化
  await remoteConfig().fetchAndActivate();
}
```

### ステップ3: Remote Config値の取得

```typescript
import remoteConfig from '@react-native-firebase/remote-config';

// Boolean値を取得
const isNewFeatureEnabled = remoteConfig().getBoolean('new_feature_enabled');

// String値を取得
const welcomeMessage = remoteConfig().getString('welcome_message');

// Number値を取得
const maxItems = remoteConfig().getNumber('max_items');

// すべての値を取得
const allValues = remoteConfig().getAll();
console.log('All Remote Config values:', allValues);
```

### ステップ4: 条件付きターゲティング

**Firebaseコンソール**：
1. **Remote Config** → **Add parameter**
2. パラメータを作成
3. **Add condition**で条件を設定

**条件例**：
- アプリバージョン: `>= 2.0.0`
- デバイス言語: `ja`
- ユーザーオーディエンス: `premium_users`
- プラットフォーム: `ios` または `android`

### ステップ5: 値の更新

```typescript
import remoteConfig from '@react-native-firebase/remote-config';

// 最新の値を取得
export async function refreshRemoteConfig() {
  try {
    await remoteConfig().fetch();
    await remoteConfig().activate();
    console.log('Remote Config updated');
  } catch (error) {
    console.error('Failed to fetch Remote Config:', error);
  }
}

// アプリ起動時や定期的に呼び出す
useEffect(() => {
  const interval = setInterval(() => {
    refreshRemoteConfig();
  }, 3600000); // 1時間ごと

  return () => clearInterval(interval);
}, []);
```

## ベストプラクティス

### 1. デフォルト値の設定

```typescript
// ✅ 推奨: 常にデフォルト値を提供
const isFeatureEnabled = await PostHog.isFeatureEnabled('new-feature') ?? false;

// または、サービスのデフォルト値設定を使用
await remoteConfig().setDefaults({
  new_feature_enabled: false,
});

// ❌ 非推奨: デフォルト値なし
const isFeatureEnabled = await PostHog.isFeatureEnabled('new-feature'); // undefinedの可能性
```

### 2. 段階的ロールアウト

```typescript
// 5%のユーザーから開始
// フィーチャーフラグダッシュボードで設定:
// ロールアウト率: 5% → 問題なし → 25% → 50% → 100%

// コード側では通常通り使用
const isEnabled = await Statsig.checkGate('new_feature');
```

### 3. キルスイッチの実装

```typescript
// 緊急時に機能を即座に無効化
export function CriticalFeature() {
  const isEnabled = useFeatureFlag('critical-feature-killswitch');

  if (!isEnabled) {
    return <FallbackUI message="この機能は一時的に利用できません" />;
  }

  return <CriticalFeatureUI />;
}
```

### 4. A/Bテストの実装

```typescript
// A/Bテストの実装パターン
export function CheckoutFlow() {
  const [variant, setVariant] = useState<'control' | 'variant_a' | 'variant_b'>('control');

  useEffect(() => {
    const getVariant = async () => {
      const exp = await Statsig.getExperiment('checkout_ab_test');
      const v = exp.get('variant', 'control');
      setVariant(v as any);

      // バリアント露出をログ
      Statsig.logEvent('experiment_viewed', {
        experiment: 'checkout_ab_test',
        variant: v,
      });
    };

    getVariant();
  }, []);

  // コンバージョンをログ
  const handleCheckoutComplete = () => {
    Statsig.logEvent('checkout_completed', {
      variant,
      order_total: 99.99,
    });
  };

  return variant === 'variant_a' ? <CheckoutA /> : <CheckoutB />;
}
```

### 5. エラーハンドリング

```typescript
const getFeatureFlag = async (flagKey: string): Promise<boolean> => {
  try {
    const isEnabled = await PostHog.isFeatureEnabled(flagKey);
    return isEnabled ?? false;
  } catch (error) {
    console.error(`Failed to get feature flag ${flagKey}:`, error);
    // フォールバック: デフォルト値を返す
    return false;
  }
};
```

## サービス比較

| 機能 | PostHog | Statsig | LaunchDarkly | Firebase Remote Config |
|------|---------|---------|--------------|------------------------|
| **価格** | 無料プランあり | 無料プランあり | 有料 | 無料 |
| **オープンソース** | ✅ | ❌ | ❌ | ❌ |
| **A/Bテスト** | ✅ | ✅ | ✅ | 部分的 |
| **プロダクト分析** | ✅ | ✅ | 一部 | ❌ |
| **リアルタイム更新** | ✅ | ✅ | ✅ | ✅ |
| **セルフホスト** | ✅ | ❌ | ❌ | ❌ |
| **学習曲線** | 低 | 中 | 高 | 低 |
| **エンタープライズ機能** | 一部 | ✅ | ✅ | 一部 |

## トラブルシューティング

### 問題1: フラグが更新されない

**原因**: キャッシュまたはネットワークの問題

**解決策**：
```typescript
// 強制的に最新の値を取得
await remoteConfig().fetch(0); // キャッシュをバイパス
await remoteConfig().activate();
```

### 問題2: デフォルト値が使用される

**原因**: 初期化が完了していない

**解決策**：
```typescript
// 初期化完了を待つ
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const init = async () => {
    await PostHog.isReady();
    setIsReady(true);
  };

  init();
}, []);

if (!isReady) {
  return <LoadingSpinner />;
}
```

### 問題3: フラグが反映されない

**原因**: ユーザーセグメントの設定ミス

**解決策**：
- ダッシュボードでターゲティング条件を確認
- ユーザープロパティが正しく設定されているか確認
- テストユーザーを明示的にフラグに追加

## まとめ

Expoでのフィーチャーフラグ実装は、以下の機能を提供します：

### 利用可能なサービス
- **PostHog**: オープンソース、プロダクト分析統合、無料プランあり
- **Statsig**: 高度な統計分析、A/Bテスト、無料プランあり
- **LaunchDarkly**: エンタープライズグレード、高度なターゲティング
- **Firebase Remote Config**: Firebaseエコシステム統合、無料

### 主な用途
- 段階的な機能ロールアウト
- A/Bテストと実験
- キルスイッチ（緊急機能停止）
- ユーザーセグメント別の機能提供
- 動的な設定変更

### ベストプラクティス
- 常にデフォルト値を設定
- 段階的ロールアウト（5% → 25% → 50% → 100%）
- キルスイッチの実装
- A/Bテストの適切な実装
- エラーハンドリングとフォールバック

### セットアップ
- サービスアカウントの作成
- SDKのインストールと初期化
- フラグの作成と設定
- ユーザー識別とターゲティング
- イベント追跡と分析

これらのパターンを活用して、データ駆動型の機能開発と段階的なリリースを実現できます。
