# JavaScriptの圧縮（Minification）

## 概要

圧縮（Minification）は、以下を行う最適化ビルドステップです：

- 不要な文字の削除
- 空白の折りたたみ
- コメントの削除
- 静的操作の短縮

## Expo CLIでの圧縮

圧縮は本番エクスポート時に自動的に実行されます（例：`npx expo export`、`eas build`）。

### 圧縮の例

#### 入力

```javascript
console.log('a' + ' ' + 'long' + ' string' + ' to ' + 'collapse');
```

#### 出力

```javascript
console.log('a long string to collapse');
```

## コンソールログの削除

`metro.config.js`を設定してコンソールログを削除できます：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  compress: {
    // すべてのconsole.*呼び出しを削除
    drop_console: true,
  },
};

module.exports = config;
```

### 特定のコンソールメソッドのみを削除

```javascript
config.transformer.minifierConfig = {
  compress: {
    // console.logとconsole.infoのみを削除
    pure_funcs: ['console.log', 'console.info'],
  },
};
```

## Minifierのカスタマイズ

### Terser（デフォルトMinifier）

Terserはデフォルトのminifierです。

#### インストール

```bash
yarn add --dev metro-minify-terser
```

#### 設定

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  // Terserオプション
  ecma: 8,
  keep_classnames: true,
  keep_fnames: true,
  module: true,
  mangle: {
    module: true,
    keep_classnames: true,
    keep_fnames: true,
  },
  compress: {
    drop_console: false,
    pure_funcs: [],
  },
};

module.exports = config;
```

### esbuild

esbuildはより高速な圧縮を提供します。

#### インストール

```bash
yarn add --dev metro-minify-esbuild
```

#### 設定

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-esbuild';
config.transformer.minifierConfig = {
  // esbuildオプション
};

module.exports = config;
```

### Uglify

Uglifyは古いminifierですが、依然としてサポートされています。

#### インストール

```bash
yarn add --dev metro-minify-uglify
```

#### 設定

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-uglify';

module.exports = config;
```

## 高度なオプション

### 「Unsafe」最適化の有効化

より積極的な圧縮のために、「unsafe」最適化を有効にできます：

```javascript
config.transformer.minifierConfig = {
  compress: {
    // より積極的な圧縮
    unsafe: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_math: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
  },
};
```

> **警告**: 「unsafe」最適化は、一部のコードで問題を引き起こす可能性があります。十分にテストしてください。

### クラス名と関数名の保持

デバッグやエラー追跡のために、クラス名と関数名を保持できます：

```javascript
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};
```

### デッドコードの削除

使用されていないコードを削除します：

```javascript
config.transformer.minifierConfig = {
  compress: {
    dead_code: true,
    unused: true,
  },
};
```

## パフォーマンスの最適化

### 並列圧縮

複数のワーカーを使用して圧縮を並列化できます（Terserのみ）：

```javascript
config.transformer.minifierConfig = {
  compress: {
    // 圧縮オプション
  },
  mangle: {
    // マングリングオプション
  },
  // 並列ワーカー数
  parallel: true,
};
```

### ソースマップの生成

デバッグのためにソースマップを生成できます：

```bash
npx expo export --platform web --source-maps
```

## 圧縮の検証

### バンドルサイズの確認

圧縮前後のバンドルサイズを比較します：

```bash
# 圧縮前
du -h dist/_expo/static/js/*.js

# 圧縮後（自動的に実行される）
du -h dist/_expo/static/js/*.js
```

### Expo Atlasでの分析

```bash
EXPO_ATLAS=true npx expo export --platform web
```

## ベストプラクティス

### 1. 本番ビルドでのみ圧縮

開発中は圧縮を無効にして、デバッグを容易にします。

### 2. コンソールログを削除

本番環境では、コンソールログを削除してバンドルサイズを削減します。

### 3. ソースマップを保持

エラー追跡のために、本番環境でもソースマップを保持することを検討してください。

### 4. 圧縮設定をテスト

圧縮設定を変更した後は、十分にテストしてください。

## トラブルシューティング

### 圧縮後にアプリが動作しない

#### デバッグ手順

1. **unsafe最適化を無効化**：`unsafe: false`
2. **クラス名と関数名を保持**：`keep_classnames: true`、`keep_fnames: true`
3. **特定の関数を除外**：`pure_funcs`から削除
4. **ソースマップを確認**：エラーの原因を特定

### 圧縮が遅い

#### 最適化手順

1. **並列圧縮を有効化**：`parallel: true`
2. **esbuildに切り替え**：より高速な圧縮
3. **圧縮オプションを簡素化**：不要なオプションを削除

## まとめ

JavaScriptの圧縮は、本番バンドルのサイズを削減し、アプリのパフォーマンスを向上させる重要な最適化です。Expo CLIはデフォルトで圧縮を自動的に実行しますが、`metro.config.js`を使用してカスタマイズできます。適切な圧縮設定により、バンドルサイズを大幅に削減し、起動時間を改善できます。
