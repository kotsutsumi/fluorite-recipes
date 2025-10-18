# Open in v0

## ボタン

[v0.dev/chat/button](https://v0.dev/chat/button)で詳細な情報を確認できます。

サイトに「Open in v0」ボタンを追加する簡単な例を示します：

## 実装例

```typescript
import { Button } from "@/components/ui/button"

export function OpenInV0Button({ url }: { url: string }) {
  return (
    <Button
      aria-label="Open in v0"
      className="h-8 gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
      asChild
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${url}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in{" "}
        <svg
          viewBox="0 0 40 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-current"
        >
          <path
            d="M20 0L25 10L20 20L15 10L20 0Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </Button>
  )
}
```

## 使用方法

```jsx
<OpenInV0Button url="https://example.com/r/hello-world.json" />
```

## 認証

Open in v0 は、クエリパラメータ認証のみをサポートしています。名前空間付きレジストリや、ヘッダーのベアラートークンやAPIキーなどの高度な認証方法はサポートしていません。

### クエリパラメータ認証の使用

レジストリに認証を追加するには、`token`クエリパラメータを使用します：

```
https://registry.company.com/r/hello-world.json?token=your-token-here
```

### 設定例

`components.json`での設定：

```json
{
  "registries": {
    "@company": {
      "url": "https://registry.company.com/r/{name}.json",
      "params": {
        "token": "${REGISTRY_TOKEN}"
      }
    }
  }
}
```

## ベストプラクティス

1. **セキュリティ**: トークンは環境変数で管理
2. **URLエンコーディング**: URLパラメータを適切にエンコード
3. **エラーハンドリング**: 認証エラーを適切に処理
4. **ユーザー体験**: ボタンの配置とスタイリングを考慮

## 制限事項

- クエリパラメータ認証のみサポート
- ヘッダーベースの認証は非サポート
- 名前空間付きレジストリは制限あり

## トラブルシューティング

### ボタンが動作しない

1. URLが正しいことを確認
2. レジストリが公開されていることを確認
3. 認証トークンが有効であることを確認

### 認証エラー

トークンが正しく設定されていることを確認し、環境変数が適切に読み込まれているか確認してください。
