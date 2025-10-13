# Expo Routerのインストール

Expo Routerをプロジェクトにインストールする方法を説明します。

## クイックスタート

### 1. 新しいExpoアプリを作成

```bash
npx create-expo-app@latest
```

このコマンドは、Expo Routerがすでに設定された新しいExpoプロジェクトを作成します。

### 2. プロジェクトを開始

```bash
npx expo start
```

#### 開発方法

- **Expo Go**: 初期開発に推奨
- **Webブラウザ**: `w`キーを押してWebブラウザで開く
- **Android**: `a`キーを押してAndroidエミュレーターで開く
- **iOS**: `i`キーを押してiOSシミュレーターで開く

## 手動インストール

既存のプロジェクトにExpo Routerを手動でインストールする場合は、以下の手順に従ってください。

### 前提条件

コンピューターがExpoアプリ開発用に設定されていることを確認してください。

### 依存関係のインストール

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

**インストールされるパッケージ**：

- **`expo-router`**: Expo Routerのコアパッケージ
- **`react-native-safe-area-context`**: セーフエリアのサポート
- **`react-native-screens`**: ネイティブナビゲーション
- **`expo-linking`**: ディープリンクのサポート
- **`expo-constants`**: アプリの定数
- **`expo-status-bar`**: ステータスバーの管理

## 設定

### 1. package.jsonの更新

`package.json`の`main`フィールドを更新します：

```json
{
  "main": "expo-router/entry"
}
```

#### カスタムエントリーポイント（オプション）

サービスを初期化する必要がある場合は、カスタムエントリーポイントを作成できます：

```javascript
// index.js
import 'expo-router/entry';
```

### 2. アプリ設定の変更

`app.json`に`scheme`を追加します：

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

**schemeの役割**：
- ディープリンクのURLスキーム
- アプリを開くためのカスタムURLを定義

**例**：
```
myapp://profile/123
```

#### Web開発用の追加依存関係

Webプラットフォームで開発する場合は、追加の依存関係をインストールします：

```bash
npx expo install react-native-web react-dom
```

#### Metro Web bundlerの有効化

`app.json`でMetro Web bundlerを有効にします：

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

### 3. babel.config.jsの更新

`babel.config.js`を更新します：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

**重要**：`babel-preset-expo`は、Expo Routerに必要なプラグインを自動的に含めます。

### 4. バンドラーキャッシュのクリア

設定後、バンドラーキャッシュをクリアします：

```bash
npx expo start --clear
```

### 5. 古いYarn resolutions/npm overridesの削除

`package.json`から古い`resolutions`または`overrides`フィールドを削除します。

## プロジェクト構造

### 基本構造

```
my-app/
├── app/
│   ├── _layout.tsx     # ルートレイアウト
│   ├── index.tsx       # ホームページ
│   └── about.tsx       # Aboutページ
├── assets/             # 画像やフォント
├── components/         # 共有コンポーネント
├── app.json            # Expo設定
├── package.json        # 依存関係
└── tsconfig.json       # TypeScript設定
```

### appディレクトリ

`app`ディレクトリは、ルーティング構造を定義します。

**例**：

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}

// app/index.tsx
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}
```

## TypeScript設定

### tsconfig.jsonの作成

プロジェクトのルートに`tsconfig.json`を作成します：

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### 型の自動生成

Expo Routerは、ルートの型を自動生成します。

**使用例**：

```typescript
import { router } from 'expo-router';

// 型安全なナビゲーション
router.push('/profile/123');
```

## 開発ビルドの推奨

### 開発ビルドとは

開発ビルドは、カスタムネイティブコードを含む開発用のビルドです。

### いつ使用するか

- カスタムネイティブモジュールを追加する場合
- Expo Goでサポートされていないライブラリを使用する場合
- アプリの複雑さが増した場合

### 開発ビルドの作成

```bash
# expo-dev-clientをインストール
npx expo install expo-dev-client

# 開発ビルドを作成
npx expo run:android
npx expo run:ios
```

## トラブルシューティング

### エントリーポイントが見つからない

#### 症状

`Cannot find entry point` エラーが表示されます。

#### 解決策

`package.json`の`main`フィールドが正しく設定されているか確認してください：

```json
{
  "main": "expo-router/entry"
}
```

### schemeが設定されていない

#### 症状

ディープリンクが機能しません。

#### 解決策

`app.json`に`scheme`を追加してください：

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

### バンドラーキャッシュの問題

#### 症状

変更が反映されません。

#### 解決策

バンドラーキャッシュをクリアしてください：

```bash
npx expo start --clear
```

### 依存関係の競合

#### 症状

依存関係のバージョンが競合します。

#### 解決策

`npx expo install`を使用して、互換性のあるバージョンをインストールしてください：

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

## ベストプラクティス

### 1. Expo Goから開始

初期開発では、Expo Goを使用してください。

### 2. 開発ビルドに移行

アプリの複雑さが増したら、開発ビルドを作成してください。

### 3. TypeScriptを使用

TypeScriptを使用して、型安全性を確保してください。

### 4. 設定を慎重に確認

設定手順を慎重に確認してください。

## 次のステップ

### 1. コアコンセプトを学ぶ

Expo Routerのコアコンセプトを学びます。

### 2. ナビゲーションを実装

ファイルベースルーティングを使用して、ナビゲーションを実装します。

### 3. レイアウトを作成

共通のレイアウトを作成します。

### 4. ディープリンクをテスト

ディープリンクをテストして、正しく動作することを確認します。

## サンプルコード

### 基本的なナビゲーション

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}

// app/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Link href="/about">Go to About</Link>
    </View>
  );
}

// app/about.tsx
import { View, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>About Screen</Text>
    </View>
  );
}
```

### タブナビゲーション

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f4511e',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## まとめ

Expo Routerのインストールは簡単で、新規プロジェクトでも既存プロジェクトでもすぐに始められます。クイックスタート方法を使用すると、すべての設定が自動的に行われます。手動インストールの場合は、設定手順を慎重に確認してください。
