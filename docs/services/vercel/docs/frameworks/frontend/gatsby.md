# Gatsby on Vercel

## はじめに

Gatsbは、さまざまなコンテンツ、API、サービスを統合できるオープンソースの静的サイトジェネレーターです。Vercelは、Gatsbの多くの機能をサポートしています。

## Vercelではじめる

Gatsbプロジェクトをデプロイする方法:

1. 既存のプロジェクトがある場合:
   - [Vercel CLI](/docs/cli)をインストール
   - プロジェクトのルートディレクトリで`vercel`コマンドを実行

2. テンプレートをデプロイ:
   - [Gatsbテンプレートをデプロイ](/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fgatsby&template=gatsby)
   - [ライブ例を確認](https://gatsby.vercel.app/)

## Gatsbバージョン別の注意点

- Gatsby v4+: Vercelが自動的にプラグインを検出・インストール
- Gatsby v5: Node.js 20以上が必要

## サポートされている機能

### サーバーサイドレンダリング (SSR)

`getServerData`関数を使用して、ページを動的にサーバーでレンダリングできます。

例:

```typescript
export async function getServerData(
  props: GetServerDataProps,
): GetServerDataReturn<ServerDataProps> {
  try {
    const res = await fetch(`https://example-data-source.com/api/some-data`);
    return {
      props: await res.json(),
    };
  } catch (error) {
    return {
      status: 500,
      props: {},
    };
  }
}
```
