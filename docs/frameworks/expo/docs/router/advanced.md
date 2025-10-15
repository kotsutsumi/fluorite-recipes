# Expo Router Advanced - 高度なナビゲーション機能総合ガイド

## 📋 概要

Expo Router Advanced は、モバイルおよびWebアプリケーションのための高度なナビゲーション機能を提供します。モーダル、認証、プラットフォーム固有の実装、ネイティブ統合まで、包括的なルーティングソリューションをカバーしています。

```typescript
interface ExpoRouterAdvanced {
  navigation: {
    modals: ModalNavigation;
    stack: StackNavigation;
    tabs: TabNavigation;
    drawer: DrawerNavigation;
  };
  authentication: {
    protected: ProtectedRoutes;
    rewrites: AuthenticationRewrites;
  };
  platform: {
    specific: PlatformSpecificModules;
    shared: SharedRoutes;
    web: WebModals;
  };
  native: {
    tabs: NativeTabs;
    intent: NativeIntent;
    handoff: AppleHandoff;
  };
  advanced: {
    nesting: NestedNavigators;
    custom: CustomTabs;
    settings: RouterSettings;
  };
}
```

## 🎯 ナビゲーション機能

### モーダル

```typescript
interface ModalNavigation {
  types: {
    reactNative: {
      component: "React Native Modal";
      purpose: "スタンドアロンのインタラクション";
      features: {
        animationTypes: ["slide", "fade", "none"];
        transparent: boolean;
        onRequestClose: () => void;
      };
      useCases: [
        "一時的なアラート",
        "確認ダイアログ",
        "簡単なフォーム入力",
        "スタンドアロンのインタラクション"
      ];
    };

    expoRouter: {
      component: "Expo Router Modal Screen";
      purpose: "ナビゲーション統合";
      presentations: [
        "card",
        "modal",
        "transparentModal",
        "containedModal",
        "fullScreenModal",
        "formSheet"
      ];
      useCases: [
        "ディープリンク対応モーダル",
        "ナビゲーション履歴統合",
        "パラメータ付きモーダル",
        "カスタムヘッダー"
      ];
    };
  };

  implementation: {
    basic: `
      // app/_layout.tsx
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>
    `;

    custom: `
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          statusBarStyle: 'light',
        }}
      />
    `;
  };

  platformBehavior: {
    android: "画面の上にスライド、戻るボタンで閉じる";
    ios: "下から上にスライド、下にスワイプで閉じる";
    web: "手動で閉じるロジック実装が必要";
  };
}
```

**詳細ドキュメント**: [`modals.md`](./router/advanced/modals.md)

### Stack Navigator

```typescript
interface StackNavigation {
  purpose: "画面間のナビゲーション管理";

  features: {
    header: {
      customization: "スタイル、ボタン、タイトル";
      dynamic: "画面内からの動的設定";
      hiding: "個別またはグローバル非表示";
    };

    animations: [
      "slide_from_right",
      "slide_from_left",
      "slide_from_bottom",
      "fade",
      "fade_from_bottom",
      "flip",
      "simple_push",
      "none"
    ];

    presentations: ["card", "modal", "transparentModal"];

    gestures: {
      swipe: "スワイプジェスチャーの有効化/無効化";
      fullScreen: "フルスクリーンスワイプ";
    };
  };

  operations: {
    dismiss: "最後の画面を閉じる";
    dismissTo: "特定のルートまで閉じる";
    dismissAll: "スタックの最初の画面に戻る";
  };

  ios26: {
    liquidGlass: "Liquid Glassエフェクト";
    options: [
      "UIDesignRequiresCompatibility設定",
      "JavaScriptベースナビゲーション切り替え"
    ];
  };
}
```

**実装例**：

```typescript
// app/_layout.tsx
<Stack
  screenOptions={{
    headerStyle: { backgroundColor: '#f4511e' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  }}
>
  <Stack.Screen
    name="index"
    options={{
      title: 'Home',
      headerRight: () => <Button title="Info" onPress={() => {}} />,
    }}
  />
  <Stack.Screen
    name="modal"
    options={{
      presentation: 'modal',
      title: 'Modal',
    }}
  />
</Stack>
```

**詳細ドキュメント**: [`stack.md`](./router/advanced/stack.md)

### タブナビゲーション

```typescript
interface TabNavigation {
  types: {
    javascript: {
      base: "React Navigation";
      customization: "完全カスタマイズ可能";
      platforms: ["iOS", "Android", "Web"];
      features: {
        icons: "カスタムアイコン対応";
        badges: "バッジ表示";
        dynamic: "条件付き表示/非表示";
      };
    };

    native: {
      availability: "SDK 54以降（実験的）";
      base: "プラットフォームネイティブUI";
      performance: "優れたパフォーマンス";
      limitations: {
        android: "最大5タブ";
        customization: "制限あり";
        nesting: "ネイティブタブのネスト不可";
      };
    };

    custom: {
      availability: "SDK 52以降（実験的）";
      components: ["Tabs", "TabList", "TabTrigger", "TabSlot"];
      flexibility: "完全カスタマイズ可能";
      features: {
        asChild: "カスタムコンポーネント置き換え";
        reset: "ナビゲーション状態リセット";
        renderFn: "カスタムレンダリング";
      };
    };
  };

  bestPractices: [
    "5タブ以下を推奨",
    "明確で認識しやすいアイコン",
    "一貫したスタイル",
    "ユニークな動的ルート"
  ];
}
```

**JavaScript タブ実装**：

```typescript
// app/(tabs)/_layout.tsx
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#f4511e',
    tabBarInactiveTintColor: '#888',
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => (
        <FontAwesome name="home" size={28} color={color} />
      ),
      tabBarBadge: 3,
    }}
  />
</Tabs>
```

**詳細ドキュメント**:
- [`tabs.md`](./router/advanced/tabs.md) - JavaScriptタブ
- [`native-tabs.md`](./router/advanced/native-tabs.md) - ネイティブタブ
- [`custom-tabs.md`](./router/advanced/custom-tabs.md) - カスタムタブ

### Drawer ナビゲーション

```typescript
interface DrawerNavigation {
  purpose: "サイドメニューナビゲーション";
  platforms: ["iOS", "Android", "Web"];

  installation: {
    sdk54Plus: "npx expo install @react-navigation/drawer react-native-reanimated react-native-worklets";
    sdk53Minus: "npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated";
  };

  features: {
    customization: {
      icons: "タブアイコンのカスタマイズ";
      style: "背景色、幅、ラベルスタイル";
      activeState: "アクティブ/非アクティブの色";
    };

    customContent: {
      component: "DrawerContentScrollView";
      items: "DrawerItemList";
      flexibility: "完全カスタマイズ可能";
    };

    position: ["left", "right"];

    operations: {
      open: "router.push() または DrawerActions.openDrawer()";
      close: "DrawerActions.closeDrawer()";
      toggle: "DrawerActions.toggleDrawer()";
    };
  };

  dynamicRoutes: {
    support: true;
    naming: "ルートからの完全なURLパス";
    example: "user/[id]";
  };
}
```

**カスタムDrawer実装**：

```typescript
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20, backgroundColor: '#f4511e' }}>
        <Image source={require('./assets/avatar.png')} />
        <Text>John Doe</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

<Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
  <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
</Drawer>
```

**詳細ドキュメント**: [`drawer.md`](./router/advanced/drawer.md)

## 🔐 認証とアクセス制御

### 認証実装

```typescript
interface AuthenticationImplementation {
  approach: "ランタイムロジックでリダイレクト";
  requirements: "Expo SDK 53以降";
  type: "クライアントサイド認証";

  components: {
    context: {
      provider: "SessionProvider";
      hook: "useSession()";
      state: {
        session: "string | null";
        isLoading: boolean;
        signIn: (token: string) => void;
        signOut: () => void;
      };
    };

    storage: {
      mobile: "expo-secure-store";
      web: "localStorage";
      hook: "useStorageState()";
    };

    splash: {
      controller: "SplashScreenController";
      purpose: "認証状態読み込み中の表示";
    };
  };

  patterns: {
    standard: {
      structure: `
        app/
        ├── _layout.tsx (SessionProvider)
        ├── sign-in.tsx
        └── (app)/
            ├── _layout.tsx (保護チェック)
            ├── index.tsx
            └── profile.tsx
      `;
      redirect: "未認証時にsign-inへリダイレクト";
    };

    modal: {
      presentation: "modal";
      structure: "sign-inをモーダルとして表示";
      advantage: "スムーズなUX";
    };
  };

  limitations: {
    serverSide: "サーバーサイドミドルウェア非サポート";
    web: "クライアントサイドリダイレクト依存";
    initial: "すべてのルートは初期状態でアクセス可能";
  };
}
```

**認証コンテキスト実装**：

```typescript
// context/auth.tsx
const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => setSession(token),
        signOut: () => setSession(null),
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
```

**詳細ドキュメント**:
- [`authentication.md`](./router/advanced/authentication.md)
- [`authentication-rewrites.md`](./router/advanced/authentication-rewrites.md)

### 保護されたルート

```typescript
interface ProtectedRoutes {
  availability: "Expo SDK 53以降";
  purpose: "クライアントサイドナビゲーション保護";

  implementation: {
    component: "Stack.Protected, Tabs.Protected, Drawer.Protected";
    guard: "boolean条件";
    behavior: "条件不一致時にアンカールートへリダイレクト";
  };

  features: {
    nesting: "階層的アクセス制御";
    fallback: "カスタムフォールバック画面";
    loading: "認証状態読み込み中の処理";
  };

  navigators: ["Stack", "Tabs", "Drawer", "Custom"];

  constraints: {
    duplication: "画面は1つのアクティブグループのみ";
    clientSide: "クライアントサイド保護のみ";
    static: "静的レンダリングでHTMLファイル非生成";
  };

  bestPractices: [
    "条件付きグループで画面重複回避",
    "サーバーサイド認証も実装",
    "ローディング状態の提供",
    "明確なフォールバック",
    "包括的な認証ロジック"
  ];
}
```

**実装例**：

```typescript
// app/_layout.tsx
const { isLoggedIn, isAdmin, isLoading } = useAuth();

if (isLoading) {
  return <LoadingScreen />;
}

return (
  <Stack>
    <Stack.Screen name="index" />

    <Stack.Protected guard={!isLoggedIn}>
      <Stack.Screen name="login" />
    </Stack.Protected>

    <Stack.Protected guard={isLoggedIn}>
      <Stack.Screen name="(protected)" />

      <Stack.Protected guard={isAdmin}>
        <Stack.Screen name="(admin)" />
      </Stack.Protected>
    </Stack.Protected>
  </Stack>
);
```

**詳細ドキュメント**: [`protected.md`](./router/advanced/protected.md)

## 🌐 プラットフォーム固有機能

### プラットフォーム固有モジュール

```typescript
interface PlatformSpecificModules {
  methods: {
    extensions: {
      supported: [".android.tsx", ".ios.tsx", ".web.tsx"];
      requirement: "ベースファイル必須（ディープリンク対応）";
      structure: `
        app/
        ├── about.tsx        # ベースファイル
        └── about.web.tsx    # Web専用
      `;
    };

    platformModule: {
      import: "react-native Platform";
      usage: "Platform.OS または Platform.select()";
      conditions: "if (Platform.OS === 'web')";
    };
  };

  patterns: {
    layout: "Webではスタック、モバイルではタブ";
    styling: "プラットフォーム固有スタイル";
    imports: "条件付きコンポーネントインポート";
  };

  bestPractices: [
    "Expo Router 3.5.x+では拡張子を優先",
    "Platformモジュールは柔軟な代替手段",
    "コードの再利用を最大化",
    "すべてのプラットフォームでテスト実施"
  ];

  recommendation: {
    expo35Plus: "プラットフォーム固有拡張子";
    smallDifferences: "Platformモジュール";
    sharedLogic: "共通ロジックの分離";
  };
}
```

**実装例**：

```typescript
// Platformモジュールの使用
import { Platform } from 'react-native';

export default function Layout() {
  if (Platform.OS === 'web') {
    return (
      <div>
        <Slot />
      </div>
    );
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}

// プラットフォーム固有スタイル
const styles = StyleSheet.create({
  container: {
    padding: Platform.select({
      ios: 20,
      android: 16,
      web: 12,
    }),
  },
});
```

**詳細ドキュメント**: [`platform-specific-modules.md`](./router/advanced/platform-specific-modules.md)

### 共有ルート

```typescript
interface SharedRoutes {
  purpose: "複数のナビゲーショングループ間でルート共有";

  methods: {
    groupMethod: {
      approach: "重複する子ルートを持つルートグループ";
      structure: `
        app/
        ├── (home)/
        │   └── [user].tsx
        ├── (search)/
        │   └── [user].tsx
        └── (profile)/
            └── [user].tsx
      `;
      navigation: "グループ名を使用してナビゲート";
    };

    arrayMethod: {
      syntax: "(,)";
      structure: `
        app/
        ├── (home,search,profile)/
        │   └── [user].tsx
        ├── (home)/
        │   └── index.tsx
        └── (search)/
            └── index.tsx
      `;
      distinction: "useSegments()でグループ判断";
    };
  };

  limitations: {
    scope: "現在のナビゲーターのグループのみ";
    nesting: "最後のグループセグメントのみ使用";
    initialRoute: "最初のグループのものがデフォルト";
  };

  useCases: [
    "タブ間でユーザープロフィール共有",
    "動的レイアウト",
    "グループ区別"
  ];
}
```

**配列方法の実装**：

```typescript
// app/(home,search,profile)/[user].tsx
import { useLocalSearchParams, useSegments } from 'expo-router';

export default function UserScreen() {
  const { user } = useLocalSearchParams();
  const segments = useSegments();
  const group = segments[0]; // グループ判断

  return (
    <View>
      <Text>User: {user}</Text>
      <Text>From: {group}</Text>
    </View>
  );
}
```

**詳細ドキュメント**: [`shared-routes.md`](./router/advanced/shared-routes.md)

### Webモーダル

```typescript
interface WebModals {
  availability: "Expo SDK 54以降";
  purpose: "Web専用のモーダルエクスペリエンス";

  presentations: [
    "modal",              // 中央オーバーレイ
    "formSheet",          // ボトムシート
    "transparentModal",   // 透過オーバーレイ
    "containedTransparentModal"
  ];

  customization: {
    webModalStyle: {
      size: "width, height, maxWidth, maxHeight";
      position: "top, left";
      border: "border, borderRadius";
      shadow: "boxShadow";
      overlay: "backgroundColor, onPress";
    };

    sheet: {
      detents: ["fitToContents", "all", "large", "medium"];
      cornerRadius: number;
      grabberVisible: boolean;
    };

    anchor: {
      purpose: "ネストされたナビゲーターにアンカリング";
      usage: "anchor: '/home'";
    };
  };

  responsive: {
    mediaQueries: "CSSメディアクエリ対応";
    platformSelect: "Platform.select()";
  };

  css: {
    variables: "--expo-router-modal-*";
    classes: "カスタムクラス追加可能";
  };
}
```

**カスタマイズ例**：

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      width: '90vw',
      height: '85vh',
      maxWidth: 1000,
      border: 'none',
      borderRadius: 16,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    },
    sheetAllowedDetents: 'fitToContents',
    sheetCornerRadius: 16,
  }}
/>
```

**詳細ドキュメント**: [`web-modals.md`](./router/advanced/web-modals.md)

## 🔧 高度な設定

### ルーター設定

```typescript
interface RouterSettings {
  unstableSettings: {
    status: "実験的機能";
    compatibility: "非同期ルートでは機能しない";
    purpose: "スタックのデフォルト画面設定";
  };

  initialRouteName: {
    property: "initialRouteName";
    requirement: "有効なファイル名と一致";
    behavior: "ディープリンク時のみ適用";
    purpose: "ディープリンク時の戻るボタン提供";
  };

  structure: {
    simple: `
      export const unstable_settings = {
        initialRouteName: 'index',
      };
    `;

    grouped: `
      export const unstable_settings = {
        initialRouteName: 'first',
        bar: {
          initialRouteName: 'second',
        },
      };
    `;

    nested: `
      export const unstable_settings = {
        initialRouteName: 'index',
        tabs: {
          initialRouteName: 'home',
          settings: {
            initialRouteName: 'profile',
          },
        },
      };
    `;
  };

  disable: {
    link: "initial={false}";
    router: "overrideInitialScreen: false";
  };

  limitations: {
    asyncRoutes: "非同期ルートで機能しない";
    application: "ディープリンク時のみ";
    override: "通常のアプリフローは上書きしない";
  };
}
```

**実装パターン**：

```typescript
// パターン1: シンプルなアプリ
export const unstable_settings = {
  initialRouteName: 'index',
};

// パターン2: タブ付きアプリ
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// パターン3: 認証フロー
export const unstable_settings = {
  initialRouteName: '(public)',
  authenticated: {
    initialRouteName: 'home',
  },
};
```

**詳細ドキュメント**: [`router-settings.md`](./router/advanced/router-settings.md)

## 🎨 ネイティブ統合

### Apple Handoff

```typescript
interface AppleHandoff {
  purpose: "Appleデバイス間でのシームレスな作業継続";
  api: "iOS NSUserActivity";

  requirements: {
    compatibility: "開発ビルドまたはスタンドアロンビルド";
    universalLinks: "ユニバーサルリンク設定必須";
    component: "expo-router/head必須";
  };

  setup: {
    aasa: {
      path: ".well-known/apple-app-site-association";
      content: {
        applinks: "アプリリンク設定";
        activitycontinuation: "アクティビティ継続設定";
      };
    };

    config: {
      origin: "https://yourdomain.com";
      associatedDomains: [
        "applinks:yourdomain.com",
        "activitycontinuation:yourdomain.com"
      ];
    };

    prebuild: "npx expo prebuild -p ios --clean";
  };

  implementation: {
    meta: {
      handoff: "expo:handoff";
      title: "og:title";
      description: "og:description";
      url: "og:url";
    };

    example: `
      <Head>
        <meta property="expo:handoff" content="true" />
        <meta property="og:title" content="Product Details" />
        <meta property="og:url" content="https://example.com/products/123" />
      </Head>
    `;
  };

  useCases: [
    "Eコマース: 商品閲覧の継続",
    "ニュース: 記事の継続読み",
    "タスク管理: タスクの継続編集"
  ];

  limitations: {
    webToNative: "制限あり";
    https: "HTTPS必須";
    expoGo: "動作しない";
  };
}
```

**詳細ドキュメント**: [`apple-handoff.md`](./router/advanced/apple-handoff.md)

### ネイティブインテント

```typescript
interface NativeIntent {
  purpose: "ディープリンクとネイティブインテントのカスタマイズ";

  scenarios: {
    appClosed: "外部ディープリンクURLの書き換え";
    appOpen: "ビジネスロジックに基づくURL変換";
  };

  implementation: {
    file: "+native-intent.tsx";
    function: "redirectSystemPath()";
    parameters: {
      path: string;
      initial: boolean;
    };
  };

  features: {
    urlRewriting: {
      thirdParty: "サードパーティURL変換";
      marketing: "マーケティングURL変換";
      error: "エラーシナリオ処理";
    };

    tracking: {
      analytics: "ナビゲーションイベント追跡";
      providers: ["Firebase", "Mixpanel", "Amplitude"];
    };

    universalLinks: {
      multiple: "複数ドメインサポート";
      processing: "ドメインごとの処理";
    };
  };

  webHandling: {
    server: "サーバーリダイレクト（推奨）";
    client: "クライアントリダイレクト";
  };

  experimental: {
    legacySubscribe: "レガシー統合用";
    usage: "router.legacy_subscribe()";
  };
}
```

**実装例**：

```typescript
// app/+native-intent.tsx
export function redirectSystemPath({ path, initial }) {
  // サードパーティURLの変換
  if (path === 'summer-sale') {
    return '/products/category/summer';
  }

  // エラー処理
  if (path === 'malformed-url') {
    return '/error';
  }

  // 初回起動時の処理
  if (initial) {
    return '/';
  }

  return path;
}
```

**詳細ドキュメント**: [`native-intent.md`](./router/advanced/native-intent.md)

## 🏗️ アーキテクチャパターン

### ネストされたナビゲーター

```typescript
interface NestedNavigators {
  concept: "ナビゲーター内のナビゲーター";
  base: "React Navigation ネストナビゲーター";

  patterns: {
    twoLevel: {
      structure: "Stack → Tabs";
      example: `
        app/
        ├── _layout.tsx (Stack)
        └── home/
            ├── _layout.tsx (Tabs)
            ├── feed.tsx
            └── messages.tsx
      `;
    };

    threeLevel: {
      structure: "Stack → Tabs → Stack";
      example: `
        app/
        ├── _layout.tsx (Stack)
        └── (tabs)/
            ├── _layout.tsx (Tabs)
            └── home/
                ├── _layout.tsx (Stack)
                ├── index.tsx
                └── details.tsx
      `;
    };
  };

  navigation: {
    expoRouter: "router.push('/home/details')";
    reactNavigation: "navigation.navigate('root', { screen: 'settings' })";
    advantage: "シンプルなパスベースナビゲーション";
  };

  screenOptions: {
    parent: "親ナビゲーターでヘッダー表示";
    child: "子ナビゲーターでヘッダー非表示";
    customization: "各レベルで個別カスタマイズ";
  };

  bestPractices: [
    "ネストは2-3レベルまで",
    "ヘッダーの重複回避",
    "明確なファイル構造",
    "Route Groupsの活用"
  ];

  dynamicRoutes: {
    support: true;
    structure: "posts/[id]/comments";
    navigation: "router.push('/posts/123/comments')";
  };
}
```

**複雑なネスト例**：

```typescript
// app/_layout.tsx (レベル1: Stack)
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
</Stack>

// app/(tabs)/_layout.tsx (レベル2: Tabs)
<Tabs>
  <Tabs.Screen name="home" options={{ headerShown: false }} />
</Tabs>

// app/(tabs)/home/_layout.tsx (レベル3: Stack)
<Stack>
  <Stack.Screen name="index" options={{ title: 'Home' }} />
  <Stack.Screen name="details" options={{ title: 'Details' }} />
</Stack>
```

**詳細ドキュメント**: [`nesting-navigators.md`](./router/advanced/nesting-navigators.md)

## 🎯 実装パターンとベストプラクティス

### モーダル実装戦略

```typescript
interface ModalImplementationStrategy {
  decisionMatrix: {
    reactNativeModal: {
      useCases: [
        "一時的なアラート",
        "確認ダイアログ",
        "簡単なフォーム",
        "スタンドアロンインタラクション"
      ];
      advantages: [
        "シンプルな実装",
        "軽量",
        "高速"
      ];
      limitations: [
        "ディープリンク非対応",
        "ナビゲーション履歴なし"
      ];
    };

    expoRouterModal: {
      useCases: [
        "ディープリンク対応",
        "パラメータ付きモーダル",
        "ナビゲーション統合",
        "カスタムヘッダー"
      ];
      advantages: [
        "ディープリンク対応",
        "ナビゲーション履歴",
        "プラットフォーム固有動作"
      ];
      considerations: [
        "やや複雑な設定",
        "レイアウトファイル必要"
      ];
    };
  };

  crossPlatform: {
    android: "スライドアップ、戻るボタン対応";
    ios: "スライドアップ、スワイプダウン対応";
    web: "手動閉じるロジック実装";
  };

  bestPractices: [
    "適切なモーダルタイプ選択",
    "明確な閉じるボタン提供",
    "Web戻るボタンサポート",
    "プラットフォーム固有動作考慮"
  ];
}
```

### 認証アーキテクチャ

```typescript
interface AuthenticationArchitecture {
  patterns: {
    standard: {
      structure: "SessionProvider → Protected Routes";
      redirect: "<Redirect /> コンポーネント";
      flow: "未認証 → sign-in → 認証済み → (app)";
    };

    modal: {
      structure: "Stack → Modal sign-in";
      presentation: "modal";
      flow: "アプリ → sign-in modal → 認証後閉じる";
    };

    rewrites: {
      structure: "Context + Route Groups + Slot";
      advantage: "高度な制御";
      flow: "認証状態で動的ルート表示";
    };
  };

  storage: {
    mobile: {
      library: "expo-secure-store";
      security: "暗号化ストレージ";
    };
    web: {
      api: "localStorage";
      consideration: "セキュリティ制限";
    };
  };

  tokenManagement: {
    validation: "トークン有効期限確認";
    refresh: "自動リフレッシュメカニズム";
    revocation: "即座のトークン無効化";
  };

  security: [
    "セキュアストレージ使用",
    "トークン検証実装",
    "エラーハンドリング",
    "ローディング状態表示",
    "サーバーサイド認証併用"
  ];
}
```

### ナビゲーション選択ガイド

```typescript
interface NavigationSelectionGuide {
  stack: {
    useCases: [
      "階層的画面遷移",
      "詳細ページナビゲーション",
      "モーダル表示"
    ];
    advantages: [
      "戻るボタン自動対応",
      "画面履歴管理",
      "アニメーション豊富"
    ];
  };

  tabs: {
    javascript: {
      useCases: ["主要セクション切り替え", "5タブ以下"];
      advantages: ["完全カスタマイズ", "クロスプラットフォーム"];
    };
    native: {
      useCases: ["ネイティブ感重視", "パフォーマンス優先"];
      advantages: ["優れたパフォーマンス", "プラットフォームネイティブUI"];
      limitations: ["カスタマイズ制限", "実験的機能"];
    };
    custom: {
      useCases: ["独自デザイン", "複雑なインタラクション"];
      advantages: ["完全制御", "柔軟性"];
      considerations: ["実装複雑", "SDK 52以降"];
    };
  };

  drawer: {
    useCases: [
      "多数のナビゲーション項目",
      "サイドメニュー",
      "設定・ツール"
    ];
    advantages: [
      "スペース効率",
      "カスタマイズ可能",
      "階層的構造"
    ];
  };

  decisionTree: `
    主要セクション（5以下）
      ├→ モバイル主体 → Native Tabs
      ├→ Web主体 → JavaScript Tabs
      └→ カスタムデザイン → Custom Tabs

    階層的画面遷移
      └→ Stack Navigator

    多数のオプション
      └→ Drawer Navigator

    一時的表示
      └→ Modal
  `;
}
```

### パフォーマンス最適化

```typescript
interface PerformanceOptimization {
  navigation: {
    lazy: "遅延読み込みで初期ロード高速化";
    memoization: "React.memo()で再レンダリング削減";
    callbacks: "useCallback()でコールバック最適化";
  };

  modals: {
    lightweight: "軽量なモーダル実装";
    lazyRender: "表示時のみレンダリング";
    cleanup: "閉じた後のクリーンアップ";
  };

  tabs: {
    detach: "非アクティブタブのデタッチ";
    preload: "主要タブの事前読み込み";
    icons: "アイコンの最適化";
  };

  nesting: {
    depth: "ネスト深度の制限（2-3レベル）";
    headers: "ヘッダー重複回避";
    rendering: "効率的なレンダリング戦略";
  };
}
```

## 🔗 関連リソース

### 内部リンク - ナビゲーション

- [`modals.md`](./router/advanced/modals.md) - モーダル実装
- [`stack.md`](./router/advanced/stack.md) - Stackナビゲーター
- [`tabs.md`](./router/advanced/tabs.md) - JavaScriptタブ
- [`drawer.md`](./router/advanced/drawer.md) - Drawerナビゲーション
- [`native-tabs.md`](./router/advanced/native-tabs.md) - ネイティブタブ
- [`custom-tabs.md`](./router/advanced/custom-tabs.md) - カスタムタブ

### 内部リンク - 認証とセキュリティ

- [`authentication.md`](./router/advanced/authentication.md) - 認証実装
- [`authentication-rewrites.md`](./router/advanced/authentication-rewrites.md) - リライトパターン
- [`protected.md`](./router/advanced/protected.md) - 保護されたルート

### 内部リンク - プラットフォームと設定

- [`platform-specific-modules.md`](./router/advanced/platform-specific-modules.md) - プラットフォーム固有
- [`shared-routes.md`](./router/advanced/shared-routes.md) - 共有ルート
- [`web-modals.md`](./router/advanced/web-modals.md) - Webモーダル
- [`router-settings.md`](./router/advanced/router-settings.md) - ルーター設定

### 内部リンク - ネイティブ統合

- [`apple-handoff.md`](./router/advanced/apple-handoff.md) - Apple Handoff
- [`native-intent.md`](./router/advanced/native-intent.md) - ネイティブインテント
- [`nesting-navigators.md`](./router/advanced/nesting-navigators.md) - ネストナビゲーター

### 関連ドキュメント

- **[Expo Router 基礎](../router/)** - ルーティング基礎
- **[Navigation](../navigation/)** - ナビゲーション概念
- **[Deep Linking](../deep-linking/)** - ディープリンク実装

## 📋 まとめ

Expo Router Advanced は、モバイルおよびWebアプリケーションのための包括的な高度ナビゲーション機能を提供します：

```typescript
interface ExpoRouterAdvancedSummary {
  strengths: [
    "豊富なナビゲーションオプション（Stack、Tabs、Drawer）",
    "包括的な認証システム（保護ルート、リライト）",
    "プラットフォーム固有対応（iOS、Android、Web）",
    "ネイティブ統合（Apple Handoff、Native Intent）",
    "高度なアーキテクチャ（ネスト、カスタムタブ）",
    "柔軟なモーダル実装"
  ];

  useCases: [
    "エンタープライズアプリケーション",
    "マルチプラットフォームアプリ",
    "認証必須アプリ",
    "複雑なナビゲーション階層",
    "ネイティブ統合アプリ"
  ];

  nextSteps: [
    "プロジェクト要件の分析",
    "適切なナビゲーションパターン選択",
    "認証アーキテクチャ設計",
    "プラットフォーム固有機能の実装",
    "パフォーマンス最適化"
  ];

  considerations: {
    experimental: [
      "ネイティブタブ（SDK 54+）",
      "カスタムタブ（SDK 52+）",
      "ルーター設定（unstable_settings）"
    ];
    platforms: "iOS、Android、Webで動作確認必須";
    performance: "ネスト深度とモーダル使用の最適化";
    security: "クライアント側認証とサーバー側認証の併用";
  };
}
```

このガイドを参考に、プロジェクトの要件に応じた最適な高度ナビゲーション機能を実装してください。各機能の詳細は、個別のドキュメントを参照してください。
