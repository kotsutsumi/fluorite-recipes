# useContext

`useContext` は、コンポーネントで context を読み取り、購読するための React フックです。

## リファレンス

```javascript
const value = useContext(SomeContext)
```

### パラメータ

- **`SomeContext`**: `createContext` で作成した context。context 自体は情報を保持せず、コンポーネントから提供または読み取れる情報の種類を表す

### 返り値

呼び出し元コンポーネントに対する context の現在値を返します。これは、ツリー内で呼び出し元コンポーネントの上位にある最も近い `SomeContext.Provider` に渡された `value` として決定されます。

## 使用法

### データを深くツリーに渡す

```javascript
function Button() {
  const theme = useContext(ThemeContext);
  // テーマの値を使用
}
```

### Context を通じてデータを更新

state と context を組み合わせることで、動的な値の更新が可能になります。

```javascript
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => setTheme('light')}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

### デフォルト値の指定

一致するプロバイダが存在しない場合のフォールバック値を指定できます。

```javascript
const ThemeContext = createContext('light');
```

### ツリーの一部で context をオーバーライド

ツリーの特定の部分を異なる値のプロバイダでラップすることで、context をオーバーライドできます。

### オブジェクトや関数を渡す際の最適化

パフォーマンスのため、`useMemo` と `useCallback` を使用して再レンダーを最適化できます。

```javascript
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

## トラブルシューティング

### プロバイダから値を取得できない

よくある問題:
- context プロバイダの配置が正しくない
- context オブジェクトが一致していない
- `value` プロップを渡し忘れている

### 最適化したのに常に再レンダーされる

プロバイダに渡す値が毎回新しいオブジェクトになっていないか確認してください。

## 主要な原則

- Context はコンポーネントツリーを通じてデータを渡す方法を提供
- コンポーネントは props を経由せずに context の値にアクセス可能
- Context の更新は、それを使用しているコンポーネントの再レンダーをトリガー
