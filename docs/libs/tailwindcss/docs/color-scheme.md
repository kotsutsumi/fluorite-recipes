# Color Scheme

要素のカラースキームを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `scheme-normal` | `color-scheme: normal;` |
| `scheme-dark` | `color-scheme: dark;` |
| `scheme-light` | `color-scheme: light;` |
| `scheme-light-dark` | `color-scheme: light dark;` |
| `scheme-only-dark` | `color-scheme: only dark;` |
| `scheme-only-light` | `color-scheme: only light;` |

## 基本的な使い方

### 基本的な使用例

`scheme-*`ユーティリティを使用して、要素がどのようにレンダリングされるかを制御します。

```html
<form class="scheme-light">
  <!-- ライトカラースキームでレンダリング -->
  <input type="text" />
  <button type="submit">送信</button>
</form>

<form class="scheme-light-dark">
  <!-- ライトとダークの両方に対応 -->
  <input type="text" />
  <button type="submit">送信</button>
</form>
```

### ダークモードでの適用

`dark:`バリアントを使用して、ダークモードでのみカラースキームユーティリティを適用します。

```html
<html class="scheme-light dark:scheme-dark">
  <!-- コンテンツ -->
</html>
```

### only修飾子の使用

`scheme-only-dark`または`scheme-only-light`を使用して、特定のカラースキームのみを強制します。

```html
<div class="scheme-only-dark">
  <!-- 常にダークカラースキームで表示 -->
</div>

<div class="scheme-only-light">
  <!-- 常にライトカラースキームで表示 -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみカラースキームを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<html class="scheme-light md:scheme-dark">
  <!-- ... -->
</html>
```

## 使用例

フォームコントロールやブラウザのUIコンポーネントの外観を制御するために使用されます。

```html
<html class="scheme-light dark:scheme-dark">
  <body>
    <form>
      <input type="date" />
      <input type="time" />
      <select>
        <option>オプション 1</option>
        <option>オプション 2</option>
      </select>
    </form>
  </body>
</html>
```

## 重要な注意事項

`color-scheme`ユーティリティは、ライトモードとダークモードの管理に役立ちますが、特にフォームコントロールやブラウザのネイティブUIコンポーネントのレンダリング方法に影響します。
