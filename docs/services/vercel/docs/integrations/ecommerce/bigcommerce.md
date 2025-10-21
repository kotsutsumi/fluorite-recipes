# Vercel と BigCommerce の統合

[BigCommerce](https://www.bigcommerce.com/) は、オンラインストアフロントを構築および管理するeコマースプラットフォームです。このガイドでは、Next.js と Vercel を使用して、高性能なヘッドレスストアフロントをデプロイする方法を説明します。

## 概要

このガイドでは、BigCommerce の [Catalyst](/templates/next.js/catalyst-by-bigcommerce) を使用して、BigCommerce ストアを Vercel デプロイメントに接続します。Catalyst は BigCommerce と Vercel のコラボレーションによって開発されました。

Catalyst を使用していない場合でも、このガイドをカスタムヘッドレス BigCommerce ストアフロントの参考にできます。

## はじめに

以下のテンプレートを Vercel にデプロイするか、次の手順に従ってフォークし、ローカルマシンにクローンしてデプロイできます。

[Catalyst by BigCommerce](/templates/next.js/catalyst-by-bigcommerce)

## BigCommerce の設定

### 1. BigCommerce アカウントとストアフロントの設定

既存の BigCommerce アカウントとストアフロントを使用するか、以下のオプションから始めることができます：
- [無料トライアルを開始](https://www.bigcommerce.com/start-your-trial/)
- [開発者サンドボックスを作成](https://start.bigcommerce.com/developer-sandbox/)

### 2. Catalyst リポジトリのフォークとクローン

1. GitHub で [Catalyst リポジトリをフォーク](https://github.com/bigcommerce/catalyst/fork)します。好きな名前を付けられます。
2. フォークしたリポジトリをローカルマシンにクローン：

```bash
git clone https://github.com/YOUR_USERNAME/catalyst.git
cd catalyst
```

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. BigCommerce API クレデンシャルの作成

1. BigCommerce コントロールパネルにログイン
2. Settings → API → Create API Account
3. 以下の OAuth スコープを選択：
   - Products: read-only
   - Carts: modify
   - Customers: modify
   - Checkout Content: modify
   - Information & Settings: read-only

4. API クレデンシャルをコピー：
   - Client ID
   - Client Secret
   - Access Token
   - API Path

### 5. 環境変数の設定

`.env.local` ファイルを作成：

```bash
BIGCOMMERCE_STORE_HASH=your_store_hash
BIGCOMMERCE_ACCESS_TOKEN=your_access_token
BIGCOMMERCE_CLIENT_ID=your_client_id
BIGCOMMERCE_CLIENT_SECRET=your_client_secret
BIGCOMMERCE_CHANNEL_ID=1
```

### 6. ローカルで実行

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` を開いてストアフロントを確認します。

## GraphQL API の使用

BigCommerce GraphQL API を使用してデータを取得：

### GraphQL クライアントの設定

```typescript
// lib/bigcommerce/client.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = `https://store-${process.env.BIGCOMMERCE_STORE_HASH}.mybigcommerce.com/graphql`;

export const client = new GraphQLClient(endpoint, {
  headers: {
    'Authorization': `Bearer ${process.env.BIGCOMMERCE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});
```

### 製品の取得

```typescript
// lib/bigcommerce/queries.ts
import { gql } from 'graphql-request';
import { client } from './client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    site {
      products {
        edges {
          node {
            id
            name
            path
            sku
            prices {
              price {
                value
                currencyCode
              }
            }
            defaultImage {
              url(width: 800)
              altText
            }
          }
        }
      }
    }
  }
`;

export async function getProducts() {
  const data = await client.request(GET_PRODUCTS);
  return data.site.products.edges.map(edge => edge.node);
}
```

### 製品詳細の取得

```typescript
export const GET_PRODUCT = gql`
  query GetProduct($path: String!) {
    site {
      route(path: $path) {
        node {
          ... on Product {
            id
            name
            sku
            description
            prices {
              price {
                value
                currencyCode
              }
            }
            images {
              edges {
                node {
                  url(width: 800)
                  altText
                }
              }
            }
            variants {
              edges {
                node {
                  id
                  sku
                  options {
                    edges {
                      node {
                        displayName
                        values {
                          edges {
                            node {
                              label
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProduct(path: string) {
  const data = await client.request(GET_PRODUCT, { path });
  return data.site.route.node;
}
```

## カート機能の実装

### カートの作成

```typescript
// lib/bigcommerce/cart.ts
import { gql } from 'graphql-request';
import { client } from './client';

const CREATE_CART = gql`
  mutation CreateCart($input: CreateCartInput!) {
    cart {
      createCart(input: $input) {
        cart {
          entityId
          lineItems {
            physicalItems {
              id
              name
              quantity
            }
          }
        }
      }
    }
  }
`;

export async function createCart(lineItems: any[]) {
  const data = await client.request(CREATE_CART, {
    input: {
      lineItems: lineItems.map(item => ({
        productEntityId: item.productId,
        quantity: item.quantity,
        variantEntityId: item.variantId,
      })),
    },
  });

  return data.cart.createCart.cart;
}
```

### カートへの追加

```typescript
const ADD_CART_LINE_ITEMS = gql`
  mutation AddCartLineItems($input: AddCartLineItemsInput!) {
    cart {
      addCartLineItems(input: $input) {
        cart {
          entityId
          lineItems {
            physicalItems {
              id
              name
              quantity
              productEntityId
            }
          }
        }
      }
    }
  }
`;

export async function addCartLineItem(cartId: string, lineItem: any) {
  const data = await client.request(ADD_CART_LINE_ITEMS, {
    input: {
      cartEntityId: cartId,
      data: {
        lineItems: [{
          productEntityId: lineItem.productId,
          quantity: lineItem.quantity,
          variantEntityId: lineItem.variantId,
        }],
      },
    },
  });

  return data.cart.addCartLineItems.cart;
}
```

## チェックアウトの実装

```typescript
// lib/bigcommerce/checkout.ts
export async function createCheckout(cartId: string) {
  const response = await fetch(
    `https://api.bigcommerce.com/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/checkouts`,
    {
      method: 'POST',
      headers: {
        'X-Auth-Token': process.env.BIGCOMMERCE_ACCESS_TOKEN!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart_id: cartId,
      }),
    }
  );

  return response.json();
}
```

## Webhook の設定

### Deploy Hook の作成

1. Vercel ダッシュボードでプロジェクトを開く
2. Settings → Git → Deploy Hooks
3. Create Hook をクリック
4. URL をコピー

### BigCommerce で Webhook を設定

1. BigCommerce コントロールパネル → Settings → Webhooks
2. Create a Webhook をクリック
3. 設定：
   - Scope: Products
   - Events: Created, Updated, Deleted
   - Destination: Vercel Deploy Hook URL

## ISR の使用

```typescript
// app/products/[slug]/page.tsx
export const revalidate = 60; // 60秒ごとに再検証

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.path.replace('/products/', ''),
  }));
}

export default async function ProductPage({ params }) {
  const product = await getProduct(`/products/${params.slug}`);

  return <ProductDetails product={product} />;
}
```

## 環境変数

Vercel プロジェクトで以下の環境変数を設定：

```bash
BIGCOMMERCE_STORE_HASH=your_store_hash
BIGCOMMERCE_ACCESS_TOKEN=your_access_token
BIGCOMMERCE_CLIENT_ID=your_client_id
BIGCOMMERCE_CLIENT_SECRET=your_client_secret
BIGCOMMERCE_CHANNEL_ID=1
```

## デプロイ

### Vercel へのデプロイ

1. GitHub リポジトリを Vercel にインポート
2. 環境変数を設定
3. デプロイ

```bash
vercel --prod
```

## ベストプラクティス

### パフォーマンス

- **ISR の使用**: 製品ページを静的生成
- **画像最適化**: Next.js Image コンポーネント
- **GraphQL クエリ最適化**: 必要なフィールドのみ取得

### セキュリティ

- **環境変数**: API トークンを安全に保存
- **HTTPS**: すべての通信で HTTPS を使用
- **CORS**: 適切な CORS 設定

## トラブルシューティング

### API エラー

1. API クレデンシャルが正しいか確認
2. OAuth スコープが適切か確認
3. レート制限を確認

### 製品が表示されない

1. チャンネル ID が正しいか確認
2. 製品がチャンネルに割り当てられているか確認
3. GraphQL クエリが正しいか確認

## 関連リソース

- [BigCommerce API ドキュメント](https://developer.bigcommerce.com/api-docs)
- [BigCommerce GraphQL Playground](https://developer.bigcommerce.com/graphql-storefront/playground)
- [Catalyst ドキュメント](https://github.com/bigcommerce/catalyst)
- [Vercel BigCommerce 統合](https://vercel.com/integrations/bigcommerce)
