# Expo AtlasとLighthouseを使用したJavaScriptバンドルの分析

## 主要なポイント

### バンドルパフォーマンス

- バンドルパフォーマンスはプラットフォームによって異なります
- Webブラウザはプリコンパイルされたバイトコードをサポートしていません
- 小さいバンドルは起動時間とパフォーマンスを改善します

## Expo Atlas

Expo Atlasは、本番バンドルを視覚化し、ライブラリがバンドルサイズに与える影響を特定するのに役立ちます。

### 使用方法

#### 1. npx expo startと併用

ローカル開発サーバーでAtlasを有効にします：

```bash
EXPO_ATLAS=true npx expo start
```

ブラウザが自動的に開き、バンドル分析が表示されます。

#### 2. npx expo exportと併用

すべてのプラットフォーム向けにアプリをエクスポートします：

```bash
EXPO_ATLAS=true npx expo export
```

このコマンドは、本番バンドルを生成し、分析データを作成します。

### Atlasの機能

#### バンドルサイズの視覚化

各モジュールとライブラリがバンドルサイズに占める割合を視覚的に表示します。

#### ライブラリの影響分析

どのライブラリが最も多くのスペースを占めているかを特定します。

#### 最適化の提案

バンドルサイズを削減するための推奨事項を提供します。

### Atlasの読み方

#### 大きなブロック

大きなブロックは、バンドルの大部分を占めるモジュールを示します。

#### 色分け

- **青**: アプリコード
- **緑**: node_modulesのライブラリ
- **オレンジ**: 画像やその他のアセット

#### クリックして詳細表示

各ブロックをクリックすると、詳細情報が表示されます。

## 代替分析: source-map-explorer

SDK 50以前のバージョンでは、`source-map-explorer`を使用できます。

### 1. インストール

```bash
npm install --save-dev source-map-explorer
```

### 2. package.jsonにスクリプトを追加

```json
{
  "scripts": {
    "analyze:web": "source-map-explorer 'dist/_expo/static/js/*.js' 'dist/_expo/static/js/*.js.map'",
    "analyze:android": "source-map-explorer 'android/app/build/generated/assets/react/release/*.bundle.map'",
    "analyze:ios": "source-map-explorer 'ios/build/Build/Products/Release-iphonesimulator/*.app/main.jsbundle.map'"
  }
}
```

### 3. 本番バンドルをソースマップ付きでエクスポート

```bash
npx expo export -p web --source-maps
```

### 4. バンドルの分析

```bash
npm run analyze:web
```

## Lighthouse

Lighthouseは、Webサイトのパフォーマンス、アクセシビリティ、SEOをテストするツールです。

### Chrome Audit タブを使用

1. Google Chromeでアプリを開く
2. DevToolsを開く（F12またはCmd+Opt+I）
3. **Lighthouse**タブを選択
4. **Generate report**をクリック

### Lighthouse CLIを使用

#### インストール

```bash
npm install -g lighthouse
```

#### 実行

```bash
npx lighthouse <url> --view
```

例：

```bash
npx lighthouse https://myapp.com --view
```

### Lighthouseのレポート項目

#### 1. Performance（パフォーマンス）

- First Contentful Paint（FCP）
- Largest Contentful Paint（LCP）
- Total Blocking Time（TBT）
- Cumulative Layout Shift（CLS）
- Speed Index

#### 2. Accessibility（アクセシビリティ）

- ARIA属性
- カラーコントラスト
- フォーカス可能な要素

#### 3. Best Practices（ベストプラクティス）

- HTTPS使用
- 画像の最適化
- JavaScriptエラー

#### 4. SEO

- メタタグ
- レスポンシブデザイン
- クローラビリティ

#### 5. Progressive Web App（PWA）

- Service Worker
- マニフェストファイル
- オフライン機能

### Lighthouseのカスタム設定

#### 特定のカテゴリのみをテスト

```bash
npx lighthouse <url> --only-categories=performance --view
```

#### モバイルエミュレーション

```bash
npx lighthouse <url> --preset=mobile --view
```

#### デスクトップモード

```bash
npx lighthouse <url> --preset=desktop --view
```

## バンドルサイズの最適化

### 1. 未使用の依存関係を削除

```bash
npm uninstall <unused-package>
```

### 2. Tree Shakingを有効化

`metro.config.js`で設定します（前述の「Metroバンドラーのカスタマイズ」を参照）。

### 3. 動的インポートを使用

必要なときだけモジュールを読み込みます：

```typescript
// 静的インポート
import HeavyComponent from './HeavyComponent';

// 動的インポート
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### 4. 軽量な代替ライブラリを使用

例：

- `moment` → `date-fns`または`dayjs`
- `lodash` → `lodash-es`またはネイティブJavaScript

### 5. アセットの最適化

- 画像を圧縮
- WebP形式を使用
- 適切なサイズの画像を使用

## CI/CDでの自動分析

### GitHub Actionsの例

```yaml
name: Bundle Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: EXPO_ATLAS=true npx expo export -p web
      - run: npm run analyze:web
```

### バンドルサイズのしきい値設定

```json
{
  "bundlesize": [
    {
      "path": "dist/_expo/static/js/*.js",
      "maxSize": "500 kB"
    }
  ]
}
```

## まとめ

JavaScriptバンドルの分析は、アプリのパフォーマンス最適化に不可欠です。Expo AtlasとLighthouseを使用することで、バンドルサイズの視覚化、パフォーマンスの測定、最適化の機会の特定が可能になります。定期的な分析とCI/CDへの統合により、アプリのパフォーマンスを継続的に改善できます。
