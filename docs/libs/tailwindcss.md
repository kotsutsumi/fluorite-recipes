# Tailwind CSS ドキュメント

このディレクトリには、Tailwind CSSの主要なユーティリティクラスとコンセプトに関する日本語ドキュメントが含まれています。

## 📚 ドキュメント構成

### 🎨 基礎コンセプト

- [テーマ設定](./tailwindcss/docs/theme.md) - Tailwind CSSのテーマシステムの設定とカスタマイズ
- [レスポンシブデザイン](./tailwindcss/docs/responsive-design.md) - ブレークポイントとレスポンシブユーティリティの使用方法
- [ダークモード](./tailwindcss/docs/dark-mode.md) - ダークモードの実装とカスタマイズ
- [ホバー、フォーカス、その他の状態](./tailwindcss/docs/hover-focus-and-other-states.md) - 状態バリアントの使用方法
- [ユーティリティクラスでのスタイリング](./tailwindcss/docs/styling-with-utility-classes.md) - ユーティリティファーストのアプローチ
- [カスタムスタイルの追加](./tailwindcss/docs/adding-custom-styles.md) - カスタムユーティリティとコンポーネントの作成

### 🛠️ セットアップとツール

- [エディタ設定](./tailwindcss/docs/editor-setup.md) - IDEとエディタの設定
- [Viteでの使用](./tailwindcss/docs/installation/using-vite.md) - Viteでの Tailwind CSS のインストール
- [関数とディレクティブ](./tailwindcss/docs/functions-and-directives.md) - `@apply`、`@layer`、`theme()` などの使用方法
- [ソースファイルでのクラス検出](./tailwindcss/docs/detecting-classes-in-source-files.md) - PurgeCSSとクラス検出の設定
- [Preflight](./tailwindcss/docs/preflight.md) - Tailwindのベーススタイルリセット
- [互換性](./tailwindcss/docs/compatibility.md) - ブラウザとツールの互換性
- [アップグレードガイド](./tailwindcss/docs/upgrade-guide.md) - 新バージョンへの移行ガイド

### 📐 レイアウト

**Flexbox**
- [Flex Direction](./tailwindcss/docs/flex-direction.md) - フレックスアイテムの方向制御
- [Flex Wrap](./tailwindcss/docs/flex-wrap.md) - フレックスアイテムの折り返し制御
- [Flex](./tailwindcss/docs/flex.md) - フレックスアイテムの伸縮制御
- [Flex Grow](./tailwindcss/docs/flex-grow.md) - フレックスアイテムの伸長制御
- [Flex Shrink](./tailwindcss/docs/flex-shrink.md) - フレックスアイテムの縮小制御
- [Flex Basis](./tailwindcss/docs/flex-basis.md) - フレックスアイテムの初期サイズ設定
- [Order](./tailwindcss/docs/order.md) - フレックス/グリッドアイテムの順序制御

**Grid**
- [Grid Template Columns](./tailwindcss/docs/grid-template-columns.md) - グリッド列の定義
- [Grid Template Rows](./tailwindcss/docs/grid-template-rows.md) - グリッド行の定義
- [Grid Column](./tailwindcss/docs/grid-column.md) - グリッド列のスパンと配置
- [Grid Row](./tailwindcss/docs/grid-row.md) - グリッド行のスパンと配置
- [Grid Auto Flow](./tailwindcss/docs/grid-auto-flow.md) - グリッドの自動配置制御
- [Grid Auto Columns](./tailwindcss/docs/grid-auto-columns.md) - 暗黙的グリッド列のサイズ
- [Grid Auto Rows](./tailwindcss/docs/grid-auto-rows.md) - 暗黙的グリッド行のサイズ
- [Gap](./tailwindcss/docs/gap.md) - グリッド/フレックスアイテム間の間隔

**配置**
- [Justify Content](./tailwindcss/docs/justify-content.md) - 主軸方向の配置
- [Justify Items](./tailwindcss/docs/justify-items.md) - グリッドアイテムのインライン軸配置
- [Justify Self](./tailwindcss/docs/justify-self.md) - 個別アイテムのインライン軸配置
- [Align Content](./tailwindcss/docs/align-content.md) - 交差軸方向の配置
- [Align Items](./tailwindcss/docs/align-items.md) - 交差軸方向のアイテム配置
- [Align Self](./tailwindcss/docs/align-self.md) - 個別アイテムの交差軸配置
- [Place Content](./tailwindcss/docs/place-content.md) - コンテンツの配置と整列
- [Place Items](./tailwindcss/docs/place-items.md) - アイテムの配置と整列
- [Place Self](./tailwindcss/docs/place-self.md) - 個別アイテムの配置と整列

**基本レイアウト**
- [Display](./tailwindcss/docs/display.md) - 表示タイプの設定
- [Position](./tailwindcss/docs/position.md) - 要素の配置方法
- [Top / Right / Bottom / Left](./tailwindcss/docs/top-right-bottom-left.md) - 位置オフセット
- [Float](./tailwindcss/docs/float.md) - 要素の浮動配置
- [Clear](./tailwindcss/docs/clear.md) - フロートのクリア
- [Isolation](./tailwindcss/docs/isolation.md) - 新しいスタッキングコンテキストの作成
- [Overflow](./tailwindcss/docs/overflow.md) - オーバーフロー動作の制御
- [Overscroll Behavior](./tailwindcss/docs/overscroll-behavior.md) - スクロール境界の動作
- [Visibility](./tailwindcss/docs/visibility.md) - 要素の可視性
- [Z-Index](./tailwindcss/docs/z-index.md) - スタック順序の制御

**サイズ**
- [Width](./tailwindcss/docs/width.md) - 要素の幅設定
- [Min Width](./tailwindcss/docs/min-width.md) - 最小幅の設定
- [Max Width](./tailwindcss/docs/max-width.md) - 最大幅の設定
- [Height](./tailwindcss/docs/height.md) - 要素の高さ設定
- [Min Height](./tailwindcss/docs/min-height.md) - 最小高さの設定
- [Max Height](./tailwindcss/docs/max-height.md) - 最大高さの設定
- [Aspect Ratio](./tailwindcss/docs/aspect-ratio.md) - アスペクト比の設定

**スペーシング**
- [Padding](./tailwindcss/docs/padding.md) - 内側の余白
- [Margin](./tailwindcss/docs/margin.md) - 外側の余白

### ✍️ タイポグラフィ

**フォント**
- [Font Family](./tailwindcss/docs/font-family.md) - フォントファミリーの設定
- [Font Size](./tailwindcss/docs/font-size.md) - フォントサイズの設定
- [Font Smoothing](./tailwindcss/docs/font-smoothing.md) - フォントスムージングの制御
- [Font Style](./tailwindcss/docs/font-style.md) - イタリック体の制御
- [Font Weight](./tailwindcss/docs/font-weight.md) - フォントの太さ
- [Font Stretch](./tailwindcss/docs/font-stretch.md) - フォントの幅
- [Font Variant Numeric](./tailwindcss/docs/font-variant-numeric.md) - 数字のバリアント

**テキスト**
- [Letter Spacing](./tailwindcss/docs/letter-spacing.md) - 字間の設定
- [Line Height](./tailwindcss/docs/line-height.md) - 行の高さ
- [Line Clamp](./tailwindcss/docs/line-clamp.md) - 行数制限
- [Text Align](./tailwindcss/docs/text-align.md) - テキストの配置
- [Text Color](./tailwindcss/docs/color.md) - テキストの色
- [Text Decoration Line](./tailwindcss/docs/text-decoration-line.md) - テキスト装飾のライン
- [Text Decoration Color](./tailwindcss/docs/text-decoration-color.md) - テキスト装飾の色
- [Text Decoration Style](./tailwindcss/docs/text-decoration-style.md) - テキスト装飾のスタイル
- [Text Decoration Thickness](./tailwindcss/docs/text-decoration-thickness.md) - テキスト装飾の太さ
- [Text Underline Offset](./tailwindcss/docs/text-underline-offset.md) - 下線のオフセット
- [Text Transform](./tailwindcss/docs/text-transform.md) - 大文字/小文字の変換
- [Text Overflow](./tailwindcss/docs/text-overflow.md) - テキストオーバーフロー
- [Text Wrap](./tailwindcss/docs/text-wrap.md) - テキストの折り返し
- [Text Indent](./tailwindcss/docs/text-indent.md) - テキストのインデント
- [Vertical Align](./tailwindcss/docs/vertical-align.md) - 垂直方向の配置
- [White Space](./tailwindcss/docs/white-space.md) - 空白の処理
- [Word Break](./tailwindcss/docs/word-break.md) - 単語の分割
- [Overflow Wrap](./tailwindcss/docs/overflow-wrap.md) - 単語内改行
- [Hyphens](./tailwindcss/docs/hyphens.md) - ハイフネーション
- [Content](./tailwindcss/docs/content.md) - 疑似要素のコンテンツ

**リスト**
- [List Style Type](./tailwindcss/docs/list-style-type.md) - リストマーカーのタイプ
- [List Style Position](./tailwindcss/docs/list-style-position.md) - リストマーカーの位置
- [List Style Image](./tailwindcss/docs/list-style-image.md) - リストマーカーの画像

### 🎨 背景とボーダー

**カラー**
- [Colors](./tailwindcss/docs/colors.md) - カラーパレットの概要

**エフェクト**
- [Box Shadow](./tailwindcss/docs/box-shadow.md) - ボックスシャドウ
- [Text Shadow](./tailwindcss/docs/text-shadow.md) - テキストシャドウ
- [Opacity](./tailwindcss/docs/opacity.md) - 不透明度
- [Mix Blend Mode](./tailwindcss/docs/mix-blend-mode.md) - ブレンドモード
- [Background Blend Mode](./tailwindcss/docs/background-blend-mode.md) - 背景のブレンドモード

### 🎭 フィルターとマスク

**フィルター**
- [Filter](./tailwindcss/docs/filter.md) - フィルター効果の有効化
- [Blur](./tailwindcss/docs/blur.md) - ぼかし効果
- [Brightness](./tailwindcss/docs/brightness.md) - 明るさ調整
- [Contrast](./tailwindcss/docs/contrast.md) - コントラスト調整
- [Drop Shadow](./tailwindcss/docs/drop-shadow.md) - ドロップシャドウ
- [Grayscale](./tailwindcss/docs/grayscale.md) - グレースケール
- [Hue Rotate](./tailwindcss/docs/hue-rotate.md) - 色相回転
- [Invert](./tailwindcss/docs/invert.md) - 色の反転
- [Saturate](./tailwindcss/docs/saturate.md) - 彩度調整
- [Sepia](./tailwindcss/docs/sepia.md) - セピア調

**バックドロップフィルター**
- [Backdrop Blur](./tailwindcss/docs/backdrop-blur.md) - 背景のぼかし
- [Backdrop Brightness](./tailwindcss/docs/backdrop-brightness.md) - 背景の明るさ
- [Backdrop Contrast](./tailwindcss/docs/backdrop-contrast.md) - 背景のコントラスト
- [Backdrop Grayscale](./tailwindcss/docs/backdrop-grayscale.md) - 背景のグレースケール
- [Backdrop Hue Rotate](./tailwindcss/docs/backdrop-hue-rotate.md) - 背景の色相回転
- [Backdrop Invert](./tailwindcss/docs/backdrop-invert.md) - 背景の色反転
- [Backdrop Opacity](./tailwindcss/docs/backdrop-opacity.md) - 背景の不透明度
- [Backdrop Saturate](./tailwindcss/docs/backdrop-saturate.md) - 背景の彩度
- [Backdrop Sepia](./tailwindcss/docs/backdrop-sepia.md) - 背景のセピア調

**マスク**
- [Mask Clip](./tailwindcss/docs/mask-clip.md) - マスククリップ領域
- [Mask Composite](./tailwindcss/docs/mask-composite.md) - マスク合成操作
- [Mask Image](./tailwindcss/docs/mask-image.md) - マスク画像
- [Mask Mode](./tailwindcss/docs/mask-mode.md) - マスクモード
- [Mask Origin](./tailwindcss/docs/mask-origin.md) - マスク原点
- [Mask Position](./tailwindcss/docs/mask-position.md) - マスク位置
- [Mask Repeat](./tailwindcss/docs/mask-repeat.md) - マスク繰り返し
- [Mask Size](./tailwindcss/docs/mask-size.md) - マスクサイズ
- [Mask Type](./tailwindcss/docs/mask-type.md) - マスクタイプ

### 🔄 トランジションとアニメーション

**トランジション**
- [Transition Property](./tailwindcss/docs/transition-property.md) - トランジションプロパティ
- [Transition Behavior](./tailwindcss/docs/transition-behavior.md) - トランジション動作
- [Transition Duration](./tailwindcss/docs/transition-duration.md) - トランジション継続時間
- [Transition Timing Function](./tailwindcss/docs/transition-timing-function.md) - イージング関数
- [Transition Delay](./tailwindcss/docs/transition-delay.md) - トランジション遅延
- [Animation](./tailwindcss/docs/animation.md) - CSSアニメーション

### 🔀 トランスフォーム

- [Transform](./tailwindcss/docs/transform.md) - 変形の有効化
- [Transform Origin](./tailwindcss/docs/transform-origin.md) - 変形原点
- [Transform Style](./tailwindcss/docs/transform-style.md) - 3D変形スタイル
- [Rotate](./tailwindcss/docs/rotate.md) - 回転
- [Scale](./tailwindcss/docs/scale.md) - スケール
- [Skew](./tailwindcss/docs/skew.md) - 傾斜
- [Translate](./tailwindcss/docs/translate.md) - 移動
- [Perspective](./tailwindcss/docs/perspective.md) - パースペクティブ
- [Perspective Origin](./tailwindcss/docs/perspective-origin.md) - パースペクティブ原点
- [Backface Visibility](./tailwindcss/docs/backface-visibility.md) - 背面の可視性

### 🖱️ インタラクティビティ

**フォームとUI**
- [Accent Color](./tailwindcss/docs/accent-color.md) - アクセントカラー
- [Appearance](./tailwindcss/docs/appearance.md) - ネイティブスタイリング
- [Caret Color](./tailwindcss/docs/caret-color.md) - キャレットカラー
- [Color Scheme](./tailwindcss/docs/color-scheme.md) - カラースキーム
- [Cursor](./tailwindcss/docs/cursor.md) - カーソルスタイル
- [Field Sizing](./tailwindcss/docs/field-sizing.md) - フィールドサイズ調整
- [Pointer Events](./tailwindcss/docs/pointer-events.md) - ポインターイベント
- [Resize](./tailwindcss/docs/resize.md) - リサイズ制御
- [User Select](./tailwindcss/docs/user-select.md) - テキスト選択

**スクロール**
- [Scroll Behavior](./tailwindcss/docs/scroll-behavior.md) - スクロール動作
- [Scroll Margin](./tailwindcss/docs/scroll-margin.md) - スクロールマージン
- [Scroll Padding](./tailwindcss/docs/scroll-padding.md) - スクロールパディング
- [Scroll Snap Align](./tailwindcss/docs/scroll-snap-align.md) - スナップ配置
- [Scroll Snap Stop](./tailwindcss/docs/scroll-snap-stop.md) - スナップ停止
- [Scroll Snap Type](./tailwindcss/docs/scroll-snap-type.md) - スナップタイプ
- [Touch Action](./tailwindcss/docs/touch-action.md) - タッチアクション

**パフォーマンス**
- [Will Change](./tailwindcss/docs/will-change.md) - 変更予定の最適化

### 🖼️ SVG

- [Fill](./tailwindcss/docs/fill.md) - SVG塗りつぶし
- [Stroke](./tailwindcss/docs/stroke.md) - SVGストローク
- [Stroke Width](./tailwindcss/docs/stroke-width.md) - ストローク幅

### 📋 テーブル

- [Border Collapse](./tailwindcss/docs/border-collapse.md) - ボーダーの結合/分離
- [Border Spacing](./tailwindcss/docs/border-spacing.md) - ボーダー間隔
- [Table Layout](./tailwindcss/docs/table-layout.md) - テーブルレイアウト
- [Caption Side](./tailwindcss/docs/caption-side.md) - キャプション位置

### 📄 その他のプロパティ

- [Box Sizing](./tailwindcss/docs/box-sizing.md) - ボックスサイジング
- [Box Decoration Break](./tailwindcss/docs/box-decoration-break.md) - ボックス装飾の分割
- [Break After](./tailwindcss/docs/break-after.md) - 改ページ後
- [Break Before](./tailwindcss/docs/break-before.md) - 改ページ前
- [Break Inside](./tailwindcss/docs/break-inside.md) - 改ページ内
- [Columns](./tailwindcss/docs/columns.md) - マルチカラムレイアウト
- [Object Fit](./tailwindcss/docs/object-fit.md) - オブジェクトフィット
- [Object Position](./tailwindcss/docs/object-position.md) - オブジェクト位置
- [Forced Color Adjust](./tailwindcss/docs/forced-color-adjust.md) - 強制カラー調整

## 📊 統計情報

- **総ドキュメント数**: 169ファイル
- **カテゴリ数**: 15以上
- **言語**: 日本語

## 🔍 使い方

各ドキュメントには以下の情報が含まれています：

1. **クイックリファレンス**: 利用可能なクラスとそのCSSプロパティの一覧表
2. **基本的な使い方**: 実用的なコード例とユースケース
3. **カスタム値の適用**: 任意の値や CSS 変数の使用方法
4. **レスポンシブデザイン**: ブレークポイントバリアントの使用例
5. **関連ユーティリティ**: 関連するドキュメントへのリンク

## 🚀 クイックスタート

1. [インストールガイド](./tailwindcss/docs/installation/using-vite.md)から始める
2. [ユーティリティクラスでのスタイリング](./tailwindcss/docs/styling-with-utility-classes.md)でコンセプトを理解
3. 必要なユーティリティのドキュメントを参照してプロジェクトに適用

## 🔗 リンク

- [Tailwind CSS 公式サイト](https://tailwindcss.com/)
- [GitHub リポジトリ](https://github.com/tailwindlabs/tailwindcss)

## 📝 注意事項

- すべてのドキュメントは Tailwind CSS v4 に基づいています
- コード例は HTML とユーティリティクラスを使用しています
- カスタム値は角括弧 `[]` または CSS 変数 `()` で指定できます
