# Code Block（コードブロック）

## 概要
Code Blockコンポーネントは、コードブロックのシンタックスハイライト、行番号、クリップボードへのコピー機能を提供します。

## インストール
```bash
npx kibo-ui add code-block
```

## 機能
- シンタックスハイライト
- 行番号
- クリップボードへのコピー
- ファイル名のサポート
- ハイライトされた行と単語
- フォーカス行
- Diffサポート
- 言語検出
- テーマサポート
- カスタマイズ可能なスタイル

## コード例

### 基本例
```jsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

### ハイライトされた行
```jsx
function MyComponent(props) { // [!code highlight]
  return (
    <div>
      <h1>Hello, {props.name}!</h1> // [!code highlight]
      <p>This is an example React component.</p>
    </div>
  );
}
```

### ハイライトされた単語
```jsx
function MyComponent(props) {
  return (
    <div>
      // [!code word:props.name]
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

### Diff例
```javascript
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity; // [!code --]
    const itemTotal = items[i].price * items[i].quantity; // [!code ++]
    total += itemTotal; // [!code ++]
  }
  return total;
}
```

### フォーカス例
```javascript
function calculateDiscount(price, percentage) {
  const discount = price * (percentage / 100); // [!code focus]
  return price - discount;
}
```
