# テスト

Expo Routerでテストを実装する方法を学びます。

## テスト設定

### 必要なツール

- `expo-router/testing-library`
- `@testing-library/react-native`
- `jest-expo`

### セットアップ

#### 1. jest-expoの設定

```bash
npm install --save-dev jest-expo @testing-library/react-native
```

#### 2. @testing-library/react-nativeの設定

```bash
npm install --save-dev @testing-library/react-native
```

#### 3. 重要な注意事項

**テストファイルをappディレクトリ内に配置しないでください。**

**推奨構造**：
```
project/
├── app/
│   └── index.tsx
├── __tests__/
│   └── app.test.tsx
└── components/
    └── __tests__/
        └── Button.test.tsx
```

## renderRouter関数

メインのテストメソッドです。インメモリのExpo Routerアプリを作成します。

### 使用パターン1: インラインファイルシステムモッキング

```typescript
import { renderRouter } from 'expo-router/testing-library';

it('renders the index route', () => {
  const MockComponent = () => <Text>Hello</Text>;

  renderRouter(
    {
      index: MockComponent,
      'directory/a': MockComponent,
    },
    {
      initialUrl: '/directory/a',
    }
  );
});
```

### 使用パターン2: Nullコンポーネントモッキング

```typescript
import { renderRouter } from 'expo-router/testing-library';

it('renders routes', () => {
  renderRouter(['index', 'directory/a'], {
    initialUrl: '/directory/a',
  });
});
```

### 使用パターン3: フィクスチャパスモッキング

```typescript
import { renderRouter } from 'expo-router/testing-library';

it('renders routes from fixture', () => {
  renderRouter('./my-test-fixture');
});
```

**ディレクトリ構造**：
```
__tests__/
├── app.test.tsx
└── my-test-fixture/
    ├── index.tsx
    └── about.tsx
```

### 使用パターン4: オーバーライド付きフィクスチャ

```typescript
import { renderRouter } from 'expo-router/testing-library';

it('renders routes with overrides', () => {
  const MockAuthLayout = () => <Text>Mock Auth</Text>;

  renderRouter({
    appDir: './my-test-fixture',
    overrides: {
      'directory/(auth)/_layout': MockAuthLayout,
    },
  });
});
```

## Jestマッチャー

### toHavePathname()

現在のパスネームをチェックします。

```typescript
import { screen } from '@testing-library/react-native';

expect(screen).toHavePathname('/my-router');
```

### toHavePathnameWithParams()

パスネームとパラメータをチェックします。

```typescript
expect(screen).toHavePathnameWithParams('/user/[id]', {
  id: '123',
});
```

### toHaveSegments()

現在のセグメントをチェックします。

```typescript
expect(screen).toHaveSegments(['user', '[id]']);
```

### useLocalSearchParams()

ローカル検索パラメータをチェックします。

```typescript
const params = useLocalSearchParams();
expect(params).toEqual({ id: '123' });
```

### useGlobalSearchParams()

グローバル検索パラメータをチェックします。

```typescript
const params = useGlobalSearchParams();
expect(params).toEqual({ filter: 'active' });
```

### toHaveRouterState()

ルーター状態をチェックします。

```typescript
expect(screen).toHaveRouterState({
  pathname: '/user/[id]',
  params: { id: '123' },
  segments: ['user', '[id]'],
});
```

## テストの例

### 例1: ナビゲーションテスト

```typescript
import { renderRouter, screen } from 'expo-router/testing-library';
import { fireEvent } from '@testing-library/react-native';

it('navigates to about page', async () => {
  renderRouter({
    index: () => (
      <Link href="/about">
        <Text>Go to About</Text>
      </Link>
    ),
    about: () => <Text>About Page</Text>,
  });

  expect(screen).toHavePathname('/');

  fireEvent.press(screen.getByText('Go to About'));

  expect(screen).toHavePathname('/about');
});
```

### 例2: パラメータテスト

```typescript
import { renderRouter, screen } from 'expo-router/testing-library';

it('passes parameters correctly', () => {
  renderRouter(
    {
      'user/[id]': () => {
        const { id } = useLocalSearchParams();
        return <Text>User {id}</Text>;
      },
    },
    {
      initialUrl: '/user/123',
    }
  );

  expect(screen).toHavePathnameWithParams('/user/[id]', {
    id: '123',
  });
  expect(screen.getByText('User 123')).toBeTruthy();
});
```

### 例3: 認証テスト

```typescript
import { renderRouter, screen } from 'expo-router/testing-library';

it('redirects unauthenticated users', () => {
  const ProtectedScreen = () => {
    const { user } = useAuth();
    if (!user) {
      return <Redirect href="/login" />;
    }
    return <Text>Protected Content</Text>;
  };

  renderRouter(
    {
      protected: ProtectedScreen,
      login: () => <Text>Login Page</Text>,
    },
    {
      initialUrl: '/protected',
    }
  );

  expect(screen).toHavePathname('/login');
});
```

### 例4: フォームテスト

```typescript
import { renderRouter, screen } from 'expo-router/testing-library';
import { fireEvent } from '@testing-library/react-native';

it('submits form and navigates', async () => {
  const SearchScreen = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSubmit = () => {
      router.push(`/results?q=${query}`);
    };

    return (
      <View>
        <TextInput value={query} onChangeText={setQuery} />
        <Button title="Search" onPress={handleSubmit} />
      </View>
    );
  };

  renderRouter({
    search: SearchScreen,
    results: () => <Text>Results</Text>,
  });

  const input = screen.getByDisplayValue('');
  fireEvent.changeText(input, 'test query');

  const button = screen.getByText('Search');
  fireEvent.press(button);

  expect(screen).toHavePathname('/results');
  expect(screen).toHavePathnameWithParams('/results', {
    q: 'test query',
  });
});
```

## ベストプラクティス

### 1. テストを分離

テストファイルをappディレクトリの外に配置します。

```
__tests__/
  app/
    index.test.tsx
    about.test.tsx
```

### 2. インラインモッキングを活用

柔軟なテストのために、インラインモッキングを使用します。

```typescript
renderRouter({
  index: MockIndexComponent,
  about: MockAboutComponent,
});
```

### 3. Jestマッチャーを使用

提供されているJestマッチャーで包括的なテストを実施します。

```typescript
expect(screen).toHavePathname('/my-router');
expect(screen).toHaveSegments(['[id]']);
```

### 4. ユーザーインタラクションをテスト

実際のユーザーインタラクションをシミュレートします。

```typescript
fireEvent.press(screen.getByText('Navigate'));
expect(screen).toHavePathname('/destination');
```

## まとめ

Expo Routerのテストは、以下の特徴があります：

1. **expo-router/testing-library**: テスト専用ライブラリ
2. **renderRouter関数**: インメモリルーターの作成
3. **カスタムJestマッチャー**: ルーター状態の検証
4. **柔軟なモッキング**: 複数のモッキングパターン

**主な機能**：
- インラインファイルシステムモッキング
- フィクスチャベーステスト
- オーバーライド機能
- カスタムマッチャー

**Jestマッチャー**：
- toHavePathname()
- toHavePathnameWithParams()
- toHaveSegments()
- toHaveRouterState()

**ベストプラクティス**：
- テストを分離
- インラインモッキング活用
- Jestマッチャー使用
- ユーザーインタラクションテスト

これらの機能を活用して、Expo Routerアプリの包括的なテストを実装できます。
