# TypeScriptを使用する

ExpoアプリでTypeScriptを統合し、型安全な開発環境を構築する方法を学びます。

## 概要

Expoは、TypeScriptに対するファーストクラスのサポートを提供しています。

**主な機能**：
- 自動型生成
- Expo SDKライブラリの完全な型サポート
- 設定ファイルでのTypeScript使用
- 厳密な型チェック
- パスエイリアスのサポート

**互換性**：
- すべてのExpoプロジェクト ✅
- Expo Go ✅
- Development builds ✅

## 新規プロジェクトの作成

### TypeScriptテンプレートから作成

```bash
# 新規TypeScriptプロジェクトを作成
npx create-expo-app@latest my-app

cd my-app
```

**デフォルトで含まれるもの**：
- TypeScript設定（`tsconfig.json`）
- 型定義のインストール
- `.tsx`ファイル拡張子

## 既存プロジェクトの移行

### ステップ1: TypeScriptのインストール

```bash
# TypeScriptと型定義をインストール
npx expo install typescript @types/react @types/react-native

# または、npmで
npm install --save-dev typescript @types/react @types/react-native
```

### ステップ2: ファイルの名前変更

```bash
# JavaScriptファイルをTypeScriptにリネーム
# .js → .ts (JSXなし)
# .jsx → .tsx (JSXあり)

# 例
mv App.js App.tsx
mv src/utils/helpers.js src/utils/helpers.ts
mv src/components/Button.jsx src/components/Button.tsx
```

### ステップ3: tsconfig.jsonの生成

```bash
# 開発サーバーを起動すると自動生成
npx expo start

# または、手動で生成
npx expo customize tsconfig.json
```

## tsconfig.json設定

### 基本設定

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 厳密な型チェックを有効化

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### パスエイリアスの設定

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

**使用例**：
```typescript
// パスエイリアスを使用
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { ApiClient } from '@utils/api';

// 相対パスの代わりに
// import { Button } from '../../../components/Button';
```

## 型定義

### Expo SDKライブラリの自動型生成

```typescript
// Expoライブラリは自動的に型を提供
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';

// 型推論が機能する
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1,
});

if (!result.canceled) {
  // result.assetsの型が自動的に推論される
  console.log(result.assets[0].uri);
}
```

### カスタム型定義

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### コンポーネントの型定義

```typescript
// src/components/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
}

export function Button({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  icon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## 設定ファイルでのTypeScript使用

### app.config.ts

```typescript
// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My App',
  slug: 'my-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mycompany.myapp',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.mycompany.myapp',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    apiUrl: process.env.API_URL,
  },
});
```

### metro.config.ts

```typescript
// metro.config.ts
import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver?.assetExts || []), 'db', 'mp3', 'ttf'],
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
};

export default config;
```

## React Hooksの型定義

### useState

```typescript
import { useState } from 'react';

// 型推論
const [count, setCount] = useState(0); // number型

// 明示的な型定義
const [user, setUser] = useState<User | null>(null);

// 複雑な状態
interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const [form, setForm] = useState<FormState>({
  email: '',
  password: '',
  rememberMe: false,
});
```

### useEffect

```typescript
import { useEffect } from 'react';

// 副作用関数の型定義
useEffect(() => {
  // クリーンアップ関数
  const subscription = subscribeToData();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### useRef

```typescript
import { useRef } from 'react';
import { TextInput } from 'react-native';

// DOM要素への参照
const inputRef = useRef<TextInput>(null);

// 任意の値への参照
const countRef = useRef<number>(0);

// 使用例
const focusInput = () => {
  inputRef.current?.focus();
};
```

### カスタムフック

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初期化処理
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const user = await loginWithCredentials(email, password);
    setUser(user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return { user, isLoading, login, logout };
}
```

## APIレスポンスの型定義

### 基本的なAPI型

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiError {
  error: string;
  statusCode: number;
  details?: Record<string, string[]>;
}
```

### API関数の型定義

```typescript
// utils/api.ts
import { ApiResponse, PaginatedResponse, ApiError } from '@types/api';

export async function fetchUser(userId: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}

export async function fetchUsers(
  page: number = 1
): Promise<PaginatedResponse<User>> {
  const response = await fetch(`/api/users?page=${page}`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}
```

## ナビゲーションの型定義

### Expo Routerの型定義

```typescript
// types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
  Post: { postId: string; title: string };
};

// 使用例
import { useRouter } from 'expo-router';

export function HomeScreen() {
  const router = useRouter();

  const navigateToProfile = (userId: string) => {
    router.push({
      pathname: '/profile',
      params: { userId },
    });
  };

  return (
    // コンポーネント
  );
}
```

## ベストプラクティス

### 1. 厳密な型チェック

```typescript
// ✅ 推奨: 厳密な型定義
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(): User {
  return {
    id: '123',
    email: 'user@example.com',
    name: 'John Doe',
  };
}

// ❌ 非推奨: any型の使用
function getUserBad(): any {
  return {
    id: '123',
    email: 'user@example.com',
  };
}
```

### 2. 型推論の活用

```typescript
// ✅ 推奨: 型推論を活用
const numbers = [1, 2, 3, 4, 5]; // number[]型が推論される
const doubled = numbers.map((n) => n * 2); // number[]型が推論される

// 明示的な型定義は不要な場合が多い
const user = {
  name: 'John',
  age: 30,
}; // { name: string; age: number } が推論される
```

### 3. null/undefinedのハンドリング

```typescript
// ✅ 推奨: オプショナルチェイニングとnullish coalescing
interface User {
  name: string;
  email?: string;
  profile?: {
    bio?: string;
  };
}

function getUserEmail(user: User | null): string {
  return user?.email ?? 'No email provided';
}

function getUserBio(user: User | null): string {
  return user?.profile?.bio ?? 'No bio';
}
```

### 4. 型ガード

```typescript
// 型ガード関数
function isUser(value: any): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.email === 'string'
  );
}

// 使用例
function processValue(value: unknown) {
  if (isUser(value)) {
    // この時点でvalueはUser型
    console.log(value.email);
  }
}
```

### 5. ユーティリティ型の活用

```typescript
// Partial: すべてのプロパティをオプショナルに
type PartialUser = Partial<User>;

// Required: すべてのプロパティを必須に
type RequiredUser = Required<User>;

// Pick: 特定のプロパティのみを選択
type UserEmailOnly = Pick<User, 'email'>;

// Omit: 特定のプロパティを除外
type UserWithoutEmail = Omit<User, 'email'>;

// Record: キーと値の型を指定
type UserMap = Record<string, User>;
```

## トラブルシューティング

### 問題1: 型エラーが表示される

**原因**: 型定義が正しくインストールされていない

**解決策**：
```bash
# 型定義を再インストール
npx expo install typescript @types/react @types/react-native

# node_modulesをクリーンアップ
rm -rf node_modules
npm install
```

### 問題2: パスエイリアスが機能しない

**原因**: tsconfig.jsonの設定が正しくない

**解決策**：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Metro設定も更新**：
```typescript
// metro.config.ts
import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': __dirname + '/src',
};

export default config;
```

### 問題3: app.config.tsが読み込まれない

**原因**: tsx/cjs requireフックが必要

**解決策**：
```bash
# 開発サーバーを再起動
npx expo start --clear
```

### 問題4: 型チェックが遅い

**原因**: strictNullChecksやその他の厳密な型チェックが有効

**解決策**：
```json
{
  "compilerOptions": {
    // skipLibCheckを有効にして高速化
    "skipLibCheck": true,

    // incrementalを有効にしてキャッシュを活用
    "incremental": true
  }
}
```

## 開発ワークフロー

### 型チェック

```bash
# 型エラーをチェック
npx tsc --noEmit

# ウォッチモードで型チェック
npx tsc --noEmit --watch
```

### エディタ設定

**VS Code**（推奨）：
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## まとめ

ExpoのTypeScriptサポートは、以下の機能を提供します：

### 主な機能
- **ファーストクラスサポート**: Expoプロジェクトでネイティブにサポート
- **自動型生成**: Expo SDKライブラリの完全な型サポート
- **設定ファイル対応**: app.config.tsとmetro.config.tsでTypeScript使用可能
- **厳密な型チェック**: strict modeでの開発をサポート

### セットアップ
- 新規プロジェクト: `npx create-expo-app@latest`で自動セットアップ
- 既存プロジェクト: 3ステップで簡単に移行可能
- tsconfig.json: `expo/tsconfig.base`を拡張

### ベストプラクティス
- 厳密な型定義を使用
- 型推論を活用
- null/undefinedを適切にハンドル
- 型ガードとユーティリティ型を活用
- パスエイリアスでインポートを簡潔に

### パフォーマンス最適化
- `skipLibCheck`で型チェックを高速化
- `incremental`でキャッシュを活用
- パスエイリアスの使いすぎに注意

これらのパターンを活用して、型安全で保守性の高いExpoアプリを構築できます。
