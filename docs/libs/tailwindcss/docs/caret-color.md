# Caret Color

テキスト入力カーソルの色を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `caret-inherit` | `caret-color: inherit;` |
| `caret-current` | `caret-color: currentColor;` |
| `caret-transparent` | `caret-color: transparent;` |
| `caret-black` | `caret-color: var(--color-black);` |
| `caret-white` | `caret-color: var(--color-white);` |
| `caret-<color>-<shade>` | 各種カラーパレットのキャレットカラー |
| `caret-(<custom-property>)` | `caret-color: var(<custom-property>);` |
| `caret-[<value>]` | `caret-color: <value>;` |

## 基本的な使い方

### 基本的な使用例

`caret-*`ユーティリティを使用して、入力カーソルの色を変更します。

```html
<textarea class="caret-pink-500" placeholder="ここに入力してください..."></textarea>
<textarea class="caret-blue-500" placeholder="ここに入力してください..."></textarea>
<textarea class="caret-green-500" placeholder="ここに入力してください..."></textarea>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<textarea class="caret-[#50d71e]"></textarea>
```

CSS変数を使用することもできます。

```html
<textarea class="caret-(--my-caret-color)"></textarea>
```

## レスポンシブデザイン

特定のブレークポイントでのみキャレットカラーを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<textarea class="caret-rose-500 md:caret-lime-600"></textarea>
```

## フォーカス状態

`focus:`バリアントを使用して、フォーカス時にキャレットカラーを変更します。

```html
<input type="text" class="caret-blue-500 focus:caret-pink-500" />
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
<textarea class="caret-regal-blue"></textarea>
```

## 関連ユーティリティ

- [Accent Color](/docs/accent-color)
- [Text Color](/docs/text-color)
