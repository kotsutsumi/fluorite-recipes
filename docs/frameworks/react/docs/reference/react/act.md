# act

`act()` は、アサーションを行う前に保留中の React の更新を適用するために用いるテストヘルパです。

## リファレンス

```javascript
await act(async actFn)
```

### パラメータ

- **`actFn`**: React の更新をトリガーする非同期または同期関数

### 返り値

`act` は Promise を返します。

## 使用法

### コンポーネントのテスト

UI テストにおける「操作単位」の更新を処理します。この名前は Arrange-Act-Assert パターンに由来しています。

#### テスト対象のコンポーネント例

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}
```

#### テストの例

```javascript
import { act } from 'react';
import { createRoot } from 'react-dom/client';

it('renders and updates the counter', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);

  // レンダリングをテスト
  await act(async () => {
    root.render(<Counter />);
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');

  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // クリックイベントをテスト
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

## 重要な注意事項

### 環境変数の設定

テスト環境で `global.IS_REACT_ACT_ENVIRONMENT = true` を設定する必要があります。これにより、React にテストのような環境で実行されていることを伝えます。

### async/await の使用

常に `await` と `async` 関数と共に使用することを推奨します。

```javascript
// ✅ 推奨
await act(async () => {
  // ...
});

// ❌ 非推奨(将来削除予定)
act(() => {
  // ...
});
```

## テストライブラリとの統合

React Testing Library などのテストライブラリは、内部で `act` を自動的に使用します。

```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('counter increments', async () => {
  render(<Counter />);

  const button = screen.getByRole('button');

  // React Testing Library が自動的に act でラップ
  fireEvent.click(button);

  expect(screen.getByText('You clicked 1 times')).toBeInTheDocument();
});
```

## トラブルシューティング

### act の警告が表示される

以下の場合に警告が表示されることがあります:

1. state 更新が `act` でラップされていない
2. 非同期更新が完了する前にアサーションを実行
3. テスト環境が正しく設定されていない

### 解決方法

```javascript
// すべての更新を act でラップ
await act(async () => {
  // state を更新する操作
});

// アサーションの前に更新が完了するまで待機
```

## ベストプラクティス

- すべての React の更新を `act` でラップ
- `async/await` を使用して非同期更新を処理
- テストライブラリを使用する場合、通常は手動で `act` を呼び出す必要はない
- テスト環境を適切に設定
