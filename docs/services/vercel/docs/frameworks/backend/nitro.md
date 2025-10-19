# Nitro on Vercel

## 概要

Nitroは、TypeScriptをサポートする全スタックフレームワークで、以下の特徴を持っています：

- ファイルシステムルーティング
- 高速起動のためのコード分割
- 組み込みキャッシング
- マルチドライバーストレージ
- 1MB未満の出力サイズでどのプラットフォームにも展開可能

## Vercelでの開始方法

### デプロイ方法

#### 方法1: Vercel CLIを使用

```bash
vc init nitro
```

#### 方法2: テンプレートからデプロイ

[Vercelにデプロイ](https://vercel.com/templates/backend/nitro-starter)ボタンを使用して、テンプレートから直接デプロイできます。

## Vercelの機能

### インクリメンタル静的再生成 (ISR)

Nitroは、Vercelのインクリメンタル静的再生成（ISR）機能をサポートしています。

- オンデマンドの再検証が可能
- キャッシュ制御のための詳細な設定オプション

#### 再検証の設定例

```typescript
export default defineNitroConfig({
  vercel: {
    config: {
      bypassToken: process.env.VERCEL_BYPASS_TOKEN,
    },
  },
});
```

この設定により、バイパストークンを使用してキャッシュをオンデマンドで再検証できます。

### 観測性

Nitro (v2.12以降) は、ルーティングヒントを生成します：

- 関数実行パフォーマンスを詳細に分析可能
- Vercelのダッシュボードで関数の実行状況を確認できます

### Vercelファンクション

- サーバールートは自動的にVercelファンクションになる
- デフォルトでFluid Computeを使用
- トラフィックに応じて自動的にスケールアップ/ダウン

## ローカル開発

```bash
vc dev
```

このコマンドで、Vercel環境をローカルで再現し、開発中にアプリケーションをテストできます。

## デプロイ

```bash
vc deploy
```

## その他のリソース

- [Nitro公式ガイド](https://nitro.build/guide)
- [Vercelへのデプロイガイド](https://nitro.build/deploy/providers/vercel)
- [バックエンドテンプレート](https://vercel.com/templates?type=backend)
- [Vercel Functions](/docs/functions)
