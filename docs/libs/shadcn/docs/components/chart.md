# チャート

## 概要

shadcn/ui の Chart コンポーネントは、Recharts を使用して構築された美しいチャートライブラリです。アプリにコピー&ペーストできる柔軟で使いやすいチャートコンポーネントを提供します。

## 主な特徴

- Recharts ベースのチャートコンポーネント
- カスタマイズ可能な設計
- テーマとカラーのサポート
- アクセシビリティレイヤーの組み込み
- 簡単な実装と統合

## インストール

CLIを使用してチャートコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add chart
```

## チャートの作成

基本的なチャートの作成手順：

1. データの定義
2. チャート設定の構成
3. Recharts コンポーネントを使用したチャートの構築

### データ例

```typescript
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  // その他のデータ
]
```

### チャート設定

```typescript
const chartConfig = {
  desktop: {
    label: "デスクトップ",
    color: "#2563eb",
  },
  mobile: {
    label: "モバイル",
    color: "#60a5fa",
  },
} satisfies ChartConfig
```

## 高度な機能

- カスタムツールチップ
- 凡例のサポート
- テーマとカラーのカスタマイズ
- アクセシビリティオプション

## 注意点

現在、Recharts v3へのアップグレード作業中です。
