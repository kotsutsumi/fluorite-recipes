# 段階的な導入

既存のコードベースに React Compiler を段階的に導入する方法を学びます。

## このページで学ぶこと

- 段階的な導入が推奨される理由
- ディレクトリベースの Babel オーバーライドの使用
- `"use memo"` ディレクティブによるオプトイン コンパイル
- `"use no memo"` ディレクティブによるコンポーネントの除外
- ランタイム機能フラグによるゲーティング
- 導入の進捗モニタリング

## 段階的な導入が推奨される理由

React Compiler は、コードベース全体を自動的に最適化するように設計されていますが、一度にすべてを採用する必要はありません。段階的な導入により、アプリの小さな部分でコンパイラをテストしてから、残りに拡大できます。

### 段階的な導入のメリット

1. **信頼性の構築**: アプリの安定性を維持しながら、コンパイラの最適化を検証
2. **動作の検証**: コンパイルされたコードでアプリの動作を確認
3. **パフォーマンスの測定**: パフォーマンス改善を測定
4. **体系的な修正**: React のルール違反を体系的に修正
5. **A/B テスト**: 実際の影響を測定するために A/B テストを実行

## 段階的な導入のアプローチ

React Compiler を段階的に導入するには、3 つの主なアプローチがあります:

1. **Babel オーバーライド** - 特定のディレクトリにコンパイラを適用
2. **`"use memo"` によるオプトイン** - 明示的にオプトインしたコンポーネントのみをコンパイル
3. **ランタイムゲーティング** - 機能フラグでコンパイルを制御

## Babel オーバーライドによるディレクトリベースの導入

Babel の `overrides` オプションを使用すると、コードベースの異なる部分に異なるプラグインを適用できます。

### 基本設定

特定のディレクトリにコンパイラを適用することから始めます:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    // すべてのファイルに適用されるグローバルプラグイン
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### カバレッジの拡大

自信がついたら、さらに多くのディレクトリを追加します:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    // グローバルプラグイン
  ],
  overrides: [
    {
      test: [
        './src/modern/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/features/dashboard/**/*.{js,jsx,ts,tsx}',
      ],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### 除外パターン

特定のファイルやディレクトリを除外することもできます:

```javascript
// babel.config.js
module.exports = {
  overrides: [
    {
      test: './src/**/*.{js,jsx,ts,tsx}',
      exclude: [
        './src/legacy/**',
        './src/third-party/**',
        '**/node_modules/**',
      ],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### 段階的なロールアウト例

```javascript
// babel.config.js
module.exports = {
  overrides: [
    // フェーズ 1: 新しいコンポーネント
    {
      test: './src/features/new-dashboard/**/*.{js,jsx,ts,tsx}',
      plugins: ['babel-plugin-react-compiler'],
    },
    // フェーズ 2: 共有コンポーネント
    {
      test: './src/components/**/*.{js,jsx,ts,tsx}',
      exclude: ['./src/components/legacy/**'],
      plugins: ['babel-plugin-react-compiler'],
    },
    // フェーズ 3: 既存の機能
    {
      test: './src/features/**/*.{js,jsx,ts,tsx}',
      exclude: ['./src/features/legacy/**'],
      plugins: ['babel-plugin-react-compiler'],
    },
  ],
};
```

## `"use memo"` によるオプトイン方式

`"use memo"` ディレクティブを使用すると、個々のコンポーネントや関数をコンパイルにオプトインできます。

### 設定

コンパイラを `annotation` モードで設定します:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### 使用方法

コンパイルしたいコンポーネントに `"use memo"` を追加します:

```javascript
function OptimizedComponent({ data }) {
  "use memo";

  const processedData = expensiveProcessing(data);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} />
      ))}
    </div>
  );
}
```

### オプトインのメリット

- **細かい制御**: どのコンポーネントをコンパイルするかを正確に制御
- **段階的なテスト**: 1 つのコンポーネントずつテスト
- **明示的な意図**: コードを読む人に最適化が意図的であることを明確にする

### オプトインのデメリット

- **手動作業**: すべてのコンポーネントにディレクティブを追加する必要がある
- **一貫性の欠如**: どのコンポーネントがコンパイルされているかを追跡するのが難しい
- **保守の負担**: 新しいコンポーネントにディレクティブを追加することを忘れる可能性がある

## `"use no memo"` によるコンポーネントの除外

特定のコンポーネントをコンパイルから除外する必要がある場合、`"use no memo"` ディレクティブを使用できます。

### 使用方法

```javascript
function LegacyComponent({ data }) {
  "use no memo";

  // このコンポーネントはコンパイルされません
  // React のルールに違反する可能性のあるコード
  const ref = useRef();
  ref.current = data; // ルール違反

  return <div>{ref.current.value}</div>;
}
```

### 除外が必要な場合

- **レガシーコード**: React のルールに違反するコード
- **サードパーティコード**: 制御できないコード
- **一時的な回避策**: コンパイラのバグを回避する必要がある場合

### ベストプラクティス

- 除外の理由をコメントで文書化する
- 除外を一時的なものとし、可能な限り修正する
- 除外されたコンポーネントの数を追跡する

```javascript
function ProblematicComponent({ data }) {
  "use no memo";

  // TODO: このコンポーネントを React のルールに準拠するようにリファクタリング
  // 問題: useRef が render フェーズで変更されている
  const ref = useRef();
  ref.current = data;

  return <div>{ref.current.value}</div>;
}
```

## ランタイムゲーティング

ランタイムゲーティングを使用すると、機能フラグでコンパイルを制御できます。これにより、本番環境でコンパイラをテストし、問題が発生した場合に迅速にロールバックできます。

### 設定

環境変数を使用してコンパイラを制御します:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    process.env.ENABLE_REACT_COMPILER === 'true' && [
      'babel-plugin-react-compiler',
      {
        // コンパイラオプション
      }
    ],
  ].filter(Boolean),
};
```

### A/B テストでの使用

```javascript
// babel.config.js
const isCompilerEnabled =
  process.env.ENABLE_REACT_COMPILER === 'true' ||
  process.env.USER_SEGMENT === 'beta';

module.exports = {
  plugins: [
    isCompilerEnabled && 'babel-plugin-react-compiler',
  ].filter(Boolean),
};
```

### 段階的なロールアウト

```javascript
// babel.config.js
const compilerRolloutPercentage = parseInt(
  process.env.COMPILER_ROLLOUT_PERCENTAGE || '0',
  10
);

const isCompilerEnabled =
  Math.random() * 100 < compilerRolloutPercentage;

module.exports = {
  plugins: [
    isCompilerEnabled && 'babel-plugin-react-compiler',
  ].filter(Boolean),
};
```

### 機能フラグサービスとの統合

```javascript
// babel.config.js
const featureFlags = require('./feature-flags');

module.exports = {
  plugins: [
    featureFlags.isEnabled('react-compiler') &&
      'babel-plugin-react-compiler',
  ].filter(Boolean),
};
```

## 導入の進捗モニタリング

導入の進捗を追跡することは、成功を測定し、問題を特定するために重要です。

### カバレッジの測定

コンパイルされたコンポーネントの数を追跡します:

```javascript
// scripts/count-compiled-components.js
const fs = require('fs');
const path = require('path');

function countComponents(dir) {
  let total = 0;
  let compiled = 0;

  function walk(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.match(/\.(jsx?|tsx?)$/)) {
        const content = fs.readFileSync(filePath, 'utf-8');

        // コンポーネントをカウント
        const componentMatches = content.match(
          /function\s+[A-Z]\w*|const\s+[A-Z]\w*\s*=/g
        );

        if (componentMatches) {
          total += componentMatches.length;

          // "use memo" を持つコンポーネントをカウント
          if (content.includes('"use memo"')) {
            compiled += componentMatches.length;
          }
        }
      }
    }
  }

  walk(dir);
  return { total, compiled, percentage: (compiled / total * 100).toFixed(2) };
}

const stats = countComponents('./src');
console.log(`Total components: ${stats.total}`);
console.log(`Compiled components: ${stats.compiled}`);
console.log(`Coverage: ${stats.percentage}%`);
```

### パフォーマンスの測定

React DevTools の Profiler を使用してパフォーマンスを測定します:

1. **ベースラインの確立**: コンパイラなしでプロファイルを取得
2. **コンパイル後の測定**: コンパイラ有効後にプロファイルを取得
3. **比較**: 再レンダリングの数と時間を比較

### エラーの追跡

コンパイラ関連のエラーを追跡します:

```javascript
// src/error-boundary.jsx
import { Component } from 'react';

class CompilerErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // エラー追跡サービスに送信
    if (error.message.includes('compiler')) {
      trackError('react-compiler-error', {
        error: error.message,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    return this.props.children;
  }
}
```

### ダッシュボードの作成

導入の進捗を視覚化するダッシュボードを作成します:

- コンパイルされたコンポーネントの数
- カバレッジの割合
- パフォーマンスの改善
- エラー率
- ロールバックの回数

## ベストプラクティス

### 段階的な導入のベストプラクティス

1. **小さく始める**: 1 つのディレクトリまたはコンポーネントから始める
2. **徹底的にテスト**: 各段階で徹底的にテストする
3. **パフォーマンスを測定**: 実際のパフォーマンス改善を測定する
4. **問題を文書化**: 問題と解決策を文書化する
5. **チームに情報を提供**: 進捗と学びをチームと共有する

### 除外のベストプラクティス

1. **理由を文書化**: 除外の理由を明確にする
2. **一時的に保つ**: 除外を永続的なものとしない
3. **修正を計画**: 除外されたコンポーネントを修正する計画を立てる
4. **追跡する**: 除外されたコンポーネントの数を追跡する

### モニタリングのベストプラクティス

1. **カバレッジを追跡**: コンパイルされたコンポーネントの割合を追跡
2. **パフォーマンスを測定**: 実際のパフォーマンス改善を測定
3. **エラーを監視**: コンパイラ関連のエラーを監視
4. **視覚化する**: ダッシュボードで進捗を視覚化
5. **定期的にレビュー**: 定期的に進捗と問題をレビュー

## トラブルシューティング

### コンパイラが一部のコンポーネントをスキップする

コンパイラが一部のコンポーネントをスキップしている場合:

1. ESLint ルールを実行して React のルール違反を確認
2. ビルドログでコンパイラの警告を確認
3. [デバッグガイド](./debugging.md)を参照

### パフォーマンスが改善しない

パフォーマンスが改善しない場合:

1. React DevTools の Profiler で再レンダリングを確認
2. コンパイラが実際にコンポーネントを最適化しているか確認
3. ボトルネックが他の場所にある可能性を検討

### ビルド時間が長くなる

ビルド時間が長くなる場合:

1. コンパイラを特定のディレクトリに制限
2. 除外パターンを使用して不要なファイルをスキップ
3. ビルドキャッシュを有効にする

## 次のステップ

- [デバッグ](./debugging.md) - 問題が発生した場合のトラブルシューティング
- [設定オプション](/reference/react-compiler/configuration) - 詳細な設定オプション
- [ディレクティブ](/reference/react-compiler/directives) - 関数レベルのコンパイル制御

## その他のリソース

- [React Compiler Working Group](https://github.com/reactwg/react-compiler) - 追加情報と議論
- [React のルール](/reference/rules) - React Compiler が理解するルール
- [ESLint プラグイン](/reference/react-compiler/eslint) - コンパイラの ESLint 統合
