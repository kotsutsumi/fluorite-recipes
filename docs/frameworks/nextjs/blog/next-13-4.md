# Next.js 13.4

**投稿日**: 2023年5月4日（木曜日）

**著者**: Sebastian Markbåge、Tim Neutkens

## 主なハイライト

- App Routerが安定版に
- Turbopackがベータに移行
- 実験的なServer Actionsを導入

## 主な機能

### 1. App Router（安定版）

- Reactサーバーコンポーネント
- ネストされたルートとレイアウト
- 簡素化されたデータフェッチ
- ストリーミングとSuspense
- 組み込みSEOサポート

### 2. Turbopack（ベータ）

- より高速なローカル開発サーバー
- 改善された安定性

### 3. Server Actions（アルファ）

- サーバーサイドのデータ変更
- ゼロクライアント側JavaScript

## コア設計原則の維持

- 「ゼロセットアップ。ファイルシステムをAPIとして使用」
- 「JavaScript のみ。すべてが関数」
- 自動サーバーレンダリングとコード分割
- データフェッチの柔軟性

## インストール

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## まとめ

このブログ記事は、このリリースがNext.jsの基盤となるアップグレードであり、段階的な採用に焦点を当て、フレームワークのオリジナルの設計原則を維持していることを強調しています。
