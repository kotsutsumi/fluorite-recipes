# カスタムイベントの追跡

## 概要

カスタムイベントはEnterpriseおよびProプランで利用可能で、ボタンクリック、フォーム送信、購入などのユーザーインタラクションを追跡できます。

## 要件

- `@vercel/analytics`バージョン1.1.0以降がインストールされている
- ProまたはEnterpriseプラン

## クライアントサイドイベント追跡

### 基本的な追跡

```typescript
import { track } from '@vercel/analytics';

track('Signup');
```

### カスタムデータを含む追跡

```typescript
track('Signup', { location: 'footer' });
track('Purchase', { productName: 'Shoes', price: 49.99 });
```

## サーバーサイドイベント追跡

### 例

```typescript
'use server';
import { track } from '@vercel/analytics/server';

export async function purchase() {
  await track('Item purchased', {
    quantity: 1,
  });
}
```

## 制限事項

### データプロパティの制限

プランに基づいてカスタムデータプロパティが制限されています：

- **Pro**: 2プロパティ
- **Enterprise**: 8プロパティ

### 許可される値

- ネストされたオブジェクトなし
- 許可される値: 文字列、数値、ブール値、null
- イベント名、キー、値の最大255文字

### プロパティの例

```typescript
// ✅ 許可
track('Purchase', {
  productId: '12345',
  price: 99.99,
  inStock: true,
});

// ❌ 許可されない
track('Purchase', {
  product: {  // ネストされたオブジェクト
    id: '12345',
    details: { price: 99.99 }
  }
});
```

## ダッシュボードでのイベント表示

1. プロジェクトダッシュボードに移動
2. Analyticsタブをクリック
3. Eventsパネルまでスクロール
4. イベント名を選択して詳細を表示

## カスタムイベントの例

### ボタンクリックの追跡

```typescript
import { track } from '@vercel/analytics';

function handleClick() {
  track('Button Clicked', {
    buttonName: 'Subscribe',
    page: '/pricing',
  });
}

<button onClick={handleClick}>Subscribe</button>
```

### フォーム送信の追跡

```typescript
import { track } from '@vercel/analytics';

function handleSubmit(e: FormEvent) {
  e.preventDefault();

  track('Form Submitted', {
    formType: 'Contact',
    page: '/contact',
  });

  // フォーム送信ロジック
}
```

### 購入の追跡

```typescript
import { track } from '@vercel/analytics';

async function completePurchase(items: CartItem[]) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  track('Purchase Completed', {
    itemCount: items.length,
    totalAmount: total,
  });

  // 購入処理
}
```

### 機能の使用状況の追跡

```typescript
import { track } from '@vercel/analytics';

function useFeature(featureName: string) {
  track('Feature Used', {
    feature: featureName,
    timestamp: Date.now(),
  });
}
```

## ベストプラクティス

### イベントの命名

- 説明的な名前を使用
- 一貫した命名規則に従う
- アクションを明確にする

### データプロパティ

- 最も重要なプロパティに焦点を当てる
- プロパティ制限内に収める
- 意味のある値を使用

### パフォーマンス

- 過度に追跡しない
- 重要なイベントに焦点を当てる
- サーバーサイド追跡を適切に使用

## トラブルシューティング

### イベントが表示されない

- Analyticsが有効になっていることを確認
- ProまたはEnterpriseプランであることを確認
- `@vercel/analytics`が最新であることを確認

### プロパティ制限エラー

- プロパティ数を確認
- プラン制限内に収める
- 最も重要なプロパティを優先

## 次のステップ

- [Web Analyticsの使用](/docs/analytics/using-web-analytics)
- [機密データの編集](/docs/analytics/redacting-sensitive-data)
- [パッケージリファレンス](/docs/analytics/package)

## 関連リソース

- [Web Analytics概要](/docs/analytics)
- [フィルタリング](/docs/analytics/filtering)
- [料金と制限](/docs/analytics/limits-and-pricing)
