# Vercel Builds（ビルド）

Vercelでのビルドプロセスの概要。

## 概要

Vercelはデプロイメント時に自動的にビルドを実行し、各プロジェクトのために安全で隔離された仮想環境を作成します。毎日数百万のビルドをサポートしています。

## ビルドのトリガー

ビルドは以下の方法でトリガーされます：

### 1. Gitリポジトリへのプッシュ

```bash
git push origin main
```

リポジトリにコミットをプッシュすると、自動的にビルドが開始されます。

### 2. Vercel CLIでのデプロイメント

```bash
vercel
# または
vercel --prod
```

### 3. ダッシュボードからのデプロイメント

Vercelダッシュボードから手動でデプロイメントを開始できます。

## ビルドインフラストラクチャ

### 隔離された環境

- 各ビルドは独立した安全な環境で実行
- 他のビルドやデプロイメントから完全に隔離

### 自動フレームワーク検出

Vercelは主要なフロントエンドフレームワークを自動検出します：

- Next.js
- SvelteKit
- Nuxt
- Vite
- Create React App
- その他多数

## ビルドプロセス

### 1. Gitクローン

- **Shallow Clone**: 最新の10コミットのみを取得
- より高速なビルド開始

### 2. 依存関係のインストール

自動的にパッケージマネージャーを検出してインストール：

```bash
# 自動検出される例
npm install
# または
pnpm install
# または
yarn install
```

### 3. 環境変数の注入

設定された環境変数がビルドプロセスに注入されます。

### 4. ビルドコマンドの実行

```bash
npm run build
```

### 5. ビルド出力のアップロード

ビルドされたファイルがVercel CDNにアップロードされます。

## ビルドのカスタマイズ

### フレームワークプリセット

自動検出されたフレームワークのデフォルト設定：

```typescript
interface FrameworkPreset {
  buildCommand: string;      // "npm run build"
  outputDirectory: string;   // "dist" or ".next"
  installCommand: string;    // "npm install"
  devCommand: string;        // "npm run dev"
}
```

### カスタムビルドコマンド

デフォルト設定を上書きできます：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "build",
  "installCommand": "pnpm install"
}
```

## 同時実行とキューイング

### プランごとの同時ビルド制限

| プラン | 同時ビルド数 |
|--------|--------------|
| Hobby | 1 |
| Pro | 最大12 |
| Enterprise | カスタマイズ可能 |

### ブランチベースの優先順位付け

- 同じブランチの複数のコミットがある場合、最新のコミットが優先されます
- 古いコミットのビルドはスキップされる場合があります

### オンデマンド同時ビルド

追加の同時ビルドスロットを必要に応じて利用できます（ProおよびEnterpriseプラン）。

## リソース制限

### ビルド時間

- **最大ビルド時間**: 45分

### メモリとCPU

| プラン | メモリ | CPU |
|--------|--------|-----|
| Hobby | 8192 MB | 2 |
| Pro | 8192 MB | 4 |
| Enterprise | カスタマイズ可能 | カスタマイズ可能 |

### ビルドキャッシュ

- **最大サイズ**: 1 GB
- 依存関係とビルド成果物をキャッシュ

## モノレポのサポート

### ルートディレクトリの設定

モノレポのサブディレクトリをプロジェクトのルートとして指定できます：

```
/
  packages/
    web/        ← ルートディレクトリに設定
    api/
    shared/
```

### Turborepoとの統合

```json
{
  "buildCommand": "turbo run build --filter=web"
}
```

## 環境固有の設定

### プロダクションビルド

```bash
vercel --prod
```

### プレビューデプロイメント

```bash
vercel
```

プレビューデプロイメントは、本番環境とは異なる環境変数を使用できます。

## ビルドの最適化

### 1. フレームワークプリセットの使用

可能な限りフレームワークプリセットを使用して、最適化されたビルド設定を活用します。

### 2. ビルドキャッシュの活用

```bash
# Next.jsの例
.next/cache/
```

キャッシュされたファイルを活用して、ビルド時間を短縮します。

### 3. 依存関係の最適化

```json
{
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

devDependenciesとdependenciesを適切に分離します。

### 4. 不要なファイルの除外

`.vercelignore`を使用して、ビルドに不要なファイルを除外：

```
# .vercelignore
.git/
*.log
tests/
docs/
```

## ビルドログ

### ログの確認

ビルドログは以下の場所で確認できます：

1. **Vercelダッシュボード**: デプロイメント詳細ページ
2. **特殊パス**: `https://your-deployment.vercel.app/_logs`
3. **Vercel CLI**: `vercel logs`

### ログの内容

- 依存関係のインストール
- ビルドコマンドの出力
- エラーメッセージ
- ビルド時間の統計

## トラブルシューティング

### ビルドの失敗

**原因:**
- 依存関係の問題
- メモリ不足
- ビルドタイムアウト
- 環境変数の欠落

**解決方法:**
1. ビルドログを確認
2. ローカルでビルドを再現
3. 依存関係を更新
4. リソース制限を確認

### ビルドが遅い

**改善策:**
1. ビルドキャッシュの活用
2. 依存関係の最適化
3. オンデマンド同時ビルドの使用
4. Enhanced Build Machinesの検討

## ベストプラクティス

1. **フレームワークプリセットの活用**
   - デフォルト設定を可能な限り使用

2. **ビルドコマンドのカスタマイズ**
   - 必要に応じてビルドコマンドを調整

3. **モノレポの最適化**
   - Turborepoやpnpm workspacesを活用

4. **環境固有の設定**
   - プロダクションとプレビューで異なる環境変数を使用

5. **ビルド時間の監視**
   - ビルド時間を定期的に確認し、最適化

## 関連リンク

- [ビルドの設定](/docs/builds/configure-a-build)
- [ビルドの管理](/docs/builds/managing-builds)
- [ビルド機能](/docs/builds/build-features)
- [ビルドイメージ](/docs/builds/build-image)
- [ビルドキュー](/docs/builds/build-queues)
