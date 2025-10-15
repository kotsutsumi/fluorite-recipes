# ディレクティブ

ディレクティブは、React Server Components 用の機能です。これらは React Server Components 互換バンドラに指示を与えます。

## 概要

ディレクティブは、モジュールまたは関数の先頭に配置される特殊な文字列で、バンドラやフレームワークに対してコードの処理方法を指示します。React Server Components では、主に2つのディレクティブが使用されます。

## ソースコードディレクティブ

React Server Components では、以下の2つのディレクティブが利用可能です：

### `'use client'`

`'use client'` ディレクティブは、どのコードがクライアント上で実行されるべきかをマークします。

**目的：**
- クライアントサイドで実行するコードを指定
- インタラクティブな機能を持つコンポーネントをマーク
- ブラウザ API を使用するコードを識別

**使用例：**

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

このディレクティブをファイルの先頭に配置すると、そのファイル全体とそのインポートがクライアントバンドルの一部になります。

**詳細については：**
[`'use client'` のリファレンス](/reference/rsc/use-client)を参照してください。

### `'use server'`

`'use server'` ディレクティブは、クライアント側のコードから呼び出すことができるサーバサイド関数をマークします。

**目的：**
- サーバ関数を定義
- クライアントから呼び出し可能なサーバ側の関数を識別
- データベースアクセスなどのサーバ専用操作を実行

**使用例：**

```javascript
'use server';

export async function createNote(title, content) {
  // サーバサイドでのみ実行される
  await db.notes.create({ title, content });
}
```

または、関数レベルで使用：

```javascript
async function ServerComponent() {
  async function serverAction() {
    'use server';
    // サーバでのみ実行される関数
    await db.performAction();
  }

  return <button onClick={serverAction}>実行</button>;
}
```

**詳細については：**
[`'use server'` のリファレンス](/reference/rsc/use-server)を参照してください。

## ディレクティブの配置規則

### ファイルレベルのディレクティブ

ディレクティブは、ファイルまたはモジュールの先頭に配置する必要があります：

```javascript
// ✓ 正しい
'use client';

import { useState } from 'react';

export default function Component() {
  // ...
}
```

```javascript
// ✗ 間違い
import { useState } from 'react';

'use client'; // エラー: ディレクティブはファイルの先頭に配置する必要があります

export default function Component() {
  // ...
}
```

### 関数レベルのディレクティブ

`'use server'` ディレクティブは、関数の先頭にも配置できます：

```javascript
async function MyComponent() {
  async function handleAction() {
    'use server'; // 関数レベルのディレクティブ
    await db.update();
  }

  return <button onClick={handleAction}>更新</button>;
}
```

**注意：** `'use client'` は関数レベルでは使用できません。ファイルレベルでのみ使用します。

## ディレクティブの動作

### `'use client'` の動作

`'use client'` ディレクティブが付いたファイル：

1. **バンドルに含まれる**: そのファイルのコードはクライアントバンドルに含まれます
2. **依存関係も含まれる**: インポートされたモジュールもクライアントバンドルに含まれます
3. **ブラウザで実行**: コードはブラウザで実行されます
4. **インタラクティブ**: React のフックやイベントハンドラーを使用できます

```javascript
'use client';

import { useState } from 'react'; // クライアントバンドルに含まれる
import { helper } from './utils'; // これもクライアントバンドルに含まれる

export default function Interactive() {
  const [state, setState] = useState(0); // OK
  return <button onClick={() => setState(state + 1)}>Click</button>;
}
```

### `'use server'` の動作

`'use server'` ディレクティブが付いた関数：

1. **サーバでのみ実行**: 関数のコードはサーバでのみ実行されます
2. **クライアントから呼び出し可能**: クライアントコンポーネントから呼び出せます
3. **参照として渡される**: クライアントには関数の参照のみが渡されます
4. **シリアライズ可能**: 引数と返り値はシリアライズ可能である必要があります

```javascript
'use server';

import { db } from './database'; // サーバ専用コード

export async function saveData(data) {
  // サーバでのみ実行される
  await db.save(data);
  return { success: true };
}
```

クライアント側：

```javascript
'use client';

import { saveData } from './actions';

export default function Form() {
  async function handleSubmit(formData) {
    // saveData はサーバで実行される
    const result = await saveData(formData);
    console.log(result); // { success: true }
  }

  return <form action={handleSubmit}>...</form>;
}
```

## ディレクティブの組み合わせ

### サーバコンポーネントからクライアントコンポーネントを使用

サーバコンポーネント（ディレクティブなし）は、クライアントコンポーネントをインポートして使用できます：

```javascript
// ServerComponent.js (ディレクティブなし)
import ClientComponent from './ClientComponent';

export default function ServerComponent() {
  const data = fetchServerData();

  return (
    <div>
      <h1>サーバコンポーネント</h1>
      <ClientComponent data={data} />
    </div>
  );
}
```

```javascript
// ClientComponent.js
'use client';

export default function ClientComponent({ data }) {
  return <div>{data}</div>;
}
```

### クライアントコンポーネントからサーバ関数を呼び出す

クライアントコンポーネントは、サーバ関数を呼び出すことができます：

```javascript
// actions.js
'use server';

export async function fetchData() {
  return await db.query();
}
```

```javascript
// ClientComponent.js
'use client';

import { fetchData } from './actions';
import { useState, useEffect } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return <div>{data}</div>;
}
```

### サーバコンポーネントからサーバ関数を使用

サーバコンポーネントは、サーバ関数を直接呼び出すこともできます：

```javascript
// actions.js
'use server';

export async function getData() {
  return await db.query();
}
```

```javascript
// ServerComponent.js
import { getData } from './actions';

export default async function ServerComponent() {
  const data = await getData();

  return <div>{data}</div>;
}
```

## ディレクティブのベストプラクティス

### 1. 必要な場所でのみ `'use client'` を使用

クライアントコンポーネントは、バンドルサイズを増加させます。必要な場合にのみ使用してください：

```javascript
// ✓ 推奨: 必要な部分のみクライアントコンポーネント
// ServerPage.js
import InteractiveButton from './InteractiveButton';

export default function ServerPage() {
  return (
    <div>
      <h1>ページタイトル</h1>
      <p>静的コンテンツ</p>
      <InteractiveButton /> {/* この部分のみクライアント */}
    </div>
  );
}
```

```javascript
// InteractiveButton.js
'use client';

export default function InteractiveButton() {
  return <button onClick={() => alert('clicked')}>クリック</button>;
}
```

### 2. サーバ関数でセキュリティを確保

サーバ関数では、必ず入力を検証し、認証・認可を確認してください：

```javascript
'use server';

import { auth } from './auth';

export async function deleteItem(itemId) {
  // 認証確認
  const user = await auth.getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // 入力検証
  if (typeof itemId !== 'string' || !itemId) {
    throw new Error('Invalid item ID');
  }

  // 認可確認
  const item = await db.items.findById(itemId);
  if (item.userId !== user.id) {
    throw new Error('Forbidden');
  }

  await db.items.delete(itemId);
}
```

### 3. ディレクティブを明確に配置

ディレクティブは常にファイルまたは関数の先頭に配置してください：

```javascript
// ✓ 正しい
'use client';

import React from 'react';

export default function Component() {
  // ...
}
```

```javascript
// ✗ 間違い
import React from 'react';

'use client'; // エラー

export default function Component() {
  // ...
}
```

### 4. ファイルレベルとモジュールレベルを使い分ける

`'use server'` は、ファイル全体に適用することも、個別の関数に適用することもできます：

```javascript
// ファイルレベル: すべてのエクスポートがサーバ関数
'use server';

export async function action1() { }
export async function action2() { }
```

```javascript
// 関数レベル: 特定の関数のみサーバ関数
export async function action1() {
  'use server';
  // ...
}

export function regularFunction() {
  // サーバ関数ではない
}
```

## 制限事項

### `'use client'` の制限

1. **サーバ専用 API を使用できない**
   ```javascript
   'use client';

   import fs from 'fs'; // エラー: ファイルシステムは使用できない
   ```

2. **サーバコンポーネントをインポートできない**
   ```javascript
   'use client';

   import ServerComponent from './ServerComponent'; // エラー
   ```

3. **サーバコンポーネントを子として受け取ることは可能**
   ```javascript
   'use client';

   export default function ClientWrapper({ children }) {
     return <div>{children}</div>; // children はサーバコンポーネントでも OK
   }
   ```

### `'use server'` の制限

1. **非同期関数でのみ使用可能**
   ```javascript
   'use server';

   export function syncFunction() { } // エラー: async が必要
   export async function asyncFunction() { } // OK
   ```

2. **シリアライズ可能な引数と返り値のみ**
   ```javascript
   'use server';

   export async function badFunction() {
     return <div>Hello</div>; // エラー: JSX は返せない
   }

   export async function goodFunction() {
     return { message: 'Hello' }; // OK
   }
   ```

3. **クライアントコードでのみ使用される場合はエラー**
   ```javascript
   'use client';

   async function clientFunction() {
     'use server'; // エラー: クライアントコードでは使用できない
   }
   ```

## まとめ

ディレクティブは、React Server Components の重要な機能です：

- **`'use client'`**: クライアントで実行されるコードをマークし、インタラクティブな機能を提供
- **`'use server'`**: サーバで実行される関数をマークし、クライアントから安全に呼び出し可能

適切に使用することで、パフォーマンスとセキュリティを最適化したアプリケーションを構築できます。

詳細については、各ディレクティブの個別のリファレンスページを参照してください：
- [`'use client'` リファレンス](/reference/rsc/use-client)
- [`'use server'` リファレンス](/reference/rsc/use-server)
