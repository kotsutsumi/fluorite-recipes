# 開発モードと本番モード

ExpoとReact Nativeアプリは、開発モードと本番モードの2つのモードで実行できます。

## 開発モード

開発モードは、開発者に役立つツールと警告を提供します。

### 主な機能

#### 1. リモートJavaScriptデバッグ

ChromeまたはEdgeでJavaScriptをデバッグできます。

#### 2. Live Reload

コードを変更すると、アプリが自動的にリロードされます。

#### 3. Hot Reloading

コンポーネントの状態を保持したまま、コードの変更を即座に反映します。

#### 4. Element Inspector

UIelementを検査して、スタイルとプロパティを確認できます。

#### 5. ランタイム検証と警告

開発中の問題を早期に検出する警告とエラーメッセージ。

### パフォーマンスへの影響

> **注意**: アプリは開発モードでは遅く実行されます。

開発モードでは、以下の理由でパフォーマンスが低下します：

- **追加の検証**: プロップタイプの検証など
- **警告メッセージ**: コンソール警告の生成
- **デバッグ情報**: スタックトレースの生成
- **ソースマップ**: デバッグ用のマッピング

### Developer Menu

Developer Menuは、AndroidとiOSでデバッグ機能へのアクセスを提供します。

#### 開き方

##### iOS

- **シミュレーター**: `Cmd + D`
- **デバイス**: デバイスを振る

##### Android

- **エミュレーター**: `Cmd + M`（macOS）または`Ctrl + M`（Windows/Linux）
- **デバイス**: デバイスを振る

#### メニューオプション

- **Reload**: アプリをリロード
- **Debug**: ChromeデバッガーまたはReact Native Debuggerを開く
- **Enable Fast Refresh**: Fast Refreshを有効化/無効化
- **Enable Performance Monitor**: パフォーマンスモニターを表示
- **Toggle Inspector**: Element Inspectorを切り替え
- **Show Perf Monitor**: FPSとメモリ使用量を表示

## 本番モード

本番モードは、以下の用途に役立ちます：

### 1. アプリのパフォーマンステスト

実際のパフォーマンスを測定します。

### 2. 本番固有のバグのキャッチ

本番環境でのみ発生するバグを検出します。

### 本番モードでの実行

```bash
npx expo start --no-dev --minify
```

#### フラグの説明

- **`--no-dev`**: 開発モードを無効化
- **`--minify`**: JavaScriptコードを圧縮

### 本番モードの特徴

#### 1. `__DEV__`環境変数が`false`に設定

```typescript
if (__DEV__) {
  // このコードは本番ビルドから削除されます
  console.log('開発モード');
}
```

#### 2. コードの圧縮

不要なデータ（コメントや未使用のコードなど）が削除されます。

#### 3. 最適化

パフォーマンスが最適化されます。

### 完全な本番コンパイル

完全に本番用にコンパイルするには：

#### Android

```bash
npx expo run:android --variant release
```

#### iOS

```bash
npx expo run:ios --configuration Release
```

または、Xcodeで：

1. **Product** → **Scheme** → **Edit Scheme**
2. **Build Configuration**を**Release**に設定
3. **Product** → **Build**

## モード間の切り替え

### 開発モードから本番モードへ

```bash
# 開発モードで起動
npx expo start

# 本番モードで起動
npx expo start --no-dev --minify
```

### 本番モードから開発モードへ

```bash
# 本番モードで起動中
# 停止（Ctrl+C）

# 開発モードで再起動
npx expo start
```

## 環境変数の使用

### `__DEV__`グローバル変数

開発モードと本番モードを区別します：

```typescript
if (__DEV__) {
  console.log('開発モードで実行中');
} else {
  console.log('本番モードで実行中');
}
```

### `process.env.NODE_ENV`

Node.js環境変数：

```typescript
if (process.env.NODE_ENV === 'development') {
  // 開発モードのみのコード
}

if (process.env.NODE_ENV === 'production') {
  // 本番モードのみのコード
}
```

## ベストプラクティス

### 1. 開発中は開発モードを使用

デバッグツールと警告を活用してください。

### 2. パフォーマンステストは本番モードで

実際のパフォーマンスを測定するには、本番モードを使用してください。

### 3. 本番固有のコードを分離

```typescript
const apiUrl = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.production.com';
```

### 4. コンソールログを削除

本番ビルドからコンソールログを削除してください（「JavaScriptの圧縮」を参照）。

## トラブルシューティング

### 本番モードでアプリが動作しない

#### デバッグ手順

1. **ソースマップを有効化**：エラーの原因を特定
2. **段階的にテスト**：機能ごとにテスト
3. **`__DEV__`チェックを確認**：条件分岐を検証

### Developer Menuが開かない

#### 解決策

1. **Expo Goを再起動**
2. **デバイスを再接続**
3. **開発サーバーを再起動**

## まとめ

開発モードと本番モードを理解し、適切に切り替えることで、効率的な開発とテストが可能になります。開発中は開発モードでデバッグツールを活用し、パフォーマンステストと本番リリース前には本番モードを使用してください。
