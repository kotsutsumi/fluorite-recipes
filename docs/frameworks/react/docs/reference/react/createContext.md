# createContext

`createContext` は、コンポーネントが提供または読み取りできるコンテクストを作成するための関数です。

## リファレンス

```javascript
const SomeContext = createContext(defaultValue)
```

### パラメータ

- **`defaultValue`**: コンテクストの初期値。任意の型の値を指定可能。コンポーネントツリー上にマッチするプロバイダがない場合に使用される

### 返り値

コンテクストオブジェクトを返します。コンテクスト自体は情報を保持しません。他のコンポーネントが読み取りまたは提供できる情報の種類を表します。

## 使用法

### コンテクストの作成

コンポーネントの外側でコンテクストを作成します。

```javascript
import { createContext } from 'react';

const ThemeContext = createContext('light');
const UserContext = createContext(null);
```

### コンテクストの使用

#### コンポーネントでコンテクストを読み取る

```javascript
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

#### コンテクストを提供する

```javascript
function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

### ファイルからのインポートとエクスポート

コンテクストを別のファイルにエクスポートできます。

```javascript
// contexts/ThemeContext.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
```

```javascript
// components/Button.js
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

### 動的な値の提供

state と組み合わせて動的な値を提供できます。

```javascript
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <Page />
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle theme
        </button>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
```

### 複数のコンテクストの使用

```javascript
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: 'Alice', id: 1 }}>
        <LanguageContext.Provider value="ja">
          <Page />
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
```

## コンテクストプロバイダ

### SomeContext.Provider

コンポーネントをコンテクストプロバイダでラップして、その内部のすべてのコンポーネントにコンテクストの値を提供します。

```javascript
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props

- **`value`**: このプロバイダ内で `useContext` を呼び出すすべてのコンポーネントに渡したい値

## トラブルシューティング

### デフォルト値がコンテクストから取得できない

デフォルト値は **静的** です。変更するには、state を使用してコンテクストプロバイダを作成する必要があります。

```javascript
// ❌ 間違い: デフォルト値は静的
const ThemeContext = createContext('light');
// これを変更する方法はありません

// ✅ 正しい: プロバイダで動的な値を提供
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

### プロバイダから値が取得できない

よくある問題:
1. プロバイダが `useContext` を呼び出すコンポーネントの上位にない
2. `value` プロップを渡し忘れている
3. 異なるコンテクストオブジェクトを使用している

```javascript
// ✅ 正しい配置
<ThemeContext.Provider value={theme}>
  <Button /> {/* Button は ThemeContext を読み取れる */}
</ThemeContext.Provider>

// ❌ 間違った配置
<Button /> {/* Button は ThemeContext のデフォルト値を取得 */}
<ThemeContext.Provider value={theme}>
  <OtherComponent />
</ThemeContext.Provider>
```

## ベストプラクティス

### コンテクストの分離

異なる目的のコンテクストは分けて作成します。

```javascript
// ✅ 推奨: 目的別に分離
const ThemeContext = createContext('light');
const UserContext = createContext(null);
const LanguageContext = createContext('en');

// ❌ 避ける: すべてを1つのコンテクストに
const AppContext = createContext({
  theme: 'light',
  user: null,
  language: 'en'
});
```

### カスタムプロバイダの作成

```javascript
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### カスタムフックの作成

```javascript
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

これにより、コンテクストの使用がより簡潔で安全になります。
