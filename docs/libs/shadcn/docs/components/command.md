# コマンド

## 概要

`<Command />` コンポーネントは、Reactのための高速で構成可能な、スタイル未設定のコマンドメニューです。[pacocoursey](https://twitter.com/pacocoursey)によって作成された[`cmdk`](https://cmdk.paco.me)コンポーネントを使用しています。

## インストール

CLIを使用してコマンドコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add command
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```jsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command"

<Command>
  <CommandInput placeholder="コマンドを入力または検索..." />
  <CommandList>
    <CommandEmpty>結果が見つかりません。</CommandEmpty>
    <CommandGroup heading="候補">
      <CommandItem>カレンダー</CommandItem>
      <CommandItem>絵文字を検索</CommandItem>
      <CommandItem>電卓</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## 例

### ダイアログ

コマンドメニューをダイアログで表示するには、`<CommandDialog />` コンポーネントを使用します。キーボードショートカット（⌘J）でトグルできます。

### コンボボックス

`<Command />` コンポーネントは、コンボボックスとしても使用できます。詳細は[Combobox](/docs/components/combobox)ページを参照してください。
