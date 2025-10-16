# Kbd

キーボードからのユーザー入力を表示するために使用されます。

## インストール

CLIを使用してKbdコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add kbd
```

## 使用方法

```tsx
import { Kbd } from "@/components/ui/kbd"

<Kbd>Ctrl</Kbd>
```

## 例

### グループ

`KbdGroup`コンポーネントを使用して、キーボードキーをグループ化できます。

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdGroupExample() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        Use{" "}
        <KbdGroup>
          <Kbd>Ctrl + B</Kbd>
          <Kbd>Ctrl + K</Kbd>
        </KbdGroup>{" "}
        to open the command palette
      </p>
    </div>
  )
}
```

### ボタン

`Button`コンポーネント内で`Kbd`コンポーネントを使用して、ボタン内にキーボードキーを表示できます。

### ツールチップ

`Tooltip`コンポーネント内で`Kbd`コンポーネントを使用して、キーボードキーを含むツールチップを表示できます。

### 入力グループ

`InputGroupAddon`コンポーネント内で`Kbd`コンポーネントを使用して、入力グループ内にキーボードキーを表示できます。

## APIリファレンス

### Kbd

キーボードキーを表示するために`Kbd`コンポーネントを使用します。
