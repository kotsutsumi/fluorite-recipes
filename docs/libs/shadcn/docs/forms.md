# フォーム

## フレームワークを選択

React と shadcn/ui を使用してフォームを構築します。

フォームライブラリを選択してください。選択後、指示に従って shadcn/ui とお好みのフォームライブラリでフォームを構築する方法を学びましょう。

## サポートされているフォームライブラリ

### React Hook Form
React Hook Formは、パフォーマンスが高く、柔軟で、拡張可能なフォームバリデーションライブラリです。

[React Hook Formのドキュメントを見る](/docs/forms/react-hook-form)

### TanStack Form
TanStack Formは、型安全でヘッドレスなフォーム状態管理ライブラリです。

[TanStack Formのドキュメントを見る](/docs/forms/tanstack-form)

### React useActionState
React 19のuseActionStateフックを使用したフォーム管理。

**近日公開**

## フォーム構築のベストプラクティス

### バリデーション
クライアント側とサーバー側の両方でバリデーションを実装します。

### アクセシビリティ
すべてのフォームフィールドに適切なラベルとARIA属性を使用します。

### エラーハンドリング
ユーザーフレンドリーなエラーメッセージを表示し、問題を修正する方法をガイドします。

### パフォーマンス
大規模なフォームでは、制御されたコンポーネントと非制御コンポーネントを適切に使い分けます。

### ユーザーエクスペリエンス
- ローディング状態を表示
- 成功メッセージを提供
- 送信中はフォームを無効化
- 適切なフィールドタイプを使用（email、tel、numberなど）

## 一般的なフォームパターン

### ログインフォーム
メールアドレスとパスワードを使用した基本的な認証フォーム。

### 登録フォーム
新規ユーザー登録のための複数ステップフォーム。

### プロフィール更新フォーム
既存のユーザーデータを編集するフォーム。

### 検索フォーム
データをフィルタリングおよび検索するフォーム。

### マルチステップフォーム
複数のセクションに分割された複雑なフォーム。

## 統合

shadcn/uiのフォームコンポーネントは、以下と簡単に統合できます：

- Zod、Yup、Joiなどのバリデーションライブラリ
- React Hook Form、TanStack Formなどのフォーム状態管理ライブラリ
- Next.js Server Actions、tRPCなどのサーバー側フレームワーク

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。