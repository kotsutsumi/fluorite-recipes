# カレンダー

ユーザーが日付を入力および編集できる日付フィールドコンポーネント。

## ブロック

30以上のカレンダーブロックのコレクションを提供し、独自のカレンダーコンポーネントを構築できます。

## インストール

CLIを使用してインストール：

```
pnpm dlx shadcn@latest add calendar
```

## 使用方法

```typescript
import { Calendar } from "@/components/ui/calendar"

const [date, setDate] = React.useState<Date | undefined>(new Date())

return (
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border"
  />
)
```

## 詳細

`Calendar`コンポーネントは[React DayPicker](https://react-day-picker.js.org)上に構築されています。

## カスタマイズ

React DayPickerのドキュメントを参照してください。

## 追加機能

- 範囲選択カレンダー
- 月と年セレクター
- 生年月日ピッカー
- 日付と時間ピッカー
- フォーム連携
- ペルシャ/ヒジュラ/ジャラリカレンダーのサポート

## アップグレードガイド

Tailwind v4およびv3用のアップグレード手順が提供されています。
