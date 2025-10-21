# 本番環境へのVercel Toolbarの追加

## 概要

Vercel Toolbarは、いくつかの方法で本番環境に追加できます：

1. ブラウザ拡張機能
2. `@vercel/toolbar`パッケージ
3. ダッシュボード設定

## ブラウザ拡張機能を使用したツールバーの追加

- Vercelブラウザ拡張機能をインストール
- Vercelアカウントにログインしていることを確認
- 本番環境にデプロイ
- チームメンバーはインストール手順に従う必要がある

## `@vercel/toolbar`パッケージを使用したツールバーの追加

### インストール手順

1. パッケージをインストール：

```bash
pnpm i @vercel/toolbar
```

2. Vercel CLIでプロジェクトをリンク：

```bash
vercel link [path-to-directory]
```

### 実装例（Next.js App Router）

```typescript
'use client';

import { VercelToolbar } from '@vercel/toolbar/next';

function useIsEmployee() {
  // 実際の認証ライブラリフックに置き換える
  return false;
}

export function StaffToolbar() {
  const isEmployee = useIsEmployee();
  return isEmployee ? <VercelToolbar /> : null;
}
```

### 重要な考慮事項

- すべての訪問者にログインを促さないように、ツールバーを条件付きで注入
- ツールバーアクセスを制限するために認証ロジックを使用

## ダッシュボード経由でのツールバー有効化

1. Vercelダッシュボードに移動
2. チーム/プロジェクトを選択
3. 「Settings」タブに移動
4. 「Vercel Toolbar」セクションを見つける
5. PreviewとProduction環境の表示を選択

## ツールバーへのアクセス

- ブラウザ拡張機能
- ダッシュボードの「Visit with Toolbar」オプション
- プレビューデプロイメントのツールバーメニュー

## 主な推奨事項

- 条件付きレンダリングを使用
- 適切な認証を実装
- チーム/プロジェクトレベルの設定を検討
