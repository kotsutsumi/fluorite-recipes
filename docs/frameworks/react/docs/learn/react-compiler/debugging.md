# デバッグとトラブルシューティング

React Compiler を使用する際の問題の特定と修正に役立つガイドです。コンパイルの問題をデバッグし、一般的な問題を解決する方法を学びます。

## このページで学ぶこと

- コンパイラエラーとランタイムの問題の違い
- コンパイルを破壊する一般的なパターン
- ステップバイステップのデバッグワークフロー
- コンパイラの動作の理解
- 問題の報告方法

## コンパイラの動作を理解する

React Compiler は、[React のルール](/reference/rules)に従うコードを処理するように設計されています。これらのルールを破る可能性のあるコードに遭遇した場合、アプリの動作を変更するリスクを避けるため、安全に最適化をスキップします。

### コンパイラエラー vs ランタイムの問題

**コンパイラエラー**はビルド時に発生し、コードのコンパイルを防ぎます。コンパイラは問題のあるコードをスキップするように設計されているため、これらは稀です。

**ランタイムの問題**は、コンパイルされたコードが予期せぬ動作をする際に発生します。React Compiler で問題に遭遇した場合、ほとんどの場合はランタイムの問題です。これは通常、コードが微妙な方法で React のルールに違反しており、コンパイラが検出できなかったために発生します。

デバッグの際は、影響を受けたコンポーネントで React のルール違反を見つけることに注力してください。

## 一般的な破壊パターン

React Compiler がアプリを破壊する主な方法の 1 つは、コードがメモ化の正確性に依存している場合です。これは、アプリが特定の値がメモ化されることに依存していることを意味します。コンパイラは手動のアプローチとは異なる方法でメモ化する可能性があるため、これは予期しない動作につながる可能性があります。

### 参照等価性に依存するエフェクト

最も一般的な問題の 1 つは、エフェクトがオブジェクトや配列が複数のレンダリングで同じ参照を維持することに依存している場合です。

#### 問題のあるコード

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 問題: options オブジェクトは毎回新しい参照を持つ
  const options = {
    includeDetails: true,
    includePreferences: true,
  };

  useEffect(() => {
    fetchUser(userId, options).then(setUser);
  }, [userId, options]); // options が毎回変わるため、エフェクトが過剰に発火

  return <div>{user?.name}</div>;
}
```

#### 修正

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // オプションをエフェクト内に移動
    const options = {
      includeDetails: true,
      includePreferences: true,
    };

    fetchUser(userId, options).then(setUser);
  }, [userId]); // options は依存関係ではない

  return <div>{user?.name}</div>;
}
```

または、options が props から来る場合:

```javascript
function UserProfile({ userId, options }) {
  const [user, setUser] = useState(null);

  // オプションを安定化
  const stableOptions = useMemo(() => options, [
    options.includeDetails,
    options.includePreferences,
  ]);

  useEffect(() => {
    fetchUser(userId, stableOptions).then(setUser);
  }, [userId, stableOptions]);

  return <div>{user?.name}</div>;
}
```

### 無限ループ

不安定な依存関係がエフェクトで状態を更新する際に、無限ループが発生する可能性があります。

#### 問題のあるコード

```javascript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  // 問題: filters は毎回新しい参照
  const filters = {
    minScore: 0.8,
    maxResults: 10,
  };

  useEffect(() => {
    search(query, filters).then(setResults);
  }, [query, filters]); // filters が変わるため、無限ループ

  return <ResultsList results={results} />;
}
```

#### 修正

```javascript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // filters をエフェクト内に移動
    const filters = {
      minScore: 0.8,
      maxResults: 10,
    };

    search(query, filters).then(setResults);
  }, [query]);

  return <ResultsList results={results} />;
}
```

### 参照チェックに基づく条件ロジック

参照等価性チェックを使用してキャッシングや最適化を行うコードは、問題を引き起こす可能性があります。

#### 問題のあるコード

```javascript
function DataGrid({ data, columns }) {
  const [processedData, setProcessedData] = useState(null);
  const lastDataRef = useRef(null);

  // 問題: 参照等価性でキャッシング
  if (lastDataRef.current !== data) {
    const processed = expensiveProcessing(data, columns);
    setProcessedData(processed);
    lastDataRef.current = data;
  }

  return <Grid data={processedData} />;
}
```

#### 修正

```javascript
function DataGrid({ data, columns }) {
  // useMemo を使用して適切にメモ化
  const processedData = useMemo(() => {
    return expensiveProcessing(data, columns);
  }, [data, columns]);

  return <Grid data={processedData} />;
}
```

### レンダリング中の副作用

レンダリング中に副作用を実行すると、予期しない動作が発生する可能性があります。

#### 問題のあるコード

```javascript
function TrackingComponent({ eventName }) {
  // 問題: レンダリング中にトラッキング
  analytics.track(eventName);

  return <div>Content</div>;
}
```

#### 修正

```javascript
function TrackingComponent({ eventName }) {
  // エフェクトを使用
  useEffect(() => {
    analytics.track(eventName);
  }, [eventName]);

  return <div>Content</div>;
}
```

### Ref の誤用

レンダリングフェーズで ref を変更すると、問題が発生する可能性があります。

#### 問題のあるコード

```javascript
function RenderCounter() {
  const renderCount = useRef(0);

  // 問題: レンダリング中に ref を変更
  renderCount.current += 1;

  return <div>Rendered {renderCount.current} times</div>;
}
```

#### 修正

```javascript
function RenderCounter() {
  const [renderCount, setRenderCount] = useState(0);

  // エフェクトを使用してカウントを更新
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return <div>Rendered {renderCount} times</div>;
}
```

## デバッグワークフロー

問題に遭遇した場合、次のステップバイステップのワークフローに従ってください:

### 1. コンパイラビルドエラー

コンパイラエラーが予期せずビルドを破壊する場合、これはコンパイラのバグである可能性があります。[facebook/react](https://github.com/facebook/react) に報告してください。

一時的な回避策として、`"use no memo"` ディレクティブで問題のあるコンポーネントを除外できます:

```javascript
function ProblematicComponent() {
  "use no memo";

  // 問題のあるコード
}
```

### 2. ランタイムの問題を特定する

ランタイムの問題に遭遇した場合:

#### ステップ 1: コンパイラを無効にして確認

コンパイラを無効にしてアプリをテストし、問題が解決するか確認します:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    // 'babel-plugin-react-compiler', // コメントアウト
  ],
};
```

問題が解決した場合、コンパイラが原因です。

#### ステップ 2: 問題のあるコンポーネントを隔離する

バイナリサーチを使用して、問題のあるコンポーネントを見つけます:

```javascript
// babel.config.js
module.exports = {
  overrides: [
    {
      // 半分のコンポーネントのみをコンパイル
      test: './src/components/A-M/**/*.{js,jsx,ts,tsx}',
      plugins: ['babel-plugin-react-compiler'],
    },
  ],
};
```

問題が解決するまで範囲を狭めます。

#### ステップ 3: ESLint ルールを実行する

問題のあるコンポーネントで ESLint ルールを実行します:

```bash
npx eslint src/components/ProblematicComponent.jsx
```

React のルール違反を探します。

#### ステップ 4: React DevTools でプロファイル

React DevTools の Profiler を使用して、予期しない再レンダリングを確認します:

1. Profiler タブを開く
2. "Record why each component rendered while profiling" を有効にする
3. 問題を再現する
4. 再レンダリングのパターンを分析する

#### ステップ 5: コンポーネントを除外する

問題のあるコンポーネントを一時的に除外します:

```javascript
function ProblematicComponent() {
  "use no memo";

  // TODO: このコンポーネントを修正する
  // 問題: useEffect が過剰に発火する
}
```

### 3. コンパイラの動作を理解する

コンパイラが何をしているかを理解するには、コンパイルされたコードを確認します:

```bash
# ビルド出力を確認
npm run build -- --verbose
```

または、Babel の出力を確認します:

```bash
npx babel src/components/MyComponent.jsx --plugins=babel-plugin-react-compiler
```

### 4. 問題を報告する

バグを見つけた場合、[facebook/react](https://github.com/facebook/react) に報告してください:

1. 問題を再現する最小限の例を作成
2. 期待される動作と実際の動作を説明
3. React と React Compiler のバージョンを含める
4. ビルド設定を含める

## React DevTools の使用

React DevTools は、コンパイラの動作をデバッグするための強力なツールです。

### コンポーネントのプロファイリング

1. React DevTools の Profiler タブを開く
2. "Record why each component rendered while profiling" を有効にする
3. アプリを操作する
4. 再レンダリングのパターンを分析する

### メモ化の確認

1. Components タブを開く
2. コンポーネントを選択
3. props と state を確認
4. コンポーネントが予期したとおりにメモ化されているか確認

### パフォーマンスの測定

1. Profiler タブで記録を開始
2. パフォーマンステストを実行
3. コンパイラ有効/無効のコミット時間を比較
4. 改善または悪化を特定

## 一般的な問題と解決策

### 問題: エフェクトが過剰に発火する

**原因**: エフェクトの依存関係が不安定

**解決策**:
- 依存関係をエフェクト内に移動
- `useMemo` または `useCallback` で依存関係を安定化
- ESLint ルールで不足している依存関係を確認

### 問題: コンポーネントが更新されない

**原因**: コンポーネントが過剰にメモ化されている

**解決策**:
- props が正しく渡されているか確認
- 参照等価性に依存していないか確認
- `"use no memo"` で一時的に除外してテスト

### 問題: 無限ループ

**原因**: エフェクトが状態を更新し、それが再度エフェクトをトリガー

**解決策**:
- 依存配列を修正
- 不安定な依存関係を削除
- 状態更新ロジックを見直す

### 問題: パフォーマンスが悪化

**原因**: コンパイラのオーバーヘッドまたは不適切なメモ化

**解決策**:
- React DevTools でプロファイル
- 問題のあるコンポーネントを特定
- 必要に応じて除外
- [段階的な導入](./incremental-adoption.md)を検討

### 問題: ビルドが遅くなる

**原因**: コンパイラがすべてのファイルを処理している

**解決策**:
- 特定のディレクトリに制限
- 除外パターンを使用
- ビルドキャッシュを有効にする

## デバッグのベストプラクティス

### 1. 小さく始める

- 1 つのコンポーネントから始める
- 徐々に拡大する
- 各ステップでテストする

### 2. 問題を文書化する

- 問題と解決策を記録
- チームと共有
- 将来の参考のためにドキュメント化

### 3. ESLint ルールを使用する

- すべての開発者に ESLint ルールを有効にする
- CI/CD パイプラインに統合
- 違反を定期的にレビュー

### 4. 定期的にテストする

- ユニットテストを書く
- 統合テストを実行
- E2E テストでカバー

### 5. パフォーマンスを監視する

- ベースラインを確立
- 定期的にプロファイル
- 改善または悪化を追跡

## トラブルシューティングチェックリスト

問題に遭遇した場合、このチェックリストに従ってください:

- [ ] コンパイラを無効にして問題が解決するか確認
- [ ] ESLint ルールを実行して React のルール違反を確認
- [ ] React DevTools でコンポーネントをプロファイル
- [ ] 問題のあるコンポーネントを隔離
- [ ] `"use no memo"` で一時的に除外
- [ ] コンパイルされたコードを確認
- [ ] ドキュメントで一般的なパターンを確認
- [ ] コミュニティに助けを求める
- [ ] バグの場合は GitHub で報告

## コミュニティリソース

助けが必要な場合:

- [React Compiler Working Group](https://github.com/reactwg/react-compiler) - 議論とQ&A
- [React GitHub Issues](https://github.com/facebook/react/issues) - バグ報告
- [React Discord](https://discord.gg/react) - コミュニティサポート
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-compiler) - 質問と回答

## 次のステップ

- [インストール](./installation.md) - React Compiler をインストールして設定する
- [段階的な導入](./incremental-adoption.md) - 既存のプロジェクトに段階的に導入する
- [設定オプション](/reference/react-compiler/configuration) - 詳細な設定オプション
- [React のルール](/reference/rules) - React Compiler が理解するルール

## まとめ

React Compiler のデバッグは、以下の 3 つのステップで行います:

1. **問題を特定**: コンパイラエラーかランタイムの問題かを判断
2. **原因を見つける**: React のルール違反や一般的なパターンを確認
3. **修正または除外**: コードを修正するか、コンポーネントを一時的に除外

常に React のルールに従い、ESLint ルールを使用して問題を早期に発見し、React DevTools でパフォーマンスを監視してください。
