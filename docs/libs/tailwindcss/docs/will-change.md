# Will Change

変更が予想される要素の今後のアニメーションを最適化するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `will-change-auto` | `will-change: auto;` |
| `will-change-scroll` | `will-change: scroll-position;` |
| `will-change-contents` | `will-change: contents;` |
| `will-change-transform` | `will-change: transform;` |
| `will-change-<custom-property>` | `will-change: var(<custom-property>);` |
| `will-change-[<value>]` | `will-change: <value>;` |

## 基本的な使い方

### will-changeで最適化

`will-change-*`ユーティリティを使用して、ブラウザに要素が変更されることを事前に通知します。

```html
<div class="overflow-auto will-change-scroll">
  <!-- スクロール可能なコンテンツ -->
</div>
```

### 変形の最適化

`will-change-transform`を使用して、変形アニメーションを最適化します。

```html
<div class="will-change-transform hover:scale-110 transition-transform">
  <!-- ホバー時にスケールする要素 -->
</div>
```

### コンテンツの最適化

`will-change-contents`を使用して、コンテンツの変更を最適化します。

```html
<div class="will-change-contents">
  <!-- 頻繁に変更されるコンテンツ -->
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="will-change-[top,left]">
  <!-- ... -->
</div>
```

CSS変数を使用することもできます。

```html
<div class="will-change-(--my-will-change)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみwill-changeを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="will-change-auto md:will-change-transform">
  <!-- ... -->
</div>
```

## 重要な推奨事項

`will-change`プロパティは、特定のパフォーマンス問題に対処するための「最後の手段」として意図されています。

### 使用時のベストプラクティス

1. **要素が変更される直前に適用する** - 継続的に適用しないでください
2. **変更後すぐに削除する** - 長時間適用したままにしないでください
3. **控えめに使用する** - 既知のパフォーマンス問題にのみ使用してください
4. **過度の使用を避ける** - 過度に使用すると、実際にページのパフォーマンスが低下する可能性があります

## 使用例

### アニメーション前の最適化

JavaScriptでアニメーション前にwill-changeを追加し、後で削除します。

```javascript
const element = document.getElementById('animated-element');

// アニメーション前
element.classList.add('will-change-transform');

// アニメーションを実行
element.style.transform = 'translateX(100px)';

// アニメーション後（transitionend イベントで）
element.addEventListener('transitionend', () => {
  element.classList.remove('will-change-transform');
});
```

### ホバー時の最適化

```html
<div class="group">
  <div class="group-hover:will-change-transform transition-transform group-hover:scale-110">
    ホバーしてください
  </div>
</div>
```

## 注意事項

- `will-change`は控えめに使用してください
- パフォーマンス問題が確認された場合にのみ使用してください
- 変更後は必ず削除してください
- 過度に使用すると、メモリ使用量が増加し、パフォーマンスが低下する可能性があります
