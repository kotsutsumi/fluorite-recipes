# Shadcn/UI ドキュメント サマリー

このドキュメントは、`docs/libs/shadcn/` 配下にある全Shadcn/UIドキュメントの要約とリンク集です。

## 概要

Shadcn/UIは、コピー&ペーストで使用できる、美しくデザインされたコンポーネントのコレクションです。Radix UIとTailwind CSSをベースに構築され、完全にカスタマイズ可能で、アクセシビリティに優れています。

### 特徴

- **コピー&ペースト方式**: npmパッケージではなく、コードを直接プロジェクトにコピー
- **完全なカスタマイズ**: コードを完全に制御し、必要に応じて変更可能
- **アクセシビリティファースト**: Radix UIをベースに、WAI-ARIA標準に準拠
- **Tailwind CSS**: ユーティリティファーストのスタイリング
- **TypeScript**: 完全な型安全性

## ドキュメント構成

### 📘 メインドキュメント

- [はじめに](./shadcn/docs/docs.md) - Shadcn/UIの概要と基本コンセプト
- [コンポーネント一覧](./shadcn/docs/components.md) - 利用可能な全コンポーネントのリスト
- [変更履歴](./shadcn/docs/changelog.md) - 最新のアップデートと変更内容

### 🚀 インストール

- [インストール概要](./shadcn/docs/installation.md) - 基本的なインストール方法

#### フレームワーク別ガイド

- [Next.js](./shadcn/docs/installation/next.md)
- [Vite](./shadcn/docs/installation/vite.md)
- [Laravel](./shadcn/docs/installation/laravel.md)
- [React Router](./shadcn/docs/installation/react-router.md)
- [Astro](./shadcn/docs/installation/astro.md)
- [TanStack Start](./shadcn/docs/installation/tanstack.md)
- [TanStack Router](./shadcn/docs/installation/tanstack-router.md)
- [マニュアルインストール](./shadcn/docs/installation/manual.md)

### ⚙️ 設定

- [components.json](./shadcn/docs/components-json.md) - プロジェクト設定ファイル
- [テーマ設定](./shadcn/docs/theming.md) - カスタムテーマの作成とカスタマイズ
- [CLI](./shadcn/docs/cli.md) - コマンドラインツールの使用方法
- [モノレポ](./shadcn/docs/monorepo.md) - モノレポ環境での設定

### 🌙 ダークモード

- [ダークモード概要](./shadcn/docs/dark-mode.md) - ダークモードの実装方法

#### フレームワーク別ガイド

- [Next.js](./shadcn/docs/dark-mode/next.md)
- [Vite](./shadcn/docs/dark-mode/vite.md)
- [Astro](./shadcn/docs/dark-mode/astro.md)
- [Remix](./shadcn/docs/dark-mode/remix.md)

### 📝 フォーム

- [フォーム概要](./shadcn/docs/forms.md) - フォームの基本的な使い方

#### フォームライブラリ統合

- [React Hook Form](./shadcn/docs/forms/react-hook-form.md)
- [TanStack Form](./shadcn/docs/forms/tanstack-form.md)

### 📦 レジストリ

- [レジストリ概要](./shadcn/docs/registry.md) - カスタムコンポーネントレジストリ

#### レジストリ詳細ガイド

- [はじめに](./shadcn/docs/registry/getting-started.md)
- [認証](./shadcn/docs/registry/authentication.md)
- [名前空間](./shadcn/docs/registry/namespace.md)
- [例](./shadcn/docs/registry/examples.md)
- [Registry JSON](./shadcn/docs/registry/registry-json.md)
- [Registry Item JSON](./shadcn/docs/registry/registry-item-json.md)
- [Registry Index](./shadcn/docs/registry/registry-index.md)
- [MCPサーバー](./shadcn/docs/registry/mcp.md)
- [v0で開く](./shadcn/docs/registry/open-in-v0.md)

### 🔧 その他のツールと機能

- [JavaScript対応](./shadcn/docs/javascript.md) - TypeScriptなしでの使用方法
- [Blocks](./shadcn/docs/blocks.md) - 事前構築されたセクションとレイアウト
- [v0統合](./shadcn/docs/v0.md) - AIによるUIジェネレーターとの統合
- [Figmaリソース](./shadcn/docs/figma.md) - Figmaデザインキット
- [MCPサーバー](./shadcn/docs/mcp.md) - Model Context Protocolサーバー
- [LLM用サマリー](./shadcn/llms.txt.md) - 大規模言語モデル向けのドキュメント要約
- [レガシードキュメント](./shadcn/docs/legacy.md) - 古いバージョンのドキュメント

## 🎨 コンポーネント

### レイアウト・コンテナ

- [Accordion](./shadcn/docs/components/accordion.md) - 折りたたみ可能なコンテンツ
- [Card](./shadcn/docs/components/card.md) - カード型コンテナ
- [Collapsible](./shadcn/docs/components/collapsible.md) - 展開/折りたたみ可能な要素
- [Resizable](./shadcn/docs/components/resizable.md) - リサイズ可能なパネル
- [Scroll Area](./shadcn/docs/components/scroll-area.md) - カスタムスクロールエリア
- [Separator](./shadcn/docs/components/separator.md) - 視覚的な区切り線
- [Tabs](./shadcn/docs/components/tabs.md) - タブ切り替え

### ナビゲーション

- [Breadcrumb](./shadcn/docs/components/breadcrumb.md) - パンくずリスト
- [Navigation Menu](./shadcn/docs/components/navigation-menu.md) - ナビゲーションメニュー
- [Menubar](./shadcn/docs/components/menubar.md) - メニューバー
- [Pagination](./shadcn/docs/components/pagination.md) - ページネーション
- [Sidebar](./shadcn/docs/components/sidebar.md) - サイドバー

### フォーム要素

- [Button](./shadcn/docs/components/button.md) - ボタン
- [Button Group](./shadcn/docs/components/button-group.md) - ボタングループ
- [Checkbox](./shadcn/docs/components/checkbox.md) - チェックボックス
- [Input](./shadcn/docs/components/input.md) - 入力フィールド
- [Input Group](./shadcn/docs/components/input-group.md) - 入力グループ
- [Input OTP](./shadcn/docs/components/input-otp.md) - ワンタイムパスワード入力
- [Label](./shadcn/docs/components/label.md) - ラベル
- [Radio Group](./shadcn/docs/components/radio-group.md) - ラジオボタングループ
- [Select](./shadcn/docs/components/select.md) - セレクトボックス
- [Slider](./shadcn/docs/components/slider.md) - スライダー
- [Switch](./shadcn/docs/components/switch.md) - トグルスイッチ
- [Textarea](./shadcn/docs/components/textarea.md) - テキストエリア
- [Toggle](./shadcn/docs/components/toggle.md) - トグルボタン
- [Toggle Group](./shadcn/docs/components/toggle-group.md) - トグルグループ
- [Field](./shadcn/docs/components/field.md) - フォームフィールド
- [Form](./shadcn/docs/components/form.md) - フォームコンポーネント

### データ表示

- [Avatar](./shadcn/docs/components/avatar.md) - アバター画像
- [Badge](./shadcn/docs/components/badge.md) - バッジ
- [Calendar](./shadcn/docs/components/calendar.md) - カレンダー
- [Chart](./shadcn/docs/components/chart.md) - チャート・グラフ
- [Data Table](./shadcn/docs/components/data-table.md) - データテーブル
- [Table](./shadcn/docs/components/table.md) - テーブル
- [Kbd](./shadcn/docs/components/kbd.md) - キーボードキー表示
- [Typography](./shadcn/docs/components/typography.md) - タイポグラフィ

### オーバーレイ・モーダル

- [Alert Dialog](./shadcn/docs/components/alert-dialog.md) - アラートダイアログ
- [Dialog](./shadcn/docs/components/dialog.md) - ダイアログ
- [Drawer](./shadcn/docs/components/drawer.md) - ドロワー
- [Sheet](./shadcn/docs/components/sheet.md) - サイドシート
- [Popover](./shadcn/docs/components/popover.md) - ポップオーバー
- [Hover Card](./shadcn/docs/components/hover-card.md) - ホバーカード
- [Tooltip](./shadcn/docs/components/tooltip.md) - ツールチップ

### メニュー

- [Command](./shadcn/docs/components/command.md) - コマンドパレット
- [Combobox](./shadcn/docs/components/combobox.md) - コンボボックス
- [Context Menu](./shadcn/docs/components/context-menu.md) - コンテキストメニュー
- [Dropdown Menu](./shadcn/docs/components/dropdown-menu.md) - ドロップダウンメニュー

### フィードバック

- [Alert](./shadcn/docs/components/alert.md) - アラート
- [Toast](./shadcn/docs/components/toast.md) - トースト通知
- [Sonner](./shadcn/docs/components/sonner.md) - Sonnerトースト
- [Progress](./shadcn/docs/components/progress.md) - プログレスバー
- [Skeleton](./shadcn/docs/components/skeleton.md) - スケルトンローダー
- [Spinner](./shadcn/docs/components/spinner.md) - スピナー

### メディア

- [Aspect Ratio](./shadcn/docs/components/aspect-ratio.md) - アスペクト比コンテナ
- [Carousel](./shadcn/docs/components/carousel.md) - カルーセル

### その他

- [Date Picker](./shadcn/docs/components/date-picker.md) - 日付選択
- [Empty](./shadcn/docs/components/empty.md) - 空状態
- [Item](./shadcn/docs/components/item.md) - アイテム

## コンポーネントカテゴリ別索引

### 基本UI（7）
Button, Button Group, Input, Input Group, Label, Separator, Typography

### フォーム（15）
Checkbox, Field, Form, Input, Input Group, Input OTP, Label, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group, Date Picker

### ナビゲーション（5）
Breadcrumb, Menubar, Navigation Menu, Pagination, Sidebar

### レイアウト（7）
Accordion, Card, Collapsible, Resizable, Scroll Area, Separator, Tabs

### オーバーレイ（7）
Alert Dialog, Dialog, Drawer, Sheet, Popover, Hover Card, Tooltip

### データ表示（8）
Avatar, Badge, Calendar, Chart, Data Table, Table, Kbd, Typography

### フィードバック（6）
Alert, Toast, Sonner, Progress, Skeleton, Spinner

### メニュー（4）
Command, Combobox, Context Menu, Dropdown Menu

### メディア（2）
Aspect Ratio, Carousel

### その他（3）
Empty, Item, Date Picker

## 学習パス

### 初心者向け

1. [はじめに](./shadcn/docs/docs.md) - 基本コンセプトの理解
2. [Next.jsでのインストール](./shadcn/docs/installation/next.md) - セットアップ
3. [Button](./shadcn/docs/components/button.md) - 最初のコンポーネント
4. [Card](./shadcn/docs/components/card.md) - レイアウトの基礎
5. [テーマ設定](./shadcn/docs/theming.md) - カスタマイズ

### 中級者向け

1. [フォーム概要](./shadcn/docs/forms.md) - フォームの構築
2. [React Hook Form](./shadcn/docs/forms/react-hook-form.md) - フォーム管理
3. [Dialog](./shadcn/docs/components/dialog.md) - モーダル操作
4. [Data Table](./shadcn/docs/components/data-table.md) - 複雑なデータ表示
5. [ダークモード](./shadcn/docs/dark-mode.md) - テーマ切り替え

### 上級者向け

1. [CLI](./shadcn/docs/cli.md) - 自動化とワークフロー
2. [レジストリ概要](./shadcn/docs/registry.md) - カスタムコンポーネント作成
3. [モノレポ](./shadcn/docs/monorepo.md) - 大規模プロジェクト管理
4. [v0統合](./shadcn/docs/v0.md) - AI支援開発
5. [Blocks](./shadcn/docs/blocks.md) - 事前構築済みセクション

## よく使うコンポーネントの組み合わせ

### フォーム構築
- Form + Field + Input + Button + Label

### データ表示
- Card + Table + Badge + Avatar

### ナビゲーション
- Sidebar + Navigation Menu + Breadcrumb

### ユーザーフィードバック
- Toast + Alert + Dialog + Progress

### 複雑なUI
- Tabs + Accordion + Collapsible + Separator

## 公式リソース

- **公式サイト**: https://ui.shadcn.com/
- **GitHub**: https://github.com/shadcn-ui/ui
- **Twitter**: https://twitter.com/shadcn
- **Discord**: https://discord.gg/shadcn

## 関連技術スタック

### 必須技術
- React 18+
- TypeScript (推奨)
- Tailwind CSS 3.x

### ベースライブラリ
- Radix UI - アクセシブルなUIプリミティブ
- class-variance-authority - バリアントベースのスタイル管理
- clsx - クラス名の条件付き結合

### フォームライブラリ
- React Hook Form
- TanStack Form
- Zod - スキーマバリデーション

### 統合可能なフレームワーク
- Next.js 13+ (App Router対応)
- Vite
- Astro
- Remix
- Laravel (Inertia.js)
- React Router
- TanStack Start
- TanStack Router

## ファイル統計

- **総ドキュメント数**: 99ファイル
- **コンポーネント**: 58個
- **インストールガイド**: 8フレームワーク
- **フォームライブラリ統合**: 2種類
- **ダークモード実装**: 4フレームワーク
- **レジストリドキュメント**: 9ファイル

## クイックリファレンス

### よく使うコマンド

```bash
# コンポーネントの追加
npx shadcn@latest add button

# 複数コンポーネントの追加
npx shadcn@latest add button card dialog

# 全コンポーネントの追加
npx shadcn@latest add --all

# 初期化
npx shadcn@latest init
```

### 設定ファイル (components.json)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 基本的なインポート

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

## デザインシステムとしての活用

Shadcn/UIは単なるコンポーネントライブラリではなく、デザインシステムの基盤として活用できます：

1. **一貫性**: 全コンポーネントで統一されたデザイン原則
2. **カスタマイズ性**: CSS変数によるテーマのカスタマイズ
3. **拡張性**: コードを直接編集して独自のバリアントを追加
4. **アクセシビリティ**: WCAG準拠のアクセシブルなコンポーネント
5. **型安全性**: TypeScriptによる完全な型サポート

---

**Note**: このドキュメントは、`docs/libs/shadcn/` 配下のすべてのShadcn/UIドキュメントへのナビゲーションを提供します。各リンクは日本語で翻訳されたドキュメントを指しています。コンポーネントの使用例やAPIの詳細については、各コンポーネントのページを参照してください。
