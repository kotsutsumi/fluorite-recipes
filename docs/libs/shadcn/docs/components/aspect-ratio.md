# アスペクト比

## 概要

アスペクト比コンポーネントは、コンテンツを希望の比率内に表示します。

## インストール

CLIを使用してインストール：

```
pnpm dlx shadcn@latest add aspect-ratio
```

## 使用方法

インポートして使用：

```jsx
import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9}>
  <Image src="..." alt="Image" className="rounded-md object-cover" />
</AspectRatio>
```

## デモ

デモ画像は、Drew Beamerによる写真で、16:9のアスペクト比で表示されています。画像は丸められたレイアウトで、暗いモードでは明るさと彩度が調整されています。

## 追加情報

- Radix UIのドキュメントへのリンクが提供されています
- APIリファレンスも利用可能

注意: コードとコンポーネントの詳細は原文のままです。翻訳は説明文のみに適用しています。
