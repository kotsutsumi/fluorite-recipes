# Toast

一時的に表示される簡潔なメッセージ。

[ドキュメント](https://www.radix-ui.com/docs/primitives/components/toast) | [APIリファレンス](https://www.radix-ui.com/docs/primitives/components/toast#api-reference)

---

## 重要なお知らせ

**Toastコンポーネントは非推奨となりました。**

代わりに[Sonner](/docs/components/sonner)の使用を推奨します。Sonnerは、よりモダンで使いやすいトーストコンポーネントです。

## 古いToastコンポーネント

古いToastコンポーネントのドキュメントを探している場合は、[旧ドキュメント](https://v3.shadcn.com/docs/components/toast)を確認してください。

---

## 移行ガイド

既存のToastコンポーネントからSonnerへの移行を推奨します。詳細については、[Sonnerのドキュメント](/docs/components/sonner)を参照してください。

### 主な変更点

1. **インストール**: `toast`の代わりに`sonner`をインストール
2. **使用方法**: よりシンプルなAPIと直感的な使い方
3. **機能**: より多くのカスタマイズオプションとビルトイン機能

### 移行の例

#### 以前 (Toast)

```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

toast({
  title: "成功",
  description: "操作が完了しました。",
})
```

#### 現在 (Sonner)

```tsx
import { toast } from "sonner"

toast.success("操作が完了しました。")
```

より詳細な情報は、[Sonnerのドキュメント](/docs/components/sonner)を参照してください。
