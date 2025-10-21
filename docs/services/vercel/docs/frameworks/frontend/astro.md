# Vercel での Astro

## はじめに

Astro は、JavaScript をできるだけ少なく使用して、パフォーマンスの高い静的 Web サイトを構築できる全体的な Web フレームワークです。Vercel に Astro プロジェクトをデプロイする方法について、以下の詳細なガイドを提供します。

## Vercel での Astro の使用を始める

Astro プロジェクトを Vercel にデプロイするには、以下の方法があります：

1. 既存の Astro プロジェクトがある場合:
   - [Vercel CLI](/docs/cli) をインストール
   - プロジェクトのルートディレクトリから `vercel` コマンドを実行

2. テンプレートを使用:
   - Vercel のテンプレートマーケットプレイスから Astro テンプレートを選択
   - 提供されているデプロイボタンを使用

## Vercel の機能を Astro で使用する

Astro プロジェクトで Vercel の機能を有効にするには：

1. Vercel アダプターをインストール:
   ```bash
   pnpm astro add vercel
   ```

2. `astro.config.ts` で設定を構成:
   ```typescript
   import { defineConfig } from 'astro/config';
   import vercel from '@astrojs/vercel/serverless';

   export default defineConfig({
     output: 'server',
     adapter: vercel({
       webAnalytics: {
         enabled: true
       },
       maxDuration: 8
     })
   });
   ```

## 主な機能

### サーバーサイドレンダリング (SSR)
- オンデマンドレンダリングを有効化
- ゼロからスケーリング
- 動的コンテンツの提供
