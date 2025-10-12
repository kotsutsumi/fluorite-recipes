# Next.js マイグレーションガイド

Next.js への移行をスムーズに行うための包括的なガイドです。それぞれの移行パターンに応じて、適切なガイドを選択してください。

## 移行ガイド一覧

### 1. [App Router への移行](./migrating/01-app-router-migration.md)

**対象**: Pages Router を使用している既存の Next.js アプリケーション

Pages Router から新しい App Router への移行ガイドです。段階的な移行方法と新機能の活用方法を詳しく説明します。

**主な内容**:

- App Router の概要と利点（Server Components、レイアウトシステム、並行レンダリング）
- 段階的移行戦略（Pages Router と App Router の併用）
- ルートレイアウトの作成と `_app.tsx`、`_document.tsx` からの移行
- ページコンポーネントの移行パターン
- データフェッチングの新しいパターン
- 静的・動的ルーティングの変更
- メタデータ API の活用

**前提条件**:

- Node.js 18.17 以降
- Next.js 13 以降
- React 18 以降

---

### 2. [Create React App からの移行](./migrating/02-from-create-react-app.md)

**対象**: Create React App (CRA) で構築されたアプリケーション

既存の CRA プロジェクトを Next.js に移行し、サーバーサイドレンダリングやパフォーマンス最適化の恩恵を受ける方法を説明します。

**主な内容**:

- CRA の課題と Next.js の利点
- プロジェクト構造の変更
- `public/index.html` からルートレイアウトへの移行
- ルーティングシステムの変更（React Router から Next.js Router）
- 環境変数の設定変更
- 静的アセットの取り扱い
- 段階的移行のアプローチ

**移行する理由**:

- 初期ページ読み込み速度の改善
- 自動コード分割
- SEO の向上
- 組み込み最適化機能

---

### 3. [Vite からの移行](./migrating/03-from-vite.md)

**対象**: Vite で構築された React アプリケーション

Vite の高速な開発体験を維持しながら、Next.js の強力な機能を活用するための移行ガイドです。

**主な内容**:

- Vite と Next.js の比較
- ビルド設定の変更（`vite.config.js` から `next.config.js`）
- TypeScript 設定の更新
- 開発サーバーとホットリロードの違い
- 静的アセットの取り扱い変更
- プラグインとミドルウェアの移行
- パフォーマンス最適化の活用

**Next.js の追加機能**:

- Middleware サポート
- Server と Client Components
- React Suspense によるストリーミング
- Incremental Static Regeneration (ISR)

## 移行時の共通考慮事項

### パフォーマンス最適化

Next.js への移行により、以下の最適化が自動的に適用されます：

- **自動コード分割**: ルートベースでの最適な分割
- **画像最適化**: Next.js Image コンポーネントによる自動最適化
- **フォント最適化**: Web フォントの最適化とレイアウトシフト防止
- **スクリプト最適化**: サードパーティスクリプトの最適な読み込み

### データフェッチング戦略

移行後は以下のデータフェッチング戦略を活用できます：

- **SSG (Static Site Generation)**: ビルド時にデータを取得
- **SSR (Server-Side Rendering)**: リクエスト時にサーバーでデータを取得
- **ISR (Incremental Static Regeneration)**: 静的生成とデータ更新の両立
- **CSR (Client-Side Rendering)**: クライアントサイドでのデータ取得

### 移行チェックリスト

移行プロセスを確実に進めるためのチェックリスト：

- [ ] Node.js バージョンの確認（18.17 以降）
- [ ] 依存関係の更新
- [ ] 設定ファイルの作成・更新
- [ ] ルートレイアウトの実装
- [ ] ページコンポーネントの移行
- [ ] ルーティングの確認
- [ ] 環境変数の設定
- [ ] 静的アセットの移行
- [ ] スタイリングの動作確認
- [ ] データフェッチングの実装
- [ ] メタデータの設定
- [ ] ビルドとデプロイの確認

## トラブルシューティング

移行時によくある問題と解決方法：

### 1. Client Component エラー

Server Components でクライアントサイドの機能を使用しようとした場合、`'use client'` ディレクティブを追加します。

### 2. Dynamic Import の問題

動的インポートの構文が変更される場合があります。Next.js の `dynamic` 関数の使用を検討してください。

### 3. Environment Variables

環境変数のプレフィックスが変更されます（`REACT_APP_` から `NEXT_PUBLIC_`）。

### 4. Absolute Imports

インポートパスの設定を `tsconfig.json` で調整する必要があります。

## 追加リソース

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [App Router ガイド](https://nextjs.org/docs/app)
- [移行例とサンプルコード](https://github.com/vercel/next.js/tree/canary/examples)
- [Next.js コミュニティ](https://github.com/vercel/next.js/discussions)

---

各移行ガイドには、具体的なコード例、詳細な手順、およびベストプラクティスが含まれています。プロジェクトの現在の状況に最も適したガイドを選択して、段階的に移行を進めてください。
