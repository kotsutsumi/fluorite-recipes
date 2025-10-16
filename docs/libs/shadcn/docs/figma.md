# Figma

## 概要

このページは、shadcn/ui コンポーネントの Figma デザインリソースについて説明しています。すべてのコンポーネントが Figma で再現され、カスタマイズ可能なプロパティ、タイポグラフィ、アイコンが含まれています。

**注意:** Figma ファイルはコミュニティによって提供されており、質問やフィードバックがある場合は、Figma ファイルのメンテナーに直接連絡してください。

## Figmaリソースを使用する理由

### デザインから開発への一貫性
Figmaでデザインしたコンポーネントは、shadcn/uiのコードと1対1でマッピングされます。

### コラボレーション
デザイナーと開発者が同じコンポーネント言語を使用できます。

### プロトタイピング
実装前にUIをデザインして検証できます。

### ドキュメント化
デザインシステムの視覚的なドキュメントとして機能します。

## 有料リソース

### 1. shadcn/ui kit by Matt Wierzbicki

[shadcndesign.com](https://shadcndesign.com)

**特徴:**
- プレミアムで常に最新の UI キット
- shadcn/ui と完全互換
- デザインから開発への滑らかな引き継ぎに最適化
- すべてのコンポーネントをカバー
- 定期的な更新とサポート

**含まれるもの:**
- 50以上の完全にカスタマイズ可能なコンポーネント
- ダークモードとライトモードのバリアント
- レスポンシブレイアウト
- タイポグラフィシステム
- カラーパレット
- アイコンライブラリ

**価格:** 有料（詳細はウェブサイトで確認）

### 2. Shadcraft UI Kit

[shadcraft.com](https://shadcraft.com)

**特徴:**
- 最も高度な shadcn 互換キット
- [tweakcn](https://tweakcn.com) による即時テーマ設定
- プロ仕様のコンポーネントとテンプレート
- shadcn コンポーネントとブロックを完全にカバー
- 高度なカスタマイズオプション

**含まれるもの:**
- 100以上のコンポーネントバリアント
- 既製のページテンプレート
- インタラクティブプロトタイプ
- デザイントークンシステム
- アニメーションとトランジション

**価格:** 有料（詳細はウェブサイトで確認）

**特別機能:**
- **tweakcn統合:** Figmaから直接テーマをカスタマイズ
- **コード生成:** デザインからコードへの自動変換
- **ライブプレビュー:** 変更をリアルタイムでプレビュー

## 無料リソース

### 1. shadcn/ui デザインシステム by Pietro Schirano

[Figma Communityで入手](https://www.figma.com/community/file/1203061493325953101)

**特徴:**
- shadcn/ui のデザインコンパニオン
- コードの実装と完全に一致するように丁寧にデザイン
- すべての主要コンポーネントを含む
- 無料で使用可能

**含まれるもの:**
- 基本的なUIコンポーネント
- レイアウトテンプレート
- カラーシステム
- タイポグラフィスケール

**使い方:**
1. Figma Communityからファイルを複製
2. プロジェクトで使用
3. 必要に応じてカスタマイズ

**制限:**
- 有料版ほど包括的ではない
- 更新頻度が低い可能性がある
- サポートは限定的

### 2. Obra shadcn/ui by Obra Studio

[Figma Communityで入手](https://www.figma.com/community/file/1514746685758799870/obra-shadcn-ui)

**特徴:**
- shadcn の哲学に基づいて慎重に作成
- クリーンでモダンなデザイン
- 使いやすいコンポーネント構造
- 無料で使用可能

**含まれるもの:**
- コアUIコンポーネント
- ダークモード対応
- カスタマイズ可能なプロパティ
- サンプルページ

**特徴:**
- ミニマリストデザイン
- 優れた組織構造
- 簡単にカスタマイズ可能

## Figmaファイルの使い方

### 1. ファイルを複製

Figma Communityまたは購入したリソースからファイルを複製します。

### 2. カラーとタイポグラフィをカスタマイズ

プロジェクトのブランドに合わせてカラーとフォントを調整します：

**カラー:**
- CSS変数を更新
- デザイントークンを同期
- ライトモードとダークモードの両方を調整

**タイポグラフィ:**
- フォントファミリーを設定
- サイズスケールを定義
- 行の高さと間隔を調整

### 3. コンポーネントを使用

ライブラリからコンポーネントをドラッグ＆ドロップして画面を構築します。

### 4. デザインからコードへ

デザインが完成したら、shadcn/uiコンポーネントを使用して実装します：

1. Figmaでコンポーネントを確認
2. 対応するshadcn/uiコンポーネントを特定
3. props と設定を実装
4. スタイルを微調整

## デザイントークンの同期

### Figma変数を使用

Figma変数を使用してCSS変数と同期します：

**Figmaで:**
```
Variables:
  - color/background
  - color/foreground
  - color/primary
  - color/primary-foreground
```

**CSSで:**
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.16 0 0);
  --primary: oklch(0.21 0 0);
  --primary-foreground: oklch(0.98 0 0);
}
```

### プラグインを使用

デザイントークンを同期するプラグイン：
- **Tokens Studio for Figma** - デザイントークンの管理
- **Style Dictionary** - トークンをコードに変換
- **Figma Tokens** - トークンの同期と管理

## ベストプラクティス

### 1. コンポーネントライブラリを維持

Figmaでコンポーネントライブラリを作成し、チーム全体で共有します。

### 2. 命名規則を統一

FigmaとコードのコンポーネントとプロパティでSame名前を使用します。

### 3. Auto Layoutを活用

Figmaの Auto Layout を使用して、実際のコードの動作を反映します。

### 4. バリアントを作成

コンポーネントのすべての状態とバリアントを文書化します：
- デフォルト、ホバー、アクティブ、無効
- ライトモードとダークモード
- 異なるサイズ

### 5. ドキュメントを追加

各コンポーネントに使用方法とカスタマイズオプションを文書化します。

## チームでの使用

### デザイナー向け

1. **コンポーネントを学ぶ:** すべてのshadcn/uiコンポーネントを理解
2. **一貫性を保つ:** デザインシステムに従う
3. **開発者とコミュニケーション:** 実装可能性を確認
4. **フィードバックを提供:** デザインシステムの改善を提案

### 開発者向け

1. **Figmaファイルを参照:** デザインの意図を理解
2. **デザインを尊重:** できる限り忠実に実装
3. **制約を伝える:** 技術的な制限を説明
4. **コラボレーション:** デザイナーとペアで作業

## トラブルシューティング

### コンポーネントが一致しない

**問題:** FigmaとコードのコンポーネントがSame見えない

**解決策:**
- CSS変数を確認
- フォントサイズと行の高さを比較
- 間隔と padding を確認
- カラー値を検証

### 更新の同期

**問題:** Figmaファイルが古い

**解決策:**
- 定期的にコミュニティファイルをチェック
- 有料リソースの更新通知を購読
- 独自のコンポーネントライブラリを維持

## 追加リソース

### 学習リソース

- [Figma Learn](https://www.figma.com/resources/learn-design/)
- [Figma Community](https://www.figma.com/community)
- [Design System Guide](https://www.designsystems.com/)

### プラグイン

- **Tokens Studio** - デザイントークン管理
- **Iconify** - アイコンライブラリ
- **Contrast** - アクセシビリティチェック
- **Content Reel** - ダミーコンテンツ生成

### コミュニティ

- [shadcn Discord](https://discord.gg/shadcn)
- [Figma Community Forum](https://forum.figma.com/)
- [Design Systems Slack](https://design.systems/)

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

Figmaでデザインしたコンポーネントを、shadcn/uiで実装してVercelにデプロイできます。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。

Figmaリソースは、コミュニティのクリエイターによって提供されています。各リソースのライセンスと使用条件を確認してください。