# Flags Explorerの使い始め

## 概要

Flags ExplorerはすべてのVercelプランで利用可能で、開発者がアプリケーションのフィーチャーフラグを任意のフレームワークやフィーチャーフラグプロバイダーで表示およびオーバーライドできるようにします。

## 前提条件

- 開発用にVercel Toolbarをセットアップ
- 最新のVercel CLIをインストール
- ローカルプロジェクトをVercelアカウントにリンク

## クイックスタート手順

### 1. Flags SDKの追加

`flags`パッケージをインストール：

```bash
pnpm i flags
```

### 2. FLAGS_SECRETの追加

- Flags Explorerツールバーを通じてシークレットを生成
- `vercel env pull`でローカルに環境変数をプル

### 3. フラグディスカバリーエンドポイントの作成

Next.jsの場合、`/.well-known/vercel/flags`にルートを作成：

```typescript
import { getProviderData, createFlagsDiscoveryEndpoint } from 'flags/next';
import * as flags from '../../../../flags';

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags));
```

### 4. オーバーライドの処理

- Flags SDKは、Flags Explorerによって設定されたオーバーライドを自動的に処理
- カスタムセットアップの場合、`vercel-flag-overrides` Cookieを手動で読み取る

### 5. オプション：フラグ値の発行

- `<FlagValues />`コンポーネントを使用して実際のフラグ値を表示
- 発行されたフラグでWeb Analyticsイベントに注釈を付けることが可能

## 追加リソース

- [Flags Explorerリファレンス](/docs/feature-flags/flags-explorer/reference)
- [Flags SDK](/docs/feature-flags/feature-flags-pattern)
- [Next.jsフィーチャーフラグの例](/templates/next.js/shirt-shop-feature-flags)
