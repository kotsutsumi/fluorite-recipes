# Input Group

## 概要
Input Groupは、入力フィールドやテキストエリアに追加情報やアクションを表示するコンポーネントです。

## インストール

CLIを使用してInput Groupをインストールします：

```
pnpm dlx shadcn@latest add input-group
```

## 使用方法

```jsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group"

<InputGroup>
  <InputGroupInput placeholder="検索..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

## 主な機能

Input Groupは以下のような柔軟な機能を提供します：
- アイコンの追加
- テキストの追加
- ボタンの統合
- ツールチップのサポート
- テキストエリアとの互換性

## 例

### アイコン付きInput Group
検索アイコンや他のアイコンを入力フィールドに追加できます。

### テキスト付きInput Group
通貨記号や追加テキストを表示できます。

### ボタン付きInput Group
入力フィールドに直接アクションボタンを追加できます。

### その他の高度な機能
- ドロップダウンメニュー
- スピナー
- ラベル
- カスタム入力コンポーネントのサポート

## APIリファレンス

### InputGroup
メインコンポーネント。入力とアドオンをラップします。

### InputGroupAddon
アイコン、テキスト、ボタンなどを入力の横に表示します。

### InputGroupInput
カスタマイズされた入力フィールドです。
