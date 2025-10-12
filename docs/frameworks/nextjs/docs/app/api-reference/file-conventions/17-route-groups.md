# Route Groups（ルートグループ）

ルートグループは、Next.jsのフォルダ命名規約で、URLパスに影響を与えずにルートをカテゴリやチームごとに整理できます。

## 規約

ルートグループは、フォルダ名を括弧で囲むことで作成されます：`(folderName)`

## 使用例

### ルートを整理する

括弧内のフォルダ名は整理のためのものであり、ルートのURLパスには含まれません。

```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx
│   └── blog/
│       └── page.tsx
├── (shop)/
│   ├── cart/
│   │   └── page.tsx
│   └── products/
│       └── page.tsx
└── page.tsx
```

この構造では、以下のようなURLパスになります：

- `/about` - マーケティンググループ
- `/blog` - マーケティンググループ
- `/cart` - ショップグループ
- `/products` - ショップグループ

`(marketing)` と `(shop)` のフォルダ名はURLには反映されません。

### 複数のルートレイアウトを作成する

ルートグループを使用して、複数のルートレイアウトを作成できます。各グループに異なる `layout.js` ファイルを配置することで、アプリケーション内に複数のルートレイアウトを持つことができます。

```
app/
├── (marketing)/
│   ├── layout.tsx  # マーケティング用レイアウト
│   ├── about/
│   │   └── page.tsx
│   └── blog/
│       └── page.tsx
├── (shop)/
│   ├── layout.tsx  # ショップ用レイアウト
│   ├── cart/
│   │   └── page.tsx
│   └── products/
│       └── page.tsx
└── layout.tsx      # ルートレイアウト
```

**例：マーケティング用レイアウト**

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>{/* マーケティングナビゲーション */}</nav>
      <main>{children}</main>
    </div>
  )
}
```

**例：ショップ用レイアウト**

```tsx
// app/(shop)/layout.tsx
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>{/* ショップナビゲーション */}</nav>
      <main>{children}</main>
    </div>
  )
}
```

### 特定のセグメントにレイアウトを適用する

特定のルートをレイアウトに含めるには、新しいルートグループ（例：`(shop)`）を作成し、同じレイアウトを共有するルート（例：`cart` と `products`）をそのグループに移動します。グループ外のルート（例：`about`、`blog`）はそのレイアウトを共有しません。

```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx
│   └── blog/
│       └── page.tsx
├── (shop)/
│   ├── layout.tsx  # ショップ専用レイアウト
│   ├── cart/
│   │   └── page.tsx
│   └── products/
│       └── page.tsx
└── page.tsx
```

## 注意事項

### 複数のルートレイアウト間のナビゲーション

複数のルートレイアウトを使用している場合、異なるルートレイアウト間を移動すると、**フルページリロード**が発生します（クライアント側のナビゲーションとは異なります）。

例えば、`app/(shop)/layout.js` を使用する `/cart` から、`app/(marketing)/layout.js` を使用する `/blog` に移動すると、フルページリロードが発生します。これは複数のルートレイアウトがある場合にのみ適用されます。

### 同じURLパスの回避

ルートグループを使用する場合、異なるグループ内のルートが同じURLパスに解決されないように注意する必要があります。これはエラーになります。

例えば、以下の構造はエラーになります：

```
app/
├── (marketing)/
│   └── about/
│       └── page.tsx  # /about にマッピング
└── (shop)/
    └── about/
        └── page.tsx  # /about にマッピング（エラー！）
```

両方とも `/about` にマッピングされるため、競合が発生します。

### ホームページの定義

複数のルートレイアウトを使用する場合、ホームページ（`/`）はいずれかのルートグループ内に定義する必要があります。

**正しい例：**

```
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx     # ホームページ
└── (shop)/
    ├── layout.tsx
    └── products/
        └── page.tsx
```

**誤った例：**

```
app/
├── (marketing)/
│   ├── layout.tsx
│   └── about/
│       └── page.tsx
└── (shop)/
    ├── layout.tsx
    └── products/
        └── page.tsx
# page.tsx がないためエラー
```

## 実用例

### チーム別のルート整理

異なるチームが担当するルートをグループ化できます：

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/
│   ├── overview/
│   │   └── page.tsx
│   └── analytics/
│       └── page.tsx
└── (public)/
    ├── about/
    │   └── page.tsx
    └── contact/
        └── page.tsx
```

### 機能別のルート整理

機能やドメインごとにルートをグループ化できます：

```
app/
├── (blog)/
│   ├── posts/
│   │   └── page.tsx
│   └── authors/
│       └── page.tsx
├── (ecommerce)/
│   ├── products/
│   │   └── page.tsx
│   └── orders/
│       └── page.tsx
└── (admin)/
    ├── users/
    │   └── page.tsx
    └── settings/
        └── page.tsx
```

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v13.0.0` | ルートグループが導入 |
