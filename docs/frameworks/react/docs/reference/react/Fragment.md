# `<Fragment>`

Fragment を使うことで、ラッパ用のノードを用いずに要素をグループ化することができます。通常は `<>...</>` という構文で使用されます。

## リファレンス

```jsx
<>
  <OneChild />
  <AnotherChild />
</>
```

または明示的に:

```jsx
<Fragment key={yourKey}>
  <OneChild />
  <AnotherChild />
</Fragment>
```

### Props

- **`key`** (オプション): リストをレンダーする際に、明示的に `<Fragment>` 構文を使用する場合にのみ指定可能

## 使用法

### 複数の要素を返す

通常、1つの親要素しか返せない場所で、複数の要素をグループ化できます。

```jsx
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragment を使用することで、追加の DOM ノードが作成されないため、レイアウトやスタイリングに影響を与えません。

### 変数への割り当て

他のコンポーネントと同様に、Fragment を変数に割り当てることができます。

```jsx
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

### テキストと要素のグループ化

テキストと React コンポーネントを一緒にグループ化できます。

```jsx
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

### Fragment のリストをレンダー

リストをレンダーする場合、各 Fragment に `key` を指定する必要があります。この場合、省略記法 `<></>` は使用できません。

```jsx
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

## 主な利点

- 余分な DOM ノードを作成しない
- レイアウトとスタイリングに影響を与えない
- グループ化のセマンティックな意味を提供
