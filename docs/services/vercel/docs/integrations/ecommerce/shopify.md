# Vercel と Shopify の統合

[Shopify](https://www.shopify.com/) は、オンラインストアフロントを構築・管理するeコマースプラットフォームです。このガイドでは、Next.js と Vercel を使用して、高性能なヘッドレスストアフロントを作成する方法を説明します。

## はじめに

Next.js Commerce のテンプレートを使用して、Shopify ストアを Vercel にデプロイできます：

[Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)

## Shopify の設定

### 1. Shopify アカウントの作成

[Shopify](https://www.shopify.com/)でアカウントを作成し、ストアをセットアップします。

### 2. Shopify Hydrogen テーマのインストール

Shopify 管理画面で：
1. Online Store → Themes
2. Theme Library → Add theme
3. Hydrogen を選択してインストール

### 3. Shopify Headless アプリの設定

1. Shopify 管理画面 → Apps → Develop apps
2. Create an app をクリック
3. アプリ名を入力（例：Vercel Storefront）
4. Configure Admin API scopes を選択：
   - `read_products`
   - `write_products`
   - `read_orders`
   - `read_customers`
   - `read_content`
   - `write_content`

5. Storefront API のスコープを設定
6. Install app をクリック
7. API クレデンシャルをコピー：
   - Admin API access token
   - Storefront API access token
   - Store domain

## Next.js プロジェクトのセットアップ

### 1. Next.js Commerce のクローン

```bash
git clone https://github.com/vercel/commerce.git
cd commerce
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成：

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token
SITE_NAME=Your Store Name
TWITTER_CREATOR=@yourtwitterhandle
TWITTER_SITE=https://yourstore.com
```

### 4. ローカルで実行

```bash
pnpm dev
```

## Shopify Storefront API の使用

### GraphQL クライアントの設定

```typescript
// lib/shopify/client.ts
const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache'
}: {
  query: string;
  variables?: any;
  cache?: RequestCache;
}): Promise<T> {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    cache,
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
```

### 製品の取得

```typescript
// lib/shopify/queries/products.ts
export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export async function getProducts() {
  const data = await shopifyFetch({
    query: getProductsQuery,
    variables: { first: 100 },
  });

  return data.products.edges.map((edge: any) => edge.node);
}
```

### 製品詳細の取得

```typescript
export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      options {
        id
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export async function getProduct(handle: string) {
  const data = await shopifyFetch({
    query: getProductQuery,
    variables: { handle },
  });

  return data.product;
}
```

## カート機能の実装

### カートの作成

```typescript
// lib/shopify/mutations/cart.ts
const createCartMutation = `
  mutation createCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function createCart(lines: any[]) {
  const data = await shopifyFetch({
    query: createCartMutation,
    variables: {
      input: { lines },
    },
    cache: 'no-store',
  });

  return data.cartCreate.cart;
}
```

### カートへの追加

```typescript
const addToCartMutation = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function addToCart(cartId: string, lines: any[]) {
  const data = await shopifyFetch({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  return data.cartLinesAdd.cart;
}
```

### カートの更新

```typescript
const updateCartMutation = `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
            }
          }
        }
      }
    }
  }
`;

export async function updateCart(cartId: string, lines: any[]) {
  const data = await shopifyFetch({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  return data.cartLinesUpdate.cart;
}
```

## コレクションの取得

```typescript
// lib/shopify/queries/collections.ts
export const getCollectionsQuery = `
  query getCollections {
    collections(first: 100) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export async function getCollections() {
  const data = await shopifyFetch({
    query: getCollectionsQuery,
  });

  return data.collections.edges.map((edge: any) => edge.node);
}
```

## ページの実装

### 製品一覧ページ

```typescript
// app/products/page.tsx
import { getProducts } from '@/lib/shopify/queries/products';
import { ProductGrid } from '@/components/product-grid';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">すべての製品</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

### 製品詳細ページ

```typescript
// app/products/[handle]/page.tsx
import { getProduct, getProducts } from '@/lib/shopify/queries/products';
import { ProductDetails } from '@/components/product-details';

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProduct(params.handle);

  if (!product) {
    return <div>製品が見つかりません</div>;
  }

  return <ProductDetails product={product} />;
}
```

## Webhook の設定

### Deploy Hook の作成

1. Vercel ダッシュボードでプロジェクトを開く
2. Settings → Git → Deploy Hooks
3. Create Hook をクリック
4. URL をコピー

### Shopify で Webhook を設定

1. Shopify 管理画面 → Settings → Notifications → Webhooks
2. Create webhook をクリック
3. Event: Product creation, Product update
4. URL: Vercel Deploy Hook URL
5. Format: JSON

または、Shopify CLI を使用：

```bash
shopify webhook create \
  --topic products/create \
  --address YOUR_DEPLOY_HOOK_URL
```

## 環境変数

Vercel プロジェクトで設定：

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token
SITE_NAME=Your Store
```

## デプロイ

### Vercel へのデプロイ

```bash
vercel --prod
```

または Vercel ダッシュボードから GitHub リポジトリをインポート

## ベストプラクティス

### パフォーマンス

- **ISR の使用**: 製品ページを静的生成して定期的に再検証
- **画像最適化**: Next.js Image コンポーネントを使用
- **GraphQL フラグメント**: クエリを整理し再利用

### SEO

- **メタタグ**: 適切な製品メタデータ
- **構造化データ**: Product Schema マークアップ
- **サイトマップ**: 動的サイトマップ生成

## トラブルシューティング

### API エラー

1. Storefront API トークンが正しいか確認
2. API バージョンが最新か確認
3. レート制限を確認

### 製品が表示されない

1. 製品がオンラインストアで公開されているか確認
2. Sales channels に追加されているか確認
3. GraphQL クエリが正しいか確認

## 関連リソース

- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)
- [Next.js Commerce](https://github.com/vercel/commerce)
- [Vercel Shopify 統合](https://vercel.com/integrations/shopify)
