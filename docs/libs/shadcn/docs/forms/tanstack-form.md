# TanStack Form

## デモ

このガイドでは、TanStack Formを使用してフォームを構築する方法を探ります。以下の特徴があります：

- Zodスキーマを使用したバリデーション
- エラーハンドリング
- アクセシビリティの確保

## アプローチ

TanStack Formの主な特徴：

- ヘッドレスフォーム管理
- `<Field />` コンポーネントによる柔軟なマークアップとスタイリング
- クライアントサイドバリデーション
- リアルタイムのフィードバック

## フォームの構造

### スキーマの作成

Zodを使用してフォームのスキーマを定義します：

```typescript
const formSchema = z.object({
  title: z
    .string()
    .min(5, "バグタイトルは5文字以上必要です")
    .max(32, "バグタイトルは32文字以内にしてください"),
  description: z
    .string()
    .min(20, "説明は20文字以上必要です")
    .max(100, "説明は100文字以内にしてください")
})
```

### フォームのセットアップ

`useForm`フックを使用してフォームインスタンスを作成します：

```typescript
const form = useForm({
  defaultValues: {
    title: "",
    description: ""
  },
  validators: {
    onSubmit: formSchema
  },
  onSubmit: async ({ value }) => {
    // フォーム送信時の処理
  }
})
```

## バリデーション

### クライアントサイドバリデーション

Zodスキーマを使用してフォームデータを検証し、リアルタイムのフィードバックを提供します。
