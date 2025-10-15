# flushSync

`flushSync` は、React に対して、コールバック関数内のすべての更新を即座に同期的にフラッシュし、DOM を直ちに更新するよう強制する関数です。

## リファレンス

### `flushSync(callback)`

```javascript
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
// この時点で DOM は更新されています
```

## パラメータ

### `callback`

関数。React はこのコールバックを直ちに実行し、その中に含まれるすべての更新を同期的にフラッシュします。また、保留中の更新、エフェクト、またはエフェクト内の更新もフラッシュする場合があります。この `flushSync` 呼び出しの結果として更新がサスペンドすると、フォールバックが再表示される可能性があります。

## 返り値

`flushSync` は `undefined` を返します。

## 使用法

### サードパーティコードとの統合

ブラウザ API やサードパーティライブラリなど、React 外部のコードと統合する際に、更新を強制的にフラッシュする必要がある場合があります。

```javascript
import { useState } from 'react';
import { flushSync } from 'react-dom';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    flushSync(() => {
      setCount(c => c + 1);
    });
    // この時点で DOM は確実に更新されています
    console.log(document.getElementById('count').textContent); // '1'
  };

  return (
    <div>
      <div id="count">{count}</div>
      <button onClick={handleClick}>増加</button>
    </div>
  );
}
```

### ブラウザ印刷 API との統合

印刷ダイアログを開く前に、DOM が確実に更新されるようにする必要がある場合があります。

```javascript
import { useState } from 'react';
import { flushSync } from 'react-dom';

function PrintableComponent() {
  const [isPrinting, setIsPrinting] = useState(false);

  const handleBeforePrint = () => {
    flushSync(() => {
      setIsPrinting(true);
    });
    // この時点で印刷用のスタイルが適用されています
  };

  const handleAfterPrint = () => {
    setIsPrinting(false);
  };

  const handlePrint = () => {
    handleBeforePrint();
    window.print();
    handleAfterPrint();
  };

  return (
    <div className={isPrinting ? 'print-mode' : 'screen-mode'}>
      <h1>印刷可能なコンテンツ</h1>
      <button onClick={handlePrint}>印刷</button>
    </div>
  );
}
```

### DOM 測定との統合

DOM の寸法を測定する前に、state の更新が完了していることを確認する必要がある場合があります。

```javascript
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

function MeasurableComponent() {
  const [items, setItems] = useState(['項目1']);
  const containerRef = useRef(null);

  const addItemAndMeasure = () => {
    flushSync(() => {
      setItems(prev => [...prev, `項目${prev.length + 1}`]);
    });

    // この時点で DOM は更新されています
    const height = containerRef.current.scrollHeight;
    console.log('新しい高さ:', height);
  };

  return (
    <div>
      <div ref={containerRef}>
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
      <button onClick={addItemAndMeasure}>
        項目を追加して測定
      </button>
    </div>
  );
}
```

### スクロール位置の制御

新しい要素を追加した後、即座にその要素までスクロールする場合に使用できます。

```javascript
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

function ChatMessages() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const addMessage = (text) => {
    flushSync(() => {
      setMessages(prev => [...prev, { id: Date.now(), text }]);
    });

    // この時点で新しいメッセージが DOM に追加されています
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <button onClick={() => addMessage('新しいメッセージ')}>
        メッセージを送信
      </button>
    </div>
  );
}
```

### アニメーションライブラリとの統合

サードパーティのアニメーションライブラリを使用する前に、DOM が更新されていることを確認します。

```javascript
import { useState } from 'react';
import { flushSync } from 'react-dom';

function AnimatedList() {
  const [items, setItems] = useState(['A', 'B', 'C']);

  const addItemWithAnimation = () => {
    const newItem = String.fromCharCode(65 + items.length);

    flushSync(() => {
      setItems(prev => [...prev, newItem]);
    });

    // この時点で新しい要素が DOM に存在します
    const newElement = document.querySelector(`[data-item="${newItem}"]`);
    if (newElement) {
      // サードパーティのアニメーションライブラリを使用
      newElement.animate([
        { opacity: 0, transform: 'translateY(-20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 300,
        easing: 'ease-out'
      });
    }
  };

  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item} data-item={item}>
            項目 {item}
          </li>
        ))}
      </ul>
      <button onClick={addItemWithAnimation}>
        項目を追加（アニメーション付き）
      </button>
    </div>
  );
}
```

## 重要な注意事項

### パフォーマンスへの影響

`flushSync` は、アプリケーションのパフォーマンスを大幅に低下させる可能性があります。頻繁に使用することは避けてください。

```javascript
// 避けるべきパターン
function BadExample() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    for (let i = 0; i < 100; i++) {
      flushSync(() => {
        setCount(c => c + 1); // パフォーマンスが非常に悪い
      });
    }
  };

  return <button onClick={handleClick}>カウント: {count}</button>;
}

// 推奨されるパターン
function GoodExample() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(c => c + 100); // 一度だけ更新
  };

  return <button onClick={handleClick}>カウント: {count}</button>;
}
```

### Suspense との相互作用

`flushSync` 内の更新がサスペンドすると、Suspense 境界が強制的にフォールバック状態を表示する可能性があります。

```javascript
import { Suspense, useState } from 'react';
import { flushSync } from 'react-dom';

function App() {
  const [showData, setShowData] = useState(false);

  const loadData = () => {
    flushSync(() => {
      setShowData(true);
    });
    // データのロードがサスペンドすると、
    // フォールバックが表示される可能性があります
  };

  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <button onClick={loadData}>データを読み込む</button>
      {showData && <AsyncDataComponent />}
    </Suspense>
  );
}
```

### 予期しない副作用

`flushSync` は、エフェクトやその他の保留中の更新を強制的に実行する可能性があります。

```javascript
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

function Example() {
  const [count, setCount] = useState(0);
  const [derived, setDerived] = useState(0);

  useEffect(() => {
    console.log('エフェクトが実行されました');
    setDerived(count * 2);
  }, [count]);

  const handleClick = () => {
    flushSync(() => {
      setCount(c => c + 1);
    });
    // この時点でエフェクトも実行されている可能性があります
    console.log('クリック後:', derived);
  };

  return <button onClick={handleClick}>クリック</button>;
}
```

## ベストプラクティス

1. **最後の手段として使用**: 通常の React の更新メカニズムで解決できない場合にのみ使用します

2. **サードパーティ統合に限定**: ブラウザ API やサードパーティライブラリとの統合時に主に使用します

3. **パフォーマンステスト**: `flushSync` を使用する場合は、パフォーマンスへの影響を測定します

4. **バッチ更新を優先**: 可能な限り、React のバッチ更新メカニズムに依存します

5. **ドキュメント化**: `flushSync` を使用する理由をコメントで明確に説明します

```javascript
function Component() {
  const handleAction = () => {
    // flushSync を使用する理由: ブラウザの印刷 API との統合のため
    // DOM が確実に更新されてから印刷ダイアログを開く必要がある
    flushSync(() => {
      setPrintMode(true);
    });
    window.print();
  };

  return <button onClick={handleAction}>印刷</button>;
}
```

6. **代替案を検討**: `flushSync` を使用する前に、他の解決方法がないか検討します

```javascript
// flushSync を使用する代わりに
function BetterAlternative() {
  const [items, setItems] = useState([]);
  const lastItemRef = useRef(null);

  useEffect(() => {
    // DOM が更新された後に実行される
    lastItemRef.current?.scrollIntoView();
  }, [items]);

  const addItem = () => {
    setItems(prev => [...prev, `項目${prev.length + 1}`]);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          ref={index === items.length - 1 ? lastItemRef : null}
        >
          {item}
        </div>
      ))}
      <button onClick={addItem}>項目を追加</button>
    </div>
  );
}
```

## よくある使用パターン

### フォーカス管理

```javascript
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

function DynamicForm() {
  const [fields, setFields] = useState([{ id: 1, value: '' }]);
  const inputRefs = useRef({});

  const addField = () => {
    const newId = fields.length + 1;

    flushSync(() => {
      setFields(prev => [...prev, { id: newId, value: '' }]);
    });

    // 新しいフィールドにフォーカス
    inputRefs.current[newId]?.focus();
  };

  return (
    <div>
      {fields.map(field => (
        <input
          key={field.id}
          ref={el => inputRefs.current[field.id] = el}
          type="text"
          placeholder={`フィールド ${field.id}`}
        />
      ))}
      <button onClick={addField}>フィールドを追加</button>
    </div>
  );
}
```

### 状態の連鎖更新

```javascript
import { useState } from 'react';
import { flushSync } from 'react-dom';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = (data) => {
    flushSync(() => {
      setFormData(prev => ({ ...prev, ...data }));
    });

    flushSync(() => {
      setStep(s => s + 1);
    });

    // この時点で両方の state が更新されています
    console.log('現在のステップ:', step + 1);
  };

  return (
    <div>
      <h2>ステップ {step}</h2>
      {/* フォームコンテンツ */}
    </div>
  );
}
```

## トラブルシューティング

### 無限ループ

`flushSync` をエフェクト内で使用すると、無限ループが発生する可能性があります。

```javascript
// 避けるべきパターン
useEffect(() => {
  flushSync(() => {
    setCount(c => c + 1); // 無限ループの原因
  });
}, [count]);

// 代わりに通常の state 更新を使用
useEffect(() => {
  setCount(c => c + 1);
}, [/* 適切な依存配列 */]);
```

### レンダリングエラー

`flushSync` 内で例外が発生すると、アプリケーション全体がクラッシュする可能性があります。

```javascript
const handleAction = () => {
  try {
    flushSync(() => {
      // 安全でない可能性のある操作
      riskyStateUpdate();
    });
  } catch (error) {
    console.error('flushSync エラー:', error);
    // エラー処理
  }
};
```

## 関連リソース

- [createPortal](/docs/frameworks/react/docs/reference/react-dom/createPortal.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
- [useState Hook](/docs/frameworks/react/docs/reference/react/useState.md)
