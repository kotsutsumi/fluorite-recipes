# Field

## 概要

Fieldコンポーネントは、アクセシブルなフォームを構築するために設計されています。

## インストール

CLIを使用してFieldコンポーネントをインストールします：

```
pnpm dlx shadcn@latest add field
```

## 使用方法

```typescript
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
```

## 解剖学

Fieldファミリーは、アクセシブルなフォームを構築するために設計されています。典型的なフィールドは以下のように構造化されています：

```jsx
<Field>
  <FieldLabel htmlFor="input-id">ラベル</FieldLabel>
  {/* 入力、選択、スイッチなど */}
  <FieldDescription>オプションのヘルパーテキスト</FieldDescription>
  <FieldError>検証メッセージ</FieldError>
</Field>
```

## 主な特徴

- ラベル、コントロール、ヘルプテキストを組み合わせたアクセシブルなフォームフィールド
- レスポンシブなレイアウトオプション
- 水平および垂直の配置モード
- エラー状態のサポート
- セマンティックなグループ化

## 例

ドキュメントには、入力、テキストエリア、選択、スライダー、チェックボックス、ラジオボタン、スイッチなど、さまざまな種類のフィールドの詳細な例が含まれています。

## アクセシビリティ

Fieldコンポーネントは、WCAG 2.1のアクセシビリティガイドラインに準拠しており、スクリーンリーダーやキーボードナビゲーションを完全にサポートしています。
