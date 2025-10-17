# Kibo UI ドキュメント

## 概要

Kibo UIは、shadcn/uiの上に構築されたコンポーネントライブラリおよびカスタムレジストリで、開発者がより豊かなUIをより速く構築できるように設計されています。

- 公式サイト: https://www.kibo-ui.com
- GitHub: https://github.com/kiboUI/kibo
- ライセンス: MIT

### 主な特徴

- テーブル、ファイルドロップゾーン、AIチャットプリミティブなどの構築済みコンポーネント
- 完全に組み合わせ可能でアクセシブルなコンポーネント
- モダンなフロントエンドスタック（React、Next.js、Tailwind CSS）に最適化
- オープンソース（MITライセンス）

## インストール

```bash
npx kibo-ui add [component-name]
```

## ドキュメント構造

### 基本ドキュメント

- [イントロダクション](./kibo-ui/docs/docs.md) - Kibo UIの概要と特徴
- [メリット](./kibo-ui/docs/docs/benefits.md) - Kibo UIを使用する主なメリット
- [セットアップ](./kibo-ui/docs/docs/setup.md) - インストールと設定方法
- [使い方](./kibo-ui/docs/docs/usage.md) - 基本的な使用方法
- [哲学](./kibo-ui/docs/docs/philosophy.md) - デザイン原則と哲学
- [トラブルシューティング](./kibo-ui/docs/docs/troubleshooting.md) - よくある問題と解決方法

### コミュニティ

- [コミュニティ](./kibo-ui/docs/docs/community.md) - コミュニティへの参加方法
- [スポンサー](./kibo-ui/docs/docs/sponsors.md) - スポンサー情報
- [貢献方法](./kibo-ui/docs/docs/how-to-contribute.md) - プロジェクトへの貢献ガイド
- [新しいコンポーネント](./kibo-ui/docs/docs/new-components.md) - 新規コンポーネントの追加方法

### 高度な機能

- [MCP サーバー](./kibo-ui/docs/docs/mcp.md) - Model Context Protocolサーバーの設定

## コンポーネント一覧

### コラボレーション

- [Avatar Stack](./kibo-ui/docs/components/avatar-stack.md) - アバターを積み重ねて表示
- [Cursor](./kibo-ui/docs/components/cursor.md) - リアルタイムインタラクティブアプリケーション用カーソル

### プロジェクト管理

- [Calendar](./kibo-ui/docs/components/calendar.md) - 機能を日ごとに表示するカレンダービュー
- [Gantt](./kibo-ui/docs/components/gantt.md) - プロジェクトスケジュールとタスク追跡のガントチャート
- [Kanban](./kibo-ui/docs/components/kanban.md) - 作業管理用カンバンボード
- [List](./kibo-ui/docs/components/list.md) - ステータス別にグループ化されたタスクリスト
- [Table](./kibo-ui/docs/components/table.md) - データを表形式で表示

### コード & 開発者ツール

- [Code Block](./kibo-ui/docs/components/code-block.md) - シンタックスハイライト付きコードブロック
- [Contribution Graph](./kibo-ui/docs/components/contribution-graph.md) - GitHubスタイルのコントリビューショングラフ
- [Sandbox](./kibo-ui/docs/components/sandbox.md) - サンドボックス環境でのコンポーネントプレビュー
- [Snippet](./kibo-ui/docs/components/snippet.md) - タブ付きコードスニペット表示

### フォーム & 入力

- [Choicebox](./kibo-ui/docs/components/choicebox.md) - カードスタイルのラジオ/チェックボックス
- [Combobox](./kibo-ui/docs/components/combobox.md) - オートコンプリート入力
- [Dropzone](./kibo-ui/docs/components/dropzone.md) - ファイルドラッグ&ドロップアップロード
- [Mini Calendar](./kibo-ui/docs/components/mini-calendar.md) - コンパクトな日付選択カレンダー
- [Tags](./kibo-ui/docs/components/tags.md) - タグ選択コンポーネント
- [Color Picker](./kibo-ui/docs/components/color-picker.md) - Figmaスタイルのカラーピッカー
- [Rating](./kibo-ui/docs/components/rating.md) - スター評価コンポーネント
- [Editor](./kibo-ui/docs/components/editor.md) - TipTapベースのリッチテキストエディタ

### 画像 & メディア

- [Image Crop](./kibo-ui/docs/components/image-crop.md) - 画像クロップツール
- [Image Zoom](./kibo-ui/docs/components/image-zoom.md) - 画像ズーム機能
- [Stories](./kibo-ui/docs/components/stories.md) - ソーシャルメディアスタイルのストーリーズカルーセル
- [Reel](./kibo-ui/docs/components/reel.md) - Instagramスタイルのリールコンポーネント
- [Video Player](./kibo-ui/docs/components/video-player.md) - カスタマイズ可能なビデオプレーヤー
- [Comparison](./kibo-ui/docs/components/comparison.md) - スライダーベースの比較ツール

### ファイナンス & ビジネス

- [Credit Card](./kibo-ui/docs/components/credit-card.md) - クレジットカード表示コンポーネント
- [Ticker](./kibo-ui/docs/components/ticker.md) - ファイナンスティッカー表示

### UI & レイアウト

- [Announcement](./kibo-ui/docs/components/announcement.md) - アナウンスメントバッジ
- [Banner](./kibo-ui/docs/components/banner.md) - 全幅メッセージバナー
- [Typography](./kibo-ui/docs/components/typography.md) - タイポグラフィスタイリング
- [Deck](./kibo-ui/docs/components/deck.md) - Tinderスタイルのスワイプ可能カードスタック
- [Dialog Stack](./kibo-ui/docs/components/dialog-stack.md) - マルチステップスタックダイアログ
- [Glimpse](./kibo-ui/docs/components/glimpse.md) - リンクホバープレビュー
- [Marquee](./kibo-ui/docs/components/marquee.md) - 水平スクロールマーキー
- [Pill](./kibo-ui/docs/components/pill.md) - バッジコンポーネント
- [Spinner](./kibo-ui/docs/components/spinner.md) - ローディングスピナー
- [Status](./kibo-ui/docs/components/status.md) - サービスステータスインジケーター
- [Theme Switcher](./kibo-ui/docs/components/theme-switcher.md) - テーマ切り替えコンポーネント
- [Tree](./kibo-ui/docs/components/tree.md) - 階層的データ構造ツリー

### ユーティリティ

- [QR Code](./kibo-ui/docs/components/qr-code.md) - QRコード生成
- [Relative Time](./kibo-ui/docs/components/relative-time.md) - マルチタイムゾーン時刻表示

## ブロック一覧

ブロックは、複数のコンポーネントを組み合わせた、アプリケーション全体のセクションを構成する大きな単位です。

- [Codebase](./kibo-ui/docs/blocks/codebase.md) - ファイルエクスプローラーとコードビューアー
- [Collaborative Canvas](./kibo-ui/docs/blocks/collaborative-canvas.md) - リアルタイムコラボレーティブキャンバス
- [Roadmap](./kibo-ui/docs/blocks/roadmap.md) - プロジェクトロードマップビュー
- [Form](./kibo-ui/docs/blocks/form.md) - データ送信フォームブロック
- [Hero](./kibo-ui/docs/blocks/hero.md) - 製品/サービス紹介ヒーロー
- [Pricing](./kibo-ui/docs/blocks/pricing.md) - 価格プラン表示ブロック

## カテゴリ別コンポーネント分類

### データ表示 & 視覚化
Calendar, Gantt, Kanban, List, Table, Contribution Graph, Tree

### インタラクティブ入力
Choicebox, Combobox, Dropzone, Mini Calendar, Tags, Color Picker, Rating, Editor

### メディア & ビジュアル
Image Crop, Image Zoom, Stories, Reel, Video Player, Comparison, QR Code

### 開発者ツール
Code Block, Sandbox, Snippet, Codebase (Block)

### コラボレーション
Avatar Stack, Cursor, Collaborative Canvas (Block)

### UI要素
Announcement, Banner, Typography, Deck, Dialog Stack, Glimpse, Marquee, Pill, Spinner, Status, Theme Switcher

### ビジネス & ファイナンス
Credit Card, Ticker, Pricing (Block)

### マーケティング & コンテンツ
Hero (Block), Form (Block), Roadmap (Block)

## 使用開始

1. プロジェクトにshadcn/uiがインストールされていることを確認
2. 必要なコンポーネントをCLIでインストール: `npx kibo-ui add [component-name]`
3. コンポーネントをインポートして使用

詳細は[セットアップガイド](./kibo-ui/docs/docs/setup.md)を参照してください。

## サポート & コミュニティ

- GitHub Issues: バグ報告や機能リクエスト
- コミュニティ: [コミュニティページ](./kibo-ui/docs/docs/community.md)を参照
- 貢献: [貢献ガイド](./kibo-ui/docs/docs/how-to-contribute.md)を参照

## ライセンス

MIT License - 詳細は公式リポジトリを参照
