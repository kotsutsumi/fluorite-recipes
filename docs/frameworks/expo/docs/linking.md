# Expo Linking - 包括的リンク設定ガイド

## 📋 概要

Expo Linking は、アプリ内外のナビゲーションを実現する包括的なリンクシステムです。ディープリンク、ユニバーサルリンク、カスタムスキームを統合し、シームレスなユーザーエクスペリエンスを提供します。

```typescript
interface ExpoLinkingSystem {
  strategies: {
    universalLinks: UniversalLinks;
    deepLinks: DeepLinks;
    outgoingLinks: OutgoingLinks;
  };
  platforms: {
    ios: IOSUniversalLinks;
    android: AndroidAppLinks;
  };
  implementation: {
    routing: ExpoRouter;
    api: LinkingAPI;
    testing: URIScheme;
  };
}
```

## 🔗 リンク戦略

### 1. ユニバーサルリンク（Universal Links）

```typescript
interface UniversalLinks {
  purpose: "Webドメインリンクでアプリをシームレスにオープン";
  protocols: ["https", "http"];

  platforms: {
    ios: {
      name: "Universal Links";
      requirement: "Apple App Site Association (AASA)ファイル";
      domain: "HTTPSドメイン必須";
    };
    android: {
      name: "App Links";
      requirement: "Digital Asset Linksファイル";
      domain: "HTTPSドメイン必須";
      autoVerify: true;
    };
  };

  advantages: [
    "アプリ未インストール時のWebフォールバック",
    "クリック時に常にアプリをオープン",
    "標準的なHTTP(S)スキーム使用",
    "ユーザーエクスペリエンスの向上",
  ];

  useCases: [
    "マーケティングキャンペーン",
    "メール内リンク",
    "ソーシャルメディア共有",
    "Web-to-App遷移",
  ];
}
```

**実装パターン**：

```typescript
// iOS Universal Linksの例
interface iOSUniversalLinkExample {
  webUrl: "https://example.com/products/123";
  appRoute: "/products/123";
  fallback: "https://example.com/products/123 (アプリ未インストール時)";
}

// Android App Linksの例
interface AndroidAppLinkExample {
  webUrl: "https://example.com/records/456";
  appRoute: "/records/456";
  fallback: "https://example.com/records/456 (アプリ未インストール時)";
}
```

**詳細ドキュメント**：
- [`ios-universal-links.md`](./linking/ios-universal-links.md) - iOS実装ガイド
- [`android-app-links.md`](./linking/android-app-links.md) - Android実装ガイド

### 2. ディープリンク（Deep Links）

```typescript
interface DeepLinks {
  purpose: "カスタムスキームでアプリ内特定コンテンツへ誘導";
  schemeFormat: "myapp://path/to/content";

  structure: {
    scheme: {
      example: "myapp://";
      description: "アプリ固有の識別子";
      configuration: "app.json の scheme フィールド";
    };
    host: {
      example: "web-app.com";
      description: "オプションのホスト名";
      usage: "複数アプリ間の識別";
    };
    path: {
      example: "/product/123";
      description: "アプリ内のルート";
      mapping: "Expo Routerのファイル構造";
    };
    queryParams: {
      example: "?id=123&ref=email";
      description: "追加パラメータ";
      parsing: "Linking.parse()で抽出";
    };
  };

  advantages: [
    "簡単な実装",
    "柔軟なスキーム設計",
    "開発・テストが容易",
  ];

  limitations: [
    "アプリインストール必須",
    "未インストール時は機能しない",
    "スキームの競合可能性",
  ];

  expoGoLimitations: {
    defaultScheme: "exp://";
    production: "開発ビルド使用推奨";
    testing: "限定的サポート";
  };
}
```

**スキーム設定例**：

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

**URL解析例**：

```typescript
import * as Linking from 'expo-linking';

// URLの解析
const parsedUrl = Linking.parse('myapp://home/details?id=123');

interface ParsedURL {
  scheme: "myapp";
  hostname: "home";
  path: "details";
  queryParams: {
    id: "123";
  };
}
```

**詳細ドキュメント**: [`into-your-app.md`](./linking/into-your-app.md)

### 3. 他のアプリへのリンク（Outgoing Links）

```typescript
interface OutgoingLinks {
  purpose: "他のアプリやWebサイトを開く";

  methods: {
    linkingAPI: {
      import: "expo-linking";
      method: "Linking.openURL()";
      usage: "プログラマティックなURL起動";
    };
    expoRouter: {
      component: "Link";
      usage: "宣言的なリンク";
      navigation: "アプリ内外の両方に対応";
    };
  };

  commonSchemes: {
    web: {
      https: "https://example.com";
      http: "http://example.com";
      target: "Webブラウザアプリ";
    };
    email: {
      mailto: "mailto:support@example.com";
      target: "メールアプリ";
    };
    phone: {
      tel: "tel:+1234567890";
      target: "電話アプリ";
    };
    sms: {
      sms: "sms:+1234567890";
      target: "SMSアプリ";
    };
    custom: {
      example: "uber://pickup";
      target: "カスタムスキーム対応アプリ";
    };
  };

  inAppBrowser: {
    package: "expo-web-browser";
    purpose: "アプリ内でWebコンテンツ表示";
    useCases: [
      "OAuth認証フロー",
      "利用規約表示",
      "外部コンテンツプレビュー",
    ];
  };
}
```

**実装例**：

```typescript
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

// Linking APIでURLを開く
const openExternalURL = async (url: string) => {
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
};

// アプリ内ブラウザでURLを開く
const openInAppBrowser = async (url: string) => {
  await WebBrowser.openBrowserAsync(url);
};

// 一般的な使用例
interface OutgoingLinkExamples {
  web: () => openExternalURL('https://expo.dev');
  email: () => openExternalURL('mailto:support@expo.dev');
  phone: () => openExternalURL('tel:+1234567890');
  sms: () => openExternalURL('sms:+1234567890');
  inApp: () => openInAppBrowser('https://expo.dev/terms');
}
```

**詳細ドキュメント**: [`into-other-apps.md`](./linking/into-other-apps.md)

## 🍎 iOS Universal Links

### 設定手順

```typescript
interface IOSUniversalLinksSetup {
  step1: {
    task: "Apple App Site Association (AASA)ファイル作成";
    location: "public/.well-known/apple-app-site-association";
    format: AASAFileFormat;
  };

  step2: {
    task: "AASAファイルのHTTPSホスティング";
    url: "https://example.com/.well-known/apple-app-site-association";
    requirements: [
      "HTTPSプロトコル必須",
      "Content-Type: application/json",
      "ファイル拡張子なし",
      "ルートまたは.well-knownディレクトリ",
    ];
  };

  step3: {
    task: "ネイティブアプリ設定";
    location: "app.json";
    configuration: IOSAssociatedDomains;
  };

  optional: {
    smartBanner: AppleSmartBanner;
  };
}
```

### AASAファイル構造

```typescript
interface AASAFileFormat {
  applinks: {
    details: Array<{
      appID: string; // "TEAM_ID.BUNDLE_ID"
      paths: string[]; // ["/records/*", "NOT /admin/*"]
    }>;
  };
}

// 実装例
const aasaExample: AASAFileFormat = {
  applinks: {
    details: [{
      appID: "QQ57RJ5UTD.com.example.myapp",
      paths: [
        "/records/*",        // /recordsで始まるすべてのパス
        "/products/*/details", // 特定のパターン
        "NOT /admin/*"       // 除外パターン
      ]
    }]
  }
};
```

### アプリ設定

```typescript
interface IOSAssociatedDomains {
  expo: {
    ios: {
      associatedDomains: string[]; // ["applinks:example.com"]
    };
  };
}

// app.json設定例
const iosConfig = {
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:expo.dev",
        "applinks:www.expo.dev",
        "applinks:staging.expo.dev"
      ]
    }
  }
};
```

### Apple Smart Banner

```typescript
interface AppleSmartBanner {
  purpose: "Safari上でアプリダウンロードバナー表示";
  implementation: "HTMLメタタグ";
  location: "Webサイトの<head>セクション";

  metaTag: {
    name: "apple-itunes-app";
    content: "app-id=<ITUNES_ID>";
  };
}

// HTMLでの実装
const smartBannerHTML = `
<meta name="apple-itunes-app" content="app-id=123456789" />
`;
```

### デバッグとテスト

```typescript
interface IOSUniversalLinksDebug {
  validation: {
    tools: [
      "Apple App Site Association Validator",
      "Universal Links Validator",
      "Branch AASA Validator",
    ];
    curlCheck: "curl -I https://example.com/.well-known/apple-app-site-association";
  };

  testing: {
    methods: [
      "Safariでリンク長押し",
      "メモアプリにリンク貼り付け",
      "メールからリンクタップ",
    ];
    notWorking: "Safari URL直接入力では機能しない";
  };

  troubleshooting: {
    caching: {
      issue: "iOSはAASAファイルをキャッシュ";
      solution: "デバイス再起動でキャッシュクリア";
    };
    https: {
      issue: "HTTPSが必須";
      solution: "証明書の有効性確認";
    };
    appID: {
      issue: "Team IDとBundle IDの不一致";
      solution: "Apple Developer Accountで確認";
    };
  };

  tunnel: {
    command: "EXPO_TUNNEL_SUBDOMAIN=myapp npx expo start --tunnel";
    purpose: "ローカル開発でのHTTPS URL提供";
  };
}
```

**詳細ドキュメント**: [`ios-universal-links.md`](./linking/ios-universal-links.md)

## 🤖 Android App Links

### 設定手順

```typescript
interface AndroidAppLinksSetup {
  step1: {
    task: "Intent Filtersの追加";
    location: "app.json";
    configuration: AndroidIntentFilters;
  };

  step2: {
    task: "Digital Asset Linksファイル作成";
    location: "public/.well-known/assetlinks.json";
    format: AssetLinksFormat;
  };

  step3: {
    task: "双方向関連付けの確立";
    verification: "Android自動ドメイン検証";
  };
}
```

### Intent Filters設定

```typescript
interface AndroidIntentFilters {
  action: "VIEW";
  autoVerify: boolean;
  data: Array<{
    scheme: string;
    host: string;
    pathPrefix?: string;
  }>;
  category: string[];
}

// app.json設定例
const androidConfig = {
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "*.webapp.io",
              "pathPrefix": "/records"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
};
```

### Digital Asset Linksファイル

```typescript
interface AssetLinksFormat {
  relation: string[];
  target: {
    namespace: "android_app";
    package_name: string;
    sha256_cert_fingerprints: string[];
  };
}

// assetlinks.json実装例
const assetLinksExample: AssetLinksFormat[] = [{
  relation: ["delegate_permission/common.handle_all_urls"],
  target: {
    namespace: "android_app",
    package_name: "com.example.myapp",
    sha256_cert_fingerprints: [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ]
  }
}];
```

### SHA256フィンガープリント取得

```typescript
interface SHA256Fingerprint {
  methods: {
    keystore: {
      command: "keytool -list -v -keystore my-release-key.keystore";
      target: "リリース用keystore";
    };
    googlePlay: {
      location: "Google Play Console";
      path: "Setup > App Integrity > App signing";
    };
  };

  types: {
    debugKey: "開発・テスト用";
    releaseKey: "本番リリース用";
    playSigningKey: "Google Play署名用";
  };
}
```

### デバッグとテスト

```typescript
interface AndroidAppLinksDebug {
  validation: {
    domainVerification: {
      command: "adb shell pm get-app-links com.example.myapp";
      purpose: "ドメイン検証状態確認";
    };
    intentTest: {
      command: "adb shell am start -W -a android.intent.action.VIEW -d 'https://webapp.io/records' com.example.myapp";
      purpose: "App Linksの動作テスト";
    };
  };

  troubleshooting: {
    https: {
      issue: "HTTPSが必須";
      solution: "Webサイトの証明書確認";
    };
    assetLinks: {
      issue: "assetlinks.json未検出";
      solution: [
        "HTTPSでアクセス可能か確認",
        "JSON形式の正当性確認",
        "パッケージ名の一致確認",
      ];
    };
    fingerprint: {
      issue: "SHA256フィンガープリント不一致";
      solution: "debug/release/play signing keyの確認";
    };
  };

  tunnel: {
    command: "EXPO_TUNNEL_SUBDOMAIN=myapp npx expo start --tunnel";
    purpose: "ローカル開発でのHTTPS URL提供";
  };
}
```

**詳細ドキュメント**: [`android-app-links.md`](./linking/android-app-links.md)

## 🛠️ Linking API実装

### URL処理

```typescript
interface LinkingAPI {
  useURL: {
    hook: "Linking.useURL()";
    purpose: "着信リンクのリアルタイム検出";
    returnType: "string | null";
  };

  parse: {
    method: "Linking.parse(url)";
    purpose: "URL構造の解析";
    returnType: ParsedURL;
  };

  openURL: {
    method: "Linking.openURL(url)";
    purpose: "外部URLの起動";
    returnType: "Promise<void>";
  };

  canOpenURL: {
    method: "Linking.canOpenURL(url)";
    purpose: "URLを開けるか確認";
    returnType: "Promise<boolean>";
  };
}

interface ParsedURL {
  scheme?: string;
  hostname?: string;
  path?: string;
  queryParams?: Record<string, string>;
}
```

### 実装例

```typescript
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';

// 着信URLの処理
export function DeepLinkHandler() {
  const url = Linking.useURL();
  const [parsedData, setParsedData] = useState<ParsedURL | null>(null);

  useEffect(() => {
    if (url) {
      const parsed = Linking.parse(url);
      setParsedData(parsed);

      console.log('着信リンク検出:', {
        url,
        hostname: parsed.hostname,
        path: parsed.path,
        params: parsed.queryParams,
      });

      // ルーティングロジック
      handleNavigation(parsed);
    }
  }, [url]);

  return (
    <View>
      <Text>現在のURL: {url || 'なし'}</Text>
      {parsedData && (
        <View>
          <Text>ホスト: {parsedData.hostname}</Text>
          <Text>パス: {parsedData.path}</Text>
          <Text>パラメータ: {JSON.stringify(parsedData.queryParams)}</Text>
        </View>
      )}
    </View>
  );
}

// ナビゲーション処理
function handleNavigation(parsed: ParsedURL) {
  const { hostname, path, queryParams } = parsed;

  // Expo Routerと連携した例
  if (path === '/products' && queryParams?.id) {
    // router.push(`/products/${queryParams.id}`);
  }
}

// 外部URLを開く
export function ExternalLinkButton() {
  const openWebsite = async () => {
    const url = 'https://expo.dev';
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.error('URLを開けません:', url);
    }
  };

  return (
    <Button title="Webサイトを開く" onPress={openWebsite} />
  );
}
```

## 🧪 テストとデバッグ

### URI Schemeテストツール

```typescript
interface URISchemeTest {
  tool: "npx uri-scheme";

  commands: {
    ios: {
      command: "npx uri-scheme open myapp://somepath/details --ios";
      target: "iOSシミュレーター";
    };
    android: {
      command: "npx uri-scheme open myapp://somepath/details --android";
      target: "Androidエミュレーター";
    };
  };

  verification: {
    appLaunch: "アプリが起動するか確認";
    urlParsing: "URLが正しく解析されるか確認";
    navigation: "適切な画面に遷移するか確認";
  };
}
```

### デバッグコマンド

```bash
# iOSでディープリンクをテスト
npx uri-scheme open myapp://home/details?id=123 --ios

# Androidでディープリンクをテスト
npx uri-scheme open myapp://home/details?id=123 --android

# Universal Linksをテスト（iOS）
xcrun simctl openurl booted https://example.com/products/123

# App Linksをテスト（Android）
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://example.com/products/123" com.example.myapp
```

### トラブルシューティング

```typescript
interface LinkingTroubleshooting {
  deepLinks: {
    notWorking: {
      checks: [
        "app.json の scheme 設定確認",
        "開発ビルド使用（Expo Go不可）",
        "アプリの再ビルドと再インストール",
        "URLスキーム構文の確認",
      ];
    };
  };

  universalLinks: {
    ios: {
      checks: [
        "AASAファイルのHTTPSアクセス確認",
        "appID（Team ID + Bundle ID）の正確性",
        "パスパターンの一致確認",
        "iOSキャッシュのクリア（再起動）",
        "Safari以外からのテスト（メモ、メール）",
      ];
    };
    android: {
      checks: [
        "assetlinks.json のHTTPSアクセス確認",
        "SHA256フィンガープリントの正確性",
        "Intent Filters設定の確認",
        "ドメイン検証の成功確認",
        "アプリの再ビルドと再インストール",
      ];
    };
  };

  expoGo: {
    limitation: "Expo Goは exp:// スキームのみサポート";
    solution: "本番環境では開発ビルド使用";
  };
}
```

## 🎯 実装パターンとベストプラクティス

### Expo Routerとの統合

```typescript
interface ExpoRouterIntegration {
  advantages: [
    "ファイルベースルーティングで自動リンク生成",
    "Type-safe なナビゲーション",
    "URLパラメータの自動抽出",
    "ディープリンクの簡単な処理",
  ];

  fileStructure: {
    example: `
      app/
      ├── (tabs)/
      │   ├── index.tsx        // myapp://
      │   ├── products.tsx     // myapp://products
      │   └── settings.tsx     // myapp://settings
      ├── products/
      │   └── [id].tsx         // myapp://products/123
      └── _layout.tsx
    `;
  };

  implementation: `
    // app/products/[id].tsx
    import { useLocalSearchParams } from 'expo-router';

    export default function ProductDetails() {
      const { id } = useLocalSearchParams<{ id: string }>();

      // URLパラメータの自動取得
      return <ProductView productId={id} />;
    }
  `;
}
```

### アトリビューションサービス統合

```typescript
interface AttributionServices {
  purpose: "ディープリンクとアトリビューションの統合管理";

  providers: {
    branch: {
      name: "Branch";
      features: [
        "ユニバーサルリンク",
        "ディープリンク",
        "アトリビューション",
        "Web-to-App",
      ];
      integration: "expo-branch";
    };
    adjust: {
      name: "Adjust";
      features: [
        "アプリアトリビューション",
        "キャンペーントラッキング",
        "詐欺防止",
      ];
      integration: "adjust-react-native-sdk";
    };
    appsFlyer: {
      name: "AppsFlyer";
      features: [
        "モバイルアトリビューション",
        "ディープリンク",
        "アナリティクス",
      ];
      integration: "react-native-appsflyer";
    };
  };

  useCases: [
    "マーケティングキャンペーン追跡",
    "ユーザー獲得ソース分析",
    "アプリ未インストール時のフォールバック",
    "動的リンク生成",
  ];
}
```

### セキュリティベストプラクティス

```typescript
interface LinkingSecurityBestPractices {
  validation: {
    urlValidation: {
      practice: "着信URLの検証";
      implementation: `
        function isValidDeepLink(url: string): boolean {
          const parsed = Linking.parse(url);
          const allowedSchemes = ['myapp', 'https'];
          const allowedHosts = ['example.com', 'www.example.com'];

          return (
            allowedSchemes.includes(parsed.scheme || '') &&
            allowedHosts.includes(parsed.hostname || '')
          );
        }
      `;
    };

    parameterSanitization: {
      practice: "URLパラメータのサニタイズ";
      implementation: `
        function sanitizeParams(params: Record<string, string>) {
          return Object.entries(params).reduce((acc, [key, value]) => {
            // XSS対策：特殊文字のエスケープ
            const sanitized = value.replace(/[<>'"]/g, '');
            return { ...acc, [key]: sanitized };
          }, {});
        }
      `;
    };
  };

  https: {
    requirement: "Universal/App Linksは必ずHTTPS";
    rationale: "中間者攻撃の防止";
  };

  sensitiveData: {
    avoid: "URLに機密情報を含めない";
    alternatives: [
      "セッショントークン経由のデータ取得",
      "サーバー側での認証確認",
      "暗号化されたペイロード使用",
    ];
  };
}
```

### アナリティクス統合

```typescript
interface LinkingAnalytics {
  tracking: {
    linkOpens: {
      event: "deep_link_opened";
      properties: {
        scheme: string;
        path: string;
        source?: string;
        campaign?: string;
      };
    };
    navigation: {
      event: "deep_link_navigation";
      properties: {
        destination: string;
        params: Record<string, string>;
      };
    };
  };

  implementation: `
    import * as Linking from 'expo-linking';
    import Analytics from './analytics';

    function useDeepLinkTracking() {
      const url = Linking.useURL();

      useEffect(() => {
        if (url) {
          const parsed = Linking.parse(url);

          Analytics.track('deep_link_opened', {
            scheme: parsed.scheme,
            path: parsed.path,
            source: parsed.queryParams?.utm_source,
            campaign: parsed.queryParams?.utm_campaign,
          });
        }
      }, [url]);
    }
  `;
}
```

## 📋 チェックリスト

### 実装チェックリスト

```typescript
interface ImplementationChecklist {
  基本設定: [
    "✅ app.json に scheme を追加",
    "✅ カスタムスキームのテスト",
    "✅ Linking.useURL() の実装",
    "✅ URL解析ロジックの実装",
    "✅ ナビゲーション処理の実装",
  ];

  iOS_Universal_Links: [
    "✅ Team IDとBundle IDの確認",
    "✅ AASAファイルの作成",
    "✅ HTTPSでのAASAホスティング",
    "✅ app.json に associatedDomains 追加",
    "✅ AASAファイルの検証",
    "✅ 実機でのテスト",
  ];

  Android_App_Links: [
    "✅ パッケージ名の確認",
    "✅ SHA256フィンガープリントの取得",
    "✅ assetlinks.json の作成",
    "✅ HTTPSでの assetlinks.json ホスティング",
    "✅ app.json に intentFilters 追加",
    "✅ ドメイン検証の確認",
    "✅ 実機でのテスト",
  ];

  セキュリティ: [
    "✅ URL検証の実装",
    "✅ パラメータのサニタイズ",
    "✅ HTTPS使用の確認",
    "✅ 機密情報の除外",
  ];

  テスト: [
    "✅ uri-scheme でのローカルテスト",
    "✅ 実機でのディープリンクテスト",
    "✅ Universal/App Linksの動作確認",
    "✅ フォールバック動作の確認",
    "✅ エラーハンドリングの確認",
  ];

  本番環境: [
    "✅ 開発ビルドの使用",
    "✅ 本番証明書でのビルド",
    "✅ アトリビューションサービス統合",
    "✅ アナリティクス実装",
    "✅ ドキュメント作成",
  ];
}
```

## 🔗 関連リソース

### 内部リンク

- [overview.md](./linking/overview.md) - リンクシステム概要
- [into-your-app.md](./linking/into-your-app.md) - ディープリンク実装
- [into-other-apps.md](./linking/into-other-apps.md) - 他アプリへのリンク
- [ios-universal-links.md](./linking/ios-universal-links.md) - iOS Universal Links
- [android-app-links.md](./linking/android-app-links.md) - Android App Links

### Expo APIリファレンス

- [expo-linking](https://docs.expo.dev/versions/latest/sdk/linking/) - Linking API ドキュメント
- [expo-web-browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/) - Web Browser API
- [expo-router](https://docs.expo.dev/router/introduction/) - Expo Router ガイド

### 外部ツール

- [Branch AASA Validator](https://branch.io/resources/aasa-validator/) - AASA検証ツール
- [Universal Links Tester](https://limitless-sierra-4673.herokuapp.com/) - Universal Links検証
- [Digital Asset Links Tester](https://developers.google.com/digital-asset-links/tools/generator) - Android検証ツール

### 関連ドキュメント

- **[Expo Router](../router/)** - ルーティングとナビゲーション
- **[EAS Build](../build/)** - ネイティブビルド設定
- **[Configuration](../config/)** - アプリ設定管理

## 📋 まとめ

Expo Linking は、モバイルアプリのナビゲーションを実現する包括的なシステムです：

```typescript
interface ExpoLinkingSummary {
  strengths: [
    "柔軟なリンク戦略（Universal/Deep/Outgoing）",
    "クロスプラットフォーム対応（iOS/Android）",
    "Expo Routerとのシームレスな統合",
    "包括的なテストツール",
    "セキュリティベストプラクティス",
  ];

  useCases: [
    "マーケティングキャンペーン",
    "ユーザーオンボーディング",
    "コンテンツ共有",
    "アプリ間連携",
    "OAuth認証フロー",
  ];

  keyDecisions: {
    universalVsDeep: {
      universal: "本番環境推奨（Webフォールバック付き）";
      deep: "開発・テスト環境で使用";
    };

    implementation: {
      simple: "expo-linking API単体";
      advanced: "Expo Router + アトリビューションサービス";
    };
  };

  nextSteps: [
    "プロジェクトに適したリンク戦略の選択",
    "iOS/Android設定の実装",
    "テストとデバッグの実施",
    "セキュリティ対策の適用",
    "本番環境へのデプロイ",
  ];
}
```

このガイドを参考に、アプリの要件に応じた最適なリンク設定を実装してください。ユニバーサルリンク、ディープリンク、カスタムスキームを適切に組み合わせることで、シームレスなユーザーエクスペリエンスを実現できます。
