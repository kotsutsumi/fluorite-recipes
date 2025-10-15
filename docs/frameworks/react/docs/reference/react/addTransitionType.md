# unstable_addTransitionType (実験的)

`unstable_addTransitionType` は、トランジションの原因を指定できる実験的な React API です。

## 注意

この機能は実験的であり、安定版の React ではまだ利用できません。

## リファレンス

```javascript
unstable_addTransitionType(type)
```

### パラメータ

- **`type`**: トランジションのタイプを示す文字列

### 返り値

`unstable_addTransitionType` は何も返しません。

## 使用法

### トランジションのタイプを指定

`startTransition()` 内で `unstable_addTransitionType()` を呼び出し、トランジションの原因を指定します。

```javascript
import { startTransition, unstable_addTransitionType } from 'react';

function handleSubmit() {
  startTransition(() => {
    unstable_addTransitionType('submit-click');
    action();
  });
}
```

### アニメーションのカスタマイズ

トランジションタイプに基づいて、異なるアニメーションを適用できます。

#### 方法1: ブラウザのビュートランジションタイプを使用

```css
::view-transition-group(*) {
  animation-duration: 0.3s;
}

::view-transition-group(*):active-view-transition-type(submit-click) {
  animation-duration: 0.5s;
}
```

#### 方法2: View Transition クラスを使用

```javascript
<ViewTransition enter={{
  'submit-click': 'submit-animation',
}}>
  <Form />
</ViewTransition>
```

```css
.submit-animation::view-transition-new(root) {
  animation: slide-in 0.5s ease-out;
}
```

#### 方法3: ViewTransition イベントを使用

```javascript
<ViewTransition onTransition={(event) => {
  if (event.types.has('submit-click')) {
    event.transition.ready.then(() => {
      // カスタムアニメーションロジック
    });
  }
}}>
  <Form />
</ViewTransition>
```

## 使用例

### フォーム送信のアニメーション

```javascript
function ContactForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();

    startTransition(() => {
      unstable_addTransitionType('form-submit');
      submitForm(new FormData(e.target));
    });
  }

  return (
    <ViewTransition enter={{ 'form-submit': 'form-submit-animation' }}>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </ViewTransition>
  );
}
```

### ナビゲーションタイプの区別

```javascript
function Navigation() {
  function navigateTo(path, type) {
    startTransition(() => {
      unstable_addTransitionType(type);
      setCurrentPath(path);
    });
  }

  return (
    <nav>
      <button onClick={() => navigateTo('/home', 'nav-home')}>Home</button>
      <button onClick={() => navigateTo('/about', 'nav-about')}>About</button>
      <button onClick={() => navigateTo('/contact', 'nav-contact')}>
        Contact
      </button>
    </nav>
  );
}
```

### 複数のトランジションタイプ

```javascript
function MultiTypeTransition() {
  function handleAction() {
    startTransition(() => {
      unstable_addTransitionType('user-action');
      unstable_addTransitionType('data-update');
      updateData();
    });
  }

  return (
    <ViewTransition
      enter={{
        'user-action': 'user-action-animation',
        'data-update': 'data-update-animation',
      }}
    >
      <button onClick={handleAction}>Update</button>
    </ViewTransition>
  );
}
```

## 重要な注意事項

### トランジションタイプのリセット

各コミット後にトランジションタイプはリセットされます。

```javascript
startTransition(() => {
  unstable_addTransitionType('type-1');
  setState(newState);
});
// コミット後、トランジションタイプはリセットされる

startTransition(() => {
  unstable_addTransitionType('type-2'); // 新しいタイプ
  setState(anotherState);
});
```

### startTransition 内でのみ使用

`unstable_addTransitionType` は `startTransition` または `useTransition` の `startTransition` 内でのみ呼び出す必要があります。

```javascript
// ✅ 正しい
startTransition(() => {
  unstable_addTransitionType('my-type');
  updateState();
});

// ❌ 間違い
unstable_addTransitionType('my-type');
startTransition(() => {
  updateState();
});
```

## アニメーションの例

### スライドアニメーション

```css
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-animation::view-transition-new(root) {
  animation: slide-in 0.3s ease-out;
}
```

### フェードアニメーション

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-animation::view-transition-new(root) {
  animation: fade-in 0.2s ease-in;
}
```

## 将来の展望

今後、トランジションの原因をさらに多くのユースケースでサポートする予定です。

## ベストプラクティス

- 説明的なトランジションタイプ名を使用
- 一貫した命名規則を採用(例: `action-target` 形式)
- アニメーションのパフォーマンスを考慮
- フォールバックアニメーションを提供

## 警告

**この機能は実験的です。** 本番環境では使用しないでください。API は将来変更される可能性があります。
