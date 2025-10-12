# Next.js Configuration API Reference

このドキュメントは、Next.js プロジェクトの設定に関する包括的なリファレンスです。LLMが解析・参照しやすいよう、主要な設定カテゴリの要約とリンクを含めています。

## 目次

- [TypeScript設定](#typescript設定)
- [Next.js設定ファイル](#nextjs設定ファイル)
- [設定の優先順位と関係性](#設定の優先順位と関係性)
- [ベストプラクティス](#ベストプラクティス)

---

## TypeScript設定

### [`TypeScript`](./01-typescript.md) 📘

Next.jsにおけるTypeScriptの包括的な設定と使用方法について説明しています。

#### 🔑 **主要な特徴**

- **TypeScriptファースト**: React アプリケーション構築のための TypeScript ファーストな開発体験
- **自動セットアップ**: TypeScript の設定とファイルを自動インストールする組み込みサポート
- **カスタムプラグイン**: VSCode や他のエディター用のカスタム TypeScript プラグインと型チェッカー

#### 📋 **セットアップ方法**

**新しいプロジェクト**:

```bash
npx create-next-app@latest  # デフォルトでTypeScript付属
```

**既存のプロジェクト**:

1. ファイルを `.ts`/`.tsx` にリネーム
2. `next dev` または `next build` を実行
3. 必要な依存関係と `tsconfig.json` が自動生成

#### ⚙️ **重要な設定項目**

- **TypeScript Plugin**: VSCode での高度な型チェックと自動補完
- **型安全なルーティング**: `typedRoutes` による静的型付けリンク
- **カスタム型宣言**: `new-types.d.ts` でのカスタム型定義
- **ビルド時型チェック**: `ignoreBuildErrors` による制御

#### 🔧 **設定のカスタマイズ**

```json
// tsconfig.json での基本設定
{
  "compilerOptions": {
    "skipLibCheck": true,
    "incremental": true // 増分型チェック（v10.2.1+）
  },
  "include": [
    "new-types.d.ts", // カスタム型宣言
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

#### 📈 **バージョン履歴**

- **v15.0.0**: カスタム TypeScript プラグインと型チェッカー追加
- **v13.2.0**: 静的型付けリンクがベータ版で利用可能
- **v12.0.0**: SWC による高速 TypeScript コンパイル
- **v10.2.1**: 増分型チェックサポート追加

---

## Next.js設定ファイル

### [`next.config.js`](./next-config-js.md) ⚙️

Next.js の `next.config.js` で設定可能なすべての設定オプションの包括的なリファレンスです。

#### 🗂️ **主要な設定カテゴリ**

1. **[基本設定](./next-config-js.md#基本設定)**
   - アプリケーション構造（`appDir`、`pageExtensions`）
   - パス・URL設定（`basePath`、`assetPrefix`）
   - 環境変数（`env`）

2. **[ビルド・出力設定](./next-config-js.md#ビルド出力設定)**
   - 出力モード（`output`、`distDir`）
   - 静的生成（`exportPathMap`、`generateEtags`）
   - TypeScript（`typescript.ignoreBuildErrors`）

3. **[開発・デバッグ設定](./next-config-js.md#開発デバッグ設定)**
   - 開発ツール（`devIndicators`、`onDemandEntries`）
   - ログ・デバッグ（`logging`、`productionBrowserSourceMaps`）

4. **[ルーティング・ナビゲーション](./next-config-js.md#ルーティングナビゲーション)**
   - リダイレクト・リライト（`redirects`、`rewrites`）
   - ヘッダー設定（`headers`）

5. **[アセット・リソース管理](./next-config-js.md#アセットリソース管理)**
   - 画像最適化（`images`）
   - 静的アセット（`assetPrefix`、`compress`）

6. **[パフォーマンス・最適化](./next-config-js.md#パフォーマンス最適化)**
   - キャッシュ設定（`cacheLife`、`staleTimes`）
   - バンドル最適化（`optimizePackageImports`、`transpilePackages`）

7. **[セキュリティ設定](./next-config-js.md#セキュリティ設定)**
   - CORS・ヘッダー（`crossOrigin`、`poweredByHeader`）
   - コンテンツセキュリティ

8. **[実験的機能](./next-config-js.md#実験的機能)**
   - パフォーマンス機能（`ppr`、`cacheComponents`）
   - 新機能プレビュー（`reactCompiler`、`typedRoutes`）

9. **[ビルドツール設定](./next-config-js.md#ビルドツール設定)**
   - Webpack・Turbopack（`webpack`、`turbopack`）
   - CSS・スタイル（`cssChunking`、`sassOptions`）

#### ⚡ **重要な設定例**

```javascript
// next.config.js
module.exports = {
  // 基本設定
  basePath: "/docs",
  assetPrefix: "https://cdn.example.com",

  // 出力設定
  output: "standalone", // 最小限のデプロイファイル生成

  // TypeScript
  typescript: {
    ignoreBuildErrors: false, // 推奨: 型エラーでビルド停止
  },

  // パフォーマンス最適化
  images: {
    loader: "cloudinary",
    path: "https://example.com/myaccount/",
  },

  // 実験的機能
  experimental: {
    ppr: true, // Partial Prerendering
    typedRoutes: true, // 型安全なルーティング
  },
};
```

---

## 設定の優先順位と関係性

### 🔄 **TypeScript と next.config.js の関係**

1. **TypeScript設定がnext.config.jsに影響する項目**:
   - `typescript.ignoreBuildErrors`: ビルド時の型エラーハンドリング
   - `experimental.typedRoutes`: 型安全なルーティングの有効化
   - `pageExtensions`: TypeScriptファイル拡張子の認識

2. **next.config.jsがTypeScript体験に影響する項目**:
   - `webpack`: TypeScriptローダーのカスタマイズ
   - `turbopack`: 高速TypeScriptコンパイル設定
   - `serverExternalPackages`: サーバーサイド型定義の制御

### 📁 **設定ファイルの階層**

```
プロジェクトルート/
├── next.config.js      # Next.js メイン設定
├── tsconfig.json       # TypeScript コンパイラ設定
├── next-env.d.ts       # Next.js 型定義（自動生成）
├── new-types.d.ts      # カスタム型定義（オプション）
└── .env.local          # 環境変数
```

### ⚖️ **設定の優先順位**

1. **環境変数** > **next.config.js** > **デフォルト設定**
2. **tsconfig.json** は TypeScript コンパイラに直接影響
3. **実験的機能** は next.config.js の `experimental` セクションで制御

---

## ベストプラクティス

### ✅ **推奨設定パターン**

#### 開発環境

```javascript
// next.config.js（開発用）
module.exports = {
  typescript: {
    ignoreBuildErrors: false, // 型安全性を保つ
  },
  eslint: {
    ignoreDuringBuilds: false, // Lintエラーもチェック
  },
  experimental: {
    typedRoutes: true, // 型安全なルーティング
  },
};
```

#### 本番環境

```javascript
// next.config.js（本番用）
module.exports = {
  output: "standalone", // 最適化されたデプロイ
  compress: true, // gzip圧縮有効化
  poweredByHeader: false, // セキュリティヘッダー非表示

  images: {
    domains: ["cdn.example.com"], // 画像ドメイン制限
  },

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
      ],
    },
  ],
};
```

### ⚠️ **注意すべき設定**

1. **実験的機能**: 本番環境での使用は慎重に

   ```javascript
   experimental: {
     ppr: process.env.NODE_ENV === 'development', // 開発時のみ
   }
   ```

2. **TypeScript型チェック**: 本番ビルドでは必須

   ```javascript
   typescript: {
     ignoreBuildErrors: false, // 必ず false に設定
   }
   ```

3. **Webpack設定**: semverでカバーされないため注意
   ```javascript
   webpack: (config, { dev, isServer }) => {
     // 最小限の変更に留める
     return config;
   };
   ```

### 🔧 **設定の段階的導入**

1. **基本設定**: TypeScript + ESLint
2. **パフォーマンス最適化**: 画像最適化、圧縮
3. **セキュリティ強化**: ヘッダー設定、CORS
4. **実験的機能**: 段階的にテスト導入

---

## 設定のトラブルシューティング

### 🐛 **よくある問題と解決方法**

1. **TypeScript型エラーでビルドが失敗**
   - `typescript.ignoreBuildErrors` を一時的に `true` に（非推奨）
   - `tsc --noEmit` で型チェックのみ実行して問題箇所を特定

2. **カスタム型が認識されない**
   - `new-types.d.ts` を作成し `tsconfig.json` の `include` に追加
   - `next-env.d.ts` は編集しない（自動生成のため）

3. **実験的機能が動作しない**
   - Next.jsのバージョンを確認
   - `experimental` セクションでの正しい設定を確認

4. **ビルド最適化が効かない**
   - `output: 'standalone'` の設定確認
   - `transpilePackages` での依存関係の明示的な指定

---

このドキュメントは、Next.js プロジェクトの設定に関する包括的なガイドです。各設定の詳細については、個別のリンク先ドキュメントを参照してください。設定変更時は、開発環境での十分なテストを行った上で本番環境に適用することを推奨します。
