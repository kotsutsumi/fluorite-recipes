# React Compiler

React Compilerは、コンポーネントとフックを自動的にメモ化し、きめ細かいリアクティビティを可能にするツールです。

## React Compilerとは

React Compilerは、パフォーマンスを大幅に向上させる可能性のある、自動最適化ツールです。

### 主な機能

- **自動メモ化**: コンポーネントとフックを自動的にメモ化
- **きめ細かいリアクティビティ**: より効率的な再レンダリング
- **パフォーマンス向上**: 手動最適化が不要

## React Compilerの有効化

### 1. 互換性チェック

まず、プロジェクトがReactルールと互換性があるか確認します：

```bash
npx react-compiler-healthcheck@latest
```

このコマンドは、以下を検証します：

- Reactルールへの準拠
- 潜在的な問題の特定
- 移行の準備状況

### 2. インストール

#### SDK 54以降

```bash
npx expo install babel-plugin-react-compiler@beta
```

#### SDK 53

```bash
npx expo install babel-plugin-react-compiler@beta react-compiler-runtime@beta
```

### 3. 設定

`app.json`でReact Compilerを有効にします：

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

### 4. 開発サーバーの再起動

設定後、開発サーバーを再起動します：

```bash
npx expo start --clear
```

## リンターの設定

### ESLintプラグインのインストール

```bash
npx expo install eslint-plugin-react-compiler -D
```

### ESLint設定の更新

`.eslintrc.js`を更新します：

```javascript
module.exports = {
  extends: [
    // ... other configs
  ],
  plugins: [
    'react-compiler'
  ],
  rules: {
    'react-compiler/react-compiler': 'error'
  }
};
```

## 段階的な採用戦略

React Compilerは、段階的に採用できます。

### 1. 特定のファイルで実行

`babel.config.js`を設定して、特定のファイルやコンポーネントでのみ実行できます：

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          sources: (filename) => {
            return filename.indexOf('src/components') !== -1;
          },
        },
      ],
    ],
  };
};
```

### 2. オプトアウトディレクティブ

特定のコンポーネントを最適化から除外するには、`"use no memo"` ディレクティブを使用します：

```typescript
"use no memo"

function MyComponent() {
  // このコンポーネントはReact Compilerによって最適化されません
  return <div>Hello</div>;
}
```

## 使用上の注意

### 手動メモ化の削除

React Compilerを使用すると、以下を削除できます：

- `useCallback`
- `useMemo`
- `React.memo`

**例**：

```typescript
// Before (手動メモ化)
const MyComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  return <div>{processedData}</div>;
});

// After (React Compiler)
function MyComponent({ data }) {
  const processedData = expensiveOperation(data);
  return <div>{processedData}</div>;
}
```

### アプリケーションコードのみ

React Compilerは、アプリケーションコードでのみ実行されます。

**対象外**：
- `node_modules` 内のコード
- サードパーティライブラリ

### サーバーレンダリング

サーバーレンダリングでは無効になっています。

### クラスコンポーネント

クラスコンポーネントは最適化されません。関数コンポーネントへの移行をお勧めします。

## 設定オプション

### babel.config.jsでのカスタマイズ

`babel.config.js`で、コンパイルモードとエラーハンドリングをカスタマイズできます：

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          compilationMode: 'annotation',
          panicThreshold: 'none',
        },
      ],
    ],
  };
};
```

**オプション**：

- **`compilationMode`**: コンパイルモード
  - `'all'`: すべてのコンポーネントを最適化（デフォルト）
  - `'annotation'`: `"use memo"` ディレクティブがあるコンポーネントのみ最適化

- **`panicThreshold`**: エラー処理のしきい値
  - `'none'`: すべてのエラーを無視
  - `'all_errors'`: すべてのエラーで停止
  - `'all_invalid'`: 無効なコードで停止
  - `'critical_errors'`: 重大なエラーで停止（デフォルト）

## ベストプラクティス

### 1. 関数コンポーネントへの移行

クラスコンポーネントを関数コンポーネントに移行してください：

```typescript
// Before
class MyComponent extends React.Component {
  render() {
    return <div>{this.props.data}</div>;
  }
}

// After
function MyComponent({ data }) {
  return <div>{data}</div>;
}
```

### 2. ESLintプラグインの使用

ESLintプラグインを使用して、Reactルールの遵守を継続的に確認してください。

### 3. 段階的な採用

React Compilerを段階的に採用してください：

1. 小さなコンポーネントから開始
2. 徐々に範囲を拡大
3. パフォーマンスを測定
4. 問題があれば調整

### 4. パフォーマンスの測定

React Compilerを有効にする前後で、パフォーマンスを測定してください。

## トラブルシューティング

### コンパイルエラー

#### 症状

React Compilerがコンポーネントのコンパイルに失敗します。

#### 解決策

1. Reactルールへの準拠を確認
2. ESLintプラグインでエラーを特定
3. コードを修正
4. 必要に応じて `"use no memo"` でオプトアウト

### パフォーマンスの低下

#### 症状

React Compilerを有効にした後、パフォーマンスが低下します。

#### 解決策

1. 特定のコンポーネントでオプトアウト
2. `compilationMode` を `'annotation'` に変更
3. パフォーマンスプロファイリングを実行

### ビルドエラー

#### 症状

ビルドが失敗します。

#### 解決策

1. キャッシュをクリア：
   ```bash
   npx expo start --clear
   ```

2. 依存関係を再インストール：
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Babelキャッシュをクリア：
   ```bash
   rm -rf .expo
   ```

## 互換性

### Expo SDK

- **SDK 54以降**: 完全サポート
- **SDK 53**: `react-compiler-runtime@beta` が必要

### React

- **React 18.0以降**: サポート
- **React 17以前**: 非サポート

### React Native

- **React Native 0.70以降**: サポート

## パフォーマンスへの影響

### 期待される改善

- **再レンダリングの削減**: 不要な再レンダリングを自動的に削減
- **メモリ使用量の削減**: 手動メモ化よりも効率的
- **開発者エクスペリエンスの向上**: 手動最適化が不要

### 測定方法

React DevToolsプロファイラーを使用して、パフォーマンスを測定します：

1. Chrome DevToolsを開く
2. Profilerタブに移動
3. 記録を開始
4. アプリを操作
5. 結果を分析

## 次のステップ

### 1. 互換性チェックの実行

```bash
npx react-compiler-healthcheck@latest
```

### 2. ESLintプラグインのインストール

```bash
npx expo install eslint-plugin-react-compiler -D
```

### 3. React Compilerの有効化

`app.json`で有効にします。

### 4. テスト

アプリを徹底的にテストして、正しく動作することを確認します。

## まとめ

React Compilerは、React Nativeアプリのパフォーマンスを大幅に向上させる強力なツールです。自動メモ化ときめ細かいリアクティビティにより、手動最適化が不要になり、開発者エクスペリエンスが向上します。段階的に採用して、パフォーマンスを測定しながら、最適な設定を見つけてください。
