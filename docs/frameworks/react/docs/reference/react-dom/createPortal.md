# createPortal

`createPortal` は、React コンポーネントが DOM ツリーの別の場所に子要素をレンダーすることを可能にする関数です。これにより、物理的な DOM の配置を変更しながら、React ツリーの論理的な階層を維持できます。

## リファレンス

### `createPortal(children, domNode, key?)`

```javascript
import { createPortal } from 'react-dom';

function MyComponent() {
  return createPortal(
    <div>ポータルの内容</div>,
    document.body
  );
}
```

## パラメータ

### `children`

レンダー可能な React ノード。以下のいずれかを指定できます。

- JSX（`<div />` や `<SomeComponent />` など）
- Fragment（`<>...</>`）
- 文字列または数値
- これらの配列

### `domNode`

レンダー先となる既存の DOM ノード。`document.getElementById()` などで取得したノードを指定します。このノードは既に DOM に存在している必要があります。

### `key`（オプション）

ポータルの一意のキーとして使用する文字列または数値。

## 返り値

`createPortal` は、JSX に含めることができる、または React コンポーネントから返すことができる React ノードを返します。React はレンダー出力でポータルノードを検出すると、提供された `children` を指定された `domNode` 内に配置します。

## 使用法

### DOM の別の場所へのレンダー

基本的な使用方法は、コンポーネントの一部を DOM の別の場所にレンダーすることです。

```javascript
import { createPortal } from 'react-dom';

function App() {
  return (
    <div className="app">
      <h1>アプリケーション</h1>
      {createPortal(
        <p>このテキストは body にレンダーされます</p>,
        document.body
      )}
    </div>
  );
}
```

### モーダルダイアログの実装

モーダルダイアログは、ポータルの最も一般的な使用例の一つです。

```javascript
import { useState } from 'react';
import { createPortal } from 'react-dom';

function ModalDialog({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}>閉じる</button>
        {children}
      </div>
    </div>,
    document.body
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app">
      <button onClick={() => setShowModal(true)}>
        モーダルを開く
      </button>
      <ModalDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <h2>モーダルの内容</h2>
        <p>これはモーダルダイアログです。</p>
      </ModalDialog>
    </div>
  );
}
```

### React コンポーネントを非 React DOM にレンダー

ポータルを使用して、React コンポーネントを React で管理されていない DOM ノードにレンダーできます。

```javascript
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function PopupContent({ message }) {
  return (
    <div style={{
      padding: '20px',
      background: 'white',
      border: '1px solid #ccc'
    }}>
      <p>{message}</p>
    </div>
  );
}

function App() {
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    // サードパーティライブラリが作成したポップアップコンテナを取得
    const container = document.getElementById('third-party-popup');
    setPopupContainer(container);
  }, []);

  return (
    <div className="app">
      <h1>アプリケーション</h1>
      {popupContainer && createPortal(
        <PopupContent message="React コンテンツ" />,
        popupContainer
      )}
    </div>
  );
}
```

### ツールチップの実装

```javascript
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

function Tooltip({ children, text, visible, position }) {
  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        background: 'black',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {text}
    </div>,
    document.body
  );
}

function Button({ label, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 30
    });
    setShowTooltip(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {label}
      </button>
      <Tooltip
        text={tooltip}
        visible={showTooltip}
        position={position}
      />
    </>
  );
}
```

## 重要な注意事項

### イベントの伝播

ポータルは DOM ツリーの別の場所に配置されますが、React ツリー内では通常の子要素として動作します。イベントは DOM ツリーではなく、React ツリーに沿って伝播します。

```javascript
function Parent() {
  const handleClick = () => {
    console.log('親でクリックが捕捉されました');
  };

  return (
    <div onClick={handleClick}>
      <p>親要素</p>
      {createPortal(
        <button>
          このボタンのクリックは親に伝播します
        </button>,
        document.body
      )}
    </div>
  );
}
```

### アクセシビリティ

モーダルなどのポータルを実装する際は、アクセシビリティに注意を払う必要があります。

```javascript
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function AccessibleModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // フォーカスをモーダル内に移動
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();

      // Escape キーでモーダルを閉じる
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      ref={modalRef}
    >
      <div className="modal-content">
        <button
          onClick={onClose}
          aria-label="モーダルを閉じる"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### フォーカストラップ

モーダルダイアログでは、フォーカスをモーダル内に閉じ込める必要があります。

```javascript
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function FocusTrapModal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      modal.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div ref={modalRef} role="dialog" aria-modal="true">
      <button onClick={onClose}>閉じる</button>
      {children}
    </div>,
    document.body
  );
}
```

## ベストプラクティス

1. **モーダルとオーバーレイに使用**: ポータルは、z-index の問題を回避するためにモーダル、ツールチップ、ドロップダウンに最適です

2. **適切な DOM ノードを選択**: 通常は `document.body` を使用しますが、特定の要件に応じて他のノードも使用できます

3. **アクセシビリティを確保**: WAI-ARIA ガイドラインに従い、適切な ARIA 属性を設定します

4. **キーボードナビゲーション**: Tab キーと Escape キーのサポートを実装します

5. **イベント伝播を理解**: ポータル内のイベントは React ツリーに沿って伝播することを理解します

6. **クリーンアップ**: コンポーネントがアンマウントされるときに、適切にクリーンアップを行います

7. **パフォーマンス**: 大量のポータルを作成する場合は、パフォーマンスへの影響を考慮します

## トラブルシューティング

### ポータルが表示されない

ターゲット DOM ノードがレンダー時に存在することを確認してください。

```javascript
function App() {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    setContainer(document.getElementById('portal-root'));
  }, []);

  if (!container) return null;

  return createPortal(<div>コンテンツ</div>, container);
}
```

### スタイリングの問題

ポータルは DOM の別の場所にレンダーされるため、CSS の継承が期待通りに機能しない場合があります。必要に応じて、ポータル内のコンテンツに明示的なスタイルを適用してください。

## 関連リソース

- [React Portals 公式ドキュメント](https://ja.react.dev/reference/react-dom/createPortal)
- [flushSync](/docs/frameworks/react/docs/reference/react-dom/flushSync.md)
- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
