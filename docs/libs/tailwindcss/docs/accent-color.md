# Accent Color

チェックボックスやラジオボタンなどのフォームコントロールのアクセントカラーを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `accent-inherit` | `accent-color: inherit;` |
| `accent-current` | `accent-color: currentColor;` |
| `accent-transparent` | `accent-color: transparent;` |
| `accent-black` | `accent-color: var(--color-black);` |
| `accent-white` | `accent-color: var(--color-white);` |
| `accent-<color>-<shade>` | 各種カラーパレットのアクセントカラー |
| `accent-(<custom-property>)` | `accent-color: var(<custom-property>);` |
| `accent-[<value>]` | `accent-color: <value>;` |

## 基本的な使い方

### 基本的なアクセントカラー

`accent-*`ユーティリティを使用して、フォームコントロールのアクセントカラーを変更します。

```html
<input type="checkbox" class="accent-pink-500" checked />
<input type="checkbox" class="accent-blue-500" checked />
<input type="checkbox" class="accent-green-500" checked />
```

### 不透明度の変更

アクセントカラーに不透明度を適用します（現在Firefoxでのみサポート）。

```html
<input type="checkbox" class="accent-purple-500/25" checked />
<input type="checkbox" class="accent-purple-500/50" checked />
<input type="checkbox" class="accent-purple-500/75" checked />
<input type="checkbox" class="accent-purple-500" checked />
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<input type="checkbox" class="accent-[#50d71e]" />
```

CSS変数を使用することもできます。

```html
<input type="checkbox" class="accent-(--my-accent-color)" />
```

## レスポンシブデザイン

特定のブレークポイントでのみアクセントカラーを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<input type="checkbox" class="accent-pink-500 md:accent-blue-500" checked />
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態でアクセントカラーを条件付きで適用します。

```html
<input type="checkbox" class="accent-pink-500 hover:accent-pink-700" />
```

## テーマのカスタマイズ

カスタムカラーをテーマに追加できます。

```css
@theme {
  --color-regal-blue: #243c5a;
}
```

その後、カスタムカラーを使用できます。

```html
<input type="checkbox" class="accent-regal-blue" />
```
