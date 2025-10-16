# アバター

## 概要

アバターは、ユーザーを表現するための代替画像を持つ画像要素です。

## インストール

CLIを使用してアバターコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add avatar
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```jsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
   <AvatarImage src="https://github.com/shadcn.png" />
   <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

## 特徴

- ユーザーを表現するための柔軟な画像コンポーネント
- フォールバック画像/テキストのサポート
- カスタマイズ可能なスタイリング
- 異なる形状（丸形、角丸など）のサポート

## デモ例

提供されているコード例では、複数のアバターのレイアウトと異なるスタイル（重なり、リング効果など）を示しています。
