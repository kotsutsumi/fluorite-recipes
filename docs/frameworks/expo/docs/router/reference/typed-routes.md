# 型付きルート

Expo Routerで型付きルートを使用する方法を学びます。

## 型付きルートとは

型付きルートは、TypeScriptプロジェクトで自動的に型を生成する機能です。Expo CLIが静的に型付けされたリンクとルートナビゲーションを可能にします。

**要件**: TypeScriptプロジェクト

## セットアップ

### クイックスタート

Expo Routerのクイックスタートで作成されたプロジェクトは、事前に設定されています。

```bash
npx create-expo-app@latest
npx expo start
```

型は、`npx expo start`実行時に自動生成されます。

### 手動設定

既存プロジェクトで型付きルートを有効にする場合：

#### 1. app.jsonの設定

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

#### 2. tsconfig.jsonのカスタマイズ

```bash
npx expo customize tsconfig.json
```

これにより、適切な型定義が含まれたtsconfig.jsonが生成されます。

## 主な機能

### 静的に型付けされたルートナビゲーション

```typescript
import { Link } from 'expo-router';

export default function Page() {
  return (
    <>
      {/* ✅ 有効なルート */}
      <Link href="/about" />
      <Link href="/user/1" />
      <Link href={`/user/${id}`} />

      {/* ❌ 無効なルート - TypeScriptエラー */}
      <Link href="/usser/1" />
    </>
  );
}
```

### 命令的ナビゲーション

```typescript
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();

  const navigate = () => {
    // ✅ 型チェックされる
    router.push('/about');
    router.replace('/user/123');

    // ❌ TypeScriptエラー
    router.push('/invalid-route');
  };

  return <Button title="Navigate" onPress={navigate} />;
}
```

### hrefプロパティの自動補完

IDEで`href`プロパティの自動補完が機能します。

```typescript
<Link href=" // Ctrl+Space で自動補完
```

## 型付きルートパラメータ

### ルートパラメータの型

```typescript
import { useLocalSearchParams } from 'expo-router';

// app/users/[id].tsx
export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>User ID: {id}</Text>;
}
```

### クエリパラメータの型

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
  const params = useLocalSearchParams<{
    query?: string;
    filter?: string;
  }>();

  return (
    <View>
      <Text>Query: {params.query}</Text>
      <Text>Filter: {params.filter}</Text>
    </View>
  );
}
```

## 生成される型定義

### expo-env.d.ts

Expo CLIは、`expo-env.d.ts`ファイルを生成します。

**生成されるファイル**：
```
.expo/
└── types/
    └── router.d.ts
```

**型定義の例**：
```typescript
declare module 'expo-router' {
  export type Route =
    | '/'
    | '/about'
    | '/user/[id]'
    | '/(tabs)/home'
    | '/(tabs)/profile';
}
```

## 制限事項

### 相対パスは未サポート

相対パスはサポートされていません。

```typescript
// ❌ 動作しない
<Link href="../about" />

// ✅ 絶対パスを使用
<Link href="/about" />
```

**推奨**: 複雑なルーティングには`useSegments()`を使用してください。

```typescript
import { useSegments, router } from 'expo-router';

export default function Page() {
  const segments = useSegments();

  const navigateUp = () => {
    // セグメントから親ルートを構築
    const parentPath = '/' + segments.slice(0, -1).join('/');
    router.push(parentPath);
  };

  return <Button title="Go Up" onPress={navigateUp} />;
}
```

## 型チェックの例

### 有効なルート

```typescript
// すべて型チェックされる
<Link href="/" />
<Link href="/about" />
<Link href="/user/123" />
<Link href="/posts/[id]" />
<Link href="/(tabs)/home" />
```

### 無効なルート

```typescript
// TypeScriptエラーが発生
<Link href="/invalid" /> // エラー: 存在しないルート
<Link href="/usr/123" /> // エラー: タイプミス
```

### 動的ルート

```typescript
// ✅ 正しい
const id = '123';
<Link href={`/user/${id}`} />

// ✅ 正しい
<Link href={{ pathname: '/user/[id]', params: { id: '123' } }} />
```

## ベストプラクティス

### 1. 型定義を最新に保つ

開発サーバーを実行して、型定義を自動的に更新します。

```bash
npx expo start
```

### 2. 絶対パスを使用

相対パスではなく、常に絶対パスを使用してください。

```typescript
// ✅ 推奨
<Link href="/about" />

// ❌ 非推奨
<Link href="../about" />
```

### 3. useSegments()で複雑なルーティングを処理

相対ナビゲーションが必要な場合は、`useSegments()`を使用します。

```typescript
const segments = useSegments();
const currentPath = '/' + segments.join('/');
```

### 4. 型安全性を活用

TypeScriptの型チェックを活用して、ルーティングエラーを早期に発見します。

```typescript
type UserParams = { id: string; tab?: string };

const params = useLocalSearchParams<UserParams>();
```

## まとめ

Expo Routerの型付きルートは、以下の特徴があります：

1. **自動型生成**: Expo CLIが型を自動生成
2. **静的型チェック**: リンクとルートナビゲーションの型チェック
3. **自動補完**: IDEでのhrefプロパティ自動補完
4. **型安全性**: ルートとクエリパラメータの型安全性

**主な機能**：
- 静的に型付けされたルートナビゲーション
- 命令的ナビゲーションの型チェック
- ルートパラメータの型
- クエリパラメータの型

**制限事項**：
- 相対パス未サポート
- 絶対パスが必須

**ベストプラクティス**：
- 型定義を最新に保つ
- 絶対パスを使用
- useSegments()で複雑なルーティング
- 型安全性を活用

これらの機能を活用して、型安全なルーティングを実装できます。
