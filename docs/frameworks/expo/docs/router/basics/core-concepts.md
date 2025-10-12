# Expo Routerのコアコンセプト

Expo Routerの基本的な概念と原則を理解します。

## ファイルベースルーティングの原則

Expo Routerは、ファイルシステムの構造に基づいてルーティングを定義します。

### 基本ルール

1. **appディレクトリ**: すべての画面とページは`app`ディレクトリ内のファイルです
2. **ユニークなURL**: すべてのファイルは、ユニークなURLを持つ異なるページを表します
3. **初期ルート**: 最初の`index.tsx`が初期ルートになります
4. **ルートレイアウト**: ルート`_layout.tsx`が従来の`App.jsx/tsx`を置き換えます

### プロジェクト構造の例

```
app/
  index.tsx           # 初期ルート（/）
  home.tsx            # /home ルート
  _layout.tsx         # ルートレイアウト
  profile/
    friends.tsx       # /profile/friends ルート

components/           # ルート以外のコンポーネント
  TextField.tsx
  Toolbar.tsx
```

## ナビゲーションの原則

### ユニバーサルディープリンク

すべてのページには、ユニバーサルディープリンクURLがあります。

**例**：

```
myapp://home
myapp://profile/friends
https://myapp.com/home
https://myapp.com/profile/friends
```

### URLとファイルの対応

URLは、`app`ディレクトリ内のファイルの場所と一致します。

**例**：

| ファイル | URL |
|---------|-----|
| `app/index.tsx` | `/` |
| `app/home.tsx` | `/home` |
| `app/profile/friends.tsx` | `/profile/friends` |
| `app/settings/account.tsx` | `/settings/account` |

### コンポーネントの配置

ナビゲーション以外のコンポーネントは、`app`ディレクトリの外に配置してください。

**例**：

```
app/                 # ルート定義
  index.tsx
  home.tsx

components/          # 共有コンポーネント
  Button.tsx
  Header.tsx
  TextField.tsx
```

## React Navigationとの関係

Expo Routerは、React Navigationの上に構築されています。

### 互換性

- React Navigationのすべての設定オプションと互換性があります
- React Navigationの知識を活用できます
- 既存のReact Navigationコードを段階的に移行できます

### 変換

Expo Routerは、ファイル構造をReact Navigationコンポーネントに変換します。

**例**：

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

上記のコードは、React Navigationの`createStackNavigator`に相当します。

## ルートグループ

ルートグループを使用して、デフォルトのナビゲーション動作を変更できます。

### 括弧を使用したグループ化

括弧を使用して、URL構造に影響を与えずにルートをグループ化します。

**例**：

```
app/
  (tabs)/
    index.tsx      # / ルート
    home.tsx       # /home ルート
    profile.tsx    # /profile ルート
  _layout.tsx
```

この場合、`(tabs)`はURL構造に含まれません。

### グループの利点

- **論理的な整理**: 関連するルートをグループ化
- **共通レイアウト**: グループ内のルートに共通レイアウトを適用
- **URL構造の制御**: URL構造に影響を与えずに整理

## クロスプラットフォームナビゲーション

Expo Routerは、Webとモバイルでシームレスにナビゲーションをサポートします。

### Webサポート

- ブラウザの戻る/進むボタンが機能
- URLバーでの直接ナビゲーション
- ブックマークとリンク共有

### モバイルサポート

- ネイティブナビゲーションアニメーション
- ディープリンクサポート
- プラットフォーム固有のUI

## ルートの定義

### 静的ルート

ファイル名がそのままURLになります。

**例**：

```typescript
// app/about.tsx
export default function AboutScreen() {
  return <Text>About Screen</Text>;
}
```

URL: `/about`

### 動的ルート

角括弧を使用して、動的ルートを定義します。

**例**：

```typescript
// app/users/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();
  return <Text>User {id}</Text>;
}
```

URL: `/users/123`, `/users/bacon`, など

### インデックスルート

`index.tsx`は、ディレクトリのデフォルトルートを定義します。

**例**：

```typescript
// app/profile/index.tsx
export default function ProfileScreen() {
  return <Text>Profile</Text>;
}
```

URL: `/profile`

## レイアウトファイル

`_layout.tsx`ファイルは、ルート間の関係を定義します。

### ルートレイアウト

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
```

### ネストされたレイアウト

```typescript
// app/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
```

## 特殊なルート

### 404ルート

`+not-found.tsx`は、マッチしないルートを処理します。

**例**：

```typescript
// app/+not-found.tsx
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View>
      <Text>This screen doesn't exist.</Text>
      <Link href="/">Go to home screen</Link>
    </View>
  );
}
```

### HTMLカスタマイズ

`+html.tsx`は、WebのHTMLボイラープレートをカスタマイズします。

**例**：

```typescript
// app/+html.tsx
export default function CustomHTML() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>My App</title>
      </head>
      <body>
        <div id="root" />
      </body>
    </html>
  );
}
```

## ベストプラクティス

### 1. 明確なファイル構造

論理的なファイル構造を維持してください。

**推奨**：

```
app/
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    index.tsx
    profile.tsx
  _layout.tsx
```

### 2. コンポーネントの分離

ルートとコンポーネントを明確に分離してください。

**推奨**：

```
app/            # ルート定義
components/     # 共有コンポーネント
hooks/          # カスタムフック
utils/          # ユーティリティ関数
```

### 3. レイアウトの活用

共通レイアウトを活用して、コードの重複を避けてください。

### 4. 動的ルートの使用

動的ルートを使用して、柔軟なナビゲーションを実現してください。

## よくある質問

### Q: app/ディレクトリの外にファイルを配置できますか？

A: はい、推奨されます。ナビゲーション以外のコンポーネントは、`app`ディレクトリの外に配置してください。

### Q: React Navigationの知識は必要ですか？

A: 必須ではありませんが、React Navigationの知識があると、より高度なカスタマイズができます。

### Q: Webとモバイルで異なるナビゲーションを使用できますか？

A: はい、プラットフォーム固有のコードを使用して、異なるナビゲーションを実装できます。

### Q: ルートグループは必須ですか？

A: いいえ、オプションです。複雑なナビゲーション構造を整理する際に便利です。

## まとめ

Expo Routerのコアコンセプトは、以下の原則に基づいています：

1. **ファイルベースルーティング**: ファイル構造がルーティング構造を定義
2. **ユニバーサルディープリンク**: すべてのページに自動的にディープリンクを設定
3. **React Navigation互換**: React Navigationの上に構築
4. **クロスプラットフォーム**: Webとモバイルでシームレスなナビゲーション
5. **柔軟性**: ルートグループと特殊なルートで高度なカスタマイズが可能

これらの原則を理解することで、Expo Routerを効果的に使用して、モダンなReact Nativeアプリケーションを構築できます。
