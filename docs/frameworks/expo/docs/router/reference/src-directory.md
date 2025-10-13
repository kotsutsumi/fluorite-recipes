# srcディレクトリ

Expo Routerでトップレベルsrcディレクトリを使用する方法を学びます。

## srcディレクトリとは

プロジェクトが大きくなるにつれて、アプリケーションコードを単一の`src`ディレクトリに移動できます。Expo Routerは、この構成を標準でサポートしています。

## 推奨される構造

```
src/
  app/
    _layout.tsx
    index.tsx
  components/
    button.tsx
package.json
```

## 重要な注意事項

### 設定ファイルはルートディレクトリに配置

設定ファイルは、プロジェクトのルートディレクトリに残す必要があります。

**ルートに残すファイル**：
- `package.json`
- `app.json` / `app.config.ts`
- `tsconfig.json`
- `babel.config.js`
- `metro.config.js`

### src/appの優先順位

`src/app`ディレクトリは、ルートの`app`ディレクトリよりも優先されます。

**動作**：
```
プロジェクト/
├── app/          # 無視される
│   └── index.tsx
├── src/
│   └── app/      # 使用される
│       └── index.tsx
```

### publicディレクトリはルートに配置

`public`ディレクトリは、ルートディレクトリに配置します。

```
プロジェクト/
├── src/
│   └── app/
├── public/
│   └── favicon.ico
```

## 静的レンダリング

静的レンダリングは、`src/app`が存在する場合、自動的にそれを使用します。

**設定不要**: 追加の設定は必要ありません。

## カスタムディレクトリ（非推奨）

### 警告

デフォルトのルートディレクトリを変更することは、**強く推奨されません**。

**理由**：
- 予期しない動作を引き起こす可能性
- コミュニティツールとの互換性問題
- メンテナンスの複雑化

### カスタム設定の例（使用しないでください）

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "root": "./src/routes"
        }
      ]
    ]
  }
}
```

**推奨**: 標準の`src/app`構造を使用してください。

## マイグレーション手順

### ステップ1: srcディレクトリの作成

```bash
mkdir src
```

### ステップ2: appディレクトリの移動

```bash
mv app src/
```

### ステップ3: コンポーネントの移動（オプション）

```bash
mkdir src/components
mv components/* src/components/
```

### ステップ4: インポートパスの更新

**変更前**：
```typescript
import Button from '../components/button';
```

**変更後**：
```typescript
import Button from '@/components/button';
```

### ステップ5: パスエイリアスの設定

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## プロジェクト構造の例

### 小規模プロジェクト

```
project/
├── src/
│   └── app/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── about.tsx
├── public/
│   └── favicon.ico
├── package.json
└── app.json
```

### 中規模プロジェクト

```
project/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── (tabs)/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── hooks/
│       └── useAuth.ts
├── public/
├── package.json
└── app.json
```

### 大規模プロジェクト

```
project/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── (tabs)/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   └── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
├── public/
├── package.json
└── app.json
```

## ベストプラクティス

### 1. 標準構造を使用

常に`src/app`構造を使用してください。

```
src/
  app/
```

### 2. 設定ファイルはルートに配置

設定ファイルはルートディレクトリに残してください。

### 3. パスエイリアスの活用

相対パスではなく、パスエイリアスを使用してください。

```typescript
// ✅ 推奨
import Button from '@/components/Button';

// ❌ 非推奨
import Button from '../../components/Button';
```

### 4. 論理的なディレクトリ構造

機能ごとにコードを整理してください。

```
src/
  app/
  components/
  hooks/
  lib/
  services/
  types/
```

## まとめ

Expo Routerのsrcディレクトリは、以下の特徴があります：

1. **標準サポート**: `src/app`を自動的に認識
2. **優先順位**: `src/app`がルートの`app`より優先
3. **静的レンダリング対応**: 自動的に`src/app`を使用

**推奨される構造**：
```
src/
  app/
  components/
  hooks/
  lib/
```

**重要な注意事項**：
- 設定ファイルはルートに配置
- publicディレクトリはルートに配置
- カスタムディレクトリは非推奨

**ベストプラクティス**：
- 標準構造を使用
- パスエイリアスを活用
- 論理的なディレクトリ構造

これらの機能を活用して、大規模プロジェクトでも管理しやすいコード構造を維持できます。
