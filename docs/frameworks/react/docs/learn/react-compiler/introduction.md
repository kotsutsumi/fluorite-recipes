# React Compiler の紹介

React Compiler は、React アプリを自動的に最適化する新しいビルド時ツールです。プレーンな JavaScript で動作し、[React のルール](/reference/rules)を理解するため、コードを書き直す必要はありません。

## このページで学ぶこと

- React Compiler の動作
- コンパイラの使い始め
- 段階的な導入戦略
- 問題が発生した際のデバッグとトラブルシューティング
- React ライブラリでのコンパイラの使用

> **補足**
>
> React Compiler は現在、リリース候補 (RC) 段階です。現在、誰もがコンパイラを試して、フィードバックを提供することをお勧めしています。

## React Compiler は何をするのか?

React Compiler は、ビルド時に React アプリケーションを自動的に最適化します。React は通常、最適化なしでも十分に高速ですが、アプリの応答性を維持するために、コンポーネントと値を手動でメモ化する必要がある場合があります。この手動のメモ化は面倒で、間違いやすく、メンテナンスするコードが増えます。React Compiler はこの最適化を自動的に行い、あなたをこの精神的な負担から解放し、機能の構築に集中できるようにします。

### React Compiler 以前

コンパイラなしでは、再レンダリングを最適化するために、コンポーネントと値を手動でメモ化する必要があります:

```javascript
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

### React Compiler 以後

React Compiler を使用すると、手動でメモ化することなく、同じコードを記述できます:

```javascript
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

コンパイラは、コンポーネントと値を自動的にメモ化し、再レンダリングを最適化します。これにより、コードがよりシンプルで読みやすくなり、バグが発生しにくくなります。

## React Compiler の仕組み

React Compiler は、あなたのコードを分析し、[React のルール](/reference/rules)に従っていることを確認します。その後、コンポーネントと値を自動的にメモ化するコードを生成します。

コンパイラは以下を理解します:

- **コンポーネントの純粋性**: コンポーネントが副作用なしで同じ入力に対して同じ出力を生成すること
- **データの依存関係**: どの値が他の値に依存しているか
- **レンダリングの最適化**: いつ再レンダリングをスキップできるか

### コンパイラが処理するもの

React Compiler は以下を自動的に処理します:

- `useMemo` - 高価な計算をメモ化
- `useCallback` - 関数をメモ化
- `React.memo` - コンポーネントをメモ化

これにより、これらのフックを手動で使用する必要がなくなります。

## 使い始め方

React Compiler を使い始めるには:

1. **インストール**: React Compiler をプロジェクトにインストール
2. **設定**: ビルドツールでコンパイラを設定
3. **検証**: セットアップが正しく動作することを確認

詳細については、[インストールガイド](./installation.md)を参照してください。

## 段階的な導入

既存のプロジェクトでは、コードベース全体を一度に移行する必要はありません。段階的な導入戦略を使用できます:

- **ディレクトリベースの導入**: 特定のディレクトリにコンパイラを適用
- **オプトイン方式**: `"use memo"` ディレクティブで明示的にコンポーネントをオプトイン
- **ランタイムゲーティング**: 機能フラグでコンパイルを制御

詳細については、[段階的な導入ガイド](./incremental-adoption.md)を参照してください。

## デバッグとトラブルシューティング

問題が発生した場合:

1. **コンパイラエラーとランタイムの問題を区別**
2. **一般的な破壊的パターンを特定**
3. **体系的なデバッグワークフローに従う**

詳細については、[デバッグガイド](./debugging.md)を参照してください。

## React ライブラリでの使用

React Compiler は、React ライブラリでも使用できます。ライブラリを事前コンパイルして出荷することで、ユーザーがコンパイラを使用していなくても最適化の恩恵を受けることができます。

詳細については、[ライブラリのコンパイルガイド](/reference/react-compiler/compiling-libraries)を参照してください。

## よくある質問

### React Compiler は必須ですか?

いいえ、React Compiler はオプションです。React は最適化なしでも十分に高速です。コンパイラは、特定のパフォーマンスの問題がある場合や、手動でメモ化するコードを減らしたい場合に役立ちます。

### 既存のコードを書き直す必要がありますか?

いいえ、React Compiler はプレーンな JavaScript で動作します。コードを書き直す必要はありません。ただし、[React のルール](/reference/rules)に従っていることを確認してください。

### どのバージョンの React が必要ですか?

React Compiler は React 19 で最適に動作するように設計されていますが、React 17 と 18 もサポートしています。詳細については、[React バージョン互換性](/reference/react-compiler/target)を参照してください。

### パフォーマンスへの影響は?

React Compiler は、ビルド時に最適化を行うため、ランタイムのパフォーマンスへの影響はありません。実際、多くの場合、手動でメモ化するよりも効率的です。

## 次のステップ

- [インストール](./installation.md) - React Compiler をインストールして設定する
- [段階的な導入](./incremental-adoption.md) - 既存のプロジェクトに段階的に導入する
- [デバッグ](./debugging.md) - 問題が発生した場合のトラブルシューティング
- [設定オプション](/reference/react-compiler/configuration) - 詳細な設定オプション

## その他のリソース

- [React Compiler Working Group](https://github.com/reactwg/react-compiler) - 追加情報と議論
- [React のルール](/reference/rules) - React Compiler が理解するルール
- [React 19 リリースノート](https://react.dev/blog/2024/12/05/react-19) - React 19 の新機能
