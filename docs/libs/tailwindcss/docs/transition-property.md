# Transition Property

どのCSSプロパティをトランジションするかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | プロパティ |
|-------|---------|
| `transition` | 複数のデフォルトプロパティをトランジション |
| `transition-all` | すべてのプロパティをトランジション |
| `transition-colors` | 色関連のプロパティをトランジション |
| `transition-opacity` | 不透明度をトランジション |
| `transition-shadow` | ボックスシャドウをトランジション |
| `transition-transform` | 変形関連のプロパティをトランジション |
| `transition-none` | トランジションを無効化 |
| `transition-[<value>]` | カスタムトランジションプロパティ |

## 基本的な使い方

### 基本的なトランジション

`transition`ユーティリティと`duration`、`ease`、変換ユーティリティを組み合わせて、シンプルなトランジションを作成します。

```html
<button class="bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
  変更を保存
</button>
```

### 色のトランジション

`transition-colors`を使用して、色関連のプロパティのみをトランジションします。

```html
<button class="bg-blue-500 text-white transition-colors duration-300 hover:bg-blue-700">
  ホバーしてください
</button>
```

### 不透明度のトランジション

`transition-opacity`を使用して、不透明度のみをトランジションします。

```html
<div class="opacity-100 transition-opacity duration-300 hover:opacity-50">
  ホバーしてください
</div>
```

### トランジションを無効化

`transition-none`を使用してトランジションを無効にします。

```html
<button class="transition hover:scale-110 motion-reduce:transition-none motion-reduce:hover:transform-none">
  ボタン
</button>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<button class="transition-[height]">
  <!-- ... -->
</button>
```

## レスポンシブデザイン

特定のブレークポイントでのみトランジションプロパティを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="transition-none md:transition-all">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Transition Duration](/docs/transition-duration)
- [Transition Timing Function](/docs/transition-timing-function)
- [Transition Delay](/docs/transition-delay)
