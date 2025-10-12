# URLパラメータ

Expo RouterでURLパラメータを使用する方法を学びます。

## URLパラメータとは

URLパラメータは、ページ間でデータを渡すために使用されます。Expo Routerでは、2つの主要なタイプのURLパラメータがあります。

## URLパラメータのタイプ

### 1. ルートパラメータ

URLパスの動的セグメントです。

**例**: `/profile/[user]`の`user`はルートパラメータです。

### 2. 検索パラメータ（クエリパラメータ）

URLに追加されるシリアライズ可能なフィールドです。

**例**: `/profile?extra=info`の`extra`は検索パラメータです。

## パラメータにアクセスするフック

### useLocalSearchParams()

現在のコンポーネントのパラメータを返します。

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useLocalSearchParams();

  return <Text>User: {user}</Text>;
}
```

**特徴**：
- グローバルURLが現在のルートに一致する場合のみ更新
- ナビゲーション中は前の画面のデータを維持
- パフォーマンスが良い（不要な再レンダリングを防ぐ）

### useGlobalSearchParams()

グローバルURLパラメータを返します。

```typescript
import { useGlobalSearchParams } from 'expo-router';

export default function AnyScreen() {
  const params = useGlobalSearchParams();

  return <Text>Global params: {JSON.stringify(params)}</Text>;
}
```

**特徴**：
- すべてのURLパラメータ変更時に更新
- バックグラウンドコンポーネントも再レンダリング可能
- グローバル状態の監視に便利

## 型付きパラメータ

### 基本的な型付け

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { user } = useLocalSearchParams<{ user: string }>();

  return <Text>User: {user}</Text>;
}
```

### 配列とオプショナルパラメータ

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
  const { tags, query } = useLocalSearchParams<{
    tags: string[];
    query?: string;
  }>();

  return (
    <View>
      <Text>Query: {query}</Text>
      <Text>Tags: {tags?.join(', ')}</Text>
    </View>
  );
}
```

### 複雑な型

```typescript
type Params = {
  id: string;
  category?: string;
  filters: string[];
  sort?: 'asc' | 'desc';
};

export default function ProductsScreen() {
  const params = useLocalSearchParams<Params>();

  return (
    <View>
      <Text>ID: {params.id}</Text>
      <Text>Category: {params.category || 'All'}</Text>
      <Text>Filters: {params.filters?.join(', ')}</Text>
      <Text>Sort: {params.sort || 'asc'}</Text>
    </View>
  );
}
```

## URLパラメータの更新

### router.setParams()の使用

履歴に追加せずにパラメータを更新します。

```typescript
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    router.setParams({ query: text });
  };

  return (
    <TextInput
      value={searchText}
      onChangeText={handleSearch}
      placeholder="Search..."
    />
  );
}
```

### 複数のパラメータの更新

```typescript
router.setParams({
  user: 'evan',
  tab: 'profile',
  filter: 'active',
});
```

### パラメータのクリア

```typescript
// パラメータを削除
router.setParams({ query: undefined });

// すべてのパラメータをクリア
router.setParams({});
```

## 動的ルートとパラメータ

### 単一パラメータ

**ファイル**: `app/users/[id].tsx`

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>User ID: {id}</Text>;
}
```

**URL**: `/users/123` → `id = "123"`

### 複数パラメータ

**ファイル**: `app/posts/[category]/[id].tsx`

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { category, id } = useLocalSearchParams<{
    category: string;
    id: string;
  }>();

  return (
    <View>
      <Text>Category: {category}</Text>
      <Text>Post ID: {id}</Text>
    </View>
  );
}
```

**URL**: `/posts/tech/456` → `category = "tech"`, `id = "456"`

### キャッチオールパラメータ

**ファイル**: `app/docs/[...slug].tsx`

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function DocsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();

  return <Text>Path: {slug?.join('/')}</Text>;
}
```

**URL**: `/docs/guide/intro` → `slug = ["guide", "intro"]`

## ハッシュサポート

### 特別な`#`パラメータ

URLのハッシュフラグメントにアクセスできます。

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function Screen() {
  const { '#': hash } = useLocalSearchParams<{ '#': string }>();

  return <Text>Hash: {hash}</Text>;
}
```

**URL**: `/page#section` → `# = "section"`

## ルートパラメータと検索パラメータの違い

### ルートパラメータ

**用途**: ルートをマッチングするために使用
- 常に値を持つ（マッチした場合）
- URLパスの一部
- 必須

**例**:
```
/users/[id] → /users/123
id = "123"（常に存在）
```

### 検索パラメータ

**用途**: オプションのデータを渡すために使用
- 値がない場合もある
- URLの`?`以降に追加
- オプショナル

**例**:
```
/users?filter=active
filter = "active"（オプショナル）
```

## 予約パラメータ名

以下のパラメータ名は予約されており、使用を避けてください：

- `screen`
- `params`
- `path`
- `initial`

**理由**: これらはExpo Routerの内部で使用されています。

## ベストプラクティス

### 1. ルートパラメータをルートマッチングに使用

```typescript
// ✅ 推奨
// app/products/[id].tsx
const { id } = useLocalSearchParams<{ id: string }>();
```

### 2. 検索パラメータをオプションのデータに使用

```typescript
// ✅ 推奨
// app/products.tsx
const { filter, sort } = useLocalSearchParams<{
  filter?: string;
  sort?: string;
}>();
```

### 3. 型安全性の活用

```typescript
// ✅ 推奨
type Params = {
  id: string;
  tab?: 'profile' | 'settings' | 'history';
};

const params = useLocalSearchParams<Params>();
```

### 4. パフォーマンスへの配慮

```typescript
// ✅ ローカルパラメータを使用（パフォーマンスが良い）
const params = useLocalSearchParams();

// ⚠️ グローバルパラメータは必要な場合のみ使用
const globalParams = useGlobalSearchParams();
```

### 5. パラメータの検証

```typescript
import { z } from 'zod';

const ParamsSchema = z.object({
  id: z.string(),
  filter: z.enum(['active', 'inactive']).optional(),
});

export default function Screen() {
  const rawParams = useLocalSearchParams();
  const params = ParamsSchema.parse(rawParams);

  return <Text>Validated ID: {params.id}</Text>;
}
```

## 実装パターン

### パターン1: フィルタリング

```typescript
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProductsScreen() {
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();

  const applyFilter = (newFilter: string) => {
    router.setParams({ filter: newFilter });
  };

  return (
    <View>
      <Button title="Active" onPress={() => applyFilter('active')} />
      <Button title="All" onPress={() => applyFilter('')} />
      <Text>Current filter: {filter || 'none'}</Text>
    </View>
  );
}
```

### パターン2: タブナビゲーション

```typescript
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { tab = 'profile' } = useLocalSearchParams<{
    tab?: 'profile' | 'settings' | 'history';
  }>();

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Profile" onPress={() => router.setParams({ tab: 'profile' })} />
        <Button title="Settings" onPress={() => router.setParams({ tab: 'settings' })} />
        <Button title="History" onPress={() => router.setParams({ tab: 'history' })} />
      </View>
      {tab === 'profile' && <ProfileTab />}
      {tab === 'settings' && <SettingsTab />}
      {tab === 'history' && <HistoryTab />}
    </View>
  );
}
```

### パターン3: 検索機能

```typescript
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TextInput } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const { query = '' } = useLocalSearchParams<{ query?: string }>();
  const [searchText, setSearchText] = useState(query as string);

  const handleSearch = () => {
    router.setParams({ query: searchText });
  };

  return (
    <View>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        placeholder="Search..."
      />
      <Text>Searching for: {query}</Text>
    </View>
  );
}
```

## まとめ

Expo RouterのURLパラメータは、以下の特徴があります：

1. **2つのタイプ**: ルートパラメータと検索パラメータ
2. **2つのフック**: `useLocalSearchParams()`と`useGlobalSearchParams()`
3. **型安全性**: TypeScript型のサポート
4. **柔軟な更新**: `router.setParams()`で簡単に更新

**主な使用例**：
- ルートマッチング（ルートパラメータ）
- オプションのデータ渡し（検索パラメータ）
- フィルタリングとソート
- タブナビゲーション
- 検索機能

**ベストプラクティス**：
- ルートパラメータをルートマッチングに使用
- 検索パラメータをオプションのデータに使用
- 型安全性を活用
- パフォーマンスへの配慮
- パラメータの検証

これらの機能を活用して、柔軟でパフォーマンスの良いデータ渡しを実装できます。
