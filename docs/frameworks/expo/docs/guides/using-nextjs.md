# Next.jsとExpoを使用する

Expo for WebとNext.jsを統合し、React NativeコンポーネントをWeb上で共有する方法を学びます。

## 概要

Next.jsとExpoを組み合わせることで、モバイル（React Native）とWeb（Next.js）間でReactコンポーネントとAPIを共有できます。

**重要な制限**：
```
Next.jsはExpo for Webでのみ使用できます。
ネイティブアプリでは、Server-Side Rendering（SSR）がサポートされていないためです。
```

**主な利点**：
- コードの共有（モバイルとWeb間）
- 統一されたコンポーネントライブラリ
- React NativeとNext.jsのベストプラクティスを組み合わせ

## セットアップ方法

### 方法1: テンプレートを使用（推奨）

```bash
# Next.jsテンプレートからExpoアプリを作成
npx create-expo-app -e with-nextjs my-app

cd my-app
```

このテンプレートには以下が含まれます：
- Expo（モバイル）とNext.js（Web）の設定
- 共有コンポーネント
- 設定済みのビルドスクリプト

**開発サーバーの起動**：
```bash
# ネイティブアプリ（iOS/Android）
npx expo start

# Webアプリ（Next.js）
npx next dev
```

### 方法2: 手動セットアップ

#### ステップ1: 依存関係のインストール

```bash
# Next.jsとExpo Next Adapterをインストール
npm install next @expo/next-adapter

# または
yarn add next @expo/next-adapter
```

#### ステップ2: Next.js設定

**next.config.js**:
```javascript
const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  // React NativeパッケージのトランスパイルReact Nativeパッケージのトランスパイル
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    // 追加のExpoパッケージ
    'expo-constants',
    'expo-linking',
    // カスタムパッケージ
    '@my-company/my-package',
  ],

  // SWCトランスフォームを強制（推奨）
  experimental: {
    forceSwcTransforms: true,
  },
});
```

#### ステップ3: React Native Webスタイリングの追加

**pages/_document.js**:
```javascript
import { Children } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { AppRegistry } from 'react-native';

// Expo Webで使用されるAppRegistryコンポーネント名に合わせる必要があります
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent('main', () => Main);
    const { getStyleElement } = AppRegistry.getApplication('main');
    const page = await renderPage();
    const styles = [
      <style key="normalize-next" dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
      getStyleElement(),
    ];
    return { ...page, styles: Children.toArray(styles) };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

**pages/_app.js**:
```javascript
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
```

## プロジェクト構造

### 推奨される構造

```
my-app/
├── app/                    # Expo Router（ネイティブ）
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── pages/                  # Next.js（Web）
│   ├── _app.js
│   ├── _document.js
│   ├── index.tsx
│   └── profile.tsx
├── components/             # 共有コンポーネント
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Layout.tsx
├── hooks/                  # 共有フック
│   ├── useAuth.ts
│   └── useData.ts
├── lib/                    # 共有ユーティリティ
│   ├── api.ts
│   └── utils.ts
├── next.config.js          # Next.js設定
├── app.json                # Expo設定
└── package.json
```

## 共有コンポーネントの作成

### プラットフォーム非依存コンポーネント

```typescript
// components/Button.tsx
import { Pressable, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### プラットフォーム固有の拡張子

```typescript
// components/Header.native.tsx（モバイル用）
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Mobile Header</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
```

```typescript
// components/Header.web.tsx（Web用）
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Web Header</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#0070F3',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
  },
});
```

**使用例**：
```typescript
// どちらのプラットフォームでも同じimport文
import Header from '@/components/Header';

// プラットフォームに応じて適切なファイルが自動的に選択される
export default function HomeScreen() {
  return <Header />;
}
```

## ルーティング

### Expo Router（ネイティブ）

```typescript
// app/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
      <Link href="/profile">Go to Profile</Link>
    </View>
  );
}
```

### Next.js（Web）

```typescript
// pages/index.tsx
import Link from 'next/link';
import { View, Text } from 'react-native';

export default function HomePage() {
  return (
    <View>
      <Text>Home Page</Text>
      <Link href="/profile">Go to Profile</Link>
    </View>
  );
}
```

### 共有ナビゲーションロジック

```typescript
// hooks/useNavigation.ts
import { useRouter as useExpoRouter } from 'expo-router';
import { useRouter as useNextRouter } from 'next/router';
import { Platform } from 'react-native';

export function useNavigation() {
  const expoRouter = Platform.OS !== 'web' ? useExpoRouter() : null;
  const nextRouter = Platform.OS === 'web' ? useNextRouter() : null;

  const navigate = (path: string) => {
    if (Platform.OS === 'web') {
      nextRouter?.push(path);
    } else {
      expoRouter?.push(path);
    }
  };

  return { navigate };
}
```

## スタイリング

### React Native StyleSheet

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

### レスポンシブスタイリング

```typescript
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width < 768 ? 10 : 20,
  },
  title: {
    fontSize: Platform.select({
      web: 32,
      default: 24,
    }),
  },
});
```

## データフェッチング

### 共有APIクライアント

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

export async function fetchUser(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}
```

### カスタムフック

```typescript
// hooks/useUser.ts
import { useEffect, useState } from 'react';
import { fetchUser } from '@/lib/api';

export function useUser(userId: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading, error };
}
```

## デプロイ

### Vercel（推奨）

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

**vercel.json**（オプション）:
```json
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
```

**package.json**にビルドスクリプトを追加：
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export"
  }
}
```

## トラブルシューティング

### 問題1: モジュールがトランスパイルされない

**症状**: "Unexpected token" または "Cannot use import statement outside a module"

**解決策**：
```javascript
// next.config.js
module.exports = withExpo({
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    // 問題のあるパッケージを追加
    '@my-org/problematic-package',
  ],
});
```

### 問題2: スタイルが適用されない

**原因**: `_document.js`でReact Native Webスタイルが正しく設定されていない

**解決策**：
- `_document.js`のセットアップを確認
- `AppRegistry.registerComponent`が正しく呼ばれていることを確認

### 問題3: 設定変更が反映されない

**解決策**：
```bash
# キャッシュをクリアしてサーバーを再起動
rm -rf .next
npm run dev
```

## 制限事項

### Next.js App Directoryはサポートされていない

Next.jsの実験的なApp Directoryはサポートされていません。Pages Routerを使用してください。

### ネイティブルーティングの推奨

ネイティブアプリでは、Next.jsの代わりにExpo Routerを使用することを推奨します。

## ベストプラクティス

### 1. プラットフォーム固有のコードを分離

```typescript
// ✅ 推奨: 拡張子で分離
// Button.native.tsx
// Button.web.tsx

// ❌ 非推奨: 条件分岐
import { Platform } from 'react-native';

function Button() {
  if (Platform.OS === 'web') {
    // Web固有のコード
  } else {
    // ネイティブ固有のコード
  }
}
```

### 2. 共有ロジックを抽出

```typescript
// hooks/useAuthHook.ts
export function useAuth() {
  // プラットフォーム非依存の認証ロジック
}
```

### 3. TypeScriptを使用

```typescript
// 型安全なコンポーネント
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({ title, onPress, disabled }: ButtonProps) {
  // ...
}
```

### 4. 環境変数の管理

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_API_URL=https://api.example.com
```

## まとめ

Next.jsとExpoの統合は、以下の機能を提供します：

### 主な機能
- **コード共有**: React NativeコンポーネントをWeb上で使用
- **統一API**: モバイルとWebで共有されたビジネスロジック
- **プラットフォーム固有の最適化**: 各プラットフォームに最適化されたコード

### セットアップオプション
- **テンプレート**: `npx create-expo-app -e with-nextjs`
- **手動設定**: `@expo/next-adapter`を使用

### 制限事項
- Next.jsはWebでのみ使用可能（SSRなし）
- App Directoryはサポートされていない
- ネイティブルーティングにはExpo Routerを推奨

### ベストプラクティス
- プラットフォーム固有のコードを分離
- 共有ロジックを抽出
- TypeScriptで型安全性を確保
- 適切なデプロイ戦略（Vercel推奨）

これらのパターンを活用して、モバイルとWeb間でコードを効率的に共有できます。
