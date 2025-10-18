# Overscroll Behavior

## 概要

スクロール領域の境界に到達したときにブラウザがどのように動作するかを制御するユーティリティです。

## 利用可能なクラス

| クラス | スタイル |
|-------|--------|
| `overscroll-auto` | `overscroll-behavior: auto;` |
| `overscroll-contain` | `overscroll-behavior: contain;` |
| `overscroll-none` | `overscroll-behavior: none;` |
| `overscroll-x-auto` | `overscroll-behavior-x: auto;` |
| `overscroll-x-contain` | `overscroll-behavior-x: contain;` |
| `overscroll-x-none` | `overscroll-behavior-x: none;` |
| `overscroll-y-auto` | `overscroll-behavior-y: auto;` |
| `overscroll-y-contain` | `overscroll-behavior-y: contain;` |
| `overscroll-y-none` | `overscroll-behavior-y: none;` |

## 使用例

### 親のオーバースクロールを防止

`overscroll-contain`を使用して、対象領域でのスクロールが親要素でのスクロールをトリガーするのを防ぎつつ、「バウンス」効果を保持します。

### オーバースクロールバウンスを防止

`overscroll-none`を使用して、対象領域でのスクロールが親要素でのスクロールをトリガーするのを防ぎ、「バウンス」効果を停止します。

### デフォルトのオーバースクロール動作

`overscroll-auto`を使用して、プライマリスクロール領域の境界に到達したときに親スクロール領域のスクロールを続行できるようにします。

## レスポンシブデザイン

`md:overscroll-contain`のようなブレークポイントバリアントをプレフィックスとして使用して、特定の画面サイズで適用できます。
