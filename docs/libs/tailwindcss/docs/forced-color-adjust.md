# Forced Color Adjust

強制カラーモードへのオプトインおよびオプトアウトを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `forced-color-adjust-auto` | `forced-color-adjust: auto;` |
| `forced-color-adjust-none` | `forced-color-adjust: none;` |

## 基本的な使い方

### 強制カラーをオプトアウト

`forced-color-adjust-none`を使用して、強制カラーモードから要素をオプトアウトします。

```html
<form>
  <div class="forced-color-adjust-none flex gap-4">
    <label>
      <input class="sr-only" type="radio" name="color-choice" value="White" />
      <span class="size-6 rounded-full border border-black/10 bg-white"></span>
    </label>
    <label>
      <input class="sr-only" type="radio" name="color-choice" value="Gray" />
      <span class="size-6 rounded-full border border-black/10 bg-gray-300"></span>
    </label>
    <label>
      <input class="sr-only" type="radio" name="color-choice" value="Black" />
      <span class="size-6 rounded-full border border-black/10 bg-black"></span>
    </label>
  </div>
</form>
```

### 強制カラーを復元

`forced-color-adjust-auto`を使用して、強制カラーモードを復元します。

```html
<form>
  <fieldset class="forced-color-adjust-none lg:forced-color-adjust-auto">
    <!-- カラーセレクターまたはラジオボタンのコンテンツ -->
  </fieldset>
</form>
```

## レスポンシブデザイン

特定のブレークポイントでのみ強制カラー調整を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="forced-color-adjust-none md:forced-color-adjust-auto">
  <!-- ... -->
</div>
```

## 使用例

### カスタムカラーピッカー

ハイコントラストモードでもカスタムカラーを維持するカラーピッカー。

```html
<div class="forced-color-adjust-none flex gap-2">
  <button class="size-8 rounded-full bg-red-500 border-2 border-transparent focus:border-black"></button>
  <button class="size-8 rounded-full bg-blue-500 border-2 border-transparent focus:border-black"></button>
  <button class="size-8 rounded-full bg-green-500 border-2 border-transparent focus:border-black"></button>
  <button class="size-8 rounded-full bg-yellow-500 border-2 border-transparent focus:border-black"></button>
</div>
```

### ブランドカラーの保持

強制カラーモードでもブランドカラーを保持するロゴ。

```html
<div class="forced-color-adjust-none">
  <svg class="w-32 h-32" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" class="fill-blue-600" />
    <path d="M100 40 L140 160 L60 160 Z" class="fill-white" />
  </svg>
</div>
```

### レスポンシブなカラーコントロール

モバイルではカスタムカラーを保持し、デスクトップでは強制カラーを適用。

```html
<div class="forced-color-adjust-none lg:forced-color-adjust-auto">
  <div class="flex gap-3">
    <span class="size-10 rounded bg-pink-500"></span>
    <span class="size-10 rounded bg-purple-500"></span>
    <span class="size-10 rounded bg-indigo-500"></span>
  </div>
</div>
```

## 強制カラーモードとは

強制カラーモードは、Windowsのハイコントラストモードなど、アクセシビリティ設定の一部です。このモードでは、ブラウザがページのカラーを制限されたパレットで上書きします。

## アクセシビリティの考慮事項

`forced-color-adjust-none`を使用する場合は、以下を確認してください：

1. **十分なコントラスト** - テキストと背景の間に十分なコントラストがあることを確認
2. **視認性** - すべての重要な要素が見やすいことを確認
3. **フォーカスインジケーター** - フォーカス状態が明確に表示されることを確認

## ベストプラクティス

- 装飾的な要素やブランド要素にのみ`forced-color-adjust-none`を使用
- 重要なUI要素（ボタン、リンク、フォームコントロール）には通常、強制カラーを許可
- `forced-colors:`メディアクエリを使用して、強制カラーモード時の代替スタイルを提供

```html
<button class="bg-blue-500 forced-color-adjust-none forced-colors:border-2 forced-colors:border-current">
  クリック
</button>
```

## 関連機能

強制カラーモードでの特定のスタイリングには、`forced-colors:`バリアントを使用できます。

```html
<div class="forced-color-adjust-none bg-blue-500 forced-colors:bg-transparent forced-colors:outline">
  <!-- ... -->
</div>
```
