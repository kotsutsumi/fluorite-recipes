# カルーセル

## 概要

カルーセルコンポーネントは、[Embla Carousel](https://www.embla-carousel.com/) ライブラリを使用して構築されています。

## インストール

CLIを使用してインストール：

```
pnpm dlx shadcn@latest add carousel
```

## 使用方法

```jsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
```

```jsx
<Carousel>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

## 例

### サイズ

アイテムのサイズを設定するには、`<CarouselItem />` に `basis` ユーティリティクラスを使用できます。

### スペーシング

アイテム間のスペースを設定するには、`<CarouselItem />` に `pl-[VALUE]` ユーティリティを、`<CarouselContent />` に `-ml-[VALUE]` を使用します。

### 向き

`orientation` プロップを使用してカルーセルの向きを設定できます。

## オプション

`opts` プロップを使用してカルーセルにオプションを渡すことができます。詳細は [Embla Carouselのドキュメント](https://www.embla-carousel.com/api/options/) を参照してください。

## API

カルーセルAPIのインスタンスを取得するには、状態と `setApi` プロップを使用します。

## イベント

`setApi` からのAPIインスタンスを使用してイベントリスナーを登録できます。
