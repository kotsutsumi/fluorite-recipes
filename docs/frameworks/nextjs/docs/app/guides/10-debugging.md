# デバッグ

Next.js アプリケーションをデバッグするための包括的なガイドです。VS Code、ブラウザ DevTools、その他のツールを使用したデバッグ方法を説明します。

## VS Code でのデバッグ

VS Code は、Next.js アプリケーションのデバッグに最適な統合デバッグ体験を提供します。

### 1. デバッグ設定の作成

プロジェクトのルートに `.vscode/launch.json` ファイルを作成します：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

### 2. デバッグの実行

1. **Run and Debug** パネルを開く（`Ctrl+Shift+D` または `⌘+Shift+D`）
2. デバッグ設定を選択：
   - **Next.js: debug server-side** - サーバーサイドコードのデバッグ
   - **Next.js: debug client-side** - クライアントサイドコードのデバッグ
   - **Next.js: debug full stack** - フルスタックデバッグ
3. **Start Debugging**（`F5`）をクリック

### 3. ブレークポイントの設定

コードの任意の行をクリックしてブレークポイントを設定：

```typescript
// app/page.tsx
export default function Home() {
  const data = fetchData() // ← ここをクリックしてブレークポイントを設定
  return <div>{data}</div>
}
```

### 4. デバッグコントロール

- **Continue** (`F5`) - 次のブレークポイントまで実行
- **Step Over** (`F10`) - 次の行に進む
- **Step Into** (`F11`) - 関数内に入る
- **Step Out** (`Shift+F11`) - 関数から出る
- **Restart** (`Ctrl+Shift+F5` / `⌘+Shift+F5`) - デバッグセッションを再起動
- **Stop** (`Shift+F5`) - デバッグを停止

## ブラウザ DevTools でのデバッグ

ブラウザの開発者ツールを使用してデバッグできます。

### クライアントサイドのデバッグ

#### Chrome DevTools

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. Chrome でアプリケーションを開く（`http://localhost:3000`）

3. **Chrome DevTools** を開く（`F12` または `Ctrl+Shift+I` / `⌘+Option+I`）

4. **Sources** タブに移動

5. ファイルを検索（`Ctrl+P` または `⌘+P`）して、ブレークポイントを設定

#### Firefox DevTools

1. Firefox でアプリケーションを開く

2. **Developer Tools** を開く（`F12`）

3. **Debugger** タブに移動

4. ファイルを検索（`Ctrl+P` または `⌘+P`）して、ブレークポイントを設定

### サーバーサイドのデバッグ

#### Node.js インスペクターの使用

1. `--inspect` フラグを付けて開発サーバーを起動：
   ```bash
   NODE_OPTIONS='--inspect' npm run dev
   ```

2. ブラウザで以下にアクセス：
   - Chrome: `chrome://inspect`
   - Edge: `edge://inspect`

3. **Open dedicated DevTools for Node** をクリック

4. **Sources** タブでブレークポイントを設定

#### デバッグポートのカスタマイズ

デフォルトのデバッグポート（9229）を変更：

```bash
NODE_OPTIONS='--inspect=0.0.0.0:9230' npm run dev
```

複数の Next.js アプリケーションを同時にデバッグする場合に便利です。

## React Developer Tools

React Developer Tools を使用して、React コンポーネントの状態と props を検査できます。

### インストール

- [Chrome 拡張機能](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox アドオン](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- [Edge 拡張機能](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

### 使用方法

1. ブラウザで Next.js アプリケーションを開く

2. DevTools を開いて **Components** または **Profiler** タブを選択

3. コンポーネントツリーを検査：
   - コンポーネントの props を表示
   - コンポーネントの state を表示
   - props と state を編集して動作をテスト

### ソースマップのサポート

Next.js は自動的にソースマップを生成するため、デバッグ時に元のソースコードを表示できます：

```typescript
// DevTools で表示される実際のコード
export default function Home() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## コンソールログのデバッグ

### クライアントサイドログ

```typescript
// app/components/Button.tsx
'use client'

export function Button() {
  const handleClick = () => {
    console.log('Button clicked') // ブラウザコンソールに表示
    console.table({ id: 1, name: 'Test' }) // テーブル形式で表示
    console.group('Debug Info') // グループ化
    console.log('Detail 1')
    console.log('Detail 2')
    console.groupEnd()
  }

  return <button onClick={handleClick}>Click me</button>
}
```

### サーバーサイドログ

```typescript
// app/page.tsx
export default async function Page() {
  console.log('Server-side log') // ターミナルに表示

  const data = await fetchData()
  console.log('Fetched data:', data)

  return <div>{data}</div>
}
```

### 構造化ログ

より詳細な情報を記録：

```typescript
export default async function Page() {
  console.log({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Page rendered',
    metadata: {
      url: '/example',
      userId: '123',
    },
  })

  return <div>Page content</div>
}
```

## エラーハンドリングとデバッグ

### Error Boundary

クライアントサイドエラーをキャッチ：

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログサービスに送信
    console.error('Error occurred:', error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### グローバルエラーハンドリング

```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

## 環境別のデバッグ設定

### 開発環境専用のデバッグコード

```typescript
export default function Component() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode debug info')
  }

  return <div>Content</div>
}
```

### デバッグフラグの使用

```typescript
// .env.local
NEXT_PUBLIC_DEBUG=true
```

```typescript
export default function Component() {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('Debug mode enabled')
  }

  return <div>Content</div>
}
```

## パフォーマンスデバッグ

### React Profiler の使用

```typescript
// app/components/ProfiledComponent.tsx
'use client'

import { Profiler, ProfilerOnRenderCallback } from 'react'

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  })
}

export function ProfiledComponent() {
  return (
    <Profiler id="MyComponent" onRender={onRender}>
      <MyComponent />
    </Profiler>
  )
}
```

### パフォーマンスメトリクスの記録

```typescript
// app/page.tsx
export default function Page() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      console.log('Page load time:', pageLoadTime, 'ms')
    })
  }

  return <div>Content</div>
}
```

## Windows でのデバッグ

Windows で環境変数を設定する場合、`cross-env` を使用：

```bash
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "dev": "cross-env NODE_OPTIONS='--inspect' next dev"
  }
}
```

## デバッグのベストプラクティス

### 1. 適切なログレベルを使用

```typescript
console.log('情報レベル')
console.info('情報レベル（明示的）')
console.warn('警告レベル')
console.error('エラーレベル')
console.debug('デバッグレベル')
```

### 2. 意味のあるログメッセージ

```typescript
// ❌ 悪い例
console.log(data)

// ✅ 良い例
console.log('User data fetched:', {
  userId: data.id,
  timestamp: new Date().toISOString(),
})
```

### 3. 本番環境からデバッグコードを削除

```typescript
// ビルド時に自動的に削除される
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}
```

### 4. ソースマップを有効にする

`next.config.js` で設定：

```javascript
module.exports = {
  productionBrowserSourceMaps: true, // 本番環境でもソースマップを有効化
}
```

**注意**: 本番環境でソースマップを公開すると、ソースコードが露出するリスクがあります。内部デバッグ用途のみに使用してください。

## 参考リソース

- [Node.js デバッグガイド](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools JavaScript デバッグ](https://developer.chrome.com/docs/devtools/javascript/)
- [Firefox Debugger](https://firefox-source-docs.mozilla.org/devtools-user/debugger/)
- [VS Code デバッグ](https://code.visualstudio.com/docs/editor/debugging)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)

## まとめ

効果的なデバッグには、適切なツールと技術の組み合わせが必要です：

1. **VS Code** でフルスタックデバッグを設定
2. **ブラウザ DevTools** でクライアントサイドの問題を調査
3. **React Developer Tools** でコンポーネントを検査
4. **適切なログ** で実行フローを追跡
5. **Error Boundary** でエラーを適切に処理
6. **環境別の設定** で開発と本番を分離

これらのテクニックを組み合わせることで、Next.js アプリケーションの問題を迅速に特定して解決できます。
