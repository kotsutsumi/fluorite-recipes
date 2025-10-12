# Next.js 16(ベータ版)

**公開日**: 2025年10月9日(木曜日)

**著者**:
- Andrew Clark (@acdlite)
- Jimmy Lai (@feedthejim)
- Jiwon Choi (@devjiwonchoi)
- JJ Kasper (@_ijjk)
- Tobias Koppers (@wSokra)

## 主なハイライト

### 1. Turbopackが安定版となりデフォルトのバンドラーに

- 本番ビルドが2-5倍高速
- Fast Refreshが最大10倍高速

### 2. Turbopackファイルシステムキャッシング(ベータ版)

- コンパイラーアーティファクトをディスクに保存
- 大規模プロジェクトのコンパイル時間を大幅に短縮

### 3. React Compilerサポート(安定版)

- 自動メモ化
- 手動コード変更不要

### 4. Build Adapters API(アルファ版)

- ビルドプロセスを変更するためのカスタムアダプターを作成

### 5. 強化されたルーティングとナビゲーション

- レイアウトの重複排除
- インクリメンタルプリフェッチング

### 6. 改善されたキャッシングAPI

- 新しい`updateTag()`メソッド
- 洗練された`revalidateTag()`機能

### 7. React 19.2の機能

- View Transitions
- `useEffectEvent()`
- `<Activity/>`コンポーネント

## アップグレード方法

```bash
# 自動アップグレード
npx @next/codemod@canary upgrade beta

# 手動アップグレード
npm install next@beta react@latest react-dom@latest

# 新しいプロジェクト
npx create-next-app@beta
```

このブログ記事は、開発者にベータ版を試し、フィードバックを提供し、GitHubで問題を報告することを奨励しています。
